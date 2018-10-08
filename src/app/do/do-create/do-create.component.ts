import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { DoService } from '../../services/do.service'

import { DODetails } from '../../model/do-details.model'

interface IParty {
  id: number,
  name: string,
  destinations: Array<string>,
  freightRanges: Array<string>
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
  sizes: Array<string>;
  doDetails: DODetails;
  submitted: boolean;
  isShowDoCreate: boolean = true;

  //partyNames: Array<String>;
  destinationsNames: Array<String>;
  //destinationsPartyNames: Array<String>;

  partyData =
    [
      { 'id': 1, 'name': 'abc', 'destination': ['a1', 'b1', 'c1'], 'freightRanges': [100, 200, 300] },
      { 'id': 2, 'name': 'xyz', 'destination': ['v1', 'c1', 't1'], 'freightRanges': [1000, 2000, 3000] },
      { 'id': 3, 'name': 'pqr', 'destination': ['e1', 'r1', 'y1'], 'freightRanges': [300, 900, 800] },
      { 'id': 4, 'name': 'mno', 'destination': ['m1', 'p1', 'o1'], 'freightRanges': [600, 300, 1200] }
    ]
  destinationData =
    [
      { 'id': 1, 'name': 'abc', 'destination': ['a1', 'b1', 'c1'], 'freightRanges': [100, 200, 300] },
      { 'id': 2, 'name': 'xyz', 'destination': ['v1', 'c1', 't1'], 'freightRanges': [1000, 2000, 3000] },
      { 'id': 3, 'name': 'pqr', 'destination': ['e1', 'r1', 'y1'], 'freightRanges': [300, 900, 800] },
      { 'id': 4, 'name': 'mno', 'destination': ['m1', 'p1', 'o1'], 'freightRanges': [600, 300, 1200] }
    ]


  constructor(private doFormBuilder: FormBuilder, private doService: DoService) { }

  optionsSelect;
  ngOnInit() {
    this.doDetails = new DODetails(),
      this.sizes = ["Small", "Big", "medium"]
  
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

    this.createDo(this.doCreateForm.value)
  }

  createDo(doData) {
    this.doService.createDoService(doData).subscribe(
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
        this.destinationsNames = element.destination;
      }
    });

  }
}
