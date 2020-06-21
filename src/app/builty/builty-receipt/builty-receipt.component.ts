import { Component, OnInit } from '@angular/core';
import { BuiltyService } from '../../services/builty.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '../../../../node_modules/@angular/router';
import { DoService } from '../../services/do.service';
import { CanComponentDeactivate } from '../../services/deactivate.guard';

export interface Builtys {
  biltyNo: number;
  receivedDate: String;
  receivedQuantity: number;
  selected: boolean
}


@Component({
  selector: 'app-builty-receipt',
  templateUrl: './builty-receipt.component.html',
  styleUrls: ['./builty-receipt.component.css']
})
export class BuiltyReceiptComponent implements OnInit, CanComponentDeactivate {

  isbuiltytablevisible: boolean = false;
  runningbuiltiesInTable: Array<any> = [];
  builtiesAddedbyChecks: Array<any> = [];
  selectedAll: boolean;
  builtyListProperties: string[] = []
  builtyList = []

  constructor(private builtyService: BuiltyService, private doService: DoService,
      private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit() {
    //start spinner
    this.spinner.show();
    this.builtyService.getBitiesForUpdateReceipt().subscribe(
      (res) => {
        if(res.success){
            this.builtyList = res['data'];
        }
        //stop spinner
          this.spinner.hide();
      },
      (err) => {
        //stop spinner
        this.spinner.hide();
      }

    );
  }

  canDeactivate() {
    console.log('can deactivate triggered');
    this.doService.cachedDO = new Map();  //empty DO cache while moving away from this route
    return true;
  }

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
        if (element.biltyNo == runningDoForcheck.biltyNo) {
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
