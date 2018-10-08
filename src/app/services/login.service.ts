import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'
import { HttpHeaders } from '@angular/common/http'
import { HttpClient } from '@angular/common/http'


@Injectable()
export class LoginService {

    url = 'localhost';
    public isloginDone = new Subject<boolean>();

    setLoginstatus(isloggedin) {
        this.isloginDone.next(isloggedin);
    }

    constructor(public http: HttpClient) {

    }



    login(data) {
        return this.http.post(this.url + '/login', data)
    }
}