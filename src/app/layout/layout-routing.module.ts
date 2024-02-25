import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainLayoutComponent} from "./main-layout/main-layout.component";
import {BaseLayoutComponent} from "./base-layout/base-layout.component";
import {BaseLayoutTwoComponent} from "./base-layout-two/base-layout-two.component";
import {AuthGuard} from "../auth/auth.guard";
import {ebaFormModule} from "../eba-form/eba-form.module";
import {ebaPendingModule} from "../ebapending/ebapending.module";
import {EbaFormListModule} from "../eba-form-list/eba-form-list.module";



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
      // { path: 'profile/:mode',loadChildren: () => import('../profile/profile.module').then(d => d.ProfileModule), canActivate: [AuthGuard]},
      {
        path: 'profile/:mode',
        loadChildren: () => import('../profile/profile.module').then(d => d.ProfileModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'profile/:mode/:id',
        loadChildren: () => import('../profile/profile.module').then(d => d.ProfileModule),
        canActivate: [AuthGuard]
      },
      { path: 'state',loadChildren: () => import('../state/state.module').then(d => d.StateModule), canActivate: [AuthGuard]},
      { path: 'approved-emp-list',loadChildren: () => import('../approveemployeelist/approveemployeelist.module').then(d => d.ApproveemployeelistModule), canActivate: [AuthGuard]},
      { path: 'approval-pending-emp-dtls',loadChildren: () => import('../tempchangesdata/tempchangesdata.module').then(d => d.TempchangesdataModule), canActivate: [AuthGuard]},
      { path: 'change-password',loadChildren: () => import('../change-password/change-password.module').then(d => d.ChangePasswordModule), canActivate: [AuthGuard]},
      { path: 'employee-list',loadChildren: () => import('../employeelist/employeelist.module').then(d => d.EmployeelistModule), canActivate: [AuthGuard]},
      { path: 'eba-form/:mode/:modetwo/:id',loadChildren: () => import('../eba-form/eba-form.module').then(d => d.ebaFormModule), canActivate: [AuthGuard]},
      { path: 'changes-approval-dtls/:id',loadChildren: () => import('../tempchangesapproval/tempchangesapproval.module').then(d => d.TempchangesapprovalModule), canActivate: [AuthGuard]},
      { path: 'eba-form-view',loadChildren: () => import('../ebaformview/ebaformview.module').then(d => d.EbaformviewModule), canActivate: [AuthGuard]},
      { path: 'eba-pending',loadChildren: () => import('../ebapending/ebapending.module').then(d => d.ebaPendingModule), canActivate: [AuthGuard]},
      { path: 'eba-print',loadChildren: () => import('../ebaprint/ebaprint.module').then(d => d.EbaprintModule), canActivate: [AuthGuard]},
      { path: 'ebapanel',loadChildren: () => import('../ebapanel/ebapanel.module').then(d => d.EbapanelModule), canActivate: [AuthGuard]},
      { path: 'ebaformlist',loadChildren: () => import('../eba-form-list/eba-form-list.module').then(d => d.EbaFormListModule), canActivate: [AuthGuard]},
      { path: 'adminpanel',loadChildren: () => import('../adminpanel/adminpanel.module').then(d => d.AdminpanelModule), canActivate: [AuthGuard]},
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

  {
    path: '',
    component: BaseLayoutTwoComponent,
    children: [
      { path: 'printPage', loadChildren:()=>import('../print-page/print-page.module').then(l=>l.PrintPageModule),canActivate: [AuthGuard]},
    ]
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
