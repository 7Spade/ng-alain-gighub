import { Routes } from '@angular/router';

import { HelpCenterComponent } from './helpcenter/helpcenter.component';
import { ExtrasPoiComponent } from './poi/poi.component';
import { ExtrasSettingsComponent } from './settings/settings.component';
import { UnderDevelopmentDemoComponent } from './under-development/demo.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';

export const routes: Routes = [
  { path: '', redirectTo: 'helpcenter', pathMatch: 'full' },
  { path: 'helpcenter', component: HelpCenterComponent },
  { path: 'settings', component: ExtrasSettingsComponent },
  { path: 'poi', component: ExtrasPoiComponent },
  { path: 'under-development', component: UnderDevelopmentDemoComponent },
  { path: 'coming-soon', component: ComingSoonComponent }
];
