import { Component, Renderer2 } from '@angular/core';

import { EmployeeService } from "../employee.service";
import { Authorisation } from "../model/Authorisation";
import { Router } from "@angular/router";
import { User } from "../model/User";
import Swal from 'sweetalert2';
import { registerLocaleData } from "@angular/common";
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  resetForm:FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private renderer: Renderer2,
    private formBuilder: FormBuilder
  ) {
    this.resetForm=this.formBuilder.group({
      otp:['',Validators.required],password1:['',Validators.required],password2:['',Validators.required]
    })
  }

  username: string = '';
  password: string = '';
  user: User | null = null;
  authorisation: Authorisation | null = null;

  doLogin() {
    this.employeeService.postLogin(this.username, this.password)
      .subscribe(
        //console.log(data);
        //console.log(error);
        (data) => {
          if (data.status == 'success') {
            this.user = data.user;
            this.authorisation = data.authorisation;
            sessionStorage.setItem('user', JSON.stringify(this.user));
            sessionStorage.setItem('authorisation', JSON.stringify(this.authorisation));
            sessionStorage.setItem('isLoggedIn', 'true');
            for (let item of this.user!.role) {
              if (item.id === 1 && item.role_desc === 'Super Admin')
                this.router.navigate(['/dashboard']);
              else if (item.id === 2 && item.role_desc === 'Admin')
                this.router.navigate(['/dashboard']);
              else
                this.router.navigate(['/dashboard']);
            }

          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message,
          });
        }
      )
  }

  doLogout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authorisation');
    sessionStorage.removeItem('isLoggedIn');
  }
  marginTop = '0%';
  backgroundImage = 'url(assets/images/monkey_pwd.gif)';

  openEye() {
    this.renderer.setStyle(document.getElementById('animcon'), 'background-image', 'url(assets/images/monkey.gif)');
    this.marginTop = '110%';

  }

  closeEye() {
    this.renderer.setStyle(
      document.getElementById('animcon'),
      'background-image',
      ' url(assets/images/img_6.png),url(assets/images/monkey_pwd.gif)'
    );

    this.marginTop = '0%';
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
  showForm1: boolean = true;
  showForm2: boolean = false;
  showForm3: boolean = false;
  forgotPassword() {
    console.log("Button clicked");
    this.showForm1 = false;
    this.showForm2 = true;
    this.showForm3 = false;
  }
  backToLogin() {
    console.log("Back to Login clicked");
    this.showForm1 = true;
    this.showForm2 = false;
    this.showForm3 = false;
  }
  sendOtp() {
    console.log(this.username);
    this.employeeService.postSendOtp(this.username,"passwordReset").subscribe(
      (response) => {
        console.log(response.msg);
        this.showForm1 = false;
        this.showForm2 = false;
        this.showForm3 = true;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.msg,
        });
      },
      (error) => {
        console.error(error.msg);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.msg,
        });
      }
    );
    return true;
   // return true;
  }
  otp: string='';
  password1: string='';
  password2: string='';
  changePassword(otp: string,pass1: string,pass2: string) {

    console.log(otp,pass1,pass2)
    //return false;
    if(pass1!=pass2){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password Not Matched!',
      });
      return false;
    }
    else{
      this.employeeService.postVerifyOtp(otp,"passwordReset",pass2,this.username).subscribe(
        (response) => {
          if(response.status){
            console.log(response.status);
            this.showForm1 = true;
            this.showForm2 = false;
            this.showForm3 = false;
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: response.msg,
            });
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.msg,
            });

          }

        },
        (error) => {
          console.error(error.msg);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
          });
        }
      );
    }

    return true;
  }



  protected readonly registerLocaleData = registerLocaleData;
}
