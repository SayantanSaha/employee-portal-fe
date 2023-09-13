import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {EmployeeService} from "../employee.service";

@Component({
  selector: 'app-approveemployeelist',
  templateUrl: './approveemployeelist.component.html',
  styleUrls: ['./approveemployeelist.component.scss'],
  providers: [DatePipe] // Add DatePipe to the providers array
})
export class ApproveemployeelistComponent implements OnInit{

  dashboardData: any;

  constructor(
    private employeeService: EmployeeService,
    private datePipe: DatePipe, // Inject the DatePipe here
  ) { }

  ngOnInit() {
    this.employeeService.getDashboardData().subscribe(data => {
      this.dashboardData = data
    });
  }


  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd/MM/YYYY') || 'N/A';
  }


}
