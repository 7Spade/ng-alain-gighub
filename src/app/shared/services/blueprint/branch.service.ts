import { Injectable, inject, signal, computed } from '@angular/core';
import {
  BlueprintBranchRepository,
  BranchForkRepository,
  BlueprintBranchInsert,
  BlueprintBranchUpdate,
  BranchForkInsert,
  BranchType,
  BranchStatus
} from '@core';
import { BlueprintBranch, BranchFork } from '@shared';
import { Observable, firstValueFrom } from 'rxjs';

/**
 * Branch Service
 *
 * 提供分支管理相关的业务逻辑和状态管理
 * 实现 Git-like 分支模型：Fork 机制、分支同步等
 *
 * @example
 * ```typescript
 * const branchService = inject(BranchService);
 *
 * // 订阅分支列表
 * effect(() => {
 *   console.log('Branches:', branchService.branches());
 * });
 *
 * // Fork 分支给组织
 * await branchService.forkBranch('blueprint-id', 'org-id', 'branch-name');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private branchRepository = inject(BlueprintBranchRepository);
  private branchForkRepository = inject(BranchForkRepository);

  // 使用 Signals 管理状态
  private branchesState = signal<BlueprintBranch[]>([]);
  private selectedBranchState = signal<BlueprintBranch | null>(null);
  private forksState = signal<BranchFork[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly branches = this.branchesState.asReadonly();
  readonly selectedBranch = this.selectedBranchState.asReadonly();
  readonly forks = this.forksState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly activeBranches = computed(() => this.branches().filter(b => b.status === BranchStatus.ACTIVE));

  readonly mergedBranches = computed(() => this.branches().filter(b => b.status === BranchStatus.MERGED));

  /**
   * 加载所有分支
   */
  async loadBranches(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const branches = await firstValueFrom(this.branchRepository.findAll());
      this.branchesState.set(branches);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载分支列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据蓝图 ID 加载分支列表
   */
  async loadBranchesByBlueprintId(blueprintId: string): Promise<BlueprintBranch[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const branches = await firstValueFrom(this.branchRepository.findByBlueprintId(blueprintId));
      this.branchesState.set(branches);
      return branches;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载分支列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据组织 ID 加载分支列表
   */
  async loadBranchesByOrganizationId(organizationId: string): Promise<BlueprintBranch[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const branches = await firstValueFrom(this.branchRepository.findByOrganizationId(organizationId));
      this.branchesState.set(branches);
      return branches;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载分支列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据 ID 加载分支
   */
  async loadBranchById(id: string): Promise<BlueprintBranch | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const branch = await firstValueFrom(this.branchRepository.findById(id));
      if (branch) {
        this.selectedBranchState.set(branch);
        // 同时加载 Fork 记录
        await this.loadForksByBranchId(id);
      }
      return branch;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载分支失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Fork 分支给组织（创建组织分支）
   *
   * @param blueprintId 蓝图 ID
   * @param organizationId 组织 ID
   * @param branchName 分支名称
   * @param branchType 分支类型
   * @param forkedBy Fork 操作者 ID
   * @param notes 备注
   * @returns 创建的分支
   */
  async forkBranch(
    blueprintId: string,
    organizationId: string,
    branchName: string,
    branchType: BranchType = BranchType.CONTRACTOR,
    forkedBy: string,
    notes?: string
  ): Promise<BlueprintBranch> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 检查是否已存在分支
      const existing = await firstValueFrom(this.branchRepository.findByBlueprintAndOrganization(blueprintId, organizationId));

      if (existing) {
        throw new Error('该组织已存在分支');
      }

      // 创建分支
      // 使用类型断言，因为 BaseRepository 会自动进行 camelCase → snake_case 转换
      const branchData = {
        blueprintId,
        organizationId,
        branchName,
        branchType,
        status: BranchStatus.ACTIVE,
        notes
      } as any as BlueprintBranchInsert;

      const branch = await firstValueFrom(this.branchRepository.create(branchData));

      // 创建 Fork 记录
      // 使用类型断言，因为 BaseRepository 会自动进行 camelCase → snake_case 转换
      const forkData = {
        blueprintId,
        branchId: branch.id,
        forkedBy,
        forkReason: notes
      } as any as BranchForkInsert;
      await firstValueFrom(this.branchForkRepository.create(forkData));

      // 更新本地状态
      this.branchesState.update(branches => [...branches, branch]);
      return branch;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Fork 分支失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新分支
   */
  async updateBranch(id: string, data: BlueprintBranchUpdate): Promise<BlueprintBranch> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const branch = await firstValueFrom(this.branchRepository.update(id, data));
      // 更新本地状态
      this.branchesState.update(branches => branches.map(b => (b.id === id ? branch : b)));
      // 如果更新的是当前选中的分支，也更新选中状态
      if (this.selectedBranch()?.id === id) {
        this.selectedBranchState.set(branch);
      }
      return branch;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新分支失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 删除分支
   */
  async deleteBranch(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.branchRepository.delete(id));
      // 更新本地状态
      this.branchesState.update(branches => branches.filter(b => b.id !== id));
      // 如果删除的是当前选中的分支，清空选中状态
      if (this.selectedBranch()?.id === id) {
        this.selectedBranchState.set(null);
        this.forksState.set([]);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '删除分支失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 选择分支
   */
  selectBranch(branch: BlueprintBranch | null): void {
    this.selectedBranchState.set(branch);
    if (branch) {
      this.loadForksByBranchId(branch.id);
    } else {
      this.forksState.set([]);
    }
  }

  /**
   * 创建 Fork 记录
   *
   * @param blueprintId 蓝图 ID
   * @param branchId 分支 ID
   * @param forkedBy Fork 操作者 ID
   * @param forkReason Fork 原因
   * @returns 创建的 Fork 记录
   */
  async createForkRecord(blueprintId: string, branchId: string, forkedBy: string, forkReason?: string): Promise<BranchFork> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const forkData = {
        blueprintId,
        branchId,
        forkedBy,
        forkReason
      } as any as BranchForkInsert;

      const fork = await firstValueFrom(this.branchForkRepository.create(forkData));

      // 更新本地状态
      this.forksState.update(forks => [...forks, fork]);
      return fork;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建 Fork 记录失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 加载分支的 Fork 记录
   */
  async loadForksByBranchId(branchId: string): Promise<BranchFork[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const forks = await firstValueFrom(this.branchForkRepository.findByBranchId(branchId));
      this.forksState.set(forks);
      return forks;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载 Fork 记录失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 同步主分支数据到分支（更新 last_sync_at）
   *
   * @param branchId 分支 ID
   */
  async syncFromMainBranch(branchId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await this.updateBranch(branchId, {
        lastSyncAt: new Date().toISOString()
      } as any);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '同步主分支数据失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 关闭分支
   */
  async closeBranch(branchId: string): Promise<BlueprintBranch> {
    return await this.updateBranch(branchId, {
      status: BranchStatus.CLOSED
    } as any);
  }

  /**
   * 标记分支为已合并
   */
  async markBranchAsMerged(branchId: string): Promise<BlueprintBranch> {
    return await this.updateBranch(branchId, {
      status: BranchStatus.MERGED
    } as any);
  }

  /**
   * 重置状态
   */
  reset(): void {
    this.branchesState.set([]);
    this.selectedBranchState.set(null);
    this.forksState.set([]);
    this.errorState.set(null);
  }
}
