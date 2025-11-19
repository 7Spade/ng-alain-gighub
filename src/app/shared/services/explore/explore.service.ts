import { Injectable, computed, inject, signal } from '@angular/core';
import { AccountRepository, BlueprintRepository, AccountType, SearchType } from '@core';
import { SearchOptions, SearchResult } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Explore Service
 *
 * 提供探索功能的业务逻辑和状态管理
 * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 *
 * @example
 * ```typescript
 * const exploreService = inject(ExploreService);
 *
 * // 订阅搜索结果
 * effect(() => {
 *   console.log('Search Results:', exploreService.searchResults());
 * });
 *
 * // 执行搜索
 * await exploreService.search({
 *   query: 'test',
 *   type: SearchType.ALL
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ExploreService {
  private readonly accountRepo = inject(AccountRepository);
  private readonly blueprintRepo = inject(BlueprintRepository);

  // 使用 Signals 管理状态
  private searchResultsState = signal<SearchResult | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);
  private searchQueryState = signal<string>('');
  private searchTypeState = signal<SearchType>(SearchType.ALL);

  // 暴露 ReadonlySignal 给组件
  readonly searchResults = this.searchResultsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly searchQuery = this.searchQueryState.asReadonly();
  readonly searchType = this.searchTypeState.asReadonly();

  // Computed signals
  readonly hasResults = computed(() => {
    const results = this.searchResults();
    if (!results) {
      return false;
    }
    return results.total.all > 0;
  });

  /**
   * 执行搜索
   *
   * @param options 搜索选项
   */
  async search(options: SearchOptions): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);
    this.searchQueryState.set(options.query);
    this.searchTypeState.set(options.type);

    try {
      const page = options.page || 1;
      const pageSize = options.pageSize || 20;
      const orderBy = options.orderBy || 'name';
      const orderDirection = options.orderDirection || 'asc';

      const queryOptions = {
        page,
        pageSize,
        orderBy,
        orderDirection
      };

      // 根据搜索类型执行不同的搜索
      const results: SearchResult = {
        users: [],
        organizations: [],
        blueprints: [],
        total: {
          users: 0,
          organizations: 0,
          blueprints: 0,
          all: 0
        },
        page,
        pageSize,
        totalPages: 0
      };

      // 并行执行搜索
      const searchPromises: Array<Promise<void>> = [];

      if (options.type === SearchType.ALL || options.type === SearchType.USERS) {
        searchPromises.push(
          firstValueFrom(this.accountRepo.search(options.query, AccountType.USER, queryOptions)).then(users => {
            results.users = users;
            results.total.users = users.length;
          })
        );
      }

      if (options.type === SearchType.ALL || options.type === SearchType.ORGANIZATIONS) {
        searchPromises.push(
          firstValueFrom(this.accountRepo.search(options.query, AccountType.ORGANIZATION, queryOptions)).then(organizations => {
            results.organizations = organizations;
            results.total.organizations = organizations.length;
          })
        );
      }

      if (options.type === SearchType.ALL || options.type === SearchType.BLUEPRINTS) {
        searchPromises.push(
          firstValueFrom(this.blueprintRepo.search(options.query, queryOptions)).then(blueprints => {
            results.blueprints = blueprints;
            results.total.blueprints = blueprints.length;
          })
        );
      }

      // 等待所有搜索完成
      await Promise.all(searchPromises);

      results.total.all = results.total.users + results.total.organizations + results.total.blueprints;
      results.totalPages = Math.ceil(results.total.all / pageSize);

      this.searchResultsState.set(results);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '搜索失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清除搜索结果
   */
  clearResults(): void {
    this.searchResultsState.set(null);
    this.searchQueryState.set('');
    this.errorState.set(null);
  }
}
