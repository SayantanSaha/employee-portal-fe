import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RbprintRoutingModule } from '../rbprint/rbprint-routing-module';
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { MatPaginatorModule } from '@angular/material/paginator'; // Import MatPaginatorModule
import { MatSortModule } from '@angular/material/sort'; // Import MatSortModule


// import { RbprintComponent } from './rbprint.component'; // Your component

@NgModule({
  declarations: [],  // Keep RbprintComponent here
  imports: [
    CommonModule,
    RbprintRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class RbprintModule { }
