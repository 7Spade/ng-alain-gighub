This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where line numbers have been added.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: src/**/*.ts
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Line numbers have been added to the beginning of each line
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/app/app.component.ts
src/app/app.config.ts
src/app/core/i18n/i18n.service.spec.ts
src/app/core/i18n/i18n.service.ts
src/app/core/index.ts
src/app/core/infra/errors/error.types.ts
src/app/core/infra/errors/index.ts
src/app/core/infra/errors/supabase-error.transformer.ts
src/app/core/infra/index.ts
src/app/core/infra/repositories/account.repository.ts
src/app/core/infra/repositories/base.repository.ts
src/app/core/infra/repositories/blueprint-branch.repository.ts
src/app/core/infra/repositories/blueprint-config.repository.ts
src/app/core/infra/repositories/blueprint.repository.ts
src/app/core/infra/repositories/branch-fork.repository.ts
src/app/core/infra/repositories/collaboration-invitation.repository.ts
src/app/core/infra/repositories/collaboration-member.repository.ts
src/app/core/infra/repositories/index.ts
src/app/core/infra/repositories/organization-collaboration.repository.spec.ts
src/app/core/infra/repositories/organization-collaboration.repository.ts
src/app/core/infra/repositories/organization-schedule.repository.ts
src/app/core/infra/repositories/pull-request.repository.ts
src/app/core/infra/repositories/team-member.repository.ts
src/app/core/infra/repositories/team.repository.ts
src/app/core/infra/types/account.types.ts
src/app/core/infra/types/blueprint.types.ts
src/app/core/infra/types/collaboration.types.ts
src/app/core/infra/types/database.types.ts
src/app/core/infra/types/index.ts
src/app/core/infra/utils/index.ts
src/app/core/infra/utils/transformers.ts
src/app/core/net/default.interceptor.ts
src/app/core/net/helper.ts
src/app/core/net/index.ts
src/app/core/net/refresh-token.ts
src/app/core/permissions/index.ts
src/app/core/permissions/permission.service.ts
src/app/core/permissions/role.service.ts
src/app/core/permissions/types.ts
src/app/core/start-page.guard.ts
src/app/core/startup/startup.service.ts
src/app/core/supabase/index.ts
src/app/core/supabase/supabase-auth-adapter.service.ts
src/app/core/supabase/supabase.service.ts
src/app/layout/basic/basic.component.ts
src/app/layout/basic/widgets/clear-storage.component.ts
src/app/layout/basic/widgets/fullscreen.component.ts
src/app/layout/basic/widgets/i18n.component.ts
src/app/layout/basic/widgets/icon.component.ts
src/app/layout/basic/widgets/notify.component.ts
src/app/layout/basic/widgets/rtl.component.ts
src/app/layout/basic/widgets/search.component.ts
src/app/layout/basic/widgets/task.component.ts
src/app/layout/basic/widgets/user.component.ts
src/app/layout/blank/blank.component.ts
src/app/layout/index.ts
src/app/layout/passport/passport.component.ts
src/app/routes/accounts/bots/bot-list.component.ts
src/app/routes/accounts/detail/account-detail.component.ts
src/app/routes/accounts/form/account-form.component.ts
src/app/routes/accounts/list/account-list.component.ts
src/app/routes/accounts/organizations/organization-list.component.ts
src/app/routes/accounts/routes.ts
src/app/routes/accounts/schedules/schedule-list.component.ts
src/app/routes/accounts/teams/team-detail/team-detail.component.ts
src/app/routes/accounts/teams/team-list.component.ts
src/app/routes/accounts/users/user-list.component.ts
src/app/routes/analytics/activity-logs/activity-log.component.ts
src/app/routes/analytics/charts/chart-center.component.ts
src/app/routes/analytics/progress-update/progress-update.component.ts
src/app/routes/analytics/progress/progress-tracking.component.ts
src/app/routes/analytics/reports/branch-report.component.ts
src/app/routes/analytics/reports/cross-branch.component.ts
src/app/routes/analytics/reports/data-report.component.ts
src/app/routes/analytics/reports/main-report.component.ts
src/app/routes/analytics/reports/report-export.component.ts
src/app/routes/analytics/routes.ts
src/app/routes/analytics/statistics/statistics.component.ts
src/app/routes/blueprints/branches/branch-management.component.ts
src/app/routes/blueprints/detail/blueprint-detail.component.ts
src/app/routes/blueprints/fork/blueprint-fork.component.ts
src/app/routes/blueprints/form/blueprint-form.component.ts
src/app/routes/blueprints/list/blueprint-list.component.ts
src/app/routes/blueprints/pull-requests/pull-request-list.component.ts
src/app/routes/blueprints/review/pr-review.component.ts
src/app/routes/blueprints/routes.ts
src/app/routes/blueprints/settings/blueprint-settings.component.ts
src/app/routes/bots/config/bot-config.component.ts
src/app/routes/bots/executions/bot-execution.component.ts
src/app/routes/bots/list/bot-list.component.ts
src/app/routes/bots/routes.ts
src/app/routes/collaboration/detail/collaboration-detail.component.ts
src/app/routes/collaboration/form/collaboration-form.component.ts
src/app/routes/collaboration/invitations/invitation-list.component.ts
src/app/routes/collaboration/list/collaboration-list.component.spec.ts
src/app/routes/collaboration/list/collaboration-list.component.ts
src/app/routes/collaboration/routes.ts
src/app/routes/communication/comments/comment-create.component.ts
src/app/routes/communication/comments/comment-list.component.ts
src/app/routes/communication/discussions/discussion-list.component.ts
src/app/routes/communication/notifications/notification-center.component.ts
src/app/routes/communication/realtime/realtime-notify.component.ts
src/app/routes/communication/routes.ts
src/app/routes/communication/team-notify/team-notify.component.ts
src/app/routes/communication/todos/todo-center.component.ts
src/app/routes/dashboard/analysis/analysis.component.ts
src/app/routes/dashboard/monitor/monitor.component.ts
src/app/routes/dashboard/routes.ts
src/app/routes/dashboard/v1/v1.component.ts
src/app/routes/dashboard/workplace/workplace.component.ts
src/app/routes/data-v/relation/relation.component.ts
src/app/routes/data-v/routes.ts
src/app/routes/delon/acl/acl.component.ts
src/app/routes/delon/cache/cache.component.ts
src/app/routes/delon/downfile/downfile.component.ts
src/app/routes/delon/form/form.component.ts
src/app/routes/delon/guard/admin.component.ts
src/app/routes/delon/guard/auth.component.ts
src/app/routes/delon/guard/can-leave.ts
src/app/routes/delon/guard/guard.component.ts
src/app/routes/delon/guard/leave.component.ts
src/app/routes/delon/print/print.component.ts
src/app/routes/delon/qr/qr.component.ts
src/app/routes/delon/routes.ts
src/app/routes/delon/st/st.component.ts
src/app/routes/delon/util/util.component.ts
src/app/routes/delon/xlsx/xlsx.component.ts
src/app/routes/delon/zip/zip.component.ts
src/app/routes/documents/browser/document-browser.component.ts
src/app/routes/documents/drawings/drawing-viewer.component.ts
src/app/routes/documents/list/document-list.component.ts
src/app/routes/documents/metadata/document-metadata.component.ts
src/app/routes/documents/permissions/document-permission.component.ts
src/app/routes/documents/preview/document-preview.component.ts
src/app/routes/documents/routes.ts
src/app/routes/documents/upload/document-upload.component.ts
src/app/routes/documents/versions/document-version.component.ts
src/app/routes/exception/exception.component.ts
src/app/routes/exception/routes.ts
src/app/routes/exception/trigger.component.ts
src/app/routes/extras/helpcenter/helpcenter.component.ts
src/app/routes/extras/poi/edit/edit.component.ts
src/app/routes/extras/poi/poi.component.ts
src/app/routes/extras/routes.ts
src/app/routes/extras/settings/settings.component.ts
src/app/routes/issues/assignments/issue-assignments.component.ts
src/app/routes/issues/close/issue-close.component.ts
src/app/routes/issues/detail/issue-detail.component.ts
src/app/routes/issues/form/issue-form.component.ts
src/app/routes/issues/handle/issue-handle.component.ts
src/app/routes/issues/list/issue-list.component.ts
src/app/routes/issues/photos/issue-photos.component.ts
src/app/routes/issues/routes.ts
src/app/routes/passport/callback.component.ts
src/app/routes/passport/lock/lock.component.ts
src/app/routes/passport/login/login.component.ts
src/app/routes/passport/register-result/register-result.component.ts
src/app/routes/passport/register/register.component.ts
src/app/routes/passport/routes.ts
src/app/routes/pro/account/center/applications/applications.component.ts
src/app/routes/pro/account/center/articles/articles.component.ts
src/app/routes/pro/account/center/center.component.ts
src/app/routes/pro/account/center/projects/projects.component.ts
src/app/routes/pro/account/settings/base/base.component.ts
src/app/routes/pro/account/settings/binding/binding.component.ts
src/app/routes/pro/account/settings/notification/notification.component.ts
src/app/routes/pro/account/settings/security/security.component.ts
src/app/routes/pro/account/settings/settings.component.ts
src/app/routes/pro/form/advanced-form/advanced-form.component.ts
src/app/routes/pro/form/basic-form/basic-form.component.ts
src/app/routes/pro/form/step-form/step-form.component.ts
src/app/routes/pro/form/step-form/step1.component.ts
src/app/routes/pro/form/step-form/step2.component.ts
src/app/routes/pro/form/step-form/step3.component.ts
src/app/routes/pro/form/step-form/transfer.service.ts
src/app/routes/pro/list/applications/applications.component.ts
src/app/routes/pro/list/articles/articles.component.ts
src/app/routes/pro/list/basic-list/basic-list.component.ts
src/app/routes/pro/list/basic-list/edit/edit.component.ts
src/app/routes/pro/list/card-list/card-list.component.ts
src/app/routes/pro/list/list/list.component.ts
src/app/routes/pro/list/projects/projects.component.ts
src/app/routes/pro/list/table-list/table-list.component.ts
src/app/routes/pro/profile/advanced/advanced.component.ts
src/app/routes/pro/profile/basic/basic.component.ts
src/app/routes/pro/result/fail/fail.component.ts
src/app/routes/pro/result/success/success.component.ts
src/app/routes/pro/routes.ts
src/app/routes/quality/checks/quality-checks.component.ts
src/app/routes/quality/inspections/quality-inspections.component.ts
src/app/routes/quality/photos/quality-photos.component.ts
src/app/routes/quality/results/quality-results.component.ts
src/app/routes/quality/routes.ts
src/app/routes/quality/submit/quality-submit.component.ts
src/app/routes/routes.ts
src/app/routes/style/color.service.ts
src/app/routes/style/colors/colors.component.ts
src/app/routes/style/gridmasonry/gridmasonry.component.ts
src/app/routes/style/routes.ts
src/app/routes/style/typography/typography.component.ts
src/app/routes/system/activity-logs/system-activity-log.component.ts
src/app/routes/system/branch-permissions/branch-permission.component.ts
src/app/routes/system/feature-flags/feature-flag.component.ts
src/app/routes/system/permission-matrix/permission-matrix.component.ts
src/app/routes/system/permissions/permission-assignment.component.ts
src/app/routes/system/roles/role-management.component.ts
src/app/routes/system/routes.ts
src/app/routes/system/settings/system-settings.component.ts
src/app/routes/system/weather-api/weather-api.component.ts
src/app/routes/tasks/assignments/task-assignments.component.ts
src/app/routes/tasks/board/task-board.component.ts
src/app/routes/tasks/calendar/task-calendar.component.ts
src/app/routes/tasks/daily-reports/daily-reports.component.ts
src/app/routes/tasks/detail/task-detail.component.ts
src/app/routes/tasks/form/task-form.component.ts
src/app/routes/tasks/list/task-list.component.ts
src/app/routes/tasks/photos/task-photos.component.ts
src/app/routes/tasks/routes.ts
src/app/routes/tasks/staging/task-staging.component.ts
src/app/routes/tasks/todo/task-todo.component.ts
src/app/routes/tasks/weather/task-weather.component.ts
src/app/routes/widgets/routes.ts
src/app/routes/widgets/widgets/widgets.component.ts
src/app/shared/cell-widget/index.ts
src/app/shared/index.ts
src/app/shared/json-schema/index.ts
src/app/shared/json-schema/test/test.widget.ts
src/app/shared/models/account/index.ts
src/app/shared/models/account/types.ts
src/app/shared/models/blueprint/index.ts
src/app/shared/models/blueprint/types.ts
src/app/shared/models/collaboration/index.ts
src/app/shared/models/collaboration/types.ts
src/app/shared/models/index.ts
src/app/shared/services/account/account.service.spec.ts
src/app/shared/services/account/account.service.ts
src/app/shared/services/account/index.ts
src/app/shared/services/account/organization-schedule.service.ts
src/app/shared/services/account/team.service.spec.ts
src/app/shared/services/account/team.service.ts
src/app/shared/services/blueprint/blueprint.service.ts
src/app/shared/services/blueprint/branch.service.ts
src/app/shared/services/blueprint/index.ts
src/app/shared/services/blueprint/pull-request.service.ts
src/app/shared/services/collaboration/collaboration.service.spec.ts
src/app/shared/services/collaboration/collaboration.service.ts
src/app/shared/services/collaboration/index.ts
src/app/shared/services/collaboration/invitation.service.spec.ts
src/app/shared/services/collaboration/invitation.service.ts
src/app/shared/services/index.ts
src/app/shared/shared-delon.module.ts
src/app/shared/shared-imports.ts
src/app/shared/shared-tinymce.module.ts
src/app/shared/shared-zorro.module.ts
src/app/shared/st-widget/index.ts
src/app/shared/utils/yuan.ts
src/environments/environment.prod.ts
src/environments/environment.ts
src/main.ts
src/style-icons-auto.ts
src/style-icons.ts
src/typings.d.ts
```

# Files

## File: src/app/app.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { NavigationEnd, NavigationError, RouteConfigLoadStart, Router, RouterOutlet } from '@angular/router';
 3: import { TitleService, VERSION as VERSION_ALAIN, stepPreloader } from '@delon/theme';
 4: import { environment } from '@env/environment';
 5: import { NzModalService } from 'ng-zorro-antd/modal';
 6: import { VERSION as VERSION_ZORRO } from 'ng-zorro-antd/version';
 7: 
 8: @Component({
 9:   selector: 'app-root',
10:   template: `<router-outlet />`,
11:   imports: [RouterOutlet],
12:   host: {
13:     '[attr.ng-alain-version]': 'ngAlainVersion',
14:     '[attr.ng-zorro-version]': 'ngZorroVersion'
15:   }
16: })
17: export class AppComponent implements OnInit {
18:   private readonly router = inject(Router);
19:   private readonly titleSrv = inject(TitleService);
20:   private readonly modalSrv = inject(NzModalService);
21:   ngAlainVersion = VERSION_ALAIN.full;
22:   ngZorroVersion = VERSION_ZORRO.full;
23: 
24:   private donePreloader = stepPreloader();
25: 
26:   ngOnInit(): void {
27:     let configLoad = false;
28:     this.router.events.subscribe(ev => {
29:       if (ev instanceof RouteConfigLoadStart) {
30:         configLoad = true;
31:       }
32:       if (configLoad && ev instanceof NavigationError) {
33:         this.modalSrv.confirm({
34:           nzTitle: `提醒`,
35:           nzContent: environment.production ? `应用可能已发布新版本，请点击刷新才能生效。` : `无法加载路由：${ev.url}`,
36:           nzCancelDisabled: false,
37:           nzOkText: '刷新',
38:           nzCancelText: '忽略',
39:           nzOnOk: () => location.reload()
40:         });
41:       }
42:       if (ev instanceof NavigationEnd) {
43:         this.donePreloader();
44:         this.titleSrv.setTitle();
45:         this.modalSrv.closeAll();
46:       }
47:     });
48:   }
49: }
````

## File: src/app/app.config.ts
````typescript
 1: import { provideHttpClient, withInterceptors } from '@angular/common/http';
 2: import { default as ngLang } from '@angular/common/locales/zh';
 3: import { ApplicationConfig, EnvironmentProviders, Provider } from '@angular/core';
 4: import { provideAnimations } from '@angular/platform-browser/animations';
 5: import {
 6:   provideRouter,
 7:   withComponentInputBinding,
 8:   withInMemoryScrolling,
 9:   withHashLocation,
10:   RouterFeatures,
11:   withViewTransitions
12: } from '@angular/router';
13: import { I18NService, defaultInterceptor, provideBindAuthRefresh, provideStartup } from '@core';
14: import { provideCellWidgets } from '@delon/abc/cell';
15: import { provideSTWidgets } from '@delon/abc/st';
16: import { authSimpleInterceptor, provideAuth } from '@delon/auth';
17: import { provideSFConfig } from '@delon/form';
18: import { AlainProvideLang, provideAlain, zh_CN as delonLang } from '@delon/theme';
19: import { AlainConfig } from '@delon/util/config';
20: import { environment } from '@env/environment';
21: import { CELL_WIDGETS, SF_WIDGETS, ST_WIDGETS } from '@shared';
22: import { zhCN as dateLang } from 'date-fns/locale';
23: import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
24: import { zh_CN as zorroLang } from 'ng-zorro-antd/i18n';
25: 
26: import { ICONS } from '../style-icons';
27: import { ICONS_AUTO } from '../style-icons-auto';
28: import { routes } from './routes/routes';
29: 
30: const defaultLang: AlainProvideLang = {
31:   abbr: 'zh-CN',
32:   ng: ngLang,
33:   zorro: zorroLang,
34:   date: dateLang,
35:   delon: delonLang
36: };
37: 
38: const alainConfig: AlainConfig = {
39:   st: { modal: { size: 'lg' } },
40:   pageHeader: { homeI18n: 'home' },
41:   lodop: {
42:     license: `A59B099A586B3851E0F0D7FDBF37B603`,
43:     licenseA: `C94CEE276DB2187AE6B65D56B3FC2848`
44:   },
45:   auth: { login_url: '/passport/login' }
46: };
47: 
48: const ngZorroConfig: NzConfig = {};
49: 
50: const routerFeatures: RouterFeatures[] = [
51:   withComponentInputBinding(),
52:   withViewTransitions(),
53:   withInMemoryScrolling({ scrollPositionRestoration: 'top' })
54: ];
55: if (environment.useHash) routerFeatures.push(withHashLocation());
56: 
57: const providers: Array<Provider | EnvironmentProviders> = [
58:   provideHttpClient(withInterceptors([...(environment.interceptorFns ?? []), authSimpleInterceptor, defaultInterceptor])),
59:   provideAnimations(),
60:   provideRouter(routes, ...routerFeatures),
61:   provideAlain({ config: alainConfig, defaultLang, i18nClass: I18NService, icons: [...ICONS_AUTO, ...ICONS] }),
62:   provideNzConfig(ngZorroConfig),
63:   provideAuth(),
64:   provideCellWidgets(...CELL_WIDGETS),
65:   provideSTWidgets(...ST_WIDGETS),
66:   provideSFConfig({ widgets: SF_WIDGETS }),
67:   provideStartup(),
68:   ...(environment.providers || [])
69: ];
70: 
71: // If you use `@delon/auth` to refresh the token, additional registration `provideBindAuthRefresh` is required
72: if (environment.api?.refreshTokenEnabled && environment.api.refreshTokenType === 'auth-refresh') {
73:   providers.push(provideBindAuthRefresh());
74: }
75: 
76: export const appConfig: ApplicationConfig = {
77:   providers: providers
78: };
````

## File: src/app/core/i18n/i18n.service.spec.ts
````typescript
 1: import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
 2: import { provideHttpClientTesting } from '@angular/common/http/testing';
 3: import { TestBed } from '@angular/core/testing';
 4: import { DelonLocaleService, SettingsService } from '@delon/theme';
 5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 6: import { NzI18nService } from 'ng-zorro-antd/i18n';
 7: 
 8: import { I18NService } from './i18n.service';
 9: 
10: describe('Service: I18n', () => {
11:   let srv: I18NService;
12:   const MockSettingsService: NzSafeAny = {
13:     layout: {
14:       lang: null
15:     }
16:   };
17:   const MockNzI18nService = {
18:     setLocale: () => {},
19:     setDateLocale: () => {}
20:   };
21:   const MockDelonLocaleService = {
22:     setLocale: () => {}
23:   };
24: 
25:   function genModule(): void {
26:     TestBed.configureTestingModule({
27:       imports: [],
28:       providers: [
29:         I18NService,
30:         { provide: SettingsService, useValue: MockSettingsService },
31:         { provide: NzI18nService, useValue: MockNzI18nService },
32:         { provide: DelonLocaleService, useValue: MockDelonLocaleService },
33:         provideHttpClient(withInterceptorsFromDi()),
34:         provideHttpClientTesting()
35:       ]
36:     });
37:     srv = TestBed.inject(I18NService);
38:   }
39: 
40:   it('should working', () => {
41:     spyOnProperty(navigator, 'languages').and.returnValue(['zh-CN']);
42:     genModule();
43:     expect(srv).toBeTruthy();
44:     expect(srv.defaultLang).toBe('zh-CN');
45:     srv.fanyi('a');
46:     srv.fanyi('a', {});
47:   });
48: 
49:   it('should be used layout as default language', () => {
50:     MockSettingsService.layout.lang = 'en-US';
51:     const navSpy = spyOnProperty(navigator, 'languages');
52:     genModule();
53:     expect(navSpy).not.toHaveBeenCalled();
54:     expect(srv.defaultLang).toBe('en-US');
55:     MockSettingsService.layout.lang = null;
56:   });
57: 
58:   it('should be used browser as default language', () => {
59:     spyOnProperty(navigator, 'languages').and.returnValue(['zh-TW']);
60:     genModule();
61:     expect(srv.defaultLang).toBe('zh-TW');
62:   });
63: 
64:   it('should be use default language when the browser language is not in the list', () => {
65:     spyOnProperty(navigator, 'languages').and.returnValue(['es-419']);
66:     genModule();
67:     expect(srv.defaultLang).toBe('zh-CN');
68:   });
69: 
70:   it('should be trigger notify when changed language', () => {
71:     genModule();
72:     srv.use('en-US', {});
73:     srv.change.subscribe(lang => {
74:       expect(lang).toBe('en-US');
75:     });
76:   });
77: });
````

## File: src/app/core/i18n/i18n.service.ts
````typescript
  1: // 请参考：https://ng-alain.com/docs/i18n
  2: import { Platform } from '@angular/cdk/platform';
  3: import { registerLocaleData } from '@angular/common';
  4: import ngEn from '@angular/common/locales/en';
  5: import ngZh from '@angular/common/locales/zh';
  6: import ngZhTw from '@angular/common/locales/zh-Hant';
  7: import { Injectable, inject } from '@angular/core';
  8: import {
  9:   DelonLocaleService,
 10:   en_US as delonEnUS,
 11:   SettingsService,
 12:   zh_CN as delonZhCn,
 13:   zh_TW as delonZhTw,
 14:   _HttpClient,
 15:   AlainI18nBaseService
 16: } from '@delon/theme';
 17: import { enUS as dfEn, zhCN as dfZhCn, zhTW as dfZhTw } from 'date-fns/locale';
 18: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 19: import { en_US as zorroEnUS, NzI18nService, zh_CN as zorroZhCN, zh_TW as zorroZhTW } from 'ng-zorro-antd/i18n';
 20: import { Observable } from 'rxjs';
 21: 
 22: interface LangConfigData {
 23:   abbr: string;
 24:   text: string;
 25:   ng: NzSafeAny;
 26:   zorro: NzSafeAny;
 27:   date: NzSafeAny;
 28:   delon: NzSafeAny;
 29: }
 30: 
 31: const DEFAULT = 'zh-CN';
 32: const LANGS: Record<string, LangConfigData> = {
 33:   'zh-CN': {
 34:     text: '简体中文',
 35:     ng: ngZh,
 36:     zorro: zorroZhCN,
 37:     date: dfZhCn,
 38:     delon: delonZhCn,
 39:     abbr: '🇨🇳'
 40:   },
 41:   'zh-TW': {
 42:     text: '繁体中文',
 43:     ng: ngZhTw,
 44:     zorro: zorroZhTW,
 45:     date: dfZhTw,
 46:     delon: delonZhTw,
 47:     abbr: '🇭🇰'
 48:   },
 49:   'en-US': {
 50:     text: 'English',
 51:     ng: ngEn,
 52:     zorro: zorroEnUS,
 53:     date: dfEn,
 54:     delon: delonEnUS,
 55:     abbr: '🇬🇧'
 56:   }
 57: };
 58: 
 59: @Injectable({ providedIn: 'root' })
 60: export class I18NService extends AlainI18nBaseService {
 61:   private readonly http = inject(_HttpClient);
 62:   private readonly settings = inject(SettingsService);
 63:   private readonly nzI18nService = inject(NzI18nService);
 64:   private readonly delonLocaleService = inject(DelonLocaleService);
 65:   private readonly platform = inject(Platform);
 66: 
 67:   protected override _defaultLang = DEFAULT;
 68:   private _langs = Object.keys(LANGS).map(code => {
 69:     const item = LANGS[code];
 70:     return { code, text: item.text, abbr: item.abbr };
 71:   });
 72: 
 73:   constructor() {
 74:     super();
 75: 
 76:     const defaultLang = this.getDefaultLang();
 77:     this._defaultLang = this._langs.findIndex(w => w.code === defaultLang) === -1 ? DEFAULT : defaultLang;
 78:   }
 79: 
 80:   private getDefaultLang(): string {
 81:     if (!this.platform.isBrowser) {
 82:       return DEFAULT;
 83:     }
 84:     if (this.settings.layout.lang) {
 85:       return this.settings.layout.lang;
 86:     }
 87:     let res = (navigator.languages ? navigator.languages[0] : null) || navigator.language;
 88:     const arr = res.split('-');
 89:     return arr.length <= 1 ? res : `${arr[0]}-${arr[1].toUpperCase()}`;
 90:   }
 91: 
 92:   loadLangData(lang: string): Observable<NzSafeAny> {
 93:     return this.http.get(`./assets/tmp/i18n/${lang}.json`);
 94:   }
 95: 
 96:   use(lang: string, data: Record<string, unknown>): void {
 97:     if (this._currentLang === lang) return;
 98: 
 99:     this._data = this.flatData(data, []);
100: 
101:     const item = LANGS[lang];
102:     registerLocaleData(item.ng);
103:     this.nzI18nService.setLocale(item.zorro);
104:     this.nzI18nService.setDateLocale(item.date);
105:     this.delonLocaleService.setLocale(item.delon);
106:     this._currentLang = lang;
107: 
108:     this._change$.next(lang);
109:   }
110: 
111:   getLangs(): Array<{ code: string; text: string; abbr: string }> {
112:     return this._langs;
113:   }
114: }
````

## File: src/app/core/infra/errors/error.types.ts
````typescript
 1: /**
 2:  * 错误类型定义
 3:  * 
 4:  * 提供统一的错误类型，与现有错误处理模式兼容
 5:  */
 6: 
 7: /**
 8:  * 错误类型枚举
 9:  */
10: export type ErrorType = 'http' | 'network' | 'validation' | 'business' | 'permission' | 'unknown';
11: 
12: /**
13:  * 错误严重程度
14:  */
15: export type ErrorSeverity = 'critical' | 'error' | 'warning' | 'info';
16: 
17: /**
18:  * 应用错误接口
19:  * 扩展标准 Error，添加额外信息
20:  */
21: export interface AppError extends Error {
22:   /** 错误类型 */
23:   type: ErrorType;
24:   /** 错误严重程度 */
25:   severity: ErrorSeverity;
26:   /** 错误代码（可选） */
27:   code?: string;
28:   /** 错误详情（可选） */
29:   details?: string;
30:   /** 错误来源（可选） */
31:   source?: string;
32:   /** 元数据（可选） */
33:   metadata?: Record<string, unknown>;
34:   /** 是否可重试 */
35:   retryable?: boolean;
36: }
37: 
38: /**
39:  * 创建应用错误
40:  */
41: export function createAppError(
42:   message: string,
43:   type: ErrorType = 'unknown',
44:   severity: ErrorSeverity = 'error',
45:   options?: {
46:     code?: string;
47:     details?: string;
48:     source?: string;
49:     metadata?: Record<string, unknown>;
50:     retryable?: boolean;
51:   }
52: ): AppError {
53:   const error = new Error(message) as AppError;
54:   error.type = type;
55:   error.severity = severity;
56:   error.code = options?.code;
57:   error.details = options?.details;
58:   error.source = options?.source;
59:   error.metadata = options?.metadata;
60:   error.retryable = options?.retryable ?? false;
61:   return error;
62: }
````

## File: src/app/core/infra/errors/index.ts
````typescript
1: /**
2:  * 错误处理模块导出
3:  */
4: export * from './error.types';
5: export * from './supabase-error.transformer';
````

## File: src/app/core/infra/errors/supabase-error.transformer.ts
````typescript
 1: import { PostgrestError } from '@supabase/supabase-js';
 2: import { AppError, createAppError, ErrorType, ErrorSeverity } from './error.types';
 3: 
 4: /**
 5:  * Supabase 错误代码映射
 6:  */
 7: const SUPABASE_ERROR_CODES: Record<string, { type: ErrorType; severity: ErrorSeverity; message: string }> = {
 8:   // 认证错误
 9:   'PGRST301': { type: 'permission', severity: 'error', message: '未授权访问' },
10:   'PGRST116': { type: 'business', severity: 'warning', message: '资源不存在' },
11:   
12:   // 数据验证错误
13:   '23505': { type: 'validation', severity: 'error', message: '数据已存在，违反唯一性约束' },
14:   '23503': { type: 'validation', severity: 'error', message: '外键约束违反' },
15:   '23502': { type: 'validation', severity: 'error', message: '必填字段为空' },
16:   '23514': { type: 'validation', severity: 'error', message: '检查约束违反' },
17:   
18:   // 权限错误
19:   '42501': { type: 'permission', severity: 'error', message: '权限不足' },
20:   
21:   // 网络错误
22:   'PGRST204': { type: 'network', severity: 'error', message: '请求超时' },
23: };
24: 
25: /**
26:  * 将 Supabase PostgrestError 转换为 AppError
27:  * 
28:  * @param error Supabase 错误
29:  * @param source 错误来源（可选）
30:  * @returns AppError
31:  */
32: export function transformSupabaseError(error: PostgrestError, source?: string): AppError {
33:   const errorCode = error.code || '';
34:   const errorInfo = SUPABASE_ERROR_CODES[errorCode];
35:   
36:   if (errorInfo) {
37:     return createAppError(
38:       errorInfo.message,
39:       errorInfo.type,
40:       errorInfo.severity,
41:       {
42:         code: errorCode,
43:         details: error.message || error.details || '',
44:         source,
45:         metadata: {
46:           hint: error.hint,
47:           details: error.details,
48:         },
49:         retryable: errorInfo.type === 'network',
50:       }
51:     );
52:   }
53:   
54:   // 默认错误处理
55:   return createAppError(
56:     error.message || '数据库操作失败',
57:     'unknown',
58:     'error',
59:     {
60:       code: errorCode,
61:       details: error.details || '',
62:       source,
63:       metadata: {
64:         hint: error.hint,
65:         details: error.details,
66:       },
67:       retryable: false,
68:     }
69:   );
70: }
71: 
72: /**
73:  * 检查 Supabase 响应并处理错误
74:  * 
75:  * @param response Supabase 响应 { data, error }
76:  * @param source 错误来源（可选）
77:  * @throws AppError 如果有错误
78:  */
79: export function handleSupabaseResponse<T>(
80:   response: { data: T | null; error: PostgrestError | null },
81:   source?: string
82: ): T {
83:   if (response.error) {
84:     throw transformSupabaseError(response.error, source);
85:   }
86:   
87:   if (response.data === null) {
88:     throw createAppError(
89:       '数据不存在',
90:       'business',
91:       'warning',
92:       { source }
93:     );
94:   }
95:   
96:   return response.data;
97: }
````

## File: src/app/core/infra/index.ts
````typescript
1: /**
2:  * 基础设施模块统一导出
3:  */
4: export * from './repositories';
5: export * from './types';
6: export * from './errors';
7: export * from './utils';
````

## File: src/app/core/infra/repositories/account.repository.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { Observable } from 'rxjs';
  3: import { map } from 'rxjs/operators';
  4: import { BaseRepository, QueryOptions } from './base.repository';
  5: import { Database } from '../types/database.types';
  6: import { AccountType, AccountStatus } from '../types/account.types';
  7: 
  8: /**
  9:  * 从数据库类型中提取原始类型（snake_case）
 10:  */
 11: type AccountRow = Database['public']['Tables']['accounts']['Row'];
 12: type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
 13: type AccountUpdate = Database['public']['Tables']['accounts']['Update'];
 14: 
 15: /**
 16:  * Account 实体类型（camelCase）
 17:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 18:  */
 19: export type Account = AccountRow;
 20: export type { AccountInsert, AccountUpdate };
 21: 
 22: /**
 23:  * Account Repository
 24:  * 
 25:  * 提供账户相关的数据访问方法
 26:  * 
 27:  * @example
 28:  * ```typescript
 29:  * const accountRepo = inject(AccountRepository);
 30:  * accountRepo.findByType(AccountType.USER).subscribe(accounts => {
 31:  *   console.log('User accounts:', accounts);
 32:  * });
 33:  * ```
 34:  */
 35: @Injectable({
 36:   providedIn: 'root'
 37: })
 38: export class AccountRepository extends BaseRepository<Account, AccountInsert, AccountUpdate> {
 39:   protected tableName = 'accounts';
 40: 
 41:   /**
 42:    * 根据账户类型查询账户
 43:    * 
 44:    * @param type 账户类型
 45:    * @param options 查询选项
 46:    * @returns Observable<Account[]>
 47:    */
 48:   findByType(type: AccountType, options?: QueryOptions): Observable<Account[]> {
 49:     return this.findAll({
 50:       ...options,
 51:       filters: {
 52:         ...options?.filters,
 53:         type,
 54:       },
 55:     });
 56:   }
 57: 
 58:   /**
 59:    * 根据状态查询账户
 60:    * 
 61:    * @param status 账户状态
 62:    * @param options 查询选项
 63:    * @returns Observable<Account[]>
 64:    */
 65:   findByStatus(status: AccountStatus, options?: QueryOptions): Observable<Account[]> {
 66:     return this.findAll({
 67:       ...options,
 68:       filters: {
 69:         ...options?.filters,
 70:         status,
 71:       },
 72:     });
 73:   }
 74: 
 75:   /**
 76:    * 根据 auth_user_id 查询账户
 77:    * 
 78:    * @param authUserId 认证用户 ID
 79:    * @returns Observable<Account | null>
 80:    */
 81:   findByAuthUserId(authUserId: string): Observable<Account | null> {
 82:     return this.findAll({
 83:       filters: {
 84:         authUserId, // 会自动转换为 auth_user_id
 85:       },
 86:     }).pipe(
 87:       map(accounts => accounts.length > 0 ? accounts[0] : null)
 88:     );
 89:   }
 90: 
 91:   /**
 92:    * 根据邮箱查询账户
 93:    * 
 94:    * @param email 邮箱地址
 95:    * @returns Observable<Account | null>
 96:    */
 97:   findByEmail(email: string): Observable<Account | null> {
 98:     return this.findAll({
 99:       filters: {
100:         email,
101:       },
102:     }).pipe(
103:       map(accounts => accounts.length > 0 ? accounts[0] : null)
104:     );
105:   }
106: 
107:   /**
108:    * 查询活跃的账户（状态为 active）
109:    * 
110:    * @param options 查询选项
111:    * @returns Observable<Account[]>
112:    */
113:   findActive(options?: QueryOptions): Observable<Account[]> {
114:     return this.findByStatus(AccountStatus.ACTIVE, options);
115:   }
116: }
````

## File: src/app/core/infra/repositories/base.repository.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { Observable, from } from 'rxjs';
  3: import { map } from 'rxjs/operators';
  4: import { SupabaseClient, PostgrestResponse, PostgrestSingleResponse, PostgrestMaybeSingleResponse } from '@supabase/supabase-js';
  5: import { Database } from '../types/database.types';
  6: import { SupabaseService } from '../../supabase/supabase.service';
  7: import { handleSupabaseResponse } from '../errors/supabase-error.transformer';
  8: import { toCamelCaseData, toSnakeCaseData } from '../utils/transformers';
  9: 
 10: /**
 11:  * 查询选项
 12:  */
 13: export interface QueryOptions {
 14:   /** 分页：页码（从 1 开始） */
 15:   page?: number;
 16:   /** 分页：每页数量 */
 17:   pageSize?: number;
 18:   /** 排序字段 */
 19:   orderBy?: string;
 20:   /** 排序方向 */
 21:   orderDirection?: 'asc' | 'desc';
 22:   /** 筛选条件 */
 23:   filters?: Record<string, any>;
 24:   /** 选择字段（默认 '*'） */
 25:   select?: string;
 26: }
 27: 
 28: /**
 29:  * 分页结果
 30:  */
 31: export interface PaginatedResult<T> {
 32:   data: T[];
 33:   total: number;
 34:   page: number;
 35:   pageSize: number;
 36:   totalPages: number;
 37: }
 38: 
 39: /**
 40:  * 基础 Repository 类
 41:  * 
 42:  * 提供通用的 CRUD 操作方法，封装 Supabase 客户端调用
 43:  * 
 44:  * @template T 实体类型（camelCase）
 45:  * @template TInsert 插入类型（camelCase）
 46:  * @template TUpdate 更新类型（camelCase）
 47:  * 
 48:  * @example
 49:  * ```typescript
 50:  * @Injectable({ providedIn: 'root' })
 51:  * export class BlueprintRepository extends BaseRepository<Blueprint, BlueprintInsert, BlueprintUpdate> {
 52:  *   protected tableName = 'blueprints';
 53:  * }
 54:  * ```
 55:  */
 56: @Injectable()
 57: export abstract class BaseRepository<
 58:   T,
 59:   TInsert = Partial<T>,
 60:   TUpdate = Partial<T>
 61: > {
 62:   protected readonly supabase: SupabaseClient<Database> = inject(SupabaseService).client;
 63: 
 64:   /**
 65:    * 表名（snake_case）
 66:    * 子类必须实现
 67:    */
 68:   protected abstract tableName: string;
 69: 
 70:   /**
 71:    * 获取所有记录
 72:    * 
 73:    * @param options 查询选项
 74:    * @returns Observable<T[]>
 75:    */
 76:   findAll(options?: QueryOptions): Observable<T[]> {
 77:     // 使用类型断言，因为 tableName 是运行时值，但 Supabase 需要字面量类型
 78:     let query = (this.supabase
 79:       .from(this.tableName as any)
 80:       .select(options?.select || '*')) as any;
 81: 
 82:     // 应用筛选条件
 83:     if (options?.filters) {
 84:       for (const [key, value] of Object.entries(options.filters)) {
 85:         const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
 86:         query = query.eq(snakeKey, value);
 87:       }
 88:     }
 89: 
 90:     // 应用排序
 91:     if (options?.orderBy) {
 92:       const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
 93:       query = query.order(snakeOrderBy, { ascending: options.orderDirection !== 'desc' });
 94:     }
 95: 
 96:     // 应用分页
 97:     if (options?.page && options?.pageSize) {
 98:       const fromIndex = (options.page - 1) * options.pageSize;
 99:       const toIndex = fromIndex + options.pageSize - 1;
100:       query = query.range(fromIndex, toIndex);
101:     }
102: 
103:     return from(query as Promise<PostgrestResponse<any>>).pipe(
104:       map((response: PostgrestResponse<any>) => {
105:         const data = handleSupabaseResponse(response, `${this.constructor.name}.findAll`);
106:         return Array.isArray(data) ? data.map(item => toCamelCaseData<T>(item)) : [toCamelCaseData<T>(data)];
107:       })
108:     );
109:   }
110: 
111:   /**
112:    * 根据 ID 获取单条记录
113:    * 
114:    * @param id 记录 ID
115:    * @returns Observable<T | null>
116:    */
117:   findById(id: string): Observable<T | null> {
118:     return from(
119:       (this.supabase
120:         .from(this.tableName as any)
121:         .select('*')
122:         .eq('id', id)
123:         .maybeSingle() as unknown) as Promise<PostgrestMaybeSingleResponse<any>>
124:     ).pipe(
125:       map((response: PostgrestMaybeSingleResponse<any>) => {
126:         if (response.error && response.error.code !== 'PGRST116') {
127:           throw handleSupabaseResponse(response, `${this.constructor.name}.findById`);
128:         }
129:         if (!response.data) {
130:           return null;
131:         }
132:         return toCamelCaseData<T>(response.data);
133:       })
134:     );
135:   }
136: 
137:   /**
138:    * 创建新记录
139:    * 
140:    * @param data 插入数据（camelCase）
141:    * @returns Observable<T>
142:    */
143:   create(data: TInsert): Observable<T> {
144:     const snakeData = toSnakeCaseData(data as Record<string, any>);
145:     
146:     return from(
147:       (this.supabase
148:         .from(this.tableName as any)
149:         .insert(snakeData as any)
150:         .select()
151:         .single() as unknown) as Promise<PostgrestSingleResponse<any>>
152:     ).pipe(
153:       map((response: PostgrestSingleResponse<any>) => {
154:         const result = handleSupabaseResponse(response, `${this.constructor.name}.create`);
155:         return toCamelCaseData<T>(result);
156:       })
157:     );
158:   }
159: 
160:   /**
161:    * 更新记录
162:    * 
163:    * @param id 记录 ID
164:    * @param data 更新数据（camelCase）
165:    * @returns Observable<T>
166:    */
167:   update(id: string, data: TUpdate): Observable<T> {
168:     const snakeData = toSnakeCaseData(data as Record<string, any>);
169:     
170:     return from(
171:       (this.supabase
172:         .from(this.tableName as any)
173:         .update(snakeData as any)
174:         .eq('id', id)
175:         .select()
176:         .single() as unknown) as Promise<PostgrestSingleResponse<any>>
177:     ).pipe(
178:       map((response: PostgrestSingleResponse<any>) => {
179:         const result = handleSupabaseResponse(response, `${this.constructor.name}.update`);
180:         return toCamelCaseData<T>(result);
181:       })
182:     );
183:   }
184: 
185:   /**
186:    * 删除记录
187:    * 
188:    * @param id 记录 ID
189:    * @returns Observable<void>
190:    */
191:   delete(id: string): Observable<void> {
192:     return from(
193:       (this.supabase
194:         .from(this.tableName as any)
195:         .delete()
196:         .eq('id', id) as unknown) as Promise<PostgrestResponse<any>>
197:     ).pipe(
198:       map((response: PostgrestResponse<any>) => {
199:         if (response.error) {
200:           throw handleSupabaseResponse(response, `${this.constructor.name}.delete`);
201:         }
202:       })
203:     );
204:   }
205: 
206:   /**
207:    * 分页查询
208:    * 
209:    * @param options 查询选项（必须包含 page 和 pageSize）
210:    * @returns Observable<PaginatedResult<T>>
211:    */
212:   findPaginated(options: QueryOptions & { page: number; pageSize: number }): Observable<PaginatedResult<T>> {
213:     // 先获取总数
214:     const countQuery = (this.supabase
215:       .from(this.tableName as any)
216:       .select('*', { count: 'exact', head: true })) as any;
217: 
218:     // 应用筛选条件
219:     let dataQuery = (this.supabase
220:       .from(this.tableName as any)
221:       .select(options.select || '*')) as any;
222: 
223:     if (options.filters) {
224:       for (const [key, value] of Object.entries(options.filters)) {
225:         const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
226:         countQuery.eq(snakeKey, value);
227:         dataQuery = dataQuery.eq(snakeKey, value);
228:       }
229:     }
230: 
231:     // 应用排序
232:     if (options.orderBy) {
233:       const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
234:       dataQuery = dataQuery.order(snakeOrderBy, { ascending: options.orderDirection !== 'desc' });
235:     }
236: 
237:     // 应用分页
238:     const fromIndex = (options.page - 1) * options.pageSize;
239:     const toIndex = fromIndex + options.pageSize - 1;
240:     dataQuery = dataQuery.range(fromIndex, toIndex);
241: 
242:     // 并行查询总数和数据
243:     return from(Promise.all([countQuery, dataQuery]) as Promise<[PostgrestResponse<any>, PostgrestResponse<any>]>).pipe(
244:       map(([countResponse, dataResponse]: [PostgrestResponse<any>, PostgrestResponse<any>]) => {
245:         const total = countResponse.count || 0;
246:         const data = handleSupabaseResponse(dataResponse, `${this.constructor.name}.findPaginated`);
247:         const items = Array.isArray(data) ? data.map(item => toCamelCaseData<T>(item)) : [toCamelCaseData<T>(data)];
248:         
249:         return {
250:           data: items,
251:           total,
252:           page: options.page,
253:           pageSize: options.pageSize,
254:           totalPages: Math.ceil(total / options.pageSize),
255:         };
256:       })
257:     );
258:   }
259: }
````

## File: src/app/core/infra/repositories/blueprint-branch.repository.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { Observable } from 'rxjs';
  3: import { map } from 'rxjs/operators';
  4: import { BaseRepository, QueryOptions } from './base.repository';
  5: import { Database } from '../types/database.types';
  6: import { BranchType, BranchStatus } from '../types/blueprint.types';
  7: 
  8: /**
  9:  * 从数据库类型中提取原始类型（snake_case）
 10:  */
 11: type BlueprintBranchRow = Database['public']['Tables']['blueprint_branches']['Row'];
 12: type BlueprintBranchInsert = Database['public']['Tables']['blueprint_branches']['Insert'];
 13: type BlueprintBranchUpdate = Database['public']['Tables']['blueprint_branches']['Update'];
 14: 
 15: /**
 16:  * BlueprintBranch 实体类型（camelCase）
 17:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 18:  */
 19: export type BlueprintBranch = BlueprintBranchRow;
 20: export type { BlueprintBranchInsert, BlueprintBranchUpdate };
 21: 
 22: /**
 23:  * BlueprintBranch Repository
 24:  * 
 25:  * 提供蓝图分支相关的数据访问方法
 26:  * 
 27:  * @example
 28:  * ```typescript
 29:  * const branchRepo = inject(BlueprintBranchRepository);
 30:  * branchRepo.findByBlueprintId('blueprint-id').subscribe(branches => {
 31:  *   console.log('Branches:', branches);
 32:  * });
 33:  * ```
 34:  */
 35: @Injectable({
 36:   providedIn: 'root'
 37: })
 38: export class BlueprintBranchRepository extends BaseRepository<
 39:   BlueprintBranch,
 40:   BlueprintBranchInsert,
 41:   BlueprintBranchUpdate
 42: > {
 43:   protected tableName = 'blueprint_branches';
 44: 
 45:   /**
 46:    * 根据蓝图 ID 查询分支列表
 47:    * 
 48:    * @param blueprintId 蓝图 ID
 49:    * @param options 查询选项
 50:    * @returns Observable<BlueprintBranch[]>
 51:    */
 52:   findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<BlueprintBranch[]> {
 53:     return this.findAll({
 54:       ...options,
 55:       filters: {
 56:         ...options?.filters,
 57:         blueprintId, // 会自动转换为 blueprint_id
 58:       },
 59:     });
 60:   }
 61: 
 62:   /**
 63:    * 根据组织 ID 查询分支列表
 64:    * 
 65:    * @param organizationId 组织 ID
 66:    * @param options 查询选项
 67:    * @returns Observable<BlueprintBranch[]>
 68:    */
 69:   findByOrganizationId(organizationId: string, options?: QueryOptions): Observable<BlueprintBranch[]> {
 70:     return this.findAll({
 71:       ...options,
 72:       filters: {
 73:         ...options?.filters,
 74:         organizationId, // 会自动转换为 organization_id
 75:       },
 76:     });
 77:   }
 78: 
 79:   /**
 80:    * 根据分支类型查询分支列表
 81:    * 
 82:    * @param branchType 分支类型
 83:    * @param options 查询选项
 84:    * @returns Observable<BlueprintBranch[]>
 85:    */
 86:   findByBranchType(branchType: BranchType, options?: QueryOptions): Observable<BlueprintBranch[]> {
 87:     return this.findAll({
 88:       ...options,
 89:       filters: {
 90:         ...options?.filters,
 91:         branchType, // 会自动转换为 branch_type
 92:       },
 93:     });
 94:   }
 95: 
 96:   /**
 97:    * 根据分支状态查询分支列表
 98:    * 
 99:    * @param status 分支状态
100:    * @param options 查询选项
101:    * @returns Observable<BlueprintBranch[]>
102:    */
103:   findByStatus(status: BranchStatus, options?: QueryOptions): Observable<BlueprintBranch[]> {
104:     return this.findAll({
105:       ...options,
106:       filters: {
107:         ...options?.filters,
108:         status,
109:       },
110:     });
111:   }
112: 
113:   /**
114:    * 查询活跃的分支
115:    * 
116:    * @param options 查询选项
117:    * @returns Observable<BlueprintBranch[]>
118:    */
119:   findActive(options?: QueryOptions): Observable<BlueprintBranch[]> {
120:     return this.findByStatus(BranchStatus.ACTIVE, options);
121:   }
122: 
123:   /**
124:    * 根据蓝图 ID 和组织 ID 查询分支（唯一分支）
125:    * 
126:    * @param blueprintId 蓝图 ID
127:    * @param organizationId 组织 ID
128:    * @returns Observable<BlueprintBranch | null>
129:    */
130:   findByBlueprintAndOrganization(
131:     blueprintId: string,
132:     organizationId: string
133:   ): Observable<BlueprintBranch | null> {
134:     return this.findAll({
135:       filters: {
136:         blueprintId, // 会自动转换为 blueprint_id
137:         organizationId, // 会自动转换为 organization_id
138:       },
139:     }).pipe(
140:       map(branches => branches.length > 0 ? branches[0] : null)
141:     );
142:   }
143: }
````

## File: src/app/core/infra/repositories/blueprint-config.repository.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { Observable } from 'rxjs';
  3: import { map } from 'rxjs/operators';
  4: import { BaseRepository, QueryOptions } from './base.repository';
  5: import { Database } from '../types/database.types';
  6: 
  7: /**
  8:  * 从数据库类型中提取原始类型（snake_case）
  9:  */
 10: type BlueprintConfigRow = Database['public']['Tables']['blueprint_configs']['Row'];
 11: type BlueprintConfigInsert = Database['public']['Tables']['blueprint_configs']['Insert'];
 12: type BlueprintConfigUpdate = Database['public']['Tables']['blueprint_configs']['Update'];
 13: 
 14: /**
 15:  * BlueprintConfig 实体类型（camelCase）
 16:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 17:  */
 18: export type BlueprintConfig = BlueprintConfigRow;
 19: export type { BlueprintConfigInsert, BlueprintConfigUpdate };
 20: 
 21: /**
 22:  * BlueprintConfig Repository
 23:  * 
 24:  * 提供蓝图配置相关的数据访问方法
 25:  * 
 26:  * @example
 27:  * ```typescript
 28:  * const configRepo = inject(BlueprintConfigRepository);
 29:  * configRepo.findByBlueprintId('blueprint-id').subscribe(configs => {
 30:  *   console.log('Configs:', configs);
 31:  * });
 32:  * ```
 33:  */
 34: @Injectable({
 35:   providedIn: 'root'
 36: })
 37: export class BlueprintConfigRepository extends BaseRepository<
 38:   BlueprintConfig,
 39:   BlueprintConfigInsert,
 40:   BlueprintConfigUpdate
 41: > {
 42:   protected tableName = 'blueprint_configs';
 43: 
 44:   /**
 45:    * 根据蓝图 ID 查询配置列表
 46:    * 
 47:    * @param blueprintId 蓝图 ID
 48:    * @param options 查询选项
 49:    * @returns Observable<BlueprintConfig[]>
 50:    */
 51:   findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<BlueprintConfig[]> {
 52:     return this.findAll({
 53:       ...options,
 54:       filters: {
 55:         ...options?.filters,
 56:         blueprintId, // 会自动转换为 blueprint_id
 57:       },
 58:     });
 59:   }
 60: 
 61:   /**
 62:    * 根据配置键查询配置
 63:    * 
 64:    * @param blueprintId 蓝图 ID
 65:    * @param configKey 配置键
 66:    * @returns Observable<BlueprintConfig | null>
 67:    */
 68:   findByConfigKey(blueprintId: string, configKey: string): Observable<BlueprintConfig | null> {
 69:     return this.findAll({
 70:       filters: {
 71:         blueprintId, // 会自动转换为 blueprint_id
 72:         configKey, // 会自动转换为 config_key
 73:       },
 74:     }).pipe(
 75:       map(configs => configs.length > 0 ? configs[0] : null)
 76:     );
 77:   }
 78: 
 79:   /**
 80:    * 更新或创建配置（upsert）
 81:    * 
 82:    * @param blueprintId 蓝图 ID
 83:    * @param configKey 配置键
 84:    * @param configValue 配置值
 85:    * @param updatedBy 更新者 ID
 86:    * @returns Observable<BlueprintConfig>
 87:    */
 88:   upsertConfig(
 89:     blueprintId: string,
 90:     configKey: string,
 91:     configValue: any,
 92:     updatedBy?: string
 93:   ): Observable<BlueprintConfig> {
 94:     // 使用类型断言，因为 BaseRepository 会自动进行 camelCase → snake_case 转换
 95:     const data = {
 96:       blueprintId,
 97:       configKey,
 98:       configValue,
 99:       updatedBy,
100:     } as any as BlueprintConfigInsert;
101:     return this.create(data);
102:   }
103: }
````

## File: src/app/core/infra/repositories/branch-fork.repository.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { Observable } from 'rxjs';
  3: import { BaseRepository, QueryOptions } from './base.repository';
  4: import { Database } from '../types/database.types';
  5: 
  6: /**
  7:  * 从数据库类型中提取原始类型（snake_case）
  8:  */
  9: type BranchForkRow = Database['public']['Tables']['branch_forks']['Row'];
 10: type BranchForkInsert = Database['public']['Tables']['branch_forks']['Insert'];
 11: type BranchForkUpdate = Database['public']['Tables']['branch_forks']['Update'];
 12: 
 13: /**
 14:  * BranchFork 实体类型（camelCase）
 15:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 16:  */
 17: export type BranchFork = BranchForkRow;
 18: export type { BranchForkInsert, BranchForkUpdate };
 19: 
 20: /**
 21:  * BranchFork Repository
 22:  * 
 23:  * 提供分支 Fork 记录相关的数据访问方法
 24:  * 
 25:  * @example
 26:  * ```typescript
 27:  * const forkRepo = inject(BranchForkRepository);
 28:  * forkRepo.findByBlueprintId('blueprint-id').subscribe(forks => {
 29:  *   console.log('Forks:', forks);
 30:  * });
 31:  * ```
 32:  */
 33: @Injectable({
 34:   providedIn: 'root'
 35: })
 36: export class BranchForkRepository extends BaseRepository<BranchFork, BranchForkInsert, BranchForkUpdate> {
 37:   protected tableName = 'branch_forks';
 38: 
 39:   /**
 40:    * 根据蓝图 ID 查询 Fork 记录列表
 41:    * 
 42:    * @param blueprintId 蓝图 ID
 43:    * @param options 查询选项
 44:    * @returns Observable<BranchFork[]>
 45:    */
 46:   findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<BranchFork[]> {
 47:     return this.findAll({
 48:       ...options,
 49:       filters: {
 50:         ...options?.filters,
 51:         blueprintId, // 会自动转换为 blueprint_id
 52:       },
 53:     });
 54:   }
 55: 
 56:   /**
 57:    * 根据分支 ID 查询 Fork 记录列表
 58:    * 
 59:    * @param branchId 分支 ID
 60:    * @param options 查询选项
 61:    * @returns Observable<BranchFork[]>
 62:    */
 63:   findByBranchId(branchId: string, options?: QueryOptions): Observable<BranchFork[]> {
 64:     return this.findAll({
 65:       ...options,
 66:       filters: {
 67:         ...options?.filters,
 68:         branchId, // 会自动转换为 branch_id
 69:       },
 70:     });
 71:   }
 72: 
 73:   /**
 74:    * 根据源任务 ID 查询 Fork 记录列表
 75:    * 
 76:    * @param forkedFromTaskId 源任务 ID
 77:    * @param options 查询选项
 78:    * @returns Observable<BranchFork[]>
 79:    */
 80:   findByForkedFromTaskId(forkedFromTaskId: string, options?: QueryOptions): Observable<BranchFork[]> {
 81:     return this.findAll({
 82:       ...options,
 83:       filters: {
 84:         ...options?.filters,
 85:         forkedFromTaskId, // 会自动转换为 forked_from_task_id
 86:       },
 87:     });
 88:   }
 89: 
 90:   /**
 91:    * 根据 Fork 者 ID 查询 Fork 记录列表
 92:    * 
 93:    * @param forkedBy Fork 者 ID
 94:    * @param options 查询选项
 95:    * @returns Observable<BranchFork[]>
 96:    */
 97:   findByForkedBy(forkedBy: string, options?: QueryOptions): Observable<BranchFork[]> {
 98:     return this.findAll({
 99:       ...options,
100:       filters: {
101:         ...options?.filters,
102:         forkedBy, // 会自动转换为 forked_by
103:       },
104:     });
105:   }
106: }
````

## File: src/app/core/infra/repositories/collaboration-invitation.repository.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { Observable } from 'rxjs';
  3: import { BaseRepository, QueryOptions } from './base.repository';
  4: import { Database } from '../types/database.types';
  5: import { InvitationStatus } from '../types/collaboration.types';
  6: 
  7: /**
  8:  * 从数据库类型中提取原始类型（snake_case）
  9:  */
 10: type CollaborationInvitationRow = Database['public']['Tables']['collaboration_invitations']['Row'];
 11: type CollaborationInvitationInsert = Database['public']['Tables']['collaboration_invitations']['Insert'];
 12: type CollaborationInvitationUpdate = Database['public']['Tables']['collaboration_invitations']['Update'];
 13: 
 14: /**
 15:  * CollaborationInvitation 实体类型（camelCase）
 16:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 17:  */
 18: export type CollaborationInvitation = CollaborationInvitationRow;
 19: export type { CollaborationInvitationInsert, CollaborationInvitationUpdate };
 20: 
 21: /**
 22:  * CollaborationInvitation Repository
 23:  * 
 24:  * 提供协作邀请相关的数据访问方法
 25:  * 
 26:  * @example
 27:  * ```typescript
 28:  * const invRepo = inject(CollaborationInvitationRepository);
 29:  * invRepo.findByToOrgId('org-id').subscribe(invitations => {
 30:  *   console.log('Invitations:', invitations);
 31:  * });
 32:  * ```
 33:  */
 34: @Injectable({
 35:   providedIn: 'root'
 36: })
 37: export class CollaborationInvitationRepository extends BaseRepository<
 38:   CollaborationInvitation,
 39:   CollaborationInvitationInsert,
 40:   CollaborationInvitationUpdate
 41: > {
 42:   protected tableName = 'collaboration_invitations';
 43: 
 44:   /**
 45:    * 根据蓝图 ID 查询邀请列表
 46:    * 
 47:    * @param blueprintId 蓝图 ID
 48:    * @param options 查询选项
 49:    * @returns Observable<CollaborationInvitation[]>
 50:    */
 51:   findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<CollaborationInvitation[]> {
 52:     return this.findAll({
 53:       ...options,
 54:       filters: {
 55:         ...options?.filters,
 56:         blueprintId, // 会自动转换为 blueprint_id
 57:       },
 58:     });
 59:   }
 60: 
 61:   /**
 62:    * 根据发送组织 ID 查询邀请列表
 63:    * 
 64:    * @param fromOrgId 发送组织 ID
 65:    * @param options 查询选项
 66:    * @returns Observable<CollaborationInvitation[]>
 67:    */
 68:   findByFromOrgId(fromOrgId: string, options?: QueryOptions): Observable<CollaborationInvitation[]> {
 69:     return this.findAll({
 70:       ...options,
 71:       filters: {
 72:         ...options?.filters,
 73:         fromOrgId, // 会自动转换为 from_org_id
 74:       },
 75:     });
 76:   }
 77: 
 78:   /**
 79:    * 根据接收组织 ID 查询邀请列表
 80:    * 
 81:    * @param toOrgId 接收组织 ID
 82:    * @param options 查询选项
 83:    * @returns Observable<CollaborationInvitation[]>
 84:    */
 85:   findByToOrgId(toOrgId: string, options?: QueryOptions): Observable<CollaborationInvitation[]> {
 86:     return this.findAll({
 87:       ...options,
 88:       filters: {
 89:         ...options?.filters,
 90:         toOrgId, // 会自动转换为 to_org_id
 91:       },
 92:     });
 93:   }
 94: 
 95:   /**
 96:    * 根据状态查询邀请列表
 97:    * 
 98:    * @param status 邀请状态
 99:    * @param options 查询选项
100:    * @returns Observable<CollaborationInvitation[]>
101:    */
102:   findByStatus(status: InvitationStatus, options?: QueryOptions): Observable<CollaborationInvitation[]> {
103:     return this.findAll({
104:       ...options,
105:       filters: {
106:         ...options?.filters,
107:         status,
108:       },
109:     });
110:   }
111: 
112:   /**
113:    * 查询过期的邀请列表
114:    * 
115:    * @param options 查询选项
116:    * @returns Observable<CollaborationInvitation[]>
117:    */
118:   findExpired(options?: QueryOptions): Observable<CollaborationInvitation[]> {
119:     return this.findAll({
120:       ...options,
121:       filters: {
122:         ...options?.filters,
123:         expiresAt: { $lt: new Date().toISOString() }, // 过期时间小于当前时间
124:       },
125:     });
126:   }
127: 
128:   /**
129:    * 查询待处理的邀请列表
130:    * 
131:    * @param options 查询选项
132:    * @returns Observable<CollaborationInvitation[]>
133:    */
134:   findPending(options?: QueryOptions): Observable<CollaborationInvitation[]> {
135:     return this.findByStatus(InvitationStatus.PENDING, options);
136:   }
137: }
````

## File: src/app/core/infra/repositories/collaboration-member.repository.ts
````typescript
 1: import { Injectable } from '@angular/core';
 2: import { Observable } from 'rxjs';
 3: import { BaseRepository, QueryOptions } from './base.repository';
 4: import { Database } from '../types/database.types';
 5: 
 6: /**
 7:  * 从数据库类型中提取原始类型（snake_case）
 8:  */
 9: type CollaborationMemberRow = Database['public']['Tables']['collaboration_members']['Row'];
10: type CollaborationMemberInsert = Database['public']['Tables']['collaboration_members']['Insert'];
11: type CollaborationMemberUpdate = Database['public']['Tables']['collaboration_members']['Update'];
12: 
13: /**
14:  * CollaborationMember 实体类型（camelCase）
15:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
16:  */
17: export type CollaborationMember = CollaborationMemberRow;
18: export type { CollaborationMemberInsert, CollaborationMemberUpdate };
19: 
20: /**
21:  * CollaborationMember Repository
22:  * 
23:  * 提供协作成员相关的数据访问方法
24:  * 
25:  * @example
26:  * ```typescript
27:  * const memberRepo = inject(CollaborationMemberRepository);
28:  * memberRepo.findByCollaborationId('collab-id').subscribe(members => {
29:  *   console.log('Members:', members);
30:  * });
31:  * ```
32:  */
33: @Injectable({
34:   providedIn: 'root'
35: })
36: export class CollaborationMemberRepository extends BaseRepository<
37:   CollaborationMember,
38:   CollaborationMemberInsert,
39:   CollaborationMemberUpdate
40: > {
41:   protected tableName = 'collaboration_members';
42: 
43:   /**
44:    * 根据协作关系 ID 查询成员列表
45:    * 
46:    * @param collaborationId 协作关系 ID
47:    * @param options 查询选项
48:    * @returns Observable<CollaborationMember[]>
49:    */
50:   findByCollaborationId(
51:     collaborationId: string,
52:     options?: QueryOptions
53:   ): Observable<CollaborationMember[]> {
54:     return this.findAll({
55:       ...options,
56:       filters: {
57:         ...options?.filters,
58:         collaborationId, // 会自动转换为 collaboration_id
59:       },
60:     });
61:   }
62: 
63:   /**
64:    * 根据账户 ID 查询成员列表
65:    * 
66:    * @param accountId 账户 ID
67:    * @param options 查询选项
68:    * @returns Observable<CollaborationMember[]>
69:    */
70:   findByAccountId(accountId: string, options?: QueryOptions): Observable<CollaborationMember[]> {
71:     return this.findAll({
72:       ...options,
73:       filters: {
74:         ...options?.filters,
75:         accountId, // 会自动转换为 account_id
76:       },
77:     });
78:   }
79: 
80:   /**
81:    * 根据角色查询成员列表
82:    * 
83:    * @param role 成员角色
84:    * @param options 查询选项
85:    * @returns Observable<CollaborationMember[]>
86:    */
87:   findByRole(role: string, options?: QueryOptions): Observable<CollaborationMember[]> {
88:     return this.findAll({
89:       ...options,
90:       filters: {
91:         ...options?.filters,
92:         role,
93:       },
94:     });
95:   }
96: }
````

## File: src/app/core/infra/repositories/organization-collaboration.repository.spec.ts
````typescript
  1: import { TestBed } from '@angular/core/testing';
  2: import { of } from 'rxjs';
  3: import { SupabaseService } from '../../supabase/supabase.service';
  4: import { OrganizationCollaborationRepository } from './organization-collaboration.repository';
  5: import { CollaborationType, CollaborationStatus } from '../types/collaboration.types';
  6: import { OrganizationCollaboration } from '@shared';
  7: 
  8: describe('OrganizationCollaborationRepository', () => {
  9:   let repository: OrganizationCollaborationRepository;
 10:   let supabaseService: jasmine.SpyObj<SupabaseService>;
 11:   let mockSupabaseClient: any;
 12: 
 13:   const mockCollaboration: OrganizationCollaboration = {
 14:     id: 'collab-1',
 15:     blueprint_id: 'blueprint-1',
 16:     owner_org_id: 'org-1',
 17:     collaborator_org_id: 'org-2',
 18:     collaboration_type: CollaborationType.CONTRACTOR,
 19:     status: CollaborationStatus.ACTIVE,
 20:     contract_start_date: '2025-01-01',
 21:     contract_end_date: '2025-12-31',
 22:     notes: 'Test collaboration',
 23:     created_at: '2025-01-01T00:00:00Z',
 24:     updated_at: '2025-01-01T00:00:00Z'
 25:   } as OrganizationCollaboration;
 26: 
 27:   beforeEach(() => {
 28:     // 创建 Mock Supabase Client
 29:     mockSupabaseClient = {
 30:       from: jasmine.createSpy('from').and.returnValue({
 31:         select: jasmine.createSpy('select').and.returnValue({
 32:           eq: jasmine.createSpy('eq').and.returnValue({
 33:             order: jasmine.createSpy('order').and.returnValue({
 34:               range: jasmine.createSpy('range').and.returnValue(
 35:                 Promise.resolve({ data: [mockCollaboration], error: null })
 36:               )
 37:             })
 38:           })
 39:         })
 40:       })
 41:     };
 42: 
 43:     const supabaseServiceSpy = jasmine.createSpyObj('SupabaseService', [], {
 44:       client: mockSupabaseClient
 45:     });
 46: 
 47:     TestBed.configureTestingModule({
 48:       providers: [
 49:         OrganizationCollaborationRepository,
 50:         { provide: SupabaseService, useValue: supabaseServiceSpy }
 51:       ]
 52:     });
 53: 
 54:     repository = TestBed.inject(OrganizationCollaborationRepository);
 55:     supabaseService = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
 56:   });
 57: 
 58:   it('should be created', () => {
 59:     expect(repository).toBeTruthy();
 60:   });
 61: 
 62:   describe('findByBlueprintId', () => {
 63:     it('should find collaborations by blueprint id', (done) => {
 64:       repository.findByBlueprintId('blueprint-1').subscribe({
 65:         next: (collaborations) => {
 66:           expect(collaborations.length).toBeGreaterThan(0);
 67:           expect(mockSupabaseClient.from).toHaveBeenCalledWith('organization_collaborations');
 68:           done();
 69:         },
 70:         error: done.fail
 71:       });
 72:     });
 73:   });
 74: 
 75:   describe('findByOwnerOrgId', () => {
 76:     it('should find collaborations by owner org id', (done) => {
 77:       repository.findByOwnerOrgId('org-1').subscribe({
 78:         next: (collaborations) => {
 79:           expect(mockSupabaseClient.from).toHaveBeenCalledWith('organization_collaborations');
 80:           done();
 81:         },
 82:         error: done.fail
 83:       });
 84:     });
 85:   });
 86: 
 87:   describe('findByCollaboratorOrgId', () => {
 88:     it('should find collaborations by collaborator org id', (done) => {
 89:       repository.findByCollaboratorOrgId('org-2').subscribe({
 90:         next: (collaborations) => {
 91:           expect(mockSupabaseClient.from).toHaveBeenCalledWith('organization_collaborations');
 92:           done();
 93:         },
 94:         error: done.fail
 95:       });
 96:     });
 97:   });
 98: 
 99:   describe('findByCollaborationType', () => {
100:     it('should find collaborations by type', (done) => {
101:       repository.findByCollaborationType(CollaborationType.CONTRACTOR).subscribe({
102:         next: (collaborations) => {
103:           expect(mockSupabaseClient.from).toHaveBeenCalledWith('organization_collaborations');
104:           done();
105:         },
106:         error: done.fail
107:       });
108:     });
109:   });
110: 
111:   describe('findByStatus', () => {
112:     it('should find collaborations by status', (done) => {
113:       repository.findByStatus(CollaborationStatus.ACTIVE).subscribe({
114:         next: (collaborations) => {
115:           expect(mockSupabaseClient.from).toHaveBeenCalledWith('organization_collaborations');
116:           done();
117:         },
118:         error: done.fail
119:       });
120:     });
121:   });
122: });
````

## File: src/app/core/infra/repositories/organization-collaboration.repository.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { Observable } from 'rxjs';
  3: import { BaseRepository, QueryOptions } from './base.repository';
  4: import { Database } from '../types/database.types';
  5: import { CollaborationType, CollaborationStatus } from '../types/collaboration.types';
  6: 
  7: /**
  8:  * 从数据库类型中提取原始类型（snake_case）
  9:  */
 10: type OrganizationCollaborationRow = Database['public']['Tables']['organization_collaborations']['Row'];
 11: type OrganizationCollaborationInsert = Database['public']['Tables']['organization_collaborations']['Insert'];
 12: type OrganizationCollaborationUpdate = Database['public']['Tables']['organization_collaborations']['Update'];
 13: 
 14: /**
 15:  * OrganizationCollaboration 实体类型（camelCase）
 16:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 17:  */
 18: export type OrganizationCollaboration = OrganizationCollaborationRow;
 19: export type { OrganizationCollaborationInsert, OrganizationCollaborationUpdate };
 20: 
 21: /**
 22:  * OrganizationCollaboration Repository
 23:  * 
 24:  * 提供组织协作关系相关的数据访问方法
 25:  * 
 26:  * @example
 27:  * ```typescript
 28:  * const collabRepo = inject(OrganizationCollaborationRepository);
 29:  * collabRepo.findByBlueprintId('blueprint-id').subscribe(collabs => {
 30:  *   console.log('Collaborations:', collabs);
 31:  * });
 32:  * ```
 33:  */
 34: @Injectable({
 35:   providedIn: 'root'
 36: })
 37: export class OrganizationCollaborationRepository extends BaseRepository<
 38:   OrganizationCollaboration,
 39:   OrganizationCollaborationInsert,
 40:   OrganizationCollaborationUpdate
 41: > {
 42:   protected tableName = 'organization_collaborations';
 43: 
 44:   /**
 45:    * 根据蓝图 ID 查询协作关系列表
 46:    * 
 47:    * @param blueprintId 蓝图 ID
 48:    * @param options 查询选项
 49:    * @returns Observable<OrganizationCollaboration[]>
 50:    */
 51:   findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<OrganizationCollaboration[]> {
 52:     return this.findAll({
 53:       ...options,
 54:       filters: {
 55:         ...options?.filters,
 56:         blueprintId, // 会自动转换为 blueprint_id
 57:       },
 58:     });
 59:   }
 60: 
 61:   /**
 62:    * 根据拥有者组织 ID 查询协作关系列表
 63:    * 
 64:    * @param ownerOrgId 拥有者组织 ID
 65:    * @param options 查询选项
 66:    * @returns Observable<OrganizationCollaboration[]>
 67:    */
 68:   findByOwnerOrgId(ownerOrgId: string, options?: QueryOptions): Observable<OrganizationCollaboration[]> {
 69:     return this.findAll({
 70:       ...options,
 71:       filters: {
 72:         ...options?.filters,
 73:         ownerOrgId, // 会自动转换为 owner_org_id
 74:       },
 75:     });
 76:   }
 77: 
 78:   /**
 79:    * 根据协作组织 ID 查询协作关系列表
 80:    * 
 81:    * @param collaboratorOrgId 协作组织 ID
 82:    * @param options 查询选项
 83:    * @returns Observable<OrganizationCollaboration[]>
 84:    */
 85:   findByCollaboratorOrgId(
 86:     collaboratorOrgId: string,
 87:     options?: QueryOptions
 88:   ): Observable<OrganizationCollaboration[]> {
 89:     return this.findAll({
 90:       ...options,
 91:       filters: {
 92:         ...options?.filters,
 93:         collaboratorOrgId, // 会自动转换为 collaborator_org_id
 94:       },
 95:     });
 96:   }
 97: 
 98:   /**
 99:    * 根据协作类型查询协作关系列表
100:    * 
101:    * @param collaborationType 协作类型
102:    * @param options 查询选项
103:    * @returns Observable<OrganizationCollaboration[]>
104:    */
105:   findByCollaborationType(
106:     collaborationType: CollaborationType,
107:     options?: QueryOptions
108:   ): Observable<OrganizationCollaboration[]> {
109:     return this.findAll({
110:       ...options,
111:       filters: {
112:         ...options?.filters,
113:         collaborationType, // 会自动转换为 collaboration_type
114:       },
115:     });
116:   }
117: 
118:   /**
119:    * 根据状态查询协作关系列表
120:    * 
121:    * @param status 协作状态
122:    * @param options 查询选项
123:    * @returns Observable<OrganizationCollaboration[]>
124:    */
125:   findByStatus(status: CollaborationStatus, options?: QueryOptions): Observable<OrganizationCollaboration[]> {
126:     return this.findAll({
127:       ...options,
128:       filters: {
129:         ...options?.filters,
130:         status,
131:       },
132:     });
133:   }
134: }
````

## File: src/app/core/infra/repositories/organization-schedule.repository.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { Observable } from 'rxjs';
  3: import { BaseRepository, QueryOptions } from './base.repository';
  4: import { Database } from '../types/database.types';
  5: 
  6: /**
  7:  * 从数据库类型中提取原始类型（snake_case）
  8:  */
  9: type OrganizationScheduleRow = Database['public']['Tables']['organization_schedules']['Row'];
 10: type OrganizationScheduleInsert = Database['public']['Tables']['organization_schedules']['Insert'];
 11: type OrganizationScheduleUpdate = Database['public']['Tables']['organization_schedules']['Update'];
 12: 
 13: /**
 14:  * OrganizationSchedule 实体类型（camelCase）
 15:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 16:  */
 17: export type OrganizationSchedule = OrganizationScheduleRow;
 18: export type { OrganizationScheduleInsert, OrganizationScheduleUpdate };
 19: 
 20: /**
 21:  * OrganizationSchedule Repository
 22:  * 
 23:  * 提供组织排班相关的数据访问方法
 24:  * 
 25:  * @example
 26:  * ```typescript
 27:  * const scheduleRepo = inject(OrganizationScheduleRepository);
 28:  * scheduleRepo.findByOrganizationId('org-id').subscribe(schedules => {
 29:  *   console.log('Organization schedules:', schedules);
 30:  * });
 31:  * ```
 32:  */
 33: @Injectable({
 34:   providedIn: 'root'
 35: })
 36: export class OrganizationScheduleRepository extends BaseRepository<OrganizationSchedule, OrganizationScheduleInsert, OrganizationScheduleUpdate> {
 37:   protected tableName = 'organization_schedules';
 38: 
 39:   /**
 40:    * 根据组织 ID 查询排班列表
 41:    * 
 42:    * @param organizationId 组织 ID
 43:    * @param options 查询选项
 44:    * @returns Observable<OrganizationSchedule[]>
 45:    */
 46:   findByOrganizationId(organizationId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
 47:     return this.findAll({
 48:       ...options,
 49:       filters: {
 50:         ...options?.filters,
 51:         organizationId, // 会自动转换为 organization_id
 52:       },
 53:     });
 54:   }
 55: 
 56:   /**
 57:    * 根据蓝图 ID 查询排班列表
 58:    * 
 59:    * @param blueprintId 蓝图 ID
 60:    * @param options 查询选项
 61:    * @returns Observable<OrganizationSchedule[]>
 62:    */
 63:   findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
 64:     return this.findAll({
 65:       ...options,
 66:       filters: {
 67:         ...options?.filters,
 68:         blueprintId, // 会自动转换为 blueprint_id
 69:       },
 70:     });
 71:   }
 72: 
 73:   /**
 74:    * 根据分支 ID 查询排班列表
 75:    * 
 76:    * @param branchId 分支 ID
 77:    * @param options 查询选项
 78:    * @returns Observable<OrganizationSchedule[]>
 79:    */
 80:   findByBranchId(branchId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
 81:     return this.findAll({
 82:       ...options,
 83:       filters: {
 84:         ...options?.filters,
 85:         branchId, // 会自动转换为 branch_id
 86:       },
 87:     });
 88:   }
 89: 
 90:   /**
 91:    * 根据账户 ID 查询排班列表
 92:    * 
 93:    * @param accountId 账户 ID
 94:    * @param options 查询选项
 95:    * @returns Observable<OrganizationSchedule[]>
 96:    */
 97:   findByAccountId(accountId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
 98:     return this.findAll({
 99:       ...options,
100:       filters: {
101:         ...options?.filters,
102:         accountId, // 会自动转换为 account_id
103:       },
104:     });
105:   }
106: 
107:   /**
108:    * 根据团队 ID 查询排班列表
109:    * 
110:    * @param teamId 团队 ID
111:    * @param options 查询选项
112:    * @returns Observable<OrganizationSchedule[]>
113:    */
114:   findByTeamId(teamId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
115:     return this.findAll({
116:       ...options,
117:       filters: {
118:         ...options?.filters,
119:         teamId, // 会自动转换为 team_id
120:       },
121:     });
122:   }
123: 
124:   /**
125:    * 根据日期范围查询排班列表
126:    * 
127:    * @param startDate 开始日期
128:    * @param endDate 结束日期
129:    * @param options 查询选项
130:    * @returns Observable<OrganizationSchedule[]>
131:    */
132:   findByDateRange(startDate: string, endDate: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
133:     // 注意：这里需要根据实际的 BaseRepository 实现来调整
134:     // 如果 BaseRepository 支持范围查询，可以使用 filters
135:     // 否则可能需要使用自定义查询
136:     return this.findAll({
137:       ...options,
138:       filters: {
139:         ...options?.filters,
140:         // 日期范围查询可能需要特殊处理
141:         // 这里假设 BaseRepository 支持 gte/lte 操作符
142:       },
143:     });
144:   }
145: }
````

## File: src/app/core/infra/repositories/pull-request.repository.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { Observable } from 'rxjs';
  3: import { BaseRepository, QueryOptions } from './base.repository';
  4: import { Database } from '../types/database.types';
  5: import { PRStatus } from '../types/blueprint.types';
  6: 
  7: /**
  8:  * 从数据库类型中提取原始类型（snake_case）
  9:  */
 10: type PullRequestRow = Database['public']['Tables']['pull_requests']['Row'];
 11: type PullRequestInsert = Database['public']['Tables']['pull_requests']['Insert'];
 12: type PullRequestUpdate = Database['public']['Tables']['pull_requests']['Update'];
 13: 
 14: /**
 15:  * PullRequest 实体类型（camelCase）
 16:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 17:  */
 18: export type PullRequest = PullRequestRow;
 19: export type { PullRequestInsert, PullRequestUpdate };
 20: 
 21: /**
 22:  * PullRequest Repository
 23:  * 
 24:  * 提供 Pull Request 相关的数据访问方法
 25:  * 
 26:  * @example
 27:  * ```typescript
 28:  * const prRepo = inject(PullRequestRepository);
 29:  * prRepo.findByBlueprintId('blueprint-id').subscribe(prs => {
 30:  *   console.log('Pull Requests:', prs);
 31:  * });
 32:  * ```
 33:  */
 34: @Injectable({
 35:   providedIn: 'root'
 36: })
 37: export class PullRequestRepository extends BaseRepository<PullRequest, PullRequestInsert, PullRequestUpdate> {
 38:   protected tableName = 'pull_requests';
 39: 
 40:   /**
 41:    * 根据蓝图 ID 查询 Pull Request 列表
 42:    * 
 43:    * @param blueprintId 蓝图 ID
 44:    * @param options 查询选项
 45:    * @returns Observable<PullRequest[]>
 46:    */
 47:   findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<PullRequest[]> {
 48:     return this.findAll({
 49:       ...options,
 50:       filters: {
 51:         ...options?.filters,
 52:         blueprintId, // 会自动转换为 blueprint_id
 53:       },
 54:     });
 55:   }
 56: 
 57:   /**
 58:    * 根据分支 ID 查询 Pull Request 列表
 59:    * 
 60:    * @param branchId 分支 ID
 61:    * @param options 查询选项
 62:    * @returns Observable<PullRequest[]>
 63:    */
 64:   findByBranchId(branchId: string, options?: QueryOptions): Observable<PullRequest[]> {
 65:     return this.findAll({
 66:       ...options,
 67:       filters: {
 68:         ...options?.filters,
 69:         branchId, // 会自动转换为 branch_id
 70:       },
 71:     });
 72:   }
 73: 
 74:   /**
 75:    * 根据状态查询 Pull Request 列表
 76:    * 
 77:    * @param status PR 状态
 78:    * @param options 查询选项
 79:    * @returns Observable<PullRequest[]>
 80:    */
 81:   findByStatus(status: PRStatus, options?: QueryOptions): Observable<PullRequest[]> {
 82:     return this.findAll({
 83:       ...options,
 84:       filters: {
 85:         ...options?.filters,
 86:         status,
 87:       },
 88:     });
 89:   }
 90: 
 91:   /**
 92:    * 查询打开的 Pull Request 列表
 93:    * 
 94:    * @param options 查询选项
 95:    * @returns Observable<PullRequest[]>
 96:    */
 97:   findOpen(options?: QueryOptions): Observable<PullRequest[]> {
 98:     return this.findByStatus(PRStatus.OPEN, options);
 99:   }
100: 
101:   /**
102:    * 查询审核中的 Pull Request 列表
103:    * 
104:    * @param options 查询选项
105:    * @returns Observable<PullRequest[]>
106:    */
107:   findReviewing(options?: QueryOptions): Observable<PullRequest[]> {
108:     return this.findByStatus(PRStatus.REVIEWING, options);
109:   }
110: 
111:   /**
112:    * 查询已合并的 Pull Request 列表
113:    * 
114:    * @param options 查询选项
115:    * @returns Observable<PullRequest[]>
116:    */
117:   findMerged(options?: QueryOptions): Observable<PullRequest[]> {
118:     return this.findByStatus(PRStatus.MERGED, options);
119:   }
120: 
121:   /**
122:    * 根据提交者 ID 查询 Pull Request 列表
123:    * 
124:    * @param submittedBy 提交者 ID
125:    * @param options 查询选项
126:    * @returns Observable<PullRequest[]>
127:    */
128:   findBySubmittedBy(submittedBy: string, options?: QueryOptions): Observable<PullRequest[]> {
129:     return this.findAll({
130:       ...options,
131:       filters: {
132:         ...options?.filters,
133:         submittedBy, // 会自动转换为 submitted_by
134:       },
135:     });
136:   }
137: 
138:   /**
139:    * 根据审核者 ID 查询 Pull Request 列表
140:    * 
141:    * @param reviewedBy 审核者 ID
142:    * @param options 查询选项
143:    * @returns Observable<PullRequest[]>
144:    */
145:   findByReviewedBy(reviewedBy: string, options?: QueryOptions): Observable<PullRequest[]> {
146:     return this.findAll({
147:       ...options,
148:       filters: {
149:         ...options?.filters,
150:         reviewedBy, // 会自动转换为 reviewed_by
151:       },
152:     });
153:   }
154: }
````

## File: src/app/core/infra/repositories/team-member.repository.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { Observable } from 'rxjs';
  3: import { BaseRepository, QueryOptions } from './base.repository';
  4: import { Database } from '../types/database.types';
  5: import { TeamMemberRole } from '../types/account.types';
  6: 
  7: /**
  8:  * 从数据库类型中提取原始类型（snake_case）
  9:  */
 10: type TeamMemberRow = Database['public']['Tables']['team_members']['Row'];
 11: type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];
 12: type TeamMemberUpdate = Database['public']['Tables']['team_members']['Update'];
 13: 
 14: /**
 15:  * TeamMember 实体类型（camelCase）
 16:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 17:  */
 18: export type TeamMember = TeamMemberRow;
 19: export type { TeamMemberInsert, TeamMemberUpdate };
 20: 
 21: /**
 22:  * TeamMember Repository
 23:  * 
 24:  * 提供团队成员相关的数据访问方法
 25:  * 
 26:  * @example
 27:  * ```typescript
 28:  * const teamMemberRepo = inject(TeamMemberRepository);
 29:  * teamMemberRepo.findByTeamId('team-id').subscribe(members => {
 30:  *   console.log('Team members:', members);
 31:  * });
 32:  * ```
 33:  */
 34: @Injectable({
 35:   providedIn: 'root'
 36: })
 37: export class TeamMemberRepository extends BaseRepository<TeamMember, TeamMemberInsert, TeamMemberUpdate> {
 38:   protected tableName = 'team_members';
 39: 
 40:   /**
 41:    * 根据团队 ID 查询团队成员列表
 42:    * 
 43:    * @param teamId 团队 ID
 44:    * @param options 查询选项
 45:    * @returns Observable<TeamMember[]>
 46:    */
 47:   findByTeamId(teamId: string, options?: QueryOptions): Observable<TeamMember[]> {
 48:     return this.findAll({
 49:       ...options,
 50:       filters: {
 51:         ...options?.filters,
 52:         teamId, // 会自动转换为 team_id
 53:       },
 54:     });
 55:   }
 56: 
 57:   /**
 58:    * 根据账户 ID 查询团队成员关系
 59:    * 
 60:    * @param accountId 账户 ID
 61:    * @param options 查询选项
 62:    * @returns Observable<TeamMember[]>
 63:    */
 64:   findByAccountId(accountId: string, options?: QueryOptions): Observable<TeamMember[]> {
 65:     return this.findAll({
 66:       ...options,
 67:       filters: {
 68:         ...options?.filters,
 69:         accountId, // 会自动转换为 account_id
 70:       },
 71:     });
 72:   }
 73: 
 74:   /**
 75:    * 根据角色查询团队成员
 76:    * 
 77:    * @param role 成员角色
 78:    * @param options 查询选项
 79:    * @returns Observable<TeamMember[]>
 80:    */
 81:   findByRole(role: TeamMemberRole, options?: QueryOptions): Observable<TeamMember[]> {
 82:     return this.findAll({
 83:       ...options,
 84:       filters: {
 85:         ...options?.filters,
 86:         role,
 87:       },
 88:     });
 89:   }
 90: 
 91:   /**
 92:    * 查询团队中的负责人（leader）
 93:    * 
 94:    * @param teamId 团队 ID
 95:    * @returns Observable<TeamMember[]>
 96:    */
 97:   findLeadersByTeamId(teamId: string): Observable<TeamMember[]> {
 98:     return this.findAll({
 99:       filters: {
100:         teamId, // 会自动转换为 team_id
101:         role: TeamMemberRole.LEADER,
102:       },
103:     });
104:   }
105: }
````

## File: src/app/core/infra/repositories/team.repository.ts
````typescript
 1: import { Injectable } from '@angular/core';
 2: import { Observable } from 'rxjs';
 3: import { BaseRepository, QueryOptions } from './base.repository';
 4: import { Database } from '../types/database.types';
 5: 
 6: /**
 7:  * 从数据库类型中提取原始类型（snake_case）
 8:  */
 9: type TeamRow = Database['public']['Tables']['teams']['Row'];
10: type TeamInsert = Database['public']['Tables']['teams']['Insert'];
11: type TeamUpdate = Database['public']['Tables']['teams']['Update'];
12: 
13: /**
14:  * Team 实体类型（camelCase）
15:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
16:  */
17: export type Team = TeamRow;
18: export type { TeamInsert, TeamUpdate };
19: 
20: /**
21:  * Team Repository
22:  * 
23:  * 提供团队相关的数据访问方法
24:  * 
25:  * @example
26:  * ```typescript
27:  * const teamRepo = inject(TeamRepository);
28:  * teamRepo.findByOrganizationId('org-id').subscribe(teams => {
29:  *   console.log('Organization teams:', teams);
30:  * });
31:  * ```
32:  */
33: @Injectable({
34:   providedIn: 'root'
35: })
36: export class TeamRepository extends BaseRepository<Team, TeamInsert, TeamUpdate> {
37:   protected tableName = 'teams';
38: 
39:   /**
40:    * 根据组织 ID 查询团队列表
41:    * 
42:    * @param organizationId 组织 ID
43:    * @param options 查询选项
44:    * @returns Observable<Team[]>
45:    */
46:   findByOrganizationId(organizationId: string, options?: QueryOptions): Observable<Team[]> {
47:     return this.findAll({
48:       ...options,
49:       filters: {
50:         ...options?.filters,
51:         organizationId, // 会自动转换为 organization_id
52:       },
53:     });
54:   }
55: 
56:   /**
57:    * 根据创建者 ID 查询团队列表
58:    * 
59:    * @param createdBy 创建者 ID
60:    * @param options 查询选项
61:    * @returns Observable<Team[]>
62:    */
63:   findByCreatedBy(createdBy: string, options?: QueryOptions): Observable<Team[]> {
64:     return this.findAll({
65:       ...options,
66:       filters: {
67:         ...options?.filters,
68:         createdBy, // 会自动转换为 created_by
69:       },
70:     });
71:   }
72: }
````

## File: src/app/core/infra/types/account.types.ts
````typescript
 1: /**
 2:  * 账户相关类型定义（基础设施层）
 3:  * 
 4:  * 这些类型被 Repository 层使用，因此放在 core 层
 5:  * 符合分层架构：core 不依赖 shared
 6:  * 
 7:  * @module core/infra/types
 8:  */
 9: 
10: /**
11:  * 账户类型枚举
12:  * 对应数据库 accounts.type 字段
13:  */
14: export enum AccountType {
15:   /** 用户账户 */
16:   USER = 'User',
17:   /** 机器人账户 */
18:   BOT = 'Bot',
19:   /** 组织账户 */
20:   ORGANIZATION = 'Organization'
21: }
22: 
23: /**
24:  * 账户状态枚举
25:  * 对应数据库 accounts.status 字段
26:  */
27: export enum AccountStatus {
28:   /** 活跃 */
29:   ACTIVE = 'active',
30:   /** 非活跃 */
31:   INACTIVE = 'inactive',
32:   /** 已暂停 */
33:   SUSPENDED = 'suspended'
34: }
35: 
36: /**
37:  * 团队成员角色枚举
38:  * 对应数据库 team_members.role 字段
39:  */
40: export enum TeamMemberRole {
41:   /** 团队负责人 */
42:   LEADER = 'leader',
43:   /** 团队成员 */
44:   MEMBER = 'member'
45: }
````

## File: src/app/core/infra/types/blueprint.types.ts
````typescript
 1: /**
 2:  * 蓝图系统相关类型定义（基础设施层）
 3:  * 
 4:  * 这些类型被 Repository 层使用，因此放在 core 层
 5:  * 符合分层架构：core 不依赖 shared
 6:  * 
 7:  * @module core/infra/types
 8:  */
 9: 
10: /**
11:  * 蓝图状态枚举
12:  * 对应数据库 blueprints.status 字段
13:  */
14: export enum BlueprintStatus {
15:   /** 规划中 */
16:   PLANNING = 'planning',
17:   /** 进行中 */
18:   ACTIVE = 'active',
19:   /** 暂停 */
20:   ON_HOLD = 'on_hold',
21:   /** 已完成 */
22:   COMPLETED = 'completed',
23:   /** 已归档 */
24:   ARCHIVED = 'archived'
25: }
26: 
27: /**
28:  * 分支类型枚举
29:  * 对应数据库 blueprint_branches.branch_type 字段
30:  */
31: export enum BranchType {
32:   /** 承揽商 */
33:   CONTRACTOR = 'contractor',
34:   /** 分包商 */
35:   SUBCONTRACTOR = 'subcontractor',
36:   /** 顾问 */
37:   CONSULTANT = 'consultant'
38: }
39: 
40: /**
41:  * 分支状态枚举
42:  * 对应数据库 blueprint_branches.status 字段
43:  */
44: export enum BranchStatus {
45:   /** 活跃 */
46:   ACTIVE = 'active',
47:   /** 已合并 */
48:   MERGED = 'merged',
49:   /** 已关闭 */
50:   CLOSED = 'closed'
51: }
52: 
53: /**
54:  * Pull Request 状态枚举
55:  * 对应数据库 pull_requests.status 字段
56:  */
57: export enum PRStatus {
58:   /** 打开 */
59:   OPEN = 'open',
60:   /** 审核中 */
61:   REVIEWING = 'reviewing',
62:   /** 已批准 */
63:   APPROVED = 'approved',
64:   /** 已拒绝 */
65:   REJECTED = 'rejected',
66:   /** 已合并 */
67:   MERGED = 'merged',
68:   /** 已关闭 */
69:   CLOSED = 'closed'
70: }
````

## File: src/app/core/infra/types/collaboration.types.ts
````typescript
 1: /**
 2:  * 组织协作相关类型定义（基础设施层）
 3:  * 
 4:  * 这些类型被 Repository 层使用，因此放在 core 层
 5:  * 符合分层架构：core 不依赖 shared
 6:  * 
 7:  * @module core/infra/types
 8:  */
 9: 
10: /**
11:  * 协作类型枚举
12:  * 对应数据库 organization_collaborations.collaboration_type 字段
13:  */
14: export enum CollaborationType {
15:   /** 承揽商 */
16:   CONTRACTOR = 'contractor',
17:   /** 次承揽商 */
18:   SUBCONTRACTOR = 'subcontractor',
19:   /** 顾问 */
20:   CONSULTANT = 'consultant',
21:   /** 合作伙伴 */
22:   PARTNER = 'partner'
23: }
24: 
25: /**
26:  * 协作状态枚举
27:  * 对应数据库 organization_collaborations.status 字段
28:  */
29: export enum CollaborationStatus {
30:   /** 待处理 */
31:   PENDING = 'pending',
32:   /** 活跃 */
33:   ACTIVE = 'active',
34:   /** 已暂停 */
35:   SUSPENDED = 'suspended',
36:   /** 已结束 */
37:   ENDED = 'ended'
38: }
39: 
40: /**
41:  * 邀请状态枚举
42:  * 对应数据库 collaboration_invitations.status 字段
43:  */
44: export enum InvitationStatus {
45:   /** 待处理 */
46:   PENDING = 'pending',
47:   /** 已接受 */
48:   ACCEPTED = 'accepted',
49:   /** 已拒绝 */
50:   REJECTED = 'rejected',
51:   /** 已过期 */
52:   EXPIRED = 'expired'
53: }
````

## File: src/app/core/infra/types/database.types.ts
````typescript
   1: export type Json =
   2:   | string
   3:   | number
   4:   | boolean
   5:   | null
   6:   | { [key: string]: Json | undefined }
   7:   | Json[]
   8: 
   9: export type Database = {
  10:   // Allows to automatically instantiate createClient with right options
  11:   // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  12:   __InternalSupabase: {
  13:     PostgrestVersion: "13.0.5"
  14:   }
  15:   public: {
  16:     Tables: {
  17:       accounts: {
  18:         Row: {
  19:           auth_user_id: string | null
  20:           avatar_url: string | null
  21:           created_at: string | null
  22:           email: string | null
  23:           id: string
  24:           metadata: Json | null
  25:           name: string
  26:           status: string | null
  27:           type: string
  28:           updated_at: string | null
  29:         }
  30:         Insert: {
  31:           auth_user_id?: string | null
  32:           avatar_url?: string | null
  33:           created_at?: string | null
  34:           email?: string | null
  35:           id?: string
  36:           metadata?: Json | null
  37:           name: string
  38:           status?: string | null
  39:           type: string
  40:           updated_at?: string | null
  41:         }
  42:         Update: {
  43:           auth_user_id?: string | null
  44:           avatar_url?: string | null
  45:           created_at?: string | null
  46:           email?: string | null
  47:           id?: string
  48:           metadata?: Json | null
  49:           name?: string
  50:           status?: string | null
  51:           type?: string
  52:           updated_at?: string | null
  53:         }
  54:         Relationships: []
  55:       }
  56:       activity_logs: {
  57:         Row: {
  58:           action: string
  59:           action_details: Json | null
  60:           actor_id: string
  61:           blueprint_id: string
  62:           branch_id: string | null
  63:           created_at: string | null
  64:           id: string
  65:           ip_address: unknown
  66:           resource_id: string | null
  67:           resource_type: string
  68:           user_agent: string | null
  69:         }
  70:         Insert: {
  71:           action: string
  72:           action_details?: Json | null
  73:           actor_id: string
  74:           blueprint_id: string
  75:           branch_id?: string | null
  76:           created_at?: string | null
  77:           id?: string
  78:           ip_address?: unknown
  79:           resource_id?: string | null
  80:           resource_type: string
  81:           user_agent?: string | null
  82:         }
  83:         Update: {
  84:           action?: string
  85:           action_details?: Json | null
  86:           actor_id?: string
  87:           blueprint_id?: string
  88:           branch_id?: string | null
  89:           created_at?: string | null
  90:           id?: string
  91:           ip_address?: unknown
  92:           resource_id?: string | null
  93:           resource_type?: string
  94:           user_agent?: string | null
  95:         }
  96:         Relationships: [
  97:           {
  98:             foreignKeyName: "activity_logs_actor_id_fkey"
  99:             columns: ["actor_id"]
 100:             isOneToOne: false
 101:             referencedRelation: "accounts"
 102:             referencedColumns: ["id"]
 103:           },
 104:           {
 105:             foreignKeyName: "activity_logs_blueprint_id_fkey"
 106:             columns: ["blueprint_id"]
 107:             isOneToOne: false
 108:             referencedRelation: "blueprints"
 109:             referencedColumns: ["id"]
 110:           },
 111:           {
 112:             foreignKeyName: "activity_logs_branch_id_fkey"
 113:             columns: ["branch_id"]
 114:             isOneToOne: false
 115:             referencedRelation: "blueprint_branches"
 116:             referencedColumns: ["id"]
 117:           },
 118:         ]
 119:       }
 120:       analytics_cache: {
 121:         Row: {
 122:           aggregation_level: string | null
 123:           blueprint_id: string | null
 124:           branch_id: string | null
 125:           cache_key: string
 126:           cache_type: string
 127:           data: Json
 128:           expires_at: string
 129:           generated_at: string | null
 130:           id: string
 131:         }
 132:         Insert: {
 133:           aggregation_level?: string | null
 134:           blueprint_id?: string | null
 135:           branch_id?: string | null
 136:           cache_key: string
 137:           cache_type: string
 138:           data: Json
 139:           expires_at: string
 140:           generated_at?: string | null
 141:           id?: string
 142:         }
 143:         Update: {
 144:           aggregation_level?: string | null
 145:           blueprint_id?: string | null
 146:           branch_id?: string | null
 147:           cache_key?: string
 148:           cache_type?: string
 149:           data?: Json
 150:           expires_at?: string
 151:           generated_at?: string | null
 152:           id?: string
 153:         }
 154:         Relationships: [
 155:           {
 156:             foreignKeyName: "analytics_cache_blueprint_id_fkey"
 157:             columns: ["blueprint_id"]
 158:             isOneToOne: false
 159:             referencedRelation: "blueprints"
 160:             referencedColumns: ["id"]
 161:           },
 162:           {
 163:             foreignKeyName: "analytics_cache_branch_id_fkey"
 164:             columns: ["branch_id"]
 165:             isOneToOne: false
 166:             referencedRelation: "blueprint_branches"
 167:             referencedColumns: ["id"]
 168:           },
 169:         ]
 170:       }
 171:       blueprint_branches: {
 172:         Row: {
 173:           blueprint_id: string
 174:           branch_name: string
 175:           branch_type: string | null
 176:           forked_at: string | null
 177:           id: string
 178:           last_sync_at: string | null
 179:           notes: string | null
 180:           organization_id: string
 181:           status: string | null
 182:         }
 183:         Insert: {
 184:           blueprint_id: string
 185:           branch_name: string
 186:           branch_type?: string | null
 187:           forked_at?: string | null
 188:           id?: string
 189:           last_sync_at?: string | null
 190:           notes?: string | null
 191:           organization_id: string
 192:           status?: string | null
 193:         }
 194:         Update: {
 195:           blueprint_id?: string
 196:           branch_name?: string
 197:           branch_type?: string | null
 198:           forked_at?: string | null
 199:           id?: string
 200:           last_sync_at?: string | null
 201:           notes?: string | null
 202:           organization_id?: string
 203:           status?: string | null
 204:         }
 205:         Relationships: [
 206:           {
 207:             foreignKeyName: "blueprint_branches_blueprint_id_fkey"
 208:             columns: ["blueprint_id"]
 209:             isOneToOne: false
 210:             referencedRelation: "blueprints"
 211:             referencedColumns: ["id"]
 212:           },
 213:           {
 214:             foreignKeyName: "blueprint_branches_organization_id_fkey"
 215:             columns: ["organization_id"]
 216:             isOneToOne: false
 217:             referencedRelation: "accounts"
 218:             referencedColumns: ["id"]
 219:           },
 220:         ]
 221:       }
 222:       blueprint_configs: {
 223:         Row: {
 224:           blueprint_id: string
 225:           config_key: string
 226:           config_value: Json
 227:           id: string
 228:           updated_at: string | null
 229:           updated_by: string | null
 230:         }
 231:         Insert: {
 232:           blueprint_id: string
 233:           config_key: string
 234:           config_value: Json
 235:           id?: string
 236:           updated_at?: string | null
 237:           updated_by?: string | null
 238:         }
 239:         Update: {
 240:           blueprint_id?: string
 241:           config_key?: string
 242:           config_value?: Json
 243:           id?: string
 244:           updated_at?: string | null
 245:           updated_by?: string | null
 246:         }
 247:         Relationships: [
 248:           {
 249:             foreignKeyName: "blueprint_configs_blueprint_id_fkey"
 250:             columns: ["blueprint_id"]
 251:             isOneToOne: false
 252:             referencedRelation: "blueprints"
 253:             referencedColumns: ["id"]
 254:           },
 255:           {
 256:             foreignKeyName: "blueprint_configs_updated_by_fkey"
 257:             columns: ["updated_by"]
 258:             isOneToOne: false
 259:             referencedRelation: "accounts"
 260:             referencedColumns: ["id"]
 261:           },
 262:         ]
 263:       }
 264:       blueprints: {
 265:         Row: {
 266:           budget: number | null
 267:           created_at: string | null
 268:           description: string | null
 269:           end_date: string | null
 270:           id: string
 271:           location: string | null
 272:           metadata: Json | null
 273:           name: string
 274:           owner_id: string
 275:           project_code: string | null
 276:           start_date: string | null
 277:           status: string | null
 278:           updated_at: string | null
 279:         }
 280:         Insert: {
 281:           budget?: number | null
 282:           created_at?: string | null
 283:           description?: string | null
 284:           end_date?: string | null
 285:           id?: string
 286:           location?: string | null
 287:           metadata?: Json | null
 288:           name: string
 289:           owner_id: string
 290:           project_code?: string | null
 291:           start_date?: string | null
 292:           status?: string | null
 293:           updated_at?: string | null
 294:         }
 295:         Update: {
 296:           budget?: number | null
 297:           created_at?: string | null
 298:           description?: string | null
 299:           end_date?: string | null
 300:           id?: string
 301:           location?: string | null
 302:           metadata?: Json | null
 303:           name?: string
 304:           owner_id?: string
 305:           project_code?: string | null
 306:           start_date?: string | null
 307:           status?: string | null
 308:           updated_at?: string | null
 309:         }
 310:         Relationships: [
 311:           {
 312:             foreignKeyName: "blueprints_owner_id_fkey"
 313:             columns: ["owner_id"]
 314:             isOneToOne: false
 315:             referencedRelation: "accounts"
 316:             referencedColumns: ["id"]
 317:           },
 318:         ]
 319:       }
 320:       bot_execution_logs: {
 321:         Row: {
 322:           bot_id: string
 323:           bot_task_id: string | null
 324:           error_logs: Json | null
 325:           executed_at: string | null
 326:           execution_details: Json | null
 327:           execution_duration_ms: number | null
 328:           execution_status: string
 329:           id: string
 330:           items_failed: number | null
 331:           items_processed: number | null
 332:         }
 333:         Insert: {
 334:           bot_id: string
 335:           bot_task_id?: string | null
 336:           error_logs?: Json | null
 337:           executed_at?: string | null
 338:           execution_details?: Json | null
 339:           execution_duration_ms?: number | null
 340:           execution_status: string
 341:           id?: string
 342:           items_failed?: number | null
 343:           items_processed?: number | null
 344:         }
 345:         Update: {
 346:           bot_id?: string
 347:           bot_task_id?: string | null
 348:           error_logs?: Json | null
 349:           executed_at?: string | null
 350:           execution_details?: Json | null
 351:           execution_duration_ms?: number | null
 352:           execution_status?: string
 353:           id?: string
 354:           items_failed?: number | null
 355:           items_processed?: number | null
 356:         }
 357:         Relationships: [
 358:           {
 359:             foreignKeyName: "bot_execution_logs_bot_id_fkey"
 360:             columns: ["bot_id"]
 361:             isOneToOne: false
 362:             referencedRelation: "bots"
 363:             referencedColumns: ["id"]
 364:           },
 365:           {
 366:             foreignKeyName: "bot_execution_logs_bot_task_id_fkey"
 367:             columns: ["bot_task_id"]
 368:             isOneToOne: false
 369:             referencedRelation: "bot_tasks"
 370:             referencedColumns: ["id"]
 371:           },
 372:         ]
 373:       }
 374:       bot_tasks: {
 375:         Row: {
 376:           bot_id: string
 377:           completed_at: string | null
 378:           created_at: string | null
 379:           error_message: string | null
 380:           id: string
 381:           max_retries: number | null
 382:           priority: number | null
 383:           retry_count: number | null
 384:           scheduled_at: string | null
 385:           started_at: string | null
 386:           status: string | null
 387:           task_config: Json
 388:           task_type: string
 389:         }
 390:         Insert: {
 391:           bot_id: string
 392:           completed_at?: string | null
 393:           created_at?: string | null
 394:           error_message?: string | null
 395:           id?: string
 396:           max_retries?: number | null
 397:           priority?: number | null
 398:           retry_count?: number | null
 399:           scheduled_at?: string | null
 400:           started_at?: string | null
 401:           status?: string | null
 402:           task_config: Json
 403:           task_type: string
 404:         }
 405:         Update: {
 406:           bot_id?: string
 407:           completed_at?: string | null
 408:           created_at?: string | null
 409:           error_message?: string | null
 410:           id?: string
 411:           max_retries?: number | null
 412:           priority?: number | null
 413:           retry_count?: number | null
 414:           scheduled_at?: string | null
 415:           started_at?: string | null
 416:           status?: string | null
 417:           task_config?: Json
 418:           task_type?: string
 419:         }
 420:         Relationships: [
 421:           {
 422:             foreignKeyName: "bot_tasks_bot_id_fkey"
 423:             columns: ["bot_id"]
 424:             isOneToOne: false
 425:             referencedRelation: "bots"
 426:             referencedColumns: ["id"]
 427:           },
 428:         ]
 429:       }
 430:       bots: {
 431:         Row: {
 432:           account_id: string
 433:           bot_type: string
 434:           config: Json
 435:           created_at: string | null
 436:           created_by: string
 437:           description: string | null
 438:           id: string
 439:           is_enabled: boolean | null
 440:           name: string
 441:           updated_at: string | null
 442:         }
 443:         Insert: {
 444:           account_id: string
 445:           bot_type: string
 446:           config: Json
 447:           created_at?: string | null
 448:           created_by: string
 449:           description?: string | null
 450:           id?: string
 451:           is_enabled?: boolean | null
 452:           name: string
 453:           updated_at?: string | null
 454:         }
 455:         Update: {
 456:           account_id?: string
 457:           bot_type?: string
 458:           config?: Json
 459:           created_at?: string | null
 460:           created_by?: string
 461:           description?: string | null
 462:           id?: string
 463:           is_enabled?: boolean | null
 464:           name?: string
 465:           updated_at?: string | null
 466:         }
 467:         Relationships: [
 468:           {
 469:             foreignKeyName: "bots_account_id_fkey"
 470:             columns: ["account_id"]
 471:             isOneToOne: false
 472:             referencedRelation: "accounts"
 473:             referencedColumns: ["id"]
 474:           },
 475:           {
 476:             foreignKeyName: "bots_created_by_fkey"
 477:             columns: ["created_by"]
 478:             isOneToOne: false
 479:             referencedRelation: "accounts"
 480:             referencedColumns: ["id"]
 481:           },
 482:         ]
 483:       }
 484:       branch_forks: {
 485:         Row: {
 486:           blueprint_id: string
 487:           branch_id: string
 488:           fork_reason: string | null
 489:           forked_at: string | null
 490:           forked_by: string
 491:           forked_from_task_id: string | null
 492:           id: string
 493:         }
 494:         Insert: {
 495:           blueprint_id: string
 496:           branch_id: string
 497:           fork_reason?: string | null
 498:           forked_at?: string | null
 499:           forked_by: string
 500:           forked_from_task_id?: string | null
 501:           id?: string
 502:         }
 503:         Update: {
 504:           blueprint_id?: string
 505:           branch_id?: string
 506:           fork_reason?: string | null
 507:           forked_at?: string | null
 508:           forked_by?: string
 509:           forked_from_task_id?: string | null
 510:           id?: string
 511:         }
 512:         Relationships: [
 513:           {
 514:             foreignKeyName: "branch_forks_blueprint_id_fkey"
 515:             columns: ["blueprint_id"]
 516:             isOneToOne: false
 517:             referencedRelation: "blueprints"
 518:             referencedColumns: ["id"]
 519:           },
 520:           {
 521:             foreignKeyName: "branch_forks_branch_id_fkey"
 522:             columns: ["branch_id"]
 523:             isOneToOne: false
 524:             referencedRelation: "blueprint_branches"
 525:             referencedColumns: ["id"]
 526:           },
 527:           {
 528:             foreignKeyName: "branch_forks_forked_by_fkey"
 529:             columns: ["forked_by"]
 530:             isOneToOne: false
 531:             referencedRelation: "accounts"
 532:             referencedColumns: ["id"]
 533:           },
 534:           {
 535:             foreignKeyName: "branch_forks_forked_from_task_id_fkey"
 536:             columns: ["forked_from_task_id"]
 537:             isOneToOne: false
 538:             referencedRelation: "tasks"
 539:             referencedColumns: ["id"]
 540:           },
 541:         ]
 542:       }
 543:       branch_permissions: {
 544:         Row: {
 545:           account_id: string
 546:           branch_id: string
 547:           granted_at: string | null
 548:           granted_by: string
 549:           id: string
 550:           permission_level: string
 551:         }
 552:         Insert: {
 553:           account_id: string
 554:           branch_id: string
 555:           granted_at?: string | null
 556:           granted_by: string
 557:           id?: string
 558:           permission_level: string
 559:         }
 560:         Update: {
 561:           account_id?: string
 562:           branch_id?: string
 563:           granted_at?: string | null
 564:           granted_by?: string
 565:           id?: string
 566:           permission_level?: string
 567:         }
 568:         Relationships: [
 569:           {
 570:             foreignKeyName: "branch_permissions_account_id_fkey"
 571:             columns: ["account_id"]
 572:             isOneToOne: false
 573:             referencedRelation: "accounts"
 574:             referencedColumns: ["id"]
 575:           },
 576:           {
 577:             foreignKeyName: "branch_permissions_branch_id_fkey"
 578:             columns: ["branch_id"]
 579:             isOneToOne: false
 580:             referencedRelation: "blueprint_branches"
 581:             referencedColumns: ["id"]
 582:           },
 583:           {
 584:             foreignKeyName: "branch_permissions_granted_by_fkey"
 585:             columns: ["granted_by"]
 586:             isOneToOne: false
 587:             referencedRelation: "accounts"
 588:             referencedColumns: ["id"]
 589:           },
 590:         ]
 591:       }
 592:       collaboration_invitations: {
 593:         Row: {
 594:           blueprint_id: string
 595:           created_at: string | null
 596:           expires_at: string
 597:           from_org_id: string
 598:           id: string
 599:           invitation_message: string | null
 600:           responded_at: string | null
 601:           status: string | null
 602:           to_org_id: string
 603:         }
 604:         Insert: {
 605:           blueprint_id: string
 606:           created_at?: string | null
 607:           expires_at: string
 608:           from_org_id: string
 609:           id?: string
 610:           invitation_message?: string | null
 611:           responded_at?: string | null
 612:           status?: string | null
 613:           to_org_id: string
 614:         }
 615:         Update: {
 616:           blueprint_id?: string
 617:           created_at?: string | null
 618:           expires_at?: string
 619:           from_org_id?: string
 620:           id?: string
 621:           invitation_message?: string | null
 622:           responded_at?: string | null
 623:           status?: string | null
 624:           to_org_id?: string
 625:         }
 626:         Relationships: [
 627:           {
 628:             foreignKeyName: "collaboration_invitations_blueprint_id_fkey"
 629:             columns: ["blueprint_id"]
 630:             isOneToOne: false
 631:             referencedRelation: "blueprints"
 632:             referencedColumns: ["id"]
 633:           },
 634:           {
 635:             foreignKeyName: "collaboration_invitations_from_org_id_fkey"
 636:             columns: ["from_org_id"]
 637:             isOneToOne: false
 638:             referencedRelation: "accounts"
 639:             referencedColumns: ["id"]
 640:           },
 641:           {
 642:             foreignKeyName: "collaboration_invitations_to_org_id_fkey"
 643:             columns: ["to_org_id"]
 644:             isOneToOne: false
 645:             referencedRelation: "accounts"
 646:             referencedColumns: ["id"]
 647:           },
 648:         ]
 649:       }
 650:       collaboration_members: {
 651:         Row: {
 652:           account_id: string
 653:           collaboration_id: string
 654:           id: string
 655:           joined_at: string | null
 656:           permissions: Json | null
 657:           role: string | null
 658:         }
 659:         Insert: {
 660:           account_id: string
 661:           collaboration_id: string
 662:           id?: string
 663:           joined_at?: string | null
 664:           permissions?: Json | null
 665:           role?: string | null
 666:         }
 667:         Update: {
 668:           account_id?: string
 669:           collaboration_id?: string
 670:           id?: string
 671:           joined_at?: string | null
 672:           permissions?: Json | null
 673:           role?: string | null
 674:         }
 675:         Relationships: [
 676:           {
 677:             foreignKeyName: "collaboration_members_account_id_fkey"
 678:             columns: ["account_id"]
 679:             isOneToOne: false
 680:             referencedRelation: "accounts"
 681:             referencedColumns: ["id"]
 682:           },
 683:           {
 684:             foreignKeyName: "collaboration_members_collaboration_id_fkey"
 685:             columns: ["collaboration_id"]
 686:             isOneToOne: false
 687:             referencedRelation: "organization_collaborations"
 688:             referencedColumns: ["id"]
 689:           },
 690:         ]
 691:       }
 692:       comments: {
 693:         Row: {
 694:           attachments: Json | null
 695:           author_id: string
 696:           commentable_id: string
 697:           commentable_type: string
 698:           content: string
 699:           created_at: string | null
 700:           edited_at: string | null
 701:           id: string
 702:           is_edited: boolean | null
 703:           mentions: Json | null
 704:           parent_comment_id: string | null
 705:         }
 706:         Insert: {
 707:           attachments?: Json | null
 708:           author_id: string
 709:           commentable_id: string
 710:           commentable_type: string
 711:           content: string
 712:           created_at?: string | null
 713:           edited_at?: string | null
 714:           id?: string
 715:           is_edited?: boolean | null
 716:           mentions?: Json | null
 717:           parent_comment_id?: string | null
 718:         }
 719:         Update: {
 720:           attachments?: Json | null
 721:           author_id?: string
 722:           commentable_id?: string
 723:           commentable_type?: string
 724:           content?: string
 725:           created_at?: string | null
 726:           edited_at?: string | null
 727:           id?: string
 728:           is_edited?: boolean | null
 729:           mentions?: Json | null
 730:           parent_comment_id?: string | null
 731:         }
 732:         Relationships: [
 733:           {
 734:             foreignKeyName: "comments_author_id_fkey"
 735:             columns: ["author_id"]
 736:             isOneToOne: false
 737:             referencedRelation: "accounts"
 738:             referencedColumns: ["id"]
 739:           },
 740:           {
 741:             foreignKeyName: "comments_parent_comment_id_fkey"
 742:             columns: ["parent_comment_id"]
 743:             isOneToOne: false
 744:             referencedRelation: "comments"
 745:             referencedColumns: ["id"]
 746:           },
 747:         ]
 748:       }
 749:       daily_reports: {
 750:         Row: {
 751:           blueprint_id: string
 752:           branch_id: string | null
 753:           created_at: string | null
 754:           equipment_used: string | null
 755:           id: string
 756:           issues_encountered: string | null
 757:           materials_used: string | null
 758:           progress_notes: string | null
 759:           report_date: string
 760:           reported_by: string
 761:           task_id: string
 762:           updated_at: string | null
 763:           weather_info: Json | null
 764:           work_description: string
 765:           worker_count: number | null
 766:         }
 767:         Insert: {
 768:           blueprint_id: string
 769:           branch_id?: string | null
 770:           created_at?: string | null
 771:           equipment_used?: string | null
 772:           id?: string
 773:           issues_encountered?: string | null
 774:           materials_used?: string | null
 775:           progress_notes?: string | null
 776:           report_date: string
 777:           reported_by: string
 778:           task_id: string
 779:           updated_at?: string | null
 780:           weather_info?: Json | null
 781:           work_description: string
 782:           worker_count?: number | null
 783:         }
 784:         Update: {
 785:           blueprint_id?: string
 786:           branch_id?: string | null
 787:           created_at?: string | null
 788:           equipment_used?: string | null
 789:           id?: string
 790:           issues_encountered?: string | null
 791:           materials_used?: string | null
 792:           progress_notes?: string | null
 793:           report_date?: string
 794:           reported_by?: string
 795:           task_id?: string
 796:           updated_at?: string | null
 797:           weather_info?: Json | null
 798:           work_description?: string
 799:           worker_count?: number | null
 800:         }
 801:         Relationships: [
 802:           {
 803:             foreignKeyName: "daily_reports_blueprint_id_fkey"
 804:             columns: ["blueprint_id"]
 805:             isOneToOne: false
 806:             referencedRelation: "blueprints"
 807:             referencedColumns: ["id"]
 808:           },
 809:           {
 810:             foreignKeyName: "daily_reports_branch_id_fkey"
 811:             columns: ["branch_id"]
 812:             isOneToOne: false
 813:             referencedRelation: "blueprint_branches"
 814:             referencedColumns: ["id"]
 815:           },
 816:           {
 817:             foreignKeyName: "daily_reports_reported_by_fkey"
 818:             columns: ["reported_by"]
 819:             isOneToOne: false
 820:             referencedRelation: "accounts"
 821:             referencedColumns: ["id"]
 822:           },
 823:           {
 824:             foreignKeyName: "daily_reports_task_id_fkey"
 825:             columns: ["task_id"]
 826:             isOneToOne: false
 827:             referencedRelation: "tasks"
 828:             referencedColumns: ["id"]
 829:           },
 830:         ]
 831:       }
 832:       document_thumbnails: {
 833:         Row: {
 834:           document_id: string
 835:           file_size: number
 836:           generated_at: string | null
 837:           height: number
 838:           id: string
 839:           storage_path: string
 840:           thumbnail_size: string
 841:           width: number
 842:         }
 843:         Insert: {
 844:           document_id: string
 845:           file_size: number
 846:           generated_at?: string | null
 847:           height: number
 848:           id?: string
 849:           storage_path: string
 850:           thumbnail_size: string
 851:           width: number
 852:         }
 853:         Update: {
 854:           document_id?: string
 855:           file_size?: number
 856:           generated_at?: string | null
 857:           height?: number
 858:           id?: string
 859:           storage_path?: string
 860:           thumbnail_size?: string
 861:           width?: number
 862:         }
 863:         Relationships: [
 864:           {
 865:             foreignKeyName: "document_thumbnails_document_id_fkey"
 866:             columns: ["document_id"]
 867:             isOneToOne: false
 868:             referencedRelation: "documents"
 869:             referencedColumns: ["id"]
 870:           },
 871:         ]
 872:       }
 873:       document_versions: {
 874:         Row: {
 875:           change_description: string | null
 876:           checksum: string | null
 877:           created_at: string | null
 878:           created_by: string
 879:           document_id: string
 880:           file_name: string
 881:           file_size: number
 882:           id: string
 883:           storage_path: string
 884:           version_number: number
 885:         }
 886:         Insert: {
 887:           change_description?: string | null
 888:           checksum?: string | null
 889:           created_at?: string | null
 890:           created_by: string
 891:           document_id: string
 892:           file_name: string
 893:           file_size: number
 894:           id?: string
 895:           storage_path: string
 896:           version_number: number
 897:         }
 898:         Update: {
 899:           change_description?: string | null
 900:           checksum?: string | null
 901:           created_at?: string | null
 902:           created_by?: string
 903:           document_id?: string
 904:           file_name?: string
 905:           file_size?: number
 906:           id?: string
 907:           storage_path?: string
 908:           version_number?: number
 909:         }
 910:         Relationships: [
 911:           {
 912:             foreignKeyName: "document_versions_created_by_fkey"
 913:             columns: ["created_by"]
 914:             isOneToOne: false
 915:             referencedRelation: "accounts"
 916:             referencedColumns: ["id"]
 917:           },
 918:           {
 919:             foreignKeyName: "document_versions_document_id_fkey"
 920:             columns: ["document_id"]
 921:             isOneToOne: false
 922:             referencedRelation: "documents"
 923:             referencedColumns: ["id"]
 924:           },
 925:         ]
 926:       }
 927:       documents: {
 928:         Row: {
 929:           checksum: string | null
 930:           file_name: string
 931:           file_size: number
 932:           file_type: string
 933:           id: string
 934:           is_public: boolean | null
 935:           metadata: Json | null
 936:           mime_type: string
 937:           permanent_delete_at: string | null
 938:           soft_deleted_at: string | null
 939:           storage_bucket: string | null
 940:           storage_path: string
 941:           upload_source: string | null
 942:           uploaded_at: string | null
 943:           uploader_id: string
 944:         }
 945:         Insert: {
 946:           checksum?: string | null
 947:           file_name: string
 948:           file_size: number
 949:           file_type: string
 950:           id?: string
 951:           is_public?: boolean | null
 952:           metadata?: Json | null
 953:           mime_type: string
 954:           permanent_delete_at?: string | null
 955:           soft_deleted_at?: string | null
 956:           storage_bucket?: string | null
 957:           storage_path: string
 958:           upload_source?: string | null
 959:           uploaded_at?: string | null
 960:           uploader_id: string
 961:         }
 962:         Update: {
 963:           checksum?: string | null
 964:           file_name?: string
 965:           file_size?: number
 966:           file_type?: string
 967:           id?: string
 968:           is_public?: boolean | null
 969:           metadata?: Json | null
 970:           mime_type?: string
 971:           permanent_delete_at?: string | null
 972:           soft_deleted_at?: string | null
 973:           storage_bucket?: string | null
 974:           storage_path?: string
 975:           upload_source?: string | null
 976:           uploaded_at?: string | null
 977:           uploader_id?: string
 978:         }
 979:         Relationships: [
 980:           {
 981:             foreignKeyName: "documents_uploader_id_fkey"
 982:             columns: ["uploader_id"]
 983:             isOneToOne: false
 984:             referencedRelation: "accounts"
 985:             referencedColumns: ["id"]
 986:           },
 987:         ]
 988:       }
 989:       feature_flags: {
 990:         Row: {
 991:           created_at: string | null
 992:           created_by: string | null
 993:           description: string | null
 994:           end_date: string | null
 995:           flag_key: string
 996:           flag_name: string
 997:           id: string
 998:           is_enabled: boolean | null
 999:           rollout_percentage: number | null
1000:           start_date: string | null
1001:           target_accounts: Json | null
1002:           target_organizations: Json | null
1003:           updated_at: string | null
1004:         }
1005:         Insert: {
1006:           created_at?: string | null
1007:           created_by?: string | null
1008:           description?: string | null
1009:           end_date?: string | null
1010:           flag_key: string
1011:           flag_name: string
1012:           id?: string
1013:           is_enabled?: boolean | null
1014:           rollout_percentage?: number | null
1015:           start_date?: string | null
1016:           target_accounts?: Json | null
1017:           target_organizations?: Json | null
1018:           updated_at?: string | null
1019:         }
1020:         Update: {
1021:           created_at?: string | null
1022:           created_by?: string | null
1023:           description?: string | null
1024:           end_date?: string | null
1025:           flag_key?: string
1026:           flag_name?: string
1027:           id?: string
1028:           is_enabled?: boolean | null
1029:           rollout_percentage?: number | null
1030:           start_date?: string | null
1031:           target_accounts?: Json | null
1032:           target_organizations?: Json | null
1033:           updated_at?: string | null
1034:         }
1035:         Relationships: [
1036:           {
1037:             foreignKeyName: "feature_flags_created_by_fkey"
1038:             columns: ["created_by"]
1039:             isOneToOne: false
1040:             referencedRelation: "accounts"
1041:             referencedColumns: ["id"]
1042:           },
1043:         ]
1044:       }
1045:       inspection_photos: {
1046:         Row: {
1047:           caption: string | null
1048:           document_id: string
1049:           id: string
1050:           inspection_id: string
1051:           photo_type: string | null
1052:           sequence_order: number | null
1053:           uploaded_at: string | null
1054:           uploaded_by: string
1055:         }
1056:         Insert: {
1057:           caption?: string | null
1058:           document_id: string
1059:           id?: string
1060:           inspection_id: string
1061:           photo_type?: string | null
1062:           sequence_order?: number | null
1063:           uploaded_at?: string | null
1064:           uploaded_by: string
1065:         }
1066:         Update: {
1067:           caption?: string | null
1068:           document_id?: string
1069:           id?: string
1070:           inspection_id?: string
1071:           photo_type?: string | null
1072:           sequence_order?: number | null
1073:           uploaded_at?: string | null
1074:           uploaded_by?: string
1075:         }
1076:         Relationships: [
1077:           {
1078:             foreignKeyName: "inspection_photos_document_id_fkey"
1079:             columns: ["document_id"]
1080:             isOneToOne: false
1081:             referencedRelation: "documents"
1082:             referencedColumns: ["id"]
1083:           },
1084:           {
1085:             foreignKeyName: "inspection_photos_inspection_id_fkey"
1086:             columns: ["inspection_id"]
1087:             isOneToOne: false
1088:             referencedRelation: "inspections"
1089:             referencedColumns: ["id"]
1090:           },
1091:           {
1092:             foreignKeyName: "inspection_photos_uploaded_by_fkey"
1093:             columns: ["uploaded_by"]
1094:             isOneToOne: false
1095:             referencedRelation: "accounts"
1096:             referencedColumns: ["id"]
1097:           },
1098:         ]
1099:       }
1100:       inspections: {
1101:         Row: {
1102:           acceptance_criteria: string | null
1103:           completed_at: string | null
1104:           corrective_actions: string | null
1105:           defects_found: Json | null
1106:           findings: string | null
1107:           id: string
1108:           inspected_at: string | null
1109:           inspection_items: Json
1110:           inspection_type: string | null
1111:           inspector_id: string
1112:           qc_id: string | null
1113:           responsibility_transferred: boolean | null
1114:           status: string | null
1115:           task_id: string
1116:           transfer_date: string | null
1117:         }
1118:         Insert: {
1119:           acceptance_criteria?: string | null
1120:           completed_at?: string | null
1121:           corrective_actions?: string | null
1122:           defects_found?: Json | null
1123:           findings?: string | null
1124:           id?: string
1125:           inspected_at?: string | null
1126:           inspection_items: Json
1127:           inspection_type?: string | null
1128:           inspector_id: string
1129:           qc_id?: string | null
1130:           responsibility_transferred?: boolean | null
1131:           status?: string | null
1132:           task_id: string
1133:           transfer_date?: string | null
1134:         }
1135:         Update: {
1136:           acceptance_criteria?: string | null
1137:           completed_at?: string | null
1138:           corrective_actions?: string | null
1139:           defects_found?: Json | null
1140:           findings?: string | null
1141:           id?: string
1142:           inspected_at?: string | null
1143:           inspection_items?: Json
1144:           inspection_type?: string | null
1145:           inspector_id?: string
1146:           qc_id?: string | null
1147:           responsibility_transferred?: boolean | null
1148:           status?: string | null
1149:           task_id?: string
1150:           transfer_date?: string | null
1151:         }
1152:         Relationships: [
1153:           {
1154:             foreignKeyName: "inspections_inspector_id_fkey"
1155:             columns: ["inspector_id"]
1156:             isOneToOne: false
1157:             referencedRelation: "accounts"
1158:             referencedColumns: ["id"]
1159:           },
1160:           {
1161:             foreignKeyName: "inspections_qc_id_fkey"
1162:             columns: ["qc_id"]
1163:             isOneToOne: false
1164:             referencedRelation: "quality_checks"
1165:             referencedColumns: ["id"]
1166:           },
1167:           {
1168:             foreignKeyName: "inspections_task_id_fkey"
1169:             columns: ["task_id"]
1170:             isOneToOne: false
1171:             referencedRelation: "tasks"
1172:             referencedColumns: ["id"]
1173:           },
1174:         ]
1175:       }
1176:       issue_assignments: {
1177:         Row: {
1178:           assigned_at: string | null
1179:           assigned_by: string
1180:           assignee_id: string
1181:           assignment_note: string | null
1182:           id: string
1183:           issue_id: string
1184:         }
1185:         Insert: {
1186:           assigned_at?: string | null
1187:           assigned_by: string
1188:           assignee_id: string
1189:           assignment_note?: string | null
1190:           id?: string
1191:           issue_id: string
1192:         }
1193:         Update: {
1194:           assigned_at?: string | null
1195:           assigned_by?: string
1196:           assignee_id?: string
1197:           assignment_note?: string | null
1198:           id?: string
1199:           issue_id?: string
1200:         }
1201:         Relationships: [
1202:           {
1203:             foreignKeyName: "issue_assignments_assigned_by_fkey"
1204:             columns: ["assigned_by"]
1205:             isOneToOne: false
1206:             referencedRelation: "accounts"
1207:             referencedColumns: ["id"]
1208:           },
1209:           {
1210:             foreignKeyName: "issue_assignments_assignee_id_fkey"
1211:             columns: ["assignee_id"]
1212:             isOneToOne: false
1213:             referencedRelation: "accounts"
1214:             referencedColumns: ["id"]
1215:           },
1216:           {
1217:             foreignKeyName: "issue_assignments_issue_id_fkey"
1218:             columns: ["issue_id"]
1219:             isOneToOne: false
1220:             referencedRelation: "issues"
1221:             referencedColumns: ["id"]
1222:           },
1223:         ]
1224:       }
1225:       issue_photos: {
1226:         Row: {
1227:           caption: string | null
1228:           document_id: string
1229:           id: string
1230:           issue_id: string
1231:           photo_type: string | null
1232:           sequence_order: number | null
1233:           uploaded_at: string | null
1234:           uploaded_by: string
1235:         }
1236:         Insert: {
1237:           caption?: string | null
1238:           document_id: string
1239:           id?: string
1240:           issue_id: string
1241:           photo_type?: string | null
1242:           sequence_order?: number | null
1243:           uploaded_at?: string | null
1244:           uploaded_by: string
1245:         }
1246:         Update: {
1247:           caption?: string | null
1248:           document_id?: string
1249:           id?: string
1250:           issue_id?: string
1251:           photo_type?: string | null
1252:           sequence_order?: number | null
1253:           uploaded_at?: string | null
1254:           uploaded_by?: string
1255:         }
1256:         Relationships: [
1257:           {
1258:             foreignKeyName: "issue_photos_document_id_fkey"
1259:             columns: ["document_id"]
1260:             isOneToOne: false
1261:             referencedRelation: "documents"
1262:             referencedColumns: ["id"]
1263:           },
1264:           {
1265:             foreignKeyName: "issue_photos_issue_id_fkey"
1266:             columns: ["issue_id"]
1267:             isOneToOne: false
1268:             referencedRelation: "issues"
1269:             referencedColumns: ["id"]
1270:           },
1271:           {
1272:             foreignKeyName: "issue_photos_uploaded_by_fkey"
1273:             columns: ["uploaded_by"]
1274:             isOneToOne: false
1275:             referencedRelation: "accounts"
1276:             referencedColumns: ["id"]
1277:           },
1278:         ]
1279:       }
1280:       issue_sync_logs: {
1281:         Row: {
1282:           id: string
1283:           issue_id: string
1284:           source_branch_id: string | null
1285:           sync_data: Json | null
1286:           sync_type: string | null
1287:           synced_at: string | null
1288:           synced_by: string | null
1289:           target_blueprint_id: string
1290:         }
1291:         Insert: {
1292:           id?: string
1293:           issue_id: string
1294:           source_branch_id?: string | null
1295:           sync_data?: Json | null
1296:           sync_type?: string | null
1297:           synced_at?: string | null
1298:           synced_by?: string | null
1299:           target_blueprint_id: string
1300:         }
1301:         Update: {
1302:           id?: string
1303:           issue_id?: string
1304:           source_branch_id?: string | null
1305:           sync_data?: Json | null
1306:           sync_type?: string | null
1307:           synced_at?: string | null
1308:           synced_by?: string | null
1309:           target_blueprint_id?: string
1310:         }
1311:         Relationships: [
1312:           {
1313:             foreignKeyName: "issue_sync_logs_issue_id_fkey"
1314:             columns: ["issue_id"]
1315:             isOneToOne: false
1316:             referencedRelation: "issues"
1317:             referencedColumns: ["id"]
1318:           },
1319:           {
1320:             foreignKeyName: "issue_sync_logs_source_branch_id_fkey"
1321:             columns: ["source_branch_id"]
1322:             isOneToOne: false
1323:             referencedRelation: "blueprint_branches"
1324:             referencedColumns: ["id"]
1325:           },
1326:           {
1327:             foreignKeyName: "issue_sync_logs_synced_by_fkey"
1328:             columns: ["synced_by"]
1329:             isOneToOne: false
1330:             referencedRelation: "accounts"
1331:             referencedColumns: ["id"]
1332:           },
1333:           {
1334:             foreignKeyName: "issue_sync_logs_target_blueprint_id_fkey"
1335:             columns: ["target_blueprint_id"]
1336:             isOneToOne: false
1337:             referencedRelation: "blueprints"
1338:             referencedColumns: ["id"]
1339:           },
1340:         ]
1341:       }
1342:       issues: {
1343:         Row: {
1344:           blueprint_id: string
1345:           branch_id: string | null
1346:           closed_at: string | null
1347:           description: string
1348:           id: string
1349:           issue_type: string | null
1350:           priority: string | null
1351:           reported_at: string | null
1352:           reported_by: string
1353:           resolution_note: string | null
1354:           resolved_at: string | null
1355:           severity: string | null
1356:           status: string | null
1357:           synced_to_main: boolean | null
1358:           task_id: string | null
1359:           title: string
1360:         }
1361:         Insert: {
1362:           blueprint_id: string
1363:           branch_id?: string | null
1364:           closed_at?: string | null
1365:           description: string
1366:           id?: string
1367:           issue_type?: string | null
1368:           priority?: string | null
1369:           reported_at?: string | null
1370:           reported_by: string
1371:           resolution_note?: string | null
1372:           resolved_at?: string | null
1373:           severity?: string | null
1374:           status?: string | null
1375:           synced_to_main?: boolean | null
1376:           task_id?: string | null
1377:           title: string
1378:         }
1379:         Update: {
1380:           blueprint_id?: string
1381:           branch_id?: string | null
1382:           closed_at?: string | null
1383:           description?: string
1384:           id?: string
1385:           issue_type?: string | null
1386:           priority?: string | null
1387:           reported_at?: string | null
1388:           reported_by?: string
1389:           resolution_note?: string | null
1390:           resolved_at?: string | null
1391:           severity?: string | null
1392:           status?: string | null
1393:           synced_to_main?: boolean | null
1394:           task_id?: string | null
1395:           title?: string
1396:         }
1397:         Relationships: [
1398:           {
1399:             foreignKeyName: "issues_blueprint_id_fkey"
1400:             columns: ["blueprint_id"]
1401:             isOneToOne: false
1402:             referencedRelation: "blueprints"
1403:             referencedColumns: ["id"]
1404:           },
1405:           {
1406:             foreignKeyName: "issues_branch_id_fkey"
1407:             columns: ["branch_id"]
1408:             isOneToOne: false
1409:             referencedRelation: "blueprint_branches"
1410:             referencedColumns: ["id"]
1411:           },
1412:           {
1413:             foreignKeyName: "issues_reported_by_fkey"
1414:             columns: ["reported_by"]
1415:             isOneToOne: false
1416:             referencedRelation: "accounts"
1417:             referencedColumns: ["id"]
1418:           },
1419:           {
1420:             foreignKeyName: "issues_task_id_fkey"
1421:             columns: ["task_id"]
1422:             isOneToOne: false
1423:             referencedRelation: "tasks"
1424:             referencedColumns: ["id"]
1425:           },
1426:         ]
1427:       }
1428:       notification_rules: {
1429:         Row: {
1430:           account_id: string
1431:           channel: string
1432:           created_at: string | null
1433:           frequency: string | null
1434:           id: string
1435:           is_enabled: boolean | null
1436:           notification_type: string
1437:           quiet_hours_end: string | null
1438:           quiet_hours_start: string | null
1439:           updated_at: string | null
1440:         }
1441:         Insert: {
1442:           account_id: string
1443:           channel: string
1444:           created_at?: string | null
1445:           frequency?: string | null
1446:           id?: string
1447:           is_enabled?: boolean | null
1448:           notification_type: string
1449:           quiet_hours_end?: string | null
1450:           quiet_hours_start?: string | null
1451:           updated_at?: string | null
1452:         }
1453:         Update: {
1454:           account_id?: string
1455:           channel?: string
1456:           created_at?: string | null
1457:           frequency?: string | null
1458:           id?: string
1459:           is_enabled?: boolean | null
1460:           notification_type?: string
1461:           quiet_hours_end?: string | null
1462:           quiet_hours_start?: string | null
1463:           updated_at?: string | null
1464:         }
1465:         Relationships: [
1466:           {
1467:             foreignKeyName: "notification_rules_account_id_fkey"
1468:             columns: ["account_id"]
1469:             isOneToOne: false
1470:             referencedRelation: "accounts"
1471:             referencedColumns: ["id"]
1472:           },
1473:         ]
1474:       }
1475:       notification_subscriptions: {
1476:         Row: {
1477:           account_id: string
1478:           id: string
1479:           subscribable_id: string
1480:           subscribable_type: string
1481:           subscribed_at: string | null
1482:           subscription_level: string | null
1483:         }
1484:         Insert: {
1485:           account_id: string
1486:           id?: string
1487:           subscribable_id: string
1488:           subscribable_type: string
1489:           subscribed_at?: string | null
1490:           subscription_level?: string | null
1491:         }
1492:         Update: {
1493:           account_id?: string
1494:           id?: string
1495:           subscribable_id?: string
1496:           subscribable_type?: string
1497:           subscribed_at?: string | null
1498:           subscription_level?: string | null
1499:         }
1500:         Relationships: [
1501:           {
1502:             foreignKeyName: "notification_subscriptions_account_id_fkey"
1503:             columns: ["account_id"]
1504:             isOneToOne: false
1505:             referencedRelation: "accounts"
1506:             referencedColumns: ["id"]
1507:           },
1508:         ]
1509:       }
1510:       notifications: {
1511:         Row: {
1512:           action_url: string | null
1513:           content: string | null
1514:           created_at: string | null
1515:           id: string
1516:           is_read: boolean | null
1517:           notification_type: string
1518:           priority: string | null
1519:           read_at: string | null
1520:           recipient_id: string
1521:           related_id: string | null
1522:           related_type: string | null
1523:           sender_id: string | null
1524:           title: string
1525:         }
1526:         Insert: {
1527:           action_url?: string | null
1528:           content?: string | null
1529:           created_at?: string | null
1530:           id?: string
1531:           is_read?: boolean | null
1532:           notification_type: string
1533:           priority?: string | null
1534:           read_at?: string | null
1535:           recipient_id: string
1536:           related_id?: string | null
1537:           related_type?: string | null
1538:           sender_id?: string | null
1539:           title: string
1540:         }
1541:         Update: {
1542:           action_url?: string | null
1543:           content?: string | null
1544:           created_at?: string | null
1545:           id?: string
1546:           is_read?: boolean | null
1547:           notification_type?: string
1548:           priority?: string | null
1549:           read_at?: string | null
1550:           recipient_id?: string
1551:           related_id?: string | null
1552:           related_type?: string | null
1553:           sender_id?: string | null
1554:           title?: string
1555:         }
1556:         Relationships: [
1557:           {
1558:             foreignKeyName: "notifications_recipient_id_fkey"
1559:             columns: ["recipient_id"]
1560:             isOneToOne: false
1561:             referencedRelation: "accounts"
1562:             referencedColumns: ["id"]
1563:           },
1564:           {
1565:             foreignKeyName: "notifications_sender_id_fkey"
1566:             columns: ["sender_id"]
1567:             isOneToOne: false
1568:             referencedRelation: "accounts"
1569:             referencedColumns: ["id"]
1570:           },
1571:         ]
1572:       }
1573:       organization_collaborations: {
1574:         Row: {
1575:           blueprint_id: string
1576:           collaboration_type: string | null
1577:           collaborator_org_id: string
1578:           contract_end_date: string | null
1579:           contract_start_date: string | null
1580:           created_at: string | null
1581:           id: string
1582:           notes: string | null
1583:           owner_org_id: string
1584:           status: string | null
1585:           updated_at: string | null
1586:         }
1587:         Insert: {
1588:           blueprint_id: string
1589:           collaboration_type?: string | null
1590:           collaborator_org_id: string
1591:           contract_end_date?: string | null
1592:           contract_start_date?: string | null
1593:           created_at?: string | null
1594:           id?: string
1595:           notes?: string | null
1596:           owner_org_id: string
1597:           status?: string | null
1598:           updated_at?: string | null
1599:         }
1600:         Update: {
1601:           blueprint_id?: string
1602:           collaboration_type?: string | null
1603:           collaborator_org_id?: string
1604:           contract_end_date?: string | null
1605:           contract_start_date?: string | null
1606:           created_at?: string | null
1607:           id?: string
1608:           notes?: string | null
1609:           owner_org_id?: string
1610:           status?: string | null
1611:           updated_at?: string | null
1612:         }
1613:         Relationships: [
1614:           {
1615:             foreignKeyName: "organization_collaborations_blueprint_id_fkey"
1616:             columns: ["blueprint_id"]
1617:             isOneToOne: false
1618:             referencedRelation: "blueprints"
1619:             referencedColumns: ["id"]
1620:           },
1621:           {
1622:             foreignKeyName: "organization_collaborations_collaborator_org_id_fkey"
1623:             columns: ["collaborator_org_id"]
1624:             isOneToOne: false
1625:             referencedRelation: "accounts"
1626:             referencedColumns: ["id"]
1627:           },
1628:           {
1629:             foreignKeyName: "organization_collaborations_owner_org_id_fkey"
1630:             columns: ["owner_org_id"]
1631:             isOneToOne: false
1632:             referencedRelation: "accounts"
1633:             referencedColumns: ["id"]
1634:           },
1635:         ]
1636:       }
1637:       organization_schedules: {
1638:         Row: {
1639:           account_id: string | null
1640:           blueprint_id: string | null
1641:           branch_id: string | null
1642:           created_at: string | null
1643:           created_by: string
1644:           end_time: string | null
1645:           id: string
1646:           notes: string | null
1647:           organization_id: string
1648:           schedule_date: string
1649:           start_time: string | null
1650:           team_id: string | null
1651:           updated_at: string | null
1652:           weather_info: Json | null
1653:         }
1654:         Insert: {
1655:           account_id?: string | null
1656:           blueprint_id?: string | null
1657:           branch_id?: string | null
1658:           created_at?: string | null
1659:           created_by: string
1660:           end_time?: string | null
1661:           id?: string
1662:           notes?: string | null
1663:           organization_id: string
1664:           schedule_date: string
1665:           start_time?: string | null
1666:           team_id?: string | null
1667:           updated_at?: string | null
1668:           weather_info?: Json | null
1669:         }
1670:         Update: {
1671:           account_id?: string | null
1672:           blueprint_id?: string | null
1673:           branch_id?: string | null
1674:           created_at?: string | null
1675:           created_by?: string
1676:           end_time?: string | null
1677:           id?: string
1678:           notes?: string | null
1679:           organization_id?: string
1680:           schedule_date?: string
1681:           start_time?: string | null
1682:           team_id?: string | null
1683:           updated_at?: string | null
1684:           weather_info?: Json | null
1685:         }
1686:         Relationships: [
1687:           {
1688:             foreignKeyName: "organization_schedules_account_id_fkey"
1689:             columns: ["account_id"]
1690:             isOneToOne: false
1691:             referencedRelation: "accounts"
1692:             referencedColumns: ["id"]
1693:           },
1694:           {
1695:             foreignKeyName: "organization_schedules_blueprint_id_fkey"
1696:             columns: ["blueprint_id"]
1697:             isOneToOne: false
1698:             referencedRelation: "blueprints"
1699:             referencedColumns: ["id"]
1700:           },
1701:           {
1702:             foreignKeyName: "organization_schedules_branch_id_fkey"
1703:             columns: ["branch_id"]
1704:             isOneToOne: false
1705:             referencedRelation: "blueprint_branches"
1706:             referencedColumns: ["id"]
1707:           },
1708:           {
1709:             foreignKeyName: "organization_schedules_created_by_fkey"
1710:             columns: ["created_by"]
1711:             isOneToOne: false
1712:             referencedRelation: "accounts"
1713:             referencedColumns: ["id"]
1714:           },
1715:           {
1716:             foreignKeyName: "organization_schedules_organization_id_fkey"
1717:             columns: ["organization_id"]
1718:             isOneToOne: false
1719:             referencedRelation: "accounts"
1720:             referencedColumns: ["id"]
1721:           },
1722:           {
1723:             foreignKeyName: "organization_schedules_team_id_fkey"
1724:             columns: ["team_id"]
1725:             isOneToOne: false
1726:             referencedRelation: "teams"
1727:             referencedColumns: ["id"]
1728:           },
1729:         ]
1730:       }
1731:       permissions: {
1732:         Row: {
1733:           action: string
1734:           created_at: string | null
1735:           description: string | null
1736:           id: string
1737:           is_system_permission: boolean | null
1738:           name: string
1739:           resource: string
1740:         }
1741:         Insert: {
1742:           action: string
1743:           created_at?: string | null
1744:           description?: string | null
1745:           id?: string
1746:           is_system_permission?: boolean | null
1747:           name: string
1748:           resource: string
1749:         }
1750:         Update: {
1751:           action?: string
1752:           created_at?: string | null
1753:           description?: string | null
1754:           id?: string
1755:           is_system_permission?: boolean | null
1756:           name?: string
1757:           resource?: string
1758:         }
1759:         Relationships: []
1760:       }
1761:       personal_todos: {
1762:         Row: {
1763:           account_id: string
1764:           completed_at: string | null
1765:           created_at: string | null
1766:           description: string | null
1767:           due_date: string | null
1768:           id: string
1769:           priority: string | null
1770:           related_id: string | null
1771:           related_type: string | null
1772:           status: string | null
1773:           title: string
1774:           todo_type: string
1775:           updated_at: string | null
1776:         }
1777:         Insert: {
1778:           account_id: string
1779:           completed_at?: string | null
1780:           created_at?: string | null
1781:           description?: string | null
1782:           due_date?: string | null
1783:           id?: string
1784:           priority?: string | null
1785:           related_id?: string | null
1786:           related_type?: string | null
1787:           status?: string | null
1788:           title: string
1789:           todo_type: string
1790:           updated_at?: string | null
1791:         }
1792:         Update: {
1793:           account_id?: string
1794:           completed_at?: string | null
1795:           created_at?: string | null
1796:           description?: string | null
1797:           due_date?: string | null
1798:           id?: string
1799:           priority?: string | null
1800:           related_id?: string | null
1801:           related_type?: string | null
1802:           status?: string | null
1803:           title?: string
1804:           todo_type?: string
1805:           updated_at?: string | null
1806:         }
1807:         Relationships: [
1808:           {
1809:             foreignKeyName: "personal_todos_account_id_fkey"
1810:             columns: ["account_id"]
1811:             isOneToOne: false
1812:             referencedRelation: "accounts"
1813:             referencedColumns: ["id"]
1814:           },
1815:         ]
1816:       }
1817:       progress_tracking: {
1818:         Row: {
1819:           blueprint_id: string
1820:           branch_id: string | null
1821:           budget_spent: number | null
1822:           budget_variance: number | null
1823:           calculated_at: string | null
1824:           completed_tasks: number | null
1825:           completion_percentage: number | null
1826:           id: string
1827:           in_progress_tasks: number | null
1828:           overdue_tasks: number | null
1829:           pending_tasks: number | null
1830:           quality_score: number | null
1831:           safety_incidents: number | null
1832:           schedule_variance_days: number | null
1833:           total_tasks: number | null
1834:           tracking_date: string
1835:         }
1836:         Insert: {
1837:           blueprint_id: string
1838:           branch_id?: string | null
1839:           budget_spent?: number | null
1840:           budget_variance?: number | null
1841:           calculated_at?: string | null
1842:           completed_tasks?: number | null
1843:           completion_percentage?: number | null
1844:           id?: string
1845:           in_progress_tasks?: number | null
1846:           overdue_tasks?: number | null
1847:           pending_tasks?: number | null
1848:           quality_score?: number | null
1849:           safety_incidents?: number | null
1850:           schedule_variance_days?: number | null
1851:           total_tasks?: number | null
1852:           tracking_date: string
1853:         }
1854:         Update: {
1855:           blueprint_id?: string
1856:           branch_id?: string | null
1857:           budget_spent?: number | null
1858:           budget_variance?: number | null
1859:           calculated_at?: string | null
1860:           completed_tasks?: number | null
1861:           completion_percentage?: number | null
1862:           id?: string
1863:           in_progress_tasks?: number | null
1864:           overdue_tasks?: number | null
1865:           pending_tasks?: number | null
1866:           quality_score?: number | null
1867:           safety_incidents?: number | null
1868:           schedule_variance_days?: number | null
1869:           total_tasks?: number | null
1870:           tracking_date?: string
1871:         }
1872:         Relationships: [
1873:           {
1874:             foreignKeyName: "progress_tracking_blueprint_id_fkey"
1875:             columns: ["blueprint_id"]
1876:             isOneToOne: false
1877:             referencedRelation: "blueprints"
1878:             referencedColumns: ["id"]
1879:           },
1880:           {
1881:             foreignKeyName: "progress_tracking_branch_id_fkey"
1882:             columns: ["branch_id"]
1883:             isOneToOne: false
1884:             referencedRelation: "blueprint_branches"
1885:             referencedColumns: ["id"]
1886:           },
1887:         ]
1888:       }
1889:       pull_requests: {
1890:         Row: {
1891:           blueprint_id: string
1892:           branch_id: string
1893:           changes_summary: Json | null
1894:           description: string | null
1895:           id: string
1896:           merged_at: string | null
1897:           merged_by: string | null
1898:           reviewed_at: string | null
1899:           reviewed_by: string | null
1900:           status: string | null
1901:           submitted_at: string | null
1902:           submitted_by: string
1903:           title: string
1904:         }
1905:         Insert: {
1906:           blueprint_id: string
1907:           branch_id: string
1908:           changes_summary?: Json | null
1909:           description?: string | null
1910:           id?: string
1911:           merged_at?: string | null
1912:           merged_by?: string | null
1913:           reviewed_at?: string | null
1914:           reviewed_by?: string | null
1915:           status?: string | null
1916:           submitted_at?: string | null
1917:           submitted_by: string
1918:           title: string
1919:         }
1920:         Update: {
1921:           blueprint_id?: string
1922:           branch_id?: string
1923:           changes_summary?: Json | null
1924:           description?: string | null
1925:           id?: string
1926:           merged_at?: string | null
1927:           merged_by?: string | null
1928:           reviewed_at?: string | null
1929:           reviewed_by?: string | null
1930:           status?: string | null
1931:           submitted_at?: string | null
1932:           submitted_by?: string
1933:           title?: string
1934:         }
1935:         Relationships: [
1936:           {
1937:             foreignKeyName: "pull_requests_blueprint_id_fkey"
1938:             columns: ["blueprint_id"]
1939:             isOneToOne: false
1940:             referencedRelation: "blueprints"
1941:             referencedColumns: ["id"]
1942:           },
1943:           {
1944:             foreignKeyName: "pull_requests_branch_id_fkey"
1945:             columns: ["branch_id"]
1946:             isOneToOne: false
1947:             referencedRelation: "blueprint_branches"
1948:             referencedColumns: ["id"]
1949:           },
1950:           {
1951:             foreignKeyName: "pull_requests_merged_by_fkey"
1952:             columns: ["merged_by"]
1953:             isOneToOne: false
1954:             referencedRelation: "accounts"
1955:             referencedColumns: ["id"]
1956:           },
1957:           {
1958:             foreignKeyName: "pull_requests_reviewed_by_fkey"
1959:             columns: ["reviewed_by"]
1960:             isOneToOne: false
1961:             referencedRelation: "accounts"
1962:             referencedColumns: ["id"]
1963:           },
1964:           {
1965:             foreignKeyName: "pull_requests_submitted_by_fkey"
1966:             columns: ["submitted_by"]
1967:             isOneToOne: false
1968:             referencedRelation: "accounts"
1969:             referencedColumns: ["id"]
1970:           },
1971:         ]
1972:       }
1973:       qc_photos: {
1974:         Row: {
1975:           caption: string | null
1976:           document_id: string
1977:           id: string
1978:           photo_type: string | null
1979:           qc_id: string
1980:           sequence_order: number | null
1981:           uploaded_at: string | null
1982:           uploaded_by: string
1983:         }
1984:         Insert: {
1985:           caption?: string | null
1986:           document_id: string
1987:           id?: string
1988:           photo_type?: string | null
1989:           qc_id: string
1990:           sequence_order?: number | null
1991:           uploaded_at?: string | null
1992:           uploaded_by: string
1993:         }
1994:         Update: {
1995:           caption?: string | null
1996:           document_id?: string
1997:           id?: string
1998:           photo_type?: string | null
1999:           qc_id?: string
2000:           sequence_order?: number | null
2001:           uploaded_at?: string | null
2002:           uploaded_by?: string
2003:         }
2004:         Relationships: [
2005:           {
2006:             foreignKeyName: "qc_photos_document_id_fkey"
2007:             columns: ["document_id"]
2008:             isOneToOne: false
2009:             referencedRelation: "documents"
2010:             referencedColumns: ["id"]
2011:           },
2012:           {
2013:             foreignKeyName: "qc_photos_qc_id_fkey"
2014:             columns: ["qc_id"]
2015:             isOneToOne: false
2016:             referencedRelation: "quality_checks"
2017:             referencedColumns: ["id"]
2018:           },
2019:           {
2020:             foreignKeyName: "qc_photos_uploaded_by_fkey"
2021:             columns: ["uploaded_by"]
2022:             isOneToOne: false
2023:             referencedRelation: "accounts"
2024:             referencedColumns: ["id"]
2025:           },
2026:         ]
2027:       }
2028:       quality_checks: {
2029:         Row: {
2030:           check_items: Json
2031:           check_type: string | null
2032:           checked_at: string | null
2033:           completed_at: string | null
2034:           findings: string | null
2035:           id: string
2036:           inspector_id: string
2037:           recommendations: string | null
2038:           staging_id: string | null
2039:           status: string | null
2040:           task_id: string
2041:         }
2042:         Insert: {
2043:           check_items: Json
2044:           check_type?: string | null
2045:           checked_at?: string | null
2046:           completed_at?: string | null
2047:           findings?: string | null
2048:           id?: string
2049:           inspector_id: string
2050:           recommendations?: string | null
2051:           staging_id?: string | null
2052:           status?: string | null
2053:           task_id: string
2054:         }
2055:         Update: {
2056:           check_items?: Json
2057:           check_type?: string | null
2058:           checked_at?: string | null
2059:           completed_at?: string | null
2060:           findings?: string | null
2061:           id?: string
2062:           inspector_id?: string
2063:           recommendations?: string | null
2064:           staging_id?: string | null
2065:           status?: string | null
2066:           task_id?: string
2067:         }
2068:         Relationships: [
2069:           {
2070:             foreignKeyName: "quality_checks_inspector_id_fkey"
2071:             columns: ["inspector_id"]
2072:             isOneToOne: false
2073:             referencedRelation: "accounts"
2074:             referencedColumns: ["id"]
2075:           },
2076:           {
2077:             foreignKeyName: "quality_checks_staging_id_fkey"
2078:             columns: ["staging_id"]
2079:             isOneToOne: false
2080:             referencedRelation: "task_staging"
2081:             referencedColumns: ["id"]
2082:           },
2083:           {
2084:             foreignKeyName: "quality_checks_task_id_fkey"
2085:             columns: ["task_id"]
2086:             isOneToOne: false
2087:             referencedRelation: "tasks"
2088:             referencedColumns: ["id"]
2089:           },
2090:         ]
2091:       }
2092:       report_photos: {
2093:         Row: {
2094:           caption: string | null
2095:           document_id: string
2096:           id: string
2097:           photo_type: string | null
2098:           report_id: string
2099:           sequence_order: number | null
2100:           uploaded_at: string | null
2101:           uploaded_by: string
2102:         }
2103:         Insert: {
2104:           caption?: string | null
2105:           document_id: string
2106:           id?: string
2107:           photo_type?: string | null
2108:           report_id: string
2109:           sequence_order?: number | null
2110:           uploaded_at?: string | null
2111:           uploaded_by: string
2112:         }
2113:         Update: {
2114:           caption?: string | null
2115:           document_id?: string
2116:           id?: string
2117:           photo_type?: string | null
2118:           report_id?: string
2119:           sequence_order?: number | null
2120:           uploaded_at?: string | null
2121:           uploaded_by?: string
2122:         }
2123:         Relationships: [
2124:           {
2125:             foreignKeyName: "report_photos_document_id_fkey"
2126:             columns: ["document_id"]
2127:             isOneToOne: false
2128:             referencedRelation: "documents"
2129:             referencedColumns: ["id"]
2130:           },
2131:           {
2132:             foreignKeyName: "report_photos_report_id_fkey"
2133:             columns: ["report_id"]
2134:             isOneToOne: false
2135:             referencedRelation: "daily_reports"
2136:             referencedColumns: ["id"]
2137:           },
2138:           {
2139:             foreignKeyName: "report_photos_uploaded_by_fkey"
2140:             columns: ["uploaded_by"]
2141:             isOneToOne: false
2142:             referencedRelation: "accounts"
2143:             referencedColumns: ["id"]
2144:           },
2145:         ]
2146:       }
2147:       role_permissions: {
2148:         Row: {
2149:           created_at: string | null
2150:           id: string
2151:           permission_id: string
2152:           role_id: string
2153:         }
2154:         Insert: {
2155:           created_at?: string | null
2156:           id?: string
2157:           permission_id: string
2158:           role_id: string
2159:         }
2160:         Update: {
2161:           created_at?: string | null
2162:           id?: string
2163:           permission_id?: string
2164:           role_id?: string
2165:         }
2166:         Relationships: [
2167:           {
2168:             foreignKeyName: "role_permissions_permission_id_fkey"
2169:             columns: ["permission_id"]
2170:             isOneToOne: false
2171:             referencedRelation: "permissions"
2172:             referencedColumns: ["id"]
2173:           },
2174:           {
2175:             foreignKeyName: "role_permissions_role_id_fkey"
2176:             columns: ["role_id"]
2177:             isOneToOne: false
2178:             referencedRelation: "roles"
2179:             referencedColumns: ["id"]
2180:           },
2181:         ]
2182:       }
2183:       roles: {
2184:         Row: {
2185:           created_at: string | null
2186:           description: string | null
2187:           id: string
2188:           is_system_role: boolean | null
2189:           name: string
2190:           updated_at: string | null
2191:         }
2192:         Insert: {
2193:           created_at?: string | null
2194:           description?: string | null
2195:           id?: string
2196:           is_system_role?: boolean | null
2197:           name: string
2198:           updated_at?: string | null
2199:         }
2200:         Update: {
2201:           created_at?: string | null
2202:           description?: string | null
2203:           id?: string
2204:           is_system_role?: boolean | null
2205:           name?: string
2206:           updated_at?: string | null
2207:         }
2208:         Relationships: []
2209:       }
2210:       settings: {
2211:         Row: {
2212:           created_at: string | null
2213:           description: string | null
2214:           id: string
2215:           is_public: boolean | null
2216:           scope_id: string | null
2217:           setting_key: string
2218:           setting_type: string | null
2219:           setting_value: Json
2220:           updated_at: string | null
2221:           updated_by: string | null
2222:         }
2223:         Insert: {
2224:           created_at?: string | null
2225:           description?: string | null
2226:           id?: string
2227:           is_public?: boolean | null
2228:           scope_id?: string | null
2229:           setting_key: string
2230:           setting_type?: string | null
2231:           setting_value: Json
2232:           updated_at?: string | null
2233:           updated_by?: string | null
2234:         }
2235:         Update: {
2236:           created_at?: string | null
2237:           description?: string | null
2238:           id?: string
2239:           is_public?: boolean | null
2240:           scope_id?: string | null
2241:           setting_key?: string
2242:           setting_type?: string | null
2243:           setting_value?: Json
2244:           updated_at?: string | null
2245:           updated_by?: string | null
2246:         }
2247:         Relationships: [
2248:           {
2249:             foreignKeyName: "settings_updated_by_fkey"
2250:             columns: ["updated_by"]
2251:             isOneToOne: false
2252:             referencedRelation: "accounts"
2253:             referencedColumns: ["id"]
2254:           },
2255:         ]
2256:       }
2257:       task_assignments: {
2258:         Row: {
2259:           accepted_at: string | null
2260:           assigned_at: string | null
2261:           assigned_by: string
2262:           assignee_id: string
2263:           assignee_type: string
2264:           assignment_note: string | null
2265:           id: string
2266:           task_id: string
2267:         }
2268:         Insert: {
2269:           accepted_at?: string | null
2270:           assigned_at?: string | null
2271:           assigned_by: string
2272:           assignee_id: string
2273:           assignee_type: string
2274:           assignment_note?: string | null
2275:           id?: string
2276:           task_id: string
2277:         }
2278:         Update: {
2279:           accepted_at?: string | null
2280:           assigned_at?: string | null
2281:           assigned_by?: string
2282:           assignee_id?: string
2283:           assignee_type?: string
2284:           assignment_note?: string | null
2285:           id?: string
2286:           task_id?: string
2287:         }
2288:         Relationships: [
2289:           {
2290:             foreignKeyName: "task_assignments_assigned_by_fkey"
2291:             columns: ["assigned_by"]
2292:             isOneToOne: false
2293:             referencedRelation: "accounts"
2294:             referencedColumns: ["id"]
2295:           },
2296:           {
2297:             foreignKeyName: "task_assignments_assignee_id_fkey"
2298:             columns: ["assignee_id"]
2299:             isOneToOne: false
2300:             referencedRelation: "accounts"
2301:             referencedColumns: ["id"]
2302:           },
2303:           {
2304:             foreignKeyName: "task_assignments_task_id_fkey"
2305:             columns: ["task_id"]
2306:             isOneToOne: false
2307:             referencedRelation: "tasks"
2308:             referencedColumns: ["id"]
2309:           },
2310:         ]
2311:       }
2312:       task_dependencies: {
2313:         Row: {
2314:           created_at: string | null
2315:           dependency_type: string | null
2316:           depends_on_task_id: string
2317:           id: string
2318:           lag_days: number | null
2319:           task_id: string
2320:         }
2321:         Insert: {
2322:           created_at?: string | null
2323:           dependency_type?: string | null
2324:           depends_on_task_id: string
2325:           id?: string
2326:           lag_days?: number | null
2327:           task_id: string
2328:         }
2329:         Update: {
2330:           created_at?: string | null
2331:           dependency_type?: string | null
2332:           depends_on_task_id?: string
2333:           id?: string
2334:           lag_days?: number | null
2335:           task_id?: string
2336:         }
2337:         Relationships: [
2338:           {
2339:             foreignKeyName: "task_dependencies_depends_on_task_id_fkey"
2340:             columns: ["depends_on_task_id"]
2341:             isOneToOne: false
2342:             referencedRelation: "tasks"
2343:             referencedColumns: ["id"]
2344:           },
2345:           {
2346:             foreignKeyName: "task_dependencies_task_id_fkey"
2347:             columns: ["task_id"]
2348:             isOneToOne: false
2349:             referencedRelation: "tasks"
2350:             referencedColumns: ["id"]
2351:           },
2352:         ]
2353:       }
2354:       task_lists: {
2355:         Row: {
2356:           account_id: string
2357:           added_at: string | null
2358:           id: string
2359:           list_type: string | null
2360:           task_id: string
2361:         }
2362:         Insert: {
2363:           account_id: string
2364:           added_at?: string | null
2365:           id?: string
2366:           list_type?: string | null
2367:           task_id: string
2368:         }
2369:         Update: {
2370:           account_id?: string
2371:           added_at?: string | null
2372:           id?: string
2373:           list_type?: string | null
2374:           task_id?: string
2375:         }
2376:         Relationships: [
2377:           {
2378:             foreignKeyName: "task_lists_account_id_fkey"
2379:             columns: ["account_id"]
2380:             isOneToOne: false
2381:             referencedRelation: "accounts"
2382:             referencedColumns: ["id"]
2383:           },
2384:           {
2385:             foreignKeyName: "task_lists_task_id_fkey"
2386:             columns: ["task_id"]
2387:             isOneToOne: false
2388:             referencedRelation: "tasks"
2389:             referencedColumns: ["id"]
2390:           },
2391:         ]
2392:       }
2393:       task_staging: {
2394:         Row: {
2395:           can_withdraw: boolean | null
2396:           confirmed_at: string | null
2397:           expires_at: string
2398:           id: string
2399:           notes: string | null
2400:           photos: Json | null
2401:           staging_data: Json
2402:           submitted_at: string | null
2403:           submitted_by: string
2404:           task_id: string
2405:           withdrawn_at: string | null
2406:         }
2407:         Insert: {
2408:           can_withdraw?: boolean | null
2409:           confirmed_at?: string | null
2410:           expires_at?: string
2411:           id?: string
2412:           notes?: string | null
2413:           photos?: Json | null
2414:           staging_data: Json
2415:           submitted_at?: string | null
2416:           submitted_by: string
2417:           task_id: string
2418:           withdrawn_at?: string | null
2419:         }
2420:         Update: {
2421:           can_withdraw?: boolean | null
2422:           confirmed_at?: string | null
2423:           expires_at?: string
2424:           id?: string
2425:           notes?: string | null
2426:           photos?: Json | null
2427:           staging_data?: Json
2428:           submitted_at?: string | null
2429:           submitted_by?: string
2430:           task_id?: string
2431:           withdrawn_at?: string | null
2432:         }
2433:         Relationships: [
2434:           {
2435:             foreignKeyName: "task_staging_submitted_by_fkey"
2436:             columns: ["submitted_by"]
2437:             isOneToOne: false
2438:             referencedRelation: "accounts"
2439:             referencedColumns: ["id"]
2440:           },
2441:           {
2442:             foreignKeyName: "task_staging_task_id_fkey"
2443:             columns: ["task_id"]
2444:             isOneToOne: false
2445:             referencedRelation: "tasks"
2446:             referencedColumns: ["id"]
2447:           },
2448:         ]
2449:       }
2450:       task_templates: {
2451:         Row: {
2452:           created_at: string | null
2453:           created_by: string
2454:           description: string | null
2455:           id: string
2456:           is_public: boolean | null
2457:           name: string
2458:           organization_id: string
2459:           template_data: Json
2460:           updated_at: string | null
2461:           usage_count: number | null
2462:         }
2463:         Insert: {
2464:           created_at?: string | null
2465:           created_by: string
2466:           description?: string | null
2467:           id?: string
2468:           is_public?: boolean | null
2469:           name: string
2470:           organization_id: string
2471:           template_data: Json
2472:           updated_at?: string | null
2473:           usage_count?: number | null
2474:         }
2475:         Update: {
2476:           created_at?: string | null
2477:           created_by?: string
2478:           description?: string | null
2479:           id?: string
2480:           is_public?: boolean | null
2481:           name?: string
2482:           organization_id?: string
2483:           template_data?: Json
2484:           updated_at?: string | null
2485:           usage_count?: number | null
2486:         }
2487:         Relationships: [
2488:           {
2489:             foreignKeyName: "task_templates_created_by_fkey"
2490:             columns: ["created_by"]
2491:             isOneToOne: false
2492:             referencedRelation: "accounts"
2493:             referencedColumns: ["id"]
2494:           },
2495:           {
2496:             foreignKeyName: "task_templates_organization_id_fkey"
2497:             columns: ["organization_id"]
2498:             isOneToOne: false
2499:             referencedRelation: "accounts"
2500:             referencedColumns: ["id"]
2501:           },
2502:         ]
2503:       }
2504:       tasks: {
2505:         Row: {
2506:           actual_end_date: string | null
2507:           actual_hours: number | null
2508:           actual_start_date: string | null
2509:           blueprint_id: string
2510:           branch_id: string | null
2511:           contractor_fields: Json | null
2512:           created_at: string | null
2513:           created_by: string
2514:           description: string | null
2515:           estimated_hours: number | null
2516:           id: string
2517:           parent_task_id: string | null
2518:           planned_end_date: string | null
2519:           planned_start_date: string | null
2520:           priority: string | null
2521:           progress_percentage: number | null
2522:           sequence_order: number | null
2523:           status: string | null
2524:           task_type: string | null
2525:           title: string
2526:           tree_level: number | null
2527:           tree_path: unknown
2528:           updated_at: string | null
2529:         }
2530:         Insert: {
2531:           actual_end_date?: string | null
2532:           actual_hours?: number | null
2533:           actual_start_date?: string | null
2534:           blueprint_id: string
2535:           branch_id?: string | null
2536:           contractor_fields?: Json | null
2537:           created_at?: string | null
2538:           created_by: string
2539:           description?: string | null
2540:           estimated_hours?: number | null
2541:           id?: string
2542:           parent_task_id?: string | null
2543:           planned_end_date?: string | null
2544:           planned_start_date?: string | null
2545:           priority?: string | null
2546:           progress_percentage?: number | null
2547:           sequence_order?: number | null
2548:           status?: string | null
2549:           task_type?: string | null
2550:           title: string
2551:           tree_level?: number | null
2552:           tree_path?: unknown
2553:           updated_at?: string | null
2554:         }
2555:         Update: {
2556:           actual_end_date?: string | null
2557:           actual_hours?: number | null
2558:           actual_start_date?: string | null
2559:           blueprint_id?: string
2560:           branch_id?: string | null
2561:           contractor_fields?: Json | null
2562:           created_at?: string | null
2563:           created_by?: string
2564:           description?: string | null
2565:           estimated_hours?: number | null
2566:           id?: string
2567:           parent_task_id?: string | null
2568:           planned_end_date?: string | null
2569:           planned_start_date?: string | null
2570:           priority?: string | null
2571:           progress_percentage?: number | null
2572:           sequence_order?: number | null
2573:           status?: string | null
2574:           task_type?: string | null
2575:           title?: string
2576:           tree_level?: number | null
2577:           tree_path?: unknown
2578:           updated_at?: string | null
2579:         }
2580:         Relationships: [
2581:           {
2582:             foreignKeyName: "tasks_blueprint_id_fkey"
2583:             columns: ["blueprint_id"]
2584:             isOneToOne: false
2585:             referencedRelation: "blueprints"
2586:             referencedColumns: ["id"]
2587:           },
2588:           {
2589:             foreignKeyName: "tasks_branch_id_fkey"
2590:             columns: ["branch_id"]
2591:             isOneToOne: false
2592:             referencedRelation: "blueprint_branches"
2593:             referencedColumns: ["id"]
2594:           },
2595:           {
2596:             foreignKeyName: "tasks_created_by_fkey"
2597:             columns: ["created_by"]
2598:             isOneToOne: false
2599:             referencedRelation: "accounts"
2600:             referencedColumns: ["id"]
2601:           },
2602:           {
2603:             foreignKeyName: "tasks_parent_task_id_fkey"
2604:             columns: ["parent_task_id"]
2605:             isOneToOne: false
2606:             referencedRelation: "tasks"
2607:             referencedColumns: ["id"]
2608:           },
2609:         ]
2610:       }
2611:       team_members: {
2612:         Row: {
2613:           account_id: string
2614:           id: string
2615:           joined_at: string | null
2616:           role: string | null
2617:           team_id: string
2618:         }
2619:         Insert: {
2620:           account_id: string
2621:           id?: string
2622:           joined_at?: string | null
2623:           role?: string | null
2624:           team_id: string
2625:         }
2626:         Update: {
2627:           account_id?: string
2628:           id?: string
2629:           joined_at?: string | null
2630:           role?: string | null
2631:           team_id?: string
2632:         }
2633:         Relationships: [
2634:           {
2635:             foreignKeyName: "team_members_account_id_fkey"
2636:             columns: ["account_id"]
2637:             isOneToOne: false
2638:             referencedRelation: "accounts"
2639:             referencedColumns: ["id"]
2640:           },
2641:           {
2642:             foreignKeyName: "team_members_team_id_fkey"
2643:             columns: ["team_id"]
2644:             isOneToOne: false
2645:             referencedRelation: "teams"
2646:             referencedColumns: ["id"]
2647:           },
2648:         ]
2649:       }
2650:       teams: {
2651:         Row: {
2652:           avatar_url: string | null
2653:           created_at: string | null
2654:           created_by: string
2655:           description: string | null
2656:           id: string
2657:           name: string
2658:           organization_id: string
2659:           updated_at: string | null
2660:         }
2661:         Insert: {
2662:           avatar_url?: string | null
2663:           created_at?: string | null
2664:           created_by: string
2665:           description?: string | null
2666:           id?: string
2667:           name: string
2668:           organization_id: string
2669:           updated_at?: string | null
2670:         }
2671:         Update: {
2672:           avatar_url?: string | null
2673:           created_at?: string | null
2674:           created_by?: string
2675:           description?: string | null
2676:           id?: string
2677:           name?: string
2678:           organization_id?: string
2679:           updated_at?: string | null
2680:         }
2681:         Relationships: [
2682:           {
2683:             foreignKeyName: "teams_created_by_fkey"
2684:             columns: ["created_by"]
2685:             isOneToOne: false
2686:             referencedRelation: "accounts"
2687:             referencedColumns: ["id"]
2688:           },
2689:           {
2690:             foreignKeyName: "teams_organization_id_fkey"
2691:             columns: ["organization_id"]
2692:             isOneToOne: false
2693:             referencedRelation: "accounts"
2694:             referencedColumns: ["id"]
2695:           },
2696:         ]
2697:       }
2698:       todo_status_tracking: {
2699:         Row: {
2700:           change_note: string | null
2701:           changed_at: string | null
2702:           changed_by: string | null
2703:           from_status: string | null
2704:           id: string
2705:           to_status: string
2706:           todo_id: string
2707:         }
2708:         Insert: {
2709:           change_note?: string | null
2710:           changed_at?: string | null
2711:           changed_by?: string | null
2712:           from_status?: string | null
2713:           id?: string
2714:           to_status: string
2715:           todo_id: string
2716:         }
2717:         Update: {
2718:           change_note?: string | null
2719:           changed_at?: string | null
2720:           changed_by?: string | null
2721:           from_status?: string | null
2722:           id?: string
2723:           to_status?: string
2724:           todo_id?: string
2725:         }
2726:         Relationships: [
2727:           {
2728:             foreignKeyName: "todo_status_tracking_changed_by_fkey"
2729:             columns: ["changed_by"]
2730:             isOneToOne: false
2731:             referencedRelation: "accounts"
2732:             referencedColumns: ["id"]
2733:           },
2734:           {
2735:             foreignKeyName: "todo_status_tracking_todo_id_fkey"
2736:             columns: ["todo_id"]
2737:             isOneToOne: false
2738:             referencedRelation: "personal_todos"
2739:             referencedColumns: ["id"]
2740:           },
2741:         ]
2742:       }
2743:       user_roles: {
2744:         Row: {
2745:           account_id: string
2746:           blueprint_id: string | null
2747:           branch_id: string | null
2748:           granted_at: string | null
2749:           granted_by: string | null
2750:           id: string
2751:           role_id: string
2752:         }
2753:         Insert: {
2754:           account_id: string
2755:           blueprint_id?: string | null
2756:           branch_id?: string | null
2757:           granted_at?: string | null
2758:           granted_by?: string | null
2759:           id?: string
2760:           role_id: string
2761:         }
2762:         Update: {
2763:           account_id?: string
2764:           blueprint_id?: string | null
2765:           branch_id?: string | null
2766:           granted_at?: string | null
2767:           granted_by?: string | null
2768:           id?: string
2769:           role_id?: string
2770:         }
2771:         Relationships: [
2772:           {
2773:             foreignKeyName: "user_roles_account_id_fkey"
2774:             columns: ["account_id"]
2775:             isOneToOne: false
2776:             referencedRelation: "accounts"
2777:             referencedColumns: ["id"]
2778:           },
2779:           {
2780:             foreignKeyName: "user_roles_blueprint_id_fkey"
2781:             columns: ["blueprint_id"]
2782:             isOneToOne: false
2783:             referencedRelation: "blueprints"
2784:             referencedColumns: ["id"]
2785:           },
2786:           {
2787:             foreignKeyName: "user_roles_branch_id_fkey"
2788:             columns: ["branch_id"]
2789:             isOneToOne: false
2790:             referencedRelation: "blueprint_branches"
2791:             referencedColumns: ["id"]
2792:           },
2793:           {
2794:             foreignKeyName: "user_roles_granted_by_fkey"
2795:             columns: ["granted_by"]
2796:             isOneToOne: false
2797:             referencedRelation: "accounts"
2798:             referencedColumns: ["id"]
2799:           },
2800:           {
2801:             foreignKeyName: "user_roles_role_id_fkey"
2802:             columns: ["role_id"]
2803:             isOneToOne: false
2804:             referencedRelation: "roles"
2805:             referencedColumns: ["id"]
2806:           },
2807:         ]
2808:       }
2809:       weather_cache: {
2810:         Row: {
2811:           api_source: string | null
2812:           expires_at: string
2813:           fetched_at: string | null
2814:           forecast_date: string
2815:           id: string
2816:           location: string
2817:           weather_data: Json
2818:         }
2819:         Insert: {
2820:           api_source?: string | null
2821:           expires_at: string
2822:           fetched_at?: string | null
2823:           forecast_date: string
2824:           id?: string
2825:           location: string
2826:           weather_data: Json
2827:         }
2828:         Update: {
2829:           api_source?: string | null
2830:           expires_at?: string
2831:           fetched_at?: string | null
2832:           forecast_date?: string
2833:           id?: string
2834:           location?: string
2835:           weather_data?: Json
2836:         }
2837:         Relationships: []
2838:       }
2839:     }
2840:     Views: {
2841:       [_ in never]: never
2842:     }
2843:     Functions: {
2844:       text2ltree: { Args: { "": string }; Returns: unknown }
2845:     }
2846:     Enums: {
2847:       [_ in never]: never
2848:     }
2849:     CompositeTypes: {
2850:       [_ in never]: never
2851:     }
2852:   }
2853: }
2854: 
2855: type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
2856: 
2857: type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]
2858: 
2859: export type Tables<
2860:   DefaultSchemaTableNameOrOptions extends
2861:     | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
2862:     | { schema: keyof DatabaseWithoutInternals },
2863:   TableName extends DefaultSchemaTableNameOrOptions extends {
2864:     schema: keyof DatabaseWithoutInternals
2865:   }
2866:     ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
2867:         DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
2868:     : never = never,
2869: > = DefaultSchemaTableNameOrOptions extends {
2870:   schema: keyof DatabaseWithoutInternals
2871: }
2872:   ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
2873:       DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
2874:       Row: infer R
2875:     }
2876:     ? R
2877:     : never
2878:   : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
2879:         DefaultSchema["Views"])
2880:     ? (DefaultSchema["Tables"] &
2881:         DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
2882:         Row: infer R
2883:       }
2884:       ? R
2885:       : never
2886:     : never
2887: 
2888: export type TablesInsert<
2889:   DefaultSchemaTableNameOrOptions extends
2890:     | keyof DefaultSchema["Tables"]
2891:     | { schema: keyof DatabaseWithoutInternals },
2892:   TableName extends DefaultSchemaTableNameOrOptions extends {
2893:     schema: keyof DatabaseWithoutInternals
2894:   }
2895:     ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
2896:     : never = never,
2897: > = DefaultSchemaTableNameOrOptions extends {
2898:   schema: keyof DatabaseWithoutInternals
2899: }
2900:   ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
2901:       Insert: infer I
2902:     }
2903:     ? I
2904:     : never
2905:   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
2906:     ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
2907:         Insert: infer I
2908:       }
2909:       ? I
2910:       : never
2911:     : never
2912: 
2913: export type TablesUpdate<
2914:   DefaultSchemaTableNameOrOptions extends
2915:     | keyof DefaultSchema["Tables"]
2916:     | { schema: keyof DatabaseWithoutInternals },
2917:   TableName extends DefaultSchemaTableNameOrOptions extends {
2918:     schema: keyof DatabaseWithoutInternals
2919:   }
2920:     ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
2921:     : never = never,
2922: > = DefaultSchemaTableNameOrOptions extends {
2923:   schema: keyof DatabaseWithoutInternals
2924: }
2925:   ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
2926:       Update: infer U
2927:     }
2928:     ? U
2929:     : never
2930:   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
2931:     ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
2932:         Update: infer U
2933:       }
2934:       ? U
2935:       : never
2936:     : never
2937: 
2938: export type Enums<
2939:   DefaultSchemaEnumNameOrOptions extends
2940:     | keyof DefaultSchema["Enums"]
2941:     | { schema: keyof DatabaseWithoutInternals },
2942:   EnumName extends DefaultSchemaEnumNameOrOptions extends {
2943:     schema: keyof DatabaseWithoutInternals
2944:   }
2945:     ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
2946:     : never = never,
2947: > = DefaultSchemaEnumNameOrOptions extends {
2948:   schema: keyof DatabaseWithoutInternals
2949: }
2950:   ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
2951:   : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
2952:     ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
2953:     : never
2954: 
2955: export type CompositeTypes<
2956:   PublicCompositeTypeNameOrOptions extends
2957:     | keyof DefaultSchema["CompositeTypes"]
2958:     | { schema: keyof DatabaseWithoutInternals },
2959:   CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
2960:     schema: keyof DatabaseWithoutInternals
2961:   }
2962:     ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
2963:     : never = never,
2964: > = PublicCompositeTypeNameOrOptions extends {
2965:   schema: keyof DatabaseWithoutInternals
2966: }
2967:   ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
2968:   : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
2969:     ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
2970:     : never
2971: 
2972: export const Constants = {
2973:   public: {
2974:     Enums: {},
2975:   },
2976: } as const
````

## File: src/app/core/infra/utils/index.ts
````typescript
1: /**
2:  * 工具函数模块导出
3:  */
4: export * from './transformers';
````

## File: src/app/core/infra/utils/transformers.ts
````typescript
  1: /**
  2:  * 数据转换工具
  3:  * 
  4:  * 提供 snake_case ↔ camelCase 转换功能
  5:  * 用于数据库字段名（snake_case）与 TypeScript 属性名（camelCase）之间的映射
  6:  */
  7: 
  8: /**
  9:  * 将 snake_case 转换为 camelCase
 10:  */
 11: function toCamelCase(str: string): string {
 12:   return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
 13: }
 14: 
 15: /**
 16:  * 将 camelCase 转换为 snake_case
 17:  */
 18: function toSnakeCase(str: string): string {
 19:   return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
 20: }
 21: 
 22: /**
 23:  * 递归转换对象的键名从 snake_case 到 camelCase
 24:  */
 25: function convertKeysToCamelCase<T>(obj: any): T {
 26:   if (obj === null || obj === undefined) {
 27:     return obj;
 28:   }
 29: 
 30:   if (Array.isArray(obj)) {
 31:     return obj.map(item => convertKeysToCamelCase(item)) as T;
 32:   }
 33: 
 34:   if (typeof obj === 'object' && obj.constructor === Object) {
 35:     const converted: any = {};
 36:     for (const key in obj) {
 37:       if (Object.prototype.hasOwnProperty.call(obj, key)) {
 38:         const camelKey = toCamelCase(key);
 39:         converted[camelKey] = convertKeysToCamelCase(obj[key]);
 40:       }
 41:     }
 42:     return converted as T;
 43:   }
 44: 
 45:   return obj;
 46: }
 47: 
 48: /**
 49:  * 递归转换对象的键名从 camelCase 到 snake_case
 50:  */
 51: function convertKeysToSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
 52:   if (obj === null || obj === undefined) {
 53:     return obj;
 54:   }
 55: 
 56:   if (Array.isArray(obj)) {
 57:     return obj.map(item => convertKeysToSnakeCase(item));
 58:   }
 59: 
 60:   if (typeof obj === 'object' && obj.constructor === Object) {
 61:     const converted: Record<string, any> = {};
 62:     for (const key in obj) {
 63:       if (Object.prototype.hasOwnProperty.call(obj, key)) {
 64:         const snakeKey = toSnakeCase(key);
 65:         converted[snakeKey] = convertKeysToSnakeCase(obj[key]);
 66:       }
 67:     }
 68:     return converted;
 69:   }
 70: 
 71:   return obj;
 72: }
 73: 
 74: /**
 75:  * 将数据库数据（snake_case）转换为应用数据（camelCase）
 76:  * 
 77:  * @param data 数据库数据
 78:  * @returns 转换后的数据
 79:  * 
 80:  * @example
 81:  * ```typescript
 82:  * const dbData = { user_id: '123', created_at: '2025-01-01' };
 83:  * const appData = toCamelCase(dbData);
 84:  * // { userId: '123', createdAt: '2025-01-01' }
 85:  * ```
 86:  */
 87: export function toCamelCaseData<T>(data: any): T {
 88:   return convertKeysToCamelCase<T>(data);
 89: }
 90: 
 91: /**
 92:  * 将应用数据（camelCase）转换为数据库数据（snake_case）
 93:  * 
 94:  * @param data 应用数据
 95:  * @returns 转换后的数据
 96:  * 
 97:  * @example
 98:  * ```typescript
 99:  * const appData = { userId: '123', createdAt: '2025-01-01' };
100:  * const dbData = toSnakeCaseData(appData);
101:  * // { user_id: '123', created_at: '2025-01-01' }
102:  * ```
103:  */
104: export function toSnakeCaseData<T extends Record<string, any>>(data: T): Record<string, any> {
105:   return convertKeysToSnakeCase(data);
106: }
````

## File: src/app/core/net/default.interceptor.ts
````typescript
 1: import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponseBase } from '@angular/common/http';
 2: import { Injector, inject } from '@angular/core';
 3: import { IGNORE_BASE_URL } from '@delon/theme';
 4: import { environment } from '@env/environment';
 5: import { Observable, of, throwError, mergeMap } from 'rxjs';
 6: 
 7: import { ReThrowHttpError, checkStatus, getAdditionalHeaders, toLogin } from './helper';
 8: import { tryRefreshToken } from './refresh-token';
 9: 
10: function handleData(injector: Injector, ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
11:   checkStatus(injector, ev);
12:   // 业务处理：一些通用操作
13:   switch (ev.status) {
14:     case 200:
15:       // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
16:       // 例如响应内容：
17:       //  错误内容：{ status: 1, msg: '非法参数' }
18:       //  正确内容：{ status: 0, response: {  } }
19:       // 则以下代码片断可直接适用
20:       // if (ev instanceof HttpResponse) {
21:       //   const body = ev.body;
22:       //   if (body && body.status !== 0) {
23:       //     const customError = req.context.get(CUSTOM_ERROR);
24:       //     if (customError) injector.get(NzMessageService).error(body.msg);
25:       //     return customError ? throwError(() => ({ body, _throw: true }) as ReThrowHttpError) : of({});
26:       //   } else {
27:       //     // 返回原始返回体
28:       //     if (req.context.get(RAW_BODY) || ev.body instanceof Blob) {
29:       //       return of(ev);
30:       //     }
31:       //     // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
32:       //     return of(new HttpResponse({ ...ev, body: body.response } as any));
33:       //     // 或者依然保持完整的格式
34:       //     return of(ev);
35:       //   }
36:       // }
37:       break;
38:     case 401:
39:       if (environment.api.refreshTokenEnabled && environment.api.refreshTokenType === 're-request') {
40:         return tryRefreshToken(injector, ev, req, next);
41:       }
42:       toLogin(injector);
43:       break;
44:     case 403:
45:     case 404:
46:     case 500:
47:       // goTo(injector, `/exception/${ev.status}?url=${req.urlWithParams}`);
48:       break;
49:     default:
50:       if (ev instanceof HttpErrorResponse) {
51:         console.warn('未可知错误，大部分是由于后端不支持跨域CORS或无效配置引起，请参考 https://ng-alain.com/docs/server 解决跨域问题', ev);
52:       }
53:       break;
54:   }
55:   if (ev instanceof HttpErrorResponse) {
56:     return throwError(() => ev);
57:   } else if ((ev as unknown as ReThrowHttpError)._throw === true) {
58:     return throwError(() => (ev as unknown as ReThrowHttpError).body);
59:   } else {
60:     return of(ev);
61:   }
62: }
63: 
64: export const defaultInterceptor: HttpInterceptorFn = (req, next) => {
65:   // 统一加上服务端前缀
66:   let url = req.url;
67:   if (!req.context.get(IGNORE_BASE_URL) && !url.startsWith('https://') && !url.startsWith('http://')) {
68:     const { baseUrl } = environment.api;
69:     url = baseUrl + (baseUrl.endsWith('/') && url.startsWith('/') ? url.substring(1) : url);
70:   }
71:   const newReq = req.clone({ url, setHeaders: getAdditionalHeaders(req.headers) });
72:   const injector = inject(Injector);
73: 
74:   return next(newReq).pipe(
75:     mergeMap(ev => {
76:       // 允许统一对请求错误处理
77:       if (ev instanceof HttpResponseBase) {
78:         return handleData(injector, ev, newReq, next);
79:       }
80:       // 若一切都正常，则后续操作
81:       return of(ev);
82:     })
83:     // catchError((err: HttpErrorResponse) => handleData(injector, err, newReq, next))
84:   );
85: };
````

## File: src/app/core/net/helper.ts
````typescript
 1: import { HttpHeaders, HttpResponseBase } from '@angular/common/http';
 2: import { Injector, inject } from '@angular/core';
 3: import { Router } from '@angular/router';
 4: import { DA_SERVICE_TOKEN } from '@delon/auth';
 5: import { ALAIN_I18N_TOKEN } from '@delon/theme';
 6: import { NzNotificationService } from 'ng-zorro-antd/notification';
 7: 
 8: export interface ReThrowHttpError {
 9:   body: any;
10:   _throw: true;
11: }
12: 
13: export const CODEMESSAGE: Record<number, string> = {
14:   200: '服务器成功返回请求的数据。',
15:   201: '新建或修改数据成功。',
16:   202: '一个请求已经进入后台排队（异步任务）。',
17:   204: '删除数据成功。',
18:   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
19:   401: '用户没有权限（令牌、用户名、密码错误）。',
20:   403: '用户得到授权，但是访问是被禁止的。',
21:   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
22:   406: '请求的格式不可得。',
23:   410: '请求的资源被永久删除，且不会再得到的。',
24:   422: '当创建一个对象时，发生一个验证错误。',
25:   500: '服务器发生错误，请检查服务器。',
26:   502: '网关错误。',
27:   503: '服务不可用，服务器暂时过载或维护。',
28:   504: '网关超时。'
29: };
30: 
31: export function goTo(injector: Injector, url: string): void {
32:   setTimeout(() => injector.get(Router).navigateByUrl(url));
33: }
34: 
35: export function toLogin(injector: Injector): void {
36:   injector.get(NzNotificationService).error(`未登录或登录已过期，请重新登录。`, ``);
37:   goTo(injector, injector.get(DA_SERVICE_TOKEN).login_url!);
38: }
39: 
40: export function getAdditionalHeaders(headers?: HttpHeaders): Record<string, string> {
41:   const res: Record<string, string> = {};
42:   const lang = inject(ALAIN_I18N_TOKEN).currentLang;
43:   if (!headers?.has('Accept-Language') && lang) {
44:     res['Accept-Language'] = lang;
45:   }
46: 
47:   return res;
48: }
49: 
50: export function checkStatus(injector: Injector, ev: HttpResponseBase): void {
51:   if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
52:     return;
53:   }
54: 
55:   const errortext = CODEMESSAGE[ev.status] || ev.statusText;
56:   injector.get(NzNotificationService).error(`请求错误 ${ev.status}: ${ev.url}`, errortext);
57: }
````

## File: src/app/core/net/index.ts
````typescript
1: export { provideBindAuthRefresh } from './refresh-token';
2: export * from './default.interceptor';
````

## File: src/app/core/net/refresh-token.ts
````typescript
  1: import { HttpClient, HttpHandlerFn, HttpRequest, HttpResponseBase } from '@angular/common/http';
  2: import { EnvironmentProviders, Injector, inject, provideAppInitializer } from '@angular/core';
  3: import { DA_SERVICE_TOKEN } from '@delon/auth';
  4: import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError, map } from 'rxjs';
  5: 
  6: import { toLogin } from './helper';
  7: import { SupabaseAuthAdapterService } from '../supabase';
  8: 
  9: let refreshToking = false;
 10: let refreshToken$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
 11: 
 12: /**
 13:  * 重新附加新 Token 信息
 14:  *
 15:  * > 由于已经发起的请求，不会再走一遍 `@delon/auth` 因此需要结合业务情况重新附加新的 Token
 16:  */
 17: function reAttachToken(injector: Injector, req: HttpRequest<any>): HttpRequest<any> {
 18:   const token = injector.get(DA_SERVICE_TOKEN).get()?.token;
 19:   return req.clone({
 20:     setHeaders: {
 21:       token: `Bearer ${token}`
 22:     }
 23:   });
 24: }
 25: 
 26: function refreshTokenRequest(injector: Injector): Observable<any> {
 27:   const adapter = injector.get(SupabaseAuthAdapterService);
 28:   return adapter.refreshSession().pipe(
 29:     map(session => adapter.convertSessionToTokenFormat(session))
 30:   );
 31: }
 32: 
 33: /**
 34:  * 刷新Token方式一：使用 401 重新刷新 Token
 35:  */
 36: export function tryRefreshToken(injector: Injector, ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
 37:   // 1、若请求为刷新Token请求，表示来自刷新Token可以直接跳转登录页
 38:   if ([`/api/auth/refresh`].some(url => req.url.includes(url))) {
 39:     toLogin(injector);
 40:     return throwError(() => ev);
 41:   }
 42:   // 2、如果 `refreshToking` 为 `true` 表示已经在请求刷新 Token 中，后续所有请求转入等待状态，直至结果返回后再重新发起请求
 43:   if (refreshToking) {
 44:     return refreshToken$.pipe(
 45:       filter(v => !!v),
 46:       take(1),
 47:       switchMap(() => next(reAttachToken(injector, req)))
 48:     );
 49:   }
 50:   // 3、尝试调用刷新 Token
 51:   refreshToking = true;
 52:   refreshToken$.next(null);
 53: 
 54:   return refreshTokenRequest(injector).pipe(
 55:     switchMap(res => {
 56:       // 通知后续请求继续执行
 57:       refreshToking = false;
 58:       refreshToken$.next(res);
 59:       // 重新保存新 token
 60:       injector.get(DA_SERVICE_TOKEN).set(res);
 61:       // 重新发起请求
 62:       return next(reAttachToken(injector, req));
 63:     }),
 64:     catchError(err => {
 65:       refreshToking = false;
 66:       toLogin(injector);
 67:       return throwError(() => err);
 68:     })
 69:   );
 70: }
 71: 
 72: function buildAuthRefresh(injector: Injector): void {
 73:   const tokenSrv = injector.get(DA_SERVICE_TOKEN);
 74:   tokenSrv.refresh
 75:     .pipe(
 76:       filter(() => !refreshToking),
 77:       switchMap(res => {
 78:         console.log(res);
 79:         refreshToking = true;
 80:         return refreshTokenRequest(injector);
 81:       })
 82:     )
 83:     .subscribe({
 84:       next: res => {
 85:         // TODO: Mock expired value
 86:         res.expired = +new Date() + 1000 * 60 * 5;
 87:         refreshToking = false;
 88:         tokenSrv.set(res);
 89:       },
 90:       error: () => toLogin(injector)
 91:     });
 92: }
 93: 
 94: /**
 95:  * 刷新Token方式二：使用 `@delon/auth` 的 `refresh` 接口，需要在 `app.config.ts` 中注册 `provideBindAuthRefresh`
 96:  */
 97: export function provideBindAuthRefresh(): EnvironmentProviders[] {
 98:   return [
 99:     provideAppInitializer(() => {
100:       const initializerFn = (
101:         (injector: Injector) => () =>
102:           buildAuthRefresh(injector)
103:       )(inject(Injector));
104:       return initializerFn();
105:     })
106:   ];
107: }
````

## File: src/app/core/permissions/index.ts
````typescript
1: export * from './types';
2: export * from './permission.service';
3: export * from './role.service';
````

## File: src/app/core/permissions/types.ts
````typescript
 1: /**
 2:  * 权限服务类型定义
 3:  * 
 4:  * 参考 docs/30-0-完整SQL表結構定義.md 中的权限表结构
 5:  */
 6: 
 7: /**
 8:  * 角色定义
 9:  * 对应 roles 表
10:  */
11: export interface Role {
12:   id: string;
13:   name: string;
14:   code: string;
15:   description?: string;
16:   is_system_role: boolean;
17:   priority: number;
18:   created_at?: string;
19:   updated_at?: string;
20: }
21: 
22: /**
23:  * 权限定义
24:  * 对应 permissions 表
25:  */
26: export interface Permission {
27:   id: string;
28:   name: string;
29:   resource: string;
30:   action: string;
31:   description?: string;
32:   is_system_permission?: boolean;
33:   created_at?: string;
34: }
35: 
36: /**
37:  * 用户角色关联
38:  * 对应 user_roles 表
39:  */
40: export interface UserRole {
41:   id: string;
42:   account_id: string;
43:   role_id: string;
44:   blueprint_id?: string | null;
45:   branch_id?: string | null;
46:   granted_by?: string | null;
47:   granted_at?: string;
48:   // 关联查询时包含的角色信息
49:   roles?: Role;
50: }
51: 
52: /**
53:  * 分支权限
54:  * 对应 branch_permissions 表
55:  */
56: export interface BranchPermission {
57:   id: string;
58:   branch_id: string;
59:   account_id: string;
60:   permission_level: 'owner' | 'admin' | 'write' | 'read';
61:   granted_by: string;
62:   granted_at?: string;
63: }
64: 
65: /**
66:  * 权限检查结果
67:  */
68: export interface PermissionCheckResult {
69:   hasPermission: boolean;
70:   reason?: string;
71: }
72: 
73: /**
74:  * 权限缓存项
75:  */
76: export interface PermissionCacheItem {
77:   permission: string;
78:   hasPermission: boolean;
79:   expiresAt: number;
80:   roles?: string[];
81:   abilities?: string[];
82: }
````

## File: src/app/core/start-page.guard.ts
````typescript
 1: import { CanActivateFn } from '@angular/router';
 2: import { Observable } from 'rxjs';
 3: 
 4: /**
 5:  * Dynamically load the start page
 6:  *
 7:  * 动态加载启动页
 8:  */
 9: export const startPageGuard: CanActivateFn = (): boolean | Observable<boolean> => {
10:   // Re-jump according to the first item of the menu, you can re-customize the logic
11:   // 以下代码是根据菜单的第一项进行重新跳转，你可以重新定制逻辑
12:   // const menuSrv = inject(MenuService);
13:   // if (menuSrv.find({ url: state.url }) == null) {
14:   //   inject(Router).navigateByUrl(menuSrv.menus[0].link!);
15:   //   return false;
16:   // }
17:   return true;
18: };
````

## File: src/app/core/supabase/index.ts
````typescript
1: export * from './supabase.service';
2: export * from './supabase-auth-adapter.service';
````

## File: src/app/core/supabase/supabase-auth-adapter.service.ts
````typescript
  1: import { Injectable, inject, PLATFORM_ID } from '@angular/core';
  2: import { isPlatformBrowser } from '@angular/common';
  3: import { DA_SERVICE_TOKEN } from '@delon/auth';
  4: import { Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
  5: import { Observable, from, of, throwError, EMPTY } from 'rxjs';
  6: import { map, catchError, switchMap, tap } from 'rxjs/operators';
  7: 
  8: import { SupabaseService } from './supabase.service';
  9: 
 10: /**
 11:  * Supabase Auth 與 @delon/auth 適配器服務
 12:  * 
 13:  * 作為 Supabase Auth 與 @delon/auth 之間的橋樑，實現：
 14:  * 1. Session 格式轉換（Supabase Session → @delon/auth Token 格式）
 15:  * 2. 自動同步 Session 到 TokenService
 16:  * 3. 監聽 Auth 狀態變化
 17:  * 4. Token 刷新處理
 18:  * 
 19:  * @example
 20:  * ```typescript
 21:  * const adapter = inject(SupabaseAuthAdapterService);
 22:  * adapter.signIn('user@example.com', 'password').subscribe();
 23:  * ```
 24:  */
 25: @Injectable({
 26:   providedIn: 'root'
 27: })
 28: export class SupabaseAuthAdapterService {
 29:   private readonly supabaseService = inject(SupabaseService);
 30:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
 31:   private readonly platformId = inject(PLATFORM_ID);
 32:   private authListenerInitialized = false;
 33: 
 34:   constructor() {
 35:     // 在瀏覽器環境中初始化 Auth 監聽器
 36:     if (isPlatformBrowser(this.platformId)) {
 37:       this.initializeAuthListener();
 38:     }
 39:   }
 40: 
 41:   /**
 42:    * 登入
 43:    * 
 44:    * @param email 用戶郵箱
 45:    * @param password 密碼
 46:    * @returns Observable<{ error: AuthError | null }>
 47:    */
 48:   signIn(email: string, password: string): Observable<{ error: AuthError | null }> {
 49:     return from(
 50:       this.supabaseService.client.auth.signInWithPassword({
 51:         email,
 52:         password
 53:       })
 54:     ).pipe(
 55:       tap(({ data, error }) => {
 56:         if (!error && data.session) {
 57:           this.syncSessionToTokenService(data.session);
 58:         }
 59:       }),
 60:       map(({ error }) => ({ error }))
 61:     );
 62:   }
 63: 
 64:   /**
 65:    * 註冊
 66:    * 
 67:    * @param email 用戶郵箱
 68:    * @param password 密碼
 69:    * @param metadata 用戶元數據（可選）
 70:    * @returns Observable<{ error: AuthError | null }>
 71:    */
 72:   signUp(
 73:     email: string,
 74:     password: string,
 75:     metadata?: Record<string, any>
 76:   ): Observable<{ error: AuthError | null }> {
 77:     return from(
 78:       this.supabaseService.client.auth.signUp({
 79:         email,
 80:         password,
 81:         options: {
 82:           data: metadata
 83:         }
 84:       })
 85:     ).pipe(
 86:       tap(({ data, error }) => {
 87:         if (!error && data.session) {
 88:           this.syncSessionToTokenService(data.session);
 89:         }
 90:       }),
 91:       map(({ error }) => ({ error }))
 92:     );
 93:   }
 94: 
 95:   /**
 96:    * 登出
 97:    * 
 98:    * @returns Observable<{ error: AuthError | null }>
 99:    */
100:   signOut(): Observable<{ error: AuthError | null }> {
101:     return from(this.supabaseService.client.auth.signOut()).pipe(
102:       tap(() => {
103:         // 清除 TokenService
104:         this.tokenService.clear();
105:       }),
106:       map(({ error }) => ({ error }))
107:     );
108:   }
109: 
110:   /**
111:    * 刷新 Session
112:    * 
113:    * @returns Observable<Session>
114:    */
115:   refreshSession(): Observable<Session> {
116:     return from(this.supabaseService.client.auth.refreshSession()).pipe(
117:       switchMap(({ data, error }) => {
118:         if (error) {
119:           return throwError(() => error);
120:         }
121:         if (!data.session) {
122:           return throwError(() => new Error('No session available'));
123:         }
124:         this.syncSessionToTokenService(data.session);
125:         return of(data.session);
126:       })
127:     );
128:   }
129: 
130:   /**
131:    * 恢復 Session（應用啟動時調用）
132:    * 
133:    * @returns Observable<void>
134:    */
135:   restoreSession(): Observable<void> {
136:     if (!isPlatformBrowser(this.platformId)) {
137:       return of(undefined);
138:     }
139: 
140:     return from(this.supabaseService.client.auth.getSession()).pipe(
141:       tap(({ data }) => {
142:         if (data.session) {
143:           this.syncSessionToTokenService(data.session);
144:         }
145:       }),
146:       map(() => undefined),
147:       catchError(() => of(undefined))
148:     );
149:   }
150: 
151:   /**
152:    * 初始化 Auth 狀態監聽器
153:    * 監聽 Supabase Auth 狀態變化，自動同步到 TokenService
154:    */
155:   initializeAuthListener(): void {
156:     if (this.authListenerInitialized || !isPlatformBrowser(this.platformId)) {
157:       return;
158:     }
159: 
160:     this.supabaseService.client.auth.onAuthStateChange(
161:       (event: AuthChangeEvent, session: Session | null) => {
162:         if (session) {
163:           this.syncSessionToTokenService(session);
164:         } else if (event === 'SIGNED_OUT') {
165:           this.tokenService.clear();
166:         }
167:       }
168:     );
169: 
170:     this.authListenerInitialized = true;
171:   }
172: 
173:   /**
174:    * 將 Supabase Session 轉換為 @delon/auth Token 格式
175:    * 
176:    * @param session Supabase Session
177:    * @returns @delon/auth Token 格式對象
178:    */
179:   convertSessionToTokenFormat(session: Session): {
180:     token: string;
181:     refresh_token: string;
182:     expired: number;
183:     user: {
184:       id: string;
185:       email?: string;
186:       [key: string]: any;
187:     };
188:   } {
189:     const expiresIn = session.expires_in || 3600; // 預設 1 小時
190:     const expired = Date.now() + expiresIn * 1000;
191: 
192:     return {
193:       token: session.access_token,
194:       refresh_token: session.refresh_token,
195:       expired,
196:       user: {
197:         id: session.user.id,
198:         email: session.user.email,
199:         ...session.user.user_metadata,
200:         ...session.user.app_metadata
201:       }
202:     };
203:   }
204: 
205:   /**
206:    * 同步 Supabase Session 到 @delon/auth TokenService
207:    * 
208:    * @param session Supabase Session
209:    */
210:   private syncSessionToTokenService(session: Session): void {
211:     const tokenData = this.convertSessionToTokenFormat(session);
212:     this.tokenService.set(tokenData);
213:   }
214: 
215:   /**
216:    * 獲取當前 Session
217:    * 
218:    * @returns Observable<Session | null>
219:    */
220:   getCurrentSession(): Observable<Session | null> {
221:     return from(this.supabaseService.client.auth.getSession()).pipe(
222:       map(({ data }) => data.session)
223:     );
224:   }
225: }
````

## File: src/app/core/supabase/supabase.service.ts
````typescript
 1: import { Injectable, inject } from '@angular/core';
 2: import { createClient, SupabaseClient } from '@supabase/supabase-js';
 3: import { environment } from '@env/environment';
 4: 
 5: /**
 6:  * Supabase 客戶端服務
 7:  * 
 8:  * 提供 Supabase 客戶端單例，用於訪問 Supabase 的所有功能：
 9:  * - Database (PostgreSQL)
10:  * - Authentication
11:  * - Storage
12:  * - Realtime
13:  * 
14:  * @example
15:  * ```typescript
16:  * const supabase = inject(SupabaseService);
17:  * const client = supabase.client;
18:  * ```
19:  */
20: @Injectable({
21:   providedIn: 'root'
22: })
23: export class SupabaseService {
24:   private readonly supabase: SupabaseClient;
25: 
26:   constructor() {
27:     const supabaseConfig = (environment as any)['supabase'];
28:     if (!supabaseConfig?.url || !supabaseConfig?.anonKey) {
29:       throw new Error('Supabase configuration is missing. Please check environment variables.');
30:     }
31: 
32:     this.supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
33:       auth: {
34:         persistSession: true,
35:         autoRefreshToken: true,
36:         detectSessionInUrl: true
37:       }
38:     });
39:   }
40: 
41:   /**
42:    * 獲取 Supabase 客戶端實例
43:    */
44:   get client(): SupabaseClient {
45:     return this.supabase;
46:   }
47: }
````

## File: src/app/layout/basic/basic.component.ts
````typescript
  1: import { Component, inject } from '@angular/core';
  2: import { RouterLink, RouterOutlet } from '@angular/router';
  3: import { I18nPipe, SettingsService, User } from '@delon/theme';
  4: import { LayoutDefaultModule, LayoutDefaultOptions } from '@delon/theme/layout-default';
  5: import { SettingDrawerModule } from '@delon/theme/setting-drawer';
  6: import { ThemeBtnComponent } from '@delon/theme/theme-btn';
  7: import { environment } from '@env/environment';
  8: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
  9: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 10: import { NzIconModule } from 'ng-zorro-antd/icon';
 11: import { NzMenuModule } from 'ng-zorro-antd/menu';
 12: 
 13: import { HeaderClearStorageComponent } from './widgets/clear-storage.component';
 14: import { HeaderFullScreenComponent } from './widgets/fullscreen.component';
 15: import { HeaderI18nComponent } from './widgets/i18n.component';
 16: import { HeaderIconComponent } from './widgets/icon.component';
 17: import { HeaderNotifyComponent } from './widgets/notify.component';
 18: import { HeaderRTLComponent } from './widgets/rtl.component';
 19: import { HeaderSearchComponent } from './widgets/search.component';
 20: import { HeaderTaskComponent } from './widgets/task.component';
 21: import { HeaderUserComponent } from './widgets/user.component';
 22: 
 23: @Component({
 24:   selector: 'layout-basic',
 25:   template: `
 26:     <layout-default [options]="options" [asideUser]="asideUserTpl" [content]="contentTpl" [customError]="null">
 27:       <layout-default-header-item direction="left">
 28:         <a layout-default-header-item-trigger href="//github.com/ng-alain/ng-alain" target="_blank">
 29:           <i nz-icon nzType="github"></i>
 30:         </a>
 31:       </layout-default-header-item>
 32:       <layout-default-header-item direction="left" hidden="mobile">
 33:         <a layout-default-header-item-trigger routerLink="/passport/lock">
 34:           <i nz-icon nzType="lock"></i>
 35:         </a>
 36:       </layout-default-header-item>
 37:       <layout-default-header-item direction="left" hidden="pc">
 38:         <div layout-default-header-item-trigger (click)="searchToggleStatus = !searchToggleStatus">
 39:           <i nz-icon nzType="search"></i>
 40:         </div>
 41:       </layout-default-header-item>
 42:       <layout-default-header-item direction="middle">
 43:         <header-search class="alain-default__search" [(toggleChange)]="searchToggleStatus" />
 44:       </layout-default-header-item>
 45:       <layout-default-header-item direction="right">
 46:         <header-notify />
 47:       </layout-default-header-item>
 48:       <layout-default-header-item direction="right" hidden="mobile">
 49:         <header-task />
 50:       </layout-default-header-item>
 51:       <layout-default-header-item direction="right" hidden="mobile">
 52:         <header-icon />
 53:       </layout-default-header-item>
 54:       <layout-default-header-item direction="right" hidden="mobile">
 55:         <div layout-default-header-item-trigger nz-dropdown [nzDropdownMenu]="settingsMenu" nzTrigger="click" nzPlacement="bottomRight">
 56:           <i nz-icon nzType="setting"></i>
 57:         </div>
 58:         <nz-dropdown-menu #settingsMenu="nzDropdownMenu">
 59:           <div nz-menu style="width: 200px;">
 60:             <div nz-menu-item>
 61:               <header-rtl />
 62:             </div>
 63:             <div nz-menu-item>
 64:               <header-fullscreen />
 65:             </div>
 66:             <div nz-menu-item>
 67:               <header-clear-storage />
 68:             </div>
 69:             <div nz-menu-item>
 70:               <header-i18n />
 71:             </div>
 72:           </div>
 73:         </nz-dropdown-menu>
 74:       </layout-default-header-item>
 75:       <layout-default-header-item direction="right">
 76:         <header-user />
 77:       </layout-default-header-item>
 78:       <ng-template #asideUserTpl>
 79:         <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="userMenu" class="alain-default__aside-user">
 80:           <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="user.avatar" />
 81:           <div class="alain-default__aside-user-info">
 82:             <strong>{{ user.name }}</strong>
 83:             <p class="mb0">{{ user.email }}</p>
 84:           </div>
 85:         </div>
 86:         <nz-dropdown-menu #userMenu="nzDropdownMenu">
 87:           <ul nz-menu>
 88:             <li nz-menu-item routerLink="/pro/account/center">{{ 'menu.account.center' | i18n }}</li>
 89:             <li nz-menu-item routerLink="/pro/account/settings">{{ 'menu.account.settings' | i18n }}</li>
 90:           </ul>
 91:         </nz-dropdown-menu>
 92:       </ng-template>
 93:       <ng-template #contentTpl>
 94:         <router-outlet />
 95:       </ng-template>
 96:     </layout-default>
 97:     @if (showSettingDrawer) {
 98:       <setting-drawer />
 99:     }
100:     <theme-btn />
101:   `,
102:   imports: [
103:     RouterOutlet,
104:     RouterLink,
105:     I18nPipe,
106:     LayoutDefaultModule,
107:     NzIconModule,
108:     NzMenuModule,
109:     NzDropDownModule,
110:     NzAvatarModule,
111:     SettingDrawerModule,
112:     ThemeBtnComponent,
113:     HeaderSearchComponent,
114:     HeaderNotifyComponent,
115:     HeaderTaskComponent,
116:     HeaderIconComponent,
117:     HeaderRTLComponent,
118:     HeaderI18nComponent,
119:     HeaderClearStorageComponent,
120:     HeaderFullScreenComponent,
121:     HeaderUserComponent
122:   ]
123: })
124: export class LayoutBasicComponent {
125:   private readonly settings = inject(SettingsService);
126:   options: LayoutDefaultOptions = {
127:     logoExpanded: `./assets/logo-full.svg`,
128:     logoCollapsed: `./assets/logo.svg`
129:   };
130:   searchToggleStatus = false;
131:   showSettingDrawer = !environment.production;
132:   get user(): User {
133:     return this.settings.user;
134:   }
135: }
````

## File: src/app/layout/basic/widgets/clear-storage.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
 2: import { I18nPipe } from '@delon/theme';
 3: import { NzIconModule } from 'ng-zorro-antd/icon';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: import { NzModalService } from 'ng-zorro-antd/modal';
 6: 
 7: @Component({
 8:   selector: 'header-clear-storage',
 9:   template: `
10:     <i nz-icon nzType="tool"></i>
11:     {{ 'menu.clear.local.storage' | i18n }}
12:   `,
13:   host: {
14:     '[class.flex-1]': 'true'
15:   },
16:   changeDetection: ChangeDetectionStrategy.OnPush,
17:   imports: [NzIconModule, I18nPipe]
18: })
19: export class HeaderClearStorageComponent {
20:   private readonly modalSrv = inject(NzModalService);
21:   private readonly messageSrv = inject(NzMessageService);
22: 
23:   @HostListener('click')
24:   _click(): void {
25:     this.modalSrv.confirm({
26:       nzTitle: 'Make sure clear all local storage?',
27:       nzOnOk: () => {
28:         localStorage.clear();
29:         this.messageSrv.success('Clear Finished!');
30:       }
31:     });
32:   }
33: }
````

## File: src/app/layout/basic/widgets/fullscreen.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
 2: import { I18nPipe } from '@delon/theme';
 3: import { NzIconModule } from 'ng-zorro-antd/icon';
 4: import screenfull from 'screenfull';
 5: 
 6: @Component({
 7:   selector: 'header-fullscreen',
 8:   template: `
 9:     <i nz-icon [nzType]="status ? 'fullscreen-exit' : 'fullscreen'"></i>
10:     {{ (status ? 'menu.fullscreen.exit' : 'menu.fullscreen') | i18n }}
11:   `,
12:   host: {
13:     '[class.flex-1]': 'true'
14:   },
15:   changeDetection: ChangeDetectionStrategy.OnPush,
16:   imports: [NzIconModule, I18nPipe]
17: })
18: export class HeaderFullScreenComponent {
19:   status = false;
20: 
21:   @HostListener('window:resize')
22:   _resize(): void {
23:     this.status = screenfull.isFullscreen;
24:   }
25: 
26:   @HostListener('click')
27:   _click(): void {
28:     if (screenfull.isEnabled) {
29:       screenfull.toggle();
30:     }
31:   }
32: }
````

## File: src/app/layout/basic/widgets/i18n.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, Input, booleanAttribute, inject, DOCUMENT } from '@angular/core';
 2: import { I18NService } from '@core';
 3: import { ALAIN_I18N_TOKEN, I18nPipe, SettingsService } from '@delon/theme';
 4: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 5: import { NzIconModule } from 'ng-zorro-antd/icon';
 6: import { NzMenuModule } from 'ng-zorro-antd/menu';
 7: 
 8: @Component({
 9:   selector: 'header-i18n',
10:   template: `
11:     @if (showLangText) {
12:       <div nz-dropdown [nzDropdownMenu]="langMenu" nzPlacement="bottomRight">
13:         <i nz-icon nzType="global"></i>
14:         {{ 'menu.lang' | i18n }}
15:         <i nz-icon nzType="down"></i>
16:       </div>
17:     } @else {
18:       <i nz-dropdown [nzDropdownMenu]="langMenu" nzPlacement="bottomRight" nz-icon nzType="global"></i>
19:     }
20:     <nz-dropdown-menu #langMenu="nzDropdownMenu">
21:       <ul nz-menu>
22:         @for (item of langs; track $index) {
23:           <li nz-menu-item [nzSelected]="item.code === curLangCode" (click)="change(item.code)">
24:             <span role="img" [attr.aria-label]="item.text" class="pr-xs">{{ item.abbr }}</span>
25:             {{ item.text }}
26:           </li>
27:         }
28:       </ul>
29:     </nz-dropdown-menu>
30:   `,
31:   host: {
32:     '[class.flex-1]': 'true'
33:   },
34:   changeDetection: ChangeDetectionStrategy.OnPush,
35:   imports: [I18nPipe, NzDropDownModule, NzIconModule, NzMenuModule]
36: })
37: export class HeaderI18nComponent {
38:   private readonly settings = inject(SettingsService);
39:   private readonly i18n = inject<I18NService>(ALAIN_I18N_TOKEN);
40:   private readonly doc = inject(DOCUMENT);
41:   /** Whether to display language text */
42:   @Input({ transform: booleanAttribute }) showLangText = true;
43: 
44:   get langs(): Array<{ code: string; text: string; abbr: string }> {
45:     return this.i18n.getLangs();
46:   }
47: 
48:   get curLangCode(): string {
49:     return this.settings.layout.lang;
50:   }
51: 
52:   change(lang: string): void {
53:     const spinEl = this.doc.createElement('div');
54:     spinEl.setAttribute('class', `page-loading ant-spin ant-spin-lg ant-spin-spinning`);
55:     spinEl.innerHTML = `<span class="ant-spin-dot ant-spin-dot-spin"><i></i><i></i><i></i><i></i></span>`;
56:     this.doc.body.appendChild(spinEl);
57: 
58:     this.i18n.loadLangData(lang).subscribe(res => {
59:       this.i18n.use(lang, res);
60:       this.settings.setLayout('lang', lang);
61:       setTimeout(() => this.doc.location.reload());
62:     });
63:   }
64: }
````

## File: src/app/layout/basic/widgets/icon.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 2: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 3: import { NzGridModule } from 'ng-zorro-antd/grid';
 4: import { NzIconModule } from 'ng-zorro-antd/icon';
 5: import { NzMenuModule } from 'ng-zorro-antd/menu';
 6: import { NzSpinModule } from 'ng-zorro-antd/spin';
 7: 
 8: @Component({
 9:   selector: 'header-icon',
10:   template: `
11:     <div
12:       class="alain-default__nav-item"
13:       nz-dropdown
14:       [nzDropdownMenu]="iconMenu"
15:       nzTrigger="click"
16:       nzPlacement="bottomRight"
17:       (nzVisibleChange)="change()"
18:     >
19:       <i nz-icon nzType="appstore"></i>
20:     </div>
21:     <nz-dropdown-menu #iconMenu="nzDropdownMenu">
22:       <div nz-menu class="wd-xl animated jello">
23:         <nz-spin [nzSpinning]="loading" [nzTip]="'正在读取数据...'">
24:           <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="app-icons">
25:             <div nz-col [nzSpan]="6">
26:               <i nz-icon nzType="calendar" class="bg-error text-white"></i>
27:               <small>Calendar</small>
28:             </div>
29:             <div nz-col [nzSpan]="6">
30:               <i nz-icon nzType="file" class="bg-geekblue text-white"></i>
31:               <small>Files</small>
32:             </div>
33:             <div nz-col [nzSpan]="6">
34:               <i nz-icon nzType="cloud" class="bg-success text-white"></i>
35:               <small>Cloud</small>
36:             </div>
37:             <div nz-col [nzSpan]="6">
38:               <i nz-icon nzType="star" class="bg-magenta text-white"></i>
39:               <small>Star</small>
40:             </div>
41:             <div nz-col [nzSpan]="6">
42:               <i nz-icon nzType="team" class="bg-purple text-white"></i>
43:               <small>Team</small>
44:             </div>
45:             <div nz-col [nzSpan]="6">
46:               <i nz-icon nzType="scan" class="bg-warning text-white"></i>
47:               <small>QR</small>
48:             </div>
49:             <div nz-col [nzSpan]="6">
50:               <i nz-icon nzType="pay-circle" class="bg-cyan text-white"></i>
51:               <small>Pay</small>
52:             </div>
53:             <div nz-col [nzSpan]="6">
54:               <i nz-icon nzType="printer" class="bg-grey text-white"></i>
55:               <small>Print</small>
56:             </div>
57:           </div>
58:         </nz-spin>
59:       </div>
60:     </nz-dropdown-menu>
61:   `,
62:   changeDetection: ChangeDetectionStrategy.OnPush,
63:   imports: [NzDropDownModule, NzIconModule, NzMenuModule, NzGridModule, NzSpinModule]
64: })
65: export class HeaderIconComponent {
66:   private readonly cdr = inject(ChangeDetectorRef);
67:   loading = true;
68: 
69:   change(): void {
70:     setTimeout(() => {
71:       this.loading = false;
72:       this.cdr.detectChanges();
73:     }, 500);
74:   }
75: }
````

## File: src/app/layout/basic/widgets/notify.component.ts
````typescript
  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
  2: import { NoticeIconList, NoticeIconModule, NoticeIconSelect, NoticeItem } from '@delon/abc/notice-icon';
  3: import { add, formatDistanceToNow, parse } from 'date-fns';
  4: import { NzI18nService } from 'ng-zorro-antd/i18n';
  5: import { NzMessageService } from 'ng-zorro-antd/message';
  6: 
  7: @Component({
  8:   selector: 'header-notify',
  9:   template: `
 10:     <notice-icon
 11:       [data]="data"
 12:       [count]="count"
 13:       [loading]="loading"
 14:       btnClass="alain-default__nav-item"
 15:       btnIconClass="alain-default__nav-item-icon"
 16:       (select)="select($event)"
 17:       (clear)="clear($event)"
 18:       (popoverVisibleChange)="loadData()"
 19:     />
 20:   `,
 21:   changeDetection: ChangeDetectionStrategy.OnPush,
 22:   imports: [NoticeIconModule]
 23: })
 24: export class HeaderNotifyComponent {
 25:   private readonly msg = inject(NzMessageService);
 26:   private readonly nzI18n = inject(NzI18nService);
 27:   private readonly cdr = inject(ChangeDetectorRef);
 28:   data: NoticeItem[] = [
 29:     {
 30:       title: '通知',
 31:       list: [],
 32:       emptyText: '你已查看所有通知',
 33:       emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
 34:       clearText: '清空通知'
 35:     },
 36:     {
 37:       title: '消息',
 38:       list: [],
 39:       emptyText: '您已读完所有消息',
 40:       emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
 41:       clearText: '清空消息'
 42:     },
 43:     {
 44:       title: '待办',
 45:       list: [],
 46:       emptyText: '你已完成所有待办',
 47:       emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
 48:       clearText: '清空待办'
 49:     }
 50:   ];
 51:   count = 5;
 52:   loading = false;
 53: 
 54:   private updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
 55:     const data = this.data.slice();
 56:     data.forEach(i => (i.list = []));
 57: 
 58:     notices.forEach(item => {
 59:       const newItem = { ...item } as NoticeIconList;
 60:       if (typeof newItem.datetime === 'string') {
 61:         newItem.datetime = parse(newItem.datetime, 'yyyy-MM-dd', new Date());
 62:       }
 63:       if (newItem.datetime) {
 64:         newItem.datetime = formatDistanceToNow(newItem.datetime as Date, { locale: this.nzI18n.getDateLocale() });
 65:       }
 66:       if (newItem.extra && newItem['status']) {
 67:         newItem['color'] = (
 68:           {
 69:             todo: undefined,
 70:             processing: 'blue',
 71:             urgent: 'red',
 72:             doing: 'gold'
 73:           } as Record<string, string | undefined>
 74:         )[newItem['status']];
 75:       }
 76:       data.find(w => w.title === newItem['type'])!.list.push(newItem);
 77:     });
 78:     return data;
 79:   }
 80: 
 81:   loadData(): void {
 82:     if (this.loading) {
 83:       return;
 84:     }
 85:     this.loading = true;
 86:     setTimeout(() => {
 87:       const now = new Date();
 88:       this.data = this.updateNoticeData([
 89:         {
 90:           id: '000000001',
 91:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
 92:           title: '你收到了 14 份新周报',
 93:           datetime: add(now, { days: 10 }),
 94:           type: '通知'
 95:         },
 96:         {
 97:           id: '000000002',
 98:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
 99:           title: '你推荐的 曲妮妮 已通过第三轮面试',
100:           datetime: add(now, { days: -3 }),
101:           type: '通知'
102:         },
103:         {
104:           id: '000000003',
105:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
106:           title: '这种模板可以区分多种通知类型',
107:           datetime: add(now, { months: -3 }),
108:           read: true,
109:           type: '通知'
110:         },
111:         {
112:           id: '000000004',
113:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
114:           title: '左侧图标用于区分不同的类型',
115:           datetime: add(now, { years: -1 }),
116:           type: '通知'
117:         },
118:         {
119:           id: '000000005',
120:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
121:           title: '内容不要超过两行字，超出时自动截断',
122:           datetime: '2017-08-07',
123:           type: '通知'
124:         },
125:         {
126:           id: '000000006',
127:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
128:           title: '曲丽丽 评论了你',
129:           description: '描述信息描述信息描述信息',
130:           datetime: '2017-08-07',
131:           type: '消息'
132:         },
133:         {
134:           id: '000000007',
135:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
136:           title: '朱偏右 回复了你',
137:           description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
138:           datetime: '2017-08-07',
139:           type: '消息'
140:         },
141:         {
142:           id: '000000008',
143:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
144:           title: '标题',
145:           description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
146:           datetime: '2017-08-07',
147:           type: '消息'
148:         },
149:         {
150:           id: '000000009',
151:           title: '任务名称',
152:           description: '任务需要在 2017-01-12 20:00 前启动',
153:           extra: '未开始',
154:           status: 'todo',
155:           type: '待办'
156:         },
157:         {
158:           id: '000000010',
159:           title: '第三方紧急代码变更',
160:           description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
161:           extra: '马上到期',
162:           status: 'urgent',
163:           type: '待办'
164:         },
165:         {
166:           id: '000000011',
167:           title: '信息安全考试',
168:           description: '指派竹尔于 2017-01-09 前完成更新并发布',
169:           extra: '已耗时 8 天',
170:           status: 'doing',
171:           type: '待办'
172:         },
173:         {
174:           id: '000000012',
175:           title: 'ABCD 版本发布',
176:           description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
177:           extra: '进行中',
178:           status: 'processing',
179:           type: '待办'
180:         }
181:       ]);
182: 
183:       this.loading = false;
184:       this.cdr.detectChanges();
185:     }, 500);
186:   }
187: 
188:   clear(type: string): void {
189:     this.msg.success(`清空了 ${type}`);
190:   }
191: 
192:   select(res: NoticeIconSelect): void {
193:     this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
194:   }
195: }
````

## File: src/app/layout/basic/widgets/rtl.component.ts
````typescript
 1: import { UpperCasePipe } from '@angular/common';
 2: import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
 3: import { RTLService } from '@delon/theme';
 4: import { NzIconModule } from 'ng-zorro-antd/icon';
 5: 
 6: @Component({
 7:   selector: 'header-rtl',
 8:   template: `
 9:     <i nz-icon [nzType]="rtl.nextDir === 'rtl' ? 'border-left' : 'border-right'"></i>
10:     {{ rtl.nextDir | uppercase }}
11:   `,
12:   host: {
13:     '[class.flex-1]': 'true'
14:   },
15:   changeDetection: ChangeDetectionStrategy.OnPush,
16:   imports: [NzIconModule, UpperCasePipe]
17: })
18: export class HeaderRTLComponent {
19:   readonly rtl = inject(RTLService);
20: 
21:   @HostListener('click')
22:   toggleDirection(): void {
23:     this.rtl.toggle();
24:   }
25: }
````

## File: src/app/layout/basic/widgets/search.component.ts
````typescript
  1: import {
  2:   AfterViewInit,
  3:   ChangeDetectionStrategy,
  4:   ChangeDetectorRef,
  5:   Component,
  6:   ElementRef,
  7:   EventEmitter,
  8:   HostBinding,
  9:   Input,
 10:   OnDestroy,
 11:   Output,
 12:   inject
 13: } from '@angular/core';
 14: import { FormsModule } from '@angular/forms';
 15: import { I18nPipe } from '@delon/theme';
 16: import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
 17: import { NzIconModule } from 'ng-zorro-antd/icon';
 18: import { NzInputModule } from 'ng-zorro-antd/input';
 19: import { BehaviorSubject, debounceTime, distinctUntilChanged, tap } from 'rxjs';
 20: 
 21: @Component({
 22:   selector: 'header-search',
 23:   template: `
 24:     <nz-input-group [nzPrefix]="iconTpl" [nzSuffix]="loadingTpl">
 25:       <ng-template #iconTpl>
 26:         <i nz-icon [nzType]="focus ? 'arrow-down' : 'search'"></i>
 27:       </ng-template>
 28:       <ng-template #loadingTpl>
 29:         @if (loading) {
 30:           <i nz-icon nzType="loading"></i>
 31:         }
 32:       </ng-template>
 33:       <input
 34:         type="text"
 35:         nz-input
 36:         [(ngModel)]="q"
 37:         [nzAutocomplete]="auto"
 38:         (input)="search($event)"
 39:         (focus)="qFocus()"
 40:         (blur)="qBlur()"
 41:         hotkey="F1"
 42:         [attr.placeholder]="'menu.search.placeholder' | i18n"
 43:       />
 44:     </nz-input-group>
 45:     <nz-autocomplete nzBackfill #auto>
 46:       @for (i of options; track $index) {
 47:         <nz-auto-option [nzValue]="i">{{ i }}</nz-auto-option>
 48:       }
 49:     </nz-autocomplete>
 50:   `,
 51:   changeDetection: ChangeDetectionStrategy.OnPush,
 52:   imports: [FormsModule, I18nPipe, NzInputModule, NzIconModule, NzAutocompleteModule]
 53: })
 54: export class HeaderSearchComponent implements AfterViewInit, OnDestroy {
 55:   private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
 56:   private readonly cdr = inject(ChangeDetectorRef);
 57:   q = '';
 58:   qIpt: HTMLInputElement | null = null;
 59:   options: string[] = [];
 60:   search$ = new BehaviorSubject('');
 61:   loading = false;
 62: 
 63:   @HostBinding('class.alain-default__search-focus')
 64:   focus = false;
 65:   @HostBinding('class.alain-default__search-toggled')
 66:   searchToggled = false;
 67: 
 68:   @Input()
 69:   set toggleChange(value: boolean) {
 70:     if (typeof value === 'undefined') {
 71:       return;
 72:     }
 73:     this.searchToggled = value;
 74:     this.focus = value;
 75:     if (value) {
 76:       setTimeout(() => this.qIpt!.focus());
 77:     }
 78:   }
 79:   @Output() readonly toggleChangeChange = new EventEmitter<boolean>();
 80: 
 81:   ngAfterViewInit(): void {
 82:     this.qIpt = this.el.querySelector('.ant-input') as HTMLInputElement;
 83:     this.search$
 84:       .pipe(
 85:         debounceTime(500),
 86:         distinctUntilChanged(),
 87:         tap({
 88:           complete: () => {
 89:             this.loading = true;
 90:           }
 91:         })
 92:       )
 93:       .subscribe(value => {
 94:         this.options = value ? [value, value + value, value + value + value] : [];
 95:         this.loading = false;
 96:         this.cdr.detectChanges();
 97:       });
 98:   }
 99: 
100:   qFocus(): void {
101:     this.focus = true;
102:   }
103: 
104:   qBlur(): void {
105:     this.focus = false;
106:     this.searchToggled = false;
107:     this.options.length = 0;
108:     this.toggleChangeChange.emit(false);
109:   }
110: 
111:   search(ev: Event): void {
112:     this.search$.next((ev.target as HTMLInputElement).value);
113:   }
114: 
115:   ngOnDestroy(): void {
116:     this.search$.complete();
117:     this.search$.unsubscribe();
118:   }
119: }
````

## File: src/app/layout/basic/widgets/task.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 2: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
 3: import { NzBadgeModule } from 'ng-zorro-antd/badge';
 4: import { NzCardModule } from 'ng-zorro-antd/card';
 5: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 6: import { NzGridModule } from 'ng-zorro-antd/grid';
 7: import { NzIconModule } from 'ng-zorro-antd/icon';
 8: import { NzSpinModule } from 'ng-zorro-antd/spin';
 9: 
10: @Component({
11:   selector: 'header-task',
12:   template: `
13:     <div
14:       class="alain-default__nav-item"
15:       nz-dropdown
16:       [nzDropdownMenu]="taskMenu"
17:       nzTrigger="click"
18:       nzPlacement="bottomRight"
19:       (nzVisibleChange)="change()"
20:     >
21:       <nz-badge [nzDot]="true">
22:         <i nz-icon nzType="bell" class="alain-default__nav-item-icon"></i>
23:       </nz-badge>
24:     </div>
25:     <nz-dropdown-menu #taskMenu="nzDropdownMenu">
26:       <div nz-menu class="wd-lg">
27:         @if (loading) {
28:           <div class="mx-lg p-lg"><nz-spin /></div>
29:         } @else {
30:           <nz-card nzTitle="Notifications" nzBordered="false" class="ant-card__body-nopadding">
31:             <ng-template #extra><i nz-icon nzType="plus"></i></ng-template>
32:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
33:               <div nz-col [nzSpan]="4" class="text-center">
34:                 <nz-avatar [nzSrc]="'./assets/tmp/img/1.png'" />
35:               </div>
36:               <div nz-col [nzSpan]="20">
37:                 <strong>cipchk</strong>
38:                 <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
39:               </div>
40:             </div>
41:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
42:               <div nz-col [nzSpan]="4" class="text-center">
43:                 <nz-avatar [nzSrc]="'./assets/tmp/img/2.png'" />
44:               </div>
45:               <div nz-col [nzSpan]="20">
46:                 <strong>はなさき</strong>
47:                 <p class="mb0">ハルカソラトキヘダツヒカリ</p>
48:               </div>
49:             </div>
50:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
51:               <div nz-col [nzSpan]="4" class="text-center">
52:                 <nz-avatar [nzSrc]="'./assets/tmp/img/3.png'" />
53:               </div>
54:               <div nz-col [nzSpan]="20">
55:                 <strong>苏先生</strong>
56:                 <p class="mb0">请告诉我，我应该说点什么好？</p>
57:               </div>
58:             </div>
59:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
60:               <div nz-col [nzSpan]="4" class="text-center">
61:                 <nz-avatar [nzSrc]="'./assets/tmp/img/4.png'" />
62:               </div>
63:               <div nz-col [nzSpan]="20">
64:                 <strong>Kent</strong>
65:                 <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
66:               </div>
67:             </div>
68:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
69:               <div nz-col [nzSpan]="4" class="text-center">
70:                 <nz-avatar [nzSrc]="'./assets/tmp/img/5.png'" />
71:               </div>
72:               <div nz-col [nzSpan]="20">
73:                 <strong>Jefferson</strong>
74:                 <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
75:               </div>
76:             </div>
77:             <div nz-row>
78:               <div nz-col [nzSpan]="24" class="pt-md border-top-1 text-center text-grey point">See All</div>
79:             </div>
80:           </nz-card>
81:         }
82:       </div>
83:     </nz-dropdown-menu>
84:   `,
85:   changeDetection: ChangeDetectionStrategy.OnPush,
86:   imports: [NzDropDownModule, NzBadgeModule, NzIconModule, NzSpinModule, NzGridModule, NzAvatarModule, NzCardModule]
87: })
88: export class HeaderTaskComponent {
89:   private readonly cdr = inject(ChangeDetectorRef);
90:   loading = true;
91: 
92:   change(): void {
93:     setTimeout(() => {
94:       this.loading = false;
95:       this.cdr.detectChanges();
96:     }, 500);
97:   }
98: }
````

## File: src/app/layout/basic/widgets/user.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { Router, RouterLink } from '@angular/router';
 3: import { DA_SERVICE_TOKEN } from '@delon/auth';
 4: import { I18nPipe, SettingsService, User } from '@delon/theme';
 5: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
 6: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 7: import { NzIconModule } from 'ng-zorro-antd/icon';
 8: import { NzMenuModule } from 'ng-zorro-antd/menu';
 9: 
10: @Component({
11:   selector: 'header-user',
12:   template: `
13:     <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
14:       <nz-avatar [nzSrc]="user.avatar" nzSize="small" class="mr-sm" />
15:       {{ user.name }}
16:     </div>
17:     <nz-dropdown-menu #userMenu="nzDropdownMenu">
18:       <div nz-menu class="width-sm">
19:         <div nz-menu-item routerLink="/pro/account/center">
20:           <i nz-icon nzType="user" class="mr-sm"></i>
21:           {{ 'menu.account.center' | i18n }}
22:         </div>
23:         <div nz-menu-item routerLink="/pro/account/settings">
24:           <i nz-icon nzType="setting" class="mr-sm"></i>
25:           {{ 'menu.account.settings' | i18n }}
26:         </div>
27:         <div nz-menu-item routerLink="/exception/trigger">
28:           <i nz-icon nzType="close-circle" class="mr-sm"></i>
29:           {{ 'menu.account.trigger' | i18n }}
30:         </div>
31:         <li nz-menu-divider></li>
32:         <div nz-menu-item (click)="logout()">
33:           <i nz-icon nzType="logout" class="mr-sm"></i>
34:           {{ 'menu.account.logout' | i18n }}
35:         </div>
36:       </div>
37:     </nz-dropdown-menu>
38:   `,
39:   changeDetection: ChangeDetectionStrategy.OnPush,
40:   imports: [RouterLink, NzDropDownModule, NzMenuModule, NzIconModule, I18nPipe, NzAvatarModule]
41: })
42: export class HeaderUserComponent {
43:   private readonly settings = inject(SettingsService);
44:   private readonly router = inject(Router);
45:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
46:   get user(): User {
47:     return this.settings.user;
48:   }
49: 
50:   logout(): void {
51:     this.tokenService.clear();
52:     this.router.navigateByUrl(this.tokenService.login_url!);
53:   }
54: }
````

## File: src/app/layout/blank/blank.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { RouterOutlet } from '@angular/router';
 3: 
 4: @Component({
 5:   selector: 'layout-blank',
 6:   template: `<router-outlet />`,
 7:   host: {
 8:     '[class.alain-blank]': 'true'
 9:   },
10:   imports: [RouterOutlet]
11: })
12: export class LayoutBlankComponent {}
````

## File: src/app/layout/index.ts
````typescript
1: export * from './basic/basic.component';
2: export * from './blank/blank.component';
3: export * from './passport/passport.component';
````

## File: src/app/layout/passport/passport.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { RouterOutlet } from '@angular/router';
 3: import { GlobalFooterModule } from '@delon/abc/global-footer';
 4: import { DA_SERVICE_TOKEN } from '@delon/auth';
 5: import { ThemeBtnComponent } from '@delon/theme/theme-btn';
 6: import { NzIconModule } from 'ng-zorro-antd/icon';
 7: 
 8: import { HeaderI18nComponent } from '../basic/widgets/i18n.component';
 9: 
10: @Component({
11:   selector: 'layout-passport',
12:   template: `
13:     <div class="container">
14:       <header-i18n showLangText="false" class="langs" />
15:       <div class="wrap">
16:         <div class="top">
17:           <div class="head">
18:             <img class="logo" src="./assets/logo-color.svg" />
19:             <span class="title">NG-ALAIN</span>
20:           </div>
21:           <div class="desc">武林中最有影响力的《葵花宝典》；欲练神功，挥刀自宫</div>
22:         </div>
23:         <router-outlet />
24:         <global-footer [links]="links">
25:           Copyright
26:           <i nz-icon nzType="copyright"></i> 2023 <a href="//github.com/cipchk" target="_blank">卡色</a>出品
27:         </global-footer>
28:       </div>
29:     </div>
30:     <theme-btn />
31:   `,
32:   styleUrls: ['./passport.component.less'],
33:   imports: [RouterOutlet, HeaderI18nComponent, GlobalFooterModule, NzIconModule, ThemeBtnComponent]
34: })
35: export class LayoutPassportComponent implements OnInit {
36:   private tokenService = inject(DA_SERVICE_TOKEN);
37: 
38:   links = [
39:     {
40:       title: '帮助',
41:       href: ''
42:     },
43:     {
44:       title: '隐私',
45:       href: ''
46:     },
47:     {
48:       title: '条款',
49:       href: ''
50:     }
51:   ];
52: 
53:   ngOnInit(): void {
54:     this.tokenService.clear();
55:   }
56: }
````

## File: src/app/routes/accounts/bots/bot-list.component.ts
````typescript
  1: import { Component, OnInit, inject } from '@angular/core';
  2: import { Router } from '@angular/router';
  3: import { STColumn } from '@delon/abc/st';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { AccountService, Account } from '@shared';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: 
  8: @Component({
  9:   selector: 'app-bot-list',
 10:   standalone: true,
 11:   imports: [SHARED_IMPORTS],
 12:   template: `
 13:     <page-header [title]="'机器人管理'">
 14:       <ng-template #extra>
 15:         <button nz-button nzType="primary" (click)="createBot()">
 16:           <span nz-icon nzType="plus"></span>
 17:           新建机器人
 18:         </button>
 19:       </ng-template>
 20:     </page-header>
 21: 
 22:     <nz-card nzTitle="管理系统中的所有机器人账户" style="margin-top: 16px;">
 23:       <st
 24:         #st
 25:         [data]="bots()"
 26:         [columns]="columns"
 27:         [loading]="loading()"
 28:         [page]="{ front: false, show: true, showSize: true }"
 29:         (change)="onTableChange($event)"
 30:       >
 31:         <ng-template #status let-record>
 32:           @switch (record.status) {
 33:             @case ('active') {
 34:               <nz-tag nzColor="success">活跃</nz-tag>
 35:             }
 36:             @case ('inactive') {
 37:               <nz-tag nzColor="default">非活跃</nz-tag>
 38:             }
 39:             @case ('suspended') {
 40:               <nz-tag nzColor="error">已暂停</nz-tag>
 41:             }
 42:           }
 43:         </ng-template>
 44:       </st>
 45:     </nz-card>
 46:   `
 47: })
 48: export class BotListComponent implements OnInit {
 49:   accountService = inject(AccountService);
 50:   router = inject(Router);
 51:   message = inject(NzMessageService);
 52: 
 53:   bots = this.accountService.accounts;
 54:   loading = this.accountService.loading;
 55: 
 56:   columns: STColumn[] = [
 57:     { title: 'ID', index: 'id', width: 100 },
 58:     { title: '机器人名称', index: 'name', width: 200 },
 59:     { title: '邮箱', index: 'email', width: 200 },
 60:     { title: '状态', index: 'status', width: 100, render: 'status' },
 61:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 62:     {
 63:       title: '操作',
 64:       width: 250,
 65:       buttons: [
 66:         {
 67:           text: '查看',
 68:           click: (record: Account) => this.viewDetail(record.id)
 69:         },
 70:         {
 71:           text: '编辑',
 72:           click: (record: Account) => this.edit(record.id)
 73:         },
 74:         {
 75:           text: '配置',
 76:           click: (record: Account) => this.configure(record.id)
 77:         },
 78:         {
 79:           text: '删除',
 80:           type: 'del',
 81:           pop: true,
 82:           click: (record: Account) => this.delete(record.id)
 83:         }
 84:       ]
 85:     }
 86:   ];
 87: 
 88:   ngOnInit(): void {
 89:     this.loadBots();
 90:   }
 91: 
 92:   async loadBots(): Promise<void> {
 93:     try {
 94:       await this.accountService.loadAccounts();
 95:       // 过滤出机器人类型的账户
 96:       // 注意：这里需要根据实际业务逻辑过滤
 97:     } catch (error) {
 98:       this.message.error('加载机器人列表失败');
 99:     }
100:   }
101: 
102:   onTableChange(event: any): void {
103:     // 处理表格变化事件（分页、排序等）
104:   }
105: 
106:   createBot(): void {
107:     this.router.navigate(['/accounts/create'], { queryParams: { type: 'Bot' } });
108:   }
109: 
110:   viewDetail(id: string): void {
111:     this.router.navigate(['/accounts', id]);
112:   }
113: 
114:   edit(id: string): void {
115:     this.router.navigate(['/accounts', id, 'edit']);
116:   }
117: 
118:   configure(id: string): void {
119:     // TODO: 导航到机器人配置页面
120:     this.message.info('机器人配置功能开发中');
121:   }
122: 
123:   async delete(id: string): Promise<void> {
124:     try {
125:       await this.accountService.deleteAccount(id);
126:       this.message.success('删除成功');
127:       await this.loadBots();
128:     } catch (error) {
129:       this.message.error('删除失败');
130:     }
131:   }
132: }
````

## File: src/app/routes/accounts/detail/account-detail.component.ts
````typescript
  1: import { Component, OnInit, inject, computed } from '@angular/core';
  2: import { ActivatedRoute, Router } from '@angular/router';
  3: import { SHARED_IMPORTS } from '@shared';
  4: import { AccountService, Account, AccountType, AccountStatus, TeamService, OrganizationScheduleService } from '@shared';
  5: import { NzMessageService } from 'ng-zorro-antd/message';
  6: 
  7: @Component({
  8:   selector: 'app-account-detail',
  9:   standalone: true,
 10:   imports: [SHARED_IMPORTS],
 11:   template: `
 12:     <page-header [title]="'账户详情'">
 13:       <ng-template #extra>
 14:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 15:           <span nz-icon nzType="arrow-left"></span>
 16:           返回
 17:         </button>
 18:         @if (account()) {
 19:           <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
 20:             <span nz-icon nzType="edit"></span>
 21:             编辑
 22:           </button>
 23:           <button nz-button nzDanger (click)="delete()">
 24:             <span nz-icon nzType="delete"></span>
 25:             删除
 26:           </button>
 27:         }
 28:       </ng-template>
 29:     </page-header>
 30: 
 31:     @if (accountService.loading()) {
 32:       <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 33:         <ng-template #indicator>
 34:           <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 35:         </ng-template>
 36:       </nz-spin>
 37:     } @else if (accountService.error()) {
 38:       <nz-alert
 39:         nzType="error"
 40:         [nzMessage]="'加载失败'"
 41:         [nzDescription]="accountService.error()"
 42:         nzShowIcon
 43:         style="margin: 16px;"
 44:       ></nz-alert>
 45:     } @else if (account()) {
 46:       <div style="padding: 16px;">
 47:         <!-- 账户基本信息 -->
 48:         <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
 49:           <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
 50:             <nz-descriptions-item nzTitle="ID">{{ account()!.id }}</nz-descriptions-item>
 51:             <nz-descriptions-item nzTitle="名称">{{ account()!.name }}</nz-descriptions-item>
 52:             <nz-descriptions-item nzTitle="邮箱">{{ account()!.email || '-' }}</nz-descriptions-item>
 53:             <nz-descriptions-item nzTitle="类型">
 54:               @switch (account()!.type) {
 55:                 @case ('User') {
 56:                   <nz-tag nzColor="blue">用户</nz-tag>
 57:                 }
 58:                 @case ('Bot') {
 59:                   <nz-tag nzColor="purple">机器人</nz-tag>
 60:                 }
 61:                 @case ('Organization') {
 62:                   <nz-tag nzColor="green">组织</nz-tag>
 63:                 }
 64:               }
 65:             </nz-descriptions-item>
 66:             <nz-descriptions-item nzTitle="状态">
 67:               @switch (account()!.status) {
 68:                 @case ('active') {
 69:                   <nz-tag nzColor="success">活跃</nz-tag>
 70:                 }
 71:                 @case ('inactive') {
 72:                   <nz-tag nzColor="default">非活跃</nz-tag>
 73:                 }
 74:                 @case ('suspended') {
 75:                   <nz-tag nzColor="error">已暂停</nz-tag>
 76:                 }
 77:               }
 78:             </nz-descriptions-item>
 79:             <nz-descriptions-item nzTitle="创建时间">
 80:               {{ account()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
 81:             </nz-descriptions-item>
 82:             <nz-descriptions-item nzTitle="更新时间">
 83:               {{ account()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
 84:             </nz-descriptions-item>
 85:           </nz-descriptions>
 86:         </nz-card>
 87: 
 88:         <!-- 组织账户：显示团队信息 -->
 89:         @if (account()!.type === AccountType.ORGANIZATION) {
 90:           <nz-card nzTitle="团队信息" style="margin-bottom: 16px;">
 91:             @if (teamService.loading()) {
 92:               <nz-spin nzSimple></nz-spin>
 93:             } @else if (teamService.teams().length > 0) {
 94:               <nz-table
 95:                 [nzData]="teamService.teams()"
 96:                 [nzShowPagination]="false"
 97:                 [nzSize]="'small'"
 98:               >
 99:                 <thead>
100:                   <tr>
101:                     <th>团队名称</th>
102:                     <th>描述</th>
103:                     <th>创建时间</th>
104:                     <th>操作</th>
105:                   </tr>
106:                 </thead>
107:                 <tbody>
108:                   @for (team of teamService.teams(); track team.id) {
109:                     <tr>
110:                       <td>{{ team.name }}</td>
111:                       <td>{{ team.description || '-' }}</td>
112:                       <td>{{ team.created_at | date: 'yyyy-MM-dd' }}</td>
113:                       <td>
114:                         <button nz-button nzType="link" nzSize="small" (click)="viewTeam(team.id)">
115:                           查看
116:                         </button>
117:                       </td>
118:                     </tr>
119:                   }
120:                 </tbody>
121:               </nz-table>
122:             } @else {
123:               <nz-empty nzNotFoundContent="暂无团队"></nz-empty>
124:             }
125:           </nz-card>
126: 
127:           <!-- 组织账户：显示排班信息 -->
128:           <nz-card nzTitle="排班信息">
129:             @if (scheduleService.loading()) {
130:               <nz-spin nzSimple></nz-spin>
131:             } @else if (scheduleService.schedules().length > 0) {
132:               <nz-table
133:                 [nzData]="scheduleService.schedules()"
134:                 [nzShowPagination]="false"
135:                 [nzSize]="'small'"
136:               >
137:                 <thead>
138:                   <tr>
139:                     <th>日期</th>
140:                     <th>账户</th>
141:                     <th>团队</th>
142:                     <th>备注</th>
143:                   </tr>
144:                 </thead>
145:                 <tbody>
146:                   @for (schedule of scheduleService.schedules(); track schedule.id) {
147:                     <tr>
148:                       <td>{{ schedule.schedule_date | date: 'yyyy-MM-dd' }}</td>
149:                       <td>{{ schedule.account_id || '-' }}</td>
150:                       <td>{{ schedule.team_id || '-' }}</td>
151:                       <td>{{ schedule.notes || '-' }}</td>
152:                     </tr>
153:                   }
154:                 </tbody>
155:               </nz-table>
156:             } @else {
157:               <nz-empty nzNotFoundContent="暂无排班记录"></nz-empty>
158:             }
159:           </nz-card>
160:         }
161:       </div>
162:     } @else {
163:       <nz-empty nzNotFoundContent="账户不存在"></nz-empty>
164:     }
165:   `
166: })
167: export class AccountDetailComponent implements OnInit {
168:   accountService = inject(AccountService);
169:   teamService = inject(TeamService);
170:   scheduleService = inject(OrganizationScheduleService);
171:   route = inject(ActivatedRoute);
172:   router = inject(Router);
173:   message = inject(NzMessageService);
174: 
175:   // 使用 computed 从 Service 获取账户信息
176:   account = computed(() => this.accountService.selectedAccount());
177: 
178:   // 导出枚举供模板使用
179:   AccountType = AccountType;
180:   AccountStatus = AccountStatus;
181: 
182:   ngOnInit(): void {
183:     const accountId = this.route.snapshot.paramMap.get('id');
184:     if (accountId) {
185:       this.loadAccount(accountId);
186:     }
187:   }
188: 
189:   async loadAccount(id: string): Promise<void> {
190:     try {
191:       const account = await this.accountService.loadAccountById(id);
192:       if (account) {
193:         // 如果是组织账户，加载团队和排班信息
194:         if (account.type === AccountType.ORGANIZATION) {
195:           await this.loadTeams(account.id);
196:           await this.loadSchedules(account.id);
197:         }
198:       } else {
199:         this.message.warning('账户不存在');
200:         this.goBack();
201:       }
202:     } catch (error) {
203:       this.message.error('加载账户详情失败');
204:     }
205:   }
206: 
207:   async loadTeams(organizationId: string): Promise<void> {
208:     try {
209:       await this.teamService.loadTeamsByOrganizationId(organizationId);
210:     } catch (error) {
211:       // 静默失败，不影响主流程
212:       console.error('加载团队信息失败', error);
213:     }
214:   }
215: 
216:   async loadSchedules(organizationId: string): Promise<void> {
217:     try {
218:       await this.scheduleService.loadSchedulesByOrganizationId(organizationId);
219:     } catch (error) {
220:       // 静默失败，不影响主流程
221:       console.error('加载排班信息失败', error);
222:     }
223:   }
224: 
225:   goBack(): void {
226:     this.router.navigate(['/accounts']);
227:   }
228: 
229:   edit(): void {
230:     if (this.account()) {
231:       this.router.navigate(['/accounts', this.account()!.id, 'edit']);
232:     }
233:   }
234: 
235:   async delete(): Promise<void> {
236:     if (!this.account()) {
237:       return;
238:     }
239: 
240:     // 使用 nz-modal 确认删除（这里简化处理，实际应该使用 ModalHelper）
241:     if (confirm('确定要删除此账户吗？此操作不可恢复。')) {
242:       try {
243:         await this.accountService.deleteAccount(this.account()!.id);
244:         this.message.success('删除成功');
245:         this.goBack();
246:       } catch (error) {
247:         this.message.error('删除失败');
248:       }
249:     }
250:   }
251: 
252:   viewTeam(teamId: string): void {
253:     this.router.navigate(['/accounts/teams', teamId]);
254:   }
255: }
````

## File: src/app/routes/accounts/form/account-form.component.ts
````typescript
  1: import { Component, OnInit, inject, computed } from '@angular/core';
  2: import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  3: import { ActivatedRoute, Router } from '@angular/router';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { AccountService, Account, AccountType, AccountStatus, AccountInsert, AccountUpdate } from '@shared';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: 
  8: /**
  9:  * 账户表单类型定义
 10:  */
 11: interface AccountFormValue {
 12:   name: string;
 13:   email: string | null;
 14:   type: AccountType;
 15:   status?: AccountStatus;
 16: }
 17: 
 18: @Component({
 19:   selector: 'app-account-form',
 20:   standalone: true,
 21:   imports: [SHARED_IMPORTS, ReactiveFormsModule],
 22:   template: `
 23:     <page-header [title]="isEditMode() ? '编辑账户' : '创建账户'">
 24:       <ng-template #extra>
 25:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 26:           <span nz-icon nzType="arrow-left"></span>
 27:           返回
 28:         </button>
 29:       </ng-template>
 30:     </page-header>
 31: 
 32:     <div style="padding: 16px;">
 33:       @if (accountService.loading()) {
 34:         <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 35:           <ng-template #indicator>
 36:             <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 37:           </ng-template>
 38:         </nz-spin>
 39:       } @else {
 40:         <nz-card [nzTitle]="isEditMode() ? '编辑账户信息' : '创建新账户'">
 41:           <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
 42:             <nz-form-item>
 43:               <nz-form-label [nzSpan]="4" nzRequired>账户名称</nz-form-label>
 44:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入账户名称'">
 45:                 <input nz-input formControlName="name" placeholder="请输入账户名称" />
 46:               </nz-form-control>
 47:             </nz-form-item>
 48: 
 49:             <nz-form-item>
 50:               <nz-form-label [nzSpan]="4" nzRequired>邮箱</nz-form-label>
 51:               <nz-form-control
 52:                 [nzSpan]="20"
 53:                 [nzErrorTip]="form.get('email')?.hasError('required') ? '请输入邮箱' : '请输入有效的邮箱地址'"
 54:               >
 55:                 <input nz-input formControlName="email" type="email" placeholder="请输入邮箱地址" />
 56:               </nz-form-control>
 57:             </nz-form-item>
 58: 
 59:             <nz-form-item>
 60:               <nz-form-label [nzSpan]="4" nzRequired>账户类型</nz-form-label>
 61:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择账户类型'">
 62:                 <nz-select formControlName="type" nzPlaceHolder="请选择账户类型">
 63:                   <nz-option [nzValue]="AccountType.USER" nzLabel="用户"></nz-option>
 64:                   <nz-option [nzValue]="AccountType.BOT" nzLabel="机器人"></nz-option>
 65:                   <nz-option [nzValue]="AccountType.ORGANIZATION" nzLabel="组织"></nz-option>
 66:                 </nz-select>
 67:               </nz-form-control>
 68:             </nz-form-item>
 69: 
 70:             @if (isEditMode()) {
 71:               <nz-form-item>
 72:                 <nz-form-label [nzSpan]="4">状态</nz-form-label>
 73:                 <nz-form-control [nzSpan]="20">
 74:                   <nz-select formControlName="status" nzPlaceHolder="请选择状态">
 75:                     <nz-option [nzValue]="AccountStatus.ACTIVE" nzLabel="活跃"></nz-option>
 76:                     <nz-option [nzValue]="AccountStatus.INACTIVE" nzLabel="非活跃"></nz-option>
 77:                     <nz-option [nzValue]="AccountStatus.SUSPENDED" nzLabel="已暂停"></nz-option>
 78:                   </nz-select>
 79:                 </nz-form-control>
 80:               </nz-form-item>
 81:             }
 82: 
 83:             <nz-form-item>
 84:               <nz-form-control [nzSpan]="24" [nzOffset]="4">
 85:                 <button nz-button nzType="primary" [nzLoading]="accountService.loading()" [disabled]="form.invalid">
 86:                   <span nz-icon nzType="save"></span>
 87:                   {{ isEditMode() ? '保存' : '创建' }}
 88:                 </button>
 89:                 <button nz-button nzType="default" type="button" (click)="goBack()" style="margin-left: 8px;">
 90:                   取消
 91:                 </button>
 92:               </nz-form-control>
 93:             </nz-form-item>
 94:           </form>
 95:         </nz-card>
 96:       }
 97:     </div>
 98:   `
 99: })
100: export class AccountFormComponent implements OnInit {
101:   accountService = inject(AccountService);
102:   route = inject(ActivatedRoute);
103:   router = inject(Router);
104:   message = inject(NzMessageService);
105: 
106:   // 导出枚举供模板使用
107:   AccountType = AccountType;
108:   AccountStatus = AccountStatus;
109: 
110:   // 判断是否为编辑模式
111:   isEditMode = computed(() => {
112:     const id = this.route.snapshot.paramMap.get('id');
113:     return !!id;
114:   });
115: 
116:   // 表单定义
117:   form = new FormGroup<{
118:     name: FormControl<string>;
119:     email: FormControl<string | null>;
120:     type: FormControl<AccountType>;
121:     status?: FormControl<AccountStatus>;
122:   }>({
123:     name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
124:     email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
125:     type: new FormControl(AccountType.USER, { nonNullable: true, validators: [Validators.required] }),
126:     status: new FormControl(AccountStatus.ACTIVE, { nonNullable: true })
127:   });
128: 
129:   ngOnInit(): void {
130:     if (this.isEditMode()) {
131:       const accountId = this.route.snapshot.paramMap.get('id');
132:       if (accountId) {
133:         this.loadAccount(accountId);
134:       }
135:     }
136:   }
137: 
138:   async loadAccount(id: string): Promise<void> {
139:     try {
140:       const account = await this.accountService.loadAccountById(id);
141:       if (account) {
142:         this.form.patchValue({
143:           name: account.name,
144:           email: account.email,
145:           type: account.type as AccountType,
146:           status: account.status as AccountStatus
147:         });
148:       } else {
149:         this.message.warning('账户不存在');
150:         this.goBack();
151:       }
152:     } catch (error) {
153:       this.message.error('加载账户信息失败');
154:     }
155:   }
156: 
157:   async onSubmit(): Promise<void> {
158:     if (this.form.invalid) {
159:       // 标记所有字段为 touched，显示验证错误
160:       Object.values(this.form.controls).forEach(control => {
161:         if (control.invalid) {
162:           control.markAsTouched();
163:           control.updateValueAndValidity({ onlySelf: true });
164:         }
165:       });
166:       return;
167:     }
168: 
169:     const formValue = this.form.value as AccountFormValue;
170: 
171:     try {
172:       if (this.isEditMode()) {
173:         const accountId = this.route.snapshot.paramMap.get('id')!;
174:         const updateData: AccountUpdate = {
175:           name: formValue.name,
176:           email: formValue.email || undefined,
177:           type: formValue.type,
178:           status: formValue.status
179:         };
180:         await this.accountService.updateAccount(accountId, updateData);
181:         this.message.success('更新成功');
182:         this.router.navigate(['/accounts', accountId]);
183:       } else {
184:         const insertData: AccountInsert = {
185:           name: formValue.name,
186:           email: formValue.email || undefined,
187:           type: formValue.type,
188:           status: formValue.status || AccountStatus.ACTIVE
189:         };
190:         const account = await this.accountService.createAccount(insertData);
191:         this.message.success('创建成功');
192:         this.router.navigate(['/accounts', account.id]);
193:       }
194:     } catch (error) {
195:       this.message.error(this.isEditMode() ? '更新失败' : '创建失败');
196:     }
197:   }
198: 
199:   goBack(): void {
200:     if (this.isEditMode()) {
201:       const accountId = this.route.snapshot.paramMap.get('id');
202:       if (accountId) {
203:         this.router.navigate(['/accounts', accountId]);
204:       } else {
205:         this.router.navigate(['/accounts']);
206:       }
207:     } else {
208:       this.router.navigate(['/accounts']);
209:     }
210:   }
211: }
````

## File: src/app/routes/accounts/list/account-list.component.ts
````typescript
  1: import { Component, OnInit, inject, signal } from '@angular/core';
  2: import { Router } from '@angular/router';
  3: import { STColumn, STData } from '@delon/abc/st';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { AccountService, Account, AccountType, AccountStatus } from '@shared';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: 
  8: @Component({
  9:   selector: 'app-account-list',
 10:   standalone: true,
 11:   imports: [SHARED_IMPORTS],
 12:   template: `
 13:     <page-header [title]="'账户管理'">
 14:       <ng-template #extra>
 15:         <button nz-button nzType="primary" (click)="createAccount()">
 16:           <span nz-icon nzType="plus"></span>
 17:           新建账户
 18:         </button>
 19:       </ng-template>
 20:     </page-header>
 21: 
 22:     <nz-card nzTitle="管理系统中的所有账户" style="margin-top: 16px;">
 23:       <st
 24:         #st
 25:         [data]="accountService.accounts()"
 26:         [columns]="columns"
 27:         [loading]="accountService.loading()"
 28:         [page]="{ front: false, show: true, showSize: true }"
 29:         (change)="onTableChange($event)"
 30:       >
 31:         <ng-template #type let-record>
 32:           @switch (record.type) {
 33:             @case ('User') {
 34:               <nz-tag nzColor="blue">用户</nz-tag>
 35:             }
 36:             @case ('Bot') {
 37:               <nz-tag nzColor="purple">机器人</nz-tag>
 38:             }
 39:             @case ('Organization') {
 40:               <nz-tag nzColor="green">组织</nz-tag>
 41:             }
 42:           }
 43:         </ng-template>
 44: 
 45:         <ng-template #status let-record>
 46:           @switch (record.status) {
 47:             @case ('active') {
 48:               <nz-tag nzColor="success">活跃</nz-tag>
 49:             }
 50:             @case ('inactive') {
 51:               <nz-tag nzColor="default">非活跃</nz-tag>
 52:             }
 53:             @case ('suspended') {
 54:               <nz-tag nzColor="error">已暂停</nz-tag>
 55:             }
 56:           }
 57:         </ng-template>
 58:       </st>
 59:     </nz-card>
 60:   `
 61: })
 62: export class AccountListComponent implements OnInit {
 63:   accountService = inject(AccountService);
 64:   router = inject(Router);
 65:   message = inject(NzMessageService);
 66: 
 67:   columns: STColumn[] = [
 68:     { title: 'ID', index: 'id', width: 100 },
 69:     { title: '名称', index: 'name', width: 200 },
 70:     { title: '类型', index: 'type', width: 100, render: 'type' },
 71:     { title: '邮箱', index: 'email', width: 200 },
 72:     { title: '状态', index: 'status', width: 100, render: 'status' },
 73:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 74:     {
 75:       title: '操作',
 76:       width: 200,
 77:       buttons: [
 78:         {
 79:           text: '查看',
 80:           click: (record: Account) => this.viewDetail(record.id)
 81:         },
 82:         {
 83:           text: '编辑',
 84:           click: (record: Account) => this.edit(record.id)
 85:         },
 86:         {
 87:           text: '删除',
 88:           type: 'del',
 89:           pop: true,
 90:           click: (record: Account) => this.delete(record.id)
 91:         }
 92:       ]
 93:     }
 94:   ];
 95: 
 96:   ngOnInit(): void {
 97:     this.loadAccounts();
 98:   }
 99: 
100:   async loadAccounts(): Promise<void> {
101:     try {
102:       await this.accountService.loadAccounts();
103:     } catch (error) {
104:       this.message.error('加载账户列表失败');
105:     }
106:   }
107: 
108:   onTableChange(event: any): void {
109:     // 处理表格变化事件（分页、排序等）
110:   }
111: 
112:   createAccount(): void {
113:     this.router.navigate(['/accounts/create']);
114:   }
115: 
116:   viewDetail(id: string): void {
117:     this.router.navigate(['/accounts', id]);
118:   }
119: 
120:   edit(id: string): void {
121:     this.router.navigate(['/accounts', id, 'edit']);
122:   }
123: 
124:   async delete(id: string): Promise<void> {
125:     try {
126:       await this.accountService.deleteAccount(id);
127:       this.message.success('删除成功');
128:     } catch (error) {
129:       this.message.error('删除失败');
130:     }
131:   }
132: }
````

## File: src/app/routes/accounts/organizations/organization-list.component.ts
````typescript
  1: import { Component, OnInit, inject } from '@angular/core';
  2: import { Router } from '@angular/router';
  3: import { STColumn } from '@delon/abc/st';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { AccountService, Account } from '@shared';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: 
  8: @Component({
  9:   selector: 'app-organization-list',
 10:   standalone: true,
 11:   imports: [SHARED_IMPORTS],
 12:   template: `
 13:     <page-header [title]="'组织管理'">
 14:       <ng-template #extra>
 15:         <button nz-button nzType="primary" (click)="createOrganization()">
 16:           <span nz-icon nzType="plus"></span>
 17:           新建组织
 18:         </button>
 19:       </ng-template>
 20:     </page-header>
 21: 
 22:     <nz-card nzTitle="管理系统中的所有组织账户" style="margin-top: 16px;">
 23:       <st
 24:         #st
 25:         [data]="organizations()"
 26:         [columns]="columns"
 27:         [loading]="loading()"
 28:         [page]="{ front: false, show: true, showSize: true }"
 29:         (change)="onTableChange($event)"
 30:       >
 31:         <ng-template #status let-record>
 32:           @switch (record.status) {
 33:             @case ('active') {
 34:               <nz-tag nzColor="success">活跃</nz-tag>
 35:             }
 36:             @case ('inactive') {
 37:               <nz-tag nzColor="default">非活跃</nz-tag>
 38:             }
 39:             @case ('suspended') {
 40:               <nz-tag nzColor="error">已暂停</nz-tag>
 41:             }
 42:           }
 43:         </ng-template>
 44:       </st>
 45:     </nz-card>
 46:   `
 47: })
 48: export class OrganizationListComponent implements OnInit {
 49:   accountService = inject(AccountService);
 50:   router = inject(Router);
 51:   message = inject(NzMessageService);
 52: 
 53:   organizations = this.accountService.accounts;
 54:   loading = this.accountService.loading;
 55: 
 56:   columns: STColumn[] = [
 57:     { title: 'ID', index: 'id', width: 100 },
 58:     { title: '组织名称', index: 'name', width: 200 },
 59:     { title: '邮箱', index: 'email', width: 200 },
 60:     { title: '状态', index: 'status', width: 100, render: 'status' },
 61:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 62:     {
 63:       title: '操作',
 64:       width: 250,
 65:       buttons: [
 66:         {
 67:           text: '查看',
 68:           click: (record: Account) => this.viewDetail(record.id)
 69:         },
 70:         {
 71:           text: '编辑',
 72:           click: (record: Account) => this.edit(record.id)
 73:         },
 74:         {
 75:           text: '成员管理',
 76:           click: (record: Account) => this.manageMembers(record.id)
 77:         },
 78:         {
 79:           text: '删除',
 80:           type: 'del',
 81:           pop: true,
 82:           click: (record: Account) => this.delete(record.id)
 83:         }
 84:       ]
 85:     }
 86:   ];
 87: 
 88:   ngOnInit(): void {
 89:     this.loadOrganizations();
 90:   }
 91: 
 92:   async loadOrganizations(): Promise<void> {
 93:     try {
 94:       await this.accountService.loadAccounts();
 95:       // 过滤出组织类型的账户
 96:       // 注意：这里需要根据实际业务逻辑过滤
 97:     } catch (error) {
 98:       this.message.error('加载组织列表失败');
 99:     }
100:   }
101: 
102:   onTableChange(event: any): void {
103:     // 处理表格变化事件（分页、排序等）
104:   }
105: 
106:   createOrganization(): void {
107:     this.router.navigate(['/accounts/create'], { queryParams: { type: 'Organization' } });
108:   }
109: 
110:   viewDetail(id: string): void {
111:     this.router.navigate(['/accounts', id]);
112:   }
113: 
114:   edit(id: string): void {
115:     this.router.navigate(['/accounts', id, 'edit']);
116:   }
117: 
118:   manageMembers(id: string): void {
119:     // TODO: 导航到成员管理页面
120:     this.message.info('成员管理功能开发中');
121:   }
122: 
123:   async delete(id: string): Promise<void> {
124:     try {
125:       await this.accountService.deleteAccount(id);
126:       this.message.success('删除成功');
127:       await this.loadOrganizations();
128:     } catch (error) {
129:       this.message.error('删除失败');
130:     }
131:   }
132: }
````

## File: src/app/routes/accounts/schedules/schedule-list.component.ts
````typescript
  1: import { Component, OnInit, inject } from '@angular/core';
  2: import { Router } from '@angular/router';
  3: import { STColumn } from '@delon/abc/st';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { OrganizationScheduleService, OrganizationSchedule } from '@shared';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: 
  8: @Component({
  9:   selector: 'app-schedule-list',
 10:   standalone: true,
 11:   imports: [SHARED_IMPORTS],
 12:   template: `
 13:     <page-header [title]="'排班管理'">
 14:       <ng-template #extra>
 15:         <button nz-button nzType="primary" (click)="createSchedule()">
 16:           <span nz-icon nzType="plus"></span>
 17:           新建排班
 18:         </button>
 19:       </ng-template>
 20:     </page-header>
 21: 
 22:     <nz-card nzTitle="管理系统中的所有排班" style="margin-top: 16px;">
 23:       <st
 24:         #st
 25:         [data]="scheduleService.schedules()"
 26:         [columns]="columns"
 27:         [loading]="scheduleService.loading()"
 28:         [page]="{ front: false, show: true, showSize: true }"
 29:         (change)="onTableChange($event)"
 30:       >
 31:         <ng-template #date let-record>
 32:           {{ record.scheduleDate | date: 'yyyy-MM-dd' }}
 33:         </ng-template>
 34:       </st>
 35:     </nz-card>
 36:   `
 37: })
 38: export class ScheduleListComponent implements OnInit {
 39:   scheduleService = inject(OrganizationScheduleService);
 40:   router = inject(Router);
 41:   message = inject(NzMessageService);
 42: 
 43:   columns: STColumn[] = [
 44:     { title: 'ID', index: 'id', width: 100 },
 45:     { title: '日期', index: 'schedule_date', width: 120, render: 'date' },
 46:     { title: '组织ID', index: 'organization_id', width: 200 },
 47:     { title: '蓝图ID', index: 'blueprint_id', width: 200 },
 48:     { title: '分支ID', index: 'branch_id', width: 200 },
 49:     { title: '账户ID', index: 'account_id', width: 200 },
 50:     { title: '团队ID', index: 'team_id', width: 200 },
 51:     { title: '备注', index: 'notes', width: 200 },
 52:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 53:     {
 54:       title: '操作',
 55:       width: 200,
 56:       buttons: [
 57:         {
 58:           text: '编辑',
 59:           click: (record: OrganizationSchedule) => this.edit(record.id)
 60:         },
 61:         {
 62:           text: '删除',
 63:           type: 'del',
 64:           pop: true,
 65:           click: (record: OrganizationSchedule) => this.delete(record.id)
 66:         }
 67:       ]
 68:     }
 69:   ];
 70: 
 71:   ngOnInit(): void {
 72:     this.loadSchedules();
 73:   }
 74: 
 75:   async loadSchedules(): Promise<void> {
 76:     try {
 77:       await this.scheduleService.loadSchedules();
 78:     } catch (error) {
 79:       this.message.error('加载排班列表失败');
 80:     }
 81:   }
 82: 
 83:   onTableChange(event: any): void {
 84:     // 处理表格变化事件（分页、排序等）
 85:   }
 86: 
 87:   createSchedule(): void {
 88:     // TODO: 实现创建排班功能（可以使用 Modal 或跳转到创建页面）
 89:     this.message.info('创建排班功能待实现');
 90:   }
 91: 
 92:   edit(id: string): void {
 93:     // TODO: 实现编辑排班功能
 94:     this.message.info('编辑排班功能待实现');
 95:   }
 96: 
 97:   async delete(id: string): Promise<void> {
 98:     try {
 99:       await this.scheduleService.deleteSchedule(id);
100:       this.message.success('删除成功');
101:       await this.loadSchedules();
102:     } catch (error) {
103:       this.message.error('删除失败');
104:     }
105:   }
106: }
````

## File: src/app/routes/accounts/teams/team-detail/team-detail.component.ts
````typescript
  1: import { Component, OnInit, inject, computed } from '@angular/core';
  2: import { ActivatedRoute, Router } from '@angular/router';
  3: import { SHARED_IMPORTS } from '@shared';
  4: import { TeamService, Team, TeamMember, TeamMemberRole } from '@shared';
  5: import { NzMessageService } from 'ng-zorro-antd/message';
  6: 
  7: @Component({
  8:   selector: 'app-team-detail',
  9:   standalone: true,
 10:   imports: [SHARED_IMPORTS],
 11:   template: `
 12:     <page-header [title]="'团队详情'">
 13:       <ng-template #extra>
 14:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 15:           <span nz-icon nzType="arrow-left"></span>
 16:           返回
 17:         </button>
 18:         @if (team()) {
 19:           <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
 20:             <span nz-icon nzType="edit"></span>
 21:             编辑
 22:           </button>
 23:           <button nz-button nzDanger (click)="delete()">
 24:             <span nz-icon nzType="delete"></span>
 25:             删除
 26:           </button>
 27:         }
 28:       </ng-template>
 29:     </page-header>
 30: 
 31:     @if (teamService.loading()) {
 32:       <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 33:         <ng-template #indicator>
 34:           <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 35:         </ng-template>
 36:       </nz-spin>
 37:     } @else if (teamService.error()) {
 38:       <nz-alert
 39:         nzType="error"
 40:         [nzMessage]="'加载失败'"
 41:         [nzDescription]="teamService.error()"
 42:         nzShowIcon
 43:         style="margin: 16px;"
 44:       ></nz-alert>
 45:     } @else if (team()) {
 46:       <div style="padding: 16px;">
 47:         <!-- 团队基本信息 -->
 48:         <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
 49:           <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
 50:             <nz-descriptions-item nzTitle="ID">{{ team()!.id }}</nz-descriptions-item>
 51:             <nz-descriptions-item nzTitle="团队名称">{{ team()!.name }}</nz-descriptions-item>
 52:             <nz-descriptions-item nzTitle="描述">{{ team()!.description || '-' }}</nz-descriptions-item>
 53:             <nz-descriptions-item nzTitle="组织ID">{{ team()!.organization_id }}</nz-descriptions-item>
 54:             <nz-descriptions-item nzTitle="创建时间">
 55:               {{ team()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
 56:             </nz-descriptions-item>
 57:             <nz-descriptions-item nzTitle="更新时间">
 58:               {{ team()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
 59:             </nz-descriptions-item>
 60:           </nz-descriptions>
 61:         </nz-card>
 62: 
 63:         <!-- 团队成员列表 -->
 64:         <nz-card nzTitle="团队成员">
 65:           <ng-template #extra>
 66:             <button nz-button nzType="primary" nzSize="small" (click)="addMember()">
 67:               <span nz-icon nzType="plus"></span>
 68:               添加成员
 69:             </button>
 70:           </ng-template>
 71: 
 72:           @if (teamService.teamMembers().length > 0) {
 73:             <nz-table
 74:               [nzData]="teamService.teamMembers()"
 75:               [nzShowPagination]="false"
 76:               [nzSize]="'small'"
 77:             >
 78:               <thead>
 79:                 <tr>
 80:                   <th>账户ID</th>
 81:                   <th>角色</th>
 82:                   <th>加入时间</th>
 83:                   <th>操作</th>
 84:                 </tr>
 85:               </thead>
 86:               <tbody>
 87:                 @for (member of teamService.teamMembers(); track member.id) {
 88:                   <tr>
 89:                     <td>{{ member.account_id }}</td>
 90:                     <td>
 91:                       @switch (member.role) {
 92:                         @case ('leader') {
 93:                           <nz-tag nzColor="red">负责人</nz-tag>
 94:                         }
 95:                         @case ('member') {
 96:                           <nz-tag nzColor="blue">成员</nz-tag>
 97:                         }
 98:                       }
 99:                     </td>
100:                     <td>{{ member.joined_at | date: 'yyyy-MM-dd' }}</td>
101:                     <td>
102:                       <button nz-button nzType="link" nzSize="small" (click)="changeRole(member)">
103:                         变更角色
104:                       </button>
105:                       <button nz-button nzType="link" nzDanger nzSize="small" (click)="removeMember(member.id)">
106:                         移除
107:                       </button>
108:                     </td>
109:                   </tr>
110:                 }
111:               </tbody>
112:             </nz-table>
113:           } @else {
114:             <nz-empty nzNotFoundContent="暂无成员"></nz-empty>
115:           }
116:         </nz-card>
117:       </div>
118:     } @else {
119:       <nz-empty nzNotFoundContent="团队不存在"></nz-empty>
120:     }
121:   `
122: })
123: export class TeamDetailComponent implements OnInit {
124:   teamService = inject(TeamService);
125:   route = inject(ActivatedRoute);
126:   router = inject(Router);
127:   message = inject(NzMessageService);
128: 
129:   // 使用 computed 从 Service 获取团队信息
130:   team = computed(() => this.teamService.selectedTeam());
131: 
132:   // 导出枚举供模板使用
133:   TeamMemberRole = TeamMemberRole;
134: 
135:   ngOnInit(): void {
136:     const teamId = this.route.snapshot.paramMap.get('id');
137:     if (teamId) {
138:       this.loadTeam(teamId);
139:     }
140:   }
141: 
142:   async loadTeam(id: string): Promise<void> {
143:     try {
144:       const team = await this.teamService.loadTeamById(id);
145:       if (!team) {
146:         this.message.warning('团队不存在');
147:         this.goBack();
148:       }
149:     } catch (error) {
150:       this.message.error('加载团队详情失败');
151:     }
152:   }
153: 
154:   goBack(): void {
155:     this.router.navigate(['/accounts/teams']);
156:   }
157: 
158:   edit(): void {
159:     if (this.team()) {
160:       this.router.navigate(['/accounts/teams', this.team()!.id, 'edit']);
161:     }
162:   }
163: 
164:   async delete(): Promise<void> {
165:     if (!this.team()) {
166:       return;
167:     }
168: 
169:     if (confirm('确定要删除此团队吗？此操作不可恢复。')) {
170:       try {
171:         await this.teamService.deleteTeam(this.team()!.id);
172:         this.message.success('删除成功');
173:         this.goBack();
174:       } catch (error) {
175:         this.message.error('删除失败');
176:       }
177:     }
178:   }
179: 
180:   addMember(): void {
181:     // TODO: 实现添加成员功能（可以使用 Modal 或跳转到添加页面）
182:     this.message.info('添加成员功能待实现');
183:   }
184: 
185:   async changeRole(member: TeamMember): Promise<void> {
186:     // TODO: 实现变更角色功能
187:     const newRole = member.role === TeamMemberRole.LEADER ? TeamMemberRole.MEMBER : TeamMemberRole.LEADER;
188:     try {
189:       await this.teamService.updateTeamMemberRole(member.id, newRole);
190:       this.message.success('角色变更成功');
191:     } catch (error) {
192:       this.message.error('角色变更失败');
193:     }
194:   }
195: 
196:   async removeMember(memberId: string): Promise<void> {
197:     if (confirm('确定要移除此成员吗？')) {
198:       try {
199:         await this.teamService.removeTeamMember(memberId);
200:         this.message.success('移除成功');
201:       } catch (error) {
202:         this.message.error('移除失败');
203:       }
204:     }
205:   }
206: }
````

## File: src/app/routes/accounts/teams/team-list.component.ts
````typescript
  1: import { Component, OnInit, inject, computed } from '@angular/core';
  2: import { Router } from '@angular/router';
  3: import { STColumn } from '@delon/abc/st';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { TeamService, Team } from '@shared';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: 
  8: @Component({
  9:   selector: 'app-team-list',
 10:   standalone: true,
 11:   imports: [SHARED_IMPORTS],
 12:   template: `
 13:     <page-header [title]="'团队管理'">
 14:       <ng-template #extra>
 15:         <button nz-button nzType="primary" (click)="createTeam()">
 16:           <span nz-icon nzType="plus"></span>
 17:           新建团队
 18:         </button>
 19:       </ng-template>
 20:     </page-header>
 21: 
 22:     <nz-card nzTitle="管理系统中的所有团队" style="margin-top: 16px;">
 23:       <st
 24:         #st
 25:         [data]="teamService.teams()"
 26:         [columns]="columns"
 27:         [loading]="teamService.loading()"
 28:         [page]="{ front: false, show: true, showSize: true }"
 29:         (change)="onTableChange($event)"
 30:       >
 31:         <ng-template #description let-record>
 32:           {{ record.description || '-' }}
 33:         </ng-template>
 34:       </st>
 35:     </nz-card>
 36:   `
 37: })
 38: export class TeamListComponent implements OnInit {
 39:   teamService = inject(TeamService);
 40:   router = inject(Router);
 41:   message = inject(NzMessageService);
 42: 
 43:   columns: STColumn[] = [
 44:     { title: 'ID', index: 'id', width: 100 },
 45:     { title: '团队名称', index: 'name', width: 200 },
 46:     { title: '描述', index: 'description', width: 300, render: 'description' },
 47:     { title: '组织ID', index: 'organization_id', width: 200 },
 48:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 49:     {
 50:       title: '操作',
 51:       width: 200,
 52:       buttons: [
 53:         {
 54:           text: '查看',
 55:           click: (record: Team) => this.viewDetail(record.id)
 56:         },
 57:         {
 58:           text: '编辑',
 59:           click: (record: Team) => this.edit(record.id)
 60:         },
 61:         {
 62:           text: '删除',
 63:           type: 'del',
 64:           pop: true,
 65:           click: (record: Team) => this.delete(record.id)
 66:         }
 67:       ]
 68:     }
 69:   ];
 70: 
 71:   ngOnInit(): void {
 72:     this.loadTeams();
 73:   }
 74: 
 75:   async loadTeams(): Promise<void> {
 76:     try {
 77:       await this.teamService.loadTeams();
 78:     } catch (error) {
 79:       this.message.error('加载团队列表失败');
 80:     }
 81:   }
 82: 
 83:   onTableChange(event: any): void {
 84:     // 处理表格变化事件（分页、排序等）
 85:   }
 86: 
 87:   createTeam(): void {
 88:     this.router.navigate(['/accounts/teams/create']);
 89:   }
 90: 
 91:   viewDetail(id: string): void {
 92:     this.router.navigate(['/accounts/teams', id]);
 93:   }
 94: 
 95:   edit(id: string): void {
 96:     this.router.navigate(['/accounts/teams', id, 'edit']);
 97:   }
 98: 
 99:   async delete(id: string): Promise<void> {
100:     try {
101:       await this.teamService.deleteTeam(id);
102:       this.message.success('删除成功');
103:       await this.loadTeams();
104:     } catch (error) {
105:       this.message.error('删除失败');
106:     }
107:   }
108: }
````

## File: src/app/routes/accounts/users/user-list.component.ts
````typescript
  1: import { Component, OnInit, inject } from '@angular/core';
  2: import { Router } from '@angular/router';
  3: import { STColumn } from '@delon/abc/st';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { AccountService, Account } from '@shared';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: 
  8: @Component({
  9:   selector: 'app-user-list',
 10:   standalone: true,
 11:   imports: [SHARED_IMPORTS],
 12:   template: `
 13:     <page-header [title]="'用户管理'">
 14:       <ng-template #extra>
 15:         <button nz-button nzType="primary" (click)="createUser()">
 16:           <span nz-icon nzType="plus"></span>
 17:           新建用户
 18:         </button>
 19:       </ng-template>
 20:     </page-header>
 21: 
 22:     <nz-card nzTitle="管理系统中的所有用户账户" style="margin-top: 16px;">
 23:       <st
 24:         #st
 25:         [data]="users()"
 26:         [columns]="columns"
 27:         [loading]="loading()"
 28:         [page]="{ front: false, show: true, showSize: true }"
 29:         (change)="onTableChange($event)"
 30:       >
 31:         <ng-template #status let-record>
 32:           @switch (record.status) {
 33:             @case ('active') {
 34:               <nz-tag nzColor="success">活跃</nz-tag>
 35:             }
 36:             @case ('inactive') {
 37:               <nz-tag nzColor="default">非活跃</nz-tag>
 38:             }
 39:             @case ('suspended') {
 40:               <nz-tag nzColor="error">已暂停</nz-tag>
 41:             }
 42:           }
 43:         </ng-template>
 44:       </st>
 45:     </nz-card>
 46:   `
 47: })
 48: export class UserListComponent implements OnInit {
 49:   accountService = inject(AccountService);
 50:   router = inject(Router);
 51:   message = inject(NzMessageService);
 52: 
 53:   users = this.accountService.accounts;
 54:   loading = this.accountService.loading;
 55: 
 56:   columns: STColumn[] = [
 57:     { title: 'ID', index: 'id', width: 100 },
 58:     { title: '用户名', index: 'name', width: 200 },
 59:     { title: '邮箱', index: 'email', width: 200 },
 60:     { title: '状态', index: 'status', width: 100, render: 'status' },
 61:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 62:     {
 63:       title: '操作',
 64:       width: 200,
 65:       buttons: [
 66:         {
 67:           text: '查看',
 68:           click: (record: Account) => this.viewDetail(record.id)
 69:         },
 70:         {
 71:           text: '编辑',
 72:           click: (record: Account) => this.edit(record.id)
 73:         },
 74:         {
 75:           text: '删除',
 76:           type: 'del',
 77:           pop: true,
 78:           click: (record: Account) => this.delete(record.id)
 79:         }
 80:       ]
 81:     }
 82:   ];
 83: 
 84:   ngOnInit(): void {
 85:     this.loadUsers();
 86:   }
 87: 
 88:   async loadUsers(): Promise<void> {
 89:     try {
 90:       await this.accountService.loadAccounts();
 91:       // 过滤出用户类型的账户
 92:       // 注意：这里需要根据实际业务逻辑过滤
 93:     } catch (error) {
 94:       this.message.error('加载用户列表失败');
 95:     }
 96:   }
 97: 
 98:   onTableChange(event: any): void {
 99:     // 处理表格变化事件（分页、排序等）
100:   }
101: 
102:   createUser(): void {
103:     this.router.navigate(['/accounts/create'], { queryParams: { type: 'User' } });
104:   }
105: 
106:   viewDetail(id: string): void {
107:     this.router.navigate(['/accounts', id]);
108:   }
109: 
110:   edit(id: string): void {
111:     this.router.navigate(['/accounts', id, 'edit']);
112:   }
113: 
114:   async delete(id: string): Promise<void> {
115:     try {
116:       await this.accountService.deleteAccount(id);
117:       this.message.success('删除成功');
118:       await this.loadUsers();
119:     } catch (error) {
120:       this.message.error('删除失败');
121:     }
122:   }
123: }
````

## File: src/app/routes/analytics/activity-logs/activity-log.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-activity-log',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'活动日志'"></page-header>
11: 
12:     <nz-card nzTitle="活动日志" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="活动日志功能建设中"
16:         nzDescription="此页面将整合系统关键行为的审计记录。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class ActivityLogComponent {}
````

## File: src/app/routes/analytics/charts/chart-center.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-chart-center',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'图表中心'"></page-header>
11: 
12:     <nz-card nzTitle="图表中心" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="图表中心功能建设中"
16:         nzDescription="此页面将提供可配置的图表大屏。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class ChartCenterComponent {}
````

## File: src/app/routes/analytics/progress-update/progress-update.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-progress-update',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'进度更新'"></page-header>
11: 
12:     <nz-card nzTitle="进度更新记录" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="进度更新功能建设中"
16:         nzDescription="此页面将用于维护进度播报与关键里程碑。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class ProgressUpdateComponent {}
````

## File: src/app/routes/analytics/progress/progress-tracking.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-progress-tracking',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'进度追踪'"></page-header>
11: 
12:     <nz-card nzTitle="进度追踪" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="进度追踪功能建设中"
16:         nzDescription="此页面将展示蓝图与任务的整体进度趋势。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class ProgressTrackingComponent {}
````

## File: src/app/routes/analytics/reports/branch-report.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-branch-report',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'分支报告'"></page-header>
11: 
12:     <nz-card nzTitle="分支报告" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="分支报告功能建设中"
16:         nzDescription="此页面将提供分支级别的执行报告与对比。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class BranchReportComponent {}
````

## File: src/app/routes/analytics/reports/cross-branch.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-cross-branch',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'跨分支总览'"></page-header>
11: 
12:     <nz-card nzTitle="跨分支总览" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="跨分支总览功能建设中"
16:         nzDescription="此页面将对比多个分支的执行指标与风险。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class CrossBranchComponent {}
````

## File: src/app/routes/analytics/reports/data-report.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-data-report',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'数据报告'"></page-header>
11: 
12:     <nz-card nzTitle="数据报告" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="数据报告功能建设中"
16:         nzDescription="此页面将支持自定义报表配置与导出。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class DataReportComponent {}
````

## File: src/app/routes/analytics/reports/main-report.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-main-report',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'主分支报告'"></page-header>
11: 
12:     <nz-card nzTitle="主分支报告" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="主分支报告功能建设中"
16:         nzDescription="此页面将输出主分支的整体执行报告与 KPI。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class MainReportComponent {}
````

## File: src/app/routes/analytics/reports/report-export.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-report-export',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'报表导出'"></page-header>
11: 
12:     <nz-card nzTitle="报表导出" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="报表导出功能建设中"
16:         nzDescription="此页面将支持多格式导出与排程任务。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class ReportExportComponent {}
````

## File: src/app/routes/analytics/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: export const ANALYTICS_ROUTES: Routes = [
 4:   {
 5:     path: '',
 6:     redirectTo: 'statistics',
 7:     pathMatch: 'full'
 8:   },
 9:   {
10:     path: 'statistics',
11:     loadComponent: () => import('./statistics/statistics.component').then(m => m.StatisticsComponent)
12:   },
13:   {
14:     path: 'progress',
15:     loadComponent: () => import('./progress/progress-tracking.component').then(m => m.ProgressTrackingComponent)
16:   },
17:   {
18:     path: 'progress-update',
19:     loadComponent: () =>
20:       import('./progress-update/progress-update.component').then(m => m.ProgressUpdateComponent)
21:   },
22:   {
23:     path: 'main-reports',
24:     loadComponent: () =>
25:       import('./reports/main-report.component').then(m => m.MainReportComponent)
26:   },
27:   {
28:     path: 'branch-reports',
29:     loadComponent: () =>
30:       import('./reports/branch-report.component').then(m => m.BranchReportComponent)
31:   },
32:   {
33:     path: 'cross-branch',
34:     loadComponent: () =>
35:       import('./reports/cross-branch.component').then(m => m.CrossBranchComponent)
36:   },
37:   {
38:     path: 'activity-logs',
39:     loadComponent: () =>
40:       import('./activity-logs/activity-log.component').then(m => m.ActivityLogComponent)
41:   },
42:   {
43:     path: 'reports',
44:     loadComponent: () => import('./reports/data-report.component').then(m => m.DataReportComponent)
45:   },
46:   {
47:     path: 'export',
48:     loadComponent: () => import('./reports/report-export.component').then(m => m.ReportExportComponent)
49:   },
50:   {
51:     path: 'charts',
52:     loadComponent: () => import('./charts/chart-center.component').then(m => m.ChartCenterComponent)
53:   }
54: ];
````

## File: src/app/routes/analytics/statistics/statistics.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-analytics-statistics',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'统计总览'"></page-header>
11: 
12:     <nz-card nzTitle="统计总览" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="统计模块建设中"
16:         nzDescription="此页面将汇总各业务模块的 KPI 与运行指标。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class StatisticsComponent {}
````

## File: src/app/routes/blueprints/branches/branch-management.component.ts
````typescript
  1: import { Component, OnInit, inject, computed } from '@angular/core';
  2: import { ActivatedRoute, Router } from '@angular/router';
  3: import { STColumn } from '@delon/abc/st';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { BranchService, BlueprintBranch } from '@shared';
  6: import { BranchStatus, BranchType } from '@core';
  7: import { NzMessageService } from 'ng-zorro-antd/message';
  8: 
  9: @Component({
 10:   selector: 'app-branch-management',
 11:   standalone: true,
 12:   imports: [SHARED_IMPORTS],
 13:   template: `
 14:     <page-header [title]="'分支管理'">
 15:       <ng-template #extra>
 16:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 17:           <span nz-icon nzType="arrow-left"></span>
 18:           返回
 19:         </button>
 20:         <button nz-button nzType="primary" (click)="forkBranch()">
 21:           <span nz-icon nzType="git-branch"></span>
 22:           Fork 分支
 23:         </button>
 24:       </ng-template>
 25:     </page-header>
 26: 
 27:     <nz-card nzTitle="蓝图分支列表" style="margin-top: 16px;">
 28:       <st
 29:         #st
 30:         [data]="branchService.branches()"
 31:         [columns]="columns"
 32:         [loading]="branchService.loading()"
 33:         [page]="{ front: false, show: true, showSize: true }"
 34:         (change)="onTableChange()"
 35:       >
 36:         <ng-template #type let-record>
 37:           @switch (record.branch_type) {
 38:             @case ('contractor') {
 39:               <nz-tag nzColor="blue">承揽商</nz-tag>
 40:             }
 41:             @case ('subcontractor') {
 42:               <nz-tag nzColor="cyan">次承揽商</nz-tag>
 43:             }
 44:             @case ('consultant') {
 45:               <nz-tag nzColor="purple">顾问</nz-tag>
 46:             }
 47:             @default {
 48:               <nz-tag>未知</nz-tag>
 49:             }
 50:           }
 51:         </ng-template>
 52: 
 53:         <ng-template #status let-record>
 54:           @switch (record.status) {
 55:             @case ('active') {
 56:               <nz-tag nzColor="success">活跃</nz-tag>
 57:             }
 58:             @case ('merged') {
 59:               <nz-tag nzColor="blue">已合并</nz-tag>
 60:             }
 61:             @case ('closed') {
 62:               <nz-tag nzColor="default">已关闭</nz-tag>
 63:             }
 64:             @default {
 65:               <nz-tag>未知</nz-tag>
 66:             }
 67:           }
 68:         </ng-template>
 69:       </st>
 70:     </nz-card>
 71:   `
 72: })
 73: export class BranchManagementComponent implements OnInit {
 74:   branchService = inject(BranchService);
 75:   route = inject(ActivatedRoute);
 76:   router = inject(Router);
 77:   message = inject(NzMessageService);
 78: 
 79:   blueprintId = computed(() => this.route.snapshot.paramMap.get('id') || '');
 80: 
 81:   columns: STColumn[] = [
 82:     { title: 'ID', index: 'id', width: 100 },
 83:     { title: '分支名称', index: 'branch_name', width: 200 },
 84:     { title: '组织ID', index: 'organization_id', width: 150 },
 85:     { title: '分支类型', index: 'branch_type', width: 120, render: 'type' },
 86:     { title: '状态', index: 'status', width: 100, render: 'status' },
 87:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 88:     {
 89:       title: '操作',
 90:       width: 200,
 91:       buttons: [
 92:         {
 93:           text: '查看',
 94:           click: (record: BlueprintBranch) => this.viewBranch(record.id)
 95:         },
 96:         {
 97:           text: '同步',
 98:           click: (record: BlueprintBranch) => this.syncBranch(record.id)
 99:         },
100:         {
101:           text: '关闭',
102:           click: (record: BlueprintBranch) => this.closeBranch(record.id)
103:         }
104:       ]
105:     }
106:   ];
107: 
108:   ngOnInit(): void {
109:     const id = this.blueprintId();
110:     if (id) {
111:       this.loadBranches(id);
112:     }
113:   }
114: 
115:   async loadBranches(blueprintId: string): Promise<void> {
116:     try {
117:       await this.branchService.loadBranchesByBlueprintId(blueprintId);
118:     } catch (error) {
119:       this.message.error('加载分支列表失败');
120:     }
121:   }
122: 
123:   onTableChange(): void {
124:     // 表格变化处理
125:   }
126: 
127:   goBack(): void {
128:     const blueprintId = this.blueprintId();
129:     if (blueprintId) {
130:       this.router.navigate(['/blueprints', blueprintId]);
131:     } else {
132:       this.router.navigate(['/blueprints/list']);
133:     }
134:   }
135: 
136:   forkBranch(): void {
137:     // TODO: 实现 Fork 分支对话框
138:     this.message.info('Fork 分支功能待实现');
139:   }
140: 
141:   viewBranch(branchId: string): void {
142:     // TODO: 实现查看分支详情
143:     this.message.info('查看分支详情功能待实现');
144:   }
145: 
146:   async syncBranch(branchId: string): Promise<void> {
147:     try {
148:       await this.branchService.syncFromMainBranch(branchId);
149:       this.message.success('同步成功');
150:     } catch (error) {
151:       this.message.error('同步失败');
152:     }
153:   }
154: 
155:   async closeBranch(branchId: string): Promise<void> {
156:     try {
157:       await this.branchService.closeBranch(branchId);
158:       this.message.success('关闭成功');
159:       const blueprintId = this.blueprintId();
160:       if (blueprintId) {
161:         await this.loadBranches(blueprintId);
162:       }
163:     } catch (error) {
164:       this.message.error('关闭失败');
165:     }
166:   }
167: }
````

## File: src/app/routes/blueprints/detail/blueprint-detail.component.ts
````typescript
  1: import { Component, OnInit, inject, computed } from '@angular/core';
  2: import { ActivatedRoute, Router } from '@angular/router';
  3: import { SHARED_IMPORTS } from '@shared';
  4: import { BlueprintService, Blueprint } from '@shared';
  5: import { BlueprintStatus } from '@core';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: 
  8: @Component({
  9:   selector: 'app-blueprint-detail',
 10:   standalone: true,
 11:   imports: [SHARED_IMPORTS],
 12:   template: `
 13:     <page-header [title]="'蓝图详情'">
 14:       <ng-template #extra>
 15:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 16:           <span nz-icon nzType="arrow-left"></span>
 17:           返回
 18:         </button>
 19:         @if (blueprint()) {
 20:           <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
 21:             <span nz-icon nzType="edit"></span>
 22:             编辑
 23:           </button>
 24:           <button nz-button (click)="manageBranches()" style="margin-right: 8px;">
 25:             <span nz-icon nzType="git-branch"></span>
 26:             分支管理
 27:           </button>
 28:           <button nz-button nzDanger (click)="delete()">
 29:             <span nz-icon nzType="delete"></span>
 30:             删除
 31:           </button>
 32:         }
 33:       </ng-template>
 34:     </page-header>
 35: 
 36:     @if (blueprintService.loading()) {
 37:       <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 38:         <ng-template #indicator>
 39:           <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 40:         </ng-template>
 41:       </nz-spin>
 42:     } @else if (blueprintService.error()) {
 43:       <nz-alert
 44:         nzType="error"
 45:         [nzMessage]="'加载失败'"
 46:         [nzDescription]="blueprintService.error()"
 47:         nzShowIcon
 48:         style="margin: 16px;"
 49:       ></nz-alert>
 50:     } @else if (blueprint()) {
 51:       <div style="padding: 16px;">
 52:         <!-- 蓝图基本信息 -->
 53:         <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
 54:           <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
 55:             <nz-descriptions-item nzTitle="ID">{{ blueprint()!.id }}</nz-descriptions-item>
 56:             <nz-descriptions-item nzTitle="项目名称">{{ blueprint()!.name }}</nz-descriptions-item>
 57:             <nz-descriptions-item nzTitle="项目代码">{{ blueprint()!.project_code || '-' }}</nz-descriptions-item>
 58:             <nz-descriptions-item nzTitle="拥有者">{{ blueprint()!.owner_id }}</nz-descriptions-item>
 59:             <nz-descriptions-item nzTitle="状态">
 60:               @switch (blueprint()!.status) {
 61:                 @case ('planning') {
 62:                   <nz-tag nzColor="default">规划中</nz-tag>
 63:                 }
 64:                 @case ('active') {
 65:                   <nz-tag nzColor="success">进行中</nz-tag>
 66:                 }
 67:                 @case ('on_hold') {
 68:                   <nz-tag nzColor="warning">暂停</nz-tag>
 69:                 }
 70:                 @case ('completed') {
 71:                   <nz-tag nzColor="blue">已完成</nz-tag>
 72:                 }
 73:                 @case ('archived') {
 74:                   <nz-tag nzColor="default">已归档</nz-tag>
 75:                 }
 76:                 @default {
 77:                   <nz-tag>未知</nz-tag>
 78:                 }
 79:               }
 80:             </nz-descriptions-item>
 81:             <nz-descriptions-item nzTitle="开始日期">
 82:               {{ blueprint()!.start_date ? (blueprint()!.start_date | date: 'yyyy-MM-dd') : '-' }}
 83:             </nz-descriptions-item>
 84:             <nz-descriptions-item nzTitle="结束日期">
 85:               {{ blueprint()!.end_date ? (blueprint()!.end_date | date: 'yyyy-MM-dd') : '-' }}
 86:             </nz-descriptions-item>
 87:             <nz-descriptions-item nzTitle="创建时间">
 88:               {{ blueprint()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
 89:             </nz-descriptions-item>
 90:             <nz-descriptions-item nzTitle="更新时间">
 91:               {{ blueprint()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
 92:             </nz-descriptions-item>
 93:           </nz-descriptions>
 94:         </nz-card>
 95: 
 96:         <!-- 蓝图配置 -->
 97:         @if (blueprintService.configs().length > 0) {
 98:           <nz-card nzTitle="配置信息" style="margin-bottom: 16px;">
 99:             <nz-descriptions nzBordered [nzColumn]="{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }">
100:               @for (config of blueprintService.configs(); track config.id) {
101:                 <nz-descriptions-item [nzTitle]="config.config_key">
102:                   {{ config.config_value | json }}
103:                 </nz-descriptions-item>
104:               }
105:             </nz-descriptions>
106:           </nz-card>
107:         }
108:       </div>
109:     } @else {
110:       <nz-empty nzNotFoundContent="蓝图不存在"></nz-empty>
111:     }
112:   `
113: })
114: export class BlueprintDetailComponent implements OnInit {
115:   blueprintService = inject(BlueprintService);
116:   route = inject(ActivatedRoute);
117:   router = inject(Router);
118:   message = inject(NzMessageService);
119: 
120:   // 使用 computed 从 Service 获取蓝图信息
121:   blueprint = computed(() => this.blueprintService.selectedBlueprint());
122: 
123:   // 导出枚举供模板使用
124:   BlueprintStatus = BlueprintStatus;
125: 
126:   ngOnInit(): void {
127:     const blueprintId = this.route.snapshot.paramMap.get('id');
128:     if (blueprintId) {
129:       this.loadBlueprint(blueprintId);
130:     }
131:   }
132: 
133:   async loadBlueprint(id: string): Promise<void> {
134:     try {
135:       const blueprint = await this.blueprintService.loadBlueprintById(id);
136:       if (!blueprint) {
137:         this.message.warning('蓝图不存在');
138:         this.goBack();
139:       }
140:     } catch (error) {
141:       this.message.error('加载蓝图详情失败');
142:     }
143:   }
144: 
145:   goBack(): void {
146:     this.router.navigate(['/blueprints/list']);
147:   }
148: 
149:   edit(): void {
150:     if (this.blueprint()) {
151:       this.router.navigate(['/blueprints', this.blueprint()!.id, 'edit']);
152:     }
153:   }
154: 
155:   manageBranches(): void {
156:     if (this.blueprint()) {
157:       this.router.navigate(['/blueprints', this.blueprint()!.id, 'branches']);
158:     }
159:   }
160: 
161:   async delete(): Promise<void> {
162:     if (!this.blueprint()) {
163:       return;
164:     }
165: 
166:     if (confirm('确定要删除此蓝图吗？此操作不可恢复。')) {
167:       try {
168:         await this.blueprintService.deleteBlueprint(this.blueprint()!.id);
169:         this.message.success('删除成功');
170:         this.goBack();
171:       } catch (error) {
172:         this.message.error('删除失败');
173:       }
174:     }
175:   }
176: }
````

## File: src/app/routes/blueprints/fork/blueprint-fork.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { ActivatedRoute, Router } from '@angular/router';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { BlueprintService } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-blueprint-fork',
 9:   standalone: true,
10:   imports: [SHARED_IMPORTS],
11:   template: `
12:     <page-header [title]="'Fork 任务'">
13:       <ng-template #breadcrumb>
14:         <nz-breadcrumb>
15:           <nz-breadcrumb-item>
16:             <a routerLink="/blueprints">蓝图列表</a>
17:           </nz-breadcrumb-item>
18:           <nz-breadcrumb-item>Fork 任务</nz-breadcrumb-item>
19:         </nz-breadcrumb>
20:       </ng-template>
21:     </page-header>
22: 
23:     <nz-card nzTitle="创建 Fork 任务" style="margin-top: 16px;">
24:       <nz-alert
25:         nzType="info"
26:         nzMessage="Fork 任务功能开发中"
27:         nzDescription="此页面将用于从现有蓝图创建 Fork 任务。"
28:         [nzShowIcon]="true"
29:         style="margin-bottom: 16px;"
30:       ></nz-alert>
31: 
32:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
33:     </nz-card>
34:   `
35: })
36: export class BlueprintForkComponent implements OnInit {
37:   blueprintService = inject(BlueprintService);
38:   route = inject(ActivatedRoute);
39:   router = inject(Router);
40:   message = inject(NzMessageService);
41: 
42:   blueprintId = '';
43: 
44:   ngOnInit(): void {
45:     this.blueprintId = this.route.snapshot.paramMap.get('id') || '';
46:     if (!this.blueprintId) {
47:       this.message.error('蓝图ID不存在');
48:       this.router.navigate(['/blueprints']);
49:     }
50:   }
51: }
````

## File: src/app/routes/blueprints/form/blueprint-form.component.ts
````typescript
  1: import { Component, OnInit, inject, computed, signal } from '@angular/core';
  2: import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  3: import { ActivatedRoute, Router } from '@angular/router';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { BlueprintService, Blueprint, BlueprintInsert, BlueprintUpdate } from '@shared';
  6: import { BlueprintStatus } from '@core';
  7: import { NzMessageService } from 'ng-zorro-antd/message';
  8: 
  9: /**
 10:  * 蓝图表单类型定义
 11:  */
 12: interface BlueprintFormValue {
 13:   name: string;
 14:   projectCode?: string | null;
 15:   ownerId: string;
 16:   status: BlueprintStatus;
 17:   startDate?: string | null;
 18:   endDate?: string | null;
 19:   description?: string | null;
 20: }
 21: 
 22: @Component({
 23:   selector: 'app-blueprint-form',
 24:   standalone: true,
 25:   imports: [SHARED_IMPORTS, ReactiveFormsModule],
 26:   template: `
 27:     <page-header [title]="isEditMode() ? '编辑蓝图' : '创建蓝图'">
 28:       <ng-template #extra>
 29:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 30:           <span nz-icon nzType="arrow-left"></span>
 31:           返回
 32:         </button>
 33:       </ng-template>
 34:     </page-header>
 35: 
 36:     <div style="padding: 16px;">
 37:       @if (blueprintService.loading()) {
 38:         <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 39:           <ng-template #indicator>
 40:             <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 41:           </ng-template>
 42:         </nz-spin>
 43:       } @else {
 44:         <nz-card [nzTitle]="isEditMode() ? '编辑蓝图信息' : '创建新蓝图'">
 45:           <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
 46:             <nz-form-item>
 47:               <nz-form-label [nzSpan]="4" nzRequired>项目名称</nz-form-label>
 48:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入项目名称'">
 49:                 <input nz-input formControlName="name" placeholder="请输入项目名称" />
 50:               </nz-form-control>
 51:             </nz-form-item>
 52: 
 53:             <nz-form-item>
 54:               <nz-form-label [nzSpan]="4">项目代码</nz-form-label>
 55:               <nz-form-control [nzSpan]="20">
 56:                 <input nz-input formControlName="projectCode" placeholder="请输入项目代码" />
 57:               </nz-form-control>
 58:             </nz-form-item>
 59: 
 60:             <nz-form-item>
 61:               <nz-form-label [nzSpan]="4" nzRequired>拥有者ID</nz-form-label>
 62:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入拥有者ID'">
 63:                 <input nz-input formControlName="ownerId" placeholder="请输入拥有者ID" />
 64:               </nz-form-control>
 65:             </nz-form-item>
 66: 
 67:             <nz-form-item>
 68:               <nz-form-label [nzSpan]="4" nzRequired>状态</nz-form-label>
 69:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择状态'">
 70:                 <nz-select formControlName="status" nzPlaceHolder="请选择状态">
 71:                   <nz-option [nzValue]="BlueprintStatus.PLANNING" nzLabel="规划中"></nz-option>
 72:                   <nz-option [nzValue]="BlueprintStatus.ACTIVE" nzLabel="进行中"></nz-option>
 73:                   <nz-option [nzValue]="BlueprintStatus.ON_HOLD" nzLabel="暂停"></nz-option>
 74:                   <nz-option [nzValue]="BlueprintStatus.COMPLETED" nzLabel="已完成"></nz-option>
 75:                   <nz-option [nzValue]="BlueprintStatus.ARCHIVED" nzLabel="已归档"></nz-option>
 76:                 </nz-select>
 77:               </nz-form-control>
 78:             </nz-form-item>
 79: 
 80:             <nz-form-item>
 81:               <nz-form-label [nzSpan]="4">开始日期</nz-form-label>
 82:               <nz-form-control [nzSpan]="20">
 83:                 <nz-date-picker formControlName="startDate" nzPlaceHolder="请选择开始日期" style="width: 100%;"></nz-date-picker>
 84:               </nz-form-control>
 85:             </nz-form-item>
 86: 
 87:             <nz-form-item>
 88:               <nz-form-label [nzSpan]="4">结束日期</nz-form-label>
 89:               <nz-form-control [nzSpan]="20">
 90:                 <nz-date-picker formControlName="endDate" nzPlaceHolder="请选择结束日期" style="width: 100%;"></nz-date-picker>
 91:               </nz-form-control>
 92:             </nz-form-item>
 93: 
 94:             <nz-form-item>
 95:               <nz-form-label [nzSpan]="4">描述</nz-form-label>
 96:               <nz-form-control [nzSpan]="20">
 97:                 <textarea nz-input formControlName="description" [nzAutosize]="{ minRows: 3, maxRows: 6 }" placeholder="请输入描述"></textarea>
 98:               </nz-form-control>
 99:             </nz-form-item>
100: 
101:             <nz-form-item>
102:               <nz-form-control [nzOffset]="4" [nzSpan]="20">
103:                 <button nz-button nzType="primary" [disabled]="!form.valid" [nzLoading]="submitting()">
104:                   提交
105:                 </button>
106:                 <button nz-button nzType="default" (click)="goBack()" style="margin-left: 8px;">
107:                   取消
108:                 </button>
109:               </nz-form-control>
110:             </nz-form-item>
111:           </form>
112:         </nz-card>
113:       }
114:     </div>
115:   `
116: })
117: export class BlueprintFormComponent implements OnInit {
118:   blueprintService = inject(BlueprintService);
119:   route = inject(ActivatedRoute);
120:   router = inject(Router);
121:   message = inject(NzMessageService);
122: 
123:   // 使用 signal 管理提交状态
124:   submitting = signal(false);
125: 
126:   // 使用 computed 判断是否为编辑模式
127:   isEditMode = computed(() => {
128:     const id = this.route.snapshot.paramMap.get('id');
129:     return !!id && id !== 'create';
130:   });
131: 
132:   // 导出枚举供模板使用
133:   BlueprintStatus = BlueprintStatus;
134: 
135:   form = new FormGroup({
136:     name: new FormControl('', [Validators.required]),
137:     projectCode: new FormControl(''),
138:     ownerId: new FormControl('', [Validators.required]),
139:     status: new FormControl(BlueprintStatus.PLANNING, [Validators.required]),
140:     startDate: new FormControl(''),
141:     endDate: new FormControl(''),
142:     description: new FormControl('')
143:   });
144: 
145:   ngOnInit(): void {
146:     if (this.isEditMode()) {
147:       const blueprintId = this.route.snapshot.paramMap.get('id');
148:       if (blueprintId) {
149:         this.loadBlueprint(blueprintId);
150:       }
151:     }
152:   }
153: 
154:   async loadBlueprint(id: string): Promise<void> {
155:     try {
156:       const blueprint = await this.blueprintService.loadBlueprintById(id);
157:       if (blueprint) {
158:         this.form.patchValue({
159:           name: blueprint.name,
160:           projectCode: blueprint.project_code || '',
161:           ownerId: blueprint.owner_id,
162:           status: blueprint.status as BlueprintStatus,
163:           startDate: blueprint.start_date || '',
164:           endDate: blueprint.end_date || '',
165:           description: blueprint.description || ''
166:         });
167:       }
168:     } catch (error) {
169:       this.message.error('加载蓝图信息失败');
170:     }
171:   }
172: 
173:   async onSubmit(): Promise<void> {
174:     if (!this.form.valid) {
175:       Object.values(this.form.controls).forEach(control => {
176:         if (control.invalid) {
177:           control.markAsDirty();
178:           control.updateValueAndValidity({ onlySelf: true });
179:         }
180:       });
181:       return;
182:     }
183: 
184:     this.submitting.set(true);
185: 
186:     try {
187:       const formValue = this.form.value as BlueprintFormValue;
188: 
189:       if (this.isEditMode()) {
190:         const blueprintId = this.route.snapshot.paramMap.get('id')!;
191:         const updateData = {
192:           name: formValue.name,
193:           project_code: formValue.projectCode || null,
194:           status: formValue.status,
195:           start_date: formValue.startDate || null,
196:           end_date: formValue.endDate || null,
197:           description: formValue.description || null
198:         } as any as BlueprintUpdate;
199:         await this.blueprintService.updateBlueprint(blueprintId, updateData);
200:         this.message.success('更新成功');
201:       } else {
202:         const insertData = {
203:           name: formValue.name,
204:           project_code: formValue.projectCode || null,
205:           owner_id: formValue.ownerId,
206:           status: formValue.status,
207:           start_date: formValue.startDate || null,
208:           end_date: formValue.endDate || null,
209:           description: formValue.description || null
210:         } as any as BlueprintInsert;
211:         const blueprint = await this.blueprintService.createBlueprint(insertData);
212:         this.message.success('创建成功');
213:         this.router.navigate(['/blueprints', blueprint.id]);
214:       }
215:     } catch (error) {
216:       this.message.error(this.isEditMode() ? '更新失败' : '创建失败');
217:     } finally {
218:       this.submitting.set(false);
219:     }
220:   }
221: 
222:   goBack(): void {
223:     this.router.navigate(['/blueprints/list']);
224:   }
225: }
````

## File: src/app/routes/blueprints/list/blueprint-list.component.ts
````typescript
  1: import { Component, OnInit, inject } from '@angular/core';
  2: import { Router } from '@angular/router';
  3: import { STColumn } from '@delon/abc/st';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { BlueprintService, Blueprint } from '@shared';
  6: import { BlueprintStatus } from '@core';
  7: import { NzMessageService } from 'ng-zorro-antd/message';
  8: 
  9: @Component({
 10:   selector: 'app-blueprint-list',
 11:   standalone: true,
 12:   imports: [SHARED_IMPORTS],
 13:   template: `
 14:     <page-header [title]="'蓝图管理'">
 15:       <ng-template #extra>
 16:         <button nz-button nzType="primary" (click)="createBlueprint()">
 17:           <span nz-icon nzType="plus"></span>
 18:           新建蓝图
 19:         </button>
 20:       </ng-template>
 21:     </page-header>
 22: 
 23:     <nz-card nzTitle="管理系统中的所有蓝图" style="margin-top: 16px;">
 24:       <st
 25:         #st
 26:         [data]="blueprintService.blueprints()"
 27:         [columns]="columns"
 28:         [loading]="blueprintService.loading()"
 29:         [page]="{ front: false, show: true, showSize: true }"
 30:         (change)="onTableChange()"
 31:       >
 32:         <ng-template #status let-record>
 33:           @switch (record.status) {
 34:             @case ('planning') {
 35:               <nz-tag nzColor="default">规划中</nz-tag>
 36:             }
 37:             @case ('active') {
 38:               <nz-tag nzColor="success">进行中</nz-tag>
 39:             }
 40:             @case ('on_hold') {
 41:               <nz-tag nzColor="warning">暂停</nz-tag>
 42:             }
 43:             @case ('completed') {
 44:               <nz-tag nzColor="blue">已完成</nz-tag>
 45:             }
 46:             @case ('archived') {
 47:               <nz-tag nzColor="default">已归档</nz-tag>
 48:             }
 49:             @default {
 50:               <nz-tag>未知</nz-tag>
 51:             }
 52:           }
 53:         </ng-template>
 54:       </st>
 55:     </nz-card>
 56:   `
 57: })
 58: export class BlueprintListComponent implements OnInit {
 59:   blueprintService = inject(BlueprintService);
 60:   router = inject(Router);
 61:   message = inject(NzMessageService);
 62: 
 63:   columns: STColumn[] = [
 64:     { title: 'ID', index: 'id', width: 100 },
 65:     { title: '项目名称', index: 'name', width: 200 },
 66:     { title: '项目代码', index: 'project_code', width: 150 },
 67:     { title: '拥有者', index: 'owner_id', width: 150 },
 68:     { title: '状态', index: 'status', width: 100, render: 'status' },
 69:     { title: '开始日期', index: 'start_date', type: 'date', width: 120 },
 70:     { title: '结束日期', index: 'end_date', type: 'date', width: 120 },
 71:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 72:     {
 73:       title: '操作',
 74:       width: 250,
 75:       buttons: [
 76:         {
 77:           text: '查看',
 78:           click: (record: Blueprint) => this.viewDetail(record.id)
 79:         },
 80:         {
 81:           text: '编辑',
 82:           click: (record: Blueprint) => this.edit(record.id)
 83:         },
 84:         {
 85:           text: '分支管理',
 86:           click: (record: Blueprint) => this.manageBranches(record.id)
 87:         },
 88:         {
 89:           text: '删除',
 90:           type: 'del',
 91:           pop: {
 92:             title: '确定要删除这个蓝图吗？',
 93:             okType: 'danger'
 94:           },
 95:           click: (record: Blueprint) => this.delete(record.id)
 96:         }
 97:       ]
 98:     }
 99:   ];
100: 
101:   ngOnInit(): void {
102:     this.loadData();
103:   }
104: 
105:   async loadData(): Promise<void> {
106:     try {
107:       await this.blueprintService.loadBlueprints();
108:     } catch (error) {
109:       this.message.error('加载蓝图列表失败');
110:     }
111:   }
112: 
113:   onTableChange(): void {
114:     // 表格变化处理
115:   }
116: 
117:   createBlueprint(): void {
118:     this.router.navigate(['/blueprints/create']);
119:   }
120: 
121:   viewDetail(id: string): void {
122:     this.router.navigate(['/blueprints', id]);
123:   }
124: 
125:   edit(id: string): void {
126:     this.router.navigate(['/blueprints', id, 'edit']);
127:   }
128: 
129:   manageBranches(id: string): void {
130:     this.router.navigate(['/blueprints', id, 'branches']);
131:   }
132: 
133:   async delete(id: string): Promise<void> {
134:     try {
135:       await this.blueprintService.deleteBlueprint(id);
136:       this.message.success('删除成功');
137:       await this.loadData();
138:     } catch (error) {
139:       this.message.error('删除失败');
140:     }
141:   }
142: }
````

## File: src/app/routes/blueprints/pull-requests/pull-request-list.component.ts
````typescript
  1: import { Component, OnInit, inject, computed } from '@angular/core';
  2: import { ActivatedRoute, Router } from '@angular/router';
  3: import { STColumn } from '@delon/abc/st';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { PullRequestService, PullRequest } from '@shared';
  6: import { PRStatus } from '@core';
  7: import { NzMessageService } from 'ng-zorro-antd/message';
  8: 
  9: @Component({
 10:   selector: 'app-pull-request-list',
 11:   standalone: true,
 12:   imports: [SHARED_IMPORTS],
 13:   template: `
 14:     <page-header [title]="'Pull Request 管理'">
 15:       <ng-template #extra>
 16:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 17:           <span nz-icon nzType="arrow-left"></span>
 18:           返回
 19:         </button>
 20:         <button nz-button nzType="primary" (click)="createPR()">
 21:           <span nz-icon nzType="plus"></span>
 22:           创建 PR
 23:         </button>
 24:       </ng-template>
 25:     </page-header>
 26: 
 27:     <nz-card nzTitle="Pull Request 列表" style="margin-top: 16px;">
 28:       <st
 29:         #st
 30:         [data]="prService.pullRequests()"
 31:         [columns]="columns"
 32:         [loading]="prService.loading()"
 33:         [page]="{ front: false, show: true, showSize: true }"
 34:         (change)="onTableChange()"
 35:       >
 36:         <ng-template #status let-record>
 37:           @switch (record.status) {
 38:             @case ('open') {
 39:               <nz-tag nzColor="blue">打开</nz-tag>
 40:             }
 41:             @case ('reviewing') {
 42:               <nz-tag nzColor="orange">审核中</nz-tag>
 43:             }
 44:             @case ('approved') {
 45:               <nz-tag nzColor="green">已批准</nz-tag>
 46:             }
 47:             @case ('rejected') {
 48:               <nz-tag nzColor="red">已拒绝</nz-tag>
 49:             }
 50:             @case ('merged') {
 51:               <nz-tag nzColor="purple">已合并</nz-tag>
 52:             }
 53:             @case ('closed') {
 54:               <nz-tag nzColor="default">已关闭</nz-tag>
 55:             }
 56:             @default {
 57:               <nz-tag>未知</nz-tag>
 58:             }
 59:           }
 60:         </ng-template>
 61:       </st>
 62:     </nz-card>
 63:   `
 64: })
 65: export class PullRequestListComponent implements OnInit {
 66:   prService = inject(PullRequestService);
 67:   route = inject(ActivatedRoute);
 68:   router = inject(Router);
 69:   message = inject(NzMessageService);
 70: 
 71:   blueprintId = computed(() => this.route.snapshot.paramMap.get('id') || '');
 72: 
 73:   columns: STColumn[] = [
 74:     { title: 'ID', index: 'id', width: 100 },
 75:     { title: '标题', index: 'title', width: 200 },
 76:     { title: '分支ID', index: 'branch_id', width: 150 },
 77:     { title: '提交者', index: 'submitted_by', width: 150 },
 78:     { title: '状态', index: 'status', width: 100, render: 'status' },
 79:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 80:     {
 81:       title: '操作',
 82:       width: 250,
 83:       buttons: [
 84:         {
 85:           text: '查看',
 86:           click: (record: PullRequest) => this.viewPR(record.id)
 87:         },
 88:         {
 89:           text: '审核',
 90:           click: (record: PullRequest) => this.reviewPR(record.id)
 91:         },
 92:         {
 93:           text: '合并',
 94:           click: (record: PullRequest) => this.mergePR(record.id)
 95:         }
 96:       ]
 97:     }
 98:   ];
 99: 
100:   ngOnInit(): void {
101:     const id = this.blueprintId();
102:     if (id) {
103:       this.loadPRs(id);
104:     }
105:   }
106: 
107:   async loadPRs(blueprintId: string): Promise<void> {
108:     try {
109:       await this.prService.loadPullRequestsByBlueprintId(blueprintId);
110:     } catch (error) {
111:       this.message.error('加载 Pull Request 列表失败');
112:     }
113:   }
114: 
115:   onTableChange(): void {
116:     // 表格变化处理
117:   }
118: 
119:   goBack(): void {
120:     const blueprintId = this.blueprintId();
121:     if (blueprintId) {
122:       this.router.navigate(['/blueprints', blueprintId]);
123:     } else {
124:       this.router.navigate(['/blueprints/list']);
125:     }
126:   }
127: 
128:   createPR(): void {
129:     // TODO: 实现创建 PR 对话框
130:     this.message.info('创建 PR 功能待实现');
131:   }
132: 
133:   viewPR(prId: string): void {
134:     // TODO: 实现查看 PR 详情
135:     this.message.info('查看 PR 详情功能待实现');
136:   }
137: 
138:   async reviewPR(prId: string): Promise<void> {
139:     // TODO: 实现审核 PR 对话框
140:     this.message.info('审核 PR 功能待实现');
141:   }
142: 
143:   async mergePR(prId: string): Promise<void> {
144:     // TODO: 实现合并 PR 对话框
145:     this.message.info('合并 PR 功能待实现');
146:   }
147: }
````

## File: src/app/routes/blueprints/review/pr-review.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { ActivatedRoute, Router } from '@angular/router';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-pr-review',
 8:   standalone: true,
 9:   imports: [SHARED_IMPORTS],
10:   template: `
11:     <page-header [title]="'PR 审查'">
12:       <ng-template #breadcrumb>
13:         <nz-breadcrumb>
14:           <nz-breadcrumb-item>
15:             <a routerLink="/blueprints">蓝图列表</a>
16:           </nz-breadcrumb-item>
17:           <nz-breadcrumb-item>
18:             <a [routerLink]="['/blueprints', blueprintId, 'pull-requests']">Pull Requests</a>
19:           </nz-breadcrumb-item>
20:           <nz-breadcrumb-item>审查</nz-breadcrumb-item>
21:         </nz-breadcrumb>
22:       </ng-template>
23:     </page-header>
24: 
25:     <nz-card nzTitle="Pull Request 审查" style="margin-top: 16px;">
26:       <nz-alert
27:         nzType="info"
28:         nzMessage="PR 审查功能开发中"
29:         nzDescription="此页面将用于审查和批准 Pull Request。"
30:         [nzShowIcon]="true"
31:         style="margin-bottom: 16px;"
32:       ></nz-alert>
33: 
34:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
35:     </nz-card>
36:   `
37: })
38: export class PrReviewComponent implements OnInit {
39:   route = inject(ActivatedRoute);
40:   router = inject(Router);
41:   message = inject(NzMessageService);
42: 
43:   blueprintId = '';
44:   prId = '';
45: 
46:   ngOnInit(): void {
47:     this.blueprintId = this.route.snapshot.paramMap.get('id') || '';
48:     this.prId = this.route.snapshot.paramMap.get('prId') || '';
49:     if (!this.blueprintId || !this.prId) {
50:       this.message.error('蓝图ID或PR ID不存在');
51:       this.router.navigate(['/blueprints']);
52:     }
53:   }
54: }
````

## File: src/app/routes/blueprints/settings/blueprint-settings.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { ActivatedRoute, Router } from '@angular/router';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { BlueprintService } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-blueprint-settings',
 9:   standalone: true,
10:   imports: [SHARED_IMPORTS],
11:   template: `
12:     <page-header [title]="'蓝图设置'">
13:       <ng-template #breadcrumb>
14:         <nz-breadcrumb>
15:           <nz-breadcrumb-item>
16:             <a routerLink="/blueprints">蓝图列表</a>
17:           </nz-breadcrumb-item>
18:           <nz-breadcrumb-item>设置</nz-breadcrumb-item>
19:         </nz-breadcrumb>
20:       </ng-template>
21:     </page-header>
22: 
23:     <nz-card nzTitle="蓝图配置" style="margin-top: 16px;">
24:       <nz-alert
25:         nzType="info"
26:         nzMessage="蓝图设置功能开发中"
27:         nzDescription="此页面将用于配置蓝图的各种设置选项。"
28:         [nzShowIcon]="true"
29:         style="margin-bottom: 16px;"
30:       ></nz-alert>
31: 
32:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
33:     </nz-card>
34:   `
35: })
36: export class BlueprintSettingsComponent implements OnInit {
37:   blueprintService = inject(BlueprintService);
38:   route = inject(ActivatedRoute);
39:   router = inject(Router);
40:   message = inject(NzMessageService);
41: 
42:   blueprintId = '';
43: 
44:   ngOnInit(): void {
45:     this.blueprintId = this.route.snapshot.paramMap.get('id') || '';
46:     if (!this.blueprintId) {
47:       this.message.error('蓝图ID不存在');
48:       this.router.navigate(['/blueprints']);
49:     }
50:   }
51: }
````

## File: src/app/routes/bots/config/bot-config.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-bot-config',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'机器人配置'"></page-header>
11: 
12:     <nz-card nzTitle="机器人配置" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="机器人配置功能建设中"
16:         nzDescription="此页面将配置机器人脚本、触发条件与安全策略。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class BotConfigComponent {}
````

## File: src/app/routes/bots/executions/bot-execution.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-bot-execution',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'执行日志'"></page-header>
11: 
12:     <nz-card nzTitle="机器人执行日志" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="执行日志功能建设中"
16:         nzDescription="此页面将展示机器人任务执行结果与异常详情。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class BotExecutionComponent {}
````

## File: src/app/routes/bots/list/bot-list.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-bot-list',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'机器人列表'">
11:       <ng-template #extra>
12:         <button nz-button nzType="primary" routerLink="/bots/config">
13:           <span nz-icon nzType="plus"></span>
14:           创建机器人
15:         </button>
16:       </ng-template>
17:     </page-header>
18: 
19:     <nz-card nzTitle="机器人列表" style="margin-top: 16px;">
20:       <nz-alert
21:         nzType="info"
22:         nzMessage="机器人列表功能建设中"
23:         nzDescription="此页面将展示所有自动化任务机器人及其状态。"
24:         [nzShowIcon]="true"
25:         style="margin-bottom: 16px;"
26:       ></nz-alert>
27:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
28:     </nz-card>
29:   `
30: })
31: export class BotListComponent {}
````

## File: src/app/routes/bots/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: export const BOT_ROUTES: Routes = [
 4:   {
 5:     path: '',
 6:     redirectTo: 'list',
 7:     pathMatch: 'full'
 8:   },
 9:   {
10:     path: 'list',
11:     loadComponent: () => import('./list/bot-list.component').then(m => m.BotListComponent)
12:   },
13:   {
14:     path: 'config',
15:     loadComponent: () => import('./config/bot-config.component').then(m => m.BotConfigComponent)
16:   },
17:   {
18:     path: 'executions',
19:     loadComponent: () =>
20:       import('./executions/bot-execution.component').then(m => m.BotExecutionComponent)
21:   }
22: ];
````

## File: src/app/routes/collaboration/detail/collaboration-detail.component.ts
````typescript
  1: import { Component, OnInit, inject, computed } from '@angular/core';
  2: import { ActivatedRoute, Router } from '@angular/router';
  3: import { SHARED_IMPORTS } from '@shared';
  4: import { CollaborationService, OrganizationCollaboration } from '@shared';
  5: import { CollaborationType, CollaborationStatus } from '@core';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: 
  8: @Component({
  9:   selector: 'app-collaboration-detail',
 10:   standalone: true,
 11:   imports: [SHARED_IMPORTS],
 12:   template: `
 13:     <page-header [title]="'协作关系详情'">
 14:       <ng-template #extra>
 15:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 16:           <span nz-icon nzType="arrow-left"></span>
 17:           返回
 18:         </button>
 19:         @if (collaboration()) {
 20:           <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
 21:             <span nz-icon nzType="edit"></span>
 22:             编辑
 23:           </button>
 24:           <button nz-button nzDanger (click)="delete()">
 25:             <span nz-icon nzType="delete"></span>
 26:             删除
 27:           </button>
 28:         }
 29:       </ng-template>
 30:     </page-header>
 31: 
 32:     @if (collaborationService.loading()) {
 33:       <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 34:         <ng-template #indicator>
 35:           <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 36:         </ng-template>
 37:       </nz-spin>
 38:     } @else if (collaborationService.error()) {
 39:       <nz-alert
 40:         nzType="error"
 41:         [nzMessage]="'加载失败'"
 42:         [nzDescription]="collaborationService.error()"
 43:         nzShowIcon
 44:         style="margin: 16px;"
 45:       ></nz-alert>
 46:     } @else if (collaboration()) {
 47:       <div style="padding: 16px;">
 48:         <!-- 协作关系基本信息 -->
 49:         <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
 50:           <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
 51:             <nz-descriptions-item nzTitle="ID">{{ collaboration()!.id }}</nz-descriptions-item>
 52:             <nz-descriptions-item nzTitle="蓝图ID">{{ collaboration()!.blueprint_id }}</nz-descriptions-item>
 53:             <nz-descriptions-item nzTitle="拥有者组织">{{ collaboration()!.owner_org_id }}</nz-descriptions-item>
 54:             <nz-descriptions-item nzTitle="协作组织">{{ collaboration()!.collaborator_org_id }}</nz-descriptions-item>
 55:             <nz-descriptions-item nzTitle="协作类型">
 56:               @switch (collaboration()!.collaboration_type) {
 57:                 @case ('contractor') {
 58:                   <nz-tag nzColor="blue">承揽商</nz-tag>
 59:                 }
 60:                 @case ('subcontractor') {
 61:                   <nz-tag nzColor="cyan">次承揽商</nz-tag>
 62:                 }
 63:                 @case ('consultant') {
 64:                   <nz-tag nzColor="purple">顾问</nz-tag>
 65:                 }
 66:                 @case ('partner') {
 67:                   <nz-tag nzColor="green">合作伙伴</nz-tag>
 68:                 }
 69:                 @default {
 70:                   <nz-tag>未知</nz-tag>
 71:                 }
 72:               }
 73:             </nz-descriptions-item>
 74:             <nz-descriptions-item nzTitle="状态">
 75:               @switch (collaboration()!.status) {
 76:                 @case ('pending') {
 77:                   <nz-tag nzColor="orange">待处理</nz-tag>
 78:                 }
 79:                 @case ('active') {
 80:                   <nz-tag nzColor="success">活跃</nz-tag>
 81:                 }
 82:                 @case ('suspended') {
 83:                   <nz-tag nzColor="warning">已暂停</nz-tag>
 84:                 }
 85:                 @case ('ended') {
 86:                   <nz-tag nzColor="default">已结束</nz-tag>
 87:                 }
 88:                 @default {
 89:                   <nz-tag>未知</nz-tag>
 90:                 }
 91:               }
 92:             </nz-descriptions-item>
 93:             <nz-descriptions-item nzTitle="合同开始日期">
 94:               {{ collaboration()!.contract_start_date ? (collaboration()!.contract_start_date | date: 'yyyy-MM-dd') : '-' }}
 95:             </nz-descriptions-item>
 96:             <nz-descriptions-item nzTitle="合同结束日期">
 97:               {{ collaboration()!.contract_end_date ? (collaboration()!.contract_end_date | date: 'yyyy-MM-dd') : '-' }}
 98:             </nz-descriptions-item>
 99:             <nz-descriptions-item nzTitle="创建时间">
100:               {{ collaboration()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
101:             </nz-descriptions-item>
102:             <nz-descriptions-item nzTitle="更新时间">
103:               {{ collaboration()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
104:             </nz-descriptions-item>
105:           </nz-descriptions>
106:         </nz-card>
107:       </div>
108:     } @else {
109:       <nz-empty nzNotFoundContent="协作关系不存在"></nz-empty>
110:     }
111:   `
112: })
113: export class CollaborationDetailComponent implements OnInit {
114:   collaborationService = inject(CollaborationService);
115:   route = inject(ActivatedRoute);
116:   router = inject(Router);
117:   message = inject(NzMessageService);
118: 
119:   // 使用 computed 从 Service 获取协作关系信息
120:   collaboration = computed(() => this.collaborationService.selectedCollaboration());
121: 
122:   // 导出枚举供模板使用
123:   CollaborationType = CollaborationType;
124:   CollaborationStatus = CollaborationStatus;
125: 
126:   ngOnInit(): void {
127:     const collaborationId = this.route.snapshot.paramMap.get('id');
128:     if (collaborationId) {
129:       this.loadCollaboration(collaborationId);
130:     }
131:   }
132: 
133:   async loadCollaboration(id: string): Promise<void> {
134:     try {
135:       const collaboration = await this.collaborationService.loadCollaborationById(id);
136:       if (!collaboration) {
137:         this.message.warning('协作关系不存在');
138:         this.goBack();
139:       }
140:     } catch (error) {
141:       this.message.error('加载协作关系详情失败');
142:     }
143:   }
144: 
145:   goBack(): void {
146:     this.router.navigate(['/collaboration/list']);
147:   }
148: 
149:   edit(): void {
150:     if (this.collaboration()) {
151:       this.router.navigate(['/collaboration', this.collaboration()!.id, 'edit']);
152:     }
153:   }
154: 
155:   async delete(): Promise<void> {
156:     if (!this.collaboration()) {
157:       return;
158:     }
159: 
160:     if (confirm('确定要删除此协作关系吗？此操作不可恢复。')) {
161:       try {
162:         await this.collaborationService.deleteCollaboration(this.collaboration()!.id);
163:         this.message.success('删除成功');
164:         this.goBack();
165:       } catch (error) {
166:         this.message.error('删除失败');
167:       }
168:     }
169:   }
170: }
````

## File: src/app/routes/collaboration/form/collaboration-form.component.ts
````typescript
  1: import { Component, OnInit, inject, computed } from '@angular/core';
  2: import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  3: import { ActivatedRoute, Router } from '@angular/router';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import {
  6:   CollaborationService,
  7:   OrganizationCollaboration,
  8:   OrganizationCollaborationInsert,
  9:   OrganizationCollaborationUpdate
 10: } from '@shared';
 11: import { CollaborationType, CollaborationStatus } from '@core';
 12: import { NzMessageService } from 'ng-zorro-antd/message';
 13: 
 14: /**
 15:  * 协作关系表单类型定义
 16:  */
 17: interface CollaborationFormValue {
 18:   blueprint_id: string;
 19:   owner_org_id: string;
 20:   collaborator_org_id: string;
 21:   collaboration_type: CollaborationType;
 22:   status?: CollaborationStatus;
 23:   contract_start_date?: string | null;
 24:   contract_end_date?: string | null;
 25:   notes?: string | null;
 26: }
 27: 
 28: @Component({
 29:   selector: 'app-collaboration-form',
 30:   standalone: true,
 31:   imports: [SHARED_IMPORTS, ReactiveFormsModule],
 32:   template: `
 33:     <page-header [title]="isEditMode() ? '编辑协作关系' : '创建协作关系'">
 34:       <ng-template #extra>
 35:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 36:           <span nz-icon nzType="arrow-left"></span>
 37:           返回
 38:         </button>
 39:       </ng-template>
 40:     </page-header>
 41: 
 42:     <div style="padding: 16px;">
 43:       @if (collaborationService.loading()) {
 44:         <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 45:           <ng-template #indicator>
 46:             <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 47:           </ng-template>
 48:         </nz-spin>
 49:       } @else {
 50:         <nz-card [nzTitle]="isEditMode() ? '编辑协作关系信息' : '创建新协作关系'">
 51:           <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
 52:             <nz-form-item>
 53:               <nz-form-label [nzSpan]="4" nzRequired>蓝图ID</nz-form-label>
 54:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入蓝图ID'">
 55:                 <input nz-input formControlName="blueprint_id" placeholder="请输入蓝图ID" />
 56:               </nz-form-control>
 57:             </nz-form-item>
 58: 
 59:             <nz-form-item>
 60:               <nz-form-label [nzSpan]="4" nzRequired>拥有者组织ID</nz-form-label>
 61:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入拥有者组织ID'">
 62:                 <input nz-input formControlName="owner_org_id" placeholder="请输入拥有者组织ID" />
 63:               </nz-form-control>
 64:             </nz-form-item>
 65: 
 66:             <nz-form-item>
 67:               <nz-form-label [nzSpan]="4" nzRequired>协作组织ID</nz-form-label>
 68:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入协作组织ID'">
 69:                 <input nz-input formControlName="collaborator_org_id" placeholder="请输入协作组织ID" />
 70:               </nz-form-control>
 71:             </nz-form-item>
 72: 
 73:             <nz-form-item>
 74:               <nz-form-label [nzSpan]="4" nzRequired>协作类型</nz-form-label>
 75:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择协作类型'">
 76:                 <nz-select formControlName="collaboration_type" nzPlaceHolder="请选择协作类型">
 77:                   <nz-option [nzValue]="CollaborationType.CONTRACTOR" nzLabel="承揽商"></nz-option>
 78:                   <nz-option [nzValue]="CollaborationType.SUBCONTRACTOR" nzLabel="次承揽商"></nz-option>
 79:                   <nz-option [nzValue]="CollaborationType.CONSULTANT" nzLabel="顾问"></nz-option>
 80:                   <nz-option [nzValue]="CollaborationType.PARTNER" nzLabel="合作伙伴"></nz-option>
 81:                 </nz-select>
 82:               </nz-form-control>
 83:             </nz-form-item>
 84: 
 85:             @if (isEditMode()) {
 86:               <nz-form-item>
 87:                 <nz-form-label [nzSpan]="4">状态</nz-form-label>
 88:                 <nz-form-control [nzSpan]="20">
 89:                   <nz-select formControlName="status" nzPlaceHolder="请选择状态">
 90:                     <nz-option [nzValue]="CollaborationStatus.PENDING" nzLabel="待处理"></nz-option>
 91:                     <nz-option [nzValue]="CollaborationStatus.ACTIVE" nzLabel="活跃"></nz-option>
 92:                     <nz-option [nzValue]="CollaborationStatus.SUSPENDED" nzLabel="已暂停"></nz-option>
 93:                     <nz-option [nzValue]="CollaborationStatus.ENDED" nzLabel="已结束"></nz-option>
 94:                   </nz-select>
 95:                 </nz-form-control>
 96:               </nz-form-item>
 97:             }
 98: 
 99:             <nz-form-item>
100:               <nz-form-label [nzSpan]="4">合同开始日期</nz-form-label>
101:               <nz-form-control [nzSpan]="20">
102:                 <input nz-input formControlName="contract_start_date" type="date" />
103:               </nz-form-control>
104:             </nz-form-item>
105: 
106:             <nz-form-item>
107:               <nz-form-label [nzSpan]="4">合同结束日期</nz-form-label>
108:               <nz-form-control [nzSpan]="20">
109:                 <input nz-input formControlName="contract_end_date" type="date" />
110:               </nz-form-control>
111:             </nz-form-item>
112: 
113:             <nz-form-item>
114:               <nz-form-label [nzSpan]="4">备注</nz-form-label>
115:               <nz-form-control [nzSpan]="20">
116:                 <textarea nz-input formControlName="notes" rows="4" placeholder="请输入备注"></textarea>
117:               </nz-form-control>
118:             </nz-form-item>
119: 
120:             <nz-form-item>
121:               <nz-form-control [nzSpan]="24" [nzOffset]="4">
122:                 <button
123:                   nz-button
124:                   nzType="primary"
125:                   [nzLoading]="collaborationService.loading()"
126:                   [disabled]="form.invalid"
127:                 >
128:                   <span nz-icon nzType="save"></span>
129:                   {{ isEditMode() ? '保存' : '创建' }}
130:                 </button>
131:                 <button nz-button nzType="default" type="button" (click)="goBack()" style="margin-left: 8px;">
132:                   取消
133:                 </button>
134:               </nz-form-control>
135:             </nz-form-item>
136:           </form>
137:         </nz-card>
138:       }
139:     </div>
140:   `
141: })
142: export class CollaborationFormComponent implements OnInit {
143:   collaborationService = inject(CollaborationService);
144:   route = inject(ActivatedRoute);
145:   router = inject(Router);
146:   message = inject(NzMessageService);
147: 
148:   // 导出枚举供模板使用
149:   CollaborationType = CollaborationType;
150:   CollaborationStatus = CollaborationStatus;
151: 
152:   // 判断是否为编辑模式
153:   isEditMode = computed(() => {
154:     const id = this.route.snapshot.paramMap.get('id');
155:     return !!id;
156:   });
157: 
158:   // 表单定义
159:   form = new FormGroup<{
160:     blueprint_id: FormControl<string>;
161:     owner_org_id: FormControl<string>;
162:     collaborator_org_id: FormControl<string>;
163:     collaboration_type: FormControl<CollaborationType>;
164:     status?: FormControl<CollaborationStatus>;
165:     contract_start_date?: FormControl<string | null>;
166:     contract_end_date?: FormControl<string | null>;
167:     notes?: FormControl<string | null>;
168:   }>({
169:     blueprint_id: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
170:     owner_org_id: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
171:     collaborator_org_id: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
172:     collaboration_type: new FormControl(CollaborationType.CONTRACTOR, {
173:       nonNullable: true,
174:       validators: [Validators.required]
175:     }),
176:     status: new FormControl(CollaborationStatus.ACTIVE, { nonNullable: true }),
177:     contract_start_date: new FormControl(null),
178:     contract_end_date: new FormControl(null),
179:     notes: new FormControl(null)
180:   });
181: 
182:   ngOnInit(): void {
183:     if (this.isEditMode()) {
184:       const collaborationId = this.route.snapshot.paramMap.get('id');
185:       if (collaborationId) {
186:         this.loadCollaboration(collaborationId);
187:       }
188:     }
189:   }
190: 
191:   async loadCollaboration(id: string): Promise<void> {
192:     try {
193:       const collaboration = await this.collaborationService.loadCollaborationById(id);
194:       if (collaboration) {
195:         this.form.patchValue({
196:           blueprint_id: collaboration.blueprint_id,
197:           owner_org_id: collaboration.owner_org_id,
198:           collaborator_org_id: collaboration.collaborator_org_id,
199:           collaboration_type: collaboration.collaboration_type as CollaborationType,
200:           status: collaboration.status as CollaborationStatus,
201:           contract_start_date: collaboration.contract_start_date || null,
202:           contract_end_date: collaboration.contract_end_date || null,
203:           notes: collaboration.notes || null
204:         });
205:       } else {
206:         this.message.warning('协作关系不存在');
207:         this.goBack();
208:       }
209:     } catch (error) {
210:       this.message.error('加载协作关系信息失败');
211:     }
212:   }
213: 
214:   async onSubmit(): Promise<void> {
215:     if (this.form.invalid) {
216:       // 标记所有字段为 touched，显示验证错误
217:       Object.values(this.form.controls).forEach(control => {
218:         if (control && control.invalid) {
219:           control.markAsTouched();
220:           control.updateValueAndValidity({ onlySelf: true });
221:         }
222:       });
223:       return;
224:     }
225: 
226:     const formValue = this.form.value as CollaborationFormValue;
227: 
228:     try {
229:       if (this.isEditMode()) {
230:         const collaborationId = this.route.snapshot.paramMap.get('id')!;
231:         const updateData: OrganizationCollaborationUpdate = {
232:           blueprint_id: formValue.blueprint_id,
233:           owner_org_id: formValue.owner_org_id,
234:           collaborator_org_id: formValue.collaborator_org_id,
235:           collaboration_type: formValue.collaboration_type,
236:           status: formValue.status,
237:           contract_start_date: formValue.contract_start_date || undefined,
238:           contract_end_date: formValue.contract_end_date || undefined,
239:           notes: formValue.notes || undefined
240:         };
241:         await this.collaborationService.updateCollaboration(collaborationId, updateData);
242:         this.message.success('更新成功');
243:         this.router.navigate(['/collaboration', collaborationId]);
244:       } else {
245:         const insertData: OrganizationCollaborationInsert = {
246:           blueprint_id: formValue.blueprint_id,
247:           owner_org_id: formValue.owner_org_id,
248:           collaborator_org_id: formValue.collaborator_org_id,
249:           collaboration_type: formValue.collaboration_type,
250:           status: formValue.status || CollaborationStatus.ACTIVE,
251:           contract_start_date: formValue.contract_start_date || undefined,
252:           contract_end_date: formValue.contract_end_date || undefined,
253:           notes: formValue.notes || undefined
254:         };
255:         const collaboration = await this.collaborationService.createCollaboration(insertData);
256:         this.message.success('创建成功');
257:         this.router.navigate(['/collaboration', collaboration.id]);
258:       }
259:     } catch (error) {
260:       this.message.error(this.isEditMode() ? '更新失败' : '创建失败');
261:     }
262:   }
263: 
264:   goBack(): void {
265:     if (this.isEditMode()) {
266:       const collaborationId = this.route.snapshot.paramMap.get('id');
267:       if (collaborationId) {
268:         this.router.navigate(['/collaboration', collaborationId]);
269:       } else {
270:         this.router.navigate(['/collaboration/list']);
271:       }
272:     } else {
273:       this.router.navigate(['/collaboration/list']);
274:     }
275:   }
276: }
````

## File: src/app/routes/collaboration/invitations/invitation-list.component.ts
````typescript
  1: import { Component, OnInit, inject } from '@angular/core';
  2: import { Router } from '@angular/router';
  3: import { STColumn } from '@delon/abc/st';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { InvitationService, CollaborationInvitation } from '@shared';
  6: import { InvitationStatus } from '@core';
  7: import { NzMessageService } from 'ng-zorro-antd/message';
  8: 
  9: @Component({
 10:   selector: 'app-invitation-list',
 11:   standalone: true,
 12:   imports: [SHARED_IMPORTS],
 13:   template: `
 14:     <page-header [title]="'协作邀请管理'">
 15:       <ng-template #extra>
 16:         <button nz-button nzType="primary" (click)="createInvitation()">
 17:           <span nz-icon nzType="plus"></span>
 18:           发送邀请
 19:         </button>
 20:       </ng-template>
 21:     </page-header>
 22: 
 23:     <nz-card nzTitle="管理系统中的所有协作邀请" style="margin-top: 16px;">
 24:       <st
 25:         #st
 26:         [data]="invitationService.invitations()"
 27:         [columns]="columns"
 28:         [loading]="invitationService.loading()"
 29:         [page]="{ front: false, show: true, showSize: true }"
 30:         (change)="onTableChange()"
 31:       >
 32:         <ng-template #status let-record>
 33:           @switch (record.status) {
 34:             @case ('pending') {
 35:               <nz-tag nzColor="orange">待处理</nz-tag>
 36:             }
 37:             @case ('accepted') {
 38:               <nz-tag nzColor="success">已接受</nz-tag>
 39:             }
 40:             @case ('rejected') {
 41:               <nz-tag nzColor="error">已拒绝</nz-tag>
 42:             }
 43:             @case ('expired') {
 44:               <nz-tag nzColor="default">已过期</nz-tag>
 45:             }
 46:             @default {
 47:               <nz-tag>未知</nz-tag>
 48:             }
 49:           }
 50:         </ng-template>
 51:       </st>
 52:     </nz-card>
 53:   `
 54: })
 55: export class InvitationListComponent implements OnInit {
 56:   invitationService = inject(InvitationService);
 57:   router = inject(Router);
 58:   message = inject(NzMessageService);
 59: 
 60:   columns: STColumn[] = [
 61:     { title: 'ID', index: 'id', width: 100 },
 62:     { title: '蓝图ID', index: 'blueprint_id', width: 150 },
 63:     { title: '发送组织', index: 'from_org_id', width: 150 },
 64:     { title: '接收组织', index: 'to_org_id', width: 150 },
 65:     { title: '状态', index: 'status', width: 100, render: 'status' },
 66:     { title: '邀请消息', index: 'message', width: 200 },
 67:     { title: '过期时间', index: 'expires_at', type: 'date', width: 180 },
 68:     { title: '响应时间', index: 'responded_at', type: 'date', width: 180 },
 69:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 70:     {
 71:       title: '操作',
 72:       width: 250,
 73:       buttons: [
 74:         {
 75:           text: '查看',
 76:           click: (record: CollaborationInvitation) => this.viewDetail(record.id)
 77:         },
 78:         {
 79:           text: '接受',
 80:           type: 'link',
 81:           click: (record: CollaborationInvitation) => this.accept(record.id),
 82:           iif: (record: CollaborationInvitation) => record.status === InvitationStatus.PENDING
 83:         },
 84:         {
 85:           text: '拒绝',
 86:           type: 'link',
 87:           click: (record: CollaborationInvitation) => this.reject(record.id),
 88:           iif: (record: CollaborationInvitation) => record.status === InvitationStatus.PENDING
 89:         },
 90:         {
 91:           text: '删除',
 92:           type: 'del',
 93:           pop: {
 94:             title: '确定要删除这个邀请吗？',
 95:             okType: 'danger'
 96:           },
 97:           click: (record: CollaborationInvitation) => this.delete(record.id)
 98:         }
 99:       ]
100:     }
101:   ];
102: 
103:   ngOnInit(): void {
104:     this.loadData();
105:   }
106: 
107:   async loadData(): Promise<void> {
108:     try {
109:       await this.invitationService.loadInvitations();
110:     } catch (error) {
111:       this.message.error('加载邀请列表失败');
112:     }
113:   }
114: 
115:   onTableChange(): void {
116:     // 表格变化处理
117:   }
118: 
119:   createInvitation(): void {
120:     this.router.navigate(['/collaboration/invitations/create']);
121:   }
122: 
123:   viewDetail(id: string): void {
124:     this.router.navigate(['/collaboration/invitations', id]);
125:   }
126: 
127:   async accept(id: string): Promise<void> {
128:     try {
129:       await this.invitationService.acceptInvitation(id);
130:       this.message.success('接受邀请成功');
131:       await this.loadData();
132:     } catch (error) {
133:       this.message.error('接受邀请失败');
134:     }
135:   }
136: 
137:   async reject(id: string): Promise<void> {
138:     try {
139:       await this.invitationService.rejectInvitation(id);
140:       this.message.success('拒绝邀请成功');
141:       await this.loadData();
142:     } catch (error) {
143:       this.message.error('拒绝邀请失败');
144:     }
145:   }
146: 
147:   async delete(id: string): Promise<void> {
148:     try {
149:       await this.invitationService.deleteInvitation(id);
150:       this.message.success('删除成功');
151:       await this.loadData();
152:     } catch (error) {
153:       this.message.error('删除失败');
154:     }
155:   }
156: }
````

## File: src/app/routes/collaboration/list/collaboration-list.component.spec.ts
````typescript
  1: import { ComponentFixture, TestBed } from '@angular/core/testing';
  2: import { Router } from '@angular/router';
  3: import { NoopAnimationsModule } from '@angular/platform-browser/animations';
  4: import { NzMessageService } from 'ng-zorro-antd/message';
  5: import { SettingsService } from '@delon/theme';
  6: import { SHARED_IMPORTS } from '@shared';
  7: import { CollaborationService } from '@shared';
  8: import { CollaborationListComponent } from './collaboration-list.component';
  9: import { OrganizationCollaboration } from '@shared';
 10: import { CollaborationType, CollaborationStatus } from '@core';
 11: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 12: 
 13: describe('CollaborationListComponent', () => {
 14:   let component: CollaborationListComponent;
 15:   let fixture: ComponentFixture<CollaborationListComponent>;
 16:   let collaborationService: jasmine.SpyObj<CollaborationService>;
 17:   let router: jasmine.SpyObj<Router>;
 18:   let messageService: jasmine.SpyObj<NzMessageService>;
 19: 
 20:   const mockCollaborations: OrganizationCollaboration[] = [
 21:     {
 22:       id: 'collab-1',
 23:       blueprint_id: 'blueprint-1',
 24:       owner_org_id: 'org-1',
 25:       collaborator_org_id: 'org-2',
 26:       collaboration_type: CollaborationType.CONTRACTOR,
 27:       status: CollaborationStatus.ACTIVE,
 28:       contract_start_date: '2025-01-01',
 29:       contract_end_date: '2025-12-31',
 30:       notes: 'Test collaboration',
 31:       created_at: '2025-01-01T00:00:00Z',
 32:       updated_at: '2025-01-01T00:00:00Z'
 33:     } as OrganizationCollaboration
 34:   ];
 35: 
 36:   beforeEach(async () => {
 37:     const collaborationServiceSpy = jasmine.createSpyObj('CollaborationService', [
 38:       'loadCollaborations',
 39:       'createCollaboration',
 40:       'deleteCollaboration'
 41:     ], {
 42:       collaborations: jasmine.createSpy('collaborations').and.returnValue(mockCollaborations),
 43:       loading: jasmine.createSpy('loading').and.returnValue(false),
 44:       error: jasmine.createSpy('error').and.returnValue(null)
 45:     });
 46: 
 47:     const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
 48:     const messageServiceSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error']);
 49:     const mockSettingsService: NzSafeAny = {
 50:       layout: {
 51:         lang: null
 52:       }
 53:     };
 54: 
 55:     await TestBed.configureTestingModule({
 56:       imports: [
 57:         NoopAnimationsModule,
 58:         CollaborationListComponent,
 59:         SHARED_IMPORTS
 60:       ],
 61:       providers: [
 62:         { provide: CollaborationService, useValue: collaborationServiceSpy },
 63:         { provide: Router, useValue: routerSpy },
 64:         { provide: NzMessageService, useValue: messageServiceSpy },
 65:         { provide: SettingsService, useValue: mockSettingsService }
 66:       ]
 67:     }).compileComponents();
 68: 
 69:     fixture = TestBed.createComponent(CollaborationListComponent);
 70:     component = fixture.componentInstance;
 71:     collaborationService = TestBed.inject(CollaborationService) as jasmine.SpyObj<CollaborationService>;
 72:     router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
 73:     messageService = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
 74:   });
 75: 
 76:   it('should create', () => {
 77:     expect(component).toBeTruthy();
 78:   });
 79: 
 80:   it('should load collaborations on init', async () => {
 81:     collaborationService.loadCollaborations.and.returnValue(Promise.resolve());
 82: 
 83:     component.ngOnInit();
 84:     await fixture.whenStable();
 85:     fixture.detectChanges();
 86: 
 87:     expect(collaborationService.loadCollaborations).toHaveBeenCalled();
 88:   });
 89: 
 90:   it('should navigate to create page when create button clicked', () => {
 91:     component.createCollaboration();
 92: 
 93:     expect(router.navigate).toHaveBeenCalledWith(['/collaboration/form']);
 94:   });
 95: 
 96:   it('should display collaborations in table', () => {
 97:     fixture.detectChanges();
 98: 
 99:     const compiled = fixture.nativeElement;
100:     expect(compiled.querySelector('st')).toBeTruthy();
101:   });
102: });
````

## File: src/app/routes/collaboration/list/collaboration-list.component.ts
````typescript
  1: import { Component, OnInit, inject } from '@angular/core';
  2: import { Router } from '@angular/router';
  3: import { STColumn } from '@delon/abc/st';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { CollaborationService, OrganizationCollaboration } from '@shared';
  6: import { CollaborationType, CollaborationStatus } from '@core';
  7: import { NzMessageService } from 'ng-zorro-antd/message';
  8: 
  9: @Component({
 10:   selector: 'app-collaboration-list',
 11:   standalone: true,
 12:   imports: [SHARED_IMPORTS],
 13:   template: `
 14:     <page-header [title]="'协作关系管理'">
 15:       <ng-template #extra>
 16:         <button nz-button nzType="primary" (click)="createCollaboration()">
 17:           <span nz-icon nzType="plus"></span>
 18:           新建协作关系
 19:         </button>
 20:       </ng-template>
 21:     </page-header>
 22: 
 23:     <nz-card nzTitle="管理系统中的所有协作关系" style="margin-top: 16px;">
 24:       <st
 25:         #st
 26:         [data]="collaborationService.collaborations()"
 27:         [columns]="columns"
 28:         [loading]="collaborationService.loading()"
 29:         [page]="{ front: false, show: true, showSize: true }"
 30:         (change)="onTableChange()"
 31:       >
 32:         <ng-template #type let-record>
 33:           @switch (record.collaboration_type) {
 34:             @case ('contractor') {
 35:               <nz-tag nzColor="blue">承揽商</nz-tag>
 36:             }
 37:             @case ('subcontractor') {
 38:               <nz-tag nzColor="cyan">次承揽商</nz-tag>
 39:             }
 40:             @case ('consultant') {
 41:               <nz-tag nzColor="purple">顾问</nz-tag>
 42:             }
 43:             @case ('partner') {
 44:               <nz-tag nzColor="green">合作伙伴</nz-tag>
 45:             }
 46:             @default {
 47:               <nz-tag>未知</nz-tag>
 48:             }
 49:           }
 50:         </ng-template>
 51: 
 52:         <ng-template #status let-record>
 53:           @switch (record.status) {
 54:             @case ('pending') {
 55:               <nz-tag nzColor="orange">待处理</nz-tag>
 56:             }
 57:             @case ('active') {
 58:               <nz-tag nzColor="success">活跃</nz-tag>
 59:             }
 60:             @case ('suspended') {
 61:               <nz-tag nzColor="warning">已暂停</nz-tag>
 62:             }
 63:             @case ('ended') {
 64:               <nz-tag nzColor="default">已结束</nz-tag>
 65:             }
 66:             @default {
 67:               <nz-tag>未知</nz-tag>
 68:             }
 69:           }
 70:         </ng-template>
 71:       </st>
 72:     </nz-card>
 73:   `
 74: })
 75: export class CollaborationListComponent implements OnInit {
 76:   collaborationService = inject(CollaborationService);
 77:   router = inject(Router);
 78:   message = inject(NzMessageService);
 79: 
 80:   columns: STColumn[] = [
 81:     { title: 'ID', index: 'id', width: 100 },
 82:     { title: '蓝图ID', index: 'blueprint_id', width: 150 },
 83:     { title: '拥有者组织', index: 'owner_org_id', width: 150 },
 84:     { title: '协作组织', index: 'collaborator_org_id', width: 150 },
 85:     { title: '协作类型', index: 'collaboration_type', width: 120, render: 'type' },
 86:     { title: '状态', index: 'status', width: 100, render: 'status' },
 87:     { title: '合同开始日期', index: 'contract_start_date', type: 'date', width: 120 },
 88:     { title: '合同结束日期', index: 'contract_end_date', type: 'date', width: 120 },
 89:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 90:     {
 91:       title: '操作',
 92:       width: 200,
 93:       buttons: [
 94:         {
 95:           text: '查看',
 96:           click: (record: OrganizationCollaboration) => this.viewDetail(record.id)
 97:         },
 98:         {
 99:           text: '编辑',
100:           click: (record: OrganizationCollaboration) => this.edit(record.id)
101:         },
102:         {
103:           text: '删除',
104:           type: 'del',
105:           pop: {
106:             title: '确定要删除这个协作关系吗？',
107:             okType: 'danger'
108:           },
109:           click: (record: OrganizationCollaboration) => this.delete(record.id)
110:         }
111:       ]
112:     }
113:   ];
114: 
115:   ngOnInit(): void {
116:     this.loadData();
117:   }
118: 
119:   async loadData(): Promise<void> {
120:     try {
121:       await this.collaborationService.loadCollaborations();
122:     } catch (error) {
123:       this.message.error('加载协作关系列表失败');
124:     }
125:   }
126: 
127:   onTableChange(): void {
128:     // 表格变化处理
129:   }
130: 
131:   createCollaboration(): void {
132:     this.router.navigate(['/collaboration/create']);
133:   }
134: 
135:   viewDetail(id: string): void {
136:     this.router.navigate(['/collaboration', id]);
137:   }
138: 
139:   edit(id: string): void {
140:     this.router.navigate(['/collaboration', id, 'edit']);
141:   }
142: 
143:   async delete(id: string): Promise<void> {
144:     try {
145:       await this.collaborationService.deleteCollaboration(id);
146:       this.message.success('删除成功');
147:       await this.loadData();
148:     } catch (error) {
149:       this.message.error('删除失败');
150:     }
151:   }
152: }
````

## File: src/app/routes/collaboration/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: export const COLLABORATION_ROUTES: Routes = [
 4:   {
 5:     path: '',
 6:     redirectTo: 'list',
 7:     pathMatch: 'full'
 8:   },
 9:   {
10:     path: 'list',
11:     loadComponent: () =>
12:       import('./list/collaboration-list.component').then(m => m.CollaborationListComponent)
13:   },
14:   {
15:     path: 'create',
16:     loadComponent: () => import('./form/collaboration-form.component').then(m => m.CollaborationFormComponent)
17:   },
18:   {
19:     path: 'invitations',
20:     loadComponent: () => import('./invitations/invitation-list.component').then(m => m.InvitationListComponent)
21:   },
22:   {
23:     path: ':id/edit',
24:     loadComponent: () => import('./form/collaboration-form.component').then(m => m.CollaborationFormComponent)
25:   },
26:   {
27:     path: ':id',
28:     loadComponent: () => import('./detail/collaboration-detail.component').then(m => m.CollaborationDetailComponent)
29:   }
30: ];
````

## File: src/app/routes/communication/comments/comment-create.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-comment-create',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'发表评论'"></page-header>
11: 
12:     <nz-card nzTitle="发布评论" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="评论提交流程建设中"
16:         nzDescription="此页面将提供富文本编辑、附件与 @ 提及功能。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class CommentCreateComponent {}
````

## File: src/app/routes/communication/comments/comment-list.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-comment-list',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'评论管理'">
11:       <ng-template #extra>
12:         <button nz-button nzType="primary" routerLink="/communication/comments/create">
13:           <span nz-icon nzType="plus"></span>
14:           新建评论
15:         </button>
16:       </ng-template>
17:     </page-header>
18: 
19:     <nz-card nzTitle="评论列表" style="margin-top: 16px;">
20:       <nz-alert
21:         nzType="info"
22:         nzMessage="评论管理功能建设中"
23:         nzDescription="此页面将提供评论筛选、搜索以及状态管理能力。"
24:         [nzShowIcon]="true"
25:         style="margin-bottom: 16px;"
26:       ></nz-alert>
27:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
28:     </nz-card>
29:   `
30: })
31: export class CommentListComponent {}
````

## File: src/app/routes/communication/discussions/discussion-list.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-discussion-list',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'讨论区'"></page-header>
11: 
12:     <nz-card nzTitle="讨论区" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="讨论区功能建设中"
16:         nzDescription="此页面将展示协作讨论串及其最新动态。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class DiscussionListComponent {}
````

## File: src/app/routes/communication/notifications/notification-center.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-notification-center',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'通知中心'"></page-header>
11: 
12:     <nz-card nzTitle="通知中心" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="通知中心功能建设中"
16:         nzDescription="此页面将集中展示系统通知，并支持已读/未读与筛选。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class NotificationCenterComponent {}
````

## File: src/app/routes/communication/realtime/realtime-notify.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-realtime-notify',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'即时通知'"></page-header>
11: 
12:     <nz-card nzTitle="实时通知" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="实时通知功能建设中"
16:         nzDescription="此页面将展示 WebSocket 推送与订阅配置。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class RealtimeNotifyComponent {}
````

## File: src/app/routes/communication/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: export const COMMUNICATION_ROUTES: Routes = [
 4:   {
 5:     path: '',
 6:     redirectTo: 'discussions',
 7:     pathMatch: 'full'
 8:   },
 9:   {
10:     path: 'discussions',
11:     loadComponent: () =>
12:       import('./discussions/discussion-list.component').then(m => m.DiscussionListComponent)
13:   },
14:   {
15:     path: 'comments',
16:     loadComponent: () => import('./comments/comment-list.component').then(m => m.CommentListComponent)
17:   },
18:   {
19:     path: 'comments/create',
20:     loadComponent: () =>
21:       import('./comments/comment-create.component').then(m => m.CommentCreateComponent)
22:   },
23:   {
24:     path: 'notifications',
25:     loadComponent: () =>
26:       import('./notifications/notification-center.component').then(m => m.NotificationCenterComponent)
27:   },
28:   {
29:     path: 'realtime',
30:     loadComponent: () =>
31:       import('./realtime/realtime-notify.component').then(m => m.RealtimeNotifyComponent)
32:   },
33:   {
34:     path: 'todos',
35:     loadComponent: () => import('./todos/todo-center.component').then(m => m.TodoCenterComponent)
36:   },
37:   {
38:     path: 'team-notify',
39:     loadComponent: () =>
40:       import('./team-notify/team-notify.component').then(m => m.TeamNotifyComponent)
41:   }
42: ];
````

## File: src/app/routes/communication/team-notify/team-notify.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-team-notify',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'团队通知'"></page-header>
11: 
12:     <nz-card nzTitle="团队通知" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="团队通知功能建设中"
16:         nzDescription="此页面将管理跨团队公告与站内广播。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class TeamNotifyComponent {}
````

## File: src/app/routes/communication/todos/todo-center.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-todo-center',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'待办中心'"></page-header>
11: 
12:     <nz-card nzTitle="待办中心" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="待办中心功能建设中"
16:         nzDescription="此页面将联动任务与评论生成的待办列表。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class TodoCenterComponent {}
````

## File: src/app/routes/dashboard/analysis/analysis.component.ts
````typescript
  1: import { DecimalPipe } from '@angular/common';
  2: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
  3: import { STColumn } from '@delon/abc/st';
  4: import { G2BarModule } from '@delon/chart/bar';
  5: import { G2CardModule } from '@delon/chart/card';
  6: import { G2MiniAreaModule } from '@delon/chart/mini-area';
  7: import { G2MiniBarModule } from '@delon/chart/mini-bar';
  8: import { G2MiniProgressModule } from '@delon/chart/mini-progress';
  9: import { NumberInfoModule } from '@delon/chart/number-info';
 10: import { G2PieModule } from '@delon/chart/pie';
 11: import { G2TimelineModule } from '@delon/chart/timeline';
 12: import { TrendModule } from '@delon/chart/trend';
 13: import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
 14: import { getTimeDistance } from '@delon/util/date-time';
 15: import { deepCopy } from '@delon/util/other';
 16: import { SHARED_IMPORTS, yuan } from '@shared';
 17: import type { NzSafeAny } from 'ng-zorro-antd/core/types';
 18: import { NzMessageService } from 'ng-zorro-antd/message';
 19: 
 20: @Component({
 21:   selector: 'app-dashboard-analysis',
 22:   templateUrl: './analysis.component.html',
 23:   styleUrls: ['./analysis.component.less'],
 24:   changeDetection: ChangeDetectionStrategy.OnPush,
 25:   imports: [
 26:     ...SHARED_IMPORTS,
 27:     G2TimelineModule,
 28:     G2PieModule,
 29:     NumberInfoModule,
 30:     TrendModule,
 31:     G2MiniAreaModule,
 32:     DecimalPipe,
 33:     G2BarModule,
 34:     G2MiniProgressModule,
 35:     G2CardModule,
 36:     G2MiniBarModule
 37:   ]
 38: })
 39: export class DashboardAnalysisComponent implements OnInit {
 40:   private readonly http = inject(_HttpClient);
 41:   readonly msg = inject(NzMessageService);
 42:   private readonly i18n = inject(ALAIN_I18N_TOKEN);
 43:   private readonly cdr = inject(ChangeDetectorRef);
 44: 
 45:   data: any = {};
 46:   loading = true;
 47:   dateRange: Date[] = [];
 48:   dateRangeTypes = ['today', 'week', 'month', 'year'];
 49:   dateRangeType = this.dateRangeTypes[0];
 50:   rankingListData: Array<{ title: string; total: number }> = Array(7)
 51:     .fill({})
 52:     .map((_, i) => {
 53:       return {
 54:         title: this.i18n.fanyi('app.analysis.test', { no: i }),
 55:         total: 323234
 56:       };
 57:     });
 58:   titleMap = {
 59:     y1: this.i18n.fanyi('app.analysis.traffic'),
 60:     y2: this.i18n.fanyi('app.analysis.payments')
 61:   };
 62:   searchColumn: STColumn[] = [
 63:     { title: { text: '排名', i18n: 'app.analysis.table.rank' }, index: 'index' },
 64:     {
 65:       title: { text: '搜索关键词', i18n: 'app.analysis.table.search-keyword' },
 66:       index: 'keyword',
 67:       click: item => this.msg.success(item.keyword)
 68:     },
 69:     {
 70:       type: 'number',
 71:       title: { text: '用户数', i18n: 'app.analysis.table.users' },
 72:       index: 'count',
 73:       sort: {
 74:         compare: (a, b) => a.count - b.count
 75:       }
 76:     },
 77:     {
 78:       type: 'number',
 79:       title: { text: '周涨幅', i18n: 'app.analysis.table.weekly-range' },
 80:       index: 'range',
 81:       render: 'range',
 82:       sort: {
 83:         compare: (a, b) => a.range - b.range
 84:       }
 85:     }
 86:   ];
 87: 
 88:   salesType = 'all';
 89:   salesPieData: any;
 90:   salesTotal = 0;
 91: 
 92:   saleTabs: string[] = ['sales', 'visits'];
 93: 
 94:   offlineIdx = 0;
 95: 
 96:   ngOnInit(): void {
 97:     this.http.get('/chart').subscribe(res => {
 98:       res.offlineData.forEach((item: any) => {
 99:         item.chart = deepCopy(res.offlineChartData);
100:       });
101:       this.data = res;
102:       this.loading = false;
103:       this.changeSaleType();
104:     });
105:   }
106: 
107:   setDate(type: string): void {
108:     this.dateRange = getTimeDistance(type as NzSafeAny);
109:     this.dateRangeType = type;
110:     setTimeout(() => this.cdr.detectChanges());
111:   }
112:   changeSaleType(): void {
113:     this.salesPieData =
114:       this.salesType === 'all'
115:         ? this.data.salesTypeData
116:         : this.salesType === 'online'
117:           ? this.data.salesTypeDataOnline
118:           : this.data.salesTypeDataOffline;
119:     if (this.salesPieData) {
120:       this.salesTotal = this.salesPieData.reduce((pre: number, now: { y: number }) => now.y + pre, 0);
121:     }
122:     this.cdr.detectChanges();
123:   }
124: 
125:   handlePieValueFormat(value: string | number): string {
126:     return yuan(value);
127:   }
128:   offlineChange(idx: number): void {
129:     if (this.data.offlineData[idx].show !== true) {
130:       this.data.offlineData[idx].show = true;
131:       this.cdr.detectChanges();
132:     }
133:   }
134: }
````

## File: src/app/routes/dashboard/monitor/monitor.component.ts
````typescript
  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
  2: import { CountDownModule } from '@delon/abc/count-down';
  3: import { G2GaugeModule } from '@delon/chart/gauge';
  4: import { G2MiniAreaModule } from '@delon/chart/mini-area';
  5: import { NumberInfoModule } from '@delon/chart/number-info';
  6: import { G2PieModule } from '@delon/chart/pie';
  7: import { G2TagCloudModule } from '@delon/chart/tag-cloud';
  8: import { G2WaterWaveModule } from '@delon/chart/water-wave';
  9: import { _HttpClient } from '@delon/theme';
 10: import { SHARED_IMPORTS } from '@shared';
 11: import type { CountdownConfig } from 'ngx-countdown';
 12: import { zip } from 'rxjs';
 13: 
 14: @Component({
 15:   selector: 'app-dashboard-monitor',
 16:   templateUrl: './monitor.component.html',
 17:   styleUrls: ['./monitor.component.less'],
 18:   changeDetection: ChangeDetectionStrategy.OnPush,
 19:   imports: [
 20:     ...SHARED_IMPORTS,
 21:     G2WaterWaveModule,
 22:     G2TagCloudModule,
 23:     G2PieModule,
 24:     G2GaugeModule,
 25:     G2MiniAreaModule,
 26:     NumberInfoModule,
 27:     CountDownModule
 28:   ]
 29: })
 30: export class DashboardMonitorComponent implements OnInit, OnDestroy {
 31:   private readonly http = inject(_HttpClient);
 32:   private readonly cdr = inject(ChangeDetectorRef);
 33: 
 34:   data: any = {};
 35:   tags = [];
 36:   loading = true;
 37:   q = {
 38:     start: null,
 39:     end: null
 40:   };
 41:   percent: number | null = null;
 42:   cd: CountdownConfig = {
 43:     format: `HH:mm:ss.S`,
 44:     leftTime: 10000
 45:   };
 46: 
 47:   // region: active chart
 48: 
 49:   activeTime$: any;
 50: 
 51:   activeData!: any[];
 52: 
 53:   activeStat = {
 54:     max: 0,
 55:     min: 0,
 56:     t1: '',
 57:     t2: ''
 58:   };
 59: 
 60:   ngOnInit(): void {
 61:     zip(this.http.get('/chart'), this.http.get('/chart/tags')).subscribe(([res, tags]: [any, any]) => {
 62:       this.data = res;
 63:       tags.list[Math.floor(Math.random() * tags.list.length) + 1].value = 1000;
 64:       this.tags = tags.list;
 65:       this.loading = false;
 66:       this.cdr.detectChanges();
 67:     });
 68: 
 69:     // active chart
 70:     this.refData();
 71:     this.activeTime$ = setInterval(() => this.refData(), 1000 * 2);
 72:   }
 73: 
 74:   refData(): void {
 75:     const activeData: any[] = [];
 76:     for (let i = 0; i < 24; i += 1) {
 77:       activeData.push({
 78:         x: `${i.toString().padStart(2, '0')}:00`,
 79:         y: i * 50 + Math.floor(Math.random() * 200)
 80:       });
 81:     }
 82:     this.activeData = activeData;
 83:     // stat
 84:     this.activeStat.max = [...activeData].sort()[activeData.length - 1].y + 200;
 85:     this.activeStat.min = [...activeData].sort()[Math.floor(activeData.length / 2)].y;
 86:     this.activeStat.t1 = activeData[Math.floor(activeData.length / 2)].x;
 87:     this.activeStat.t2 = activeData[activeData.length - 1].x;
 88:     // percent
 89:     this.percent = Math.floor(Math.random() * 100);
 90:     this.cdr.detectChanges();
 91:   }
 92: 
 93:   // endregion
 94: 
 95:   couponFormat(val: any): string {
 96:     switch (parseInt(val, 10)) {
 97:       case 20:
 98:         return '差';
 99:       case 40:
100:         return '中';
101:       case 60:
102:         return '良';
103:       case 80:
104:         return '优';
105:       default:
106:         return '';
107:     }
108:   }
109: 
110:   ngOnDestroy(): void {
111:     if (this.activeTime$) {
112:       clearInterval(this.activeTime$);
113:     }
114:   }
115: }
````

## File: src/app/routes/dashboard/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: import { DashboardAnalysisComponent } from './analysis/analysis.component';
 4: import { DashboardMonitorComponent } from './monitor/monitor.component';
 5: import { DashboardV1Component } from './v1/v1.component';
 6: import { DashboardWorkplaceComponent } from './workplace/workplace.component';
 7: 
 8: export const routes: Routes = [
 9:   { path: '', redirectTo: 'v1', pathMatch: 'full' },
10:   { path: 'v1', component: DashboardV1Component },
11:   { path: 'analysis', component: DashboardAnalysisComponent },
12:   { path: 'monitor', component: DashboardMonitorComponent },
13:   { path: 'workplace', component: DashboardWorkplaceComponent }
14: ];
````

## File: src/app/routes/dashboard/v1/v1.component.ts
````typescript
  1: import { Platform } from '@angular/cdk/platform';
  2: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, DOCUMENT } from '@angular/core';
  3: import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
  4: import type { Chart } from '@antv/g2';
  5: import { OnboardingModule, OnboardingService } from '@delon/abc/onboarding';
  6: import { QuickMenuModule } from '@delon/abc/quick-menu';
  7: import { G2BarModule } from '@delon/chart/bar';
  8: import { G2MiniBarModule } from '@delon/chart/mini-bar';
  9: import { G2TimelineModule } from '@delon/chart/timeline';
 10: import { _HttpClient } from '@delon/theme';
 11: import { SHARED_IMPORTS } from '@shared';
 12: import { timer } from 'rxjs';
 13: 
 14: @Component({
 15:   selector: 'app-dashboard-v1',
 16:   templateUrl: './v1.component.html',
 17:   changeDetection: ChangeDetectionStrategy.OnPush,
 18:   imports: [...SHARED_IMPORTS, G2TimelineModule, G2BarModule, G2MiniBarModule, QuickMenuModule, OnboardingModule]
 19: })
 20: export class DashboardV1Component implements OnInit {
 21:   private readonly http = inject(_HttpClient);
 22:   private readonly cdr = inject(ChangeDetectorRef);
 23:   private readonly obSrv = inject(OnboardingService);
 24:   private readonly platform = inject(Platform);
 25:   private readonly doc = inject(DOCUMENT);
 26:   todoData = [
 27:     {
 28:       completed: true,
 29:       avatar: '1',
 30:       name: '苏先生',
 31:       content: `请告诉我，我应该说点什么好？`
 32:     },
 33:     {
 34:       completed: false,
 35:       avatar: '2',
 36:       name: 'はなさき',
 37:       content: `ハルカソラトキヘダツヒカリ`
 38:     },
 39:     {
 40:       completed: false,
 41:       avatar: '3',
 42:       name: 'cipchk',
 43:       content: `this world was never meant for one as beautiful as you.`
 44:     },
 45:     {
 46:       completed: false,
 47:       avatar: '4',
 48:       name: 'Kent',
 49:       content: `my heart is beating with hers`
 50:     },
 51:     {
 52:       completed: false,
 53:       avatar: '5',
 54:       name: 'Are you',
 55:       content: `They always said that I love beautiful girl than my friends`
 56:     },
 57:     {
 58:       completed: false,
 59:       avatar: '6',
 60:       name: 'Forever',
 61:       content: `Walking through green fields ，sunshine in my eyes.`
 62:     }
 63:   ];
 64: 
 65:   webSite!: any[];
 66:   salesData!: any[];
 67:   offlineChartData!: any[];
 68: 
 69:   constructor() {
 70:     timer(1000)
 71:       .pipe(takeUntilDestroyed())
 72:       .subscribe(() => this.genOnboarding());
 73:   }
 74: 
 75:   fixDark(chart: Chart): void {
 76:     if (!this.platform.isBrowser || (this.doc.body as HTMLBodyElement).getAttribute('data-theme') !== 'dark') return;
 77: 
 78:     chart.theme({
 79:       styleSheet: {
 80:         backgroundColor: 'transparent'
 81:       }
 82:     });
 83:   }
 84: 
 85:   ngOnInit(): void {
 86:     this.http.get('/chart').subscribe(res => {
 87:       this.webSite = res.visitData.slice(0, 10);
 88:       this.salesData = res.salesData;
 89:       this.offlineChartData = res.offlineChartData;
 90:       this.cdr.detectChanges();
 91:     });
 92:   }
 93: 
 94:   private genOnboarding(): void {
 95:     const KEY = 'on-boarding';
 96:     if (!this.platform.isBrowser || localStorage.getItem(KEY) === '1') {
 97:       return;
 98:     }
 99:     this.http.get(`./assets/tmp/on-boarding.json`).subscribe(res => {
100:       this.obSrv.start(res);
101:       localStorage.setItem(KEY, '1');
102:     });
103:   }
104: }
````

## File: src/app/routes/dashboard/workplace/workplace.component.ts
````typescript
  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
  2: import { G2RadarModule } from '@delon/chart/radar';
  3: import { _HttpClient } from '@delon/theme';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: import { zip } from 'rxjs';
  8: 
  9: @Component({
 10:   selector: 'app-dashboard-workplace',
 11:   templateUrl: './workplace.component.html',
 12:   styleUrls: ['./workplace.component.less'],
 13:   changeDetection: ChangeDetectionStrategy.OnPush,
 14:   imports: [...SHARED_IMPORTS, NzAvatarModule, G2RadarModule]
 15: })
 16: export class DashboardWorkplaceComponent implements OnInit {
 17:   private readonly http = inject(_HttpClient);
 18:   readonly msg = inject(NzMessageService);
 19:   private readonly cdr = inject(ChangeDetectorRef);
 20: 
 21:   notice: any[] = [];
 22:   activities: any[] = [];
 23:   radarData!: any[];
 24:   loading = true;
 25: 
 26:   links = [
 27:     {
 28:       title: '操作一',
 29:       href: ''
 30:     },
 31:     {
 32:       title: '操作二',
 33:       href: ''
 34:     },
 35:     {
 36:       title: '操作三',
 37:       href: ''
 38:     },
 39:     {
 40:       title: '操作四',
 41:       href: ''
 42:     },
 43:     {
 44:       title: '操作五',
 45:       href: ''
 46:     },
 47:     {
 48:       title: '操作六',
 49:       href: ''
 50:     }
 51:   ];
 52:   members = [
 53:     {
 54:       id: 'members-1',
 55:       title: '科学搬砖组',
 56:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
 57:       link: ''
 58:     },
 59:     {
 60:       id: 'members-2',
 61:       title: '程序员日常',
 62:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
 63:       link: ''
 64:     },
 65:     {
 66:       id: 'members-3',
 67:       title: '设计天团',
 68:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
 69:       link: ''
 70:     },
 71:     {
 72:       id: 'members-4',
 73:       title: '中二少女团',
 74:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
 75:       link: ''
 76:     },
 77:     {
 78:       id: 'members-5',
 79:       title: '骗你学计算机',
 80:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
 81:       link: ''
 82:     }
 83:   ];
 84: 
 85:   ngOnInit(): void {
 86:     zip(this.http.get('/chart'), this.http.get('/api/notice'), this.http.get('/api/activities')).subscribe(
 87:       ([chart, notice, activities]: [any, any, any]) => {
 88:         this.radarData = chart.radarData;
 89:         this.notice = notice;
 90:         this.activities = activities.map((item: any) => {
 91:           item.template = item.template.split(/@\{([^{}]*)\}/gi).map((key: string) => {
 92:             if (item[key]) {
 93:               return `<a>${item[key].name}</a>`;
 94:             }
 95:             return key;
 96:           });
 97:           return item;
 98:         });
 99:         this.loading = false;
100:         this.cdr.detectChanges();
101:       }
102:     );
103:   }
104: }
````

## File: src/app/routes/data-v/relation/relation.component.ts
````typescript
1: import { Component } from '@angular/core';
2: import { SHARED_IMPORTS } from '@shared';
3: 
4: @Component({
5:   selector: 'app-data-v-relation',
6:   templateUrl: './relation.component.html',
7:   imports: SHARED_IMPORTS
8: })
9: export class RelationComponent {}
````

## File: src/app/routes/data-v/routes.ts
````typescript
1: import { Routes } from '@angular/router';
2: 
3: import { RelationComponent } from './relation/relation.component';
4: 
5: export const routes: Routes = [{ path: 'relation', component: RelationComponent }];
````

## File: src/app/routes/delon/acl/acl.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { ACLService } from '@delon/acl';
 3: import { MenuService } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: 
 6: @Component({
 7:   selector: 'app-acl',
 8:   templateUrl: './acl.component.html',
 9:   imports: SHARED_IMPORTS
10: })
11: export class ACLComponent {
12:   private readonly aclSrv = inject(ACLService);
13:   private readonly menuSrv = inject(MenuService);
14: 
15:   full = true;
16:   roleA = '';
17:   roleB = '';
18: 
19:   get data(): {
20:     full: boolean;
21:     roles: string[];
22:     abilities: Array<string | number>;
23:   } {
24:     return this.aclSrv.data;
25:   }
26: 
27:   private reMenu(): void {
28:     this.menuSrv.resume();
29:   }
30: 
31:   toggleFull(): void {
32:     this.full = !this.full;
33:     this.aclSrv.setFull(this.full);
34:     this.reMenu();
35:   }
36: 
37:   toggleRoleA(): void {
38:     this.full = false;
39:     this.roleA = this.roleA === 'role-a' ? '' : 'role-a';
40:     this.aclSrv.setFull(this.full);
41:     this.aclSrv.setRole([this.roleA]);
42:     this.reMenu();
43:   }
44: 
45:   toggleRoleB(): void {
46:     this.full = false;
47:     this.roleB = this.roleB === 'role-b' ? '' : 'role-b';
48:     this.aclSrv.setFull(this.full);
49:     this.aclSrv.setRole([this.roleB]);
50:     this.reMenu();
51:   }
52: }
````

## File: src/app/routes/delon/cache/cache.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { CacheService } from '@delon/cache';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-cache',
 8:   templateUrl: './cache.component.html',
 9:   imports: SHARED_IMPORTS
10: })
11: export class CacheComponent {
12:   private readonly cache = inject(CacheService);
13:   private readonly msg = inject(NzMessageService);
14: 
15:   KEY = 'user';
16: 
17:   set(): void {
18:     this.cache.set(this.KEY, +new Date());
19:   }
20: 
21:   get(): void {
22:     this.msg.success(this.cache.getNone(this.KEY));
23:   }
24: }
````

## File: src/app/routes/delon/downfile/downfile.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { DownFileDirective } from '@delon/abc/down-file';
 3: import { SHARED_IMPORTS } from '@shared';
 4: 
 5: @Component({
 6:   selector: 'app-down-file',
 7:   templateUrl: './downfile.component.html',
 8:   imports: [...SHARED_IMPORTS, DownFileDirective]
 9: })
10: export class DownFileComponent {
11:   fileTypes = ['.xlsx', '.docx', '.pptx', '.pdf'];
12: 
13:   data = {
14:     otherdata: 1,
15:     time: new Date()
16:   };
17: }
````

## File: src/app/routes/delon/form/form.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { STColumn } from '@delon/abc/st';
 3: import { SFSchema } from '@delon/form';
 4: import { SHARED_IMPORTS } from '@shared';
 5: 
 6: @Component({
 7:   selector: 'app-delon-form',
 8:   templateUrl: './form.component.html',
 9:   imports: SHARED_IMPORTS
10: })
11: export class DelonFormComponent {
12:   params: any = {};
13:   url = `/user`;
14:   searchSchema: SFSchema = {
15:     properties: {
16:       no: {
17:         type: 'string',
18:         title: '编号'
19:       }
20:     }
21:   };
22:   columns: STColumn[] = [
23:     { title: '编号', index: 'no' },
24:     { title: '调用次数', type: 'number', index: 'callNo' },
25:     { title: '头像', type: 'img', width: '50px', index: 'avatar' },
26:     { title: '时间', type: 'date', index: 'updatedAt' }
27:   ];
28: }
````

## File: src/app/routes/delon/guard/admin.component.ts
````typescript
1: import { Component } from '@angular/core';
2: 
3: @Component({
4:   selector: 'app-guard-admin',
5:   template: ` <p>这是一个admin页面</p> `
6: })
7: export class GuardAdminComponent {}
````

## File: src/app/routes/delon/guard/auth.component.ts
````typescript
1: import { Component } from '@angular/core';
2: 
3: @Component({
4:   selector: 'app-guard-auth',
5:   template: ` <p>这是一个user1页面</p> `
6: })
7: export class GuardAuthComponent {}
````

## File: src/app/routes/delon/guard/can-leave.ts
````typescript
 1: import { inject } from '@angular/core';
 2: import { CanDeactivateFn } from '@angular/router';
 3: import { NzModalService } from 'ng-zorro-antd/modal';
 4: import { Observable } from 'rxjs';
 5: 
 6: import { GuardComponent } from './guard.component';
 7: 
 8: export const canLeave: CanDeactivateFn<GuardComponent> = (): Observable<boolean> => {
 9:   const srv = inject(NzModalService);
10:   return new Observable(observer => {
11:     srv.confirm({
12:       nzTitle: '确认要离开吗？',
13:       nzContent: '你已经填写了部分表单离开会放弃已经填写的内容。',
14:       nzOkText: '离开',
15:       nzCancelText: '取消',
16:       nzOnOk: () => {
17:         observer.next(true);
18:         observer.complete();
19:       },
20:       nzOnCancel: () => {
21:         observer.next(false);
22:         observer.complete();
23:       }
24:     });
25:   });
26: };
````

## File: src/app/routes/delon/guard/guard.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { Router } from '@angular/router';
 3: import { ACLService } from '@delon/acl';
 4: import { MenuService } from '@delon/theme';
 5: import { SHARED_IMPORTS } from '@shared';
 6: 
 7: @Component({
 8:   selector: 'app-guard',
 9:   templateUrl: './guard.component.html',
10:   imports: SHARED_IMPORTS
11: })
12: export class GuardComponent {
13:   private readonly aclSrv = inject(ACLService);
14:   private readonly menuSrv = inject(MenuService);
15:   private readonly router = inject(Router);
16: 
17:   get data(): any {
18:     return this.aclSrv.data;
19:   }
20: 
21:   setRole(value: string | boolean): void {
22:     this.aclSrv.setFull(false);
23:     if (typeof value === 'boolean') {
24:       this.aclSrv.setFull(value);
25:     } else {
26:       this.aclSrv.set({ role: [value as string] });
27:     }
28:     this.menuSrv.resume();
29:     this.router.navigate(['/delon/guard']);
30:   }
31: }
````

## File: src/app/routes/delon/guard/leave.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-guard-leave',
 6:   template: `
 7:     <p>离开时需要确认</p>
 8:     <button nz-button [nzType]="'primary'" [routerLink]="['/delon/guard']">
 9:       <span>我要离开</span>
10:     </button>
11:   `,
12:   imports: SHARED_IMPORTS
13: })
14: export class GuardLeaveComponent {}
````

## File: src/app/routes/delon/print/print.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { Lodop, LodopService } from '@delon/abc/lodop';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-print',
 8:   templateUrl: './print.component.html',
 9:   imports: SHARED_IMPORTS
10: })
11: export class PrintComponent {
12:   private readonly lodopSrv = inject(LodopService);
13:   private readonly msg = inject(NzMessageService);
14: 
15:   constructor() {
16:     this.lodopSrv.lodop.subscribe(({ lodop, ok }) => {
17:       if (!ok) {
18:         this.error = true;
19:         return;
20:       }
21:       this.error = false;
22:       this.msg.success(`打印机加载成功`);
23:       this.lodop = lodop as Lodop;
24:       this.pinters = this.lodopSrv.printer;
25:     });
26:   }
27: 
28:   cog: any = {
29:     url: 'https://localhost:8443/CLodopfuncs.js',
30:     printer: '',
31:     paper: '',
32:     html: `
33:       <h1>Title</h1>
34:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
35:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
36:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
37:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
38:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
39:     `
40:   };
41:   error = false;
42:   lodop: Lodop | null = null;
43:   pinters: any[] = [];
44:   papers: string[] = [];
45: 
46:   printing = false;
47: 
48:   reload(options: { url: string } | null = { url: 'https://localhost:8443/CLodopfuncs.js' }): void {
49:     this.pinters = [];
50:     this.papers = [];
51:     this.cog.printer = '';
52:     this.cog.paper = '';
53: 
54:     this.lodopSrv.cog = { ...this.cog, ...options };
55:     this.error = false;
56:     if (options === null) {
57:       this.lodopSrv.reset();
58:     }
59:   }
60: 
61:   changePinter(name: string): void {
62:     if (this.lodop == null) {
63:       return;
64:     }
65:     this.papers = this.lodop.GET_PAGESIZES_LIST(name, '\n').split('\n');
66:   }
67:   print(isPrivew = false): void {
68:     const LODOP = this.lodop as Lodop;
69:     LODOP.PRINT_INITA(10, 20, 810, 610, '测试C-Lodop远程打印四步骤');
70:     LODOP.SET_PRINTER_INDEXA(this.cog.printer);
71:     LODOP.SET_PRINT_PAGESIZE(0, 0, 0, this.cog.paper);
72:     LODOP.ADD_PRINT_TEXT(1, 1, 300, 200, '下面输出的是本页源代码及其展现效果：');
73:     LODOP.ADD_PRINT_TEXT(20, 10, '90%', '95%', this.cog.html);
74:     LODOP.SET_PRINT_STYLEA(0, 'ItemType', 4);
75:     LODOP.NEWPAGEA();
76:     LODOP.ADD_PRINT_HTM(20, 10, '90%', '95%', this.cog.html);
77:     if (isPrivew) {
78:       LODOP.PREVIEW();
79:     } else {
80:       LODOP.PRINT();
81:     }
82:   }
83: }
````

## File: src/app/routes/delon/qr/qr.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzQRCodeComponent } from 'ng-zorro-antd/qr-code';
 4: 
 5: @Component({
 6:   selector: 'app-qr',
 7:   templateUrl: './qr.component.html',
 8:   imports: [...SHARED_IMPORTS, NzQRCodeComponent]
 9: })
10: export class QRComponent {
11:   value = 'https://ng-alain.com/';
12:   background = '#ffffff';
13:   foreground = '#000000';
14:   level: 'L' | 'M' | 'Q' | 'H' = 'L';
15:   mime = 'image/png';
16:   padding = 10;
17:   size = 220;
18: }
````

## File: src/app/routes/delon/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: import { aclCanActivate } from '@delon/acl';
 3: 
 4: import { ACLComponent } from './acl/acl.component';
 5: import { CacheComponent } from './cache/cache.component';
 6: import { DownFileComponent } from './downfile/downfile.component';
 7: import { DelonFormComponent } from './form/form.component';
 8: import { GuardAdminComponent } from './guard/admin.component';
 9: import { GuardAuthComponent } from './guard/auth.component';
10: import { canLeave } from './guard/can-leave';
11: import { GuardComponent } from './guard/guard.component';
12: import { GuardLeaveComponent } from './guard/leave.component';
13: import { PrintComponent } from './print/print.component';
14: import { QRComponent } from './qr/qr.component';
15: import { STDemoComponent } from './st/st.component';
16: import { UtilComponent } from './util/util.component';
17: import { XlsxComponent } from './xlsx/xlsx.component';
18: import { ZipComponent } from './zip/zip.component';
19: 
20: export const routes: Routes = [
21:   { path: 'st', component: STDemoComponent },
22:   { path: 'util', component: UtilComponent },
23:   { path: 'print', component: PrintComponent },
24:   { path: 'acl', component: ACLComponent },
25:   {
26:     path: 'guard',
27:     component: GuardComponent,
28:     children: [
29:       {
30:         path: 'leave',
31:         component: GuardLeaveComponent,
32:         canDeactivate: [canLeave]
33:       },
34:       {
35:         path: 'auth',
36:         component: GuardAuthComponent,
37:         canActivate: [aclCanActivate],
38:         data: { guard: 'user1' }
39:       },
40:       {
41:         path: 'admin',
42:         component: GuardAdminComponent,
43:         canActivate: [aclCanActivate],
44:         data: { guard: 'admin' }
45:       }
46:     ]
47:   },
48:   { path: 'cache', component: CacheComponent },
49:   { path: 'qr', component: QRComponent },
50:   { path: 'downfile', component: DownFileComponent },
51:   { path: 'xlsx', component: XlsxComponent },
52:   { path: 'zip', component: ZipComponent },
53:   { path: 'form', component: DelonFormComponent }
54: ];
````

## File: src/app/routes/delon/st/st.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { FullContentModule } from '@delon/abc/full-content';
 3: import { STColumn } from '@delon/abc/st';
 4: import { G2MiniBarComponent, G2MiniBarData } from '@delon/chart/mini-bar';
 5: import { _HttpClient } from '@delon/theme';
 6: import { SHARED_IMPORTS } from '@shared';
 7: import { NzMessageService } from 'ng-zorro-antd/message';
 8: 
 9: @Component({
10:   selector: 'app-st',
11:   templateUrl: './st.component.html',
12:   imports: [...SHARED_IMPORTS, FullContentModule, G2MiniBarComponent]
13: })
14: export class STDemoComponent implements OnInit {
15:   readonly http = inject(_HttpClient);
16:   private readonly message = inject(NzMessageService);
17: 
18:   ps = 20;
19:   total = 200; // mock total
20:   args = { _allow_anonymous: true, userid: null };
21:   url = `https://api.randomuser.me/?results=20`;
22:   events: G2MiniBarData[] = [];
23:   scroll = { y: '230px' };
24:   columns: STColumn[] = [
25:     { title: 'id', index: 'id.value', type: 'checkbox' },
26:     { title: 'Avatar', index: 'picture.thumbnail', type: 'img', width: 80 },
27:     {
28:       title: 'Name',
29:       index: 'name.first',
30:       width: 150,
31:       format: item => `${item.name.first} ${item.name.last}`,
32:       type: 'link',
33:       click: item => this.message.info(`${item.name.first}`)
34:     },
35:     { title: 'Email', index: 'email' },
36:     {
37:       title: 'Gender',
38:       index: 'gender',
39:       type: 'yn',
40:       yn: {
41:         truth: 'female',
42:         yes: '男',
43:         no: '女',
44:         mode: 'text'
45:       },
46:       width: 120
47:     },
48:     { title: 'Events', render: 'events', width: 90 },
49:     { title: 'Registered', index: 'registered.date', type: 'date', width: 170 },
50:     {
51:       title: 'Actions',
52:       width: 120,
53:       buttons: [
54:         {
55:           text: 'Edit',
56:           click: item => this.message.info(`edit [${item.id.value}]`),
57:           iif: item => item.gender === 'female'
58:         },
59:         {
60:           text: 'Delete',
61:           type: 'del',
62:           click: item => this.message.info(`deleted [${item.id.value}]`)
63:         }
64:       ]
65:     }
66:   ];
67: 
68:   ngOnInit(): void {
69:     this.http.get('/chart/visit').subscribe((res: G2MiniBarData[]) => (this.events = res.slice(0, 8)));
70:   }
71: 
72:   fullChange(val?: boolean): void {
73:     this.scroll = val ? { y: '350px' } : { y: '230px' };
74:   }
75: }
````

## File: src/app/routes/delon/util/util.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { copy } from '@delon/util/browser';
 3: import { format } from '@delon/util/format';
 4: import { SHARED_IMPORTS, yuan } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-util',
 9:   templateUrl: './util.component.html',
10:   imports: SHARED_IMPORTS
11: })
12: export class UtilComponent {
13:   readonly messageSrv = inject(NzMessageService);
14: 
15:   format_str = 'this is ${name}';
16:   format_res = '';
17:   format_obj = JSON.stringify({ name: 'asdf' });
18: 
19:   // yuan
20:   yuan_str: any;
21:   yuan_res!: string;
22: 
23:   content = `time ${+new Date()}
24: 
25:     中文！@#￥%……&*`;
26:   onFormat(): void {
27:     let obj = null;
28:     try {
29:       obj = JSON.parse(this.format_obj);
30:     } catch {
31:       this.messageSrv.error(`无法使用 JSON.parse 转换`);
32:       return;
33:     }
34:     this.format_res = format(this.format_str, obj, true);
35:   }
36:   onYuan(value: string): void {
37:     this.yuan_res = yuan(value);
38:   }
39:   onCopy(): void {
40:     copy(`time ${+new Date()}`).then(() => this.messageSrv.success(`success`));
41:   }
42: }
````

## File: src/app/routes/delon/xlsx/xlsx.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { STColumn } from '@delon/abc/st';
 3: import { XlsxService } from '@delon/abc/xlsx';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 6: 
 7: @Component({
 8:   selector: 'app-xlsx',
 9:   templateUrl: './xlsx.component.html',
10:   imports: SHARED_IMPORTS
11: })
12: export class XlsxComponent {
13:   private readonly xlsx = inject(XlsxService);
14: 
15:   data: any;
16:   users: Array<{ id: number; name: string; age: number }> = Array(100)
17:     .fill(0)
18:     .map((_item: number, idx: number) => {
19:       return {
20:         id: idx + 1,
21:         name: `name ${idx + 1}`,
22:         age: Math.ceil(Math.random() * 10) + 20
23:       };
24:     });
25: 
26:   columns: STColumn[] = [
27:     { title: '编号', index: 'id', type: 'checkbox' },
28:     { title: '姓名', index: 'name' },
29:     { title: '年龄', index: 'age' }
30:   ];
31: 
32:   url(): void {
33:     this.xlsx.import(`./assets/tmp/demo.xlsx`).then(res => (this.data = res));
34:   }
35: 
36:   change(e: Event): void {
37:     const file = (e.target as HTMLInputElement).files![0];
38:     this.xlsx.import(file).then(res => (this.data = res));
39:   }
40: 
41:   download(): void {
42:     const data = [this.columns.map(i => i.title)];
43:     this.users.forEach((i: Record<string, NzSafeAny>) => data.push(this.columns.map(c => i[c.index as string])));
44:     this.xlsx.export({
45:       sheets: [
46:         {
47:           data,
48:           name: 'sheet name'
49:         }
50:       ]
51:     });
52:   }
53: }
````

## File: src/app/routes/delon/zip/zip.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { ZipService } from '@delon/abc/zip';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import type jsZipType from 'jszip';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-zip',
 9:   templateUrl: './zip.component.html',
10:   changeDetection: ChangeDetectionStrategy.OnPush,
11:   imports: SHARED_IMPORTS
12: })
13: export class ZipComponent implements OnInit {
14:   private readonly zip = inject(ZipService);
15:   private readonly msg = inject(NzMessageService);
16:   private readonly cdr = inject(ChangeDetectorRef);
17: 
18:   list: any;
19:   instance: jsZipType | null = null;
20:   data: Array<{ path?: string; url?: string }> = [
21:     { path: 'demo.docx', url: 'https://ng-alain.com/assets/demo.docx' },
22:     {
23:       path: '小程序标志.zip',
24:       url: 'https://wximg.gtimg.com/shake_tv/mina/standard_logo.zip'
25:     }
26:   ];
27: 
28:   ngOnInit(): void {
29:     this.zip.create().then(ret => {
30:       this.instance = ret;
31:       this.cdr.detectChanges();
32:     });
33:   }
34: 
35:   private format(data: any): void {
36:     const files = data.files;
37:     this.list = Object.keys(files).map(key => {
38:       return {
39:         name: key,
40:         dir: files[key].dir,
41:         date: files[key].date
42:       };
43:     });
44:     this.cdr.detectChanges();
45:   }
46: 
47:   url(): void {
48:     this.zip.read(`./assets/tmp/demo.zip`).then(res => this.format(res));
49:   }
50: 
51:   change(e: Event): void {
52:     const file = (e.target as HTMLInputElement).files![0];
53:     this.zip.read(file).then(res => this.format(res));
54:   }
55: 
56:   download(): void {
57:     const promises: Array<Promise<void>> = [];
58:     this.data.forEach(item => {
59:       promises.push(this.zip.pushUrl(this.instance, item.path!, item.url!));
60:     });
61:     Promise.all(promises).then(
62:       () => {
63:         this.zip.save(this.instance).then(() => {
64:           this.msg.success('download success');
65:           this.data = [];
66:         });
67:       },
68:       (error: unknown) => {
69:         console.warn(error);
70:         this.msg.error(JSON.stringify(error));
71:       }
72:     );
73:   }
74: }
````

## File: src/app/routes/documents/browser/document-browser.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-document-browser',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'文档浏览器'"></page-header>
11: 
12:     <nz-card nzTitle="文档浏览器" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="文档浏览器功能建设中"
16:         nzDescription="此页面将提供类似文件夹的层级浏览体验。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class DocumentBrowserComponent {}
````

## File: src/app/routes/documents/drawings/drawing-viewer.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-drawing-viewer',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'图纸查看器'"></page-header>
11: 
12:     <nz-card nzTitle="图纸查看器" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="图纸查看器功能建设中"
16:         nzDescription="此页面将支持大型图纸浏览、缩略图以及批注。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class DrawingViewerComponent {}
````

## File: src/app/routes/documents/list/document-list.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-document-list',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'文档列表'">
11:       <ng-template #extra>
12:         <button nz-button nzType="primary" routerLink="/documents/upload">
13:           <span nz-icon nzType="upload"></span>
14:           上传文档
15:         </button>
16:       </ng-template>
17:     </page-header>
18: 
19:     <nz-card nzTitle="文档列表" style="margin-top: 16px;">
20:       <nz-alert
21:         nzType="info"
22:         nzMessage="文档管理功能建设中"
23:         nzDescription="此页面将展示文档库与过滤条件。"
24:         [nzShowIcon]="true"
25:         style="margin-bottom: 16px;"
26:       ></nz-alert>
27:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
28:     </nz-card>
29:   `
30: })
31: export class DocumentListComponent {}
````

## File: src/app/routes/documents/metadata/document-metadata.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-document-metadata',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'文档元数据'"></page-header>
11: 
12:     <nz-card nzTitle="文档元数据" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="文档元数据功能建设中"
16:         nzDescription="此页面将显示文件属性、标签以及版本对照。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class DocumentMetadataComponent {}
````

## File: src/app/routes/documents/permissions/document-permission.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-document-permission',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'权限设置'"></page-header>
11: 
12:     <nz-card nzTitle="文档权限设置" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="文档权限功能建设中"
16:         nzDescription="此页面将管理文档 ACL、分享链接与审计信息。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class DocumentPermissionComponent {}
````

## File: src/app/routes/documents/preview/document-preview.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-document-preview',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'文档预览'"></page-header>
11: 
12:     <nz-card nzTitle="文档预览" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="文档预览功能建设中"
16:         nzDescription="此页面将支持 Office、PDF 以及 CAD 图纸等格式。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class DocumentPreviewComponent {}
````

## File: src/app/routes/documents/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: export const DOCUMENT_ROUTES: Routes = [
 4:   {
 5:     path: '',
 6:     redirectTo: 'list',
 7:     pathMatch: 'full'
 8:   },
 9:   {
10:     path: 'list',
11:     loadComponent: () => import('./list/document-list.component').then(m => m.DocumentListComponent)
12:   },
13:   {
14:     path: 'upload',
15:     loadComponent: () => import('./upload/document-upload.component').then(m => m.DocumentUploadComponent)
16:   },
17:   {
18:     path: 'browser',
19:     loadComponent: () =>
20:       import('./browser/document-browser.component').then(m => m.DocumentBrowserComponent)
21:   },
22:   {
23:     path: 'preview',
24:     loadComponent: () =>
25:       import('./preview/document-preview.component').then(m => m.DocumentPreviewComponent)
26:   },
27:   {
28:     path: 'drawings',
29:     loadComponent: () =>
30:       import('./drawings/drawing-viewer.component').then(m => m.DrawingViewerComponent)
31:   },
32:   {
33:     path: 'metadata',
34:     loadComponent: () =>
35:       import('./metadata/document-metadata.component').then(m => m.DocumentMetadataComponent)
36:   },
37:   {
38:     path: 'versions',
39:     loadComponent: () =>
40:       import('./versions/document-version.component').then(m => m.DocumentVersionComponent)
41:   },
42:   {
43:     path: 'permissions',
44:     loadComponent: () =>
45:       import('./permissions/document-permission.component').then(m => m.DocumentPermissionComponent)
46:   }
47: ];
````

## File: src/app/routes/documents/upload/document-upload.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-document-upload',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'上传文档'"></page-header>
11: 
12:     <nz-card nzTitle="上传文档" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="上传流程建设中"
16:         nzDescription="此页面将提供批量上传、版本注释与权限配置。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class DocumentUploadComponent {}
````

## File: src/app/routes/documents/versions/document-version.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-document-version',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'版本管理'"></page-header>
11: 
12:     <nz-card nzTitle="版本管理" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="版本管理功能建设中"
16:         nzDescription="此页面将提供版本比对、回滚与审批流程。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class DocumentVersionComponent {}
````

## File: src/app/routes/exception/exception.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { ActivatedRoute } from '@angular/router';
 3: import { ExceptionModule, ExceptionType } from '@delon/abc/exception';
 4: 
 5: @Component({
 6:   selector: 'app-exception',
 7:   template: ` <exception [type]="type" style="min-height: 500px; height: 80%;" />`,
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   imports: [ExceptionModule]
10: })
11: export class ExceptionComponent {
12:   private readonly route = inject(ActivatedRoute);
13:   get type(): ExceptionType {
14:     return this.route.snapshot.data['type'];
15:   }
16: }
````

## File: src/app/routes/exception/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: import { ExceptionComponent } from './exception.component';
 4: import { ExceptionTriggerComponent } from './trigger.component';
 5: 
 6: export const routes: Routes = [
 7:   { path: '403', component: ExceptionComponent, data: { type: 403 } },
 8:   { path: '404', component: ExceptionComponent, data: { type: 404 } },
 9:   { path: '500', component: ExceptionComponent, data: { type: 500 } },
10:   { path: 'trigger', component: ExceptionTriggerComponent }
11: ];
````

## File: src/app/routes/exception/trigger.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { DA_SERVICE_TOKEN } from '@delon/auth';
 3: import { _HttpClient } from '@delon/theme';
 4: import { NzButtonModule } from 'ng-zorro-antd/button';
 5: import { NzCardModule } from 'ng-zorro-antd/card';
 6: 
 7: @Component({
 8:   selector: 'exception-trigger',
 9:   template: `
10:     <div class="pt-lg">
11:       <nz-card>
12:         @for (t of types; track $index) {
13:           <button (click)="go(t)" nz-button nzDanger>触发{{ t }}</button>
14:         }
15:         <button nz-button nzType="link" (click)="refresh()">触发刷新Token</button>
16:       </nz-card>
17:     </div>
18:   `,
19:   imports: [NzCardModule, NzButtonModule]
20: })
21: export class ExceptionTriggerComponent {
22:   private readonly http = inject(_HttpClient);
23:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
24: 
25:   types = [401, 403, 404, 500];
26: 
27:   go(type: number): void {
28:     this.http.get(`/api/${type}`).subscribe();
29:   }
30: 
31:   refresh(): void {
32:     this.tokenService.set({ token: 'invalid-token' });
33:     // 必须提供一个后端地址，无法通过 Mock 来模拟
34:     this.http.post(`https://localhost:5001/auth`).subscribe({
35:       next: res => console.warn('成功', res),
36:       error: err => {
37:         console.log('最后结果失败', err);
38:       }
39:     });
40:   }
41: }
````

## File: src/app/routes/extras/helpcenter/helpcenter.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzMessageService } from 'ng-zorro-antd/message';
 4: 
 5: @Component({
 6:   selector: 'app-helpcenter',
 7:   templateUrl: './helpcenter.component.html',
 8:   imports: SHARED_IMPORTS
 9: })
10: export class HelpCenterComponent {
11:   readonly msg = inject(NzMessageService);
12:   type = '';
13:   q = '';
14: 
15:   quick(key: string): void {
16:     this.q = key;
17:     this.search();
18:   }
19: 
20:   search(): void {
21:     this.msg.success(`搜索：${this.q}`);
22:   }
23: }
````

## File: src/app/routes/extras/poi/edit/edit.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { _HttpClient } from '@delon/theme';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: import { NzModalRef } from 'ng-zorro-antd/modal';
 6: 
 7: @Component({
 8:   selector: 'app-extras-poi-edit',
 9:   templateUrl: './edit.component.html',
10:   imports: SHARED_IMPORTS
11: })
12: export class ExtrasPoiEditComponent implements OnInit {
13:   readonly msgSrv = inject(NzMessageService);
14:   private readonly modal = inject(NzModalRef);
15:   readonly http = inject(_HttpClient);
16: 
17:   i: any;
18:   cat: string[] = ['美食', '美食,粤菜', '美食,粤菜,湛江菜'];
19: 
20:   ngOnInit(): void {
21:     if (this.i.id > 0) {
22:       this.http.get('/pois').subscribe(res => (this.i = res.list[0]));
23:     }
24:   }
25: 
26:   save(): void {
27:     this.http.get('/pois').subscribe(() => {
28:       this.msgSrv.success('保存成功，只是模拟，实际未变更');
29:       this.modal.destroy(true);
30:     });
31:   }
32: 
33:   close(): void {
34:     this.modal.destroy();
35:   }
36: }
````

## File: src/app/routes/extras/poi/poi.component.ts
````typescript
 1: import { Component, ViewChild, inject } from '@angular/core';
 2: import { STColumn, STComponent } from '@delon/abc/st';
 3: import { ModalHelper } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: import { ExtrasPoiEditComponent } from './edit/edit.component';
 8: 
 9: @Component({
10:   selector: 'app-extras-poi',
11:   templateUrl: './poi.component.html',
12:   imports: SHARED_IMPORTS
13: })
14: export class ExtrasPoiComponent {
15:   private readonly msg = inject(NzMessageService);
16:   private readonly modal = inject(ModalHelper);
17: 
18:   @ViewChild('st', { static: true })
19:   st!: STComponent;
20:   s = {
21:     pi: 1,
22:     ps: 10,
23:     user_id: '',
24:     s: '',
25:     q: ''
26:   };
27:   url = '/pois';
28:   columns: STColumn[] = [
29:     { title: '编号', index: 'id', width: '100px' },
30:     { title: '门店名称', index: 'name' },
31:     { title: '分店名', index: 'branch_name' },
32:     { title: '状态', index: 'status_str', width: '100px' },
33:     {
34:       title: '操作',
35:       width: '180px',
36:       buttons: [
37:         {
38:           text: '编辑',
39:           type: 'modal',
40:           modal: {
41:             component: ExtrasPoiEditComponent,
42:             paramsName: 'i'
43:           },
44:           click: () => this.msg.info('回调，重新发起列表刷新')
45:         },
46:         { text: '图片', click: () => this.msg.info('click photo') },
47:         { text: '经营SKU', click: () => this.msg.info('click sku') }
48:       ]
49:     }
50:   ];
51: 
52:   add(): void {
53:     this.modal.createStatic(ExtrasPoiEditComponent, { i: { id: 0 } }).subscribe(() => {
54:       this.st.load();
55:       this.msg.info('回调，重新发起列表刷新');
56:     });
57:   }
58: }
````

## File: src/app/routes/extras/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: import { HelpCenterComponent } from './helpcenter/helpcenter.component';
 4: import { ExtrasPoiComponent } from './poi/poi.component';
 5: import { ExtrasSettingsComponent } from './settings/settings.component';
 6: 
 7: export const routes: Routes = [
 8:   { path: 'helpcenter', component: HelpCenterComponent },
 9:   { path: 'settings', component: ExtrasSettingsComponent },
10:   { path: 'poi', component: ExtrasPoiComponent }
11: ];
````

## File: src/app/routes/extras/settings/settings.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { FormBuilder, Validators } from '@angular/forms';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: import { NzUploadComponent } from 'ng-zorro-antd/upload';
 6: 
 7: @Component({
 8:   selector: 'app-extras-settings',
 9:   templateUrl: './settings.component.html',
10:   imports: [...SHARED_IMPORTS, NzUploadComponent]
11: })
12: export class ExtrasSettingsComponent implements OnInit {
13:   readonly msg = inject(NzMessageService);
14: 
15:   active = 1;
16:   profileForm = inject(FormBuilder).nonNullable.group({
17:     name: ['', Validators.compose([Validators.required, Validators.pattern(`^[-_a-zA-Z0-9]{4,20}$`)])],
18:     email: '',
19:     bio: ['', Validators.maxLength(160)],
20:     url: '',
21:     company: '',
22:     location: ''
23:   });
24:   pwd = {
25:     old_password: '',
26:     new_password: '',
27:     confirm_new_password: ''
28:   };
29:   // Email
30:   primary_email = 'cipchk@qq.com';
31: 
32:   profileSave(value: any): void {
33:     console.log('profile value', value);
34:   }
35: 
36:   pwdSave(): void {
37:     if (!this.pwd.old_password) {
38:       this.msg.error('invalid old password');
39:       return;
40:     }
41:     if (!this.pwd.new_password) {
42:       this.msg.error('invalid new password');
43:       return;
44:     }
45:     if (!this.pwd.confirm_new_password) {
46:       this.msg.error('invalid confirm new password');
47:       return;
48:     }
49:     console.log('pwd value', this.pwd);
50:   }
51: 
52:   ngOnInit(): void {
53:     this.profileForm.patchValue({
54:       name: 'cipchk',
55:       email: 'cipchk@qq.com'
56:     });
57:   }
58: }
````

## File: src/app/routes/issues/assignments/issue-assignments.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-issue-assignments',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'问题分配'"></page-header>
10: 
11:     <nz-card nzTitle="问题分配管理" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="问题分配功能开发中"
15:         nzDescription="此页面将用于管理问题的分配。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class IssueAssignmentsComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载问题分配数据
27:   }
28: }
````

## File: src/app/routes/issues/close/issue-close.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { ActivatedRoute, Router } from '@angular/router';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-issue-close',
 8:   standalone: true,
 9:   imports: [SHARED_IMPORTS],
10:   template: `
11:     <page-header [title]="'关闭问题'"></page-header>
12: 
13:     <nz-card nzTitle="关闭问题" style="margin-top: 16px;">
14:       <nz-alert
15:         nzType="info"
16:         nzMessage="关闭问题功能开发中"
17:         nzDescription="此页面将用于关闭问题。"
18:         [nzShowIcon]="true"
19:         style="margin-bottom: 16px;"
20:       ></nz-alert>
21: 
22:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
23:     </nz-card>
24:   `
25: })
26: export class IssueCloseComponent implements OnInit {
27:   route = inject(ActivatedRoute);
28:   router = inject(Router);
29:   message = inject(NzMessageService);
30: 
31:   issueId = '';
32: 
33:   ngOnInit(): void {
34:     this.issueId = this.route.snapshot.paramMap.get('id') || '';
35:     if (!this.issueId) {
36:       this.message.error('问题ID不存在');
37:       this.router.navigate(['/issues']);
38:     }
39:   }
40: }
````

## File: src/app/routes/issues/detail/issue-detail.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { ActivatedRoute, Router } from '@angular/router';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-issue-detail',
 8:   standalone: true,
 9:   imports: [SHARED_IMPORTS],
10:   template: `
11:     <page-header [title]="'问题详情'">
12:       <ng-template #extra>
13:         <button nz-button (click)="handle()">处理</button>
14:         <button nz-button nzType="primary" (click)="close()" style="margin-left: 8px;">关闭</button>
15:       </ng-template>
16:     </page-header>
17: 
18:     <nz-card nzTitle="问题详细信息" style="margin-top: 16px;">
19:       <nz-alert
20:         nzType="info"
21:         nzMessage="问题详情功能开发中"
22:         nzDescription="此页面将用于显示问题的详细信息。"
23:         [nzShowIcon]="true"
24:         style="margin-bottom: 16px;"
25:       ></nz-alert>
26: 
27:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
28:     </nz-card>
29:   `
30: })
31: export class IssueDetailComponent implements OnInit {
32:   route = inject(ActivatedRoute);
33:   router = inject(Router);
34:   message = inject(NzMessageService);
35: 
36:   issueId = '';
37: 
38:   ngOnInit(): void {
39:     this.issueId = this.route.snapshot.paramMap.get('id') || '';
40:     if (!this.issueId) {
41:       this.message.error('问题ID不存在');
42:       this.router.navigate(['/issues']);
43:     }
44:   }
45: 
46:   handle(): void {
47:     this.router.navigate(['/issues', this.issueId, 'handle']);
48:   }
49: 
50:   close(): void {
51:     this.router.navigate(['/issues', this.issueId, 'close']);
52:   }
53: }
````

## File: src/app/routes/issues/form/issue-form.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { ActivatedRoute, Router } from '@angular/router';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-issue-form',
 8:   standalone: true,
 9:   imports: [SHARED_IMPORTS],
10:   template: `
11:     <page-header [title]="isEdit ? '编辑问题' : '新建问题'"></page-header>
12: 
13:     <nz-card nzTitle="问题表单" style="margin-top: 16px;">
14:       <nz-alert
15:         nzType="info"
16:         nzMessage="问题表单功能开发中"
17:         nzDescription="此页面将用于创建或编辑问题。"
18:         [nzShowIcon]="true"
19:         style="margin-bottom: 16px;"
20:       ></nz-alert>
21: 
22:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
23:     </nz-card>
24:   `
25: })
26: export class IssueFormComponent implements OnInit {
27:   route = inject(ActivatedRoute);
28:   router = inject(Router);
29:   message = inject(NzMessageService);
30: 
31:   isEdit = false;
32:   issueId = '';
33: 
34:   ngOnInit(): void {
35:     this.issueId = this.route.snapshot.paramMap.get('id') || '';
36:     this.isEdit = !!this.issueId;
37:   }
38: }
````

## File: src/app/routes/issues/handle/issue-handle.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { ActivatedRoute, Router } from '@angular/router';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-issue-handle',
 8:   standalone: true,
 9:   imports: [SHARED_IMPORTS],
10:   template: `
11:     <page-header [title]="'处理问题'"></page-header>
12: 
13:     <nz-card nzTitle="问题处理" style="margin-top: 16px;">
14:       <nz-alert
15:         nzType="info"
16:         nzMessage="问题处理功能开发中"
17:         nzDescription="此页面将用于处理问题。"
18:         [nzShowIcon]="true"
19:         style="margin-bottom: 16px;"
20:       ></nz-alert>
21: 
22:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
23:     </nz-card>
24:   `
25: })
26: export class IssueHandleComponent implements OnInit {
27:   route = inject(ActivatedRoute);
28:   router = inject(Router);
29:   message = inject(NzMessageService);
30: 
31:   issueId = '';
32: 
33:   ngOnInit(): void {
34:     this.issueId = this.route.snapshot.paramMap.get('id') || '';
35:     if (!this.issueId) {
36:       this.message.error('问题ID不存在');
37:       this.router.navigate(['/issues']);
38:     }
39:   }
40: }
````

## File: src/app/routes/issues/list/issue-list.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { Router } from '@angular/router';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-issue-list',
 8:   standalone: true,
 9:   imports: [SHARED_IMPORTS],
10:   template: `
11:     <page-header [title]="'问题列表'">
12:       <ng-template #extra>
13:         <button nz-button nzType="primary" (click)="createIssue()">
14:           <span nz-icon nzType="plus"></span>
15:           新建问题
16:         </button>
17:       </ng-template>
18:     </page-header>
19: 
20:     <nz-card nzTitle="问题跟踪管理" style="margin-top: 16px;">
21:       <nz-alert
22:         nzType="info"
23:         nzMessage="问题跟踪功能开发中"
24:         nzDescription="此页面将用于显示和管理所有问题。"
25:         [nzShowIcon]="true"
26:         style="margin-bottom: 16px;"
27:       ></nz-alert>
28: 
29:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
30:     </nz-card>
31:   `
32: })
33: export class IssueListComponent implements OnInit {
34:   router = inject(Router);
35:   message = inject(NzMessageService);
36: 
37:   ngOnInit(): void {
38:     // TODO: 加载问题列表
39:   }
40: 
41:   createIssue(): void {
42:     this.router.navigate(['/issues/create']);
43:   }
44: }
````

## File: src/app/routes/issues/photos/issue-photos.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { ActivatedRoute, Router } from '@angular/router';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-issue-photos',
 8:   standalone: true,
 9:   imports: [SHARED_IMPORTS],
10:   template: `
11:     <page-header [title]="'处理照片'"></page-header>
12: 
13:     <nz-card nzTitle="问题处理照片管理" style="margin-top: 16px;">
14:       <nz-alert
15:         nzType="info"
16:         nzMessage="处理照片功能开发中"
17:         nzDescription="此页面将用于管理问题处理照片。"
18:         [nzShowIcon]="true"
19:         style="margin-bottom: 16px;"
20:       ></nz-alert>
21: 
22:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
23:     </nz-card>
24:   `
25: })
26: export class IssuePhotosComponent implements OnInit {
27:   route = inject(ActivatedRoute);
28:   router = inject(Router);
29:   message = inject(NzMessageService);
30: 
31:   issueId = '';
32: 
33:   ngOnInit(): void {
34:     this.issueId = this.route.snapshot.paramMap.get('id') || '';
35:     if (!this.issueId) {
36:       this.message.error('问题ID不存在');
37:       this.router.navigate(['/issues']);
38:     }
39:   }
40: }
````

## File: src/app/routes/issues/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: export const ISSUE_ROUTES: Routes = [
 4:   {
 5:     path: '',
 6:     redirectTo: 'list',
 7:     pathMatch: 'full'
 8:   },
 9:   {
10:     path: 'list',
11:     loadComponent: () => import('./list/issue-list.component').then(m => m.IssueListComponent)
12:   },
13:   {
14:     path: 'create',
15:     loadComponent: () => import('./form/issue-form.component').then(m => m.IssueFormComponent)
16:   },
17:   {
18:     path: ':id',
19:     loadComponent: () => import('./detail/issue-detail.component').then(m => m.IssueDetailComponent)
20:   },
21:   {
22:     path: 'assignments',
23:     loadComponent: () => import('./assignments/issue-assignments.component').then(m => m.IssueAssignmentsComponent)
24:   },
25:   {
26:     path: ':id/handle',
27:     loadComponent: () => import('./handle/issue-handle.component').then(m => m.IssueHandleComponent)
28:   },
29:   {
30:     path: ':id/photos',
31:     loadComponent: () => import('./photos/issue-photos.component').then(m => m.IssuePhotosComponent)
32:   },
33:   {
34:     path: ':id/close',
35:     loadComponent: () => import('./close/issue-close.component').then(m => m.IssueCloseComponent)
36:   }
37: ];
````

## File: src/app/routes/passport/callback.component.ts
````typescript
 1: import { Component, Input, OnInit, inject } from '@angular/core';
 2: import { SocialService } from '@delon/auth';
 3: import { SettingsService } from '@delon/theme';
 4: 
 5: @Component({
 6:   selector: 'app-callback',
 7:   template: ``,
 8:   providers: [SocialService],
 9:   standalone: true
10: })
11: export class CallbackComponent implements OnInit {
12:   private readonly socialService = inject(SocialService);
13:   private readonly settingsSrv = inject(SettingsService);
14:   @Input() type = '';
15: 
16:   ngOnInit(): void {
17:     this.mockModel();
18:   }
19: 
20:   private mockModel(): void {
21:     const info = {
22:       token: '123456789',
23:       name: 'cipchk',
24:       email: `${this.type}@${this.type}.com`,
25:       id: 10000,
26:       time: +new Date()
27:     };
28:     this.settingsSrv.setUser({
29:       ...this.settingsSrv.user,
30:       ...info
31:     });
32:     this.socialService.callback(info);
33:   }
34: }
````

## File: src/app/routes/passport/lock/lock.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 3: import { Router } from '@angular/router';
 4: import { DA_SERVICE_TOKEN } from '@delon/auth';
 5: import { I18nPipe, SettingsService, User } from '@delon/theme';
 6: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
 7: import { NzButtonModule } from 'ng-zorro-antd/button';
 8: import { NzFormModule } from 'ng-zorro-antd/form';
 9: import { NzGridModule } from 'ng-zorro-antd/grid';
10: import { NzInputModule } from 'ng-zorro-antd/input';
11: 
12: @Component({
13:   selector: 'passport-lock',
14:   templateUrl: './lock.component.html',
15:   styleUrls: ['./lock.component.less'],
16:   imports: [ReactiveFormsModule, I18nPipe, NzAvatarModule, NzFormModule, NzGridModule, NzButtonModule, NzInputModule]
17: })
18: export class UserLockComponent {
19:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
20:   private readonly settings = inject(SettingsService);
21:   private readonly router = inject(Router);
22: 
23:   f = new FormGroup({
24:     password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
25:   });
26: 
27:   get user(): User {
28:     return this.settings.user;
29:   }
30: 
31:   submit(): void {
32:     this.f.controls.password.markAsDirty();
33:     this.f.controls.password.updateValueAndValidity();
34:     if (this.f.valid) {
35:       console.log('Valid!');
36:       console.log(this.f.value);
37:       this.tokenService.set({
38:         token: '123'
39:       });
40:       this.router.navigate(['dashboard']);
41:     }
42:   }
43: }
````

## File: src/app/routes/passport/login/login.component.ts
````typescript
  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
  2: import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
  3: import { Router, RouterLink } from '@angular/router';
  4: import { StartupService, SupabaseAuthAdapterService } from '@core';
  5: import { ReuseTabService } from '@delon/abc/reuse-tab';
  6: import { DA_SERVICE_TOKEN } from '@delon/auth';
  7: import { I18nPipe } from '@delon/theme';
  8: import { NzAlertModule } from 'ng-zorro-antd/alert';
  9: import { NzButtonModule } from 'ng-zorro-antd/button';
 10: import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
 11: import { NzFormModule } from 'ng-zorro-antd/form';
 12: import { NzInputModule } from 'ng-zorro-antd/input';
 13: import { finalize } from 'rxjs';
 14: 
 15: @Component({
 16:   selector: 'passport-login',
 17:   templateUrl: './login.component.html',
 18:   styleUrls: ['./login.component.less'],
 19:   changeDetection: ChangeDetectionStrategy.OnPush,
 20:   imports: [
 21:     RouterLink,
 22:     ReactiveFormsModule,
 23:     I18nPipe,
 24:     NzCheckboxModule,
 25:     NzAlertModule,
 26:     NzFormModule,
 27:     NzInputModule,
 28:     NzButtonModule
 29:   ]
 30: })
 31: export class UserLoginComponent implements OnDestroy {
 32:   private readonly router = inject(Router);
 33:   private readonly reuseTabService = inject(ReuseTabService, { optional: true });
 34:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
 35:   private readonly startupSrv = inject(StartupService);
 36:   private readonly cdr = inject(ChangeDetectorRef);
 37:   private readonly supabaseAuthAdapter = inject(SupabaseAuthAdapterService);
 38: 
 39:   form = inject(FormBuilder).nonNullable.group({
 40:     userName: ['', [Validators.required, Validators.email]],
 41:     password: ['', [Validators.required, Validators.minLength(6)]],
 42:     remember: [true]
 43:   });
 44:   error = '';
 45:   loading = false;
 46: 
 47:   submit(): void {
 48:     this.error = '';
 49:     const { userName, password } = this.form.controls;
 50:     userName.markAsDirty();
 51:     userName.updateValueAndValidity();
 52:     password.markAsDirty();
 53:     password.updateValueAndValidity();
 54:     if (userName.invalid || password.invalid) {
 55:       return;
 56:     }
 57: 
 58:     // 使用 Supabase Auth 進行登入
 59:     // 適配器會自動將 Session 同步到 @delon/auth TokenService
 60:     const email = String(this.form.value.userName || '');
 61:     const pwd = String(this.form.value.password || '');
 62: 
 63:     if (!email || !pwd) {
 64:       this.error = '請輸入帳號和密碼';
 65:       this.cdr.detectChanges();
 66:       return;
 67:     }
 68: 
 69:     this.loading = true;
 70:     this.cdr.detectChanges();
 71: 
 72:     this.supabaseAuthAdapter
 73:       .signIn(email, pwd)
 74:       .pipe(
 75:         finalize(() => {
 76:           this.loading = false;
 77:           this.cdr.detectChanges();
 78:         })
 79:       )
 80:       .subscribe({
 81:         next: result => {
 82:           if (result.error) {
 83:             this.error = result.error.message || '登入失敗';
 84:             this.cdr.detectChanges();
 85:             return;
 86:           }
 87:           // 清空路由复用信息
 88:           this.reuseTabService?.clear();
 89:           // 適配器已自動同步 Session 到 TokenService
 90:           // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
 91:           this.startupSrv.load().subscribe(() => {
 92:             let url = this.tokenService.referrer!.url || '/';
 93:             if (url.includes('/passport')) {
 94:               url = '/';
 95:             }
 96:             this.router.navigateByUrl(url);
 97:           });
 98:         },
 99:         error: err => {
100:           this.error = err.message || '登入失敗，請稍後再試';
101:           this.cdr.detectChanges();
102:         }
103:       });
104:   }
105: 
106:   ngOnDestroy(): void {
107:     // 不再需要清理 interval
108:   }
109: }
````

## File: src/app/routes/passport/register-result/register-result.component.ts
````typescript
 1: import { Component, Input, inject } from '@angular/core';
 2: import { RouterLink } from '@angular/router';
 3: import { I18nPipe } from '@delon/theme';
 4: import { NzButtonModule } from 'ng-zorro-antd/button';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: import { NzResultModule } from 'ng-zorro-antd/result';
 7: 
 8: @Component({
 9:   selector: 'passport-register-result',
10:   templateUrl: './register-result.component.html',
11:   imports: [RouterLink, I18nPipe, NzButtonModule, NzResultModule]
12: })
13: export class UserRegisterResultComponent {
14:   readonly msg = inject(NzMessageService);
15:   @Input() email = '';
16: }
````

## File: src/app/routes/passport/register/register.component.ts
````typescript
  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
  2: import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
  3: import { Router, RouterLink } from '@angular/router';
  4: import { SupabaseAuthAdapterService } from '@core';
  5: import { I18nPipe } from '@delon/theme';
  6: import { MatchControl } from '@delon/util/form';
  7: import { NzAlertModule } from 'ng-zorro-antd/alert';
  8: import { NzButtonModule } from 'ng-zorro-antd/button';
  9: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 10: import { NzFormModule } from 'ng-zorro-antd/form';
 11: import { NzInputModule } from 'ng-zorro-antd/input';
 12: import { NzPopoverModule } from 'ng-zorro-antd/popover';
 13: import { NzProgressModule } from 'ng-zorro-antd/progress';
 14: import { finalize } from 'rxjs';
 15: 
 16: @Component({
 17:   selector: 'passport-register',
 18:   templateUrl: './register.component.html',
 19:   styleUrls: ['./register.component.less'],
 20:   changeDetection: ChangeDetectionStrategy.OnPush,
 21:   imports: [
 22:     ReactiveFormsModule,
 23:     I18nPipe,
 24:     RouterLink,
 25:     NzAlertModule,
 26:     NzFormModule,
 27:     NzInputModule,
 28:     NzPopoverModule,
 29:     NzProgressModule,
 30:     NzButtonModule
 31:   ]
 32: })
 33: export class UserRegisterComponent implements OnDestroy {
 34:   private readonly router = inject(Router);
 35:   private readonly cdr = inject(ChangeDetectorRef);
 36:   private readonly supabaseAuthAdapter = inject(SupabaseAuthAdapterService);
 37: 
 38:   // #region fields
 39: 
 40:   form = inject(FormBuilder).nonNullable.group(
 41:     {
 42:       mail: ['', [Validators.required, Validators.email]],
 43:       password: ['', [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
 44:       confirm: ['', [Validators.required, Validators.minLength(6)]]
 45:     },
 46:     {
 47:       validators: MatchControl('password', 'confirm')
 48:     }
 49:   );
 50:   error = '';
 51:   loading = false;
 52:   visible = false;
 53:   status = 'pool';
 54:   progress = 0;
 55:   passwordProgressMap: Record<string, 'success' | 'normal' | 'exception'> = {
 56:     ok: 'success',
 57:     pass: 'normal',
 58:     pool: 'exception'
 59:   };
 60: 
 61:   static checkPassword(control: FormControl): NzSafeAny {
 62:     if (!control) {
 63:       return null;
 64:     }
 65:     // eslint-disable-next-line @typescript-eslint/no-this-alias
 66:     const self: NzSafeAny = this;
 67:     self.visible = !!control.value;
 68:     if (control.value && control.value.length > 9) {
 69:       self.status = 'ok';
 70:     } else if (control.value && control.value.length > 5) {
 71:       self.status = 'pass';
 72:     } else {
 73:       self.status = 'pool';
 74:     }
 75: 
 76:     if (self.visible) {
 77:       self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
 78:     }
 79:   }
 80: 
 81:   submit(): void {
 82:     this.error = '';
 83:     Object.keys(this.form.controls).forEach(key => {
 84:       const control = (this.form.controls as NzSafeAny)[key] as AbstractControl;
 85:       control.markAsDirty();
 86:       control.updateValueAndValidity();
 87:     });
 88:     if (this.form.invalid) {
 89:       return;
 90:     }
 91: 
 92:     const email = String(this.form.value.mail || '');
 93:     const password = String(this.form.value.password || '');
 94: 
 95:     if (!email || !password) {
 96:       this.error = '請填寫完整的註冊資訊';
 97:       this.cdr.detectChanges();
 98:       return;
 99:     }
100: 
101:     this.loading = true;
102:     this.cdr.detectChanges();
103: 
104:     this.supabaseAuthAdapter
105:       .signUp(email, password)
106:       .pipe(
107:         finalize(() => {
108:           this.loading = false;
109:           this.cdr.detectChanges();
110:         })
111:       )
112:       .subscribe({
113:         next: result => {
114:           if (result.error) {
115:             this.error = result.error.message || '註冊失敗';
116:             this.cdr.detectChanges();
117:             return;
118:           }
119:           // 註冊成功，導航到註冊結果頁面
120:           // Supabase 註冊可能返回 session（email 驗證關閉）或 null（email 驗證開啟）
121:           this.router.navigate(['passport', 'register-result'], { queryParams: { email } });
122:         },
123:         error: err => {
124:           this.error = err.message || '註冊失敗，請稍後再試';
125:           this.cdr.detectChanges();
126:         }
127:       });
128:   }
129: 
130:   ngOnDestroy(): void {
131:     // 不再需要清理 interval
132:   }
133: }
````

## File: src/app/routes/passport/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: import { CallbackComponent } from './callback.component';
 4: import { UserLockComponent } from './lock/lock.component';
 5: import { UserLoginComponent } from './login/login.component';
 6: import { UserRegisterComponent } from './register/register.component';
 7: import { UserRegisterResultComponent } from './register-result/register-result.component';
 8: import { LayoutPassportComponent } from '../../layout';
 9: 
10: export const routes: Routes = [
11:   // passport
12:   {
13:     path: 'passport',
14:     component: LayoutPassportComponent,
15:     children: [
16:       {
17:         path: 'login',
18:         component: UserLoginComponent,
19:         data: { title: '登录', titleI18n: 'app.login.login' }
20:       },
21:       {
22:         path: 'register',
23:         component: UserRegisterComponent,
24:         data: { title: '注册', titleI18n: 'app.register.register' }
25:       },
26:       {
27:         path: 'register-result',
28:         component: UserRegisterResultComponent,
29:         data: { title: '注册结果', titleI18n: 'app.register.register' }
30:       },
31:       {
32:         path: 'lock',
33:         component: UserLockComponent,
34:         data: { title: '锁屏', titleI18n: 'app.lock' }
35:       }
36:     ]
37:   },
38:   // 单页不包裹Layout
39:   { path: 'passport/callback/:type', component: CallbackComponent }
40: ];
````

## File: src/app/routes/pro/account/center/applications/applications.component.ts
````typescript
 1: import { DecimalPipe } from '@angular/common';
 2: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 6: 
 7: @Component({
 8:   selector: 'app-account-center-applications',
 9:   templateUrl: './applications.component.html',
10:   styleUrls: ['./applications.component.less'],
11:   changeDetection: ChangeDetectionStrategy.OnPush,
12:   imports: [...SHARED_IMPORTS, DecimalPipe]
13: })
14: export class ProAccountCenterApplicationsComponent {
15:   private readonly http = inject(_HttpClient);
16:   private readonly cdr = inject(ChangeDetectorRef);
17: 
18:   listLoading = true;
19:   list: any[] = [];
20:   constructor() {
21:     this.http.get('/api/list', { count: 8 }).subscribe((res: NzSafeAny[]) => {
22:       this.list = res.map(item => {
23:         item.activeUser = this.formatWan(item.activeUser);
24:         return item;
25:       });
26:       this.listLoading = false;
27:       this.cdr.detectChanges();
28:     });
29:   }
30: 
31:   private formatWan(val: number): string {
32:     const v = val * 1;
33:     if (!v || isNaN(v)) {
34:       return '';
35:     }
36: 
37:     let result: string | number = val;
38:     if (val > 10000) {
39:       result = Math.floor(val / 10000);
40:       result = `${result}`;
41:     }
42:     return result.toString();
43:   }
44: }
````

## File: src/app/routes/pro/account/center/articles/articles.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { _HttpClient } from '@delon/theme';
 3: import { SHARED_IMPORTS } from '@shared';
 4: 
 5: @Component({
 6:   selector: 'app-account-center-articles',
 7:   templateUrl: './articles.component.html',
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   imports: SHARED_IMPORTS
10: })
11: export class ProAccountCenterArticlesComponent {
12:   list$ = inject(_HttpClient).get('/api/list', { count: 8 });
13: }
````

## File: src/app/routes/pro/account/center/center.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
 2: import { ActivationEnd, Router } from '@angular/router';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { Subscription, zip, filter } from 'rxjs';
 6: 
 7: @Component({
 8:   selector: 'app-account-center',
 9:   templateUrl: './center.component.html',
10:   styleUrls: ['./center.component.less'],
11:   changeDetection: ChangeDetectionStrategy.OnPush,
12:   imports: SHARED_IMPORTS
13: })
14: export class ProAccountCenterComponent implements OnInit, OnDestroy {
15:   private readonly router = inject(Router);
16:   private readonly http = inject(_HttpClient);
17:   private readonly cdr = inject(ChangeDetectorRef);
18: 
19:   private router$!: Subscription;
20:   @ViewChild('tagInput', { static: false }) private tagInput!: ElementRef<HTMLInputElement>;
21:   user: any;
22:   notice: any;
23:   tabs = [
24:     {
25:       key: 'articles',
26:       tab: '文章 (8)'
27:     },
28:     {
29:       key: 'applications',
30:       tab: '应用 (8)'
31:     },
32:     {
33:       key: 'projects',
34:       tab: '项目 (8)'
35:     }
36:   ];
37:   pos = 0;
38:   taging = false;
39:   tagValue = '';
40: 
41:   private setActive(): void {
42:     const key = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
43:     const idx = this.tabs.findIndex(w => w.key === key);
44:     if (idx !== -1) {
45:       this.pos = idx;
46:     }
47:   }
48: 
49:   ngOnInit(): void {
50:     zip(this.http.get('/user/current'), this.http.get('/api/notice')).subscribe(([user, notice]) => {
51:       this.user = user;
52:       this.notice = notice;
53:       this.cdr.detectChanges();
54:     });
55:     this.router$ = this.router.events.pipe(filter(e => e instanceof ActivationEnd)).subscribe(() => this.setActive());
56:     this.setActive();
57:   }
58: 
59:   to(item: { key: string }): void {
60:     this.router.navigateByUrl(`/pro/account/center/${item.key}`);
61:   }
62:   tagShowIpt(): void {
63:     this.taging = true;
64:     this.cdr.detectChanges();
65:     this.tagInput.nativeElement.focus();
66:   }
67: 
68:   tagBlur(): void {
69:     const { user, cdr, tagValue } = this;
70:     if (tagValue && user.tags.filter((tag: { label: string }) => tag.label === tagValue).length === 0) {
71:       user.tags.push({ label: tagValue });
72:     }
73:     this.tagValue = '';
74:     this.taging = false;
75:     cdr.detectChanges();
76:   }
77: 
78:   tagEnter(e: KeyboardEvent): void {
79:     if (e.key === 'Enter') {
80:       this.tagBlur();
81:     }
82:   }
83: 
84:   ngOnDestroy(): void {
85:     this.router$.unsubscribe();
86:   }
87: }
````

## File: src/app/routes/pro/account/center/projects/projects.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 2: import { _HttpClient } from '@delon/theme';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-account-center-projects',
 9:   templateUrl: './projects.component.html',
10:   styleUrls: ['./projects.component.less'],
11:   changeDetection: ChangeDetectionStrategy.OnPush,
12:   imports: [...SHARED_IMPORTS, NzAvatarModule]
13: })
14: export class ProAccountCenterProjectsComponent {
15:   private readonly http = inject(_HttpClient);
16:   private readonly msg = inject(NzMessageService);
17:   private readonly cdr = inject(ChangeDetectorRef);
18: 
19:   listLoading = true;
20:   list: any[] = [];
21: 
22:   constructor() {
23:     this.http.get('/api/list', { count: 8 }).subscribe(res => {
24:       this.list = res;
25:       this.listLoading = false;
26:       this.cdr.detectChanges();
27:     });
28:   }
29: 
30:   suc(id: number): void {
31:     this.msg.success(`标题：${id}`);
32:   }
33: }
````

## File: src/app/routes/pro/account/settings/base/base.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { _HttpClient } from '@delon/theme';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: import { NzUploadComponent } from 'ng-zorro-antd/upload';
 6: import { zip } from 'rxjs';
 7: 
 8: interface ProAccountSettingsUser {
 9:   email: string;
10:   name: string;
11:   profile: string;
12:   country: string;
13:   address: string;
14:   phone: string;
15:   avatar: string;
16:   geographic: {
17:     province: {
18:       key: string;
19:     };
20:     city: {
21:       key: string;
22:     };
23:   };
24: }
25: 
26: interface ProAccountSettingsCity {
27:   name: string;
28:   id: string;
29: }
30: 
31: @Component({
32:   selector: 'app-account-settings-base',
33:   templateUrl: './base.component.html',
34:   styleUrls: ['./base.component.less'],
35:   changeDetection: ChangeDetectionStrategy.OnPush,
36:   imports: [...SHARED_IMPORTS, NzUploadComponent]
37: })
38: export class ProAccountSettingsBaseComponent implements OnInit {
39:   private readonly http = inject(_HttpClient);
40:   private readonly cdr = inject(ChangeDetectorRef);
41:   private readonly msg = inject(NzMessageService);
42: 
43:   avatar = '';
44:   userLoading = true;
45:   user!: ProAccountSettingsUser;
46: 
47:   // #region geo
48: 
49:   provinces: ProAccountSettingsCity[] = [];
50:   cities: ProAccountSettingsCity[] = [];
51: 
52:   ngOnInit(): void {
53:     zip(this.http.get('/user/current'), this.http.get('/geo/province')).subscribe(
54:       ([user, province]: [ProAccountSettingsUser, ProAccountSettingsCity[]]) => {
55:         this.userLoading = false;
56:         this.user = user;
57:         this.provinces = province;
58:         this.choProvince(user.geographic.province.key, false);
59:         this.cdr.detectChanges();
60:       }
61:     );
62:   }
63: 
64:   choProvince(pid: string, cleanCity = true): void {
65:     this.http.get(`/geo/${pid}`).subscribe(res => {
66:       this.cities = res;
67:       if (cleanCity) {
68:         this.user.geographic.city.key = '';
69:       }
70:       this.cdr.detectChanges();
71:     });
72:   }
73: 
74:   // #endregion
75: 
76:   save(): boolean {
77:     this.msg.success(JSON.stringify(this.user));
78:     return false;
79:   }
80: }
````

## File: src/app/routes/pro/account/settings/binding/binding.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzMessageService } from 'ng-zorro-antd/message';
 4: 
 5: @Component({
 6:   selector: 'app-account-settings-binding',
 7:   templateUrl: './binding.component.html',
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   imports: SHARED_IMPORTS
10: })
11: export class ProAccountSettingsBindingComponent {
12:   readonly msg = inject(NzMessageService);
13: }
````

## File: src/app/routes/pro/account/settings/notification/notification.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-account-settings-notification',
 6:   templateUrl: './notification.component.html',
 7:   changeDetection: ChangeDetectionStrategy.OnPush,
 8:   imports: SHARED_IMPORTS
 9: })
10: export class ProAccountSettingsNotificationComponent {
11:   i: {
12:     password: boolean;
13:     messages: boolean;
14:     todo: boolean;
15:   } = {
16:     password: true,
17:     messages: true,
18:     todo: true
19:   };
20: }
````

## File: src/app/routes/pro/account/settings/security/security.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzMessageService } from 'ng-zorro-antd/message';
 4: 
 5: @Component({
 6:   selector: 'app-account-settings-security',
 7:   templateUrl: './security.component.html',
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   imports: SHARED_IMPORTS
10: })
11: export class ProAccountSettingsSecurityComponent {
12:   readonly msg = inject(NzMessageService);
13: }
````

## File: src/app/routes/pro/account/settings/settings.component.ts
````typescript
 1: import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, inject } from '@angular/core';
 2: import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
 3: import { ActivationEnd, Router } from '@angular/router';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzMenuModeType } from 'ng-zorro-antd/menu';
 6: import { fromEvent, debounceTime, filter } from 'rxjs';
 7: 
 8: @Component({
 9:   selector: 'app-account-settings',
10:   templateUrl: './settings.component.html',
11:   styleUrls: ['./settings.component.less'],
12:   changeDetection: ChangeDetectionStrategy.OnPush,
13:   imports: SHARED_IMPORTS
14: })
15: export class ProAccountSettingsComponent implements AfterViewInit {
16:   private readonly router = inject(Router);
17:   private readonly cdr = inject(ChangeDetectorRef);
18:   private readonly el: HTMLElement = inject(ElementRef).nativeElement;
19:   private readonly d$ = inject(DestroyRef);
20:   mode: NzMenuModeType = 'inline';
21:   title!: string;
22:   menus: Array<{ key: string; title: string; selected?: boolean }> = [
23:     {
24:       key: 'base',
25:       title: '基本设置'
26:     },
27:     {
28:       key: 'security',
29:       title: '安全设置'
30:     },
31:     {
32:       key: 'binding',
33:       title: '账号绑定'
34:     },
35:     {
36:       key: 'notification',
37:       title: '新消息通知'
38:     }
39:   ];
40: 
41:   private setActive(): void {
42:     const key = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
43:     this.menus.forEach(i => {
44:       i.selected = i.key === key;
45:     });
46:     this.title = this.menus.find(w => w.selected)!.title;
47:     this.cdr.detectChanges();
48:   }
49: 
50:   to(item: { key: string }): void {
51:     this.router.navigateByUrl(`/pro/account/settings/${item.key}`);
52:   }
53: 
54:   private resize(): void {
55:     const el = this.el;
56:     let mode: NzMenuModeType = 'inline';
57:     const { offsetWidth } = el;
58:     if (offsetWidth < 641 && offsetWidth > 400) {
59:       mode = 'horizontal';
60:     }
61:     if (window.innerWidth < 768 && offsetWidth > 400) {
62:       mode = 'horizontal';
63:     }
64:     this.mode = mode;
65:     this.cdr.detectChanges();
66:   }
67: 
68:   ngAfterViewInit(): void {
69:     this.router.events
70:       .pipe(
71:         takeUntilDestroyed(this.d$),
72:         filter(e => e instanceof ActivationEnd)
73:       )
74:       .subscribe(() => this.setActive());
75: 
76:     fromEvent(window, 'resize')
77:       .pipe(takeUntilDestroyed(this.d$), debounceTime(200))
78:       .subscribe(() => this.resize());
79: 
80:     this.setActive();
81:   }
82: }
````

## File: src/app/routes/pro/form/advanced-form/advanced-form.component.ts
````typescript
  1: import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
  2: import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
  3: import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
  6: 
  7: interface UserForm {
  8:   key: FormControl<string>;
  9:   workId: FormControl<string>;
 10:   name: FormControl<string>;
 11:   department: FormControl<string>;
 12: }
 13: 
 14: @Component({
 15:   selector: 'app-advanced-form',
 16:   templateUrl: './advanced-form.component.html',
 17:   changeDetection: ChangeDetectionStrategy.OnPush,
 18:   imports: [...SHARED_IMPORTS, FooterToolbarModule]
 19: })
 20: export class AdvancedFormComponent implements OnInit {
 21:   editIndex = -1;
 22:   editObj = {};
 23:   form = new FormGroup({
 24:     name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
 25:     url: new FormControl('', { validators: [Validators.required] }),
 26:     owner: new FormControl(undefined, { validators: [Validators.required] }),
 27:     approver: new FormControl('', { validators: [Validators.required] }),
 28:     date_range: new FormControl('', { validators: [Validators.required] }),
 29:     type: new FormControl('', { validators: [Validators.required] }),
 30:     name2: new FormControl('', { validators: [Validators.required] }),
 31:     summary: new FormControl('', { validators: [Validators.required] }),
 32:     owner2: new FormControl('', { validators: [Validators.required] }),
 33:     approver2: new FormControl('', { validators: [Validators.required] }),
 34:     time: new FormControl('', { validators: [Validators.required] }),
 35:     type2: new FormControl('', { validators: [Validators.required] }),
 36:     items: new FormArray<FormGroup<UserForm>>([])
 37:   });
 38:   users: Array<{ value: string; label: string }> = [
 39:     { value: 'xiao', label: '付晓晓' },
 40:     { value: 'mao', label: '周毛毛' }
 41:   ];
 42: 
 43:   ngOnInit(): void {
 44:     const userList = [
 45:       {
 46:         key: '1',
 47:         workId: '00001',
 48:         name: 'John Brown',
 49:         department: 'New York No. 1 Lake Park'
 50:       },
 51:       {
 52:         key: '2',
 53:         workId: '00002',
 54:         name: 'Jim Green',
 55:         department: 'London No. 1 Lake Park'
 56:       },
 57:       {
 58:         key: '3',
 59:         workId: '00003',
 60:         name: 'Joe Black',
 61:         department: 'Sidney No. 1 Lake Park'
 62:       }
 63:     ];
 64:     userList.forEach(i => {
 65:       const field = this.createUser();
 66:       field.patchValue(i);
 67:       this.items.push(field);
 68:     });
 69:   }
 70: 
 71:   createUser(): FormGroup<UserForm> {
 72:     return new FormGroup({
 73:       key: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
 74:       name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
 75:       workId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
 76:       department: new FormControl('', { nonNullable: true, validators: [Validators.required] })
 77:     });
 78:   }
 79: 
 80:   get items(): FormArray<FormGroup<UserForm>> {
 81:     return this.form.controls.items;
 82:   }
 83: 
 84:   add(): void {
 85:     this.items.push(this.createUser());
 86:     this.edit(this.items.length - 1);
 87:   }
 88: 
 89:   del(index: number): void {
 90:     this.items.removeAt(index);
 91:   }
 92: 
 93:   edit(index: number): void {
 94:     if (this.editIndex !== -1 && this.editObj) {
 95:       this.items.at(this.editIndex).patchValue(this.editObj);
 96:     }
 97:     this.editObj = { ...this.items.at(index).value };
 98:     this.editIndex = index;
 99:   }
100: 
101:   save(index: number): void {
102:     const item = this.items.at(index);
103:     this.formValidity(item.controls);
104:     if (item.invalid) {
105:       return;
106:     }
107:     this.editIndex = -1;
108:   }
109: 
110:   cancel(index: number): void {
111:     const item = this.items.at(index);
112:     if (!item.value.key) {
113:       this.del(index);
114:     } else {
115:       item.patchValue(this.editObj);
116:     }
117:     this.editIndex = -1;
118:   }
119: 
120:   _submitForm(): void {
121:     this.formValidity(this.form.controls);
122:     if (this.form.invalid) {
123:       return;
124:     }
125:   }
126: 
127:   private formValidity(controls: NzSafeAny): void {
128:     Object.keys(controls).forEach(key => {
129:       const control = (controls as NzSafeAny)[key] as AbstractControl;
130:       control.markAsDirty();
131:       control.updateValueAndValidity();
132:     });
133:   }
134: }
````

## File: src/app/routes/pro/form/basic-form/basic-form.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 2: import { FormControl, FormGroup, Validators } from '@angular/forms';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-basic-form',
 8:   templateUrl: './basic-form.component.html',
 9:   changeDetection: ChangeDetectionStrategy.OnPush,
10:   imports: SHARED_IMPORTS
11: })
12: export class BasicFormComponent {
13:   private readonly msg = inject(NzMessageService);
14:   private readonly cdr = inject(ChangeDetectorRef);
15: 
16:   form = new FormGroup({
17:     title: new FormControl('', Validators.required),
18:     date: new FormControl('', Validators.required),
19:     goal: new FormControl('', Validators.required),
20:     standard: new FormControl('', Validators.required),
21:     client: new FormControl(''),
22:     invites: new FormControl(''),
23:     weight: new FormControl(''),
24:     public: new FormControl(1, [Validators.min(1), Validators.max(3)]),
25:     publicUsers: new FormControl('')
26:   });
27:   submitting = false;
28: 
29:   submit(): void {
30:     this.submitting = true;
31:     setTimeout(() => {
32:       this.submitting = false;
33:       this.msg.success(`提交成功`);
34:       this.cdr.detectChanges();
35:     }, 1000);
36:   }
37: }
````

## File: src/app/routes/pro/form/step-form/step-form.component.ts
````typescript
 1: import { AfterViewInit, Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzStepsModule } from 'ng-zorro-antd/steps';
 4: 
 5: import { Step1Component } from './step1.component';
 6: import { Step2Component } from './step2.component';
 7: import { Step3Component } from './step3.component';
 8: import { TransferService } from './transfer.service';
 9: 
10: @Component({
11:   selector: 'app-step-form',
12:   templateUrl: './step-form.component.html',
13:   styleUrls: ['./step-form.component.less'],
14:   providers: [TransferService],
15:   imports: [...SHARED_IMPORTS, NzStepsModule, Step1Component, Step2Component, Step3Component]
16: })
17: export class StepFormComponent implements AfterViewInit {
18:   private readonly srv = inject(TransferService);
19:   get item(): TransferService {
20:     return this.srv;
21:   }
22: 
23:   ngAfterViewInit(): void {
24:     console.log('item', this.item);
25:   }
26: }
````

## File: src/app/routes/pro/form/step-form/step1.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
 2: import { FormControl, FormGroup, Validators } from '@angular/forms';
 3: import { SHARED_IMPORTS } from '@shared';
 4: 
 5: import { TransferService } from './transfer.service';
 6: 
 7: @Component({
 8:   selector: 'app-step1',
 9:   templateUrl: './step1.component.html',
10:   changeDetection: ChangeDetectionStrategy.OnPush,
11:   imports: SHARED_IMPORTS
12: })
13: export class Step1Component implements OnInit {
14:   private readonly srv = inject(TransferService);
15: 
16:   form = new FormGroup({
17:     pay_account: new FormControl('', Validators.compose([Validators.required, Validators.email])),
18:     receiver_type: new FormControl('', Validators.required),
19:     receiver_account: new FormControl('', Validators.required),
20:     receiver_name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
21:     amount: new FormControl(
22:       '',
23:       Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(1), Validators.max(10000 * 100)])
24:     )
25:   });
26: 
27:   get item(): TransferService {
28:     return this.srv;
29:   }
30: 
31:   ngOnInit(): void {
32:     this.form.patchValue(this.item as any);
33:   }
34: 
35:   _submitForm(): void {
36:     Object.assign(this.item, this.form.value);
37:     ++this.item.step;
38:   }
39: }
````

## File: src/app/routes/pro/form/step-form/step2.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
 2: import { FormControl, FormGroup, Validators } from '@angular/forms';
 3: import { SHARED_IMPORTS } from '@shared';
 4: 
 5: import { TransferService } from './transfer.service';
 6: 
 7: @Component({
 8:   selector: 'app-step2',
 9:   templateUrl: './step2.component.html',
10:   changeDetection: ChangeDetectionStrategy.OnPush,
11:   imports: SHARED_IMPORTS
12: })
13: export class Step2Component implements OnInit {
14:   private readonly srv = inject(TransferService);
15: 
16:   form = new FormGroup({
17:     password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
18:   });
19:   loading = false;
20:   get item(): TransferService {
21:     return this.srv;
22:   }
23: 
24:   ngOnInit(): void {
25:     this.form.patchValue(this.item);
26:   }
27: 
28:   _submitForm(): void {
29:     this.loading = true;
30:     setTimeout(() => {
31:       this.loading = false;
32:       ++this.item.step;
33:     }, 500);
34:   }
35: 
36:   prev(): void {
37:     --this.item.step;
38:   }
39: }
````

## File: src/app/routes/pro/form/step-form/step3.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzResultModule } from 'ng-zorro-antd/result';
 4: 
 5: import { TransferService } from './transfer.service';
 6: 
 7: @Component({
 8:   selector: 'app-step3',
 9:   templateUrl: './step3.component.html',
10:   changeDetection: ChangeDetectionStrategy.OnPush,
11:   imports: [...SHARED_IMPORTS, NzResultModule]
12: })
13: export class Step3Component {
14:   private readonly srv = inject(TransferService);
15: 
16:   get item(): TransferService {
17:     return this.srv;
18:   }
19: }
````

## File: src/app/routes/pro/form/step-form/transfer.service.ts
````typescript
 1: import { Injectable } from '@angular/core';
 2: 
 3: @Injectable()
 4: export class TransferService {
 5:   step = 1;
 6: 
 7:   /**
 8:    * 付款账户
 9:    */
10:   pay_account = '';
11: 
12:   /**
13:    * 收款账户类型
14:    */
15:   receiver_type: 'alipay' | 'bank' = 'alipay';
16: 
17:   get receiver_type_str(): string {
18:     return this.receiver_type === 'alipay' ? '支付宝' : '银行';
19:   }
20: 
21:   /**
22:    * 收款账户
23:    */
24:   receiver_account = '';
25: 
26:   /**
27:    * 收款姓名
28:    */
29:   receiver_name = '';
30: 
31:   /**
32:    * 金额
33:    */
34:   amount = 500;
35: 
36:   /**
37:    * 支付密码
38:    */
39:   password = '123456';
40: 
41:   again(): void {
42:     this.step = 0;
43:     this.pay_account = 'ant-design@alipay.com';
44:     this.receiver_type = 'alipay';
45:     this.receiver_account = 'test@example.com';
46:     this.receiver_name = 'asdf';
47:     this.amount = 500;
48:   }
49: 
50:   constructor() {
51:     this.again();
52:   }
53: }
````

## File: src/app/routes/pro/list/applications/applications.component.ts
````typescript
 1: import { DecimalPipe } from '@angular/common';
 2: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 3: import { TagSelectComponent } from '@delon/abc/tag-select';
 4: import { _HttpClient } from '@delon/theme';
 5: import { SHARED_IMPORTS } from '@shared';
 6: 
 7: interface ProListApplicationListItem {
 8:   title: string;
 9:   avatar: string;
10:   activeUser: string | number;
11:   newUser: number;
12: }
13: 
14: @Component({
15:   selector: 'app-list-applications',
16:   templateUrl: './applications.component.html',
17:   styleUrls: ['./applications.component.less'],
18:   changeDetection: ChangeDetectionStrategy.OnPush,
19:   imports: [...SHARED_IMPORTS, TagSelectComponent, DecimalPipe]
20: })
21: export class ProListApplicationsComponent implements OnInit {
22:   private readonly http = inject(_HttpClient);
23:   private readonly cdr = inject(ChangeDetectorRef);
24: 
25:   q = {
26:     ps: 8,
27:     user: null,
28:     rate: null,
29:     categories: [],
30:     owners: ['zxx']
31:   };
32: 
33:   list: ProListApplicationListItem[] = [];
34: 
35:   loading = true;
36: 
37:   // region: cateogry
38:   categories = [
39:     { id: 0, text: '全部', value: false },
40:     { id: 1, text: '类目一', value: false },
41:     { id: 2, text: '类目二', value: false },
42:     { id: 3, text: '类目三', value: false },
43:     { id: 4, text: '类目四', value: false },
44:     { id: 5, text: '类目五', value: false },
45:     { id: 6, text: '类目六', value: false },
46:     { id: 7, text: '类目七', value: false },
47:     { id: 8, text: '类目八', value: false },
48:     { id: 9, text: '类目九', value: false },
49:     { id: 10, text: '类目十', value: false },
50:     { id: 11, text: '类目十一', value: false },
51:     { id: 12, text: '类目十二', value: false }
52:   ];
53: 
54:   changeCategory(status: boolean, idx: number): void {
55:     if (idx === 0) {
56:       this.categories.map(i => (i.value = status));
57:     } else {
58:       this.categories[idx].value = status;
59:     }
60:     this.getData();
61:   }
62:   // endregion
63: 
64:   ngOnInit(): void {
65:     this.getData();
66:   }
67: 
68:   getData(): void {
69:     this.loading = true;
70:     this.http.get('/api/list', { count: this.q.ps }).subscribe(res => {
71:       this.list = res.map((item: ProListApplicationListItem) => {
72:         item.activeUser = this.formatWan(item.activeUser as number);
73:         return item;
74:       });
75:       this.loading = false;
76:       this.cdr.detectChanges();
77:     });
78:   }
79: 
80:   private formatWan(val: number): string | number {
81:     const v = val * 1;
82:     if (!v || isNaN(v)) {
83:       return '';
84:     }
85: 
86:     let result: number | string = val;
87:     if (val > 10000) {
88:       result = Math.floor(val / 10000);
89:       result = `${result}`;
90:     }
91:     return result;
92:   }
93: }
````

## File: src/app/routes/pro/list/articles/articles.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { TagSelectComponent } from '@delon/abc/tag-select';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: 
 6: @Component({
 7:   selector: 'app-list-articles',
 8:   templateUrl: './articles.component.html',
 9:   changeDetection: ChangeDetectionStrategy.OnPush,
10:   imports: [...SHARED_IMPORTS, TagSelectComponent]
11: })
12: export class ProListArticlesComponent implements OnInit {
13:   private readonly http = inject(_HttpClient);
14:   private readonly cdr = inject(ChangeDetectorRef);
15: 
16:   q = {
17:     ps: 5,
18:     categories: [],
19:     owners: ['zxx'],
20:     user: '',
21:     rate: ''
22:   };
23: 
24:   list: any[] = [];
25:   loading = false;
26: 
27:   categories = [
28:     { id: 0, text: '全部', value: false },
29:     { id: 1, text: '类目一', value: false },
30:     { id: 2, text: '类目二', value: false },
31:     { id: 3, text: '类目三', value: false },
32:     { id: 4, text: '类目四', value: false },
33:     { id: 5, text: '类目五', value: false },
34:     { id: 6, text: '类目六', value: false },
35:     { id: 7, text: '类目七', value: false },
36:     { id: 8, text: '类目八', value: false },
37:     { id: 9, text: '类目九', value: false },
38:     { id: 10, text: '类目十', value: false },
39:     { id: 11, text: '类目十一', value: false },
40:     { id: 12, text: '类目十二', value: false }
41:   ];
42: 
43:   owners = [
44:     {
45:       id: 'wzj',
46:       name: '我自己'
47:     },
48:     {
49:       id: 'wjh',
50:       name: '吴家豪'
51:     },
52:     {
53:       id: 'zxx',
54:       name: '周星星'
55:     },
56:     {
57:       id: 'zly',
58:       name: '赵丽颖'
59:     },
60:     {
61:       id: 'ym',
62:       name: '姚明'
63:     }
64:   ];
65: 
66:   changeCategory(status: boolean, idx: number): void {
67:     if (idx === 0) {
68:       this.categories.map(i => (i.value = status));
69:     } else {
70:       this.categories[idx].value = status;
71:     }
72:   }
73: 
74:   setOwner(): void {
75:     this.q.owners = [`wzj`];
76:     // TODO: wait nz-dropdown OnPush mode
77:     setTimeout(() => this.cdr.detectChanges());
78:   }
79: 
80:   ngOnInit(): void {
81:     this.getData();
82:   }
83: 
84:   getData(more = false): void {
85:     this.loading = true;
86:     this.http.get('/api/list', { count: this.q.ps }).subscribe(res => {
87:       this.list = more ? this.list.concat(res) : res;
88:       this.loading = false;
89:       this.cdr.detectChanges();
90:     });
91:   }
92: }
````

## File: src/app/routes/pro/list/basic-list/basic-list.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { ModalHelper, _HttpClient } from '@delon/theme';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
 6: 
 7: import { ProBasicListEditComponent } from './edit/edit.component';
 8: 
 9: @Component({
10:   selector: 'app-basic-list',
11:   templateUrl: './basic-list.component.html',
12:   styleUrls: ['./basic-list.component.less'],
13:   changeDetection: ChangeDetectionStrategy.OnPush,
14:   imports: [...SHARED_IMPORTS, NzPaginationComponent]
15: })
16: export class ProBasicListComponent implements OnInit {
17:   private readonly http = inject(_HttpClient);
18:   private readonly msg = inject(NzMessageService);
19:   private readonly modal = inject(ModalHelper);
20:   private readonly cdr = inject(ChangeDetectorRef);
21: 
22:   q = {
23:     q: '',
24:     status: 'all'
25:   };
26:   loading = false;
27:   data: Array<{
28:     id: number;
29:     title: string;
30:     subDescription: string;
31:     href: string;
32:     logo: string;
33:     owner: string;
34:     createdAt: Date;
35:     percent: number;
36:     status: string;
37:   }> = [];
38: 
39:   ngOnInit(): void {
40:     this.getData();
41:   }
42: 
43:   getData(): void {
44:     this.loading = true;
45:     this.http.get('/api/list', { count: 5 }).subscribe(res => {
46:       this.data = res;
47:       this.loading = false;
48:       this.cdr.detectChanges();
49:     });
50:   }
51: 
52:   openEdit(record: { id?: number } = {}): void {
53:     this.modal.create(ProBasicListEditComponent, { record }, { size: 'md' }).subscribe(res => {
54:       if (record.id) {
55:         record = { ...record, id: 'mock_id', percent: 0, ...res };
56:       } else {
57:         this.data.splice(0, 0, res);
58:         this.data = [...this.data];
59:       }
60:       this.cdr.detectChanges();
61:     });
62:   }
63: 
64:   remove(title: string): void {
65:     this.msg.success(`删除：${title}`);
66:   }
67: }
````

## File: src/app/routes/pro/list/basic-list/edit/edit.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { SFSchema } from '@delon/form';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: import { NzModalRef } from 'ng-zorro-antd/modal';
 6: 
 7: @Component({
 8:   selector: 'app-basic-list-edit',
 9:   templateUrl: './edit.component.html',
10:   imports: SHARED_IMPORTS
11: })
12: export class ProBasicListEditComponent {
13:   private readonly modal = inject(NzModalRef);
14:   private readonly msgSrv = inject(NzMessageService);
15: 
16:   record: any = {};
17:   schema: SFSchema = {
18:     properties: {
19:       title: { type: 'string', title: '任务名称', maxLength: 50 },
20:       createdAt: { type: 'string', title: '开始时间', format: 'date' },
21:       owner: {
22:         type: 'string',
23:         title: '任务负责人',
24:         enum: [
25:           { value: 'asdf', label: 'asdf' },
26:           { value: '卡色', label: '卡色' },
27:           { value: 'cipchk', label: 'cipchk' }
28:         ]
29:       },
30:       subDescription: {
31:         type: 'string',
32:         title: '产品描述',
33:         ui: {
34:           widget: 'textarea',
35:           autosize: { minRows: 2, maxRows: 6 }
36:         }
37:       }
38:     },
39:     required: ['title', 'createdAt', 'owner'],
40:     ui: {
41:       spanLabelFixed: 150,
42:       grid: { span: 24 }
43:     }
44:   };
45: 
46:   save(value: any): void {
47:     this.msgSrv.success('保存成功');
48:     this.modal.close(value);
49:   }
50: 
51:   close(): void {
52:     this.modal.destroy();
53:   }
54: }
````

## File: src/app/routes/pro/list/card-list/card-list.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
 2: import { EllipsisComponent } from '@delon/abc/ellipsis';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-list-card-list',
 9:   templateUrl: './card-list.component.html',
10:   styles: [
11:     `
12:       :host ::ng-deep .ant-card-meta-title {
13:         margin-bottom: 12px;
14:       }
15:     `
16:   ],
17:   encapsulation: ViewEncapsulation.Emulated,
18:   changeDetection: ChangeDetectionStrategy.OnPush,
19:   imports: [...SHARED_IMPORTS, EllipsisComponent]
20: })
21: export class ProCardListComponent implements OnInit {
22:   private readonly http = inject(_HttpClient);
23:   private readonly msg = inject(NzMessageService);
24:   private readonly cdr = inject(ChangeDetectorRef);
25: 
26:   list: Array<{ id: number; title: string; avatar: string; description: string } | null> = [null];
27: 
28:   loading = true;
29: 
30:   ngOnInit(): void {
31:     this.loading = true;
32:     this.http.get('/api/list', { count: 8 }).subscribe(res => {
33:       this.list = this.list.concat(res);
34:       this.loading = false;
35:       this.cdr.detectChanges();
36:     });
37:   }
38: 
39:   show(text: string): void {
40:     this.msg.success(text);
41:   }
42: }
````

## File: src/app/routes/pro/list/list/list.component.ts
````typescript
 1: import { Component, DestroyRef, OnInit, inject } from '@angular/core';
 2: import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
 3: import { ActivationEnd, Router } from '@angular/router';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { filter } from 'rxjs';
 6: 
 7: @Component({
 8:   selector: 'app-list-layout',
 9:   templateUrl: './list.component.html',
10:   imports: SHARED_IMPORTS
11: })
12: export class ProListLayoutComponent implements OnInit {
13:   private readonly router = inject(Router);
14:   private readonly d$ = inject(DestroyRef);
15: 
16:   tabs = [
17:     {
18:       key: 'articles',
19:       tab: '文章'
20:     },
21:     {
22:       key: 'applications',
23:       tab: '应用'
24:     },
25:     {
26:       key: 'projects',
27:       tab: '项目'
28:     }
29:   ];
30: 
31:   pos = 0;
32: 
33:   private setActive(): void {
34:     const key = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
35:     const idx = this.tabs.findIndex(w => w.key === key);
36:     if (idx !== -1) {
37:       this.pos = idx;
38:     }
39:   }
40: 
41:   ngOnInit(): void {
42:     this.router.events
43:       .pipe(
44:         takeUntilDestroyed(this.d$),
45:         filter(e => e instanceof ActivationEnd)
46:       )
47:       .subscribe(() => this.setActive());
48:     this.setActive();
49:   }
50: 
51:   to(item: { key: string }): void {
52:     this.router.navigateByUrl(`/pro/list/${item.key}`);
53:   }
54: }
````

## File: src/app/routes/pro/list/projects/projects.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { TagSelectComponent } from '@delon/abc/tag-select';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-list-projects',
 9:   templateUrl: './projects.component.html',
10:   styleUrls: ['./projects.component.less'],
11:   changeDetection: ChangeDetectionStrategy.OnPush,
12:   imports: [...SHARED_IMPORTS, TagSelectComponent]
13: })
14: export class ProListProjectsComponent implements OnInit {
15:   private readonly http = inject(_HttpClient);
16:   readonly msg = inject(NzMessageService);
17:   private readonly cdr = inject(ChangeDetectorRef);
18: 
19:   q = {
20:     ps: 8,
21:     categories: [],
22:     owners: ['zxx'],
23:     user: null,
24:     rate: null
25:   };
26:   list: any[] = [];
27:   loading = true;
28: 
29:   categories = [
30:     { id: 0, text: '全部', value: false },
31:     { id: 1, text: '类目一', value: false },
32:     { id: 2, text: '类目二', value: false },
33:     { id: 3, text: '类目三', value: false },
34:     { id: 4, text: '类目四', value: false },
35:     { id: 5, text: '类目五', value: false },
36:     { id: 6, text: '类目六', value: false },
37:     { id: 7, text: '类目七', value: false },
38:     { id: 8, text: '类目八', value: false },
39:     { id: 9, text: '类目九', value: false },
40:     { id: 10, text: '类目十', value: false },
41:     { id: 11, text: '类目十一', value: false },
42:     { id: 12, text: '类目十二', value: false }
43:   ];
44: 
45:   changeCategory(status: boolean, idx: number): void {
46:     if (idx === 0) {
47:       this.categories.map(i => (i.value = status));
48:     } else {
49:       this.categories[idx].value = status;
50:     }
51:     this.getData();
52:   }
53: 
54:   ngOnInit(): void {
55:     this.getData();
56:   }
57: 
58:   getData(): void {
59:     this.loading = true;
60:     this.http.get('/api/list', { count: this.q.ps }).subscribe(res => {
61:       this.list = this.list.concat(res);
62:       this.loading = false;
63:       this.cdr.detectChanges();
64:     });
65:   }
66: }
````

## File: src/app/routes/pro/list/table-list/table-list.component.ts
````typescript
  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
  2: import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
  3: import { _HttpClient } from '@delon/theme';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: import { NzModalService } from 'ng-zorro-antd/modal';
  8: import { map, tap } from 'rxjs';
  9: 
 10: @Component({
 11:   selector: 'app-table-list',
 12:   templateUrl: './table-list.component.html',
 13:   changeDetection: ChangeDetectionStrategy.OnPush,
 14:   imports: SHARED_IMPORTS
 15: })
 16: export class ProTableListComponent implements OnInit {
 17:   private readonly http = inject(_HttpClient);
 18:   private readonly msg = inject(NzMessageService);
 19:   private readonly modalSrv = inject(NzModalService);
 20:   private readonly cdr = inject(ChangeDetectorRef);
 21: 
 22:   q: {
 23:     pi: number;
 24:     ps: number;
 25:     no: string;
 26:     sorter: string;
 27:     status: number | null;
 28:     statusList: NzSafeAny[];
 29:   } = {
 30:     pi: 1,
 31:     ps: 10,
 32:     no: '',
 33:     sorter: '',
 34:     status: null,
 35:     statusList: []
 36:   };
 37:   data: any[] = [];
 38:   loading = false;
 39:   status = [
 40:     { index: 0, text: '关闭', value: false, type: 'default', checked: false },
 41:     {
 42:       index: 1,
 43:       text: '运行中',
 44:       value: false,
 45:       type: 'processing',
 46:       checked: false
 47:     },
 48:     { index: 2, text: '已上线', value: false, type: 'success', checked: false },
 49:     { index: 3, text: '异常', value: false, type: 'error', checked: false }
 50:   ];
 51:   @ViewChild('st', { static: true })
 52:   st!: STComponent;
 53:   columns: STColumn[] = [
 54:     { title: '', index: 'key', type: 'checkbox' },
 55:     { title: '规则编号', index: 'no' },
 56:     { title: '描述', index: 'description' },
 57:     {
 58:       title: '服务调用次数',
 59:       index: 'callNo',
 60:       type: 'number',
 61:       format: item => `${item.callNo} 万`,
 62:       sort: {
 63:         compare: (a, b) => a.callNo - b.callNo
 64:       }
 65:     },
 66:     {
 67:       title: '状态',
 68:       index: 'status',
 69:       render: 'status',
 70:       filter: {
 71:         menus: this.status,
 72:         fn: (filter, record) => record.status === filter['index']
 73:       }
 74:     },
 75:     {
 76:       title: '更新时间',
 77:       index: 'updatedAt',
 78:       type: 'date',
 79:       sort: {
 80:         compare: (a, b) => a.updatedAt - b.updatedAt
 81:       }
 82:     },
 83:     {
 84:       title: '操作',
 85:       buttons: [
 86:         {
 87:           text: '配置',
 88:           click: item => this.msg.success(`配置${item.no}`)
 89:         },
 90:         {
 91:           text: '订阅警报',
 92:           click: item => this.msg.success(`订阅警报${item.no}`)
 93:         }
 94:       ]
 95:     }
 96:   ];
 97:   selectedRows: STData[] = [];
 98:   description = '';
 99:   totalCallNo = 0;
100:   expandForm = false;
101: 
102:   ngOnInit(): void {
103:     this.getData();
104:   }
105: 
106:   getData(): void {
107:     this.loading = true;
108:     this.q.statusList = this.status.filter(w => w.checked).map(item => item.index);
109:     if (this.q.status !== null && this.q.status > -1) {
110:       this.q.statusList.push(this.q.status);
111:     }
112:     this.http
113:       .get('/rule', this.q)
114:       .pipe(
115:         map((list: Array<{ status: number; statusText: string; statusType: string }>) =>
116:           list.map(i => {
117:             const statusItem = this.status[i.status];
118:             i.statusText = statusItem.text;
119:             i.statusType = statusItem.type;
120:             return i;
121:           })
122:         ),
123:         tap(() => (this.loading = false))
124:       )
125:       .subscribe(res => {
126:         this.data = res;
127:         this.cdr.detectChanges();
128:       });
129:   }
130: 
131:   stChange(e: STChange): void {
132:     switch (e.type) {
133:       case 'checkbox':
134:         this.selectedRows = e.checkbox!;
135:         this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv['callNo'], 0);
136:         this.cdr.detectChanges();
137:         break;
138:       case 'filter':
139:         this.getData();
140:         break;
141:     }
142:   }
143: 
144:   remove(): void {
145:     this.http.delete('/rule', { nos: this.selectedRows.map(i => i['no']).join(',') }).subscribe(() => {
146:       this.getData();
147:       this.st.clearCheck();
148:     });
149:   }
150: 
151:   approval(): void {
152:     this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
153:   }
154: 
155:   add(tpl: TemplateRef<unknown>): void {
156:     this.modalSrv.create({
157:       nzTitle: '新建规则',
158:       nzContent: tpl,
159:       nzOnOk: () => {
160:         this.loading = true;
161:         this.http.post('/rule', { description: this.description }).subscribe(() => this.getData());
162:       }
163:     });
164:   }
165: 
166:   reset(): void {
167:     // wait form reset updated finished
168:     setTimeout(() => this.getData());
169:   }
170: }
````

## File: src/app/routes/pro/profile/advanced/advanced.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { STColumn } from '@delon/abc/st';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 6: import { NzMessageService } from 'ng-zorro-antd/message';
 7: import { NzStepsModule } from 'ng-zorro-antd/steps';
 8: import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
 9: 
10: @Component({
11:   selector: 'app-profile-advanced',
12:   templateUrl: './advanced.component.html',
13:   styleUrls: ['./advanced.component.less'],
14:   changeDetection: ChangeDetectionStrategy.OnPush,
15:   imports: [...SHARED_IMPORTS, NzStepsModule]
16: })
17: export class ProProfileAdvancedComponent implements OnInit {
18:   readonly msg = inject(NzMessageService);
19:   private readonly http = inject(_HttpClient);
20:   private readonly cdr = inject(ChangeDetectorRef);
21: 
22:   list: Array<Record<string, NzSafeAny>> = [];
23:   data = {
24:     advancedOperation1: [],
25:     advancedOperation2: [],
26:     advancedOperation3: []
27:   };
28:   opColumns: STColumn[] = [
29:     { title: '操作类型', index: 'type' },
30:     { title: '操作人', index: 'name' },
31:     { title: '执行结果', index: 'status', render: 'status' },
32:     { title: '操作时间', index: 'updatedAt', type: 'date' },
33:     { title: '备注', index: 'memo', default: '-' }
34:   ];
35: 
36:   ngOnInit(): void {
37:     this.http.get('/profile/advanced').subscribe(res => {
38:       this.data = res;
39:       this.change({ index: 0, tab: null });
40:       this.cdr.detectChanges();
41:     });
42:   }
43: 
44:   change(args: NzTabChangeEvent): void {
45:     this.list = (this.data as NzSafeAny)[`advancedOperation${args.index! + 1}`];
46:   }
47: }
````

## File: src/app/routes/pro/profile/basic/basic.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { STColumn } from '@delon/abc/st';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: import { tap } from 'rxjs';
 7: 
 8: @Component({
 9:   selector: 'app-profile-basic',
10:   templateUrl: './basic.component.html',
11:   changeDetection: ChangeDetectionStrategy.OnPush,
12:   imports: SHARED_IMPORTS
13: })
14: export class ProProfileBaseComponent {
15:   private readonly http = inject(_HttpClient);
16:   private readonly msg = inject(NzMessageService);
17: 
18:   basicNum = 0;
19:   amountNum = 0;
20:   goods = this.http.get('/profile/goods').pipe(
21:     tap((list: Array<{ num: number; amount: number }>) => {
22:       list.forEach(item => {
23:         this.basicNum += Number(item.num);
24:         this.amountNum += Number(item.amount);
25:       });
26:     })
27:   );
28:   goodsColumns: STColumn[] = [
29:     {
30:       title: '商品编号',
31:       index: 'id',
32:       type: 'link',
33:       click: item => this.msg.success(`show ${item.id}`)
34:     },
35:     { title: '商品名称', index: 'name' },
36:     { title: '商品条码', index: 'barcode' },
37:     { title: '单价', index: 'price', type: 'currency' },
38:     { title: '数量（件）', index: 'num', className: 'text-right' },
39:     { title: '金额', index: 'amount', type: 'currency' }
40:   ];
41:   progress = this.http.get('/profile/progress');
42:   progressColumns: STColumn[] = [
43:     { title: '时间', index: 'time' },
44:     { title: '当前进度', index: 'rate' },
45:     {
46:       title: '状态',
47:       index: 'status',
48:       type: 'badge',
49:       badge: {
50:         success: { text: '成功', color: 'success' },
51:         processing: { text: '进行中', color: 'processing' }
52:       }
53:     },
54:     { title: '操作员ID', index: 'operator' },
55:     { title: '耗时', index: 'cost' }
56:   ];
57: }
````

## File: src/app/routes/pro/result/fail/fail.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzResultModule } from 'ng-zorro-antd/result';
 4: 
 5: @Component({
 6:   selector: 'app-result-fail',
 7:   templateUrl: './fail.component.html',
 8:   imports: [...SHARED_IMPORTS, NzResultModule]
 9: })
10: export class ProResultFailComponent {}
````

## File: src/app/routes/pro/result/success/success.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzMessageService } from 'ng-zorro-antd/message';
 4: import { NzResultModule } from 'ng-zorro-antd/result';
 5: import { NzStepsModule } from 'ng-zorro-antd/steps';
 6: 
 7: @Component({
 8:   selector: 'app-result-success',
 9:   templateUrl: './success.component.html',
10:   imports: [...SHARED_IMPORTS, NzResultModule, NzStepsModule]
11: })
12: export class ProResultSuccessComponent {
13:   readonly msg = inject(NzMessageService);
14: }
````

## File: src/app/routes/pro/routes.ts
````typescript
  1: import { Routes } from '@angular/router';
  2: 
  3: import { ProAccountCenterApplicationsComponent } from './account/center/applications/applications.component';
  4: import { ProAccountCenterArticlesComponent } from './account/center/articles/articles.component';
  5: import { ProAccountCenterComponent } from './account/center/center.component';
  6: import { ProAccountCenterProjectsComponent } from './account/center/projects/projects.component';
  7: import { ProAccountSettingsBaseComponent } from './account/settings/base/base.component';
  8: import { ProAccountSettingsBindingComponent } from './account/settings/binding/binding.component';
  9: import { ProAccountSettingsNotificationComponent } from './account/settings/notification/notification.component';
 10: import { ProAccountSettingsSecurityComponent } from './account/settings/security/security.component';
 11: import { ProAccountSettingsComponent } from './account/settings/settings.component';
 12: import { AdvancedFormComponent } from './form/advanced-form/advanced-form.component';
 13: import { BasicFormComponent } from './form/basic-form/basic-form.component';
 14: import { StepFormComponent } from './form/step-form/step-form.component';
 15: import { ProListApplicationsComponent } from './list/applications/applications.component';
 16: import { ProListArticlesComponent } from './list/articles/articles.component';
 17: import { ProBasicListComponent } from './list/basic-list/basic-list.component';
 18: import { ProCardListComponent } from './list/card-list/card-list.component';
 19: import { ProListLayoutComponent } from './list/list/list.component';
 20: import { ProListProjectsComponent } from './list/projects/projects.component';
 21: import { ProTableListComponent } from './list/table-list/table-list.component';
 22: import { ProProfileAdvancedComponent } from './profile/advanced/advanced.component';
 23: import { ProProfileBaseComponent } from './profile/basic/basic.component';
 24: import { ProResultFailComponent } from './result/fail/fail.component';
 25: import { ProResultSuccessComponent } from './result/success/success.component';
 26: 
 27: export const routes: Routes = [
 28:   {
 29:     path: 'form',
 30:     children: [
 31:       { path: 'basic-form', component: BasicFormComponent },
 32:       { path: 'step-form', component: StepFormComponent },
 33:       { path: 'advanced-form', component: AdvancedFormComponent }
 34:     ]
 35:   },
 36:   {
 37:     path: 'list',
 38:     children: [
 39:       { path: 'table-list', component: ProTableListComponent },
 40:       { path: 'basic-list', component: ProBasicListComponent },
 41:       { path: 'card-list', component: ProCardListComponent },
 42:       {
 43:         path: '',
 44:         component: ProListLayoutComponent,
 45:         children: [
 46:           { path: 'articles', component: ProListArticlesComponent },
 47:           { path: 'projects', component: ProListProjectsComponent },
 48:           { path: 'applications', component: ProListApplicationsComponent }
 49:         ]
 50:       }
 51:     ]
 52:   },
 53:   {
 54:     path: 'profile',
 55:     children: [
 56:       { path: 'basic', component: ProProfileBaseComponent },
 57:       { path: 'advanced', component: ProProfileAdvancedComponent }
 58:     ]
 59:   },
 60:   {
 61:     path: 'result',
 62:     children: [
 63:       { path: 'success', component: ProResultSuccessComponent },
 64:       { path: 'fail', component: ProResultFailComponent }
 65:     ]
 66:   },
 67:   {
 68:     path: 'account',
 69:     children: [
 70:       {
 71:         path: 'center',
 72:         component: ProAccountCenterComponent,
 73:         children: [
 74:           { path: '', redirectTo: 'articles', pathMatch: 'full' },
 75:           {
 76:             path: 'articles',
 77:             component: ProAccountCenterArticlesComponent,
 78:             data: { titleI18n: 'pro-account-center' }
 79:           },
 80:           {
 81:             path: 'projects',
 82:             component: ProAccountCenterProjectsComponent,
 83:             data: { titleI18n: 'pro-account-center' }
 84:           },
 85:           {
 86:             path: 'applications',
 87:             component: ProAccountCenterApplicationsComponent,
 88:             data: { titleI18n: 'pro-account-center' }
 89:           }
 90:         ]
 91:       },
 92:       {
 93:         path: 'settings',
 94:         component: ProAccountSettingsComponent,
 95:         children: [
 96:           { path: '', redirectTo: 'base', pathMatch: 'full' },
 97:           {
 98:             path: 'base',
 99:             component: ProAccountSettingsBaseComponent,
100:             data: { titleI18n: 'pro-account-settings' }
101:           },
102:           {
103:             path: 'security',
104:             component: ProAccountSettingsSecurityComponent,
105:             data: { titleI18n: 'pro-account-settings' }
106:           },
107:           {
108:             path: 'binding',
109:             component: ProAccountSettingsBindingComponent,
110:             data: { titleI18n: 'pro-account-settings' }
111:           },
112:           {
113:             path: 'notification',
114:             component: ProAccountSettingsNotificationComponent,
115:             data: { titleI18n: 'pro-account-settings' }
116:           }
117:         ]
118:       }
119:     ]
120:   }
121: ];
````

## File: src/app/routes/quality/checks/quality-checks.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-quality-checks',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'质量检查'"></page-header>
10: 
11:     <nz-card nzTitle="质量检查管理" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="质量检查功能开发中"
15:         nzDescription="此页面将用于管理质量检查。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class QualityChecksComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载质量检查数据
27:   }
28: }
````

## File: src/app/routes/quality/inspections/quality-inspections.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-quality-inspections',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'验收管理'"></page-header>
10: 
11:     <nz-card nzTitle="验收管理" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="验收管理功能开发中"
15:         nzDescription="此页面将用于管理验收流程。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class QualityInspectionsComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载验收管理数据
27:   }
28: }
````

## File: src/app/routes/quality/photos/quality-photos.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-quality-photos',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'验收照片'"></page-header>
10: 
11:     <nz-card nzTitle="验收照片管理" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="验收照片功能开发中"
15:         nzDescription="此页面将用于管理验收照片。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class QualityPhotosComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载验收照片数据
27:   }
28: }
````

## File: src/app/routes/quality/results/quality-results.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-quality-results',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'验收结果'"></page-header>
10: 
11:     <nz-card nzTitle="验收结果管理" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="验收结果功能开发中"
15:         nzDescription="此页面将用于查看和管理验收结果。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class QualityResultsComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载验收结果数据
27:   }
28: }
````

## File: src/app/routes/quality/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: export const QUALITY_ROUTES: Routes = [
 4:   {
 5:     path: '',
 6:     redirectTo: 'checks',
 7:     pathMatch: 'full'
 8:   },
 9:   {
10:     path: 'checks',
11:     loadComponent: () => import('./checks/quality-checks.component').then(m => m.QualityChecksComponent)
12:   },
13:   {
14:     path: 'submit',
15:     loadComponent: () => import('./submit/quality-submit.component').then(m => m.QualitySubmitComponent)
16:   },
17:   {
18:     path: 'inspections',
19:     loadComponent: () => import('./inspections/quality-inspections.component').then(m => m.QualityInspectionsComponent)
20:   },
21:   {
22:     path: 'photos',
23:     loadComponent: () => import('./photos/quality-photos.component').then(m => m.QualityPhotosComponent)
24:   },
25:   {
26:     path: 'results',
27:     loadComponent: () => import('./results/quality-results.component').then(m => m.QualityResultsComponent)
28:   }
29: ];
````

## File: src/app/routes/quality/submit/quality-submit.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-quality-submit',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'提交验收'"></page-header>
10: 
11:     <nz-card nzTitle="提交验收申请" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="提交验收功能开发中"
15:         nzDescription="此页面将用于提交验收申请。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class QualitySubmitComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载提交验收表单
27:   }
28: }
````

## File: src/app/routes/style/color.service.ts
````typescript
 1: import { Injectable } from '@angular/core';
 2: 
 3: @Injectable()
 4: export class ColorService {
 5:   APP_COLORS = {
 6:     primary: '#1890ff',
 7:     success: '#52c41a',
 8:     error: '#f5222d',
 9:     warning: '#fadb14',
10:     red: '#f5222d',
11:     volcano: '#fa541c',
12:     orange: '#fa8c16',
13:     gold: '#faad14',
14:     yellow: '#fadb14',
15:     lime: '#a0d911',
16:     green: '#52c41a',
17:     cyan: '#13c2c2',
18:     blue: '#1890ff',
19:     geekblue: '#2f54eb',
20:     purple: '#722ed1',
21:     magenta: '#eb2f96'
22:   };
23: 
24:   get names(): string[] {
25:     return Object.keys(this.APP_COLORS).filter((_, index) => index > 3);
26:   }
27: 
28:   get brands(): string[] {
29:     return ['primary', 'success', 'error', 'warning'];
30:   }
31: }
````

## File: src/app/routes/style/colors/colors.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { copy } from '@delon/util/browser';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: import { ColorService } from '../color.service';
 7: 
 8: @Component({
 9:   selector: 'app-colors',
10:   templateUrl: './colors.component.html',
11:   styleUrls: ['./colors.component.less'],
12:   imports: SHARED_IMPORTS
13: })
14: export class ColorsComponent {
15:   private readonly colorSrv = inject(ColorService);
16:   private readonly msg = inject(NzMessageService);
17: 
18:   nums = Array(10)
19:     .fill(1)
20:     .map((v, i) => v + i);
21: 
22:   get names(): string[] {
23:     return this.colorSrv.names;
24:   }
25: 
26:   get brands(): string[] {
27:     return this.colorSrv.brands;
28:   }
29: 
30:   onCopy(str: string): void {
31:     copy(str).then(() => this.msg.success(`Copied Success!`));
32:   }
33: }
````

## File: src/app/routes/style/gridmasonry/gridmasonry.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-gridmasonry',
 6:   templateUrl: './gridmasonry.component.html',
 7:   styleUrls: ['./gridmasonry.component.less'],
 8:   imports: SHARED_IMPORTS
 9: })
10: export class GridMasonryComponent {}
````

## File: src/app/routes/style/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: import { ColorService } from './color.service';
 4: import { ColorsComponent } from './colors/colors.component';
 5: import { GridMasonryComponent } from './gridmasonry/gridmasonry.component';
 6: import { TypographyComponent } from './typography/typography.component';
 7: 
 8: export const routes: Routes = [
 9:   {
10:     path: '',
11:     providers: [ColorService],
12:     children: [
13:       { path: 'gridmasonry', component: GridMasonryComponent },
14:       { path: 'typography', component: TypographyComponent },
15:       { path: 'colors', component: ColorsComponent }
16:     ]
17:   }
18: ];
````

## File: src/app/routes/style/typography/typography.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: import { ColorService } from '../color.service';
 5: 
 6: @Component({
 7:   selector: 'app-typography',
 8:   templateUrl: './typography.component.html',
 9:   imports: SHARED_IMPORTS
10: })
11: export class TypographyComponent {
12:   private readonly colorSrv = inject(ColorService);
13:   get names(): string[] {
14:     return this.colorSrv.names;
15:   }
16: }
````

## File: src/app/routes/system/activity-logs/system-activity-log.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-system-activity-log',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'系统活动日志'"></page-header>
11: 
12:     <nz-card nzTitle="系统活动日志" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="系统活动日志功能建设中"
16:         nzDescription="此页面将展示平台级操作日志与审计轨迹。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class SystemActivityLogComponent {}
````

## File: src/app/routes/system/branch-permissions/branch-permission.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-branch-permission',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'分支权限管理'"></page-header>
11: 
12:     <nz-card nzTitle="分支权限管理" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="分支权限功能建设中"
16:         nzDescription="此页面将校验 Git-like 分支模型下的访问控制。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class BranchPermissionComponent {}
````

## File: src/app/routes/system/feature-flags/feature-flag.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-feature-flag',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'功能开关'"></page-header>
11: 
12:     <nz-card nzTitle="功能开关" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="功能开关模块建设中"
16:         nzDescription="此页面将管理功能标记、灰度策略与快照。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class FeatureFlagComponent {}
````

## File: src/app/routes/system/permission-matrix/permission-matrix.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-permission-matrix',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'权限矩阵'"></page-header>
11: 
12:     <nz-card nzTitle="权限矩阵" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="权限矩阵功能建设中"
16:         nzDescription="此页面将展示角色、模块与操作的矩阵映射。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class PermissionMatrixComponent {}
````

## File: src/app/routes/system/permissions/permission-assignment.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-permission-assignment',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'权限分配'"></page-header>
11: 
12:     <nz-card nzTitle="权限分配" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="权限分配功能建设中"
16:         nzDescription="此页面将提供权限授予、审批流程与历史记录。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class PermissionAssignmentComponent {}
````

## File: src/app/routes/system/roles/role-management.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-role-management',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'角色管理'"></page-header>
11: 
12:     <nz-card nzTitle="角色管理" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="角色管理功能建设中"
16:         nzDescription="此页面将维护角色定义、职责说明以及映射。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class RoleManagementComponent {}
````

## File: src/app/routes/system/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: export const SYSTEM_ROUTES: Routes = [
 4:   {
 5:     path: '',
 6:     redirectTo: 'settings',
 7:     pathMatch: 'full'
 8:   },
 9:   {
10:     path: 'settings',
11:     loadComponent: () => import('./settings/system-settings.component').then(m => m.SystemSettingsComponent)
12:   },
13:   {
14:     path: 'feature-flags',
15:     loadComponent: () =>
16:       import('./feature-flags/feature-flag.component').then(m => m.FeatureFlagComponent)
17:   },
18:   {
19:     path: 'roles',
20:     loadComponent: () => import('./roles/role-management.component').then(m => m.RoleManagementComponent)
21:   },
22:   {
23:     path: 'permissions',
24:     loadComponent: () =>
25:       import('./permissions/permission-assignment.component').then(m => m.PermissionAssignmentComponent)
26:   },
27:   {
28:     path: 'permission-matrix',
29:     loadComponent: () =>
30:       import('./permission-matrix/permission-matrix.component').then(m => m.PermissionMatrixComponent)
31:   },
32:   {
33:     path: 'branch-permissions',
34:     loadComponent: () =>
35:       import('./branch-permissions/branch-permission.component').then(m => m.BranchPermissionComponent)
36:   },
37:   {
38:     path: 'weather-api',
39:     loadComponent: () =>
40:       import('./weather-api/weather-api.component').then(m => m.WeatherApiComponent)
41:   },
42:   {
43:     path: 'activity-logs',
44:     loadComponent: () =>
45:       import('./activity-logs/system-activity-log.component').then(m => m.SystemActivityLogComponent)
46:   }
47: ];
````

## File: src/app/routes/system/settings/system-settings.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-system-settings',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'系统设置'"></page-header>
11: 
12:     <nz-card nzTitle="系统设置" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="系统设置功能建设中"
16:         nzDescription="此页面将集中维护平台级参数与主题配置。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class SystemSettingsComponent {}
````

## File: src/app/routes/system/weather-api/weather-api.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-weather-api',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   template: `
10:     <page-header [title]="'天气 API 配置'"></page-header>
11: 
12:     <nz-card nzTitle="天气 API 配置" style="margin-top: 16px;">
13:       <nz-alert
14:         nzType="info"
15:         nzMessage="天气 API 配置功能建设中"
16:         nzDescription="此页面将配置第三方天气服务、配额与缓存策略。"
17:         [nzShowIcon]="true"
18:         style="margin-bottom: 16px;"
19:       ></nz-alert>
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class WeatherApiComponent {}
````

## File: src/app/routes/tasks/assignments/task-assignments.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-task-assignments',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'任务分配'"></page-header>
10: 
11:     <nz-card nzTitle="任务分配管理" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="任务分配功能开发中"
15:         nzDescription="此页面将用于管理任务的分配。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class TaskAssignmentsComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载任务分配数据
27:   }
28: }
````

## File: src/app/routes/tasks/board/task-board.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-task-board',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'任务看板'"></page-header>
10: 
11:     <nz-card nzTitle="任务看板视图" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="任务看板功能开发中"
15:         nzDescription="此页面将用于以看板形式展示任务。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class TaskBoardComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载任务看板数据
27:   }
28: }
````

## File: src/app/routes/tasks/calendar/task-calendar.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-task-calendar',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'任务日历'"></page-header>
10: 
11:     <nz-card nzTitle="任务日历视图" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="任务日历功能开发中"
15:         nzDescription="此页面将用于以日历形式展示任务。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class TaskCalendarComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载任务日历数据
27:   }
28: }
````

## File: src/app/routes/tasks/daily-reports/daily-reports.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-daily-reports',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'日报管理'"></page-header>
10: 
11:     <nz-card nzTitle="每日工作报告" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="日报功能开发中"
15:         nzDescription="此页面将用于管理每日工作报告。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class DailyReportsComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载日报数据
27:   }
28: }
````

## File: src/app/routes/tasks/detail/task-detail.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { ActivatedRoute, Router } from '@angular/router';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-task-detail',
 8:   standalone: true,
 9:   imports: [SHARED_IMPORTS],
10:   template: `
11:     <page-header [title]="'任务详情'">
12:       <ng-template #extra>
13:         <button nz-button (click)="edit()">编辑</button>
14:       </ng-template>
15:     </page-header>
16: 
17:     <nz-card nzTitle="任务详细信息" style="margin-top: 16px;">
18:       <nz-alert
19:         nzType="info"
20:         nzMessage="任务详情功能开发中"
21:         nzDescription="此页面将用于显示任务的详细信息。"
22:         [nzShowIcon]="true"
23:         style="margin-bottom: 16px;"
24:       ></nz-alert>
25: 
26:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
27:     </nz-card>
28:   `
29: })
30: export class TaskDetailComponent implements OnInit {
31:   route = inject(ActivatedRoute);
32:   router = inject(Router);
33:   message = inject(NzMessageService);
34: 
35:   taskId = '';
36: 
37:   ngOnInit(): void {
38:     this.taskId = this.route.snapshot.paramMap.get('id') || '';
39:     if (!this.taskId) {
40:       this.message.error('任务ID不存在');
41:       this.router.navigate(['/tasks']);
42:     }
43:   }
44: 
45:   edit(): void {
46:     this.router.navigate(['/tasks', this.taskId, 'edit']);
47:   }
48: }
````

## File: src/app/routes/tasks/form/task-form.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { ActivatedRoute, Router } from '@angular/router';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-task-form',
 8:   standalone: true,
 9:   imports: [SHARED_IMPORTS],
10:   template: `
11:     <page-header [title]="isEdit ? '编辑任务' : '新建任务'"></page-header>
12: 
13:     <nz-card nzTitle="任务表单" style="margin-top: 16px;">
14:       <nz-alert
15:         nzType="info"
16:         nzMessage="任务表单功能开发中"
17:         nzDescription="此页面将用于创建或编辑任务。"
18:         [nzShowIcon]="true"
19:         style="margin-bottom: 16px;"
20:       ></nz-alert>
21: 
22:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
23:     </nz-card>
24:   `
25: })
26: export class TaskFormComponent implements OnInit {
27:   route = inject(ActivatedRoute);
28:   router = inject(Router);
29:   message = inject(NzMessageService);
30: 
31:   isEdit = false;
32:   taskId = '';
33: 
34:   ngOnInit(): void {
35:     this.taskId = this.route.snapshot.paramMap.get('id') || '';
36:     this.isEdit = !!this.taskId;
37:   }
38: }
````

## File: src/app/routes/tasks/list/task-list.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { Router } from '@angular/router';
 3: import { STColumn } from '@delon/abc/st';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-task-list',
 9:   standalone: true,
10:   imports: [SHARED_IMPORTS],
11:   template: `
12:     <page-header [title]="'任务列表'">
13:       <ng-template #extra>
14:         <button nz-button nzType="primary" (click)="createTask()">
15:           <span nz-icon nzType="plus"></span>
16:           新建任务
17:         </button>
18:       </ng-template>
19:     </page-header>
20: 
21:     <nz-card nzTitle="任务树形视图" style="margin-top: 16px;">
22:       <nz-alert
23:         nzType="info"
24:         nzMessage="任务管理功能开发中"
25:         nzDescription="此页面将用于显示和管理所有任务。"
26:         [nzShowIcon]="true"
27:         style="margin-bottom: 16px;"
28:       ></nz-alert>
29: 
30:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
31:     </nz-card>
32:   `
33: })
34: export class TaskListComponent implements OnInit {
35:   router = inject(Router);
36:   message = inject(NzMessageService);
37: 
38:   ngOnInit(): void {
39:     // TODO: 加载任务列表
40:   }
41: 
42:   createTask(): void {
43:     this.router.navigate(['/tasks/create']);
44:   }
45: }
````

## File: src/app/routes/tasks/photos/task-photos.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-task-photos',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'施工照片'"></page-header>
10: 
11:     <nz-card nzTitle="施工照片管理" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="施工照片功能开发中"
15:         nzDescription="此页面将用于管理施工照片。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class TaskPhotosComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载施工照片数据
27:   }
28: }
````

## File: src/app/routes/tasks/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: export const TASK_ROUTES: Routes = [
 4:   {
 5:     path: '',
 6:     redirectTo: 'list',
 7:     pathMatch: 'full'
 8:   },
 9:   {
10:     path: 'list',
11:     loadComponent: () => import('./list/task-list.component').then(m => m.TaskListComponent)
12:   },
13:   {
14:     path: 'board',
15:     loadComponent: () => import('./board/task-board.component').then(m => m.TaskBoardComponent)
16:   },
17:   {
18:     path: 'calendar',
19:     loadComponent: () => import('./calendar/task-calendar.component').then(m => m.TaskCalendarComponent)
20:   },
21:   {
22:     path: 'create',
23:     loadComponent: () => import('./form/task-form.component').then(m => m.TaskFormComponent)
24:   },
25:   {
26:     path: ':id',
27:     loadComponent: () => import('./detail/task-detail.component').then(m => m.TaskDetailComponent)
28:   },
29:   {
30:     path: ':id/edit',
31:     loadComponent: () => import('./form/task-form.component').then(m => m.TaskFormComponent)
32:   },
33:   {
34:     path: 'assignments',
35:     loadComponent: () => import('./assignments/task-assignments.component').then(m => m.TaskAssignmentsComponent)
36:   },
37:   {
38:     path: 'todo',
39:     loadComponent: () => import('./todo/task-todo.component').then(m => m.TaskTodoComponent)
40:   },
41:   {
42:     path: 'staging',
43:     loadComponent: () => import('./staging/task-staging.component').then(m => m.TaskStagingComponent)
44:   },
45:   {
46:     path: 'daily-reports',
47:     loadComponent: () => import('./daily-reports/daily-reports.component').then(m => m.DailyReportsComponent)
48:   },
49:   {
50:     path: 'photos',
51:     loadComponent: () => import('./photos/task-photos.component').then(m => m.TaskPhotosComponent)
52:   },
53:   {
54:     path: 'weather',
55:     loadComponent: () => import('./weather/task-weather.component').then(m => m.TaskWeatherComponent)
56:   }
57: ];
````

## File: src/app/routes/tasks/staging/task-staging.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-task-staging',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'暂存区'"></page-header>
10: 
11:     <nz-card nzTitle="任务暂存区" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="暂存区功能开发中"
15:         nzDescription="此页面将用于管理48小时内可撤回的任务。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class TaskStagingComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载暂存区数据
27:   }
28: }
````

## File: src/app/routes/tasks/todo/task-todo.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-task-todo',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'待办列表'"></page-header>
10: 
11:     <nz-card nzTitle="任务待办列表" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="待办列表功能开发中"
15:         nzDescription="此页面将用于显示所有待办任务。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class TaskTodoComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载待办列表数据
27:   }
28: }
````

## File: src/app/routes/tasks/weather/task-weather.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-task-weather',
 6:   standalone: true,
 7:   imports: [SHARED_IMPORTS],
 8:   template: `
 9:     <page-header [title]="'天气记录'"></page-header>
10: 
11:     <nz-card nzTitle="天气记录管理" style="margin-top: 16px;">
12:       <nz-alert
13:         nzType="info"
14:         nzMessage="天气记录功能开发中"
15:         nzDescription="此页面将用于管理天气记录。"
16:         [nzShowIcon]="true"
17:         style="margin-bottom: 16px;"
18:       ></nz-alert>
19: 
20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
21:     </nz-card>
22:   `
23: })
24: export class TaskWeatherComponent implements OnInit {
25:   ngOnInit(): void {
26:     // TODO: 加载天气记录数据
27:   }
28: }
````

## File: src/app/routes/widgets/routes.ts
````typescript
1: import { Routes } from '@angular/router';
2: 
3: import { WidgetsComponent } from './widgets/widgets.component';
4: 
5: export const routes: Routes = [{ path: '', component: WidgetsComponent }];
````

## File: src/app/routes/widgets/widgets/widgets.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { G2MiniAreaModule } from '@delon/chart/mini-area';
 3: import { G2MiniBarData, G2MiniBarModule } from '@delon/chart/mini-bar';
 4: import { _HttpClient } from '@delon/theme';
 5: import { SHARED_IMPORTS } from '@shared';
 6: import { NzCarouselModule } from 'ng-zorro-antd/carousel';
 7: import { NzMessageService } from 'ng-zorro-antd/message';
 8: 
 9: @Component({
10:   selector: 'app-widgets',
11:   templateUrl: './widgets.component.html',
12:   styleUrls: ['./widgets.component.less'],
13:   changeDetection: ChangeDetectionStrategy.OnPush,
14:   imports: [...SHARED_IMPORTS, NzCarouselModule, G2MiniBarModule, G2MiniAreaModule]
15: })
16: export class WidgetsComponent implements OnInit {
17:   readonly msg = inject(NzMessageService);
18:   private readonly http = inject(_HttpClient);
19:   private readonly cdr = inject(ChangeDetectorRef);
20: 
21:   data: G2MiniBarData[] = [];
22:   smallData: G2MiniBarData[] = [];
23:   todoData: Array<{ completed: boolean; avatar: string; name: string; content: string }> = [
24:     {
25:       completed: true,
26:       avatar: '1',
27:       name: '苏先生',
28:       content: `请告诉我，我应该说点什么好？`
29:     },
30:     {
31:       completed: false,
32:       avatar: '2',
33:       name: 'はなさき',
34:       content: `ハルカソラトキヘダツヒカリ`
35:     },
36:     {
37:       completed: false,
38:       avatar: '3',
39:       name: 'cipchk',
40:       content: `this world was never meant for one as beautiful as you.`
41:     },
42:     {
43:       completed: false,
44:       avatar: '4',
45:       name: 'Kent',
46:       content: `my heart is beating with hers`
47:     },
48:     {
49:       completed: false,
50:       avatar: '5',
51:       name: 'Are you',
52:       content: `They always said that I love beautiful girl than my friends`
53:     },
54:     {
55:       completed: false,
56:       avatar: '6',
57:       name: 'Forever',
58:       content: `Walking through green fields ，sunshine in my eyes.`
59:     }
60:   ];
61:   like = false;
62:   dislike = false;
63: 
64:   ngOnInit(): void {
65:     this.http.get('/chart/visit').subscribe((res: G2MiniBarData[]) => {
66:       this.data = res;
67:       this.smallData = res.slice(0, 6);
68:       this.cdr.detectChanges();
69:     });
70:   }
71: }
````

## File: src/app/shared/cell-widget/index.ts
````typescript
1: import type { CellWidgetProvideConfig } from '@delon/abc/cell';
2: 
3: export const CELL_WIDGETS: CellWidgetProvideConfig[] = [];
````

## File: src/app/shared/json-schema/index.ts
````typescript
 1: import type { SFWidgetProvideConfig } from '@delon/form';
 2: // import { withCascaderWidget } from '@delon/form/widgets/cascader';
 3: 
 4: import { TestWidget } from './test/test.widget';
 5: 
 6: export const SF_WIDGETS: SFWidgetProvideConfig[] = [
 7:   { KEY: TestWidget.KEY, type: TestWidget }
 8:   // Non-built-in widget registration method
 9:   // withCascaderWidget()
10: ];
````

## File: src/app/shared/json-schema/test/test.widget.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
 2: import { ControlWidget, DelonFormModule } from '@delon/form';
 3: 
 4: @Component({
 5:   selector: 'test',
 6:   template: `
 7:     <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
 8:       test widget
 9:     </sf-item-wrap>
10:   `,
11:   preserveWhitespaces: false,
12:   changeDetection: ChangeDetectionStrategy.OnPush,
13:   imports: [DelonFormModule]
14: })
15: export class TestWidget extends ControlWidget implements OnInit {
16:   static readonly KEY = 'test';
17: 
18:   ngOnInit(): void {
19:     console.warn('init test widget');
20:   }
21: }
````

## File: src/app/shared/models/account/types.ts
````typescript
 1: import { Database, AccountType, AccountStatus, TeamMemberRole } from '@core';
 2: 
 3: /**
 4:  * 重新导出账户相关枚举（从 core 层导入）
 5:  * 保持向后兼容，允许从 @shared/models/account 导入
 6:  * 
 7:  * 这些枚举定义在 core 层，因为 Repository 层需要使用它们
 8:  * 符合分层架构：core 不依赖 shared
 9:  */
10: export { AccountType, AccountStatus, TeamMemberRole };
11: 
12: /**
13:  * Account 实体类型（camelCase）
14:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
15:  */
16: export type Account = Database['public']['Tables']['accounts']['Row'];
17: export type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
18: export type AccountUpdate = Database['public']['Tables']['accounts']['Update'];
19: 
20: /**
21:  * Team 实体类型（camelCase）
22:  */
23: export type Team = Database['public']['Tables']['teams']['Row'];
24: export type TeamInsert = Database['public']['Tables']['teams']['Insert'];
25: export type TeamUpdate = Database['public']['Tables']['teams']['Update'];
26: 
27: /**
28:  * TeamMember 实体类型（camelCase）
29:  */
30: export type TeamMember = Database['public']['Tables']['team_members']['Row'];
31: export type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];
32: export type TeamMemberUpdate = Database['public']['Tables']['team_members']['Update'];
33: 
34: /**
35:  * OrganizationSchedule 实体类型（camelCase）
36:  */
37: export type OrganizationSchedule = Database['public']['Tables']['organization_schedules']['Row'];
38: export type OrganizationScheduleInsert = Database['public']['Tables']['organization_schedules']['Insert'];
39: export type OrganizationScheduleUpdate = Database['public']['Tables']['organization_schedules']['Update'];
````

## File: src/app/shared/models/blueprint/index.ts
````typescript
 1: /**
 2:  * 蓝图模型导出
 3:  * 
 4:  * 提供蓝图系统相关的类型定义：
 5:  * - Blueprint: 蓝图主表
 6:  * - BlueprintConfig: 蓝图配置
 7:  * - BlueprintBranch: 蓝图分支
 8:  * - BranchFork: 分支 Fork 记录
 9:  * - PullRequest: Pull Request
10:  * 
11:  * @module shared/models/blueprint
12:  */
13: 
14: export * from './types';
````

## File: src/app/shared/models/blueprint/types.ts
````typescript
 1: import { Database, BlueprintStatus, BranchType, BranchStatus, PRStatus } from '@core';
 2: 
 3: /**
 4:  * 重新导出蓝图系统相关枚举（从 core 层导入）
 5:  * 保持向后兼容，允许从 @shared/models/blueprint 导入
 6:  * 
 7:  * 这些枚举定义在 core 层，因为 Repository 层需要使用它们
 8:  * 符合分层架构：core 不依赖 shared
 9:  */
10: export { BlueprintStatus, BranchType, BranchStatus, PRStatus };
11: 
12: /**
13:  * Blueprint 实体类型（camelCase）
14:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
15:  */
16: export type Blueprint = Database['public']['Tables']['blueprints']['Row'];
17: export type BlueprintInsert = Database['public']['Tables']['blueprints']['Insert'];
18: export type BlueprintUpdate = Database['public']['Tables']['blueprints']['Update'];
19: 
20: /**
21:  * BlueprintConfig 实体类型（camelCase）
22:  */
23: export type BlueprintConfig = Database['public']['Tables']['blueprint_configs']['Row'];
24: export type BlueprintConfigInsert = Database['public']['Tables']['blueprint_configs']['Insert'];
25: export type BlueprintConfigUpdate = Database['public']['Tables']['blueprint_configs']['Update'];
26: 
27: /**
28:  * BlueprintBranch 实体类型（camelCase）
29:  */
30: export type BlueprintBranch = Database['public']['Tables']['blueprint_branches']['Row'];
31: export type BlueprintBranchInsert = Database['public']['Tables']['blueprint_branches']['Insert'];
32: export type BlueprintBranchUpdate = Database['public']['Tables']['blueprint_branches']['Update'];
33: 
34: /**
35:  * BranchFork 实体类型（camelCase）
36:  */
37: export type BranchFork = Database['public']['Tables']['branch_forks']['Row'];
38: export type BranchForkInsert = Database['public']['Tables']['branch_forks']['Insert'];
39: export type BranchForkUpdate = Database['public']['Tables']['branch_forks']['Update'];
40: 
41: /**
42:  * PullRequest 实体类型（camelCase）
43:  */
44: export type PullRequest = Database['public']['Tables']['pull_requests']['Row'];
45: export type PullRequestInsert = Database['public']['Tables']['pull_requests']['Insert'];
46: export type PullRequestUpdate = Database['public']['Tables']['pull_requests']['Update'];
````

## File: src/app/shared/models/collaboration/index.ts
````typescript
1: /**
2:  * 组织协作模型导出
3:  */
4: export * from './types';
````

## File: src/app/shared/models/collaboration/types.ts
````typescript
 1: import { Database, CollaborationType, CollaborationStatus, InvitationStatus } from '@core';
 2: 
 3: /**
 4:  * 重新导出协作相关枚举（从 core 层导入）
 5:  * 保持向后兼容，允许从 @shared/models/collaboration 导入
 6:  * 
 7:  * 这些枚举定义在 core 层，因为 Repository 层需要使用它们
 8:  * 符合分层架构：core 不依赖 shared
 9:  */
10: export { CollaborationType, CollaborationStatus, InvitationStatus };
11: 
12: /**
13:  * OrganizationCollaboration 实体类型（camelCase）
14:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
15:  */
16: export type OrganizationCollaboration = Database['public']['Tables']['organization_collaborations']['Row'];
17: export type OrganizationCollaborationInsert = Database['public']['Tables']['organization_collaborations']['Insert'];
18: export type OrganizationCollaborationUpdate = Database['public']['Tables']['organization_collaborations']['Update'];
19: 
20: /**
21:  * CollaborationInvitation 实体类型（camelCase）
22:  */
23: export type CollaborationInvitation = Database['public']['Tables']['collaboration_invitations']['Row'];
24: export type CollaborationInvitationInsert = Database['public']['Tables']['collaboration_invitations']['Insert'];
25: export type CollaborationInvitationUpdate = Database['public']['Tables']['collaboration_invitations']['Update'];
26: 
27: /**
28:  * CollaborationMember 实体类型（camelCase）
29:  */
30: export type CollaborationMember = Database['public']['Tables']['collaboration_members']['Row'];
31: export type CollaborationMemberInsert = Database['public']['Tables']['collaboration_members']['Insert'];
32: export type CollaborationMemberUpdate = Database['public']['Tables']['collaboration_members']['Update'];
````

## File: src/app/shared/services/account/account.service.spec.ts
````typescript
  1: import { TestBed } from '@angular/core/testing';
  2: import { of, throwError } from 'rxjs';
  3: import { AccountRepository } from '@core';
  4: import { AccountService } from './account.service';
  5: import { Account, AccountType, AccountStatus } from '@shared';
  6: 
  7: describe('AccountService', () => {
  8:   let service: AccountService;
  9:   let repository: jasmine.SpyObj<AccountRepository>;
 10: 
 11:   const mockAccount: Account = {
 12:     id: 'account-1',
 13:     auth_user_id: 'auth-user-1',
 14:     type: AccountType.USER,
 15:     name: 'Test User',
 16:     email: 'test@example.com',
 17:     avatar_url: null,
 18:     status: AccountStatus.ACTIVE,
 19:     metadata: {},
 20:     created_at: '2025-01-01T00:00:00Z',
 21:     updated_at: '2025-01-01T00:00:00Z'
 22:   } as Account;
 23: 
 24:   const mockAccounts: Account[] = [
 25:     mockAccount,
 26:     {
 27:       ...mockAccount,
 28:       id: 'account-2',
 29:       type: AccountType.ORGANIZATION,
 30:       name: 'Test Organization',
 31:       status: AccountStatus.INACTIVE
 32:     }
 33:   ];
 34: 
 35:   beforeEach(() => {
 36:     const repositorySpy = jasmine.createSpyObj('AccountRepository', [
 37:       'findAll',
 38:       'findById',
 39:       'findByType',
 40:       'findByStatus',
 41:       'findByAuthUserId',
 42:       'findByEmail',
 43:       'create',
 44:       'update',
 45:       'delete'
 46:     ]);
 47: 
 48:     TestBed.configureTestingModule({
 49:       providers: [AccountService, { provide: AccountRepository, useValue: repositorySpy }]
 50:     });
 51: 
 52:     service = TestBed.inject(AccountService);
 53:     repository = TestBed.inject(AccountRepository) as jasmine.SpyObj<AccountRepository>;
 54:   });
 55: 
 56:   it('should be created', () => {
 57:     expect(service).toBeTruthy();
 58:   });
 59: 
 60:   describe('Initial state', () => {
 61:     it('should have empty accounts', () => {
 62:       expect(service.accounts().length).toBe(0);
 63:     });
 64: 
 65:     it('should have null selected account', () => {
 66:       expect(service.selectedAccount()).toBeNull();
 67:     });
 68: 
 69:     it('should have false loading state', () => {
 70:       expect(service.loading()).toBe(false);
 71:     });
 72: 
 73:     it('should have null error state', () => {
 74:       expect(service.error()).toBeNull();
 75:     });
 76:   });
 77: 
 78:   describe('loadAccounts', () => {
 79:     it('should load accounts successfully', async () => {
 80:       repository.findAll.and.returnValue(of(mockAccounts));
 81: 
 82:       await service.loadAccounts();
 83: 
 84:       expect(service.accounts().length).toBe(2);
 85:       expect(service.accounts()[0].id).toBe('account-1');
 86:       expect(service.loading()).toBe(false);
 87:       expect(service.error()).toBeNull();
 88:     });
 89: 
 90:     it('should set loading state during load', async () => {
 91:       repository.findAll.and.returnValue(of(mockAccounts));
 92: 
 93:       const loadPromise = service.loadAccounts();
 94:       expect(service.loading()).toBe(true);
 95: 
 96:       await loadPromise;
 97:       expect(service.loading()).toBe(false);
 98:     });
 99: 
100:     it('should handle error when loading fails', async () => {
101:       const error = new Error('Load failed');
102:       repository.findAll.and.returnValue(throwError(() => error));
103: 
104:       try {
105:         await service.loadAccounts();
106:         fail('should have thrown error');
107:       } catch (e) {
108:         expect(service.error()).toBe('Load failed');
109:         expect(service.loading()).toBe(false);
110:       }
111:     });
112:   });
113: 
114:   describe('loadAccountById', () => {
115:     it('should load account by id successfully', async () => {
116:       repository.findById.and.returnValue(of(mockAccount));
117: 
118:       const result = await service.loadAccountById('account-1');
119: 
120:       expect(result).toEqual(mockAccount);
121:       expect(service.selectedAccount()).toEqual(mockAccount);
122:       expect(service.loading()).toBe(false);
123:     });
124: 
125:     it('should return null when account not found', async () => {
126:       repository.findById.and.returnValue(of(null));
127: 
128:       const result = await service.loadAccountById('non-existent');
129: 
130:       expect(result).toBeNull();
131:       expect(service.selectedAccount()).toBeNull();
132:     });
133: 
134:     it('should handle error when loading by id fails', async () => {
135:       const error = new Error('Not found');
136:       repository.findById.and.returnValue(throwError(() => error));
137: 
138:       try {
139:         await service.loadAccountById('account-1');
140:         fail('should have thrown error');
141:       } catch (e) {
142:         expect(service.error()).toBe('Not found');
143:       }
144:     });
145:   });
146: 
147:   describe('loadAccountsByType', () => {
148:     it('should load accounts by type', async () => {
149:       repository.findByType.and.returnValue(of([mockAccount]));
150: 
151:       const result = await service.loadAccountsByType(AccountType.USER);
152: 
153:       expect(result.length).toBe(1);
154:       expect(repository.findByType).toHaveBeenCalledWith(AccountType.USER);
155:     });
156:   });
157: 
158:   describe('loadAccountsByStatus', () => {
159:     it('should load accounts by status', async () => {
160:       repository.findByStatus.and.returnValue(of([mockAccount]));
161: 
162:       const result = await service.loadAccountsByStatus(AccountStatus.ACTIVE);
163: 
164:       expect(result.length).toBe(1);
165:       expect(repository.findByStatus).toHaveBeenCalledWith(AccountStatus.ACTIVE);
166:     });
167:   });
168: 
169:   describe('createAccount', () => {
170:     it('should create account successfully', async () => {
171:       const newAccount = { ...mockAccount, id: 'account-new' };
172:       repository.create.and.returnValue(of(newAccount));
173: 
174:       const result = await service.createAccount({
175:         type: AccountType.USER,
176:         name: 'New User',
177:         email: 'new@example.com'
178:       });
179: 
180:       expect(result).toEqual(newAccount);
181:       expect(service.accounts().length).toBe(1);
182:       expect(service.accounts()[0].id).toBe('account-new');
183:     });
184: 
185:     it('should handle error when creating fails', async () => {
186:       const error = new Error('Create failed');
187:       repository.create.and.returnValue(throwError(() => error));
188: 
189:       try {
190:         await service.createAccount({
191:           type: AccountType.USER,
192:           name: 'New User',
193:           email: 'new@example.com'
194:         });
195:         fail('should have thrown error');
196:       } catch (e) {
197:         expect(service.error()).toBe('Create failed');
198:       }
199:     });
200:   });
201: 
202:   describe('updateAccount', () => {
203:     beforeEach(() => {
204:       service['accountsState'].set(mockAccounts);
205:     });
206: 
207:     it('should update account successfully', async () => {
208:       const updated = { ...mockAccount, name: 'Updated Name' };
209:       repository.update.and.returnValue(of(updated));
210: 
211:       const result = await service.updateAccount('account-1', { name: 'Updated Name' });
212: 
213:       expect(result).toEqual(updated);
214:       expect(service.accounts()[0].name).toBe('Updated Name');
215:     });
216: 
217:     it('should update selected account if it matches', async () => {
218:       service.selectAccount(mockAccount);
219:       const updated = { ...mockAccount, name: 'Updated Name' };
220:       repository.update.and.returnValue(of(updated));
221: 
222:       await service.updateAccount('account-1', { name: 'Updated Name' });
223: 
224:       expect(service.selectedAccount()?.name).toBe('Updated Name');
225:     });
226: 
227:     it('should handle error when updating fails', async () => {
228:       const error = new Error('Update failed');
229:       repository.update.and.returnValue(throwError(() => error));
230: 
231:       try {
232:         await service.updateAccount('account-1', { name: 'Updated' });
233:         fail('should have thrown error');
234:       } catch (e) {
235:         expect(service.error()).toBe('Update failed');
236:       }
237:     });
238:   });
239: 
240:   describe('deleteAccount', () => {
241:     beforeEach(() => {
242:       service['accountsState'].set(mockAccounts);
243:     });
244: 
245:     it('should delete account successfully', async () => {
246:       repository.delete.and.returnValue(of(undefined));
247: 
248:       await service.deleteAccount('account-1');
249: 
250:       expect(service.accounts().length).toBe(1);
251:       expect(service.accounts()[0].id).toBe('account-2');
252:     });
253: 
254:     it('should clear selected account if deleted', async () => {
255:       service.selectAccount(mockAccount);
256:       repository.delete.and.returnValue(of(undefined));
257: 
258:       await service.deleteAccount('account-1');
259: 
260:       expect(service.selectedAccount()).toBeNull();
261:     });
262: 
263:     it('should handle error when deleting fails', async () => {
264:       const error = new Error('Delete failed');
265:       repository.delete.and.returnValue(throwError(() => error));
266: 
267:       try {
268:         await service.deleteAccount('account-1');
269:         fail('should have thrown error');
270:       } catch (e) {
271:         expect(service.error()).toBe('Delete failed');
272:       }
273:     });
274:   });
275: 
276:   describe('selectAccount', () => {
277:     it('should select account', () => {
278:       service.selectAccount(mockAccount);
279: 
280:       expect(service.selectedAccount()).toEqual(mockAccount);
281:     });
282: 
283:     it('should clear selection when null', () => {
284:       service.selectAccount(mockAccount);
285:       service.selectAccount(null);
286: 
287:       expect(service.selectedAccount()).toBeNull();
288:     });
289:   });
290: 
291:   describe('findByAuthUserId', () => {
292:     it('should find account by auth user id', async () => {
293:       repository.findByAuthUserId.and.returnValue(of(mockAccount));
294: 
295:       const result = await service.findByAuthUserId('auth-user-1');
296: 
297:       expect(result).toEqual(mockAccount);
298:       expect(repository.findByAuthUserId).toHaveBeenCalledWith('auth-user-1');
299:     });
300:   });
301: 
302:   describe('findByEmail', () => {
303:     it('should find account by email', async () => {
304:       repository.findByEmail.and.returnValue(of(mockAccount));
305: 
306:       const result = await service.findByEmail('test@example.com');
307: 
308:       expect(result).toEqual(mockAccount);
309:       expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
310:     });
311:   });
312: 
313:   describe('reset', () => {
314:     it('should reset all state', () => {
315:       service['accountsState'].set(mockAccounts);
316:       service.selectAccount(mockAccount);
317:       service['errorState'].set('Some error');
318: 
319:       service.reset();
320: 
321:       expect(service.accounts().length).toBe(0);
322:       expect(service.selectedAccount()).toBeNull();
323:       expect(service.error()).toBeNull();
324:     });
325:   });
326: 
327:   describe('Computed signals', () => {
328:     beforeEach(() => {
329:       service['accountsState'].set(mockAccounts);
330:     });
331: 
332:     it('should compute activeAccounts', () => {
333:       expect(service.activeAccounts().length).toBe(1);
334:       expect(service.activeAccounts()[0].status).toBe(AccountStatus.ACTIVE);
335:     });
336: 
337:     it('should compute userAccounts', () => {
338:       expect(service.userAccounts().length).toBe(1);
339:       expect(service.userAccounts()[0].type).toBe(AccountType.USER);
340:     });
341: 
342:     it('should compute organizationAccounts', () => {
343:       expect(service.organizationAccounts().length).toBe(1);
344:       expect(service.organizationAccounts()[0].type).toBe(AccountType.ORGANIZATION);
345:     });
346:   });
347: });
````

## File: src/app/shared/services/account/account.service.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { signal, computed } from '@angular/core';
  3: import { Observable, firstValueFrom } from 'rxjs';
  4: import { AccountRepository, AccountInsert, AccountUpdate } from '@core';
  5: import { Account, AccountType, AccountStatus } from '@shared';
  6: 
  7: /**
  8:  * Account Service
  9:  * 
 10:  * 提供账户相关的业务逻辑和状态管理
 11:  * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 12:  * 
 13:  * @example
 14:  * ```typescript
 15:  * const accountService = inject(AccountService);
 16:  * 
 17:  * // 订阅账户列表
 18:  * effect(() => {
 19:  *   console.log('Accounts:', accountService.accounts());
 20:  * });
 21:  * 
 22:  * // 加载账户列表
 23:  * await accountService.loadAccounts();
 24:  * ```
 25:  */
 26: @Injectable({
 27:   providedIn: 'root'
 28: })
 29: export class AccountService {
 30:   private accountRepository = inject(AccountRepository);
 31: 
 32:   // 使用 Signals 管理状态
 33:   private accountsState = signal<Account[]>([]);
 34:   private selectedAccountState = signal<Account | null>(null);
 35:   private loadingState = signal<boolean>(false);
 36:   private errorState = signal<string | null>(null);
 37: 
 38:   // 暴露 ReadonlySignal 给组件
 39:   readonly accounts = this.accountsState.asReadonly();
 40:   readonly selectedAccount = this.selectedAccountState.asReadonly();
 41:   readonly loading = this.loadingState.asReadonly();
 42:   readonly error = this.errorState.asReadonly();
 43: 
 44:   // Computed signals
 45:   readonly activeAccounts = computed(() =>
 46:     this.accounts().filter(a => a.status === AccountStatus.ACTIVE)
 47:   );
 48: 
 49:   readonly userAccounts = computed(() =>
 50:     this.accounts().filter(a => a.type === AccountType.USER)
 51:   );
 52: 
 53:   readonly organizationAccounts = computed(() =>
 54:     this.accounts().filter(a => a.type === AccountType.ORGANIZATION)
 55:   );
 56: 
 57:   /**
 58:    * 加载所有账户
 59:    */
 60:   async loadAccounts(): Promise<void> {
 61:     this.loadingState.set(true);
 62:     this.errorState.set(null);
 63: 
 64:     try {
 65:       const accounts = await firstValueFrom(this.accountRepository.findAll());
 66:       this.accountsState.set(accounts);
 67:     } catch (error) {
 68:       this.errorState.set(error instanceof Error ? error.message : '加载账户列表失败');
 69:       throw error;
 70:     } finally {
 71:       this.loadingState.set(false);
 72:     }
 73:   }
 74: 
 75:   /**
 76:    * 根据 ID 加载账户
 77:    */
 78:   async loadAccountById(id: string): Promise<Account | null> {
 79:     this.loadingState.set(true);
 80:     this.errorState.set(null);
 81: 
 82:     try {
 83:       const account = await firstValueFrom(this.accountRepository.findById(id));
 84:       if (account) {
 85:         this.selectedAccountState.set(account);
 86:       }
 87:       return account;
 88:     } catch (error) {
 89:       this.errorState.set(error instanceof Error ? error.message : '加载账户失败');
 90:       throw error;
 91:     } finally {
 92:       this.loadingState.set(false);
 93:     }
 94:   }
 95: 
 96:   /**
 97:    * 根据类型加载账户
 98:    */
 99:   async loadAccountsByType(type: AccountType): Promise<Account[]> {
100:     this.loadingState.set(true);
101:     this.errorState.set(null);
102: 
103:     try {
104:       const accounts = await firstValueFrom(this.accountRepository.findByType(type));
105:       return accounts;
106:     } catch (error) {
107:       this.errorState.set(error instanceof Error ? error.message : '加载账户列表失败');
108:       throw error;
109:     } finally {
110:       this.loadingState.set(false);
111:     }
112:   }
113: 
114:   /**
115:    * 根据状态加载账户
116:    */
117:   async loadAccountsByStatus(status: AccountStatus): Promise<Account[]> {
118:     this.loadingState.set(true);
119:     this.errorState.set(null);
120: 
121:     try {
122:       const accounts = await firstValueFrom(this.accountRepository.findByStatus(status));
123:       return accounts;
124:     } catch (error) {
125:       this.errorState.set(error instanceof Error ? error.message : '加载账户列表失败');
126:       throw error;
127:     } finally {
128:       this.loadingState.set(false);
129:     }
130:   }
131: 
132:   /**
133:    * 创建账户
134:    */
135:   async createAccount(data: AccountInsert): Promise<Account> {
136:     this.loadingState.set(true);
137:     this.errorState.set(null);
138: 
139:     try {
140:       const account = await firstValueFrom(this.accountRepository.create(data));
141:       // 更新本地状态
142:       this.accountsState.update(accounts => [...accounts, account]);
143:       return account;
144:     } catch (error) {
145:       this.errorState.set(error instanceof Error ? error.message : '创建账户失败');
146:       throw error;
147:     } finally {
148:       this.loadingState.set(false);
149:     }
150:   }
151: 
152:   /**
153:    * 更新账户
154:    */
155:   async updateAccount(id: string, data: AccountUpdate): Promise<Account> {
156:     this.loadingState.set(true);
157:     this.errorState.set(null);
158: 
159:     try {
160:       const account = await firstValueFrom(this.accountRepository.update(id, data));
161:       // 更新本地状态
162:       this.accountsState.update(accounts =>
163:         accounts.map(a => a.id === id ? account : a)
164:       );
165:       // 如果更新的是当前选中的账户，也更新选中状态
166:       if (this.selectedAccount()?.id === id) {
167:         this.selectedAccountState.set(account);
168:       }
169:       return account;
170:     } catch (error) {
171:       this.errorState.set(error instanceof Error ? error.message : '更新账户失败');
172:       throw error;
173:     } finally {
174:       this.loadingState.set(false);
175:     }
176:   }
177: 
178:   /**
179:    * 删除账户
180:    */
181:   async deleteAccount(id: string): Promise<void> {
182:     this.loadingState.set(true);
183:     this.errorState.set(null);
184: 
185:     try {
186:       await firstValueFrom(this.accountRepository.delete(id));
187:       // 更新本地状态
188:       this.accountsState.update(accounts => accounts.filter(a => a.id !== id));
189:       // 如果删除的是当前选中的账户，清空选中状态
190:       if (this.selectedAccount()?.id === id) {
191:         this.selectedAccountState.set(null);
192:       }
193:     } catch (error) {
194:       this.errorState.set(error instanceof Error ? error.message : '删除账户失败');
195:       throw error;
196:     } finally {
197:       this.loadingState.set(false);
198:     }
199:   }
200: 
201:   /**
202:    * 选择账户
203:    */
204:   selectAccount(account: Account | null): void {
205:     this.selectedAccountState.set(account);
206:   }
207: 
208:   /**
209:    * 根据 auth_user_id 查找账户
210:    */
211:   async findByAuthUserId(authUserId: string): Promise<Account | null> {
212:     this.loadingState.set(true);
213:     this.errorState.set(null);
214: 
215:     try {
216:       const account = await firstValueFrom(this.accountRepository.findByAuthUserId(authUserId));
217:       return account;
218:     } catch (error) {
219:       this.errorState.set(error instanceof Error ? error.message : '查找账户失败');
220:       throw error;
221:     } finally {
222:       this.loadingState.set(false);
223:     }
224:   }
225: 
226:   /**
227:    * 根据邮箱查找账户
228:    */
229:   async findByEmail(email: string): Promise<Account | null> {
230:     this.loadingState.set(true);
231:     this.errorState.set(null);
232: 
233:     try {
234:       const account = await firstValueFrom(this.accountRepository.findByEmail(email));
235:       return account;
236:     } catch (error) {
237:       this.errorState.set(error instanceof Error ? error.message : '查找账户失败');
238:       throw error;
239:     } finally {
240:       this.loadingState.set(false);
241:     }
242:   }
243: 
244:   /**
245:    * 重置状态
246:    */
247:   reset(): void {
248:     this.accountsState.set([]);
249:     this.selectedAccountState.set(null);
250:     this.errorState.set(null);
251:   }
252: }
````

## File: src/app/shared/services/account/organization-schedule.service.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { signal, computed } from '@angular/core';
  3: import { Observable, firstValueFrom } from 'rxjs';
  4: import {
  5:   OrganizationScheduleRepository,
  6:   OrganizationSchedule,
  7:   OrganizationScheduleInsert,
  8:   OrganizationScheduleUpdate
  9: } from '@core';
 10: 
 11: /**
 12:  * OrganizationSchedule Service
 13:  * 
 14:  * 提供组织排班相关的业务逻辑和状态管理
 15:  * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 16:  * 
 17:  * @example
 18:  * ```typescript
 19:  * const scheduleService = inject(OrganizationScheduleService);
 20:  * 
 21:  * // 订阅排班列表
 22:  * effect(() => {
 23:  *   console.log('Schedules:', scheduleService.schedules());
 24:  * });
 25:  * 
 26:  * // 加载组织下的排班列表
 27:  * await scheduleService.loadSchedulesByOrganizationId('org-id');
 28:  * ```
 29:  */
 30: @Injectable({
 31:   providedIn: 'root'
 32: })
 33: export class OrganizationScheduleService {
 34:   private scheduleRepository = inject(OrganizationScheduleRepository);
 35: 
 36:   // 使用 Signals 管理状态
 37:   private schedulesState = signal<OrganizationSchedule[]>([]);
 38:   private selectedScheduleState = signal<OrganizationSchedule | null>(null);
 39:   private loadingState = signal<boolean>(false);
 40:   private errorState = signal<string | null>(null);
 41: 
 42:   // 暴露 ReadonlySignal 给组件
 43:   readonly schedules = this.schedulesState.asReadonly();
 44:   readonly selectedSchedule = this.selectedScheduleState.asReadonly();
 45:   readonly loading = this.loadingState.asReadonly();
 46:   readonly error = this.errorState.asReadonly();
 47: 
 48:   /**
 49:    * 加载所有排班
 50:    */
 51:   async loadSchedules(): Promise<void> {
 52:     this.loadingState.set(true);
 53:     this.errorState.set(null);
 54: 
 55:     try {
 56:       const schedules = await firstValueFrom(
 57:         this.scheduleRepository.findAll()
 58:       ) as OrganizationSchedule[];
 59:       this.schedulesState.set(schedules);
 60:     } catch (error) {
 61:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
 62:       throw error;
 63:     } finally {
 64:       this.loadingState.set(false);
 65:     }
 66:   }
 67: 
 68:   /**
 69:    * 根据组织 ID 加载排班列表
 70:    */
 71:   async loadSchedulesByOrganizationId(organizationId: string): Promise<OrganizationSchedule[]> {
 72:     this.loadingState.set(true);
 73:     this.errorState.set(null);
 74: 
 75:     try {
 76:       const schedules = await firstValueFrom(
 77:         this.scheduleRepository.findByOrganizationId(organizationId)
 78:       ) as OrganizationSchedule[];
 79:       this.schedulesState.set(schedules);
 80:       return schedules;
 81:     } catch (error) {
 82:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
 83:       throw error;
 84:     } finally {
 85:       this.loadingState.set(false);
 86:     }
 87:   }
 88: 
 89:   /**
 90:    * 根据蓝图 ID 加载排班列表
 91:    */
 92:   async loadSchedulesByBlueprintId(blueprintId: string): Promise<OrganizationSchedule[]> {
 93:     this.loadingState.set(true);
 94:     this.errorState.set(null);
 95: 
 96:     try {
 97:       const schedules = await firstValueFrom(
 98:         this.scheduleRepository.findByBlueprintId(blueprintId)
 99:       ) as OrganizationSchedule[];
100:       return schedules;
101:     } catch (error) {
102:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
103:       throw error;
104:     } finally {
105:       this.loadingState.set(false);
106:     }
107:   }
108: 
109:   /**
110:    * 根据分支 ID 加载排班列表
111:    */
112:   async loadSchedulesByBranchId(branchId: string): Promise<OrganizationSchedule[]> {
113:     this.loadingState.set(true);
114:     this.errorState.set(null);
115: 
116:     try {
117:       const schedules = await firstValueFrom(
118:         this.scheduleRepository.findByBranchId(branchId)
119:       ) as OrganizationSchedule[];
120:       return schedules;
121:     } catch (error) {
122:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
123:       throw error;
124:     } finally {
125:       this.loadingState.set(false);
126:     }
127:   }
128: 
129:   /**
130:    * 根据账户 ID 加载排班列表
131:    */
132:   async loadSchedulesByAccountId(accountId: string): Promise<OrganizationSchedule[]> {
133:     this.loadingState.set(true);
134:     this.errorState.set(null);
135: 
136:     try {
137:       const schedules = await firstValueFrom(
138:         this.scheduleRepository.findByAccountId(accountId)
139:       ) as OrganizationSchedule[];
140:       return schedules;
141:     } catch (error) {
142:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
143:       throw error;
144:     } finally {
145:       this.loadingState.set(false);
146:     }
147:   }
148: 
149:   /**
150:    * 根据团队 ID 加载排班列表
151:    */
152:   async loadSchedulesByTeamId(teamId: string): Promise<OrganizationSchedule[]> {
153:     this.loadingState.set(true);
154:     this.errorState.set(null);
155: 
156:     try {
157:       const schedules = await firstValueFrom(
158:         this.scheduleRepository.findByTeamId(teamId)
159:       ) as OrganizationSchedule[];
160:       return schedules;
161:     } catch (error) {
162:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
163:       throw error;
164:     } finally {
165:       this.loadingState.set(false);
166:     }
167:   }
168: 
169:   /**
170:    * 根据日期范围加载排班列表
171:    */
172:   async loadSchedulesByDateRange(startDate: string, endDate: string): Promise<OrganizationSchedule[]> {
173:     this.loadingState.set(true);
174:     this.errorState.set(null);
175: 
176:     try {
177:       const schedules = await firstValueFrom(
178:         this.scheduleRepository.findByDateRange(startDate, endDate)
179:       ) as OrganizationSchedule[];
180:       return schedules;
181:     } catch (error) {
182:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
183:       throw error;
184:     } finally {
185:       this.loadingState.set(false);
186:     }
187:   }
188: 
189:   /**
190:    * 根据 ID 加载排班
191:    */
192:   async loadScheduleById(id: string): Promise<OrganizationSchedule | null> {
193:     this.loadingState.set(true);
194:     this.errorState.set(null);
195: 
196:     try {
197:       const schedule = await firstValueFrom(
198:         this.scheduleRepository.findById(id)
199:       ) as OrganizationSchedule | null;
200:       if (schedule) {
201:         this.selectedScheduleState.set(schedule);
202:       }
203:       return schedule;
204:     } catch (error) {
205:       this.errorState.set(error instanceof Error ? error.message : '加载排班失败');
206:       throw error;
207:     } finally {
208:       this.loadingState.set(false);
209:     }
210:   }
211: 
212:   /**
213:    * 创建排班
214:    */
215:   async createSchedule(data: OrganizationScheduleInsert): Promise<OrganizationSchedule> {
216:     this.loadingState.set(true);
217:     this.errorState.set(null);
218: 
219:     try {
220:       const schedule = await firstValueFrom(
221:         this.scheduleRepository.create(data)
222:       ) as OrganizationSchedule;
223:       // 更新本地状态
224:       this.schedulesState.update(schedules => [...schedules, schedule]);
225:       return schedule;
226:     } catch (error) {
227:       this.errorState.set(error instanceof Error ? error.message : '创建排班失败');
228:       throw error;
229:     } finally {
230:       this.loadingState.set(false);
231:     }
232:   }
233: 
234:   /**
235:    * 更新排班
236:    */
237:   async updateSchedule(id: string, data: OrganizationScheduleUpdate): Promise<OrganizationSchedule> {
238:     this.loadingState.set(true);
239:     this.errorState.set(null);
240: 
241:     try {
242:       const schedule = await firstValueFrom(
243:         this.scheduleRepository.update(id, data)
244:       ) as OrganizationSchedule;
245:       // 更新本地状态
246:       this.schedulesState.update(schedules =>
247:         schedules.map(s => s.id === id ? schedule : s)
248:       );
249:       // 如果更新的是当前选中的排班，也更新选中状态
250:       if (this.selectedSchedule()?.id === id) {
251:         this.selectedScheduleState.set(schedule);
252:       }
253:       return schedule;
254:     } catch (error) {
255:       this.errorState.set(error instanceof Error ? error.message : '更新排班失败');
256:       throw error;
257:     } finally {
258:       this.loadingState.set(false);
259:     }
260:   }
261: 
262:   /**
263:    * 删除排班
264:    */
265:   async deleteSchedule(id: string): Promise<void> {
266:     this.loadingState.set(true);
267:     this.errorState.set(null);
268: 
269:     try {
270:       await firstValueFrom(this.scheduleRepository.delete(id));
271:       // 更新本地状态
272:       this.schedulesState.update(schedules => schedules.filter(s => s.id !== id));
273:       // 如果删除的是当前选中的排班，清空选中状态
274:       if (this.selectedSchedule()?.id === id) {
275:         this.selectedScheduleState.set(null);
276:       }
277:     } catch (error) {
278:       this.errorState.set(error instanceof Error ? error.message : '删除排班失败');
279:       throw error;
280:     } finally {
281:       this.loadingState.set(false);
282:     }
283:   }
284: 
285:   /**
286:    * 选择排班
287:    */
288:   selectSchedule(schedule: OrganizationSchedule | null): void {
289:     this.selectedScheduleState.set(schedule);
290:   }
291: 
292:   /**
293:    * 重置状态
294:    */
295:   reset(): void {
296:     this.schedulesState.set([]);
297:     this.selectedScheduleState.set(null);
298:     this.errorState.set(null);
299:   }
300: }
````

## File: src/app/shared/services/account/team.service.spec.ts
````typescript
  1: import { TestBed } from '@angular/core/testing';
  2: import { of, throwError } from 'rxjs';
  3: import { TeamRepository, TeamMemberRepository, TeamMemberRole } from '@core';
  4: import { TeamService } from './team.service';
  5: import { Team, TeamMember } from '@shared';
  6: 
  7: describe('TeamService', () => {
  8:   let service: TeamService;
  9:   let teamRepository: jasmine.SpyObj<TeamRepository>;
 10:   let teamMemberRepository: jasmine.SpyObj<TeamMemberRepository>;
 11: 
 12:   const mockTeam: Team = {
 13:     id: 'team-1',
 14:     organization_id: 'org-1',
 15:     name: 'Test Team',
 16:     description: 'Test team description',
 17:     avatar_url: null,
 18:     created_by: 'account-1',
 19:     created_at: '2025-01-01T00:00:00Z',
 20:     updated_at: '2025-01-01T00:00:00Z'
 21:   } as Team;
 22: 
 23:   const mockTeams: Team[] = [
 24:     mockTeam,
 25:     {
 26:       ...mockTeam,
 27:       id: 'team-2',
 28:       name: 'Test Team 2'
 29:     }
 30:   ];
 31: 
 32:   const mockTeamMember: TeamMember = {
 33:     id: 'member-1',
 34:     team_id: 'team-1',
 35:     account_id: 'account-1',
 36:     role: TeamMemberRole.MEMBER,
 37:     joined_at: '2025-01-01T00:00:00Z'
 38:   } as TeamMember;
 39: 
 40:   const mockTeamMembers: TeamMember[] = [
 41:     mockTeamMember,
 42:     {
 43:       ...mockTeamMember,
 44:       id: 'member-2',
 45:       account_id: 'account-2',
 46:       role: TeamMemberRole.LEADER
 47:     }
 48:   ];
 49: 
 50:   beforeEach(() => {
 51:     const teamRepositorySpy = jasmine.createSpyObj('TeamRepository', [
 52:       'findAll',
 53:       'findById',
 54:       'findByOrganizationId',
 55:       'create',
 56:       'update',
 57:       'delete'
 58:     ]);
 59: 
 60:     const teamMemberRepositorySpy = jasmine.createSpyObj('TeamMemberRepository', [
 61:       'findByTeamId',
 62:       'create',
 63:       'update',
 64:       'delete'
 65:     ]);
 66: 
 67:     TestBed.configureTestingModule({
 68:       providers: [
 69:         TeamService,
 70:         { provide: TeamRepository, useValue: teamRepositorySpy },
 71:         { provide: TeamMemberRepository, useValue: teamMemberRepositorySpy }
 72:       ]
 73:     });
 74: 
 75:     service = TestBed.inject(TeamService);
 76:     teamRepository = TestBed.inject(TeamRepository) as jasmine.SpyObj<TeamRepository>;
 77:     teamMemberRepository = TestBed.inject(
 78:       TeamMemberRepository
 79:     ) as jasmine.SpyObj<TeamMemberRepository>;
 80:   });
 81: 
 82:   it('should be created', () => {
 83:     expect(service).toBeTruthy();
 84:   });
 85: 
 86:   describe('Initial state', () => {
 87:     it('should have empty teams', () => {
 88:       expect(service.teams().length).toBe(0);
 89:     });
 90: 
 91:     it('should have null selected team', () => {
 92:       expect(service.selectedTeam()).toBeNull();
 93:     });
 94: 
 95:     it('should have empty team members', () => {
 96:       expect(service.teamMembers().length).toBe(0);
 97:     });
 98: 
 99:     it('should have false loading state', () => {
100:       expect(service.loading()).toBe(false);
101:     });
102: 
103:     it('should have null error state', () => {
104:       expect(service.error()).toBeNull();
105:     });
106:   });
107: 
108:   describe('loadTeams', () => {
109:     it('should load teams successfully', async () => {
110:       teamRepository.findAll.and.returnValue(of(mockTeams));
111: 
112:       await service.loadTeams();
113: 
114:       expect(service.teams().length).toBe(2);
115:       expect(service.teams()[0].id).toBe('team-1');
116:       expect(service.loading()).toBe(false);
117:     });
118: 
119:     it('should handle error when loading fails', async () => {
120:       const error = new Error('Load failed');
121:       teamRepository.findAll.and.returnValue(throwError(() => error));
122: 
123:       try {
124:         await service.loadTeams();
125:         fail('should have thrown error');
126:       } catch (e) {
127:         expect(service.error()).toBe('Load failed');
128:       }
129:     });
130:   });
131: 
132:   describe('loadTeamsByOrganizationId', () => {
133:     it('should load teams by organization id', async () => {
134:       teamRepository.findByOrganizationId.and.returnValue(of(mockTeams));
135: 
136:       const result = await service.loadTeamsByOrganizationId('org-1');
137: 
138:       expect(result.length).toBe(2);
139:       expect(teamRepository.findByOrganizationId).toHaveBeenCalledWith('org-1');
140:     });
141:   });
142: 
143:   describe('loadTeamById', () => {
144:     it('should load team by id and members', async () => {
145:       teamRepository.findById.and.returnValue(of(mockTeam));
146:       teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));
147: 
148:       const result = await service.loadTeamById('team-1');
149: 
150:       expect(result).toEqual(mockTeam);
151:       expect(service.selectedTeam()).toEqual(mockTeam);
152:       expect(service.teamMembers().length).toBe(2);
153:     });
154:   });
155: 
156:   describe('createTeam', () => {
157:     it('should create team successfully', async () => {
158:       const newTeam = { ...mockTeam, id: 'team-new' };
159:       teamRepository.create.and.returnValue(of(newTeam));
160: 
161:       const result = await service.createTeam({
162:         organization_id: 'org-1',
163:         name: 'New Team',
164:         created_by: 'account-1'
165:       });
166: 
167:       expect(result).toEqual(newTeam);
168:       expect(service.teams().length).toBe(1);
169:     });
170:   });
171: 
172:   describe('updateTeam', () => {
173:     beforeEach(() => {
174:       service['teamsState'].set(mockTeams);
175:     });
176: 
177:     it('should update team successfully', async () => {
178:       const updated = { ...mockTeam, name: 'Updated Name' };
179:       teamRepository.update.and.returnValue(of(updated));
180: 
181:       const result = await service.updateTeam('team-1', { name: 'Updated Name' });
182: 
183:       expect(result).toEqual(updated);
184:       expect(service.teams()[0].name).toBe('Updated Name');
185:     });
186:   });
187: 
188:   describe('deleteTeam', () => {
189:     beforeEach(() => {
190:       service['teamsState'].set(mockTeams);
191:     });
192: 
193:     it('should delete team successfully', async () => {
194:       teamRepository.delete.and.returnValue(of(undefined));
195: 
196:       await service.deleteTeam('team-1');
197: 
198:       expect(service.teams().length).toBe(1);
199:       expect(service.teams()[0].id).toBe('team-2');
200:     });
201: 
202:     it('should clear selected team and members if deleted', async () => {
203:       teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));
204:       service.selectTeam(mockTeam);
205:       await new Promise(resolve => setTimeout(resolve, 0)); // Wait for async loadTeamMembers
206:       service['teamMembersState'].set(mockTeamMembers);
207:       teamRepository.delete.and.returnValue(of(undefined));
208: 
209:       await service.deleteTeam('team-1');
210: 
211:       expect(service.selectedTeam()).toBeNull();
212:       expect(service.teamMembers().length).toBe(0);
213:     });
214:   });
215: 
216:   describe('selectTeam', () => {
217:     it('should select team and load members', async () => {
218:       teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));
219: 
220:       service.selectTeam(mockTeam);
221:       await new Promise(resolve => setTimeout(resolve, 0)); // Wait for async loadTeamMembers
222: 
223:       expect(service.selectedTeam()).toEqual(mockTeam);
224:       expect(teamMemberRepository.findByTeamId).toHaveBeenCalledWith('team-1');
225:     });
226: 
227:     it('should clear selection when null', () => {
228:       teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));
229:       service.selectTeam(mockTeam);
230:       service.selectTeam(null);
231: 
232:       expect(service.selectedTeam()).toBeNull();
233:       expect(service.teamMembers().length).toBe(0);
234:     });
235:   });
236: 
237:   describe('loadTeamMembers', () => {
238:     it('should load team members successfully', async () => {
239:       teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));
240: 
241:       const result = await service.loadTeamMembers('team-1');
242: 
243:       expect(result.length).toBe(2);
244:       expect(service.teamMembers().length).toBe(2);
245:     });
246:   });
247: 
248:   describe('addTeamMember', () => {
249:     it('should add team member successfully', async () => {
250:       const newMember = { ...mockTeamMember, id: 'member-new' };
251:       teamMemberRepository.create.and.returnValue(of(newMember));
252: 
253:       const result = await service.addTeamMember('team-1', 'account-3', TeamMemberRole.MEMBER);
254: 
255:       expect(result).toEqual(newMember);
256:       expect(service.teamMembers().length).toBe(1);
257:     });
258:   });
259: 
260:   describe('removeTeamMember', () => {
261:     beforeEach(() => {
262:       service['teamMembersState'].set(mockTeamMembers);
263:     });
264: 
265:     it('should remove team member successfully', async () => {
266:       teamMemberRepository.delete.and.returnValue(of(undefined));
267: 
268:       await service.removeTeamMember('member-1');
269: 
270:       expect(service.teamMembers().length).toBe(1);
271:       expect(service.teamMembers()[0].id).toBe('member-2');
272:     });
273:   });
274: 
275:   describe('updateTeamMemberRole', () => {
276:     beforeEach(() => {
277:       service['teamMembersState'].set(mockTeamMembers);
278:     });
279: 
280:     it('should update team member role successfully', async () => {
281:       const updated = { ...mockTeamMember, role: TeamMemberRole.LEADER };
282:       teamMemberRepository.update.and.returnValue(of(updated));
283: 
284:       const result = await service.updateTeamMemberRole('member-1', TeamMemberRole.LEADER);
285: 
286:       expect(result.role).toBe(TeamMemberRole.LEADER);
287:       expect(service.teamMembers()[0].role).toBe(TeamMemberRole.LEADER);
288:     });
289:   });
290: 
291:   describe('reset', () => {
292:     it('should reset all state', () => {
293:       service['teamsState'].set(mockTeams);
294:       service.selectTeam(mockTeam);
295:       service['teamMembersState'].set(mockTeamMembers);
296:       service['errorState'].set('Some error');
297: 
298:       service.reset();
299: 
300:       expect(service.teams().length).toBe(0);
301:       expect(service.selectedTeam()).toBeNull();
302:       expect(service.teamMembers().length).toBe(0);
303:       expect(service.error()).toBeNull();
304:     });
305:   });
306: });
````

## File: src/app/shared/services/account/team.service.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { signal, computed } from '@angular/core';
  3: import { Observable, firstValueFrom } from 'rxjs';
  4: import { TeamRepository, Team, TeamInsert, TeamUpdate, TeamMemberRepository, TeamMember, TeamMemberInsert, TeamMemberUpdate, TeamMemberRole } from '@core';
  5: 
  6: /**
  7:  * Team Service
  8:  * 
  9:  * 提供团队相关的业务逻辑和状态管理
 10:  * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 11:  * 
 12:  * @example
 13:  * ```typescript
 14:  * const teamService = inject(TeamService);
 15:  * 
 16:  * // 订阅团队列表
 17:  * effect(() => {
 18:  *   console.log('Teams:', teamService.teams());
 19:  * });
 20:  * 
 21:  * // 加载组织下的团队列表
 22:  * await teamService.loadTeamsByOrganizationId('org-id');
 23:  * ```
 24:  */
 25: @Injectable({
 26:   providedIn: 'root'
 27: })
 28: export class TeamService {
 29:   private teamRepository = inject(TeamRepository);
 30:   private teamMemberRepository = inject(TeamMemberRepository);
 31: 
 32:   // 使用 Signals 管理状态
 33:   private teamsState = signal<Team[]>([]);
 34:   private selectedTeamState = signal<Team | null>(null);
 35:   private teamMembersState = signal<TeamMember[]>([]);
 36:   private loadingState = signal<boolean>(false);
 37:   private errorState = signal<string | null>(null);
 38: 
 39:   // 暴露 ReadonlySignal 给组件
 40:   readonly teams = this.teamsState.asReadonly();
 41:   readonly selectedTeam = this.selectedTeamState.asReadonly();
 42:   readonly teamMembers = this.teamMembersState.asReadonly();
 43:   readonly loading = this.loadingState.asReadonly();
 44:   readonly error = this.errorState.asReadonly();
 45: 
 46:   /**
 47:    * 加载所有团队
 48:    */
 49:   async loadTeams(): Promise<void> {
 50:     this.loadingState.set(true);
 51:     this.errorState.set(null);
 52: 
 53:     try {
 54:       const teams = await firstValueFrom(this.teamRepository.findAll()) as Team[];
 55:       this.teamsState.set(teams);
 56:     } catch (error) {
 57:       this.errorState.set(error instanceof Error ? error.message : '加载团队列表失败');
 58:       throw error;
 59:     } finally {
 60:       this.loadingState.set(false);
 61:     }
 62:   }
 63: 
 64:   /**
 65:    * 根据组织 ID 加载团队列表
 66:    */
 67:   async loadTeamsByOrganizationId(organizationId: string): Promise<Team[]> {
 68:     this.loadingState.set(true);
 69:     this.errorState.set(null);
 70: 
 71:     try {
 72:       const teams = await firstValueFrom(
 73:         this.teamRepository.findByOrganizationId(organizationId)
 74:       ) as Team[];
 75:       this.teamsState.set(teams);
 76:       return teams;
 77:     } catch (error) {
 78:       this.errorState.set(error instanceof Error ? error.message : '加载团队列表失败');
 79:       throw error;
 80:     } finally {
 81:       this.loadingState.set(false);
 82:     }
 83:   }
 84: 
 85:   /**
 86:    * 根据 ID 加载团队
 87:    */
 88:   async loadTeamById(id: string): Promise<Team | null> {
 89:     this.loadingState.set(true);
 90:     this.errorState.set(null);
 91: 
 92:     try {
 93:       const team = await firstValueFrom(this.teamRepository.findById(id)) as Team | null;
 94:       if (team) {
 95:         this.selectedTeamState.set(team);
 96:         // 同时加载团队成员
 97:         await this.loadTeamMembers(id);
 98:       }
 99:       return team;
100:     } catch (error) {
101:       this.errorState.set(error instanceof Error ? error.message : '加载团队失败');
102:       throw error;
103:     } finally {
104:       this.loadingState.set(false);
105:     }
106:   }
107: 
108:   /**
109:    * 创建团队
110:    */
111:   async createTeam(data: TeamInsert): Promise<Team> {
112:     this.loadingState.set(true);
113:     this.errorState.set(null);
114: 
115:     try {
116:       const team = await firstValueFrom(this.teamRepository.create(data)) as Team;
117:       // 更新本地状态
118:       this.teamsState.update(teams => [...teams, team]);
119:       return team;
120:     } catch (error) {
121:       this.errorState.set(error instanceof Error ? error.message : '创建团队失败');
122:       throw error;
123:     } finally {
124:       this.loadingState.set(false);
125:     }
126:   }
127: 
128:   /**
129:    * 更新团队
130:    */
131:   async updateTeam(id: string, data: TeamUpdate): Promise<Team> {
132:     this.loadingState.set(true);
133:     this.errorState.set(null);
134: 
135:     try {
136:       const team = await firstValueFrom(this.teamRepository.update(id, data)) as Team;
137:       // 更新本地状态
138:       this.teamsState.update(teams =>
139:         teams.map(t => t.id === id ? team : t)
140:       );
141:       // 如果更新的是当前选中的团队，也更新选中状态
142:       if (this.selectedTeam()?.id === id) {
143:         this.selectedTeamState.set(team);
144:       }
145:       return team;
146:     } catch (error) {
147:       this.errorState.set(error instanceof Error ? error.message : '更新团队失败');
148:       throw error;
149:     } finally {
150:       this.loadingState.set(false);
151:     }
152:   }
153: 
154:   /**
155:    * 删除团队
156:    */
157:   async deleteTeam(id: string): Promise<void> {
158:     this.loadingState.set(true);
159:     this.errorState.set(null);
160: 
161:     try {
162:       await firstValueFrom(this.teamRepository.delete(id));
163:       // 更新本地状态
164:       this.teamsState.update(teams => teams.filter(t => t.id !== id));
165:       // 如果删除的是当前选中的团队，清空选中状态
166:       if (this.selectedTeam()?.id === id) {
167:         this.selectedTeamState.set(null);
168:         this.teamMembersState.set([]);
169:       }
170:     } catch (error) {
171:       this.errorState.set(error instanceof Error ? error.message : '删除团队失败');
172:       throw error;
173:     } finally {
174:       this.loadingState.set(false);
175:     }
176:   }
177: 
178:   /**
179:    * 选择团队
180:    */
181:   selectTeam(team: Team | null): void {
182:     this.selectedTeamState.set(team);
183:     if (team) {
184:       this.loadTeamMembers(team.id);
185:     } else {
186:       this.teamMembersState.set([]);
187:     }
188:   }
189: 
190:   /**
191:    * 加载团队成员列表
192:    */
193:   async loadTeamMembers(teamId: string): Promise<TeamMember[]> {
194:     this.loadingState.set(true);
195:     this.errorState.set(null);
196: 
197:     try {
198:       const members = await firstValueFrom(
199:         this.teamMemberRepository.findByTeamId(teamId)
200:       ) as TeamMember[];
201:       this.teamMembersState.set(members);
202:       return members;
203:     } catch (error) {
204:       this.errorState.set(error instanceof Error ? error.message : '加载团队成员失败');
205:       throw error;
206:     } finally {
207:       this.loadingState.set(false);
208:     }
209:   }
210: 
211:   /**
212:    * 添加团队成员
213:    */
214:   async addTeamMember(teamId: string, accountId: string, role: TeamMemberRole = TeamMemberRole.MEMBER): Promise<TeamMember> {
215:     this.loadingState.set(true);
216:     this.errorState.set(null);
217: 
218:     try {
219:       // BaseRepository 会自动将 camelCase 转换为 snake_case
220:       const memberData = {
221:         teamId, // 会自动转换为 team_id
222:         accountId, // 会自动转换为 account_id
223:         role,
224:       } as any as TeamMemberInsert;
225:       const member = await firstValueFrom(
226:         this.teamMemberRepository.create(memberData)
227:       ) as TeamMember;
228:       // 更新本地状态
229:       this.teamMembersState.update(members => [...members, member]);
230:       return member;
231:     } catch (error) {
232:       this.errorState.set(error instanceof Error ? error.message : '添加团队成员失败');
233:       throw error;
234:     } finally {
235:       this.loadingState.set(false);
236:     }
237:   }
238: 
239:   /**
240:    * 移除团队成员
241:    */
242:   async removeTeamMember(memberId: string): Promise<void> {
243:     this.loadingState.set(true);
244:     this.errorState.set(null);
245: 
246:     try {
247:       await firstValueFrom(this.teamMemberRepository.delete(memberId));
248:       // 更新本地状态
249:       this.teamMembersState.update(members => members.filter(m => m.id !== memberId));
250:     } catch (error) {
251:       this.errorState.set(error instanceof Error ? error.message : '移除团队成员失败');
252:       throw error;
253:     } finally {
254:       this.loadingState.set(false);
255:     }
256:   }
257: 
258:   /**
259:    * 更新团队成员角色
260:    */
261:   async updateTeamMemberRole(memberId: string, role: TeamMemberRole): Promise<TeamMember> {
262:     this.loadingState.set(true);
263:     this.errorState.set(null);
264: 
265:     try {
266:       const updateData: TeamMemberUpdate = { role };
267:       const member = await firstValueFrom(
268:         this.teamMemberRepository.update(memberId, updateData)
269:       ) as TeamMember;
270:       // 更新本地状态
271:       this.teamMembersState.update(members =>
272:         members.map(m => m.id === memberId ? member : m)
273:       );
274:       return member;
275:     } catch (error) {
276:       this.errorState.set(error instanceof Error ? error.message : '更新团队成员角色失败');
277:       throw error;
278:     } finally {
279:       this.loadingState.set(false);
280:     }
281:   }
282: 
283:   /**
284:    * 重置状态
285:    */
286:   reset(): void {
287:     this.teamsState.set([]);
288:     this.selectedTeamState.set(null);
289:     this.teamMembersState.set([]);
290:     this.errorState.set(null);
291:   }
292: }
````

## File: src/app/shared/services/blueprint/blueprint.service.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { signal, computed } from '@angular/core';
  3: import { Observable, firstValueFrom } from 'rxjs';
  4: import {
  5:   BlueprintRepository,
  6:   BlueprintConfigRepository,
  7:   BlueprintInsert,
  8:   BlueprintUpdate,
  9:   BlueprintConfigInsert,
 10:   BlueprintConfigUpdate
 11: } from '@core';
 12: import { Blueprint, BlueprintConfig, BlueprintStatus } from '@shared';
 13: 
 14: /**
 15:  * Blueprint Service
 16:  * 
 17:  * 提供蓝图相关的业务逻辑和状态管理
 18:  * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 19:  * 
 20:  * @example
 21:  * ```typescript
 22:  * const blueprintService = inject(BlueprintService);
 23:  * 
 24:  * // 订阅蓝图列表
 25:  * effect(() => {
 26:  *   console.log('Blueprints:', blueprintService.blueprints());
 27:  * });
 28:  * 
 29:  * // 加载蓝图列表
 30:  * await blueprintService.loadBlueprints();
 31:  * ```
 32:  */
 33: @Injectable({
 34:   providedIn: 'root'
 35: })
 36: export class BlueprintService {
 37:   private blueprintRepository = inject(BlueprintRepository);
 38:   private blueprintConfigRepository = inject(BlueprintConfigRepository);
 39: 
 40:   // 使用 Signals 管理状态
 41:   private blueprintsState = signal<Blueprint[]>([]);
 42:   private selectedBlueprintState = signal<Blueprint | null>(null);
 43:   private configsState = signal<BlueprintConfig[]>([]);
 44:   private loadingState = signal<boolean>(false);
 45:   private errorState = signal<string | null>(null);
 46: 
 47:   // 暴露 ReadonlySignal 给组件
 48:   readonly blueprints = this.blueprintsState.asReadonly();
 49:   readonly selectedBlueprint = this.selectedBlueprintState.asReadonly();
 50:   readonly configs = this.configsState.asReadonly();
 51:   readonly loading = this.loadingState.asReadonly();
 52:   readonly error = this.errorState.asReadonly();
 53: 
 54:   // Computed signals
 55:   readonly activeBlueprints = computed(() =>
 56:     this.blueprints().filter(b => b.status === BlueprintStatus.ACTIVE)
 57:   );
 58: 
 59:   readonly planningBlueprints = computed(() =>
 60:     this.blueprints().filter(b => b.status === BlueprintStatus.PLANNING)
 61:   );
 62: 
 63:   readonly completedBlueprints = computed(() =>
 64:     this.blueprints().filter(b => b.status === BlueprintStatus.COMPLETED)
 65:   );
 66: 
 67:   /**
 68:    * 加载所有蓝图
 69:    */
 70:   async loadBlueprints(): Promise<void> {
 71:     this.loadingState.set(true);
 72:     this.errorState.set(null);
 73: 
 74:     try {
 75:       const blueprints = await firstValueFrom(this.blueprintRepository.findAll());
 76:       this.blueprintsState.set(blueprints);
 77:     } catch (error) {
 78:       this.errorState.set(error instanceof Error ? error.message : '加载蓝图列表失败');
 79:       throw error;
 80:     } finally {
 81:       this.loadingState.set(false);
 82:     }
 83:   }
 84: 
 85:   /**
 86:    * 根据 ID 加载蓝图
 87:    */
 88:   async loadBlueprintById(id: string): Promise<Blueprint | null> {
 89:     this.loadingState.set(true);
 90:     this.errorState.set(null);
 91: 
 92:     try {
 93:       const blueprint = await firstValueFrom(this.blueprintRepository.findById(id));
 94:       if (blueprint) {
 95:         this.selectedBlueprintState.set(blueprint);
 96:         // 同时加载配置
 97:         await this.loadConfigs(id);
 98:       }
 99:       return blueprint;
100:     } catch (error) {
101:       this.errorState.set(error instanceof Error ? error.message : '加载蓝图失败');
102:       throw error;
103:     } finally {
104:       this.loadingState.set(false);
105:     }
106:   }
107: 
108:   /**
109:    * 根据拥有者 ID 加载蓝图列表
110:    */
111:   async loadBlueprintsByOwnerId(ownerId: string): Promise<Blueprint[]> {
112:     this.loadingState.set(true);
113:     this.errorState.set(null);
114: 
115:     try {
116:       const blueprints = await firstValueFrom(this.blueprintRepository.findByOwnerId(ownerId));
117:       this.blueprintsState.set(blueprints);
118:       return blueprints;
119:     } catch (error) {
120:       this.errorState.set(error instanceof Error ? error.message : '加载蓝图列表失败');
121:       throw error;
122:     } finally {
123:       this.loadingState.set(false);
124:     }
125:   }
126: 
127:   /**
128:    * 根据状态加载蓝图列表
129:    */
130:   async loadBlueprintsByStatus(status: BlueprintStatus): Promise<Blueprint[]> {
131:     this.loadingState.set(true);
132:     this.errorState.set(null);
133: 
134:     try {
135:       const blueprints = await firstValueFrom(this.blueprintRepository.findByStatus(status));
136:       return blueprints;
137:     } catch (error) {
138:       this.errorState.set(error instanceof Error ? error.message : '加载蓝图列表失败');
139:       throw error;
140:     } finally {
141:       this.loadingState.set(false);
142:     }
143:   }
144: 
145:   /**
146:    * 根据项目代码加载蓝图
147:    */
148:   async loadBlueprintByProjectCode(projectCode: string): Promise<Blueprint | null> {
149:     this.loadingState.set(true);
150:     this.errorState.set(null);
151: 
152:     try {
153:       const blueprint = await firstValueFrom(
154:         this.blueprintRepository.findByProjectCode(projectCode)
155:       );
156:       if (blueprint) {
157:         this.selectedBlueprintState.set(blueprint);
158:       }
159:       return blueprint;
160:     } catch (error) {
161:       this.errorState.set(error instanceof Error ? error.message : '加载蓝图失败');
162:       throw error;
163:     } finally {
164:       this.loadingState.set(false);
165:     }
166:   }
167: 
168:   /**
169:    * 创建蓝图
170:    */
171:   async createBlueprint(data: BlueprintInsert): Promise<Blueprint> {
172:     this.loadingState.set(true);
173:     this.errorState.set(null);
174: 
175:     try {
176:       const blueprint = await firstValueFrom(this.blueprintRepository.create(data));
177:       // 更新本地状态
178:       this.blueprintsState.update(blueprints => [...blueprints, blueprint]);
179:       return blueprint;
180:     } catch (error) {
181:       this.errorState.set(error instanceof Error ? error.message : '创建蓝图失败');
182:       throw error;
183:     } finally {
184:       this.loadingState.set(false);
185:     }
186:   }
187: 
188:   /**
189:    * 更新蓝图
190:    */
191:   async updateBlueprint(id: string, data: BlueprintUpdate): Promise<Blueprint> {
192:     this.loadingState.set(true);
193:     this.errorState.set(null);
194: 
195:     try {
196:       const blueprint = await firstValueFrom(this.blueprintRepository.update(id, data));
197:       // 更新本地状态
198:       this.blueprintsState.update(blueprints =>
199:         blueprints.map(b => (b.id === id ? blueprint : b))
200:       );
201:       // 如果更新的是当前选中的蓝图，也更新选中状态
202:       if (this.selectedBlueprint()?.id === id) {
203:         this.selectedBlueprintState.set(blueprint);
204:       }
205:       return blueprint;
206:     } catch (error) {
207:       this.errorState.set(error instanceof Error ? error.message : '更新蓝图失败');
208:       throw error;
209:     } finally {
210:       this.loadingState.set(false);
211:     }
212:   }
213: 
214:   /**
215:    * 删除蓝图
216:    */
217:   async deleteBlueprint(id: string): Promise<void> {
218:     this.loadingState.set(true);
219:     this.errorState.set(null);
220: 
221:     try {
222:       await firstValueFrom(this.blueprintRepository.delete(id));
223:       // 更新本地状态
224:       this.blueprintsState.update(blueprints => blueprints.filter(b => b.id !== id));
225:       // 如果删除的是当前选中的蓝图，清空选中状态
226:       if (this.selectedBlueprint()?.id === id) {
227:         this.selectedBlueprintState.set(null);
228:         this.configsState.set([]);
229:       }
230:     } catch (error) {
231:       this.errorState.set(error instanceof Error ? error.message : '删除蓝图失败');
232:       throw error;
233:     } finally {
234:       this.loadingState.set(false);
235:     }
236:   }
237: 
238:   /**
239:    * 选择蓝图
240:    */
241:   selectBlueprint(blueprint: Blueprint | null): void {
242:     this.selectedBlueprintState.set(blueprint);
243:     if (blueprint) {
244:       this.loadConfigs(blueprint.id);
245:     } else {
246:       this.configsState.set([]);
247:     }
248:   }
249: 
250:   /**
251:    * 加载蓝图配置
252:    */
253:   async loadConfigs(blueprintId: string): Promise<BlueprintConfig[]> {
254:     this.loadingState.set(true);
255:     this.errorState.set(null);
256: 
257:     try {
258:       const configs = await firstValueFrom(
259:         this.blueprintConfigRepository.findByBlueprintId(blueprintId)
260:       );
261:       this.configsState.set(configs);
262:       return configs;
263:     } catch (error) {
264:       this.errorState.set(error instanceof Error ? error.message : '加载配置失败');
265:       throw error;
266:     } finally {
267:       this.loadingState.set(false);
268:     }
269:   }
270: 
271:   /**
272:    * 获取配置值
273:    */
274:   async getConfig(blueprintId: string, configKey: string): Promise<BlueprintConfig | null> {
275:     return await firstValueFrom(
276:       this.blueprintConfigRepository.findByConfigKey(blueprintId, configKey)
277:     );
278:   }
279: 
280:   /**
281:    * 设置配置
282:    */
283:   async setConfig(
284:     blueprintId: string,
285:     configKey: string,
286:     configValue: any,
287:     updatedBy?: string
288:   ): Promise<BlueprintConfig> {
289:     this.loadingState.set(true);
290:     this.errorState.set(null);
291: 
292:     try {
293:       const config = await firstValueFrom(
294:         this.blueprintConfigRepository.upsertConfig(blueprintId, configKey, configValue, updatedBy)
295:       );
296:       // 更新本地状态
297:       this.configsState.update(configs => {
298:         // 注意：数据库字段是 config_key，但 BaseRepository 会转换为 configKey
299:         const existing = configs.find(c => (c as any).configKey === configKey || (c as any).config_key === configKey);
300:         if (existing) {
301:           return configs.map(c => (c.id === config.id ? config : c));
302:         }
303:         return [...configs, config];
304:       });
305:       return config;
306:     } catch (error) {
307:       this.errorState.set(error instanceof Error ? error.message : '设置配置失败');
308:       throw error;
309:     } finally {
310:       this.loadingState.set(false);
311:     }
312:   }
313: 
314:   /**
315:    * 重置状态
316:    */
317:   reset(): void {
318:     this.blueprintsState.set([]);
319:     this.selectedBlueprintState.set(null);
320:     this.configsState.set([]);
321:     this.errorState.set(null);
322:   }
323: }
````

## File: src/app/shared/services/blueprint/branch.service.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { signal, computed } from '@angular/core';
  3: import { Observable, firstValueFrom } from 'rxjs';
  4: import {
  5:   BlueprintBranchRepository,
  6:   BranchForkRepository,
  7:   BlueprintBranchInsert,
  8:   BlueprintBranchUpdate,
  9:   BranchForkInsert,
 10:   BranchType,
 11:   BranchStatus
 12: } from '@core';
 13: import { BlueprintBranch, BranchFork } from '@shared';
 14: 
 15: /**
 16:  * Branch Service
 17:  * 
 18:  * 提供分支管理相关的业务逻辑和状态管理
 19:  * 实现 Git-like 分支模型：Fork 机制、分支同步等
 20:  * 
 21:  * @example
 22:  * ```typescript
 23:  * const branchService = inject(BranchService);
 24:  * 
 25:  * // 订阅分支列表
 26:  * effect(() => {
 27:  *   console.log('Branches:', branchService.branches());
 28:  * });
 29:  * 
 30:  * // Fork 分支给组织
 31:  * await branchService.forkBranch('blueprint-id', 'org-id', 'branch-name');
 32:  * ```
 33:  */
 34: @Injectable({
 35:   providedIn: 'root'
 36: })
 37: export class BranchService {
 38:   private branchRepository = inject(BlueprintBranchRepository);
 39:   private branchForkRepository = inject(BranchForkRepository);
 40: 
 41:   // 使用 Signals 管理状态
 42:   private branchesState = signal<BlueprintBranch[]>([]);
 43:   private selectedBranchState = signal<BlueprintBranch | null>(null);
 44:   private forksState = signal<BranchFork[]>([]);
 45:   private loadingState = signal<boolean>(false);
 46:   private errorState = signal<string | null>(null);
 47: 
 48:   // 暴露 ReadonlySignal 给组件
 49:   readonly branches = this.branchesState.asReadonly();
 50:   readonly selectedBranch = this.selectedBranchState.asReadonly();
 51:   readonly forks = this.forksState.asReadonly();
 52:   readonly loading = this.loadingState.asReadonly();
 53:   readonly error = this.errorState.asReadonly();
 54: 
 55:   // Computed signals
 56:   readonly activeBranches = computed(() =>
 57:     this.branches().filter(b => b.status === BranchStatus.ACTIVE)
 58:   );
 59: 
 60:   readonly mergedBranches = computed(() =>
 61:     this.branches().filter(b => b.status === BranchStatus.MERGED)
 62:   );
 63: 
 64:   /**
 65:    * 加载所有分支
 66:    */
 67:   async loadBranches(): Promise<void> {
 68:     this.loadingState.set(true);
 69:     this.errorState.set(null);
 70: 
 71:     try {
 72:       const branches = await firstValueFrom(this.branchRepository.findAll());
 73:       this.branchesState.set(branches);
 74:     } catch (error) {
 75:       this.errorState.set(error instanceof Error ? error.message : '加载分支列表失败');
 76:       throw error;
 77:     } finally {
 78:       this.loadingState.set(false);
 79:     }
 80:   }
 81: 
 82:   /**
 83:    * 根据蓝图 ID 加载分支列表
 84:    */
 85:   async loadBranchesByBlueprintId(blueprintId: string): Promise<BlueprintBranch[]> {
 86:     this.loadingState.set(true);
 87:     this.errorState.set(null);
 88: 
 89:     try {
 90:       const branches = await firstValueFrom(
 91:         this.branchRepository.findByBlueprintId(blueprintId)
 92:       );
 93:       this.branchesState.set(branches);
 94:       return branches;
 95:     } catch (error) {
 96:       this.errorState.set(error instanceof Error ? error.message : '加载分支列表失败');
 97:       throw error;
 98:     } finally {
 99:       this.loadingState.set(false);
100:     }
101:   }
102: 
103:   /**
104:    * 根据组织 ID 加载分支列表
105:    */
106:   async loadBranchesByOrganizationId(organizationId: string): Promise<BlueprintBranch[]> {
107:     this.loadingState.set(true);
108:     this.errorState.set(null);
109: 
110:     try {
111:       const branches = await firstValueFrom(
112:         this.branchRepository.findByOrganizationId(organizationId)
113:       );
114:       this.branchesState.set(branches);
115:       return branches;
116:     } catch (error) {
117:       this.errorState.set(error instanceof Error ? error.message : '加载分支列表失败');
118:       throw error;
119:     } finally {
120:       this.loadingState.set(false);
121:     }
122:   }
123: 
124:   /**
125:    * 根据 ID 加载分支
126:    */
127:   async loadBranchById(id: string): Promise<BlueprintBranch | null> {
128:     this.loadingState.set(true);
129:     this.errorState.set(null);
130: 
131:     try {
132:       const branch = await firstValueFrom(this.branchRepository.findById(id));
133:       if (branch) {
134:         this.selectedBranchState.set(branch);
135:         // 同时加载 Fork 记录
136:         await this.loadForksByBranchId(id);
137:       }
138:       return branch;
139:     } catch (error) {
140:       this.errorState.set(error instanceof Error ? error.message : '加载分支失败');
141:       throw error;
142:     } finally {
143:       this.loadingState.set(false);
144:     }
145:   }
146: 
147:   /**
148:    * Fork 分支给组织（创建组织分支）
149:    * 
150:    * @param blueprintId 蓝图 ID
151:    * @param organizationId 组织 ID
152:    * @param branchName 分支名称
153:    * @param branchType 分支类型
154:    * @param forkedBy Fork 操作者 ID
155:    * @param notes 备注
156:    * @returns 创建的分支
157:    */
158:   async forkBranch(
159:     blueprintId: string,
160:     organizationId: string,
161:     branchName: string,
162:     branchType: BranchType = BranchType.CONTRACTOR,
163:     forkedBy: string,
164:     notes?: string
165:   ): Promise<BlueprintBranch> {
166:     this.loadingState.set(true);
167:     this.errorState.set(null);
168: 
169:     try {
170:       // 检查是否已存在分支
171:       const existing = await firstValueFrom(
172:         this.branchRepository.findByBlueprintAndOrganization(blueprintId, organizationId)
173:       );
174: 
175:       if (existing) {
176:         throw new Error('该组织已存在分支');
177:       }
178: 
179:       // 创建分支
180:       // 使用类型断言，因为 BaseRepository 会自动进行 camelCase → snake_case 转换
181:       const branchData = {
182:         blueprintId,
183:         organizationId,
184:         branchName,
185:         branchType,
186:         status: BranchStatus.ACTIVE,
187:         notes
188:       } as any as BlueprintBranchInsert;
189: 
190:       const branch = await firstValueFrom(this.branchRepository.create(branchData));
191: 
192:       // 创建 Fork 记录
193:       // 使用类型断言，因为 BaseRepository 会自动进行 camelCase → snake_case 转换
194:       const forkData = {
195:         blueprintId,
196:         branchId: branch.id,
197:         forkedBy,
198:         forkReason: notes
199:       } as any as BranchForkInsert;
200:       await firstValueFrom(this.branchForkRepository.create(forkData));
201: 
202:       // 更新本地状态
203:       this.branchesState.update(branches => [...branches, branch]);
204:       return branch;
205:     } catch (error) {
206:       this.errorState.set(error instanceof Error ? error.message : 'Fork 分支失败');
207:       throw error;
208:     } finally {
209:       this.loadingState.set(false);
210:     }
211:   }
212: 
213:   /**
214:    * 更新分支
215:    */
216:   async updateBranch(id: string, data: BlueprintBranchUpdate): Promise<BlueprintBranch> {
217:     this.loadingState.set(true);
218:     this.errorState.set(null);
219: 
220:     try {
221:       const branch = await firstValueFrom(this.branchRepository.update(id, data));
222:       // 更新本地状态
223:       this.branchesState.update(branches =>
224:         branches.map(b => (b.id === id ? branch : b))
225:       );
226:       // 如果更新的是当前选中的分支，也更新选中状态
227:       if (this.selectedBranch()?.id === id) {
228:         this.selectedBranchState.set(branch);
229:       }
230:       return branch;
231:     } catch (error) {
232:       this.errorState.set(error instanceof Error ? error.message : '更新分支失败');
233:       throw error;
234:     } finally {
235:       this.loadingState.set(false);
236:     }
237:   }
238: 
239:   /**
240:    * 删除分支
241:    */
242:   async deleteBranch(id: string): Promise<void> {
243:     this.loadingState.set(true);
244:     this.errorState.set(null);
245: 
246:     try {
247:       await firstValueFrom(this.branchRepository.delete(id));
248:       // 更新本地状态
249:       this.branchesState.update(branches => branches.filter(b => b.id !== id));
250:       // 如果删除的是当前选中的分支，清空选中状态
251:       if (this.selectedBranch()?.id === id) {
252:         this.selectedBranchState.set(null);
253:         this.forksState.set([]);
254:       }
255:     } catch (error) {
256:       this.errorState.set(error instanceof Error ? error.message : '删除分支失败');
257:       throw error;
258:     } finally {
259:       this.loadingState.set(false);
260:     }
261:   }
262: 
263:   /**
264:    * 选择分支
265:    */
266:   selectBranch(branch: BlueprintBranch | null): void {
267:     this.selectedBranchState.set(branch);
268:     if (branch) {
269:       this.loadForksByBranchId(branch.id);
270:     } else {
271:       this.forksState.set([]);
272:     }
273:   }
274: 
275:   /**
276:    * 加载分支的 Fork 记录
277:    */
278:   async loadForksByBranchId(branchId: string): Promise<BranchFork[]> {
279:     this.loadingState.set(true);
280:     this.errorState.set(null);
281: 
282:     try {
283:       const forks = await firstValueFrom(this.branchForkRepository.findByBranchId(branchId));
284:       this.forksState.set(forks);
285:       return forks;
286:     } catch (error) {
287:       this.errorState.set(error instanceof Error ? error.message : '加载 Fork 记录失败');
288:       throw error;
289:     } finally {
290:       this.loadingState.set(false);
291:     }
292:   }
293: 
294:   /**
295:    * 同步主分支数据到分支（更新 last_sync_at）
296:    * 
297:    * @param branchId 分支 ID
298:    */
299:   async syncFromMainBranch(branchId: string): Promise<void> {
300:     this.loadingState.set(true);
301:     this.errorState.set(null);
302: 
303:     try {
304:       await this.updateBranch(branchId, {
305:         lastSyncAt: new Date().toISOString()
306:       } as any);
307:     } catch (error) {
308:       this.errorState.set(error instanceof Error ? error.message : '同步主分支数据失败');
309:       throw error;
310:     } finally {
311:       this.loadingState.set(false);
312:     }
313:   }
314: 
315:   /**
316:    * 关闭分支
317:    */
318:   async closeBranch(branchId: string): Promise<BlueprintBranch> {
319:     return await this.updateBranch(branchId, {
320:       status: BranchStatus.CLOSED
321:     } as any);
322:   }
323: 
324:   /**
325:    * 标记分支为已合并
326:    */
327:   async markBranchAsMerged(branchId: string): Promise<BlueprintBranch> {
328:     return await this.updateBranch(branchId, {
329:       status: BranchStatus.MERGED
330:     } as any);
331:   }
332: 
333:   /**
334:    * 重置状态
335:    */
336:   reset(): void {
337:     this.branchesState.set([]);
338:     this.selectedBranchState.set(null);
339:     this.forksState.set([]);
340:     this.errorState.set(null);
341:   }
342: }
````

## File: src/app/shared/services/blueprint/index.ts
````typescript
 1: /**
 2:  * 蓝图服务导出
 3:  * 
 4:  * 提供蓝图系统相关的服务：
 5:  * - BlueprintService: 蓝图 CRUD 操作和主分支管理
 6:  * - BranchService: 分支管理和 Fork 机制
 7:  * - PullRequestService: PR 创建、审核、合并
 8:  * 
 9:  * @module shared/services/blueprint
10:  */
11: 
12: export * from './blueprint.service';
13: export * from './branch.service';
14: export * from './pull-request.service';
````

## File: src/app/shared/services/blueprint/pull-request.service.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { signal, computed } from '@angular/core';
  3: import { Observable, firstValueFrom } from 'rxjs';
  4: import {
  5:   PullRequestRepository,
  6:   PullRequestInsert,
  7:   PullRequestUpdate,
  8:   PRStatus
  9: } from '@core';
 10: import { PullRequest } from '@shared';
 11: 
 12: /**
 13:  * PullRequest Service
 14:  * 
 15:  * 提供 Pull Request 相关的业务逻辑和状态管理
 16:  * 实现 Git-like PR 机制：创建、审核、合并（更新承揽字段）
 17:  * 
 18:  * @example
 19:  * ```typescript
 20:  * const prService = inject(PullRequestService);
 21:  * 
 22:  * // 订阅 PR 列表
 23:  * effect(() => {
 24:  *   console.log('Pull Requests:', prService.pullRequests());
 25:  * });
 26:  * 
 27:  * // 创建 PR
 28:  * await prService.createPullRequest({
 29:  *   blueprintId: 'blueprint-id',
 30:  *   branchId: 'branch-id',
 31:  *   title: '提交执行数据',
 32:  *   submittedBy: 'user-id'
 33:  * });
 34:  * ```
 35:  */
 36: @Injectable({
 37:   providedIn: 'root'
 38: })
 39: export class PullRequestService {
 40:   private pullRequestRepository = inject(PullRequestRepository);
 41: 
 42:   // 使用 Signals 管理状态
 43:   private pullRequestsState = signal<PullRequest[]>([]);
 44:   private selectedPullRequestState = signal<PullRequest | null>(null);
 45:   private loadingState = signal<boolean>(false);
 46:   private errorState = signal<string | null>(null);
 47: 
 48:   // 暴露 ReadonlySignal 给组件
 49:   readonly pullRequests = this.pullRequestsState.asReadonly();
 50:   readonly selectedPullRequest = this.selectedPullRequestState.asReadonly();
 51:   readonly loading = this.loadingState.asReadonly();
 52:   readonly error = this.errorState.asReadonly();
 53: 
 54:   // Computed signals
 55:   readonly openPullRequests = computed(() =>
 56:     this.pullRequests().filter(pr => pr.status === PRStatus.OPEN)
 57:   );
 58: 
 59:   readonly reviewingPullRequests = computed(() =>
 60:     this.pullRequests().filter(pr => pr.status === PRStatus.REVIEWING)
 61:   );
 62: 
 63:   readonly approvedPullRequests = computed(() =>
 64:     this.pullRequests().filter(pr => pr.status === PRStatus.APPROVED)
 65:   );
 66: 
 67:   readonly mergedPullRequests = computed(() =>
 68:     this.pullRequests().filter(pr => pr.status === PRStatus.MERGED)
 69:   );
 70: 
 71:   /**
 72:    * 加载所有 Pull Request
 73:    */
 74:   async loadPullRequests(): Promise<void> {
 75:     this.loadingState.set(true);
 76:     this.errorState.set(null);
 77: 
 78:     try {
 79:       const pullRequests = await firstValueFrom(this.pullRequestRepository.findAll());
 80:       this.pullRequestsState.set(pullRequests);
 81:     } catch (error) {
 82:       this.errorState.set(error instanceof Error ? error.message : '加载 Pull Request 列表失败');
 83:       throw error;
 84:     } finally {
 85:       this.loadingState.set(false);
 86:     }
 87:   }
 88: 
 89:   /**
 90:    * 根据 ID 加载 Pull Request
 91:    */
 92:   async loadPullRequestById(id: string): Promise<PullRequest | null> {
 93:     this.loadingState.set(true);
 94:     this.errorState.set(null);
 95: 
 96:     try {
 97:       const pullRequest = await firstValueFrom(this.pullRequestRepository.findById(id));
 98:       if (pullRequest) {
 99:         this.selectedPullRequestState.set(pullRequest);
100:       }
101:       return pullRequest;
102:     } catch (error) {
103:       this.errorState.set(error instanceof Error ? error.message : '加载 Pull Request 失败');
104:       throw error;
105:     } finally {
106:       this.loadingState.set(false);
107:     }
108:   }
109: 
110:   /**
111:    * 根据蓝图 ID 加载 Pull Request 列表
112:    */
113:   async loadPullRequestsByBlueprintId(blueprintId: string): Promise<PullRequest[]> {
114:     this.loadingState.set(true);
115:     this.errorState.set(null);
116: 
117:     try {
118:       const pullRequests = await firstValueFrom(
119:         this.pullRequestRepository.findByBlueprintId(blueprintId)
120:       );
121:       this.pullRequestsState.set(pullRequests);
122:       return pullRequests;
123:     } catch (error) {
124:       this.errorState.set(error instanceof Error ? error.message : '加载 Pull Request 列表失败');
125:       throw error;
126:     } finally {
127:       this.loadingState.set(false);
128:     }
129:   }
130: 
131:   /**
132:    * 根据分支 ID 加载 Pull Request 列表
133:    */
134:   async loadPullRequestsByBranchId(branchId: string): Promise<PullRequest[]> {
135:     this.loadingState.set(true);
136:     this.errorState.set(null);
137: 
138:     try {
139:       const pullRequests = await firstValueFrom(
140:         this.pullRequestRepository.findByBranchId(branchId)
141:       );
142:       this.pullRequestsState.set(pullRequests);
143:       return pullRequests;
144:     } catch (error) {
145:       this.errorState.set(error instanceof Error ? error.message : '加载 Pull Request 列表失败');
146:       throw error;
147:     } finally {
148:       this.loadingState.set(false);
149:     }
150:   }
151: 
152:   /**
153:    * 创建 Pull Request
154:    * 
155:    * @param data PR 数据
156:    * @returns 创建的 PR
157:    */
158:   async createPullRequest(data: PullRequestInsert): Promise<PullRequest> {
159:     this.loadingState.set(true);
160:     this.errorState.set(null);
161: 
162:     try {
163:       const pullRequest = await firstValueFrom(
164:         this.pullRequestRepository.create({
165:           ...data,
166:           status: PRStatus.OPEN
167:         } as any)
168:       );
169:       // 更新本地状态
170:       this.pullRequestsState.update(prs => [...prs, pullRequest]);
171:       return pullRequest;
172:     } catch (error) {
173:       this.errorState.set(error instanceof Error ? error.message : '创建 Pull Request 失败');
174:       throw error;
175:     } finally {
176:       this.loadingState.set(false);
177:     }
178:   }
179: 
180:   /**
181:    * 更新 Pull Request
182:    */
183:   async updatePullRequest(id: string, data: PullRequestUpdate): Promise<PullRequest> {
184:     this.loadingState.set(true);
185:     this.errorState.set(null);
186: 
187:     try {
188:       const pullRequest = await firstValueFrom(
189:         this.pullRequestRepository.update(id, data)
190:       );
191:       // 更新本地状态
192:       this.pullRequestsState.update(prs =>
193:         prs.map(pr => (pr.id === id ? pullRequest : pr))
194:       );
195:       // 如果更新的是当前选中的 PR，也更新选中状态
196:       if (this.selectedPullRequest()?.id === id) {
197:         this.selectedPullRequestState.set(pullRequest);
198:       }
199:       return pullRequest;
200:     } catch (error) {
201:       this.errorState.set(error instanceof Error ? error.message : '更新 Pull Request 失败');
202:       throw error;
203:     } finally {
204:       this.loadingState.set(false);
205:     }
206:   }
207: 
208:   /**
209:    * 删除 Pull Request
210:    */
211:   async deletePullRequest(id: string): Promise<void> {
212:     this.loadingState.set(true);
213:     this.errorState.set(null);
214: 
215:     try {
216:       await firstValueFrom(this.pullRequestRepository.delete(id));
217:       // 更新本地状态
218:       this.pullRequestsState.update(prs => prs.filter(pr => pr.id !== id));
219:       // 如果删除的是当前选中的 PR，清空选中状态
220:       if (this.selectedPullRequest()?.id === id) {
221:         this.selectedPullRequestState.set(null);
222:       }
223:     } catch (error) {
224:       this.errorState.set(error instanceof Error ? error.message : '删除 Pull Request 失败');
225:       throw error;
226:     } finally {
227:       this.loadingState.set(false);
228:     }
229:   }
230: 
231:   /**
232:    * 选择 Pull Request
233:    */
234:   selectPullRequest(pullRequest: PullRequest | null): void {
235:     this.selectedPullRequestState.set(pullRequest);
236:   }
237: 
238:   /**
239:    * 开始审核 PR（状态变为 reviewing）
240:    * 
241:    * @param prId PR ID
242:    * @param reviewedBy 审核者 ID
243:    */
244:   async startReview(prId: string, reviewedBy: string): Promise<PullRequest> {
245:     return await this.updatePullRequest(prId, {
246:       status: PRStatus.REVIEWING,
247:       reviewedBy
248:     } as any);
249:   }
250: 
251:   /**
252:    * 批准 PR（状态变为 approved）
253:    * 
254:    * @param prId PR ID
255:    * @param reviewedBy 审核者 ID
256:    */
257:   async approvePullRequest(prId: string, reviewedBy: string): Promise<PullRequest> {
258:     return await this.updatePullRequest(prId, {
259:       status: PRStatus.APPROVED,
260:       reviewedBy,
261:       reviewedAt: new Date().toISOString()
262:     } as any);
263:   }
264: 
265:   /**
266:    * 拒绝 PR（状态变为 rejected）
267:    * 
268:    * @param prId PR ID
269:    * @param reviewedBy 审核者 ID
270:    */
271:   async rejectPullRequest(prId: string, reviewedBy: string): Promise<PullRequest> {
272:     return await this.updatePullRequest(prId, {
273:       status: PRStatus.REJECTED,
274:       reviewedBy,
275:       reviewedAt: new Date().toISOString()
276:     } as any);
277:   }
278: 
279:   /**
280:    * 合并 PR（状态变为 merged，更新承揽字段）
281:    * 
282:    * 注意：实际的合并逻辑（更新任务承揽字段）应该在 Service 层或更高层实现
283:    * 这里只更新 PR 状态
284:    * 
285:    * @param prId PR ID
286:    * @param mergedBy 合并者 ID
287:    * @param changesSummary 变更摘要（用于记录合并的内容）
288:    */
289:   async mergePullRequest(
290:     prId: string,
291:     mergedBy: string,
292:     changesSummary?: any
293:   ): Promise<PullRequest> {
294:     return await this.updatePullRequest(prId, {
295:       status: PRStatus.MERGED,
296:       mergedBy,
297:       mergedAt: new Date().toISOString(),
298:       changesSummary: changesSummary || {}
299:     } as any);
300:   }
301: 
302:   /**
303:    * 关闭 PR（状态变为 closed）
304:    * 
305:    * @param prId PR ID
306:    */
307:   async closePullRequest(prId: string): Promise<PullRequest> {
308:     return await this.updatePullRequest(prId, {
309:       status: PRStatus.CLOSED
310:     } as any);
311:   }
312: 
313:   /**
314:    * 重置状态
315:    */
316:   reset(): void {
317:     this.pullRequestsState.set([]);
318:     this.selectedPullRequestState.set(null);
319:     this.errorState.set(null);
320:   }
321: }
````

## File: src/app/shared/services/collaboration/collaboration.service.spec.ts
````typescript
  1: import { TestBed } from '@angular/core/testing';
  2: import { of, throwError } from 'rxjs';
  3: import {
  4:   OrganizationCollaborationRepository,
  5:   CollaborationType,
  6:   CollaborationStatus
  7: } from '@core';
  8: import { CollaborationService } from './collaboration.service';
  9: import { OrganizationCollaboration } from '@shared';
 10: 
 11: describe('CollaborationService', () => {
 12:   let service: CollaborationService;
 13:   let repository: jasmine.SpyObj<OrganizationCollaborationRepository>;
 14: 
 15:   const mockCollaboration: OrganizationCollaboration = {
 16:     id: 'collab-1',
 17:     blueprint_id: 'blueprint-1',
 18:     owner_org_id: 'org-1',
 19:     collaborator_org_id: 'org-2',
 20:     collaboration_type: CollaborationType.CONTRACTOR,
 21:     status: CollaborationStatus.ACTIVE,
 22:     contract_start_date: '2025-01-01',
 23:     contract_end_date: '2025-12-31',
 24:     notes: 'Test collaboration',
 25:     created_at: '2025-01-01T00:00:00Z',
 26:     updated_at: '2025-01-01T00:00:00Z'
 27:   } as OrganizationCollaboration;
 28: 
 29:   const mockCollaborations: OrganizationCollaboration[] = [
 30:     mockCollaboration,
 31:     {
 32:       ...mockCollaboration,
 33:       id: 'collab-2',
 34:       status: CollaborationStatus.PENDING,
 35:       collaboration_type: CollaborationType.SUBCONTRACTOR
 36:     }
 37:   ];
 38: 
 39:   beforeEach(() => {
 40:     const repositorySpy = jasmine.createSpyObj('OrganizationCollaborationRepository', [
 41:       'findAll',
 42:       'findById',
 43:       'findByBlueprintId',
 44:       'findByOwnerOrgId',
 45:       'findByCollaboratorOrgId',
 46:       'findByCollaborationType',
 47:       'findByStatus',
 48:       'create',
 49:       'update',
 50:       'delete'
 51:     ]);
 52: 
 53:     TestBed.configureTestingModule({
 54:       providers: [
 55:         CollaborationService,
 56:         { provide: OrganizationCollaborationRepository, useValue: repositorySpy }
 57:       ]
 58:     });
 59: 
 60:     service = TestBed.inject(CollaborationService);
 61:     repository = TestBed.inject(
 62:       OrganizationCollaborationRepository
 63:     ) as jasmine.SpyObj<OrganizationCollaborationRepository>;
 64:   });
 65: 
 66:   it('should be created', () => {
 67:     expect(service).toBeTruthy();
 68:   });
 69: 
 70:   describe('Initial state', () => {
 71:     it('should have empty collaborations', () => {
 72:       expect(service.collaborations().length).toBe(0);
 73:     });
 74: 
 75:     it('should have null selected collaboration', () => {
 76:       expect(service.selectedCollaboration()).toBeNull();
 77:     });
 78: 
 79:     it('should have false loading state', () => {
 80:       expect(service.loading()).toBe(false);
 81:     });
 82: 
 83:     it('should have null error state', () => {
 84:       expect(service.error()).toBeNull();
 85:     });
 86:   });
 87: 
 88:   describe('loadCollaborations', () => {
 89:     it('should load collaborations successfully', async () => {
 90:       repository.findAll.and.returnValue(of(mockCollaborations));
 91: 
 92:       await service.loadCollaborations();
 93: 
 94:       expect(service.collaborations().length).toBe(2);
 95:       expect(service.collaborations()[0].id).toBe('collab-1');
 96:       expect(service.loading()).toBe(false);
 97:       expect(service.error()).toBeNull();
 98:     });
 99: 
100:     it('should set loading state during load', async () => {
101:       repository.findAll.and.returnValue(of(mockCollaborations));
102: 
103:       const loadPromise = service.loadCollaborations();
104:       expect(service.loading()).toBe(true);
105: 
106:       await loadPromise;
107:       expect(service.loading()).toBe(false);
108:     });
109: 
110:     it('should handle error when loading fails', async () => {
111:       const error = new Error('Load failed');
112:       repository.findAll.and.returnValue(throwError(() => error));
113: 
114:       try {
115:         await service.loadCollaborations();
116:         fail('should have thrown error');
117:       } catch (e) {
118:         expect(service.error()).toBe('Load failed');
119:         expect(service.loading()).toBe(false);
120:       }
121:     });
122:   });
123: 
124:   describe('loadCollaborationById', () => {
125:     it('should load collaboration by id successfully', async () => {
126:       repository.findById.and.returnValue(of(mockCollaboration));
127: 
128:       const result = await service.loadCollaborationById('collab-1');
129: 
130:       expect(result).toEqual(mockCollaboration);
131:       expect(service.selectedCollaboration()).toEqual(mockCollaboration);
132:       expect(service.loading()).toBe(false);
133:     });
134: 
135:     it('should return null when collaboration not found', async () => {
136:       repository.findById.and.returnValue(of(null));
137: 
138:       const result = await service.loadCollaborationById('non-existent');
139: 
140:       expect(result).toBeNull();
141:       expect(service.selectedCollaboration()).toBeNull();
142:     });
143: 
144:     it('should handle error when loading by id fails', async () => {
145:       const error = new Error('Not found');
146:       repository.findById.and.returnValue(throwError(() => error));
147: 
148:       try {
149:         await service.loadCollaborationById('collab-1');
150:         fail('should have thrown error');
151:       } catch (e) {
152:         expect(service.error()).toBe('Not found');
153:       }
154:     });
155:   });
156: 
157:   describe('loadCollaborationsByBlueprintId', () => {
158:     it('should load collaborations by blueprint id', async () => {
159:       repository.findByBlueprintId.and.returnValue(of(mockCollaborations));
160: 
161:       const result = await service.loadCollaborationsByBlueprintId('blueprint-1');
162: 
163:       expect(result.length).toBe(2);
164:       expect(repository.findByBlueprintId).toHaveBeenCalledWith('blueprint-1');
165:     });
166:   });
167: 
168:   describe('loadCollaborationsByOwnerOrgId', () => {
169:     it('should load collaborations by owner org id', async () => {
170:       repository.findByOwnerOrgId.and.returnValue(of(mockCollaborations));
171: 
172:       const result = await service.loadCollaborationsByOwnerOrgId('org-1');
173: 
174:       expect(result.length).toBe(2);
175:       expect(repository.findByOwnerOrgId).toHaveBeenCalledWith('org-1');
176:     });
177:   });
178: 
179:   describe('loadCollaborationsByCollaboratorOrgId', () => {
180:     it('should load collaborations by collaborator org id', async () => {
181:       repository.findByCollaboratorOrgId.and.returnValue(of(mockCollaborations));
182: 
183:       const result = await service.loadCollaborationsByCollaboratorOrgId('org-2');
184: 
185:       expect(result.length).toBe(2);
186:       expect(repository.findByCollaboratorOrgId).toHaveBeenCalledWith('org-2');
187:     });
188:   });
189: 
190:   describe('loadCollaborationsByType', () => {
191:     it('should load collaborations by type', async () => {
192:       repository.findByCollaborationType.and.returnValue(of([mockCollaboration]));
193: 
194:       const result = await service.loadCollaborationsByType(CollaborationType.CONTRACTOR);
195: 
196:       expect(result.length).toBe(1);
197:       expect(repository.findByCollaborationType).toHaveBeenCalledWith(CollaborationType.CONTRACTOR);
198:     });
199:   });
200: 
201:   describe('loadCollaborationsByStatus', () => {
202:     it('should load collaborations by status', async () => {
203:       repository.findByStatus.and.returnValue(of([mockCollaboration]));
204: 
205:       const result = await service.loadCollaborationsByStatus(CollaborationStatus.ACTIVE);
206: 
207:       expect(result.length).toBe(1);
208:       expect(repository.findByStatus).toHaveBeenCalledWith(CollaborationStatus.ACTIVE);
209:     });
210:   });
211: 
212:   describe('createCollaboration', () => {
213:     it('should create collaboration successfully', async () => {
214:       const newCollaboration = { ...mockCollaboration, id: 'collab-new' };
215:       repository.create.and.returnValue(of(newCollaboration));
216: 
217:       const result = await service.createCollaboration({
218:         blueprint_id: 'blueprint-1',
219:         owner_org_id: 'org-1',
220:         collaborator_org_id: 'org-2',
221:         collaboration_type: CollaborationType.CONTRACTOR
222:       });
223: 
224:       expect(result).toEqual(newCollaboration);
225:       expect(service.collaborations().length).toBe(1);
226:       expect(service.collaborations()[0].id).toBe('collab-new');
227:     });
228: 
229:     it('should handle error when creating fails', async () => {
230:       const error = new Error('Create failed');
231:       repository.create.and.returnValue(throwError(() => error));
232: 
233:       try {
234:         await service.createCollaboration({
235:           blueprint_id: 'blueprint-1',
236:           owner_org_id: 'org-1',
237:           collaborator_org_id: 'org-2',
238:           collaboration_type: CollaborationType.CONTRACTOR
239:         });
240:         fail('should have thrown error');
241:       } catch (e) {
242:         expect(service.error()).toBe('Create failed');
243:       }
244:     });
245:   });
246: 
247:   describe('updateCollaboration', () => {
248:     beforeEach(() => {
249:       service['collaborationsState'].set(mockCollaborations);
250:     });
251: 
252:     it('should update collaboration successfully', async () => {
253:       const updated = { ...mockCollaboration, notes: 'Updated notes' };
254:       repository.update.and.returnValue(of(updated));
255: 
256:       const result = await service.updateCollaboration('collab-1', { notes: 'Updated notes' });
257: 
258:       expect(result).toEqual(updated);
259:       expect(service.collaborations()[0].notes).toBe('Updated notes');
260:     });
261: 
262:     it('should update selected collaboration if it matches', async () => {
263:       service.selectCollaboration(mockCollaboration);
264:       const updated = { ...mockCollaboration, notes: 'Updated notes' };
265:       repository.update.and.returnValue(of(updated));
266: 
267:       await service.updateCollaboration('collab-1', { notes: 'Updated notes' });
268: 
269:       expect(service.selectedCollaboration()?.notes).toBe('Updated notes');
270:     });
271: 
272:     it('should handle error when updating fails', async () => {
273:       const error = new Error('Update failed');
274:       repository.update.and.returnValue(throwError(() => error));
275: 
276:       try {
277:         await service.updateCollaboration('collab-1', { notes: 'Updated' });
278:         fail('should have thrown error');
279:       } catch (e) {
280:         expect(service.error()).toBe('Update failed');
281:       }
282:     });
283:   });
284: 
285:   describe('deleteCollaboration', () => {
286:     beforeEach(() => {
287:       service['collaborationsState'].set(mockCollaborations);
288:     });
289: 
290:     it('should delete collaboration successfully', async () => {
291:       repository.delete.and.returnValue(of(undefined));
292: 
293:       await service.deleteCollaboration('collab-1');
294: 
295:       expect(service.collaborations().length).toBe(1);
296:       expect(service.collaborations()[0].id).toBe('collab-2');
297:     });
298: 
299:     it('should clear selected collaboration if deleted', async () => {
300:       service.selectCollaboration(mockCollaboration);
301:       repository.delete.and.returnValue(of(undefined));
302: 
303:       await service.deleteCollaboration('collab-1');
304: 
305:       expect(service.selectedCollaboration()).toBeNull();
306:     });
307: 
308:     it('should handle error when deleting fails', async () => {
309:       const error = new Error('Delete failed');
310:       repository.delete.and.returnValue(throwError(() => error));
311: 
312:       try {
313:         await service.deleteCollaboration('collab-1');
314:         fail('should have thrown error');
315:       } catch (e) {
316:         expect(service.error()).toBe('Delete failed');
317:       }
318:     });
319:   });
320: 
321:   describe('selectCollaboration', () => {
322:     it('should select collaboration', () => {
323:       service.selectCollaboration(mockCollaboration);
324: 
325:       expect(service.selectedCollaboration()).toEqual(mockCollaboration);
326:     });
327: 
328:     it('should clear selection when null', () => {
329:       service.selectCollaboration(mockCollaboration);
330:       service.selectCollaboration(null);
331: 
332:       expect(service.selectedCollaboration()).toBeNull();
333:     });
334:   });
335: 
336:   describe('reset', () => {
337:     it('should reset all state', () => {
338:       service['collaborationsState'].set(mockCollaborations);
339:       service.selectCollaboration(mockCollaboration);
340:       service['errorState'].set('Some error');
341: 
342:       service.reset();
343: 
344:       expect(service.collaborations().length).toBe(0);
345:       expect(service.selectedCollaboration()).toBeNull();
346:       expect(service.error()).toBeNull();
347:     });
348:   });
349: 
350:   describe('Computed signals', () => {
351:     beforeEach(() => {
352:       service['collaborationsState'].set(mockCollaborations);
353:     });
354: 
355:     it('should compute activeCollaborations', () => {
356:       expect(service.activeCollaborations().length).toBe(1);
357:       expect(service.activeCollaborations()[0].status).toBe(CollaborationStatus.ACTIVE);
358:     });
359: 
360:     it('should compute pendingCollaborations', () => {
361:       expect(service.pendingCollaborations().length).toBe(1);
362:       expect(service.pendingCollaborations()[0].status).toBe(CollaborationStatus.PENDING);
363:     });
364: 
365:     it('should compute contractorCollaborations', () => {
366:       expect(service.contractorCollaborations().length).toBe(1);
367:       expect(service.contractorCollaborations()[0].collaboration_type).toBe(
368:         CollaborationType.CONTRACTOR
369:       );
370:     });
371:   });
372: });
````

## File: src/app/shared/services/collaboration/collaboration.service.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { signal, computed } from '@angular/core';
  3: import { Observable, firstValueFrom } from 'rxjs';
  4: import {
  5:   OrganizationCollaborationRepository,
  6:   OrganizationCollaborationInsert,
  7:   OrganizationCollaborationUpdate,
  8:   CollaborationType,
  9:   CollaborationStatus
 10: } from '@core';
 11: import { OrganizationCollaboration } from '@shared';
 12: 
 13: /**
 14:  * Collaboration Service
 15:  * 
 16:  * 提供组织协作关系相关的业务逻辑和状态管理
 17:  * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 18:  * 
 19:  * @example
 20:  * ```typescript
 21:  * const collaborationService = inject(CollaborationService);
 22:  * 
 23:  * // 订阅协作关系列表
 24:  * effect(() => {
 25:  *   console.log('Collaborations:', collaborationService.collaborations());
 26:  * });
 27:  * 
 28:  * // 加载协作关系列表
 29:  * await collaborationService.loadCollaborations();
 30:  * ```
 31:  */
 32: @Injectable({
 33:   providedIn: 'root'
 34: })
 35: export class CollaborationService {
 36:   private collaborationRepository = inject(OrganizationCollaborationRepository);
 37: 
 38:   // 使用 Signals 管理状态
 39:   private collaborationsState = signal<OrganizationCollaboration[]>([]);
 40:   private selectedCollaborationState = signal<OrganizationCollaboration | null>(null);
 41:   private loadingState = signal<boolean>(false);
 42:   private errorState = signal<string | null>(null);
 43: 
 44:   // 暴露 ReadonlySignal 给组件
 45:   readonly collaborations = this.collaborationsState.asReadonly();
 46:   readonly selectedCollaboration = this.selectedCollaborationState.asReadonly();
 47:   readonly loading = this.loadingState.asReadonly();
 48:   readonly error = this.errorState.asReadonly();
 49: 
 50:   // Computed signals
 51:   readonly activeCollaborations = computed(() =>
 52:     this.collaborations().filter(c => c.status === CollaborationStatus.ACTIVE)
 53:   );
 54: 
 55:   readonly pendingCollaborations = computed(() =>
 56:     this.collaborations().filter(c => c.status === CollaborationStatus.PENDING)
 57:   );
 58: 
 59:   readonly contractorCollaborations = computed(() =>
 60:     this.collaborations().filter(c => c.collaboration_type === CollaborationType.CONTRACTOR)
 61:   );
 62: 
 63:   /**
 64:    * 加载所有协作关系
 65:    */
 66:   async loadCollaborations(): Promise<void> {
 67:     this.loadingState.set(true);
 68:     this.errorState.set(null);
 69: 
 70:     try {
 71:       const collaborations = await firstValueFrom(this.collaborationRepository.findAll());
 72:       this.collaborationsState.set(collaborations);
 73:     } catch (error) {
 74:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
 75:       throw error;
 76:     } finally {
 77:       this.loadingState.set(false);
 78:     }
 79:   }
 80: 
 81:   /**
 82:    * 根据 ID 加载协作关系
 83:    */
 84:   async loadCollaborationById(id: string): Promise<OrganizationCollaboration | null> {
 85:     this.loadingState.set(true);
 86:     this.errorState.set(null);
 87: 
 88:     try {
 89:       const collaboration = await firstValueFrom(this.collaborationRepository.findById(id));
 90:       if (collaboration) {
 91:         this.selectedCollaborationState.set(collaboration);
 92:       }
 93:       return collaboration;
 94:     } catch (error) {
 95:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系失败');
 96:       throw error;
 97:     } finally {
 98:       this.loadingState.set(false);
 99:     }
100:   }
101: 
102:   /**
103:    * 根据蓝图 ID 加载协作关系
104:    */
105:   async loadCollaborationsByBlueprintId(blueprintId: string): Promise<OrganizationCollaboration[]> {
106:     this.loadingState.set(true);
107:     this.errorState.set(null);
108: 
109:     try {
110:       const collaborations = await firstValueFrom(
111:         this.collaborationRepository.findByBlueprintId(blueprintId)
112:       );
113:       return collaborations;
114:     } catch (error) {
115:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
116:       throw error;
117:     } finally {
118:       this.loadingState.set(false);
119:     }
120:   }
121: 
122:   /**
123:    * 根据拥有者组织 ID 加载协作关系
124:    */
125:   async loadCollaborationsByOwnerOrgId(ownerOrgId: string): Promise<OrganizationCollaboration[]> {
126:     this.loadingState.set(true);
127:     this.errorState.set(null);
128: 
129:     try {
130:       const collaborations = await firstValueFrom(
131:         this.collaborationRepository.findByOwnerOrgId(ownerOrgId)
132:       );
133:       return collaborations;
134:     } catch (error) {
135:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
136:       throw error;
137:     } finally {
138:       this.loadingState.set(false);
139:     }
140:   }
141: 
142:   /**
143:    * 根据协作组织 ID 加载协作关系
144:    */
145:   async loadCollaborationsByCollaboratorOrgId(
146:     collaboratorOrgId: string
147:   ): Promise<OrganizationCollaboration[]> {
148:     this.loadingState.set(true);
149:     this.errorState.set(null);
150: 
151:     try {
152:       const collaborations = await firstValueFrom(
153:         this.collaborationRepository.findByCollaboratorOrgId(collaboratorOrgId)
154:       );
155:       return collaborations;
156:     } catch (error) {
157:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
158:       throw error;
159:     } finally {
160:       this.loadingState.set(false);
161:     }
162:   }
163: 
164:   /**
165:    * 根据协作类型加载协作关系
166:    */
167:   async loadCollaborationsByType(
168:     collaborationType: CollaborationType
169:   ): Promise<OrganizationCollaboration[]> {
170:     this.loadingState.set(true);
171:     this.errorState.set(null);
172: 
173:     try {
174:       const collaborations = await firstValueFrom(
175:         this.collaborationRepository.findByCollaborationType(collaborationType)
176:       );
177:       return collaborations;
178:     } catch (error) {
179:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
180:       throw error;
181:     } finally {
182:       this.loadingState.set(false);
183:     }
184:   }
185: 
186:   /**
187:    * 根据状态加载协作关系
188:    */
189:   async loadCollaborationsByStatus(
190:     status: CollaborationStatus
191:   ): Promise<OrganizationCollaboration[]> {
192:     this.loadingState.set(true);
193:     this.errorState.set(null);
194: 
195:     try {
196:       const collaborations = await firstValueFrom(
197:         this.collaborationRepository.findByStatus(status)
198:       );
199:       return collaborations;
200:     } catch (error) {
201:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
202:       throw error;
203:     } finally {
204:       this.loadingState.set(false);
205:     }
206:   }
207: 
208:   /**
209:    * 创建协作关系
210:    */
211:   async createCollaboration(
212:     data: OrganizationCollaborationInsert
213:   ): Promise<OrganizationCollaboration> {
214:     this.loadingState.set(true);
215:     this.errorState.set(null);
216: 
217:     try {
218:       const collaboration = await firstValueFrom(this.collaborationRepository.create(data));
219:       // 更新本地状态
220:       this.collaborationsState.update(collaborations => [...collaborations, collaboration]);
221:       return collaboration;
222:     } catch (error) {
223:       this.errorState.set(error instanceof Error ? error.message : '创建协作关系失败');
224:       throw error;
225:     } finally {
226:       this.loadingState.set(false);
227:     }
228:   }
229: 
230:   /**
231:    * 更新协作关系
232:    */
233:   async updateCollaboration(
234:     id: string,
235:     data: OrganizationCollaborationUpdate
236:   ): Promise<OrganizationCollaboration> {
237:     this.loadingState.set(true);
238:     this.errorState.set(null);
239: 
240:     try {
241:       const collaboration = await firstValueFrom(this.collaborationRepository.update(id, data));
242:       // 更新本地状态
243:       this.collaborationsState.update(collaborations =>
244:         collaborations.map(c => (c.id === id ? collaboration : c))
245:       );
246:       // 如果更新的是当前选中的协作关系，也更新选中状态
247:       if (this.selectedCollaboration()?.id === id) {
248:         this.selectedCollaborationState.set(collaboration);
249:       }
250:       return collaboration;
251:     } catch (error) {
252:       this.errorState.set(error instanceof Error ? error.message : '更新协作关系失败');
253:       throw error;
254:     } finally {
255:       this.loadingState.set(false);
256:     }
257:   }
258: 
259:   /**
260:    * 删除协作关系
261:    */
262:   async deleteCollaboration(id: string): Promise<void> {
263:     this.loadingState.set(true);
264:     this.errorState.set(null);
265: 
266:     try {
267:       await firstValueFrom(this.collaborationRepository.delete(id));
268:       // 更新本地状态
269:       this.collaborationsState.update(collaborations => collaborations.filter(c => c.id !== id));
270:       // 如果删除的是当前选中的协作关系，清空选中状态
271:       if (this.selectedCollaboration()?.id === id) {
272:         this.selectedCollaborationState.set(null);
273:       }
274:     } catch (error) {
275:       this.errorState.set(error instanceof Error ? error.message : '删除协作关系失败');
276:       throw error;
277:     } finally {
278:       this.loadingState.set(false);
279:     }
280:   }
281: 
282:   /**
283:    * 选择协作关系
284:    */
285:   selectCollaboration(collaboration: OrganizationCollaboration | null): void {
286:     this.selectedCollaborationState.set(collaboration);
287:   }
288: 
289:   /**
290:    * 重置状态
291:    */
292:   reset(): void {
293:     this.collaborationsState.set([]);
294:     this.selectedCollaborationState.set(null);
295:     this.errorState.set(null);
296:   }
297: }
````

## File: src/app/shared/services/collaboration/index.ts
````typescript
1: /**
2:  * Collaboration Services
3:  * 
4:  * 组织协作系统相关的服务
5:  */
6: export * from './collaboration.service';
7: export * from './invitation.service';
````

## File: src/app/shared/services/collaboration/invitation.service.spec.ts
````typescript
  1: import { TestBed } from '@angular/core/testing';
  2: import { of, throwError } from 'rxjs';
  3: import { CollaborationInvitationRepository, InvitationStatus } from '@core';
  4: import { InvitationService } from './invitation.service';
  5: import { CollaborationInvitation } from '@shared';
  6: 
  7: describe('InvitationService', () => {
  8:   let service: InvitationService;
  9:   let repository: jasmine.SpyObj<CollaborationInvitationRepository>;
 10: 
 11:   const mockInvitation: CollaborationInvitation = {
 12:     id: 'inv-1',
 13:     blueprint_id: 'blueprint-1',
 14:     from_org_id: 'org-1',
 15:     to_org_id: 'org-2',
 16:     invitation_message: 'Test invitation',
 17:     status: InvitationStatus.PENDING,
 18:     expires_at: '2025-12-31T23:59:59Z',
 19:     responded_at: null,
 20:     created_at: '2025-01-01T00:00:00Z'
 21:   } as CollaborationInvitation;
 22: 
 23:   const mockInvitations: CollaborationInvitation[] = [
 24:     mockInvitation,
 25:     {
 26:       ...mockInvitation,
 27:       id: 'inv-2',
 28:       status: InvitationStatus.ACCEPTED,
 29:       responded_at: '2025-01-02T00:00:00Z'
 30:     },
 31:     {
 32:       ...mockInvitation,
 33:       id: 'inv-3',
 34:       status: InvitationStatus.EXPIRED,
 35:       expires_at: '2024-01-01T00:00:00Z'
 36:     }
 37:   ];
 38: 
 39:   beforeEach(() => {
 40:     const repositorySpy = jasmine.createSpyObj('CollaborationInvitationRepository', [
 41:       'findAll',
 42:       'findById',
 43:       'findByBlueprintId',
 44:       'findByFromOrgId',
 45:       'findByToOrgId',
 46:       'findByStatus',
 47:       'findPending',
 48:       'findExpired',
 49:       'create',
 50:       'update',
 51:       'delete'
 52:     ]);
 53: 
 54:     TestBed.configureTestingModule({
 55:       providers: [
 56:         InvitationService,
 57:         { provide: CollaborationInvitationRepository, useValue: repositorySpy }
 58:       ]
 59:     });
 60: 
 61:     service = TestBed.inject(InvitationService);
 62:     repository = TestBed.inject(
 63:       CollaborationInvitationRepository
 64:     ) as jasmine.SpyObj<CollaborationInvitationRepository>;
 65:   });
 66: 
 67:   it('should be created', () => {
 68:     expect(service).toBeTruthy();
 69:   });
 70: 
 71:   describe('Initial state', () => {
 72:     it('should have empty invitations', () => {
 73:       expect(service.invitations().length).toBe(0);
 74:     });
 75: 
 76:     it('should have null selected invitation', () => {
 77:       expect(service.selectedInvitation()).toBeNull();
 78:     });
 79: 
 80:     it('should have false loading state', () => {
 81:       expect(service.loading()).toBe(false);
 82:     });
 83: 
 84:     it('should have null error state', () => {
 85:       expect(service.error()).toBeNull();
 86:     });
 87:   });
 88: 
 89:   describe('loadInvitations', () => {
 90:     it('should load invitations successfully', async () => {
 91:       repository.findAll.and.returnValue(of(mockInvitations));
 92: 
 93:       await service.loadInvitations();
 94: 
 95:       expect(service.invitations().length).toBe(3);
 96:       expect(service.invitations()[0].id).toBe('inv-1');
 97:       expect(service.loading()).toBe(false);
 98:       expect(service.error()).toBeNull();
 99:     });
100: 
101:     it('should handle error when loading fails', async () => {
102:       const error = new Error('Load failed');
103:       repository.findAll.and.returnValue(throwError(() => error));
104: 
105:       try {
106:         await service.loadInvitations();
107:         fail('should have thrown error');
108:       } catch (e) {
109:         expect(service.error()).toBe('Load failed');
110:         expect(service.loading()).toBe(false);
111:       }
112:     });
113:   });
114: 
115:   describe('loadInvitationById', () => {
116:     it('should load invitation by id successfully', async () => {
117:       repository.findById.and.returnValue(of(mockInvitation));
118: 
119:       const result = await service.loadInvitationById('inv-1');
120: 
121:       expect(result).toEqual(mockInvitation);
122:       expect(service.selectedInvitation()).toEqual(mockInvitation);
123:     });
124: 
125:     it('should return null when invitation not found', async () => {
126:       repository.findById.and.returnValue(of(null));
127: 
128:       const result = await service.loadInvitationById('non-existent');
129: 
130:       expect(result).toBeNull();
131:     });
132:   });
133: 
134:   describe('loadInvitationsByBlueprintId', () => {
135:     it('should load invitations by blueprint id', async () => {
136:       repository.findByBlueprintId.and.returnValue(of(mockInvitations));
137: 
138:       const result = await service.loadInvitationsByBlueprintId('blueprint-1');
139: 
140:       expect(result.length).toBe(3);
141:       expect(repository.findByBlueprintId).toHaveBeenCalledWith('blueprint-1');
142:     });
143:   });
144: 
145:   describe('loadInvitationsByFromOrgId', () => {
146:     it('should load invitations by from org id', async () => {
147:       repository.findByFromOrgId.and.returnValue(of(mockInvitations));
148: 
149:       const result = await service.loadInvitationsByFromOrgId('org-1');
150: 
151:       expect(result.length).toBe(3);
152:       expect(repository.findByFromOrgId).toHaveBeenCalledWith('org-1');
153:     });
154:   });
155: 
156:   describe('loadInvitationsByToOrgId', () => {
157:     it('should load invitations by to org id', async () => {
158:       repository.findByToOrgId.and.returnValue(of(mockInvitations));
159: 
160:       const result = await service.loadInvitationsByToOrgId('org-2');
161: 
162:       expect(result.length).toBe(3);
163:       expect(repository.findByToOrgId).toHaveBeenCalledWith('org-2');
164:     });
165:   });
166: 
167:   describe('loadInvitationsByStatus', () => {
168:     it('should load invitations by status', async () => {
169:       repository.findByStatus.and.returnValue(of([mockInvitation]));
170: 
171:       const result = await service.loadInvitationsByStatus(InvitationStatus.PENDING);
172: 
173:       expect(result.length).toBe(1);
174:       expect(repository.findByStatus).toHaveBeenCalledWith(InvitationStatus.PENDING);
175:     });
176:   });
177: 
178:   describe('loadPendingInvitations', () => {
179:     it('should load pending invitations', async () => {
180:       repository.findPending.and.returnValue(of([mockInvitation]));
181: 
182:       const result = await service.loadPendingInvitations();
183: 
184:       expect(result.length).toBe(1);
185:       expect(repository.findPending).toHaveBeenCalled();
186:     });
187:   });
188: 
189:   describe('loadExpiredInvitations', () => {
190:     it('should load expired invitations', async () => {
191:       repository.findExpired.and.returnValue(of([mockInvitations[2]]));
192: 
193:       const result = await service.loadExpiredInvitations();
194: 
195:       expect(result.length).toBe(1);
196:       expect(repository.findExpired).toHaveBeenCalled();
197:     });
198:   });
199: 
200:   describe('createInvitation', () => {
201:     it('should create invitation successfully', async () => {
202:       const newInvitation = { ...mockInvitation, id: 'inv-new' };
203:       repository.create.and.returnValue(of(newInvitation));
204: 
205:       const result = await service.createInvitation({
206:         blueprint_id: 'blueprint-1',
207:         from_org_id: 'org-1',
208:         to_org_id: 'org-2',
209:         expires_at: '2025-12-31T23:59:59Z'
210:       });
211: 
212:       expect(result).toEqual(newInvitation);
213:       expect(service.invitations().length).toBe(1);
214:     });
215:   });
216: 
217:   describe('updateInvitation', () => {
218:     beforeEach(() => {
219:       service['invitationsState'].set(mockInvitations);
220:     });
221: 
222:     it('should update invitation successfully', async () => {
223:       const updated = { ...mockInvitation, invitation_message: 'Updated message' };
224:       repository.update.and.returnValue(of(updated));
225: 
226:       const result = await service.updateInvitation('inv-1', {
227:         invitation_message: 'Updated message'
228:       });
229: 
230:       expect(result).toEqual(updated);
231:       expect(service.invitations()[0].invitation_message).toBe('Updated message');
232:     });
233:   });
234: 
235:   describe('acceptInvitation', () => {
236:     beforeEach(() => {
237:       service['invitationsState'].set([mockInvitation]);
238:     });
239: 
240:     it('should accept invitation successfully', async () => {
241:       const accepted = {
242:         ...mockInvitation,
243:         status: InvitationStatus.ACCEPTED,
244:         responded_at: new Date().toISOString()
245:       };
246:       repository.update.and.returnValue(of(accepted));
247: 
248:       const result = await service.acceptInvitation('inv-1');
249: 
250:       expect(result.status).toBe(InvitationStatus.ACCEPTED);
251:       expect(result.responded_at).toBeTruthy();
252:       expect(repository.update).toHaveBeenCalledWith('inv-1', jasmine.any(Object));
253:     });
254:   });
255: 
256:   describe('rejectInvitation', () => {
257:     beforeEach(() => {
258:       service['invitationsState'].set([mockInvitation]);
259:     });
260: 
261:     it('should reject invitation successfully', async () => {
262:       const rejected = {
263:         ...mockInvitation,
264:         status: InvitationStatus.REJECTED,
265:         responded_at: new Date().toISOString()
266:       };
267:       repository.update.and.returnValue(of(rejected));
268: 
269:       const result = await service.rejectInvitation('inv-1');
270: 
271:       expect(result.status).toBe(InvitationStatus.REJECTED);
272:       expect(result.responded_at).toBeTruthy();
273:       expect(repository.update).toHaveBeenCalledWith('inv-1', jasmine.any(Object));
274:     });
275:   });
276: 
277:   describe('deleteInvitation', () => {
278:     beforeEach(() => {
279:       service['invitationsState'].set(mockInvitations);
280:     });
281: 
282:     it('should delete invitation successfully', async () => {
283:       repository.delete.and.returnValue(of(undefined));
284: 
285:       await service.deleteInvitation('inv-1');
286: 
287:       expect(service.invitations().length).toBe(2);
288:       expect(service.invitations()[0].id).toBe('inv-2');
289:     });
290: 
291:     it('should clear selected invitation if deleted', async () => {
292:       service.selectInvitation(mockInvitation);
293:       repository.delete.and.returnValue(of(undefined));
294: 
295:       await service.deleteInvitation('inv-1');
296: 
297:       expect(service.selectedInvitation()).toBeNull();
298:     });
299:   });
300: 
301:   describe('selectInvitation', () => {
302:     it('should select invitation', () => {
303:       service.selectInvitation(mockInvitation);
304: 
305:       expect(service.selectedInvitation()).toEqual(mockInvitation);
306:     });
307:   });
308: 
309:   describe('reset', () => {
310:     it('should reset all state', () => {
311:       service['invitationsState'].set(mockInvitations);
312:       service.selectInvitation(mockInvitation);
313:       service['errorState'].set('Some error');
314: 
315:       service.reset();
316: 
317:       expect(service.invitations().length).toBe(0);
318:       expect(service.selectedInvitation()).toBeNull();
319:       expect(service.error()).toBeNull();
320:     });
321:   });
322: 
323:   describe('Computed signals', () => {
324:     beforeEach(() => {
325:       service['invitationsState'].set(mockInvitations);
326:     });
327: 
328:     it('should compute pendingInvitations', () => {
329:       expect(service.pendingInvitations().length).toBe(1);
330:       expect(service.pendingInvitations()[0].status).toBe(InvitationStatus.PENDING);
331:     });
332: 
333:     it('should compute acceptedInvitations', () => {
334:       expect(service.acceptedInvitations().length).toBe(1);
335:       expect(service.acceptedInvitations()[0].status).toBe(InvitationStatus.ACCEPTED);
336:     });
337: 
338:     it('should compute expiredInvitations', () => {
339:       expect(service.expiredInvitations().length).toBe(1);
340:       expect(service.expiredInvitations()[0].id).toBe('inv-3');
341:     });
342:   });
343: });
````

## File: src/app/shared/services/collaboration/invitation.service.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { signal, computed } from '@angular/core';
  3: import { Observable, firstValueFrom } from 'rxjs';
  4: import {
  5:   CollaborationInvitationRepository,
  6:   CollaborationInvitationInsert,
  7:   CollaborationInvitationUpdate,
  8:   InvitationStatus
  9: } from '@core';
 10: import { CollaborationInvitation } from '@shared';
 11: 
 12: /**
 13:  * Invitation Service
 14:  * 
 15:  * 提供协作邀请相关的业务逻辑和状态管理
 16:  * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 17:  * 
 18:  * @example
 19:  * ```typescript
 20:  * const invitationService = inject(InvitationService);
 21:  * 
 22:  * // 订阅邀请列表
 23:  * effect(() => {
 24:  *   console.log('Invitations:', invitationService.invitations());
 25:  * });
 26:  * 
 27:  * // 加载邀请列表
 28:  * await invitationService.loadInvitations();
 29:  * ```
 30:  */
 31: @Injectable({
 32:   providedIn: 'root'
 33: })
 34: export class InvitationService {
 35:   private invitationRepository = inject(CollaborationInvitationRepository);
 36: 
 37:   // 使用 Signals 管理状态
 38:   private invitationsState = signal<CollaborationInvitation[]>([]);
 39:   private selectedInvitationState = signal<CollaborationInvitation | null>(null);
 40:   private loadingState = signal<boolean>(false);
 41:   private errorState = signal<string | null>(null);
 42: 
 43:   // 暴露 ReadonlySignal 给组件
 44:   readonly invitations = this.invitationsState.asReadonly();
 45:   readonly selectedInvitation = this.selectedInvitationState.asReadonly();
 46:   readonly loading = this.loadingState.asReadonly();
 47:   readonly error = this.errorState.asReadonly();
 48: 
 49:   // Computed signals
 50:   readonly pendingInvitations = computed(() =>
 51:     this.invitations().filter(i => i.status === InvitationStatus.PENDING)
 52:   );
 53: 
 54:   readonly acceptedInvitations = computed(() =>
 55:     this.invitations().filter(i => i.status === InvitationStatus.ACCEPTED)
 56:   );
 57: 
 58:   readonly expiredInvitations = computed(() =>
 59:     this.invitations().filter(i => {
 60:       if (!i.expires_at) return false;
 61:       return new Date(i.expires_at) < new Date();
 62:     })
 63:   );
 64: 
 65:   /**
 66:    * 加载所有邀请
 67:    */
 68:   async loadInvitations(): Promise<void> {
 69:     this.loadingState.set(true);
 70:     this.errorState.set(null);
 71: 
 72:     try {
 73:       const invitations = await firstValueFrom(this.invitationRepository.findAll());
 74:       this.invitationsState.set(invitations);
 75:     } catch (error) {
 76:       this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
 77:       throw error;
 78:     } finally {
 79:       this.loadingState.set(false);
 80:     }
 81:   }
 82: 
 83:   /**
 84:    * 根据 ID 加载邀请
 85:    */
 86:   async loadInvitationById(id: string): Promise<CollaborationInvitation | null> {
 87:     this.loadingState.set(true);
 88:     this.errorState.set(null);
 89: 
 90:     try {
 91:       const invitation = await firstValueFrom(this.invitationRepository.findById(id));
 92:       if (invitation) {
 93:         this.selectedInvitationState.set(invitation);
 94:       }
 95:       return invitation;
 96:     } catch (error) {
 97:       this.errorState.set(error instanceof Error ? error.message : '加载邀请失败');
 98:       throw error;
 99:     } finally {
100:       this.loadingState.set(false);
101:     }
102:   }
103: 
104:   /**
105:    * 根据蓝图 ID 加载邀请
106:    */
107:   async loadInvitationsByBlueprintId(blueprintId: string): Promise<CollaborationInvitation[]> {
108:     this.loadingState.set(true);
109:     this.errorState.set(null);
110: 
111:     try {
112:       const invitations = await firstValueFrom(
113:         this.invitationRepository.findByBlueprintId(blueprintId)
114:       );
115:       return invitations;
116:     } catch (error) {
117:       this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
118:       throw error;
119:     } finally {
120:       this.loadingState.set(false);
121:     }
122:   }
123: 
124:   /**
125:    * 根据发送组织 ID 加载邀请
126:    */
127:   async loadInvitationsByFromOrgId(fromOrgId: string): Promise<CollaborationInvitation[]> {
128:     this.loadingState.set(true);
129:     this.errorState.set(null);
130: 
131:     try {
132:       const invitations = await firstValueFrom(
133:         this.invitationRepository.findByFromOrgId(fromOrgId)
134:       );
135:       return invitations;
136:     } catch (error) {
137:       this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
138:       throw error;
139:     } finally {
140:       this.loadingState.set(false);
141:     }
142:   }
143: 
144:   /**
145:    * 根据接收组织 ID 加载邀请
146:    */
147:   async loadInvitationsByToOrgId(toOrgId: string): Promise<CollaborationInvitation[]> {
148:     this.loadingState.set(true);
149:     this.errorState.set(null);
150: 
151:     try {
152:       const invitations = await firstValueFrom(
153:         this.invitationRepository.findByToOrgId(toOrgId)
154:       );
155:       return invitations;
156:     } catch (error) {
157:       this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
158:       throw error;
159:     } finally {
160:       this.loadingState.set(false);
161:     }
162:   }
163: 
164:   /**
165:    * 根据状态加载邀请
166:    */
167:   async loadInvitationsByStatus(status: InvitationStatus): Promise<CollaborationInvitation[]> {
168:     this.loadingState.set(true);
169:     this.errorState.set(null);
170: 
171:     try {
172:       const invitations = await firstValueFrom(
173:         this.invitationRepository.findByStatus(status)
174:       );
175:       return invitations;
176:     } catch (error) {
177:       this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
178:       throw error;
179:     } finally {
180:       this.loadingState.set(false);
181:     }
182:   }
183: 
184:   /**
185:    * 加载待处理邀请
186:    */
187:   async loadPendingInvitations(): Promise<CollaborationInvitation[]> {
188:     this.loadingState.set(true);
189:     this.errorState.set(null);
190: 
191:     try {
192:       const invitations = await firstValueFrom(this.invitationRepository.findPending());
193:       return invitations;
194:     } catch (error) {
195:       this.errorState.set(error instanceof Error ? error.message : '加载待处理邀请失败');
196:       throw error;
197:     } finally {
198:       this.loadingState.set(false);
199:     }
200:   }
201: 
202:   /**
203:    * 加载过期邀请
204:    */
205:   async loadExpiredInvitations(): Promise<CollaborationInvitation[]> {
206:     this.loadingState.set(true);
207:     this.errorState.set(null);
208: 
209:     try {
210:       const invitations = await firstValueFrom(this.invitationRepository.findExpired());
211:       return invitations;
212:     } catch (error) {
213:       this.errorState.set(error instanceof Error ? error.message : '加载过期邀请失败');
214:       throw error;
215:     } finally {
216:       this.loadingState.set(false);
217:     }
218:   }
219: 
220:   /**
221:    * 创建邀请
222:    */
223:   async createInvitation(data: CollaborationInvitationInsert): Promise<CollaborationInvitation> {
224:     this.loadingState.set(true);
225:     this.errorState.set(null);
226: 
227:     try {
228:       const invitation = await firstValueFrom(this.invitationRepository.create(data));
229:       // 更新本地状态
230:       this.invitationsState.update(invitations => [...invitations, invitation]);
231:       return invitation;
232:     } catch (error) {
233:       this.errorState.set(error instanceof Error ? error.message : '创建邀请失败');
234:       throw error;
235:     } finally {
236:       this.loadingState.set(false);
237:     }
238:   }
239: 
240:   /**
241:    * 更新邀请
242:    */
243:   async updateInvitation(
244:     id: string,
245:     data: CollaborationInvitationUpdate
246:   ): Promise<CollaborationInvitation> {
247:     this.loadingState.set(true);
248:     this.errorState.set(null);
249: 
250:     try {
251:       const invitation = await firstValueFrom(this.invitationRepository.update(id, data));
252:       // 更新本地状态
253:       this.invitationsState.update(invitations =>
254:         invitations.map(i => (i.id === id ? invitation : i))
255:       );
256:       // 如果更新的是当前选中的邀请，也更新选中状态
257:       if (this.selectedInvitation()?.id === id) {
258:         this.selectedInvitationState.set(invitation);
259:       }
260:       return invitation;
261:     } catch (error) {
262:       this.errorState.set(error instanceof Error ? error.message : '更新邀请失败');
263:       throw error;
264:     } finally {
265:       this.loadingState.set(false);
266:     }
267:   }
268: 
269:   /**
270:    * 接受邀请
271:    */
272:   async acceptInvitation(id: string): Promise<CollaborationInvitation> {
273:     return this.updateInvitation(id, {
274:       status: InvitationStatus.ACCEPTED,
275:       responded_at: new Date().toISOString()
276:     });
277:   }
278: 
279:   /**
280:    * 拒绝邀请
281:    */
282:   async rejectInvitation(id: string): Promise<CollaborationInvitation> {
283:     return this.updateInvitation(id, {
284:       status: InvitationStatus.REJECTED,
285:       responded_at: new Date().toISOString()
286:     });
287:   }
288: 
289:   /**
290:    * 删除邀请
291:    */
292:   async deleteInvitation(id: string): Promise<void> {
293:     this.loadingState.set(true);
294:     this.errorState.set(null);
295: 
296:     try {
297:       await firstValueFrom(this.invitationRepository.delete(id));
298:       // 更新本地状态
299:       this.invitationsState.update(invitations => invitations.filter(i => i.id !== id));
300:       // 如果删除的是当前选中的邀请，清空选中状态
301:       if (this.selectedInvitation()?.id === id) {
302:         this.selectedInvitationState.set(null);
303:       }
304:     } catch (error) {
305:       this.errorState.set(error instanceof Error ? error.message : '删除邀请失败');
306:       throw error;
307:     } finally {
308:       this.loadingState.set(false);
309:     }
310:   }
311: 
312:   /**
313:    * 选择邀请
314:    */
315:   selectInvitation(invitation: CollaborationInvitation | null): void {
316:     this.selectedInvitationState.set(invitation);
317:   }
318: 
319:   /**
320:    * 重置状态
321:    */
322:   reset(): void {
323:     this.invitationsState.set([]);
324:     this.selectedInvitationState.set(null);
325:     this.errorState.set(null);
326:   }
327: }
````

## File: src/app/shared/shared-delon.module.ts
````typescript
  1: // ========== @delon/abc 組件模組 ==========
  2: // 文本超出省略顯示 — https://ng-alain.com/components/ellipsis
  3: import { CellModule } from '@delon/abc/cell';
  4: import { CountDownModule } from '@delon/abc/count-down';
  5: import { DownFileDirective } from '@delon/abc/down-file';
  6: import { EllipsisComponent } from '@delon/abc/ellipsis';
  7: // 頁面底部操作工具欄 — https://ng-alain.com/components/footer-toolbar
  8: import { ExceptionModule } from '@delon/abc/exception';
  9: import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
 10: // 內容區全屏/填充切換 — https://ng-alain.com/components/full-content
 11: import { FullContentModule } from '@delon/abc/full-content';
 12: // 頁面標題區（麵包屑、操作區） — https://ng-alain.com/components/page-header
 13: import { GlobalFooterModule } from '@delon/abc/global-footer';
 14: import { NoticeIconModule } from '@delon/abc/notice-icon';
 15: import { OnboardingModule } from '@delon/abc/onboarding';
 16: import { PageHeaderModule } from '@delon/abc/page-header';
 17: // SE：簡潔表單佈局（快速排版表單項） — https://ng-alain.com/components/se
 18: import { QuickMenuModule } from '@delon/abc/quick-menu';
 19: import { ReuseTabModule } from '@delon/abc/reuse-tab';
 20: import { SEModule } from '@delon/abc/se';
 21: // ST：Smart Table 智能表格 — https://ng-alain.com/components/st
 22: import { STModule } from '@delon/abc/st';
 23: // SV：簡單視圖，用於鍵值描述展示 — https://ng-alain.com/components/sv
 24: import { SVModule } from '@delon/abc/sv';
 25: // Tag 多選與展開/收起選擇器 — https://ng-alain.com/components/tag-select
 26: import { TagSelectComponent } from '@delon/abc/tag-select';
 27: // ReuseTab 標籤頁（路由快取） — https://ng-alain.com/components/reuse-tab
 28: // 引導式操作 — https://ng-alain.com/components/onboarding
 29: // 快捷菜單 — https://ng-alain.com/components/quick-menu
 30: // 倒計時 — https://ng-alain.com/components/count-down
 31: // 全局頁腳 — https://ng-alain.com/components/global-footer
 32: // 異常頁面 — https://ng-alain.com/components/exception
 33: // 通知圖標 — https://ng-alain.com/components/notice-icon
 34: // 下載文件指令 — https://ng-alain.com/components/down-file
 35: // ACL 訪問控制指令（顯示/隱藏/條件） — https://ng-alain.com/acl
 36: import { ACLDirective, ACLIfDirective } from '@delon/acl';
 37: // 動態表單（基於 JSON Schema 的表單生成與驗證） — https://ng-alain.com/form
 38: // 金額/貨幣格式化管道 — https://ng-alain.com/util
 39: // 圖表組件 — https://ng-alain.com/docs/chart
 40: // 注意：@delon/chart 必須從子模組導入，而非從 @delon/chart 直接導入
 41: // 柱狀圖 — https://ng-alain.com/chart/bar
 42: import { G2BarModule } from '@delon/chart/bar';
 43: // 圖表卡片 — https://ng-alain.com/chart/card
 44: import { G2CardModule } from '@delon/chart/card';
 45: // ECharts 圖表 — https://ng-alain.com/chart/chart-echarts
 46: import { ChartEChartsModule } from '@delon/chart/chart-echarts';
 47: // 儀表盤 — https://ng-alain.com/chart/gauge
 48: import { G2GaugeModule } from '@delon/chart/gauge';
 49: // 迷你面積圖 — https://ng-alain.com/chart/mini-area
 50: import { G2MiniAreaModule } from '@delon/chart/mini-area';
 51: // 迷你柱狀圖 — https://ng-alain.com/chart/mini-bar
 52: import { G2MiniBarModule } from '@delon/chart/mini-bar';
 53: // 迷你進度條 — https://ng-alain.com/chart/mini-progress
 54: import { G2MiniProgressModule } from '@delon/chart/mini-progress';
 55: // 數據文本 — https://ng-alain.com/chart/number-info
 56: import { NumberInfoModule } from '@delon/chart/number-info';
 57: // 餅圖 — https://ng-alain.com/chart/pie
 58: import { G2PieModule } from '@delon/chart/pie';
 59: // 雷達圖 — https://ng-alain.com/chart/radar
 60: import { G2RadarModule } from '@delon/chart/radar';
 61: // 單一柱狀圖 — https://ng-alain.com/chart/single-bar
 62: import { G2SingleBarModule } from '@delon/chart/single-bar';
 63: // 標籤雲 — https://ng-alain.com/chart/tag-cloud
 64: import { G2TagCloudModule } from '@delon/chart/tag-cloud';
 65: // 時間軸 — https://ng-alain.com/chart/timeline
 66: import { G2TimelineModule } from '@delon/chart/timeline';
 67: // 趨勢標記 — https://ng-alain.com/chart/trend
 68: import { TrendModule } from '@delon/chart/trend';
 69: // 水波圖 — https://ng-alain.com/chart/water-wave
 70: import { G2WaterWaveModule } from '@delon/chart/water-wave';
 71: import { DelonFormModule } from '@delon/form';
 72: import { LayoutDefaultModule } from '@delon/theme/layout-default';
 73: import { SettingDrawerModule } from '@delon/theme/setting-drawer';
 74: import { ThemeBtnComponent } from '@delon/theme/theme-btn';
 75: import { CurrencyPricePipe } from '@delon/util';
 76: // ========== @delon/theme 組件模組 ==========
 77: // 默認佈局 — https://ng-alain.com/theme/layout-default
 78: // 設置抽屜 — https://ng-alain.com/theme/setting-drawer
 79: // 主題切換按鈕 — https://ng-alain.com/theme/theme-btn
 80: 
 81: export const SHARED_DELON_MODULES = [
 82:   CellModule, // 單元格渲染 — https://ng-alain.com/components/cell/zh
 83:   DelonFormModule, // 動態表單 — https://ng-alain.com/form
 84:   STModule, // 智能表格 — https://ng-alain.com/components/st
 85:   SVModule, // 鍵值描述視圖 — https://ng-alain.com/components/sv
 86:   SEModule, // 表單佈局 — https://ng-alain.com/components/se
 87:   PageHeaderModule, // 頁面標題/操作 — https://ng-alain.com/components/page-header
 88:   EllipsisComponent, // 文本省略 — https://ng-alain.com/components/ellipsis
 89:   FooterToolbarModule, // 底部工具欄 — https://ng-alain.com/components/footer-toolbar
 90:   FullContentModule, // 全屏內容 — https://ng-alain.com/components/full-content
 91:   ReuseTabModule, // 標籤頁（路由快取） — https://ng-alain.com/components/reuse-tab
 92:   TagSelectComponent, // 標籤選擇 — https://ng-alain.com/components/tag-select
 93:   OnboardingModule, // 引導式操作 — https://ng-alain.com/components/onboarding
 94:   QuickMenuModule, // 快捷菜單 — https://ng-alain.com/components/quick-menu
 95:   CountDownModule, // 倒計時 — https://ng-alain.com/components/count-down
 96:   GlobalFooterModule, // 全局頁腳 — https://ng-alain.com/components/global-footer
 97:   ExceptionModule, // 異常頁面 — https://ng-alain.com/components/exception
 98:   NoticeIconModule, // 通知圖標 — https://ng-alain.com/components/notice-icon
 99:   DownFileDirective, // 下載文件指令 — https://ng-alain.com/components/down-file
100:   ACLDirective, // ACL 指令 — https://ng-alain.com/acl
101:   ACLIfDirective, // 條件 ACL 指令 — https://ng-alain.com/acl
102:   CurrencyPricePipe, // 金額格式化 — https://ng-alain.com/util
103:   // ========== @delon/theme 組件模組 ==========
104:   LayoutDefaultModule, // 默認佈局 — https://ng-alain.com/theme/layout-default
105:   SettingDrawerModule, // 設置抽屜 — https://ng-alain.com/theme/setting-drawer
106:   ThemeBtnComponent, // 主題切換按鈕 — https://ng-alain.com/theme/theme-btn
107:   // @delon/chart 完整圖表模組套件
108:   G2BarModule, // 柱狀圖 — https://ng-alain.com/chart/bar
109:   G2CardModule, // 圖表卡片 — https://ng-alain.com/chart/card
110:   ChartEChartsModule, // ECharts 圖表 — https://ng-alain.com/chart/chart-echarts
111:   G2GaugeModule, // 儀表盤 — https://ng-alain.com/chart/gauge
112:   G2MiniAreaModule, // 迷你面積圖 — https://ng-alain.com/chart/mini-area
113:   G2MiniBarModule, // 迷你柱狀圖 — https://ng-alain.com/chart/mini-bar
114:   G2MiniProgressModule, // 迷你進度條 — https://ng-alain.com/chart/mini-progress
115:   NumberInfoModule, // 數據文本 — https://ng-alain.com/chart/number-info
116:   G2PieModule, // 餅圖 — https://ng-alain.com/chart/pie
117:   G2RadarModule, // 雷達圖 — https://ng-alain.com/chart/radar
118:   G2SingleBarModule, // 單一柱狀圖 — https://ng-alain.com/chart/single-bar
119:   G2TagCloudModule, // 標籤雲 — https://ng-alain.com/chart/tag-cloud
120:   G2TimelineModule, // 時間軸 — https://ng-alain.com/chart/timeline
121:   TrendModule, // 趨勢標記 — https://ng-alain.com/chart/trend
122:   G2WaterWaveModule // 水波圖 — https://ng-alain.com/chart/water-wave
123: ];
````

## File: src/app/shared/shared-tinymce.module.ts
````typescript
 1: /**
 2:  * ngx-tinymce 富文本編輯器模組
 3:  * 
 4:  * 注意：此模組為可選模組，僅在需要使用 TinyMCE 富文本編輯器時導入
 5:  * 
 6:  * 使用方式：
 7:  * ```typescript
 8:  * import { SHARED_TINYMCE_MODULES } from '@shared/shared-tinymce.module';
 9:  * 
10:  * @Component({
11:  *   imports: [SHARED_IMPORTS, ...SHARED_TINYMCE_MODULES]
12:  * })
13:  * ```
14:  * 
15:  * 或在需要時直接導入：
16:  * ```typescript
17:  * import { EditorModule } from 'ngx-tinymce';
18:  * 
19:  * @Component({
20:  *   imports: [SHARED_IMPORTS, EditorModule]
21:  * })
22:  * ```
23:  * 
24:  * @see https://github.com/ng-alain/ng-alain/tree/master/packages/tinymce
25:  * @see https://www.tiny.cloud/docs/tinymce/latest/
26:  */
27: 
28: // 注意：ngx-tinymce 在 package.json 中已安裝，但當前未使用
29: // 如需使用，請取消下面的註釋並安裝對應的類型定義（如果有的話）
30: // import { EditorModule } from 'ngx-tinymce';
31: 
32: /**
33:  * ngx-tinymce 模組集合
34:  * 
35:  * 目前為空數組，因為項目中尚未使用 TinyMCE 編輯器
36:  * 如需使用，請取消上面的 import 並將 EditorModule 添加到數組中
37:  */
38: export const SHARED_TINYMCE_MODULES: any[] = [
39:   // EditorModule, // TinyMCE 富文本編輯器 — https://github.com/ng-alain/ng-alain/tree/master/packages/tinymce
40: ];
````

## File: src/app/shared/shared-zorro.module.ts
````typescript
  1: import { NzAffixModule } from 'ng-zorro-antd/affix';
  2: import { NzAlertModule } from 'ng-zorro-antd/alert';
  3: import { NzAnchorModule } from 'ng-zorro-antd/anchor';
  4: import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
  5: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
  6: import { NzBackTopModule } from 'ng-zorro-antd/back-top';
  7: import { NzBadgeModule } from 'ng-zorro-antd/badge';
  8: import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
  9: import { NzButtonModule } from 'ng-zorro-antd/button';
 10: import { NzCalendarModule } from 'ng-zorro-antd/calendar';
 11: import { NzCardModule } from 'ng-zorro-antd/card';
 12: import { NzCarouselModule } from 'ng-zorro-antd/carousel';
 13: import { NzCascaderModule } from 'ng-zorro-antd/cascader';
 14: import { NzCheckListModule } from 'ng-zorro-antd/check-list';
 15: import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
 16: import { NzCollapseModule } from 'ng-zorro-antd/collapse';
 17: import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
 18: import { NzCommentModule } from 'ng-zorro-antd/comment';
 19: import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
 20: import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
 21: import { NzDividerModule } from 'ng-zorro-antd/divider';
 22: import { NzDrawerModule } from 'ng-zorro-antd/drawer';
 23: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 24: import { NzEmptyModule } from 'ng-zorro-antd/empty';
 25: import { NzFlexModule } from 'ng-zorro-antd/flex';
 26: import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
 27: import { NzFormModule } from 'ng-zorro-antd/form';
 28: import { NzGridModule } from 'ng-zorro-antd/grid';
 29: import { NzHashCodeModule } from 'ng-zorro-antd/hash-code';
 30: import { NzIconModule } from 'ng-zorro-antd/icon';
 31: import { NzImageModule } from 'ng-zorro-antd/image';
 32: import { NzInputModule } from 'ng-zorro-antd/input';
 33: import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
 34: import { NzLayoutModule } from 'ng-zorro-antd/layout';
 35: import { NzListModule } from 'ng-zorro-antd/list';
 36: import { NzMentionModule } from 'ng-zorro-antd/mention';
 37: import { NzMenuModule } from 'ng-zorro-antd/menu';
 38: import { NzModalModule } from 'ng-zorro-antd/modal';
 39: import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
 40: import { NzPaginationModule } from 'ng-zorro-antd/pagination';
 41: import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
 42: import { NzPopoverModule } from 'ng-zorro-antd/popover';
 43: import { NzProgressModule } from 'ng-zorro-antd/progress';
 44: import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
 45: import { NzRadioModule } from 'ng-zorro-antd/radio';
 46: import { NzRateModule } from 'ng-zorro-antd/rate';
 47: import { NzResultModule } from 'ng-zorro-antd/result';
 48: import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
 49: import { NzSelectModule } from 'ng-zorro-antd/select';
 50: import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
 51: import { NzSliderModule } from 'ng-zorro-antd/slider';
 52: import { NzSpaceModule } from 'ng-zorro-antd/space';
 53: import { NzSpinModule } from 'ng-zorro-antd/spin';
 54: import { NzSplitterModule } from 'ng-zorro-antd/splitter';
 55: import { NzStatisticModule } from 'ng-zorro-antd/statistic';
 56: import { NzStepsModule } from 'ng-zorro-antd/steps';
 57: import { NzSwitchModule } from 'ng-zorro-antd/switch';
 58: import { NzTableModule } from 'ng-zorro-antd/table';
 59: import { NzTabsModule } from 'ng-zorro-antd/tabs';
 60: import { NzTagModule } from 'ng-zorro-antd/tag';
 61: import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
 62: import { NzTimelineModule } from 'ng-zorro-antd/timeline';
 63: import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
 64: import { NzTransferModule } from 'ng-zorro-antd/transfer';
 65: import { NzTreeModule } from 'ng-zorro-antd/tree';
 66: import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
 67: import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
 68: import { NzTypographyModule } from 'ng-zorro-antd/typography';
 69: import { NzUploadModule } from 'ng-zorro-antd/upload';
 70: import { NzWaterMarkModule } from 'ng-zorro-antd/water-mark';
 71: 
 72: export const SHARED_ZORRO_MODULES = [
 73:   // 反饋類組件
 74:   NzAlertModule, // Alert 警告提示 - https://ng.ant.design/components/alert/en
 75:   NzResultModule, // Result 結果 - https://ng.ant.design/components/result/en
 76:   NzSkeletonModule, // Skeleton 骨架屏 - https://ng.ant.design/components/skeleton/en
 77:   NzSpinModule, // Spin 加載中 - https://ng.ant.design/components/spin/en
 78:   NzProgressModule, // Progress 進度條 - https://ng.ant.design/components/progress/en
 79:   NzDrawerModule, // Drawer 抽屜 - https://ng.ant.design/components/drawer/en
 80:   NzModalModule, // Modal 對話框 - https://ng.ant.design/components/modal/en
 81:   NzPopconfirmModule, // Popconfirm 氣泡確認框 - https://ng.ant.design/components/popconfirm/en
 82:   // 注意：Message 和 Notification 在 ng-zorro-antd v20+ 中通過服務提供（NzMessageService, NzNotificationService）
 83:   // 不需要導入模組，可直接注入使用
 84:   // 數據展示類組件
 85:   NzAvatarModule, // Avatar 頭像 - https://ng.ant.design/components/avatar/en
 86:   NzBadgeModule, // Badge 徽標數 - https://ng.ant.design/components/badge/en
 87:   NzCalendarModule, // Calendar 日曆 - https://ng.ant.design/components/calendar/en
 88:   NzCardModule, // Card 卡片 - https://ng.ant.design/components/card/en
 89:   NzCarouselModule, // Carousel 走馬燈 - https://ng.ant.design/components/carousel/en
 90:   NzCollapseModule, // Collapse 折疊面板 - https://ng.ant.design/components/collapse/en
 91:   NzCommentModule, // Comment 評論 - https://ng.ant.design/components/comment/en
 92:   NzDescriptionsModule, // Descriptions 描述列表 - https://ng.ant.design/components/descriptions/en
 93:   NzEmptyModule, // Empty 空狀態 - https://ng.ant.design/components/empty/en
 94:   NzImageModule, // Image 圖片 - https://ng.ant.design/components/image/en
 95:   NzListModule, // List 列表 - https://ng.ant.design/components/list/en
 96:   NzPopoverModule, // Popover 氣泡卡片 - https://ng.ant.design/components/popover/en
 97:   NzQRCodeModule, // QRCode 二維碼 - https://ng.ant.design/components/qr-code/en
 98:   NzSegmentedModule, // Segmented 分段控制器 - https://ng.ant.design/components/segmented/en
 99:   NzStatisticModule, // Statistic 統計 - https://ng.ant.design/components/statistic/en
100:   NzTableModule, // Table 表格 - https://ng.ant.design/components/table/en
101:   NzTagModule, // Tag 標籤 - https://ng.ant.design/components/tag/en
102:   NzTimelineModule, // Timeline 時間軸 - https://ng.ant.design/components/timeline/en
103:   NzTooltipModule, // Tooltip 文字提示 - https://ng.ant.design/components/tooltip/en
104:   NzTreeModule, // Tree 樹形控件 - https://ng.ant.design/components/tree/en
105:   NzTreeViewModule, // TreeView 樹視圖 - https://ng.ant.design/components/tree-view/en
106:   // 數據錄入類組件
107:   NzAutocompleteModule, // AutoComplete 自動完成 - https://ng.ant.design/components/auto-complete/en
108:   NzCascaderModule, // Cascader 級聯選擇 - https://ng.ant.design/components/cascader/en
109:   NzCheckboxModule, // Checkbox 多選框 - https://ng.ant.design/components/checkbox/en
110:   NzColorPickerModule, // ColorPicker 顏色選擇器 - https://ng.ant.design/components/color-picker/en
111:   NzDatePickerModule, // DatePicker 日期選擇框 - https://ng.ant.design/components/date-picker/en
112:   NzFormModule, // Form 表單 - https://ng.ant.design/components/form/en
113:   NzInputModule, // Input 輸入框 - https://ng.ant.design/components/input/en
114:   NzInputNumberModule, // InputNumber 數字輸入框 - https://ng.ant.design/components/input-number/en
115:   NzMentionModule, // Mention 提及 - https://ng.ant.design/components/mention/en
116:   NzRadioModule, // Radio 單選框 - https://ng.ant.design/components/radio/en
117:   NzRateModule, // Rate 評分 - https://ng.ant.design/components/rate/en
118:   NzSelectModule, // Select 選擇器 - https://ng.ant.design/components/select/en
119:   NzSliderModule, // Slider 滑動輸入條 - https://ng.ant.design/components/slider/en
120:   NzSwitchModule, // Switch 開關 - https://ng.ant.design/components/switch/en
121:   NzTimePickerModule, // TimePicker 時間選擇框 - https://ng.ant.design/components/time-picker/en
122:   NzTransferModule, // Transfer 穿梭框 - https://ng.ant.design/components/transfer/en
123:   NzTreeSelectModule, // TreeSelect 樹選擇 - https://ng.ant.design/components/tree-select/en
124:   NzUploadModule, // Upload 上傳 - https://ng.ant.design/components/upload/en
125:   // 佈局類組件
126:   NzDividerModule, // Divider 分割線 - https://ng.ant.design/components/divider/en
127:   NzFlexModule, // Flex 彈性佈局 - https://ng.ant.design/components/flex/en
128:   NzGridModule, // Grid 柵格 - https://ng.ant.design/components/grid/en
129:   NzLayoutModule, // Layout 佈局 - https://ng.ant.design/components/layout/en
130:   NzSpaceModule, // Space 間距 - https://ng.ant.design/components/space/en
131:   NzSplitterModule, // Splitter 分隔面板 - https://ng.ant.design/components/splitter/en
132:   // 通用類組件
133:   NzButtonModule, // Button 按鈕 - https://ng.ant.design/components/button/en
134:   NzFloatButtonModule, // FloatButton 懸浮按鈕 - https://ng.ant.design/components/float-button/en
135:   NzIconModule, // Icon 圖標 - https://ng.ant.design/components/icon/en
136:   NzTypographyModule, // Typography 排版 - https://ng.ant.design/components/typography/en
137:   // 導航類組件
138:   NzAnchorModule, // Anchor 錨點 - https://ng.ant.design/components/anchor/en
139:   NzBreadCrumbModule, // Breadcrumb 麵包屑 - https://ng.ant.design/components/breadcrumb/en
140:   NzDropDownModule, // Dropdown 下拉菜單 - https://ng.ant.design/components/dropdown/en
141:   NzMenuModule, // Menu 導航菜單 - https://ng.ant.design/components/menu/en
142:   NzPageHeaderModule, // PageHeader 頁頭 - https://ng.ant.design/components/page-header/en
143:   NzPaginationModule, // Pagination 分頁 - https://ng.ant.design/components/pagination/en
144:   NzStepsModule, // Steps 步驟條 - https://ng.ant.design/components/steps/en
145:   NzTabsModule, // Tabs 標籤頁 - https://ng.ant.design/components/tabs/en
146:   // 其他類組件
147:   NzAffixModule, // Affix 固釘 - https://ng.ant.design/components/affix/en
148:   NzBackTopModule, // BackTop 返回頂部 - https://ng.ant.design/components/back-top/en
149:   NzWaterMarkModule, // WaterMark 水印 - https://ng.ant.design/components/water-mark/en
150:   // 特色組件
151:   NzCheckListModule, // CheckList 任務清單 - https://ng.ant.design/components/check-list/en
152:   NzHashCodeModule // HashCode 哈希碼 - https://ng.ant.design/components/hash-code/en
153: ];
````

## File: src/app/shared/st-widget/index.ts
````typescript
1: import type { STWidgetProvideConfig } from '@delon/abc/st';
2: 
3: export const ST_WIDGETS: STWidgetProvideConfig[] = [];
````

## File: src/app/shared/utils/yuan.ts
````typescript
 1: /**
 2:  * 转化成RMB元字符串
 3:  *
 4:  * @param digits 当数字类型时，允许指定小数点后数字的个数，默认2位小数
 5:  */
 6: export function yuan(value: number | string, digits = 2): string {
 7:   if (typeof value === 'number') {
 8:     value = value.toFixed(digits);
 9:   }
10:   return `&yen ${value}`;
11: }
````

## File: src/environments/environment.prod.ts
````typescript
 1: import { Environment } from '@delon/theme';
 2: 
 3: export const environment = {
 4:   production: true,
 5:   useHash: true,
 6:   api: {
 7:     baseUrl: './',
 8:     refreshTokenEnabled: true,
 9:     refreshTokenType: 'auth-refresh'
10:   },
11:   supabase: {
12:     url: 'https://pfxxjtvnqptdvjfakotc.supabase.co',
13:     anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmeHhqdHZucXB0ZHZqZmFrb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzgwNjMsImV4cCI6MjA3ODY1NDA2M30.xADVH2fTd4059lZSZWpIM6CSeiixm0VCgN0SC5bKGxo',
14:     storage: {
15:       documentBucket: 'blueprint-documents'
16:     }
17:   }
18: } as Environment;
````

## File: src/environments/environment.ts
````typescript
 1: // This file can be replaced during build by using the `fileReplacements` array.
 2: // `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
 3: // The list of file replacements can be found in `angular.json`.
 4: 
 5: import * as MOCKDATA from '@_mock';
 6: import { mockInterceptor, provideMockConfig } from '@delon/mock';
 7: import { Environment } from '@delon/theme';
 8: 
 9: export const environment = {
10:   production: false,
11:   useHash: true,
12:   api: {
13:     baseUrl: './',
14:     refreshTokenEnabled: true,
15:     refreshTokenType: 'auth-refresh'
16:   },
17:   supabase: {
18:     url: 'https://pfxxjtvnqptdvjfakotc.supabase.co',
19:     anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmeHhqdHZucXB0ZHZqZmFrb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzgwNjMsImV4cCI6MjA3ODY1NDA2M30.xADVH2fTd4059lZSZWpIM6CSeiixm0VCgN0SC5bKGxo',
20:     storage: {
21:       documentBucket: 'blueprint-documents'
22:     }
23:   },
24:   providers: [provideMockConfig({ data: MOCKDATA })],
25:   interceptorFns: [mockInterceptor]
26: } as Environment;
````

## File: src/main.ts
````typescript
1: import { bootstrapApplication } from '@angular/platform-browser';
2: 
3: import { AppComponent } from './app/app.component';
4: import { appConfig } from './app/app.config';
5: 
6: bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
````

## File: src/style-icons-auto.ts
````typescript
  1: /*
  2:  * Automatically generated by 'ng g ng-alain:plugin icon'
  3:  * @see https://ng-alain.com/cli/plugin#icon
  4:  */
  5: 
  6: import {
  7:   AlipayCircleOutline,
  8:   ApiOutline,
  9:   AppstoreOutline,
 10:   ArrowDownOutline,
 11:   BookOutline,
 12:   BorderLeftOutline,
 13:   BorderRightOutline,
 14:   CloudOutline,
 15:   CopyrightOutline,
 16:   CustomerServiceOutline,
 17:   DashboardOutline,
 18:   DatabaseOutline,
 19:   DingdingOutline,
 20:   DislikeOutline,
 21:   DownloadOutline,
 22:   ForkOutline,
 23:   FrownOutline,
 24:   FullscreenExitOutline,
 25:   FullscreenOutline,
 26:   GithubOutline,
 27:   GlobalOutline,
 28:   HddOutline,
 29:   LaptopOutline,
 30:   LikeOutline,
 31:   LockOutline,
 32:   LogoutOutline,
 33:   MailOutline,
 34:   MenuFoldOutline,
 35:   MenuUnfoldOutline,
 36:   MessageOutline,
 37:   PayCircleOutline,
 38:   PieChartOutline,
 39:   PrinterOutline,
 40:   RocketOutline,
 41:   ScanOutline,
 42:   SettingOutline,
 43:   ShareAltOutline,
 44:   ShoppingCartOutline,
 45:   SoundOutline,
 46:   StarOutline,
 47:   TaobaoCircleOutline,
 48:   TaobaoOutline,
 49:   TeamOutline,
 50:   ToolOutline,
 51:   TrophyOutline,
 52:   UsbOutline,
 53:   UserOutline,
 54:   WeiboCircleOutline,
 55:   ApartmentOutline,
 56:   SwapOutline,
 57:   PlusOutline,
 58:   ArrowLeftOutline,
 59:   LinkOutline,
 60:   SearchOutline,
 61:   CheckOutline,
 62:   CloseCircleOutline,
 63:   UploadOutline,
 64:   CheckCircleOutline,
 65:   EllipsisOutline,
 66:   ArrowRightOutline,
 67:   InfoCircleOutline,
 68:   CheckSquareOutline,
 69:   EditOutline,
 70:   DeleteOutline,
 71:   SaveOutline,
 72:   FileOutline,
 73:   FileAddOutline,
 74:   FileTextOutline,
 75:   FolderOutline,
 76:   FolderOpenOutline,
 77:   FolderAddOutline,
 78:   UnorderedListOutline,
 79:   OrderedListOutline,
 80:   TableOutline,
 81:   ClockCircleOutline,
 82:   CalendarOutline,
 83:   ScheduleOutline,
 84:   SafetyOutline,
 85:   BellOutline,
 86:   ExclamationCircleOutline,
 87:   WarningOutline,
 88:   MinusCircleOutline,
 89:   ReloadOutline,
 90:   SyncOutline,
 91:   RedoOutline,
 92:   UndoOutline,
 93:   RotateLeftOutline,
 94:   HomeOutline,
 95:   MenuOutline,
 96:   HistoryOutline,
 97:   EyeOutline,
 98:   EyeInvisibleOutline,
 99:   AppstoreOutline as MenuAppOutline,
100:   UserAddOutline,
101:   UserDeleteOutline,
102:   ContactsOutline,
103:   FileExcelOutline,
104:   FilePdfOutline,
105:   FileImageOutline,
106:   SendOutline,
107:   CommentOutline,
108:   FilterOutline,
109:   SortAscendingOutline,
110:   SortDescendingOutline,
111:   ClearOutline,
112:   BarChartOutline,
113:   LineChartOutline,
114:   AreaChartOutline,
115:   WifiOutline,
116:   DisconnectOutline,
117:   UnlockOutline,
118:   GroupOutline,
119:   HeartOutline,
120:   ThunderboltOutline,
121:   BugOutline,
122:   BulbOutline
123: } from '@ant-design/icons-angular/icons';
124: 
125: export const ICONS_AUTO = [
126:   AlipayCircleOutline,
127:   ApiOutline,
128:   AppstoreOutline,
129:   ArrowDownOutline,
130:   BookOutline,
131:   BorderLeftOutline,
132:   BorderRightOutline,
133:   CloudOutline,
134:   CopyrightOutline,
135:   CustomerServiceOutline,
136:   DashboardOutline,
137:   DatabaseOutline,
138:   DingdingOutline,
139:   DislikeOutline,
140:   DownloadOutline,
141:   ForkOutline,
142:   FrownOutline,
143:   FullscreenExitOutline,
144:   FullscreenOutline,
145:   GithubOutline,
146:   GlobalOutline,
147:   HddOutline,
148:   LaptopOutline,
149:   LikeOutline,
150:   LockOutline,
151:   LogoutOutline,
152:   MailOutline,
153:   MenuFoldOutline,
154:   MenuUnfoldOutline,
155:   MessageOutline,
156:   PayCircleOutline,
157:   PieChartOutline,
158:   PrinterOutline,
159:   RocketOutline,
160:   ScanOutline,
161:   SettingOutline,
162:   ShareAltOutline,
163:   ShoppingCartOutline,
164:   SoundOutline,
165:   StarOutline,
166:   TaobaoCircleOutline,
167:   TaobaoOutline,
168:   TeamOutline,
169:   ToolOutline,
170:   TrophyOutline,
171:   UsbOutline,
172:   UserOutline,
173:   WeiboCircleOutline,
174:   ApartmentOutline,
175:   SwapOutline,
176:   PlusOutline,
177:   ArrowLeftOutline,
178:   LinkOutline,
179:   SearchOutline,
180:   CheckOutline,
181:   CloseCircleOutline,
182:   UploadOutline,
183:   CheckCircleOutline,
184:   EllipsisOutline,
185:   ArrowRightOutline,
186:   InfoCircleOutline,
187:   CheckSquareOutline,
188:   EditOutline,
189:   DeleteOutline,
190:   SaveOutline,
191:   FileOutline,
192:   FileAddOutline,
193:   FileTextOutline,
194:   FolderOutline,
195:   FolderOpenOutline,
196:   FolderAddOutline,
197:   UnorderedListOutline,
198:   OrderedListOutline,
199:   TableOutline,
200:   ClockCircleOutline,
201:   CalendarOutline,
202:   ScheduleOutline,
203:   SafetyOutline,
204:   BellOutline,
205:   ExclamationCircleOutline,
206:   WarningOutline,
207:   MinusCircleOutline,
208:   ReloadOutline,
209:   SyncOutline,
210:   RedoOutline,
211:   UndoOutline,
212:   RotateLeftOutline,
213:   HomeOutline,
214:   MenuOutline,
215:   HistoryOutline,
216:   EyeOutline,
217:   EyeInvisibleOutline,
218:   MenuAppOutline,
219:   UserAddOutline,
220:   UserDeleteOutline,
221:   ContactsOutline,
222:   FileExcelOutline,
223:   FilePdfOutline,
224:   FileImageOutline,
225:   SendOutline,
226:   CommentOutline,
227:   FilterOutline,
228:   SortAscendingOutline,
229:   SortDescendingOutline,
230:   ClearOutline,
231:   BarChartOutline,
232:   LineChartOutline,
233:   AreaChartOutline,
234:   WifiOutline,
235:   DisconnectOutline,
236:   UnlockOutline,
237:   GroupOutline,
238:   HeartOutline,
239:   ThunderboltOutline,
240:   BugOutline,
241:   BulbOutline
242: ];
````

## File: src/style-icons.ts
````typescript
 1: // Custom icon static resources
 2: 
 3: import {
 4:   BulbOutline,
 5:   ExceptionOutline,
 6:   InfoOutline,
 7:   LinkOutline,
 8:   MinusSquareOutline,
 9:   PlusSquareOutline,
10:   ProfileOutline
11: } from '@ant-design/icons-angular/icons';
12: 
13: export const ICONS = [InfoOutline, BulbOutline, ProfileOutline, ExceptionOutline, LinkOutline, PlusSquareOutline, MinusSquareOutline];
````

## File: src/typings.d.ts
````typescript
1: // # 3rd Party Library
2: // If the library doesn't have typings available at `@types/`,
3: // you can still use it by manually adding typings for it
````

## File: src/app/core/infra/repositories/blueprint.repository.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { Observable } from 'rxjs';
  3: import { map } from 'rxjs/operators';
  4: import { BaseRepository, QueryOptions } from './base.repository';
  5: import { Database } from '../types/database.types';
  6: import { BlueprintStatus } from '../types/blueprint.types';
  7: 
  8: /**
  9:  * Blueprint 实体类型（camelCase）
 10:  * 从数据库类型中提取，后续会通过转换工具转换为 camelCase
 11:  */
 12: type BlueprintRow = Database['public']['Tables']['blueprints']['Row'];
 13: type BlueprintInsert = Database['public']['Tables']['blueprints']['Insert'];
 14: type BlueprintUpdate = Database['public']['Tables']['blueprints']['Update'];
 15: 
 16: /**
 17:  * Blueprint 实体类型（camelCase）
 18:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 19:  */
 20: export type Blueprint = BlueprintRow;
 21: export type { BlueprintInsert, BlueprintUpdate };
 22: 
 23: /**
 24:  * Blueprint Repository
 25:  * 
 26:  * 提供蓝图相关的数据访问方法
 27:  * 
 28:  * @example
 29:  * ```typescript
 30:  * const blueprintRepo = inject(BlueprintRepository);
 31:  * blueprintRepo.findByOwnerId('user-id').subscribe(blueprints => {
 32:  *   console.log('User blueprints:', blueprints);
 33:  * });
 34:  * ```
 35:  */
 36: @Injectable({
 37:   providedIn: 'root'
 38: })
 39: export class BlueprintRepository extends BaseRepository<Blueprint, BlueprintInsert, BlueprintUpdate> {
 40:   protected tableName = 'blueprints';
 41: 
 42:   /**
 43:    * 根据拥有者 ID 查询蓝图
 44:    * 
 45:    * @param ownerId 拥有者 ID
 46:    * @param options 查询选项
 47:    * @returns Observable<Blueprint[]>
 48:    */
 49:   findByOwnerId(ownerId: string, options?: QueryOptions): Observable<Blueprint[]> {
 50:     return this.findAll({
 51:       ...options,
 52:       filters: {
 53:         ...options?.filters,
 54:         ownerId, // 会自动转换为 owner_id
 55:       },
 56:     });
 57:   }
 58: 
 59:   /**
 60:    * 根据状态查询蓝图
 61:    * 
 62:    * @param status 蓝图状态
 63:    * @param options 查询选项
 64:    * @returns Observable<Blueprint[]>
 65:    */
 66:   findByStatus(status: BlueprintStatus, options?: QueryOptions): Observable<Blueprint[]> {
 67:     return this.findAll({
 68:       ...options,
 69:       filters: {
 70:         ...options?.filters,
 71:         status,
 72:       },
 73:     });
 74:   }
 75: 
 76:   /**
 77:    * 根据项目代码查询蓝图
 78:    * 
 79:    * @param projectCode 项目代码
 80:    * @returns Observable<Blueprint | null>
 81:    */
 82:   findByProjectCode(projectCode: string): Observable<Blueprint | null> {
 83:     return this.findAll({
 84:       filters: {
 85:         projectCode, // 会自动转换为 project_code
 86:       },
 87:     }).pipe(
 88:       map(blueprints => blueprints.length > 0 ? blueprints[0] : null)
 89:     );
 90:   }
 91: 
 92:   /**
 93:    * 查询活跃的蓝图（状态为 active）
 94:    * 
 95:    * @param options 查询选项
 96:    * @returns Observable<Blueprint[]>
 97:    */
 98:   findActive(options?: QueryOptions): Observable<Blueprint[]> {
 99:     return this.findByStatus(BlueprintStatus.ACTIVE, options);
100:   }
101: }
````

## File: src/app/core/permissions/permission.service.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { ACLService } from '@delon/acl';
  3: import { DA_SERVICE_TOKEN } from '@delon/auth';
  4: import { Observable, from, of, throwError, forkJoin } from 'rxjs';
  5: import { map, switchMap, catchError, tap, shareReplay } from 'rxjs/operators';
  6: 
  7: import { SupabaseService } from '../supabase/supabase.service';
  8: import { Permission, PermissionCacheItem } from './types';
  9: 
 10: /**
 11:  * 权限检查服务
 12:  * 
 13:  * 整合 @delon/acl 和 Supabase 数据库，实现 RBAC 权限控制
 14:  * 
 15:  * 功能：
 16:  * 1. 权限检查（can, canAny, canAll）
 17:  * 2. Git-like 分支权限检查
 18:  * 3. 权限缓存（内存缓存）
 19:  * 4. 权限同步到 @delon/acl
 20:  * 5. 权限检查日志记录（后续实现）
 21:  * 
 22:  * @example
 23:  * ```typescript
 24:  * const permissionService = inject(PermissionService);
 25:  * permissionService.can('blueprint.read').subscribe(hasPermission => {
 26:  *   if (!hasPermission) {
 27:  *     throw new Error('Permission denied');
 28:  *   }
 29:  * });
 30:  * ```
 31:  */
 32: @Injectable({
 33:   providedIn: 'root'
 34: })
 35: export class PermissionService {
 36:   private readonly aclService = inject(ACLService);
 37:   private readonly supabaseService = inject(SupabaseService);
 38:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
 39: 
 40:   /**
 41:    * 权限缓存（内存缓存）
 42:    * key: permission string, value: PermissionCacheItem
 43:    */
 44:   private readonly permissionCache = new Map<string, PermissionCacheItem>();
 45: 
 46:   /**
 47:    * 缓存过期时间（毫秒），默认 5 分钟
 48:    */
 49:   private readonly CACHE_TTL = 5 * 60 * 1000;
 50: 
 51:   /**
 52:    * 当前用户权限缓存（Observable）
 53:    */
 54:   private userPermissions$?: Observable<Permission[]>;
 55: 
 56:   /**
 57:    * 获取当前用户 ID
 58:    */
 59:   private getCurrentUserId(): string | null {
 60:     const token = this.tokenService.get();
 61:     return token?.['user']?.id || null;
 62:   }
 63: 
 64:   /**
 65:    * 检查单个权限
 66:    * 
 67:    * @param permission 权限名称（如 'blueprint.read'）
 68:    * @returns Observable<boolean> 是否有权限
 69:    * @throws Error 如果权限检查失败（根据配置）
 70:    */
 71:   can(permission: string): Observable<boolean> {
 72:     // 1. 检查本地 ACLService 缓存
 73:     if (this.aclService.can(permission)) {
 74:       return of(true);
 75:     }
 76: 
 77:     // 2. 检查内存缓存
 78:     const cached = this.permissionCache.get(permission);
 79:     if (cached && cached.expiresAt > Date.now()) {
 80:       return of(cached.hasPermission);
 81:     }
 82: 
 83:     // 3. 查询数据库
 84:     return this.checkDatabasePermission(permission).pipe(
 85:       tap(hasPermission => {
 86:         // 更新内存缓存
 87:         this.permissionCache.set(permission, {
 88:           permission,
 89:           hasPermission,
 90:           expiresAt: Date.now() + this.CACHE_TTL
 91:         });
 92:       }),
 93:       catchError(error => {
 94:         // 权限检查失败时抛出异常
 95:         return throwError(() => new Error(`Permission check failed: ${permission} - ${error.message}`));
 96:       })
 97:     );
 98:   }
 99: 
100:   /**
101:    * 检查任一权限（OR 逻辑）
102:    * 
103:    * @param permissions 权限数组
104:    * @returns Observable<boolean> 是否有任一权限
105:    */
106:   canAny(permissions: string[]): Observable<boolean> {
107:     if (permissions.length === 0) {
108:       return of(false);
109:     }
110: 
111:     // 并行检查所有权限，任一为 true 即返回 true
112:     const checks = permissions.map(p => 
113:       this.can(p).pipe(
114:         catchError(() => of(false))
115:       )
116:     );
117: 
118:     return forkJoin(checks).pipe(
119:       map(results => results.some(r => r === true))
120:     );
121:   }
122: 
123:   /**
124:    * 检查所有权限（AND 逻辑）
125:    * 
126:    * @param permissions 权限数组
127:    * @returns Observable<boolean> 是否有所有权限
128:    */
129:   canAll(permissions: string[]): Observable<boolean> {
130:     if (permissions.length === 0) {
131:       return of(true);
132:     }
133: 
134:     // 并行检查所有权限，全部为 true 才返回 true
135:     const checks = permissions.map(p => 
136:       this.can(p).pipe(
137:         catchError(() => of(false))
138:       )
139:     );
140: 
141:     return forkJoin(checks).pipe(
142:       map(results => results.every(r => r === true))
143:     );
144:   }
145: 
146:   /**
147:    * 从数据库查询权限
148:    * 
149:    * @param permission 权限名称
150:    * @returns Observable<boolean>
151:    */
152:   private checkDatabasePermission(permission: string): Observable<boolean> {
153:     const userId = this.getCurrentUserId();
154:     if (!userId) {
155:       return of(false);
156:     }
157: 
158:     // 查询用户角色 -> 角色权限 -> 权限详情
159:     return from(
160:       this.supabaseService.client
161:         .from('user_roles')
162:         .select(`
163:           roles!inner(
164:             role_permissions!inner(
165:               permissions!inner(
166:                 name,
167:                 resource,
168:                 action
169:               )
170:             )
171:           )
172:         `)
173:         .eq('account_id', userId)
174:     ).pipe(
175:       map(({ data, error }) => {
176:         if (error) {
177:           throw new Error(`Database query failed: ${error.message}`);
178:         }
179: 
180:         if (!data || data.length === 0) {
181:           return false;
182:         }
183: 
184:         // 检查是否有匹配的权限
185:         for (const userRole of data) {
186:           const role = userRole.roles as any;
187:           if (role?.role_permissions) {
188:             for (const rolePerm of role.role_permissions) {
189:               const perm = rolePerm.permissions as Permission;
190:               if (perm.name === permission || `${perm.resource}.${perm.action}` === permission) {
191:                 return true;
192:               }
193:             }
194:           }
195:         }
196: 
197:         return false;
198:       }),
199:       tap(hasPermission => {
200:         // 如果权限存在，同步到 ACLService
201:         if (hasPermission) {
202:           this.syncPermissionToACL(permission);
203:         }
204:       })
205:     );
206:   }
207: 
208:   /**
209:    * 同步权限到 @delon/acl ACLService
210:    * 
211:    * @param permission 权限名称
212:    */
213:   private syncPermissionToACL(permission: string): void {
214:     // 解析权限格式：resource.action
215:     const parts = permission.split('.');
216:     if (parts.length === 2) {
217:       const currentData = this.aclService.data;
218:       const abilities = currentData.abilities || [];
219:       if (!abilities.includes(permission)) {
220:         // 使用 ACLService.set() 设置权限
221:         this.aclService.set({
222:           ...currentData,
223:           abilities: [...abilities, permission]
224:         });
225:       }
226:     }
227:   }
228: 
229:   /**
230:    * 检查蓝图访问权限
231:    * 
232:    * @param blueprintId 蓝图 ID
233:    * @param action 操作类型
234:    * @returns Observable<boolean>
235:    */
236:   canAccessBlueprint(blueprintId: string, action: 'read' | 'write' | 'admin'): Observable<boolean> {
237:     const userId = this.getCurrentUserId();
238:     if (!userId) {
239:       return of(false);
240:     }
241: 
242:     // 查询蓝图拥有者或用户角色
243:     return from(
244:       this.supabaseService.client
245:         .from('blueprints')
246:         .select('owner_id')
247:         .eq('id', blueprintId)
248:         .single()
249:     ).pipe(
250:       switchMap(({ data: blueprint, error: blueprintError }) => {
251:         if (blueprintError || !blueprint) {
252:           return of(false);
253:         }
254: 
255:         // 如果是拥有者，拥有所有权限
256:         if (blueprint.owner_id === userId) {
257:           return of(true);
258:         }
259: 
260:         // 检查用户角色权限
261:         return from(
262:           this.supabaseService.client
263:             .from('user_roles')
264:             .select('roles(code)')
265:             .eq('account_id', userId)
266:             .eq('blueprint_id', blueprintId)
267:         ).pipe(
268:           map(({ data: userRoles }) => {
269:             if (!userRoles || userRoles.length === 0) {
270:               return false;
271:             }
272: 
273:             // 根据角色代码判断权限
274:             const roleCodes = userRoles.map(ur => (ur.roles as any).code);
275:             
276:             switch (action) {
277:               case 'read':
278:                 return roleCodes.some(code => ['blueprint_owner', 'blueprint_admin', 'project_manager', 'viewer'].includes(code));
279:               case 'write':
280:                 return roleCodes.some(code => ['blueprint_owner', 'blueprint_admin', 'project_manager'].includes(code));
281:               case 'admin':
282:                 return roleCodes.some(code => ['blueprint_owner', 'blueprint_admin'].includes(code));
283:               default:
284:                 return false;
285:             }
286:           })
287:         );
288:       })
289:     );
290:   }
291: 
292:   /**
293:    * 检查分支访问权限
294:    * 
295:    * @param branchId 分支 ID
296:    * @param action 操作类型
297:    * @returns Observable<boolean>
298:    */
299:   canAccessBranch(branchId: string, action: 'read' | 'write' | 'admin'): Observable<boolean> {
300:     const userId = this.getCurrentUserId();
301:     if (!userId) {
302:       return of(false);
303:     }
304: 
305:     // 查询分支权限
306:     return from(
307:       this.supabaseService.client
308:         .from('branch_permissions')
309:         .select('permission_level, blueprint_branches(blueprint_id, blueprints(owner_id))')
310:         .eq('branch_id', branchId)
311:         .eq('account_id', userId)
312:         .single()
313:     ).pipe(
314:       switchMap(({ data: branchPerm, error }) => {
315:         // 如果没有分支权限，检查是否是蓝图拥有者
316:         if (error || !branchPerm) {
317:           return from(
318:             this.supabaseService.client
319:               .from('blueprint_branches')
320:               .select('blueprint_id, blueprints(owner_id)')
321:               .eq('id', branchId)
322:               .single()
323:           ).pipe(
324:             map(({ data: branch }) => {
325:               const blueprint = (branch as any)?.blueprints;
326:               return blueprint?.owner_id === userId;
327:             })
328:           );
329:         }
330: 
331:         const level = branchPerm.permission_level as 'owner' | 'admin' | 'write' | 'read';
332:         
333:         switch (action) {
334:           case 'read':
335:             return of(true); // 所有级别都可以读取
336:           case 'write':
337:             return of(['owner', 'admin', 'write'].includes(level));
338:           case 'admin':
339:             return of(['owner', 'admin'].includes(level));
340:           default:
341:             return of(false);
342:         }
343:       })
344:     );
345:   }
346: 
347:   /**
348:    * 检查是否可以修改任务结构（只有拥有者可以）
349:    * 
350:    * @param blueprintId 蓝图 ID
351:    * @returns Observable<boolean>
352:    */
353:   canModifyTaskStructure(blueprintId: string): Observable<boolean> {
354:     const userId = this.getCurrentUserId();
355:     if (!userId) {
356:       return of(false);
357:     }
358: 
359:     return from(
360:       this.supabaseService.client
361:         .from('blueprints')
362:         .select('owner_id')
363:         .eq('id', blueprintId)
364:         .single()
365:     ).pipe(
366:       map(({ data, error }) => {
367:         if (error || !data) {
368:           return false;
369:         }
370:         return data.owner_id === userId;
371:       })
372:     );
373:   }
374: 
375:   /**
376:    * 检查是否可以填写承攬欄位（协作组织可以）
377:    * 
378:    * @param branchId 分支 ID
379:    * @returns Observable<boolean>
380:    */
381:   canFillContractorFields(branchId: string): Observable<boolean> {
382:     const userId = this.getCurrentUserId();
383:     if (!userId) {
384:       return of(false);
385:     }
386: 
387:     // 检查是否是分支所属组织
388:     return from(
389:       this.supabaseService.client
390:         .from('blueprint_branches')
391:         .select('organization_id')
392:         .eq('id', branchId)
393:         .single()
394:     ).pipe(
395:       map(({ data, error }) => {
396:         if (error || !data) {
397:           return false;
398:         }
399:         return data.organization_id === userId;
400:       })
401:     );
402:   }
403: 
404:   /**
405:    * 检查是否可以审核 PR（只有拥有者可以）
406:    * 
407:    * @param blueprintId 蓝图 ID
408:    * @returns Observable<boolean>
409:    */
410:   canReviewPR(blueprintId: string): Observable<boolean> {
411:     return this.canModifyTaskStructure(blueprintId);
412:   }
413: 
414:   /**
415:    * 检查是否可以创建 PR（分支所属组织可以）
416:    * 
417:    * @param branchId 分支 ID
418:    * @returns Observable<boolean>
419:    */
420:   canCreatePR(branchId: string): Observable<boolean> {
421:     return this.canFillContractorFields(branchId);
422:   }
423: 
424:   /**
425:    * 从数据库同步用户角色到 ACLService
426:    * 
427:    * @param userId 用户 ID
428:    * @returns Promise<void>
429:    */
430:   async syncRolesFromDatabase(userId: string): Promise<void> {
431:     const { data: userRoles, error } = await this.supabaseService.client
432:       .from('user_roles')
433:       .select('roles(code, name)')
434:       .eq('account_id', userId);
435: 
436:     if (error) {
437:       throw new Error(`Failed to sync roles: ${error.message}`);
438:     }
439: 
440:     if (userRoles && userRoles.length > 0) {
441:       const roles = userRoles.map(ur => (ur.roles as any).code);
442:       this.aclService.set({ role: roles });
443:     }
444:   }
445: 
446:   /**
447:    * 加载用户所有权限
448:    * 
449:    * @param userId 用户 ID
450:    * @returns Observable<Permission[]>
451:    */
452:   loadUserPermissions(userId: string): Observable<Permission[]> {
453:     if (this.userPermissions$) {
454:       return this.userPermissions$;
455:     }
456: 
457:     this.userPermissions$ = from(
458:       this.supabaseService.client
459:         .from('user_roles')
460:         .select(`
461:           roles!inner(
462:             role_permissions!inner(
463:               permissions!inner(*)
464:             )
465:           )
466:         `)
467:         .eq('account_id', userId)
468:     ).pipe(
469:       map(({ data, error }) => {
470:         if (error) {
471:           throw new Error(`Failed to load permissions: ${error.message}`);
472:         }
473: 
474:         const permissions: Permission[] = [];
475:         if (data) {
476:           for (const userRole of data) {
477:             const role = userRole.roles as any;
478:             if (role?.role_permissions) {
479:               for (const rolePerm of role.role_permissions) {
480:                 const perm = rolePerm.permissions as Permission;
481:                 if (!permissions.find(p => p.id === perm.id)) {
482:                   permissions.push(perm);
483:                 }
484:               }
485:             }
486:           }
487:         }
488: 
489:         return permissions;
490:       }),
491:       tap(permissions => {
492:         // 同步权限到 ACLService
493:         const currentData = this.aclService.data;
494:         const abilities = permissions.map(p => `${p.resource}.${p.action}`);
495:         this.aclService.set({
496:           ...currentData,
497:           abilities: abilities
498:         });
499:       }),
500:       shareReplay(1)
501:     );
502: 
503:     return this.userPermissions$;
504:   }
505: 
506:   /**
507:    * 刷新当前用户权限
508:    * 
509:    * @returns Observable<void>
510:    */
511:   refreshPermissions(): Observable<void> {
512:     const userId = this.getCurrentUserId();
513:     if (!userId) {
514:       return of(undefined);
515:     }
516: 
517:     // 清除缓存
518:     this.permissionCache.clear();
519:     this.userPermissions$ = undefined;
520: 
521:     // 重新加载权限
522:     return this.loadUserPermissions(userId).pipe(
523:       switchMap(() => this.syncRolesFromDatabase(userId)),
524:       map(() => undefined),
525:       catchError(error => {
526:         return throwError(() => new Error(`Failed to refresh permissions: ${error.message}`));
527:       })
528:     );
529:   }
530: 
531:   /**
532:    * 清除权限缓存
533:    */
534:   clearCache(): void {
535:     this.permissionCache.clear();
536:     this.userPermissions$ = undefined;
537:   }
538: }
````

## File: src/app/core/permissions/role.service.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { DA_SERVICE_TOKEN } from '@delon/auth';
  3: import { Observable, from, throwError } from 'rxjs';
  4: import { map, switchMap, catchError } from 'rxjs/operators';
  5: 
  6: import { SupabaseService } from '../supabase/supabase.service';
  7: import { PermissionService } from './permission.service';
  8: import { Role, Permission, UserRole } from './types';
  9: 
 10: /**
 11:  * 角色管理服务
 12:  * 
 13:  * 提供角色查询和管理功能
 14:  * 
 15:  * @example
 16:  * ```typescript
 17:  * const roleService = inject(RoleService);
 18:  * roleService.getRoles().subscribe(roles => {
 19:  *   console.log('All roles:', roles);
 20:  * });
 21:  * ```
 22:  */
 23: @Injectable({
 24:   providedIn: 'root'
 25: })
 26: export class RoleService {
 27:   private readonly supabaseService = inject(SupabaseService);
 28:   private readonly permissionService = inject(PermissionService);
 29:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
 30: 
 31:   /**
 32:    * 获取当前用户 ID
 33:    */
 34:   private getCurrentUserId(): string | null {
 35:     const token = this.tokenService.get();
 36:     return token?.['user']?.id || null;
 37:   }
 38: 
 39:   /**
 40:    * 获取所有角色
 41:    * 
 42:    * @returns Observable<Role[]>
 43:    */
 44:   getRoles(): Observable<Role[]> {
 45:     return from(
 46:       this.supabaseService.client
 47:         .from('roles')
 48:         .select('*')
 49:         .order('priority', { ascending: false })
 50:     ).pipe(
 51:       map(({ data, error }) => {
 52:         if (error) {
 53:           throw new Error(`Failed to get roles: ${error.message}`);
 54:         }
 55:         return (data || []) as Role[];
 56:       })
 57:     );
 58:   }
 59: 
 60:   /**
 61:    * 获取用户角色
 62:    * 
 63:    * @param userId 用户 ID
 64:    * @returns Observable<Role[]>
 65:    */
 66:   getUserRoles(userId: string): Observable<Role[]> {
 67:     return from(
 68:       this.supabaseService.client
 69:         .from('user_roles')
 70:         .select('roles(*)')
 71:         .eq('account_id', userId)
 72:     ).pipe(
 73:       map(({ data, error }) => {
 74:         if (error) {
 75:           throw new Error(`Failed to get user roles: ${error.message}`);
 76:         }
 77:         return (data || []).map((ur: any) => ur.roles as Role);
 78:       })
 79:     );
 80:   }
 81: 
 82:   /**
 83:    * 获取角色权限
 84:    * 
 85:    * @param roleId 角色 ID
 86:    * @returns Observable<Permission[]>
 87:    */
 88:   getRolePermissions(roleId: string): Observable<Permission[]> {
 89:     return from(
 90:       this.supabaseService.client
 91:         .from('role_permissions')
 92:         .select('permissions(*)')
 93:         .eq('role_id', roleId)
 94:     ).pipe(
 95:       map(({ data, error }) => {
 96:         if (error) {
 97:           throw new Error(`Failed to get role permissions: ${error.message}`);
 98:         }
 99:         return (data || []).map((rp: any) => rp.permissions as Permission);
100:       })
101:     );
102:   }
103: 
104:   /**
105:    * 根据 ID 获取角色
106:    * 
107:    * @param roleId 角色 ID
108:    * @returns Observable<Role | null>
109:    */
110:   getRoleById(roleId: string): Observable<Role | null> {
111:     return from(
112:       this.supabaseService.client
113:         .from('roles')
114:         .select('*')
115:         .eq('id', roleId)
116:         .single()
117:     ).pipe(
118:       map(({ data, error }) => {
119:         if (error) {
120:           if (error.code === 'PGRST116') {
121:             return null; // 未找到
122:           }
123:           throw new Error(`Failed to get role: ${error.message}`);
124:         }
125:         return data as Role;
126:       })
127:     );
128:   }
129: 
130:   /**
131:    * 分配角色给用户
132:    * 
133:    * 需要权限：role.assign
134:    * 
135:    * @param userId 用户 ID
136:    * @param roleId 角色 ID
137:    * @param scope 作用域（可选）
138:    * @returns Observable<void>
139:    * @throws Error 如果权限不足
140:    */
141:   assignRole(
142:     userId: string,
143:     roleId: string,
144:     scope?: { blueprintId?: string; branchId?: string }
145:   ): Observable<void> {
146:     const currentUserId = this.getCurrentUserId();
147:     if (!currentUserId) {
148:       return throwError(() => new Error('User not authenticated'));
149:     }
150: 
151:     // 先验证权限
152:     return this.permissionService.can('role.assign').pipe(
153:       switchMap(hasPermission => {
154:         if (!hasPermission) {
155:           return throwError(() => new Error('Permission denied: role.assign'));
156:         }
157: 
158:         return from(
159:           this.supabaseService.client
160:             .from('user_roles')
161:             .insert({
162:               account_id: userId,
163:               role_id: roleId,
164:               blueprint_id: scope?.blueprintId || null,
165:               branch_id: scope?.branchId || null,
166:               granted_by: currentUserId
167:             })
168:         ).pipe(
169:           map(({ error }) => {
170:             if (error) {
171:               throw new Error(`Failed to assign role: ${error.message}`);
172:             }
173:           })
174:         );
175:       })
176:     );
177:   }
178: 
179:   /**
180:    * 移除用户角色
181:    * 
182:    * 需要权限：role.remove
183:    * 
184:    * @param userId 用户 ID
185:    * @param roleId 角色 ID
186:    * @param scope 作用域（可选）
187:    * @returns Observable<void>
188:    * @throws Error 如果权限不足
189:    */
190:   removeRole(
191:     userId: string,
192:     roleId: string,
193:     scope?: { blueprintId?: string; branchId?: string }
194:   ): Observable<void> {
195:     const currentUserId = this.getCurrentUserId();
196:     if (!currentUserId) {
197:       return throwError(() => new Error('User not authenticated'));
198:     }
199: 
200:     // 先验证权限
201:     return this.permissionService.can('role.remove').pipe(
202:       switchMap(hasPermission => {
203:         if (!hasPermission) {
204:           return throwError(() => new Error('Permission denied: role.remove'));
205:         }
206: 
207:         let query = this.supabaseService.client
208:           .from('user_roles')
209:           .delete()
210:           .eq('account_id', userId)
211:           .eq('role_id', roleId);
212: 
213:         if (scope?.blueprintId) {
214:           query = query.eq('blueprint_id', scope.blueprintId);
215:         }
216:         if (scope?.branchId) {
217:           query = query.eq('branch_id', scope.branchId);
218:         }
219: 
220:         return from(query).pipe(
221:           map(({ error }) => {
222:             if (error) {
223:               throw new Error(`Failed to remove role: ${error.message}`);
224:             }
225:           })
226:         );
227:       })
228:     );
229:   }
230: 
231:   /**
232:    * 更新角色
233:    * 
234:    * 需要权限：role.update
235:    * 
236:    * @param roleId 角色 ID
237:    * @param data 更新数据
238:    * @returns Observable<void>
239:    * @throws Error 如果权限不足
240:    */
241:   updateRole(roleId: string, data: Partial<Role>): Observable<void> {
242:     const currentUserId = this.getCurrentUserId();
243:     if (!currentUserId) {
244:       return throwError(() => new Error('User not authenticated'));
245:     }
246: 
247:     // 先验证权限
248:     return this.permissionService.can('role.update').pipe(
249:       switchMap(hasPermission => {
250:         if (!hasPermission) {
251:           return throwError(() => new Error('Permission denied: role.update'));
252:         }
253: 
254:         return from(
255:           this.supabaseService.client
256:             .from('roles')
257:             .update(data)
258:             .eq('id', roleId)
259:         ).pipe(
260:           map(({ error }) => {
261:             if (error) {
262:               throw new Error(`Failed to update role: ${error.message}`);
263:             }
264:           })
265:         );
266:       })
267:     );
268:   }
269: 
270:   /**
271:    * 分配权限给角色
272:    * 
273:    * 需要权限：role.permission.assign
274:    * 
275:    * @param roleId 角色 ID
276:    * @param permissionId 权限 ID
277:    * @returns Observable<void>
278:    * @throws Error 如果权限不足
279:    */
280:   assignPermissionToRole(roleId: string, permissionId: string): Observable<void> {
281:     const currentUserId = this.getCurrentUserId();
282:     if (!currentUserId) {
283:       return throwError(() => new Error('User not authenticated'));
284:     }
285: 
286:     // 先验证权限
287:     return this.permissionService.can('role.permission.assign').pipe(
288:       switchMap(hasPermission => {
289:         if (!hasPermission) {
290:           return throwError(() => new Error('Permission denied: role.permission.assign'));
291:         }
292: 
293:         return from(
294:           this.supabaseService.client
295:             .from('role_permissions')
296:             .insert({
297:               role_id: roleId,
298:               permission_id: permissionId
299:             })
300:         ).pipe(
301:           map(({ error }) => {
302:             if (error) {
303:               throw new Error(`Failed to assign permission: ${error.message}`);
304:             }
305:           })
306:         );
307:       })
308:     );
309:   }
310: 
311:   /**
312:    * 移除角色权限
313:    * 
314:    * 需要权限：role.permission.remove
315:    * 
316:    * @param roleId 角色 ID
317:    * @param permissionId 权限 ID
318:    * @returns Observable<void>
319:    * @throws Error 如果权限不足
320:    */
321:   removePermissionFromRole(roleId: string, permissionId: string): Observable<void> {
322:     const currentUserId = this.getCurrentUserId();
323:     if (!currentUserId) {
324:       return throwError(() => new Error('User not authenticated'));
325:     }
326: 
327:     // 先验证权限
328:     return this.permissionService.can('role.permission.remove').pipe(
329:       switchMap(hasPermission => {
330:         if (!hasPermission) {
331:           return throwError(() => new Error('Permission denied: role.permission.remove'));
332:         }
333: 
334:         return from(
335:           this.supabaseService.client
336:             .from('role_permissions')
337:             .delete()
338:             .eq('role_id', roleId)
339:             .eq('permission_id', permissionId)
340:         ).pipe(
341:           map(({ error }) => {
342:             if (error) {
343:               throw new Error(`Failed to remove permission: ${error.message}`);
344:             }
345:           })
346:         );
347:       })
348:     );
349:   }
350: }
````

## File: src/app/routes/blueprints/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: export const BLUEPRINT_ROUTES: Routes = [
 4:   {
 5:     path: '',
 6:     redirectTo: 'list',
 7:     pathMatch: 'full'
 8:   },
 9:   {
10:     path: 'list',
11:     loadComponent: () =>
12:       import('./list/blueprint-list.component').then(m => m.BlueprintListComponent)
13:   },
14:   {
15:     path: 'create',
16:     loadComponent: () => import('./form/blueprint-form.component').then(m => m.BlueprintFormComponent)
17:   },
18:   {
19:     path: ':id',
20:     loadComponent: () => import('./detail/blueprint-detail.component').then(m => m.BlueprintDetailComponent)
21:   },
22:   {
23:     path: ':id/edit',
24:     loadComponent: () => import('./form/blueprint-form.component').then(m => m.BlueprintFormComponent)
25:   },
26:   {
27:     path: ':id/branches',
28:     loadComponent: () => import('./branches/branch-management.component').then(m => m.BranchManagementComponent)
29:   },
30:   {
31:     path: ':id/pull-requests',
32:     loadComponent: () => import('./pull-requests/pull-request-list.component').then(m => m.PullRequestListComponent)
33:   },
34:   {
35:     path: ':id/settings',
36:     loadComponent: () => import('./settings/blueprint-settings.component').then(m => m.BlueprintSettingsComponent)
37:   },
38:   {
39:     path: ':id/fork',
40:     loadComponent: () => import('./fork/blueprint-fork.component').then(m => m.BlueprintForkComponent)
41:   },
42:   {
43:     path: ':id/pull-requests/:prId/review',
44:     loadComponent: () => import('./review/pr-review.component').then(m => m.PrReviewComponent)
45:   }
46: ];
````

## File: src/app/shared/models/account/index.ts
````typescript
 1: /**
 2:  * 账户与身份系统模型导出
 3:  * 
 4:  * 对应数据库表：
 5:  * - accounts (账户主表)
 6:  * - teams (团队表)
 7:  * - team_members (团队成员表)
 8:  * - organization_schedules (组织排班表)
 9:  * 
10:  * @module shared/models/account
11:  */
12: 
13: export * from './types';
````

## File: src/app/shared/shared-imports.ts
````typescript
 1: // Angular Common 管道與指令 — https://angular.dev/guide/pipes
 2: import {
 3:   AsyncPipe,
 4:   CurrencyPipe,
 5:   DatePipe,
 6:   DecimalPipe,
 7:   I18nPluralPipe,
 8:   I18nSelectPipe,
 9:   JsonPipe,
10:   KeyValuePipe,
11:   LowerCasePipe,
12:   NgClass,
13:   NgComponentOutlet,
14:   NgStyle,
15:   NgTemplateOutlet,
16:   PercentPipe,
17:   SlicePipe,
18:   TitleCasePipe,
19:   UpperCasePipe
20: } from '@angular/common';
21: // 表單模組（模板式 / 響應式） — https://angular.dev/guide/forms
22: import { FormsModule, ReactiveFormsModule } from '@angular/forms';
23: // 路由（RouterLink/RouterOutlet） — https://angular.dev/guide/routing
24: import { RouterOutlet, RouterLink } from '@angular/router';
25: // @delon/theme 管道（I18n/Date） — https://ng-alain.com/theme
26: // 注意：@delon/theme 的 DatePipe 在模板中使用 `_date` pipe，Angular Common 的 DatePipe 使用 `date` pipe
27: import { DatePipe as DelonDatePipe, I18nPipe } from '@delon/theme';
28: 
29: import { SHARED_DELON_MODULES } from './shared-delon.module';
30: import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
31: 
32: export const SHARED_IMPORTS = [
33:   // ========== Angular 表單模組 ==========
34:   FormsModule, // 模板式表單 — https://angular.dev/guide/forms#template-driven-forms
35:   ReactiveFormsModule, // 響應式表單 — https://angular.dev/guide/forms#reactive-forms
36: 
37:   // ========== Angular 路由 ==========
38:   RouterLink, // 路由連結指令 — https://angular.dev/guide/routing#routerlink
39:   RouterOutlet, // 路由插座 — https://angular.dev/guide/routing#routeroutlet
40:   NgTemplateOutlet, // 動態嵌入模板 — https://angular.dev/api/common/NgTemplateOutlet
41:   NgComponentOutlet, // 動態組件嵌入 — https://angular.dev/api/common/NgComponentOutlet
42: 
43:   // ========== Angular Common 標準管道 ==========
44:   DatePipe, // 日期格式化（模板使用: `{{ value | date }}`） — https://angular.dev/api/common/DatePipe
45:   CurrencyPipe, // 貨幣格式化（模板使用: `{{ value | currency }}`） — https://angular.dev/api/common/CurrencyPipe
46:   DecimalPipe, // 數字格式化（模板使用: `{{ value | number }}`） — https://angular.dev/api/common/DecimalPipe
47:   PercentPipe, // 百分比格式化（模板使用: `{{ value | percent }}`） — https://angular.dev/api/common/PercentPipe
48:   LowerCasePipe, // 轉小寫（模板使用: `{{ value | lowercase }}`） — https://angular.dev/api/common/LowerCasePipe
49:   UpperCasePipe, // 轉大寫（模板使用: `{{ value | uppercase }}`） — https://angular.dev/api/common/UpperCasePipe
50:   TitleCasePipe, // 標題大小寫（模板使用: `{{ value | titlecase }}`） — https://angular.dev/api/common/TitleCasePipe
51:   SlicePipe, // 陣列/字串切片（模板使用: `{{ value | slice:start:end }}`） — https://angular.dev/api/common/SlicePipe
52:   KeyValuePipe, // 鍵值對遍歷（模板使用: `@for (item of obj | keyvalue)`） — https://angular.dev/api/common/KeyValuePipe
53:   JsonPipe, // 物件轉 JSON 字串（模板使用: `{{ value | json }}`） — https://angular.dev/api/common/JsonPipe
54:   AsyncPipe, // 觀察值/Promise 非同步解包（模板使用: `{{ value$ | async }}`） — https://angular.dev/api/common/AsyncPipe
55:   I18nPluralPipe, // 複數形式映射（模板使用: `{{ count | i18nPlural:mapping }}`） — https://angular.dev/api/common/I18nPluralPipe
56:   I18nSelectPipe, // 鍵值映射選擇（模板使用: `{{ value | i18nSelect:mapping }}`） — https://angular.dev/api/common/I18nSelectPipe
57:   NgClass, // 動態 CSS 類（模板使用: `[ngClass]="..."`） — https://angular.dev/api/common/NgClass
58:   NgStyle, // 動態內聯樣式（模板使用: `[ngStyle]="..."`） — https://angular.dev/api/common/NgStyle
59: 
60:   // ========== @delon/theme 管道 ==========
61:   I18nPipe, // 國際化翻譯管道（模板使用: `{{ key | i18n }}`） — https://ng-alain.com/theme
62:   DelonDatePipe, // @delon/theme 日期管道（模板使用: `{{ value | _date }}`） — https://ng-alain.com/theme
63: 
64:   // ========== @delon 組件/指令集合 ==========
65:   // https://ng-alain.com/components
66:   ...SHARED_DELON_MODULES,
67: 
68:   // ========== ng-zorro-antd 組件集合 ==========
69:   // https://ng.ant.design/components/overview/zh
70:   ...SHARED_ZORRO_MODULES
71: ];
````

## File: src/app/core/index.ts
````typescript
1: export * from './i18n/i18n.service';
2: export * from './net/index';
3: export * from './startup/startup.service';
4: export * from './start-page.guard';
5: export * from './supabase';
6: export * from './permissions';
7: export * from './infra';
````

## File: src/app/core/startup/startup.service.ts
````typescript
 1: import { HttpClient } from '@angular/common/http';
 2: import { EnvironmentProviders, Injectable, Provider, inject, provideAppInitializer } from '@angular/core';
 3: import { Router } from '@angular/router';
 4: import { ACLService } from '@delon/acl';
 5: import { DA_SERVICE_TOKEN } from '@delon/auth';
 6: import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
 7: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 8: import { Observable, zip, catchError, map, switchMap, of, from } from 'rxjs';
 9: 
10: import { I18NService } from '../i18n/i18n.service';
11: import { PermissionService } from '../permissions/permission.service';
12: import { SupabaseAuthAdapterService } from '../supabase';
13: 
14: /**
15:  * Used for application startup
16:  * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
17:  */
18: export function provideStartup(): Array<Provider | EnvironmentProviders> {
19:   return [
20:     StartupService,
21:     provideAppInitializer(() => {
22:       const initializerFn = (
23:         (startupService: StartupService) => () =>
24:           startupService.load()
25:       )(inject(StartupService));
26:       return initializerFn();
27:     })
28:   ];
29: }
30: 
31: @Injectable()
32: export class StartupService {
33:   private menuService = inject(MenuService);
34:   private settingService = inject(SettingsService);
35:   private aclService = inject(ACLService);
36:   private titleService = inject(TitleService);
37:   private httpClient = inject(HttpClient);
38:   private router = inject(Router);
39:   private i18n = inject<I18NService>(ALAIN_I18N_TOKEN);
40:   private supabaseAuthAdapter = inject(SupabaseAuthAdapterService);
41:   private permissionService = inject(PermissionService);
42:   private tokenService = inject(DA_SERVICE_TOKEN);
43: 
44:   load(): Observable<void> {
45:     const defaultLang = this.i18n.defaultLang;
46:     
47:     // 先恢復 Supabase Session（如果存在），然後執行原有的啟動邏輯
48:     return this.supabaseAuthAdapter.restoreSession().pipe(
49:       switchMap(() => {
50:         // 同步用户权限（如果已登录）
51:         const currentUser = this.tokenService.get()?.['user'];
52:         const syncPermissions$ = currentUser?.id
53:           ? from(this.permissionService.syncRolesFromDatabase(currentUser.id)).pipe(
54:               catchError(error => {
55:                 console.warn('Failed to sync permissions:', error);
56:                 return of(undefined);
57:               })
58:             )
59:           : of(undefined);
60: 
61:         return syncPermissions$.pipe(
62:           switchMap(() => {
63:             // If http request allows anonymous access, you need to add `ALLOW_ANONYMOUS`:
64:             // this.httpClient.get('/app', { context: new HttpContext().set(ALLOW_ANONYMOUS, this.tokenService.get()?.token ? false : true) })
65:             return zip(this.i18n.loadLangData(defaultLang), this.httpClient.get('./assets/tmp/app-data.json')).pipe(
66:               // 接收其他拦截器后产生的异常消息
67:               catchError(res => {
68:                 console.warn(`StartupService.load: Network request failed`, res);
69:                 setTimeout(() => this.router.navigateByUrl(`/exception/500`));
70:                 return [];
71:               }),
72:               map(([langData, appData]: [Record<string, string>, NzSafeAny]) => {
73:                 // setting language data
74:                 this.i18n.use(defaultLang, langData);
75: 
76:                 // 应用信息：包括站点名、描述、年份
77:                 this.settingService.setApp(appData.app);
78:                 // 用户信息：包括姓名、头像、邮箱地址
79:                 this.settingService.setUser(appData.user);
80:                 // ACL：如果用户已登录，权限已通过 PermissionService 同步
81:                 // 如果未登录，设置为全量（开发模式）
82:                 if (!currentUser?.id) {
83:                   this.aclService.setFull(true);
84:                 }
85:                 // 初始化菜单
86:                 this.menuService.add(appData.menu);
87:                 // 设置页面标题的后缀
88:                 this.titleService.default = '';
89:                 this.titleService.suffix = appData.app.name;
90:               })
91:             );
92:           })
93:         );
94:       })
95:     );
96:   }
97: }
````

## File: src/app/routes/accounts/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: import { AccountListComponent } from './list/account-list.component';
 3: import { AccountDetailComponent } from './detail/account-detail.component';
 4: import { AccountFormComponent } from './form/account-form.component';
 5: import { TeamListComponent } from './teams/team-list.component';
 6: import { TeamDetailComponent } from './teams/team-detail/team-detail.component';
 7: import { ScheduleListComponent } from './schedules/schedule-list.component';
 8: import { UserListComponent } from './users/user-list.component';
 9: import { OrganizationListComponent } from './organizations/organization-list.component';
10: import { BotListComponent } from './bots/bot-list.component';
11: 
12: export const routes: Routes = [
13:   { path: '', redirectTo: 'list', pathMatch: 'full' },
14:   { path: 'list', component: AccountListComponent },
15:   { path: 'create', component: AccountFormComponent },
16:   { path: ':id', component: AccountDetailComponent },
17:   { path: ':id/edit', component: AccountFormComponent },
18:   { path: 'teams', component: TeamListComponent },
19:   { path: 'teams/:id', component: TeamDetailComponent },
20:   { path: 'schedules', component: ScheduleListComponent },
21:   { path: 'users', component: UserListComponent },
22:   { path: 'organizations', component: OrganizationListComponent },
23:   { path: 'bots', component: BotListComponent }
24: ];
````

## File: src/app/shared/index.ts
````typescript
 1: // Components
 2: 
 3: // Utils
 4: export * from './utils/yuan';
 5: 
 6: // Models
 7: export * from './models';
 8: 
 9: // Services
10: export * from './services';
11: 
12: // Module
13: export * from './shared-imports';
14: export * from './json-schema/index';
15: export * from './st-widget/index';
16: export * from './cell-widget/index';
````

## File: src/app/shared/services/account/index.ts
````typescript
 1: /**
 2:  * 账户服务导出
 3:  * 
 4:  * 提供账户和团队管理的服务：
 5:  * - AccountService: 账户 CRUD 操作
 6:  * - TeamService: 团队 CRUD 操作和成员管理
 7:  * - OrganizationScheduleService: 组织排班管理
 8:  * 
 9:  * @module shared/services/account
10:  */
11: 
12: export * from './account.service';
13: export * from './team.service';
14: export * from './organization-schedule.service';
````

## File: src/app/core/infra/repositories/index.ts
````typescript
 1: /**
 2:  * Repository 模块导出
 3:  */
 4: export * from './base.repository';
 5: export * from './blueprint.repository';
 6: export * from './blueprint-config.repository';
 7: export * from './blueprint-branch.repository';
 8: export * from './branch-fork.repository';
 9: export * from './pull-request.repository';
10: export * from './account.repository';
11: export * from './team.repository';
12: export * from './team-member.repository';
13: export * from './organization-schedule.repository';
14: export * from './organization-collaboration.repository';
15: export * from './collaboration-invitation.repository';
16: export * from './collaboration-member.repository';
````

## File: src/app/core/infra/types/index.ts
````typescript
1: /**
2:  * 类型定义模块导出
3:  */
4: export * from './database.types';
5: export * from './account.types';
6: export * from './collaboration.types';
7: export * from './blueprint.types';
````

## File: src/app/shared/models/index.ts
````typescript
 1: /**
 2:  * 数据模型统一导出
 3:  * 
 4:  * 按 11 个业务模块分类：
 5:  * - account: 账户与身份系统（4 张表）
 6:  * - collaboration: 组织协作系统（3 张表）
 7:  * - permission: 权限系统（5 张表）
 8:  * - blueprint: 蓝图/专案系统（5 张表）
 9:  * - task: 任务执行系统（9 张表）
10:  * - quality: 品质验收系统（4 张表）
11:  * - issue: 问题追踪系统（4 张表）
12:  * - communication: 协作沟通系统（6 张表）
13:  * - data: 资料分析系统（6 张表）
14:  * - bot: 机器人系统（3 张表）
15:  * - system: 系统管理（2 张表）
16:  * 
17:  * @module shared/models
18:  */
19: 
20: // 按模块导出
21: export * from './account';
22: export * from './collaboration';
23: export * from './blueprint';
````

## File: src/app/shared/services/index.ts
````typescript
 1: /**
 2:  * 共享服务统一导出
 3:  * 
 4:  * 按业务模块分类的服务：
 5:  * - account: 账户服务
 6:  * - repository: Repository 模式服务（规划中）
 7:  * - storage: Storage 服务（规划中）
 8:  * 
 9:  * @module shared/services
10:  */
11: 
12: // 按模块导出
13: export * from './account';
14: export * from './collaboration';
15: export * from './blueprint';
````

## File: src/app/routes/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: import { startPageGuard } from '@core';
 3: import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';
 4: 
 5: import { LayoutBasicComponent, LayoutBlankComponent } from '../layout';
 6: 
 7: export const routes: Routes = [
 8:   {
 9:     path: '',
10:     component: LayoutBasicComponent,
11:     canActivate: [startPageGuard, authSimpleCanActivate],
12:     canActivateChild: [authSimpleCanActivateChild],
13:     data: {},
14:     children: [
15:       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
16:       {
17:         path: 'dashboard',
18:         loadChildren: () => import('./dashboard/routes').then(m => m.routes)
19:       },
20:       {
21:         path: 'widgets',
22:         loadChildren: () => import('./widgets/routes').then(m => m.routes)
23:       },
24:       { path: 'style', loadChildren: () => import('./style/routes').then(m => m.routes) },
25:       { path: 'delon', loadChildren: () => import('./delon/routes').then(m => m.routes) },
26:       { path: 'extras', loadChildren: () => import('./extras/routes').then(m => m.routes) },
27:       { path: 'pro', loadChildren: () => import('./pro/routes').then(m => m.routes) },
28:       { path: 'accounts', loadChildren: () => import('./accounts/routes').then(m => m.routes) },
29:       {
30:         path: 'collaboration',
31:         loadChildren: () => import('./collaboration/routes').then(m => m.COLLABORATION_ROUTES)
32:       },
33:       {
34:         path: 'blueprints',
35:         loadChildren: () => import('./blueprints/routes').then(m => m.BLUEPRINT_ROUTES)
36:       },
37:       {
38:         path: 'tasks',
39:         loadChildren: () => import('./tasks/routes').then(m => m.TASK_ROUTES)
40:       },
41:       {
42:         path: 'quality',
43:         loadChildren: () => import('./quality/routes').then(m => m.QUALITY_ROUTES)
44:       },
45:       {
46:         path: 'issues',
47:         loadChildren: () => import('./issues/routes').then(m => m.ISSUE_ROUTES)
48:       },
49:       {
50:         path: 'analytics',
51:         loadChildren: () => import('./analytics/routes').then(m => m.ANALYTICS_ROUTES)
52:       },
53:       {
54:         path: 'documents',
55:         loadChildren: () => import('./documents/routes').then(m => m.DOCUMENT_ROUTES)
56:       },
57:       {
58:         path: 'bots',
59:         loadChildren: () => import('./bots/routes').then(m => m.BOT_ROUTES)
60:       },
61:       {
62:         path: 'system',
63:         loadChildren: () => import('./system/routes').then(m => m.SYSTEM_ROUTES)
64:       },
65:       {
66:         path: 'communication',
67:         loadChildren: () => import('./communication/routes').then(m => m.COMMUNICATION_ROUTES)
68:       }
69:     ]
70:   },
71:   // Blak Layout 空白布局
72:   {
73:     path: 'data-v',
74:     component: LayoutBlankComponent,
75:     children: [{ path: '', loadChildren: () => import('./data-v/routes').then(m => m.routes) }]
76:   },
77:   // passport
78:   { path: '', loadChildren: () => import('./passport/routes').then(m => m.routes) },
79:   { path: 'exception', loadChildren: () => import('./exception/routes').then(m => m.routes) },
80:   { path: '**', redirectTo: 'exception/404' }
81: ];
````













