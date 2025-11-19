import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ROUTES } from '@angular/router';

import { TASKS_ROUTES } from './tasks-routing.module';

/** 以 Standalone 方式註冊 Blueprint Tasks 區域的路由提供者。 */
export function provideTasksFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: ROUTES, useValue: TASKS_ROUTES, multi: true }]);
}
