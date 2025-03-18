import { Component, Inject } from '@angular/core';
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

@Component({
  selector: 'app-emp-form',
  // standalone: true,
  // imports: [],
  templateUrl: './emp-form.component.html',
  styleUrl: './emp-form.component.scss'
})
export class EmpFormComponent {
  baseUrl: string = '';
  minDate: string;


  constructor(
    @Inject('BASE_URL') baseUrl: string, private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.baseUrl = baseUrl;
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  user: User = new User();
  states: State[] = [];
  designations: any[] = [];
  currDistricts: District[] = [];
  officeDesignations: any[] = [];
  allDesignations: any[] = [];
  apiUrl = environment.apiUrl;
  id: string | null = null;
  remark: string | null = null;
  file_path: string | null = null;
  file_path_64: string | null = null;
  isLoading: boolean = false;
  maxDate: string = "";
  EmpCardData: any;
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  ngOnInit() {
    const today = new Date();
    const Myear = today.getFullYear();
    const Mmonth = (today.getMonth() + 1).toString().padStart(2, '0'); // Zero-padded month
    const Mday = today.getDate().toString().padStart(2, '0'); // Zero-padded day

    this.maxDate = `${Myear}-${Mmonth}-${Mday}`;

    this.isLoading = true;


    let userString: string | null = sessionStorage.getItem('user') != null ? sessionStorage.getItem('user') : '[]';
    this.user = JSON.parse(userString!);

    if (this.user && this.user.role && this.user.role.some((role: number) => (role === 5 || role == 6 || role == 4 || role == 9 || role == 10 || role == 2))) {
      this.id = this.route.snapshot.paramMap.get('id');

    }

    if (this.id) {

      const idNumber = +this.id;
      if (!isNaN(idNumber)) {
        if (this.user && this.user.role && this.user.role.some((role: number) => (role === 5 || role == 6 || role == 4 || role == 9 || role == 10 || role == 2))) {
          this.employeeService.getEbaProfile(idNumber).subscribe(
            (data: any) => {
              this.EmpCardData = data;
              if (!this.EmpCardData.app || this.EmpCardData.app !== "EMP Application") {
                Swal.fire({
                  icon: 'warning',
                  title: 'Not Allowed',
                  text: 'You are not allowed to go back!',
                  confirmButtonText: 'OK'
                }).then(() => {
                  // Prevent back navigation
                  this.router.navigate(['ebapanel']);
                });
              }

              if (this.EmpCardData.curr_state && this.EmpCardData.curr_district) {
                this.employeeService.getDistrictsByState(this.EmpCardData.curr_state)
                  .then(districts => this.currDistricts = districts);
              }
            }
          );
        }
        else {
          Swal.fire({
            icon: 'warning',
            title: 'Not Allowed',
            text: 'You are not allowed to go back!',
            confirmButtonText: 'OK'
          }).then(() => {
            // Prevent back navigation
            this.router.navigate(['ebapanel']);
          });
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Not Allowed',
          text: 'You are not allowed to go back!',
          confirmButtonText: 'OK'
        }).then(() => {
          // Prevent back navigation
          this.router.navigate(['ebapanel']);
        });
      }
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
      //
      // this.employeeService.getDesignations(1).subscribe(
      //   data => this.designations = data,
      //   error => console.log(error)
      // );

      // this.employeeService.getOrganizations().subscribe(
      //   data => this.orglist = data,
      //   error => console.error(error)
      // );

      this.isLoading = false;
    }

    this.employeeService.getDesignations('all').subscribe(
      data => this.allDesignations = data,
      error => console.log(error)
    );


    //   setexpdate() {
    //     const today = new Date();

    //     if ((this.employee!.family && this.employee!.family.length > 0) || (this.employee!.closefamily && this.employee!.closefamily.length > 0)) {
    //       const fiveYearsLater = new Date();
    //       fiveYearsLater.setFullYear(today.getFullYear() + 5);
    //       const formattedDate = this.formatDate(fiveYearsLater);

    //       const onemonthLater = new Date();
    //       onemonthLater.setMonth(onemonthLater.getMonth() + 1);
    //       const onemonthformat = this.formatDate(onemonthLater);

    //       this.employee!.family?.forEach(member => {
    //         member.pivot.eba_passes?.forEach(ebapass => {
    //           if (member.id !== 27) {
    //             if (!ebapass.eba_pass_exp_date_edited && formattedDate <= this.employee!.dor && this.employee?.dh) {
    //               ebapass.eba_pass_exp_date_edit = formattedDate;
    //             }
    //             if (formattedDate > this.employee!.dor && this.employee?.dh && !ebapass.eba_pass_exp_date_edited) {
    //               ebapass.eba_pass_exp_date_edit = this.employee!.dor;
    //             }
    //           }
    //           if (member.id === 27) {
    //             if (!ebapass.eba_pass_exp_date_edited && onemonthformat <= this.employee!.dor && this.employee?.dh) {
    //               ebapass.eba_pass_exp_date_edit = onemonthformat;
    //             }
    //             if (onemonthformat > this.employee!.dor && this.employee?.dh && !ebapass.eba_pass_exp_date_edited) {
    //               ebapass.eba_pass_exp_date_edit = this.employee!.dor;
    //             }
    //           }
    //         })
    //       })
    //       this.employee!.closefamily?.forEach(member => {
    //         member.pivot.eba_passes?.forEach(ebapass => {
    //           if (!ebapass.eba_pass_exp_date_edited && formattedDate <= this.employee!.dor && this.employee?.dh) {
    //             ebapass.eba_pass_exp_date_edit = formattedDate;
    //           }
    //           if (formattedDate > this.employee!.dor && this.employee?.dh && !ebapass.eba_pass_exp_date_edited) {
    //             ebapass.eba_pass_exp_date_edit = this.employee!.dor;
    //           }
    //         })
    //       })
    //     }
    //     if ((this.employee!.servants && this.employee!.servants.length > 0)) {
    //       const oneYearsLater = new Date();
    //       oneYearsLater.setFullYear(today.getFullYear() + 1);
    //       const formattedDate = this.formatDate(oneYearsLater);
    //       const onemonthLater = new Date();
    //       onemonthLater.setMonth(onemonthLater.getMonth() + 1);
    //       const onemonthformat = this.formatDate(onemonthLater);
    //       this.employee!.servants?.forEach(servant => {
    //         servant.eba_passes?.forEach(ebapass => {
    //           if (!ebapass.eba_pass_exp_date_edited && formattedDate <= this.employee!.dor && servant.Selected_dh && this.employee?.dh) {
    //             ebapass.eba_pass_exp_date_edit = formattedDate;
    //           }
    //           if (formattedDate > this.employee!.dor && servant.Selected_dh && this.employee?.dh && !ebapass.eba_pass_exp_date_edited) {
    //             ebapass.eba_pass_exp_date_edit = this.employee!.dor;
    //           }
    //         })
    //         servant.relations?.forEach(member => {
    //           member.pivot.eba_passes?.forEach(ebapass => {
    //             if (member.id !== 27) {
    //               if (!ebapass.eba_pass_exp_date_edited && formattedDate <= this.employee!.dor && this.employee?.dh) {
    //                 ebapass.eba_pass_exp_date_edit = formattedDate;
    //               }
    //               if (formattedDate > this.employee!.dor && this.employee?.dh && !ebapass.eba_pass_exp_date_edited) {
    //                 ebapass.eba_pass_exp_date_edit = this.employee!.dor;
    //               }
    //             }
    //             if (member.id === 27) {
    //               if (!ebapass.eba_pass_exp_date_edited && onemonthformat <= this.employee!.dor && this.employee?.dh) {
    //                 ebapass.eba_pass_exp_date_edit = onemonthformat;
    //               }
    //               if (onemonthformat > this.employee!.dor && this.employee?.dh && !ebapass.eba_pass_exp_date_edited) {
    //                 ebapass.eba_pass_exp_date_edit = this.employee!.dor;
    //               }
    //             }
    //           })
    //         })
    //       })
    //     }
    //   }


    //   expedit(i: any, j: any, k: any, property: string) {
    //     if (property === 'closefamily') {
    //       if (this.employee?.closefamily?.[i]?.pivot?.eba_passes?.[j]) {
    //         // @ts-ignore
    //         this.employee.closefamily[i].pivot.eba_passes[j].eba_pass_exp_date_edited = true;
    //       }
    //     }
    //     if (property === 'family') {
    //       if (this.employee?.family?.[i]?.pivot?.eba_passes?.[j]) {
    //         // @ts-ignore
    //         this.employee.family[i].pivot.eba_passes[j].eba_pass_exp_date_edited = true;

    //       }
    //     }

    //     if (property === 'servant') {
    //       if (this.employee?.servants?.[i]?.eba_passes?.[j]) {
    //         // @ts-ignore
    //         this.employee.servants[i].eba_passes[j].eba_pass_exp_date_edited = true;
    //       }
    //     }

    //     if (property === 'servantrel') {
    //       if (this.employee?.servants?.[i]?.relations?.[j]?.pivot?.eba_passes?.[k]) {
    //         // @ts-ignore
    //         this.employee.servants[i].relations[j].pivot.eba_passes[k].eba_pass_exp_date_edited = true;
    //       }
    //     }
    //   }



    // onStateChange(state: State, type: String) {
    //   this.getDistricts(state).then(districts => this.currDistricts = districts);
    // }

    // setEditable(status: boolean) {
    //   this.editable = status;
    // }

    // letverify(status: boolean) {
    //   this.urlid = status;
    // }

  }

