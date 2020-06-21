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
  biltyCompanies = []
  // isbuiltyCompanyAdded: boolean = false;
  builtyDataforConfirmModel = {};
  savedBuilties = [];
  pumps = [];
  selectedDo;
  submitted: boolean = false;
  updateMode: boolean;
  biltyToUpdate;
  selectedVehicle;
  vehicleConfirmed;
  isValidaState: boolean = true;
  loggedInDomain: string
  constructor(public biltyFormBuilder: FormBuilder,
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
        this.biltyToUpdate = this.builtyService.getbiltyToUpdate();
        this.updateMode = params['update'];
        if(this.updateMode && !this.biltyToUpdate){
          this.router.navigate(['builtylist']);
          return;
        }

        this.biltyForm.reset();
        this.getActiveDOs();
        if(!this.updateMode){
          this.biltyForm.controls.doId.enable();
          this.getAllSavedBuilties();
        }else{
          this.biltyForm.controls.doId.disable();
          //this.populateBuiltyDetails(this.biltyToUpdate);
          //this.showDataAfterDoSelection(false);
        }
      }
    )
    this.getPumpNames();
    this.loggedInDomain = localStorage.getItem('loggedInDomain');
  }

  biltyForm = this.biltyFormBuilder.group({
    biltyNo: [],
    doId: ['', Validators.required],
    doDisplay: [],
    party: ['', Validators.required],
    destination: ['', Validators.required],
    builtyDate: ['', Validators.required],
    otBiltyCompany: [],
    otBiltyNumber: [],
    vehicleNo: ['', Validators.required],
    vehicleOwnerPan: [''],
    doOpeningbalance: [{ value: '', disabled: true }],
    inAdvance: [],
    outAdvance: ['', Validators.required],
    totalCashAdvance: [{ value: '', disabled: true }],
    diesel: ['', Validators.required],
    pumpName: [],
    freight: ['', Validators.required],
    totalAdvance: [{ value: '', disabled: true }],
    permitRequired: [],
    permitNo: [''],
    permitBalance: [{ value: '', disabled: true }],
    permitEndDate: [{ value: '', disabled: true }],
    party2: [],
    accountName: [],
    code: [],
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
    otherDeduction: [],
    deductionRemark:[],
    createdByFullName: [{value: '', disabled: true}],
    id: []
  }, {validator: this.validateConditionalFields()})

  validateConditionalFields(){
    return (group : FormGroup) => {
      group.controls['waybillNo'].setErrors(null)
      group.controls['invoiceNo'].setErrors(null)
      group.controls['invoiceValue'].setErrors(null)
      group.controls['assesibleValue'].setErrors(null)
      group.controls['tpNo'].setErrors(null)
      group.controls['igpNo'].setErrors(null)
      group.controls['permitNo'].setErrors(null)
      group.controls['pumpName'].setErrors(null)
      let _wayBillRequired = group.controls['waybillRequired'];
      let _tpRequired = group.controls['tpRequired'];
      let _permitRequired = group.controls['permitRequired'];
      let _diesel = group.controls['diesel'];
      if(_wayBillRequired.value){
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
      if(_tpRequired.value){
        if(!group.controls['tpNo'].value){
          group.controls['tpNo'].setErrors({required: true})
        }
        if(!group.controls['igpNo'].value){
          group.controls['igpNo'].setErrors({required: true})
        }
      }
      if(_permitRequired.value){
        if(!group.controls['permitNo'].value){
          group.controls['permitNo'].setErrors({required: true})
        }
      }
      if(_diesel.value){
        if(!group.controls['pumpName'].value){
          group.controls['pumpName'].setErrors({required: true})
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
        if(res.success){
          this.savedBuilties = res.data;
        }
      },
      (error) => {

      }
    )
  }

  getActiveDOs() {
    let doFunction;
    if(this.updateMode){
      doFunction = this.doService.getDoByID.bind(this.doService, this.biltyToUpdate.doId);
    }else{
      doFunction = this.doService.getActiveDos.bind(this.doService);
    }
    doFunction().subscribe(
      (res) => {
        if(this.updateMode){ // it will return single DO
          this.doList.push(res.data);
          this.biltyForm.controls.vehicleNo.setValue(this.biltyToUpdate.vehicleNo);
          this.biltyForm.controls.vehicleNo.disable();
          this.vehicleConfirmed = true
          this.populateBuiltyDetails(this.biltyToUpdate);
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
    let _selectedDOId = this.biltyForm.controls.doId.value;
    //when DO is manually changed from dropdown then reset the fields
    if (isDoChanged) {
      this.biltyForm.reset();
      this.biltyForm.controls.doId.setValue(_selectedDOId);
    }
    this.doList.forEach((element) => {
      if (element.id == _selectedDOId) {
        this.selectedDo = element;
        this.selectIfSingleEntryOption();
        this.biltyForm.controls.doOpeningbalance.setValue(element.doBalance);
        this.subTransporters = element.subTransporter;
        this.biltyCompanies = [];
        if (element.otBiltyCompany && element.otBiltyCompany.length) {
          element.otBiltyCompany.forEach(elem => {
            if(elem.uniqueShortName !== this.loggedInDomain){
                this.biltyCompanies.push(elem);
            }
          });
        }
      }
    })
  }

  selectIfSingleEntryOption(){
    if(this.selectedDo){
      // if there is one element in following dropdown fields then select it by default
      if(this.selectedDo.destinationParty && this.selectedDo.destinationParty.length == 1){
        this.biltyForm.controls.party.setValue(this.selectedDo.destinationParty[0].name);
        //since destination party is selected by default trigger to set dependent fields
        this.populateDependentOptions();
      }
      if(this.selectedDo.party2 && this.selectedDo.party2.length == 1){
        this.biltyForm.controls.party2.setValue(this.selectedDo.party2[0].name);
      }
      if(this.selectedDo.accountName && this.selectedDo.accountName.length == 1){
        this.biltyForm.controls.accountName.setValue(this.selectedDo.accountName[0].name);
      }
      if(this.selectedDo.code && this.selectedDo.code.length == 1){
        this.biltyForm.controls.code.setValue(this.selectedDo.code[0].name);
      }
    }
  }


  showDataAfterSavedBuiltySelection(evt) {

    if (evt.target.value == "notSelected") {
      this.clearbiltyForm();
      return;
    }
    this.clearbiltyForm();
    this.savedBuilties.forEach(element => {

      if (element.id == evt.target.value) {
        this.biltyForm.controls.vehicleNo.setValue('');
        this.populateBuiltyDetails(element);
        this.showDataAfterDoSelection(false);
        this.populateDependentOptions();
        this.calculateDoClosingBalance();
        this.calculateTotalCashAdvance();
      }
    });
  }

  populateBuiltyDetails(element: any){
    // if (element.otBiltyCompany) {
    //   this.isbuiltyCompanyAdded = true;
    // }
    // else {
    //   this.isbuiltyCompanyAdded = false;
    // }
    this.biltyForm.controls.id.setValue(element.id);
    this.biltyForm.controls.doId.setValue(element.doId);
    this.biltyForm.controls.builtyDate.setValue(element.builtyDate)
    this.biltyForm.controls.otBiltyCompany.setValue(element.otBiltyCompany);
    this.biltyForm.controls.otBiltyNumber.setValue(element.otBiltyNumber);
    this.biltyForm.controls.party.setValue(element.party);
    this.biltyForm.controls.destination.setValue(element.destination);
    this.biltyForm.controls.doOpeningbalance.setValue(element.doOpeningbalance);
    this.biltyForm.controls.outAdvance.setValue(element.outAdvance);
    this.biltyForm.controls.inAdvance.setValue(element.inAdvance);
    this.biltyForm.controls.diesel.setValue(element.diesel);
    this.biltyForm.controls.pumpName.setValue(element.pumpName);
    this.biltyForm.controls.freight.setValue(element.freight);
    this.biltyForm.controls.totalCashAdvance.setValue(element.totalCashAdvance);
    this.biltyForm.controls.totalAdvance.setValue(element.totalAdvance);
    this.biltyForm.controls.permitRequired.setValue(element.permitNo ? 1 : 0);
    this.biltyForm.controls.permitNo.setValue(element.permitNo);
    this.biltyForm.controls.permitBalance.setValue(element.permitBalance);
    this.biltyForm.controls.permitEndDate.setValue(element.permitEndDate);
    this.biltyForm.controls.party2.setValue(element.party2);
    this.biltyForm.controls.accountName.setValue(element.accountName);
    this.biltyForm.controls.code.setValue(element.code);
    this.biltyForm.controls.igpNo.setValue(element.igpNo);
    this.biltyForm.controls.invoiceValue.setValue(element.invoiceValue);
    this.biltyForm.controls.invoiceNo.setValue(element.invoiceNo);
    this.biltyForm.controls.driverName.setValue(element.driverName);
    this.biltyForm.controls.driverMobile.setValue(element.driverMobile);
    this.biltyForm.controls.grossWeight.setValue(element.grossWeight);
    this.biltyForm.controls.tierWeight.setValue(element.tierWeight);
    this.biltyForm.controls.doClosingBalance.setValue(element.doClosingBalance);
    this.biltyForm.controls.subTransporter.setValue(element.subTransporter);
    this.biltyForm.controls.waybillRequired.setValue(element.waybillNo ? 1 : 0);
    this.biltyForm.controls.waybillNo.setValue(element.waybillNo);
    this.biltyForm.controls.tpRequired.setValue(element.tpNo ? 1 : 0);
    this.biltyForm.controls.tpNo.setValue(element.tpNo);
    this.biltyForm.controls.receivedDate.setValue(element.receivedDate);
    this.biltyForm.controls.receivedQuantity.setValue(element.receivedQuantity);
    this.biltyForm.controls.netWeight.setValue(element.netWeight);
    this.biltyForm.controls.refund.setValue(element.refund);
    this.biltyForm.controls.assesibleValue.setValue(element.assesibleValue);
    this.biltyForm.controls.freightToBePaidBy.setValue(element.freightToBePaidBy);
    this.biltyForm.controls.otherDeduction.setValue(element.otherDeduction);
    this.biltyForm.controls.deductionRemark.setValue(element.deductionRemark);
    this.biltyForm.controls.createdByFullName.setValue(element.createdByFullName);
  }

  submitBuiltyforConfirmation() {
    if(this.biltyForm.invalid){
      this.toaster.error("Please correct the errors in form and then proceed");
      return;
    }
    if(!this.vehicleConfirmed){
      this.toaster.error("Vehicle owner details is not confirmed. Please slecte a vehicle and confirm owner details to proceed");
      return;
    }
    this.isValidaState = true;
    let _builtyData = this.biltyForm.getRawValue();

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
            this.clearbiltyForm();
            this.builtyService.setActiveBuilties([]);
            this.submitted = false;
            alert("Bilty Number is " + res.data.biltyNo);
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

    let _builtyData = this.biltyForm.getRawValue();
        _builtyData.doDisplay = this.selectedDo.doDisplay;
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
  if(this.biltyForm.invalid){
    this.toaster.error("Please correct the errors in form and then proceed");
    return;
  }
  let _bilty = this.biltyForm.getRawValue();

  this.retainValuesNotInForm(_bilty)
  this.builtyService.updateBuilty(_bilty).subscribe(
    (res) => {
      if(res.success){
        this.toaster.success(res.message);
        //this.biltyToUpdate = res.data;
        this.builtyService.setActiveBuilties([]);
        this.router.navigate(['builtylist']);
      }else{
        this.toaster.error(res.message);
      }
    }
  )
}

retainValuesNotInForm(_bilty: any){
  _bilty.id = this.biltyToUpdate.id;
  _bilty.doDisplay = this.biltyToUpdate.doDisplay;
  _bilty.approved = this.biltyToUpdate.approved;
  _bilty.biltyNo = this.biltyToUpdate.biltyNo;
  _bilty.createdBy = this.biltyToUpdate.createdBy;
  _bilty.createdDateTime = this.biltyToUpdate.createdDateTime;
  _bilty.paymentInstructionDateTime = this.biltyToUpdate.paymentInstructionDateTime;
  _bilty.freightBill = this.biltyToUpdate.freightBill;
  _bilty.vehicleOwnerPan = this.biltyToUpdate.vehicleOwnerPan;
  _bilty.paymentStatus = this.biltyToUpdate.paymentStatus;
  _bilty.tdsApplicable = this.biltyToUpdate.tdsApplicable;
  _bilty.tdsAmount = this.biltyToUpdate.tdsAmount;
  _bilty.deductionRate = this.biltyToUpdate.deductionRate;
  _bilty.shortageLimit = this.biltyToUpdate.shortageLimit;
  _bilty.comission = this.biltyToUpdate.comission;
}

  populateDependentOptions(){
      this.onChangeDestinationsParty();
      this.onChangeDestinations();
  }
  //evt is required for onclick event.
  onChangeDestinationsParty() {
    this.destinationNames = [];
    this.updatedFrights = [];
    this.selectedDo.destinationParty.forEach(element => {
      if (this.biltyForm.controls.party.value == element.name) {
        element.destinations.forEach(dest => {
          this.destinationNames.push(dest.name);
        });
        // if there is only one destination then select it by default
        if(this.destinationNames.length == 1){
            this.biltyForm.controls.destination.setValue(this.destinationNames[0]);
        }
      }
    });
  }

  onChangeDestinations() {
    this.updatedFrights = [];
    let _selectedDestParty = this.biltyForm.controls.party.value;
    this.selectedDo.destinationParty.forEach(element_destinationParty => {
      if (_selectedDestParty == element_destinationParty.name) {
        element_destinationParty.destinations.forEach(element_destinations => {
          if (this.biltyForm.controls.destination.value == element_destinations.name)
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
    let _inadvnace = this.biltyForm.controls.inAdvance.value;
    let _outadvnace = this.biltyForm.controls.outAdvance.value;
    let _diesel = this.biltyForm.controls.diesel.value;
    let _refund = this.biltyForm.controls.refund.value;
    if(_inadvnace){
        _inadvnace = parseInt(_inadvnace);
    }else{
      _inadvnace = 0;
    }
    this.biltyForm.controls.totalCashAdvance.setValue(_inadvnace + _outadvnace +_refund)
    this.biltyForm.controls.totalAdvance.setValue(this.biltyForm.controls.totalCashAdvance.value + _diesel)
  }

  calculateDoClosingBalance() {
    let _netweigth = this.biltyForm.controls.netWeight.value;
    let _doOpeningbalance = this.biltyForm.controls.doOpeningbalance.value;

    this.biltyForm.controls.doClosingBalance.setValue(_doOpeningbalance - _netweigth)

  }

  calculateNetWeight(){
    let _grossweight = this.biltyForm.controls.grossWeight.value,
        _tierweight = this.biltyForm.controls.tierWeight.value;
    this.biltyForm.controls.netWeight.setValue(_grossweight - _tierweight);
    this.calculateDoClosingBalance();
  }
  clearbiltyForm() {
    this.biltyForm.reset();
  }

  getPermitDetails(){
    let _permitnumber = this.biltyForm.controls.permitNo.value;
    this.permitService.getPermit(parseInt(_permitnumber)).subscribe(
      (res) => {
        if(res.success){
          this.biltyForm.controls.permitBalance.setValue(res.data.permitbalance);
          this.biltyForm.controls.permitEndDate.setValue(res.data.enddate);
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
    this.biltyForm.controls.vehicleNo.setValue(this.selectedVehicle.vehicleNo);
    this.biltyForm.controls.vehicleOwnerPan.setValue(this.selectedVehicle.panNo);
  }

  cancel(){
      this.router.navigate(['builtylist']);
  }

  checkState(){
    return !this.isValidaState;
  }

  get f(){ return this.biltyForm.controls;}
}
