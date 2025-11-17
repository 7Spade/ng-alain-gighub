import { Routes } from '@angular/router';

import { BlueprintDetailComponent } from './detail.component';

export const routes: Routes = [
  {
    path: '',
    component: BlueprintDetailComponent,
    data: { title: '藍圖詳情' },
    children: [
      {
        path: 'progress',
        loadComponent: () => import('../tabs/progress/progress.component').then(m => m.BlueprintProgressComponent),
        data: { title: '進度追蹤' }
      },
      {
        path: 'report',
        loadComponent: () => import('../tabs/report/report.component').then(m => m.BlueprintReportComponent),
        data: { title: '每日報表' }
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('../tabs/tasks/features/task-overview/components/tasks-overview/tasks-overview.component').then(
            m => m.BlueprintTasksOverviewComponent
          ),
        data: { title: '任務' }
      },
      {
        path: 'documents',
        loadComponent: () => import('../tabs/documents/documents.component').then(m => m.BlueprintDocumentsComponent),
        data: { title: '文件管理' }
      },
      {
        path: 'charts',
        loadComponent: () => import('../tabs/charts/charts.component').then(m => m.BlueprintChartsComponent),
        data: { title: '圖表分析' }
      },
      {
        path: 'activity',
        loadComponent: () => import('../tabs/activity/activity.component').then(m => m.BlueprintActivityComponent),
        data: { title: '活動記錄' }
      },
      {
        path: 'discussions',
        loadComponent: () => import('../tabs/discussions/discussions.component').then(m => m.BlueprintDiscussionsComponent),
        data: { title: '討論' }
      },
      {
        path: 'quality',
        loadComponent: () => import('../tabs/quality/quality.component').then(m => m.BlueprintQualityComponent),
        data: { title: '品質管理' }
      },
      {
        path: 'issues',
        loadComponent: () => import('../tabs/issues/issues.component').then(m => m.BlueprintIssuesComponent),
        data: { title: '問題追蹤' }
      },
      {
        path: 'weather',
        loadComponent: () => import('../tabs/weather/weather.component').then(m => m.BlueprintWeatherComponent),
        data: { title: '天氣預報' }
      },
      {
        path: 'settings',
        loadComponent: () => import('../tabs/settings/settings.component').then(m => m.BlueprintSettingsComponent),
        data: { title: '設定' }
      },
      {
        path: '',
        loadComponent: () => import('../tabs/overview/overview.component').then(m => m.BlueprintOverviewComponent),
        data: { title: '概覽' }
      }
    ]
  }
];
