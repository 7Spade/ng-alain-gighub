import { Injectable, inject, signal, computed, effect, OnDestroy } from '@angular/core';
import { type Blueprint, type BlueprintInsert, type BlueprintUpdate, type BlueprintBranch, BranchType } from '@core';
import { BlueprintService, BlueprintActivityService, BranchService, type BlueprintStatus } from '@shared';
import { BlueprintAggregationRefreshService, ErrorStateService } from '@shared';

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
  private readonly activityService = inject(BlueprintActivityService);
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
   * @param data Branch creation data (must include forkedBy)
   * @returns Promise<BlueprintBranch>
   */
  async createBranch(
    blueprintId: string,
    data: { org_id: string; branch_name: string; notes?: string; forkedBy: string }
  ): Promise<BlueprintBranch> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_branch');

    try {
      // Use BranchService to create branch (which handles both branch and fork creation)
      const branch = await this.branchService.forkBranch(
        blueprintId,
        data.org_id,
        data.branch_name,
        BranchType.CONTRACTOR, // Default branch type
        data.forkedBy,
        data.notes
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

      // 2. Create fork record using BranchService
      // NOTE: This tracks the source branch, not a blueprint-to-blueprint relationship
      const fork = await this.branchService.createForkRecord(
        sourceBlueprintId,
        sourceBranchId,
        forkedBy,
        `Forked to create new blueprint: ${data.name}`
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
