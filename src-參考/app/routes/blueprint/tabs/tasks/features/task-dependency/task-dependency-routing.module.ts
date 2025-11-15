import { Routes } from '@angular/router';

export const TASK_DEPENDENCY_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./components/task-dependency.component').then(m => m.TaskDependencyComponent),
    data: { title: '任務依賴' }
  }
];
