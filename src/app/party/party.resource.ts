import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms'

@Component({
  selector: 'party-resource',
  templateUrl: './party.resource.html',
  styleUrls: ['./party.resource.css']
})

export class PartyResourceComponent implements OnInit {

  ngOnInit() {

  }

  constructor(private partyFormbuilder: FormBuilder) {

  }

  partyData:Array<string>;
  destinationsData:Array<string>;
  freightRates:Array<any>;

  partyForm = this.partyFormbuilder.group({
    partyname: [],
    destination: [],
    freightratemin:[],
    freightratemax:[]
  })


}