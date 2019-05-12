import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app-config';


@Injectable()
export class DataService {

    url: string = AppConfig.API_ENDPOINT;
    constructor(public http: HttpClient) {

    }

    createParty(data) {
        return this.http.post(this.url + '/party', data);
    }

    createArea(data): any{
      return this.http.post(this.url + '/area', data);
    }

    getAreaList(): any{
      return this.http.get(this.url + '/area');
    }

    updateArea(data): any{
      return this.http.put(this.url + '/area', data);
    }

    getPumpList(): any{
      return this.http.get(this.url + '/pump');
    }

    createPump(data): any{
      return this.http.post(this.url + '/pump', data);
    }

    removePump(data): any{
      return this.http.put(this.url + '/pump/remove', data);
    }

}
