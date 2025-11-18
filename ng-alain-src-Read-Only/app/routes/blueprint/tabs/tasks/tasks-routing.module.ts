import { Routes } from '@angular/router';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/task-overview/components/tasks-overview/tasks-overview.component').then(m => m.BlueprintTasksOverviewComponent),
    data: { title: '任務總覽' }
  },
  {
    path: 'detail',
    loadChildren: () => import('./features/task-detail/task-detail-routing.module').then(m => m.TASK_DETAIL_ROUTES)
  },
  {
    path: 'dependency/:id',
    loadComponent: () => import('./features/task-dependency/components/task-dependency.component').then(m => m.TaskDependencyComponent),
    data: { title: '任務依賴' }
  },
  {
    path: 'form',
    loadComponent: () => import('./features/task-form/components/task-form.component').then(m => m.TaskFormComponent),
    data: { title: '建立任務' }
  },
  {
    path: 'form/:id',
    loadComponent: () => import('./features/task-form/components/task-form.component').then(m => m.TaskFormComponent),
    data: { title: '編輯任務' }
  },
  {
    path: 'gantt',
    loadComponent: () => import('./features/task-gantt/components/task-gantt.component').then(m => m.TaskGanttComponent),
    data: { title: '甘特圖' }
  },
  {
    path: 'location/:id',
    loadComponent: () => import('./features/task-location/components/task-location.component').then(m => m.TaskLocationComponent),
    data: { title: '空間視圖' }
  },
  {
    path: 'resource/:id',
    loadComponent: () => import('./features/task-resource/components/task-resource.component').then(m => m.TaskResourceComponent),
    data: { title: '資源配置' }
  }
];
