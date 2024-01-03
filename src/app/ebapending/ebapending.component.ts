import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import {EmployeeService} from "../employee.service";


@Component({
  selector: 'app-ebapending',
  templateUrl: './ebapending.component.html',
  styleUrls: ['./ebapending.component.scss'],
  providers: [DatePipe]
})
export class EbapendingComponent {
  ebaPendingList: any;

  constructor(
    private employeeService: EmployeeService,
    private datePipe: DatePipe, // Inject the DatePipe here
  ) { }

  ngOnInit(): void {
    this.employeeService.getebaData().subscribe(data => {
      this.ebaPendingList = data
    });
  }
  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd/MM/YYYY') || 'N/A';
  }
  hoverClick(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    if (button) {
      button.classList.add('clicked');

      // Remove the class after a short delay to allow the shadow to disappear
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 200); // Adjust the delay (in milliseconds) based on your transition duration
    }
  }
}
