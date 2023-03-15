import { Component } from '@angular/core';
import {EmployeeService} from "../employee.service";
import {Alert} from "../model/alert";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  constructor(employeeService: EmployeeService) {
  }

  firstName: string ='';
  lastName: string ='';
  email: string ='';
  mobile: string ='';
  password: string ='';
  cpassword: string ='';
  alerts:Alert[] = [];

  doRegistration(){

  }

  validateInput(){
    if(this.password!=this.cpassword){
      this.alerts.push(new Alert('danger','Password and Confirm Password no not match'));
    }

  }

}
