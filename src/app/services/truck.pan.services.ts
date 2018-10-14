import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app-config';


@Injectable()
export class TruckPanService {

    url: string = AppConfig.API_ENDPOINT;

    constructor(public http: HttpClient) {

    }

    registerPAN(data) {
        return this.http.post(this.url + 'pan', data);
    }

    getAllRegisteredPAN() {

    }

    getOnePANByID(id) {
        return this.http.get(this.url + `pan/${id}`)
    }

    updatePAN(data, id) {
        return this.http.put(this.url + `pan/${id}`, data);
    }

    getVehicleByPanNo(id) {
        return this.http.get(this.url + `pan/${id}`)
    }
}
