import { Component, OnInit } from '@angular/core';

export interface FieldEntries {
    builtyNo: number;
    Do_no: number;
    vehicleNo: string;
    freightRate: number;
    advance: number;
    diesel: number
    quantity: number;
}

@Component({
    selector: 'app-field-entry-approve',
    templateUrl: './field-entry-approve.component.html',
    // styleUrls: ['./field-entry-aprove.component.css']
})
export class FieldEntryApproveComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }
    fieldReportscolumnNames: string[] = [
        "Builty No",
        "Do No",
        "Vehicle No",
        "Freight Rate",
        "Advance",
        "Diesel",
        "Quantity",
        ,
    ]

    fieldReportsProperties: FieldEntries[] =
    [
        { builtyNo: 1234, Do_no: 9780, vehicleNo: "MH12AC1231", freightRate: 100, advance: 1000, diesel: 20, quantity: 200 }
    ]

}