  // displayUpload: any = 'none';

  // validateEmployeeData() {

  //   let shouldContinue = true;

  //   if (this.employee) {
  //     if (this.employee.designations === null || this.employee.designations.length === 0) {
  //       Swal.fire({
  //         icon: 'warning',
  //         title: 'Empty Designation',
  //         text: 'Designation does not have a value.',
  //       });
  //       return false;
  //     }

  //     if (this.employee.divisions === null || this.employee.divisions.length === 0) {
  //       Swal.fire({
  //         icon: 'warning',
  //         title: 'Empty Division',
  //         text: 'Division does not have a value.',
  //       });
  //       return false;
  //     }

  //     if (this.employee.organization === null) {
  //       Swal.fire({
  //         icon: 'warning',
  //         title: 'Empty Organization',
  //         text: 'Organization does not have a value.',
  //       });
  //       return false;
  //     }

  //     // Deep clone employee to avoid mutating the original data
  //     const clonedEmployee = JSON.parse(JSON.stringify(this.employee));

  //     if (!clonedEmployee.reg_no || clonedEmployee.reg_no === null) {
  //       if (this.applyingforRelative) {
  //         if (clonedEmployee.closefamily) {
  //           // @ts-ignore
  //           clonedEmployee.closefamily = clonedEmployee.closefamily.filter(member => member.allSelected);
  //           clonedEmployee.servants = [];
  //         }

