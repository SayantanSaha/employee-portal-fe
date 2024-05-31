import {Component, Inject, OnInit} from '@angular/core';
import {User} from "../model/User";
import {Employee} from "../model/Employee";
import {EmployeeService} from "../employee.service";
import {ActivatedRoute} from "@angular/router";
import {State} from "../model/State";
import {District} from "../model/District";
import {Designation} from "../model/Designation";
import {Division} from "../model/Division";
import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import {Domestic_help, Relation} from "../model/Relation";
import { fileToBase64 } from './fileToBase64';
import { environment } from 'src/environments/environment';
import { ParseChangedDataPipe } from '../parse-changed-data.pipe';
import {Servants} from "../model/Servants"; // Update the path accordingly
import {ServantRel} from "../model/ServantRel";
import {Vehicles} from "../model/Vehicles";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe],
})

export class ProfileComponent implements OnInit{


  divisiontypelist: any[] = [];  // Initialize as an empty array or with appropriate data type
  relationstypelist: any[] = [];
  serviceTypelist: any[] = [];// Initialize as an empty array or with appropriate data type
  servantstypelist: any[] =[];
  validationErrors:string[] = [];
  blockstypelist: any[] = [];
  locationtypelist: any[] =[];
  quarterstypelist: any[] = [];
  quarterList: any[] = [];
  EbaCardData: any[] = [];
  showquarterDetails: boolean = false;
  showEBACardDetails: boolean = false;
  quarterDetails:any = null;
  recivedotp:boolean = false;
  recivedotpEBACard:boolean = false;
  changesMade: boolean = false;
  isCpAddressChecked: boolean = false;
  changesPostingMade: boolean[] = [];
  changesRelationMade: boolean[] = [];
  changesPromotionMade: boolean[] = [];
  changesServantMade: boolean[] = [];
  changesVehicle: boolean[] = [];
  changesServantRelation:boolean[]=[];
  maxDate: string = "";
  baseUrl: string = '';
  EbaCardNo: string|null = null;


  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private datePipe: DatePipe, // Inject the DatePipe here
    private router: Router,
    @Inject('BASE_URL') baseUrl: string
  ) {
    this.baseUrl = baseUrl;
  }

  employee:Employee| null = null;
  mode:string|null = null;
  editable:boolean = false;
  states:State[]=[];
  currDistricts:District[]=[];
  permDistricts:District[]=[];
  designations:Designation[]=[];
  divisions:Division[]=[];
  relations:Relation[]=[];
  // servant_relations:ServantRel[]=[];
  servants: Servants[] = [];

  vehicles: Vehicles[]=[];
  apiUrl = environment.apiUrl;
    bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  ngOnInit() {

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Zero-padded month
    const day = today.getDate().toString().padStart(2, '0'); // Zero-padded day

    this.maxDate = `${year}-${month}-${day}`;

    this.mode = this.route.snapshot.paramMap.get('mode');
    this.setEditable(this.mode=='edit');
    this.setEditable(this.mode=='create');

    this.route.params.subscribe(params => {
      const id = +params['id']; // Extract id from route parameters
        // Check if 'id' parameter exists in the URL
        if (params.hasOwnProperty('id')) {
        const id = params['id'];

          this.employeeService.getEmpProfile(id).subscribe(
            data=>{
              this.employee = data;

              this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
              this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
            }
          );
        } else {
          this.employeeService.getMyProfile().subscribe(
            data=>{
              this.employee = data;

              this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
              this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
            }
          );
        }
    });


    this.employeeService.getBlockType().subscribe(
      data=>this.blockstypelist=data,
      error => console.log(error)
    );

    this.employeeService.getLocationType().subscribe(
      data=>this.locationtypelist=data,
      error => console.log(error)
    );

    this.employeeService.getStates().subscribe(
      data=>this.states=data,
      error => console.log(error)
    );

    this.employeeService.getDesignations(1).subscribe(
      data=>this.designations=data,
      error => console.log(error)
    );

    this.employeeService.getDivisionMasterList().subscribe(
      data=>this.divisiontypelist=data,
      error => console.log(error)
    );

    this.employeeService.getRelationMasterList().subscribe(
      data=>this.relationstypelist=data,
      error => console.log(error)
    );

    this.employeeService.getServiceMasterList().subscribe(
      data=>this.serviceTypelist=data,
      error => console.log(error)
    );

    this.employeeService.getDependents(1).subscribe(
      data=>this.relations=data,
      error => console.log(error)
    );

    this.employeeService.getDivisions(1).subscribe(
      data=>this.divisions=data,
      error => console.log(error)
    );

    // this.employeeService.getServants(1).subscribe(
    //       data=>this.servants=data,
    //   error => console.log(error)
    // );

    // this.employeeService.getVehicle(1).subscribe(
    //     data=>this.vehicles=data,
    //     error => console.log(error)
    // );

    // this.employeeService.getServantsRel(1).subscribe(
    //   data=>this.servantRel=data,
    //   error => console.log(error)
    // );
  }


  setEditable( status:boolean){
    this.editable = status;
  }

  setEdit(){
    this.editable = true;
  }

  compareState(oneState:State,othState:State): boolean{
    if(oneState==null && othState==null)
      return true;
    else if(oneState!=null && othState!=null)
      return oneState.id===othState.id;
    else
      return false;
  }

  compareDesignation(first:Designation,second:Designation): boolean{
    return first !=null && second!=null && first==second ;//&& first.id===second.id
  }

  compareDivisions(first:Division,second:Division): boolean{
    return first !=null && second!=null && first==second ;// && first.id===second.id
  }

  compareDist(oneDist:District,othDist:District): boolean{
    return oneDist.id===othDist.id;
  }

  onStateChange(state:State,type:String){
    if(type=='curr'){
      this.getDistricts(state).then(districts=>this.currDistricts=districts);
    }
    else if(type=='perm'){
      this.getDistricts(state).then(districts=>this.permDistricts=districts);
    }
  }

  savePrimaryDetails(){

    // Validation check before API Call
    if (this.validationErrors.length > 0) {
      const errorMessage = this.validationErrors
      .map((error, index) => `${index + 1}. ${error}`)
      .join('\n');

      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: errorMessage.replace(/\n/g, '<br/>'),
        width: 'auto', // Adjust as needed
      });
      return; // Exit without calling the API
    }

    // Validation true then Api call otherwise please check
    this.employeeService.updateEmployee(this.employee!).subscribe(
      // data=>console.log(data),
      // error=>console.log(error)

      //Changes By Ravikant
      data => {
        console.log(data);
        Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Request for approval of basic details have been updated successfully and pending for approval',
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     // Redirect to the desired page
        //     window.location.reload();
        //   }
        });
        this.employeeService.getMyProfile().subscribe(
          datas=>{
            this.employee = datas;

            this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
            this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
          }
        );
      },
      (error) => {
        console.log(error);
        console.log(error.status);
        console.log(error.error);
        if(error.status === 302){
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Previous Record Not Approved !!!',
          });
        }else{
          Swal.fire({
            icon: 'error',
            title: 'API Error',
            text: 'An error occurred while updating.',
          });
        }
      });
  }

  async getDistricts(state:State){
    let districts:District[] = [];
    if(state!=null)
    {
      districts = await this.employeeService.getDistrictsByState(state.id!);
    }
    return districts;
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

  addDesignation() {
    let d = new Designation();
    d.pivot.employee_id = this.employee?.id!;
    this.employee?.designations?.push(d);
  }

  savePromotion(index:number){
    this.validateOrderNo('Promotion', index);
    this.validateOrderDate('Promotion', index);

    if (this.validationErrors.length > 0) {
      const errorMessage = this.validationErrors
      .map((error, index) => `${index + 1}. ${error}`)
      .join('\n');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: errorMessage.replace(/\n/g, '<br/>'),
        width: 'auto', // Adjust as needed
      });
      return; // Exit without calling the API
    }

    let promotion = this.employee?.designations![index].pivot;
    console.log(this.employee?.designations![index].pivot.order_path)
    if(promotion?.id==-1){
       this.employeeService.savePromotion(promotion).subscribe(
        // p=>this.employee!.designations![index]=p,
        // e=>console.log(e)
        p => {
          this.employee!.designations![index] = p;

          // Show SweetAlert success message
          console.log(p);
          Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Request for approval of Designation have been saved successfully and pending for approval',
          });
          this.employeeService.getMyProfile().subscribe(
            datas=>{
              this.employee = datas;

              this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
              this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
            }
          );
        },
        e => {
          console.log(e);
          if(e.status === 302){
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'Previous Record Not Approved !!!',
            });
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Promotion details have not been saved successfully.',
            });
          }
          // Swal.fire({
          //   icon: 'error',
          //   title: 'error',
          //   text: '.',
          //   showConfirmButton: false,
          //   timer: 1500 // Automatically close after 1.5 seconds
          // });
        }
      );
    }else{
      if(promotion!=null){
        this.employeeService.updatePromotion(promotion).subscribe(
          // p=>this.employee!.designations![index]=p,
          // e=>console.log(e)
          p => {
            this.employee!.designations![index] = p;

            // Show SweetAlert success message
            console.log(p);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Request for approval of designation have been updated successfully and pending for approval',
            });this.employeeService.getMyProfile().subscribe(
              datas=>{
                this.employee = datas;

                this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
                this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
              }
            );
          },
          e => {
            console.log(e);
            if(e.status === 302){
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Previous Record Not Approved !!!',
              });
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Promotion details have not been Updated successfully.',
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

  deleteRecord(index:number) {
    let promotion = this.employee?.designations![index].pivot;
    if(promotion?.id==-1){
      this.employee?.designations!.splice(index,1);
    }else{
      if(promotion!=null){
        promotion!.active=false;
        this.employeeService.updatePromotion(promotion).subscribe(
          p=>this.employee!.designations![index]=p,
          e=>console.log(e)
        );
      }
    }
  }

  activateRecord(index: number) {
    let promotion = this.employee?.designations![index].pivot;
    if(promotion!=null){
      promotion!.active=true;
      this.employeeService.updatePromotion(promotion).subscribe(
        p=>this.employee!.designations![index]=p,
        e=>console.log(e)
      );
    }
  }

  /********** Add Division Function Start *********/

    addDivision() {
      if (this.employee && this.employee.divisions) {
        let d = new Division();
        // this.employee?.divisions?.push(new Division());
        d.pivot.employee_id = this.employee?.id!;
        this.employee?.divisions?.push(d);
      }
    }

    deleteDivision(index:number){
      this.employee?.divisions?.splice(index, 1);
    }

    saveDivision(index:number){
      this.validateOrderNo('Posting', index);
      this.validateOrderDate('Posting', index);
      this.validateFromDate('Posting', index);

      if (this.validationErrors.length > 0) {
        const errorMessage = this.validationErrors
        .map((error, index) => `${index + 1}. ${error}`)
        .join('\n');

        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: errorMessage.replace(/\n/g, '<br/>'),
          width: 'auto', // Adjust as needed
        });
        return; // Exit without calling the API
      }

      let postingDtls = this.employee?.divisions![index].pivot;
      if(postingDtls?.id==-1){
        this.employeeService.savePosting(postingDtls).subscribe(
          // p=>this.employee!.divisions![index]=p,
          // e=>console.log(e)
          p => {
            this.employee!.divisions![index] = p;

            // Show SweetAlert success message
            console.log(p);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Request for approval of Posting have been saved successfully and pending for approval',
            // }).then((result) => {
            //   if (result.isConfirmed) {
            //     // Redirect to the desired page
            //     window.location.reload();
            //   }
            });
            this.employeeService.getMyProfile().subscribe(
              datas=>{
                this.employee = datas;

                this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
                this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
              }
            );
          },
          e => {
            console.log(e);
            if(e.status === 302){
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Previous Record Not Approved !!!',
              });
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Posting details have not been saved successfully.',
              });
            }
            // Swal.fire({
            //   icon: 'error',
            //   title: 'error',
            //   text: 'Posting details have not been saved successfully.',
            //   showConfirmButton: false,
            //   // timer: 1500 // Automatically close after 1.5 seconds
            // });
          }
        );
      }else{
        if(postingDtls!=null){
          this.employeeService.updatePosting(postingDtls).subscribe(
            // p=>this.employee!.divisions![index]=p,
            // e=>console.log(e)

            p => {
              this.employee!.divisions![index] = p;

              // Show SweetAlert success message
              console.log(p);
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Request for approval of Posting have been updated successfully and pending for approval',
              // }).then((result) => {
              //   if (result.isConfirmed) {
              //     // Redirect to the desired page
              //     window.location.reload();
              //   }
              });this.employeeService.getMyProfile().subscribe(
                datas=>{
                  this.employee = datas;

                  this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
                  this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
                }
              );
            },
            e => {
              console.log(e);
              if(e.status === 302){
                Swal.fire({
                  icon: 'warning',
                  title: 'Warning',
                  text: 'Previous Record Not Approved !!!',
                });
              }else{
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Posting details have not been Updated successfully.',
                });
              }
              // Swal.fire({
              //   icon: 'error',
              //   title: 'error',
              //   text: 'Posting details have not been updated successfully.',
              //   showConfirmButton: false,
              //   // timer: 1500 // Automatically close after 1.5 seconds
              // });
            }

          );
        }
      }
    }
  /*********** Add Division Function End **********/

  /***************** Add Family Members Function Start *********************/

    compareGender(first:Relation,second:Relation): boolean{
      return first !=null && second!=null && first==second ;//&& first.id===second.id
    }

    compareRelation(first:Relation,second:Relation): boolean{
      return first !=null && second!=null && first==second ;//&& first.id===second.id
    }

  compareService(first:Relation,second:Relation): boolean{
    return first !=null && second!=null && first==second ;//&& first.id===second.id
  }

    //Add Member Column Function
    addMember() {
      if (this.employee && this.employee.relations) {
        let d = new Relation();
        d.pivot.employee_id = this.employee?.id!;
        this.employee?.relations?.push(d);
      }
    }

    // Delete Member Column Function
    deleteMember(index: number) {
      if (this.employee && this.employee.relations) {
        this.employee.relations!.splice(index, 1);
      }
    }

    // Save Family Details
    saveRelationDetails(index: number){
      let membersDtls = this.employee?.relations![index].pivot;
      if(membersDtls?.id==-1){
        this.employeeService.updateRelation(membersDtls).subscribe(
          // p=>this.employee!.relations![index]=p,
          // e=>console.log(e)

          p => {
            this.employee!.relations![index] = p;

            // Show SweetAlert success message
            console.log(p);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Request for approval of Relation have been saved successfully and pending for approval',
            // }).then((result) => {
            //   if (result.isConfirmed) {
            //     // Redirect to the desired page
            //     window.location.reload();
            //   }
            });this.employeeService.getMyProfile().subscribe(
              datas=>{
                this.employee = datas;

                this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
                this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
              }
            );
          },
          e => {
            console.log(e);
            if(e.status === 302){
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Previous Record Not Approved !!!',
              });
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Relation details have not been saved successfully.',
              });
            }
            // Swal.fire({
            //   icon: 'error',
            //   title: 'error',
            //   text: 'Relation details have not been saved successfully.',
            //   showConfirmButton: false,
            //   // timer: 1500 // Automatically close after 1.5 seconds
            // });
          }

        );
      }else{
        if(membersDtls!=null){
          this.employeeService.updateRelation(membersDtls).subscribe(
            // p=>this.employee!.relations![index]=p,
            // e=>console.log(e)
            p => {
              this.employee!.relations![index] = p;

              // Show SweetAlert success message
              console.log(p);
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Request for approval of Relation have been updated successfully and pending for approval',
              // }).then((result) => {
              //   if (result.isConfirmed) {
              //     // Redirect to the desired page
              //     window.location.reload();
              //   }
              });
              this.employeeService.getMyProfile().subscribe(
                datas=>{
                  this.employee = datas;

                  this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
                  this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
                }
              );
            },
            e => {
              console.log(e);
              if(e.status === 302){
                Swal.fire({
                  icon: 'warning',
                  title: 'Warning',
                  text: 'Previous Record Not Approved !!!',
                });
              }else{
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Relation details have not been Updated successfully.',
                });
              }
              // Swal.fire({
              //   icon: 'error',
              //   title: 'error',
              //   text: 'Relation details have not been updated successfully.',
              //   showConfirmButton: false,
              //   // timer: 1500 // Automatically close after 1.5 seconds
              // });
            }
          );
        }
      }
    }


  qtrtype() {
    this.employeeService.getQuarterType(this.employee!.location_id!).subscribe(
        data => this.quarterstypelist = data,
        error => console.log(error)
    );
  }



  qtraddress() {
    this.employeeService.getQuarterdetail(this.employee!.qtr_code!,this.employee!.location_id!).subscribe(
      (data :any ) => {
        this.quarterList =data;
      },
      (error) => {
        console.log(error);
        if (error.status === 404) {
          this.quarterList =[];
          this.employee!.qtr =null;
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

  EbaCardDetail(){
    this.employeeService.getEbaCardDetail(this.EbaCardNo!).subscribe(
      (data :any ) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data Fetched Successfully',
        })
        this.EbaCardData =data;
        this.showEBACardDetails = true;
        this.recivedotpEBACard = false;
        // if(this.EbaCardData[0]!.mob_no==null || this.EbaCardData[0]!.mob_no==''){
        //   Swal.fire({
        //     icon: 'warning',
        //     title: 'Warning',
        //     text: 'this eba card does not have a number to verify .',
        //   });
        //   return;
        // }
        // this.employeeService.getotp(this.EbaCardData[0]!.mob_no,'ebaCardOtp').subscribe(
        //   (data :any ) => {
        //     this.recivedotpEBACard=true;
        //     Swal.fire({
        //       icon: 'success',
        //       title: 'Success',
        //       text: 'OTP sent Successfully',
        //     }),
        //       this.isResendDisabled = true;
        //     this.startCountdown(120);
        //   },
        //   (error) => {
        //     // Error response
        //     console.log(error); // Log the error if needed
        //     if (error.status === 400) {
        //       this.recivedotpEBACard=false;
        //       Swal.fire({
        //         icon: 'error',
        //         title: 'error while sending sms',
        //         text: 'Wait then try again later else contact NIC .',
        //       });
        //     }
        //   }
        // );
      },
      (error) => {
        console.log(error);
        if (error.status === 404) {
          this.EbaCardData =[];
          this.EbaCardNo = null;
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'empty EBA Card details .',
          });
        }
        if (error.status === 400) {
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Something went wrong.',
          });
        }
        if (error.status === 405) {
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'EBA Card already exist.',
          });
        }
      }
    );
  }


  isResendDisabled: boolean = false;
  remainingTime: number = 0;
  startCountdown(seconds: number): void {
    this.remainingTime = seconds;
    const interval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(interval);
        this.isResendDisabled = false; // Re-enable the button after countdown finishes
      }
    }, 1000); // Update every second
  }

  sendOtp(){
      if(this.employee!.qtr !== '' && this.employee!.qtr!.MobileNumber  !== '') {
        this.employeeService.getotp(this.employee!.qtr!.MobileNumber,'qtrotp').subscribe(
            (data :any ) => {
              this.recivedotp=true;
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'OTP sent Successfully',
              }),
                this.isResendDisabled = true;
              this.startCountdown(120);
            },
            (error) => {
              // Error response
              console.log(error); // Log the error if needed
              if (error.status === 400) {
                this.recivedotp=false;
                Swal.fire({
                  icon: 'error',
                  title: 'error while sending sms',
                  text: 'Wait then try again later else contact NIC .',
                });
              }
            }
        );
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'Mobile number does not exist for this quarter',
          text: 'Contact NIC.',
        });
      }
    }



  getMaskedNumber(): string {
    const originalNumber = this.employee!.qtr!.MobileNumber
    const maskedNumber = 'xxxxxx' + originalNumber.slice(6);
    return maskedNumber;
  }

  getMaskedEBACardNumber(): string {
    const originalNumber = this.EbaCardData[0]!.mob_no
    const maskedNumber = 'xxxxxx' + originalNumber.slice(6);
    return maskedNumber;
  }

  wrongQuarter(){
    this.recivedotp=false;
  }

  wrongEbaCard(){
    this.recivedotpEBACard=false;
  }

  title = 'otp-app';
  otp!: string;
  inputDigitLeft: string = "Verify code";
  btnStatus: string = "btn-light";

  public configOptions = {
    length: 6,
    inputClass: 'digit-otp',
    containerClass: 'd-flex justify-content-between'
  }
  onOtpChange(event: any) {
    this.otp = event;
    if(this.otp.length < this.configOptions.length) {
      this.inputDigitLeft = this.configOptions.length - this.otp.length + " digits Left";
      this.btnStatus = 'btn-light';
    }

    if(this.otp.length == this.configOptions.length) {
      this.inputDigitLeft = "Let's go!";
      this.btnStatus = 'btn-primary';
    }
  }

  Verifyotp(detail:string){
    this.employeeService.otpverify(this.otp,detail).subscribe(
        (data :any ) => {
          Swal.fire({
            icon: 'success',
            title: 'Matched',
            text: 'Success',
          });
          if(detail=='qtrotp') {
            this.employeeService.showmemberbyeba(this.employee!.qtr!.allotment_id).subscribe(
                (data: any) => {
                  this.quarterDetails = data;
                  this.showquarterDetails = true;
                  this.recivedotp = false;
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
          if(detail=='ebaCardOtp') {
            // this.employeeService.showmemberbyeba(this.employee!.qtr!.allotment_id).subscribe(
            //     (data: any) => {
                  this.showEBACardDetails = true;
                  this.recivedotpEBACard = false;
            //     }, (error) => {
            //       if (error.status === 404) {
            //         Swal.fire({
            //           icon: 'warning',
            //           title: 'empty',
            //           text: 'empty data!!!!',
            //         });
            //       }
            //     }
            // );
          }
        },
        (error) => {
          // Error response
          console.log(error); // Log the error if needed
          if (error.status === 401) {
            Swal.fire({
              icon: 'warning',
              title: 'OTP did not match',
              text: 'Please try again!!!!',
            });
          }
        }
    );
  }

  PullEba(){
    this.employeeService.getmemberbyeba(this.employee!.id!,this.quarterDetails!,this.employee!.qtr!).subscribe(
      (data :any ) => {
        Swal.fire({
          icon: 'success',
          title: 'success',
          text: 'Pulled successfully',
        })
       this.closeEbaPopup();
        this.employeeService.getMyProfile().subscribe(
          datas=>{
            this.employee = datas;

            this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
            this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
          }
        );
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
      }
    );
  }

  PullEbaCard(){
    this.employeeService.PullEbaCard(this.employee!.id!,this.EbaCardData[0]!, this.displayEbaCarddetail).subscribe(
        (data :any ) => {
          Swal.fire({
            icon: 'success',
            title: 'success',
            text: 'Pulled successfully',
          })
          this.closeEbaCardPopup();
          this.employeeService.getMyProfile().subscribe(
              datas=>{
                this.employee = datas;

                this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
                this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
              }
          );
        },
        (error) => {
          // Error response
          console.log(error); // Log the error if needed
          if (error.status === 404) {
            Swal.fire({
              icon: 'warning',
              title: 'warning',
              text: 'empty details!!!!',
            });
          }
          if (error.status === 401) {
            Swal.fire({
              icon: 'warning',
              title: 'warning',
              text: 'Some thing went wrong!!!!',
            });
          }
          if (error.status === 405) {
            Swal.fire({
              icon: 'warning',
              title: 'warning',
              text: 'Not allowed!!!!',
            });
          }
        }
    );
  }




  /***************** Add Family Members Function End ***************8*******/




  /***************** Add servant Members Function Start *********************/


  addServant(): void {
    if (
        this.employee &&
        this.employee.servants
    ) {
      // Check if servants is an array and initialize it if not
      if (!Array.isArray(this.employee.servants)) {
        this.employee.servants = [];
      }

      let s = new Servants();
      s.employee_id = this.employee.id!;
      // if (this.employee.servants.length > 0) {
      //   s.out_house_id = this.employee.servants[0].out_house_id;
      // }
      this.employee.servants.push(s);
    }
  }

  removeServant(servantIndex: number): void {
    if (
        this.employee &&
        this.employee.servants
    ) {
      // Check if servants is an array
      if (Array.isArray(this.employee.servants)) {
        this.employee.servants.splice(servantIndex, 1);
      }
    }
  }

  saveServant( i: number) {
    let servantsDtls = this.employee?.servants?.[i];
    console.log(servantsDtls);

    if (servantsDtls && servantsDtls.out_house_address == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty out house address',
        text: 'out house address does not exist.',
      });
      return;
    }

    if (servantsDtls && servantsDtls.id == -1) {
      this.employeeService.updateServant(servantsDtls).subscribe(
          (p) => {
            if (this.employee &&  this.employee.servants) {
              this.employee.servants[i] = p;
              console.log(p);
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Request for approval of Domestic Help has been saved successfully and is pending approval',
              });
              const newChange = {
                model: 'servant',
                changed_data: this.employee!.servants[i]
              };
              this.employeeService.getMyProfile().subscribe(
                datas=>{
                  this.employee = datas;

                  this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
                  this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
                }
              );
            }
          },
          (e) => {
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
                text: 'Domestic Help details have not been saved successfully.',
              });
            }
          }
      );
    } else if (servantsDtls) {
      this.employeeService.updateServant(servantsDtls).subscribe(
          (p) => {
            if (this.employee && this.employee.servants) {
              this.employee.servants[i] = p;

              console.log(p);
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Request for approval of Domestic Help has been updated successfully and is pending approval',
              });
              this.employeeService.getMyProfile().subscribe(
                datas=>{
                  this.employee = datas;

                  this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
                  this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
                }
              );
            }
          },
          (e) => {
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
                text: 'Domestic Help details have not been updated successfully.',
              });
            }
          }
      );
    }
  }

  addServantFamily(i:number): void {
    if (
      this.employee &&
      this.employee.servants &&
      this.employee.servants[i] &&
      this.employee.servants[i]!.relations
    ) {
      // Check if servants is an array and initialize it if not
      if (!Array.isArray(this.employee.servants[i]!.relations)) {
        this.employee.servants[i]!.relations = [];
      }
      let s = new ServantRel();
      s.pivot.employee_id = this.employee.id!;
      s.pivot.servant_id = this.employee.servants[i].id!;
      this.employee.servants[i]!.relations!.push(s);
    }
  }

  removeServantRel(i:number,k:number):void {
    if (
      this.employee &&
      this.employee.servants &&
      this.employee.servants[i] &&
      this.employee.servants[i].relations
    ) {
      this.employee.servants[i].relations!.splice(k, 1);
    }
  }

  saveServantRel( i: number, k:number) {
    let servantsRelDtls = this.employee?.servants?.[i]?.relations?.[k]?.pivot;

    if (servantsRelDtls && servantsRelDtls.id == -1) {
      this.employeeService.updateServantRel(servantsRelDtls).subscribe(
        (p) => {
          const employee = this.employee;
          if (employee && employee?.servants && employee.servants[i].relations) {
            const relation = employee?.servants?.[i]?.relations?.[k];
            if (relation) {
              relation.pivot = p;
            }
            console.log(p);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Request for approval of Domestic Help has been saved successfully and is pending approval',
            });
            this.employeeService.getMyProfile().subscribe(
              datas=>{
                this.employee = datas;

                this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
                this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
              }
            );
          }
        },
        (e) => {
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
              text: 'Domestic Help details have not been saved successfully.',
            });
          }
        }
      );
    } else if (servantsRelDtls) {
      this.employeeService.updateServantRel(servantsRelDtls).subscribe(
        (p) => {
          const employee = this.employee;
          if (employee &&  employee?.servants && employee.servants[i].relations) {
            const relation = employee?.servants?.[i]?.relations?.[k];
            if (relation) {
              relation.pivot = p;
            }


            console.log(p);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Request for approval of Domestic Help has been updated successfully and is pending approval',
            });
            this.employeeService.getMyProfile().subscribe(
              datas=>{
                this.employee = datas;

                this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
                this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
              }
            );

          }
        },
        (e) => {
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
              text: 'Domestic Help details have not been updated successfully.',
            });
          }
        }
      );
    }
  }

  onMobileNoInput(event: any, i: number): void {
    if (this.employee?.servants?.[i]?.servant_mobile_no !== null) {
      // Get the input value
      const inputValue = event.target.value;

      // Remove non-numeric characters using a regular expression
      const numericValue = inputValue.replace(/[^0-9]/g, '');

      // Update the input value
      event.target.value = numericValue;

      // Update the ngModel bound variable (if necessary)
      if (this.employee?.servants?.[i]) {
        this.employee.servants[i].servant_mobile_no = numericValue;
      }
    }
  }

  onMobileNo(event: any): void {
    if (this.employee?.mobile !== null) {
      // Get the input value
      const inputValue = event.target.value;

      // Remove non-numeric characters using a regular expression
      const numericValue = inputValue.replace(/[^0-9]/g, '');

      // Update the input value
      event.target.value = numericValue;

      // Update the ngModel bound variable (if necessary)
      if (this.employee?.mobile) {
        this.employee.mobile = numericValue;
      }
    }
  }

  onrelationMobileNo(event: any, i: number): void {
    if (this.employee?.relations?.[i]?.pivot.rel_mobile_no !== null) {
      // Get the input value
      const inputValue = event.target.value;

      // Remove non-numeric characters using a regular expression
      const numericValue = inputValue.replace(/[^0-9]/g, '');

      // Update the input value
      event.target.value = numericValue;

      // Update the ngModel bound variable (if necessary)
      if (this.employee?.relations?.[i]) {
        this.employee.relations[i].pivot.rel_mobile_no = numericValue;
      }
    }
  }

  onrelMobileNoInput(event: any, i: number,k:number): void {
    if (this.employee?.servants?.[i]?.relations?.[k]?.pivot!.rel_mobile_no !== null) {
      // Get the input value
      const inputValue = event.target.value;

      // Remove non-numeric characters using a regular expression
      const numericValue = inputValue.replace(/[^0-9]/g, '');

      // Update the input value
      event.target.value = numericValue;

      // Update the ngModel bound variable (if necessary)
      if (this.employee?.servants?.[i]?.relations?.[k]?.pivot) {
        this.employee.servants[i].relations[k].pivot.rel_mobile_no = numericValue;
      }
    }
  }

  /***************** Add Servant Members Function End ***************8*******/



  /***************** Add Vehicle Function Start *********************/
  addVehicle() {
    if (this.employee && this.employee.vehicles) {
      let s = new Vehicles();
      s.employee_id = this.employee?.id!;
      this.employee?.vehicles?.push(s);
    }
  }

  removeVehicle(index: number) {
    if (this.employee && this.employee.vehicles) {
      this.employee.vehicles!.splice(index, 1);
    }
  }

  saveVehicle(index: number){
    let vehicleDtls = this.employee?.vehicles![index];
    if(vehicleDtls){
      this.employeeService.addVehicles(vehicleDtls).subscribe(
        // p=>this.employee!.relations![index]=p,
        // e=>console.log(e)

        p => {
          this.employee!.vehicles![index] = p;

          // Show SweetAlert success message
          console.log(p);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Request for approval of Relation have been saved successfully and pending for approval',
            // }).then((result) => {
            //   if (result.isConfirmed) {
            //     // Redirect to the desired page
            //     window.location.reload();
            //   }
          });
        },
        e => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Relation details have not been saved successfully.',
          });
        }
      );
    }
  }
  /************************* Add Vehicle Function End *************************/



  /************************* Validation Check Function Start *************************/
    validateEngName() {
      const namePattern = /^[a-zA-Z- ]{3,30}$/;
      if (!namePattern.test(this.employee!.emp_name)) { // Note the negation (!) here
        this.validationErrors.push('Invalid Employee Name');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid Employee Name',
        });
      }else {
        // Clear the validation error message for Name in English if it's valid
        const index = this.validationErrors.indexOf('Invalid Employee Name');
        if (index !== -1) {
          this.validationErrors.splice(index, 1);
        }
      }
    }

    validateHindiName() {
      const hindiNamePattern = /^[\u0900-\u097F\s.\-'!()]*$/;

      if (!hindiNamePattern.test(this.employee!.emp_name_hi)) {
        this.validationErrors.push('कर्मचारी का नाम अमान्य है !!! कृपया हिंदी में नाम दर्ज करें');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'कर्मचारी का नाम अमान्य है !!! कृपया हिंदी में नाम दर्ज करें',
        });
      }else {
        // Clear the validation error message for Name in Hindi if it's valid
        const index = this.validationErrors.indexOf('कर्मचारी का नाम अमान्य है !!! कृपया हिंदी में नाम दर्ज करें');
        if (index !== -1) {
          this.validationErrors.splice(index, 1);
        }
      }
    }

    validateEmail() {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.employee!.email_id)) {
        this.validationErrors.push('Invalid Email Id');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid Email Id',
        });
      }else {
        // Clear the validation error message for Email if it's valid
        const index = this.validationErrors.indexOf('Invalid Email Id');
        if (index !== -1) {
          this.validationErrors.splice(index, 1);
        }
      }

    }
  validateMobile() {
    const mobilePattern = /^\d{10}$/;
    if(!mobilePattern.test(this.employee!.mobile)) {
      this.validationErrors.push('Invalid Mobile Number');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid Mobile Number',
      });
    }else {
      // Clear the validation error message for mobile if it's valid
      const index = this.validationErrors.indexOf('Invalid Mobile Number');
      if (index !== -1) {
        this.validationErrors.splice(index, 1);
      }
    }
  }


  validateCurrPin() {
    if (this.employee!.curr_pin !== null) {
      const pinPattern = /^\d{6}$/;
      if (!pinPattern.test(this.employee!.curr_pin)) {
        this.validationErrors.push('Invalid Current PIN code.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid Current PIN code.',
        });
      }else {
        // Clear the validation error message for Pin Code if it's valid
        const index = this.validationErrors.indexOf('Invalid Current PIN code.');
        if (index !== -1) {
          this.validationErrors.splice(index, 1);
        }
      }

    }
  }


  validatePermPin() {
    if (this.employee!.perm_pin !== null) {
      const pinPattern = /^\d{6}$/;

      if (!pinPattern.test(this.employee!.perm_pin)) {

        this.validationErrors.push('Invalid Premanent Pin Code');

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid Premanent Pin Code',
        });
      }else {
        // Clear the validation error message for Pin Code if it's valid
        const index = this.validationErrors.indexOf('Invalid Premanent Pin Code');
        if (index !== -1) {
          this.validationErrors.splice(index, 1);
        }
      }
    }
  }

    // validateCurrPin(event: any): void {
    //     if (this.employee?.curr_pin !== null) {
    //         // Get the input value
    //         const inputValue = event.target.value;
    //
    //         // Remove non-numeric characters using a regular expression
    //         const numericValue = inputValue.replace(/[^0-9]/g, '');
    //
    //         // Update the input value
    //         event.target.value = numericValue;
    //
    //         // Update the ngModel bound variable (if necessary)
    //         if (this.employee?.curr_pin) {
    //             this.employee.curr_pin = numericValue;
    //         }
    //     }
    // }
    //
    //
    // validatePermPin(event: any): void {
    //     if (this.employee?.perm_pin !== null) {
    //         // Get the input value
    //         const inputValue = event.target.value;
    //
    //         // Remove non-numeric characters using a regular expression
    //         const numericValue = inputValue.replace(/[^0-9]/g, '');
    //
    //         // Update the input value
    //         event.target.value = numericValue;
    //
    //         // Update the ngModel bound variable (if necessary)
    //         if (this.employee?.perm_pin) {
    //             this.employee.perm_pin = numericValue;
    //         }
    //     }
    // }

  /************************* Validation Check Function End *************************/



  /********** Desgination / Promotion && Division / Posting Validation Check Function Start *************/

  // Validate Order No
  validateOrderNo(param : String, index: number) {

    if(
        param === 'Promotion'  &&
        this.employee &&
        this.employee!.designations &&
        this.employee!.designations[index].pivot &&
        (
          this.employee!.designations[index].pivot.order_no === null ||
          this.employee!.designations[index].pivot.order_no?.toString() === ''
        )
    ) {
      this.validationErrors.push('Please Enter Order No.');

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please Enter Order No.',
      });
    }else if(param === 'Posting'  &&
      this.employee &&
      this.employee!.divisions &&
      this.employee!.divisions[index].pivot &&
      (
        this.employee!.divisions[index].pivot.order_no === null ||
        this.employee!.divisions[index].pivot.order_no?.toString() === ''
      )
    ){

      this.validationErrors.push('Please Enter Order No.');

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please Enter Order No.',
      });

    }else {
      // Clear the validation error message for Pin Code if it's valid
      const index = this.validationErrors.indexOf('Please Enter Order No.');
      if (index !== -1) {
        this.validationErrors.splice(index, 1);
      }
    }

  }

  // Validate Order Date
  validateOrderDate(param : String, index: number) {

    // if(this.employee && this.employee!.designations )
    // console.log(this.employee!.designations[index].pivot.order_date)
    //alert(this.employee!.designations[index].pivtot!.order_date)
    if(
      param === 'Promotion'  &&
      this.employee &&
      this.employee!.designations &&
      this.employee!.designations[index].pivot &&
      (
        this.employee!.designations[index].pivot.order_date === null ||
        this.employee!.designations[index].pivot.order_date?.toString() === ''
      )
    ){
      this.validationErrors.push('Please Enter Order Date');

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please Enter Order Date',
      });
    }else if(
      param === 'Posting'  &&
      this.employee &&
      this.employee!.divisions &&
      this.employee!.divisions[index].pivot &&
      (
        this.employee!.divisions[index].pivot.order_date === null ||
        this.employee!.divisions[index].pivot.order_date?.toString() === ''
      )
    ){
      this.validationErrors.push('Please Enter Order Date');

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please Enter Order Date',
      });
    }else {
      // Clear the validation error message for Pin Code if it's valid
      const index = this.validationErrors.indexOf('Please Enter Order Date');
      if (index !== -1) {
        this.validationErrors.splice(index, 1);
      }
    }

  }

  // Validate From Date
  validateFromDate(param : String, index: number){
  if(
      param === 'Posting'  &&
      this.employee &&
      this.employee!.divisions &&
      this.employee!.divisions[index].pivot &&
      (
        this.employee!.divisions[index].pivot.from_date === null ||
        this.employee!.divisions[index].pivot.from_date?.toString() === ''
      )
    ){
      this.validationErrors.push('Please Enter From Date');

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please Enter From Date',
      });
    }else {
      // Clear the validation error message for Pin Code if it's valid
      const index = this.validationErrors.indexOf('Please Enter From Date');
      if (index !== -1) {
        this.validationErrors.splice(index, 1);
      }
    }

  }
  /*********** Desgination / Promotion && Division / Posting Validation Check Function End **************/



  /******* Upload File Function Start *******/

  // Profile Photo &&  Employee Singnature
  // async onProfilePhotoSelected(event: Event, param: string): Promise<void> {
  //   const inputElement = event.target as HTMLInputElement;

  //   if (inputElement?.files?.length) {
  //     const file: File = inputElement.files[0];
  //     try {
  //       const base64String: string = await fileToBase64(file); // Convert the file to base64
  //       if (this.employee) {
  //         //alert(param.toString()); // Convert the String object to a string
  //         if (param === 'Profile Photo') {
  //           this.employee.profile_photo = base64String; // Assign the base64 string to the profile_photo property
  //           this.changesMade = true;
  //         } else if (param === 'Employee Sign') {
  //           this.employee.sign_path = base64String; // Assign the base64 string to the sign_path property
  //           this.changesMade = true;
  //         }
  //       } else {
  //         console.log('this.employee is null.');
  //       }
  //     } catch (error) {
  //       console.error('Failed to convert the file to base64:', error);
  //     }
  //   } else {
  //     console.log('No file selected.');
  //   }
  // }


  async onProfilePhotoSelected(event: Event, param: string): Promise<void> {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement?.files?.length) {
      const file: File = inputElement.files[0];

      // Check if the file type is JPEG or JPG
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {

        // Check if the file size is less than or equal to 200KB
        if (file.size <= 200 * 1024) { // 200KB in bytes
          try {
            const base64String: string = await fileToBase64(file); // Convert the file to base64
            if (this.employee) {
              if (param === 'Profile Photo') {
                this.employee.profile_photo = base64String;
                this.changesMade = true;
              } else if (param === 'Employee Sign') {
                this.employee.sign_path = base64String;
                this.changesMade = true;
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



  // Order File Promotions
  async onFileSelected(event: any, i: number) {
    const selectedFile = event.target.files[0];

    try {
      if (selectedFile) {
        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;

        // Check if the selected file is a PDF and the size is within limits
        if (fileType === 'application/pdf' && fileSize <= 1048576) {
          const base64String: string = await fileToBase64(selectedFile); // Convert the file to base64
          if (this.employee && this.employee.designations && this.employee.designations[i]?.pivot) {
            this.employee.designations[i].pivot.order_path = base64String;
            console.log(this.employee.designations[i].pivot.order_path);
          }
        } else {
          let errorMessage = '';
          if (fileType !== 'application/pdf') {
            errorMessage = 'Please select a PDF file.';
          } else if (fileSize > 1048576) {
            errorMessage = 'File size exceeds the limit of 1 MB.';
          }

          if (errorMessage) {
            Swal.fire({
              icon: 'error',
              title: 'Invalid File',
              text: errorMessage,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to convert the file to base64:', error);
    }
  }


  async onIDproofSelected(event: any): Promise<void> {
    const selectedFile = event.target.files[0]; // Get the first selected file

    try {
      if (selectedFile) {
        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;

        // Check if the selected file is a PDF and the size is within limits
        if (fileType === 'application/pdf' && fileSize <= 1048576) {
          const base64String: string = await fileToBase64(selectedFile); // Convert the file to base64
          if (this.employee) {
            this.employee.id_proof = base64String;
            this.changesMade = true;
          } else {
            console.log('this.employee is null.');
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid File',
            text: 'File size exceeds 1mb or it is not a pdf',
          });
          console.log('File size exceeds 1mb or not a pdf');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'File is not present',
          text: 'No file selected',
        });
        console.log('No file selected');
      }
    } catch (error) {
      console.error('Failed to convert the file to base64:', error);
    }
  }

  streamAadharCard() {
    // Here, you can open or display the Aadhar Card using an appropriate method.
    // You can use a library or native functionality to achieve this.
    // For example, if it's an image or PDF, you can open it in a new tab or viewer.

    // Example for opening the Aadhar Card in a new tab:
    if (this.employee && this.employee.id_proof) {
      const aadharCardBlob = new Blob([this.employee.id_proof], { type: 'application/pdf' }); // Adjust the content type as needed
      const objectURL = URL.createObjectURL(aadharCardBlob);

      // Open the Aadhar Card in a new tab
      window.open(objectURL, '_blank');
    }
  }


  // Order File Posting
  async onFileDivSelected(event: any, i: number) {
    const selectedFile = event.target.files[0];

    try {
      if (selectedFile) {
        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;

        // Check if the selected file is a PDF and the size is within limits
        if (fileType === 'application/pdf' && fileSize <= 1048576) {
          const base64String: string = await fileToBase64(selectedFile); // Convert the file to base64
          if (this.employee && this.employee.divisions && this.employee.divisions[i]?.pivot) {
            this.employee.divisions[i].pivot.order_path = base64String;
            console.log(this.employee.divisions[i].pivot.order_path);
          }
        } else {
          let errorMessage = '';
          if (fileType !== 'application/pdf') {
            errorMessage = 'Please select a PDF file.';
          } else if (fileSize > 1048576) {
            errorMessage = 'File size exceeds the limit of 1 MB.';
          }

          if (errorMessage) {
            Swal.fire({
              icon: 'error',
              title: 'Invalid File',
              text: errorMessage,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to convert the file to base64:', error);
    }
  }

  /****** Upload File Function End ****/


  /**** Same As Current Address Function Start ****/
  cPAddress() {
    // Check if the checkbox is checked
    if (this.isCpAddressChecked === true ) {

      // If checked, copy current address to permanent address
      if (this.employee!.curr_add && this.employee!.curr_pin && this.employee!.curr_state && this.employee!.curr_district) {
        this.employee!.perm_add = this.employee!.curr_add;
        this.employee!.perm_pin = this.employee!.curr_pin;
        this.employee!.perm_state = this.employee!.curr_state;

        this.employee!.perm_district = this.employee!.curr_district;

        this.getDistricts(this.employee!.perm_state!).then(districts=>this.permDistricts=districts);

      } else {

        // Uncheck the checkbox
        this.isCpAddressChecked = false;

        // Show an alert if current address fields are not filled
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please Fill all the Field of Current Address',
        });


      }
    } else {
      // If unchecked, reset permanent address fields to null
      this.employee!.perm_add = null;
      this.employee!.perm_pin = null;
      this.employee!.perm_state = null;
      this.employee!.perm_district = null;

      this.getDistricts(this.employee!.perm_state!).then(districts=>this.permDistricts=districts);
    }
  }

  /***** Same As Current Address Function End *****/

  /***** Date Check Validation Function Start *****/

  checkDateOfJoining() {
    if(!this.employee!.dob) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please Fill Date of Birth',
      });

      // Set the values to null since they are invalid
      this.employee!.doj_gs = null;
      this.employee!.doj_rb = null;


      return; // Exit the function early if any date field is null
    }

    // if(!this.employee!.doj_gs){
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Please Fill Date of Joining in Government Services',
    //   });

    //   // Set the values to null since they are invalid
    //   this.employee!.doj_rb = null;

    //   return; // Exit the function early if any date field is null


    // }

    const dob = new Date(this.employee!.dob);
    const dojGS = this.employee!.doj_gs ? new Date(this.employee!.doj_gs) : 'null';
    const dojRB = this.employee!.doj_rb ? new Date(this.employee!.doj_rb) : 'null';

    if(dojGS < dob ){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Date of joining is not valid. Please check the dates.',
      });

      // Set the values to null since they are invalid
      this.employee!.doj_gs = null;
      this.employee!.doj_rb = null;

    }

    if(dojGS!=null && (dojRB < dojGS) || (dojRB < dob)){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Date of joining is not valid in RB. Please check the dates.',
      });

      this.employee!.doj_rb = null;
    }


  }
  /***** Date Check Validation Function Start *****/


  //Date Formate

  formatDate(date: Date | null): string {

    // if (!date) {
    //   return 'N/A';
    // }

    // return date.toString(); // Change this to your date formatting logic
    return this.datePipe.transform(date, 'dd MMM YYYY') || 'N/A';
  }

  // Disabled Button Basic Details
  onInputChange() {
    this.changesMade = true;
  }

  onInputChangeMap(param : String, index: number){

    if(param === 'Promotion'){
      this.changesPromotionMade[index] = true;
    }else if(param === 'Posting'){
      this.changesPostingMade[index] = true;
    }else if(param === 'Relations'){
      this.changesRelationMade[index] = true;
    }else if(param === 'Servants'){
      this.changesServantMade[index] = true;
    }else if(param === 'Vehicle'){
      this.changesVehicle[index] = true;
    } else if(param === 'ServantRelation'){
      this.changesServantRelation[index] = true;
    }else if(param === 'service') {
      this.changesRelationMade[index] = true;
    }
  }

  onInputReverseChange(param : String, index: number){
    if(param === 'Relations'){
      this.changesRelationMade[index] = false;
    }else if(param === 'Servants'){
      this.changesServantMade[index] = false;
    } else if(param === 'ServantRelation'){
      this.changesServantRelation[index] = false;
    }
  }


  displayEba: any = 'none';
  pullEbaPopup() {
    this.displayEba = "block";
  }
  closeEbaPopup() {
    this.displayEba = "none";
  }

  displayEbaCard: any = 'none';
  displayEbaCarddetail: any[]=[];
  pullEbaCardPopup(property:string,i:any,j:any) {
    this.displayEbaCarddetail=[];
    this.displayEbaCarddetail = [property, i, j];
    this.displayEbaCard = "block";
  }
  closeEbaCardPopup() {
    this.displayEbaCarddetail=[];
    this.recivedotpEBACard=false;
    this.showEBACardDetails=false;
    this.displayEbaCard = "none";
  }





}