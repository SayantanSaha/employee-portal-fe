import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IdFormRoutingModule } from '../id-form/id-form-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IdFormRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class IdFormModule { }
