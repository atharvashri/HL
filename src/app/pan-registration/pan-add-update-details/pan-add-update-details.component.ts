import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TruckPanService } from '../../services/truck.pan.services'
import { ToastrService } from 'ngx-toastr'
import {  FileUploader} from 'ng2-file-upload/ng2-file-upload';
import { Account } from '../../model/account.model';
import { FileUploadService } from '../../services/fileupload.service';
import { CustomValidator } from '../../utils/custom.validator';
import { Refdata } from '../../utils/refdata.service';

@Component({
  selector: 'app-add-pan-update-details',
  templateUrl: './pan-add-update-details.component.html',
  styleUrls: ['./pan-add-update-details.component.css']
})
export class PanAddUpdateDetailsComponent implements OnInit {
  uploader: FileUploader;
  response: any;
  panForm: FormGroup;
  submitted: boolean;
  addaccountclicked: boolean;
  ref_states: Array<string>;

  @ViewChild('content') content;

  accountsForm: any;
  addedBankAccounts = new Array();
  fileuplodurl: string = "http://localhost:8080/upload/";
  @Input() formtitle: string;
  @Input() PANno
  @Input() PanDataToUpdate;

  constructor(public _fb: FormBuilder, public accountsInfo: FormBuilder,
    private panservice: TruckPanService, private toastrService: ToastrService,
    private modalService: NgbModal, private uploaderService: FileUploadService){}

  ngOnInit() {
    this.panForm = this._fb.group({
      panNo: ['', [Validators.required, CustomValidator.panValidator]],
      confirmPanNo: ['', Validators.required],
      panCopyLink: [],
      declarationLink: [],
      panHolderName: ['', Validators.required],
      mobile:['', CustomValidator.mobileValidator],
      tds: [],
      city: [],
      state: [],
      account: this.initAccountGroup(),
      // accountNumber: [],
      // confirmAccountNumber: [],
      // accountHoldername: [],
      // ifscCode: ['', CustomValidator.ifsccodeValidator],
      // confirmIfscCode: ['', CustomValidator.ifsccodeValidator],
      // bankname: [],
      // adddedAccountName: [],
      panCopy: ['', Validators.required],
      declaration: [],
      //branchname: [],
      //passbook: []
    })
    this.uploader = this.uploaderService.getFileUploader();
    this.ref_states = Refdata.getStates();
    this.submitted = false;
    this.addaccountclicked = false;
  }

  addAccountByBankName() {
    this.addaccountclicked = true;
    this.checkAccountValidators();
    if(this.panForm.controls.account.invalid){
      this.toastrService.error("Please correct the errors in account details");
      return;
    }
    if (this.panForm.controls.account['controls'].accountNumber.value == null ||
      this.panForm.controls.account['controls'].accountHoldername.value == null ||
      this.panForm.controls.account['controls'].ifscCode.value == null){

      this.toastrService.error("Please provide the required details")
      return;
    }
    if (this.isAccountPresent()){
      this.toastrService.error("This account number is already added")
      return;
    }else {
      if(parseInt(this.panForm.controls.account['controls'].accountNumber.value) !== this.panForm.controls.account['controls'].confirmAccountNumber.value){
        this.toastrService.error("Account Number and Confirm Account Number do not match");
        return;
      }else if(this.panForm.controls.account['controls'].confirmIfscCode.value !== this.panForm.controls.account['controls'].ifscCode.value){
        this.toastrService.error("IFSC Code and Confirm IFSC do not match");
        return;
      }
      let account = new Account();
      account.accountNo = this.panForm.controls.account['controls'].accountNumber.value;
      account.bankName = this.panForm.controls.account['controls'].bankName.value;
      account.ifscCode = this.panForm.controls.account['controls'].ifscCode.value;
      account.accountHoldername = this.panForm.controls.account['controls'].accountHoldername.value;
      account.branchName = this.panForm.controls.account['controls'].branchName.value;
      if(this.panForm.controls.account['controls'].passbook.value){
        this.uploaderService.setPanaNo(this.panForm.controls.account['controls'].panNo.value);
        this.fileQueue.push({'name':'passbook', 'accountno': account.accountNo})
        account.passbookLink = this.uploaderService.getFileNameForPassbook(this.panForm.controls.account['controls'].passbook.value, account.accountNo);
      }
      this.panForm.controls.account['controls'].passbook.setValue("");
      this.addedBankAccounts.push(account);
      this.clearAccountSection();
      //this.toastrService.success("Account is added successfully.");
    }
  }

