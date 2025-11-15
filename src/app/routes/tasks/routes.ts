import { Routes } from '@angular/router';

export const TASK_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./list/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path: 'board',
    loadComponent: () => import('./board/task-board.component').then(m => m.TaskBoardComponent)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/task-calendar.component').then(m => m.TaskCalendarComponent)
  },
  {
    path: 'detail',
    loadComponent: () => import('./detail-shell/task-detail-shell.component').then(m => m.TaskDetailShellComponent)
  },
  {
    path: 'form',
    loadComponent: () => import('./form-hub/task-form-hub.component').then(m => m.TaskFormHubComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./form/task-form.component').then(m => m.TaskFormComponent)
  },
  {
    path: 'assignments',
    loadComponent: () => import('./assignments/task-assignments.component').then(m => m.TaskAssignmentsComponent)
  },
  {
    path: 'todo',
    loadComponent: () => import('./todo/task-todo.component').then(m => m.TaskTodoComponent)
  },
  {
    path: 'staging',
    loadComponent: () => import('./staging/task-staging.component').then(m => m.TaskStagingComponent)
  },
  {
    path: 'daily-reports',
    loadComponent: () => import('./daily-reports/daily-reports.component').then(m => m.DailyReportsComponent)
  },
  {
    path: 'photos',
    loadComponent: () => import('./photos/task-photos.component').then(m => m.TaskPhotosComponent)
  },
  {
    path: 'weather',
    loadComponent: () => import('./weather/task-weather.component').then(m => m.TaskWeatherComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./detail/task-detail.component').then(m => m.TaskDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./form/task-form.component').then(m => m.TaskFormComponent)
  }
];
