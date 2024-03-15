import { Component,OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../model/Employee';
import { Router } from '@angular/router';
import {Designation} from "../model/Designation";
import {Division} from "../model/Division";
import {Idcards} from "../model/Idcards";
import Swal from "sweetalert2";
import {environment} from "../../environments/environment";



@Component({
  selector: 'app-ebaformview',
  templateUrl: './ebaformview.component.html',
  styleUrls: ['./ebaformview.component.scss']
})
export class EbaformviewComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  employee: any;
  apiUrl = environment.apiUrl;
  fromUrl: string='';
  submit: string='';
  id: any;
  status:string='';
  reg_no:string='';
  isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading=true;
    // Retrieve data from router state
    this.employee = history.state.employeeData;
    console.log(this.employee);
    this.fromUrl=history.state.fromUrl;
    console.log(this.fromUrl);
    this.submit=history.state.submit;
    console.log(this.submit);
    this.id=history.state.id;
    console.log(this.id);
    this.status=history.state.status;
    console.log(this.status);
    this.reg_no=history.state.reg_no;
    console.log(this.reg_no);
    this.isLoading=false;
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

  openPdfInNewTab(pdfData: string): void {
    const pdfWindow = window.open();
    // @ts-ignore
    pdfWindow.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
  }

  applyEba() {
    if (this.employee) {
      if (this.employee.designations === null || this.employee.designations.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty Designation',
          text: 'Designation does not have a value.',
        });
        return;
      }

      if (this.employee.divisions === null || this.employee.divisions.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty Department',
          text: 'Department does not have a value.',
        });
        return;
      }

      if (this.employee.organization === null) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty organization',
          text: 'Organization does not have a value.',
        });
        return;
      }

      if (this.employee.qtr_code === null) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty Quarter',
          text: 'Quarter does not have a value. First pull your data from profile',
        });
        return;
      }

      if (this.employee.closefamily && this.employee.closefamily.length > 0) {
        this.employeeService.applyclosefamily(this.employee).subscribe(
          // this.employeeService.applyeba(Employee).subscribe(
          // if (this.validationErrors.length > 0) {
          //
          //   const errorMessage = this.validationErrors
          //       .map((error, index) => `${index + 1}. ${error}`)
          //       .join('\n');
          //
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Error',
          //     html: errorMessage.replace(/\n/g, '<br/>'),
          //     width: 'auto', // Adjust as needed
          //   });
          //   return; // Exit without calling the API
          // }

          // Validation true then Api call otherwise please check
          // data=>console.log(data),
          // error=>console.log(error)


          data => {
            console.log(data);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Eba application applied successfully and pending for approval',
              // }).then((result) => {
              //   if (result.isConfirmed) {
              //     // Redirect to the desired page
              //     window.location.reload();
              //   }
            }).then(() => {
              this.fromUrl = '';
              this.router.navigate(['dashboard']);
            });
          },
          (error) => {
            console.log(error);
            console.log(error.status);
            console.log(error.error);
            if (error) {
              // if(error.status === 302){
              //   Swal.fire({
              //     icon: 'warning',
              //     title: 'Warning',
              //     text: 'Previous Record is still pending !!!',
              //   });
              // }else if(error.status === 303){
              //   Swal.fire({
              //     icon: 'warning',
              //     title: 'Warning',
              //     text: 'you already have a approved application',
              //   });
              // }
              // else{
              Swal.fire({
                icon: 'error',
                title: 'API Error',
                text: 'An error occurred while updating.',
              });
            }
          }
        );
      } else {
        // Send the modified employee object to the server
        this.employeeService.applyeba(this.employee).subscribe(
          // this.employeeService.applyeba(Employee).subscribe(
          // if (this.validationErrors.length > 0) {
          //
          //   const errorMessage = this.validationErrors
          //       .map((error, index) => `${index + 1}. ${error}`)
          //       .join('\n');
          //
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Error',
          //     html: errorMessage.replace(/\n/g, '<br/>'),
          //     width: 'auto', // Adjust as needed
          //   });
          //   return; // Exit without calling the API
          // }

          // Validation true then Api call otherwise please check
          // data=>console.log(data),
          // error=>console.log(error)


          data => {
            console.log(data);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Eba application applied successfully and pending for approval',
              // }).then((result) => {
              //   if (result.isConfirmed) {
              //     // Redirect to the desired page
              //     window.location.reload();
              //   }
            }).then(() => {
              this.fromUrl = '';
              this.router.navigate(['dashboard']);
            });
          },
          (error) => {
            console.log(error);
            console.log(error.status);
            console.log(error.error);
            if (error) {
              // if(error.status === 302){
              //   Swal.fire({
              //     icon: 'warning',
              //     title: 'Warning',
              //     text: 'Previous Record is still pending !!!',
              //   });
              // }else if(error.status === 303){
              //   Swal.fire({
              //     icon: 'warning',
              //     title: 'Warning',
              //     text: 'you already have a approved application',
              //   });
              // }
              // else{
              Swal.fire({
                icon: 'error',
                title: 'API Error',
                text: 'An error occurred while updating.',
              });
            }
          }
        );
      }
    }
  }


  updateEba(){
    if (this.employee) {
      if (this.employee.designations === null || this.employee.designations.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty Designation',
          text: 'Designation does not have a value.',
        });
        return;
      }

      if (this.employee.divisions === null || this.employee.divisions.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty Department',
          text: 'Department does not have a value.',
        });
        return;
      }

      if (this.employee.organization === null) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty organization',
          text: 'Organization does not have a value.',
        });
        return;
      }

      if (this.employee.qtr_code === null) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty Quarter',
          text: 'Quarter does not have a value. First pull your data from profile',
        });
        return;
      }
      this.employeeService.updateeba(this.employee, this.id).subscribe(
          data => {
            console.log(data);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Eba application applied successfully and pending for approval',
              // }).then((result) => {
              //   if (result.isConfirmed) {
              //     // Redirect to the desired page
              //     window.location.reload();
              //   }
            }).then(() => {
              this.fromUrl = '';
              this.router.navigate(['dashboard']);
            });
          },
          (error) => {
            console.log(error);
            console.log(error.status);
            console.log(error.error);
            if (error) {
              // if(error.status === 302){
              //   Swal.fire({
              //     icon: 'warning',
              //     title: 'Warning',
              //     text: 'Previous Record is still pending !!!',
              //   });
              // }else if(error.status === 303){
              //   Swal.fire({
              //     icon: 'warning',
              //     title: 'Warning',
              //     text: 'you already have a approved application',
              //   });
              // }
              // else{
              Swal.fire({
                icon: 'error',
                title: 'API Error',
                text: 'An error occurred while updating.',
              });
            }
          }
      );

    }
  }
}
