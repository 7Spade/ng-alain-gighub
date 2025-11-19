/**
 * Task Detail Routes
 *
 * 任務詳情路由配置
 * 定義任務詳情頁面及其子路由（多標籤頁）
 */

import { Routes } from '@angular/router';

export const TASK_DETAIL_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./components/task-detail.component').then(m => m.TaskDetailComponent),
    data: { title: '任務詳情' },
    children: [
      {
        path: '',
        redirectTo: 'basic',
        pathMatch: 'full'
      },
      {
        path: 'basic',
        loadComponent: () => import('./components/task-detail-tabs/task-detail-basic.component').then(m => m.TaskDetailBasicComponent),
        data: { title: '基本資訊' }
      },
      {
        path: 'time',
        loadComponent: () => import('./components/task-detail-tabs/task-detail-time.component').then(m => m.TaskDetailTimeComponent),
        data: { title: '時間安排' }
      },
      {
        path: 'dependency',
        loadComponent: () =>
          import('./components/task-detail-tabs/task-detail-dependency.component').then(m => m.TaskDetailDependencyComponent),
        data: { title: '依賴關係' }
      },
      {
        path: 'resource',
        loadComponent: () =>
          import('./components/task-detail-tabs/task-detail-resource.component').then(m => m.TaskDetailResourceComponent),
        data: { title: '資源配置' }
      },
      {
        path: 'progress',
        loadComponent: () =>
          import('./components/task-detail-tabs/task-detail-progress.component').then(m => m.TaskDetailProgressComponent),
        data: { title: '進度追蹤' }
      },
      {
        path: 'cost',
        loadComponent: () => import('./components/task-detail-tabs/task-detail-cost.component').then(m => m.TaskDetailCostComponent),
        data: { title: '成本管理' }
      },
      {
        path: 'quality',
        loadComponent: () => import('./components/task-detail-tabs/task-detail-quality.component').then(m => m.TaskDetailQualityComponent),
        data: { title: '品質控制' }
      },
      {
        path: 'risk',
        loadComponent: () => import('./components/task-detail-tabs/task-detail-risk.component').then(m => m.TaskDetailRiskComponent),
        data: { title: '風險管理' }
      },
      {
        path: 'safety',
        loadComponent: () => import('./components/task-detail-tabs/task-detail-safety.component').then(m => m.TaskDetailSafetyComponent),
        data: { title: '安全管理' }
      },
      {
        path: 'change',
        loadComponent: () => import('./components/task-detail-tabs/task-detail-change.component').then(m => m.TaskDetailChangeComponent),
        data: { title: '變更記錄' }
      }
    ]
  }
];
