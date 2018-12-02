import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { PermitService } from '../services/permit.service';
import { AppUtil } from '../utils/app.util';

@Component({
  selector: 'app-permit',
  templateUrl: './permit.component.html',
  styleUrls: ['./permit.component.css']
})
export class PermitComponent implements OnInit {


  constructor(private permitformbuilder: FormBuilder, private toaster: ToastrService,
      private permitservice: PermitService) { }

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
    permitdata.enddate = AppUtil.transformdate(permitdata.enddate);
    this.permitservice.createpermit(permitdata).subscribe(
      (res) => {
        if(res.success){
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
    permitdata.enddate = AppUtil.transformdate(permitdata.enddate);
    this.permitservice.updatepermit(permitdata).subscribe(
      (res) => {
        if(res.success){
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

  showpermitform(index){
    this.updatemode = true;
    this.showform = true;
    this.selectedpermit = this.activepermits[index];
    this.selectedpermit.index = index;
    this.permitform.controls.permitnumber.setValue(this.selectedpermit.permitnumber);
    this.permitform.controls.quantity.setValue(this.selectedpermit.quantity);
    this.permitform.controls.enddate.setValue(AppUtil.transformdate(this.selectedpermit.enddate));
  }

}
