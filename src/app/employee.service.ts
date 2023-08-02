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
import {DesignationModule} from "./designation/designation.module";
import {Designation} from "./model/Designation";
import {Division} from "./model/Division";
import {Promotion} from "./model/Promotion";
import {Posting} from "./model/Posting";
import {Relation} from "./model/Relation";
import {environment} from "../environments/environment";


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

  // private apiUrl = "http://employeeportal/api/";
  private apiUrl = environment.apiUrl;

  postLogin(username:string, password:string):Observable<Login>{
    return this.http.post<Login>(this.apiUrl+"login",{email: username, password: password});
  }
  postRegistration(username:string, password:string, firstName: string, lastName: string, mobile: string):Observable<Login>{
    return this.http.post<Login>(this.apiUrl+"register",{email: username, password: password, name:firstName+' '+lastName, mobile:mobile});
  }
  getMyProfile():Observable<Employee>{
    return this.http.get<Employee>(this.apiUrl+"my_profile",{headers:this.createHeader()});
  }
  updateEmployee(employee:Employee):Observable<Employee>{
    return this.http.put<Employee>(this.apiUrl+"employees/"+employee.id,employee,{headers:this.createHeader()});
  }
  verifyLoggedIn():Observable<LoginStatus>{
    return this.http.post<LoginStatus>(this.apiUrl+"is_logged_in",{},{headers:this.createHeader()});
  }
  postRefreshLogin():Observable<Login>{
    return this.http.post<Login>(this.apiUrl+"refresh",{},{headers:this.createHeader()});
  }
  getStates():Observable<State[]>{
    return this.http.get<State[]>(this.apiUrl+"states",{headers:this.createHeader()});
  }
  getState(state_id: string):Observable<State>{
    return this.http.get<State>(this.apiUrl+"states/"+state_id,{headers:this.createHeader()});
  }
  postState(state:State):Observable<State>{
    return this.http.post<State>(this.apiUrl+"states",state,{headers:this.createHeader()});
  }
  updateState(state:State):Observable<State>{
    return this.http.put<State>(this.apiUrl+"states/"+state.id,state,{headers:this.createHeader()});
  }
  deleteState(state_id:string): Observable<State>{
    return this.http.delete<State>(this.apiUrl+"states/"+state_id,{headers:this.createHeader()});
  }
  getDistricts():Observable<District[]>{
    return this.http.get<District[]>(this.apiUrl+"districts",{headers:this.createHeader()});
  }

  getDistrictsByState(state_id:number):Promise<any>{
    return this.http.get<District[]>(this.apiUrl+"states/"+state_id+"/districts",{headers:this.createHeader()}).toPromise();
  }
  getDistrict(district_id:string):Observable<District>{
    return this.http.get<District>(this.apiUrl+"districts/"+district_id,{headers:this.createHeader()});
  }
  postDistrict(District:District):Observable<District>{
    return this.http.post<District>(this.apiUrl+"districts",District,{headers:this.createHeader()});
  }
  updateDistrict(District:District):Observable<District>{
    return this.http.put<District>(this.apiUrl+"districts/"+District.id,District,{headers:this.createHeader()});
  }
  getDesignations(org_id:number):Observable<Designation[]>{
    return this.http.get<Designation[]>(this.apiUrl+"organizations/"+org_id+"/designations",{headers:this.createHeader()});
  }
  getDivisions(org_id:number):Observable<Division[]>{
    return this.http.get<Division[]>(this.apiUrl+"organizations/"+org_id+"/divisions",{headers:this.createHeader()});
  }
  savePromotion(promotion: Promotion): Observable<Designation>{
    delete promotion['id'];
    return this.http.post<Designation>(this.apiUrl+"promotion",promotion,{headers:this.createHeader()});
  }
  updatePromotion(promotion: Promotion): Observable<Designation>{
    return this.http.put<Designation>(this.apiUrl+"promotion",promotion,{headers:this.createHeader()});
  }
  savePosting(posting: Posting): Observable<Division>{
    return this.http.post<Division>(this.apiUrl+"posting",posting,{headers:this.createHeader()});
  }
  updatePosting(posting: Posting): Observable<Division>{
    return this.http.put<Division>(this.apiUrl+"posting",posting,{headers:this.createHeader()});
  }

  getDependents(employee_id: number): Observable<Relation[]>{
    return this.http.get<Relation[]>(this.apiUrl+"employees/"+employee_id+"/dependents",{headers:this.createHeader()});
  }
}
