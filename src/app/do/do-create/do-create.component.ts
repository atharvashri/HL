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


@Component({
  selector: 'app-do-create',
  templateUrl: './do-create.component.html',
  styleUrls: ['./do-create.component.css']
})
export class DoCreateComponent implements OnInit {

  doCreateForm
  doDetails: DODetails;
  submitted: boolean;
  isShowDoUpdate: boolean = false;
  receivedDateforDue = new Date();
  dataToShowInFreightsTable = [];
  titlesForFreightsTable = [
    "Destination Party",
    "Destinations",
    "Freights"
  ]
  uploader: FileUploader;
  Freights = [];

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
  changedDestination;
  selecteddo;
  enableDueDate;

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
  addedInAdvanceLimit = []
  subTransporterList = []

  grades = ['G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13'];
  sizes = ["ROM", "SLK", "STM"]

  liftedQuantityUpdate;
  doQuantityUpdate;
  quantityDeductionUpdate;
  lepseQuantityUpdate;
  freightToBePaidByOptions = ["DO Owner", "Bilty Company"];
  // TODO get list from backend
  builtyCompanyOptions = ["Hindustan Logistics", "Surya Logistics"];
  inAdvanceLimitEntries = [];
  subTransporterEntries = [];

  multiDropDownSettings = {}
  permitDropDownSettings = {}

  @ViewChild('content') content;

  doDataForConfirmationModel;

