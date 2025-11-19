import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SearchType } from '@core';
import { AccountWithAvatar, BlueprintWithDescription, ExploreService, SHARED_IMPORTS } from '@shared';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.less'
})
export class ExploreComponent implements OnInit, OnDestroy {
  readonly exploreService = inject(ExploreService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  // 本地状态
  searchInputValue = '';
  readonly selectedType = signal<SearchType>(SearchType.ALL);
  readonly currentPage = signal(1);
  readonly pageSize = 20;

  // 搜索流（防抖）
  private readonly searchSubject = new Subject<string>();

  // 暴露 SearchType 给模板
  readonly SearchType = SearchType;

  ngOnInit(): void {
    // 设置防抖搜索（输入时自动搜索）
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(query => {
      if (query.trim()) {
        this.performSearch(query);
      } else {
        this.exploreService.clearResults();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInputChange(value: string): void {
    this.searchInputValue = value;
    // 输入时触发防抖搜索
    this.searchSubject.next(value);
  }

  onSearch(): void {
    // 点击搜索按钮或按回车时立即搜索
    const query = this.searchInputValue.trim();
    if (query) {
      this.currentPage.set(1);
      this.performSearch(query);
    }
  }

  onTypeChange(type: SearchType): void {
    this.selectedType.set(type);
    const query = this.searchInputValue.trim();
    if (query) {
      this.currentPage.set(1);
      this.performSearch(query);
    }
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    const query = this.searchInputValue.trim();
    if (query) {
      this.performSearch(query);
    }
  }

  private async performSearch(query: string): Promise<void> {
    try {
      await this.exploreService.search({
        query,
        type: this.selectedType(),
        page: this.currentPage(),
        pageSize: this.pageSize,
        orderBy: 'name',
        orderDirection: 'asc'
      });
    } catch (error) {
      // 错误已在 Service 中处理
      console.error('搜索失败:', error);
    }
  }

  navigateToAccount(accountId: string): void {
    this.router.navigate(['/accounts', accountId]);
  }

  navigateToBlueprint(blueprintId: string): void {
    this.router.navigate(['/blueprints', blueprintId]);
  }

  /**
   * 获取账户头像 URL
   * Repository 返回的数据已经转换为 camelCase，优先使用 camelCase 格式
   * 如果不存在，则使用 snake_case 格式（向后兼容）
   */
  getAvatarUrl(account: AccountWithAvatar): string | undefined {
    // 优先使用转换后的 camelCase 格式
    if (account.avatarUrl) {
      return account.avatarUrl;
    }
    // 向后兼容：检查原始 snake_case 格式
    const avatarUrl = (account as unknown as { avatar_url?: string | null }).avatar_url;
    return avatarUrl || undefined;
  }

  /**
   * 获取蓝图描述
   * Repository 返回的数据已经转换为 camelCase，优先使用 camelCase 格式
   * 如果不存在，则使用 snake_case 格式（向后兼容）
   */
  getBlueprintDescription(blueprint: BlueprintWithDescription): string {
    // 优先使用转换后的 camelCase 格式
    if (blueprint.projectCode) {
      return blueprint.projectCode;
    }
    // 使用描述字段
    if (blueprint.description) {
      return blueprint.description;
    }
    // 向后兼容：检查原始 snake_case 格式
    const projectCode = (blueprint as unknown as { project_code?: string | null }).project_code;
    return projectCode || '无描述';
  }
}
