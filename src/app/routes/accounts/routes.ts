import { Routes } from '@angular/router';

import { BotListComponent } from './bots/bot-list.component';
import { CreateBotComponent } from './create/create-bot.component';
import { CreateOrganizationComponent } from './create/create-organization.component';
import { AccountDetailComponent } from './detail/account-detail.component';
import { AccountFormComponent } from './form/account-form.component';
import { AccountListComponent } from './list/account-list.component';
import { ScheduleListComponent } from './schedules/schedule-list.component';
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
  { path: 'bots', component: BotListComponent },
  { path: 'schedules', component: ScheduleListComponent },
  // 组织管理路由（从 /org 迁移过来）
  {
    path: 'org',
    loadChildren: () => import('./org/routes').then(m => m.routes)
  },
  // 动态路径放在最后
  { path: ':id', component: AccountDetailComponent },
  { path: ':id/edit', component: AccountFormComponent }
];
