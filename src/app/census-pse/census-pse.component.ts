import { Component, Inject, AfterViewInit } from '@angular/core';
import { User } from "../model/User";
import { Employee } from "../model/Employee";
import { EmployeeService } from "../employee.service";
import { ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { State } from "../model/State";
import { District } from "../model/District";
import { Designation } from "../model/Designation";
import { Division } from "../model/Division";
import { Relation } from "../model/Relation";
import { Servants } from "../model/Servants";

import { ServantRel } from "../model/ServantRel";
import { environment } from "../../environments/environment";
import { Idcards } from "../model/Idcards";
import { Vehicles } from "../model/Vehicles";
import { fileToBase64 } from "../profile/fileToBase64";
import { Router } from '@angular/router';
import { Organization } from "../model/Organization";
declare var jQuery: any;
declare var bootstrap: any;
import { S_employee } from '../model/S_employee';

@Component({
  selector: 'app-census-pse',
  // standalone: true,
  // imports: [],
  templateUrl: './census-pse.component.html',
  styleUrl: './census-pse.component.scss'
})
export class CensusPseComponent {

  id: string | null = null;
  employee: S_employee | null = null;

  constructor(
    @Inject('BASE_URL') baseUrl: string,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      const idNumber = +this.id;
      if (!isNaN(idNumber)) {
        const params = {
          emp_id: this.id,
          family: true,
          ebaCard: true,
          householdHelp: true,
          designations: true,
          postings: true,
        };
        this.employeeService.showEmployeeDetail(params).subscribe({
          next: (data) => {
           this.employee = data;
            console.log('Employee details:', this.employee);
          },
          error: (err) => {
            console.error('Error fetching employee details:', err);
          }
        });
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
