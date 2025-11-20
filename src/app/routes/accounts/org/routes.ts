import { Routes } from '@angular/router';

import { OrgMembersComponent } from './org-members/members.component';
import { OrgRoleManageComponent } from './org-role-manage/role-manage.component';
import { OrgComponent } from './org.component';
import { OrgTeamMembersComponent } from './teams/team-member/members.component';
import { OrgTeamsComponent } from './teams/teams.component';

/**
 * 组织管理路由配置
 *
 * 路由结构：
 * /accounts/org - 组织列表（我的组织、我加入的组织）
 * /accounts/org/:id/members - 组织成员列表
 * /accounts/org/:id/roles - 角色管理
 * /accounts/org/:id/teams - 组织团队列表
 * /accounts/org/teams/:id/members - 团队成员列表
 *
 * 注意：路由顺序很重要，具体路径（:id/teams）必须在动态路径（teams/:id/members）之前
 */
export const routes: Routes = [
  {
    path: '',
    component: OrgComponent,
    data: { title: '組織管理', titleI18n: 'menu.org' }
  },
  {
    path: ':id/members',
    component: OrgMembersComponent,
    data: { title: '成員管理', titleI18n: 'menu.org.members' }
  },
  {
    path: ':id/roles',
    component: OrgRoleManageComponent,
    data: { title: '角色管理', titleI18n: 'menu.org.roles' }
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
