import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, Injectable, Provider, inject, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, catchError, from, map, of, switchMap, zip } from 'rxjs';

import { I18NService } from '../i18n/i18n.service';
import { IdentityContextService } from '../identity';
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
  private identityContextService = inject(IdentityContextService);

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
            // 加载可用身份列表
            const loadIdentities$ = currentUser?.id
              ? from(this.identityContextService.loadAvailableIdentities()).pipe(
                  catchError(error => {
                    console.warn('Failed to load available identities:', error);
                    return of(undefined);
                  })
                )
              : of(undefined);

            return loadIdentities$.pipe(
              switchMap(() => {
                // If http request allows anonymous access, you need to add `ALLOW_ANONYMOUS`:
                // this.httpClient.get('/app', { context: new HttpContext().set(ALLOW_ANONYMOUS, this.tokenService.get()?.token ? false : true) })
                return zip(this.i18n.loadLangData(defaultLang), this.httpClient.get('./assets/tmp/app-data.json')).pipe(
                  // 接收其他拦截器后产生的异常消息
                  catchError(res => {
                    console.warn(`StartupService.load: Network request failed`, res);
                    setTimeout(() => this.router.navigateByUrl(`/exception/500`));
                    return [];
                  }),
                  map(([langData, appData]: [Record<string, string>, NzSafeAny]) => {
                    // setting language data
                    this.i18n.use(defaultLang, langData);

                    // 应用信息：包括站点名、描述、年份
                    this.settingService.setApp(appData.app);
                    // 用户信息：包括姓名、头像、邮箱地址
                    this.settingService.setUser(appData.user);
                    // ACL：如果用户已登录，权限已通过 PermissionService 同步
                    // 如果未登录，设置为全量（开发模式）
                    if (!currentUser?.id) {
                      this.aclService.setFull(true);
                    }

                    // 根据当前身份加载对应菜单
                    this.loadMenuByIdentity(appData);

                    // 设置页面标题的后缀
                    this.titleService.default = '';
                    this.titleService.suffix = appData.app.name;
                  })
                );
              })
            );
          })
        );
      })
    );
  }

  /**
   * 根据当前身份加载对应菜单
   *
   * @param appData 应用数据（包含 menus 配置）
   */
  private loadMenuByIdentity(appData: NzSafeAny): void {
    const currentIdentity = this.identityContextService.currentIdentity();
    const identityType = currentIdentity?.type || 'personal';

    // 获取对应身份的菜单配置
    let menuData: NzSafeAny[] = [];

    if (appData.menus && appData.menus[identityType]) {
      // 使用新的 menus 配置
      menuData = appData.menus[identityType];
    } else if (appData.menu) {
      // 向后兼容：如果没有 menus 配置，使用原有的 menu
      menuData = appData.menu;
    }

    // 清空现有菜单并加载新菜单
    this.menuService.clear();
    this.menuService.add(menuData);
  }

  /**
   * 根据身份类型加载菜单（供外部调用）
   *
   * @param appData 应用数据（包含 menus 配置）
   */
  reloadMenuByIdentity(appData: NzSafeAny): void {
    this.loadMenuByIdentity(appData);
  }
}
