import { Routes } from '@angular/router';
import { authGuard, startPageGuard } from '@core';

import { LayoutBasicComponent, LayoutBlankComponent } from '../layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutBasicComponent,
    canActivate: [startPageGuard, authGuard],
    canActivateChild: [authGuard],
    data: {},
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/routes').then(m => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./widgets/routes').then(m => m.routes)
      },
      { path: 'style', loadChildren: () => import('./style/routes').then(m => m.routes) },
      { path: 'delon', loadChildren: () => import('./delon/routes').then(m => m.routes) },
      { path: 'extras', loadChildren: () => import('./extras/routes').then(m => m.routes) },
      { path: 'pro', loadChildren: () => import('./pro/routes').then(m => m.routes) },
      { path: 'accounts', loadChildren: () => import('./accounts/routes').then(m => m.routes) },
      {
        path: 'collaboration',
        loadChildren: () => import('./collaboration/routes').then(m => m.COLLABORATION_ROUTES)
      },
      {
        path: 'blueprints',
        loadChildren: () => import('./blueprints/routes').then(m => m.BLUEPRINT_ROUTES)
      },
      {
        path: 'tasks',
        loadChildren: () => import('./tasks/routes').then(m => m.TASK_ROUTES)
      },
      {
        path: 'quality',
        loadChildren: () => import('./quality/routes').then(m => m.QUALITY_ROUTES)
      },
      {
        path: 'issues',
        loadChildren: () => import('./issues/routes').then(m => m.ISSUE_ROUTES)
      },
      {
        path: 'analytics',
        loadChildren: () => import('./analytics/routes').then(m => m.ANALYTICS_ROUTES)
      },
      {
        path: 'documents',
        loadChildren: () => import('./documents/routes').then(m => m.DOCUMENT_ROUTES)
      },
      {
        path: 'bots',
        loadChildren: () => import('./bots/routes').then(m => m.BOT_ROUTES)
      },
      {
        path: 'system',
        loadChildren: () => import('./system/routes').then(m => m.SYSTEM_ROUTES)
      },
      {
        path: 'communication',
        loadChildren: () => import('./communication/routes').then(m => m.COMMUNICATION_ROUTES)
      },
      {
        path: 'explore',
        loadChildren: () => import('./explore/routes').then(m => m.EXPLORE_ROUTES)
      }
    ]
  },
  // Blak Layout 空白布局
  {
    path: 'data-v',
    component: LayoutBlankComponent,
    children: [{ path: '', loadChildren: () => import('./data-v/routes').then(m => m.routes) }]
  },
  // passport - 必须在根路径配置之后，避免路径冲突
  { path: 'passport', loadChildren: () => import('./passport/routes').then(m => m.routes) },
  { path: 'exception', loadChildren: () => import('./exception/routes').then(m => m.routes) },
  { path: '**', redirectTo: 'exception/404' }
];
