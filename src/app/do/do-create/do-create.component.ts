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


@Component({
  selector: 'app-do-create',
  templateUrl: './do-create.component.html',
  styleUrls: ['./do-create.component.css']
})
export class DoCreateComponent implements OnInit {
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

  Freights = [];

  ref_collaryList: Array<string>;
  ref_areaList: Array<string>
  ref_partyData = []
  ref_destinationData = []
  ref_transporters = []
  permits = []
  destinationsNames: Array<String>;
  destinationParty = [];
  selectedDestinations = [];
  selectedFreight = [];
  changedDestination

  isfrightEntryAdded: boolean = false;
  createDoOnConfirmData;

  constructor(private doFormBuilder: FormBuilder,
    private doService: DoService,
    private userService: UserService,
    private permitservice: PermitService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal) { }

  refData = {};
  modeSelect = "Create DO";
  addedInAdvanceLimit = []

  grades = ['G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13'];
  sizes = ["ROM", "SLK", "STM"]

  liftedQuantityUpdate;
  doQuantityUpdate;
  quantityDeductionUpdate;
  lepseQuantityUpdate;

  inAdvanceLimitEntries = [];

  @ViewChild('content') content;

  doDataForConfirmationModel;

  ngOnInit() {

    this.doDetails = new DODetails()

    this.route.queryParams.subscribe(
      (params) => {
        let _updateDOID = params['update'];
        if (_updateDOID != undefined) {
          this.getDOForUpdate(_updateDOID);
        }
        else {
          this.applyCreateMode();
        }
        this.loadrefDataForDOCreate();
        this.loadpermit();
      }
    );
  }

  doCreateForm = this.doFormBuilder.group({
    bspDoNo: ['', Validators.required],
    areaDoNo: ['', Validators.required],
    doNo: [{ value: [], disabled: true }],
    auctionNo: [],
    quantity: ['', Validators.required],
    doDate: ['', Validators.required],
    receivedDate: ['', Validators.required],
    dueDate: [{ value: '', disabled: true }],
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
    permissionNo: [],
    area: ['', Validators.required],
    collary: ['', Validators.required],
    grade: ['', Validators.required],
    by: [],
    builtyCompany: [],
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
    freightToBePaidBy: []
  })

  addTags(evt) {
    //console.log(evt);
    this.addedInAdvanceLimit.push(evt.value);
  }

