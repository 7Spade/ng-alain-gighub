import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ROUTES } from '@angular/router';

import { TASK_DEPENDENCY_ROUTES } from './task-dependency-routing.module';

export function provideTaskDependencyFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: ROUTES, useValue: TASK_DEPENDENCY_ROUTES, multi: true }]);
}
