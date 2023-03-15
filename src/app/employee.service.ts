import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {Login} from "./model/Login";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  postLogin(username:string, password:string):Observable<Login>{
    return this.http.post<Login>("http://employeeportal/api/login",{email: username, password: password});
  }
}
