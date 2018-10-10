import { Component, OnInit } from '@angular/core';

export interface PanSearch {
  vechicleNo: String;
  PAN: String;
  ownerName: String;
}

@Component({
  selector: 'app-pan-search-results',
  templateUrl: './pan-search-results.component.html',
  styleUrls: ['./pan-search-results.component.css']
})
export class PanSearchResultsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
