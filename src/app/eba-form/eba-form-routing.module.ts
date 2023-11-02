import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EbaFormComponent } from "./eba-form.component";

const routes: Routes = [
  { path: '', component: EbaFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ebaFormRoutingModule { }
