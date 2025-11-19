import { Routes } from '@angular/router';

export const ISSUE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./list/issue-list.component').then(m => m.IssueListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./form/issue-form.component').then(m => m.IssueFormComponent)
  },
  {
    path: 'detail',
    loadComponent: () => import('./detail-static/issue-detail-static.component').then(m => m.IssueDetailStaticComponent)
  },
  {
    path: 'handle',
    loadComponent: () => import('./handle-center/issue-handle-center.component').then(m => m.IssueHandleCenterComponent)
  },
  {
    path: 'photos',
    loadComponent: () => import('./photos-wall/issue-photos-wall.component').then(m => m.IssuePhotosWallComponent)
  },
  {
    path: 'close',
    loadComponent: () => import('./close-summary/issue-close-summary.component').then(m => m.IssueCloseSummaryComponent)
  },
  {
    path: 'assignments',
    loadComponent: () => import('./assignments/issue-assignments.component').then(m => m.IssueAssignmentsComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./detail/issue-detail.component').then(m => m.IssueDetailComponent)
  },
  {
    path: ':id/handle',
    loadComponent: () => import('./handle/issue-handle.component').then(m => m.IssueHandleComponent)
  },
  {
    path: ':id/photos',
    loadComponent: () => import('./photos/issue-photos.component').then(m => m.IssuePhotosComponent)
  },
  {
    path: ':id/close',
    loadComponent: () => import('./close/issue-close.component').then(m => m.IssueCloseComponent)
  },
  {
    path: 'sync-logs',
    loadComponent: () => import('./sync-logs/sync-logs').then(m => m.SyncLogs)
  }
];
