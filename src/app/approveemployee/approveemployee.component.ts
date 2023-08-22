import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {EmployeeService} from "../employee.service";

import {Router} from "@angular/router";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-approveemployee',
  templateUrl: './approveemployee.component.html',
  styleUrls: ['./approveemployee.component.scss'],
  providers: [DatePipe] // Add DatePipe to the providers array
})
export class ApproveemployeeComponent {

  specificDetails: any;
  basicDetails : any={};
  changedDataDetails: any;
  

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
          
          // Parse the JSON property if it exists

          // if (this.specificDetails.employee) {
          //   this.basicDetails.employee = JSON.parse(this.specificDetails.employee);
          // }

          if (this.specificDetails.old_table_data) {
            this.basicDetails.old_table_data = JSON.parse(this.specificDetails.old_table_data);
          }

          // Parse the JSON property if it exists
          if (this.specificDetails.changed_data) {
            this.basicDetails.changed_data = JSON.parse(this.specificDetails.changed_data);
          }

          this.changedDataDetails=JSON.parse(this.specificDetails.changed_data);

          console.log(this.changedDataDetails);
        });

      }
    });
  }


  appproveEmpChangesDetails() {
    if (this.specificDetails) {
      // Send a POST request to the API with the data
      this.employeeService.approveTempData(this.specificDetails.id).subscribe(
        response => {
          this.router.navigate(['/temp-changes-dtls']);
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
          this.router.navigate(['/temp-changes-dtls']);
        },
        error => {
          console.error('API Error:', error);
        }
      );
    }
  }



  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd MMM YYYY') || 'N/A';
  }

}