  isAccountPresent() {
    let result = false;
    this.addedBankAccounts.forEach((element) => {
      if (element.accountNo == this.panForm.controls.account['controls'].accountNumber.value) {
        result = true;
      }
    });
    return result;
  }

  public openModel() {
    this.modalService.open(this.content);
    this.panForm.controls.panNo.setValue(this.PANno);
    this.panForm.controls.tds.setValue("false");
    this.panForm.controls.panCopy.setValue("");
    this.panForm.controls.declaration.setValue("");
    this.panForm.controls.account.reset();
    this.uploader.clearQueue();
    this.submitted = false;
  }

  AddOrUpdatePanDetails() {
    switch (this.formtitle) {
      case "Add PAN Details":
        this.addPANdetails()
        break;
      case "Update PAN Details":
        this.updatePANdetails()
        break;
      default:
        break;
    }
  }

  addPANdetails() {
    this.clearAccountSection();
    this.checkAccountValidators();
    this.submitted = true;
    if (this.panForm.invalid) {
      this.toastrService.error("Please correct the errors before submitting");
      return;
    }
    let pan = this.panForm.controls.panNo.value;
    // if(!pan){
    //   this.toastrService.error("Pan number is mandatory");
    //   return;
    // }

    let _panData = this.panForm.value;
    delete _panData.adddedAccountName;
    delete _panData.vehicleNo;
    delete _panData.tds;
    if(_panData.confirmPanNo !== _panData.panNo){
      this.toastrService.error("Confirm PAN and PAN do not match.");
      return;
    }
    if(this.panForm.controls.tds.value == 'false'){
      _panData.tds = false
    }
    else{
      _panData.tds = true
    }
    this.uploaderService.setPanaNo(pan);
    _panData.panCopyLink = this.uploaderService.getFileNameForPan(_panData.panCopy);
    _panData.declarationLink = this.uploaderService.getFileNameForDeclaration(_panData.declaration);
  /*  _panData.vehicles = [{
      vehicleNo: this.panForm.controls.vehicleNo.value,
      rcCopyLink: this.getFileNameForRC(_panData.rcCopy.value)
    }]*/
    _panData.accounts = this.addedBankAccounts;

    if(!_panData.panCopyLink){
      this.toastrService.error("PAN Copy is mandatory to register PAN");
      return;
    }
    this.panservice.registerPAN(_panData).subscribe(
      (res) => {
        console.log(res);
        if(res.success){
            this.toastrService.success("Pan is added successfully");
        }else{
            this.toastrService.error("Pan was not added. Something went wrong");
        }

        setTimeout(() => {
          this.panservice.pancreated(res.data);
          this.modalService.dismissAll();
        }, 2000)
      },
      (error) => {
        this.toastrService.error("Pan is not added. Please contact admin");
      }
    )
    //upload files to server

    this.uploaderService.uploadfiles(this.fileQueue);

  }
  fileQueue: Array<Object> = []
  onFileChange(filename){
      this.fileQueue.push(filename);
  }

  updatePANdetails() {
    this.addedBankAccounts;
    this.PanDataToUpdate
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
      Object.keys(this.panForm.controls.account['controls']).forEach(key => {
        if(key != 'passbook'){
          if(key == 'ifscCode'){
            accountCntrl['controls'][key].setValidators(_ifscValidators);
          }else{
            accountCntrl['controls'][key].setValidators(this.customrequired.bind(this));
          }
        }
        accountCntrl['controls'][key].updateValueAndValidity();
      })
    }else{
      Object.keys(this.panForm.controls.account['controls']).forEach(key => {
        accountCntrl['controls'][key].setValidators([]);
        accountCntrl['controls'][key].updateValueAndValidity();
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
  get a(){ return this.panForm.controls.account['controls']}
  removeAccount(index){
    this.addedBankAccounts.splice(index, 1);
    // this.addedBankAccounts = this.addedBankAccounts.filter((item, idx) => idx !== index);
  }
}
