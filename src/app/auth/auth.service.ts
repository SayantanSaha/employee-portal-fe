import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {Authorisation} from "../model/Authorisation";
import {LoginStatus} from "../model/LoginStatus";
import {EmployeeService} from "../employee.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private employeeService:EmployeeService) { }

  isAuthenticated():Observable<LoginStatus> {
    return this.employeeService.verifyLoggedIn();
  }
}
