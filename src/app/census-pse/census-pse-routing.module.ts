import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CensusPseComponent } from "./census-pse.component";

const routes: Routes = [
  { path: '', component: CensusPseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class censusPseRoutingModule { }
