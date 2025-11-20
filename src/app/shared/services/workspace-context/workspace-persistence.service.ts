import { Injectable, inject } from '@angular/core';
import { CacheService } from '@delon/cache';

/**
 * Workspace Persistence Service
 *
 * 工作区上下文持久化服务
 * 使用 @delon/cache 进行持久化存储，代码更简洁、更稳定
 *
 * 职责：
 * - 保存上下文状态到持久化存储
 * - 从持久化存储恢复上下文状态
 * - 清除持久化的上下文状态
 *
 * @example
 * ```typescript
 * const persistenceService = inject(WorkspacePersistenceService);
 *
 * // 保存上下文
 * persistenceService.saveContext('organization', 'org-id');
 *
 * // 恢复上下文
 * const context = persistenceService.restoreContext();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class WorkspacePersistenceService {
  private readonly cache = inject(CacheService);
  private readonly STORAGE_KEY_TYPE = 'workspace.contextType';
  private readonly STORAGE_KEY_ID = 'workspace.contextId';

  /**
   * 保存上下文状态到持久化存储
   *
   * @param contextType 上下文类型
   * @param contextId 上下文 ID（可选）
   */
  saveContext(contextType: 'app' | 'user' | 'organization' | 'team', contextId: string | null): void {
    // 使用 CacheService 保存到持久化存储（localStorage）
    // 's' 类型使用持久化存储（默认是 localStorage）
    this.cache.set(this.STORAGE_KEY_TYPE, contextType, { type: 's' });
    if (contextId) {
      this.cache.set(this.STORAGE_KEY_ID, contextId, { type: 's' });
    } else {
      this.cache.remove(this.STORAGE_KEY_ID);
    }
  }

  /**
   * 从持久化存储恢复上下文状态
   *
   * @returns 恢复的上下文状态，如果不存在则返回 null
   */
  restoreContext(): { type: 'app' | 'user' | 'organization' | 'team'; id: string | null } | null {
    const savedContextType = this.cache.getNone<('app' | 'user' | 'organization' | 'team') | null>(this.STORAGE_KEY_TYPE);
    const savedContextId = this.cache.getNone<string | null>(this.STORAGE_KEY_ID);

    if (savedContextType) {
      return {
        type: savedContextType,
        id: savedContextId
      };
    }
    return null;
  }

  /**
   * 清除持久化的上下文状态
   */
  clearContext(): void {
    this.cache.remove(this.STORAGE_KEY_TYPE);
    this.cache.remove(this.STORAGE_KEY_ID);
  }
}
