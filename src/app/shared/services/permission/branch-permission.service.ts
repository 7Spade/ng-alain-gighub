import { Injectable, inject, signal, computed } from '@angular/core';
import { BranchPermissionRepository, BranchPermissionInsert, BranchPermissionUpdate, BranchPermissionLevel } from '@core';
import { BranchPermission } from '@shared';
import { firstValueFrom, Observable } from 'rxjs';

/**
 * BranchPermission Service
 *
 * 提供分支權限相關的業務邏輯和狀態管理
 * 實現權限矩陣：擁有者/協作組織/查看者權限區分
 *
 * @example
 * ```typescript
 * const branchPermService = inject(BranchPermissionService);
 *
 * // 檢查權限
 * const canWrite = await branchPermService.canPerformAction('branch-id', 'write');
 *
 * // 授予權限
 * await branchPermService.grantPermission('branch-id', 'account-id', BranchPermissionLevel.WRITE);
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BranchPermissionService {
  private branchPermissionRepository = inject(BranchPermissionRepository);

  // 使用 Signals 管理狀態
  private permissionsState = signal<BranchPermission[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly permissions = this.permissionsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly ownerPermissions = computed(() => this.permissions().filter(p => p.permission_level === BranchPermissionLevel.OWNER));

  readonly adminPermissions = computed(() => this.permissions().filter(p => p.permission_level === BranchPermissionLevel.ADMIN));

  readonly writePermissions = computed(() => this.permissions().filter(p => p.permission_level === BranchPermissionLevel.WRITE));

  readonly readPermissions = computed(() => this.permissions().filter(p => p.permission_level === BranchPermissionLevel.READ));

  /**
   * 權限矩陣：定義每個權限級別可以執行的操作
   */
  private readonly permissionMatrix: Record<BranchPermissionLevel, string[]> = {
    [BranchPermissionLevel.OWNER]: [
      'read',
      'write',
      'admin',
      'create_task',
      'modify_task_structure',
      'fork_branch',
      'review_pr',
      'merge_pr',
      'manage_permissions'
    ],
    [BranchPermissionLevel.ADMIN]: ['read', 'write', 'admin', 'create_task', 'review_pr', 'manage_permissions'],
    [BranchPermissionLevel.WRITE]: ['read', 'write', 'fill_contractor_fields', 'submit_pr', 'create_daily_report', 'create_quality_check'],
    [BranchPermissionLevel.READ]: ['read']
  };

  /**
   * 加載分支的所有權限
   *
   * @param branchId 分支 ID
   */
  async loadPermissionsByBranchId(branchId: string): Promise<BranchPermission[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const permissions = await firstValueFrom(this.branchPermissionRepository.findByBranchId(branchId));
      this.permissionsState.set(permissions);
      return permissions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载权限列表失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 加載賬戶的所有分支權限
   *
   * @param accountId 賬戶 ID
   */
  async loadPermissionsByAccountId(accountId: string): Promise<BranchPermission[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const permissions = await firstValueFrom(this.branchPermissionRepository.findByAccountId(accountId));
      return permissions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载权限列表失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 檢查賬戶在分支上的權限級別
   *
   * @param branchId 分支 ID
   * @param accountId 賬戶 ID
   * @returns 權限級別，如果沒有權限則返回 null
   */
  async getPermissionLevel(branchId: string, accountId: string): Promise<BranchPermissionLevel | null> {
    try {
      const permission = await firstValueFrom(this.branchPermissionRepository.findByBranchAndAccount(branchId, accountId));

      if (!permission) {
        return null;
      }

      return permission.permission_level as BranchPermissionLevel;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '查询权限失败');
      return null;
    }
  }

  /**
   * 檢查是否可以執行特定操作
   *
   * @param branchId 分支 ID
   * @param accountId 賬戶 ID
   * @param action 操作類型
   * @returns 是否有權限
   */
  async canPerformAction(branchId: string, accountId: string, action: string): Promise<boolean> {
    const permissionLevel = await this.getPermissionLevel(branchId, accountId);

    if (!permissionLevel) {
      return false;
    }

    const allowedActions = this.permissionMatrix[permissionLevel] || [];
    return allowedActions.includes(action);
  }

  /**
   * 授予分支權限
   *
   * @param branchId 分支 ID
   * @param accountId 賬戶 ID
   * @param permissionLevel 權限級別
   * @param grantedBy 授予者 ID
   * @returns 創建的權限記錄
   */
  async grantPermission(
    branchId: string,
    accountId: string,
    permissionLevel: BranchPermissionLevel,
    grantedBy: string
  ): Promise<BranchPermission> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 檢查是否已存在權限
      const existing = await firstValueFrom(this.branchPermissionRepository.findByBranchAndAccount(branchId, accountId));

      if (existing) {
        // 更新現有權限
        const updated = await firstValueFrom(
          this.branchPermissionRepository.updatePermissionLevel(existing.id, permissionLevel, grantedBy)
        );
        // 更新本地狀態
        this.permissionsState.update(permissions => permissions.map(p => (p.id === existing.id ? updated : p)));
        return updated;
      }

      // 創建新權限
      const permission = await firstValueFrom(
        this.branchPermissionRepository.grantPermission(branchId, accountId, permissionLevel, grantedBy)
      );
      // 更新本地狀態
      this.permissionsState.update(permissions => [...permissions, permission]);
      return permission;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '授予权限失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新權限級別
   *
   * @param id 權限 ID
   * @param permissionLevel 新的權限級別
   * @param grantedBy 更新者 ID
   * @returns 更新的權限記錄
   */
  async updatePermissionLevel(id: string, permissionLevel: BranchPermissionLevel, grantedBy: string): Promise<BranchPermission> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const permission = await firstValueFrom(this.branchPermissionRepository.updatePermissionLevel(id, permissionLevel, grantedBy));
      // 更新本地狀態
      this.permissionsState.update(permissions => permissions.map(p => (p.id === id ? permission : p)));
      return permission;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新权限失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 撤銷權限
   *
   * @param branchId 分支 ID
   * @param accountId 賬戶 ID
   */
  async revokePermission(branchId: string, accountId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.branchPermissionRepository.revokePermission(branchId, accountId));
      // 更新本地狀態
      this.permissionsState.update(permissions => permissions.filter(p => !(p.branch_id === branchId && p.account_id === accountId)));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '撤销权限失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 檢查是否是分支擁有者
   *
   * @param branchId 分支 ID
   * @param accountId 賬戶 ID
   * @returns 是否是擁有者
   */
  async isOwner(branchId: string, accountId: string): Promise<boolean> {
    const permissionLevel = await this.getPermissionLevel(branchId, accountId);
    return permissionLevel === BranchPermissionLevel.OWNER;
  }

  /**
   * 檢查是否可以修改任務結構（只有擁有者可以）
   *
   * @param branchId 分支 ID
   * @param accountId 賬戶 ID
   * @returns 是否可以修改
   */
  async canModifyTaskStructure(branchId: string, accountId: string): Promise<boolean> {
    return await this.canPerformAction(branchId, accountId, 'modify_task_structure');
  }

  /**
   * 檢查是否可以填寫承攬欄位（協作組織可以）
   *
   * @param branchId 分支 ID
   * @param accountId 賬戶 ID
   * @returns 是否可以填寫
   */
  async canFillContractorFields(branchId: string, accountId: string): Promise<boolean> {
    return await this.canPerformAction(branchId, accountId, 'fill_contractor_fields');
  }

  /**
   * 檢查是否可以審核 PR（擁有者和管理員可以）
   *
   * @param branchId 分支 ID
   * @param accountId 賬戶 ID
   * @returns 是否可以審核
   */
  async canReviewPR(branchId: string, accountId: string): Promise<boolean> {
    return await this.canPerformAction(branchId, accountId, 'review_pr');
  }

  /**
   * 重置狀態
   */
  reset(): void {
    this.permissionsState.set([]);
    this.errorState.set(null);
  }
}
