import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrintPageComponent } from './print-page.component'

const routes: Routes = [
  { path: '', component: PrintPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintPageRoutingModule { }
