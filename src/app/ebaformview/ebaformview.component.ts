import { Component,OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../model/Employee';
import { Router } from '@angular/router';
import {Designation} from "../model/Designation";
import {Division} from "../model/Division";
import {Idcards} from "../model/Idcards";

@Component({
  selector: 'app-ebaformview',
  templateUrl: './ebaformview.component.html',
  styleUrls: ['./ebaformview.component.scss']
})
export class EbaformviewComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  employee: any;

  ngOnInit(): void {
    // Retrieve data from router state
    this.employee = history.state.employeeData;
    console.log(this.employee);
  }

  getActiveDesignations(designations: Designation[]): string {
    const activeDesignations = designations
      .filter(designation => designation.pivot.active == true)
      .map(designation => designation.desg_desc);

    return activeDesignations.join(', ');
  }

  getActiveDivision(division: Division[]): string {
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

  openImageInNewTab(i: number, j: number) {
    const encodedImage = encodeURIComponent(this.employee.relations[i].pivot.eba_passes[j].photo_path);
    const imageWindow = window.open();
    if (imageWindow) {
      imageWindow.document.write(`<img src="${encodedImage}" alt="Photo">`);
      imageWindow.document.close();
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
