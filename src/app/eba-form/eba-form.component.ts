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

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    // private datePipe: DatePipe,
  ) {}
    employee:Employee| null = null;


    states:State[]=[];
    currDistricts:District[]=[];
    permDistricts:District[]=[];
    designations:Designation[]=[];
    divisions:Division[]=[];
    relations:Relation[]=[];
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

  setEditable(status:boolean){
    this.editable = status;
  }

  applyEba() {
    this.employeeService.applyeba().subscribe(
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
