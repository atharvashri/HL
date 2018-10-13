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
  EnteredPAN:string;
  panData;

  @Output() modalEvt = new EventEmitter();
  @ViewChild('addDetails') add 
  @ViewChild('updateDetails') update
  @ViewChild('confirmDialog') confirmDialog

  vehicleList = []

  // open() {
  //   this.formtitleParent = "Add PAN Details"
  //   //console.log("model - event");
  //   this.modalService.dismissAll()
  //   this.add.openModel();
  // }

  performPanAction(id) {
    if (id == '') {
      this.toaster.error("please enter the PAN number to proceed");
      return;
    }
    this.showVehicleList(id);
  }

  showVehicleList(id) {
    this.EnteredPAN = id;
    this.truckPanService.getVehicleByPanNo(id).subscribe(
      (res) => {
        console.log(res['data']);
        if (res['data'] == null) {
          this.showAddPanbtn();
        }
        else {
          this.isUpdateVehicle = true;
          this.isAddpan = false;
          this.vehicleList = [];
          this.panData = res["data"];
          res['data']['vehicles'].forEach(element => {
            this.vehicleList.push(element.vehicleNo)
          });
        }
      },
      (error) => {

      }
    )

  }

  openupdatePANModel() {
    this.isUpdateVehicle = false;
    this.formtitleParent = "Update PAN Details"
    this.modalService.dismissAll()
    this.update.openModel();
  }

  showAddPanbtn() {
    this.isUpdateVehicle = false;
    this.isAddpan = true;
  }

  openAddPANModel() {
    this.formtitleParent = "Add PAN Details"
    this.modalService.dismissAll()
    this.add.openModel();
  }

  updateVehicleDetails() {
    if (this.selectedvehicle == undefined) {
      this.toaster.error("Please select the vehicle");
      return
    }

    this.formtitleParent = "Update Vehicle Details"
    this.modalService.dismissAll()
    //this.update.openModel();
  }
}
