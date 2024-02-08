import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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
import {Domestic_help, Relation} from "./model/Relation";
import {environment} from "../environments/environment";

import {Dependent} from "./model/Dependent";
import { ChangePassword } from "./model/ChangePassword";
import {Servants} from "./model/Servants";
import {ServantRel} from "./model/ServantRel";
import {Vehicles} from "./model/Vehicles";
import {Search} from "./model/Search";


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
    return this.http.post<Login>(this.apiUrl+"login",{username: username, password: password});
  }

  postRegistration(username:string, password:string, firstName: string, lastName: string, mobile: string):Observable<Login>{
    return this.http.post<Login>(this.apiUrl+"register",{email: username, password: password, name:firstName+' '+lastName, mobile:mobile});
  }

  getMyProfile():Observable<Employee>{
    return this.http.get<Employee>(this.apiUrl+"my_profile",{headers:this.createHeader()});
  }

  getMyebaProfile():Observable<Employee>{
    return this.http.get<Employee>(this.apiUrl+"eba_profile",{headers:this.createHeader()});
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
    return this.http.post<Designation>(this.apiUrl+"promotion",promotion,{headers:this.createHeader()});
  }

  savePosting(posting: Posting): Observable<Division>{
    return this.http.post<Division>(this.apiUrl+"posting",posting,{headers:this.createHeader()});
  }

  updatePosting(posting: Posting): Observable<Division>{
    return this.http.post<Division>(this.apiUrl+"posting",posting,{headers:this.createHeader()});
  }

  getDependents(employee_id: number): Observable<Relation[]>{
    return this.http.get<Relation[]>(this.apiUrl+"employees/"+employee_id+"/dependents",{headers:this.createHeader()});
  }

  getServants(employee_id: number): Observable<Servants[]>{
    return this.http.get<Servants[]>(this.apiUrl+"employees/"+employee_id+"/domestic_help",{headers:this.createHeader()});
  }

  getVehicle(employee_id: number): Observable<Vehicles[]>{
    return this.http.get<Vehicles[]>(this.apiUrl+"employees/"+employee_id+"/Vehicle",{headers:this.createHeader()});
  }


  /************** Chnages done by Ravikant Kumar ************************************/

  // Dashboard Details API
  getDashboardData(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"dashboard",{headers:this.createHeader()});
  }

  // Get Division List From Master Table API
  getDivisionMasterList(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"divisions",{headers:this.createHeader()});
  }


  // Get Relation List  From Master Table API
  getRelationMasterList(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"relationsMaster",{headers:this.createHeader()});
  }

  getBlockType(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"BlockType",{headers:this.createHeader()});
  }

  getLocationType(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"Location",{headers:this.createHeader()});
  }

  getQuarterType(location:string): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"Quarterbylocation/"+location,{headers:this.createHeader()});
  }

  getQuarterotp(number:string): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"qtrcodenumber/"+number,{headers:this.createHeader()});
  }

  otpverify(number:string): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"otp/"+number,{headers:this.createHeader()});
  }

  getQuarterdetail(qtrtype:string ,location:string): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"qtrmaster/"+qtrtype+'/'+location,{headers:this.createHeader()});
  }

  showmemberbyeba(qtrdtls:any ): Observable<any>{
    return this.http.get<any>(this.apiUrl+"showmember/"+qtrdtls,{headers:this.createHeader()});
  }

  getmemberbyeba(empid:number,qtrdtls:any,qtr:any ): Observable<any>{
    return this.http.post<any>(this.apiUrl+"getmember/"+empid,{ qtrdtls, qtr },{headers:this.createHeader()});
  }


  // Update Relation Of Employee API
  // updateRelation(dependent: Dependent[]): Observable<Relation[]>{
  //   return this.http.put<Relation[]>(this.apiUrl+"dependents",dependent,{headers:this.createHeader()});
  // }

  // Update Relation Of Employee API
  updateRelation(dependent: Dependent): Observable<Relation>{
    return this.http.post<Relation>(this.apiUrl+"dependents",dependent,{headers:this.createHeader()});
  }


  updateServant(domestic_help: Servants): Observable<Servants>{
    return this.http.post<Servants>(this.apiUrl+"domestic_help",domestic_help,{headers:this.createHeader()});
  }

  updateServantRel(domestic_help_rel: any): Observable<any>{
    return this.http.post<any>(this.apiUrl+"domestic_help_relative",domestic_help_rel,{headers:this.createHeader()});
  }

  addVehicles(vehicles: Vehicles): Observable<Vehicles>{
    return this.http.post<Vehicles>(this.apiUrl+"vehicle",vehicles,{headers:this.createHeader()});
  }



  getServantsRel(servant_id: number): Observable<ServantRel[]>{
    return this.http.get<ServantRel[]>(this.apiUrl+"domestic_help/"+servant_id+"/relative",{headers:this.createHeader()});
  }


  // Temp Changes Data List API
  // Temp Changes Data List API
  getTempChangedData(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"changes",{headers:this.createHeader()});
  }

  // Get Specific/Indiviual Temp Changes Data API
  getSingleTempData(id: number): Observable<any>{
    return this.http.get<any>(this.apiUrl+"tempData/"+id,{headers:this.createHeader()});
  }

  // Approve Temp Changes Data API
  approveTempData(id: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}approve/${id}`, { headers: this.createHeader() });
  }

  // Reject Temp Changes Data API
  rejectTempData(model: string, id: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}reject/${model}/${id}`, { headers: this.createHeader() });
  }

  // Change Password API
  changePassword(changepassdata:ChangePassword):Observable<ChangePassword>{
    return this.http.post<ChangePassword>(this.apiUrl+"change_password",changepassdata,{headers:this.createHeader()});
  }

  // For Specific Employee Details
  getEmpProfile(id: number):Observable<Employee>{
    return this.http.get<Employee>(`${this.apiUrl}emp_profile/${id}`, { headers: this.createHeader() });
  }

  // @ts-ignore
  getpic(file: string): Observable<Blob> {
    // let authorisationString = sessionStorage.getItem('authorisation');
    // let authorization:Authorisation = JSON.parse(authorisationString!);
    // if(authorization?.token!=null) {
    //   const headers = new HttpHeaders({
    //     'Content-Type': 'image/jpeg',
    //     'Authorization': 'Bearer ' + authorization.token // Add your token here
    //   });
    //   return this.http.get(`${this.apiUrl}getpic/${file}`, { headers, responseType: 'blob' });
    //   }
      return this.http.get(`${this.apiUrl}getpic/${file}`, {  headers: this.createHeader() , responseType: 'blob' });
  }


  getEbaDashboardData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"ebadashboard",{headers:this.createHeader()});
  }
  getEbaPrintData():Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl+"ebaprint",{headers:this.createHeader()});
  }
  searchEba(searchEba: Search): Observable<any> {
    return this.http.post<any>(this.apiUrl+"searchEba",searchEba,{headers:this.createHeader()});
  }


  applicationByApplicant(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"Eba",{headers:this.createHeader()});
  }

  getEbaProfile(id: number):Observable<any>{
    return this.http.get<any>(this.apiUrl+`Eba/${id}`,{headers:this.createHeader()});
  }

  applyeba(ebaPasses : Employee): Observable<any> {
    // const dataToSubmit = { relation: ebaPasses };
    // const options = { headers: this.createHeader() };
    return this.http.post<Employee>(this.apiUrl + "Eba",ebaPasses,{headers:this.createHeader()});
  }

  applyclosefamily(ebaPasses : Employee): Observable<any> {
    return this.http.post<Employee>(this.apiUrl + "submitClosefamily",ebaPasses,{headers:this.createHeader()});
  }

  updateeba(ebaPasses : Employee,id: number): Observable<any> {
    // const dataToSubmit = { relation: ebaPasses };
    // const options = { headers: this.createHeader() };
    return this.http.put<Employee>(this.apiUrl + "Eba/"+id,ebaPasses,{headers:this.createHeader()});
  }

  updateebastatus(id: number, action: string, remark: string,file_path:string): Observable<any> {
    const options = { headers: this.createHeader() };
    const requestBody = {
      action: action,
      remark: remark,
      file_path:file_path
    };

    return this.http.post<any>(this.apiUrl + "Ebastatus/"+id, requestBody, options);
  }

  applyEvahaan(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"evahaan",{headers:this.createHeader()});
  }


}
