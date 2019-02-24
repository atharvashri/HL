import { Component, OnInit } from '@angular/core';
import { AppUtil } from '../utils/app.util';

declare var $: any;

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: 'do', title: 'DO', icon: 'ti-panel', class: '' },
    { path: 'do/:id', title: 'DO', icon: 'ti-panel', class: '' },
    { path: 'runningdo', title: 'Running DO', icon: 'ti-panel', class: '' },
    { path: 'completedo', title: 'Complete DO', icon: 'ti-panel', class: '' },
    { path: 'register_truck', title: 'PAN Registration', icon: 'ti-panel', class: '' },
    { path: 'truckownerreport', title: 'Truck Owner Report', icon: 'ti-panel', class: '' },
    { path: 'builtylist', title: 'Builty report', icon: 'ti-panel', class: '' },
    { path: 'builty', title: 'Builty Generation', icon: 'ti-panel', class: '' },
    { path: 'cashbalance', title: 'Cash Balance', icon: 'ti-panel', class: '' },
    { path: 'truckownerdetails', title: 'Truck Owner Details', icon: 'ti-panel', class: '' },
    { path: 'freightreport', title: 'Freight Report', icon: 'ti-panel', class: '' },
    { path: 'adduser', title: 'User Management', icon: 'ti-user', class: '' },
    { path: 'party', title: 'Party', icon: 'ti-panel', class: '' },
    { path: 'dispatchreport', title: 'Dispatch Report', icon: 'ti-panel', class: '' },
    { path: 'freightreport', title: 'Freight Report', icon: 'ti-panel', class: '' },
    { path: 'permit', title: 'Permit', icon: 'ti-panel', class: '' }
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public currentProfileIdentifier: String;

    ngOnInit() {
        this.currentProfileIdentifier = localStorage.getItem('currentUser');
        this.menuItems = this.getcurrentProfileForRoutes(this.setRoutesForMenu.bind(this))
        //this.menuItems = ROUTES;//.filter(menuItem => menuItem);
    }
    isNotMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    getcurrentProfileForRoutes(callback) {
        return callback(this.currentProfileIdentifier);
    }

    setRoutesForMenu(profile) {
        switch (profile) {
            case AppUtil.ROLE_OFFICE:
                return this.getOfficeMenuRoutes();
            case AppUtil.ROLE_FIELD:
                return this.getFieldMenuRoutes();
            case AppUtil.ROLE_CUSTOMER:
                return this.getCustomerMenuRoutes();
            case AppUtil.ROLE_TRUCK_OWNER:
                return this.getTruckMenuRoutes();
            case AppUtil.ROLE_ADMIN:
                return this.getMasterMenuRoutes();
            default:
                break;
        }

    }

    getOfficeMenuRoutes() {

        const officeRoutes: RouteInfo[] = [
            { path: 'do', title: 'DO', icon: 'ti-panel', class: '' },
            { path: 'runningdo', title: 'Running DO', icon: 'ti-user', class: '' },
            { path: 'completedo', title: 'Complete DO', icon: 'ti-view-list-alt', class: '' },
            { path: 'register_truck', title: 'PAN Registration', icon: 'ti-panel', class: '' },
            { path: 'truckownerreport', title: 'Truck Owner Report', icon: 'ti-user', class: '' },
            { path: 'builtylist', title: 'Builty report', icon: 'ti-view-list-alt', class: '' },
            { path: 'builty', title: 'Builty Generation', icon: 'ti-panel', class: '' },
            { path: 'fieldentry', title: 'Field Entry', icon: 'ti-view-list-alt', class: '' }
        ];
        console.log(officeRoutes)
        return officeRoutes;
    }

    getFieldMenuRoutes() {
        const fieldRoutes: RouteInfo[] = [
            { path: 'builty', title: 'Builty Generation', icon: 'ti-panel', class: '' },
            { path: 'fieldreport', title: 'Report', icon: 'ti-user', class: '' },
            { path: 'register_truck', title: 'PAN Registration', icon: 'ti-panel', class: '' },
            { path: 'cashbalance', title: 'Cash Balance', icon: 'ti-user', class: '' },
            { path: 'truckownerdetails', title: 'Truck Owner Details', icon: 'ti-view-list-alt', class: '' },
        ];
        return fieldRoutes;
    }

    getCustomerMenuRoutes() {
        const CustomerRoutes: RouteInfo[] = [
            { path: 'dispatchreport', title: 'Dispatch Report', icon: 'ti-panel', class: '' },
        ];
        return CustomerRoutes;
    }

    getTruckMenuRoutes() {
        const truckRoutes: RouteInfo[] = [
            { path: 'freightreport', title: 'Freight Report', icon: 'ti-panel', class: '' },
        ];
        return truckRoutes;
    }

    getMasterMenuRoutes() {
        const masterRoutes: RouteInfo[] = [
            { path: 'do', title: 'DO', icon: 'ti-panel', class: '' },
            { path: 'runningdo', title: 'Running DO', icon: 'ti-panel', class: '' },
            { path: 'completedo', title: 'Complete DO', icon: 'ti-panel', class: '' },
            { path: 'register_truck', title: 'PAN Registration', icon: 'ti-panel', class: '' },
            { path: 'truckownerreport', title: 'Truck Owner Report', icon: 'ti-panel', class: '' },
            { path: 'builtylist', title: 'Builty report', icon: 'ti-panel', class: '' },
            { path: 'builty', title: 'Builty Generation', icon: 'ti-panel', class: '' },
            { path: 'freightPayment', title: 'Freight Payment', icon: 'ti-panel', class: ''},
            { path: 'cashbalance', title: 'Cash Balance', icon: 'ti-panel', class: '' },
            { path: 'truckownerdetails', title: 'Truck Owner Details', icon: 'ti-panel', class: '' },
            { path: 'freightreport', title: 'Freight Report', icon: 'ti-panel', class: '' },
            { path: 'adduser', title: 'User Management', icon: 'ti-user', class: '' },
            { path: 'party', title: 'Party', icon: 'ti-panel', class: '' },
            { path: 'permit', title: 'Permit', icon: 'ti-panel', class: '' },
            { path: 'area', title: 'Area', icon: 'ti-panel', class: '' }
        ];
        return masterRoutes;
    }
}
