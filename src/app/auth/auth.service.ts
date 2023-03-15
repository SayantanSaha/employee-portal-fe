import { Injectable } from '@angular/core';
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isAuthenticated() {
    return of({authenticated: sessionStorage.getItem('isLoggedIn')==='true'});
  }
}
