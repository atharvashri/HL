import { AppConfig } from "../app-config";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { Injectable } from '@angular/core';

@Injectable()
export class Refdata{

  url: string = AppConfig.API_ENDPOINT;
  constructor(public http: HttpClient) {

  }
  private static states: Array<string> = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Goa",
    "Gujrat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
  ];

  static getStates(){
    return this.states;
  }

  getRefData() {
      return this.http.get(this.url + '/refdata');
  }
}
