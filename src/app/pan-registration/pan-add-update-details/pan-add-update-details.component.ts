import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TruckPanService } from '../../services/truck.pan.services'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-add-pan-update-details',
  templateUrl: './pan-add-update-details.component.html',
  styleUrls: ['./pan-add-update-details.component.css']
})
export class PanAddUpdateDetailsComponent implements OnInit {

  constructor(public truckUpdate: FormBuilder, public accountsInfo: FormBuilder, private modalService: NgbModal,
    private panservice: TruckPanService, private toastrService: ToastrService) { }

  ngOnInit() {
  }

  @ViewChild('content') content
  accountsForm: any;
  addedBankAccounts = new Array();
  @Input() formtitle: string;
  @Input() PANno
  @Input() PanDataToUpdate;

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
    bankname: [],
    adddedAccountName: [],

    rcCopy: [],
    declaration: [],
    panCopy: []
  })



  addAccountByBankName() {

    if (this.panForm.controls.accountNumber.value == null ||
      this.panForm.controls.accountHoldername.value == null ||
      this.panForm.controls.ifscCode.value == null)
      this.toastrService.error("Please provide the required details")

    if (this.addedBankAccounts.length != 0)
      this.checkForduplicateAccountNo()
    else {
      this.addedBankAccounts.push({
        accountNo: this.panForm.controls.accountNumber.value,
        accountHoldername: this.panForm.controls.accountHoldername.value,
        ifscCode: this.panForm.controls.ifscCode.value,
        bankName: this.panForm.controls.bankname.value
      })
      this.toastrService.success("Account is added successfully.");
    }
  }

  checkForduplicateAccountNo() {
    this.addedBankAccounts.forEach((element, index, array) => {
      if (element.accountNo == this.panForm.controls.accountNumber.value) {
        this.toastrService.error("bank account no is present")
        return;
      }
      if (index === (array.length - 1)) {
        this.addedBankAccounts.push({
          accountNo: this.panForm.controls.accountNumber.value,
          accountHoldername: this.panForm.controls.accountHoldername.value,
          ifscCode: this.panForm.controls.ifscCode.value,
          bankName: this.panForm.controls.bankname.value
        })
      }
    });

  }

  public openModel() {
    this.modalService.open(this.content);
    this.panForm.controls.panNo.setValue(this.PANno);
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
    delete _panData.tds;

    if(this.panForm.controls.tds.value == 'false'){
      _panData.tds = false
    }
    else{
      _panData.tds = true
    }

    _panData.vehicles = [{
      vehicleNo: this.panForm.controls.vehicleNo.value
    }]
    _panData.accounts = this.addedBankAccounts;

    this.panservice.registerPAN(_panData).subscribe(
      (res) => {
        console.log(res);
        this.toastrService.success("Pan is added successfully");
        setTimeout(() => {
          this.modalService.dismissAll();
        }, 2000)
      },
      (error) => {
        this.toastrService.error("Pan is not added. Please contact admin");
      }
    )


  }

  updatePANdetails() {
    this.addedBankAccounts;
    this.PanDataToUpdate

  }
}
