import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs'


@Injectable()
export class ReportService {

    constructor(public http: Http) {
        
    }
}