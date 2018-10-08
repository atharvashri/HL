import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-truck-update-details',
  templateUrl: './truck-update-details.component.html',
  styleUrls: ['./truck-update-details.component.css']
})
export class TruckUpdateDetailsComponent implements OnInit {

  constructor(public truckUpdate: FormBuilder, public accountsInfo: FormBuilder) { }

  ngOnInit() {
  }

  accountsForm: any;
  addedBankAccounts = new Array();

  truckUpdateForm = this.truckUpdate.group({
    pan: [],
    panCopyLink: [],
    declarationLink: [],
    ownerName: [],
    fatherName: [],
    tds: [],
    address: [],
    city: [],
    district: [],
    accountNumber: ['', Validators.required],
    accountHoldername: ['', Validators.required],
    ifscCode: [],
    bankname: ['', Validators.required],
    adddedAccountName: [],

    rcCopy: [],
    declaration: [],
    panCopy: []
  })



  addAccountByBankName() {

    if (this.truckUpdateForm.controls.accountNumber.value == "" ||
      this.truckUpdateForm.controls.accountHoldername.value == "" ||
      this.truckUpdateForm.controls.ifscCode.value == "")
      console.log("Please provide the required details")

    if (this.addedBankAccounts.length != 0)
      this.checkForduplicateAccountNo()
    else {
      this.addedBankAccounts.push({
        accountNumber: this.truckUpdateForm.controls.accountNumber.value,
        accountHoldername: this.truckUpdateForm.controls.accountHoldername.value,
        ifscCode: this.truckUpdateForm.controls.ifscCode.value
      })
    }
  }

  checkForduplicateAccountNo() {
    this.addedBankAccounts.forEach((element, index, array) => {
      if (element.accountNumber == this.truckUpdateForm.controls.accountNumber.value) {
        alert("bank account no is present")
        return;
      }
      if (index === (array.length - 1)) {
        this.addedBankAccounts.push({
          accountNumber: this.truckUpdateForm.controls.accountNumber.value,
          accountHoldername: this.truckUpdateForm.controls.accountHoldername.value,
          ifscCode: this.truckUpdateForm.controls.ifscCode.value
        })
      }
    });

  }
}
