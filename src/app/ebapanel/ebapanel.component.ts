import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EmployeeService } from "../employee.service";
import { Employee } from "../model/Employee";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from "../model/User";
import { Search } from "../model/Search";
import Swal from 'sweetalert2';
import { State } from "../model/State";
import { District } from "../model/District";
import { fileToBase64 } from "../profile/fileToBase64";

@Component({
  selector: 'app-ebapanel',
  templateUrl: './ebapanel.component.html',
  styleUrls: ['./ebapanel.component.scss'],
  providers: [DatePipe]
})
export class EbapanelComponent implements OnInit {

  todayListCount: number = 0; // Provide an initializer here
  ebadashboardData: any;
  empTempDetails: any = {};
  employee: Employee | null = null;
  search: Search = new Search();
  user: User = new User();
  searchbox: any = 'none';
  locationtypelist: any[] = [];
  blockstypelist: any[] = [];
  quarterList: any[] = [];
  quarterstypelist: any[] = [];
  showquarterDetails: boolean = false;
  quarterDetails: any = null;
  states: State[] = [];
  offices: any[] = [];
  designations: any[] = [];
  currDistricts: District[] = [];
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  displayEmpCard: any = 'none';
  showEmpCardDetails: boolean = false;
  EmpCardNo: string | null = null;
  maxDate: string = "";
  ebaShow = false;
  EmpCardData: any = {
    name_print: null,
    dob: null,
    mob_no: null,
    email: null,
    office_code: null,
    designation_code: null,
    curr_add: null,
    curr_state: null,
    curr_district: null,
    curr_pin: null,
    blood_group: null,
    id_mark: null,
    photo: null,
    sig: null,
  };
  constructor(
    private router: Router,
    private http: HttpClient,
    private employeeService: EmployeeService,
    private datePipe: DatePipe, // Inject the DatePipe here
  ) { }


