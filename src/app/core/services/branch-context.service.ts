import { Injectable, inject, signal, computed } from '@angular/core';
import { BlueprintBranch, BranchService } from '@shared';

/**
 * Branch Context Service
 *
 * 管理當前選中的分支上下文，用於數據隔離
 * 確保Repository層和Service層能夠根據當前分支過濾數據
 *
 * @example
 * ```typescript
 * const branchContext = inject(BranchContextService);
 *
 * // 設置當前分支
 * branchContext.setCurrentBranch(branch);
 *
 * // 獲取當前分支
 * const currentBranch = branchContext.currentBranch();
 *
 * // 檢查是否在主分支
 * const isMainBranch = branchContext.isMainBranch();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BranchContextService {
  private branchService = inject(BranchService);

  // 當前分支狀態（null表示主分支）
  private currentBranchState = signal<BlueprintBranch | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly currentBranch = this.currentBranchState.asReadonly();

  // Computed signals
  readonly isMainBranch = computed(() => this.currentBranchState() === null);
  readonly isOrganizationBranch = computed(() => this.currentBranchState() !== null);
  readonly currentBranchId = computed(() => this.currentBranchState()?.id || null);
  readonly currentBlueprintId = computed(() => {
    const branch = this.currentBranchState();
    return branch?.blueprint_id || null;
  });

  /**
   * 設置當前分支
   *
   * @param branch 分支對象，null表示切換到主分支
   */
  setCurrentBranch(branch: BlueprintBranch | null): void {
    this.currentBranchState.set(branch);
    // 同時更新BranchService的選中狀態
    this.branchService.selectBranch(branch);
  }

  /**
   * 根據分支ID設置當前分支
   *
   * @param branchId 分支ID，null表示切換到主分支
   */
  async setCurrentBranchById(branchId: string | null): Promise<void> {
    if (!branchId) {
      this.setCurrentBranch(null);
      return;
    }

    try {
      const branch = await this.branchService.loadBranchById(branchId);
      if (branch) {
        this.setCurrentBranch(branch);
      } else {
        throw new Error('分支不存在');
      }
    } catch (error) {
      throw new Error(`設置當前分支失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    }
  }

  /**
   * 清除當前分支（切換到主分支）
   */
  clearCurrentBranch(): void {
    this.setCurrentBranch(null);
  }

  /**
   * 檢查當前分支是否為指定分支
   *
   * @param branchId 分支ID
   * @returns 是否為當前分支
   */
  isCurrentBranch(branchId: string): boolean {
    return this.currentBranchState()?.id === branchId;
  }

  /**
   * 檢查當前分支是否屬於指定藍圖
   *
   * @param blueprintId 藍圖ID
   * @returns 是否屬於該藍圖
   */
  belongsToBlueprint(blueprintId: string): boolean {
    return this.currentBlueprintId() === blueprintId;
  }
}
