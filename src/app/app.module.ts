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


@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    OrganizationComponent,
    DivisionComponent,
    PayComponent,
    DesignationComponent,
    StateComponent,
    DistrictComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([],{ enableTracing: true }),
    LayoutModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
