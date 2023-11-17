import {Component, OnInit} from '@angular/core';
import { DatePipe } from '@angular/common';
import {EmployeeService} from "../employee.service";
import {User} from "../model/User";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {Employee} from "../model/Employee";

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss'],
  providers: [DatePipe]
})
export class AdminpanelComponent implements OnInit{
  todayListCount: number = 0; // Provide an initializer here
  dashboardData: any;
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



    let userString:string|null = sessionStorage.getItem('user')!=null?sessionStorage.getItem('user'):'[]';
    this.user = JSON.parse(userString!);


  }


  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd/MM/YYYY') || 'N/A';
  }

}
