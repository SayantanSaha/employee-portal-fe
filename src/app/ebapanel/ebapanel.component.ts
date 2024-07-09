import {Component, OnInit} from '@angular/core';
import { DatePipe } from '@angular/common';
import {EmployeeService} from "../employee.service";
import {Employee} from "../model/Employee";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {User} from "../model/User";
import {Search} from "../model/Search";
import Swal from 'sweetalert2';


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
  locationtypelist: any[] = [];
  blockstypelist: any[] = [];
  quarterList: any[] = [];
  quarterstypelist: any[] = [];
  showquarterDetails: boolean = false;
  quarterDetails: any = null;

  constructor(
      private router: Router,
      private http: HttpClient,
      private employeeService: EmployeeService,
      private datePipe: DatePipe, // Inject the DatePipe here
  ) {}


  ngOnInit() {
    let userString:string|null = sessionStorage.getItem('user')!=null?sessionStorage.getItem('user'):'[]';
    this.user = JSON.parse(userString!);

    this.employeeService.getLocationType().subscribe(
      data => this.locationtypelist = data,
      error => console.log(error)
    );

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


  displayEba: any = 'none';
  pullEbaPopup() {
    this.displayEba = "block";
  }
  closeEbaPopup() {
    this.showquarterDetails = false;
    this.displayEba = "none";
  }

  qtrtype() {
    this.blockstypelist=[];
    this.quarterList = [];
    this.employee!.qtr=null;
    this.employeeService.getQuarterType(this.employee!.location_id!).subscribe(
      data => this.quarterstypelist = data,
      error => console.log(error)
    );
  }
  qtraddress(event: Event) {
    this.blockstypelist=[];
    this.quarterList = [];
    this.employee!.qtr=null;
    const selectElement = event.target as HTMLSelectElement;
    const typeName = selectElement.options[selectElement.selectedIndex]?.text?.trim();

    if (typeName == "Type - I" || typeName == "Servant Qtr") {
      this.employeeService.getBlockType().subscribe(
        data => {
          this.employee!.blck='T';
          this.blockstypelist = data.filter(block => block.choice === 1);
        },
        error => console.log(error)
      );
    }

    else if (this.employee!.qtr_code! == '14' || this.employee!.qtr_code! == '11') {
      this.employeeService.getBlockType().subscribe(
        data => {
          this.employee!.blck='T';
          this.blockstypelist = data.filter(block => block.choice === 2);
        },
        error => console.log(error)
      );
    }

    else{
      this.blockstypelist=[];
      this.employee!.blck='T';
    this.employeeService.getQuarterdetail(this.employee!.qtr_code!, this.employee!.location_id!,this.employee!.blck).subscribe(
      (data: any) => {
        this.quarterList = data;
      },
      (error) => {
        console.log(error);
        if (error.status === 404) {
          this.quarterList = [];
          this.employee!.qtr = null;
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'empty quarter details .',
          });
        }
        if (error.status === 400) {
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Something went wrong.',
          });
        }
      }
    );
  }
  }
  qtrBlckaddress() {
    this.employee!.qtr=null;
    this.employeeService.getQuarterdetail(this.employee!.qtr_code!, this.employee!.location_id!,this.employee!.blck!).subscribe(
      (data: any) => {
        this.quarterList = data;
      },
      (error) => {
        console.log(error);
        if (error.status === 404) {
          this.quarterList = [];
          this.employee!.qtr = null;
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'empty quarter details .',
          });
        }
        if (error.status === 400) {
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Something went wrong.',
          });
        }
      }
    );
  }


  fetch(){
    this.employeeService.showmemberbyeba(this.employee!.qtr!.allotment_id).subscribe(
      (data: any) => {
        this.quarterDetails = data;
        this.showquarterDetails = true;
      }, (error) => {
        if (error.status === 404) {
          Swal.fire({
            icon: 'warning',
            title: 'empty',
            text: 'empty data!!!!',
          });
        }
      }
    );
  }

  PullEba() {
    this.employeeService.getEbaForm(this.quarterDetails!, this.employee!.qtr!).subscribe(
      (data: any) => {
        console.log(['/eba-form/edit/relative/'+ data]);
         this.router.navigate(['/eba-form/edit/relative/'+ data]);
      },
      (error) => {
        // Error response
        console.log(error); // Log the error if needed
        if (error.status === 401) {
          Swal.fire({
            icon: 'warning',
            title: 'warning',
            text: 'empty quarter details!!!!',
          });
        }
        if (error.status === 404) {
          Swal.fire({
            icon: 'warning',
            title: 'warning',
            text: 'empty quarter info!!!!',
          });
        }
        if (error.status === 400) {
          Swal.fire({
            icon: 'warning',
            title: 'warning',
            text: 'Not eligible!!!!',
          });
        }
      }
    );
  }
}
