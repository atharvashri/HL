import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { AppUtil } from '../../utils/app.util';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    roles: Array<string>;
}

export const ROUTES: RouteInfo[] = [
		{ path: '/do', title: 'DO', icon: 'business_briefcase-24', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE] },
		{ path: '/runningdo', title: 'Running DO', icon: 'business_briefcase-24', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE] },
		{ path: '/completedo', title: 'Complete DO', icon: 'business_briefcase-24', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE] },
		{ path: '/truckownerreport', title: 'Truck Owner Report', icon: 'shopping_delivery-fast', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_TRUCK_OWNER] },
    { path: '/register_truck', title: 'PAN Registration', icon: 'education_paper', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE, AppUtil.ROLE_FIELD] },
		{ path: '/builtylist', title: 'Bilty report', icon: 'shopping_delivery-fast', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE, AppUtil.ROLE_FIELD] },
		{ path: '/builty', title: 'Bilty Generation', icon: 'shopping_delivery-fast', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE, AppUtil.ROLE_FIELD] },
		{ path: '/freightPayment', title: 'Freight Payment', icon: 'education_paper', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_OFFICE]},
		{ path: '/cashbalance', title: 'Cash Balance', icon: 'education_paper', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_FIELD] },
		{ path: '/truckownerdetails', title: 'Truck Owner Details', icon: 'shopping_delivery-fast', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_FIELD] },
		{ path: '/freightreport', title: 'Freight Report', icon: 'education_paper', class: '', roles: [AppUtil.ROLE_ADMIN, AppUtil.ROLE_FIELD] },
		{ path: '/adduser', title: 'User Management', icon: 'users_circle-08', class: '', roles: [AppUtil.ROLE_ADMIN] },
		{ path: '/party', title: 'Party', icon: 'shopping_box', class: '', roles: [AppUtil.ROLE_ADMIN] },
		{ path: '/permit', title: 'Permit', icon: 'shopping_box', class: '', roles: [AppUtil.ROLE_ADMIN] },
		{ path: '/area', title: 'Area', icon: 'shopping_box', class: '', roles: [AppUtil.ROLE_ADMIN] },
		{ path: '/pump', title: 'Pump', icon: 'shopping_box', class: '', roles: [AppUtil.ROLE_ADMIN] }
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
      if(currRole && menuItem.roles.includes(currRole)){
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
