import { Component } from '@angular/core';
import {DatePipe, NgIf, UpperCasePipe} from "@angular/common";
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
        UpperCasePipe
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
  printbutton: boolean = true;

  ngOnInit(): void {
    // Retrieve data from router state
    this.printData = history.state.printData;
    this.fromUrl=history.state.fromUrl;
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


  print(){

      window.print();
  }

}
