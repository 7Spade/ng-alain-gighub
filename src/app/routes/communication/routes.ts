import { Routes } from '@angular/router';

export const COMMUNICATION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'discussions',
    pathMatch: 'full'
  },
  {
    path: 'discussions',
    loadComponent: () => import('./discussions/discussion-list.component').then(m => m.DiscussionListComponent)
  },
  {
    path: 'comments',
    loadComponent: () => import('./comments/comment-list.component').then(m => m.CommentListComponent)
  },
  {
    path: 'comments/create',
    loadComponent: () => import('./comments/comment-create.component').then(m => m.CommentCreateComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notification-center.component').then(m => m.NotificationCenterComponent)
  },
  {
    path: 'realtime',
    loadComponent: () => import('./realtime/realtime-notify.component').then(m => m.RealtimeNotifyComponent)
  },
  {
    path: 'todos',
    loadComponent: () => import('./todos/todo-center.component').then(m => m.TodoCenterComponent)
  },
  {
    path: 'team-notify',
    loadComponent: () => import('./team-notify/team-notify.component').then(m => m.TeamNotifyComponent)
  }
];
