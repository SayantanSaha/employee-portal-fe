import {Component, OnInit,} from '@angular/core';
import {EmployeeService} from "../employee.service";
import {User} from "../model/User";
import {Employee} from "../model/Employee";



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit{

  user:User = new User();
  employee: Employee | null = null;
  cardnumber:number =1;

  imageUrls: string[] = [
    'https://ih1.redbubble.net/image.1492450570.5434/flat,1000x1000,075,f.u1.jpg',
    'https://images.mid-day.com/images/images/2023/jan/droupadi-murmu-president-PTI_d.jpg',
    'https://i.pinimg.com/originals/49/32/ea/4932eadc4ab95268fb0caf51e7e1ccfb.jpg',
  ];

  currentImageUrl: string=this.imageUrls[0];
  currentIndex = 0;
  constructor(

    private employeeService: EmployeeService,
  ) {}


  ngOnInit() {
    let userString:string|null = sessionStorage.getItem('user')!=null?sessionStorage.getItem('user'):'[]';
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
  }

  changeBackgroundImage() {
    setInterval(() => {
      this.currentImageUrl = this.imageUrls[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.imageUrls.length;
    }, 7000); // Change image every 500 milliseconds (0.5 seconds)
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
    )}


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
    )}

}
