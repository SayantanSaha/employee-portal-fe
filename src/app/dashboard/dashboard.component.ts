import {Component, OnInit} from '@angular/core';
import { DatePipe } from '@angular/common';
import {EmployeeService} from "../employee.service";
import {User} from "../model/User";
import {Employee} from "../model/Employee";

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

}