  ngOnInit() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18); // Subtract 18 years from today

    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Zero-padded month
    const day = today.getDate().toString().padStart(2, '0'); // Zero-padded day

    this.maxDate = `${year}-${month}-${day}`;

    let userString: string | null = sessionStorage.getItem('user') != null ? sessionStorage.getItem('user') : '[]';
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

    this.employeeService.getStates().subscribe(
      data => this.states = data,
      error => console.error(error)
    );

    this.employeeService.getMyProfile().subscribe(
      (data: Employee) => {
        this.employee = data;
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );

    this.employeeService.getOrganizations().subscribe(
      data => {
        this.offices = data.filter(org => org.org_type === 'Emp');
        this.findDesg(); // Call findDesg() after offices are populated
      },
      error => console.log(error)
    );

    if ([4, 5, 6, 9, 10, 2].some(role => this.user.role.includes(role))) {
      this.ebaShow = true;
    }

  }

  onInput(event: any, property: string) {
    const input = event.target.value;
    // Remove non-numeric characters using regular expression
    const numericInput = input.replace(/\D/g, '');
    // Update the input value with the filtered numeric input
    event.target.value = numericInput;
    // Update the ngModel binding
    if (property == 'curr_pin')
      this.employee!.curr_pin = numericInput;
    if (property == 'mobile')
      this.employee!.mobile = numericInput;

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
          this.router.navigate(['eba-pending'], { state: { employeeData: data, roleId: this.search.role, from: 'serachEba' } });
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
          this.router.navigate(['eba-pending'], { state: { employeeData: data, from: 'serach' } });
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

  ebapasses() {
    this.employeeService.ebapasses().subscribe(
      (data) => {
        console.log('Search successful:', data);
        this.router.navigate(['eba-print'], { state: { employeeData: data, fromfunction: 'totalpass' } });
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
    this.blockstypelist = [];
    this.quarterList = [];
    this.employee!.qtr = null;
    this.employeeService.getQuarterType(this.employee!.location_id!).subscribe(
      data => this.quarterstypelist = data,
      error => console.log(error)
    );
  }
  qtraddress(event: Event) {
    this.blockstypelist = [];
    this.quarterList = [];
    this.employee!.qtr = null;
    const selectElement = event.target as HTMLSelectElement;
    const typeName = selectElement.options[selectElement.selectedIndex]?.text?.trim();

    if (typeName == "Type - I" || typeName == "Servant Qtr") {
      this.employeeService.getBlockType().subscribe(
        data => {
          this.employee!.blck = 'T';
          this.blockstypelist = data.filter(block => block.choice === 1);
        },
        error => console.log(error)
      );
    }

    else if (this.employee!.qtr_code! == '14' || this.employee!.qtr_code! == '11') {
      this.employeeService.getBlockType().subscribe(
        data => {
          this.employee!.blck = 'T';
          this.blockstypelist = data.filter(block => block.choice === 2);
        },
        error => console.log(error)
      );
    }

    else {
      this.blockstypelist = [];
      this.employee!.blck = 'T';
      this.employeeService.getQuarterdetail(this.employee!.qtr_code!, this.employee!.location_id!, this.employee!.blck).subscribe(
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
    this.employee!.qtr = null;
    this.employeeService.getQuarterdetail(this.employee!.qtr_code!, this.employee!.location_id!, this.employee!.blck!).subscribe(
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


  fetch() {
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
        console.log(['/eba-form/edit/relative/' + data]);
        this.router.navigate(['/eba-form/edit/relative/' + data]);
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



  // pullEmpPopup(property: string, i: any, j: any) {
  pullEmpPopup() {
    this.displayEmpCard = "block";
  }
  closeEmpPopup() {
    this.showEmpCardDetails = false;
    this.EmpCardData = this.resetEmpCardData();
    this.displayEmpCard = "none";
    this.NewEmpCardForm = false;
  }


  onStateChange(state: number) {
    this.getDistricts(state).then(districts => this.currDistricts = districts);
  }

  async getDistricts(state: number) {
    let districts: District[] = [];
    if (state != null) {
      districts = await this.employeeService.getDistrictsByState(state);
    }
    return districts;
  }

  SubmitForm() {
    this.employeeService.submitEmpCard(this.EmpCardData).subscribe(
      (data: any) => {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'submitted successfully',
        }).then(() => {
            // Refresh the page after the success message is closed
            window.location.reload();
        });
    },

      (error) => {
        // Error response
        console.log(error); // Log the error if needed
        if (error.status === 404) {
          Swal.fire({
            icon: 'warning',
            title: 'warning',
            text: 'empty details!!!!',
          });
        }
        if (error.status === 401) {
          Swal.fire({
            icon: 'warning',
            title: 'warning',
            text: 'Some thing went wrong!!!!',
          });
        }
        if (error.status === 405) {
          Swal.fire({
            icon: 'warning',
            title: 'warning',
            text: 'Not allowed!!!!',
          });
        }
      }
    );
  }

  EmpCardDetail() {
    this.NewEmpCardForm = false;
    this.employeeService.getEbaCardDetail(this.EmpCardNo!).subscribe(
      (data: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data Fetched Successfully',
        })
        this.EmpCardData = data[0];
        this.showEmpCardDetails = true;
        if (!this.EmpCardData.fetched || this.EmpCardData.fetched == false) {
          let dob = this.EmpCardData.dob.split('/');
          this.EmpCardData.dob = `${dob[2]}-${dob[1]}-${dob[0]}`;
          this.EmpCardData.doi = this.EmpCardData.doi.trim();
          let doiParts = this.EmpCardData.doi.split('/');
          this.EmpCardData.doi = `${doiParts[2]}-${doiParts[1]}-${doiParts[0]}`;
          this.EmpCardData.CardValidUpTo = this.EmpCardData.CardValidUpTo.split('T')[0];
          if (this.EmpCardData.designation_code) {
            this.EmpCardData.designation_code = parseInt(this.EmpCardData.designation_code, 10);
          }
        }
      },
      (error) => {
        this.showEmpCardDetails = false;
        this.EmpCardData = this.resetEmpCardData();
        this.EmpCardNo = null;
        console.log(error);
        if (error.status === 404) {
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'empty Emp Card details .',
          });
        }
        if (error.status === 400) {
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Something went wrong.',
          });
        }
        if (error.status === 405) {
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Emp Card already exist.',
          });
        }
      }
    );
  }

  findmobEmpDetais() {
    this.employeeService.getEmpDetailsByMobile(this.EmpCardData.mob_no!).subscribe(
      (data: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data Fetched Successfully',
        })
        this.EmpCardData = data[0];
        this.showEmpCardDetails = true;
        this.NewEmpCardForm = false;
      }
    );
  }

  resetEmpCardData() {
    return {
      name_print: null,
      dob: null,
      mob_no: null,
      email: null,
      office_code: null,
      designation_code: null,
      curr_add: null,
      curr_state: null,
      curr_district: null,
      curr_pin: null,
      blood_group: null,
      id_mark: null,
      photo: null,
      sig: null,
    };
  }

  findDesg() {
    const selectedOffice = this.offices.find(office => office.office_code === this.EmpCardData.office_code);
    if (selectedOffice) {
      this.employeeService.getDesignations(selectedOffice.id).subscribe(
        data => this.designations = data,
        error => console.log(error)
      );
    } else {
      console.log('No matching office found');
    }
  }

  PullEbaCard() {
    this.employeeService.PullEmpCard(this.EmpCardData).subscribe(
      (data: any) => {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'submitted successfully',
        }).then(() => {
            // Refresh the page after the success message is closed
            window.location.reload();
        });
    }    ,
      (error) => {
        // Error response
        console.log(error); // Log the error if needed
        if (error.status === 404) {
          Swal.fire({
            icon: 'warning',
            title: 'warning',
            text: 'empty details!!!!',
          });
        }
        if (error.status === 401) {
          Swal.fire({
            icon: 'warning',
            title: 'warning',
            text: 'Some thing went wrong!!!!',
          });
        }
        if (error.status === 405) {
          Swal.fire({
            icon: 'warning',
            title: 'warning',
            text: 'Not allowed!!!!',
          });
        }
      }
    );
  }

  NewEmpCardForm: boolean = false;
  NewEmpCard() {
    this.NewEmpCardForm = true;
    this.showEmpCardDetails = false;
    this.EmpCardData = this.resetEmpCardData();
  }
  FetchEmpCard() {
    this.NewEmpCardForm = false;
    this.showEmpCardDetails = false;
    this.EmpCardData = this.resetEmpCardData();
  }

  openPdfInNewTab(pdfData: string): void {
    const pdfWindow = window.open();
    // @ts-ignore
    pdfWindow.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
  }
  async onProfilePhotoSelected(event: Event, param: string): Promise<void> {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement?.files?.length) {
      const file: File = inputElement.files[0];

      // Check if the file type is JPEG or JPG
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {

        // Check if the file size is less than or equal to 200KB
        if (file.size <= 200 * 1024) { // 200KB in bytes
          try {
            const base64String: string = await fileToBase64(file); // Convert the file to base64
            if (this.EmpCardData) {
              if (param === 'Profile Photo') {
                this.EmpCardData!.photo = base64String;
              } else if (param === 'Employee Sign') {
                this.EmpCardData!.sig = base64String;
              }
            } else {
              console.log('this.employee is null.');
            }
          } catch (error) {
            console.error('Failed to convert the file to base64:', error);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid File',
            text: 'File size exceeds 200KB.',
          });
          console.log('File size exceeds 200KB.');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Invalid file type. Only JPEG or JPG files are allowed.',
        });
        console.log('Invalid file type. Only JPEG or JPG files are allowed.');
      }
    } else {
      console.log('No file selected.');
    }
  }

  async onIDproofSelected(event: any): Promise<void> {
    const selectedFile = event.target.files[0]; // Get the first selected file

    try {
      if (selectedFile) {
        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;

        // Check if the selected file is a PDF and the size is within limits
        if (fileType === 'application/pdf' && fileSize <= 1048576) {
          const base64String: string = await fileToBase64(selectedFile); // Convert the file to base64
          if (this.EmpCardData) {
            this.EmpCardData!.id_proof = base64String;
          } else {
            console.log('this.employee is null.');
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid File',
            text: 'File size exceeds 1mb or it is not a pdf',
          });
          console.log('File size exceeds 1mb or not a pdf');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'File is not present',
          text: 'No file selected',
        });
        console.log('No file selected');
      }
    } catch (error) {
      console.error('Failed to convert the file to base64:', error);
    }
  }

  async onPostingOrderSelected(event: any): Promise<void> {
    const selectedFile = event.target.files[0]; // Get the first selected file

    try {
      if (selectedFile) {
        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;

        // Check if the selected file is a PDF and the size is within limits
        if (fileType === 'application/pdf' && fileSize <= 1048576) {
          const base64String: string = await fileToBase64(selectedFile); // Convert the file to base64
          if (this.EmpCardData) {
            this.EmpCardData!.postingOrder = base64String;
          } else {
            console.log('this.employee is null.');
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid File',
            text: 'File size exceeds 1mb or it is not a pdf',
          });
          console.log('File size exceeds 1mb or not a pdf');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'File is not present',
          text: 'No file selected',
        });
        console.log('No file selected');
      }
    } catch (error) {
      console.error('Failed to convert the file to base64:', error);
    }
  }

}
