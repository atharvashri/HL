import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { PermitService } from '../services/permit.service';
import { AppUtil } from '../utils/app.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-permit',
  templateUrl: './permit.component.html',
  styleUrls: ['./permit.component.css']
})
export class PermitComponent implements OnInit {


  constructor(private permitformbuilder: FormBuilder, private toaster: ToastrService,
      private permitservice: PermitService, private modalService: NgbModal ) { }

  ngOnInit() {
    this.activepermits = [];
    this.permitservice.getpermits().subscribe(
      (res) => {
        if(res.success){
          this.activepermits = res.data;
        }
      }
    )
  }
  @ViewChild('addPermitModal') content;
  popupTitle;
  activepermits: Array<any>;
  showform: boolean = false;
  updatemode: boolean = false;
  selectedpermit;
  permitform = this.permitformbuilder.group({
    permitnumber: ['', Validators.required],
    quantity: ['', Validators.required],
    enddate: ['', Validators.required]
  })

  createpermit(){
    if(!this.permitform.valid){
      this.toaster.error("All fields are mandatory to create a permit");
      return;
    }
    let permitdata = this.permitform.getRawValue();
    //permitdata.enddate = AppUtil.transformdate(permitdata.enddate);
    this.permitservice.createpermit(permitdata).subscribe(
      (res) => {
        if(res.success){
          this.modalService.dismissAll();
          this.toaster.success(res.message);
          this.activepermits.push(res.data);
        }else{
          this.toaster.error(res.message);
        }
      },
      (error) => {
        this.toaster.error("There was some problem while creating permit");
      }
    )
  }

  updatepermit(){
    if(!this.permitform.valid){
      this.toaster.error("All fields are mandatory to create a permit");
      return;
    }
    let permitdata = this.permitform.getRawValue();
    permitdata.id = this.selectedpermit.id;
    //permitdata.enddate = AppUtil.transformdate(permitdata.enddate);
    permitdata.permitbalance = this.selectedpermit.permitbalance;
    permitdata.createddate = this.selectedpermit.createddate;
    permitdata.createdby = this.selectedpermit.createdby;
    this.permitservice.updatepermit(permitdata).subscribe(
      (res) => {
        if(res.success){
          this.modalService.dismissAll();
          this.toaster.success(res.message);
          this.activepermits[this.selectedpermit.index] = res.data;
        }else{
          this.toaster.error(res.message);
        }
      },
      (error) => {
        this.toaster.error("There was some problem while updating permit");
      }
    )
  }

  showpermitform(updatemode, index){
    this.updatemode = updatemode;
    this.modalService.open(this.content);
    if(this.updatemode){
      this.popupTitle = "Update Permit"
      this.selectedpermit = this.activepermits[index];
      this.selectedpermit.index = index;
      this.permitform.controls.permitnumber.setValue(this.selectedpermit.permitnumber);
      this.permitform.controls.permitnumber.disable();
      this.permitform.controls.quantity.setValue(this.selectedpermit.quantity);
      this.permitform.controls.enddate.setValue(this.selectedpermit.enddate);
    }else{
      this.popupTitle = "Add Permit"
      this.permitform.controls.permitnumber.enable();
      this.permitform.reset();
    }

  }

}
