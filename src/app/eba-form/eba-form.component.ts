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
// import {DatePipe} from "@angular/common";
declare var jQuery: any;

@Component({
  selector: 'app-eba-form',
  templateUrl: './eba-form.component.html',
  styleUrls: ['./eba-form.component.scss']
})
export class EbaFormComponent {
  servantDetails: any[] = [];
  memberEbaPasses: any[] = [];


  // member = {
  //   pivot: {
  //     eba_passes: [{
  //       emp_rel_id: null,
  // eba_pass_no: null,}
  //     ],
  //   },
  // };
  //
  // servant = {
  //   eba_passes: [
  //     {
  //       servant_id: null,
  //       living_at_president_sect: null,
  //       curr_address: null,
  //       perm_address: null,
  //       last_5yr_address: null,
  //       Reference_1_name: null,
  //       reference_1_phone_no: null,
  //       reference_1_address: null,
  //       reference_2_name: null,
  //       reference_2_phone_no: null,
  //       reference_2_address: null,
  //     }
  //   ],
  // };
  // eba_pass: any[] = [
  //   {
  //     emp_rel_id: null,
  //     eba_pass_no: null,
  //     servant_id: null,
  //     living_at_president_sect: null,
  //     curr_address: null,
  //     perm_address: null,
  //     last_5yr_address: null,
  //     Reference_1_name: null,
  //     reference_1_phone_no: null,
  //     reference_1_address: null,
  //     reference_2_name: null,
  //     reference_2_phone_no: null,
  //     reference_2_address: null,
  //   },
  //   // You can add more elements as needed
  // ];
  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    // private datePipe: DatePipe,
  ) {
    // if (this.employee && this.employee.relations) {
    //   this.employee.relations.forEach((relation, i) => {
    //     this.emp_rel_detail[i] = {
    //       emp_rel_id: relation.pivot.id,
    //       eba_pass_no: null  // or any default value
    //     };
    //   });
    // }
  }
    employee:Employee| null = null;


    states:State[]=[];
    currDistricts:District[]=[];
    permDistricts:District[]=[];
    designations:Designation[]=[];
    divisions:Division[]=[];
    relations:Relation[]=[];
    eba_passes: any[] = [];
    servants: Servants[] = [];
    servantRel: ServantRel[] = [];
    vehicles: Vehicles[]=[];
    apiUrl = environment.apiUrl;
    divisiontypelist: any[] = [];  // Initialize as an empty array or with appropriate data type
    relationstypelist: any[] = [];
    editable:boolean = false;
    mode:string|null = null;
    ngOnInit() {

      this.mode = this.route.snapshot.paramMap.get('mode');
      this.setEditable(this.mode=='edit');


    this.route.params.subscribe(params => {
      const id = +params['id']; // Extract id from route parameters
      // Check if 'id' parameter exists in the URL
      if (params.hasOwnProperty('id')) {
        const id = params['id'];

        this.employeeService.getEmpProfile(id).subscribe(
          data=>{
            this.employee = data;

            this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
            this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
          }
        );
      } else {
        this.employeeService.getMyProfile().subscribe(
          data=>{
            this.employee = data;

            this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
            this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
          }
        );
      }
    });




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

    this.employeeService.getDivisionMasterList().subscribe(
      data=>this.divisiontypelist=data,
      error => console.log(error)
    );

    this.employeeService.getDependents(1).subscribe(
      data=>this.relations=data,
      error => console.log(error)
    );

    this.employeeService.getRelationMasterList().subscribe(
      data=>this.relationstypelist=data,
      error => console.log(error)
    );

    this.employeeService.getServants(1).subscribe(
      data=>this.servants=data,
      error => console.log(error)
    );

    this.employeeService.getServantsRel(1).subscribe(
      data=>this.servantRel=data,
      error => console.log(error)
    );

      this.employeeService.getVehicle(1).subscribe(
          data=>this.vehicles=data,
          error => console.log(error)
      );


  }
  // formatDate(date: Date | null): string {
  //
  //   // if (!date) {
  //   //   return 'N/A';
  //   // }
  //
  //   // return date.toString(); // Change this to your date formatting logic
  //   return this.datePipe.transform(date, 'dd MMM YYYY') || 'N/A';
  // }

    async getDistricts(state:State){
        let districts:District[] = [];
        if(state!=null)
        {
            districts = await this.employeeService.getDistrictsByState(state.id!);
        }
        return districts;
    }
  getActiveDesignations(designations: Designation[]): string {
    const activeDesignations = designations
        .filter(designation => designation.pivot.active == true)
        .map(designation => designation.desg_desc);

    return activeDesignations.join(', ');
  }
  getActiveDivision(division:Division[]): string {
    const activeDivision = division
        .filter(division => division.pivot.active == true)
        .map(division => division.div_desc);

    return activeDivision.join(', ');
  }
  getActiveIdCard(IdCards: Idcards[]): string {
    const activeIdCard = IdCards
        .filter(idCard => idCard.active == true)
        .map(idCard => idCard.card_no);

    return activeIdCard.join(', ');
  }

  hasRelIdMatch(eba_passes: any[], memberId: any): boolean {
    return eba_passes.some(eba_passes => eba_passes.emp_rel_id === memberId);
  }

  hasServantIdMatch(eba_passes: any[], servantId: any): boolean {
    return eba_passes.some(eba_passes => eba_passes.servant_id === servantId);
  }

  // onMobileNoInput(event: any, i: number): void {
  //   if (this.eba_pass.reference_1_phone_no !== null) {
  //     // Get the input value
  //     const inputValue = event.target.value;
  //
  //     // Remove non-numeric characters using a regular expression
  //     const numericValue = inputValue.replace(/[^0-9]/g, '');
  //
  //     // Update the input value
  //     event.target.value = numericValue;
  //
  //     // Update the ngModel bound variable (if necessary)
  //       this.eba_pass.reference_1_phone_no = numericValue;
  //
  //   }
  //   if (this.eba_pass.reference_2_phone_no !== null) {
  //     // Get the input value
  //     const inputValue = event.target.value;
  //
  //     // Remove non-numeric characters using a regular expression
  //     const numericValue = inputValue.replace(/[^0-9]/g, '');
  //
  //     // Update the input value
  //     event.target.value = numericValue;
  //
  //     // Update the ngModel bound variable (if necessary)
  //     this.eba_pass.reference_2_phone_no = numericValue;
  //
  //   }
  // }

  setEditable(status:boolean){
    this.editable = status;
  }

  applyEba() {
    if (this.employee && this.employee.relations && this.employee.out_house) {
      const ebaPassesToSubmit = this.employee.relations
          .filter(member => member.pivot.eba_passes && member.pivot.eba_passes.length > 0)
          .map(member => member.pivot.eba_passes)
          .flat();

      const servantDetailsToSubmit = this.employee?.out_house
          ?.map(outhouse => outhouse.servants)
          .flat()
          .map(servant => servant.eba_passes)
          .flat();

        this.employeeService.applyeba(ebaPassesToSubmit,servantDetailsToSubmit).subscribe(
    // if (this.validationErrors.length > 0) {
    //
    //   const errorMessage = this.validationErrors
    //       .map((error, index) => `${index + 1}. ${error}`)
    //       .join('\n');
    //
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     html: errorMessage.replace(/\n/g, '<br/>'),
    //     width: 'auto', // Adjust as needed
    //   });
    //   return; // Exit without calling the API
    // }

    // Validation true then Api call otherwise please check

        // data=>console.log(data),
        // error=>console.log(error)

        //Changes By Ravikant
        data => {
          console.log(data);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Eba application applied successfully and pending for approval',
            // }).then((result) => {
            //   if (result.isConfirmed) {
            //     // Redirect to the desired page
            //     window.location.reload();
            //   }
          });
        },
        (error) => {
          console.log(error);
          console.log(error.status);
          console.log(error.error);
          if(error.status === 302){
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'Previous Record is still pending !!!',
            });
          }else if(error.status === 303){
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'you already have a approved application',
            });
          }else{
            Swal.fire({
              icon: 'error',
              title: 'API Error',
              text: 'An error occurred while updating.',
            });
          }


        }

    );

  }
}

}