  //         if (clonedEmployee.family) {
  //           // @ts-ignore
  //           clonedEmployee.family = clonedEmployee.family.filter(member => member.allSelected);
  //           clonedEmployee.servants = [];
  //         }
  //       } else {
  //         clonedEmployee.closefamily = [];
  //         clonedEmployee.family = [];
  //         clonedEmployee.vehicles = [];

  //         if (clonedEmployee.servants) {
  //           // @ts-ignore
  //           clonedEmployee.servants = clonedEmployee.servants.filter(servant => {
  //             if (servant.relations) {
  //               // @ts-ignore
  //               servant.relations = servant.relations.filter(relation => relation.allSelected);
  //             }

  //             if (servant.vehicles) {
  //               // @ts-ignore
  //               servant.vehicles = servant.vehicles.filter(vehicle => {
  //                 return !(
  //                   vehicle['vehicle_owner'] === null &&
  //                   vehicle['vehicle_no'] === null &&
  //                   vehicle['vehicle_type'] === null &&
  //                   vehicle['model_name'] === null
  //                 );
  //               });
  //             }

  //             if (servant.showVehiclePart) {
  //               // @ts-ignore
  //               const hasAtLeastOneNegativeId = servant.vehicles.some(vehicle => vehicle.id === -1);

  //               if (!hasAtLeastOneNegativeId) {
  //                 shouldContinue = false;
  //                 Swal.fire({
  //                   title: 'Add Vehicle for ' + servant.servant_name,
  //                   text: 'You need to add at least one vehicle before continuing.',
  //                   icon: 'info',
  //                 });
  //                 return false;
  //               }
  //             }

