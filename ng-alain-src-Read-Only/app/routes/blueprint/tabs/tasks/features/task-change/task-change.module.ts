import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ROUTES } from '@angular/router';

import { TASK_CHANGE_ROUTES } from './task-change-routing.module';

/**
 * 提供 Task Change 功能的路由註冊。
 * 後續擴充時僅需更新 `TASK_CHANGE_ROUTES`。
 */
export function provideTaskChangeFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: ROUTES, useValue: TASK_CHANGE_ROUTES, multi: true }]);
}
