import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "../employee.service";
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";
import {Idcards} from "../model/Idcards";
import {User} from "../model/User";

@Component({
  selector: 'app-eba-form-list',
  templateUrl: './eba-form-list.component.html',
  styleUrls: ['./eba-form-list.component.scss']
})
export class EbaFormListComponent implements OnInit{
  applicationList: any[] = [];
  idapplicationList: any[] = [];
  user:User = new User();

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
  ) { }

  ngOnInit() {
    let userString:string|null = sessionStorage.getItem('user')!=null?sessionStorage.getItem('user'):'[]';
    this.user = JSON.parse(userString!);

    this.employeeService.ebaapplicationByApplicant().subscribe(data => {
      this.applicationList = data
    });

    this.employeeService.idapplicationByApplicant().subscribe(data => {
      this.idapplicationList = data
    });
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
  getform(i:number){
    const employeeDataString = this.applicationList[i].employee_details;
    const employeeData = JSON.parse(employeeDataString);
    if (employeeData) {
      this.router.navigate(['eba-form-view'], { state: { employeeData:employeeData , fromUrl: 'eba-form-list' ,status:this.getActiveRole(this.applicationList[i].roles),reg_no:this.applicationList[i].reg_no} });
    } else {
      console.error('Employee data is null or undefined.');
    }
  }

  getidform(i:number){
    const employeeDataString = this.idapplicationList[i].application;
    const employeeData = JSON.parse(employeeDataString);
    if (employeeData) {
      this.router.navigate(['id-form/applicant/view'], { state: { employeeData:employeeData , fromUrl: 'eba-form-list' ,status:this.getActiveRole(this.idapplicationList[i].roles),reg_no:this.idapplicationList[i].reg_no} });
    } else {
      console.error('Employee data is null or undefined.');
    }
  }

  getActiveIdCard(IdCards: Idcards[]): string {
    const activeIdCard = IdCards
      .filter(idCard => idCard.active)
      .map(idCard => idCard.card_no);

    return activeIdCard.join(', ');
  }

  getActiveRole(Role: any[]): string {
    const activeRole = Role
      .map(role => role.role_desc);
    return activeRole.join(', ');
  }

}
