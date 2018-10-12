import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs'


@Injectable()
export class TruckPanService {

    url: string = "http://localhost:8080/"

    constructor(public http: HttpClient) {

    }

    registerPAN() {

    }

    getAllRegisteredPAN() {

    }

    getOnePANByID(id) {
        return this.http.get(this.url + `pan/${id}`)
    }

    updatePAN() {

    }

    getVehicleByPanNo(id) {
        return this.http.get(this.url + `pan/${id}`)
    }
}