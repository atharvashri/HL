import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AppConfig } from '../app-config';


@Injectable()
export class VehicleService {

    url: string = AppConfig.API_ENDPOINT + '/vehicle';
    constructor(public http: HttpClient) {

    }

    getAllVehicleList(){
        return this.http.get(this.url);
    }
}
