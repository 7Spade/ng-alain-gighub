import { Routes } from '@angular/router';

import { OrgSettingsGeneralComponent } from './general/general.component';

export const routes: Routes = [{ path: '', component: OrgSettingsGeneralComponent, data: { title: '基本資訊' } }];
