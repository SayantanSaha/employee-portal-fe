import {Component, Inject} from '@angular/core';
import {User} from "../../model/User";
import {Employee} from "../../model/Employee";
import {EmployeeService} from "../../employee.service";
import {ActivatedRoute} from "@angular/router";
declare var jQuery: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent  {

  user:User = new User();
  employee: Employee | null = null;
  baseUrl: string = '';

  constructor( @Inject('BASE_URL') baseUrl: string,private employeeService: EmployeeService) {
    this.baseUrl = baseUrl;
  }

  ngOnInit() {
    let userString:string|null = sessionStorage.getItem('user')!=null?sessionStorage.getItem('user'):'[]';
    this.user = JSON.parse(userString!);



    this.employeeService.getMyProfile().subscribe(
      (data: Employee) => {
        this.employee = data;
        // Do something with the retrieved employee data
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );


  }

  expandContract() {
    /*const el = document.getElementById("menu")
    el.classList.toggle('expanded')
    el.classList.toggle('collapsed')*/
    jQuery("#menu").slideToggle("slow");
  }
}
