import { Component, OnInit } from '@angular/core';

declare var $: any;

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public currentProfileIdentifier: String = "master";

    ngOnInit() {
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
            case "office":
                return this.getOfficeMenuRoutes();
            case "field":
                return this.getFieldMenuRoutes();
            case "customer":
                return this.getCustomerMenuRoutes();
            case "truck":
                return this.getTruckMenuRoutes();
            case "master":
                return this.getMasterMenuRoutes();
            default:
                break;
        }

    }

    getOfficeMenuRoutes() {

        const officeRoutes: RouteInfo[] = [
            { path: 'createdo', title: 'Create DO', icon: 'ti-panel', class: '' },
            { path: 'runningdo', title: 'Running DO', icon: 'ti-user', class: '' },
            { path: 'completedo', title: 'Complete DO', icon: 'ti-view-list-alt', class: '' },
            { path: 'register_truck', title: 'Truck Registration', icon: 'ti-panel', class: '' },
            { path: 'truckownerreport', title: 'Truck Owner Report', icon: 'ti-user', class: '' },
            { path: 'builtyreceipt', title: 'builty report', icon: 'ti-view-list-alt', class: '' },
            { path: 'fieldentry', title: 'field entry', icon: 'ti-view-list-alt', class: '' }
        ];
        console.log(officeRoutes)
        return officeRoutes;
    }

    getFieldMenuRoutes() {
        const fieldRoutes: RouteInfo[] = [
            { path: 'builtycreate', title: 'Builty Generation', icon: 'ti-panel', class: '' },
            { path: 'fieldreport', title: 'Report', icon: 'ti-user', class: '' },
            { path: 'register_truck', title: 'Truck Registration', icon: 'ti-panel', class: '' },
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
            { path: 'createdo', title: 'Create DO', icon: 'ti-panel', class: '' },
            { path: 'runningdo', title: 'Running DO', icon: 'ti-panel', class: '' },
            { path: 'completedo', title: 'Complete DO', icon: 'ti-panel', class: '' },
            { path: 'register_truck', title: 'PAN Registration', icon: 'ti-panel', class: '' },
            { path: 'truckownerreport', title: 'Truck Owner Report', icon: 'ti-panel', class: '' },
            { path: 'builtyreceipt', title: 'Builty report', icon: 'ti-panel', class: '' },
            { path: 'builtycreate', title: 'Builty Generation', icon: 'ti-panel', class: '' },
            { path: 'cashbalance', title: 'Cash Balance', icon: 'ti-panel', class: '' },
            { path: 'truckownerdetails', title: 'Truck Owner Details', icon: 'ti-panel', class: '' },
            { path: 'freightreport', title: 'Freight Report', icon: 'ti-panel', class: '' },
            { path: 'adduser', title: 'User Management', icon: 'ti-user', class: '' },
            { path: 'party', title: 'Party', icon: 'ti-panel', class: '' },
        ];
        return masterRoutes;
    }
}
