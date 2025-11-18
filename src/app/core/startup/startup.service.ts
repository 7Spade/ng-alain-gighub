import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, Injectable, Provider, inject, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, catchError, from, map, of, switchMap, zip } from 'rxjs';

import { I18NService } from '../i18n/i18n.service';
import { AccountRepository } from '../infra/repositories/account.repository';
import { MenuContextService } from '../menu-context/menu-context.service';
import { PermissionService } from '../permissions/permission.service';
import { SupabaseSessionAdapterService } from '../supabase';

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
  private menuContextService = inject(MenuContextService);
  private settingService = inject(SettingsService);
  private aclService = inject(ACLService);
  private titleService = inject(TitleService);
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private i18n = inject<I18NService>(ALAIN_I18N_TOKEN);
  private sessionAdapter = inject(SupabaseSessionAdapterService);
  private permissionService = inject(PermissionService);
  private tokenService = inject(DA_SERVICE_TOKEN);
  private accountRepository = inject(AccountRepository);

  load(): Observable<void> {
    const defaultLang = this.i18n.defaultLang;

    // 先恢復 Supabase Session（如果存在），然後執行原有的啟動邏輯
    return this.sessionAdapter.restoreSession().pipe(
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
            // 加载当前用户的账户信息（如果已登录）
            const loadUserAccount$ = currentUser?.id
              ? from(this.accountRepository.findByAuthUserId(currentUser.id)).pipe(
                  catchError(error => {
                    console.warn('Failed to load user account:', error);
                    return of(null);
                  })
                )
              : of(null);

            // 同时加载所有资源文件
            // If http request allows anonymous access, you need to add `ALLOW_ANONYMOUS`:
            // this.httpClient.get('/app', { context: new HttpContext().set(ALLOW_ANONYMOUS, this.tokenService.get()?.token ? false : true) })
            return zip(
              this.i18n.loadLangData(defaultLang),
              this.httpClient.get<NzSafeAny>('./assets/tmp/app-data.json'),
              this.httpClient.get<NzSafeAny>('./assets/tmp/user-data.json').pipe(catchError(() => of({ menu: [] }))),
              this.httpClient.get<NzSafeAny>('./assets/tmp/organization-data.json').pipe(catchError(() => of({ menu: [] }))),
              this.httpClient.get<NzSafeAny>('./assets/tmp/team-data.json').pipe(catchError(() => of({ menu: [] }))),
              loadUserAccount$
            ).pipe(
              // 接收其他拦截器后产生的异常消息
              catchError(res => {
                console.warn(`StartupService.load: Network request failed`, res);
                setTimeout(() => this.router.navigateByUrl(`/exception/500`));
                return [];
              }),
              map(
                ([langData, appData, userData, organizationData, teamData, userAccount]: [
                  Record<string, string>,
                  NzSafeAny,
                  NzSafeAny,
                  NzSafeAny,
                  NzSafeAny,
                  NzSafeAny | null
                ]) => {
                  // setting language data
                  this.i18n.use(defaultLang, langData);

                  // 应用信息：包括站点名、描述、年份（从 app-data.json 加载）
                  this.settingService.setApp(appData.app);

                  // 用户信息：优先从 Supabase 加载，如果不存在则使用 JSON 文件中的默认值
                  if (userAccount) {
                    // 从 Supabase 账户表加载用户信息
                    // 注意：BaseRepository 会自动将 snake_case 转换为 camelCase
                    const account = userAccount as any;
                    this.settingService.setUser({
                      name: account.name || appData.user.name,
                      avatar: account.avatarUrl || account.avatar_url || appData.user.avatar,
                      email: account.email || appData.user.email
                    });
                  } else {
                    // 如果未登录或账户不存在，使用 JSON 文件中的默认值
                    this.settingService.setUser(appData.user);
                  }

                  // ACL：如果用户已登录，权限已通过 PermissionService 同步
                  // 如果未登录，设置为全量（开发模式）
                  if (!currentUser?.id) {
                    this.aclService.setFull(true);
                  }

                  // 初始化菜单上下文服务，保存不同账户类型的菜单数据
                  this.menuContextService.initializeMenuData({
                    appMenu: appData.menu || [],
                    userMenu: userData.menu || [],
                    organizationMenu: organizationData.menu || [],
                    teamMenu: teamData.menu || []
                  });

                  // 设置页面标题的后缀
                  this.titleService.default = '';
                  this.titleService.suffix = appData.app.name;
                }
              )
            );
          })
        );
      })
    );
  }
}
