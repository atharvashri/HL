import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { DoService } from '../../services/do.service'

import { DODetails } from '../../model/do-details.model'
import * as moment from 'moment';

interface IParty {
  id: number,
  name: string,
  destinations: Array<string>,
  freightRanges: Array<string>
}

//below Destinationparty object is reference object Please ignore - Atharva.
Destinationparty: [{
  id: 123,
  name: 'ABC',
  Destinations: ['mumbai', 'pune'],
  Freights: [{
    mumbai: [100, 200, 300]
  },
  {
    pune: [2100, 500, 650]
  }]
}]

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
  sizes: Array<string>;
  doDetails: DODetails;
  submitted: boolean;
  isShowDoCreate: boolean = true;
  receivedDateforDue = new Date();
  dueDateUpdate;
  Freights = [];

  collaryList: Array<string>;
  areaList: Array<string>

  destinationsNames: Array<String>;

  partyData: Array<IParty> = []
  destinationData: Array<IParty> = []
  destinationParty = [];

  isfrightEntryAdded: boolean = false

  constructor(private doFormBuilder: FormBuilder, private doService: DoService) { }
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  optionsSelect;
  ngOnInit() {
    this.doDetails = new DODetails()
    this.sizes = ["Small", "Big", "medium"]

    this.doService.getdoRefData().subscribe(
      (res) => {
        this.areaList = res["data"]["areaList"];
        this.collaryList = res["data"]["collaryList"];
        this.partyData = res["data"]["partyList"];
        this.destinationData = res["data"]["partyList"]
      },
      (error) => { }
    )
  }

  doCreateForm = this.doFormBuilder.group({
    bspDoNo: [''],
    areaDoNo: ['', Validators.required],
    doNo: [''],
    auctionNo: [''],
    quantity: [''],
    doDate: [''],
    receivedDate: [''],
    dueDate: [''],
    size: [''],
    // party: new FormGroup({
    //   id: [''],
    //   name: [''],
    //   destinations: [''],
    //   freightRanges: [''],

    // }),
    party: [''],
    // destinationParty: new FormGroup({
    //   id: [''],
    //   name: [''],
    //   destinations: [''],
    //   freightRanges: ['']
    // }),
    destinationParty: [''],
    destinations: [''],
    addedDestinationParty: [''],
    addedDestinations: [''],
    // freight: new FormGroup({
    //   min: [''],
    //   max: ['']
    // }),
    freight: [''],
    permissionNo: [''],
    area: [''],
    collary: [''],
    grade: [''],
    by: [''],
    builtyCompany: [''],
    transporter: [''],
    emd: [''],
    doAmt: [''],
    doAmtpmt: [''],
    doRate: [''],
    doRateTcs: [''],
    withinOutSide: [''],
    disp: [''],
    liftedQuantity: [''],
    quantityDeduction: [''],
    lepseQuantity: [''],
    doStatus: [''],
    refundAmt: [''],
    refundDate: [''],
    emdAmt: [''],
    totalRefundAmt: [''],
    website: [''],
    finishDate: [''],
    remarks: [''],
    inAdvanceLimit: [''],
    freightToBePaidBy: ['']
  })


  onSubmitDo() {
    this.submitted = true;

    if (this.doCreateForm.invalid) {
      return;
    }


    let doCreationData = this.doCreateForm.value;

    //modify data for sending request to server.
    //modify party,destination,date.

    // this.modifyPartyData(this.partyData).then(() => {
    //   delete doCreationData.party
    // })
    // this.createDo(doCreationData);
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

      },
      (err) => {

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

  getDestinationsData(destinationData) {

    // return new Promise((resolve, reject) => {
    //   destinationData.forEach((element, index, array) => {
    //     this.destinationsNames.push(element.name)
    //     if (destinationData.length - 1 == index) {
    //       resolve(this.destinationsNames)
    //     }
    //   });
    // })
  }

  getPartyData(partyData) {

  }

  onChangeDestinationsData() {

    this.destinationData.forEach(element => {
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

    this.dueDateUpdate = _year + "-" + _month + "-" + _day;

  }

  addFreightEntry() {
    this.isfrightEntryAdded = true;

    let _destinationName = this.doCreateForm.controls.destinationParty.value
    let _destination = this.doCreateForm.controls.destinations.value
    let _currentFreight = this.doCreateForm.controls.freight.value;


    if (this.destinationParty.length == 0) {
      this.destinationParty.push({
        name: _destinationName,
        destinations: [
          {
            name: _destination,
            freight: [_currentFreight]
          }
        ]
      })
      return;
    }

    this.destinationParty.forEach((element, index) => {
        
      if(_destinationName == element.name){

      }

    });

  }
}
