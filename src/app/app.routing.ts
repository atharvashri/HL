import { Routes } from '@angular/router';

import { DoRunningComponent } from './do/do-running/do-running.component';
import { DoCompletedComponent } from './do/do-completed/do-completed.component';
import { DoCreateComponent } from './do/do-create/do-create.component';
import { RegistrationPanComponent } from './pan-registration/registration-pan.component';
import { PanSearchResultsComponent } from './pan-registration/pan-search-results/pan-search-results.component';
import { PanAddUpdateDetailsComponent } from './pan-registration/pan-add-update-details/pan-add-update-details.component';
import { BuiltyReceiptComponent } from './builty/builty-receipt/builty-receipt.component';
import { BuiltyCreateComponent } from './builty/builty-create/builty-create.component';
import { BuiltyApproveComponent } from './builty/builty-approve/builty-approve.component';
import { BillGenerateComponent } from './billing/raise-bill/bill-generate/bill-generate.component';
import { TruckOwnerReportComponent } from './pan-registration/truck-owner-report/truck-owner-report.component';
import { FieldReportSelfComponent } from './reporting/field-report-self/field-report-self.component';
import { DispatchReportCustomerComponent } from './reporting/dispatch-report-customer/dispatch-report-customer.component';
import { FieldCashBalanceComponent } from './reporting/field-cash-balance/field-cash-balance.component';
import { TruckOwnerDetailsComponent } from './pan-registration/truck-owner-details/truck-owner-details.component';
import { FreightReportTruckownerComponent } from './reporting/freight-report-truckowner/freight-report-truckowner.component';
import { DailyReportPassiveComponent } from './reporting/daily-report-passive/daily-report-passive.component';
import { DailyReportOwnerComponent } from './reporting/daily-report-owner/daily-report-owner.component';
import { DoRunningListComponent } from './do/do-running/do-running-list/do-running-list.component';
import { RaiseBillComponent } from './billing/raise-bill/raise-bill.component';
import { FieldEntryApproveComponent } from './reporting/field-entry-approve/field-entry-approve.component';
import { UserComponent } from './user/user.component'
import { LoginComponent } from './authorization/login/login.component'
import { AuthGuard,LoginGuard } from './authorization/auth.guards'
import { PartyResourceComponent } from './party/party.resource'
import { PermitComponent } from './permit/permit.component';
import { AreaComponent } from './area/area.component';
import { BuiltyListComponent } from './builty/builty-list/builty-list.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',

    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate:[LoginGuard]
    },
    {
        path: "runningdo",
        component: DoRunningComponent,
        canActivate: [AuthGuard]

    },
    {
        path: "completedo",
        component: DoCompletedComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "do",
        component: DoCreateComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "register_truck",
        component: RegistrationPanComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "search_truck",
        component: PanSearchResultsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "truckupdate",
        component: PanAddUpdateDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "builtylist",
        component: BuiltyListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "builty",
        component: BuiltyCreateComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "builtyapprove",
        component: BuiltyApproveComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "billgenerate",
        component: BillGenerateComponent,
        canActivate: [AuthGuard]
    },
    {
      path: "builtyreceipt",
      component: BuiltyReceiptComponent,
      canActivate: [AuthGuard]
    },
    {
        path: "truckownerreport",
        component: TruckOwnerReportComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "fieldreport",
        component: FieldReportSelfComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "dispatchreport",
        component: DispatchReportCustomerComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "cashbalance",
        component: FieldCashBalanceComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "truckownerdetails",
        component: TruckOwnerDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "freightreport",
        component: FreightReportTruckownerComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "reportpassive",
        component: DailyReportPassiveComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "reportowner",
        component: DailyReportOwnerComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "runningdolist",
        component: DoRunningListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "raisebill",
        component: RaiseBillComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'fieldentry',
        component: FieldEntryApproveComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'adduser',
        component: UserComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'party',
        component: PartyResourceComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'permit',
        component: PermitComponent,
        canActivate: [AuthGuard]
    },
    {
      path: 'area',
      component: AreaComponent,
      canActivate: [AuthGuard]
    }
]
