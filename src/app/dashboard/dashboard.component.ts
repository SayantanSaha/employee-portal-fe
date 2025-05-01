import { Component, OnInit, } from '@angular/core';
import { EmployeeService } from "../employee.service";
import { User } from "../model/User";
import { Employee } from "../model/Employee";
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {

  user: User = new User();
  employee: Employee | null = null;
  cardnumber: number = 1;

  imageUrls: string[] = [
    'https://ih1.redbubble.net/image.1492450570.5434/flat,1000x1000,075,f.u1.jpg',
    'https://images.mid-day.com/images/images/2023/jan/droupadi-murmu-president-PTI_d.jpg',
    'https://i.pinimg.com/originals/49/32/ea/4932eadc4ab95268fb0caf51e7e1ccfb.jpg',
  ];

  currentImageUrl: string = this.imageUrls[0];
  currentIndex = 0;
  employeeInfoShow = false;
  ebaShow = false;
  ebaprint = false;
  rbCardShow = false;
  eVaahanShow = false;
  reportShow = false;
  sportsReportShow = false;
  verifyHouse = false;
  constructor(
    private router: Router,
    private employeeService: EmployeeService,
  ) {

  }


  ngOnInit() {

    let userString: string | null = sessionStorage.getItem('user') != null ? sessionStorage.getItem('user') : '[]';
    this.user = JSON.parse(userString!);

    this.changeBackgroundImage();

    this.employeeService.getMyProfile().subscribe(
      (data: Employee) => {
        this.employee = data;
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );

    if (!this.user.card_valid && this.user.color) {
      Swal.fire({
        title: 'Rb Card expired',
        text: 'Your Rb Crad has expired.',
        icon: 'warning',
      })
    }
    this.setRoleFlags();

    this.employeeService.getLocationType().subscribe(
      data => this.locationtypelist = data,
      error => console.log(error)
    );

    // this.employeeService.checkRbexpDate().subscribe(
    //   data => {
    // this.cardValid = data;
    // Swal.fire({
    //   title: 'Rb Card expired',
    //   text: 'Your Rb Crad has expired.',
    //   icon: 'warning',
    // })
    //   },
    //   error => {
    //     console.error('Something Went wrong while validating your card:', error);
    //   }
    // );

  }

  changeBackgroundImage() {
    setInterval(() => {
      this.currentImageUrl = this.imageUrls[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.imageUrls.length;
    }, 7000); // Change image every 500 milliseconds (0.5 seconds)
  }

  setRoleFlags() {
    if (this.user.role.includes(1)) {
      this.employeeInfoShow = true;
    }
    if ([4, 5, 6, 9, 10, 2].some(role => this.user.role.includes(role))) {
      this.ebaShow = true;
    }
    if ([21].some(role => this.user.role.includes(role))) {
      this.ebaprint = true;
    }
    if ([11, 12, 13, 14, 17, 2].some(role => this.user.role.includes(role))) {
      this.rbCardShow = true;
    }
    if ([19, 20].some(role => this.user.role.includes(role))) {
      this.eVaahanShow = true;
    }
    if (this.user.role.includes(2)) {
      this.reportShow = true;
      this.sportsReportShow = true;
      this.verifyHouse = true;
    }
  }

  addHoverClass() {
    const card = document.querySelector('.card');
    if (card) {
      card.classList.add('hovered');
    }
  }

  removeHoverClass() {
    const card = document.querySelector('.card');
    if (card) {
      card.classList.remove('hovered');
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

  hasValidRole(): boolean {
    if (!this.user || !this.user.role) {
      return false;
    }
    const roles = this.user.role;
    return roles.length > 0 && roles.some((r: number) => r !== 3);
  }

  applyEvahaan() {
    this.employeeService.applyEvahaan().subscribe(
      (data: any) => {
        console.log(data);

        // Open the URL in a new tab
        window.open(data, '_self');

        // Swal.fire({
        //   icon: 'success',
        //   title: 'Success',
        //   text: 'Eba application applied successfully and pending for approval',
        //   // }).then((result) => {
        //   //   if (result.isConfirmed) {
        //   //     // Redirect to the desired page
        //   //     window.location.reload();
        //   //   }
        // });
      },
      (error) => {
        console.log(error);
        console.log(error.status);
        console.log(error.error);
        // if(error.status === 302){
        //   Swal.fire({
        //     icon: 'warning',
        //     title: 'Warning',
        //     text: 'Previous Record is still pending !!!',
        //   });
        // }else if(error.status === 303){
        //   Swal.fire({
        //     icon: 'warning',
        //     title: 'Warning',
        //     text: 'you already have a approved application',
        //   });
        // }else{
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'API Error',
        //     text: 'An error occurred while updating.',
        //   });
        // }


      }
    )
  }


  applyParkingSticker() {
    this.employeeService.applyParkingSticker().subscribe(
      (data: any) => {
        console.log(data);
        window.open(data, '_self');
      },
      (error) => {
        console.log(error);
        console.log(error.status);
        console.log(error.error);

      }
    )
  }

  showNotification: boolean = true;

  // Function to hide the notification when the close button is clicked
  dismissNotification(): void {
    this.showNotification = false;
  }




  displayEba: any = 'none';
  locationtypelist: any[] = [];
  blockstypelist: any[] = [];
  quarterList: any[] = [];
  quarterstypelist: any[] = [];
  showquarterDetails: boolean = false;
  quarterDetails: any = null;
  pullEbaPopup() {
    this.displayEba = "block";
  }
  closeEbaPopup() {
    this.showquarterDetails = false;
    this.displayEba = "none";
  }

   qtrtype() {
      this.blockstypelist = [];
      this.quarterList = [];
      this.employee!.qtr = null;
      this.employeeService.getQuarterType(this.employee!.location_id!).subscribe(
        data => this.quarterstypelist = data,
        error => console.log(error)
      );
    }
    qtraddress(event: Event) {
      this.blockstypelist = [];
      this.quarterList = [];
      this.employee!.qtr = null;
      const selectElement = event.target as HTMLSelectElement;
      const typeName = selectElement.options[selectElement.selectedIndex]?.text?.trim();

      if (typeName == "Type - I" || typeName == "Servant Qtr") {
        this.employeeService.getBlockType().subscribe(
          data => {
            this.employee!.blck = 'T';
            this.blockstypelist = data.filter(block => block.choice === 1);
          },
          error => console.log(error)
        );
      }

      else if (this.employee!.qtr_code! == '14' || this.employee!.qtr_code! == '11') {
        this.employeeService.getBlockType().subscribe(
          data => {
            this.employee!.blck = 'T';
            this.blockstypelist = data.filter(block => block.choice === 2);
          },
          error => console.log(error)
        );
      }

      else {
        this.blockstypelist = [];
        this.employee!.blck = 'T';
        this.employeeService.getQuarterdetail(this.employee!.qtr_code!, this.employee!.location_id!, this.employee!.blck).subscribe(
          (data: any) => {
            this.quarterList = data;
          },
          (error) => {
            console.log(error);
            if (error.status === 404) {
              this.quarterList = [];
              this.employee!.qtr = null;
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'empty quarter details .',
              });
            }
            if (error.status === 400) {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Something went wrong.',
              });
            }
          }
        );
      }
    }
    qtrBlckaddress() {
      this.employee!.qtr = null;
      this.employeeService.getQuarterdetail(this.employee!.qtr_code!, this.employee!.location_id!, this.employee!.blck!).subscribe(
        (data: any) => {
          this.quarterList = data;
        },
        (error) => {
          console.log(error);
          if (error.status === 404) {
            this.quarterList = [];
            this.employee!.qtr = null;
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'empty quarter details .',
            });
          }
          if (error.status === 400) {
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'Something went wrong.',
            });
          }
        }
      );
    }


    fetch() {
      this.employeeService.showmemberbyeba(this.employee!.qtr!.allotment_id).subscribe(
        (data: any) => {
          this.quarterDetails = data;
          this.showquarterDetails = true;
        }, (error) => {
          if (error.status === 404) {
            Swal.fire({
              icon: 'warning',
              title: 'empty',
              text: 'empty data!!!!',
            });
          }
        }
      );
    }

    PullEba() {
      this.employeeService.getEbaForm(this.quarterDetails!, this.employee!.qtr!).subscribe(
        (data: any) => {
          // console.log(['/eba-form/edit/relative/' + data]);
          this.router.navigate(['/census-Pse/' + data]);
        },
        (error) => {
          // Error response
          console.log(error); // Log the error if needed
          if (error.status === 401) {
            Swal.fire({
              icon: 'warning',
              title: 'warning',
              text: 'empty quarter details!!!!',
            });
          }
          if (error.status === 404) {
            Swal.fire({
              icon: 'warning',
              title: 'warning',
              text: 'empty quarter info!!!!',
            });
          }
          if (error.status === 400) {
            Swal.fire({
              icon: 'warning',
              title: 'warning',
              text: 'Not eligible!!!!',
            });
          }
        }
      );
    }


}
