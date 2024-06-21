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
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-id-form',
  templateUrl: './id-form.component.html',
  styleUrls: ['./id-form.component.scss'],
  providers: [DatePipe] // Include DatePipe in the providers array
})
export class IdFormComponent implements OnInit {
  baseUrl: string = '';
  today: Date | undefined;
  constructor(
    @Inject('BASE_URL') baseUrl: string,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.baseUrl = baseUrl;
    this.today = new Date();
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
  fromUrl: string='';
  submit: string='';
  // id: any;
  status:string='';
  reg_no:string='';



  ngOnInit() {
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.id = this.route.snapshot.paramMap.get('id');

    if(this.mode == 'applicant' && this.id == 'view') {
      this.employee = history.state.employeeData;
      console.log(this.employee);
      this.fromUrl = history.state.fromUrl;
      console.log(this.fromUrl);
      this.submit = history.state.submit;
      console.log(this.submit);
      this.id = history.state.id;
      console.log(this.id);
      this.status = history.state.status;
      console.log(this.status);
      this.reg_no = history.state.reg_no;
      console.log(this.reg_no);
    } else {
      this.setEditable(this.mode == 'edit');
      let userString: string | null = sessionStorage.getItem('user') != null ? sessionStorage.getItem('user') : '[]';
      this.user = JSON.parse(userString!);

      if (this.user && this.user.role && this.user.role.some((role: number) => (role === 11 || role == 12 || role == 13))||(this.mode == 'return')) {
        if (this.mode !== 'return') {
          this.letverify(!isNaN(+this.id!));
        }
      }

      if (this.id) {
        // 'id' is present, try to convert it to a number
        const idNumber = +this.id;
        if (!isNaN(idNumber)) {
          if (this.user && this.user.role && this.user.role.some((role: number) => (role === 11 || role == 12 || role == 13))||(this.mode == 'return')) {
            // 'id' is a valid number, call getrbProfile
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
          // 'id' is not a valid number, call getMyrbProfile
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
        // 'id' is not present, call getMyrbProfile
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
    }
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

  approveapplication() {
    const id = +this.route.snapshot.params['id'];
    if (!isNaN(id)) {
      if (this.user && this.user.role && this.user.role.some((role:  number) => role === 11)) {
        if (this.employee) {
          console.log(this)
          const clonedEmployee = {...this.employee};

          this.isLoading=true;
          // this.employeeService.updaterb(this.employee, id).subscribe(
          //     () => {
          this.employeeService.updaterbstatus(id, 'Approve', this.remark?? '').subscribe(
            () => {
              this.isLoading = false;
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Forwarded successfully',
              }).then(() => {
                // Redirect to the dashboard route
                this.router.navigate(['regpanel']);
              });
            },
            (error) => {
              this.isLoading = false;
              console.log('Error in updaterbstatus:', error);
              if (error.status === 302) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Warning',
                  text: 'You are not authorised !!!',
                });
              } else {
                // Handle specific errors or use a generic error message
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'An error occurred while Approving application status.',
                });
              }
            },
          );
          // },
          // (error) => {
          //   this.isLoading = false;
          //   console.log('Error in updaterb:', error);
          //   // Handle specific errors or use a generic error message
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Error',
          //     text: 'An error occurred while updating the application.',
          //   });
          // }
          // );
        }else {
          console.error('ID parameter is missing or invalid in the URL.');
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'data missing !!!',
          });
          return;
        }
      }

        else if (this.user && this.user.role && this.user.role.some((role:  number ) => (role === 12))) {
          this.isLoading=true;
          this.employeeService.updaterbstatus(id, 'Approve', this.remark?? '').subscribe(
              () =>{
                this.isLoading = false;
                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Approved successfully',
                });
                // .then(() => {
                //   // Redirect to the dashboard route
                //   this.router.navigate(['regpanel']);
                // });
              },
              (error) => {
                this.isLoading = false;
                console.log(error);
                console.log(error.status);
                console.log(error.error);
                if (error.status === 302) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: 'You are not authorised !!!',
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while Approving application status.',
                  });
                }
              }
          );
      }
      else{
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'You are not authorised !!!',
        });
      }
    }else{
      console.error('ID parameter is missing or invalid in the URL.');
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'id missing !!!',
      });
      return;
    }
  }

  returnapplication()
  {
    // Extract id from route parameters
    const id = +this.route.snapshot.params['id'];
    if (this.user && this.user.role && this.user.role.some((role:  number) => role === 11)) {
      if(this.employee){
        if(this.remark == null ){
          Swal.fire({
            icon: 'warning',
            title: 'Enter note ',
            text: 'enter note for ' +this.employee.emp_name,
          });
          return;
        }
        this.isLoading=true;
        // this.employeeService.updaterb(this.employee, id).subscribe(() => {
        if (!isNaN(id)) {
          this.employeeService.updaterbstatus(id, 'Return', this.remark ?? '').subscribe(

            () => {
              this.isLoading = false;
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Returned successfully',
              }).then(() => {
                // Redirect to the dashboard route
                this.router.navigate(['regpanel']);
              });
            },
            (error) => {
              this.isLoading = false;
              console.log(error);
              console.log(error.status);
              console.log(error.error);

              if (error.status === 302) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Warning',
                  text: 'You are not authorized !!!',
                });
              } else {
                // Handle other errors here
                let errorMessage = 'An error occurred while Returning application.';
                if (error.error && error.error.message) {
                  errorMessage = error.error.message;
                }
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
              });
              }
            }
          );
        } else {
          console.error('ID parameter is missing or invalid in the URL.');
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'id missing !!!',
          });
          return;
        }
        // },(error) => {
        //     this.isLoading = false;
        //   console.log('Error in updaterb:', error);
        //   // Handle specific errors or use a generic error message
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Error',
        //     text: 'An error occurred while updating the application.',
        //   });
        // }

        //     );
      }else {
        console.error('ID parameter is missing or invalid in the URL.');
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'data missing !!!',
        });
        return;
      }
    }
    else if (this.user && this.user.role && this.user.role.some((role:  number ) => (role === 12 ))){
      if (!isNaN(id)) {

        this.isLoading=true;
        this.employeeService.updaterbstatus(id, 'Return', this.remark ?? '').subscribe(
            () => {
              this.isLoading = false;
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Returned successfully',
              }).then(() => {
                // Redirect to the dashboard route
                this.router.navigate(['regpanel']);
              });
            },
            (error) => {
              this.isLoading = false;
              console.log(error);
              console.log(error.status);
              console.log(error.error);

              if (error.status === 302) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Warning',
                  text: 'You are not authorized !!!',
                });
              } else {
                // Handle other errors here
                let errorMessage = 'An error occurred while Returning application.';
                if (error.error && error.error.message) {
                  errorMessage = error.error.message;
                }
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
              });
              }
            }
        );
      } else {
        console.error('ID parameter is missing or invalid in the URL.');
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'id missing !!!',
        });
        return;
      }
    }
  }



}

@NgModule({
  declarations: [
    IdFormComponent // Include your component declaration here
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinner,
// Import CommonModule here
    // Other modules imports
  ]
})
export class IdFormComponentModule { }
