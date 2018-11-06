import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { TruckPanService } from '../services/truck.pan.services'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {  FileUploader} from 'ng2-file-upload/ng2-file-upload';
import { NgForm } from '../../../node_modules/@angular/forms';
import { FileUploadService } from '../services/fileupload.service';
import { CustomValidator } from '../utils/custom.validator';
import { AppConfig } from '../app-config';

@Component({
  selector: 'app-registration-pan',
  templateUrl: './registration-pan.component.html',
  styleUrls: ['./registration-pan.component.css']
})
export class RegistrationPanComponent implements OnInit {
  uploader: FileUploader;
  selectedPanAction: string = "vehiclelist"
  selectedvehicle: any;
  isUpdate: boolean;
  fileuplodurl: string = "http://localhost:8080/upload/rccopy";
  searchby: string = "pan";
  formtitleParent: string;
  isAddpan: boolean = false;
  isUpdatePan: boolean = false;
  noVehicle: boolean = true;
  EnteredPAN:string;
  panList: Array<any> = [];
  panSelected;
  s3url: string;
  constructor(private truckPanService: TruckPanService, private modalService: NgbModal,
    private toaster: ToastrService, private uploaderService: FileUploadService) { }

  ngOnInit() {
    this.selectedvehicle = {}
    this.uploader = this.uploaderService.getFileUploader();
    this.uploader.onAfterAddingFile = file => {
      if(this.uploader.queue.length > 1){
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
    }
    this.truckPanService.changeEmitted$.subscribe(data => {
      this.panSelected=data;
      this.isUpdatePan = true;
      this.isAddpan = false;
    })
    this.s3url = AppConfig.AWS_S3_BUCKET;
  }

  @Output() modalEvt = new EventEmitter();
  @ViewChild('addDetails') add
  @ViewChild('updateDetails') update
  @ViewChild('addvehicleDialog') addvehicleDialog;
  @ViewChild('addvehicleform') addvehicleform: NgForm;
  @ViewChild('searchText') searchText: ElementRef;
  vehicleList = []

  // open() {
  //   this.formtitleParent = "Add PAN Details"
  //   //console.log("model - event");
  //   this.modalService.dismissAll()
  //   this.add.openModel();
  // }

performSearch(searchText){
  if (searchText == '') {
    this.toaster.error("please enter the search criteria to proceed");
    return;
  }
  if(this.searchby === 'pan'){
    this.searchByPan(searchText);
  }else if(this.searchby === 'vehicle'){
    this.searchByVehicle(searchText);
  }
}

selectpan(pan){
  console.log("selectpan is triggered");
  this.panSelected = pan;
  this.isUpdatePan = true;
}
searchByVehicle(vehicleText){
  this.isUpdatePan = false;
  this.isAddpan = false;
    this.truckPanService.getVehiclesByVehicleNo(vehicleText).subscribe(
      (res) => {
        if(res['data']){
          //vehicle found
          this.panList = res["data"];
          if(this.panList && this.panList.length)
            this.noVehicle = false;
          this.setVehicleList();
        }else{
          this.noVehicle = true;
        }
      }
    )
}

searchByPan(panText) {
    this.EnteredPAN = panText;
    if(CustomValidator.panValidator(this.searchText.nativeElement)){
      this.toaster.error("please enter a PAN in valid format");
      return;
    }
    this.noVehicle = true;
    this.truckPanService.getPANByID(panText).subscribe(
      (res) => {
        this.panList = res["data"];
        if (!this.panList || !this.panList.length) {
          this.isUpdatePan = false;
          this.isAddpan = true;
        } else {
          this.isUpdatePan = true;
          this.isAddpan = false;
          this.panSelected = this.panList[0];
          this.setVehicleList();
        }
      },
      (error) => {

      }
    )

}

setVehicleList(){
  this.vehicleList = [];
    this.panList.forEach((pan) =>{
      if(pan.vehicles && pan.vehicles.length){
        pan.vehicles.forEach((vehicle) =>{
          if(this.searchby == 'vehicle'){
            if(new RegExp(this.searchText.nativeElement.value, 'gi').test(vehicle.vehicleNo)){
              vehicle.panNo = pan.panNo;
              vehicle.panHolderName = pan.panHolderName;
                this.vehicleList.push(vehicle);
            }
          }else{
            vehicle.panNo = pan.panNo;
            vehicle.panHolderName = pan.panHolderName;
            this.vehicleList.push(vehicle)
          }

        })
      }

    })
  }

  openupdatePANModel() {
    //this.isUpdatePan = false;
    this.formtitleParent = "Update PAN Details"
    this.modalService.dismissAll()
    this.update.openModel();
  }

  openAddPANModel() {
    this.formtitleParent = "Add PAN Details"
    this.modalService.dismissAll()
    this.add.openModel();
  }

openAddVehicleDialog(isUpdate){
  this.modalService.dismissAll()
  this.isUpdate = isUpdate;
  if(isUpdate){
    this.panList.forEach(pan => {
      if(this.selectedvehicle.panNo === pan.panNo){
        this.panSelected = pan;
      }
    })
  }else{
    this.selectedvehicle = {};
  }
  if(!this.panSelected){
    this.toaster.error("No PAN is selected to link vehicle");
    return;
  }
  this.uploader.clearQueue();
  this.uploaderService.setPanaNo(this.panSelected.panNo);
  this.modalService.open(this.addvehicleDialog);
}

  removeVehicle(index){
    confirm("Are you sure to remove Vehicle from PAN?\n\nNote- Vehicle will be removed only if there is no builty generated against it.");
    this.vehicleList = this.vehicleList.filter((vehicle, idx) => idx !== index);
    this.truckPanService.updateVehicles(this.panSelected.panNo, this.vehicleList).subscribe(
      (res) => {
        if(res.success){
          this.toaster.success("Vehicle removed successfully")
        }else{
          this.toaster.error("Some problem while removing vehicle")
        }
      },
      (error) => {

      }
    )
  }

addvehicle(rccopy){
  if(!this.panSelected){
    this.toaster.error("Operation not allowed as no PAN is selected");
    return;
  }
  if(!this.selectedvehicle){
    this.toaster.error("Vehicle number is mandatory to link vehicle");
    return;
  }
  let obj = {
    vehicleNo: this.selectedvehicle.vehicleNo,
    rcCopyLink: this.getFileNameForRC(rccopy.value)
  }

  this.panSelected.vehicles.push(obj);
  this.updateVehicles();

}

updateVehicles(){
  this.truckPanService.updateVehicles(this.panSelected.panNo, this.panSelected.vehicles).subscribe(
    (res) => {
      if(res.success){
        this.vehicleList = this.panSelected.vehicles;
        if(this.isUpdate)
          this.toaster.success("Vehicle updated successfully")
        else
          this.toaster.success("Vehicle added successfully")
        this.modalService.dismissAll();
      }else{
        this.toaster.error(res.message);
        this.panSelected.vehicles.pop();
      }
    },
    (error) => {
      this.toaster.error("Something went wrong");
      this.panSelected.vehicles.pop();
    }
  )
  this.uploaderService.uploadfiles(['rccopy'], this.selectedvehicle.vehicleNo)
}

updatecopy(rccopy){
  if(!this.selectedvehicle){
    this.toaster.error("No vehicle selected to update")
    return
  }
  if(!rccopy.value){
    this.toaster.error("Nothing to update as RC copy is not uploaded")
    return
  }

  this.panSelected.vehicles.forEach(item => {
    if(item.vehicleNo === this.selectedvehicle.vehicleNo){
      item.rcCopyLink = this.getFileNameForRC(rccopy.value)
    }
  })
  this.updateVehicles();
}

  getFileNameForRC(filename: string): string{
    if(filename){
      let fileExtension = filename.substring(filename.lastIndexOf("."), filename.length);
      return `${this.panSelected.panNo}_${this.selectedvehicle.vehicleNo}`.toUpperCase() + fileExtension;
    }else{
      return "";
    }
  }
}
