import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import { AgGridModule } from 'ag-grid-angular';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard, LoginGuard } from './authorization/auth.guards'

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';

import { NotificationsComponent } from './notifications/notifications.component';

import { DoRunningComponent } from './do/do-running/do-running.component';
import { DoCompletedComponent } from './do/do-completed/do-completed.component';
import { DoCreateComponent } from './do/do-create/do-create.component';
import { RegistrationPanComponent } from './pan-registration/registration-pan.component';
import { PanSearchResultsComponent } from './pan-registration/pan-search-results/pan-search-results.component';
import { PanAddUpdateDetailsComponent } from './pan-registration/pan-add-update-details/pan-add-update-details.component';
import { PanUpdateDetailsComponent } from './pan-registration/pan-update-details/pan-update-details.component';
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
import { RaiseBillComponent } from './billing/raise-bill/raise-bill.component';
import { BuiltyReceiptUpdateComponent } from './builty/builty-receipt/builty-receipt-update/builty-receipt-update.component';
import { DoRunningListComponent } from './do/do-running/do-running-list/do-running-list.component';
import { FieldEntryApproveComponent } from './reporting/field-entry-approve/field-entry-approve.component'
import { UserComponent } from './user/user.component'
import { UserListComponent } from './user/user-list/user-list.component'
import { LoginComponent } from './authorization/login/login.component'
import { PartyResourceComponent } from './party/party.resource'

import { TruckPanService } from './services/truck.pan.services'
import { BuiltyService } from './services/builty.service'
import { BillingService } from './services/billing.service'
import { DoService } from './services/do.service'
import { UserService } from './services/user.service'
import { ReportService } from './services/report.service'
import { LoginService } from './services/login.service'
import { DataService } from './services/data.service'
import { AddHeaderInterceptor } from './interceptor/header.interceptor'
import { MatFormFieldModule, MatDialogModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule } from '@angular/material'
import { ToastrModule } from 'ngx-toastr';
import { TagInputModule } from 'ngx-chips';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ModalComponent } from './modal/modal.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { FileUploadService } from './services/fileupload.service';
import { PermitComponent } from './permit/permit.component';
import { PermitService } from './services/permit.service';
import { AreaComponent } from './area/area.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BuiltyListComponent } from './builty/builty-list/builty-list.component'
import { Refdata } from './utils/refdata.service';
import { PaymentInstructionComponent } from './payment/payment-instruction/payment-instruction.component';
import { WindowRef } from './utils/window.ref';

@NgModule({
  declarations: [
    AppComponent,
    NotificationsComponent,
    DoRunningComponent,
    DoCompletedComponent,
    DoCreateComponent,
    RegistrationPanComponent,
    PanSearchResultsComponent,
    PanAddUpdateDetailsComponent,
    BuiltyReceiptComponent,
    BuiltyCreateComponent,
    BuiltyApproveComponent,
    BillGenerateComponent,
    TruckOwnerReportComponent,
    FieldReportSelfComponent,
    DispatchReportCustomerComponent,
    FieldCashBalanceComponent,
    TruckOwnerDetailsComponent,
    FreightReportTruckownerComponent,
    DailyReportPassiveComponent,
    DailyReportOwnerComponent,
    RaiseBillComponent,
    BuiltyReceiptUpdateComponent,
    DoRunningListComponent,
    FieldEntryApproveComponent,
    UserComponent,
    UserListComponent,
    LoginComponent,
    ModalComponent,
    PartyResourceComponent,
    PanUpdateDetailsComponent,
    FileSelectDirective,
    PermitComponent,
    AreaComponent,
    BuiltyListComponent,
    PaymentInstructionComponent

  ],
  imports: [
    TagInputModule ,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    NgxPaginationModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes),
    SidebarModule,
    NavbarModule,
    FooterModule,
    FixedPluginModule,
    CommonModule,
    NgxSpinnerModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    AgGridModule.withComponents([])
    // required animations module

  ],
  providers: [
    AuthGuard,
    LoginGuard,
    TruckPanService,
    BuiltyService,
    BillingService,
    DoService,
    UserService,
    LoginService,
    DataService,
    FileUploadService,
    PermitService,
    Refdata,
    WindowRef,
    { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule { }
