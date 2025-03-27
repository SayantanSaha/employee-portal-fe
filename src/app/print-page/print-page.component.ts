import { Component } from '@angular/core';
import {DatePipe, JsonPipe, NgIf, NgStyle, UpperCasePipe} from "@angular/common";
import {NgxBarcode6Module} from "ngx-barcode6";
import {NgxPrintDirective} from "ngx-print";
import {EmployeeService} from "../employee.service";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-print-page',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgxBarcode6Module,
    NgxPrintDirective,
    UpperCasePipe,
    JsonPipe,
    NgStyle
  ],
  templateUrl: './print-page.component.html',
  styleUrl: './print-page.component.scss'
})
export class PrintPageComponent {

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  employee: any;
  apiUrl = environment.apiUrl;
  fromUrl: string='';
  printData: any ;
  allDesignations: any[] = [];

  passTypes:any= [
    { id: 1, imagePath: 'assets/images/pass_frontG.png' },
    { id: 2, imagePath: 'assets/images/pass_frontPc.png' },
    { id: 3, imagePath: 'assets/images/pass_frontR.png' },
    { id: 4, imagePath: 'assets/images/pass_frontY.png' }];
    // Add more pass types as needed

  printbutton: boolean = true;

  ngOnInit(): void {
    // Retrieve data from router state
    this.printData = history.state.printData;
    this.fromUrl=history.state.fromUrl;
    this.employeeService.getOrganizations().subscribe(
      data => {
        this.offices = data.filter(org => org.org_type === 'Emp');
        this.findDesg();
      },
      error => console.log(error)
    );
    this.employeeService.getStates().subscribe(
      data => this.states = data,
      error => console.log(error)
    );

    this.employeeService.getDesignations('all').subscribe(
      data => this.allDesignations = data,
      error => console.log(error)
    );

    if (this.printData.eba_application_details?.curr_state) {
      this.loadDistricts(this.printData.eba_application_details.curr_state);
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

  printbuttonchange(){
    this.printbutton=false;

  }

  getPassTypeImage(): string {
    const passType = this.passTypes.find((pt: { id: any; }) => pt.id === this.printData.card_type_id);
    return passType ? passType.imagePath : '';
  }

  shouldRenderPassType(): boolean {
    return this.printData.card_type_id && this.passTypes.some((pt: { id: any; }) => pt.id === this.printData.card_type_id);
  }
  print(){

      window.print();
  }
  officeDesignations: any[] = [];
  offices: any[] = [];
  states: any[] = [];
  currDistricts: any[] = [];



  getDesignationDesc(code: any): string {
    const designation = this.allDesignations.find(d => d.id === code);
    return designation ? designation.desg_desc : 'N/A';
  }
  getOfficeDesc(code: any): string {
    const office = this.offices.find(o => o.id === code);
    return office ? office.org_desc : 'N/A';
  }
  findDesg() {
    const selectedOffice = this.offices.find(office => office.id === this.printData.eba_application_details?.office_code);
    if (selectedOffice) {
      this.employeeService.getDesignations(selectedOffice.id).subscribe(
        data => this.officeDesignations = data,
        error => console.log(error)
      );
    } else {
      console.log('No matching office found');
    }
  }

  loadDistricts(stateId: any) {
    this.employeeService.getDistrictsByState(stateId)
      .then(districts => {
        this.currDistricts = districts;
      });
  }

  getStateName(stateId: any): string {
    const state = this.states.find(s => s.id === stateId);
    return state ? state.state_name ?? 'N/A' : 'N/A';
  }

  getDistrictName(districtId: any): string {
    const district = this.currDistricts?.find(d => d.id === districtId);
    return district ? district.district_name ?? 'N/A' : 'N/A';
  }


}
