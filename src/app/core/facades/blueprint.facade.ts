import { computed, effect, inject, Injectable, OnDestroy, signal } from '@angular/core';
import {
  BlueprintBranchRepository,
  BlueprintRepository,
  BranchForkRepository,
  type ActivityLog,
  type Blueprint,
  type BlueprintBranch,
  type BlueprintBranchUpdate,
  type BlueprintInsert,
  type BlueprintUpdate,
  type PullRequest,
  type PullRequestInsert,
  type PullRequestUpdate,
  type QueryOptions
} from '@core';
import {
  BlueprintActivityService,
  BlueprintAggregationRefreshService,
  BlueprintService,
  BranchService,
  PullRequestService,
  type ActivityLogFilters,
  type BlueprintConfig,
  type BlueprintStatus
} from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Blueprint Facade
 *
 * Enterprise-grade facade for Blueprint/Project management following the Git-like branching model.
 * Orchestrates BlueprintService, BranchService, and BlueprintActivityService to provide a unified
 * interface for all blueprint operations.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Facade pattern: Component → Facade → Service → Repository → Supabase
 * - Non-invasive error handling
 * - Automatic audit logging via ActivityService
 * - Aggregation Refresh Pattern support
 *
 * Key Features:
 * - Blueprint CRUD operations (Create, Read, Update, Delete)
 * - Branch management (Create, Fork, Merge)
 * - Pull Request workflow
 * - Activity logging and audit trail
 * - Optimistic updates with rollback
 * - Computed state for dashboard/analytics
 *
 * @example
 * ```typescript
 * const facade = inject(BlueprintFacade);
 *
 * // Load blueprints
 * await facade.loadBlueprints();
 *
 * // Access reactive state
 * effect(() => {
 *   console.log('Active blueprints:', facade.activeBlueprints());
 *   console.log('Loading:', facade.loading());
 * });
 *
 * // Create new blueprint
 * const newBlueprint = await facade.createBlueprint({
 *   name: 'New Project',
 *   project_code: 'PRJ-001',
 *   owner_id: userId
 * });
 *
 * // Create branch for organization
 * await facade.createBranch(blueprintId, {
 *   org_id: orgId,
 *   branch_name: 'org-branch-1'
 * });
 * ```
 *
 * @see docs/11-元件模組視圖.mermaid.md
 * @see docs/12-元件模組視圖-補充.md
 * @see docs/27-完整架構流程圖.mermaid.md
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintFacade implements OnDestroy {
  // Inject dependencies
  private readonly blueprintService = inject(BlueprintService);
  private readonly branchService = inject(BranchService);
  private readonly pullRequestService = inject(PullRequestService);
  private readonly activityService = inject(BlueprintActivityService);
  private readonly blueprintRepository = inject(BlueprintRepository);
  private readonly blueprintBranchRepository = inject(BlueprintBranchRepository);
  private readonly branchForkRepository = inject(BranchForkRepository);
  private readonly aggregationRefreshService = inject(BlueprintAggregationRefreshService);

  // Signal state - Facade-specific state
  private readonly currentBlueprintIdState = signal<string | null>(null);
  private readonly selectedBranchIdState = signal<string | null>(null);
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Readonly signals exposed to components
  readonly currentBlueprintId = this.currentBlueprintIdState.asReadonly();
  readonly selectedBranchId = this.selectedBranchIdState.asReadonly();
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();

  // Expose service signals through facade
  readonly blueprints = this.blueprintService.blueprints;
  readonly selectedBlueprint = this.blueprintService.selectedBlueprint;
  readonly configs = this.blueprintService.configs;
  readonly loading = this.blueprintService.loading;
  readonly error = this.blueprintService.error;

  // Branch signals
  readonly branches = this.branchService.branches;
  readonly selectedBranch = this.branchService.selectedBranch;
  readonly activeBranches = this.branchService.activeBranches;
  readonly mergedBranches = this.branchService.mergedBranches;

  // Pull Request signals
  readonly pullRequests = this.pullRequestService.pullRequests;
  readonly selectedPullRequest = this.pullRequestService.selectedPullRequest;
  readonly openPullRequests = this.pullRequestService.openPullRequests;
  readonly reviewingPullRequests = this.pullRequestService.reviewingPullRequests;
  readonly approvedPullRequests = this.pullRequestService.approvedPullRequests;
  readonly mergedPullRequests = this.pullRequestService.mergedPullRequests;

  // Activity signals
  readonly activityLogs = this.activityService.logs;
  readonly recentActivityLogs = this.activityService.recentLogs;
  readonly activityStats = this.activityService.activityStats;

  // Computed: Active blueprints
  readonly activeBlueprints = this.blueprintService.activeBlueprints;

  // Computed: Planning blueprints
  readonly planningBlueprints = this.blueprintService.planningBlueprints;

  // Computed: Completed blueprints
  readonly completedBlueprints = this.blueprintService.completedBlueprints;

  // Computed: Current blueprint (based on currentBlueprintId)
  readonly currentBlueprint = computed(() => {
    const blueprintId = this.currentBlueprintId();
    if (!blueprintId) return null;
    return this.blueprints().find(b => b.id === blueprintId) || null;
  });

  // Computed: Blueprint statistics
  readonly blueprintStats = computed(() => {
    const allBlueprints = this.blueprints();
    return {
      total: allBlueprints.length,
      active: this.activeBlueprints().length,
      planning: this.planningBlueprints().length,
      completed: this.completedBlueprints().length,
      archived: allBlueprints.filter(b => b.status === 'archived').length
    };
  });

  /**
   * Initialize facade and set up aggregation refresh listener
   */
  constructor() {
    // Setup aggregation refresh listener
    this.setupAggregationRefreshListener();
  }

  /**
   * Cleanup on destroy
   */
  ngOnDestroy(): void {
    const blueprintId = this.currentBlueprintId();
    if (blueprintId) {
      this.aggregationRefreshService.cleanup(blueprintId);
    }
  }

  // ============================================================================
  // CRUD Operations
  // ============================================================================

  /**
   * Load all blueprints accessible to current user
   *
   * @returns Promise<void>
   */
  async loadBlueprints(): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_blueprints');

    try {
      await this.blueprintService.loadBlueprints();
    } catch (error) {
      console.error('[BlueprintFacade] Failed to load blueprints:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load blueprints owned by specific user/organization
   *
   * @param ownerId Owner ID (user or organization)
   * @returns Promise<Blueprint[]>
   */
  async loadBlueprintsByOwnerId(ownerId: string): Promise<Blueprint[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_blueprints_by_owner');

    try {
      return await this.blueprintService.loadBlueprintsByOwnerId(ownerId);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to load blueprints by owner:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load blueprints by status
   *
   * @param status Blueprint status
   * @returns Promise<Blueprint[]>
   */
  async loadBlueprintsByStatus(status: BlueprintStatus): Promise<Blueprint[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_blueprints_by_status');

    try {
      return await this.blueprintService.loadBlueprintsByStatus(status);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to load blueprints by status:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load single blueprint by ID
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<Blueprint | null>
   */
  async loadBlueprintById(blueprintId: string): Promise<Blueprint | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_blueprint_by_id');
    this.currentBlueprintIdState.set(blueprintId);

    try {
      return await this.blueprintService.loadBlueprintById(blueprintId);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to load blueprint:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load blueprint by project code
   *
   * @param projectCode Project code
   * @returns Promise<Blueprint | null>
   */
  async loadBlueprintByProjectCode(projectCode: string): Promise<Blueprint | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_blueprint_by_project_code');

    try {
      return await this.blueprintService.loadBlueprintByProjectCode(projectCode);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to load blueprint by project code:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Search blueprints (supports fuzzy search)
   *
   * @param query Search query
   * @param options Search options (pagination, sorting)
   * @returns Promise<Blueprint[]>
   */
  async searchBlueprints(
    query: string,
    options?: { page?: number; pageSize?: number; orderBy?: string; orderDirection?: 'asc' | 'desc' }
  ): Promise<Blueprint[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('search_blueprints');

    try {
      return await this.blueprintService.searchBlueprints(query, options);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to search blueprints:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Create new blueprint with automatic activity logging
   *
   * @param data Blueprint insert data
   * @returns Promise<Blueprint>
   */
  async createBlueprint(data: BlueprintInsert): Promise<Blueprint> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_blueprint');

    try {
      const blueprint = await this.blueprintService.createBlueprint(data);

      // Log activity
      try {
        await this.activityService.logActivity(
          blueprint.id,
          'blueprint',
          blueprint.id,
          'created',
          [{ field: 'status', oldValue: null, newValue: blueprint.status }],
          {
            blueprintName: blueprint.name,
            projectCode: blueprint.project_code,
            ownerId: blueprint.owner_id
          }
        );
      } catch (error) {
        console.error('[BlueprintFacade] Failed to log blueprint creation:', error);
      }

      this.currentBlueprintIdState.set(blueprint.id);
      return blueprint;
    } catch (error) {
      console.error('[BlueprintFacade] Failed to create blueprint:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update blueprint with automatic activity logging
   *
   * @param blueprintId Blueprint ID
   * @param data Blueprint update data
   * @returns Promise<Blueprint>
   */
  async updateBlueprint(blueprintId: string, data: BlueprintUpdate): Promise<Blueprint> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_blueprint');

    // Get old blueprint for change tracking
    const oldBlueprint = this.blueprints().find(b => b.id === blueprintId);

    try {
      const updatedBlueprint = await this.blueprintService.updateBlueprint(blueprintId, data);

      // Calculate changes and log activity
      if (oldBlueprint) {
        const changes = this.calculateChanges(oldBlueprint, data);
        if (changes.length > 0) {
          try {
            await this.activityService.logActivity(blueprintId, 'blueprint', blueprintId, 'updated', changes, {
              blueprintName: updatedBlueprint.name
            });
          } catch (error) {
            console.error('[BlueprintFacade] Failed to log blueprint update:', error);
          }
        }
      }

      return updatedBlueprint;
    } catch (error) {
      console.error('[BlueprintFacade] Failed to update blueprint:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Delete blueprint with automatic activity logging
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<void>
   */
  async deleteBlueprint(blueprintId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('delete_blueprint');

    const blueprint = this.blueprints().find(b => b.id === blueprintId);

    try {
      await this.blueprintService.deleteBlueprint(blueprintId);

      // Log activity
      if (blueprint) {
        try {
          await this.activityService.logActivity(blueprintId, 'blueprint', blueprintId, 'deleted', [], {
            blueprintName: blueprint.name
          });
        } catch (error) {
          console.error('[BlueprintFacade] Failed to log blueprint deletion:', error);
        }
      }

      // Clear current blueprint if it was deleted
      if (this.currentBlueprintId() === blueprintId) {
        this.currentBlueprintIdState.set(null);
      }
    } catch (error) {
      console.error('[BlueprintFacade] Failed to delete blueprint:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Branch Operations (Git-like Branching Model)
  // ============================================================================

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
        console.error('[BlueprintFacade] Failed to log branch creation:', error);
      }

      this.selectedBranchIdState.set(branch.id);
      return branch;
    } catch (error) {
      console.error('[BlueprintFacade] Failed to create branch:', error);
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
   * **Implications**:
   * - The new blueprint is independent and has no direct link to the source blueprint
   * - Fork tracking is at the branch level, not blueprint level
   * - To query "all blueprints forked from X", you would need to join through branch_forks
   * - Consider schema evolution if cross-blueprint fork tracking is needed
   *
   * @param sourceBlueprintId Source blueprint ID
   * @param sourceBranchId Source branch ID (required for fork tracking)
   * @param data Fork data (name, project_code, owner_id)
   * @param forkedBy User ID who performs the fork
   * @returns Promise containing the new blueprint and fork record
   *
   * @example
   * ```typescript
   * const result = await facade.forkBlueprint(
   *   'blueprint-123',
   *   'branch-456',
   *   { name: 'Forked Project', project_code: 'FORK-001', owner_id: 'user-789' },
   *   'user-789'
   * );
   * // result.newBlueprint is independent, result.fork tracks branch-level fork
   * ```
   */
  async forkBlueprint(
    sourceBlueprintId: string,
    sourceBranchId: string,
    data: { name: string; project_code: string; owner_id: string },
    forkedBy: string
  ): Promise<{ newBlueprint: Blueprint; fork: unknown }> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('fork_blueprint');

    try {
      // 1. Create new blueprint
      const newBlueprint = await this.createBlueprint({
        name: data.name,
        project_code: data.project_code,
        owner_id: data.owner_id,
        status: 'planning'
      });

      // 2. Create fork record
      // NOTE: This tracks the source branch, not a blueprint-to-blueprint relationship
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
        console.error('[BlueprintFacade] Failed to log fork activity:', error);
      }

      return { newBlueprint, fork };
    } catch (error) {
      console.error('[BlueprintFacade] Failed to fork blueprint:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Selection & Navigation
  // ============================================================================

  /**
   * Set current blueprint context
   *
   * @param blueprintId Blueprint ID or null to clear
   */
  setCurrentBlueprint(blueprintId: string | null): void {
    this.currentBlueprintIdState.set(blueprintId);
  }

  /**
   * Select blueprint for detail view
   *
   * @param blueprint Blueprint or null to deselect
   */
  selectBlueprint(blueprint: Blueprint | null): void {
    this.blueprintService.selectBlueprint(blueprint);
    if (blueprint) {
      this.currentBlueprintIdState.set(blueprint.id);
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
        console.error('[BlueprintFacade] Failed to load branch:', error);
      });
    }
  }

  // ============================================================================
  // Branch Management Operations
  // ============================================================================

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
      console.error('[BlueprintFacade] Failed to load branches:', error);
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
      console.error('[BlueprintFacade] Failed to load branch:', error);
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
        console.error('[BlueprintFacade] Failed to log branch update:', error);
      }

      return branch;
    } catch (error) {
      console.error('[BlueprintFacade] Failed to update branch:', error);
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
          console.error('[BlueprintFacade] Failed to log branch deletion:', error);
        }
      }

      // Clear selected branch if it was deleted
      if (this.selectedBranchId() === branchId) {
        this.selectedBranchIdState.set(null);
      }
    } catch (error) {
      console.error('[BlueprintFacade] Failed to delete branch:', error);
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
          console.error('[BlueprintFacade] Failed to log branch sync:', error);
        }
      }
    } catch (error) {
      console.error('[BlueprintFacade] Failed to sync branch:', error);
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
        console.error('[BlueprintFacade] Failed to log branch close:', error);
      }

      return branch;
    } catch (error) {
      console.error('[BlueprintFacade] Failed to close branch:', error);
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
        console.error('[BlueprintFacade] Failed to log branch merge:', error);
      }

      return branch;
    } catch (error) {
      console.error('[BlueprintFacade] Failed to mark branch as merged:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Pull Request Operations
  // ============================================================================

  /**
   * Create Pull Request
   *
   * @param data Pull Request insert data
   * @returns Promise<PullRequest>
   */
  async createPullRequest(data: PullRequestInsert): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_pull_request');

    try {
      const pr = await this.pullRequestService.createPullRequest(data);

      // Log activity
      try {
        await this.activityService.logActivity(pr.blueprint_id, 'pull_request', pr.id, 'created', [], {
          prTitle: pr.title,
          branchId: pr.branch_id
        });
      } catch (error) {
        console.error('[BlueprintFacade] Failed to log PR creation:', error);
      }

      return pr;
    } catch (error) {
      console.error('[BlueprintFacade] Failed to create pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load Pull Requests for a blueprint
   *
   * @param blueprintId Blueprint ID
   * @param options Query options
   * @returns Promise<PullRequest[]>
   */
  async loadPullRequests(blueprintId: string, options?: QueryOptions): Promise<PullRequest[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_pull_requests');

    try {
      return await this.pullRequestService.loadPullRequestsByBlueprintId(blueprintId);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to load pull requests:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load Pull Request by ID
   *
   * @param prId Pull Request ID
   * @returns Promise<PullRequest | null>
   */
  async loadPullRequestById(prId: string): Promise<PullRequest | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_pull_request_by_id');

    try {
      return await this.pullRequestService.loadPullRequestById(prId);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to load pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load Pull Requests by branch ID
   *
   * @param branchId Branch ID
   * @returns Promise<PullRequest[]>
   */
  async loadPullRequestsByBranchId(branchId: string): Promise<PullRequest[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_pull_requests_by_branch');

    try {
      return await this.pullRequestService.loadPullRequestsByBranchId(branchId);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to load pull requests by branch:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update Pull Request
   *
   * @param prId Pull Request ID
   * @param data Pull Request update data
   * @returns Promise<PullRequest>
   */
  async updatePullRequest(prId: string, data: PullRequestUpdate): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_pull_request');

    try {
      return await this.pullRequestService.updatePullRequest(prId, data);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to update pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Start review of Pull Request
   *
   * @param prId Pull Request ID
   * @param reviewedBy Reviewer ID
   * @returns Promise<PullRequest>
   */
  async startReview(prId: string, reviewedBy: string): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('start_review');

    try {
      return await this.pullRequestService.startReview(prId, reviewedBy);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to start review:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Approve Pull Request
   *
   * @param prId Pull Request ID
   * @param reviewedBy Reviewer ID
   * @returns Promise<PullRequest>
   */
  async approvePullRequest(prId: string, reviewedBy: string): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('approve_pull_request');

    try {
      return await this.pullRequestService.approvePullRequest(prId, reviewedBy);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to approve pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Reject Pull Request
   *
   * @param prId Pull Request ID
   * @param reviewedBy Reviewer ID
   * @param reason Rejection reason (optional)
   * @returns Promise<PullRequest>
   */
  async rejectPullRequest(prId: string, reviewedBy: string, reason?: string): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('reject_pull_request');

    try {
      const pr = await this.pullRequestService.rejectPullRequest(prId, reviewedBy);
      // Note: reason can be added to PR description or comments if needed
      return pr;
    } catch (error) {
      console.error('[BlueprintFacade] Failed to reject pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Merge Pull Request
   *
   * @param prId Pull Request ID
   * @param mergedBy User ID who performs the merge
   * @param changesSummary Changes summary (optional)
   * @returns Promise<PullRequest>
   */
  async mergePullRequest(prId: string, mergedBy: string, changesSummary?: any): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('merge_pull_request');

    try {
      return await this.pullRequestService.mergePullRequest(prId, mergedBy, changesSummary);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to merge pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Close Pull Request
   *
   * @param prId Pull Request ID
   * @returns Promise<PullRequest>
   */
  async closePullRequest(prId: string): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('close_pull_request');

    try {
      return await this.pullRequestService.closePullRequest(prId);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to close pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Delete Pull Request
   *
   * @param prId Pull Request ID
   * @returns Promise<void>
   */
  async deletePullRequest(prId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('delete_pull_request');

    try {
      await this.pullRequestService.deletePullRequest(prId);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to delete pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Configuration Management
  // ============================================================================

  /**
   * Load configurations for a blueprint
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<BlueprintConfig[]>
   */
  async loadConfigs(blueprintId: string): Promise<BlueprintConfig[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_configs');

    try {
      return await this.blueprintService.loadConfigs(blueprintId);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to load configs:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Get configuration value
   *
   * @param blueprintId Blueprint ID
   * @param configKey Configuration key
   * @returns Promise<BlueprintConfig | null>
   */
  async getConfig(blueprintId: string, configKey: string): Promise<BlueprintConfig | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('get_config');

    try {
      return await this.blueprintService.getConfig(blueprintId, configKey);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to get config:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Set configuration value
   *
   * @param blueprintId Blueprint ID
   * @param configKey Configuration key
   * @param configValue Configuration value
   * @param updatedBy User ID who updates the config (optional)
   * @returns Promise<BlueprintConfig>
   */
  async setConfig(blueprintId: string, configKey: string, configValue: any, updatedBy?: string): Promise<BlueprintConfig> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('set_config');

    try {
      return await this.blueprintService.setConfig(blueprintId, configKey, configValue, updatedBy);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to set config:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Activity Log Management
  // ============================================================================

  /**
   * Load activity logs for a blueprint
   *
   * @param blueprintId Blueprint ID
   * @param filters Activity log filters (optional)
   * @returns Promise<ActivityLog[]>
   */
  async loadActivities(blueprintId: string, filters?: ActivityLogFilters): Promise<ActivityLog[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_activities');

    try {
      return await this.activityService.getActivityLogs(blueprintId, filters);
    } catch (error) {
      console.error('[BlueprintFacade] Failed to load activities:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Calculate changes between old blueprint and update data
   *
   * @param oldBlueprint Original blueprint
   * @param updateData Update data
   * @returns Array of changes
   * @private
   */
  private calculateChanges(
    oldBlueprint: Blueprint,
    updateData: BlueprintUpdate
  ): Array<{
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }> {
    const changes: Array<{ field: string; oldValue: unknown; newValue: unknown }> = [];

    // Check each field in updateData
    for (const [key, newValue] of Object.entries(updateData)) {
      const oldValue = oldBlueprint[key as keyof Blueprint];
      if (oldValue !== newValue) {
        changes.push({
          field: key,
          oldValue,
          newValue
        });
      }
    }

    return changes;
  }

  /**
   * Setup aggregation refresh listener
   *
   * Listens for changes in related resources (tasks, documents, quality checks, issues)
   * and automatically refreshes blueprint data to maintain consistency across the application.
   *
   * **Implementation Status**: ✅ Implemented
   * **Integration**: Uses BlueprintAggregationRefreshService
   *
   * The listener:
   * 1. Monitors currentBlueprintId changes via effect
   * 2. Sets up real-time subscriptions when blueprint is loaded
   * 3. Automatically refreshes blueprint data when related resources change
   * 4. Cleans up subscriptions when blueprint changes or component destroys
   *
   * @private
   * @see BlueprintAggregationRefreshService
   */
  private setupAggregationRefreshListener(): void {
    const refreshService = this.aggregationRefreshService;

    // Listen for refresh events
    refreshService.listen().subscribe((event: any) => {
      console.log('[BlueprintFacade] Aggregation refresh triggered:', event);

      // Only refresh if the event is for the current blueprint
      const currentId = this.currentBlueprintId();
      if (currentId && currentId === event.blueprintId) {
        this.loadBlueprintById(event.blueprintId).catch(error => {
          console.error('[BlueprintFacade] Failed to refresh blueprint after aggregation change:', error);
        });
      }
    });

    // Setup subscriptions when currentBlueprintId changes
    effect(() => {
      const blueprintId = this.currentBlueprintId();

      // Cleanup previous subscriptions
      const previousBlueprints: string[] = refreshService.getActiveBlueprints();
      previousBlueprints.forEach((id: string) => {
        if (id !== blueprintId) {
          refreshService.cleanup(id);
        }
      });

      // Setup new subscriptions if blueprint is set
      if (blueprintId) {
        console.log('[BlueprintFacade] Setting up aggregation refresh for blueprint:', blueprintId);
        refreshService.setupRealtimeSubscriptions(blueprintId);
      }
    });
  }
}
