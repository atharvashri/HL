import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { TruckPanService } from '../services/truck.pan.services'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration-pan',
  templateUrl: './registration-pan.component.html',
  styleUrls: ['./registration-pan.component.css']
})
export class RegistrationPanComponent implements OnInit {

  selectedPanAction: string = "vehiclelist"
  selectedvehicle: string;
  constructor(private truckPanService: TruckPanService, private modalService: NgbModal, private toaster: ToastrService) { }

  ngOnInit() {
  }

  formtitleParent: string;

  isAddpan: boolean = false;
  isUpdateVehicle: boolean = false;

  @Output() modalEvt = new EventEmitter();
  @ViewChild('updateDetails') update
  @ViewChild('confirmDialog') confirmDialog

  vehicleList = ["MH10AB1234", "MH10AB1765", "MH10AB1354", "MH10AB1231", "MH10AB1761", "MH10AB1351", "MH10AB1232", "MH10AB1762", "MH10AB1352", "MH10AB1233", "MH10AB1763", "MH10AB1353",
    "MH10AB1236", "MH10AB1768", "MH10AB1359", "MH10AB1223", "MH10AB1095", "MH10AB1654"]

  open() {
    this.formtitleParent = "Add PAN Details"
    //console.log("model - event");
    this.modalService.dismissAll()
    this.update.openModel();
  }

  performPanAction(id) {
    switch (this.selectedPanAction) {
      case "vehiclelist":
        this.showVehicleList(id);
        break;
      case "addpan":
        this.addPan();
        break;
      case "updatepan":
        this.updatePan();
        break;
      default:
        this.toaster.error("Please select action before submission");
        break;
    }
  }

  showVehicleList(id) {
    this.truckPanService.getVehicleByPanNo(id).subscribe(
      (data) => {
        this.vehicleList

      },
      (error) => {

      }
    )
    this.isUpdateVehicle = true;
  }

  updatePan() {
    this.isUpdateVehicle = false;
    //if (this.selectedvehicle != null) {
    this.formtitleParent = "Update PAN Details"
    this.modalService.dismissAll()
    this.update.openModel();
    //}
  }

  addPan() {
    this.isUpdateVehicle = false;
    this.isAddpan = true;
    this.formtitleParent = "Add PAN Details"
    this.modalService.dismissAll()
    this.update.openModel();

  }

  updateVehicleDetails() {
    if (this.selectedvehicle == undefined) {
      this.toaster.error("Please select the vehicle");
      return
    }

    this.formtitleParent = "Update Vehicle Details"
    this.modalService.dismissAll()
    this.update.openModel();
  }
}
