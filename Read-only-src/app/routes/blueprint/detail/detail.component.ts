import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, ActivationEnd } from '@angular/router';
import { BlueprintService, OrganizationContextService } from '@core';
import { TitleService } from '@delon/theme';
import type { BlueprintWithOwner } from '@shared';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-blueprint-detail',
  standalone: true,
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class BlueprintDetailComponent {
  private readonly blueprintService = inject(BlueprintService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly titleService = inject(TitleService);
  private readonly msg = inject(NzMessageService);

  readonly blueprint = signal<BlueprintWithOwner | null>(null);
  readonly loading = signal(false);

  // 路由參數 - 使用 toSignal() 轉換
  private readonly routeParams = toSignal(this.route.params, { initialValue: { org: '', slug: '' } });
  readonly orgSlug = signal<string>('');
  readonly blueprintSlug = signal<string>('');

  // 路由 URL signal - 用於自動計算標籤索引
  private readonly routerUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof ActivationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  private static readonly TABS: ReadonlyArray<{
    label: string;
    route: string;
    aliases: readonly string[];
  }> = [
    { label: '概覽', route: '', aliases: [] },
    { label: '任務', route: 'tasks', aliases: ['tasks', 'task-tree'] },
    { label: '問題追蹤', route: 'issues', aliases: ['issues'] },
    { label: '進度追蹤', route: 'progress', aliases: ['progress'] },
    { label: '每日報表', route: 'report', aliases: ['report'] },
    { label: '活動記錄', route: 'activity', aliases: ['activity'] },
    { label: '討論', route: 'discussions', aliases: ['discussions'] },
    { label: '文件管理', route: 'documents', aliases: ['documents'] },
    { label: '圖表分析', route: 'charts', aliases: ['charts'] },
    { label: '品質管理', route: 'quality', aliases: ['quality'] },
    { label: '天氣預報', route: 'weather', aliases: ['weather'] },
    { label: '設定', route: 'settings', aliases: ['settings'] }
  ];

  readonly tabs = BlueprintDetailComponent.TABS;

  // 計算屬性
  readonly isUserView = computed(() => this.orgContext.isUserView());
  readonly selectedOrganization = computed(() => this.orgContext.currentOrganization());

  // 計算基礎 URL
  readonly baseUrl = computed(() => {
    const isUserView = this.isUserView();
    const org = this.selectedOrganization();
    return isUserView ? ['/blueprint', this.blueprintSlug()] : ['/blueprint', org?.slug || '', this.blueprintSlug()].filter(Boolean);
  });

  // 自動計算活動標籤索引（按 UX 優先順序）
  readonly activeTabIndex = computed(() => {
    const url = this.routerUrl();
    const segments = url.split('/').filter(s => s);
    const segmentSet = new Set(segments);

    const foundIndex = this.tabs.findIndex(tab => tab.aliases.some(alias => segmentSet.has(alias)));
    return foundIndex >= 0 ? foundIndex : 0;
  });

  constructor() {
    // 響應路由參數變化
    effect(() => {
      const params = this.routeParams();
      const orgSlug = params?.['org'] || '';
      const slug = params?.['slug'] || '';

      this.orgSlug.set(orgSlug);
      this.blueprintSlug.set(slug);

      if (slug) {
        this.loadBlueprint();
      }
    });

    // 監聽組織上下文變化，當組織切換時重新載入藍圖
    effect(() => {
      const orgId = this.orgContext.currentOrganizationId();
      if (orgId && this.blueprintSlug()) {
        this.loadBlueprint();
      }
    });

    // activeTabIndex 現在由 computed() 自動計算，無需手動更新
  }

  async loadBlueprint(): Promise<void> {
    this.loading.set(true);

    // 使用上下文服務判斷視角，而非 URL 參數
    const isUserView = this.orgContext.isUserView();
    let data, error;

    if (isUserView) {
      // 個人藍圖：不需要 organizationId
      const result = await this.blueprintService.getBlueprintBySlug(null, this.blueprintSlug());
      data = result.data;
      error = result.error;
    } else {
      // 組織藍圖：需要 organizationId
      const org = this.orgContext.currentOrganization();
      if (!org) {
        this.msg.warning('請先選擇組織');
        this.loading.set(false);
        return;
      }

      const result = await this.blueprintService.getBlueprintBySlug(org.id, this.blueprintSlug());
      data = result.data;
      error = result.error;
    }

    if (error) {
      this.msg.error(error?.message || '獲取藍圖詳情失敗');
      this.loading.set(false);
      return;
    }

    if (!data) {
      // 當前視角不存在該藍圖：導回列表
      if (isUserView) {
        this.msg.info('個人視角未找到此藍圖，已返回列表');
        this.router.navigate(['/blueprint']);
      } else {
        const org = this.orgContext.currentOrganization();
        this.msg.info('此組織未找到該藍圖，已返回列表');
        this.router.navigate(['/blueprint', org?.slug || '']);
      }
      this.loading.set(false);
      return;
    }

    this.blueprint.set(data);
    this.titleService.setTitle(`${data.name} - 藍圖`);
    this.loading.set(false);
  }

  private buildBlueprintUrl(subRoute?: string): string[] {
    const baseUrl = [...this.baseUrl()];
    if (subRoute) {
      baseUrl.push(subRoute);
    }
    return baseUrl;
  }

  onTabClick(route: string): void {
    const url = this.buildBlueprintUrl(route || undefined);
    this.router.navigate(url);
  }

  navigateToSettings(): void {
    const url = this.buildBlueprintUrl('settings');
    this.router.navigate(url);
  }
}
