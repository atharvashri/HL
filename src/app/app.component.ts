import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service'

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(private loginservice: LoginService) {

  }

  isloggedIn: boolean = false;
  ngOnInit() {
    if (localStorage.getItem('currentRole') != null && localStorage.getItem('currentRole') != "null"){
      this.isloggedIn = true
    }
    else{
      this.isloggedIn = false;
    }
  }





  changeViewAfterlogin(event) {
    this.isloggedIn = event;
  }
}
