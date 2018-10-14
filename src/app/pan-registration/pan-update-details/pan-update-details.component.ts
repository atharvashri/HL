import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TruckPanService } from '../../services/truck.pan.services'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pan-update-details',
  templateUrl: './pan-update-details.component.html',
  styleUrls: ['./pan-update-details.component.css']
})
export class PanUpdateDetailsComponent implements OnInit {

  constructor(public truckUpdate: FormBuilder, public accountsInfo: FormBuilder, private modalService: NgbModal,
    private panservice: TruckPanService, private toaster: ToastrService) { }

  ngOnInit() {
  }

  @ViewChild('content') content
  accountsForm: any;
  addedBankAccounts = new Array();
  @Input() formtitle: string;
  @Input() PANno;
  @Input() PanDataToUpdate;
  selectedValue = "AM";

  panForm = this.truckUpdate.group({
    panNo: [],
    panCopyLink: [],
    vehicleNo: [],
    declarationLink: [],
    ownerName: [],
    fatherName: [],
    tds: [],
    address: [],
    city: [],
    district: [],
    accountNumber: [],
    accountHoldername: [],
    ifscCode: [],
    bankName: [],
    adddedAccountName: [],

    rcCopy: [],
    declaration: [],
    panCopy: [],
    Added_bankName: [{ value: [], disabled: true }]
  })



  addAccountByBankName() {

    if (this.panForm.controls.accountNumber.value == null ||
      this.panForm.controls.accountHoldername.value == null ||
      this.panForm.controls.ifscCode.value == null)
      this.toaster.error("Please provide the required details")

    if (this.addedBankAccounts.length != 0)
      this.checkForduplicateAccountNo()
    else {
      this.addedBankAccounts.push({
        accountNo: this.panForm.controls.accountNumber.value,
        accountHoldername: this.panForm.controls.accountHoldername.value,
        ifscCode: this.panForm.controls.ifscCode.value,
        bankName: this.panForm.controls.bankname.value
      })
    }
  }

  checkForduplicateAccountNo() {
    let _isErrorOccured = false;
    this.addedBankAccounts.forEach((element, index, array) => {
      if (element.accountNo == this.panForm.controls.accountNumber.value) {
        _isErrorOccured = true;
        this.toaster.error("bank account no is present")
        return;
      }
      if (index === (array.length - 1) && !_isErrorOccured) {
        this.addedBankAccounts.push({
          accountNo: this.panForm.controls.accountNumber.value,
          accountHoldername: this.panForm.controls.accountHoldername.value,
          ifscCode: this.panForm.controls.ifscCode.value,
          bankName: this.panForm.controls.bankName.value
        })
        this.toaster.success("bank account is added")
      }
    });

  }

  public openModel() {
    console.log("model");
    this.modalService.open(this.content);
    this.panForm.controls.panNo.setValue(this.PANno);
    this.addedBankAccounts = this.PanDataToUpdate.accounts;
    this.panForm.controls.fatherName.setValue(this.PanDataToUpdate.fatherName);
    this.panForm.controls.address.setValue(this.PanDataToUpdate.address);
    this.panForm.controls.city.setValue(this.PanDataToUpdate.city);
    this.panForm.controls.district.setValue(this.PanDataToUpdate.district);

    if(this.PanDataToUpdate.tds == false){
      this.panForm.controls.tds.setValue('false');
    }
    else{
      this.panForm.controls.tds.setValue('true');
    }

  }

  UpdatePANdetails() {
    if (this.panForm.invalid) {
      return
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

    if(this.panForm.controls.tds.value == 'false'){
      _panData.tds = false
    }
    else{
      _panData.tds = true
    }

    this.panservice.updatePAN(_panData, this.panForm.controls.panNo.value).subscribe(
      (res) => {
        console.log(res);
        this.toaster.success("PAN is updated successfully")
        setTimeout(() => {
          this.modalService.dismissAll();
        }, 2000)
      },
      (error) => {
        this.toaster.success("PAN is not updated, Please contact the admin")
      }
    )


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
}
