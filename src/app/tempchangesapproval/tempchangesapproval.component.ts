import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from "../employee.service";

import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-tempchangesapproval',
  templateUrl: './tempchangesapproval.component.html',
  styleUrls: ['./tempchangesapproval.component.scss'],
  providers: [DatePipe] // Add DatePipe to the providers array
})
export class TempchangesapprovalComponent implements OnInit{

  specificDetails: any;
  basicDetails : any={};
  changedDataDetails: any;
  apiUrl = environment.apiUrl;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private datePipe: DatePipe, // Inject the DatePipe here
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id']; // Extract id from route parameters
      if (!isNaN(id)) {
        this.employeeService.getSingleTempData(id).subscribe(data => {
          this.specificDetails = data; // Populate the specificdetails array with the retrieved data

          if (this.specificDetails.old_table_data) {
            this.basicDetails.old_table_data = this.specificDetails.old_table_data;
          }

          // Parse the JSON property if it exists
          if (this.specificDetails.changed_data) {
            this.basicDetails.changed_data = this.specificDetails.changed_data;
          }

          this.changedDataDetails=this.specificDetails.changed_data;

          // console.log(this.basicDetails.old_table_data);
        });

      }
    });
  }


  appproveEmpChangesDetails() {
    if (this.specificDetails) {
      // Send a POST request to the API with the data
      this.employeeService.approveTempData(this.specificDetails.id).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Data has been approved successfully.'
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirect to the desired page
              this.router.navigate(['/approval-pending-emp-dtls']);
            }
          });
        },
        error => {
          console.error('API Error:', error);
        }
      );
    }
  }



  rejectEmpChangesDetails(){

    if (this.specificDetails) {

      // Send a POST request to the API with the data
      this.employeeService.rejectTempData(this.specificDetails.model, this.specificDetails.id).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Data has been rejected successfully.'
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirect to the desired page
              this.router.navigate(['/approval-pending-emp-dtls']);
            }
          });
        },
        error => {
          console.error('API Error:', error);
        }
      );
      // this.employeeService.rejectTempData(this.specificDetails.model, this.specificDetails.id).subscribe(
      //   response => {
      //     this.router.navigate(['/temp-changes-dtls']);
      //   },
      //   error => {
      //     console.error('API Error:', error);
      //   }
      // );
    }
  }



  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd MMM YYYY') || 'N/A';
  }


}
