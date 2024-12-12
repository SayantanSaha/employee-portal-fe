import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Login } from "./model/Login";
import { Employee } from "./model/Employee";
import { Authorisation } from "./model/Authorisation";
import { LoginStatus } from "./model/LoginStatus";
import { State } from "./model/State";
import { District } from "./model/District";
import { DesignationModule } from "./designation/designation.module";
import { Designation } from "./model/Designation";
import { Division } from "./model/Division";
import { Promotion } from "./model/Promotion";
import { Posting } from "./model/Posting";
import { Domestic_help, Relation } from "./model/Relation";
import { environment } from "../environments/environment";

import { Dependent } from "./model/Dependent";
import { ChangePassword } from "./model/ChangePassword";
import { Servants } from "./model/Servants";
import { ServantRel } from "./model/ServantRel";
import { Vehicles } from "./model/Vehicles";
import { Search } from "./model/Search";
import { Organization } from "./model/Organization";
import { Idcards } from './model/Idcards';
import {User} from "./model/User";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  createHeader() {
    let authorisationString = sessionStorage.getItem('authorisation');
    let authorization: Authorisation = JSON.parse(authorisationString!);
    if (authorization?.token != null)
      return { Authorization: 'Bearer ' + authorization.token }
    else
      return { Authorization: '' }
  }

  // private apiUrl = "http://employeeportal/api/";
  // private apiUrl: string = environment.apiUrl;
  // private domainUrl: string = window.location.hostname;
  // const domainUrl = window.location.hostname; console.log("A-ha! The domain URL is:", domainUrl);
  // const fullUrl = window.location.href;console.log("A-ha! The full URL is:", fullUrl);
  private apiUrl = environment.apiUrl.replace('http://10.197.148.102', window.location.protocol + '//' + window.location.hostname);

  postLogin(username: string, password: string): Observable<Login> {
    return this.http.post<Login>(this.apiUrl + "login", { username: username, password: password });
  }
  // postSendOtp(username:string,details:string):Observable<any> {
  //   //console.log("here")
  //   return this.http.post<any>(this.apiUrl+"getOtp",{username: username,details:details});
  // }
  postSendOtp(username: string, details: string): Observable<any> {
    // Construct the URL without parameters
    const url = `${this.apiUrl}getOtp`;

    // Create the payload to send in the POST body
    const body = {
      username: username,
      details: details
    };

    // Make the POST request with the payload
    return this.http.post<any>(url, body);
  }

  postVerifyOtp(otp: string, details: string, password: string, username: string): Observable<any> {
    // Construct the URL (no parameters in the URL itself)
    const url = `${this.apiUrl}verifyOtp`;

    // Create the payload to send in the POST body
    const body = {
      otp: otp,
      details: details,
      password: password,
      username: username
    };

    // Make the POST request with the payload
    return this.http.post<any>(url, body);
  }


  postRegistration(organization: string, password: string, firstName: string, lastName: string, mobile: string): Observable<Login> {
    return this.http.post<Login>(this.apiUrl + "register", { username: mobile, password: password, name: firstName + ' ' + lastName, organization: organization });
  }

  RegistrationApply(password: string, employee: Employee): Observable<any> {
    const payload = {
      password: password,
      employee: employee
    };
    return this.http.post<any>(this.apiUrl + "Registration", payload, { headers: this.createHeader() });
  }

  rbformapply(employee: Employee): Observable<any> {
    const payload = {
      employee: employee
    };
    return this.http.post<any>(this.apiUrl + "rbformapply",payload, { headers: this.createHeader() });
  }

  getMyProfile(): Observable<Employee> {
    return this.http.get<Employee>(this.apiUrl + "my_profile", { headers: this.createHeader() });
  }

  getCardType(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "card_types", { headers: this.createHeader() });
  }

  getPays(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "pays", { headers: this.createHeader() });
  }

  getMyebaProfile(): Observable<Employee> {
    return this.http.get<Employee>(this.apiUrl + "eba_profile", { headers: this.createHeader() });
  }

  getMyIDProfile(): Observable<Employee> {
    return this.http.get<Employee>(this.apiUrl + "id_profile", { headers: this.createHeader() });
  }


  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(this.apiUrl + "employees/" + employee.id, employee, { headers: this.createHeader() });
  }

  verifyLoggedIn(): Observable<LoginStatus> {
    return this.http.post<LoginStatus>(this.apiUrl + "is_logged_in", {}, { headers: this.createHeader() });
  }

  postRefreshLogin(): Observable<Login> {
    return this.http.post<Login>(this.apiUrl + "refresh", {}, { headers: this.createHeader() });
  }

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiUrl + "organizations", { headers: this.createHeader() });
  }

  getUserMobile(): Observable<any> {
    return this.http.get<Organization[]>(this.apiUrl + "mobile_data", { headers: this.createHeader() });
  }

  getEmpEmail(): Observable<any> {
    return this.http.get<Organization[]>(this.apiUrl + "email_data", { headers: this.createHeader() });
  }

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(this.apiUrl + "states", { headers: this.createHeader() });
  }

  getState(state_id: string): Observable<State> {
    return this.http.get<State>(this.apiUrl + "states/" + state_id, { headers: this.createHeader() });
  }

  postState(state: State): Observable<State> {
    return this.http.post<State>(this.apiUrl + "states", state, { headers: this.createHeader() });
  }

  updateState(state: State): Observable<State> {
    return this.http.put<State>(this.apiUrl + "states/" + state.id, state, { headers: this.createHeader() });
  }

  deleteState(state_id: string): Observable<State> {
    return this.http.delete<State>(this.apiUrl + "states/" + state_id, { headers: this.createHeader() });
  }

  getDistricts(): Observable<District[]> {
    return this.http.get<District[]>(this.apiUrl + "districts", { headers: this.createHeader() });
  }

  getDistrictsByState(state_id: number): Promise<any> {
    return this.http.get<District[]>(this.apiUrl + "states/" + state_id + "/districts", { headers: this.createHeader() }).toPromise();
  }

  getDistrict(district_id: string): Observable<District> {
    return this.http.get<District>(this.apiUrl + "districts/" + district_id, { headers: this.createHeader() });
  }

  postDistrict(District: District): Observable<District> {
    return this.http.post<District>(this.apiUrl + "districts", District, { headers: this.createHeader() });
  }

  updateDistrict(District: District): Observable<District> {
    return this.http.put<District>(this.apiUrl + "districts/" + District.id, District, { headers: this.createHeader() });
  }

  getDesignations(org_id: number): Observable<Designation[]> {
    return this.http.get<Designation[]>(this.apiUrl + "organizations/" + org_id + "/designations", { headers: this.createHeader() });
  }

  getDivisions(org_id: number): Observable<Division[]> {
    return this.http.get<Division[]>(this.apiUrl + "organizations/" + org_id + "/divisions", { headers: this.createHeader() });
  }

  savePromotion(promotion: Promotion): Observable<Designation> {
    delete promotion['id'];
    return this.http.post<Designation>(this.apiUrl + "promotion", promotion, { headers: this.createHeader() });
  }

  saveid_card(Id_card: Idcards): Observable<Idcards> {
    delete Id_card['id'];
    return this.http.post<Idcards>(this.apiUrl + "Idcards", Id_card, { headers: this.createHeader() });
  }
  saveUser(User: User): Observable<User> {
    return this.http.post<User>(this.apiUrl + "User" , User, { headers: this.createHeader() });
  }

  updatePromotion(promotion: Promotion): Observable<Designation> {
    return this.http.post<Designation>(this.apiUrl + "promotion", promotion, { headers: this.createHeader() });
  }

  updateId_card(Idcards: Idcards): Observable<Idcards> {
    return this.http.post<Idcards>(this.apiUrl + "Idcards", Idcards, { headers: this.createHeader() });
  }

  savePosting(posting: Posting): Observable<Division> {
    return this.http.post<Division>(this.apiUrl + "posting", posting, { headers: this.createHeader() });
  }

  updatePosting(posting: Posting): Observable<Division> {
    return this.http.post<Division>(this.apiUrl + "posting", posting, { headers: this.createHeader() });
  }

  getDependents(employee_id: number): Observable<Relation[]> {
    return this.http.get<Relation[]>(this.apiUrl + "employees/" + employee_id + "/dependents", { headers: this.createHeader() });
  }

  getServants(employee_id: number): Observable<Servants[]> {
    return this.http.get<Servants[]>(this.apiUrl + "employees/" + employee_id + "/domestic_help", { headers: this.createHeader() });
  }

  getVehicle(employee_id: number): Observable<Vehicles[]> {
    return this.http.get<Vehicles[]>(this.apiUrl + "employees/" + employee_id + "/Vehicle", { headers: this.createHeader() });
  }


  /************** Chnages done by Ravikant Kumar ************************************/

  // Dashboard Details API
  getDashboardData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "dashboard", { headers: this.createHeader() });
  }

  // Get Division List From Master Table API
  getDivisionMasterList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "divisions", { headers: this.createHeader() });
  }


  // Get Relation List  From Master Table API
  getRelationMasterList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "relationsMaster", { headers: this.createHeader() });
  }

  getServiceMasterList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "service", { headers: this.createHeader() });
  }

  getBlockType(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "BlockType", { headers: this.createHeader() });
  }

  getLocationType(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "Location", { headers: this.createHeader() });
  }

  getQuarterType(location: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "Quarterbylocation/" + location, { headers: this.createHeader() });
  }

  getotp(number: string, detail: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "otp/" + number + '/' + detail, { headers: this.createHeader() });
  }



  otpverify(number: string, detail: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "verifyotp/" + number + '/' + detail, { headers: this.createHeader() });
  }

  getQuarterdetail(qtrtype: string, location: string, block: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "qtrmaster/" + qtrtype + '/' + location + '/' + block, { headers: this.createHeader() });
  }

  getEbaCardDetail(CardNo: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "EbaCardDetail/" + CardNo, { headers: this.createHeader() });
  }

  showmemberbyeba(qtrdtls: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + "showmember/" + qtrdtls, { headers: this.createHeader() });
  }

  getmemberbyeba(empid: number, qtrdtls: any, qtr: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "getmember/" + empid, { qtrdtls, qtr }, { headers: this.createHeader() });
  }
  getEbaForm(qtrdtls: any, qtr: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "getEbaForm", { qtrdtls, qtr }, { headers: this.createHeader() });
  }

  PullEbaCard(empid: number, ebacard: any, ebacarddetail: any[]): Observable<any> {
    return this.http.post<any>(this.apiUrl + "pullebacard/" + empid, { ebacard, ebacarddetail }, { headers: this.createHeader() });
  }

  submitIdfrom(value: any, FIR_no: any, emp_type: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "submitIdfrom", { value, FIR_no, emp_type }, { headers: this.createHeader() });
  }

  getidCardDetails(employee: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "idCardDetails", employee, { headers: this.createHeader() });
  }


  // Update Relation Of Employee API
  // updateRelation(dependent: Dependent[]): Observable<Relation[]>{
  //   return this.http.put<Relation[]>(this.apiUrl+"dependents",dependent,{headers:this.createHeader()});
  // }

  // Update Relation Of Employee API
  updateRelation(dependent: Dependent): Observable<Relation> {
    return this.http.post<Relation>(this.apiUrl + "dependents", dependent, { headers: this.createHeader() });
  }


  updateServant(domestic_help: Servants): Observable<Servants> {
    return this.http.post<Servants>(this.apiUrl + "domestic_help", domestic_help, { headers: this.createHeader() });
  }

  updateServantRel(domestic_help_rel: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "domestic_help_relative", domestic_help_rel, { headers: this.createHeader() });
  }

  addVehicles(vehicles: Vehicles): Observable<Vehicles> {
    return this.http.post<Vehicles>(this.apiUrl + "vehicle", vehicles, { headers: this.createHeader() });
  }



  getServantsRel(servant_id: number): Observable<ServantRel[]> {
    return this.http.get<ServantRel[]>(this.apiUrl + "domestic_help/" + servant_id + "/relative", { headers: this.createHeader() });
  }


  // Temp Changes Data List API
  // Temp Changes Data List API
  getTempChangedData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "changes", { headers: this.createHeader() });
  }

  // Get Specific/Indiviual Temp Changes Data API
  getSingleTempData(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "tempData/" + id, { headers: this.createHeader() });
  }

  // Approve Temp Changes Data API
  approveTempData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}approve/${id}`, { headers: this.createHeader() });
  }

  // Reject Temp Changes Data API
  rejectTempData(model: string, id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}reject/${model}/${id}`, { headers: this.createHeader() });
  }

  // Change Password API
  changePassword(changepassdata: ChangePassword): Observable<ChangePassword> {
    return this.http.post<ChangePassword>(this.apiUrl + "change_password", changepassdata, { headers: this.createHeader() });
  }

  // For Specific Employee Details
  getEmpProfile(id: number): Observable<Employee> {
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
    return this.http.get(`${this.apiUrl}getpic/${file}`, { headers: this.createHeader(), responseType: 'blob' });
  }


  getEbaDashboardData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "ebadashboard", { headers: this.createHeader() });
  }
  getRegDashboardData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "registrationDashboard", { headers: this.createHeader() });
  }
  getEbaPrintData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "ebaprint", { headers: this.createHeader() });
  }
  searchEba(searchEba: Search): Observable<any> {
    return this.http.post<any>(this.apiUrl + "searchEba", searchEba, { headers: this.createHeader() });
  }

  searchrb(searchrb: Search): Observable<any> {
    return this.http.post<any>(this.apiUrl + "searchrb", searchrb, { headers: this.createHeader() });
  }
  getRbPrintData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "rbprint", { headers: this.createHeader() });
  }
  ebaapplicationByApplicant(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "Eba", { headers: this.createHeader() });
  }

  idapplicationByApplicant(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "Registration", { headers: this.createHeader() });
  }

  getEbaProfile(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `Eba/${id}`, { headers: this.createHeader() });
  }

  showEbaformProfile(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `showEbaformProfile/${id}`, { headers: this.createHeader() });
  }

  getRegProfile(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `Registration/${id}`, { headers: this.createHeader() });
  }


  applyeba(ebaPasses: Employee): Observable<any> {
    // const dataToSubmit = { relation: ebaPasses };
    // const options = { headers: this.createHeader() };
    return this.http.post<Employee>(this.apiUrl + "Eba", ebaPasses, { headers: this.createHeader() });
  }

  applyclosefamily(ebaPasses: Employee): Observable<any> {
    return this.http.post<Employee>(this.apiUrl + "submitClosefamily", ebaPasses, { headers: this.createHeader() });
  }

  updateeba(ebaPasses: Employee, id: number): Observable<any> {
    // const dataToSubmit = { relation: ebaPasses };
    // const options = { headers: this.createHeader() };
    return this.http.put<Employee>(this.apiUrl + "Eba/" + id, ebaPasses, { headers: this.createHeader() });
  }

  updaterb(rbPasses: Employee, id: number): Observable<any> {
    // const dataToSubmit = { relation: ebaPasses };
    // const options = { headers: this.createHeader() };
    return this.http.put<Employee>(this.apiUrl + "Registration/" + id, rbPasses, { headers: this.createHeader() });
  }

  RFID(rfid: any, passno: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}rfid/${rfid}/${passno}`, { headers: this.createHeader() });
  }

  rbrfid(rfid: any, passno: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}rbrfid/${rfid}/${passno}`, { headers: this.createHeader() });
  }

  printstatus(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}printStatus/${id}`, { headers: this.createHeader() });
  }

  rbprintstatus(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}rbprintStatus/${id}`, { headers: this.createHeader() });
  }

  ebapasses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}ebapasses`, { headers: this.createHeader() });
  }

  rbpasses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}rbpasses`, { headers: this.createHeader() });
  }

  updateebastatus(id: number, action: string, remark: string, file_path_64: string): Observable<any> {
    const options = { headers: this.createHeader() };
    const requestBody = {
      action: action,
      remark: remark,
      file_path_64: file_path_64
    };

    return this.http.post<any>(this.apiUrl + "Ebastatus/" + id, requestBody, options);
  }

  updaterbstatus(id: number, action: string, remark: string): Observable<any> {
    const options = { headers: this.createHeader() };
    const requestBody = {
      action: action,
      remark: remark,
      // file_path_64:file_path_64
    };

    return this.http.post<any>(this.apiUrl + "rbstatus/" + id, requestBody, options);
  }

  applyEvahaan(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "evahaan", { headers: this.createHeader() });
  }


}
