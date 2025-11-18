import { Routes } from '@angular/router';

import { ProAccountCenterApplicationsComponent } from './center/applications/applications.component';
import { ProAccountCenterArticlesComponent } from './center/articles/articles.component';
import { ProAccountCenterComponent } from './center/center.component';
import { ProAccountCenterProjectsComponent } from './center/projects/projects.component';
import { ProAccountSettingsBaseComponent } from './settings/base/base.component';
import { ProAccountSettingsBindingComponent } from './settings/binding/binding.component';
import { ProAccountSettingsNotificationComponent } from './settings/notification/notification.component';
import { ProAccountSettingsSecurityComponent } from './settings/security/security.component';
import { ProAccountSettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'center',
        component: ProAccountCenterComponent,
        data: { title: '帳戶中心' },
        children: [
          { path: '', redirectTo: 'articles', pathMatch: 'full' },
          {
            path: 'articles',
            component: ProAccountCenterArticlesComponent,
            data: { title: '帳戶文章', titleI18n: 'pro-account-center' }
          },
          {
            path: 'projects',
            component: ProAccountCenterProjectsComponent,
            data: { title: '帳戶專案', titleI18n: 'pro-account-center' }
          },
          {
            path: 'applications',
            component: ProAccountCenterApplicationsComponent,
            data: { title: '帳戶應用', titleI18n: 'pro-account-center' }
          }
        ]
      },
      {
        path: 'settings',
        component: ProAccountSettingsComponent,
        data: { title: '帳戶設定' },
        children: [
          { path: '', redirectTo: 'base', pathMatch: 'full' },
          {
            path: 'base',
            component: ProAccountSettingsBaseComponent,
            data: { title: '基本設定', titleI18n: 'pro-account-settings' }
          },
          {
            path: 'security',
            component: ProAccountSettingsSecurityComponent,
            data: { title: '安全設定', titleI18n: 'pro-account-settings' }
          },
          {
            path: 'binding',
            component: ProAccountSettingsBindingComponent,
            data: { title: '帳戶綁定', titleI18n: 'pro-account-settings' }
          },
          {
            path: 'notification',
            component: ProAccountSettingsNotificationComponent,
            data: { title: '通知設定', titleI18n: 'pro-account-settings' }
          }
        ]
      }
    ]
  }
];