  ngOnInit() {

    this.ref_areaList = [];
    this.ref_collaryList = [];
    this.spinner.show()
    this.doDetails = new DODetails()

    localStorage.getItem('currentRole') === AppUtil.ROLE_ADMIN ? this.enableDueDate=true : this.enableDueDate=false;

    this.doCreateForm = this.doFormBuilder.group({
      bspDoNo: ['', Validators.required],
      areaDoNo: ['', Validators.required],
      doNo: [{ value: [], disabled: true }],
      auctionNo: [],
      quantity: ['', Validators.required],
      doDate: ['', Validators.required],
      receivedDate: ['', Validators.required],
      dueDate: [{ value: '', disabled: !this.enableDueDate }],
      size: [],
      party: ['', Validators.required],
      destinationParty: [],
      destinations: [],
      addedDestinationParty: [],
      addedDestinations: [],
      // freight: new FormGroup({
      //   min: [],
      //   max: []
      // }),
      freight: [],
      permitNos: [],
      area: ['', Validators.required],
      collary: ['', Validators.required],
      grade: ['', Validators.required],
      by: [],
      otBuiltyCompany: [],
      transporter: [],
      emd: [],
      emdAmt: [{ value: '', disabled: true }],
      doAmt: [],
      doAmtpmt: [{ value: '', disabled: true }],
      doRate: [],
      doRateTcs: [],
      withinOutSide: [],
      liftedQuantity: [],
      quantityDeduction: [],
      lepseQuantity: [{ value: '', disabled: true }],
      doStatus: [],
      refundAmt: [],
      refundDate: [],
      website: [],
      finishDate: [],
      remarks: [],
      inAdvanceLimit: [],
      freightToBePaidBy: [],
      subTransporter:[],
      doCopy: []
    })

    this.route.queryParams.subscribe(
      (params) => {
        this.selecteddo = null;
        this.loadrefDataForDOCreate();
        let _updateDOID = params['update'];
        if (_updateDOID != undefined) {
          this.getDOForUpdate(_updateDOID);
        }
        else {
          this.applyCreateMode();
        }
        this.loadpermit();
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
    this.permitDropDownSettings = {
      itemsShowLimit: 1,
      enableCheckAll: false,
      idField: 'permitnumber',
      textField: 'permitnumber'
    }
  }



  addTags(evt, isSubTransporter) {
    //console.log(evt);
    if(isSubTransporter){
      this.subTransporterList.push(evt.value);
    }else{
      this.addedInAdvanceLimit.push(evt.value);
    }
  }

  removeTag(evt, isSubTransporter) {
    if(isSubTransporter){
      this.subTransporterList = this.subTransporterList.filter((e => e != evt.value))
    }else{
      this.addedInAdvanceLimit = this.addedInAdvanceLimit.filter((e => e != evt.value))
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
    doCreationData = this.modifyDODataBeforeSubmit(doCreationData);

    this.getSelectedParty().then((data) => {

      doCreationData.party = data;
      doCreationData.doDisplay = doCreationData.areaDoNo + "/" + doCreationData.bspDoNo + "-" + doCreationData.collary + "-" + doCreationData.quantity
      this.createDoOnConfirmData = {};
      this.doDataForConfirmationModel = {};

      this.createDoOnConfirmData = doCreationData;
      this.doDataForConfirmationModel = doCreationData;

      this.doDataForConfirmationModel.inAdvanceMultiple = this.addedInAdvanceLimit.join(', ');
      this.doDataForConfirmationModel.partyName = this.doCreateForm.controls.party.value;

      this.modalService.open(this.content);

    })
  }

  onUpdateSubmit() {
    this.submitted = true;
    let _updateDOID

    if (this.doCreateForm.invalid) {
      this.toaster.error("Please correct the errors in form");
      return;
    }

    let doCreationData = this.doCreateForm.getRawValue();
    doCreationData = this.modifyDODataBeforeSubmit(doCreationData);

    this.route.queryParams.subscribe(
      (params) => {
        _updateDOID = params['update'];
      }
    );

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
    //TODO find better way to fix it
    if (doCreationData.permitNos && doCreationData.permitNos.length && doCreationData.permitNos[0] instanceof Object) {
      let permitnumbers = [];
      doCreationData.permitNos.forEach(item => {
        permitnumbers.push(item.permitnumber);
      })
      doCreationData.permitNos = permitnumbers;
    }
    this.getSelectedParty().then((data) => {
      doCreationData.party = data;
      this.updateDO(doCreationData, _updateDOID);
    })

  }

  modifyDODataBeforeSubmit(doCreationData) {
    delete doCreationData.party;
    delete doCreationData.destinationParty;
    delete doCreationData.freight;
    delete doCreationData.addedDestinationParty;
    delete doCreationData.addedDestinations;
    delete doCreationData.destinations;

    doCreationData.destinationparty = this.destinationParty;
    // doCreationData.dueDate = AppUtil.transformdate(doCreationData.dueDate);
    // doCreationData.receivedDate = AppUtil.transformdate(doCreationData.receivedDate);
    // doCreationData.doDate = AppUtil.transformdate(doCreationData.doDate);

    //TODO this is temporary solution to get it work.
    doCreationData.inAdvanceLimit = this.addedInAdvanceLimit;
    doCreationData.subTransporter = this.subTransporterList;
    //doCreationData.freightToBePaidBy = ;
    // let _freightToBePaidBy = doCreationData.freightToBePaidBy;
    // doCreationData.freightToBePaidBy = [];
    // doCreationData.freightToBePaidBy.push(_freightToBePaidBy);
    this.getSelectedTransporter(doCreationData.transporter).
      then((data) => {
        doCreationData.transporter = data;
      })
    return doCreationData;

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
    this.doService.getdoRefData().subscribe(
      (res) => {
        this.refData = res["data"];
        this.ref_areaList = this.refData["areaList"];
        this.ref_partyData = this.refData["partyList"];
        this.ref_destinationData = this.refData["partyList"]
        this.populatecollary(false);


        setTimeout(() => {
          this.spinner.hide();
        }, 1500)
      },
      (error) => {
        this.spinner.hide()
        this.toaster.error("error occured while retrieving refdata");
      }
    )

    this.userService.getByRole("ROLE_FIELD").subscribe(
      (res) => {
        this.ref_transporters = res["data"];
      },
      (error) => {
        console.log("could not retrieve transporters list")
      }
    )
  }

  loadpermit() {
    this.permitservice.getpermits().subscribe(
      (res) => {
        if (res.success) {
          this.permits = res.data;
        }
      }
    )
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
    this.doService.getDoByID(id).subscribe((res) => {
      this.applyUpdateMode();
      this.selecteddo = res['data'];
      this.setDataToUpdateForm(this.selecteddo);
    },
      () => {
        this.toaster.error("not able to find the required DO information");
      })
  }

  setlepseQuantity() {
    let _doQuantity = this.doCreateForm.controls.quantity.value;
    let _liftedQuantityUpdate = this.doCreateForm.controls.liftedQuantity.value
    let _quantityDeductionUpdate = this.doCreateForm.controls.quantityDeduction.value

    this.doCreateForm.controls.lepseQuantity.setValue(_doQuantity - _liftedQuantityUpdate - _quantityDeductionUpdate);

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
    this.populatecollary(false);
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
    this.doCreateForm.controls.otBuiltyCompany.setValue(data.otBuiltyCompany)

    this.doCreateForm.controls.permitNos.setValue(this.resolvePermits(data.permitNos))
    this.doCreateForm.controls.emd.setValue(data.emd)

    this.doCreateForm.controls.doAmt.setValue(data.doAmt)
    this.doCreateForm.controls.doAmtpmt.setValue(data.doAmtpmt)
    this.doCreateForm.controls.doRate.setValue(data.doRate)
    this.doCreateForm.controls.doRateTcs.setValue(data.doRateTcs)

    this.doCreateForm.controls.party.setValue(data.party.name)
    this.doCreateForm.controls.withinOutSide.setValue(data.withinOutSide)
    this.doCreateForm.controls.receivedDate.setValue(data.receivedDate)


    this.doCreateForm.controls.liftedQuantity.setValue(data.liftedQuantity)
    this.doCreateForm.controls.quantityDeduction.setValue(data.quantityDeduction)
    this.doCreateForm.controls.remarks.setValue(data.remarks)
    this.doCreateForm.controls.refundDate.setValue(data.refundDate)
    this.doCreateForm.controls.refundAmt.setValue(data.refundAmt)
    this.doCreateForm.controls.website.setValue(data.website)
    this.doCreateForm.controls.freightToBePaidBy.setValue(data.freightToBePaidBy)
    this.addedInAdvanceLimit = data.inAdvanceLimit;
    this.showInAdvanceLimitForUpdate(data.inAdvanceLimit)
    this.subTransporterList = data.subTransporter;
    this.showSubTransporter(data.subTransporter);
    //this.inAdvanceLimitEntries = data.inAdvanceLimit
    if (data.liftedQuantity != undefined && data.quantityDeduction != undefined && data.quantity) {
      this.doCreateForm.controls.lepseQuantity.setValue(data.quantity - data.liftedQuantity - data.quantityDeduction)
    }

    this.isfrightEntryAdded = true;
    this.destinationParty = data.destinationparty
    this.showDestinationandFreightDataForTable(this.destinationParty);

    this.doCreateForm.controls.transporter.setValue(data.transporter ? data.transporter.username : data.transporter);

    this.setEMDAMt();
    this.setlepseQuantity()
    this.setDOAMtPMT();

  }

  showInAdvanceLimitForUpdate(inAdvanceLimits) {
    let _inAdvanceLimitsWithDisplay = [];
    inAdvanceLimits.forEach((element, index) => {
      _inAdvanceLimitsWithDisplay.push({
        display: element.toString(),
        value: element.toString()
      })
      if (index == inAdvanceLimits.length - 1) {
        this.inAdvanceLimitEntries = _inAdvanceLimitsWithDisplay;
        //this.doCreateForm.controls.inAdvanceLimit.setValue(_inAdvanceLimitsWithDisplay);
      }
    });
  }

  showSubTransporter(subTransporterList) {
    let _subTransporterWithDisplay = [];
    subTransporterList.forEach((element, index) => {
      _subTransporterWithDisplay.push({
        display: element.toString(),
        value: element.toString()
      })
      if (index == subTransporterList.length - 1) {
        this.subTransporterEntries = _subTransporterWithDisplay;
        //this.doCreateForm.controls.inAdvanceLimit.setValue(_inAdvanceLimitsWithDisplay);
      }
    });
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
    console.log(this.destinationParty);
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
  // populatecollary() {
  //   this.ref_areaList.forEach(item => {
  //     if (item.name === this.doCreateForm.controls.area.value) {
  //       this.ref_collaryList = item.collaries;
  //     }
  //   })
  // }

  updateDO(doCreationData, _updateDOID) {
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

  resolvePermits(permitNos: Array<number>) {
    let selectpermits = [];
    if (permitNos && permitNos.length) {
      permitNos.forEach(item => {
        this.permits.forEach(permit => {
          if (permit.permitnumber === item) {
            selectpermits.push(permit);
          }
        })
      })
    }
    return selectpermits;
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
