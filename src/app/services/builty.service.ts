import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AppConfig } from '../app-config';
import { Observable } from 'rxjs';

@Injectable()
export class BuiltyService {
    url: string = AppConfig.API_ENDPOINT + '/bilty';
    private biltyToUpdate: any;
    private activeBuilties: Array<any>;

    constructor(public http: HttpClient) {

    }

    createBuilty(data): Observable<any> {
        return this.http.post(this.url, data)
    }

    getActiveBuilties(): Observable<any> {
        // if(this.activeBuilties && this.activeBuilties.length){
        //   return this.activeBuilties;
        // }
        return this.http.get(this.url);
    }

    getBitiesForUpdateReceipt(): Observable<any> {
        return this.http.get(this.url + '?get=updateReceipt');
    }

    getAllbuilties(): Observable<any> {
        return this.http.get(this.url + '?get=all');
    }

    getSavedbuilties(): Observable<any> {
        return this.http.get(this.url + '/temp');
    }

    savebuilties(data): Observable<any> {
        return this.http.put(this.url + '/temp', data);
    }

    getCompletedBuilties(): any {
      return this.http.get(this.url + '?get=completed');
    }

    approveBuilty(): Observable<any> {
      return this.http.delete(this.url + '/temp');
    }

    builtyReceipt(builtylist): Observable<any> {
      return this.http.put(this.url + '/receipt', builtylist);
    }

    updateBuilty(data) : Observable<any> {
      return this.http.put(this.url, data);
    }

    deleteBuilty(id): Observable<any> {
      return this.http.delete(this.url + '/' + id);
    }

    setbiltyToUpdate(builty){
      this.biltyToUpdate = builty;
    }

    getbiltyToUpdate(): Observable<any>{
      return this.biltyToUpdate;
    }

    // getReadyForPayments(): any{
    //   return this.http.get(this.url + '/builty/readyForPayments');
    // }
    //
    // getInitiatedPayments(): any{
    //   return this.http.get(this.url + '/builty/initiatedPayments');
    // }
    //
    // markComplete(bilties): any{
    //   return this.http.put(this.url + '/builty/markComplete', bilties);
    // }
    //
    // exportInstructions(bilties): any{
    //   return this.http.post(this.url + '/builty/payment/instruction', bilties);
    // }
    //
    // revertPaymentInstruction(bilties): any{
    //   return this.http.put(this.url + '/builty/revertPaymentInstruction', bilties);
    // }

    setActiveBuilties(builtylist){
      this.activeBuilties = builtylist;
    }
}
