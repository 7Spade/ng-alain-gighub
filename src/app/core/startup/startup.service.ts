import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, Injectable, Provider, inject, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, catchError, from, map, of, switchMap, zip } from 'rxjs';

import { I18NService } from '../i18n/i18n.service';
import { PermissionService } from '../permissions/permission.service';
import { SupabaseAuthAdapterService } from '../supabase';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
export function provideStartup(): Array<Provider | EnvironmentProviders> {
  return [
    StartupService,
    provideAppInitializer(() => {
      const initializerFn = (
        (startupService: StartupService) => () =>
          startupService.load()
      )(inject(StartupService));
      return initializerFn();
    })
  ];
}

@Injectable()
export class StartupService {
  private menuService = inject(MenuService);
  private settingService = inject(SettingsService);
  private aclService = inject(ACLService);
  private titleService = inject(TitleService);
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private i18n = inject<I18NService>(ALAIN_I18N_TOKEN);
  private supabaseAuthAdapter = inject(SupabaseAuthAdapterService);
  private permissionService = inject(PermissionService);
  private tokenService = inject(DA_SERVICE_TOKEN);

  load(): Observable<void> {
    const defaultLang = this.i18n.defaultLang;

    // 先恢復 Supabase Session（如果存在），然後執行原有的啟動邏輯
    return this.supabaseAuthAdapter.restoreSession().pipe(
      switchMap(() => {
        // 同步用户权限（如果已登录）
        const currentUser = this.tokenService.get()?.['user'];
        const syncPermissions$ = currentUser?.id
          ? from(this.permissionService.syncRolesFromDatabase(currentUser.id)).pipe(
              catchError(error => {
                console.warn('Failed to sync permissions:', error);
                return of(undefined);
              })
            )
          : of(undefined);

        return syncPermissions$.pipe(
          switchMap(() => {
            // 同时加载所有资源文件
            // If http request allows anonymous access, you need to add `ALLOW_ANONYMOUS`:
            // this.httpClient.get('/app', { context: new HttpContext().set(ALLOW_ANONYMOUS, this.tokenService.get()?.token ? false : true) })
            return zip(
              this.i18n.loadLangData(defaultLang),
              this.httpClient.get<NzSafeAny>('./assets/tmp/app-data.json'),
              this.httpClient.get<NzSafeAny>('./assets/tmp/user-data.json').pipe(catchError(() => of({ menu: [] }))),
              this.httpClient.get<NzSafeAny>('./assets/tmp/organization-data.json').pipe(catchError(() => of({ menu: [] }))),
              this.httpClient.get<NzSafeAny>('./assets/tmp/team-data.json').pipe(catchError(() => of({ menu: [] })))
            ).pipe(
              // 接收其他拦截器后产生的异常消息
              catchError(res => {
                console.warn(`StartupService.load: Network request failed`, res);
                setTimeout(() => this.router.navigateByUrl(`/exception/500`));
                return [];
              }),
              map(
                ([langData, appData, userData, organizationData, teamData]: [
                  Record<string, string>,
                  NzSafeAny,
                  NzSafeAny,
                  NzSafeAny,
                  NzSafeAny
                ]) => {
                  // setting language data
                  this.i18n.use(defaultLang, langData);

                  // 应用信息：包括站点名、描述、年份（从 app-data.json 加载）
                  this.settingService.setApp(appData.app);

                  // 用户信息：包括姓名、头像、邮箱地址（从 app-data.json 加载，后续可根据账户类型切换）
                  this.settingService.setUser(appData.user);

                  // ACL：如果用户已登录，权限已通过 PermissionService 同步
                  // 如果未登录，设置为全量（开发模式）
                  if (!currentUser?.id) {
                    this.aclService.setFull(true);
                  }

                  // 初始化菜单（从 app-data.json 加载，后续可根据账户类型切换）
                  this.menuService.add(appData.menu);

                  // 设置页面标题的后缀
                  this.titleService.default = '';
                  this.titleService.suffix = appData.app.name;

                  // 可选：将加载的数据存储到服务中，供后续使用
                  // 例如：this.userMenuData = userData.menu;
                  //      this.organizationMenuData = organizationData.menu;
                  //      this.teamMenuData = teamData.menu;
                }
              )
            );
          })
        );
      })
    );
  }
}
