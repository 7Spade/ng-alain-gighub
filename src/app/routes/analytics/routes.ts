import { Routes } from '@angular/router';

export const ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'statistics',
    pathMatch: 'full'
  },
  {
    path: 'statistics',
    loadComponent: () => import('./statistics/statistics.component').then(m => m.StatisticsComponent)
  },
  {
    path: 'progress',
    loadComponent: () => import('./progress/progress-tracking.component').then(m => m.ProgressTrackingComponent)
  },
  {
    path: 'progress-update',
    loadComponent: () => import('./progress-update/progress-update.component').then(m => m.ProgressUpdateComponent)
  },
  {
    path: 'main-reports',
    loadComponent: () => import('./reports/main-report.component').then(m => m.MainReportComponent)
  },
  {
    path: 'branch-reports',
    loadComponent: () => import('./reports/branch-report.component').then(m => m.BranchReportComponent)
  },
  {
    path: 'cross-branch',
    loadComponent: () => import('./reports/cross-branch.component').then(m => m.CrossBranchComponent)
  },
  {
    path: 'activity-logs',
    loadComponent: () => import('./activity-logs/activity-log.component').then(m => m.ActivityLogComponent)
  },
  {
    path: 'activity-logs/detail',
    loadComponent: () => import('./activity-logs/detail/activity-log-detail').then(m => m.ActivityLogDetail)
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/data-report.component').then(m => m.DataReportComponent)
  },
  {
    path: 'export',
    loadComponent: () => import('./reports/report-export.component').then(m => m.ReportExportComponent)
  },
  {
    path: 'charts',
    loadComponent: () => import('./charts/chart-center.component').then(m => m.ChartCenterComponent)
  }
];
