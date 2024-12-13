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
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  employee: Employee | null = null;
  user: User = new User();
  // apiUrl = environment.apiUrl;
  apiUrl = environment.apiUrl.replace('10.197.148.102', window.location.hostname);

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
  passColors: any[] = [];
  passColor_issued: any[] = [];
  minDate : string;
  maxDate: string='';
  divisions:any[] = [];
  previewData :any | null = null;

  ngOnInit() {
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.id = this.route.snapshot.paramMap.get('id');
    this.employeeService.getDivisions(1).subscribe(
      data => this.divisions = data,
      error => console.log(error)
    );
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

      if (this.user && this.user.role && this.user.role.some((role: number) => (role === 11 || role == 12 || role == 13|| role == 14 || role == 17))||(this.mode == 'return')) {
        if (this.mode !== 'return') {
          this.letverify(!isNaN(+this.id!));
        }
      }

      if (this.id) {
        // 'id' is present, try to convert it to a number
        const idNumber = +this.id;
        if (!isNaN(idNumber)) {
          if (this.user && this.user.role && this.user.role.some((role: number) => (role === 11 || role == 12 || role == 13|| role == 14 || role == 17))||(this.mode == 'return')) {
            // 'id' is a valid number, call getrbProfile
            this.employeeService.getRegProfile(idNumber).subscribe(
              (data: any) => {
                this.employee = data;
                if(this.employee?.dor) {
                const maxAllowedDate = new Date('2027-07-31');
                const dorDate = new Date(this.employee?.dor);
                  this.maxDate = this.employee?.dor;

                  if (dorDate && dorDate > maxAllowedDate) {
                    this.maxDate = maxAllowedDate.toISOString().split('T')[0];
                  } else {
                    this.maxDate = dorDate ? dorDate.toISOString().split('T')[0] : '';
                  }
                }
                this.employeeService.getCardType().subscribe(
                  data => {
                    this.passColors = data;

                    if(this.employee!.emp_type == 'Temporary'){
                      this.passColors = this.passColors.filter(color => ['Y','G', 'P', 'R'].includes(color.code));
                      this.passColor_issued = this.passColors.filter(color => ['Y','G', 'P', 'R'].includes(color.code));
                    }
                    if(this.employee!.emp_type == 'Permanent'){
                      this.passColors = this.passColors.filter(color => ['G', 'P', 'R','Y'].includes(color.code));
                      this.passColor_issued = this.passColors.filter(color => ['G', 'P', 'R','Y'].includes(color.code));
                    }

                  },
                  error => console.error(error)
                );

                if(this.mode == 'return') {
                  this.returnedapplication(this.mode == 'return');
                }
              }
            );
          }
        } else {
          // 'id' is not a valid number, call getMyrbProfile
          // @ts-ignore
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
              if (error.status === 404) {
                Swal.fire({
                  title: 'Data required',
                  text: error.error.msg,
                  icon: 'warning',
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
            }if (error.status === 404) {
              Swal.fire({
                title: 'Data required',
                text: error.error.msg,
                icon: 'warning',
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

  onApplyReasonChange(): void {
    if (this.employee!.apply_reason !== 'Lost/theaft') {
      this.employee!.FIR_no = null;
    }
  }

  confirmSubmit(applyReason: string,FIR_no: string|null,emp_type: string): void {
    Swal.fire({
      title: 'Do you want to submit?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitIdfrom(applyReason,FIR_no,emp_type);
      }
    });
  }

  confirmApprove(): void {
    Swal.fire({
      title: 'Do you want to forward the application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, forward it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveapplication();
      }
    });
  }

  confirmReturn(): void {
    Swal.fire({
      title: 'Do you want to return the application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, return it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.returnapplication();
      }
    });
  }


  submitIdfrom(value:string,FIR_no:string|null,emp_type:string){
    this.employeeService.submitIdfrom(value,FIR_no,emp_type).subscribe(
      () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'applied successfully',
        }).then(() => {
          // Redirect to the dashboard route
          this.router.navigate(['dashboard']);
        });
      },
      (error) => {
        if (error.status === 404) {
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'insert Reason !!!',
          });
        }else{
        this.isLoading = false;
        console.log('Error in updaterbstatus:', error);
          // Handle specific errors or use a generic error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message,
          });
        }
      },
    );


  }

  // errorMessage: string = '';
  // validateDates() {
  //   const validupto = new Date(this.employee!.validupto);
  //   const dor = new Date(this.employee!.dor);
  //   if (validupto > dor) {
  //     this.errorMessage = 'Valid upto date should not be greater than Date of Retirement.';
  //   } else {
  //     this.errorMessage = '';
  //   }
  // }

  approveapplication() {
    const id = +this.route.snapshot.params['id'];
    if (!isNaN(id)) {
      if (this.user && this.user.role && this.user.role.some((role:  number) => role === 13)) {
        if (this.employee) {
          console.log(this)
          const clonedEmployee = {...this.employee};

          this.isLoading=true;
          this.employeeService.updaterb(this.employee, id).subscribe(
              () => {
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
          },
          (error: any) => {
            this.isLoading = false;
            console.log('Error in updaterb:', error);
            // Handle specific errors or use a generic error message
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while updating the application.',
            });
          }
          );
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

        else if (this.user && this.user.role && this.user.role.some((role:  number ) => (role === 12 || role ===11 || role===14 || role ===17))) {
          this.isLoading=true;
          this.employeeService.updaterbstatus(id, 'Approve', this.remark?? '').subscribe(
              () =>{
                this.isLoading = false;
                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Approved successfully',
                })
                .then(() => {
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
    if (this.user && this.user.role && this.user.role.some((role:  number) => (role === 12 || role ===11 || role ===17 || role===14 || role ===13))) {
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
    // else if (this.user && this.user.role && this.user.role.some((role:  number ) => (role === 12 ))){
    //   if (!isNaN(id)) {

    //     this.isLoading=true;
    //     this.employeeService.updaterbstatus(id, 'Return', this.remark ?? '').subscribe(
    //         () => {
    //           this.isLoading = false;
    //           Swal.fire({
    //             icon: 'success',
    //             title: 'Success',
    //             text: 'Returned successfully',
    //           }).then(() => {
    //             // Redirect to the dashboard route
    //             this.router.navigate(['regpanel']);
    //           });
    //         },
    //         (error) => {
    //           this.isLoading = false;
    //           console.log(error);
    //           console.log(error.status);
    //           console.log(error.error);

    //           if (error.status === 302) {
    //             Swal.fire({
    //               icon: 'warning',
    //               title: 'Warning',
    //               text: 'You are not authorized !!!',
    //             });
    //           } else {
    //             // Handle other errors here
    //             let errorMessage = 'An error occurred while Returning application.';
    //             if (error.error && error.error.message) {
    //               errorMessage = error.error.message;
    //             }
    //           Swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text: errorMessage,
    //           });
    //           }
    //         }
    //     );
    //   } else {
    //     console.error('ID parameter is missing or invalid in the URL.');
    //     Swal.fire({
    //       icon: 'warning',
    //       title: 'Warning',
    //       text: 'id missing !!!',
    //     });
    //     return;
      // }
    // }
  }

  async onFileSelected(event: Event, property: string): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      const file: File = inputElement.files[0];
      // Check if the file type is JPEG or JPG
      if (file.type === 'application/pdf') {
        // Check if the file size is less than or equal to 200KB
        if (file.size <= 1048576) { // 200KB in bytes
          try {
            const base64String: string = await fileToBase64(file); // Convert the file to base64

            if (property === 'id_proof') {
                // @ts-ignore
                this.employee!.id_proof_64 = true;
                this.employee!.id_proof = base64String;
            }

            if (property === 'postingOrder') {
                // @ts-ignore
                this.employee!.postingOrder_64 = true;
                this.employee!.postingOrder = base64String;
            }
            if (this.file_path_64) {
              if (property === 'file_path') {
                this.file_path_64 = base64String;
              }
            }
          }
          catch (error) {
            console.error('Failed to convert the file to base64:', error);
          }
        } else {

          Swal.fire({
            icon: 'error',
            title: 'Invalid File',
            text: 'File size exceeds 200KB.',
          });
          console.log('File size exceeds 1mb.');
        }
      } else {

        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Invalid file type. Only pdf files are allowed.',
        });
        console.log('Invalid file type. Only pdf files are allowed.');
      }

    } else {
      console.log('No file selected.');
    }
  }

  async onProfilePhotoSelected(event: Event, property: string): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      const file: File = inputElement.files[0];
      // Check if the file type is JPEG or JPG
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        // Check if the file size is less than or equal to 200KB
        if (file.size <= 200 * 1024) { // 200KB in bytes
          try {
            const base64String: string = await fileToBase64(file); // Convert the file to base64
            if (property === 'profile_photo' || 'sign_path') {

                if (property === 'sign_path') {
                  // @ts-ignore
                  this.employee!.sign_path_64 = true;
                  this.employee!.sign_path = base64String;
                } else if (property === 'profile_photo') {
                  // @ts-ignore
                  this.employee!.profile_photo_64 = true;
                  this.employee!.profile_photo = base64String;
                }
            }
          }
          catch (error) {
            console.error('Failed to convert the file to base64:', error);
          }
        }
      }

    } else {
      console.log('No file selected.');
    }
  }



  openPdfInNewTab(pdfData: string): void {
    const pdfWindow = window.open();
    // @ts-ignore
    pdfWindow.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
  }


  displayCard: any = 'none';
  preview() {
    this.displayCard = "block";
    
  }
  closepreview() {
    this.displayCard = "none";
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
