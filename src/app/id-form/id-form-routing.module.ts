import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdFormComponent } from "./id-form.component";

const routes: Routes = [
  { path: '', component: IdFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdFormRoutingModule { }
