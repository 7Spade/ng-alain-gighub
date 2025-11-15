import { Routes } from '@angular/router';

import { DashboardAnalysisComponent } from './analysis/analysis.component';
import { DashboardMonitorComponent } from './monitor/monitor.component';
import { DashboardV1Component } from './v1/v1.component';
import { DashboardWorkplaceComponent } from './workplace/workplace.component';

export const routes: Routes = [
  { path: '', redirectTo: 'v1', pathMatch: 'full' },
  { path: 'v1', component: DashboardV1Component, data: { title: '儀表板總覽' } },
  { path: 'analysis', component: DashboardAnalysisComponent, data: { title: '分析頁' } },
  { path: 'monitor', component: DashboardMonitorComponent, data: { title: '監控頁' } },
  { path: 'workplace', component: DashboardWorkplaceComponent, data: { title: '工作臺' } }
];
