import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainLayoutComponent} from "./main-layout/main-layout.component";
import {BaseLayoutComponent} from "./base-layout/base-layout.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard',loadChildren: () => import('../dashboard/dashboard.module').then(d => d.DashboardModule)},
    ]
  },
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      { path: 'login', loadChildren:()=>import('../login/login.module').then(l=>l.LoginModule) },
      { path: 'registration', loadChildren:()=>import('../registration/registration.module').then(r=>r.RegistrationModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
