import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationRoutingModule } from './registration-routing.module';
import {RegistrationComponent} from "./registration.component";
import {FormsModule} from "@angular/forms";
import {MatProgressSpinner} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    RegistrationComponent
  ],
    imports: [
        CommonModule,
        RegistrationRoutingModule,
        FormsModule,
        MatProgressSpinner
    ]
})
export class RegistrationModule { }
