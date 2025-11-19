import { Routes } from '@angular/router';

import { ExceptionComponent } from './exception.component';
import { ExceptionTriggerComponent } from './trigger.component';

export const routes: Routes = [
  { path: '403', component: ExceptionComponent, data: { title: '403 無權限', type: 403 } },
  { path: '404', component: ExceptionComponent, data: { title: '404 找不到頁面', type: 404 } },
  { path: '500', component: ExceptionComponent, data: { title: '500 伺服器錯誤', type: 500 } },
  { path: 'trigger', component: ExceptionTriggerComponent, data: { title: '異常觸發' } }
];
