import { Component, OnInit } from '@angular/core'
import { Validators, FormBuilder } from '@angular/forms'
import { DoService } from '../../services/do.service'

import { DODetails } from '../../model/do-details.model'
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

interface IParty {
  id: number,
  name: string,
  destinations: Array<string>,
  //freightRanges: Array<string>
}


interface IFreightRate {
  max: number,
  min: number
}

@Component({
  selector: 'app-do-create',
  templateUrl: './do-create.component.html',
  styleUrls: ['./do-create.component.css']
})
export class DoCreateComponent implements OnInit {
  doDetails: DODetails;
  submitted: boolean;
  isShowDoCreate: boolean = true;
  receivedDateforDue = new Date();
  //dueDateUpdate;
  Freights = [];

  ref_collaryList: Array<string>;
  ref_areaList: Array<string>
  ref_partyData = []
  ref_destinationData = []
  ref_transporters = []
  destinationsNames: Array<String>;
  destinationParty = [];
  selectedDestinations = [];
  selectedFreight = [];

  isfrightEntryAdded: boolean = false

  constructor(private doFormBuilder: FormBuilder,
          private doService: DoService,
          private userService: UserService,
          private toaster: ToastrService) { }
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  refData = {};
  optionsSelect;


  //optionsSelect;

  grades = ['G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13'];
  sizes = ["ROM", "SLK", "STM"]

  ngOnInit() {
    this.doDetails = new DODetails()

    this.doService.getdoRefData().subscribe(
      (res) => {
        this.refData = res["data"];

        this.ref_areaList = res["data"]["areaList"];
        this.ref_collaryList = res["data"]["collaryList"];
        this.ref_partyData = res["data"]["partyList"];
        this.ref_destinationData = res["data"]["partyList"]
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

  doCreateForm = this.doFormBuilder.group({
    bspDoNo: [],
    areaDoNo: [],
    doNo: [{ value: [], disabled: true }],
    auctionNo: [],
    quantity: [],
    doDate: [],
    receivedDate: [],
    dueDate: [{value:'', disabled:true}],
    size: [],
    // party: new FormGroup({
    //   id: [],
    //   name: [],
    //   destinations: [],
    //   freightRanges: [],

    // }),
    party: [],
    // destinationParty: new FormGroup({
    //   id: [],
    //   name: [],
    //   destinations: [],
    //   freightRanges: []
    // }),
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
    area: [],
    collary: [],
    grade: [],
    by: [],
    builtyCompany: [],
    transporter: [],
    emd: [],
    doAmt: [],
    doAmtpmt: [],
    doRate: [],
    doRateTcs: [],
    withinOutSide: [],
    disp: [],
    liftedQuantity: [],
    quantityDeduction: [],
    lepseQuantity: [],
    doStatus: [],
    refundAmt: [],
    refundDate: [],
    emdAmt: [],
    totalRefundAmt: [],
    website: [],
    finishDate: [],
    remarks: [],
    inAdvanceLimit: [],
    freightToBePaidBy: []
  })


  onSubmitDo() {
    this.submitted = true;

    if (this.doCreateForm.invalid) {
      return;
    }


    let doCreationData = this.doCreateForm.getRawValue();

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
    doCreationData.inAdvanceLimit = [doCreationData.inAdvanceLimit];

    this.getSelectedParty().then((data) => {
      doCreationData.party = data;
      console.table([doCreationData]);
      this.createDo(doCreationData);
    })
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  createDo(doCreationData) {
    this.doService.createDoService(doCreationData).subscribe(
      (data) => {
        this.toaster.success("DO is successfully created");
      },
      (err) => {
        this.toaster.error("error in DO is creation");
      }
    )
  }

  get f() { return this.doCreateForm.controls; }

  setCreateOrUpdateForm(formCondition) {
    if (formCondition == "create") {
      this.isShowDoCreate = true;
    }

    if (formCondition == "update") {
      this.isShowDoCreate = false;
    }
  }

  getPartyData(partyData) {

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

  modifyDestinationData() {

  }

  modifyDateFomat() {

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

    let _destinationName = this.doCreateForm.controls.destinationParty.value
    let _destinations = this.doCreateForm.controls.destinations.value
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

  }

  showDestinationAndFreightData(isDestination) {
    isDestination = Boolean(isDestination);
    if (isDestination) {
      this.selectedDestinations = [];
    }

    let _selectedDestinationParty = this.doCreateForm.controls.addedDestinationParty.value;
    let _selectedDestination = this.doCreateForm.controls.addedDestinations.value;

    this.destinationParty.forEach((element_party) => {
      if (_selectedDestinationParty == element_party.name) {
        element_party.destinations.forEach(element => {
          if (isDestination) {
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

  transformDate(date:string){
    if(date && date.length == 10){
      return (<Array<string>>date.split('-')).reverse().join('-');
    }
    return "";
  }
}
