import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BlueprintService, ErrorStateService, OrganizationContextService } from '@core';
import { STChange, STColumn } from '@delon/abc/st';
import type { Blueprint } from '@shared';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-blueprint-list',
  standalone: true,
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class BlueprintListComponent {
  private readonly blueprintService = inject(BlueprintService);
  readonly orgContext = inject(OrganizationContextService);
  private readonly router = inject(Router);
  private readonly msg = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly errorService = inject(ErrorStateService);

  // 原始數據（從 API 獲取）
  readonly allBlueprints = signal<Blueprint[]>([]);
  readonly loading = signal(false);

  // 建立藍圖改為導向專用頁面 `/blueprint/new`

  // 搜尋和篩選
  readonly searchText = signal('');
  readonly statusFilter = signal<'all' | 'planning' | 'active' | 'on-hold' | 'completed' | 'archived'>('all');
  readonly isPrivateFilter = signal<'all' | 'public' | 'private'>('all');

  // 優化搜索：使用 debounceTime 和 distinctUntilChanged
  private readonly searchText$ = toObservable(this.searchText).pipe(debounceTime(300), distinctUntilChanged(), shareReplay(1));
  readonly debouncedSearchText = toSignal(this.searchText$, { initialValue: '' });

  // 篩選後的數據（自動計算，使用 debouncedSearchText）
  readonly filteredBlueprints = computed(() => {
    const all = this.allBlueprints();
    const search = this.debouncedSearchText().toLowerCase();
    const status = this.statusFilter();
    const privacy = this.isPrivateFilter();

    return all.filter(bp => {
      // 搜索篩選
      if (search) {
        const matchesSearch =
          bp.name.toLowerCase().includes(search) ||
          bp.slug.toLowerCase().includes(search) ||
          bp.description?.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // 狀態篩選
      if (status !== 'all' && bp.status !== status) return false;

      // 隱私篩選
      if (privacy !== 'all') {
        const isPrivate = privacy === 'private';
        if (bp.is_private !== isPrivate) return false;
      }

      return true;
    });
  });

  // 使用 computed 獲取組織 ID（如果 orgContext 提供的是 signal）
  private readonly orgId = computed(() => this.orgContext.currentOrganizationId());

  readonly columns: STColumn[] = [
    { title: '藍圖名稱', index: 'name', render: 'name' },
    { title: '代號', index: 'slug' },
    { title: '工地位置', index: 'site_location' },
    { title: '當前階段', index: 'current_stage' },
    { title: '進度', render: 'progress' },
    { title: '狀態', render: 'status' },
    { title: '創建時間', index: 'created_at', type: 'date' },
    { title: '操作', render: 'action' }
  ];

  constructor() {
    // 監聽組織切換，及時刷新列表
    effect(() => {
      const orgId = this.orgId();
      if (orgId !== null) {
        this.loadBlueprints();
      } else {
        // 清空數據
        this.allBlueprints.set([]);
      }
    });

    // 初始化載入藍圖
    this.loadBlueprints();
  }

  async loadBlueprints(): Promise<void> {
    this.loading.set(true);

    // 根據當前視角載入藍圖：個人視角載入用戶藍圖，組織視角載入組織藍圖
    const isUserView = this.orgContext.isUserView();
    let data: Blueprint[] = [];
    let error: Error | null = null;

    if (isUserView) {
      // 個人視角：載入用戶擁有的所有藍圖
      const result = await this.blueprintService.getMyBlueprints();
      data = result.data;
      error = result.error;
    } else {
      // 組織視角：載入組織的所有藍圖
      const org = this.orgContext.currentOrganization();
      if (!org) {
        this.msg.warning('請先選擇組織');
        this.loading.set(false);
        return;
      }

      const result = await this.blueprintService.getOrganizationBlueprints(org.id);
      data = result.data;
      error = result.error;
    }

    if (error) {
      this.errorService.addError({
        type: 'http',
        severity: 'error',
        message: '獲取藍圖列表失敗',
        details: error.message || '無法載入藍圖列表',
        source: 'BlueprintListComponent.loadBlueprints',
        retryable: true,
        retryFn: () => {
          this.loadBlueprints();
        }
      });
      this.msg.error(error.message || '獲取藍圖列表失敗');
      this.loading.set(false);
      return;
    }

    // 只更新原始數據，篩選由 computed() 自動處理
    this.allBlueprints.set(data || []);
    this.loading.set(false);
  }

  navigateToDetail(blueprint: Blueprint): void {
    // 根據藍圖類型構建路由：個人藍圖或組織藍圖
    const isUserView = this.orgContext.isUserView();

    if (isUserView || !blueprint.organization_id) {
      // 個人藍圖：直接使用 slug，不需要 org 參數
      this.router.navigate(['/blueprint', blueprint.slug]);
    } else {
      // 組織藍圖：需要 org slug
      const org = this.orgContext.currentOrganization();
      if (!org) {
        this.msg.warning('請先選擇組織');
        return;
      }
      this.router.navigate(['/blueprint', org.slug, blueprint.slug]);
    }
  }

  openCreateModal(): void {
    this.router.navigate(['/blueprint', 'new']);
  }

  async deleteBlueprint(blueprint: Blueprint): Promise<void> {
    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除藍圖「${blueprint.name}」嗎？此操作無法撤銷。`,
      nzOnOk: async () => {
        const { error } = await this.blueprintService.deleteBlueprint(blueprint.id);
        if (error) {
          this.errorService.addError({
            type: 'business',
            severity: 'error',
            message: '刪除藍圖失敗',
            details: error.message || '無法刪除藍圖',
            source: 'BlueprintListComponent.deleteBlueprint',
            retryable: false
          });
          this.msg.error(error.message || '刪除藍圖失敗');
          return;
        }
        this.msg.success('藍圖已刪除');
        await this.loadBlueprints();
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stChange(_e: STChange): void {
    // 處理表格變化事件
  }

  onRowClick(record: Blueprint): void {
    this.navigateToDetail(record);
  }

  // 狀態映射常數
  private static readonly STATUS_COLORS: Record<string, string> = {
    planning: 'default',
    active: 'processing',
    'on-hold': 'warning',
    completed: 'success',
    archived: 'default'
  };

  private static readonly STATUS_TEXTS: Record<string, string> = {
    planning: '規劃中',
    active: '進行中',
    'on-hold': '暫停',
    completed: '已完成',
    archived: '已歸檔'
  };

  getStatusColor(status: string): string {
    return BlueprintListComponent.STATUS_COLORS[status] || 'default';
  }

  getStatusText(status: string): string {
    return BlueprintListComponent.STATUS_TEXTS[status] || status;
  }
}
