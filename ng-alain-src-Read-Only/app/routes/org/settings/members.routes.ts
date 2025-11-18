import { Routes } from '@angular/router';

import { OrgSettingsMembersComponent } from './members/members.component';

export const routes: Routes = [{ path: '', component: OrgSettingsMembersComponent, data: { title: '成員設定' } }];
