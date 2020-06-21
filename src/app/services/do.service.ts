import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app-config';


@Injectable()
export class DoService {
    url: string = AppConfig.API_ENDPOINT;
    cachedDO: Map<string, any> = new Map();
    constructor(public http: HttpClient) {

    }

    createDo(data): Observable<any> {
        return this.http.post(this.url + '/do', data);
    }

    getActiveDos(): Observable<any> {
        return this.http.get(this.url + '/do');
    }

    getAllDos(): Observable<any> {
        return this.http.get(this.url + '/do?get=all');
    }

    getCompletedDos(): Observable<any> {
        return this.http.get(this.url + '/do?get=completed');
    }

    getDoByID(id): any {
      if(this.cachedDO.get(id)){
        return this.cachedDO.get(id);
      }else{
        return this.http.get(this.url + `/do/${id}`);
      }
    }

    updateDo(data): Observable<any> {
        return this.http.put(this.url + `/do`, data);
    }

    getdoRefData() {
        return this.http.get(this.url + '/refdata');
    }

    getBiltyCompanies(): Observable<any>{
      return this.http.get(`${this.url}/company/bilty`)
    }
}
