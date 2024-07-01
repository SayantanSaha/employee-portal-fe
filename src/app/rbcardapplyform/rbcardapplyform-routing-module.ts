import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RbcardapplyformComponent } from "./rbcardapplyform.component";

const routes: Routes = [
  { path: '', component: RbcardapplyformComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RbcardapplyformRoutingModule { }
