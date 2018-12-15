import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TruckPanService } from '../../services/truck.pan.services'
import { ToastrService } from 'ngx-toastr';
import { Account } from '../../model/account.model';
import { FileUploader } from '../../../../node_modules/ng2-file-upload';
import { FileUploadService } from '../../services/fileupload.service';
import { Refdata } from '../../utils/refdata.service';
import { AppConfig } from '../../app-config';
import { CustomValidator } from '../../utils/custom.validator';

@Component({
  selector: 'app-pan-update-details',
  templateUrl: './pan-update-details.component.html',
  styleUrls: ['./pan-update-details.component.css']
})
export class PanUpdateDetailsComponent implements OnInit {

uploader: FileUploader;
ref_states: Array<string>;
s3url: string;
submitted: boolean;
addaccountclicked: boolean;
  constructor(public _fb: FormBuilder, public accountsInfo: FormBuilder, private modalService: NgbModal,
    private panservice: TruckPanService, private toaster: ToastrService,
    private uploaderService: FileUploadService) { }

    panForm = this._fb.group({
      panNo: [],
      panHolderName: ['', Validators.required],
      mobile:['', CustomValidator.mobileValidator],
      tds: [],
      city: [],
      state: [],
      account: this.initAccountGroup(),
      // accountNumber: ['', [this.customrequired.bind(this)]],
      // confirmAccountNumber: ['', [this.customrequired.bind(this)]],
      // accountHoldername: ['', [this.customrequired.bind(this)]],
      // ifscCode: ['', CustomValidator.ifsccodeValidator],
      // confirmIfscCode: ['', CustomValidator.ifsccodeValidator],
      // bankName: ['', [this.customrequired.bind(this)]],
      adddedAccountName: [],
      declaration: [],
      panCopy: [],
      // passbook: [],
      // branchName: ['', [this.customrequired.bind(this)]],
      Added_bankName: [{ value: [], disabled: true }]
    })
    accounts: Array<Account> = [];

  ngOnInit() {
    this.uploader = this.uploaderService.getFileUploader();
    this.ref_states = Refdata.getStates();
    this.s3url = AppConfig.AWS_S3_BUCKET;
    this.submitted = false;
    this.addaccountclicked = false;
  }

  @ViewChild('content') content
  accountsForm: any;
  addedBankAccounts = new Array();
  @Input() formtitle: string;
  @Input() PANno;
  @Input() PanDataToUpdate;
  selectedValue = "AM";

  addAccountByBankName() {
    this.addaccountclicked = true;
    this.checkAccountValidators();
    if(this.panForm.invalid){
      this.toaster.error("Please correct the errors in account details");
      return;
    }
    if (this.panForm.controls.account.controls.accountNumber.value == null ||
      this.panForm.controls.account.controls.accountHoldername.value == null ||
      this.panForm.controls.account.controls.ifscCode.value == null){

      this.toaster.error("Please provide the required details")
      return;
    }
    if (this.isAccountPresent()){
      this.toaster.error("This account number is already added")
      return;
    }else {
      if(parseInt(this.panForm.controls.account.controls.accountNumber.value) !== this.panForm.controls.account.controls.confirmAccountNumber.value){
        this.toaster.error("Account Number and Confirm Account Number do not match");
        return;
      }else if(this.panForm.controls.account.controls.confirmIfscCode.value !== this.panForm.controls.account.controls.ifscCode.value){
        this.toaster.error("IFSC Code and Confirm IFSC do not match");
        return;
      }

      let account = new Account();
      account.accountNo = this.panForm.controls.account.controls.accountNumber.value;
      account.bankName = this.panForm.controls.account.controls.bankName.value;
      account.ifscCode = this.panForm.controls.account.controls.ifscCode.value;
      account.accountHoldername = this.panForm.controls.account.controls.accountHoldername.value;
      account.branchName = this.panForm.controls.account.controls.branchName.value;
      if(this.panForm.controls.account.controls.passbook.value){
        this.uploaderService.setPanaNo(this.panForm.controls.account.controls.panNo.value);
        this.fileQueue.push({'name':'passbook', 'accountno': account.accountNo})
        account.passbookLink = this.uploaderService.getFileNameForPassbook(this.panForm.controls.account.controls.passbook.value, account.accountNo);
      }
      this.panForm.controls.account.controls.passbook.setValue("");
      this.addedBankAccounts.push(account);
      this.clearAccountSection();
      //this.toastrService.success("Account is added successfully.");
    }
  }

  isAccountPresent() {
    let result = false;
    this.addedBankAccounts.forEach((element) => {
      if (element.accountNo == this.panForm.controls.account.controls.accountNumber.value) {
        result = true;
      }
    });
    return result;
  }

  public openModel() {
    this.modalService.open(this.content);
    this.panForm.controls.panNo.setValue(this.PANno);
    this.panForm.controls.panHolderName.setValue(this.PanDataToUpdate.panHolderName);
    this.panForm.controls.mobile.setValue(this.PanDataToUpdate.mobile);
    this.panForm.controls.city.setValue(this.PanDataToUpdate.city);
    this.panForm.controls.state.setValue(this.PanDataToUpdate.state);
    this.panForm.controls.tds.setValue(this.PanDataToUpdate.tds ? "true" : "false");
    this.panForm.controls.panCopy.setValue("");
    this.panForm.controls.declaration.setValue("");
    this.panForm.controls.account.reset();
    this.uploader.clearQueue();
    this.addedBankAccounts = this.PanDataToUpdate.accounts;
  }

