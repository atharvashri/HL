import { Component, OnInit } from '@angular/core';
import { DO } from '../../model/do.model';
import { Builty } from '../../model/builty.model';

import { FormGroup, FormControl, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-builty-create',
  templateUrl: './builty-create.component.html',
  styleUrls: ['./builty-create.component.css']
})
export class BuiltyCreateComponent implements OnInit {
  doList = []
  toppingList: Array<string>

  constructor(public builtyFormBuilder: FormBuilder) { }

  optionsSelect
  ngOnInit() {
    this.doList.push(new DO(133, 'bilaspur', 1200, 2345, 4563));
    this.doList.push(new DO(132, 'bhilai', 1000, 2345, 4563));
    this.doList.push(new DO(131, 'bijuri', 1100, 2345, 4563));

    this.toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  }

  builtyForm = this.builtyFormBuilder.group({

    builtyNo: [''],
    doId: [''],
    doDisplay: [''],
    // party: new FormGroup({
    //   id: [''],
    //   name: [''],
    //   destinations: [''],
    //   freightRanges: [''],

    // }),
    builtyDate: [''],
    otBuiltyCompany: [''],
    otBuiltyNumber: [''],
    vehicleNo: [''],
    quantity: [''],
    inAdvance: [''],
    outAdvance: [''],
    diesel: [''],
    pumpName: [''],
    freight: [''],
    totalAdvance: [''],
    permitNo: [''],
    permitBalance: [''],
    permitEndDate: [''],
    igpNo: [''],
    invoiceNo: [''],
    invoiceValue: [''],
    driverName: [''],
    driverMobile: [''],
    grossWeight: [''],
    tierWeight: [''],
    doBalance: [''],
    // transporter: new FormGroup({
    //   userName: [''],
    //   firstName: [''],
    //   lastName: [''],
    //   password: [''],
    //   role: [''],
    //   active: ['']
    // }),
    // subTransporter: new FormGroup({
    //   userName: [''],
    //   firstName: [''],
    //   lastName: [''],
    //   password: [''],
    //   role: [''],
    //   active: ['']
    // }),
    transporter: [''],
    subTransporter : [''],
    waybillNo: [''],
    tpNo: [''],
    receivedDate: [''],
    receivedQuantity: [''],
    netWeight: [''],
    refund: [''],
    assesibleValue: [''],
    freightToBePaidBy: [''],
    inAdvanceLimit: ['']

  })

  onSubmitbuilty() {

  }

  getDataOnDoselect(){
    
  }
}
