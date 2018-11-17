import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
  ref_states: Array<string>;

  @ViewChild('content') content;

  accountsForm: any;
  addedBankAccounts = new Array();
  @Input() formtitle: string;
  @Input() PANno
  @Input() PanDataToUpdate;

  constructor(public truckUpdate: FormBuilder, public accountsInfo: FormBuilder,
    private panservice: TruckPanService, private toastrService: ToastrService,
    private modalService: NgbModal, private uploaderService: FileUploadService){}
    fileuplodurl: string = "http://localhost:8080/upload/";
  ngOnInit() {
    this.panForm = this.truckUpdate.group({
      panNo: ['', [Validators.required, CustomValidator.panValidator]],
      confirmPanNo: ['', Validators.required],
      panCopyLink: [],
      declarationLink: [],
      panHolderName: ['', Validators.required],
      fatherName: [],
      tds: [],
      city: [],
      state: [],
      accountNumber: [],
      confirmAccountNumber: [],
      accountHoldername: [],
      ifscCode: [],
      confirmIfscCode: [],
      bankname: [],
      adddedAccountName: [],
      panCopy: [],
      declaration: []
    })
    this.uploader = this.uploaderService.getFileUploader();
    this.ref_states = Refdata.getStates();
  }

  addAccountByBankName() {

    if (this.panForm.controls.accountNumber.value == null ||
      this.panForm.controls.accountHoldername.value == null ||
      this.panForm.controls.ifscCode.value == null){

      this.toastrService.error("Please provide the required details")
      return;
    }
    if (this.isAccountPresent()){
      this.toastrService.error("This account number is already added")
      return;
    }else {
      if(this.panForm.controls.accountNumber.value !== parseInt(this.panForm.controls.confirmAccountNumber.value)){
        this.toastrService.error("Account Number and Confirm Account Number do not match");
        return;
      }else if(this.panForm.controls.confirmIfscCode.value !== this.panForm.controls.ifscCode.value){
        this.toastrService.error("IFSC Code and Confirm IFSC do not match");
        return;
      }
      let account = new Account();
      account.accountNo = this.panForm.controls.accountNumber.value;
      account.bankName = this.panForm.controls.bankname.value;
      account.ifscCode = this.panForm.controls.ifscCode.value;
      account.accountHoldername = this.panForm.controls.accountHoldername.value;
      this.addedBankAccounts.push(account);
      if(this.panForm.controls.passbook.value){
        this.fileQueue.push('passbook')
        account.passbookLink = this.uploaderService.getFileNameForPassbook(this.panForm.controls.passbook.value, account.accountNo);
        this.panForm.controls.passbook.setValue("");
      }
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
    this.panForm.controls.tds.setValue("false");
    this.panForm.controls.panCopy.setValue("");
    this.panForm.controls.declaration.setValue("");
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
    this.submitted = true;
    if (this.panForm.invalid) {
      this.toastrService.error("Please correct the errors before submitting");
      return;
    }
    let pan = this.panForm.controls.panNo.value;
    if(!pan){
      this.toastrService.error("Pan number is mandatory");
      return;
    }

    let _panData = this.panForm.value;
    delete _panData.accountNumber;
    delete _panData.accountHoldername;
    delete _panData.ifscCode;
    delete _panData.bankname;
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

    this.uploaderService.uploadfiles(this.fileQueue, "");

  }
  fileQueue: Array<string> = []
  onFileChange(filename){
      this.fileQueue.push(filename);
  }

  updatePANdetails() {
    this.addedBankAccounts;
    this.PanDataToUpdate

  }

  get f(){ return this.panForm.controls}
  removeAccount(index){
    this.addedBankAccounts = this.addedBankAccounts.filter((item, idx) => idx !== index);
  }
}
