import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app-config';


@Injectable()
export class PartyService {

    url: string = AppConfig.API_ENDPOINT;
    constructor(public http: HttpClient) {

    }

    createPartyService(data) {
        return this.http.post(this.url + '/party', data);
    }

}
