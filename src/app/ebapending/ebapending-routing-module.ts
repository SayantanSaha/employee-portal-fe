import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EbapendingComponent } from "./ebapending.component";

const routes: Routes = [
  { path: '', component: EbapendingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ebaPendingRoutingModule { }
