import { Component, OnInit, ViewChild } from '@angular/core'
import { Validators, FormBuilder } from '@angular/forms'
import { DoService } from '../../services/do.service'
import { ActivatedRoute, Router } from '@angular/router'

import { DODetails } from '../../model/do-details.model'
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermitService } from '../../services/permit.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileUploader } from '../../../../node_modules/ng2-file-upload';
import { FileUploadService } from '../../services/fileupload.service';
import { AppUtil } from '../../utils/app.util';
import { Observable } from 'rxjs';
import { AppConstants } from '../../utils/app.constants';


@Component({
  selector: 'app-do-create',
  templateUrl: './do-create.component.html',
  styleUrls: ['./do-create.component.css']
})
export class DoCreateComponent implements OnInit {

  IN_ADVANCE: number = 1
  SHORTAGE_LIMIT: number = 2
  DEDUCTION_RATE: number = 3
  COMMISSION: number = 4
  ACCOUNT_NAME: number = 5
  CODE: number = 6
  SUB_TRANSPORTER: number = 7

  doCreateForm
  doDetails: DODetails;
  submitted: boolean;
  isShowDoUpdate: boolean = false;
  receivedDateforDue = new Date();
  dataToShowInFreightsTable = [];
  uploader: FileUploader;

  ref_collaryList: Array<string>;
  ref_areaList: Array<any>
  ref_partyData = []
  ref_destinationData = []
  ref_transporters = []
  permits = []
  destinationsNames: Array<String>;
  destinationParty = [];
  selectedDestinations = [];
  selectedFreight = [];
  selecteddo;
  enableDueDate;
  billDate;
  billAmount;
  billQuantity;

  isfrightEntryAdded: boolean = false;
  createDoOnConfirmData;
  isValidaState: boolean = true;

  constructor(private doFormBuilder: FormBuilder,
    private doService: DoService,
    private userService: UserService,
    private permitservice: PermitService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private uploaderService: FileUploadService) { }

  refData = {};
  modeSelect = "Create DO";
  inAdvanceLimitList = []
  subTransporterList = []
  shortageLimitList = []
  deductionRateList = []
  commissionList = []
  accountNameList = []
  codeList = []

  grades = ['G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13'];
  sizes = ["ROM", "SLK", "STM"]

  freightToBePaidByOptions = [AppConstants.DO_OWNER, AppConstants.BILTY_COMPANY];
  builtyCompanyOptions = []
  inAdvanceLimitEntries = [];
  subTransporterEntries = [];
  shortageLimitEntries = [];
  deductionRateEntries = [];
  commissionEntries = [];
  accountNameEntries = []
  codeEntries = []

  multiDropDownSettings = {}
  biltyCompanyDropDownSettings = {}
  permitDropDownSettings = {}
  party2DropDownSettings = {}

  @ViewChild('content') content;

