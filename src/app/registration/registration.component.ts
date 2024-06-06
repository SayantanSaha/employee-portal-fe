import { Component, OnInit } from '@angular/core';
import { EmployeeService } from "../employee.service";
import { Router } from "@angular/router";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Organization } from "../model/Organization";
import Swal from "sweetalert2";
import { Employee } from "../model/Employee";
import { State } from "../model/State";
import { District } from "../model/District";
import { fileToBase64 } from "../profile/fileToBase64";
import { environment } from "../../environments/environment";
import { Designation } from "../model/Designation";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('0', style({ transform: 'translateX(0)' })),
      state('1', style({ transform: 'translateX(-100%)' })),
      state('2', style({ transform: 'translateX(-200%)' })),
      state('3', style({ transform: 'translateX(-300%)' })),
      transition('* => *', animate('300ms ease'))
    ])
  ]
})
export class RegistrationComponent implements OnInit {
  employee: Employee = new Employee();
  password: string = '';
  cpassword: string = '';
  organization: string = '';
  orglist: Organization[] = [];
  states: State[] = [];
  currDistricts: District[] = [];
  permDistricts: District[] = [];
  divisiontypelist: any[] = [];
  designations: Designation[] = [];
  isCpAddressChecked: boolean = false;

  passwordsMatch: boolean = false;
  passwordValid: boolean = false;
  passwordTouched: boolean = false;
  cpasswordTouched: boolean = false;
  maxDate: string = "";
  apiUrl = environment.apiUrl;

  currentPageIndex = 0;
  totalPages = 4;
  slides = new Array(this.totalPages);

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}



  ngOnInit() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Zero-padded month
    const day = today.getDate().toString().padStart(2, '0'); // Zero-padded day

    this.maxDate = `${year}-${month}-${day}`;

    this.employeeService.getOrganizations().subscribe(
      data => this.orglist = data,
      error => console.error(error)
    );

    this.employeeService.getStates().subscribe(
      data => this.states = data,
      error => console.error(error)
    );

    this.employeeService.getDesignations(1).subscribe(
      data=>this.designations=data,
      error => console.log(error)
    );

    this.employeeService.getDivisionMasterList().subscribe(
      data=>this.divisiontypelist=data,
      error => console.log(error)
    );

  }

  doRegistration() {
    if (!this.passwordValid) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Password must be at least 6 characters long'
      });
      return;
    }

    if (!this.passwordsMatch) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Password and Confirm Password do not match'
      });
      return;
    }

    this.employeeService.RegistrationApply(
      this.password,
      this.employee
    ).subscribe(
      data => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Registered Successfully'
        })
        .then(() => {
          this.router.navigate(['login']);
        });
      },
      error => {
        let errorMessage = 'An error occurred. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        });
      }
    );
  }

  cPAddress() {
    if (this.isCpAddressChecked) {
      if (this.employee.curr_add && this.employee.curr_pin && this.employee.curr_state && this.employee.curr_district) {
        this.employee.perm_add = this.employee.curr_add;
        this.employee.perm_pin = this.employee.curr_pin;
        this.employee.perm_state = this.employee.curr_state;
        this.employee.perm_district = this.employee.curr_district;

        this.permDistricts = [...this.currDistricts];
      } else {
        this.isCpAddressChecked = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please fill all the fields of the current address'
        });
      }
    } else {
      this.employee.perm_add = null;
      this.employee.perm_pin = null;
      this.employee.perm_state = null;
      this.employee.perm_district = null;
    }
  }

  validatePasswords() {
    this.passwordTouched = true;
    this.cpasswordTouched = true;

    this.passwordValid = this.password.length >= 6;
    this.passwordsMatch = this.passwordValid && this.password === this.cpassword;
  }

  goToNextPage() {
    if (this.currentPageIndex < this.totalPages - 1) {
      this.currentPageIndex++;
    }
  }

  goToPreviousPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
    }
  }

  onStateChange(state: State, type: string) {
    if (type === 'curr') {
      this.getDistricts(state).then(districts => this.currDistricts = districts);
    } else if (type === 'perm') {
      this.getDistricts(state).then(districts => this.permDistricts = districts);
    }
  }

  async getDistricts(state: State) {
    let districts: District[] = [];
    if (state != null) {
      districts = await this.employeeService.getDistrictsByState(state.id!);
    }
    return districts;
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
          if (this.employee) {
            this.employee.id_proof = base64String;
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
            if (this.employee) {
              if (param === 'Profile Photo') {
                this.employee.profile_photo = base64String;
              } else if (param === 'Employee Sign') {
                this.employee.sign_path = base64String;
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

  disableTabKey(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  }

  onInput(event: any , property:string) {
    const input = event.target.value;
    // Remove non-numeric characters using regular expression
    const numericInput = input.replace(/\D/g, '');
    // Update the input value with the filtered numeric input
    event.target.value = numericInput;
    // Update the ngModel binding
    if(property=='curr_pin')
    this.employee!.curr_pin = numericInput;
    if(property=='perm_pin')
      this.employee!.perm_pin = numericInput;
    if(property=='mobile')
      this.employee!.mobile = numericInput;

  }



}
