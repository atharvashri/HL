import {filter} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Location, PopStateEvent } from '@angular/common';

import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription ,  Observable } from 'rxjs';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  isloggedIn: boolean = false;
  private mainPanel: HTMLElement;
  private sideBarPanel: HTMLElement;
  private psMainScroll: PerfectScrollbar;
  private psSideBarScroll: PerfectScrollbar;

  constructor( public location: Location, private router: Router) {}

  ngOnInit() {
      if (localStorage.getItem('currentRole') != null && localStorage.getItem('currentRole') != "null"){
        this.isloggedIn = true
      }
      else{
        this.isloggedIn = false;
      }
      const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

      if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
          // if we are on windows OS we activate the perfectScrollbar function

          document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
      } else {
          document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
      }

      this.location.subscribe((ev:PopStateEvent) => {
          this.lastPoppedUrl = ev.url;
      });
       this.router.events.subscribe((event:any) => {
          if (event instanceof NavigationStart) {
             if (event.url != this.lastPoppedUrl)
                 this.yScrollStack.push(window.scrollY);
         } else if (event instanceof NavigationEnd) {
             if (event.url == this.lastPoppedUrl) {
                 this.lastPoppedUrl = undefined;
                 window.scrollTo(0, this.yScrollStack.pop());
             } else
                 window.scrollTo(0, 0);
         }
      });
      this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
        this.mainPanel = <HTMLElement>document.querySelector('.main-panel');
        this.sideBarPanel = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
        // if(this.psMainScroll)
        //   this.psMainScroll.destroy();

        this.psSideBarScroll = new PerfectScrollbar(this.sideBarPanel);
        if(this.psSideBarScroll)
          this.psSideBarScroll.destroy();
        this.psMainScroll = new PerfectScrollbar(this.mainPanel);
        this.psMainScroll.destroy();
        if(this.mainPanel){
          this.mainPanel.scrollTop = 0;
        }
        
      });
  }
  ngAfterViewInit() {
      this.runOnRouteChange();
  }
  isMaps(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
          return false;
      }
      else {
          return true;
      }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      this.mainPanel = <HTMLElement>document.querySelector('.main-panel');
      this.sideBarPanel = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
      // if(this.psMainScroll)
      //   this.psMainScroll.destroy();
      this.psSideBarScroll = new PerfectScrollbar(this.sideBarPanel);
      this.psSideBarScroll.destroy();
      this.psMainScroll = new PerfectScrollbar(this.mainPanel);
      this.psMainScroll.destroy();
    }
  }
  isMac(): boolean {
      let bool = false;
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
          bool = true;
      }
      return bool;
  }

  changeViewAfterlogin(event){
    this.isloggedIn = event;
  }

}