  ngOnInit() {
    //get bilty companies
    this.doService.getBiltyCompanies().subscribe(
      (res) => {
        if(res.success){
          this.builtyCompanyOptions = res.data
        }
      },
      (err) => {
        console.log('Error getting bilty companies')
      }
    )
    this.spinner.show()
    this.ref_areaList = [];
    this.ref_collaryList = [];
    this.doDetails = new DODetails()

    localStorage.getItem('currentRole') === AppUtil.ROLE_ADMIN ? this.enableDueDate=true : this.enableDueDate=false;

    this.doCreateForm = this.doFormBuilder.group({
      bspDoNo: ['', Validators.required],
      areaDoNo: ['', Validators.required],
      doNo: [{ value: [], disabled: true }, Validators.required],
      auctionNo: ['', Validators.required],
      quantity: ['', Validators.required],
      doDate: ['', Validators.required],
      receivedDate: ['', Validators.required],
      dueDate: [{ value: '', disabled: !this.enableDueDate }, Validators.required],
      size: ['', Validators.required],
      party: ['', Validators.required],
      area: ['', Validators.required],
      collary: ['', Validators.required],
      grade: ['', Validators.required],
      by: ['', Validators.required],
      otBiltyCompany: ['', Validators.required],
      transporter: ['', Validators.required],
      destinationParty: [],
      destinations: [],
      addedDestinationParty: [],
      addedDestinations: [],
      freight: [],
      billEntries:[],
      permitNos: [],
      emd: [],
      emdAmt: [{ value: '', disabled: true }],
      doAmt: [],
      doAmtpmt: [{ value: '', disabled: true }],
      doRate: [],
      doRateTcs: [],
      withinOutSide: [],
      quantityDeduction: [],
      lepseQuantity: [],
      doStatus: [],
      refundAmt: [],
      refundDate: [],
      tdsRate: [],
      website: [],
      finishDate: [],
      remarks: [],
      inAdvanceLimit: [],
      shortageLimit: [],
      deductionRate: [],
      commission: [],
      party2: [],
      accountName: [],
      code: [],
      freightToBePaidBy: [],
      subTransporter:[],
      doCopy: []
    })

    this.route.queryParams.subscribe(
      (params) => {
        this.selecteddo = null;
        this.loadrefDataForDOCreate().subscribe(
          (res) => {
            // 3 means refData, transporter and permits is loaded, which is required to create/update DO
            if(res == 3){
              let _updateDOID = params['update'];
              if (_updateDOID != undefined) {
                this.getDOForUpdate(_updateDOID);
              }
              else {
                this.applyCreateMode();
              }
            }
          }
        );

      }
    );
    this.uploader = this.uploaderService.getFileUploader();
    // add a event listner which will check the queue and delete any existing file in fileQueue
    // because there should be always 1 file in DO.
    this.uploader.onAfterAddingFile = file => {
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
    }
    this.multiDropDownSettings = {
      itemsShowLimit: 1,
      enableCheckAll: false
    }
    this.biltyCompanyDropDownSettings = {
      itemsShowLimit: 1,
      enableCheckAll: false,
      idField: 'uniqueShortName',
      textField: 'companyName'
    }
    this.permitDropDownSettings = {
      itemsShowLimit: 1,
      enableCheckAll: false,
      idField: 'permitnumber',
      textField: 'permitnumber'
    }
    this.party2DropDownSettings = {
      itemsShowLimit: 1,
      enableCheckAll: false,
      idField: 'name',
      textField: 'name'
    }
  }

  addEntry(evt, entryType) {
    //console.log(evt);
    switch(entryType){
      case this.IN_ADVANCE:
        this.inAdvanceLimitList.push(evt.value);
        break;
      case this.SHORTAGE_LIMIT:
        this.shortageLimitList.push(evt.value);
        break;
      case this.DEDUCTION_RATE:
        this.deductionRateList.push(evt.value);
        break;
      case this.COMMISSION:
        this.commissionList.push(evt.value);
        break;
      case this.ACCOUNT_NAME:
        this.accountNameList.push(evt.value);
        break;
      case this.CODE:
        this.codeList.push(evt.value);
        break;
      case this.SUB_TRANSPORTER:
        this.subTransporterList.push(evt.value);
        break;
    }
  }

  removeEntry(evt, entryType) {
    switch(entryType){
      case this.IN_ADVANCE:
        this.inAdvanceLimitList = this.inAdvanceLimitList.filter((e => e != evt.value))
        break;
      case this.SHORTAGE_LIMIT:
        this.shortageLimitList = this.shortageLimitList.filter((e => e != evt.value))
        break;
      case this.DEDUCTION_RATE:
        this.deductionRateList = this.deductionRateList.filter((e => e != evt.value))
        break;
      case this.COMMISSION:
        this.commissionList = this.commissionList.filter((e => e != evt.value))
        break;
      case this.ACCOUNT_NAME:
        this.accountNameList = this.accountNameList.filter((e => e != evt.value))
        break;
      case this.CODE:
        this.codeList = this.codeList.filter((e => e != evt.value))
        break;
      case this.SUB_TRANSPORTER:
        this.subTransporterList = this.subTransporterList.filter((e => e != evt.value))
        break;
    }

  }

