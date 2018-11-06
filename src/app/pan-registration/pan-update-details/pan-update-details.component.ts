import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TruckPanService } from '../../services/truck.pan.services'
import { ToastrService } from 'ngx-toastr';
import { Account } from '../../model/account.model';
import { FileUploader } from '../../../../node_modules/ng2-file-upload';
import { FileUploadService } from '../../services/fileupload.service';
import { Refdata } from '../../utils/refdata.service';

@Component({
  selector: 'app-pan-update-details',
  templateUrl: './pan-update-details.component.html',
  styleUrls: ['./pan-update-details.component.css']
})
export class PanUpdateDetailsComponent implements OnInit {

uploader: FileUploader;
ref_states: Array<string>;
  constructor(public truckUpdate: FormBuilder, public accountsInfo: FormBuilder, private modalService: NgbModal,
    private panservice: TruckPanService, private toaster: ToastrService,
    private uploaderService: FileUploadService) { }

    panForm = this.truckUpdate.group({
      panNo: [],
      panHolderName: [],
      tds: [],
      city: [],
      state: [],
      accountNumber: [],
      confirmAccountNumber: [],
      accountHoldername: [],
      ifscCode: [],
      confirmIfscCode: [],
      bankName: [],
      adddedAccountName: [],
      declaration: [],
      panCopy: [],
      Added_bankName: [{ value: [], disabled: true }]
    })
    accounts: Array<Account> = [];

  ngOnInit() {
    this.uploader = this.uploaderService.getFileUploader();
    this.ref_states = Refdata.getStates();
  }

  @ViewChild('content') content
  accountsForm: any;
  addedBankAccounts = new Array();
  @Input() formtitle: string;
  @Input() PANno;
  @Input() PanDataToUpdate;
  selectedValue = "AM";

  addAccountByBankName() {

    if (this.panForm.controls.accountNumber.value == null ||
      this.panForm.controls.accountHoldername.value == null ||
      this.panForm.controls.ifscCode.value == null){

      this.toaster.error("Please provide the required details")
      return;
    }
    if (this.isAccountPresent()){
      this.toaster.error("This account number is already added")
      return;
    }else {
      if(this.panForm.controls.accountNumber.value !== parseInt(this.panForm.controls.confirmAccountNumber.value)){
        this.toaster.error("Account Number and Confirm Account Number do not match");
        return;
      }else if(this.panForm.controls.confirmIfscCode.value !== this.panForm.controls.ifscCode.value){
        this.toaster.error("IFSC Code and Confirm IFSC do not match");
        return;
      }
      let account = new Account();
      account.accountNo = this.panForm.controls.accountNumber.value;
      account.bankName = this.panForm.controls.bankName.value;
      account.ifscCode = this.panForm.controls.ifscCode.value;
      account.accountHoldername = this.panForm.controls.accountHoldername.value;
      this.addedBankAccounts.push(account);
      //this.toastrService.success("Account is added successfully.");
    }
  }

  isAccountPresent() {
    let result = false;
    this.addedBankAccounts.forEach((element) => {
      if (element.accountNo == this.panForm.controls.accountNumber.value) {
        result = true;
      }
    });
    return result;
  }

  public openModel() {
    this.modalService.open(this.content);
    this.panForm.controls.panNo.setValue(this.PANno);
    this.panForm.controls.panHolderName.setValue(this.PanDataToUpdate.panHolderName);
    this.panForm.controls.city.setValue(this.PanDataToUpdate.city);
    this.panForm.controls.state.setValue(this.PanDataToUpdate.state);
    this.panForm.controls.tds.setValue(this.PanDataToUpdate.tds ? "true" : "false");
    this.panForm.controls.panCopy.setValue("");
    this.panForm.controls.declaration.setValue("");
    this.addedBankAccounts = this.PanDataToUpdate.accounts;
  }

  fileQueue: Array<string> = []
  onFileChange(filename){
      this.fileQueue.push(filename);
  }

  UpdatePANdetails() {
    if (this.panForm.invalid) {
      return
    }

    let panno = this.panForm.controls.panNo.value;
    if(!panno){
      this.toaster.error("Pan number is mandatory to upload files");
      return;
    }

    let _panData = this.panForm.value;
    delete _panData.accountNumber;
    delete _panData.accountHoldername;
    delete _panData.ifscCode;
    delete _panData.bankname;
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
            this.PanDataToUpdate = _panData;
            this.panservice.panupdated(_panData);
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
    this.uploaderService.uploadfiles(this.fileQueue, "");

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
    this.addedBankAccounts = this.addedBankAccounts.filter((item, idx) => idx !== index);
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

  getFileNameForRC(filename: string): string{
    if(filename){
      let ext = this.getFileExtension(filename);
      return `${this.panForm.panNo}_${this.panForm.vehicleNo}`.toUpperCase() + ext;
    }else{
      return "";
    }
  }

  getFileNameForPan(filename: string): string{
    if(filename){
      let ext = this.getFileExtension(filename);
      return `${this.panForm.panNo}`.toUpperCase() + ext;
    }else{
      return "";
    }
  }

  getFileNameForDeclaration(filename: string): string{
    if(filename){
      let ext = this.getFileExtension(filename);
      return `${this.panForm.panNo}_declaration`.toUpperCase() + ext;
    }else{
      return "";
    }
  }

  getFileExtension(filename){
    return filename.substring(filename.lastIndexOf("."), filename.length);
  }
}
