import { Component, OnInit } from '@angular/core';

export interface FieldReport  {

}

@Component({
  selector: 'app-field-report-self',
  templateUrl: './field-report-self.component.html',
  styleUrls: ['./field-report-self.component.css']
})
export class FieldReportSelfComponent implements OnInit {

  reportProperties;
  constructor() { }

  ngOnInit() {
  }

}
