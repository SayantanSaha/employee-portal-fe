import {Component, OnInit} from '@angular/core';
import { DatePipe } from '@angular/common';
import {EmployeeService} from "../employee.service";
import {User} from "../model/User";
import {Employee} from "../model/Employee";
import Swal from "sweetalert2";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe] // Add DatePipe to the providers array
})
export class DashboardComponent implements OnInit{

  todayListCount: number = 0; // Provide an initializer here
  dashboardData: any;
  ebadashboardData: any;
  empTempDetails : any={};
  user:User = new User();
  employee: Employee | null = null;


  constructor(
      private router: Router,
      private http: HttpClient,
    private employeeService: EmployeeService,
    private datePipe: DatePipe, // Inject the DatePipe here
  ) {}


  ngOnInit() {
    this.employeeService.getDashboardData().subscribe(data => {
      this.dashboardData = data
    });



    this.employeeService.getEbaDashboardData().subscribe(
      (data: any) => {
        console.log(data);
        this.ebadashboardData = data;
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );


    let userString:string|null = sessionStorage.getItem('user')!=null?sessionStorage.getItem('user'):'[]';
    this.user = JSON.parse(userString!);



    this.employeeService.getMyProfile().subscribe(
      (data: Employee) => {
        this.employee = data;
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );
  }


  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd/MM/YYYY') || 'N/A';
  }

  navigateToAdmin() {
    // Navigate to the admin route
    this.router.navigate(['/adminpanel']); // Adjust the route as needed
  }

  navigateToEba() {
    // Navigate to the eba route
    this.router.navigate(['/ebapanel']); // Adjust the route as needed
  }



  applyEvahaan() {
    this.employeeService.applyEvahaan().subscribe(


        (data) => {
          console.log(data);

          // @ts-ignore
          const Data = JSON.parse(data);
          //console.log(Data.RedirectURL)
          window.open(Data.RedirectURL, '_blank');
          // Swal.fire({
          //   icon: 'success',
          //   title: 'Success',
          //   text: 'Eba application applied successfully and pending for approval',
          //   // }).then((result) => {
          //   //   if (result.isConfirmed) {
          //   //     // Redirect to the desired page
          //   //     window.location.reload();
          //   //   }
          // });
        },
        (error) => {
          console.log(error);
          console.log(error.status);
          console.log(error.error);
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
          // }else{
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'API Error',
          //     text: 'An error occurred while updating.',
          //   });
          // }


        }

    );

  }

}
