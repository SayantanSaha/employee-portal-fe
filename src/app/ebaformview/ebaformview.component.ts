import { Component,OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../model/Employee';
import { Router } from '@angular/router';
import {Designation} from "../model/Designation";
import {Division} from "../model/Division";
import {Idcards} from "../model/Idcards";
import Swal from "sweetalert2";


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

  fromUrl: string='';


  ngOnInit(): void {
    // Retrieve data from router state
    this.employee = history.state.employeeData;
    console.log(this.employee);
    this.fromUrl=history.state.fromUrl;
    console.log(this.fromUrl);
  }

  getActiveDesignations(designations: Designation[]): string {
    const activeDesignations = designations
      .filter(designation => designation.pivot.active == true)
      .map(designation => designation.desg_desc);

    return activeDesignations.join(', ');
  }

  getActiveDivision(division: Division[]): string {
    const activeDivision = division
      .filter(division => division.pivot.active == true)
      .map(division => division.div_desc);

    return activeDivision.join(', ');
  }

  getActiveIdCard(IdCards: Idcards[]): string {
    const activeIdCard = IdCards
      .filter(idCard => idCard.active == true)
      .map(idCard => idCard.card_no);

    return activeIdCard.join(', ');
  }

  openImageInNewTab(i: number, j: number) {
    const encodedImage = encodeURIComponent(this.employee.relations[i].pivot.eba_passes[j].photo_path);
    const imageWindow = window.open();
    if (imageWindow) {
      imageWindow.document.write(`<img src="${encodedImage}" alt="Photo">`);
      imageWindow.document.close();
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
}
