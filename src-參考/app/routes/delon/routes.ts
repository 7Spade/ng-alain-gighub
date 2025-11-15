import { Routes } from '@angular/router';
import { aclCanActivate } from '@delon/acl';

import { ACLComponent } from './acl/acl.component';
import { CacheComponent } from './cache/cache.component';
import { DownFileComponent } from './downfile/downfile.component';
import { DelonFormComponent } from './form/form.component';
import { GuardAdminComponent } from './guard/admin.component';
import { GuardAuthComponent } from './guard/auth.component';
import { canLeave } from './guard/can-leave';
import { GuardComponent } from './guard/guard.component';
import { GuardLeaveComponent } from './guard/leave.component';
import { PrintComponent } from './print/print.component';
import { QRComponent } from './qr/qr.component';
import { STDemoComponent } from './st/st.component';
import { UtilComponent } from './util/util.component';
import { XlsxComponent } from './xlsx/xlsx.component';
import { ZipComponent } from './zip/zip.component';

export const routes: Routes = [
  { path: 'st', component: STDemoComponent, data: { title: 'ST 智能表格' } },
  { path: 'util', component: UtilComponent, data: { title: '工具函數' } },
  { path: 'print', component: PrintComponent, data: { title: '列印範例' } },
  { path: 'acl', component: ACLComponent, data: { title: '訪問控制' } },
  {
    path: 'guard',
    component: GuardComponent,
    data: { title: '路由守衛示例' },
    children: [
      {
        path: 'leave',
        component: GuardLeaveComponent,
        canDeactivate: [canLeave],
        data: { title: '離開守衛' }
      },
      {
        path: 'auth',
        component: GuardAuthComponent,
        canActivate: [aclCanActivate],
        data: { title: '使用者守衛', guard: 'user1' }
      },
      {
        path: 'admin',
        component: GuardAdminComponent,
        canActivate: [aclCanActivate],
        data: { title: '管理員守衛', guard: 'admin' }
      }
    ]
  },
  { path: 'cache', component: CacheComponent, data: { title: '快取示例' } },
  { path: 'qr', component: QRComponent, data: { title: '二維碼生成' } },
  { path: 'downfile', component: DownFileComponent, data: { title: '檔案下載' } },
  { path: 'xlsx', component: XlsxComponent, data: { title: 'Excel 匯出' } },
  { path: 'zip', component: ZipComponent, data: { title: 'ZIP 壓縮' } },
  { path: 'form', component: DelonFormComponent, data: { title: '動態表單' } }
];
