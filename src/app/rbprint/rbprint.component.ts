import {Component,ViewChild, Renderer2, ElementRef, AfterViewInit, Inject,OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {EmployeeService} from "../employee.service";
import {DatePipe} from "@angular/common";
import Swal from "sweetalert2";

@Component({
  selector: 'app-rbprint',
  // standalone: true,
  // imports: [],
  templateUrl: './rbprint.component.html',
  styleUrl: './rbprint.component.scss'
})
export class RbprintComponent implements OnInit{
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('captureButton', { static: false }) captureButton!: ElementRef<HTMLButtonElement>;

  ebaprintData:  any[] = [];
  Rfid:  any;
  fromfunction: any;
  isLoading: boolean = false;
  constructor(
    @Inject('BASE_URL') baseUrl: string,private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    // private renderer: Renderer2, private el: ElementRef,


  ) {}
  ngOnInit() {
    this.ebaprintData = history.state.employeeData;
    console.log(this.ebaprintData);
    this.fromfunction = history.state.fromfunction;
    console.log(this.fromfunction);

    if(!this.ebaprintData || this.ebaprintData.length==0) {
      this.employeeService.getRbPrintData().subscribe(
        (data: any) => {
          console.log(data);
          this.ebaprintData = data;
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


  }

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
  printData: any ;

  openebacardPopup(i:number) {
    this.ebacard = "block";
     this.printData=this.ebaprintData[i];
  }
  closeebacardPopup() {
    this.ebacard = "none";
  }


  printpage(i:number){
    if(this.ebaprintData[i].printed == true){
       this.router.navigate(['printPage'], { state: { printData: this.ebaprintData[i], fromUrl: 'rbprint' } });
    }
    else{
    this.employeeService.rbprintstatus( this.ebaprintData[i].id).subscribe(
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
    );}
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
      this.employeeService.rbrfid (this.Rfid, ebapassno).subscribe(
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
          },() => {
            this.isLoading = false; // Hide loading symbol
          }
      );
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'warning',
        text: 'rfid empty.',
      });
    }
  }

}
