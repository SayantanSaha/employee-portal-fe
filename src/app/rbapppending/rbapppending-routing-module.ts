import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RbapppendingComponent } from "./rbapppending.component";

const routes: Routes = [
  { path: '', component: RbapppendingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class rbAppPendingRoutingModule { }
