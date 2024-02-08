import {Component, Inject} from '@angular/core';
import {User} from "../model/User";
import {Employee} from "../model/Employee";
import {EmployeeService} from "../employee.service";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";
import {State} from "../model/State";
import {District} from "../model/District";
import {Designation} from "../model/Designation";
import {Division} from "../model/Division";
import {Relation} from "../model/Relation";
import {Servants} from "../model/Servants";

import {ServantRel} from "../model/ServantRel";
import {environment} from "../../environments/environment";
import {Idcards} from "../model/Idcards";
import {Vehicles} from "../model/Vehicles";
import {fileToBase64} from "../profile/fileToBase64";
import { Router } from '@angular/router';
declare var jQuery: any;

@Component({
  selector: 'app-eba-form',
  templateUrl: './eba-form.component.html',
  styleUrls: ['./eba-form.component.scss']
})

export class EbaFormComponent {
  servantDetails: any[] = [];
  memberEbaPasses: any[] = [];

  baseUrl: string = '';
  minDate : string;

  constructor(
    @Inject('BASE_URL') baseUrl: string,private employeeService: EmployeeService,
      private route: ActivatedRoute,
      private router: Router,
  ) {
    this.baseUrl = baseUrl;
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

  }

  employee: Employee | null = null;
  user: User = new User();

  states: State[] = [];
  currDistricts: District[] = [];
  permDistricts: District[] = [];
  designations: Designation[] = [];
  divisions: Division[] = [];
  // relations: Relation[] = [];
  // eba_passes: any[] = [];
  servants: Servants[] = [];
  servantRel: ServantRel[] = [];
  vehicles: Vehicles[] = [];
  apiUrl = environment.apiUrl;
  divisiontypelist: any[] = [];  // Initialize as an empty array or with appropriate data type
  relationstypelist: any[] = [];
  editable: boolean = false;
  applyingforRelative: boolean = false;
  applyingforclosefamily: boolean = false;
  mode: string | null = null;
  modetwo: string | null = null;
  urlid: boolean = false;
  id: string | null = null;
  remark: string = '';
  file_path: string | null = null;


  ngOnInit() {

    this.mode = this.route.snapshot.paramMap.get('mode');
    this.setEditable(this.mode == 'edit');

    this.modetwo = this.route.snapshot.paramMap.get('modetwo');
    this.SetApplyingForRelative(this.modetwo == 'relative');


    let userString: string | null = sessionStorage.getItem('user') != null ? sessionStorage.getItem('user') : '[]';
    this.user = JSON.parse(userString!);

    if (this.user && this.user.role && this.user.role.some((role: { role_id: number; }) => (role.role_id === 5 || role.role_id == 6 || role.role_id == 4))) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.letverify(!isNaN(+this.id!));
    }

    if (this.id) {
      // 'id' is present, try to convert it to a number
      const idNumber = +this.id;
      if (!isNaN(idNumber)) {
        if (this.user && this.user.role && this.user.role.some((role: { role_id: number; }) => (role.role_id === 5 || role.role_id == 6 || role.role_id == 4))) {
          // 'id' is a valid number, call getEbaProfile
          this.employeeService.getEbaProfile(idNumber).subscribe(
              (data: any) => {
                this.employee = data;
              }
          );
        }} else {
        // 'id' is not a valid number, call getMyebaProfile
        this.employeeService.getMyebaProfile().subscribe(
            (data: any) => {
              this.employee = data;

              // @ts-ignore
              // this.getDistricts(this.employee.curr_state!).then(districts => this.currDistricts = districts);
              // // @ts-ignore
              // this.getDistricts(this.employee.perm_state!).then(districts => this.permDistricts = districts);
            }
        );
      }
    } else {
      // 'id' is not present, call getMyebaProfile
      this.employeeService.getMyebaProfile().subscribe(
          (data: any) => {
            this.employee = data;

            // @ts-ignore
            // this.getDistricts(this.employee.curr_state!).then(districts => this.currDistricts = districts);
            // // @ts-ignore
            // this.getDistricts(this.employee.perm_state!).then(districts => this.permDistricts = districts);
          }
      );
    }

