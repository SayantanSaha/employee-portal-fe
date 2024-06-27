import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RbprintComponent } from "./rbprint.component";

const routes: Routes = [
  { path: '', component: RbprintComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RbprintRoutingModule { }
