import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app-config';


@Injectable()
export class DoService {
    url: string = AppConfig.API_ENDPOINT;
    constructor(public http: HttpClient) {

    }

    createDoService(data): Observable<any> {
        return this.http.post(this.url + '/do', data);
    }

    getActiveDosService(): Observable<any> {
        return this.http.get(this.url + '/do/active');
    }

    getAllDosService(): Observable<any> {
        return this.http.get(this.url + '/do');
    }

    getCompletedDosService(): Observable<any> {
        return this.http.get(this.url + '/do/completed');
    }

    getDoByIDService(id): Observable<any> {
        return this.http.get(this.url + `/do/${id}`);
    }

    updateDoService(data,id): Observable<any> {
        return this.http.put(this.url + `/do/${id}`, data);
    }

    getdoRefData() {
        return this.http.get(this.url + '/refdata');
    }
}
