import { Routes } from '@angular/router';
import { AccountListComponent } from './list/account-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: AccountListComponent },
  // TODO: 添加详情、编辑、创建页面路由
  // { path: ':id', component: AccountDetailComponent },
  // { path: ':id/edit', component: AccountEditComponent },
  // { path: 'create', component: AccountCreateComponent }
];

