import {Component, OnInit} from '@angular/core';
import { DatePipe } from '@angular/common';
import {EmployeeService} from "../employee.service";
import {Employee} from "../model/Employee";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {User} from "../model/User";
import {Search} from "../model/Search";


@Component({
  selector: 'app-ebapanel',
  templateUrl: './ebapanel.component.html',
  styleUrls: ['./ebapanel.component.scss'],
  providers: [DatePipe]
})
export class EbapanelComponent implements OnInit{

  todayListCount: number = 0; // Provide an initializer here
  ebadashboardData: any;
  empTempDetails : any={};
  employee: Employee | null = null;
  search: Search = new Search();
  user:User = new User();
  searchbox: any = 'none';


  constructor(
      private router: Router,
      private http: HttpClient,
      private employeeService: EmployeeService,
      private datePipe: DatePipe, // Inject the DatePipe here
  ) {}


  ngOnInit() {
    let userString:string|null = sessionStorage.getItem('user')!=null?sessionStorage.getItem('user'):'[]';
    this.user = JSON.parse(userString!);



    this.employeeService.getEbaDashboardData().subscribe(
        (data: any) => {
          console.log(data);
          this.ebadashboardData = data;
        },
        error => {
          console.error('Error fetching data:', error);
        }
    );



    this.employeeService.getMyProfile().subscribe(
        (data: Employee) => {
          this.employee = data;
        },
        (error) => {
          console.error('Error fetching employee data:', error);
        }
    );
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


  opensearch() {
    this.searchbox = "block";
  }
  closesearch() {
    this.searchbox = "none";
  }

  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd/MM/YYYY') || 'N/A';
  }

  searchEba(i: number) {
    // @ts-ignore
    this.search.role = i;
    if (this.search) {
      this.employeeService.searchEba(this.search).subscribe(
        (data) => {
          console.log('Search successful:', data);
          this.router.navigate(['eba-pending'], { state: {  employeeData: data, roleId:this.search.role , from:'serachEba' } });
        },
        (error) => {
          console.error('Search error:', error);
        },
        () => {
          console.log('Search completed');
        }
      );
    }
  }

  Search() {
    // @ts-ignore
    if (this.search) {
      this.employeeService.searchEba(this.search).subscribe(
        (data) => {
          console.log('Search successful:', data);
          this.router.navigate(['eba-pending'], { state: {  employeeData: data , from:'serach' } });
        },
        (error) => {
          console.error('Search error:', error);
        },
        () => {
          console.log('Search completed');
        }
      );
    }
  }

  ebapasses(){
    this.employeeService.ebapasses().subscribe(
      (data) => {
        console.log('Search successful:', data);
        this.router.navigate(['eba-print'], { state: {  employeeData: data, fromfunction:'totalpass'} });
      },
      (error) => {
        console.error('Search error:', error);
      },
      () => {
        console.log('Search completed');
      }
    );
  }

}