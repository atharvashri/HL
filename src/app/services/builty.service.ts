import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs'
import { HttpHeaders } from '@angular/common/http'
import { HttpClient } from '@angular/common/http'
import { AppConfig } from '../app-config';

@Injectable()
export class BuiltyService {
    url: string = AppConfig.API_ENDPOINT;

    constructor(public http: HttpClient) {

    }

    createBuiltyService(data) {
        return this.http.post(this.url + '/builty', data)
    }

    getActiveBuiltiesService() {
        return this.http.get(this.url + '/do/active');
    }

    getAllbuiltiesService() {
        return this.http.get(this.url + '/builty?get=all');
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