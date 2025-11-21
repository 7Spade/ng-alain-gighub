import { inject, Injectable, signal } from '@angular/core';
import { type Blueprint, type BlueprintInsert, type BlueprintUpdate } from '@core';
import { BlueprintActivityService, BlueprintService, type BlueprintStatus } from '@shared';

/**
 * Blueprint CRUD Facade
 *
 * 负责蓝图的基本 CRUD 操作（Create, Read, Update, Delete）
 * 包括搜索、按条件查询等功能
 *
 * @module core/facades/blueprint
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintCrudFacade {
  private readonly blueprintService = inject(BlueprintService);
  private readonly activityService = inject(BlueprintActivityService);

  // Signal state
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Expose service signals
  readonly blueprints = this.blueprintService.blueprints;
  readonly selectedBlueprint = this.blueprintService.selectedBlueprint;
  readonly loading = this.blueprintService.loading;
  readonly error = this.blueprintService.error;
  readonly activeBlueprints = this.blueprintService.activeBlueprints;
  readonly planningBlueprints = this.blueprintService.planningBlueprints;
  readonly completedBlueprints = this.blueprintService.completedBlueprints;

  // Facade-specific signals
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();

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
      console.error('[BlueprintCrudFacade] Failed to load blueprints:', error);
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
      console.error('[BlueprintCrudFacade] Failed to load blueprints by owner:', error);
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
      console.error('[BlueprintCrudFacade] Failed to load blueprints by status:', error);
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

    try {
      return await this.blueprintService.loadBlueprintById(blueprintId);
    } catch (error) {
      console.error('[BlueprintCrudFacade] Failed to load blueprint:', error);
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
      console.error('[BlueprintCrudFacade] Failed to load blueprint by project code:', error);
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
      console.error('[BlueprintCrudFacade] Failed to search blueprints:', error);
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
        console.error('[BlueprintCrudFacade] Failed to log blueprint creation:', error);
      }

      return blueprint;
    } catch (error) {
      console.error('[BlueprintCrudFacade] Failed to create blueprint:', error);
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
            console.error('[BlueprintCrudFacade] Failed to log blueprint update:', error);
          }
        }
      }

      return updatedBlueprint;
    } catch (error) {
      console.error('[BlueprintCrudFacade] Failed to update blueprint:', error);
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
          console.error('[BlueprintCrudFacade] Failed to log blueprint deletion:', error);
        }
      }
    } catch (error) {
      console.error('[BlueprintCrudFacade] Failed to delete blueprint:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Select blueprint for detail view
   *
   * @param blueprint Blueprint or null to deselect
   */
  selectBlueprint(blueprint: Blueprint | null): void {
    this.blueprintService.selectBlueprint(blueprint);
  }

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
}
