import { Component, OnInit, ViewChild } from '@angular/core';
import { DoService } from '../../services/do.service'
import { BuiltyService } from '../../services/builty.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { PermitService } from '../../services/permit.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { CustomValidator } from '../../utils/custom.validator';
import { AppConfig } from '../../app-config';
import { DataService } from '../../services/data.service';
//import { resolve } from 'path';

@Component({
  selector: 'app-builty-create',
  templateUrl: './builty-create.component.html',
  styleUrls: ['./builty-create.component.css']
})
export class BuiltyCreateComponent implements OnInit {
  doList = []
  subTransporters = []
  isSearchvehicle = true;
  updatedFrights = [];
  vehicleListUrl: string = AppConfig.API_ENDPOINT + "/vehicle";
  activeDoList;
  destinationsParty = [];
  destinationNames = [];
  isbuiltyCompanyAdded: boolean = false;
  builtyDataforConfirmModel = {};
  savedBuilties = [];
  pumps = [];
  selectedDo;
  submitted: boolean = false;
  updateMode: boolean;
  builtyToUpdate;
  selectedVehicle;
  vehicleConfirmed;
  isValidaState: boolean = true;
  constructor(public builtyFormBuilder: FormBuilder,
    private doService: DoService,
    private builtyService: BuiltyService,
    private permitService: PermitService,
    private dataService: DataService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }




  @ViewChild('content') content;
  @ViewChild('confirmVehicleOwner') confirmVehicleOwner;

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        this.builtyToUpdate = this.builtyService.getBuiltyToUpdate();
        this.updateMode = params['update'];
        if(this.updateMode && !this.builtyToUpdate){
          this.router.navigate(['builtylist']);
          return;
        }

