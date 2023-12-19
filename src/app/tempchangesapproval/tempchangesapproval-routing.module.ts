import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TempchangesapprovalComponent} from "./tempchangesapproval.component";

const routes: Routes = [
  { path: '', component: TempchangesapprovalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TempchangesapprovalRoutingModule { }
