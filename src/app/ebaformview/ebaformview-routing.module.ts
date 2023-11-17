import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EbaformviewComponent } from "./ebaformview.component";

const routes: Routes = [
  { path: '', component: EbaformviewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EbaformviewRoutingModule { }
