import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainLayoutComponent} from "./main-layout/main-layout.component";
import {BaseLayoutComponent} from "./base-layout/base-layout.component";
import {AuthGuard} from "../auth/auth.guard";

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

      { path: 'dashboard',loadChildren: () => import('../dashboard/dashboard.module').then(d => d.DashboardModule), canActivate: [AuthGuard]},
      { path: 'profile/:mode',loadChildren: () => import('../profile/profile.module').then(d => d.ProfileModule), canActivate: [AuthGuard]},
      { path: 'state',loadChildren: () => import('../state/state.module').then(d => d.StateModule), canActivate: [AuthGuard]},

      { path: 'approval-pending-emp-dtls',loadChildren: () => import('../tempchangesdata/tempchangesdata.module').then(d => d.TempchangesdataModule), canActivate: [AuthGuard]},
      { path: 'changes-approval-dtls/:id',loadChildren: () => import('../tempchangesapproval/tempchangesapproval.module').then(d => d.TempchangesapprovalModule), canActivate: [AuthGuard]},
      { path: 'approved-emp-list',loadChildren: () => import('../approveemployeelist/approveemployeelist.module').then(d => d.ApproveemployeelistModule), canActivate: [AuthGuard]},
      { path: 'employee-list',loadChildren: () => import('../employeelist/employeelist.module').then(d => d.EmployeelistModule), canActivate: [AuthGuard]},
    
    
    ]
  },

  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      { path: 'login', loadChildren:()=>import('../login/login.module').then(l=>l.LoginModule) },
      { path: 'logout', loadChildren:()=>import('../logout/logout.module').then(l=>l.LogoutModule) },
      { path: 'registration', loadChildren:()=>import('../registration/registration.module').then(r=>r.RegistrationModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
