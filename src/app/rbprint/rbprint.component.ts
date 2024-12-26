import { Component, ViewChild, Renderer2, ElementRef, Inject, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { EmployeeService } from "../employee.service";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { DataTablesModule } from 'angular-datatables';
// import { MaterialModule } from 'angular-datatables';




@Component({
  selector: 'app-rbprint',
  // standalone: true,
  //  imports: [DataTablesModule,Mat],
  templateUrl: './rbprint.component.html',
  styleUrl: './rbprint.component.scss'
})
export class RbprintComponent implements OnInit {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('captureButton', { static: false }) captureButton!: ElementRef<HTMLButtonElement>;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;  // ViewChild for paginator
  // @ViewChild(MatSort) sort!: MatSort;

  ebaprintData: any[] = [];
  counts: any[] = [];
  Rfid: any;
  totalCounts: any = {};
  fromfunction: any;
  // displayedColumns: string[] = ['emp_name', 'card_no', 'valid_from', 'valid_to'];
  // dataSource = new MatTableDataSource<any>([]);
  isLoading: boolean = false;
  constructor(
    @Inject('BASE_URL') baseUrl: string, private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    // private renderer: Renderer2, private el: ElementRef,


  ) { }
  ngOnInit() {
    console.log('Component Initialized');

    // Check if data exists in history.state
    this.ebaprintData = history.state.employeeData || [];
    // console.log(this.ebaprintData);  // Corrected console log

    this.counts = history.state.count || [];
    // console.log(this.counts);  // Corrected console log

    this.fromfunction = history.state.fromfunction;
    console.log('Fetched data from history.state:', this.ebaprintData);
    console.log('From function:', this.fromfunction);

    if (this.ebaprintData.length === 0) {
      console.log('Fetching data from API...');
      this.employeeService.getRbPrintData().subscribe(
        (data: any) => {
          console.log('API data received:', data);
          if (data && data.length) {
            this.ebaprintData = data;
            // this.dataSource.data = this.ebaprintData;
          } else {
            console.warn('No data available from the API');
          }
        },
        error => {
          console.error('Error fetching data:', error);
          if (error.status === 404) {
            Swal.fire({
              icon: 'warning',
              title: 'US signature empty',
              text: 'US signature required !!!',
            });
          }
        }
      );
    }
     else {
      // this.dataSource.data = this.ebaprintData;
      this.calculateTotals();
    }
  }

  calculateTotals(): void {
    // Initialize totals with 0s
    this.totalCounts = {
      total_count: 0,
      perm: 0,
      temp: 0,
      g: 0,
      p: 0,
      r: 0,
      y: 0,
      b: 0,
      yp: 0
    };

    // Loop through the counts to calculate the total values
    for (const count of this.counts) {
      this.totalCounts.total_count += count?.total_count || 0;
      this.totalCounts.perm += count?.perm || 0;
      this.totalCounts.temp += count?.temp || 0;
      this.totalCounts.g += count?.g || 0;
      this.totalCounts.p += count?.p || 0;
      this.totalCounts.r += count?.r || 0;
      this.totalCounts.y += count?.y || 0;
      this.totalCounts.b += count?.b || 0;
      this.totalCounts.yp += count?.yp || 0;
    }
  }

  // ngAfterViewInit() {
  //   console.log('After View Init');
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
        this.videoElement.nativeElement.play();
        this.videoElement.nativeElement.style.display = 'block';
        this.captureButton.nativeElement.style.display = 'block';
      }).catch(error => {
        console.error('Error accessing the camera', error);
      });
    } else {
      alert('Camera not supported by your browser');
    }
  }

  takePhoto() {
    const context = this.canvasElement.nativeElement.getContext('2d');
    if (context) {
      context.drawImage(this.videoElement.nativeElement, 0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
      const imageData = this.canvasElement.nativeElement.toDataURL('image/png');
      console.log(imageData); // This is the base64 encoded image data
      this.videoElement.nativeElement.style.display = 'none';
      this.captureButton.nativeElement.style.display = 'none';
      // You can now use the image data (e.g., upload to a server, display in the UI, etc.)
    } else {
      console.error('Error: Could not get 2D context');
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

  ebacard: any = 'none';
  printData: any;

  openebacardPopup(i: number) {
    this.ebacard = "block";
    this.printData = this.ebaprintData[i];
  }
  closeebacardPopup() {
    this.ebacard = "none";
  }

  editcard: any = 'none';
  openeditcardPopup(i: number) {
    this.editcard = "block";
    this.printData = this.ebaprintData[i];
  }
  closeeditcardPopup() {
    this.editcard = "none";
  }



  printpage(i: number) {
    if (this.ebaprintData[i].printed == true) {
      this.router.navigate(['printPage'], { state: { printData: this.ebaprintData[i], fromUrl: 'rbprint' } });
    }
    else {
      this.employeeService.rbprintstatus(this.ebaprintData[i].id).subscribe(
        // On success
        () => {
          this.router.navigate(['printPage'], { state: { printData: this.ebaprintData[i], fromUrl: 'rbprint' } });
        },
        // On error
        (error) => {
          console.log(error);
          console.log(error.status);
          console.log(error.error);
          // Handle other errors here
          console.error('An error occurred:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while opening print page.',
          });
        }
      );
    }
  }



  // ngAfterViewInit() {
  //   // Add 'print' class to elements you want to print
  //   this.renderer.addClass(this.el.nativeElement.querySelector('.print'), 'print');
  // }

  rfid(ebapassno: any) {
    // Check if RFID is available and not null
    if (this.Rfid && this.Rfid !== null) {
      this.isLoading = true;
      // Call the employeeService to update EBA pass using RFID and ebapassno
      this.employeeService.rbrfid(this.Rfid, ebapassno).subscribe(
        // On success
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Updated successfully', // Corrected spelling here
          }).then(() => {
            location.reload();
          });
        },
        // On error
        (error) => {
          console.log(error);
          console.log(error.status);
          console.log(error.error);
          // Handle other errors here
          console.error('An error occurred:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while updating EBA.',
          });
        }, () => {
          this.isLoading = false; // Hide loading symbol
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'warning',
        text: 'rfid empty.',
      });
    }
  }


  saveIdcards(printData: any) {
    if (printData != null) {
      this.employeeService.updateId_card(printData).subscribe(
        p => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Idcard has been updated successfully',
          });
        },
        e => {
          console.log(e);
          if (e.status === 302) {
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'Previous Record Not Approved !!!',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Idcard details have not been Updated successfully.',
            });
          }
          // Swal.fire({
          //   icon: 'error',
          //   title: 'error',
          //   text: 'Promotion details have not been Updated successfully.',
          //   showConfirmButton: false,
          //   timer: 1500 // Automatically close after 1.5 seconds
          // });
        }
      );
    }

  }


}
