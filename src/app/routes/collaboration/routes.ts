import { Routes } from '@angular/router';

export const COLLABORATION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./list/collaboration-list.component').then(m => m.CollaborationListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./form/collaboration-form.component').then(m => m.CollaborationFormComponent)
  },
  {
    path: 'invitations',
    loadComponent: () => import('./invitations/invitation-list.component').then(m => m.InvitationListComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./form/collaboration-form.component').then(m => m.CollaborationFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./detail/collaboration-detail.component').then(m => m.CollaborationDetailComponent)
  }
];

