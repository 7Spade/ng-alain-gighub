import { Routes } from '@angular/router';

export const BLUEPRINT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./list/blueprint-list.component').then(m => m.BlueprintListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./form/blueprint-form.component').then(m => m.BlueprintFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./detail/blueprint-detail.component').then(m => m.BlueprintDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./form/blueprint-form.component').then(m => m.BlueprintFormComponent)
  },
  {
    path: ':id/branches',
    loadComponent: () => import('./branches/branch-management.component').then(m => m.BranchManagementComponent)
  },
  {
    path: ':id/pull-requests',
    loadComponent: () => import('./pull-requests/pull-request-list.component').then(m => m.PullRequestListComponent)
  }
];

