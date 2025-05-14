import { Component, Renderer2, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { EmployeeService } from "../employee.service";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";


@Component({
  selector: 'app-ebaprint',
  templateUrl: './ebaprint.component.html',
  styleUrls: ['./ebaprint.component.scss']
})

export class EbaprintComponent {
  ebaprintData: any[] = [];
  empPrintData: any[] = [];
  empreportData: any[] = [];
  oldebaprintData : any[] = [];
  selectedCardType: string = 'eba';
  Rfid: any;
  fromfunction: any;
  isLoading: boolean = false;
  constructor(
    @Inject('BASE_URL') baseUrl: string, private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    // private renderer: Renderer2, private el: ElementRef,


  ) { }
  ngOnInit() {
    this.ebaprintData = history.state.employeeData;
    console.log(this.ebaprintData);
    this.fromfunction = history.state.fromfunction;
    console.log(this.fromfunction);

    if (this.fromfunction == 'totalpass') {
      this.ebaprintData = history.state.employeeData.eba_Passes;
      this.empreportData = history.state.employeeData.emp_passes;
      this.oldebaprintData = history.state.employeeData.old_ebapasses;
      console.log(this.ebaprintData);
    }

    if (!this.ebaprintData || this.ebaprintData.length == 0) {
      this.employeeService.getEbaPrintData().subscribe(
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
      this.employeeService.getEmpPrintData().subscribe(
        (data: any) => {
          console.log(data);
          this.empPrintData = data;
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
  wpdata: any;

  openebacardPopup(i: number) {
    this.wpdata = "eba";
    this.ebacard = "block";
    this.printData = this.ebaprintData[i];
  }
  closeebacardPopup() {
    this.wpdata = null;
    this.ebacard = "none";
  }

  openempcardPopup(i: number) {
    this.wpdata = "emp";
    this.ebacard = "block";
    this.printData = this.empPrintData[i];
  }


  printpage(i: number) {
    if (this.ebaprintData[i].printStatus == true) {
      this.router.navigate(['printPage'], { state: { printData: this.ebaprintData[i], fromUrl: 'ebaprint' } });
    }
    else {
      this.employeeService.printstatus(this.ebaprintData[i].id).subscribe(
        // On success
        () => {
          this.router.navigate(['printPage'], { state: { printData: this.ebaprintData[i], fromUrl: 'ebaprint' } });
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
        }
      );
    }
  }

  printemppage(i: number) {
    if (this.empPrintData[i].printStatus == true) {
      this.router.navigate(['printPage'], { state: { printData: this.empPrintData[i], fromUrl: 'empprint' } });
    }
    else {
      this.employeeService.EMPprintstatus(this.empPrintData[i].id).subscribe(
        // On success
        () => {
          this.router.navigate(['printPage'], { state: { printData: this.empPrintData[i], fromUrl: 'empprint' } });
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
            text: 'An error occurred while updating EMP.',
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
      if (this.wpdata == 'eba') {
        this.employeeService.RFID(this.Rfid, ebapassno).subscribe(
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
      } if (this.wpdata == 'emp') {
        this.employeeService.empRFID(this.Rfid, ebapassno).subscribe(
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
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'warning',
        text: 'rfid empty.',
      });
    }
  }


  isEditable: boolean = false;

toggleEditMode() {
  this.isEditable = !this.isEditable;
  if (this.isEditable ==true && this.selectedCardType == 'old_eba') {
    this.selectedCardType = "eba";
  }
}

selectedEmp: any = null;
tempActive: any = null;
showEditPopup: boolean = false;

openeditempCard(index: any) {
  this.selectedEmp = { ...this.empreportData[index] }; // clone to avoid direct mutation
  this.tempActive = this.selectedEmp.active;
  this.showEditPopup = true;
}

saveChanges() {
  this.employeeService.EMPdeactivate(this.selectedEmp.id).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Updated successfully',
      });

      // Find and update the data in your empreportData array
      const index = this.empreportData.findIndex(emp => emp.id === this.selectedEmp.id);
      if (index !== -1) {
        this.empreportData[index].active = this.selectedEmp.active;
      }

      this.closePopup(true);
    },
    error: (error) => {
      console.error('Update failed', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update employee status.',
      });
    }
  });
}


closePopup(saved: boolean = false) {
  if (!saved && this.selectedEmp) {
    this.selectedEmp.active = this.tempActive; // revert if not saved
  }
  this.selectedEmp = null;
  this.tempActive = null;
  this.showEditPopup = false;
}

selectedEba: any = null;
tempRelActive: any = null;
showEbaEditPopup: boolean = false;

openeditebaCard(index: number) {
  this.selectedEba = { ...this.ebaprintData[index] }; // clone
  this.tempRelActive = this.selectedEba.rel_active;
  this.showEbaEditPopup = true;
}

saveEbaChanges() {
  this.employeeService.Ebadeactivate(this.selectedEba.ep_id).subscribe({
    next: () => {
      // Find and update the local array after successful backend update
      const index = this.ebaprintData.findIndex(e => e.id === this.selectedEba.id);
      if (index !== -1) {
        this.ebaprintData[index].rel_active = this.selectedEba.rel_active;
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Updated successfully',
      });

      this.closeEbaPopup(true);
    },
    error: (err) => {
      console.error('Failed to update status', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update EBA status',
      });

      this.closeEbaPopup(false);
    }
  });
}


closeEbaPopup(saved: boolean = false) {
  if (!saved && this.selectedEba) {
    this.selectedEba.rel_active = this.tempRelActive; // revert to original
  }
  this.selectedEba = null;
  this.tempRelActive = null;
  this.showEbaEditPopup = false;
}


}