  //             if (servant.allSelected) {
  //               const missingFields = [];

  //               if (servant.eba_passes[0].living_at_president_sect == null) missingFields.push('Living at President Sect');
  //               if (servant.eba_passes[0].perm_address == null) missingFields.push('Permanent Address');
  //               if (servant.eba_passes[0].last_5yr_address == null) missingFields.push('Last 5 Years Address');
  //               if (servant.eba_passes[0].reference_1_name == null) missingFields.push('Reference 1 Name');
  //               if (servant.eba_passes[0].reference_1_phone_no == null) missingFields.push('Reference 1 Phone No');
  //               if (servant.eba_passes[0].reference_1_address == null) missingFields.push('Reference 1 Address');
  //               if (servant.eba_passes[0].reference_2_name == null) missingFields.push('Reference 2 Name');
  //               if (servant.eba_passes[0].reference_2_phone_no == null) missingFields.push('Reference 2 Phone No');
  //               if (servant.eba_passes[0].reference_2_address == null) missingFields.push('Reference 2 Address');

  //               if (missingFields.length > 0) {
  //                 shouldContinue = false;
  //                 const missingFieldsText = missingFields.join(', ');
  //                 Swal.fire({
  //                   icon: 'warning',
  //                   title: 'Missing Information',
  //                   text: `The following fields are missing for ${servant.servant_name}: ${missingFieldsText}. Please fill out all required fields.`,
  //                 });
  //                 return false;
  //               }
  //             }

  //             return servant.relations.length > 0 || servant.allSelected;
  //           });
  //         }
  //       }

  //       if (shouldContinue) {
  //         if (this.applyingforRelative) {
  //           if (this.applyingforclosefamily) {
  //             if (clonedEmployee.closefamily === null || clonedEmployee.closefamily.length === 0) {
  //               Swal.fire({
  //                 icon: 'warning',
  //                 title: 'Empty Relative',
  //                 text: 'At least add one family',
  //               });
  //               return false;
  //             }
  //           } else {
  //             if (clonedEmployee.family === null || clonedEmployee.family.length === 0) {
  //               Swal.fire({
  //                 icon: 'warning',
  //                 title: 'Empty Relative',
  //                 text: 'At least add one Relative',
  //               });
  //               return false;
  //             }
  //           }
  //         } else {
  //           if (clonedEmployee.servants === null || clonedEmployee.servants.length === 0) {
  //             Swal.fire({
  //               icon: 'warning',
  //               title: 'Empty Domestic Help',
  //               text: 'At least add one Domestic help',
  //             });
  //             return false;
  //           }
  //         }
  //       }
  //     }
  //     return shouldContinue;
  //   }
  //   return false;
  // }

  // openUploadPopup() {
  //   if (this.validateEmployeeData()) {
  //     this.displayUpload = "block";
  //   }
  // }



  // closeUploadPopup() {
  //   this.displayUpload = "none";
  // }



