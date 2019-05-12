import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BuiltyService } from '../services/builty.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'bilty-edit-icon',
  template: '<img class="link" src="/assets/img/delete-icon.png" width="20" id="{{currBilty.builtyNo}}_delete" height="20" (click)="clickHandler($event)" title="Delete">'
})
export class BiltyDeleteActionComponent{

  constructor(private router: Router, private biltyService: BuiltyService, private toasterservice: ToastrService){

  }
  currBilty: any
  clickHandler(){
    if(confirm("Are you sure to delete the builty " + this.currBilty.builtyNo + "?")){
      this.biltyService.deleteBuilty(this.currBilty.id).subscribe(
        (res) => {
          if(res.success){
            this.toasterservice.success(res.message);
            //this.builtylist.splice(index, 1);
          }else{
            this.toasterservice.error(res.message);
          }
        },
        () => {
          this.toasterservice.error("Internal server error!");
        }
      )
    }
  }
}