  onSubmitDo() {
    this.submitted = true;
    if (this.doCreateForm.invalid) {
      this.toaster.error("Please correct the errors in form");
      return;
    }
    this.isValidaState = true;
    let doCreationData = this.doCreateForm.getRawValue();
    this.modifyDODataBeforeSubmit(doCreationData);

    this.getSelectedParty().then((data) => {
      doCreationData.party = data;
      doCreationData.doDisplay = doCreationData.areaDoNo + "/" + doCreationData.bspDoNo + "-" + doCreationData.collary + "-" + doCreationData.quantity
      this.createDoOnConfirmData = doCreationData;
      this.modalService.open(this.content);
    })
  }

  onUpdateSubmit() {
    this.submitted = true;
    if (this.doCreateForm.invalid) {
      this.toaster.error("Please correct the errors in form");
      return;
    }
    let doCreationData = this.doCreateForm.getRawValue();
    this.modifyDODataBeforeSubmit(doCreationData);

    doCreationData.id = this.selecteddo.id;
    doCreationData.createdBy = this.selecteddo.createdBy;
    doCreationData.createdDateTime = this.selecteddo.createdDateTime;
    doCreationData.doBalance = this.selecteddo.doBalance;
    if (this.uploader.queue && this.uploader.queue.length) {
      doCreationData.doCopy = this.uploaderService.getFileNameForDO(this.doCreateForm.controls.doCopy.value, doCreationData.bspDoNo, doCreationData.areaDoNo);
    } else {
      doCreationData.doCopy = this.selecteddo.doCopy;
    }
    if (this.selecteddo.finishDate) {
      doCreationData.finishDate = this.selecteddo.finishDate;
    }
    this.getSelectedParty().then((data) => {
      doCreationData.party = data;
      this.updateDO(doCreationData);
    })

  }

  modifyDODataBeforeSubmit(doCreationData) {
    delete doCreationData.party;
    delete doCreationData.destinationParty;
    delete doCreationData.freight;
    delete doCreationData.addedDestinationParty;
    delete doCreationData.addedDestinations;
    delete doCreationData.destinations;

    doCreationData.destinationParty = this.destinationParty;

    //TODO this is temporary solution to get it work.
    doCreationData.inAdvanceLimit = this.inAdvanceLimitList;
    doCreationData.subTransporter = this.subTransporterList;
    doCreationData.shortageLimit = this.shortageLimitList;
    doCreationData.deductionRate = this.deductionRateList;
    doCreationData.commission = this.commissionList;
    this.getSelectedTransporter(doCreationData.transporter).
      then((data) => {
        doCreationData.transporter = data;
      })
  }

  getSelectedTransporter(username) {
    return new Promise((resolve, reject) => {
      this.ref_transporters.forEach(element => {
        if (element.username === username) {
          resolve(element);
        }
      });
    })
  }

  loadrefDataForDOCreate() {
    const refDataObservable = new Observable((observer) => {
      let refdataCounter = 0;
      // get ref data like area, party, destination
      this.doService.getdoRefData().subscribe(
        (res) => {
          this.refData = res["data"];
          this.ref_areaList = this.refData["areaList"];
          this.ref_partyData = this.refData["partyList"];
          this.ref_destinationData = this.refData["partyList"]
          this.populatecollary(true);
          setTimeout(() => {
            this.spinner.hide();
          }, 1500)
          observer.next(++refdataCounter)

        },
        (error) => {
          this.spinner.hide()
          this.toaster.error("error occured while retrieving refdata " + error);
          observer.complete()
        }
      )

      // get transporter list
      this.userService.getByRole("ROLE_FIELD").subscribe(
        (res) => {
          this.ref_transporters = res["data"];
          observer.next(++refdataCounter)
        },
        (error) => {
          console.log("could not retrieve transporters list " + error)
          observer.complete()
        }
      )

      // load permits
      this.permitservice.getpermits().subscribe(
        (res) => {
          if (res.success) {
            this.permits = res.data;
            observer.next(++refdataCounter)
          }
        },
        (err) => {
          (error) => {
            console.log("could not load permit data " + error)
            observer.complete()
          }
        }
      )
    })
    return refDataObservable;
  }

