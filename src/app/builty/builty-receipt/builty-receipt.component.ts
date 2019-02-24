import { Component, OnInit } from '@angular/core';
import { BuiltyService } from '../../services/builty.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '../../../../node_modules/@angular/router';
import { Observable } from '../../../../node_modules/rxjs';

export interface Builtys {
  builtyNo: number;
  receivedDate: String;
  receivedQuantity: number;
  selected: boolean
}


@Component({
  selector: 'app-builty-receipt',
  templateUrl: './builty-receipt.component.html',
  styleUrls: ['./builty-receipt.component.css']
})
export class BuiltyReceiptComponent implements OnInit {

  isbuiltytablevisible: boolean = false;
  runningbuiltiesInTable: Array<any> = [];
  builtiesAddedbyChecks: Array<any> = [];
  selectedAll: boolean;

  constructor(private builtyService: BuiltyService, private spinner: NgxSpinnerService,
      private router: Router) { }

  ngOnInit() {
    //start spinner

    let _return = this.builtyService.getActiveBuilties();
    if(_return instanceof Observable){
      this.spinner.show();
      _return.subscribe(
        (res) => {
          this.builtyList = res['data'];
          //stop spinner
          setTimeout(() => {
            this.spinner.hide();
          }, 1500)
        },
        (err) => {
          //stop spinner
          setTimeout(() => {
            this.spinner.hide();
          }, 1500)
        }
      );
    }else{
      this.builtyList = _return;
    }
  }

  builtyListProperties: string[] = [

  ]

  builtyList = []

  showSelectedBuilties() {

    if (this.builtiesAddedbyChecks.length > 0) {
      this.runningbuiltiesInTable = [];

      this.builtiesAddedbyChecks.forEach(element => {
        this.runningbuiltiesInTable.push(element);
      });

      this.isbuiltytablevisible = true;
    }
    else {
      // if (this.runningbuiltiesInTable.length > 1) {
      //   this.isrunningDoTablevisible = true;
      // }
      // else {
      this.runningbuiltiesInTable = []
      this.isbuiltytablevisible = false;
      //}
    }
  }

  updatecheckBoxList(runningDoselected, event) {
    let entryData: any;
    if (this.builtiesAddedbyChecks.length == 0) {
      this.builtiesAddedbyChecks.push(runningDoselected);
      return;
    }

    this.checkForDuplicateEntry(runningDoselected).then((data) => {
      if (event.target.checked) {
        if (!data.isPresent)
          this.builtiesAddedbyChecks.push(runningDoselected);
      }
      else {
        this.builtiesAddedbyChecks.splice(data.index, 1);
      }
    });
  }

  checkForDuplicateEntry(runningDoForcheck): any {
    return new Promise((resolve, reject) => {
      this.builtiesAddedbyChecks.forEach((element, index, array) => {
        if (element.builtyNo == runningDoForcheck.builtyNo) {
          resolve({
            isPresent: true,
            index: index
          })
        }
        if (array.length - 1 == index) {
          resolve({
            isPresent: false,
            index: -1
          })
        }
      })
    })
  }
  selectAllCheckbox(event) {

    if (event.target.checked) {
      this.builtiesAddedbyChecks = [];
      this.builtyList.forEach(element => {
        this.builtiesAddedbyChecks.push(element);
      });
    }
    else {
      this.builtiesAddedbyChecks = [];
      this.isbuiltytablevisible = false;
    }

    for (var i = 0; i < this.builtyList.length; i++) {
      this.builtyList[i].selected = this.selectedAll;
    }
  }

  cancel(){
    this.router.navigate(['builtylist']);
  }

}
