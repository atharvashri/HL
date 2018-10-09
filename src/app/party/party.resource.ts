import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PartyService } from '../services/party.service'

interface IFreightRates {
  min,
  max
}

@Component({
  selector: 'party-resource',
  templateUrl: './party.resource.html',
  styleUrls: ['./party.resource.css']
})

export class PartyResourceComponent implements OnInit {

  ngOnInit() {

  }

  constructor(private partyFormbuilder: FormBuilder, private partyservice: PartyService) {

  }

  partyName: Array<string>;
  destinationsData: Array<string> = [];
  freightRates: Array<IFreightRates> = [];

  partyForm = this.partyFormbuilder.group({
    partyname: [],
    destination: [],
    freightratemin: [],
    freightratemax: []
  })

  submitdestination() {
    this.destinationsData.push(this.partyForm.controls.destination.value)
  }

  submitFreight() {
    this.freightRates.push({
      min: this.partyForm.controls.freightratemin.value,
      max: this.partyForm.controls.freightratemax.value
    })
  }

  submitRequestForParty() {
    let _requestPartydata = {
      id: 2,
      name: this.partyForm.controls.partyname.value,
      destinations: this.destinationsData,
      freightRanges: this.freightRates
    }

    this.partyservice.createPartyService(_requestPartydata).subscribe(
      (data) => { console.log(data) }
    )

  }

}