  createDo() {
    this.isValidaState = false;
    this.createDoOnConfirmData.doCopy = this.uploaderService.getFileNameForDO(this.createDoOnConfirmData.doCopy, this.createDoOnConfirmData.bspDoNo, this.createDoOnConfirmData.areaDoNo);
    this.doService.createDo(this.createDoOnConfirmData).subscribe(
      (res) => {
        this.modalService.dismissAll();
        if (res.success) {
          this.submitted = false;
          this.doCreateForm.reset();
          this.toaster.success(res.message);
        } else {
          this.toaster.error(res.message);
        }
      },
      () => {
        this.isValidaState = true;
        this.toaster.error("Internal Server error!");
      }
    )
    this.initiateFileUpload();
  }

  getDOForUpdate(id) {
    this.doService.getDoByID(id).subscribe(
      (res) => {
        if(res.success){
          this.applyUpdateMode();
          this.selecteddo = res['data'];
          this.setDataToUpdateForm(this.selecteddo);
        }
      },
      () => {
        this.toaster.error("not able to find the required DO information");
      })
  }

  setlepseQuantity() {
    if(this.selecteddo){
      let _doQuantity = this.doCreateForm.controls.quantity.value;
      let _liftedQuantityUpdate = _doQuantity - this.selecteddo.doBalance
      let _quantityDeductionUpdate = this.doCreateForm.controls.quantityDeduction.value
      this.doCreateForm.controls.lepseQuantity.setValue(_doQuantity - _liftedQuantityUpdate - _quantityDeductionUpdate);
    }else{
      this.doCreateForm.controls.lepseQuantity.setValue(0);
    }
  }

  setEMDAMt() {
    console.log("emd at");
    let _emd = this.doCreateForm.controls.emd.value;
    let _doQuantity = this.doCreateForm.controls.quantity.value;
    this.doCreateForm.controls.emdAmt.setValue(_emd * _doQuantity);
  }

  setDOAMtPMT() {
    let _doAmt = this.doCreateForm.controls.doAmt.value;
    let _doQuantity = this.doCreateForm.controls.quantity.value;
    this.doCreateForm.controls.doAmtpmt.setValue(_doAmt / _doQuantity);
  }

