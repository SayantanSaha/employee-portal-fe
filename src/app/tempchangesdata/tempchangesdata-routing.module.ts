import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TempchangesdataComponent } from '../tempchangesdata/tempchangesdata.component';

const routes: Routes = [
  { path: '', component: TempchangesdataComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TempchangesdataRoutingModule  { }
