import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs'
import { HttpHeaders } from '@angular/common/http'
import { HttpClient } from '@angular/common/http'
import { AppConfig } from '../app-config';

@Injectable()
export class BuiltyService {
    url: string = AppConfig.API_ENDPOINT;
    private builtyToUpdate: any;
    private activeBuilties: Array<any>;

    constructor(public http: HttpClient) {

    }

    createBuilty(data): any {
        return this.http.post(this.url + '/builty', data)
    }

    getActiveBuilties(): any {
        if(this.activeBuilties && this.activeBuilties.length){
          return this.activeBuilties;
        }
        return this.http.get(this.url + '/builty');
    }

    getAllbuilties() {
        return this.http.get(this.url + '/builty?get=all');
    }

    getSavedbuilties() {
        return this.http.get(this.url + '/builty/temp');
    }

    getAllVehicleList(){
        return this.http.get(this.url + '/vehicle');
    }

    savebuilties(data): any {
        return this.http.put(this.url + '/builty/temp', data);
    }

    getCompletedBuilties(): any {
      return this.http.get(this.url + '/builty?get=completed');
    }

    approveBuilty() {
      return this.http.delete(this.url + '/builty/temp');
    }

    builtyReceipt(builtylist): any {
      return this.http.put(this.url + '/builty/receipt', builtylist);
    }

    updateBuilty(data) : any {
      return this.http.put(this.url + '/builty', data);
    }

    deleteBuilty(id): any{
      return this.http.delete(this.url + '/builty/' + id);
    }
    setBuiltyToUpdate(builty){
      this.builtyToUpdate = builty;
    }

    getBuiltyToUpdate(){
      return this.builtyToUpdate;
    }

    getForPendingPayments(): any{
      return this.http.get(this.url + '/builty/pendingPayments');
    }

    exportInstructions(builties): any{
      return this.http.post(this.url + '/builty/payment/instruction', builties);
    }

    resetPaymentInstruction(builtyNo): any{
      return this.http.put(this.url + '/builty/payment/reset/' + builtyNo, {});
    }

    setActiveBuilties(builtylist){
      this.activeBuilties = builtylist;
    }
}
