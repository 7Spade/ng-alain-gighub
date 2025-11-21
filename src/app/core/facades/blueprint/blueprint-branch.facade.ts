import { inject, Injectable, signal } from '@angular/core';
import { BlueprintBranchRepository, BranchForkRepository, type Blueprint, type BlueprintBranch, type BlueprintBranchUpdate } from '@core';
import { BlueprintActivityService, BranchService } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Blueprint Branch Facade
 *
 * 负责蓝图分支管理功能（Git-like 分支模型）
 * 包括分支创建、Fork、更新、删除、同步等操作
 *
 * @module core/facades/blueprint
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintBranchFacade {
  private readonly branchService = inject(BranchService);
  private readonly activityService = inject(BlueprintActivityService);
  private readonly blueprintBranchRepository = inject(BlueprintBranchRepository);
  private readonly branchForkRepository = inject(BranchForkRepository);

  // Signal state
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);
  private readonly selectedBranchIdState = signal<string | null>(null);

  // Expose service signals
  readonly branches = this.branchService.branches;
  readonly selectedBranch = this.branchService.selectedBranch;
  readonly activeBranches = this.branchService.activeBranches;
  readonly mergedBranches = this.branchService.mergedBranches;
  readonly loading = this.branchService.loading;
  readonly error = this.branchService.error;

  // Facade-specific signals
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();
  readonly selectedBranchId = this.selectedBranchIdState.asReadonly();

  /**
   * Create new branch for organization collaboration
   *
   * @param blueprintId Blueprint ID (main branch)
   * @param data Branch creation data
   * @returns Promise<BlueprintBranch>
   */
  async createBranch(blueprintId: string, data: { org_id: string; branch_name: string; notes?: string }): Promise<BlueprintBranch> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_branch');

    try {
      const branch = await firstValueFrom(
        this.blueprintBranchRepository.create({
          blueprint_id: blueprintId,
          organization_id: data.org_id,
          branch_name: data.branch_name,
          notes: data.notes,
          status: 'active'
        })
      );

      // Log activity
      try {
        await this.activityService.logActivity(
          blueprintId,
          'branch',
          branch.id,
          'created',
          [{ field: 'branch_name', oldValue: null, newValue: data.branch_name }],
          {
            branchName: data.branch_name,
            orgId: data.org_id
          }
        );
      } catch (error) {
        console.error('[BlueprintBranchFacade] Failed to log branch creation:', error);
      }

      this.selectedBranchIdState.set(branch.id);
      return branch;
    } catch (error) {
      console.error('[BlueprintBranchFacade] Failed to create branch:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Fork blueprint to create new independent blueprint
   *
   * **⚠️ ARCHITECTURAL LIMITATION**: Due to the current database schema design, the `branch_forks`
   * table tracks branch-level forks (blueprint_id + branch_id) rather than blueprint-to-blueprint
   * relationships. This implementation creates a new blueprint and records the source branch in
   * the fork table, but does NOT establish a direct source/target blueprint relationship.
   *
   * @param sourceBlueprintId Source blueprint ID
   * @param sourceBranchId Source branch ID (required for fork tracking)
   * @param data Fork data (name, project_code, owner_id)
   * @param forkedBy User ID who performs the fork
   * @param crudFacade BlueprintCrudFacade instance (for creating new blueprint)
   * @returns Promise containing the new blueprint and fork record
   */
  async forkBlueprint(
    sourceBlueprintId: string,
    sourceBranchId: string,
    data: { name: string; project_code: string; owner_id: string },
    forkedBy: string,
    crudFacade: { createBlueprint: (data: any) => Promise<Blueprint> }
  ): Promise<{ newBlueprint: Blueprint; fork: unknown }> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('fork_blueprint');

    try {
      // 1. Create new blueprint
      const newBlueprint = await crudFacade.createBlueprint({
        name: data.name,
        project_code: data.project_code,
        owner_id: data.owner_id,
        status: 'planning'
      });

      // 2. Create fork record
      const fork = await firstValueFrom(
        this.branchForkRepository.create({
          blueprint_id: sourceBlueprintId,
          branch_id: sourceBranchId,
          forked_by: forkedBy,
          fork_reason: `Forked to create new blueprint: ${data.name}`
        })
      );

      // 3. Log activity in source blueprint
      try {
        await this.activityService.logActivity(sourceBlueprintId, 'blueprint', sourceBlueprintId, 'forked', [], {
          newBlueprintId: newBlueprint.id,
          newBlueprintName: data.name,
          forkId: fork.id
        });
      } catch (error) {
        console.error('[BlueprintBranchFacade] Failed to log fork activity:', error);
      }

      return { newBlueprint, fork };
    } catch (error) {
      console.error('[BlueprintBranchFacade] Failed to fork blueprint:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load branches for a blueprint
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<BlueprintBranch[]>
   */
  async loadBranches(blueprintId: string): Promise<BlueprintBranch[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_branches');

    try {
      return await this.branchService.loadBranchesByBlueprintId(blueprintId);
    } catch (error) {
      console.error('[BlueprintBranchFacade] Failed to load branches:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load branch by ID
   *
   * @param branchId Branch ID
   * @returns Promise<BlueprintBranch | null>
   */
  async loadBranchById(branchId: string): Promise<BlueprintBranch | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_branch_by_id');
    this.selectedBranchIdState.set(branchId);

    try {
      return await this.branchService.loadBranchById(branchId);
    } catch (error) {
      console.error('[BlueprintBranchFacade] Failed to load branch:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update branch
   *
   * @param branchId Branch ID
   * @param data Branch update data
   * @returns Promise<BlueprintBranch>
   */
  async updateBranch(branchId: string, data: BlueprintBranchUpdate): Promise<BlueprintBranch> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_branch');

    try {
      const branch = await this.branchService.updateBranch(branchId, data);

      // Log activity
      try {
        await this.activityService.logActivity(branch.blueprint_id, 'branch', branchId, 'updated', [], {
          branchName: branch.branch_name
        });
      } catch (error) {
        console.error('[BlueprintBranchFacade] Failed to log branch update:', error);
      }

      return branch;
    } catch (error) {
      console.error('[BlueprintBranchFacade] Failed to update branch:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Delete branch
   *
   * @param branchId Branch ID
   * @returns Promise<void>
   */
  async deleteBranch(branchId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('delete_branch');

    const branch = this.branches().find(b => b.id === branchId);

    try {
      await this.branchService.deleteBranch(branchId);

      // Log activity
      if (branch) {
        try {
          await this.activityService.logActivity(branch.blueprint_id, 'branch', branchId, 'deleted', [], {
            branchName: branch.branch_name
          });
        } catch (error) {
          console.error('[BlueprintBranchFacade] Failed to log branch deletion:', error);
        }
      }

      // Clear selected branch if it was deleted
      if (this.selectedBranchId() === branchId) {
        this.selectedBranchIdState.set(null);
      }
    } catch (error) {
      console.error('[BlueprintBranchFacade] Failed to delete branch:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Sync branch from main branch
   *
   * @param branchId Branch ID
   * @returns Promise<void>
   */
  async syncBranchFromMain(branchId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('sync_branch_from_main');

    try {
      await this.branchService.syncFromMainBranch(branchId);

      // Log activity
      const branch = this.branches().find(b => b.id === branchId);
      if (branch) {
        try {
          await this.activityService.logActivity(branch.blueprint_id, 'branch', branchId, 'synced', [], {
            branchName: branch.branch_name
          });
        } catch (error) {
          console.error('[BlueprintBranchFacade] Failed to log branch sync:', error);
        }
      }
    } catch (error) {
      console.error('[BlueprintBranchFacade] Failed to sync branch:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Close branch
   *
   * @param branchId Branch ID
   * @returns Promise<BlueprintBranch>
   */
  async closeBranch(branchId: string): Promise<BlueprintBranch> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('close_branch');

    try {
      const branch = await this.branchService.closeBranch(branchId);

      // Log activity
      try {
        await this.activityService.logActivity(branch.blueprint_id, 'branch', branchId, 'closed', [], {
          branchName: branch.branch_name
        });
      } catch (error) {
        console.error('[BlueprintBranchFacade] Failed to log branch close:', error);
      }

      return branch;
    } catch (error) {
      console.error('[BlueprintBranchFacade] Failed to close branch:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Mark branch as merged
   *
   * @param branchId Branch ID
   * @returns Promise<BlueprintBranch>
   */
  async markBranchAsMerged(branchId: string): Promise<BlueprintBranch> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('mark_branch_as_merged');

    try {
      const branch = await this.branchService.markBranchAsMerged(branchId);

      // Log activity
      try {
        await this.activityService.logActivity(branch.blueprint_id, 'branch', branchId, 'merged', [], {
          branchName: branch.branch_name
        });
      } catch (error) {
        console.error('[BlueprintBranchFacade] Failed to log branch merge:', error);
      }

      return branch;
    } catch (error) {
      console.error('[BlueprintBranchFacade] Failed to mark branch as merged:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Set selected branch
   *
   * @param branchId Branch ID or null to clear
   */
  setSelectedBranch(branchId: string | null): void {
    this.selectedBranchIdState.set(branchId);
    if (branchId) {
      this.branchService.loadBranchById(branchId).catch(error => {
        console.error('[BlueprintBranchFacade] Failed to load branch:', error);
      });
    }
  }
}