        this.builtyForm.reset();
        this.getActiveDOs();
        if(!this.updateMode){
          this.builtyForm.controls.doId.enable();
          this.getAllSavedBuilties();
        }else{
          this.builtyForm.controls.doId.disable();
          //this.populateBuiltyDetails(this.builtyToUpdate);
          //this.showDataAfterDoSelection(false);
        }
      }
    )
    this.getPumpNames();
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
    vehicleOwnerPan: [''],
    doOpeningbalance: [{ value: '', disabled: true }],
    inAdvance: [],
    outAdvance: ['', Validators.required],
    totalCashAdvance: [{ value: '', disabled: true }],
    diesel: ['', Validators.required],
    pumpName: ['', Validators.required],
    freight: ['', Validators.required],
    totalAdvance: [{ value: '', disabled: true }],
    permitRequired: [],
    permitNo: [''],
    permitBalance: [{ value: '', disabled: true }],
    permitEndDate: [{ value: '', disabled: true }],
    igpNo: [],
    invoiceNo: [],
    invoiceValue: [],
    driverName: ['', Validators.required],
    driverMobile: ['', [Validators.required, CustomValidator.mobileValidator]],
    grossWeight: ['', Validators.required],
    tierWeight: ['', Validators.required],
    doClosingBalance: [{ value: '', disabled: true }],
    subTransporter: [],
    tpRequired: [],
    waybillRequired: [],
    waybillNo: [],
    tpNo: [],
    netWeight: [{ value: '', disabled: true }],
    refund: ['', Validators.required],
    assesibleValue: [],
    freightToBePaidBy: ['', Validators.required],
    receivedDate: [],
    receivedQuantity: [],
    savedReferenceNumber: [],
    otherDeduction: [],
    deductionRemark:[],
    createdByFullName: [{value: '', disabled: true}],
    id: []
  }, {validator: this.validateConditionalFields()})

  validateConditionalFields(){
    return (group : FormGroup) => {
      let wayBillRequired = group.controls['waybillRequired'];
      let tpRequired = group.controls['tpRequired'];
      let permitRequired = group.controls['permitRequired'];
      if(wayBillRequired.value){
        if(!group.controls['waybillNo'].value){
          group.controls['waybillNo'].setErrors({required: true})
        }
        if(!group.controls['invoiceNo'].value){
          group.controls['invoiceNo'].setErrors({required: true})
        }
        if(!group.controls['invoiceValue'].value){
          group.controls['invoiceValue'].setErrors({required: true})
        }
        if(!group.controls['assesibleValue'].value){
          group.controls['assesibleValue'].setErrors({required: true})
        }
      }
      if(tpRequired.value){
        if(!group.controls['tpNo'].value){
          group.controls['tpNo'].setErrors({required: true})
        }
        if(!group.controls['igpNo'].value){
          group.controls['igpNo'].setErrors({required: true})
        }
      }
      if(permitRequired.value){
        if(!group.controls['permitNo'].value){
          group.controls['permitNo'].setErrors({required: true})
        }
      }
      return
    }
  }

  getPumpNames(){
    this.dataService.getPumpList().subscribe(
      (res) => {
        if(res.success){
          this.pumps = res.data;
        }
      }
    )
  }

  getAllSavedBuilties() {
    this.builtyService.getSavedbuilties().subscribe(
      (res) => {
        this.savedBuilties = res['data'];
      },
      (error) => {

      }
    )
  }

  getActiveDOs() {
    let doFunction;
    if(this.updateMode){
      doFunction = this.doService.getDoByID.bind(this.doService, this.builtyToUpdate.doId);
    }else{
      doFunction = this.doService.getActiveDos.bind(this.doService);
    }
    doFunction().subscribe(
      (res) => {
        if(this.updateMode){ // it will return single DO
          this.doList.push(res.data);
          this.builtyForm.controls.vehicleNo.setValue(this.builtyToUpdate.vehicleNo);
          this.builtyForm.controls.vehicleNo.disable();
          this.vehicleConfirmed = true
          this.populateBuiltyDetails(this.builtyToUpdate);
          this.showDataAfterDoSelection(false);
          this.populateDependentOptions();
        }else{ // it will return list of active DOs in response
            this.doList = res.data;
        }
      },
      (err) => {

      }
    );
  }

  showDataAfterDoSelection(isDoChanged) {
    let _selectedDOId = this.builtyForm.controls.doId.value;
    //when DO is manually changed from dropdown then reset the fields
    if (isDoChanged) {
      this.builtyForm.reset();
      this.builtyForm.controls.doId.setValue(_selectedDOId);
    }
    this.doList.forEach((element) => {
      if (element.id == _selectedDOId) {
        this.selectedDo = element;
        // if there is one element in destination party then select it by default
        if(element.destinationparty && element.destinationparty.length == 1){
          this.builtyForm.controls.party.setValue(element.destinationparty[0].name);
          this.onChangeDestinationsParty();
        }
        this.builtyForm.controls.doOpeningbalance.setValue(element.doBalance);
        this.subTransporters = element.subTransporter;
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
        this.builtyForm.controls.vehicleNo.setValue('');
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
    this.builtyForm.controls.id.setValue(element.id);
    this.builtyForm.controls.savedReferenceNumber.setValue(element.savedReferenceNumber);
    this.builtyForm.controls.doId.setValue(element.doId);
    this.builtyForm.controls.builtyDate.setValue(element.builtyDate)
    this.builtyForm.controls.otBuiltyCompany.setValue(element.otBuiltyCompany);
    this.builtyForm.controls.otBuiltyNumber.setValue(element.otBuiltyNumber);
    this.builtyForm.controls.party.setValue(element.party);
    this.builtyForm.controls.destination.setValue(element.destination);
    this.builtyForm.controls.doOpeningbalance.setValue(element.doOpeningbalance);
    this.builtyForm.controls.outAdvance.setValue(element.outAdvance);
    this.builtyForm.controls.inAdvance.setValue(element.inAdvance);
    this.builtyForm.controls.diesel.setValue(element.diesel);
    this.builtyForm.controls.pumpName.setValue(element.pumpName);
    this.builtyForm.controls.freight.setValue(element.freight);
    this.builtyForm.controls.totalCashAdvance.setValue(element.totalCashAdvance);
    this.builtyForm.controls.totalAdvance.setValue(element.totalAdvance);
    this.builtyForm.controls.permitRequired.setValue(element.permitNo ? 1 : 0);
    this.builtyForm.controls.permitNo.setValue(element.permitNo);
    this.builtyForm.controls.permitBalance.setValue(element.permitBalance);
    this.builtyForm.controls.permitEndDate.setValue(element.permitEndDate);
    this.builtyForm.controls.igpNo.setValue(element.igpNo);
    this.builtyForm.controls.invoiceValue.setValue(element.invoiceValue);
    this.builtyForm.controls.invoiceNo.setValue(element.invoiceNo);
    this.builtyForm.controls.driverName.setValue(element.driverName);
    this.builtyForm.controls.driverMobile.setValue(element.driverMobile);
    this.builtyForm.controls.grossWeight.setValue(element.grossWeight);
    this.builtyForm.controls.tierWeight.setValue(element.tierWeight);
    this.builtyForm.controls.doClosingBalance.setValue(element.doClosingBalance);
    this.builtyForm.controls.subTransporter.setValue(element.subTransporter);
    this.builtyForm.controls.waybillRequired.setValue(element.waybillNo ? 1 : 0);
    this.builtyForm.controls.waybillNo.setValue(element.waybillNo);
    this.builtyForm.controls.tpRequired.setValue(element.tpNo ? 1 : 0);
    this.builtyForm.controls.tpNo.setValue(element.tpNo);
    this.builtyForm.controls.receivedDate.setValue(element.receivedDate);
    this.builtyForm.controls.receivedQuantity.setValue(element.receivedQuantity);
    this.builtyForm.controls.netWeight.setValue(element.netWeight);
    this.builtyForm.controls.refund.setValue(element.refund);
    this.builtyForm.controls.assesibleValue.setValue(element.assesibleValue);
    this.builtyForm.controls.freightToBePaidBy.setValue(element.freightToBePaidBy);
    this.builtyForm.controls.otherDeduction.setValue(element.otherDeduction);
    this.builtyForm.controls.deductionRemark.setValue(element.deductionRemark);
    this.builtyForm.controls.createdByFullName.setValue(element.createdByFullName);
  }

  submitBuiltyforConfirmation() {
    if(this.builtyForm.invalid){
      this.toaster.error("Please correct the errors in form and then proceed");
      return;
    }
    if(!this.vehicleConfirmed){
      this.toaster.error("Vehicle owner details is not confirmed. Please slecte a vehicle and confirm owner details to proceed");
      return;
    }
    this.isValidaState = true;
    let _builtyData = this.builtyForm.getRawValue();

    //check if DO due date is passed
    if(Date.parse(_builtyData.builtyDate) > Date.parse(this.selectedDo.dueDate)){
      this.toaster.error("Can't create bilty as DO due date is passed");
      return;
    }

    //check if total advance is capped
    if(((_builtyData.netWeight * _builtyData.freight) - _builtyData.totalAdvance) < AppConfig.MIN_DIFF_WITH_FREIGHT){
      this.toaster.error("Difference between total freight and total advance should be more than or equal to " + AppConfig.MIN_DIFF_WITH_FREIGHT);
      return;
    }

    _builtyData.builtyDate = _builtyData.builtyDate;
    _builtyData.permitEndDate = _builtyData.permitEndDate;
    this.builtyDataforConfirmModel = _builtyData;
    this.builtyDataforConfirmModel['doDisplay'] = this.selectedDo.doDisplay;
    this.modalService.open(this.content);
  }

  createBuilty() {
    this.isValidaState = false;
    this.builtyService.createBuilty(this.builtyDataforConfirmModel).subscribe(
      (res) => {
        if(res.success){
            this.toaster.success(res.message);
            this.selectedDo.doBalance = res.data.doClosingBalance;
            this.clearBuiltyForm();
            this.builtyService.setActiveBuilties([]);
            this.submitted = false;
            alert("Bilty Number is " + res.data.builtyNo);
        }else{
            this.toaster.error(res.message);
        }
        this.modalService.dismissAll();

      },
      (error) => {
        this.isValidaState = true;
        this.toaster.error("error in builty creation");
      })
  }

  saveBuilty() {

    let _builtyData = this.builtyForm.getRawValue();
    // if(_builtyData.vehicleNo && !this.vehicleConfirmed){
    //   this.toaster.error("Vehicle number is not confirmed. To proceed with saving please remove vehicle details or confirm the vehicle number");
    //   return;
    // }
        //this.builtyDataforConfirmModel = _builtyData
        _builtyData.doDisplay = this.selectedDo.doDisplay;
        //_builtyData.builtyDate = _builtyData.builtyDate;
        //_builtyData.permitEndDate = _builtyData.permitEndDate;
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
  // transform all date values
  // _builty.builtyDate = AppUtil.transformdate(_builty.builtyDate);
  // _builty.permitEndDate = AppUtil.transformdate(_builty.permitEndDate);
  // _builty.receivedDate = AppUtil.transformdate(_builty.receivedDate);

  _builty.id = this.builtyToUpdate.id;
  _builty.doDisplay = this.builtyToUpdate.doDisplay;
  _builty.approved = this.builtyToUpdate.approved;
  _builty.builtyNo = this.builtyToUpdate.builtyNo;
  _builty.createdBy = this.builtyToUpdate.createdBy;
  _builty.createdDateTime = this.builtyToUpdate.createdDateTime;
  _builty.paymentInstructionDateTime = this.builtyToUpdate.paymentInstructionDateTime;
  _builty.freightBill = this.builtyToUpdate.freightBill;
  _builty.vehicleOwnerPan = this.builtyToUpdate.vehicleOwnerPan;
  this.builtyService.updateBuilty(_builty).subscribe(
    (res) => {
      if(res.success){
        this.toaster.success(res.message);
        //this.builtyToUpdate = res.data;
        this.builtyService.setActiveBuilties([]);
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
        // if there is only one destination then select it by default
        if(this.destinationNames.length == 1){
            this.builtyForm.controls.destination.setValue(this.destinationNames[0]);
        }
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
    let _refund = this.builtyForm.controls.refund.value;
    if(_inadvnace){
        _inadvnace = parseInt(_inadvnace);
    }else{
      _inadvnace = 0;
    }
    this.builtyForm.controls.totalCashAdvance.setValue(_inadvnace + _outadvnace +_refund)
    this.builtyForm.controls.totalAdvance.setValue(this.builtyForm.controls.totalCashAdvance.value + _diesel)
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
          this.builtyForm.controls.permitEndDate.setValue(res.data.enddate);
        }else{
          console.log(res.message);
        }
      }
    )
  }

  onSelectItem(selectedVehicle){
    this.selectedVehicle = selectedVehicle;
    this.modalService.open(this.confirmVehicleOwner);
  }

  onConfirmVehicle(){
    this.vehicleConfirmed = true;
    this.builtyForm.controls.vehicleNo.setValue(this.selectedVehicle.vehicleNo);
    this.builtyForm.controls.vehicleOwnerPan.setValue(this.selectedVehicle.panNo);
  }

  cancel(){
      this.router.navigate(['builtylist']);
  }

  checkState(){
    return !this.isValidaState;
  }

  get f(){ return this.builtyForm.controls;}
}
