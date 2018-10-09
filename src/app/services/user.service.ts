import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs'


@Injectable()
export class UserService {

    url: string = "http://localhost:8080/";
    constructor(public http: HttpClient) {

    }

    addUser(data) {
        return this.http.post(this.url + 'user', data);
    }

    getAlluser() {
        return this.http.get(this.url + 'user');
    }

    getOneuser(userName) {
        return this.http.get(this.url + 'user/'+`${userName}`);
    }

    updateUser(data, userName) {
        return this.http.get(this.url + 'user/'+`${userName}`, data);
    }
}