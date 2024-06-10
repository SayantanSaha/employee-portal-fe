import { Component, NgModule, OnInit, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { Employee } from '../model/Employee';
import { User } from '../model/User';
import {Idcards} from "../model/Idcards";
import {fileToBase64} from "../profile/fileToBase64";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-id-form',
  templateUrl: './id-form.component.html',
  styleUrls: ['./id-form.component.scss'],
  providers: [DatePipe] // Include DatePipe in the providers array
})
export class IdFormComponent implements OnInit {
  baseUrl: string = '';
  constructor(
    @Inject('BASE_URL') baseUrl: string,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.baseUrl = baseUrl;
  }

  employee: Employee | null = null;
  user: User = new User();
  apiUrl = environment.apiUrl;
  editable: boolean = false;
  mode: string | null = null;
  urlId: boolean = false;
  id: string | null = null;
  remark: string | null = null;
  file_path: string | null = null;
  file_path_64: string | null = null;
  isLoading: boolean = false;
  vide_no: any | null = null;
  vide_date: any | null = null;
  returnapp: boolean = false;


  ngOnInit() {
    this.isLoading = true;
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.setEditable(this.mode == 'edit');

    let userString: string | null = sessionStorage.getItem('user') != null ? sessionStorage.getItem('user') : '[]';
    this.user = JSON.parse(userString!);

     if (this.user && this.user.role && this.user.role.some((role: number) => (role === 11 || role == 12 || role == 13))||(this.mode == 'return')) {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.mode !== 'return') {
        this.letverify(!isNaN(+this.id!));
      }
     }

    if (this.id) {
      // 'id' is present, try to convert it to a number
      const idNumber = +this.id;
      if (!isNaN(idNumber)) {
        if (this.user && this.user.role && this.user.role.some((role: number) => (role === 11 || role == 12 || role == 13))||(this.mode == 'return')) {
          // 'id' is a valid number, call getEbaProfile
          this.employeeService.getRegProfile(idNumber).subscribe(
            (data: any) => {
              this.employee = data;
              if(this.mode == 'return') {
                this.returnedapplication(this.mode == 'return');
              }
            }
          );
        }
      } else {
        // 'id' is not a valid number, call getMyebaProfile
        this.employeeService.getMyIDProfile().subscribe(
          (data: any) => {
            this.employee = data;
          }, (error) => {
            if (error.status === 400 && error.error.msg === 'Not allowed') {
              Swal.fire({
                title: 'Not Allowed',
                text: 'You are not allowed to access this resource.',
                icon: 'error',
              }).then(() => {
                this.router.navigate(['/dashboard']);
              });
            }
          }
        );
      }
    } else {
      // 'id' is not present, call getMyebaProfile
      this.employeeService.getMyIDProfile().subscribe(
        (data: any) => {
          this.employee = data;
        }, (error) => {
          if (error.status === 400 && error.error.msg === 'Not allowed') {
            Swal.fire({
              title: 'Not Allowed',
              text: 'You are not allowed to access this resource.',
              icon: 'error',
            }).then(() => {
              this.router.navigate(['/dashboard']);
            });
          }
        }
      );
    }
    this.isLoading = false;
  }

  setEditable(status: boolean) {
    this.editable = status;
  }

  letverify(status: boolean) {
    this.urlId = status;
  }
  returnedapplication(status:boolean) {
    this.returnapp = status;
  }

  printPage() {
    window.print();
  }




}

@NgModule({
  declarations: [
    IdFormComponent // Include your component declaration here
  ],
  imports: [
    CommonModule ,
    FormsModule// Import CommonModule here
    // Other modules imports
  ]
})
export class IdFormComponentModule { }
