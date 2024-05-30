import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { User } from "../model/User";
import { Router}  from "@angular/router";
import { Employee } from "../model/Employee";

import { ActivatedRoute } from "@angular/router";
import { EmployeeService } from "../employee.service";
import { ChangePassword } from "../model/ChangePassword";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})


export class ChangePasswordComponent implements OnInit {


  employee: Employee | null = null;
  validationErrors: string[] = [];
  changepassword: ChangePassword = new ChangePassword();

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit() {
    this.employeeService.getMyProfile().subscribe(
      data => {
        this.employee = data;
      }
    );
  }


  changePassword() {

    if (this.changepassword!.curr_password === null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please Enter Current Password',
      });
      return; // Exit without calling the API
    }

    if (this.changepassword!.new_password === null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please Enter New Password',
      });
      return; // Exit without calling the API
    }

    if (this.changepassword!.re_new_password === null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please Re-Enter New Password',
      });
      return; // Exit without calling the API
    }

    this.validatePassword()

    if (this.validationErrors.length > 0) {

      const errorMessage = this.validationErrors
      .map((error, index) => `${index + 1}. ${error}`)
      .join('\n');

      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: errorMessage.replace(/\n/g, '<br/>'),
        width: 'auto', // Adjust as needed
      });
      return; // Exit without calling the API
    }

    console.log(this.changepassword!)
    this.employeeService.changePassword(this.changepassword!).subscribe(
      // data => console.log(data),
      // error => console.log(error)


      data => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Password updated successfully. You have been logged out. Please log in again.',
          }).then((result) => {
            if (result.isConfirmed) {
              sessionStorage.removeItem('user');
              sessionStorage.removeItem('authorisation');
              sessionStorage.removeItem('isLoggedIn');
              this.router.navigate(['/login']);
            }
        });
      },
      (error) => {
        console.log(error);
        console.log(error.status);
        console.log(error.error);
        Swal.fire({
          icon: 'error',
          title: 'API Error',
          text: error.error.message,
        });
      }

    );

  }


  // validatePassword() {

  //   // const passPattern = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\|/]+$/;
  //   const passPattern = /^[a-zA-Z0-9!@#$%&*()_-]{8,20}$/;
  //   let errorMessage = '';

  //   if(this.changepassword!.curr_password !== null && !passPattern.test(this.changepassword.curr_password)) { // Note the negation (!) here
  //     errorMessage = `Invalid Current Password`;
  //     this.validationErrors.push(errorMessage);

  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: errorMessage,
  //     });
  //   }else if(this.changepassword!.new_password !== null && !passPattern.test(this.changepassword.new_password)) {
  //     if()
  //     // Note the negation (!) here
  //     errorMessage = `Invalid New Password`;
  //     this.validationErrors.push(errorMessage);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: errorMessage,
  //     });
  //   }else if(this.changepassword!.re_new_password !== null && !passPattern.test(this.changepassword.re_new_password)) {
  //     // Note the negation (!) here
  //     errorMessage = `Invalid Re Enter Password`;
  //     this.validationErrors.push(errorMessage);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: errorMessage,
  //     });
  //   }else if(this.changepassword!.curr_password === null){
  //     errorMessage = `Please Enter Current Password`;
  //     this.validationErrors.push(errorMessage);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: errorMessage,
  //     });
  //   }else if(this.changepassword!.new_password === null){
  //     errorMessage = `Please Enter New Password`;
  //     this.validationErrors.push(errorMessage);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: errorMessage,
  //     });
  //   }else if(this.changepassword!.re_new_password === null){
  //     errorMessage = `Please Enter Re-Enter New Password`;
  //     this.validationErrors.push(errorMessage);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: errorMessage,
  //     });
  //   }

  //   const index = this.validationErrors.indexOf(errorMessage);
  //   if (index !== -1) {
  //     this.validationErrors.splice(index, 1);
  //   }

  // }
  validatePassword() {
    const passPattern = /^[a-zA-Z0-9!@#$%&*()_-]{8,20}$/;
    let errorMessage = '';

    // Check if Current Password is null
    if (this.changepassword!.curr_password !== null && !passPattern.test(this.changepassword.curr_password)) {
      this.validationErrors.push('Invalid Current Password');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid Current Password',
      });
    } else {
      // Clear any previous error messages
      const index = this.validationErrors.indexOf('Invalid Current Password');
      if (index !== -1) {
        this.validationErrors.splice(index, 1);
      }
    }

    if (this.changepassword!.new_password !== null && !passPattern.test(this.changepassword.new_password)) {

      this.validationErrors.push('Invalid New Password');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid New Password',
      });
    } else {
      // Clear any previous error messages
      const index = this.validationErrors.indexOf('Invalid New Password');
      if (index !== -1) {
        this.validationErrors.splice(index, 1);
      }
    }

    if (this.changepassword!.re_new_password !== null && !passPattern.test(this.changepassword.re_new_password)) {
      this.validationErrors.push('Invalid Re-Enter Password');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid Re-Enter Password',
      });
    }else {
      // Clear any previous error messages
      const index = this.validationErrors.indexOf('Invalid Re-Enter Password');
      if (index !== -1) {
        this.validationErrors.splice(index, 1);
      }
    }

    // Check if New Password and Re-Enter New Password match
    if (
      this.changepassword!.new_password !== null &&
      this.changepassword!.re_new_password !== null &&
      this.changepassword!.new_password !== this.changepassword!.re_new_password
    ) {
      this.validationErrors.push('New Password and Re-Enter Password do not match');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'New Password and Re-Enter Password do not match',
      });
    } else {
      // Clear any previous error messages
      const index = this.validationErrors.indexOf('New Password and Re-Enter Password do not match');
      if (index !== -1) {
        this.validationErrors.splice(index, 1);
      }
    }


  }


  hoverClick(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    if (button) {
      button.classList.add('clicked');

      // Remove the class after a short delay to allow the shadow to disappear
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 200); // Adjust the delay (in milliseconds) based on your transition duration
    }
  }






}
