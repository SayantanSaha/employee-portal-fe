import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpFormComponent } from "./emp-form.component";

const routes: Routes = [
  { path: '', component: EmpFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class empFormRoutingModule { }
