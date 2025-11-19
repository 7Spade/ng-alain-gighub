import { Routes } from '@angular/router';

import { OrgMembersComponent } from './members/members.component';
import { OrgTeamMembersComponent } from './teams/members/members.component';

/**
 * 组织管理路由配置
 *
 * 路由结构：
 * /org/:id/members - 组织成员列表
 * /org/teams/:id/members - 团队成员列表
 */
export const routes: Routes = [
  {
    path: ':id/members',
    component: OrgMembersComponent,
    data: { title: '成員管理', titleI18n: 'menu.org.members' }
  },
  {
    path: 'teams/:id/members',
    component: OrgTeamMembersComponent,
    data: { title: '團隊成員管理', titleI18n: 'menu.org.team.members' }
  }
];
