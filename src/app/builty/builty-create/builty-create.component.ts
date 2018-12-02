import { Component, OnInit, ViewChild } from '@angular/core';
import { DoService } from '../../services/do.service'
import { BuiltyService } from '../../services/builty.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, Validators } from '@angular/forms'
import { PermitService } from '../../services/permit.service';
import { AppUtil } from '../../utils/app.util';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { CustomValidator } from '../../utils/custom.validator';
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
  updatedFrights = [];
  constructor(public builtyFormBuilder: FormBuilder,
    private doService: DoService,
    private builtyService: BuiltyService,
    private permitService: PermitService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  activeDoList;
  destinationsParty = [];
  destinationNames = [];
  isbuiltyCompanyAdded: boolean = false;
  builtyDataforConfirmModel = {};
  savedBuilties = [];
  vehicleList = [];
  selectedDo;
  submitted: boolean = false;
  updateMode: boolean;
  builtyToUpdate;

  @ViewChild('content') content;

  ngOnInit() {
    console.log('ngOninit called');
    this.route.queryParams.subscribe(
      (params) => {
        this.builtyToUpdate = this.builtyService.getBuiltyToUpdate();
        this.updateMode = params['update'];
        if(this.updateMode && !this.builtyToUpdate){
          this.router.navigate(['builtylist']);
          return;
        }

        this.getAllDOs();
        if(!this.updateMode){
          this.getAllSavedBuilties();
        }else{
          this.builtyForm.controls.doId.disable();
          //this.populateBuiltyDetails(this.builtyToUpdate);
          //this.showDataAfterDoSelection(false);
        }
      }
    )
    this.getVehicleList();
  }

  builtyForm = this.builtyFormBuilder.group({
    builtyNo: [],
    doId: ['', Validators.required],
    doDisplay: [],
    party: ['', Validators.required],
    destination: ['', Validators.required],
    builtyDate: ['', Validators.required],
    otBuiltyCompany: [],
    otBuiltyNumber: [],
    vehicleNo: ['', Validators.required],
    doOpeningbalance: [{ value: '', disabled: true }],
    inAdvance: [],
    outAdvance: ['', Validators.required],
    totalCashAdvance: [{ value: '', disabled: true }],
    diesel: ['', Validators.required],
    pumpName: ['', Validators.required],
    freight: ['', Validators.required],
    totalAdvance: [{ value: '', disabled: true }],
    permitNo: ['', Validators.required],
    permitBalance: [{ value: '', disabled: true }],
    permitEndDate: [{ value: '', disabled: true }],
    igpNo: ['', Validators.required],
    invoiceNo: ['', Validators.required],
    invoiceValue: ['', Validators.required],
    driverName: ['', Validators.required],
    driverMobile: ['', [Validators.required, CustomValidator.mobileValidator]],
    grossWeight: ['', Validators.required],
    tierWeight: ['', Validators.required],
    doClosingBalance: [{ value: '', disabled: true }],
    transporter: [],
    subTransporter: [],
    waybillNo: ['', Validators.required],
    tpNo: ['', Validators.required],
    netWeight: [{ value: '', disabled: true }],
    refund: ['', Validators.required],
    assesibleValue: ['', Validators.required],
    freightToBePaidBy: ['', Validators.required],
    receivedDate: [],
    receivedQuantity: []
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
    this.builtyService.getSavedbuilties().subscribe(
      (res) => {
        this.savedBuilties = res['data'];
        console.log(res);
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
        if(this.updateMode){
          this.populateBuiltyDetails(this.builtyToUpdate);
          this.showDataAfterDoSelection(false);
          this.populateDependentOptions();
        }
      },
      (err) => {

      }
    );
  }

  showDataAfterDoSelection(isDoChanged) {
    let _selectedDOId = this.builtyForm.controls.doId.value;
    if (isDoChanged) {
      this.builtyForm.reset();
      this.builtyForm.controls.doId.setValue(_selectedDOId);
    }
    this.doList.forEach((element) => {
      if (element.id == _selectedDOId) {
        this.selectedDo = element;
        this.builtyForm.controls.doOpeningbalance.setValue(element.doBalance);
        this.transporter = [];
        if (element.builtyCompany && element.builtyCompany.length) {
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
        this.populateBuiltyDetails(element);
        this.showDataAfterDoSelection(false);
        this.populateDependentOptions();
        this.calculateDoClosingBalance();
        this.calculateTotalCashAdvance();
      }
    });
  }

  populateBuiltyDetails(element: any){
    if (element.otBuiltyCompany) {
      this.isbuiltyCompanyAdded = true;
    }
    else {
      this.isbuiltyCompanyAdded = false;
    }

    this.builtyForm.controls.doId.setValue(element.doId);
    this.builtyForm.controls.builtyDate.setValue(AppUtil.transformdate(element.builtyDate))
    this.builtyForm.controls.otBuiltyCompany.setValue(element.otBuiltyCompany);
    this.builtyForm.controls.otBuiltyNumber.setValue(element.otBuiltyNumber);
    this.builtyForm.controls.party.setValue(element.party);
    this.builtyForm.controls.destination.setValue(element.destination);
    this.builtyForm.controls.vehicleNo.setValue(element.vehicleNo);
    this.builtyForm.controls.doOpeningbalance.setValue(element.doOpeningbalance);
    this.builtyForm.controls.outAdvance.setValue(element.outAdvance);
    this.builtyForm.controls.inAdvance.setValue(element.inAdvance);
    this.builtyForm.controls.diesel.setValue(element.diesel);
    this.builtyForm.controls.pumpName.setValue(element.pumpName);
    this.builtyForm.controls.freight.setValue(element.freight);
    this.builtyForm.controls.totalCashAdvance.setValue(element.totalCashAdvance);
    this.builtyForm.controls.totalAdvance.setValue(element.totalAdvance);
    this.builtyForm.controls.permitNo.setValue(element.permitNo);
    this.builtyForm.controls.permitBalance.setValue(element.permitBalance);
    this.builtyForm.controls.permitEndDate.setValue(AppUtil.transformdate(element.permitEndDate));
    this.builtyForm.controls.igpNo.setValue(element.igpNo);
    this.builtyForm.controls.invoiceValue.setValue(element.invoiceValue);
    this.builtyForm.controls.invoiceNo.setValue(element.invoiceNo);
    this.builtyForm.controls.driverName.setValue(element.driverName);
    this.builtyForm.controls.driverMobile.setValue(element.driverMobile);
    this.builtyForm.controls.grossWeight.setValue(element.grossWeight);
    this.builtyForm.controls.tierWeight.setValue(element.tierWeight);
    this.builtyForm.controls.doClosingBalance.setValue(element.doClosingBalance);
    this.transporter = [];
    //this.transporter.push(element.subTransporter);
    //this.builtyForm.controls.subTransporter.setValue(element.subTransporter.id);
    this.builtyForm.controls.waybillNo.setValue(element.waybillNo);
    this.builtyForm.controls.tpNo.setValue(element.tpNo);
    this.builtyForm.controls.receivedDate.setValue(AppUtil.transformdate(element.receivedDate));
    this.builtyForm.controls.receivedQuantity.setValue(element.receivedQuantity);
    this.builtyForm.controls.netWeight.setValue(element.netWeight);
    this.builtyForm.controls.refund.setValue(element.refund);
    this.builtyForm.controls.assesibleValue.setValue(element.assesibleValue);
    this.builtyForm.controls.freightToBePaidBy.setValue(element.freightToBePaidBy);
  }

  submitBuiltyforConfirmation() {
    if(this.builtyForm.invalid){
      this.toaster.error("Please correct the errors in form and then proceed");
      return;
    }
    let _builtyData = this.builtyForm.getRawValue();
    let _subtransporter = this.builtyForm.controls.subTransporter.value

    if (_subtransporter == null) {
      _subtransporter = (<HTMLInputElement>document.getElementById('subTransporter')).value;
    }
    this.builtyDataforConfirmModel = _builtyData;
    this.builtyDataforConfirmModel['doDisplay'] = this.selectedDo.doDisplay;
    this.modalService.open(this.content);
    // this.getTransporterForSelectedDo(_subtransporter, this.transporter)
    //   .then((_trnsdata) => {
    //     _builtyData.subTransporter = _trnsdata
    //     return this.getDObyId(_builtyData.doId);
    //   })
    //   .then((element) => {
    //     this.builtyDataforConfirmModel = _builtyData;
    //     this.builtyDataforConfirmModel['doDisplay'] = element['areaDoNo'] + "/" + element['bspDoNo'] + "-" + element['collary'] + "-" + element['quantity'];
    //     this.modalService.open(this.content);
    //   })
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
    this.builtyService.createBuilty(this.builtyDataforConfirmModel).subscribe(
      (res) => {
        if(res.success){
            this.toaster.success(res.message);
            this.selectedDo.doBalance = res.data.doClosingBalance;
            this.clearBuiltyForm();
            this.submitted = false;
            alert("Builty Number is " + res.data.builtyNo);
        }else{
            this.toaster.error(res.message);
        }
        this.modalService.dismissAll();

      },
      (error) => {
        this.toaster.error("error in builty creation");
      })
  }

  saveBuilty() {
    let _builtyData = this.builtyForm.getRawValue();
    // this.getTransporterForSelectedDo(this.builtyForm.controls.subTransporter.value, this.transporter)
    //   .then((_trnsdata) => {
    //     _builtyData.subTransporter = _trnsdata

        //this.builtyDataforConfirmModel = _builtyData
        _builtyData.doDisplay = this.selectedDo.doDisplay;
        _builtyData.builtyDate = AppUtil.transformdate(_builtyData.builtyDate);
        _builtyData.permitEndDate = AppUtil.transformdate(_builtyData.permitEndDate);
        this.builtyService.savebuilties(_builtyData).subscribe(
          (res) => {
            if(res.success){
              this.toaster.success("builty is saved successfully");
            }else{
                this.toaster.error(res.message);
            }
          },
          (error) => {
            this.toaster.error("builty is not saved, please contact admin");
          }
        )
      //})
  }

updateBuilty(){
  if(this.builtyForm.invalid){
    this.toaster.error("Please correct the errors in form and then proceed");
    return;
  }
  let _builty = this.builtyForm.getRawValue();
  _builty.id = this.builtyToUpdate.id;
  _builty.doDisplay = this.builtyToUpdate.doDisplay;
  _builty.approved = this.builtyToUpdate.approved;
  _builty.builtyNo = this.builtyToUpdate.builtyNo;
  _builty.createdBy = this.builtyToUpdate.createdBy;
  _builty.createdDateTime = this.builtyToUpdate.createdDateTime;
  this.builtyService.updateBuilty(_builty).subscribe(
    (res) => {
      if(res.success){
        this.toaster.success(res.message);
        //this.builtyToUpdate = res.data;
        this.router.navigate(['builtylist']);
      }else{
        this.toaster.error(res.message);
      }
    }
  )
}

  populateDependentOptions(){
      this.onChangeDestinationsParty();
      this.onChangeDestinations();
  }
  //evt is required for onclick event.
  onChangeDestinationsParty() {
    this.destinationNames = [];
    this.updatedFrights = [];
    this.selectedDo.destinationparty.forEach(element => {
      if (this.builtyForm.controls.party.value == element.name) {
        element.destinations.forEach(dest => {
          this.destinationNames.push(dest.name);
        });
      }
    });
  }

  onChangeDestinations() {
    this.updatedFrights = [];
    let _selectedDestParty = this.builtyForm.controls.party.value;
    this.selectedDo.destinationparty.forEach(element_destinationParty => {
      if (_selectedDestParty == element_destinationParty.name) {
        element_destinationParty.destinations.forEach(element_destinations => {
          if (this.builtyForm.controls.destination.value == element_destinations.name)
            this.updatedFrights = element_destinations.freight;
        });
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
    if(_inadvnace){
        _inadvnace = parseInt(_inadvnace);
    }else{
      _inadvnace = 0;
    }
    this.builtyForm.controls.totalCashAdvance.setValue(_inadvnace + _outadvnace)
    this.builtyForm.controls.totalAdvance.setValue(_inadvnace + _outadvnace + _diesel)
  }

  calculateDoClosingBalance() {
    let _netweigth = this.builtyForm.controls.netWeight.value;
    let _doOpeningbalance = this.builtyForm.controls.doOpeningbalance.value;

    this.builtyForm.controls.doClosingBalance.setValue(_doOpeningbalance - _netweigth)

  }

  calculateNetWeight(){
    let _grossweight = this.builtyForm.controls.grossWeight.value,
        _tierweight = this.builtyForm.controls.tierWeight.value;
    this.builtyForm.controls.netWeight.setValue(_grossweight - _tierweight);
    this.calculateDoClosingBalance();
  }
  clearBuiltyForm() {
    this.builtyForm.reset();
  }

  getPermitDetails(){
    let _permitnumber = this.builtyForm.controls.permitNo.value;
    this.permitService.getPermit(parseInt(_permitnumber)).subscribe(
      (res) => {
        if(res.success){
          this.builtyForm.controls.permitBalance.setValue(res.data.permitbalance);
          this.builtyForm.controls.permitEndDate.setValue(AppUtil.transformdate(res.data.enddate));
        }else{
          console.log(res.message);
        }
      }
    )
  }

  cancel(){
      this.router.navigate(['builtylist']);
  }

  get f(){ return this.builtyForm.controls;}
}
