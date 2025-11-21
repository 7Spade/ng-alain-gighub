import { Routes } from '@angular/router';

export const BLUEPRINT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./list/blueprint-list.component').then(m => m.BlueprintListComponent)
  },
  {
    path: 'detail',
    loadComponent: () => import('./detail-shell/blueprint-detail-shell.component').then(m => m.BlueprintDetailShellComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings-shell/blueprint-settings-shell.component').then(m => m.BlueprintSettingsShellComponent)
  },
  {
    path: 'main-branch',
    loadComponent: () => import('./main-branch/blueprint-main-branch.component').then(m => m.BlueprintMainBranchComponent)
  },
  {
    path: 'branches',
    loadComponent: () => import('./branches/blueprint-branches-overview.component').then(m => m.BlueprintBranchesOverviewComponent)
  },
  {
    path: 'branches/detail',
    loadComponent: () => import('./branches/branch-detail/branch-detail').then(m => m.BranchDetailComponent)
  },
  {
    path: 'fork',
    loadComponent: () => import('./fork/blueprint-fork-landing.component').then(m => m.BlueprintForkLandingComponent)
  },
  {
    path: 'pull-requests',
    loadComponent: () => import('./pull-requests/pull-request-center.component').then(m => m.PullRequestCenterComponent)
  },
  {
    path: 'pull-requests/detail',
    loadComponent: () => import('./pull-requests/detail/pull-request-detail').then(m => m.PullRequestDetailComponent)
  },
  {
    path: 'review',
    loadComponent: () => import('./review/blueprint-review-workspace.component').then(m => m.BlueprintReviewWorkspaceComponent)
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
  },
  {
    path: ':id/settings',
    loadComponent: () => import('./settings/blueprint-settings.component').then(m => m.BlueprintSettingsComponent)
  },
  {
    path: ':id/fork',
    loadComponent: () => import('./fork/blueprint-fork.component').then(m => m.BlueprintForkComponent)
  },
  {
    path: ':id/pull-requests/:prId/review',
    loadComponent: () => import('./review/pr-review.component').then(m => m.PrReviewComponent)
  }
];
