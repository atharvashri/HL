import { Component, OnInit, Output } from '@angular/core';
import { DoService } from '../../services/do.service'
import { NgxSpinnerService } from 'ngx-spinner';

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

  constructor(private doService: DoService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    //start spinner
    this.spinner.show();
    this.doService.getActiveDos().subscribe(
      (res) => {
        console.log(res.data);
        this.activeDoList = res.data;
        //stop spinner
        setTimeout(() => {
          this.spinner.hide();
        }, 1500)
      },
      (err) => {

      }
    );
  }

  activeDoProperties: Array<any>
  activeDoList;

  showAllRunningDo() {

    if (this.doAddedbyChecks.length > 0) {
      this.activeDoProperties = [
        'DO Id',
        'Received Date',
        'Due Date',
        'Balance',
        'DO Owner',
        'Destination Party',
        '',
        ''
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
        if (element.id == runningDoForcheck.id) {
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
