import { Routes } from '@angular/router';

import { CallbackComponent } from './callback.component';
import { UserLockComponent } from './lock/lock.component';
import { UserLoginComponent } from './login/login.component';
import { UserRegisterComponent } from './register/register.component';
import { UserRegisterResultComponent } from './register-result/register-result.component';
import { LayoutPassportComponent } from '../../layout';

export const routes: Routes = [
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    data: { title: '帳號入口' },
    children: [
      {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '登錄', titleI18n: 'app.login.login' }
      },
      {
        path: 'register',
        component: UserRegisterComponent,
        data: { title: '註冊', titleI18n: 'app.register.register' }
      },
      {
        path: 'register-result',
        component: UserRegisterResultComponent,
        data: { title: '註冊結果', titleI18n: 'app.register.register' }
      },
      {
        path: 'lock',
        component: UserLockComponent,
        data: { title: '鎖屏', titleI18n: 'app.lock' }
      }
    ]
  },
  // 單頁不包裹Layout - Supabase 郵件確認回調
  { path: 'passport/callback', component: CallbackComponent, data: { title: '登入回調' } }
];
