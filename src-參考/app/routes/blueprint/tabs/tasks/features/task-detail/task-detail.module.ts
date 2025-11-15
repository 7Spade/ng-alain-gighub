import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ROUTES } from '@angular/router';

import { TASK_DETAIL_ROUTES } from './task-detail-routing.module';

export function provideTaskDetailFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: ROUTES, useValue: [{ path: '', children: TASK_DETAIL_ROUTES }], multi: true }]);
}
