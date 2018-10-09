import { Component, OnInit,Output,EventEmitter,ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registration-truck',
  templateUrl: './registration-truck.component.html',
  styleUrls: ['./registration-truck.component.css']
})
export class RegistrationTruckComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  
  @Output() modalEvt = new EventEmitter();
  @ViewChild('updateDetails') update

  open() {
    //console.log("model - event");
    this.update.openModel("content");
  }
}
