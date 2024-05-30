import { Component } from '@angular/core';
import {EmployeeService} from "../employee.service";
import {Alert} from "../model/alert";
import {Router} from "@angular/router";
import { trigger, state, style, animate, transition } from '@angular/animations';
import {Organization} from "../model/Organization";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('0', style({ transform: 'translateX(0)' })),
      state('1', style({ transform: 'translateX(-100%)' })),
      state('2', style({ transform: 'translateX(-200%)' })),
      transition('* => *', animate('300ms ease'))
    ])
  ]
})
export class RegistrationComponent {
  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {
  }

  firstName: string ='';
  lastName: string ='';
  // email: string ='';
  mobile: string ='';
  password: string ='';
  cpassword: string ='';
  organization:string='';
  orglist:Organization[] = [];
  alerts:Alert[] = [];

  ngOnInit() {
    this.employeeService.getOrganizations().subscribe(
      data => this.orglist = data,
      error => console.log(error)
    );
  }


  doRegistration(){
    if(this.validateInput()){
      this.employeeService.postRegistration(this.organization,this.password,this.firstName,this.lastName,this.mobile)
        .subscribe((data) => {
          console.log(data);
          if(data.status=='success'){
            sessionStorage.setItem('user', JSON.stringify(data.user));
            sessionStorage.setItem('authorisation', JSON.stringify(data.authorisation));
            sessionStorage.setItem('isLoggedIn', 'true');
            this.router.navigate(['/profile/edit']);
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

  currentPageIndex = 0;
  totalPages = 3; // Update this if you add or remove pages

  goToNextPage() {
    if (this.currentPageIndex < this.totalPages - 1) {
      this.currentPageIndex++;
    }
  }

  goToPreviousPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
    }
  }

}
