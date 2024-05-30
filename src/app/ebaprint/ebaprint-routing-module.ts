import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EbaprintComponent } from "./ebaprint.component";

const routes: Routes = [
  { path: '', component: EbaprintComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EbaprintRoutingModule { }
