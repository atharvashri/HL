import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { AppConfig } from '../app-config';


@Injectable()
export class LoginService {

    url: string = AppConfig.API_ENDPOINT;
    public isloginDone = new Subject<boolean>();

    setLoginstatus(isloggedin) {
        this.isloginDone.next(isloggedin);
    }

    constructor(public http: HttpClient) {

    }



    login(data) {
        return this.http.post(this.url + '/auth', data)
    }
}
