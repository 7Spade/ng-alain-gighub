import { Routes } from '@angular/router';

import { AdvancedFormComponent } from './form/advanced-form/advanced-form.component';
import { BasicFormComponent } from './form/basic-form/basic-form.component';
import { StepFormComponent } from './form/step-form/step-form.component';
import { ProListApplicationsComponent } from './list/applications/applications.component';
import { ProListArticlesComponent } from './list/articles/articles.component';
import { ProBasicListComponent } from './list/basic-list/basic-list.component';
import { ProCardListComponent } from './list/card-list/card-list.component';
import { ProListLayoutComponent } from './list/list/list.component';
import { ProListProjectsComponent } from './list/projects/projects.component';
import { ProTableListComponent } from './list/table-list/table-list.component';
import { ProProfileAdvancedComponent } from './profile/advanced/advanced.component';
import { ProProfileBaseComponent } from './profile/basic/basic.component';
import { ProResultFailComponent } from './result/fail/fail.component';
import { ProResultSuccessComponent } from './result/success/success.component';

export const routes: Routes = [
  {
    path: 'form',
    data: { title: '表單頁' },
    children: [
      { path: 'basic-form', component: BasicFormComponent, data: { title: '基礎表單' } },
      { path: 'step-form', component: StepFormComponent, data: { title: '分步表單' } },
      { path: 'advanced-form', component: AdvancedFormComponent, data: { title: '高級表單' } }
    ]
  },
  {
    path: 'list',
    data: { title: '清單頁' },
    children: [
      { path: 'table-list', component: ProTableListComponent, data: { title: '表格清單' } },
      { path: 'basic-list', component: ProBasicListComponent, data: { title: '標準清單' } },
      { path: 'card-list', component: ProCardListComponent, data: { title: '卡片清單' } },
      {
        path: '',
        component: ProListLayoutComponent,
        data: { title: '清單標籤' },
        children: [
          { path: 'articles', component: ProListArticlesComponent, data: { title: '文章列表' } },
          { path: 'projects', component: ProListProjectsComponent, data: { title: '專案列表' } },
          { path: 'applications', component: ProListApplicationsComponent, data: { title: '應用列表' } }
        ]
      }
    ]
  },
  {
    path: 'profile',
    data: { title: '檔案詳情' },
    children: [
      { path: 'basic', component: ProProfileBaseComponent, data: { title: '基礎檔案' } },
      { path: 'advanced', component: ProProfileAdvancedComponent, data: { title: '高級檔案' } }
    ]
  },
  {
    path: 'result',
    data: { title: '提交結果' },
    children: [
      { path: 'success', component: ProResultSuccessComponent, data: { title: '提交成功' } },
      { path: 'fail', component: ProResultFailComponent, data: { title: '提交失敗' } }
    ]
  }
];
