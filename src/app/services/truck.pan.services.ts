import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app-config';
import { Subject } from '../../../node_modules/rxjs';


@Injectable()
export class TruckPanService {

  private eventsource = new Subject<any>();

    url: string = AppConfig.API_ENDPOINT;

    constructor(public http: HttpClient) {

    }

    registerPAN(data): any {
        return this.http.post(this.url + '/pan', data);
    }

    getAllRegisteredPAN() {

    }

    getPANByID(id) {
        return this.http.get(this.url + `/pan/${id}`)
    }

    updatePAN(data, id):any {
        return this.http.put(this.url + `/pan/${id}`, data);
    }

    getVehiclesByVehicleNo(vehicleText){
      return this.http.get(this.url + `/pan/vehicle/${vehicleText}`);
    }

    updateVehicles(pan: string, vehicleList: any): any {
      return this.http.put(this.url + `/pan/${pan}/updatevehicles`, vehicleList);
    }

    uploadfile(fileToUpload: any, panno: string){
      let input = new FormData();
      input.append("file", fileToUpload);
      input.append("panno", panno);

      return this.http.post(this.url + '/upload', input);
    }

    changeEmitted$ = this.eventsource.asObservable();
    pancreated(pan: any){
        this.eventsource.next(pan);
    }
    panupdated(pan: any){
      this.eventsource.next(pan);
    }
}
