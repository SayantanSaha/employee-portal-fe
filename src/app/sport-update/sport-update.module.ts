import {Inject, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SportUpdateRoutingModule } from './sport-update-routing.module';
import {Search} from "../model/Search";
import {EmployeeService} from "../employee.service";
import {ActivatedRoute, Router} from "@angular/router";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SportUpdateRoutingModule
    ]
})


export class SportUpdateModule {

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject('BASE_URL') baseUrl: string
  ){

  }

}
