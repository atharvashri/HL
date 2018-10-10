import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { TruckPanService } from '../services/truck.pan.services'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registration-pan',
  templateUrl: './registration-pan.component.html',
  styleUrls: ['./registration-pan.component.css']
})
export class RegistrationPanComponent implements OnInit {

  constructor(private truckPanService: TruckPanService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  formtitleParent: string;

  isAddpan: boolean = false;
  isUpdateVehicle: boolean = false;

  @Output() modalEvt = new EventEmitter();
  @ViewChild('updateDetails') update
  @ViewChild('confirmDialog') confirmDialog

  vehicleList = ["MH10AB1234","MH10AB1765","MH10AB1354"]

  open() {
    this.formtitleParent = "Add"
    //console.log("model - event");
    this.modalService.dismissAll()
    this.update.openModel();
  }

  getPanStatus(id) {
    this.truckPanService.getOnePANByID(id).subscribe(
      (data) => {

        //this below code is for reference will be changed.
        if (data['isPresent']) {
          //show a list of vehicles

        }
        else {
          //ask for registration
          //this.modalService.open(this.confirmDialog);
        }
      },
      (error) => {
        this.modalService.open(this.confirmDialog);
      }
    )
  }
}
