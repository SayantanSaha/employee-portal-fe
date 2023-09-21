import { Component } from '@angular/core';

import {EmployeeService} from "../employee.service";
import {Authorisation} from "../model/Authorisation";
import {Router} from "@angular/router";
import {User} from "../model/User";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private employeeService: EmployeeService,
    private router: Router
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
                this.router.navigate(['/profile/view']);
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


}
