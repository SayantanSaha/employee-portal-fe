import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import {LayoutModule} from "./layout/layout.module";
import {RouterModule} from "@angular/router";
import { ProfileComponent } from './profile/profile.component';
import { OrganizationComponent } from './organization/organization.component';
import { DivisionComponent } from './division/division.component';
import { PayComponent } from './pay/pay.component';
import { DesignationComponent } from './designation/designation.component';
import { StateComponent } from './state/state.component';
import { DistrictComponent } from './district/district.component';
import {FormsModule} from "@angular/forms";

//Added By Ravikant Kumar
import { DashboardComponent } from './dashboard/dashboard.component';
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
import { NextDirective } from './next.directive';
import { PrevDirective } from './prev.directive';
import { EbaformviewComponent } from './ebaformview/ebaformview.component';



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
    NextDirective,
    PrevDirective,
    EbaformviewComponent,


  ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([], {enableTracing: true}),
        LayoutModule,
        HttpClientModule,
        FormsModule,
    ],
  providers: [
    { provide: 'BASE_URL', useFactory: ()=>document.getElementsByTagName('base')[0].href }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
