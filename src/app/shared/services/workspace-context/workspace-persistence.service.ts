import { Injectable } from '@angular/core';

/**
 * Workspace Persistence Service
 *
 * 工作区上下文持久化服务
 * 负责将上下文状态保存到 localStorage 和从 localStorage 恢复
 *
 * 职责：
 * - 保存上下文状态到 localStorage
 * - 从 localStorage 恢复上下文状态
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
  private readonly STORAGE_KEY_TYPE = 'workspace.contextType';
  private readonly STORAGE_KEY_ID = 'workspace.contextId';

  /**
   * 保存上下文状态到 localStorage
   *
   * @param contextType 上下文类型
   * @param contextId 上下文 ID（可选）
   */
  saveContext(contextType: 'app' | 'user' | 'organization' | 'team', contextId: string | null): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_TYPE, contextType);
      if (contextId) {
        localStorage.setItem(this.STORAGE_KEY_ID, contextId);
      } else {
        localStorage.removeItem(this.STORAGE_KEY_ID);
      }
    } catch (error) {
      console.warn('Failed to persist workspace context to localStorage:', error);
    }
  }

  /**
   * 从 localStorage 恢复上下文状态
   *
   * @returns 恢复的上下文状态，如果不存在则返回 null
   */
  restoreContext(): { type: 'app' | 'user' | 'organization' | 'team'; id: string | null } | null {
    try {
      const savedContextType = localStorage.getItem(this.STORAGE_KEY_TYPE) as 'app' | 'user' | 'organization' | 'team' | null;
      const savedContextId = localStorage.getItem(this.STORAGE_KEY_ID);

      if (savedContextType) {
        return {
          type: savedContextType,
          id: savedContextId
        };
      }
      return null;
    } catch (error) {
      console.warn('Failed to restore workspace context from localStorage:', error);
      return null;
    }
  }

  /**
   * 清除持久化的上下文状态
   */
  clearContext(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY_TYPE);
      localStorage.removeItem(this.STORAGE_KEY_ID);
    } catch (error) {
      console.warn('Failed to clear workspace context from localStorage:', error);
    }
  }
}
