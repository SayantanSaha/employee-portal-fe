import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EbaapprovalComponent } from "./ebaapproval.component";

const routes: Routes = [
  { path: '', component: EbaapprovalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ebaApprovalRoutingModule { }
