import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit } from '@angular/core';
import { AppComponent } from './app.component';
import { LayoutModule } from "./layout/layout.module";
import { RouterModule } from "@angular/router";
import { ProfileComponent } from './profile/profile.component';
import { OrganizationComponent } from './organization/organization.component';
import { DivisionComponent } from './division/division.component';
import { PayComponent } from './pay/pay.component';
import { DesignationComponent } from './designation/designation.component';
import { StateComponent } from './state/state.component';
import { DistrictComponent } from './district/district.component';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

//Added By Ravikant Kumar
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmpFormComponent } from './emp-form/emp-form.component';
import { TempchangesdataComponent } from './tempchangesdata/tempchangesdata.component';
import { TempchangesapprovalComponent } from './tempchangesapproval/tempchangesapproval.component';
import { ApproveemployeelistComponent } from './approveemployeelist/approveemployeelist.component';
import { EmployeelistComponent } from './employeelist/employeelist.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ParseChangedDataPipe } from './parse-changed-data.pipe';
import { EbaFormComponent } from './eba-form/eba-form.component';
import { UppercaseDirective } from './uppercase.directive';
import { EbapendingComponent } from './ebapending/ebapending.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { EbapanelComponent } from './ebapanel/ebapanel.component';
import { EbaformviewComponent } from './ebaformview/ebaformview.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EbaFormListComponent } from './eba-form-list/eba-form-list.component';
import { NgOtpInputModule } from "ng-otp-input";
import { EbaprintComponent } from './ebaprint/ebaprint.component';
import { SportUpdateComponent } from './sport-update/sport-update.component';
import { RbprintComponent } from './rbprint/rbprint.component';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxPrintModule } from 'ngx-print';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RegistrationComponent } from "./registration/registration.component";
import { RegistrationPanelComponent } from "./registration-panel/registration-panel.component";
import { RbapppendingComponent } from "./rbapppending/rbapppending.component";
import { RbcardapplyformComponent } from "./rbcardapplyform/rbcardapplyform.component";
import { EbaapplyformComponent } from "./ebaapplyform/ebaapplyform.component";

import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { MatPaginatorModule } from '@angular/material/paginator'; // Import MatPaginatorModule
import { MatSortModule } from '@angular/material/sort'; // Import MatSortModule

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    OrganizationComponent,
    DivisionComponent,
    PayComponent,
    DesignationComponent,
    StateComponent,
    DistrictComponent,
    DashboardComponent,
    TempchangesdataComponent,
    TempchangesapprovalComponent,
    ApproveemployeelistComponent,
    EmployeelistComponent,
    ChangePasswordComponent,
    ParseChangedDataPipe,
    EbaFormComponent,
    UppercaseDirective,
    EbapendingComponent,
    AdminpanelComponent,
    EbapanelComponent,
    // NextDirective,
    // PrevDirective,
    EbaformviewComponent,
    EbaFormListComponent,
    EbaprintComponent,
    RegistrationPanelComponent,
    RbapppendingComponent,
    RbprintComponent,
    RbcardapplyformComponent,
    EbaapplyformComponent,
    SportUpdateComponent,
    EmpFormComponent

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { enableTracing: true }),
    LayoutModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgOtpInputModule,
    NgxBarcode6Module,
    NgxPrintModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    { provide: 'BASE_URL', useFactory: () => document.getElementsByTagName('base')[0].href },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
