import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-pump',
  templateUrl: './pump.component.html',
  styleUrls: ['./pump.component.css']
})
export class PumpComponent implements OnInit {

  pumps = [];
  pumpName;
  ngOnInit() {
    this.service.getPumpList().subscribe(
      (res) => {
        if(res.success){
          this.pumps = res.data;
        }
      }
    )
  }

  constructor(private toaster: ToastrService,
      private service: DataService) {

  }

  addPump(){
    if(!this.pumpName){
      this.toaster.error("Pump name is empty");
      return;
    }
    if(this.pumps.includes(this.pumpName.toUpperCase())){
        this.toaster.error("Pump name is already added");
    }
    let pump = {
      name: this.pumpName.toUpperCase()
    }
    this.service.createPump(pump).subscribe(
      (res) => {
        if(res.success){
            this.pumps.push(res.data);
            this.toaster.success(res.message);
        }else{
          this.toaster.error(res.message);
        }
      },
      () => {
        this.toaster.error("Internal server error!");
      }
    )

  }

  removePump(index: number){
    this.service.removePump(this.pumps[index]).subscribe(
      (res) => {
        if(res.success){
            this.pumps.splice(index, 1);
            this.toaster.success(res.message);
        }else{
          this.toaster.error(res.message);
        }
      },
      () => {
        this.toaster.error("Internal server error!");
      }
    )

    //console.log(this.destinations);
  }

}
