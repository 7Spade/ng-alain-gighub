import { Routes } from '@angular/router';

import { OrgMembersComponent } from './members/members.component';
import { OrgTeamsComponent } from './teams/teams.component';
import { OrgTeamMembersComponent } from './teams/members/members.component';

/**
 * 组织管理路由配置
 *
 * 路由结构：
 * /org/:id/members - 组织成员列表
 * /org/:id/teams - 组织团队列表
 * /org/teams/:id/members - 团队成员列表
 *
 * 注意：路由顺序很重要，具体路径（:id/teams）必须在动态路径（teams/:id/members）之前
 */
export const routes: Routes = [
  {
    path: ':id/members',
    component: OrgMembersComponent,
    data: { title: '成員管理', titleI18n: 'menu.org.members' }
  },
  {
    path: ':id/teams',
    component: OrgTeamsComponent,
    data: { title: '團隊管理', titleI18n: 'menu.org.teams' }
  },
  {
    path: 'teams/:id/members',
    component: OrgTeamMembersComponent,
    data: { title: '團隊成員管理', titleI18n: 'menu.org.team.members' }
  }
];
