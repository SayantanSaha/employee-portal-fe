import { Component,Renderer2 } from '@angular/core';

import {EmployeeService} from "../employee.service";
import {Authorisation} from "../model/Authorisation";
import {Router} from "@angular/router";
import {User} from "../model/User";
import Swal from 'sweetalert2';
import {registerLocaleData} from "@angular/common";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private renderer: Renderer2
  ) { }

  username: string='';
  password: string='';
  user: User|null = null;
  authorisation: Authorisation|null = null;

  doLogin(){
    this.employeeService.postLogin(this.username,this.password)
      .subscribe(
        //console.log(data);
        //console.log(error);
        (data) => {
          if(data.status=='success'){
            this.user = data.user;
            this.authorisation = data.authorisation;
            sessionStorage.setItem('user', JSON.stringify(this.user));
            sessionStorage.setItem('authorisation', JSON.stringify(this.authorisation));
            sessionStorage.setItem('isLoggedIn', 'true');
            for (let item of this.user!.role) {
              if( item.id===1 && item.role_desc==='Super Admin')
                this.router.navigate(['/dashboard']);
              else if(item.id===2 && item.role_desc==='Admin' )
                this.router.navigate(['/dashboard']);
              else
                this.router.navigate(['/dashboard']);
            }

          }
        },
        (error) =>{
          Swal.fire({
            icon: 'error',
            title: 'API Error',
            text: error.error.message,
          });
        }
      )
  }

  doLogout(){
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

  protected readonly registerLocaleData = registerLocaleData;
}
