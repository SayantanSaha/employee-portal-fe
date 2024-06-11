import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import {EmployeeService} from "../employee.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rbapppending',
  // standalone: true,
  // imports: [],
  templateUrl: './rbapppending.component.html',
  styleUrl: './rbapppending.component.scss',
  providers: [DatePipe]
})
export class RbapppendingComponent {
  rbPendingList: any;
  roleId: any;
  from:any;
rbapplication: any;
  constructor(
    private employeeService: EmployeeService,
    private datePipe: DatePipe,
    private route: ActivatedRoute, private router: Router
  ) { }

  ngOnInit(): void {
    this.rbPendingList = history.state.employeeData;
    console.log(this.rbPendingList);
    this.roleId = history.state.roleId;
    console.log(this.roleId);
    this.from = history.state.from;
    console.log(this.from);
    // const state = this.router.getCurrentNavigation()?.extras.state;
    // if (state && state['rbPendingList']) {
    //   this.rbPendingList = state['rbPendingList'];
    //   console.log('rb Pending List:', this.rbPendingList);
    // } else {
    //   // Handle the case where rbPendingList is not available
    //   console.error('rb Pending List not found in route state');
    // }
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
