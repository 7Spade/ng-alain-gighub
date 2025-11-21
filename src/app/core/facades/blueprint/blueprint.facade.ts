import { computed, effect, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { type Blueprint, type BlueprintInsert, type BlueprintUpdate } from '@core';
import { BlueprintAggregationRefreshService } from '@shared';

import { BlueprintActivityFacade } from './blueprint-activity.facade';
import { BlueprintBranchFacade } from './blueprint-branch.facade';
import { BlueprintConfigFacade } from './blueprint-config.facade';
import { BlueprintCrudFacade } from './blueprint-crud.facade';
import { BlueprintPrFacade } from './blueprint-pr.facade';

/**
 * Blueprint Facade (Main Coordinator)
 *
 * Enterprise-grade facade for Blueprint/Project management following the Git-like branching model.
 * Orchestrates multiple sub-facades to provide a unified interface for all blueprint operations.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Facade pattern: Component → Facade → Service → Repository → Supabase
 * - Non-invasive error handling
 * - Automatic audit logging via ActivityService
 * - Aggregation Refresh Pattern support
 *
 * Architecture:
 * - BlueprintCrudFacade: Blueprint CRUD operations
 * - BlueprintBranchFacade: Branch management (Git-like branching model)
 * - BlueprintPrFacade: Pull Request workflow
 * - BlueprintConfigFacade: Configuration management
 * - BlueprintActivityFacade: Activity logging and audit trail
 *
 * Key Features:
 * - Unified API for all blueprint operations
 * - Cross-facade coordination
 * - Context management (currentBlueprintId, selectedBranchId)
 * - Aggregation refresh listener
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
 * await facade.branch.createBranch(blueprintId, {
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
  // Inject sub-facades
  readonly crud = inject(BlueprintCrudFacade);
  readonly branch = inject(BlueprintBranchFacade);
  readonly pr = inject(BlueprintPrFacade);
  readonly config = inject(BlueprintConfigFacade);
  readonly activity = inject(BlueprintActivityFacade);

  private readonly aggregationRefreshService = inject(BlueprintAggregationRefreshService);

  // Signal state - Facade-specific state (context management)
  private readonly currentBlueprintIdState = signal<string | null>(null);
  private readonly selectedBranchIdState = signal<string | null>(null);

  // Readonly signals exposed to components
  readonly currentBlueprintId = this.currentBlueprintIdState.asReadonly();
  readonly selectedBranchId = this.selectedBranchIdState.asReadonly();

  // Expose sub-facade signals through main facade
  // Blueprint CRUD signals
  readonly blueprints = this.crud.blueprints;
  readonly selectedBlueprint = this.crud.selectedBlueprint;
  readonly loading = this.crud.loading;
  readonly error = this.crud.error;
  readonly activeBlueprints = this.crud.activeBlueprints;
  readonly planningBlueprints = this.crud.planningBlueprints;
  readonly completedBlueprints = this.crud.completedBlueprints;

  // Branch signals
  readonly branches = this.branch.branches;
  readonly selectedBranch = this.branch.selectedBranch;
  readonly activeBranches = this.branch.activeBranches;
  readonly mergedBranches = this.branch.mergedBranches;

  // Pull Request signals
  readonly pullRequests = this.pr.pullRequests;
  readonly selectedPullRequest = this.pr.selectedPullRequest;
  readonly openPullRequests = this.pr.openPullRequests;
  readonly reviewingPullRequests = this.pr.reviewingPullRequests;
  readonly approvedPullRequests = this.pr.approvedPullRequests;
  readonly mergedPullRequests = this.pr.mergedPullRequests;

  // Activity signals
  readonly activityLogs = this.activity.activityLogs;
  readonly recentActivityLogs = this.activity.recentActivityLogs;
  readonly activityStats = this.activity.activityStats;

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
  // Blueprint CRUD Operations (Delegate to BlueprintCrudFacade)
  // ============================================================================

  /**
   * Load all blueprints accessible to current user
   *
   * @returns Promise<void>
   */
  async loadBlueprints(): Promise<void> {
    return this.crud.loadBlueprints();
  }

  /**
   * Load blueprints owned by specific user/organization
   *
   * @param ownerId Owner ID (user or organization)
   * @returns Promise<Blueprint[]>
   */
  async loadBlueprintsByOwnerId(ownerId: string): Promise<Blueprint[]> {
    return this.crud.loadBlueprintsByOwnerId(ownerId);
  }

  /**
   * Load blueprints by status
   *
   * @param status Blueprint status
   * @returns Promise<Blueprint[]>
   */
  async loadBlueprintsByStatus(status: any): Promise<Blueprint[]> {
    return this.crud.loadBlueprintsByStatus(status);
  }

  /**
   * Load single blueprint by ID
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<Blueprint | null>
   */
  async loadBlueprintById(blueprintId: string): Promise<Blueprint | null> {
    this.currentBlueprintIdState.set(blueprintId);
    return this.crud.loadBlueprintById(blueprintId);
  }

  /**
   * Load blueprint by project code
   *
   * @param projectCode Project code
   * @returns Promise<Blueprint | null>
   */
  async loadBlueprintByProjectCode(projectCode: string): Promise<Blueprint | null> {
    return this.crud.loadBlueprintByProjectCode(projectCode);
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
    return this.crud.searchBlueprints(query, options);
  }

  /**
   * Create new blueprint with automatic activity logging
   *
   * @param data Blueprint insert data
   * @returns Promise<Blueprint>
   */
  async createBlueprint(data: BlueprintInsert): Promise<Blueprint> {
    const blueprint = await this.crud.createBlueprint(data);
    this.currentBlueprintIdState.set(blueprint.id);
    return blueprint;
  }

  /**
   * Update blueprint with automatic activity logging
   *
   * @param blueprintId Blueprint ID
   * @param data Blueprint update data
   * @returns Promise<Blueprint>
   */
  async updateBlueprint(blueprintId: string, data: BlueprintUpdate): Promise<Blueprint> {
    return this.crud.updateBlueprint(blueprintId, data);
  }

  /**
   * Delete blueprint with automatic activity logging
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<void>
   */
  async deleteBlueprint(blueprintId: string): Promise<void> {
    await this.crud.deleteBlueprint(blueprintId);

    // Clear current blueprint if it was deleted
    if (this.currentBlueprintId() === blueprintId) {
      this.currentBlueprintIdState.set(null);
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
    this.crud.selectBlueprint(blueprint);
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
    this.branch.setSelectedBranch(branchId);
  }

  // ============================================================================
  // Fork Blueprint (Cross-facade operation)
  // ============================================================================

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
   * @returns Promise containing the new blueprint and fork record
   */
  async forkBlueprint(
    sourceBlueprintId: string,
    sourceBranchId: string,
    data: { name: string; project_code: string; owner_id: string },
    forkedBy: string
  ): Promise<{ newBlueprint: Blueprint; fork: unknown }> {
    return this.branch.forkBlueprint(sourceBlueprintId, sourceBranchId, data, forkedBy, this.crud);
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

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
