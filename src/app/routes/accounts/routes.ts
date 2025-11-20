import { Routes } from '@angular/router';

import { CreateBotComponent } from './create/create-bot.component';
import { CreateOrganizationComponent } from './create/create-organization.component';
import { AccountDetailComponent } from './detail/account-detail.component';
import { AccountFormComponent } from './form/account-form.component';

/**
 * 账户管理路由配置
 *
 * 路由结构：
 * /accounts - 重定向到 /accounts/org（组织管理）
 * /accounts/create/organization - 创建组织
 * /accounts/create/bot - 创建机器人
 * /accounts/org - 组织管理（懒加载）
 * /accounts/:id - 账户详情
 * /accounts/:id/edit - 编辑账户
 *
 * 注意：
 * - 已移除管理员功能模块（list、users、bots）
 * - schedules 已移动到 org 模块下
 */
export const routes: Routes = [
  { path: '', redirectTo: 'org', pathMatch: 'full' },
  // 创建路由：按账户类型分离
  // 注意：User 账户通过注册流程的触发器自动创建，不需要手动创建组件
  { path: 'create/organization', component: CreateOrganizationComponent },
  { path: 'create/bot', component: CreateBotComponent },
  // 组织管理路由（包含 schedules）
  {
    path: 'org',
    loadChildren: () => import('./org/routes').then(m => m.routes)
  },
  // 动态路径放在最后
  { path: ':id', component: AccountDetailComponent },
  { path: ':id/edit', component: AccountFormComponent }
];
