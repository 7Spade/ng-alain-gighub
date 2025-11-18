import { Routes } from '@angular/router';

import { OrgSettingsTeamsComponent } from './teams/teams.component';

export const routes: Routes = [{ path: '', component: OrgSettingsTeamsComponent, data: { title: '團隊設定' } }];