  onSubmitDo() {
    this.submitted = true;

    if (this.doCreateForm.invalid) {
      this.toaster.error("Please correct the errors in form");
      return;
    }

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

  modifyDODataBeforeSubmit(doCreationData) {
    delete doCreationData.party;
    delete doCreationData.destinationParty;
    delete doCreationData.freight;
    delete doCreationData.addedDestinationParty;
    delete doCreationData.addedDestinations;
    delete doCreationData.destinations;

    doCreationData.destinationparty = this.destinationParty;
    doCreationData.dueDate = this.transformDate(doCreationData.dueDate);
    doCreationData.receivedDate = this.transformDate(doCreationData.receivedDate);
    doCreationData.doDate = this.transformDate(doCreationData.doDate);

    //TODO this is temporary solution to get it work.
    doCreationData.inAdvanceLimit = this.addedInAdvanceLimit;
    doCreationData.freightToBePaidBy = [doCreationData.freightToBePaidBy];

    return doCreationData;
  }

  loadrefDataForDOCreate() {
    this.doService.getdoRefData().subscribe(
      (res) => {
        this.refData = res["data"];
        console.log(res["data"]);
        this.ref_areaList = res["data"]["areaList"];
        this.ref_collaryList = res["data"]["collaryList"];
        this.ref_partyData = res["data"]["partyList"];
        this.ref_destinationData = res["data"]["partyList"]
        this.refData['builtyCompany'] = ['mumbai', 'pune'];
      },
      (error) => {
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
    this.doService.createDoService(this.createDoOnConfirmData).subscribe(
      (data) => {
        this.modalService.dismissAll();
        this.reloadPage();
        this.toaster.success("DO is successfully created");
      },
      (err) => {
        this.toaster.error("error in DO creation");
      }
    )
  }

  getDOForUpdate(id) {
    this.doService.getDoByIDService(id).subscribe((res) => {
      console.log(res);
      this.applyUpdateMode();
      this.setDataToUpdateForm(res['data']);
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
    this.doCreateForm.controls.bspDoNo.setValue(data.bspDoNo);
    this.doCreateForm.controls.areaDoNo.setValue(data.areaDoNo);
    this.doCreateForm.controls.auctionNo.setValue(data.auctionNo)
    this.doCreateForm.controls.collary.setValue(data.collary)
    this.doCreateForm.controls.quantity.setValue(data.quantity)
    this.doCreateForm.controls.doDate.setValue(this.transformDate(data.doDate))
    this.doCreateForm.controls.dueDate.setValue(this.transformDate(data.dueDate))

    this.doCreateForm.controls.grade.setValue(data.grade)
    this.doCreateForm.controls.size.setValue(data.size)
    this.doCreateForm.controls.area.setValue(data.area)
    this.doCreateForm.controls.by.setValue(data.by)
    this.doCreateForm.controls.builtyCompany.setValue(data.builtyCompany)

    this.doCreateForm.controls.permissionNo.setValue(data.permissionNo)
    this.doCreateForm.controls.emd.setValue(data.emd)

    this.doCreateForm.controls.doAmt.setValue(data.doAmt)
    this.doCreateForm.controls.doAmtpmt.setValue(data.doAmtpmt)
    this.doCreateForm.controls.doRate.setValue(data.doRate)
    this.doCreateForm.controls.doRateTcs.setValue(data.doRateTcs)

    this.doCreateForm.controls.party.setValue(data.party.name)
    this.doCreateForm.controls.withinOutSide.setValue(data.withinOutSide)
    this.doCreateForm.controls.receivedDate.setValue(this.transformDate(data.receivedDate))


    this.doCreateForm.controls.liftedQuantity.setValue(data.liftedQuantity)
    this.doCreateForm.controls.remarks.setValue(data.remarks)
    this.doCreateForm.controls.refundDate.setValue(this.transformDate(data.refundDate))
    this.doCreateForm.controls.website.setValue(data.website)
    this.doCreateForm.controls.freightToBePaidBy.setValue(data.freightToBePaidBy)
    this.doCreateForm.controls.inAdvanceLimit.setValue(data.inAdvanceLimit);
    //this.inAdvanceLimitEntries = data.inAdvanceLimit
    if (data.liftedQuantity != undefined && data.quantityDeduction != undefined && data.quantity) {
      this.doCreateForm.controls.lepseQuantity.setValue(data.quantity - data.liftedQuantity - data.quantityDeduction)
    }

    this.isfrightEntryAdded = true;
    this.destinationParty = data.destinationparty
    this.showDestinationandFreightDataForTable(this.destinationParty);
    this.doCreateForm.controls.transporter.setValue(data.transporter.firstName);

    this.setEMDAMt();
    this.setlepseQuantity()
    this.setDOAMtPMT();

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
    //it is a reported bug for reactive forms, that values are not get fetched for select, so have to move for javascript syntax
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
            }
            this.toaster.success("Freight rate is added");
            return;
          }
          if (dest_ind === dest_arr.length - 1) {
            element_destParty.destinations.push({
              name: _destinations,
              freight: [_currentFreight]
            })
            this.toaster.success("Freight rate is added");
            return;
          }
        });
        return;
      }
      if (party_ind === party_arr.length - 1) {
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
        return;
      }

      return true;

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

  transformDate(date: string) {
    if (date && date.length == 10) {
      return (<Array<string>>date.split('-')).reverse().join('-');
    }
    return "";
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

    doCreationData.id = _updateDOID;

    this.getSelectedParty().then((data) => {
      doCreationData.party = data;
      this.updateDO(doCreationData, _updateDOID);
    })

  }

  updateDO(doCreationData, _updateDOID) {
    this.doService.updateDoService(doCreationData).subscribe((data) => {
      console.log('do is updated')
    },
      (error) => {
        console.log('do is not updated')
      }
    )
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  get f() { return this.doCreateForm.controls; }
}
