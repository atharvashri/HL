import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs'


@Injectable()
export class PartyService {

    url: string = "http://localhost:8080"
    constructor(public http: HttpClient) {

    }

    createPartyService(data) {
        return this.http.post(this.url + '/party', data);
    }

}