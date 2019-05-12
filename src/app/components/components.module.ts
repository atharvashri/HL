import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from '../authorization/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent
  ],
  providers:[
    LoginService
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent
  ]
})
export class ComponentsModule { }