    // this.employeeService.getStates().subscribe(
    //   data=>this.states=data,
    //   error => console.log(error)
    // );
    //
    // this.employeeService.getDesignations(1).subscribe(
    //   data=>this.designations=data,
    //   error => console.log(error)
    // );
    //
    // this.employeeService.getDivisions(1).subscribe(
    //   data=>this.divisions=data,
    //   error => console.log(error)
    // );
    //
    // this.employeeService.getDivisionMasterList().subscribe(
    //   data=>this.divisiontypelist=data,
    //   error => console.log(error)
    // );

    // this.employeeService.getDependents(1).subscribe(
    //   data=>this.relations=data,
    //   error => console.log(error)
    // );

    // this.employeeService.getRelationMasterList().subscribe(
    //   data=>this.relationstypelist=data,
    //   error => console.log(error)
    // );

    // this.employeeService.getServants(1).subscribe(
    //   data=>this.servants=data,
    //   error => console.log(error)
    // );
    //
    // this.employeeService.getServantsRel(1).subscribe(
    //   data=>this.servantRel=data,
    //   error => console.log(error)
    // );

    // this.employeeService.getVehicle(1).subscribe(
    //   data=>this.vehicles=data,
    //   error => console.log(error)
    // );

    // this.employeeService.getQuarterdetail("1","1").subscribe(
    //     data=>this.quarteraddress=data,
    //     error => console.log(error)
    // );
  }

  setEditable(status:boolean){
    this.editable = status;
  }

  SetApplyingForRelative(status:boolean){
    this.applyingforRelative = status;
  }

  onSelectcloseFamily(){
      this.applyingforRelative = true;
    this.applyingforclosefamily = true;
    this.employee!.family?.forEach(member => {
      member.allSelected = false;
    })
    this.employee!.servants?.forEach(servant => {
      servant.allSelected = false;
      servant.relations?.forEach(relative => {
        relative.allSelected = false;
      })
    })
  }

  onSelectRelative(){
    this.applyingforRelative = true;
      this.applyingforclosefamily = false;
    this.employee!.closefamily?.forEach(member => {
      member.allSelected = false;
    })
    this.employee!.servants?.forEach(servant => {
      servant.allSelected = false;
      servant.relations?.forEach(relative => {
        relative.allSelected = false;
      })
    })
  }

  onSelectServant(){
    this.applyingforRelative = false;
    this.employee!.closefamily?.forEach(member => {
      member.allSelected = false;
    })
    this.employee!.family?.forEach(member => {
      member.allSelected = false;
    })
  }

  letverify(status:boolean){
    this.urlid = status;
  }





  getActiveDesignations(designations: Designation[]): string {
    const activeDesignations = designations
        .filter(designation => designation.pivot.active)
        .map(designation => designation.desg_desc);

    return activeDesignations.join(', ');
  }
  getActiveDivision(division:Division[]): string {
    const activeDivision = division
        .filter(division => division.pivot.active)
        .map(division => division.div_desc);

    return activeDivision.join(', ');
  }
  getActiveIdCard(IdCards: Idcards[]): string {
    const activeIdCard = IdCards
        .filter(idCard => idCard.active)
        .map(idCard => idCard.card_no);

    return activeIdCard.join(', ');
  }

  // @ts-ignore
  // getDefaultExpDate(i: number, j: number,k:number ,property: string): string {
  //   const twoYearsFromNow = new Date();
  //   twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
  //   if (property === 'relative') {
  //     // @ts-ignore
  //     this.employee.relations[i].pivot.eba_passes[j].eba_pass_exp_date = twoYearsFromNow.toISOString().split('T')[0];
  //     return this.employee?.relations?.[i]?.pivot?.eba_passes?.[j]?.eba_pass_exp_date;
  //   }
  //   if (property === 'servant') {
  //     // @ts-ignore
  //     this.employee.servants[i].eba_passes[j].eba_pass_exp_date = twoYearsFromNow.toISOString().split('T')[0];
  //     return this.employee?.servants?.[i]?.eba_passes?.[j]?.eba_pass_exp_date;
  //
  //   }
  //   if (property === 'servant_rel') {
  //     // @ts-ignore
  //     this.employee.servants[i].relations[j].pivot.eba_passes[k].eba_pass_exp_date = twoYearsFromNow.toISOString().split('T')[0];
  //     return this.employee?.servants?.[i]?.relations?.[j]?.pivot?.eba_passes?.[k]?.eba_pass_exp_date;
  //   }
  // }

    getDefaultExpDate(i: number, j: number, k: number, property: string): Date {
        const twoYearsFromNow = new Date();
        twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);

        let expDate: Date = twoYearsFromNow;

        if (property === 'relative') {
            // @ts-ignore
            if (this.employee?.relations?.[i]?.pivot?.eba_passes?.[j]) {
                this.employee.relations[i].pivot.eba_passes[j].eba_pass_exp_date = expDate;
            }
            return expDate;
        }

        if (property === 'servant') {
            // @ts-ignore
            if (this.employee?.servants?.[i]?.eba_passes?.[j]) {
                this.employee.servants[i].eba_passes[j].eba_pass_exp_date = expDate;
            }
            return expDate;
        }

        if (property === 'servant_rel') {
            // @ts-ignore
            if (this.employee?.servants?.[i]?.relations?.[j]?.pivot?.eba_passes?.[k]) {
                this.employee.servants[i].relations[j].pivot.eba_passes[k].eba_pass_exp_date = expDate;
            }
            return expDate;
        }

        // Default return
        return expDate;
    }


    isWithinTwoWeeks(expDate: Date | null): boolean {
    if (expDate === null) {
      return true; // If eba_pass_exp_date is null, consider it within two weeks
    }
    const twoWeeksBeforeNow = new Date();
    twoWeeksBeforeNow.setDate(twoWeeksBeforeNow.getDate() - 14);

    return new Date(expDate) <= twoWeeksBeforeNow ;
  }

  updateRelationSelection(servant: any, relation: any): void {
    if(relation.allSelected == true)
      servant.reference = true;
  }

  addVehicle(i: number): void {
    if (
        this.employee &&
        this.employee.servants &&
        this.employee.servants[i] &&
        this.employee.servants[i]!.vehicles
    ) {
      // Check if servants is an array and initialize it if not
      if (!Array.isArray(this.employee.servants[i]!.vehicles)) {
        this.employee.servants[i]!.vehicles = [];
      }
      let s = new Vehicles();
      s.servant_id = this.employee.servants[i].id!;
      this.employee.servants[i]!.vehicles!.push(s);
    }
  }

  removeVehicle(i:number,k:number):void {
    if (
        this.employee &&
        this.employee.servants &&
        this.employee.servants[i] &&
        this.employee.servants[i].vehicles
    ) {
      this.employee.servants[i].vehicles!.splice(k, 1);
    }
  }


  onMobileNoInput(event: any, i: number, J: number): void {
    if (
      this.employee?.servants?.[i]?.eba_passes?.[J].reference_1_phone_no !== null
    ) {
      // Get the input value
      const inputValue = event.target.value;

      // Remove non-numeric characters using a regular expression
      const numericValue = inputValue.replace(/[^0-9]/g, '');

      // Update the input value
      event.target.value = numericValue;

      // Update the ngModel bound variable
      // @ts-ignore
      this.employee.servants[i].eba_passes[J].reference_1_phone_no = numericValue;
    }
  }

  onMobileNo(event: any, i: number, J: number): void {
    if (
      this.employee?.servants?.[i]?.eba_passes?.[J].reference_2_phone_no !== null
    ) {
      // Get the input value
      const inputValue = event.target.value;

      // Remove non-numeric characters using a regular expression
      const numericValue = inputValue.replace(/[^0-9]/g, '');

      // Update the input value
      event.target.value = numericValue;

      // Update the ngModel bound variable (if necessary)
      // @ts-ignore
      this.employee.servants[i].eba_passes[J].reference_2_phone_no = numericValue;
    }
  }

  onMobileNoBlur(event: any, i: number, k: number): void {
    if( this.employee?.servants?.[i]?.eba_passes?.[k]?.reference_2_phone_no != null) {
      const minLength = 10;
      const inputValue = event.target.value;

      if (inputValue.length < minLength) {
        // Show SweetAlert popup
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Input',
          text: 'Please enter at valid 10 numbers.',
        });

        // Reset the input value (optional)
        // @ts-ignore
        this.employee.servants[i].eba_passes[k].reference_2_phone_no = '';
      }
    }
  }

  onMobileBlur(event: any, i: number, k: number): void {
    if( this.employee?.servants?.[i]?.eba_passes?.[k]?.reference_1_phone_no != null) {
      const minLength = 10;
      const inputValue = event.target.value;

      if (inputValue.length < minLength) {
        // Show SweetAlert popup
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Input',
          text: 'Please enter valid 10 numbers.',
        });

        // Reset the input value (optional)
        // @ts-ignore
        this.employee.servants[i].eba_passes[k].reference_1_phone_no = '';
      }
    }
  }



  displayUpload: any = 'none';

  openUploadPopup() {
    this.displayUpload = "block";
  }
  closeUploadPopup() {
    this.displayUpload = "none";
  }

  async onProfilePhotoSelected(event: Event,i:number,j:number,k:number,property: string): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      const file: File = inputElement.files[0];
      // Check if the file type is JPEG or JPG
      if (file.type === 'image/jpeg' || file.type === 'image/jpg' ) {
        // Check if the file size is less than or equal to 200KB
        if (file.size <= 200 * 1024) { // 200KB in bytes
        try {
          const base64String: string = await fileToBase64(file); // Convert the file to base64

          if (this.employee?.closefamily?.[i]?.pivot?.eba_passes?.[j]) {
            if (property === 'closefamily_photo_path') {
              // @ts-ignore
              this.employee.closefamily[i].pivot.eba_passes[j].photo_path_edit_64 = base64String;
            } else if (property === 'closefamily_signature') {
              // @ts-ignore
              this.employee.closefamily[i].pivot.eba_passes[j].sign_path = base64String;
            }
          }

          if (this.employee?.family?.[i]?.pivot?.eba_passes?.[j]) {
            if (property === 'family_photo_path') {
              // @ts-ignore
              // alert('ok');
              this.employee.family[i].pivot.eba_passes[j].photo_path_edit_64 = base64String;
            } else if (property === 'family_signature') {
              // @ts-ignore
              this.employee.family[i].pivot.eba_passes[j].sign_path = base64String;
            }
          }

          if (this.employee?.servants?.[i]?.eba_passes?.[j]) {
            // Update the specific property based on the argument
            if (property === 'servant_photo_path') {
              // @ts-ignore
              this.employee.servants[i].eba_passes[j].photo_path_edit_64 = base64String;
            } else if (property === 'servant_signature') {
              // @ts-ignore
              this.employee.servants[i].eba_passes[j].sign_path = base64String;
            }
          }

          if (this.employee?.servants?.[i]?.relations?.[j]?.pivot?.eba_passes?.[k]) {
            // Update the specific property based on the argument
            if (property === 'photo') {
              // @ts-ignore
              this.employee.servants[i].relations[j].pivot.eba_passes[k].photo_path_edit_64 = base64String;
            } else if (property === 'sign') {
              // @ts-ignore
              this.employee.servants[i].relations[j].pivot.eba_passes[k].sign_path = base64String;
            }
          }

          if(this.file_path){
            if (property === 'file_path') {
            this.file_path=base64String;
            }
          }
        }
        catch (error) {
          console.error('Failed to convert the file to base64:', error);
        }
        } else {
          this. removeFile(event, i, j, k, property);
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

  async onFileSelected(event: Event,i:number,j:number,k:number,property: string): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      const file: File = inputElement.files[0];
      // Check if the file type is JPEG or JPG
      if (file.type === 'application/pdf' ) {
        // Check if the file size is less than or equal to 200KB
        if (file.size <= 1048576) { // 200KB in bytes
          try {
            const base64String: string = await fileToBase64(file); // Convert the file to base64

            if (this.employee?.closefamily?.[i]?.pivot?.eba_passes?.[j]) {
               if (property === 'closefamily_id_proof_path') {
                // @ts-ignore
                this.employee.closefamily[i].pivot.eba_passes[j].id_proof_path = base64String;
              }
            }

            if (this.employee?.family?.[i]?.pivot?.eba_passes?.[j]) {
              if (property === 'family_id_proof_path') {
                // @ts-ignore
                this.employee.family[i].pivot.eba_passes[j].id_proof_path = base64String;
              }
            }

            if (this.employee?.servants?.[i]?.eba_passes?.[j]) {
              // Update the specific property based on the argument
              if (property === 'servant_id_proof_path') {
                // @ts-ignore
                this.employee.servants[i].eba_passes[j].id_proof_path = base64String;
              }
            }

            if (this.employee?.servants?.[i]?.relations?.[j]?.pivot?.eba_passes?.[k]) {
              // Update the specific property based on the argument
              if (property === 'id_proof') {
                // @ts-ignore
                this.employee.servants[i].relations[j].pivot.eba_passes[k].id_proof_path = base64String;
              }
            }

            if(this.file_path){
              if (property === 'file_path') {
                this.file_path=base64String;
              }
            }
          }
          catch (error) {
            console.error('Failed to convert the file to base64:', error);
          }
        } else {
          this. removeFile(event, i, j, k, property);
          Swal.fire({
            icon: 'error',
            title: 'Invalid File',
            text: 'File size exceeds 200KB.',
          });
          console.log('File size exceeds 1mb.');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Invalid file type. Only pdf files are allowed.',
        });
        console.log('Invalid file type. Only pdf files are allowed.');
      }

    } else {
      console.log('No file selected.');
    }
  }


  removeFile(event: Event,i:number,j:number,k:number,property: string): void {
    if (this.employee?.closefamily?.[i]?.pivot?.eba_passes?.[j]) {
      if (property === 'closefamily_photo_path') {
        // @ts-ignore
        this.employee.closefamily[i].pivot.eba_passes[j].photo_path_edit_64 = null;
        // this.employee.closefamily[i].pivot.eba_passes[j].photo_path_64 = null;
      } else if (property === 'closefamily_signature') {
        // @ts-ignore
        this.employee.closefamily[i].pivot.eba_passes[j].sign_path = null;
      } else if (property === 'closefamily_id_proof_path') {
        // @ts-ignore
        this.employee.closefamily[i].pivot.eba_passes[j].id_proof_path = null;
      }
    }
    if (this.employee?.family?.[i]?.pivot?.eba_passes?.[j]) {
      if (property === 'family_photo_path') {
        // @ts-ignore
        // alert('ok');
        this.employee.family[i].pivot.eba_passes[j].photo_path_edit_64 = null;
      } else if (property === 'family_signature') {
        // @ts-ignore
        this.employee.family[i].pivot.eba_passes[j].sign_path = null;
      } else if (property === 'family_id_proof_path') {
        // @ts-ignore
        this.employee.family[i].pivot.eba_passes[j].id_proof_path = null;
      }
    }

    if (this.employee?.servants?.[i]?.eba_passes?.[j]) {
      // Update the specific property based on the argument
      if (property === 'servant_photo_path') {
        // @ts-ignore
        this.employee.servants[i].eba_passes[j].photo_path_edit_64 = null;
      } else if (property === 'servant_signature') {
        // @ts-ignore
        this.employee.servants[i].eba_passes[j].sign_path = null;
      } else if (property === 'servant_id_proof_path') {
        // @ts-ignore
        this.employee.servants[i].eba_passes[j].id_proof_path = null;
      }
    }

    if (this.employee?.servants?.[i]?.relations?.[j]?.pivot?.eba_passes?.[k]) {
      // Update the specific property based on the argument
      if (property === 'photo') {
        // @ts-ignore
        this.employee.servants[i].relations[j].pivot.eba_passes[k].photo_path_edit_64 = null;
      } else if (property === 'sign') {
        // @ts-ignore
        this.employee.servants[i].relations[j].pivot.eba_passes[k].sign_path = null;
      } else if (property === 'id_proof') {
        // @ts-ignore
        this.employee.servants[i].relations[j].pivot.eba_passes[k].id_proof_path = null;
      }
    }
    if (property === 'file_path') {
      this.file_path = null;
    }
  }



   applyEba() {
    if (this.employee) {
      if (this.employee.designations === null || this.employee.designations.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty Designation',
          text: 'Designation does not have a value.',
        });
        return;
      }

      if (this.employee.divisions === null || this.employee.divisions.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty Department',
          text: 'Department does not have a value.',
        });
        return;
      }

      if (this.employee.organization === null) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty organization',
          text: 'Organization does not have a value.',
        });
        return;
      }

      if (this.employee.qtr_code === null) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty Quarter',
          text: 'Quarter does not have a value. First pull your data from profile',
        });
        return;
      }

      const clonedEmployee = { ...this.employee };

      if(this.applyingforRelative) {
        if (clonedEmployee.closefamily) {
          clonedEmployee.closefamily = clonedEmployee.closefamily.filter(member => member.allSelected);
          clonedEmployee.servants = [];
        }

        if (clonedEmployee.family) {
          clonedEmployee.family = clonedEmployee.family.filter(member => member.allSelected);
          clonedEmployee.servants = [];
        }
      }else {
        clonedEmployee.closefamily = [];
        clonedEmployee.family = [];
        clonedEmployee.vehicles = [];
        if (clonedEmployee.servants) {
          clonedEmployee.servants = clonedEmployee.servants.filter(servant => {
            return servant.allSelected || servant.reference;
          });
          //   if( clonedEmployee.vehicles)
          //   clonedEmployee.vehicles = clonedEmployee.vehicles?.filter(vehicle => vehicle.allSelected);
          // }
        }

        if (clonedEmployee.servants) {
          clonedEmployee.servants.forEach(servant => {
            if (servant.relations) {
              servant.relations = servant.relations.filter(relation => relation.allSelected);
            }
          });
        }
      }
      if(this.applyingforRelative){
        if(this.applyingforclosefamily){
          if (clonedEmployee.closefamily === null || clonedEmployee.closefamily.length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'Empty Relative',
              text: 'Atleast add one family',
            });
            return;
          }
        }
        else{
          if (clonedEmployee.family === null || clonedEmployee.family.length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'Empty Relative',
              text: 'Atleast add one Relative',
            });
            return;
          }
        }
      }else{
        if (clonedEmployee.servants === null || clonedEmployee.servants.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Empty Domestic help',
            text: 'Atleast add one Domestic help',
          });
          return;
        }
      }
      this.router.navigate(['eba-form-view'], { state: { employeeData: clonedEmployee, fromUrl: 'eba-form' } });
      // Send the modified employee object to the server
      // this.employeeService.applyeba(clonedEmployee).subscribe(
      //
      //     // this.employeeService.applyeba(Employee).subscribe(
      //     // if (this.validationErrors.length > 0) {
      //     //
      //     //   const errorMessage = this.validationErrors
      //     //       .map((error, index) => `${index + 1}. ${error}`)
      //     //       .join('\n');
      //     //
      //     //   Swal.fire({
      //     //     icon: 'error',
      //     //     title: 'Error',
      //     //     html: errorMessage.replace(/\n/g, '<br/>'),
      //     //     width: 'auto', // Adjust as needed
      //     //   });
      //     //   return; // Exit without calling the API
      //     // }
      //
      //     // Validation true then Api call otherwise please check
      //     // data=>console.log(data),
      //     // error=>console.log(error)
      //
      //
      //     data => {
      //       console.log(data);
      //       Swal.fire({
      //         icon: 'success',
      //         title: 'Success',
      //         text: 'Eba application applied successfully and pending for approval',
      //         // }).then((result) => {
      //         //   if (result.isConfirmed) {
      //         //     // Redirect to the desired page
      //         //     window.location.reload();
      //         //   }
      //       }).then(() => {
      //         // this.router.navigate(['eba-form-view'], { state: { employeeData: clonedEmployee } });
      //       });
      //     },
      //     (error) => {
      //       console.log(error);
      //       console.log(error.status);
      //       console.log(error.error);
      //       if(error){
      //         // if(error.status === 302){
      //         //   Swal.fire({
      //         //     icon: 'warning',
      //         //     title: 'Warning',
      //         //     text: 'Previous Record is still pending !!!',
      //         //   });
      //         // }else if(error.status === 303){
      //         //   Swal.fire({
      //         //     icon: 'warning',
      //         //     title: 'Warning',
      //         //     text: 'you already have a approved application',
      //         //   });
      //         // }
      //         // else{
      //         Swal.fire({
      //           icon: 'error',
      //           title: 'API Error',
      //           text: 'An error occurred while updating.',
      //         });
      //       }
      //     }
      // );
    }
  }
  approveapplication() {
    const id = +this.route.snapshot.params['id'];
    if (!isNaN(id)) {
      if (this.user && this.user.role && this.user.role.some((role: { role_id: number; }) => role.role_id === 4)) {
        if (this.employee) {
          console.log(this)
          // const clonedEmployee = {...this.employee};
          // if (clonedEmployee.closefamily) {
          //   clonedEmployee.closefamily = clonedEmployee.closefamily.filter(member => member.allSelected);
          //
          // }
          //
          // if (clonedEmployee.family) {
          //   clonedEmployee.family = clonedEmployee.family.filter(member => member.allSelected);
          //
          // }
          //
          // if (clonedEmployee.servants) {
          //   clonedEmployee.servants = clonedEmployee.servants.filter(servant => servant.allSelected);
          // }
          //
          // if (
          //     (clonedEmployee.relations === null || clonedEmployee.relations.length === 0) &&
          //     (clonedEmployee.servants === null || clonedEmployee.servants.length === 0)
          // ) {
          //   Swal.fire({
          //     icon: 'warning',
          //     title: 'Empty application',
          //     text: 'At least add one person',
          //   });
          //   return;
          // }

          this.employeeService.updateeba(this.employee, id).subscribe(
              () => {
                this.employeeService.updateebastatus(id, 'Approve', this.remark, this.file_path ?? '').subscribe(
                    () => {
                      Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Approved successfully',
                      }).then(() => {
                        // Redirect to the dashboard route
                        this.router.navigate(['ebapanel']);
                      });
                    },
                    (error) => {
                      console.log('Error in updateebastatus:', error);
                      if (error.status === 302) {
                        Swal.fire({
                          icon: 'warning',
                          title: 'Warning',
                          text: 'You are not authorised !!!',
                        });
                      } else {
                        // Handle specific errors or use a generic error message
                        Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: 'An error occurred while Approving application status.',
                        });
                      }
                    }
                );
              },
              (error) => {
                console.log('Error in updateeba:', error);
                // Handle specific errors or use a generic error message
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'An error occurred while updating the application.',
                });
              }
          );
        }
      }
      else if (this.user && this.user.role && this.user.role.some((role: { role_id: number; }) => (role.role_id === 5 || role.role_id == 6))) {
        this.employeeService.updateebastatus(id, 'Approve', this.remark, this.file_path ?? '').subscribe(
            () =>{
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Approved successfully',
              }).then(() => {
                // Redirect to the dashboard route
                this.router.navigate(['ebapanel']);
              });
            },
            (error) => {
              console.log(error);
              console.log(error.status);
              console.log(error.error);
              if (error.status === 302) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Warning',
                  text: 'You are not authorised !!!',
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'An error occurred while Approving application status.',
                });
              }
            }
        );
      } else{
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'You are not authorised !!!',
        });
      }
    }else{
      console.error('ID parameter is missing or invalid in the URL.');
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'id missing !!!',
      });
      return;
    }
  }

  returnapplication()
  {
    // Extract id from route parameters
    const id = +this.route.snapshot.params['id'];

    // Check if 'id' parameter exists in the URL
    if (!isNaN(id)) {
      this.employeeService.updateebastatus(id, 'Return', this.remark, this.file_path ?? '').subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Returned successfully',
            }).then(() => {
              // Redirect to the dashboard route
              this.router.navigate(['ebapanel']);
            });
          },
          (error) => {
            console.log(error);
            console.log(error.status);
            console.log(error.error);

            if (error.status === 302) {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'You are not authorized !!!',
              });
            } else {
              // Handle other errors here
              console.error('An error occurred:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while Approving application status.',
              });
            }
          }
      );
    } else {
      console.error('ID parameter is missing or invalid in the URL.');
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'id missing !!!',
      });
      return;
    }
  }

  openFileInNewPage(i:number ,j: number,property: string) {
    if(property == 'remarkfile'){
      const application = this.employee!.eba_applicationsstatus[i];
      if (application && application.file_path) {
        this.employeeService.getpic(application.file_path).subscribe((data) => {
          const blob = new Blob([data], { type: 'image/jpeg' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        });
      }
    } else if(property == 'photo'){
      const application = this.employee?.relations?.[i]?.pivot?.eba_passes?.[j];
      if (application && application.photo_path) {
        this.employeeService.getpic(application.photo_path).subscribe(
            (data) => {
          const blob = new Blob([data], { type: 'image/jpeg' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
          (error) => {
            console.log(error);
            console.log(error.status);
            console.log(error.error);
            if (error) {
              if (error.status === 404) {
                window.open(application.photo_path, '_blank');
              }
            }
          });
      }
    }
    else if(property == 'sign'){
      const application = this.employee?.relations?.[i]?.pivot?.eba_passes?.[j];
      if (application && application.sign_path) {
        this.employeeService.getpic(application.sign_path).subscribe(
            (data) => {
              const blob = new Blob([data], { type: 'image/jpeg' });
              const url = window.URL.createObjectURL(blob);
              window.open(url, '_blank');
            },
            (error) => {
              console.log(error);
              console.log(error.status);
              console.log(error.error);
              if (error) {
                if (error.status === 404) {
                  // window.open(atob(application.sign_path), '_blank');
                  window.open(application.sign_path, '_blank');
                }
              }
            }
        );
      }

    }
    else if(property == 'id'){
      const application = this.employee?.relations?.[i]?.pivot?.eba_passes?.[j];
      if (application && application.id_proof_path) {
        this.employeeService.getpic(application.id_proof_path).subscribe((data) => {
          const blob = new Blob([data], { type: 'image/jpeg' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
            (error) => {
              console.log(error);
              console.log(error.status);
              console.log(error.error);
              if (error) {
                if (error.status === 404) {
                  // window.open(atob(application.sign_path), '_blank');
                  window.open(application.id_proof_path, '_blank');
                }
              }
            }
        );
      }
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

}
