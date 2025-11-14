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
    path: ':id',
    loadComponent: () => import('./detail/issue-detail.component').then(m => m.IssueDetailComponent)
  },
  {
    path: 'assignments',
    loadComponent: () => import('./assignments/issue-assignments.component').then(m => m.IssueAssignmentsComponent)
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
  }
];

