import { Component } from '@angular/core';
import { EmployeeService } from "../employee.service";
import { Alert } from "../model/alert";
import { Router } from "@angular/router";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Organization } from "../model/Organization";
import Swal from "sweetalert2";
import { Employee } from "../model/Employee";
import { State } from "../model/State";
import { District } from "../model/District";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('0', style({ transform: 'translateX(0)' })),
      state('1', style({ transform: 'translateX(-100%)' })),
      state('2', style({ transform: 'translateX(-200%)' })),
      state('3', style({ transform: 'translateX(-300%)' })),
      state('4', style({ transform: 'translateX(-400%)' })),
      state('5', style({ transform: 'translateX(-500%)' })),
      state('6', style({ transform: 'translateX(-600%)' })),
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

  employee: Employee | null = null;
  password: string = '';
  cpassword: string = '';
  organization: string = '';
  orglist: Organization[] = [];
  states: State[] = [];
  currDistricts: District[] = [];
  permDistricts: District[] = [];
  isCpAddressChecked: boolean = false;


  doRegistration() {
    if (this.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Password must be at least 6 characters long',
      });
      return;
    }

    if (this.password !== this.cpassword) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Password and Confirm Password do not match',
      });
      return;
    }
    this.employeeService.postRegistration(this.organization, this.password, this.employee!.emp_name, this.employee?.relations?.[0]?.pivot?.rel_name!, this.employee!.mobile).subscribe(
      (data) => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Registered Successfully',
        }).then(() => {
          this.router.navigate(['login']);
        });
      },
      (error) => {
        let errorMessage = 'An error occurred. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        });
      }
    );
  }

  cPAddress() {
    // Check if the checkbox is checked
    if (this.isCpAddressChecked === true) {

      // If checked, copy current address to permanent address
      if (this.employee!.curr_add && this.employee!.curr_pin && this.employee!.curr_state && this.employee!.curr_district) {
        this.employee!.perm_add = this.employee!.curr_add;
        this.employee!.perm_pin = this.employee!.curr_pin;
        this.employee!.perm_state = this.employee!.curr_state;

        this.employee!.perm_district = this.employee!.curr_district;

        this.getDistricts(this.employee!.perm_state!).then((districts: District[]) => this.permDistricts = districts);

      } else {

        // Uncheck the checkbox
        this.isCpAddressChecked = false;

        // Show an alert if current address fields are not filled
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please Fill all the Field of Current Address',
        });
      }
    } else {
      // If unchecked, reset permanent address fields to null
      this.employee!.perm_add = null;
      this.employee!.perm_pin = null;
      this.employee!.perm_state = null;
      this.employee!.perm_district = null;

      this.getDistricts(this.employee!.perm_state!).then((districts: District[]) => this.permDistricts = districts);
    }
  }

  passwordsMatch: boolean = false;
  passwordValid: boolean = false;
  passwordTouched: boolean = false;
  cpasswordTouched: boolean = false;

  validatePasswords(): void {
    this.passwordTouched = true;
    this.cpasswordTouched = true;

    this.passwordValid = this.password.length >= 6;
    this.passwordsMatch = this.passwordValid && this.password === this.cpassword;
  }

  currentPageIndex = 0;
  totalPages = 7; // Update this if you add or remove pages
  slides = new Array(this.totalPages);

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

  onStateChange(state: State, type: String) {
    if (type === 'curr') {
      this.getDistricts(state).then(districts => this.currDistricts = districts);
    }
    else if (type === 'perm') {
      this.getDistricts(state).then(districts => this.permDistricts = districts);
    }
  }

  async getDistricts(state: State) {
    let districts: District[] = [];
    if (state != null) {
      districts = await this.employeeService.getDistrictsByState(state.id!);
    }
    return districts;
  }
}