  setDataToUpdateForm(data) {
    this.doCreateForm.controls.bspDoNo.setValue(data.bspDoNo);
    this.doCreateForm.controls.bspDoNo.disable();
    this.doCreateForm.controls.areaDoNo.setValue(data.areaDoNo);
    this.doCreateForm.controls.auctionNo.setValue(data.auctionNo)
    this.doCreateForm.controls.collary.setValue(data.collary)
    this.doCreateForm.controls.quantity.setValue(data.quantity)
    this.doCreateForm.controls.doDate.setValue(data.doDate)
    this.doCreateForm.controls.dueDate.setValue(data.dueDate)
    this.doCreateForm.controls.grade.setValue(data.grade)
    this.doCreateForm.controls.size.setValue(data.size)
    this.doCreateForm.controls.area.setValue(data.area)
    this.doCreateForm.controls.by.setValue(data.by)
    this.doCreateForm.controls.otBiltyCompany.setValue(data.otBiltyCompany)
    this.doCreateForm.controls.permitNos.setValue(data.permitNos)
    this.doCreateForm.controls.party2.setValue(data.party2)
    this.doCreateForm.controls.emd.setValue(data.emd)
    this.doCreateForm.controls.doAmt.setValue(data.doAmt)
    this.doCreateForm.controls.doAmtpmt.setValue(data.doAmtpmt)
    this.doCreateForm.controls.doRate.setValue(data.doRate)
    this.doCreateForm.controls.doRateTcs.setValue(data.doRateTcs)
    this.doCreateForm.controls.party.setValue(data.party.name)
    this.doCreateForm.controls.withinOutSide.setValue(data.withinOutSide)
    this.doCreateForm.controls.receivedDate.setValue(data.receivedDate)
    this.doCreateForm.controls.quantityDeduction.setValue(data.quantityDeduction)
    this.doCreateForm.controls.remarks.setValue(data.remarks)
    this.doCreateForm.controls.refundDate.setValue(data.refundDate)
    this.doCreateForm.controls.refundAmt.setValue(data.refundAmt)
    this.doCreateForm.controls.tdsRate.setValue(data.tdsRate)
    this.doCreateForm.controls.website.setValue(data.website)
    this.doCreateForm.controls.freightToBePaidBy.setValue(data.freightToBePaidBy)
    this.inAdvanceLimitList = data.inAdvanceLimit;
    this.populateMultipleValuesForUpdate(data.inAdvanceLimit, this.IN_ADVANCE)
    this.shortageLimitList = data.shortageLimit;
    this.populateMultipleValuesForUpdate(data.shortageLimit, this.SHORTAGE_LIMIT)
    this.deductionRateList = data.deductionRate;
    this.populateMultipleValuesForUpdate(data.deductionRate, this.DEDUCTION_RATE)
    this.commissionList = data.commission;
    this.populateMultipleValuesForUpdate(data.commission, this.COMMISSION)
    this.accountNameList = data.accountName;
    this.populateMultipleValuesForUpdate(data.accountName, this.ACCOUNT_NAME);
    this.codeList = data.code;
    this.populateMultipleValuesForUpdate(data.code, this.CODE);
    this.subTransporterList = data.subTransporter;
    this.populateMultipleValuesForUpdate(data.subTransporter, this.SUB_TRANSPORTER);
    //this.inAdvanceLimitEntries = data.inAdvanceLimit
    this.doCreateForm.controls.lepseQuantity.setValue(data.lepseQuantity)

    this.isfrightEntryAdded = true;
    this.destinationParty = data.destinationParty
    this.showDestinationandFreightDataForTable(this.destinationParty);
    this.doCreateForm.controls.billEntries.setValue(data.billEntries);
    this.doCreateForm.controls.transporter.setValue(data.transporter ? data.transporter.username : data.transporter);

    this.setEMDAMt();
    this.setDOAMtPMT();
    this.populatecollary(false);
  }

  populateMultipleValuesForUpdate(values, valuetype) {
    if(!values || !values.length){
      return;
    }
    let disaplayValuePair = [];
    values.forEach((element) => {
      disaplayValuePair.push({
        display: element.toString(),
        value: element.toString()
      })
    });
    switch (valuetype) {
      case this.IN_ADVANCE:
        this.inAdvanceLimitEntries = disaplayValuePair;
        break;
      case this.SHORTAGE_LIMIT:
        this.shortageLimitEntries = disaplayValuePair;
        break;
      case this.DEDUCTION_RATE:
        this.deductionRateEntries = disaplayValuePair;
        break;
      case this.COMMISSION:
        this.commissionEntries = disaplayValuePair;
        break;
      case this.ACCOUNT_NAME:
        this.accountNameEntries = disaplayValuePair;
        break;
      case this.CODE:
        this.codeEntries = disaplayValuePair;
        break;
      case this.SUB_TRANSPORTER:
        this.subTransporterEntries = disaplayValuePair;
        break;
      default:
        break;
    }
  }

  onChangeDestinationsData() {
    this.ref_destinationData.forEach(element => {
      if (this.doCreateForm.controls.destinationParty.value == element.name) {
        this.destinationsNames = element.destinations;
      }
    });
  }

