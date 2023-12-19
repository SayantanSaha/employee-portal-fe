import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {AuthService} from "./auth.service";
import {LoginStatus} from "../model/LoginStatus";
import {EmployeeService} from "../employee.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router,
              private employeeService:EmployeeService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(map((response: LoginStatus) => {
      if (response.authenticated) {
        if(response.refresh_required){
          this.employeeService.postRefreshLogin().subscribe(login=>sessionStorage.setItem('authorisation', JSON.stringify(login.authorisation)))
        }
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }), catchError((error) => {
      this.router.navigate(['/login']);
      return of(false);
    }));
  }


}
