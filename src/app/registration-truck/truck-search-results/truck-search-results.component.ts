import { Component, OnInit } from '@angular/core';

export interface TruckSearch {
  vechicleNo: String;
  PAN: String;
  ownerName: String;
}

@Component({
  selector: 'app-truck-search-results',
  templateUrl: './truck-search-results.component.html',
  styleUrls: ['./truck-search-results.component.css']
})
export class TruckSearchResultsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