  modifyPartyData(data) {
    let selectedParty = this.doCreateForm.controls.party.value
    return new Promise((resolve, reject) => {
      data.forEach(element => {
        if (selectedParty == element.name) {
          resolve(element)
        }
      });
    })
  }

  updateDate() {
    let _monthData = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" }
    let _added45 = moment(moment(this.receivedDateforDue)).add(45, 'days');
    let _rawStr = _added45["_d"].toString().split(" ");
    let _year = _rawStr[3];
    let _day = _rawStr[2];
    let _alphaMonth = _rawStr[1];
    let _month = _monthData[_alphaMonth];
    //this.dueDateUpdate = _year + "-" + _month + "-" + _day;
    this.doCreateForm.controls.dueDate.setValue(_year + "-" + _month + "-" + _day);
  }

  addFreightEntry() {
    this.isfrightEntryAdded = true;
    let _destinationName = this.doCreateForm.controls.destinationParty.value;
    //it is a reported bug for reactive forms, that values are not getting fetched for select, so have to move for javascript syntax
    //let _destinations = this.doCreateForm.controls.destinations.value; --- was not working on onchange event.
    let _destinations = (<HTMLInputElement>document.getElementById("destination")).value;
    let _currentFreight = this.doCreateForm.controls.freight.value;
    let _isdestinationPresent = false;
    if (this.destinationParty.length == 0) {
      this.destinationParty.push({
        name: _destinationName,
        destinations: [
          {
            name: _destinations,
            freight: [_currentFreight]
          }
        ]
      })
      this.toaster.success("Freight rate is added");
      this.showDestinationandFreightDataForTable(this.destinationParty);
      return;
    }

    let _isFreightrateAdded = false;
    this.destinationParty.forEach((element_destParty, party_ind, party_arr) => {
      if (_destinationName == element_destParty.name) {
        element_destParty.destinations.forEach((element_dest, dest_ind, dest_arr) => {
          if (element_dest.name == _destinations) {
            if (element_dest.freight.includes(_currentFreight)) {
              this.toaster.error("Freight rate is already added");
              return;
            }
            else {
              this.destinationParty[party_ind].destinations[dest_ind].freight.push(_currentFreight);
              this.toaster.success("Freight rate is added");
              _isFreightrateAdded = true;
              return;
            }
          }
          if (dest_ind === dest_arr.length - 1 && !_isFreightrateAdded) {
            element_destParty.destinations.push({
              name: _destinations,
              freight: [_currentFreight]
            })
            this.toaster.success("Freight rate is added");
            _isFreightrateAdded = true;
            return;
          }
        });
        return;
      }
      if (party_ind === party_arr.length - 1 && !_isFreightrateAdded) {
        this.destinationParty.push({
          name: _destinationName,
          destinations: [
            {
              name: _destinations,
              freight: [_currentFreight]
            }
          ]
        })
        _isFreightrateAdded = true;
        this.toaster.success("Freight rate is added");
        return;
      }
      return;
    });

    this.showDestinationAndFreightData(true);
    this.showDestinationandFreightDataForTable(this.destinationParty);
  }

  addBillEntry(){
    if(!this.billDate || !this.billAmount || !this.billQuantity){
        alert("All 3 fields are mandatory.");
        return;
    }
    let _billEntry = {
      "billDate": this.billDate,
      "amount": this.billAmount,
      "quantity": this.billQuantity
    }

    let _currEntries = this.doCreateForm.controls.billEntries.value;
    if(!_currEntries){
      _currEntries = [];
    }
    _currEntries.push(_billEntry);
    this.doCreateForm.controls.billEntries.setValue(_currEntries);
    this.billAmount = '';
    this.billDate = '';
    this.billQuantity = '';
  }

  removeBillEntry(index){
    let _currEntries = this.doCreateForm.controls.billEntries.value;
    _currEntries.splice(index, 1);
    //this.doCreateForm.controls.billEntries.setValue(_currEntries);
  }

