import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../model/Employee';
import { Router } from '@angular/router';

import Swal from "sweetalert2";

@Component({
  selector: 'app-ebaapproval',
  templateUrl: './ebaapproval.component.html',
  styleUrls: ['./ebaapproval.component.scss']
})
export class EbaapprovalComponent {
  constructor(
      private employeeService: EmployeeService,
      private route: ActivatedRoute,
    private router: Router

) {}

  employee: Employee | null = null;
  remark: string = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      // Extract id from route parameters
      const id = +params['id'];

      // Check if 'id' parameter exists in the URL
      if (params.hasOwnProperty('id')) {
        this.employeeService.getEmpProfile(id).subscribe(
            data => {
              this.employee = data;
            }
        );
      }
    });
  }

  approveapplication() {
    // Extract id from route parameters
    const id = +this.route.snapshot.params['id'];

    // Check if 'id' parameter exists in the URL
    if (!isNaN(id)) {
      this.employeeService.updateebastatus(id, 'Approve', this.remark).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Approved successfully',
        }).then(() => {
          // Redirect to the dashboard route
          this.router.navigate(['ebapanel']);
        });
      });
    }else {
      console.error('ID parameter is missing or invalid in the URL.');
    }
  }

  returnapplication() {
    // Extract id from route parameters
    const id = +this.route.snapshot.params['id'];

    // Check if 'id' parameter exists in the URL
    if (!isNaN(id)) {
      this.employeeService.updateebastatus(id, 'Return', this.remark).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Returned successfully',
        }).then(() => {
          // Redirect to the dashboard route
          this.router.navigate(['ebapanel']);
        });
      });
    }else {
      console.error('ID parameter is missing or invalid in the URL.');
    }
  }
}
