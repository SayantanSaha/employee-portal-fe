import {Component, OnInit} from '@angular/core';
import { DatePipe } from '@angular/common';
import {EmployeeService} from "../employee.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe] // Add DatePipe to the providers array
})
export class DashboardComponent implements OnInit{

  dashboardData: any;
  empTempDetails : any={};

  constructor(
    private employeeService: EmployeeService,
    private datePipe: DatePipe, // Inject the DatePipe here
  ) { }


  ngOnInit() {
    this.employeeService.getDashboardData().subscribe(data => {
      this.dashboardData = data

      //console.log(this.dashboardData.todayList[0].employee);

      // Assign the employee object to empTempDetails
      // Iterate through the todayList and push employee details to the array
      // if (this.dashboardData.todayList) {
      //   this.empTempDetails = this.dashboardData.todayList.map((item: any) => item.employee);
      // }

      // console.log(this.empTempDetails);

    });
  }


  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd/MM/YYYY') || 'N/A';
  }

}
