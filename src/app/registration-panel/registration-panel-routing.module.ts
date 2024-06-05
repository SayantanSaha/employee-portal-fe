import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationPanelComponent } from './registration-panel.component'

const routes: Routes = [
  { path: '', component: RegistrationPanelComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationPanelRoutingModule { }
