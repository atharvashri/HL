import { Component, OnInit } from '@angular/core';
import { DO } from '../../model/do.model';
import { Builty } from '../../model/builty.model';
import { DoService } from '../../services/do.service'
import { BuiltyService } from '../../services/builty.service'

import { FormGroup, FormControl, FormBuilder } from '@angular/forms'
//import { resolve } from 'path';

@Component({
  selector: 'app-builty-create',
  templateUrl: './builty-create.component.html',
  styleUrls: ['./builty-create.component.css']
})
export class BuiltyCreateComponent implements OnInit {
  doList = []
  transporter = []
  constructor(public builtyFormBuilder: FormBuilder, private doService: DoService, private builtyService: BuiltyService) { }

  optionsSelect;
  activeDoList
  ngOnInit() {
    this.getAllDOs()
  }

  builtyForm = this.builtyFormBuilder.group({

    builtyNo: [],
    doId: [],
    doDisplay: [],
    // party: new FormGroup({
    //   id: [],
    //   name: [],
    //   destinations: [],
    //   freightRanges: [],

    // }),
    builtyDate: [],
    otBuiltyCompany: [],
    otBuiltyNumber: [],
    vehicleNo: [],
    quantity: [],
    inAdvance: [],
    outAdvance: [],
    diesel: [],
    pumpName: [],
    freight: [],
    totalAdvance: [],
    permitNo: [],
    permitBalance: [],
    permitEndDate: [],
    igpNo: [],
    invoiceNo: [],
    invoiceValue: [],
    driverName: [],
    driverMobile: [],
    grossWeight: [],
    tierWeight: [],
    doBalance: [],
    // transporter: new FormGroup({
    //   userName: [],
    //   firstName: [],
    //   lastName: [],
    //   password: [],
    //   role: [],
    //   active: []
    // }),
    // subTransporter: new FormGroup({
    //   userName: [],
    //   firstName: [],
    //   lastName: [],
    //   password: [],
    //   role: [],
    //   active: []
    // }),
    transporter: [],
    subTransporter: [],
    waybillNo: [],
    tpNo: [],
    receivedDate: [],
    receivedQuantity: [],
    netWeight: [],
    refund: [],
    assesibleValue: [],
    freightToBePaidBy: [],
    inAdvanceLimit: []

  })

  getDataOnDoselect() {
    let _selectedDO = this.builtyForm.controls.doId.value;
    this.doService.getDoByIDService(_selectedDO).subscribe(
      (data) => {

      },
      (error) => {

      }
    )

  }

  getAllDOs() {
    this.doService.getAllDosService().subscribe(
      (res) => {
        console.log(res.data);
        this.doList = res.data;
      },
      (err) => {

      }
    );
  }

  ShowDataForBuiltyCreation() {
    let _selectedDO = this.builtyForm.controls.doDisplay.value;

    this.doList.forEach((element) => {
      if (element.id == _selectedDO) {
        this.builtyForm.controls.otBuiltyCompany.setValue(element.builtyCompany);
        this.builtyForm.controls.quantity.setValue(element.quantity);
        this.builtyForm.controls.receivedDate.setValue(element.receivedDate);
        this.transporter.push(element.transporter);
        
        let _recvDate = element.receivedDate.split('-').reverse().join('-')
        this.builtyForm.controls.receivedDate.setValue(_recvDate)
      }
    })
  }

  submitBuilty() {
    let _builtyData = this.builtyForm.value;

    this.getPartyForSelectedDo(this.builtyForm.controls.subTransporter.value, this.transporter)
      .then((_trnsdata) => {
        _builtyData.subTransporter = _trnsdata
        return this.getPartyForSelectedDo(this.builtyForm.controls.doDisplay.value, this.doList)
      })
      .then((data) => {
        _builtyData.party = data;
        this.builtyService.createBuiltyService(_builtyData).subscribe(
          (res) => {
            console.log(res)
          },
          (error) => {
            console.log(error)
          })
      })
  }

  getPartyForSelectedDo(_selectedvalue, arrayTo) {
    return new Promise((resolve, reject) => {
      arrayTo.forEach(element => {
        if (element.id == _selectedvalue) {
          resolve(element)
        }
      });
    })
  }
}
