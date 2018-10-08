import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs'
import { HttpHeaders } from '@angular/common/http'
import { HttpClient } from '@angular/common/http'

@Injectable()
export class BuiltyService {
    url: string = "localhost"

    constructor(public http: HttpClient) {

    }

    createBuiltyService() {

    }

    getActiveBuiltiesService() {
        return this.http.get(this.url + '/do/active');
    }

    getAllbuiltiesService() {

    }

    getCompletedBuiltiesService() {

    }

    getBuiltybyIDService() {

    }

    approveBuiltyService() {

    }

    builtyReceiptService() {

    }

    updateBuiltyService() {

    }
}