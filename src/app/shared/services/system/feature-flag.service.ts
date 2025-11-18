import { Injectable, inject, signal, computed } from '@angular/core';
import { FeatureFlagRepository } from '@core';
import { FeatureFlag, FeatureFlagInsert, FeatureFlagUpdate } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Feature Flag Service
 *
 * 提供功能開關相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * 支援功能：
 * - 灰度發布（Gradual Rollout）
 * - A/B 測試
 * - 目標帳戶/組織
 * - 開關控制
 *
 * @example
 * ```typescript
 * const featureFlagService = inject(FeatureFlagService);
 *
 * // 檢查功能是否啟用
 * const isEnabled = await featureFlagService.isEnabled('new-ui-design');
 *
 * // 訂閱功能開關狀態
 * effect(() => {
 *   console.log('Feature Flags:', featureFlagService.flags());
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private featureFlagRepository = inject(FeatureFlagRepository);

  // 使用 Signals 管理狀態
  private flagsState = signal<FeatureFlag[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly flags = this.flagsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly enabledFlags = computed(() => this.flags().filter(f => f.enabled));

  readonly disabledFlags = computed(() => this.flags().filter(f => !f.enabled));

  // Flags map for quick lookup
  readonly flagsMap = computed(() => {
    const map = new Map<string, FeatureFlag>();
    this.flags().forEach(flag => {
      map.set(flag.key, flag);
    });
    return map;
  });

  /**
   * 載入所有功能開關
   */
  async loadFlags(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.featureFlagRepository.findAll());
      this.flagsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入功能開關失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入啟用的功能開關
   */
  async loadEnabledFlags(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.featureFlagRepository.findEnabled());
      this.flagsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入啟用的功能開關失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根據 key 檢查功能是否啟用
   */
  async isEnabled(key: string, accountId?: string, organizationId?: string): Promise<boolean> {
    try {
      // 先從本地快取檢查
      const cachedFlag = this.flagsMap().get(key);
      if (cachedFlag !== undefined) {
        return this.checkFlagEnabled(cachedFlag, accountId, organizationId);
      }

      // 如果快取中沒有，從資料庫載入
      const flag = await firstValueFrom(this.featureFlagRepository.findByKey(key));
      if (!flag) {
        return false;
      }

      // 更新本地快取
      this.flagsState.update(current => {
        const exists = current.find(f => f.key === key);
        if (!exists) {
          return [...current, flag];
        }
        return current;
      });

      return this.checkFlagEnabled(flag, accountId, organizationId);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '檢查功能開關失敗');
      return false;
    }
  }

  /**
   * 檢查功能開關是否對特定帳戶/組織啟用
   */
  private checkFlagEnabled(flag: FeatureFlag, accountId?: string, organizationId?: string): boolean {
    if (!flag.enabled) {
      return false;
    }

    // 如果有目標限制，檢查是否符合
    if (flag.targetAccounts && flag.targetAccounts.length > 0) {
      if (!accountId || !flag.targetAccounts.includes(accountId)) {
        return false;
      }
    }

    if (flag.targetOrganizations && flag.targetOrganizations.length > 0) {
      if (!organizationId || !flag.targetOrganizations.includes(organizationId)) {
        return false;
      }
    }

    // 如果有灰度比例，根據帳戶 ID 計算是否啟用
    if (flag.rolloutPercentage !== null && flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      if (!accountId) {
        return false;
      }

      // 使用簡單的雜湊函數決定是否啟用（確保相同帳戶總是得到相同結果）
      const hash = this.hashString(accountId + flag.key);
      const threshold = (flag.rolloutPercentage / 100) * Number.MAX_SAFE_INTEGER;
      return hash <= threshold;
    }

    return true;
  }

  /**
   * 簡單的字串雜湊函數
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * 根據 key 取得功能開關
   */
  async getByKey(key: string): Promise<FeatureFlag | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const flag = await firstValueFrom(this.featureFlagRepository.findByKey(key));
      return flag;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入功能開關失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建新功能開關
   */
  async create(data: FeatureFlagInsert): Promise<FeatureFlag> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const flag = await firstValueFrom(this.featureFlagRepository.create(data));

      // 更新本地狀態
      this.flagsState.update(current => [...current, flag]);

      return flag;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建功能開關失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新功能開關
   */
  async update(id: string, data: FeatureFlagUpdate): Promise<FeatureFlag> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updated = await firstValueFrom(this.featureFlagRepository.update(id, data));

      // 更新本地狀態
      this.flagsState.update(current => current.map(f => (f.id === id ? updated : f)));

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新功能開關失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 切換功能開關（啟用/停用）
   */
  async toggleFlag(key: string): Promise<FeatureFlag> {
    const flag = await this.getByKey(key);
    if (!flag) {
      throw new Error(`功能開關 ${key} 不存在`);
    }

    return this.update(flag.id, { enabled: !flag.enabled });
  }

  /**
   * 設定灰度比例
   */
  async setRolloutPercentage(key: string, percentage: number): Promise<FeatureFlag> {
    const flag = await this.getByKey(key);
    if (!flag) {
      throw new Error(`功能開關 ${key} 不存在`);
    }

    if (percentage < 0 || percentage > 100) {
      throw new Error('灰度比例必須在 0-100 之間');
    }

    return this.update(flag.id, { rolloutPercentage: percentage });
  }

  /**
   * 設定目標帳戶
   */
  async setTargetAccounts(key: string, accountIds: string[]): Promise<FeatureFlag> {
    const flag = await this.getByKey(key);
    if (!flag) {
      throw new Error(`功能開關 ${key} 不存在`);
    }

    return this.update(flag.id, { targetAccounts: accountIds });
  }

  /**
   * 設定目標組織
   */
  async setTargetOrganizations(key: string, organizationIds: string[]): Promise<FeatureFlag> {
    const flag = await this.getByKey(key);
    if (!flag) {
      throw new Error(`功能開關 ${key} 不存在`);
    }

    return this.update(flag.id, { targetOrganizations: organizationIds });
  }

  /**
   * 刪除功能開關
   */
  async delete(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.featureFlagRepository.delete(id));

      // 更新本地狀態
      this.flagsState.update(current => current.filter(f => f.id !== id));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '刪除功能開關失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清空本地狀態
   */
  clear(): void {
    this.flagsState.set([]);
    this.errorState.set(null);
  }
}