  async onFileSelected(event: Event, property: string): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      const file: File = inputElement.files[0];
      // Check if the file type is JPEG or JPG
      if (file.type === 'application/pdf') {
        // Check if the file size is less than or equal to 200KB
        if (file.size <= 200 * 1024) { // 200KB in bytes
          try {
            const base64String: string = await fileToBase64(file);

            if (property === 'emp_fir_pdf') {
              if (this.EmpCardData.fir_pdf_edit_64) {
                // @ts-ignore
                this.EmpCardData.fir_pdf_edit_64 = base64String;
              }
            }

            if (property === 'postingOrder_emp') {
              if (this.EmpCardData.postingOrder_edit_64) {
                // @ts-ignore
                this.EmpCardData.postingOrder_edit_64 = base64String;
              }
            }

            if (property === 'id_proof_emp') {
              if (this.EmpCardData.id_proof_edit_64) {
                // @ts-ignore
                this.EmpCardData.id_proof_edit_64 = base64String;
              }
            }

            if (this.file_path_64) {
              if (property === 'file_path') {
                this.file_path_64 = base64String;
              }
            }
          }
          catch (error) {
            console.error('Failed to convert the file to base64:', error);
          }
        } else {
          this.removeFile(event, property);
          Swal.fire({
            icon: 'error',
            title: 'Invalid File',
            text: 'File size exceeds 200KB.',
          });
          console.log('File size exceeds 1mb.');
        }
      } else {
        this.removeFile(event, property);
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Invalid file type. Only pdf files are allowed.',
        });
        console.log('Invalid file type. Only pdf files are allowed.');
      }

    } else {
      console.log('No file selected.');
    }
  }

  onApplyReasonChange(i: any, j: any, k: any, property: string): void {
    if (property === 'EmpCardData') {
      const emp = this.EmpCardData;
      if (emp) {
        emp.FIR_no = null;
        // ebaPass.receipt_no = null;
        emp.fir_pdf = null;
        emp.apply_remark = null;
        emp.fir_pdf_edit_64 = null;
      }

    }
  }

  removeFile(event: Event, property: string): void {
    if (property === 'file_path') {
      this.file_path_64 = null;
    }
  }

  openPdfInNewTab(pdfData: string): void {
    const pdfWindow = window.open();
    // @ts-ignore
    pdfWindow.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
  }



  approveapplication() {
    const id = +this.route.snapshot.params['id'];
    if (!isNaN(id)) {
      if (this.user && this.user.role && this.user.role.some((role: number) => role === 4)) {

        if (this.EmpCardData) {
          this.isLoading = true;
          this.employeeService.updateemp(this.EmpCardData, id).subscribe(
            () => {
              this.employeeService.updateebastatus(id, 'Approve', this.remark ?? '', this.file_path_64 ?? '').subscribe(
                () => {
                  this.isLoading = false;
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Forwarded successfully',
                  }).then(() => {
                    // Redirect to the dashboard route
                    this.router.navigate(['ebapanel']);
                  });
                },
                (error) => {
                  this.isLoading = false;
                  console.log('Error in updateebastatus:', error);
                  if (error.status === 302) {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Warning',
                      text: 'You are not authorised !!!',
                    });
                  } else {
                    // Handle specific errors or use a generic error message
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'An error occurred while Approving application status.',
                    });
                  }
                },
              );
            },
            (error) => {
              this.isLoading = false;
              console.log('Error in updateemp:', error);
              let errorMessage = 'An error occurred while updating the application.';
              if (error.error && error.error.error && error.error.error.length > 0) {
                errorMessage = error.error.error[0]; // Get the first error message
              }
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
              });
            }
          );
        } else {
          console.error('ID parameter is missing or invalid in the URL.');
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'data missing !!!',
          });
          return;
        }

      }

      else if (this.user && this.user.role && this.user.role.some((role: number) => (role === 5 || role == 6 || role == 9 || role == 10))) {
        this.isLoading = true;
        this.employeeService.updateebastatus(id, 'Approve', this.remark ?? '', this.file_path_64 ?? '').subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Approved successfully',
            })
            .then(() => {
              // Redirect to the dashboard route
              this.router.navigate(['ebapanel']);
            });
          },
          (error) => {
            this.isLoading = false;
            console.log(error);
            console.log(error.status);
            console.log(error.error);
            if (error.status === 302) {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'You are not authorised !!!',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while Approving application status.',
              });
            }
          }
        );
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'You are not authorised !!!',
        });
      }
    } else {
      console.error('ID parameter is missing or invalid in the URL.');
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'id missing !!!',
      });
      return;
    }
  }

  Forwardapplication() {
    const id = +this.route.snapshot.params['id'];
    if (!isNaN(id)) {
      if (this.user && this.user.role && this.user.role.some((role: number) => (role == 6 || role == 9))) {
        this.isLoading = true;
        this.employeeService.updateebastatus(id, 'Forward', this.remark ?? '', this.file_path_64 ?? '').subscribe(
          () => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Forwarded successfully',
            }).then(() => {
              // Redirect to the dashboard route
              this.router.navigate(['ebapanel']);
            });
          },
          (error) => {
            this.isLoading = false;
            console.log(error);
            console.log(error.status);
            console.log(error.error);
            if (error.status === 302) {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'You are not authorised !!!',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while Approving application status.',
              });
            }
          }
        );
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'You are not authorised !!!',
        });
      }
    } else {
      console.error('ID parameter is missing or invalid in the URL.');
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'id missing !!!',
      });
      return;
    }
  }


  returnapplication() {
    // Extract id from route parameters
    const id = +this.route.snapshot.params['id'];
    // if (this.user && this.user.role && this.user.role.some((role: number) => role === 4)) {
    //   if (this.EmpCardData) {
    //     if (this.remark == null) {
    //       Swal.fire({
    //         icon: 'warning',
    //         title: 'Enter note ',
    //         text: 'enter note for ' + this.EmpCardData.emp_name,
    //       });
    //       return;
    //     }
    //     this.isLoading = true;
    //     this.employeeService.updateeba(this.employee, id).subscribe(() => {
    //       if (!isNaN(id)) {
    //         this.employeeService.updateebastatus(id, 'Return', this.remark ?? '', this.file_path_64 ?? '').subscribe(

    //           () => {
    //             this.isLoading = false;
    //             Swal.fire({
    //               icon: 'success',
    //               title: 'Success',
    //               text: 'Returned successfully',
    //             }).then(() => {
    //               // Redirect to the dashboard route
    //               this.router.navigate(['ebapanel']);
    //             });
    //           },
    //           (error) => {
    //             this.isLoading = false;
    //             console.log(error);
    //             console.log(error.status);
    //             console.log(error.error);

    //             if (error.status === 302) {
    //               Swal.fire({
    //                 icon: 'warning',
    //                 title: 'Warning',
    //                 text: 'You are not authorized !!!',
    //               });
    //             } else {
    //               // Handle other errors here
    //               let errorMessage = 'An error occurred while Returning application.';
    //               if (error.error && error.error.message) {
    //                 errorMessage = error.error.message;
    //               }
    //               Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: errorMessage,
    //               });
    //             }
    //           }
    //         );
    //       } else {
    //         console.error('ID parameter is missing or invalid in the URL.');
    //         Swal.fire({
    //           icon: 'warning',
    //           title: 'Warning',
    //           text: 'id missing !!!',
    //         });
    //         return;
    //       }
    //     }, (error) => {
    //       this.isLoading = false;
    //       console.log('Error in updateeba:', error);
    //       // Handle specific errors or use a generic error message
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Error',
    //         text: 'An error occurred while updating the application.',
    //       });
    //     }

    //     );
    //   } else {
    //     console.error('ID parameter is missing or invalid in the URL.');
    //     Swal.fire({
    //       icon: 'warning',
    //       title: 'Warning',
    //       text: 'data missing !!!',
    //     });
    //     return;
    //   }
    // } else

    if (this.user && this.user.role && this.user.role.some((role: number) => (role === 5 || role == 6 || role == 9 || role == 10))) {
      if (!isNaN(id)) {
        this.isLoading = true;
        this.employeeService.updateebastatus(id, 'Return', this.remark ?? '', this.file_path_64 ?? '').subscribe(
          () => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Returned successfully',
            }).then(() => {
              // Redirect to the dashboard route
              this.router.navigate(['ebapanel']);
            });
          },
          (error) => {
            this.isLoading = false;
            console.log(error);
            console.log(error.status);
            console.log(error.error);

            if (error.status === 302) {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'You are not authorized !!!',
              });
            } else {
              // Handle other errors here
              console.error('An error occurred:', error);
              let errorMessage = 'An error occurred while Returning application.';
              if (error.error && error.error.message) {
                errorMessage = error.error.message;
              }
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
              });
            }
          }
        );
      } else {
        console.error('ID parameter is missing or invalid in the URL.');
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'id missing !!!',
        });
        return;
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

  confirmReturn(): void {
    Swal.fire({
      title: 'Do you want to return the application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, return it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.returnapplication();

      }
    });
  }

  confirmApprove(): void {
    Swal.fire({
      title: 'Do you want to approve the application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveapplication();
      }
    });
  }

  confirmForward(): void {
    Swal.fire({
      title: 'Do you want to forward the application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, forward it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.user && this.user.role && this.user.role.some((role: number) => (role == 4 || role == 5))) {
          this.approveapplication();
        }
        if (this.user && this.user.role && this.user.role.some((role: number) => (role == 6 || role == 9))) {
          this.Forwardapplication();
        }
      }
    });
  }

  async onStateChange(state: any) {
    if (state != null) {
      this.currDistricts = await this.employeeService.getDistrictsByState(state);
    } else {
      this.currDistricts = [];
    }
  }


  onInput(event: any, property: string) {
    const input = event.target.value;
    // Remove non-numeric characters using regular expression
    const numericInput = input.replace(/\D/g, '');
    // Update the input value with the filtered numeric input
    event.target.value = numericInput;
    // Update the ngModel binding
    if (property == 'curr_pin')
      this.EmpCardData!.curr_pin = numericInput;
    if (property == 'mobile')
      this.EmpCardData!.mobile = numericInput;
  }

  offices: any[] = [];

  findDesg() {
    const selectedOffice = this.offices.find(office => office.id === this.EmpCardData.office_code);
    if (selectedOffice) {
      this.employeeService.getDesignations(selectedOffice.id).subscribe(
        data => this.officeDesignations = data,
        error => console.log(error)
      );
    } else {
      console.log('No matching office found');
    }
  }

  async onPhotoSelected(event: Event, param: string): Promise<void> {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement?.files?.length) {
      const file: File = inputElement.files[0];

      // Check if the file type is JPEG or JPG
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {

        // Check if the file size is less than or equal to 200KB
        if (file.size <= 200 * 1024) { // 200KB in bytes
          try {
            const base64String: string = await fileToBase64(file); // Convert the file to base64
            if (this.EmpCardData) {
              if (param === 'Profile Photo') {
                this.EmpCardData!.photo = base64String;
              } else if (param === 'Employee Sign') {
                this.EmpCardData!.sig = base64String;
              }
            } else {
              console.log('this.employee is null.');
            }
          } catch (error) {
            console.error('Failed to convert the file to base64:', error);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid File',
            text: 'File size exceeds 200KB.',
          });
          console.log('File size exceeds 200KB.');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Invalid file type. Only JPEG or JPG files are allowed.',
        });
        console.log('Invalid file type. Only JPEG or JPG files are allowed.');
      }
    } else {
      console.log('No file selected.');
    }
  }


  getOfficeDesc(code: any): string {
    const office = this.offices.find(o => o.id === code);
    return office ? office.org_desc : 'N/A';
  }

  getDesignationDesc(code: any): string {

    const designation = this.allDesignations.find(d => d.id === code);
    return designation ? designation.desg_desc : 'N/A';
  }

  getStateName(stateId: any): string {
    const state = this.states.find(s => s.id === stateId);
    return state ? state.state_name ?? 'N/A' : 'N/A';
  }

  getDistrictName(districtId: any): string {
    const district = this.currDistricts.find(d => d.id === districtId);
    return district ? district.district_name ?? 'N/A' : 'N/A';
  }


}

