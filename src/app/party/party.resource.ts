import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { DataService } from '../services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'party-resource',
  templateUrl: './party.resource.html',
  styleUrls: ['./party.resource.css']
})

export class PartyResourceComponent implements OnInit {

  @ViewChild('addPartyModal') content
  destinations = [];
  partyList;
  popupTitle;
  updateMode;
  partyData:string;
  destinationsData:Array<string>;
  selectedParty;
  selectedPartyIndex

  ngOnInit() {
    this.destinationsData = [];
    this.partyList = [];
    this.service.getPartyList().subscribe(
      (res) => {
        if(res.success){
          this.toaster.success(res.message)
          this.partyList = res.data
        }else{
          this.toaster.error(res.message);
        }
      },
      () => {
        this.toaster.error("Failed to get list of party! Internal server error")
      }
    )
  }

  constructor(private partyFormbuilder: FormBuilder,
      private toaster: ToastrService,
      private service: DataService,
      private modalService: NgbModal) {

  }

  partyForm = this.partyFormbuilder.group({
    partyName: ['', Validators.required],
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

  showpartyform(idx, updateMode){
    this.updateMode = updateMode;
    this.modalService.open(this.content)
    if(updateMode){
      this.popupTitle = "Update Party"
      if(idx > -1){
        this.selectedParty = this.partyList[idx]
        this.selectedPartyIndex = idx;
        this.partyForm.controls.partyName.setValue(this.selectedParty.name)
        this.destinationsData = this.selectedParty.destinations;
      }
    }else{
      this.popupTitle = "Add Party"
      this.partyForm.reset();
      this.destinationsData = []
    }
  }

  onSubmit(){
    if(this.partyForm.invalid){
      this.toaster.error("Party name is mandatory");
      return;
    }
    let party = {
      "name": this.partyForm.controls.partyName.value,
      "destinations": this.destinationsData
    }
    this.service.createParty(party).subscribe(
      (res) => {
        if(res.success){
          this.modalService.dismissAll()
          this.toaster.success(res.message);
          this.partyList.push(res.data);
        }else{
          this.toaster.error(res.message);
        }
      },
      () => {
        this.toaster.error("Failed to add party details! Internal Server error");
      }
    )
  }

  onUpdate(){
    if(this.partyForm.invalid){
      this.toaster.error("Party name is mandatory");
      return;
    }
    let party = this.selectedParty;
    party.name = this.partyForm.controls.partyName.value
    party.destinations = this.destinationsData
    this.service.updateParty(party).subscribe(
      (res) => {
        if(res.success){
          this.modalService.dismissAll()
          this.toaster.success(res.message);
          this.partyList[this.selectedPartyIndex] = party
        }else{
          this.toaster.error(res.message);
        }
      },
      () => {
        this.toaster.error("Failed to update party details! Internal Server error");
      }
    )
  }

}
