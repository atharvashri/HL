import { Component, OnInit, ViewChild } from '@angular/core';
import { DO } from '../../model/do.model';
import { Builty } from '../../model/builty.model';
import { DoService } from '../../services/do.service'
import { BuiltyService } from '../../services/builty.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

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
  isSearchvehicle = true;
  constructor(public builtyFormBuilder: FormBuilder,
    private doService: DoService,
    private builtyService: BuiltyService,
    private modalService: NgbModal,
    private toaster: ToastrService
  ) { }

  optionsSelect;
  activeDoList;
  destinationsParty = [];
  destinationNames = [];
  isbuiltyCompanyAdded: boolean = false;
  builtyDataforConfirmModel = {};
  currentdoDisplayName = "";
  savedBuilties = [];
  vehicleList = [];

  @ViewChild('content') content;

  ngOnInit() {
    this.getAllDOs();
    this.getAllSavedBuilties();
    this.getVehicleList();
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
    party: [],
    destination: [],
    builtyDate: [],
    otBuiltyCompany: [],
    otBuiltyNumber: [],
    vehicleNo: [],
    quantity: [],
    inAdvance: [],
    outAdvance: [],
    totalCashAdvance: [{ value: '', disabled: true }],
    diesel: [],
    pumpName: [],
    freight: [],
    totalAdvance: [{ value: '', disabled: true }],
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
    doClosingBalance: [],
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

  getVehicleList() {
    this.builtyService.getAllVehicleList().subscribe(
      (res) => {
        //console.log(res);
        this.vehicleList = res['data'];
      },
      (err) => {

      }
    )
  }

  getAllSavedBuilties() {
    this.builtyService.getSavedbuiltiesService().subscribe(
      (res) => {
        this.savedBuilties = res['data'];
        console.log(res);
      },
      (error) => {

      }
    )
  }

  getdoDisplayName() {
    return this.currentdoDisplayName;
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

  showDataAfterDoSelection(isDoChanged) {
    let _selectedDO = this.builtyForm.controls.doId.value;
    if (isDoChanged) {
      this.builtyForm.reset();
      this.builtyForm.controls.doId.setValue(_selectedDO);
    }
    this.doList.forEach((element) => {
      if (element.id == _selectedDO) {
        this.currentdoDisplayName = element.areaDoNo + "/" + element.bspDoNo + "-" + element.collary + "-" + element.quantity;

        this.builtyForm.controls.quantity.setValue(element.quantity);
        this.builtyForm.controls.receivedDate.setValue(element.receivedDate);
        this.transporter = [];
        this.transporter.push(element.transporter);
        this.destinationsParty = element.destinationparty;
        let _recvDate = element.receivedDate.split('-').reverse().join('-')
        this.builtyForm.controls.receivedDate.setValue(_recvDate)

        if (element.builtyCompany != undefined && element.builtyCompany != null) {
          this.builtyForm.controls.otBuiltyCompany.setValue(element.builtyCompany);
          this.isbuiltyCompanyAdded = true;
        }
        else {
          this.isbuiltyCompanyAdded = false;
        }
      }
    })
  }


  showDataAfterSavedBuiltySelection(evt) {

    if (evt.target.value == "notSelected") {
      this.clearBuiltyForm();
      return;
    }
    this.clearBuiltyForm();
    this.savedBuilties.forEach(element => {

      if (element.id == evt.target.value) {

        if (element.otBuiltyCompany != undefined && element.otBuiltyCompany != null) {
          this.builtyForm.controls.otBuiltyCompany.setValue(element.otBuiltyCompany);
          this.isbuiltyCompanyAdded = true;
        }
        else {
          this.isbuiltyCompanyAdded = false;
        }

        this.builtyForm.controls.doId.setValue(element.doId);
        this.builtyForm.controls.builtyDate.setValue(element.builtyDate)
        this.builtyForm.controls.otBuiltyCompany.setValue(element.otBuiltyCompany);
        this.builtyForm.controls.otBuiltyNumber.setValue(element.otBuiltyNumber);
        this.builtyForm.controls.vehicleNo.setValue(element.vehicleNo);
        this.builtyForm.controls.quantity.setValue(element.quantity);
        this.builtyForm.controls.outAdvance.setValue(element.outAdvance);
        this.builtyForm.controls.inAdvance.setValue(element.inAdvance);
        this.builtyForm.controls.diesel.setValue(element.diesel);
        this.builtyForm.controls.pumpName.setValue(element.pumpName);
        this.builtyForm.controls.freight.setValue(element.freight);
        this.builtyForm.controls.totalAdvance.setValue(element.totalAdvance);
        this.builtyForm.controls.permitNo.setValue(element.permitNo);
        this.builtyForm.controls.permitBalance.setValue(element.permitBalance);
        this.builtyForm.controls.igpNo.setValue(element.igpNo);
        this.builtyForm.controls.invoiceValue.setValue(element.invoiceValue);
        this.builtyForm.controls.invoiceNo.setValue(element.invoiceNo);
        this.builtyForm.controls.driverName.setValue(element.driverName);
        this.builtyForm.controls.driverMobile.setValue(element.driverMobile);
        this.builtyForm.controls.grossWeight.setValue(element.grossWeight);
        this.builtyForm.controls.tierWeight.setValue(element.tierWeight);
        this.builtyForm.controls.doClosingBalance.setValue(element.doClosingBalance);
        this.transporter = [];
        this.transporter.push(element.subTransporter);
        this.builtyForm.controls.subTransporter.setValue(element.subTransporter.id);
        this.builtyForm.controls.waybillNo.setValue(element.waybillNo);
        this.builtyForm.controls.tpNo.setValue(element.tpNo);
        this.builtyForm.controls.receivedDate.setValue(element.receivedDate);
        this.builtyForm.controls.receivedQuantity.setValue(element.receivedQuantity);
        this.builtyForm.controls.netWeight.setValue(element.netWeight);
        this.builtyForm.controls.refund.setValue(element.refund);
        this.builtyForm.controls.assesibleValue.setValue(element.assesibleValue);
        this.builtyForm.controls.freightToBePaidBy.setValue(element.freightToBePaidBy);
        this.builtyForm.controls.permitEndDate.setValue(element.permitEndDate);

        this.showDataAfterDoSelection(false);
      }
    });
  }

  submitBuiltyforConfirmation() {
    let _builtyData = this.builtyForm.value;
    let _subtransporter = this.builtyForm.controls.subTransporter.value

    if (_subtransporter == null) {
      _subtransporter = (<HTMLInputElement>document.getElementById('subTransporter')).value;
    }
    this.getTransporterForSelectedDo(_subtransporter, this.transporter)
      .then((_trnsdata) => {
        _builtyData.subTransporter = _trnsdata
        return this.getDObyId(_builtyData.doId);
      })
      .then((element) => {
        this.builtyDataforConfirmModel = _builtyData;
        this.builtyDataforConfirmModel['doDisplay'] = element['areaDoNo'] + "/" + element['bspDoNo'] + "-" + element['collary'] + "-" + element['quantity'];
        this.modalService.open(this.content);
      })
  }

  getTransporterForSelectedDo(_selectedvalue, arrayTo) {
    return new Promise((resolve, reject) => {
      arrayTo.forEach(element => {
        if (element.id == _selectedvalue) {
          resolve(element)
        }
      });
    })
  }

  createBuilty() {
    this.builtyService.createBuiltyService(this.builtyDataforConfirmModel).subscribe(
      (res) => {
        this.modalService.dismissAll();
        this.toaster.success("builty is created successfully");
      },
      (error) => {
        this.toaster.success("error in builty creation");
      })
  }

  saveBuilty() {
    let _builtyData = this.builtyForm.value;
    this.getTransporterForSelectedDo(this.builtyForm.controls.subTransporter.value, this.transporter)
      .then((_trnsdata) => {
        _builtyData.subTransporter = _trnsdata

        //this.builtyDataforConfirmModel = _builtyData
        _builtyData.doDisplay = this.currentdoDisplayName;
        this.builtyService.savebuiltiesService(_builtyData).subscribe(
          (res) => {
            this.toaster.success("builty is saved successfully");
          },
          (error) => {
            this.toaster.error("builty is not saved, please contact admin");
          }
        )
      })
  }
  onChangeDestinationsData(evt) {

    this.destinationNames = [];
    this.destinationsParty.forEach(element => {
      if (evt != undefined) {
        if (evt.target.value == element.name) {
          element.destinations.forEach(element => {
            this.destinationNames.push(element.name);
          });
        }
      }
    });
  }

  searchVehicleNumber(evt) {
    this.vehicleList.forEach(element => {
      element.includes(evt.target.value)
    });
  }

  getDObyId(id) {
    return new Promise((resolve, reject) => {
      this.doList.forEach(element => {
        if (element.id == id) {
          resolve(element);
        }
      });
    })
  }

  calculateTotalCashAdvance() {
    let _inadvnace = this.builtyForm.controls.inAdvance.value; 
    let _outadvnace = this.builtyForm.controls.outAdvance.value; 
    let _diesel = this.builtyForm.controls.diesel.value;

    this.builtyForm.controls.totalCashAdvance.setValue(_inadvnace + _outadvnace)
    this.builtyForm.controls.totalAdvance.setValue(_inadvnace + _outadvnace + _diesel)
  }



  clearBuiltyForm() {
    this.builtyForm.reset();
    // this.builtyForm.controls.doId.setValue('');
    // this.builtyForm.controls.otBuiltyCompany.setValue('');
    // this.builtyForm.controls.vehicleNo.setValue('');
    // this.builtyForm.controls.quantity.setValue('');
    // this.builtyForm.controls.outAdvance.setValue('');
    // this.builtyForm.controls.diesel.setValue('');
    // this.builtyForm.controls.pumpName.setValue('');
    // this.builtyForm.controls.freight.setValue('');
    // this.builtyForm.controls.totalAdvance.setValue('');
    // this.builtyForm.controls.permitNo.setValue('');
    // this.builtyForm.controls.permitBalance.setValue('');
    // this.builtyForm.controls.igpNo.setValue('');
    // this.builtyForm.controls.invoiceNo.setValue('');
    // this.builtyForm.controls.driverName.setValue('');
    // this.builtyForm.controls.driverMobile.setValue('');
    // this.builtyForm.controls.grossWeight.setValue('');
    // this.builtyForm.controls.tierWeight.setValue(element.tierWeight);
    // this.builtyForm.controls.doBalance.setValue(element.doBalance);
    // this.builtyForm.controls.subTransporter.setValue(element.subTransporter);
    // this.builtyForm.controls.waybillNo.setValue(element.waybillNo);
    // this.builtyForm.controls.tpNo.setValue(element.tpNo);
    // this.builtyForm.controls.receivedDate.setValue(element.receivedDate);
    // this.builtyForm.controls.receivedQuantity.setValue(element.receivedQuantity);
    // this.builtyForm.controls.netWeight.setValue(element.netWeight);
    // this.builtyForm.controls.refund.setValue(element.refund);
    // this.builtyForm.controls.assesibleValue.setValue(element.assesibleValue);
    // this.builtyForm.controls.freightToBePaidBy.setValue(element.freightToBePaidBy);
    // this.builtyForm.controls.permitEndDate.setValue(element.permitEndDate);
  }
}
