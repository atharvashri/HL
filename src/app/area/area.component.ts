import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  collaries = [];
  ngOnInit() {
    this.arealist = [];
    this.service.getAreaList().subscribe(
      (res) => {
        if(res.success){
          this.arealist = res.data;
        }
      }
    )
    this.collaries = [];
  }

  constructor(private areaFormbuilder: FormBuilder,
      private toaster: ToastrService,
      private service: DataService) {

  }

  arealist: Array<any>;
  showform: boolean = false;
  updatemode: boolean = false;
  selectedarea;

  areaForm = this.areaFormbuilder.group({
    areaname: ['', Validators.required],
    collary: []
  })

  addCollary(){
    let formEntry = this.areaForm.controls.collary.value;
    if(this.collaries.includes(formEntry.toUpperCase())){
        this.toaster.error("Collary is already added");
    }else{
      this.collaries.push(formEntry.toUpperCase());
    }
  }

  removeOption(index: number){
    this.collaries.splice(index, 1);
    //console.log(this.destinations);
  }

  onSubmit(){
    if(this.areaForm.invalid){
      this.toaster.error("Area name is mandatory");
      return;
    }
    let area = {
      "name": this.areaForm.controls.areaname.value,
      "collaries": this.collaries
    }
    this.service.createArea(area).subscribe(
      (res) => {
        if(res.success){
          this.areaForm.reset();
          this.collaries = [];
          this.arealist.push(res.data);
          this.toaster.success(res.message);
        }else{
            this.toaster.error(res.message);
        }

      },
      (error) => {
        this.toaster.error("Problem saving area data");
      }
    )
  }

  onUpdate(){
    let area = {
      "id": this.selectedarea.id,
      "name": this.areaForm.controls.areaname.value,
      "collaries": this.collaries,
    }
    this.service.updateArea(area).subscribe(
      (res) => {
        if(res.success){
          this.areaForm.reset();
          this.collaries = [];
          this.arealist[this.selectedarea.index] = res.data;
          this.updatemode = false;
          this.showform = false;
          this.toaster.success(res.message);
        }else{
            this.toaster.error(res.message);
        }

      },
      (error) => {
        console.log(error);
        this.toaster.error("Problem saving area data");
      }
    )
  }

  showareaform(index){
    this.updatemode = true;
    this.showform = true;
    this.selectedarea = this.arealist[index];
    this.selectedarea.index = index;
    this.areaForm.controls.areaname.setValue(this.selectedarea.name);
    this.collaries = this.selectedarea.collaries;
  }

}
