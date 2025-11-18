import { Injectable, inject, signal, computed } from '@angular/core';
import { AnalyticsCacheRepository, type AnalyticsCache, type AnalyticsCacheInsert, type AnalyticsCacheUpdate } from '@core';
import { firstValueFrom } from 'rxjs';

/**
 * Analytics Cache Service
 *
 * 提供分析快取相关的业务逻辑和状态管理
 * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 *
 * 功能：
 * - 快取的 CRUD 操作
 * - 按快取键查询
 * - 按快取类型查询
 * - 过期快取清理
 * - 快取有效性检查
 * - 快取命中率统计
 *
 * 支援的快取类型：
 * - dashboard_stats: 仪表板统计数据
 * - task_analytics: 任务分析数据
 * - issue_analytics: 问题分析数据
 * - progress_summary: 进度汇总数据
 * - quality_metrics: 品质指标数据
 *
 * @example
 * ```typescript
 * const cacheService = inject(AnalyticsCacheService);
 *
 * // 获取快取数据
 * const cachedData = await cacheService.getCache('dashboard_stats', 'blueprint-123');
 * if (cachedData) {
 *   console.log('使用快取数据:', cachedData.data);
 * } else {
 *   // 重新计算并快取
 *   const newData = await calculateStats();
 *   await cacheService.setCache('dashboard_stats', 'blueprint-123', newData, 3600);
 * }
 *
 * // 清理过期快取
 * await cacheService.cleanupExpiredCaches();
 * ```
 *
 * @see AnalyticsCacheRepository
 * @see docs/22-完整SQL表結構定義.md
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsCacheService {
  private analyticsCacheRepository = inject(AnalyticsCacheRepository);

  // 使用 Signals 管理状态
  private cachesState = signal<AnalyticsCache[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);
  private cacheHitsState = signal<number>(0);
  private cacheMissesState = signal<number>(0);

  // 暴露 ReadonlySignal 给组件
  readonly caches = this.cachesState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly cacheHits = this.cacheHitsState.asReadonly();
  readonly cacheMisses = this.cacheMissesState.asReadonly();

  // Computed signals
  readonly cacheHitRate = computed(() => {
    const hits = this.cacheHits();
    const misses = this.cacheMisses();
    const total = hits + misses;
    return total > 0 ? (hits / total) * 100 : 0;
  });

  readonly validCacheCount = computed(() => {
    const caches = this.caches() as any[];
    const now = new Date();
    return caches.filter(c => new Date(c.expires_at) > now).length;
  });

  readonly expiredCacheCount = computed(() => {
    const caches = this.caches() as any[];
    const now = new Date();
    return caches.filter(c => new Date(c.expires_at) <= now).length;
  });

  /**
   * 获取快取数据
   *
   * @param cacheType 快取类型
   * @param resourceId 资源 ID（如 blueprint_id）
   * @returns 快取数据，如果不存在或已过期则返回 null
   */
  async getCache(cacheType: string, resourceId: string): Promise<any | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const cacheKey = this.generateCacheKey(cacheType, resourceId);
      const cache = await firstValueFrom(this.analyticsCacheRepository.findByCacheKey(cacheKey));

      if (!cache) {
        this.cacheMissesState.update(count => count + 1);
        return null;
      }

      // 检查是否过期
      const now = new Date();
      const expiresAt = new Date((cache as any).expires_at);

      if (expiresAt <= now) {
        // 快取已过期，删除并返回 null
        await firstValueFrom(this.analyticsCacheRepository.delete(cache.id));
        this.cacheMissesState.update(count => count + 1);
        return null;
      }

      this.cacheHitsState.update(count => count + 1);
      return (cache as any).cache_data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取快取失败';
      this.errorState.set(errorMessage);
      return null;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 设置快取数据
   *
   * @param cacheType 快取类型
   * @param resourceId 资源 ID
   * @param data 要快取的数据
   * @param ttlSeconds 过期时间（秒），默认 3600 秒（1 小时）
   */
  async setCache(cacheType: string, resourceId: string, data: any, ttlSeconds = 3600): Promise<AnalyticsCache> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const cacheKey = this.generateCacheKey(cacheType, resourceId);
      const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();

      // 检查是否已存在
      const existingCache = await firstValueFrom(this.analyticsCacheRepository.findByCacheKey(cacheKey));

      let cache: AnalyticsCache;

      if (existingCache) {
        // 更新现有快取
        cache = await firstValueFrom(
          this.analyticsCacheRepository.update(existingCache.id, {
            cacheData: data,
            expiresAt
          } as any)
        );
      } else {
        // 创建新快取
        cache = await firstValueFrom(
          this.analyticsCacheRepository.create({
            cacheKey,
            cacheType,
            blueprintId: this.extractBlueprintId(resourceId),
            branchId: this.extractBranchId(resourceId),
            cacheData: data,
            expiresAt
          } as any)
        );
      }

      // 更新本地状态
      this.cachesState.update(caches => {
        const filtered = caches.filter(c => c.id !== cache.id);
        return [cache, ...filtered];
      });

      return cache;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '设置快取失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 删除快取
   */
  async deleteCache(cacheType: string, resourceId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const cacheKey = this.generateCacheKey(cacheType, resourceId);
      const cache = await firstValueFrom(this.analyticsCacheRepository.findByCacheKey(cacheKey));

      if (cache) {
        await firstValueFrom(this.analyticsCacheRepository.delete(cache.id));

        // 更新本地状态
        this.cachesState.update(caches => caches.filter(c => c.id !== cache.id));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除快取失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清理过期快取
   */
  async cleanupExpiredCaches(): Promise<number> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const expiredCaches = await firstValueFrom(this.analyticsCacheRepository.findExpiredCaches());

      let deletedCount = 0;
      for (const cache of expiredCaches) {
        try {
          await firstValueFrom(this.analyticsCacheRepository.delete(cache.id));
          deletedCount++;
        } catch (error) {
          console.error('[AnalyticsCacheService] Failed to delete expired cache:', cache.id, error);
        }
      }

      // 更新本地状态
      this.cachesState.update(caches => caches.filter(c => !expiredCaches.find(ec => ec.id === c.id)));

      return deletedCount;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '清理过期快取失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 载入指定蓝图的所有快取
   */
  async loadCachesByBlueprint(blueprintId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const caches = await firstValueFrom(this.analyticsCacheRepository.findByBlueprintId(blueprintId));
      this.cachesState.set(caches);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '载入快取失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 重置快取统计
   */
  resetStatistics(): void {
    this.cacheHitsState.set(0);
    this.cacheMissesState.set(0);
  }

  /**
   * 清除错误状态
   */
  clearError(): void {
    this.errorState.set(null);
  }

  /**
   * 生成快取键
   *
   * @private
   */
  private generateCacheKey(cacheType: string, resourceId: string): string {
    return `${cacheType}:${resourceId}`;
  }

  /**
   * 从资源 ID 中提取 blueprint ID
   *
   * @private
   */
  private extractBlueprintId(resourceId: string): string | null {
    // 假设 resourceId 格式为 "blueprint-xxx" 或 "blueprint-xxx:branch-yyy"
    const parts = resourceId.split(':');
    const blueprintPart = parts[0];
    return blueprintPart.startsWith('blueprint-') ? blueprintPart : null;
  }

  /**
   * 从资源 ID 中提取 branch ID
   *
   * @private
   */
  private extractBranchId(resourceId: string): string | null {
    // 假设 resourceId 格式为 "blueprint-xxx:branch-yyy"
    const parts = resourceId.split(':');
    if (parts.length > 1 && parts[1].startsWith('branch-')) {
      return parts[1];
    }
    return null;
  }
}
