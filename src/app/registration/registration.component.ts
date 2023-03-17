import { Component } from '@angular/core';
import {EmployeeService} from "../employee.service";
import {Alert} from "../model/alert";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {
  }

  firstName: string ='';
  lastName: string ='';
  email: string ='';
  mobile: string ='';
  password: string ='';
  cpassword: string ='';
  alerts:Alert[] = [];

  doRegistration(){
    if(this.validateInput()){
      this.employeeService.postRegistration(this.email,this.password,this.firstName,this.lastName,this.mobile)
        .subscribe((data) => {
          console.log(data);
          if(data.status=='success'){
            sessionStorage.setItem('user', JSON.stringify(data.user));
            sessionStorage.setItem('authorisation', JSON.stringify(data.authorisation));
            sessionStorage.setItem('isLoggedIn', 'true');
            this.router.navigate(['/dashboard']);
          }
        },
          error => {
            this.alerts.push(new Alert('danger',JSON.stringify(error)));
          }

      )
    }
  }

  validateInput(){
    let valid:boolean = true;
    if(this.password!=this.cpassword){
      this.alerts.push(new Alert('danger','Password and Confirm Password no not match'));
      valid=false;
    }
    return valid;
  }

}
