import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {Login} from "./model/Login";
import {Employee} from "./model/Employee";
import {Authorisation} from "./model/Authorisation";
import {LoginStatus} from "./model/LoginStatus";
import {State} from "./model/State";
import {District} from "./model/District";


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  createHeader(){
    let authorisationString = sessionStorage.getItem('authorisation');
    let authorization:Authorisation = JSON.parse(authorisationString!);
    if(authorization?.token!=null)
      return {Authorization: 'Bearer '+authorization.token}
    else
      return {Authorization: ''}
  }

  private baseUrl = "http://employeeportal/api/";

  postLogin(username:string, password:string):Observable<Login>{
    return this.http.post<Login>(this.baseUrl+"login",{email: username, password: password});
  }
  postRegistration(username:string, password:string, firstName: string, lastName: string, mobile: string):Observable<Login>{
    return this.http.post<Login>(this.baseUrl+"register",{email: username, password: password, name:firstName+' '+lastName, mobile:mobile});
  }
  getMyProfile():Observable<Employee>{
    return this.http.get<Employee>(this.baseUrl+"my_profile",{headers:this.createHeader()});
  }
  verifyLoggedIn():Observable<LoginStatus>{
    return this.http.post<LoginStatus>(this.baseUrl+"is_logged_in",{},{headers:this.createHeader()});
  }
  postRefreshLogin():Observable<Login>{
    return this.http.post<Login>(this.baseUrl+"refresh",{},{headers:this.createHeader()});
  }
  getStates():Observable<State[]>{
    return this.http.get<State[]>(this.baseUrl+"states",{headers:this.createHeader()});
  }
  getState(state_id: string):Observable<State>{
    return this.http.get<State>(this.baseUrl+"states/"+state_id,{headers:this.createHeader()});
  }
  postState(state:State):Observable<State>{
    return this.http.post<State>(this.baseUrl+"states",state,{headers:this.createHeader()});
  }
  updateState(state:State):Observable<State>{
    return this.http.put<State>(this.baseUrl+"states/"+state.id,state,{headers:this.createHeader()});
  }
  deleteState(state_id:string): Observable<State>{
    return this.http.delete<State>(this.baseUrl+"states/"+state_id,{headers:this.createHeader()});
  }
  getDistricts():Observable<District[]>{
    return this.http.get<District[]>(this.baseUrl+"districts",{headers:this.createHeader()});
  }

  getDistrictsByState(state_id:number):Promise<any>{
    return this.http.get<District[]>(this.baseUrl+"states/"+state_id+"/districts",{headers:this.createHeader()}).toPromise();
  }
  getDistrict(district_id:string):Observable<District>{
    return this.http.get<District>(this.baseUrl+"districts/"+district_id,{headers:this.createHeader()});
  }
  postDistrict(District:District):Observable<District>{
    return this.http.post<District>(this.baseUrl+"districts",District,{headers:this.createHeader()});
  }
  updateDistrict(District:District):Observable<District>{
    return this.http.put<District>(this.baseUrl+"districts/"+District.id,District,{headers:this.createHeader()});
  }
}
