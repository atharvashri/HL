import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AppConfig } from '../app-config';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentService {
    url: string = AppConfig.API_ENDPOINT + "/paymentInstruction";

    constructor(public http: HttpClient) {

    }

    getReadyForPayments(): Observable<any>{
      return this.http.get(this.url + '/readyForPayments');
    }

    getPendingForCompletion(): Observable<any>{
      return this.http.get(this.url + '/pendingForCompletion');
    }

    markComplete(bilties): Observable<any>{
      return this.http.put(this.url + '/markComplete', bilties);
    }

    exportInstructions(bilties): Observable<any>{
      return this.http.put(this.url + '/generate', bilties);
    }

    revertPaymentInstruction(bilties): Observable<any>{
      return this.http.put(this.url + '/revert', bilties);
    }
}