  showDestinationAndFreightData(isDestinationselected) {
    isDestinationselected = Boolean(isDestinationselected);
    console.log(this.destinationParty);
    if (isDestinationselected) {
      this.selectedDestinations = [];
    }
    let _selectedDestinationParty = this.doCreateForm.controls.addedDestinationParty.value;
    let _selectedDestination = this.doCreateForm.controls.addedDestinations.value;
    this.destinationParty.forEach((element_party) => {
      if (_selectedDestinationParty == element_party.name) {
        element_party.destinations.forEach(element => {
          if (isDestinationselected) {
            this.selectedDestinations.push(element.name);
            if (element_party.destinations.length == 1) {
              this.selectedFreight = element.freight;
            }
          }
          else {
            if (_selectedDestination == element.name) {
              this.selectedFreight = element.freight;
            }
          }
        });
      }
    })
  }

  showDestinationandFreightDataForTable(destinationParty) {
    let _freightlist = null;
    this.dataToShowInFreightsTable = []
    destinationParty.forEach(element_destinationParty => {
      element_destinationParty.destinations.forEach(element_destinations => {
        _freightlist = element_destinations.freight.join(', ');
        this.dataToShowInFreightsTable.push({
          destinationParty: element_destinationParty.name,
          destinations: element_destinations.name,
          freights: _freightlist
        })
        _freightlist = null;
      });
    });
  }

  getSelectedParty() {
    let _selectedPartyName = this.doCreateForm.controls.party.value;
    return new Promise((resolve, reject) => {
      this.ref_partyData.forEach((element) => {
        if (_selectedPartyName == element.name) {
          resolve(element)
        }
      })
    })
  }

  cancelUpdateDO() {
    this.destinationParty = [];
    this.isfrightEntryAdded = false;
    this.router.navigate(['do']);
    this.applyCreateMode()
  }

  applyUpdateMode() {
    this.isShowDoUpdate = true;
    this.modeSelect = "Update DO"
    //this.toaster.success("You are now updating do, Please press cancel button at bottom to exit the process")
  }

  applyCreateMode() {
    this.isShowDoUpdate = false;
    this.modeSelect = "Create DO"
    this.doCreateForm.reset();
    this.dataToShowInFreightsTable = [];
  }


  populatecollary(setCollary) {
    this.ref_areaList.forEach(item => {
      if (item.name === this.doCreateForm.controls.area.value) {
        this.ref_collaryList = item.collaries;
      }
    })
    if (setCollary && this.ref_collaryList && this.ref_collaryList.length) {
      this.doCreateForm.controls.collary.setValue(this.ref_collaryList[0]);
    }
  }

  updateDO(doCreationData) {
    this.doService.updateDo(doCreationData).subscribe((res) => {
      if (res.success) {
        this.submitted = false;
        this.toaster.success('Do is updated, Redirecting to running do');
        this.router.navigate(['runningdo']);
      } else {
        this.toaster.error(res.message);
      }

    },
      () => {
        this.toaster.error('DO is not updated. Internal server error!');
      }
    )
    this.initiateFileUpload();
  }

  resolveAreaSelection(area: string) {
    return new Promise((resolve) => {
      this.ref_areaList.forEach(item => {
        if (item.name === area) {
          this.ref_collaryList = item.collaries;
          resolve(item);
        }
      })
    })
    //return selectpermits;
  }

  initiateFileUpload() {
    if (this.uploader.queue && this.uploader.queue.length) {
      let _docopy = {
        name: 'docopy',
        bspdo: this.doCreateForm.controls.bspDoNo.value,
        areado: this.doCreateForm.controls.areaDoNo.value
      }
      this.uploaderService.uploadfiles([_docopy]);
    }
  }
  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  checkState(){
    return !this.isValidaState;
  }
  get f() { return this.doCreateForm.controls; }
}
