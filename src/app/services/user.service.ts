import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs'
import { AppConfig } from '../app-config';


@Injectable()
export class UserService {

    url: string = AppConfig.API_ENDPOINT;
    constructor(public http: HttpClient) {

    }

    addUser(data): any {
        return this.http.post(this.url + '/user', data);
    }

    getAlluser() {
        return this.http.get(this.url + '/user');
    }

    getOneuser(userName) {
        return this.http.get(this.url + '/user/'+`${userName}`);
    }

    updateUser(data): any {
        return this.http.put(this.url + '/user', data);
    }

    getByRole(rolename){
      return this.http.get(this.url + '/user/role/' + rolename);
    }

    changePassword(data): any{
      return this.http.put(this.url + '/user/updatePassword', data);
    }
}
