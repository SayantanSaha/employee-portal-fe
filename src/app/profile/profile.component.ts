import {Component, OnInit} from '@angular/core';
import {User} from "../model/User";
import {Employee} from "../model/Employee";
import {EmployeeService} from "../employee.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  constructor(
    private employeeService: EmployeeService
  ) {
  }
  employee:Employee| null = null;

  ngOnInit() {
    this.employeeService.getMyProfile()
      .subscribe(data=>{this.employee=data;console.log(this.employee)})

  }

}
