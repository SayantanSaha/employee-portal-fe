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
import { Inject } from '@angular/core';
import { User } from "../model/User";

import { ActivatedRoute } from "@angular/router";
import { Division } from "../model/Division";
import { Relation } from "../model/Relation";
import { Servants } from "../model/Servants";

import { ServantRel } from "../model/ServantRel";
import { Idcards } from "../model/Idcards";
import { Vehicles } from "../model/Vehicles";
declare var jQuery: any;


import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-rbcardapplyform',
  // standalone: true,
  // imports: [],
  templateUrl: './rbcardapplyform.component.html',
  styleUrl: './rbcardapplyform.component.scss'
})
export class RbcardapplyformComponent {
  employee: Employee | null = new Employee();
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
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  passColors: any[] = [];
  payLevels: any[] = [];
  showform: boolean = false;
  passwordsMatch: boolean = false;
  passwordValid: boolean = false;
  passwordTouched: boolean = false;
  cpasswordTouched: boolean = false;
  maxDate: string = "";
  apiUrl = environment.apiUrl;
  display: any = 'none';
  currentPageIndex = 0;
  totalPages = 5;
  slides = new Array(this.totalPages);
  currentDate: string = "";
  isLoading: boolean = false;
  user: User = new User();
  id: any;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private http: HttpClient,
  ) {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
  }



  ngOnInit() {
    const userString: string | null = sessionStorage.getItem('user');
    this.user = userString ? JSON.parse(userString) : [];
    this.id = this.user.id;


    this.isLoading = true;
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18); // Subtract 18 years from today

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

    this.employeeService.getPays().subscribe(
      data => this.payLevels = data,
      error => console.error(error)
    );

    this.employeeService.getCardType().subscribe(
      data => {
        this.passColors = data;
        this.passColors = this.passColors.filter(color => ['G', 'R'].includes(color.code));
      },
      error => console.error(error)
    );

    this.employeeService.getDesignations(1).subscribe(
      data => this.designations = data,
      error => console.log(error)
    );

    this.employeeService.getDivisionMasterList().subscribe(
      data => this.divisiontypelist = data,
      error => console.log(error)
    );
    this.isLoading = false;
  }


  doRegistration() {
    // const userString: string | null = sessionStorage.getItem('user');
    // this.user = userString ? JSON.parse(userString) : [];
    // this.id = this.user.id;  // Assign the id from the user object

    this.isLoading = true;

    this.employeeService.rbformapply(
      this.employee!, // Pass the employee object

    ).subscribe(
      data => {
        this.isLoading = false; // Hide loading symbol in case of success
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Registered Successfully'
        }).then(() => {
          this.router.navigate(['regpanel']);
        });
      },
      error => {
        this.isLoading = false; // Hide loading symbol in case of error
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
      if (this.employee!.curr_add && this.employee!.curr_pin && this.employee!.curr_state && this.employee!.curr_district) {
        this.employee!.perm_add = this.employee!.curr_add;
        this.employee!.perm_pin = this.employee!.curr_pin;
        this.employee!.perm_state = this.employee!.curr_state;
        this.employee!.perm_district = this.employee!.curr_district;

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
      this.employee!.perm_add = null;
      this.employee!.perm_pin = null;
      this.employee!.perm_state = null;
      this.employee!.perm_district = null;
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
          if (this.employee) {
            this.employee!.postingOrder = base64String;
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

  calculateDor(): void {
    if (this.employee!.dob && this.employee!.emp_type != 'Temporary') {
      const dob = new Date(this.employee!.dob);
      let date = new Date(dob);

      // Add 60 years to the Date of Birth
      date.setFullYear(date.getFullYear() + 60);

      if (date.getDate() === 1) {
        // If DoB is the 1st, set DoR to the last day of the previous month
        date.setDate(0); // Set to the last day of the previous month
      } else {
        // Otherwise, set DoR to the last day of the same month
        date.setMonth(date.getMonth() + 1); // Move to the next month
        date.setDate(0); // Set to the last day of the current month
      }

      // Format DoR as 'YYYY-MM-DD' for the input
      this.employee!.dor = date.toISOString().slice(0, 10);
    }
  }

  idCardDetails(): void {
    if (this.employee?.id_cards != null) {
      if (this.employee) {
        const applyReason = this.employee.apply_reason;
        const idcard = this.employee.id_cards;
        const emptype = this.employee.emp_type;
        this.employee = new Employee();
        this.employee.apply_reason = applyReason;
        this.employee.id_cards = idcard;
        this.employee.emp_type = emptype;
      }

      this.employeeService.getidCardDetails(this.employee).subscribe(
        data => {
          this.employee = data;
          this.showform = true;
        },
        error => {
          if (error.status === 404) {
            // Handle 404 error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.msg || 'ID card not found',
            });
          } else {
            // Handle other errors if needed
            console.error(error);
          }
          this.showform = false;
        }
      );
    }
  }


  empTypeCondition(): void {
    if (this.employee!.emp_type == 'Temporary') {
      delete this.employee!.dor;
      delete this.employee!.payLevel;
    }
  }


  onApplyReasonChange(): void {
    if (this.employee!.apply_reason !== 'Lost/theaft') {
      this.employee!.FIR_no = null;
    }if (this.employee) {
      const applyReason = this.employee.apply_reason; // Preserve apply_reason
      this.employee = new Employee(); // Reset the employee object
      this.employee.apply_reason = applyReason; // Restore apply_reason
      this.showform = false;
    }
  }

  onStateChange(state: number, type: string) {
    if (type === 'curr') {
      this.getDistricts(state).then(districts => this.currDistricts = districts);
    } else if (type === 'perm') {
      this.getDistricts(state).then(districts => this.permDistricts = districts);
    }
  }

  async getDistricts(state: number) {
    let districts: District[] = [];
    if (state != null) {
      districts = await this.employeeService.getDistrictsByState(state);
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
            this.employee!.id_proof = base64String;
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

  updateDesgPrint(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const selectedDesg = this.designations.find(desg => desg.id === this.employee!.designation);
    if (selectedDesg) {
      this.employee!.desg_print = selectedDesg.desg_desc;
    } else {
      this.employee!.desg_print = '';
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
                this.employee!.profile_photo = base64String;
              } else if (param === 'Employee Sign') {
                this.employee!.sign_path = base64String;
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



  onInput(event: any, property: string) {
    const input = event.target.value;
    // Remove non-numeric characters using regular expression
    const numericInput = input.replace(/\D/g, '');
    // Update the input value with the filtered numeric input
    event.target.value = numericInput;
    // Update the ngModel binding
    if (property == 'curr_pin')
      this.employee!.curr_pin = numericInput;
    if (property == 'perm_pin')
      this.employee!.perm_pin = numericInput;
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

  openPopup() {
    this.display = "block";
    if (this.employee!.designation) {
      this.employee!.designation = this.designations.find(desg => desg.id === this.employee!.designation);
    }
    if (this.employee!.curr_state) {
      this.employee!.curr_state = this.states.find(state => state.id === this.employee!.curr_state);
    }
    if (this.employee!.curr_district) {
      this.employee!.curr_district = this.currDistricts.find(dist => dist.id === this.employee!.curr_district);
    }
    if (this.employee!.perm_state) {
      this.employee!.perm_state = this.states.find(state => state.id === this.employee!.perm_state);
    }
    if (this.employee!.perm_district) {
      this.employee!.perm_district = this.permDistricts.find(dist => dist.id === this.employee!.perm_district);
    }
    if (this.employee!.division) {
      this.employee!.division = this.divisiontypelist.find(div => div.id === this.employee!.division);
    }
    if (this.employee!.organization) {
      this.employee!.organization = this.orglist.find(org => org.id === this.employee!.organization);
    }
    if (this.employee!.payLevel) {
      this.employee!.payLevel = this.payLevels.find(pay => pay.id === this.employee!.payLevel);
    }


  }
  closePopup() {
    this.display = "none";
    if (this.employee!.designation) {
      this.employee!.designation = this.employee!.designation.id;
    }
    if (this.employee!.curr_state) {
      this.employee!.curr_state = this.employee!.curr_state.id;
    }
    if (this.employee!.curr_district) {
      this.employee!.curr_district = this.employee!.curr_district.id;
    }
    if (this.employee!.perm_state) {
      this.employee!.perm_state = this.employee!.perm_state.id;
    }
    if (this.employee!.perm_district) {
      this.employee!.perm_district = this.employee!.perm_district.id;
    }
    if (this.employee!.division) {
      this.employee!.division = this.employee!.division.id;
    }
    if (this.employee!.organization) {
      this.employee!.organization = this.employee!.organization.id;
    }
    if (this.employee!.payLevel) {
      this.employee!.payLevel = this.employee!.payLevel.id;
    }

  }


}

