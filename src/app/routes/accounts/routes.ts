import { Routes } from '@angular/router';

import { BotListComponent } from './bots/bot-list.component';
import { CreateBotComponent } from './create/create-bot.component';
import { CreateOrganizationComponent } from './create/create-organization.component';
import { AccountDetailComponent } from './detail/account-detail.component';
import { AccountFormComponent } from './form/account-form.component';
import { AccountListComponent } from './list/account-list.component';
import { OrganizationListComponent } from './organizations/organization-list.component';
import { ScheduleListComponent } from './schedules/schedule-list.component';
import { TeamCreateComponent } from './teams/team-create/team-create.component';
import { TeamDeleteComponent } from './teams/team-delete/team-delete.component';
import { TeamDetailComponent } from './teams/team-detail/team-detail.component';
import { TeamEditComponent } from './teams/team-edit/team-edit.component';
import { TeamListComponent } from './teams/team-list/team-list.component';
import { UserListComponent } from './users/user-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: AccountListComponent },
  // 创建路由：按账户类型分离
  // 注意：User 账户通过注册流程的触发器自动创建，不需要手动创建组件
  { path: 'create/organization', component: CreateOrganizationComponent },
  { path: 'create/bot', component: CreateBotComponent },
  // 具体路径必须放在动态路径（:id）之前，避免路由冲突
  { path: 'users', component: UserListComponent },
  { path: 'organizations', component: OrganizationListComponent },
  { path: 'bots', component: BotListComponent },
  { path: 'teams/create', component: TeamCreateComponent },
  { path: 'teams', component: TeamListComponent },
  { path: 'teams/:id/edit', component: TeamEditComponent },
  { path: 'teams/:id', component: TeamDetailComponent },
  { path: 'schedules', component: ScheduleListComponent },
  // 动态路径放在最后
  { path: ':id', component: AccountDetailComponent },
  { path: ':id/edit', component: AccountFormComponent }
];
