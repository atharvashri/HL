import { AppConfig } from "../app-config";
import { Injectable } from "../../../node_modules/@angular/core";
import { HttpClient } from "../../../node_modules/@angular/common/http";

@Injectable()
export class PermitService {

    url: string = AppConfig.API_ENDPOINT;
    constructor(public http: HttpClient) {

    }

    createpermit(data): any {
        return this.http.post(this.url + '/permit', data);
    }

    updatepermit(data): any{
      return this.http.put(this.url + '/permit', data);
    }

    getpermits(filter?): any{
      filter = filter ? filter : 'active';
      return this.http.get(this.url + '/permit?get=' + filter);
    }

}
