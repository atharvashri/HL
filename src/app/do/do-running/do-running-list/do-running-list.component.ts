import { Component, OnInit, Input } from '@angular/core';

export interface RunningDo {
    doId: number;
    collaryName: string;
    quantity: number;
    areaDoNo: number;
    bspDoNo: number;
}

@Component({
    selector: 'app-do-running-list',
    templateUrl: './do-running-list.component.html',
})

export class DoRunningListComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }
    
    isrunningDoTablevisible: boolean = false;

    @Input() activeDoProperties: any
    @Input() activeDoList: any
    

}