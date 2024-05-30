import { Routes } from '@angular/router';
import { appResolve, startPageGuard, StartupService } from '@core';
import { aclCanActivate } from '@delon/acl';
import { authJWTCanActivate, authJWTCanActivateChild } from '@delon/auth';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutBasicComponent } from '../layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutBasicComponent,
    // aclCanActivate
    canActivate: [startPageGuard, authJWTCanActivate],
    canActivateChild: [authJWTCanActivateChild],
    data: {},
    resolve: { startup: appResolve },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'sys', loadChildren: () => import('./sys/sys.module').then(m => m.SysModule) }
    ]
  },
  // passport
  { path: '', loadChildren: () => import('./passport/routes').then(m => m.routes) },

  { path: 'exception', loadChildren: () => import('./exception/routes').then(m => m.routes) },
  { path: '**', redirectTo: 'exception/404' }
];
