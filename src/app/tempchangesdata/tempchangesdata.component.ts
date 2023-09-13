import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import {EmployeeService} from "../employee.service";



@Component({
  selector: 'app-tempchangesdata',
  templateUrl: './tempchangesdata.component.html',
  styleUrls: ['./tempchangesdata.component.scss'],
  providers: [DatePipe] // Add DatePipe to the providers array
})
export class TempchangesdataComponent {

  tempchangesList: any;

  constructor(
    private employeeService: EmployeeService,
    private datePipe: DatePipe, // Inject the DatePipe here
  ) { }

  ngOnInit(): void {
    this.employeeService.getTempChangedData().subscribe(data => {
      this.tempchangesList = data
    });
  }


  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd/MM/YYYY') || 'N/A';
  }

}
