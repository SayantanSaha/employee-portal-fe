import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SportUpdateComponent } from './sport-update.component';

import { CommonModule } from '@angular/common';


const routes: Routes = [
  { path: '', component: SportUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes),CommonModule],
  exports: [RouterModule]
})
export class SportUpdateRoutingModule { }



