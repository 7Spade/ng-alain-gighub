import { Injectable, inject, signal, computed } from '@angular/core';
import { BranchContextService } from '@core';
import { BranchPermissionService, BranchPermissionLevel, AuthStateService } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Branch Data Isolation Service
 *
 * 提供分支數據隔離相關的業務邏輯
 * 實現主分支與組織分支的數據隔離機制
 *
 * @example
 * ```typescript
 * const isolationService = inject(BranchDataIsolationService);
 *
 * // 檢查是否可以訪問數據
 * const canAccess = await isolationService.canAccessData('task-id', 'read');
 *
 * // 獲取數據過濾條件
 * const filters = isolationService.getDataFilters();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BranchDataIsolationService {
  private branchContext = inject(BranchContextService);
  private branchPermissionService = inject(BranchPermissionService);
  private authState = inject(AuthStateService);

  // 使用 Signals 管理狀態
  private isolationEnabledState = signal<boolean>(true);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly isolationEnabled = this.isolationEnabledState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly isMainBranch = computed(() => this.branchContext.isMainBranch());
  readonly currentBranch = computed(() => this.branchContext.currentBranch());
  readonly currentBranchId = computed(() => this.branchContext.currentBranchId());

  /**
   * 獲取數據過濾條件
   * 根據當前分支狀態返回適當的過濾條件
   *
   * @returns 過濾條件對象
   */
  getDataFilters(): Record<string, any> {
    const branch = this.currentBranch();
    const filters: Record<string, any> = {};

    if (branch) {
      // 組織分支：只顯示該分支的數據
      filters['branchId'] = branch.id;
    } else {
      // 主分支：顯示所有數據（不設置branchId過濾）
      // 或者可以設置 branchId 為 null
    }

    return filters;
  }

  /**
   * 檢查是否可以訪問指定數據
   *
   * @param resourceId 資源ID
   * @param action 操作類型（read/write/admin）
   * @param resourceType 資源類型（task/daily_report/quality_check等）
   * @returns 是否有權限
   */
  async canAccessData(resourceId: string, action: 'read' | 'write' | 'admin', resourceType: string): Promise<boolean> {
    const branch = this.currentBranch();
    const currentUser = this.authState.user();

    if (!currentUser) {
      return false;
    }

    // 主分支：藍圖擁有者可以訪問所有數據
    if (!branch) {
      // TODO: 檢查是否為藍圖擁有者
      return true;
    }

    // 組織分支：檢查分支權限
    return await this.branchPermissionService.canPerformAction(branch.id, currentUser.id, action);
  }

  /**
   * 檢查是否可以修改任務結構
   * 只有主分支的擁有者可以修改任務結構
   *
   * @returns 是否可以修改
   */
  async canModifyTaskStructure(): Promise<boolean> {
    const branch = this.currentBranch();
    const currentUser = this.authState.user();

    if (!currentUser) {
      return false;
    }

    // 主分支：檢查是否為藍圖擁有者
    if (!branch) {
      // TODO: 檢查是否為藍圖擁有者
      return true;
    }

    // 組織分支：不能修改任務結構
    return false;
  }

  /**
   * 檢查是否可以填寫承攬欄位
   * 只有組織分支可以填寫承攬欄位
   *
   * @returns 是否可以填寫
   */
  async canFillContractorFields(): Promise<boolean> {
    const branch = this.currentBranch();
    const currentUser = this.authState.user();

    if (!currentUser || !branch) {
      return false;
    }

    return await this.branchPermissionService.canFillContractorFields(branch.id, currentUser.id);
  }

  /**
   * 檢查數據是否屬於當前分支
   *
   * @param dataBranchId 數據的分支ID（可能為null表示主分支）
   * @returns 是否屬於當前分支
   */
  belongsToCurrentBranch(dataBranchId: string | null): boolean {
    const currentBranch = this.currentBranch();

    // 主分支：數據的branchId應該為null
    if (!currentBranch) {
      return dataBranchId === null;
    }

    // 組織分支：數據的branchId應該等於當前分支ID
    return dataBranchId === currentBranch.id;
  }

  /**
   * 過濾數據列表，只返回屬於當前分支的數據
   *
   * @param dataList 數據列表
   * @param getBranchId 獲取數據分支ID的函數
   * @returns 過濾後的數據列表
   */
  filterByCurrentBranch<T>(dataList: T[], getBranchId: (item: T) => string | null): T[] {
    return dataList.filter(item => this.belongsToCurrentBranch(getBranchId(item)));
  }

  /**
   * 啟用數據隔離
   */
  enableIsolation(): void {
    this.isolationEnabledState.set(true);
  }

  /**
   * 禁用數據隔離（用於管理員查看所有數據）
   */
  disableIsolation(): void {
    this.isolationEnabledState.set(false);
  }

  /**
   * 重置狀態
   */
  reset(): void {
    this.isolationEnabledState.set(true);
    this.errorState.set(null);
  }
}
