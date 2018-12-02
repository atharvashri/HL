import { Component, OnInit } from '@angular/core';
import { BuiltyService } from '../../services/builty.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { Router } from '../../../../node_modules/@angular/router';
import { Observable } from '../../../../node_modules/rxjs';
import { AppUtil } from '../../utils/app.util';

@Component({
  selector: 'app-builty-list',
  templateUrl: './builty-list.component.html',
  styleUrls: ['./builty-list.component.css']
})
export class BuiltyListComponent implements OnInit {

  builtylist: Array<any>;
  activebuilties: Array<any>;
  viewactive: boolean;
  userrole;
  constructor(private builtyservice: BuiltyService, private toasterservice: ToastrService,
        private router: Router) { }

  ngOnInit() {
    let _return = this.builtyservice.getActiveBuilties();
    if(_return instanceof Observable){
      _return.subscribe(
        (res) => {
          if(res.success){
              this.builtyservice.setActiveBuilties(res.data);
              this.builtylist = res.data;
          }else{
            this.toasterservice.error(res.message);
          }
        }
      );
    }else{
        this.builtylist = _return;
    }
    this.viewactive = true;
    this.userrole = localStorage.getItem('currentUser');
  }

  showupdateform(index){
    let _builty = this.builtylist[index];
    this.builtyservice.setBuiltyToUpdate(_builty);
    this.router.navigate(['builty'], { queryParams: { update: 'true' } })
  }

  showCompletedBuilties(){
    this.viewactive = false;
    this.builtyservice.getCompletedBuilties().subscribe(
      (res) => {
        if(res.success){
          this.builtylist = res.data;
        }else{
          this.toasterservice.error("Problem retireving completed builty list");
        }
      },
      (error) => {
        this.toasterservice.error("Internal server error!");
      }
    )
  }

  showActiveBuilties(){
    this.viewactive = true;
    this.builtylist = this.builtyservice.getActiveBuilties();
  }

  showupdatereceiptform(){
    this.router.navigate(['builtyreceipt']);
  }

  deletebuilty(index){
    let _builty = this.builtylist[index];
    if(confirm("Are you sure to delete the builty " + _builty.builtyNo + "?")){
      this.builtyservice.deleteBuilty(_builty.id).subscribe(
        (res) => {
          if(res.success){
            this.toasterservice.success(res.message);
            this.builtylist.splice(index, 1);
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

  canedit(){
    if(this.userrole === AppUtil.ROLE_ADMIN){
      return true;
    }
    return false;
  }

}
