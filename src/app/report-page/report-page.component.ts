import { Component, Inject } from '@angular/core';
import { EmployeeService } from "../employee.service";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../environments/environment";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-page.component.html',
  styleUrl: './report-page.component.scss'
})



export class ReportPageComponent {
  mode: string | null = null;
  baseUrl: string = '';
  reports: any;
  totalEmployees: number = 0;
  totalRelativesUpdated: number = 0;
  totalRelatives: number = 0;
  totalServantsUpdated: number = 0;
  totalServants: number = 0;
  totalDRelativesUpdated: number = 0;
  totalDRelatives: number = 0;
  sportsData: any;
  sportsAgeData: any;

  constructor(
    @Inject('BASE_URL') baseUrl: string, private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.baseUrl = baseUrl;
  }


  ngOnInit() {
    this.mode = this.route.snapshot.paramMap.get('mode');
    if (this.mode == 'relativeUpdate') {
      this.employeeService.reportOfrelatives().subscribe(
        (data: any) => {
          this.reports = data;
          this.calculateTotals();
        },
        (error) => {
          console.log(error);
          console.log(error.status);
          console.log(error.error);

        }
      )
    }
    if (this.mode == 'sportsUpdate') {
      this.employeeService.reportOfSportsUpdate().subscribe(
        (data: any) => {
          this.sportsData = data;
        },
        (error) => {
          console.log(error);
          console.log(error.status);
          console.log(error.error);

        }
      )
      this.employeeService.reportOfSportsUpdateAgeGroup().subscribe(
        (data: any) => {
          this.sportsAgeData = data;
        },
        (error) => {
          console.log(error);
          console.log(error.status);
          console.log(error.error);

        }
      )
    }
  }


  calculateTotals() {
    this.totalEmployees = this.reports.reduce(
      (sum: number, report: any) => sum + (report.total_employees || 0),
      0
    );
    this.totalRelativesUpdated = this.reports.reduce(
      (sum: number, report: any) => sum + (report.relatives_updated || 0),
      0
    );
    this.totalRelatives = this.reports.reduce(
      (sum: number, report: any) => sum + (report.total_relatives || 0),
      0
    );
    this.totalServantsUpdated = this.reports.reduce(
      (sum: number, report: any) => sum + (report.servants_updated || 0),
      0
    );
    this.totalServants = this.reports.reduce(
      (sum: number, report: any) => sum + (report.total_servants || 0),
      0
    );
    this.totalDRelativesUpdated = this.reports.reduce(
      (sum: number, report: any) => sum + (report.d_relatives_updated || 0),
      0
    );
    this.totalDRelatives = this.reports.reduce(
      (sum: number, report: any) => sum + (report.total_d_relatives || 0),
      0
    );
  }




}
