import { Routes } from '@angular/router';

import { OrgMembersComponent } from './members/members.component';
import { OrgOverviewComponent } from './overview/overview.component';
import { OrgSettingsComponent } from './settings/settings.component';
import { OrgTeamsComponent } from './teams/teams.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
  {
    path: 'overview',
    component: OrgOverviewComponent,
    data: { title: '組織概覽' }
  },
  {
    path: 'teams',
    component: OrgTeamsComponent,
    data: { title: '團隊管理', titleI18n: 'menu.org.teams' }
  },
  {
    path: 'members',
    component: OrgMembersComponent,
    data: { title: '成員管理', titleI18n: 'menu.org.members' }
  },
  {
    path: 'settings',
    component: OrgSettingsComponent,
    data: { title: '組織設定' },
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      {
        path: 'general',
        loadChildren: () => import('./settings/general.routes').then(m => m.routes)
      },
      {
        path: 'teams',
        loadChildren: () => import('./settings/teams.routes').then(m => m.routes)
      },
      {
        path: 'members',
        loadChildren: () => import('./settings/members.routes').then(m => m.routes)
      }
    ]
  }
];
