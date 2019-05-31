import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { AppUtil } from '../../utils/app.util';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    roles: Array<string>;
    displayInPanel: boolean;
}

export const ROUTES: RouteInfo[] = [
		{ path: '/do', title: 'DO', icon: 'business_briefcase-24', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE], displayInPanel: true },
		{ path: '/runningdo', title: 'Running DO', icon: 'business_briefcase-24', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE], displayInPanel: true },
		{ path: '/completedo', title: 'Complete DO', icon: 'business_briefcase-24', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE], displayInPanel: true },
		{ path: '/truckownerreport', title: 'Truck Owner Report', icon: 'shopping_delivery-fast', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_TRUCK_OWNER], displayInPanel: true },
    { path: '/register_truck', title: 'PAN Registration', icon: 'education_paper', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE, AppUtil.ROLE_FIELD], displayInPanel: true },
		{ path: '/builtylist', title: 'Bilty report', icon: 'shopping_delivery-fast', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE, AppUtil.ROLE_FIELD], displayInPanel: true },
		{ path: '/builty', title: 'Bilty Generation', icon: 'shopping_delivery-fast', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE, AppUtil.ROLE_FIELD], displayInPanel: true },
		{ path: '/freightPayment', title: 'Freight Payment', icon: 'education_paper', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE], displayInPanel: true},
		{ path: '/cashbalance', title: 'Cash Balance', icon: 'education_paper', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_FIELD], displayInPanel: true },
		{ path: '/truckownerdetails', title: 'Truck Owner Details', icon: 'shopping_delivery-fast', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_FIELD], displayInPanel: true },
		{ path: '/freightreport', title: 'Freight Report', icon: 'education_paper', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_FIELD], displayInPanel: true },
		{ path: '/adduser', title: 'User Management', icon: 'users_circle-08', class: '', roles: [AppUtil.ROLE_ADMIN], displayInPanel: true },
		{ path: '/party', title: 'Party', icon: 'shopping_box', class: '', roles: [AppUtil.ROLE_ADMIN], displayInPanel: true },
		{ path: '/permit', title: 'Permit', icon: 'shopping_box', class: '', roles: [AppUtil.ROLE_ADMIN], displayInPanel: true },
		{ path: '/area', title: 'Area', icon: 'shopping_box', class: '', roles: [AppUtil.ROLE_ADMIN], displayInPanel: true },
		{ path: '/pump', title: 'Pump', icon: 'shopping_box', class: '', roles: [AppUtil.ROLE_ADMIN], displayInPanel: true },
    { path: '/builtyreceipt', title: 'Update Receipt', icon: '', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE], displayInPanel: false }
	];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  ps: PerfectScrollbar
  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => {
      const currRole = localStorage.getItem('currentRole');
      if(currRole && menuItem.roles.includes(currRole) && menuItem.displayInPanel){
        return menuItem;
      }else{
        //redirect to login page
      }
      return void 0;
    });
    this.ps = new PerfectScrollbar('.sidebar');
    //new PerfectScrollbar('.sidebar-wrapper');
    //new PerfectScrollbar('.main-panel')
    //this.ps.update();
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}
