import {Component, Inject} from '@angular/core';
import {User} from "../model/User";
import {Employee} from "../model/Employee";
import {EmployeeService} from "../employee.service";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";
import {environment} from "../../environments/environment";
import {Idcards} from "../model/Idcards";
import {fileToBase64} from "../profile/fileToBase64";
import { Router } from '@angular/router';
import {DatePipe} from "@angular/common";
declare var jQuery: any;

@Component({
  selector: 'app-id-form',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './id-form.component.html',
  styleUrl: './id-form.component.scss'
})
export class IdFormComponent {
  baseUrl: string = '';
  constructor(
    @Inject('BASE_URL') baseUrl: string,private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.baseUrl = baseUrl;
  }

  employee: Employee | null = null;
  user: User = new User();
  apiUrl = environment.apiUrl;
  editable: boolean = false;
  mode: string | null = null;
  urlId: boolean = false;
  id: string | null = null;
  remark: string | null = null;
  file_path: string | null = null;
  file_path_64:string|null=null;
  isLoading: boolean = false;


    entryPass = {
        name: '',
        fathersName: '',
        designation: '',
        mobileNumber: '',
        permanentAddress: '',
        presentAddress: '',
        workArea: '',
        contractualCompanyName: '',
        periodOfWork: '',
        policeVerificationNo: '',
        recommendingLetterNo: '',
        dateOfBirth: '',
        gender: '',
        identificationMark: '',
        signatureOfApplicant: '',
        gazettedOfficerSignature: '',
        gazettedOfficerName: '',
        gazettedOfficerDesignation: '',
        imageUrl:''
    };


  ngOnInit() {
    this.isLoading=true;
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.setEditable(this.mode == 'edit');

    let userString: string | null = sessionStorage.getItem('user') != null ? sessionStorage.getItem('user') : '[]';
    this.user = JSON.parse(userString!);

    if (this.user && this.user.role && this.user.role.some((role: number) => (role === 11 || role == 12 || role == 13 ))) {
      this.id = this.route.snapshot.paramMap.get('id');
      if(this.mode !== 'return'){
        this.letverify(!isNaN(+this.id!));
      }
    }

    if (this.id) {
      // 'id' is present, try to convert it to a number
      const idNumber = +this.id;
      if (!isNaN(idNumber)) {
        if (this.user && this.user.role && this.user.role.some((role: number) => (role === 11 || role == 12 || role == 13 ))) {
          // 'id' is a valid number, call getEbaProfile
          this.employeeService.getEbaProfile(idNumber).subscribe(
            (data: any) => {
              this.employee = data;
            }
          );
        }
      } else {
        // 'id' is not a valid number, call getMyebaProfile
        this.employeeService.getMyIDProfile().subscribe(
          (data: any) => {
            this.employee = data;
            // @ts-ignore
            // this.getDistricts(this.employee.curr_state!).then(districts => this.currDistricts = districts);
            // // @ts-ignore
            // this.getDistricts(this.employee.perm_state!).then(districts => this.permDistricts = districts);
          },(error) => {
            if (error.status === 400 && error.error.msg === "Not allowed") {
              Swal.fire({
                title: 'Not Allowed',
                text: 'You are not allowed to access this resource.',
                icon: 'error',
              }).then(() => {
                this.router.navigate(['/dashboard']);
              });
            }
          }
        );
      }
    } else {
      // 'id' is not present, call getMyebaProfile
      this.employeeService.getMyIDProfile().subscribe(
        (data: any) => {
          this.employee = data;
          // @ts-ignore
          // this.getDistricts(this.employee.curr_state!).then(districts => this.currDistricts = districts);
          // // @ts-ignore
          // this.getDistricts(this.employee.perm_state!).then(districts => this.permDistricts = districts);
        },(error) => {
          if (error.status === 400 && error.error.msg === "Not allowed") {
            Swal.fire({
              title: 'Not Allowed',
              text: 'You are not allowed to access this resource.',
              icon: 'error',
            }).then(() => {
              this.router.navigate(['/dashboard']);
            });
          }
        }
      );
    }
    this.isLoading=false;
  }

  setEditable(status:boolean){
    this.editable = status;
  }

  letverify(status:boolean){
    this.urlId = status;
  }

  printPage() {
    window.print();
  }

}
