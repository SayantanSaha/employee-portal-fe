import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../model/Employee';
import { Router } from '@angular/router';

import Swal from "sweetalert2";
import {User} from "../model/User";

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
  user:User = new User();
  ngOnInit() {

    let userString:string|null = sessionStorage.getItem('user')!=null?sessionStorage.getItem('user'):'[]';
    this.user = JSON.parse(userString!);



    this.route.params.subscribe(params => {
      // Extract id from route parameters
      const id = +params['id'];

      // Check if 'id' parameter exists in the URL
      if (params.hasOwnProperty('id')) {
        this.employeeService.getEbaProfile(id).subscribe(
            data => {
              this.employee = data;
            }
        );
      }
    });
  }

  approveapplication() {

    // if (this.user && this.user.role) {
    //   for (const role of this.user.role) {
    //     if (role.role_id === 4) {
    //
    //       if (this.employee) {
    //         console.log(this)
    //
    //         const clonedEmployee = { ...this.employee };
    //
    //         // Filter out only the selected relations
    //         if (clonedEmployee.relations) {
    //           clonedEmployee.relations = clonedEmployee.relations.filter(member => member.allSelected);
    //         }
    //
    //         if (clonedEmployee.vehicles) {
    //           clonedEmployee.vehicles = clonedEmployee.vehicles.filter(vehicle => vehicle.allSelected);
    //         }
    //
    //         if (clonedEmployee.servants) {
    //           clonedEmployee.servants = clonedEmployee.servants.filter(servant => servant.allSelected);
    //         }
    //
    //         // Your existing code
    //         if (clonedEmployee.servants) {
    //           clonedEmployee.servants.forEach(servant => {
    //             if (servant.relations) {
    //               servant.relations = servant.relations.filter(relation => relation.allSelected);
    //             }
    //           });
    //         }
    //
    //         // if (this.employee.emp_name != 'ok'
    //         // ) {
    //         //   Swal.fire({
    //         //     icon: 'warning',
    //         //     title: 'Empty application',
    //         //     text: 'At least add one Relative or domestic help',
    //         //   });
    //         //   return;
    //         // }
    //
    //         // Send the modified employee object to the server
    //         this.employeeService.applyeba(clonedEmployee).subscribe();
    //       }
    //
    //
    //   }
    // }}
    // Extract id from route parameters
    const id = +this.route.snapshot.params['id'];

    // Check if 'id' parameter exists in the URL
    if (!isNaN(id)) {
      this.employeeService.updateebastatus(id, 'Approve', this.remark).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Approved successfully',
          }).then(() => {
            // Redirect to the dashboard route
            this.router.navigate(['ebapanel']);
          });
        },
        (error) => {
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
            // Handle other errors here
            console.error('An error occurred:', error);
          }
        }
      );
    } else {
      console.error('ID parameter is missing or invalid in the URL.');
    }
  }



  returnapplication() {
    // Extract id from route parameters
    const id = +this.route.snapshot.params['id'];

    // Check if 'id' parameter exists in the URL
    if (!isNaN(id)) {
      this.employeeService.updateebastatus(id, 'Return', this.remark).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Returned successfully',
          }).then(() => {
            // Redirect to the dashboard route
            this.router.navigate(['ebapanel']);
          });
        },
        (error) => {
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
            console.error('An error occurred:', error);
          }
        }
      );
    } else {
      console.error('ID parameter is missing or invalid in the URL.');
    }
  }

}
