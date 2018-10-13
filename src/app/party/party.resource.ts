import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { PartyService } from '../services/party.service';

@Component({
  selector: 'party-resource',
  templateUrl: './party.resource.html',
  styleUrls: ['./party.resource.css']
})

export class PartyResourceComponent implements OnInit {
  destinations = [];
  ngOnInit() {
    this.destinationsData = [];
  }

  constructor(private partyFormbuilder: FormBuilder,
      private toaster: ToastrService,
      private partyService: PartyService) {

  }

  partyData:string;
  destinationsData:Array<string>;

  partyForm = this.partyFormbuilder.group({
    partyname: [],
    destination: []
  })

  addDestination(){
    let formEntry = this.partyForm.controls.destination.value;
    if(this.destinationsData.includes(formEntry)){
        this.toaster.error("Destination is already added");
    }else{
      this.destinationsData.push(this.partyForm.controls.destination.value);
    }
  }

  removeOption(destination: string){
    this.destinationsData = this.destinationsData.filter(elem => elem !== destination);
    //console.log(this.destinations);
  }

  onSubmit(){
    let party = {
      "name": this.partyForm.controls.partyname.value,
      "destinations": this.destinationsData
    }
    this.partyService.createPartyService(party).subscribe(
      (success) => {
        console.log(success);
        this.toaster.success("Party data saved successfully");
      },
      (error) => {
        console.log(error);
        this.toaster.error("Problem saving party data");
      }
    )
  }

}
