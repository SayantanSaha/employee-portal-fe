import { Component,Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {EmployeeService} from "../employee.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-ebaprint',
  templateUrl: './ebaprint.component.html',
  styleUrls: ['./ebaprint.component.scss']
})
export class EbaprintComponent {
  ebaprintData:  any[] = [];
  constructor(

    // private renderer: Renderer2, private el: ElementRef,
    private employeeService: EmployeeService,

  ) {}
  ngOnInit() {
    this.employeeService.getEbaPrintData().subscribe(
      (data: any) => {
        console.log(data);
        this.ebaprintData = data;
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
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

  ebacard: any = 'none';
   printData: any ;

  openebacardPopup(i:number) {
    this.ebacard = "block";
     this.printData=this.ebaprintData[i];
  }
  closeebacardPopup() {
    this.ebacard = "none";
  }

  // ngAfterViewInit() {
  //   // Add 'print' class to elements you want to print
  //   this.renderer.addClass(this.el.nativeElement.querySelector('.print'), 'print');
  // }

  print(){
    window.print();
  }
}
