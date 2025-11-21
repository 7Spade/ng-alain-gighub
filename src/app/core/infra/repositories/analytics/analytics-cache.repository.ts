import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Database } from '../../types/common';
import { toCamelCaseData } from '../../utils/transformers';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type AnalyticsCacheRow = Database['public']['Tables']['analytics_cache']['Row'];
type AnalyticsCacheInsert = Database['public']['Tables']['analytics_cache']['Insert'];
type AnalyticsCacheUpdate = Database['public']['Tables']['analytics_cache']['Update'];

/**
 * AnalyticsCache 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type AnalyticsCache = AnalyticsCacheRow;
export type { AnalyticsCacheInsert, AnalyticsCacheUpdate };

/**
 * AnalyticsCache Repository
 *
 * 提供分析缓存相关的数据访问方法
 *
 * @example
 * ```typescript
 * const cacheRepo = inject(AnalyticsCacheRepository);
 * cacheRepo.findByCacheKey('cache-key').subscribe(cache => {
 *   console.log('Cache:', cache);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsCacheRepository extends BaseRepository<AnalyticsCache, AnalyticsCacheInsert, AnalyticsCacheUpdate> {
  protected tableName = 'analytics_cache';

  /**
   * 根据缓存键查询缓存
   *
   * @param cacheKey 缓存键
   * @returns Observable<AnalyticsCache | null>
   */
  findByCacheKey(cacheKey: string): Observable<AnalyticsCache | null> {
    return this.findAll({
      filters: {
        cacheKey // 会自动转换为 cache_key
      }
    }).pipe(map(caches => (caches.length > 0 ? caches[0] : null)));
  }

  /**
   * 根据缓存类型查询缓存
   *
   * @param cacheType 缓存类型
   * @param options 查询选项
   * @returns Observable<AnalyticsCache[]>
   */
  findByCacheType(cacheType: string, options?: QueryOptions): Observable<AnalyticsCache[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        cacheType // 会自动转换为 cache_type
      }
    });
  }

  /**
   * 根据蓝图 ID 查询缓存
   *
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<AnalyticsCache[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<AnalyticsCache[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 会自动转换为 blueprint_id
      }
    });
  }

  /**
   * 根据分支 ID 查询缓存
   *
   * @param branchId 分支 ID
   * @param options 查询选项
   * @returns Observable<AnalyticsCache[]>
   */
  findByBranchId(branchId: string, options?: QueryOptions): Observable<AnalyticsCache[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        branchId // 会自动转换为 branch_id
      }
    });
  }

  /**
   * 查询过期的缓存
   *
   * @returns Observable<AnalyticsCache[]>
   */
  findExpiredCaches(): Observable<AnalyticsCache[]> {
    // 过期的缓存：expires_at < NOW()
    const now = new Date().toISOString();
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .lt('expires_at', now)
      .order('expires_at', { ascending: true });

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '查询过期缓存失败');
        }
        return (response.data || []).map(item => toCamelCaseData<AnalyticsCache>(item));
      })
    );
  }

  /**
   * 查询有效的缓存（未过期）
   *
   * @param options 查询选项
   * @returns Observable<AnalyticsCache[]>
   */
  findValidCaches(options?: QueryOptions): Observable<AnalyticsCache[]> {
    // 有效的缓存：expires_at >= NOW()
    const now = new Date().toISOString();
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .gte('expires_at', now);

    // 应用排序
    if (options?.orderBy) {
      const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      query = query.order(snakeOrderBy, { ascending: options.orderDirection !== 'desc' });
    } else {
      query = query.order('expires_at', { ascending: true });
    }

    // 应用分页
    if (options?.page && options?.pageSize) {
      const fromIndex = (options.page - 1) * options.pageSize;
      const toIndex = fromIndex + options.pageSize - 1;
      query = query.range(fromIndex, toIndex);
    }

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '查询有效缓存失败');
        }
        return (response.data || []).map(item => toCamelCaseData<AnalyticsCache>(item));
      })
    );
  }
}
