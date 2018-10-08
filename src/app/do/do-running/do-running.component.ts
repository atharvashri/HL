import { Component, OnInit, Output } from '@angular/core';
import { DoService } from '../../services/do.service'

export interface RunningDo {
  doId: number;
  collaryName: string;
  quantity: number;
  areaDoNo: number;
  bspDoNo: number;
  selected: boolean
}


@Component({
  selector: 'app-do-running',
  templateUrl: './do-running.component.html',
  styleUrls: ['./do-running.component.css']
})

export class DoRunningComponent implements OnInit {

  selectedAll: boolean;
  isrunningDoTablevisible: boolean = false;
  runningDosInTable: Array<any> = [];
  doAddedbyChecks: Array<any> = []

  constructor(private doService: DoService) { }

  ngOnInit() {
    this.doService.getActiveDosService().subscribe(
      (data) => {

      },
      (err) => {

      }
    );
  }

  activeDoProperties: Array<any>


  activeDoList: RunningDo[] = [
    { doId: 1, collaryName: 'bijuri', quantity: 100, areaDoNo: 1234, bspDoNo: 37272, selected: false },
    { doId: 2, collaryName: 'kotma', quantity: 300, areaDoNo: 2334, bspDoNo: 37622, selected: false },
    { doId: 3, collaryName: 'beohari', quantity: 400, areaDoNo: 3262, bspDoNo: 374733, selected: false },
    { doId: 4, collaryName: 'bijuri', quantity: 100, areaDoNo: 1234, bspDoNo: 37272, selected: false },
    { doId: 5, collaryName: 'kotma', quantity: 300, areaDoNo: 2334, bspDoNo: 37622, selected: false },
    { doId: 6, collaryName: 'beohari', quantity: 400, areaDoNo: 3262, bspDoNo: 374733, selected: false },
    { doId: 7, collaryName: 'bijuri', quantity: 100, areaDoNo: 1234, bspDoNo: 37272, selected: false },
    { doId: 8, collaryName: 'kotma', quantity: 300, areaDoNo: 2334, bspDoNo: 37622, selected: false },
    { doId: 9, collaryName: 'beohari', quantity: 400, areaDoNo: 3262, bspDoNo: 374733, selected: false },
    { doId: 10, collaryName: 'bijuri', quantity: 100, areaDoNo: 1234, bspDoNo: 37272, selected: false },
    { doId: 11, collaryName: 'kotma', quantity: 300, areaDoNo: 2334, bspDoNo: 37622, selected: false },
    { doId: 12, collaryName: 'beohari', quantity: 400, areaDoNo: 3262, bspDoNo: 374733, selected: false },
  ];


  showAllRunningDo() {

    if (this.doAddedbyChecks.length > 0) {
      this.activeDoProperties = [
        'doId',
        'collaryName',
        'quantity',
        'areaDoNo',
        'bspDoNo'
      ];

      this.runningDosInTable = [];

      this.doAddedbyChecks.forEach(element => {
        this.runningDosInTable.push(element);
      });

      this.isrunningDoTablevisible = true;
    }
    else {
      // if (this.runningDosInTable.length > 1) {
      //   this.isrunningDoTablevisible = true;
      // }
      // else {
        this.runningDosInTable = []
        this.isrunningDoTablevisible = false;
      //}
    }
  }

  updatecheckBoxList(runningDoselected, event) {
    let entryData: any;
    if (this.doAddedbyChecks.length == 0) {
      this.doAddedbyChecks.push(runningDoselected);
      return;
    }

    this.checkForDuplicateEntry(runningDoselected).then((data) => {
      if (event.target.checked) {
        if (!data.isPresent)
          this.doAddedbyChecks.push(runningDoselected);
      }
      else {
        this.doAddedbyChecks.splice(data.index, 1);
      }
    });
  }

  checkForDuplicateEntry(runningDoForcheck): any {
    return new Promise((resolve, reject) => {
      this.doAddedbyChecks.forEach((element, index, array) => {
        if (element.doId == runningDoForcheck.doId) {
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
      this.doAddedbyChecks = [];
      this.activeDoList.forEach(element => {
        this.doAddedbyChecks.push(element);
      });
    }
    else {
      this.doAddedbyChecks = [];
      this.isrunningDoTablevisible = false;
    }

    for (var i = 0; i < this.activeDoList.length; i++) {
      this.activeDoList[i].selected = this.selectedAll;
    }
  }

}
