import { Injectable, inject, signal, computed } from '@angular/core';
import { TaskStagingRepository, TaskStagingInsert, TaskStagingUpdate, TaskStaging } from '@core';
import { firstValueFrom } from 'rxjs';

/**
 * Task Staging Service
 *
 * 管理任務暫存區邏輯：
 * - 48 小時暫存機制
 * - 撤回條件驗證
 * - 自動狀態同步
 *
 * @example
 * ```typescript
 * const stagingService = inject(TaskStagingService);
 *
 * // 提交到暫存區
 * await stagingService.submitToStaging(taskId, accountId, data);
 *
 * // 檢查是否可撤回
 * const canWithdraw = await stagingService.canWithdraw(stagingId);
 *
 * // 撤回暫存
 * await stagingService.withdrawStaging(stagingId);
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskStagingService {
  private taskStagingRepository = inject(TaskStagingRepository);

  // Signals for state management
  private stagingItemsState = signal<TaskStaging[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Readonly signals
  readonly stagingItems = this.stagingItemsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly withdrawableItems = computed(() =>
    this.stagingItems().filter(item => item.can_withdraw && this.isWithinWithdrawPeriod(item))
  );

  readonly expiredItems = computed(() => this.stagingItems().filter(item => this.isExpired(item)));

  /**
   * 提交任務到暫存區
   *
   * @param taskId 任務 ID
   * @param submittedBy 提交者 ID
   * @param stagingData 暫存數據
   * @param photos 照片（可選）
   * @param notes 備註（可選）
   * @returns 建立的暫存記錄
   */
  async submitToStaging(
    taskId: string,
    submittedBy: string,
    stagingData: Record<string, any>,
    photos?: Record<string, any>[],
    notes?: string
  ): Promise<TaskStaging> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 檢查是否已有暫存記錄
      const existing = await firstValueFrom(this.taskStagingRepository.findByTaskId(taskId));
      if (existing.length > 0) {
        throw new Error('任務已有暫存記錄，請先處理現有暫存');
      }

      // 計算過期時間（48 小時後）
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      const insertData: TaskStagingInsert = {
        task_id: taskId,
        submitted_by: submittedBy,
        staging_data: stagingData,
        photos: photos || [],
        notes: notes || null,
        can_withdraw: true,
        expires_at: expiresAt.toISOString(),
        submitted_at: new Date().toISOString()
      };

      const staging = await firstValueFrom(this.taskStagingRepository.create(insertData));

      // 更新本地狀態
      this.stagingItemsState.update(items => [...items, staging]);

      return staging;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '提交到暫存區失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 檢查是否可以撤回
   *
   * @param stagingId 暫存記錄 ID
   * @returns 是否可撤回
   */
  async canWithdraw(stagingId: string): Promise<boolean> {
    try {
      const staging = await firstValueFrom(this.taskStagingRepository.findById(stagingId));
      if (!staging) {
        return false;
      }

      // 檢查 can_withdraw 標記
      if (!staging.can_withdraw) {
        return false;
      }

      // 檢查是否在 48 小時內
      if (!this.isWithinWithdrawPeriod(staging)) {
        return false;
      }

      // 檢查是否已確認
      if (staging.confirmed_at) {
        return false;
      }

      // 檢查是否已撤回
      if (staging.withdrawn_at) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('檢查撤回條件失敗:', error);
      return false;
    }
  }

  /**
   * 撤回暫存
   *
   * @param stagingId 暫存記錄 ID
   * @param accountId 撤回者 ID（用於權限檢查）
   * @returns 更新後的暫存記錄
   */
  async withdrawStaging(stagingId: string, accountId: string): Promise<TaskStaging> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 檢查是否可撤回
      const canWithdrawResult = await this.canWithdraw(stagingId);
      if (!canWithdrawResult) {
        throw new Error('無法撤回：已超過 48 小時或已確認/已撤回');
      }

      // 檢查權限：只有提交者可以撤回
      const staging = await firstValueFrom(this.taskStagingRepository.findById(stagingId));
      if (!staging) {
        throw new Error('暫存記錄不存在');
      }

      if (staging.submitted_by !== accountId) {
        throw new Error('無權撤回：只有提交者可以撤回');
      }

      // 更新暫存記錄
      const updateData: TaskStagingUpdate = {
        withdrawn_at: new Date().toISOString(),
        can_withdraw: false
      };

      const updated = await firstValueFrom(this.taskStagingRepository.update(stagingId, updateData));

      // 更新本地狀態
      this.stagingItemsState.update(items => items.map(item => (item.id === stagingId ? updated : item)));

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '撤回暫存失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 確認暫存（完成品檢，無法撤回）
   *
   * @param stagingId 暫存記錄 ID
   * @param confirmedBy 確認者 ID
   * @returns 更新後的暫存記錄
   */
  async confirmStaging(stagingId: string): Promise<TaskStaging> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updateData: TaskStagingUpdate = {
        confirmed_at: new Date().toISOString(),
        can_withdraw: false
      };

      const updated = await firstValueFrom(this.taskStagingRepository.update(stagingId, updateData));

      // 更新本地狀態
      this.stagingItemsState.update(items => items.map(item => (item.id === stagingId ? updated : item)));

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '確認暫存失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入任務的暫存記錄
   *
   * @param taskId 任務 ID
   */
  async loadStagingByTaskId(taskId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const items = await firstValueFrom(this.taskStagingRepository.findByTaskId(taskId));
      this.stagingItemsState.set(items);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入暫存記錄失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入提交者的所有暫存記錄
   *
   * @param accountId 帳號 ID
   */
  async loadStagingBySubmitter(accountId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const items = await firstValueFrom(this.taskStagingRepository.findBySubmittedBy(accountId));
      this.stagingItemsState.set(items);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入暫存記錄失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 檢查暫存是否在撤回期限內（48 小時）
   *
   * @param staging 暫存記錄
   * @returns 是否在期限內
   */
  private isWithinWithdrawPeriod(staging: TaskStaging): boolean {
    if (!staging.expires_at) {
      return false;
    }

    const expiresAt = new Date(staging.expires_at);
    const now = new Date();
    return now < expiresAt;
  }

  /**
   * 檢查暫存是否已過期
   *
   * @param staging 暫存記錄
   * @returns 是否已過期
   */
  private isExpired(staging: TaskStaging): boolean {
    if (!staging.expires_at) {
      return false;
    }

    const expiresAt = new Date(staging.expires_at);
    const now = new Date();
    return now >= expiresAt;
  }

  /**
   * 獲取暫存剩餘時間（小時）
   *
   * @param staging 暫存記錄
   * @returns 剩餘小時數
   */
  getRemainingHours(staging: TaskStaging): number {
    if (!staging.expires_at) {
      return 0;
    }

    const expiresAt = new Date(staging.expires_at);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return Math.max(0, Math.floor(diffHours));
  }

  /**
   * 清除錯誤狀態
   */
  clearError(): void {
    this.errorState.set(null);
  }
}
