import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'

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
    styleUrls: ['do-running-list.component.css']
})

export class DoRunningListComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
    }

    isrunningDoTablevisible: boolean = false;

    @Input() activeDoProperties: any
    @Input() activeDoList: any

    onUpdateDO(evt) {
        this.router.navigate(['do'], { queryParams: { update: evt.target.id } });
    }
}