  fileQueue: Array<Object> = []
  onFileChange(filename){
      this.fileQueue.push(filename);
  }

  UpdatePANdetails() {
    // first clear account section so that validation is ignored for these fields
    this.clearAccountSection();
    this.checkAccountValidators();
    this.submitted = true;
    if (this.panForm.invalid) {
      this.toaster.error("Please correct the errors before submitting");
      return
    }

    let panno = this.panForm.controls.panNo.value;
    if(!panno){
      this.toaster.error("Pan number is mandatory to upload files");
      return;
    }

    let _panData = this.panForm.value;
    delete _panData.adddedAccountName;
    delete _panData.vehicleNo;

    _panData.id = this.PanDataToUpdate.id

    _panData.vehicles = this.PanDataToUpdate.vehicles

    _panData.accounts = this.addedBankAccounts;
    _panData.panCopyLink = this.PanDataToUpdate.panCopyLink;
    _panData.declarationLink = this.PanDataToUpdate.declarationLink;

    if(this.panForm.controls.tds.value == 'false'){
      _panData.tds = false
    }
    else{
      _panData.tds = true
    }
    this.uploaderService.setPanaNo(panno);
    if(_panData.declaration){
      _panData.declarationLink = this.uploaderService.getFileNameForDeclaration(_panData.declaration);
    }
    if(_panData.panCopy){
      _panData.panCopyLink = this.uploaderService.getFileNameForPan(_panData.panCopy);
    }

    this.panservice.updatePAN(_panData, this.panForm.controls.panNo.value).subscribe(
      (res) => {
        if(res.success){
          this.toaster.success("PAN is updated successfully")
          setTimeout(() => {
            this.panservice.panupdated(res.data);
            this.modalService.dismissAll();
          }, 2000)
        }else{
            this.toaster.error("PAN was not updated. Somethins went wrong");
        }

      },
      (error) => {
        this.toaster.error("PAN is not updated, Please contact the admin")
      }
    )
    //upload files
    this.uploaderService.uploadfiles(this.fileQueue);

  }

  accountsAvailable(){
    if(this.PanDataToUpdate.accounts && this.PanDataToUpdate.accounts.length){
      this.addedBankAccounts = this.PanDataToUpdate.accounts;
      return true;
    }else{
      return false;
    }
  }

  // updatePANdetails() {
  //   this.addedBankAccounts;
  //   this.PanDataToUpdate

  // }

  showBankDetails() {

    let _selectedAccountNo = this.panForm.controls.adddedAccountName.value;

    this.addedBankAccounts.forEach(element => {

      if (_selectedAccountNo == element.accountNo) {

        this.panForm.controls.Added_bankName.setValue(element.bankName);
      }
    });
  }

  removeAccount(index){
    this.addedBankAccounts.splice(index, 1);
    //this.addedBankAccounts = this.addedBankAccounts.filter((item, idx) => idx !== index);
  }

  deleteAccount() {
    this.getAccountTobeDeleted().then((id) => {
      this.addedBankAccounts.splice(id, 1);
    })
  }

  getAccountTobeDeleted(): any {
    let _accountNotoDelete = this.panForm.controls.adddedAccountName.value;
    return new Promise((resolve, reject) => {
      this.addedBankAccounts.forEach((element, index, array) => {
        if (_accountNotoDelete == element.accountNo) {
          resolve(index)
        }
      })
    })
  }

  clearAccountSection(){
    this.addaccountclicked = false;
      this.panForm.controls.account.reset();
  }

  customrequired(control: AbstractControl){
    if(this.addaccountclicked){
      if(control.value){
        return null;
      }else{
        return {required: true};
      }
    }else{
      return null;
    }
  }

  checkAccountValidators(){
    let _ifscValidators = [this.customrequired.bind(this), CustomValidator.ifsccodeValidator];
    let accountCntrl = this.panForm.controls.account;
    if(this.addaccountclicked){
      Object.keys(this.panForm.controls.account.controls).forEach(key => {
        if(key != 'passbook'){
          if(key == 'ifscCode'){
            accountCntrl.controls[key].setValidators(_ifscValidators);
          }else{
            accountCntrl.controls[key].setValidators(this.customrequired.bind(this));
          }
        }
        accountCntrl.controls[key].updateValueAndValidity();
      })
    }else{
      Object.keys(this.panForm.controls.account.controls).forEach(key => {
        accountCntrl.controls[key].setValidators([]);
        accountCntrl.controls[key].updateValueAndValidity();
      })
    }

  }

  initAccountGroup(){
    const group = this._fb.group({
      accountNumber: [''],
      confirmAccountNumber: [''],
      accountHoldername: [''],
      ifscCode: ['', CustomValidator.ifsccodeValidator],
      confirmIfscCode: ['', CustomValidator.ifsccodeValidator],
      bankName: [''],
      passbook: [],
      branchName: ['']
    })
    return group;
  }
  get f(){ return this.panForm.controls}
  get a(){ return this.panForm.controls.account.controls}
}
