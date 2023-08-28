import {Component, OnInit} from '@angular/core';
import {User} from "../model/User";
import {Employee} from "../model/Employee";
import {EmployeeService} from "../employee.service";
import {ActivatedRoute} from "@angular/router";
import {State} from "../model/State";
import {District} from "../model/District";
import {Designation} from "../model/Designation";
import {Division} from "../model/Division";

import Swal from 'sweetalert2';
import {Relation} from "../model/Relation";
import { fileToBase64 } from '../profile/fileToBase64';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit{

  validationErrors:string[] = [];
  divisiontypelist: any[] = [];  // Initialize as an empty array or with appropriate data type
  relationstypelist: any[] = []; // Initialize as an empty array or with appropriate data type
  readonly DESIGNATION = 'DESIGNATION';
  readonly DIVISION = 'DIVISION';


  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
  ) {}
  
  employee:Employee| null = null;
  mode:string|null = null;
  editable:boolean = false;
  states:State[]=[];
  currDistricts:District[]=[];
  permDistricts:District[]=[];
  designations:Designation[]=[];
  divisions:Division[]=[];
  relations:Relation[]=[];
  apiUrl = environment.apiUrl;

  ngOnInit() {
    
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.setEditable(this.mode=='edit');
    this.employeeService.getMyProfile().subscribe(
      data=>{
        this.employee=data;

        this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
        this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
      }
    );

    this.employeeService.getStates().subscribe(
      data=>this.states=data,
      error => console.log(error)
    );

    this.employeeService.getDesignations(1).subscribe(
      data=>this.designations=data,
      error => console.log(error)
    );

    this.employeeService.getDivisions(1).subscribe(
      data=>this.divisions=data,
      error => console.log(error)
    );

    this.employeeService.getDependents(1).subscribe(
      data=>this.relations=data,
      error => console.log(error)
    );
    
   
    this.employeeService.getDivisionMasterList().subscribe(
      data=>this.divisiontypelist=data,
      error => console.log(error)
    );

    this.employeeService.getRelationMasterList().subscribe(
      data=>this.relationstypelist=data,
      error => console.log(error)
    );
    
  
  }


  setEditable(status:boolean){
    this.editable = status;
  }


  compareState(oneState:State,othState:State): boolean{
    if(oneState==null && othState==null)
      return true;
    else if(oneState!=null && othState!=null)
      return oneState.id===othState.id;
    else
      return false;
  }


  compareDesignation(first:Designation,second:Designation): boolean{
    return first !=null && second!=null && first==second ;//&& first.id===second.id
  }


  compareDivisions(first:Division,second:Division): boolean{
    return first !=null && second!=null && first==second ;// && first.id===second.id
  }


  compareDist(oneDist:District,othDist:District): boolean{
    return oneDist.id===othDist.id;
  }


  onStateChange(state:State,type:String){
    if(type=='curr'){
      this.getDistricts(state).then(districts=>this.currDistricts=districts);
    }
    else if(type=='perm'){
      this.getDistricts(state).then(districts=>this.permDistricts=districts);
    }
  }


  savePrimaryDetails(){

    // Validation check before API Call  

    if (this.validationErrors.length > 0) {

      const errorMessage = this.validationErrors
      .map((error, index) => `${index + 1}. ${error}`)
      .join('\n');

      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: errorMessage.replace(/\n/g, '<br/>'),
        width: 'auto', // Adjust as needed
      });
      return; // Exit without calling the API
    }

    // Validation true then Api call otherwise please check 
    this.employeeService.updateEmployee(this.employee!).subscribe(
      // data=>console.log(data),
      // error=>console.log(error)

      //Changes By Ravikant
      data => {
        console.log(data);
        Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Basic Details Updated Successfully',
        });
      },
      error => {
        console.log(error);
        Swal.fire({
        icon: 'error',
        title: 'API Error',
        text: 'An error occurred while updating.',
        });
      }
      
    );

   
  }
  

  async getDistricts(state:State){
    let districts:District[] = [];
    if(state!=null)
    {
      districts = await this.employeeService.getDistrictsByState(state.id!);
    }
    return districts;
  }


  addDesignation() {
      let d = new Designation();
      d.pivot.employee_id = this.employee?.id!;
      this.employee?.designations?.push(d);
  }


  savePromotion(index:number){
    let promotion = this.employee?.designations![index].pivot;

    console.log(this.employee?.designations![index].pivot.order_path)
    if(promotion?.id==-1){
       this.employeeService.savePromotion(promotion).subscribe(
        p=>this.employee!.designations![index]=p,
         e=>console.log(e)
      );
    }else{
      if(promotion!=null){
        this.employeeService.updatePromotion(promotion).subscribe(
          p=>this.employee!.designations![index]=p,
          e=>console.log(e)
        );
      }
    }
  }


  deleteRecord(index:number) {
    let promotion = this.employee?.designations![index].pivot;
    if(promotion?.id==-1){
      this.employee?.designations!.splice(index);
    }else{
      if(promotion!=null){
        promotion!.active=false;
        this.employeeService.updatePromotion(promotion).subscribe(
          p=>this.employee!.designations![index]=p,
          e=>console.log(e)
        );
      }

    }
  }


  activateRecord(index: number) {
    let promotion = this.employee?.designations![index].pivot;
    if(promotion!=null){
      promotion!.active=true;
      this.employeeService.updatePromotion(promotion).subscribe(
        p=>this.employee!.designations![index]=p,
        e=>console.log(e)
      );
    }
  }

  /********** Add Division Function Start *********/

    addDivision() {
      this.employee?.divisions?.push(new Division());
    }

    deleteDivision(index:number){
      this.employee?.divisions?.splice(index, 1);
    }

    saveDivision(index:number){
      let postingDtls = this.employee?.divisions![index].pivot;
      if(postingDtls?.id==-1){
        this.employeeService.savePosting(postingDtls).subscribe(
          p=>this.employee!.divisions![index]=p,
          e=>console.log(e)
        );
      }else{
        if(postingDtls!=null){
          this.employeeService.updatePosting(postingDtls).subscribe(
            p=>this.employee!.divisions![index]=p,
            e=>console.log(e)
          );
        }
      }
    }
  /*********** Add Division Function End **********/

  /***************** Add Family Members Function Start *********************/

    compareGender(first:Relation,second:Relation): boolean{
      return first !=null && second!=null && first==second ;//&& first.id===second.id
    }

    compareRelation(first:Relation,second:Relation): boolean{
      return first !=null && second!=null && first==second ;//&& first.id===second.id
    }

    //Add Member Column Function
    addMember() {
      if (this.employee && this.employee.relations) {
        let d = new Relation();
        d.pivot.employee_id = this.employee?.id!;
        this.employee?.relations?.push(d);
      }
    }
    
    // Delete Member Column Function
    deleteMember(index: number) {
      if (this.employee && this.employee.relations) {
        this.employee.relations!.splice(index, 1);
      }
    }

    // Save Family Details 
    saveRelationDetails(index: number){
      let membersDtls = this.employee?.relations![index].pivot;
      if(membersDtls?.id==-1){
        this.employeeService.updateRelation(membersDtls).subscribe(
          p=>this.employee!.relations![index]=p,
          e=>console.log(e)
        );
      }else{
        if(membersDtls!=null){
          this.employeeService.updateRelation(membersDtls).subscribe(
            p=>this.employee!.relations![index]=p,
            e=>console.log(e)
          );
        }
      }
    }
  
  /***************** Add Family Members Function End ***************8*******/



  /************************* Validation Check Function Start *************************/


  validateEngName() {
    const namePattern = /^[a-zA-Z- ]{3,30}$/;
    if (!namePattern.test(this.employee!.emp_name)) { // Note the negation (!) here
      this.validationErrors.push('Invalid Employee Name');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid Employee Name',
      });
    }else {
      // Clear the validation error message for Name in English if it's valid
      const index = this.validationErrors.indexOf('Invalid Employee Name');
      if (index !== -1) {
        this.validationErrors.splice(index, 1);
      }
    }
  }

  validateHindiName() {
    const namePattern = /^[\u0900-\u097F\s-]{3,30}$/; // Unicode range for Hindi characters
    if (!namePattern.test(this.employee!.emp_name_hi)) {
      this.validationErrors.push('कर्मचारी का नाम अमान्य है !!! कृपया हिंदी में नाम दर्ज करें');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'कर्मचारी का नाम अमान्य है !!! कृपया हिंदी में नाम दर्ज करें',
      });
    }else {
      // Clear the validation error message for Name in Hindi if it's valid
      const index = this.validationErrors.indexOf('कर्मचारी का नाम अमान्य है !!! कृपया हिंदी में नाम दर्ज करें');
      if (index !== -1) {
        this.validationErrors.splice(index, 1);
      }
    }
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.employee!.email_id)) {
      this.validationErrors.push('Invalid Email Id');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid Email Id',
      });
    }else {
      // Clear the validation error message for Email if it's valid
      const index = this.validationErrors.indexOf('Invalid Email Id');
      if (index !== -1) {
        this.validationErrors.splice(index, 1);
      }
    }

  }


  validateMobile() {
    const mobilePattern = /^\d{10}$/;
    if(!mobilePattern.test(this.employee!.mobile)) {
      this.validationErrors.push('Invalid Mobile Number');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid Mobile Number',
      });
    }else {
      // Clear the validation error message for mobile if it's valid
      const index = this.validationErrors.indexOf('Invalid Mobile Number');
      if (index !== -1) {
        this.validationErrors.splice(index, 1);
      }
    }
  }

  
  validateCurrPin() {
    if (this.employee!.curr_pin !== null) {
      const pinPattern = /^\d{6}$/;
      if (!pinPattern.test(this.employee!.curr_pin)) {
        this.validationErrors.push('Invalid Current PIN code.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid Current PIN code.',
        });
      }else {
        // Clear the validation error message for Pin Code if it's valid
        const index = this.validationErrors.indexOf('Invalid Current PIN code.');
        if (index !== -1) {
          this.validationErrors.splice(index, 1);
        }
      }

    }
  }


  validatePermPin() {
    if (this.employee!.perm_pin !== null) {
      const pinPattern = /^\d{6}$/;
      
      if (!pinPattern.test(this.employee!.perm_pin)) {

        this.validationErrors.push('Invalid Premanent Pin Code');

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid Premanent Pin Code',
        });
      }else {
        // Clear the validation error message for Pin Code if it's valid
        const index = this.validationErrors.indexOf('Invalid Premanent Pin Code');
        if (index !== -1) {
          this.validationErrors.splice(index, 1);
        }
      }
    }
  }

  /************************* Validation Check Function End *************************/

  
  /******* Upload File Function Start *******/

  // Profile Photo 
  async onProfilePhotoSelected(event: Event): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      const file: File = inputElement.files[0];
      try {
        const base64String: string = await fileToBase64(file); // Convert the file to base64
        if (this.employee) {
          this.employee.profile_photo = base64String; // Assign the base64 string to the profile_photo property
        } else {
          
          console.log('this.employee is null.');
        }
      } catch (error) {
        console.error('Failed to convert the file to base64:', error);
      }
    } else {
      console.log('No file selected.');
    }
  }

  // Order File Promotions
  async onFileSelected(event: any, i: number) {
    const selectedFile = event.target.files[0];
   
    try {
      if (selectedFile) {
        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;
  
        // Check if the selected file is a PDF and the size is within limits
        if (fileType === 'application/pdf' && fileSize <= 1048576) {
          const base64String: string = await fileToBase64(selectedFile); // Convert the file to base64
          if (this.employee && this.employee.designations && this.employee.designations[i]?.pivot) {
            this.employee.designations[i].pivot.order_path = base64String;
            console.log(this.employee.designations[i].pivot.order_path);
          }
        } else {
          let errorMessage = '';
          if (fileType !== 'application/pdf') {
            errorMessage = 'Please select a PDF file.';
          } else if (fileSize > 1048576) {
            errorMessage = 'File size exceeds the limit of 1 MB.';
          }

          if (errorMessage) {
            Swal.fire({
              icon: 'error',
              title: 'Invalid File',
              text: errorMessage,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to convert the file to base64:', error);
    }
  }


  // Order File Posting
  async onFileDivSelected(event: any, i: number) {
    const selectedFile = event.target.files[0];
   
    try {
      if (selectedFile) {
        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;
  
        // Check if the selected file is a PDF and the size is within limits
        if (fileType === 'application/pdf' && fileSize <= 1048576) {
          const base64String: string = await fileToBase64(selectedFile); // Convert the file to base64
          if (this.employee && this.employee.divisions && this.employee.divisions[i]?.pivot) {
            this.employee.divisions[i].pivot.order_path = base64String;
            console.log(this.employee.divisions[i].pivot.order_path);
          }
        } else {
          let errorMessage = '';
          if (fileType !== 'application/pdf') {
            errorMessage = 'Please select a PDF file.';
          } else if (fileSize > 1048576) {
            errorMessage = 'File size exceeds the limit of 1 MB.';
          }

          if (errorMessage) {
            Swal.fire({
              icon: 'error',
              title: 'Invalid File',
              text: errorMessage,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to convert the file to base64:', error);
    }
  }

  /****** Upload File Function End ****/

}
