import { Injectable } from '@angular/core';
import { map, filter, scan } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http'
import { HttpClient } from '@angular/common/http'

@Injectable()
export class DoService {
    url: string = "http://localhost:8080"
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