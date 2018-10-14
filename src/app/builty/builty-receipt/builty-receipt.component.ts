import { Component, OnInit } from '@angular/core';
import { BuiltyService } from '../../services/builty.service'

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

  constructor(private builtyService: BuiltyService) { }

  ngOnInit() {
    this.builtyService.getAllbuiltiesService().subscribe(
      (res) => {
        console.log(res);
        this.builtyList = res['data'];
      },
      (err) => {

      }
    );
  }

  builtyListProperties: string[] = [

  ]

  builtyList = []

  showAllRunningDo() {

    if (this.builtiesAddedbyChecks.length > 0) {
      this.builtyListProperties = [
        "Builty No",
        "Received Date",
        "Received Quantity"
      ];

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

}
