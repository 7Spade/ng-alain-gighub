import { Routes } from '@angular/router';

import { HelpCenterComponent } from './helpcenter/helpcenter.component';
import { ExtrasPoiComponent } from './poi/poi.component';
import { ExtrasSettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: 'helpcenter', component: HelpCenterComponent, data: { title: '協助中心' } },
  { path: 'settings', component: ExtrasSettingsComponent, data: { title: '個人設定' } },
  { path: 'poi', component: ExtrasPoiComponent, data: { title: '地點資訊' } }
];
