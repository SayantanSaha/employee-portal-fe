import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EmployeeService } from "../employee.service";
import { Employee } from "../model/Employee";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from "../model/User";
import { Search } from "../model/Search";
import Swal from "sweetalert2";

@Component({
  selector: 'app-registration-panel',
  // standalone: true,
  // imports: [],
  templateUrl: './registration-panel.component.html',
  styleUrl: './registration-panel.component.scss',
  providers: [DatePipe]
})

export class RegistrationPanelComponent implements OnInit {
  todayListCount: number = 0; // Provide an initializer here
  rbdashboardData: any;
  empTempDetails: any = {};
  employee: Employee | null = null;
  search: Search = new Search();
  user: User = new User();
  searchbox: any = 'none';
  passbox: any = 'none';
  rbShow = false;
  formShow=false;
  DcpOffice=false;
  report: any = {
    card_type_id: '',
    active: 1,
    rfid: null,
    emp_name: '',
    organization_id: '',
    designation_id: '',
    division_id: '',
    card_no: '',
    valid_from: '',
    valid_to: '',
    mobile:''
  };

  divisiontypelist: any[] = [];
  designations: any[] = [];
  org_list: any[] = [];
  CardTitle: any = 'none';

  // roleFallbacks: { [key: number]: string } = {
  //   11: 'DH',
  //   12: 'SO',
  //   17: 'US',
  //   13: 'DH_DCP',
  //   14: 'DCP'
  // };


  constructor(
    private router: Router,
    private http: HttpClient,
    private employeeService: EmployeeService,
    private datePipe: DatePipe, // Inject the DatePipe here
  ) { }

  ngOnInit() {
    let userString: string | null = sessionStorage.getItem('user') != null ? sessionStorage.getItem('user') : '[]';
    this.user = JSON.parse(userString!);



    this.employeeService.getRegDashboardData().subscribe(
      (data: any) => {
        console.log(data);
        this.rbdashboardData = data;
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );

    this.employeeService.getRbCardTitle().subscribe(
      (data: any) => {
        console.log(data);
        this.CardTitle = data;
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );


    this.employeeService.getDesignations(1).subscribe(
      data => this.designations = data,
      error => console.log(error)
    );

    this.employeeService.getDivisionMasterList().subscribe(
      data => this.divisiontypelist = data,
      error => console.log(error)
    );

    this.employeeService.getOrganizations().subscribe(
      data => this.org_list = data.filter(org => org.org_type !== 'Emp'),
      error => console.log(error)
    );


    this.employeeService.getMyProfile().subscribe(
      (data: Employee) => {
        this.employee = data;
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );

    if ([11, 12, 13, 14, 17, 2].some(role => this.user.role.includes(role))) {
      this.rbShow = true;
    }

    if ([12,17, 13, 14,  2].some(role => this.user.role.includes(role))) {
      this.formShow = true;
    }

    if ([ 13,14, 2].some(role => this.user.role.includes(role))) {
      this.DcpOffice = true;
    }
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
  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd/MM/YYYY') || 'N/A';
  }

  // getCardTitle(roleId: number): string {
  //   if (this.user?.role?.includes(roleId) && this.user?.desg_name && this.user.desg_name.trim() !== '') {
  //     return this.user.desg_name;
  //   } else {
  //     return this.roleFallbacks[roleId] || 'Unknown';
  //   }
  // }



  searchRb(i: number) {
    // @ts-ignore
    this.search.role = i;
    if (this.search) {
      this.employeeService.searchrb(this.search).subscribe(
        (data) => {
          console.log('Search successful:', data);
          this.router.navigate(['rb-pending'], { state: { employeeData: data, roleId: this.search.role, from: 'serachrb' } });
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

  opensearch() {
    this.searchbox = "block";
  }
  closesearch() {
    this.searchbox = "none";
  }


  Search() {
    // @ts-ignore
    if (this.search) {
      this.employeeService.searchrb(this.search).subscribe(
        (data) => {
          console.log('Search successful:', data);
          this.router.navigate(['rb-pending'], { state: { employeeData: data, from: 'serach' } });
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



  openpass() {
    this.passbox = "block";
  }
  closepass() {
    this.passbox = "none";
  }


  rbpasses(value: string) {
    console.log('Report Payload:', this.report);
    this.employeeService.rbpasses(this.report).subscribe(
      (data) => {
        console.log('Search successful:', data);
        if (data.IDpasses && data.IDpasses.length > 0) {
          // Navigate to the 'rb-print' route with employee data
          if (value == 'Report') {
            this.router.navigate(['rb-print'], {
              state: { employeeData: data.IDpasses, fromfunction: 'totalpass',details:this.report}
            });
          }
          if (value == 'summary') {
            this.router.navigate(['rb-print'], {
              state: { count:data.count, fromfunction: 'summary'}
            });
          }
          if (value == 'edit') {
            this.router.navigate(['rb-print'], {
              state: { employeeData: data.IDpasses, fromfunction: 'edit' }
            });
          }
        } else {
          // Show SweetAlert2 notification for empty data
          Swal.fire({
            icon: 'warning',
            title: 'No Data Found',
            text: 'The search returned no results.',
            confirmButtonText: 'OK'
          });
        }
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
