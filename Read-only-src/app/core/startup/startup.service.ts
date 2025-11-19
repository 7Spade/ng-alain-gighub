import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, Injectable, Provider, inject, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, zip, catchError, map, from, of } from 'rxjs';

import { OrganizationContextService } from '../account/organization/organization-context.service';
import { UserService } from '../account/user/user.service';
import { I18NService } from '../i18n/i18n.service';
import { ErrorStateService } from '../net/error';

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
  private orgContext = inject(OrganizationContextService);
  private userService = inject(UserService);
  private errorService = inject(ErrorStateService);

  load(): Observable<void> {
    const defaultLang = this.i18n.defaultLang;
    // If http request allows anonymous access, you need to add `ALLOW_ANONYMOUS`:
    // this.httpClient.get('/app', { context: new HttpContext().set(ALLOW_ANONYMOUS, this.tokenService.get()?.token ? false : true) })

    // 從 Supabase 獲取真實用戶數據
    const getSupabaseUser = from(this.userService.getCurrentUser()).pipe(
      map(result => {
        if (result.data) {
          // 轉換為 SettingsService 需要的格式
          return {
            name: result.data.display_name || result.data.email?.split('@')[0] || 'User',
            avatar: result.data.avatar_url || './assets/tmp/img/avatar.jpg',
            email: result.data.email || ''
          };
        }
        return null;
      }),
      catchError(() => of(null))
    );

    return zip(this.i18n.loadLangData(defaultLang), this.httpClient.get('./assets/tmp/app-data.json'), getSupabaseUser).pipe(
      // 接收其他攔截器後產生的異常消息
      catchError(res => {
        console.warn(`StartupService.load: Network request failed`, res);
        this.errorService.addError({
          type: 'http',
          severity: 'critical',
          message: '應用啟動失敗',
          details: '無法載入應用初始數據，請刷新頁面重試',
          source: 'StartupService.load',
          retryable: true,
          retryFn: () => {
            location.reload();
          }
        });
        setTimeout(() => this.router.navigateByUrl(`/exception/500`));
        return [];
      }),
      map(([langData, appData, supabaseUser]: [Record<string, string>, NzSafeAny, NzSafeAny]) => {
        // setting language data
        this.i18n.use(defaultLang, langData);

        // 應用信息：包括站點名、描述、年份
        this.settingService.setApp(appData.app);

        // 用戶信息：優先使用 Supabase 真實用戶數據，否則使用默認數據
        const userData = supabaseUser || appData.user;
        this.settingService.setUser(userData);

        // ACL：設置權限為全量
        this.aclService.setFull(true);
        // 設置默認主題為 dark（如果未設置過主題）
        const currentTheme = this.settingService.layout.theme;
        if (!currentTheme || currentTheme === 'default') {
          this.settingService.setLayout('theme', 'dark');
        }
        // 根據當前視角加載菜單
        this.loadMenuForView();
        // 設置頁面標題的後綴
        this.titleService.default = '';
        this.titleService.suffix = appData.app.name;
      })
    );
  }

  /**
   * 根據當前視角載入對應的菜單
   */
  private loadMenuForView(): void {
    const isUserView = this.orgContext.isUserView();
    let menuPath = './assets/tmp/app-data.json'; // 默認菜單

    if (!isUserView) {
      // 組織視角
      menuPath = './assets/tmp/menu-org.json';
    } else {
      // 用戶視角
      menuPath = './assets/tmp/menu-user.json';
    }

    this.httpClient
      .get<NzSafeAny>(menuPath)
      .pipe(catchError(() => this.httpClient.get('./assets/tmp/app-data.json')))
      .subscribe(menuData => {
        // 處理菜單數據格式：可能是直接是數組，或者是 { menu: [] } 格式
        let menu = Array.isArray(menuData) ? menuData : (menuData as { menu: unknown[] }).menu || menuData;

        // 如果不是用戶視角，需要注入組織 slug 到鏈接中
        if (!isUserView) {
          const org = this.orgContext.currentOrganization();
          const slug = org?.slug || '';
          menu = this.processMenuLinks(menu as Array<Record<string, unknown>>, slug);
        }

        this.menuService.clear();
        this.menuService.add(menu as Array<Record<string, unknown>>);
        console.log('菜單已載入', { isUserView, path: menuPath });
      });
  }

  /**
   * 處理菜單鏈接，注入組織 slug
   */
  private processMenuLinks(menu: Array<Record<string, unknown>>, slug: string): Array<Record<string, unknown>> {
    if (!slug) return menu;

    return menu.map(item => {
      const processed: Record<string, unknown> = { ...item };

      // 處理鏈接
      if (processed['link'] && typeof processed['link'] === 'string') {
        // 將 /org/xxx 替換為 /org/{slug}/xxx
        processed['link'] = (processed['link'] as string).replace(/^\/org\//, `/org/${slug}/`);
      }

      // 遞歸處理子菜單
      if (processed['children'] && Array.isArray(processed['children'])) {
        processed['children'] = this.processMenuLinks(processed['children'] as Array<Record<string, unknown>>, slug);
      }

      return processed;
    });
  }

  /**
   * 重新載入菜單（用於切換視角時）
   */
  reloadMenu(): void {
    this.loadMenuForView();
  }
}
