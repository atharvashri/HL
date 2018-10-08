import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-builty-receipt-update',
  templateUrl: './builty-receipt-update.component.html',
//   styleUrls: ['./builty-receipt.component.css']
})
export class BuiltyReceiptUpdateComponent implements OnInit {

  constructor() { }

  @Input() builtyList;
  @Input() builtyListProperties;

  ngOnInit() {
  }

}
