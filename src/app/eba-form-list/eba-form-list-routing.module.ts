import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EbaFormListComponent } from "./eba-form-list.component";

const routes: Routes = [
  { path: '', component: EbaFormListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EbaFormListRoutingModule { }
