import { NgModule, Injector } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, LOCATION_INITIALIZED } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutes } from './admin-layout.routing';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { IconsComponent } from '../../icons/icons.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from '../../components/components.module';
import { FixedPluginModule } from '../../shared/fixedplugin/fixedplugin.module';
import { DoRunningComponent } from '../../do/do-running/do-running.component';
import { DoCompletedComponent } from '../../do/do-completed/do-completed.component';
import { DoCreateComponent } from '../../do/do-create/do-create.component';
import { RegistrationPanComponent } from '../../pan-registration/registration-pan.component';
import { PanAddUpdateDetailsComponent } from '../../pan-registration/pan-add-update-details/pan-add-update-details.component';
import { PanSearchResultsComponent } from '../../pan-registration/pan-search-results/pan-search-results.component';
import { BuiltyReceiptComponent } from '../../builty/builty-receipt/builty-receipt.component';
import { BuiltyCreateComponent } from '../../builty/builty-create/builty-create.component';
import { BuiltyApproveComponent } from '../../builty/builty-approve/builty-approve.component';
import { BillGenerateComponent } from '../../billing/raise-bill/bill-generate/bill-generate.component';
import { TruckOwnerReportComponent } from '../../pan-registration/truck-owner-report/truck-owner-report.component';
import { FieldReportSelfComponent } from '../../reporting/field-report-self/field-report-self.component';
import { DispatchReportCustomerComponent } from '../../reporting/dispatch-report-customer/dispatch-report-customer.component';
import { FieldCashBalanceComponent } from '../../reporting/field-cash-balance/field-cash-balance.component';
import { TruckOwnerDetailsComponent } from '../../pan-registration/truck-owner-details/truck-owner-details.component';
import { FreightReportTruckownerComponent } from '../../reporting/freight-report-truckowner/freight-report-truckowner.component';
import { DailyReportPassiveComponent } from '../../reporting/daily-report-passive/daily-report-passive.component';
import { DailyReportOwnerComponent } from '../../reporting/daily-report-owner/daily-report-owner.component';
import { RaiseBillComponent } from '../../billing/raise-bill/raise-bill.component';
import { BuiltyReceiptUpdateComponent } from '../../builty/builty-receipt/builty-receipt-update/builty-receipt-update.component';
import { DoRunningListComponent } from '../../do/do-running/do-running-list/do-running-list.component';
import { FieldEntryApproveComponent } from '../../reporting/field-entry-approve/field-entry-approve.component';
import { UserComponent } from '../../user/user.component';
import { UserListComponent } from '../../user/user-list/user-list.component';
import { LoginComponent } from '../../authorization/login/login.component';
import { ModalComponent } from '../../modal/modal.component';
import { PartyResourceComponent } from '../../party/party.resource';
import { PanUpdateDetailsComponent } from '../../pan-registration/pan-update-details/pan-update-details.component';
import { PermitComponent } from '../../permit/permit.component';
import { AreaComponent } from '../../area/area.component';
import { BuiltyListComponent } from '../../builty/builty-list/builty-list.component';
import { PaymentInstructionComponent } from '../../payment/payment-instruction/payment-instruction.component';
import { DOEditActionComponent } from '../../do/do-edit-action.component';
import { PumpComponent } from '../../pump/pump.component';
import { DOLinkActionComponent } from '../../do/do-link-action.component';
import { BiltyEditActionComponent } from '../../builty/bilty-edit-action.component';
import { BiltyDeleteActionComponent } from '../../builty/bilty-delete-action.component';
import { AuthGuard, LoginGuard } from '../../authorization/auth.guards';
import { BuiltyService } from '../../services/builty.service';
import { TruckPanService } from '../../services/truck.pan.services';
import { BillingService } from '../../services/billing.service';
import { DoService } from '../../services/do.service';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import { DataService } from '../../services/data.service';
import { FileUploadService } from '../../services/fileupload.service';
import { PermitService } from '../../services/permit.service';
import { Refdata } from '../../utils/refdata.service';
import { WindowRef } from '../../utils/window.ref';
import { AddHeaderInterceptor } from '../../interceptor/header.interceptor';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FileSelectDirective } from 'ng2-file-upload';
import { NgxPaginationModule } from 'ngx-pagination';
import { TagInputModule } from 'ngx-chips';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { MatSelectModule, MatButtonModule, MatInputModule, MatDialogModule, MatFormFieldModule, MatIconModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// use an Initializer Factory as describe here: https://github.com/ngx-translate/core/issues/517#issuecomment-299637956
export function appInitializerFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const langToSet = 'en';
      translate.setDefaultLang('en');
      translate.use(langToSet).subscribe(() => {
        // console.info(`Successfully initialized '${langToSet}' language.'`);
      }, err => {
        console.error(`Problem with '${langToSet}' language initialization.'`);
      }, () => {
        resolve(null);
      });
    });
  });
}

@NgModule({
  imports: [
    TagInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(AppRoutes),
    FixedPluginModule,
    CommonModule,
    ComponentsModule,
    NgxSpinnerModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxTypeaheadModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AngularSlickgridModule.forRoot({
      // add any Global Grid Options/Config you might want
      // to avoid passing the same options over and over in each grids of your App
      enableAutoResize: true,
      autoResize: {
        containerId: 'grid-container',
        sidePadding: 15
      }
    // required animations module
  })
  ],
  declarations: [
    UserProfileComponent,
    TableListComponent,
    IconsComponent,

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
    ModalComponent,
    PartyResourceComponent,
    PanUpdateDetailsComponent,
    FileSelectDirective,
    PermitComponent,
    AreaComponent,
    BuiltyListComponent,
    PaymentInstructionComponent,
    PumpComponent,
    DOEditActionComponent,
    DOLinkActionComponent,
    BiltyEditActionComponent,
    BiltyDeleteActionComponent
  ],
  providers: [
    AuthGuard,
    LoginGuard,
    TruckPanService,
    BuiltyService,
    BillingService,
    DoService,
    UserService,    
    DataService,
    FileUploadService,
    PermitService,
    Refdata,
    WindowRef,
    { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true }
  ],
  entryComponents: [
    ModalComponent,
    DOEditActionComponent,
    BiltyEditActionComponent,
    BiltyDeleteActionComponent,
    DOLinkActionComponent,
    UserListComponent
  ]
})

export class AdminLayoutModule {}
