/**
 * Task Repository
 *
 * 任務倉庫服務
 * 整合所有維度服務，提供統一的任務接口
 *
 * 職責：
 * - 整合所有維度數據為完整的 Task 對象
 * - 提供統一的任務 CRUD 操作
 * - 任務驗證和完整性檢查
 * - 任務樹構建和關鍵路徑查詢
 * - 批量操作和搜尋功能
 *
 * @see @ETMS_DESIGN_SPEC.md 完整任務系統
 */

import { Injectable, inject, signal } from '@angular/core';
import { UserService } from '@core/account/user/user.service';
import { RelationType, TaskStatus } from '@models';
import type {
  TaskIdentityComplete,
  TaskLocation,
  TaskLocationOverview,
  TaskLocationSummary,
  TaskSpatialRiskSummary,
  TaskProgress,
  TaskDependency,
  TaskDependencyOverview,
  TaskDependencySummary,
  TaskRelationSummary,
  TaskMilestoneLink,
  TaskMilestoneStatus,
  MaterialItem,
  TaskTime,
  TaskScheduleSummary,
  TaskDelayStatus,
  TaskTreeNode,
  Task,
  TaskQuantityPayload
} from '@models';
import { TaskChangeService } from '@tasks/features/task-change/services/domain/task-change.service';
import { TaskCommunicationService } from '@tasks/features/task-communication/services/domain/task-communication.service';
import { TaskCostService } from '@tasks/features/task-cost/services/domain/task-cost.service';
import { TaskDependencyService } from '@tasks/features/task-dependency/services/domain/task-dependency.service';
import { TaskDocumentService } from '@tasks/features/task-document/services/task-document.service';
import { TaskIdentityService } from '@tasks/features/task-identity/services/domain/task-identity.service';
import { TaskLocationService } from '@tasks/features/task-location/services/domain/task-location.service';
import { TaskProgressService } from '@tasks/features/task-progress/services/domain/task-progress.service';
import { TaskQualityService } from '@tasks/features/task-quality/services/domain/task-quality.service';
import { TaskResourceService } from '@tasks/features/task-resource/services/domain/task-resource.service';
import { TaskRiskService } from '@tasks/features/task-risk/services/domain/task-risk.service';
import { TaskSafetyService } from '@tasks/features/task-safety/services/domain/task-safety.service';
import { TaskCriticalPathService } from '@tasks/features/task-time/services/computation/task-critical-path.service';
import type { CriticalPath } from '@tasks/features/task-time/services/computation/task-critical-path.service';
import { TaskTimeCalculatorService } from '@tasks/features/task-time/services/computation/task-time-calculator.service';
import { TaskTimeService } from '@tasks/features/task-time/services/domain/task-time.service';
import { TaskTreeBuilderService } from '@tasks/features/task-tree/services/computation/task-tree-builder.service';
import { TaskIdentityRepository } from '@tasks/shared/repository/task-identity.repository';

const DEFAULT_QUANTITY_NAME = 'Primary Quantity';

/**
 * 任務篩選條件
 */
export interface TaskFilters {
  taskIds?: string[];
  status?: string;
  priority?: string;
  assignedTo?: string;
  isCriticalPath?: boolean;
  tags?: string[];
  searchQuery?: string;
}

/**
 * 任務驗證結果
 */
export interface TaskValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 批量更新結果
 */
export interface BulkUpdateResult {
  success: number;
  failed: number;
  errors: Array<{ taskId: string; error: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class TaskRepository {
  private readonly identityService = inject(TaskIdentityService);
  private readonly identityRepository = inject(TaskIdentityRepository);
  // 全域任務資料變更觸發器：任務建立/更新/刪除後遞增，用於讓 UI 端以 effect 自動刷新
  readonly changed = signal(0);
  private readonly timeService = inject(TaskTimeService);
  private readonly dependencyService = inject(TaskDependencyService);
  private readonly locationService = inject(TaskLocationService);
  private readonly resourceService = inject(TaskResourceService);
  private readonly progressService = inject(TaskProgressService);
  private readonly costService = inject(TaskCostService);
  private readonly qualityService = inject(TaskQualityService);
  private readonly riskService = inject(TaskRiskService);
  private readonly safetyService = inject(TaskSafetyService);
  private readonly documentService = inject(TaskDocumentService);
  private readonly communicationService = inject(TaskCommunicationService);
  private readonly changeService = inject(TaskChangeService);
  private readonly calculator = inject(TaskTimeCalculatorService);
  private readonly criticalPathService = inject(TaskCriticalPathService);
  private readonly treeBuilder = inject(TaskTreeBuilderService);
  private readonly userService = inject(UserService);

  private async resolveCurrentUserId(): Promise<string | null> {
    const { data, error } = await this.userService.getCurrentUser();
    if (data?.id) {
      return data.id;
    }

    if (error) {
      console.warn('Failed to resolve current user from UserService', error);
    }

    return null;
  }

  /**
   * 獲取完整的任務資訊，整合所有維度
   *
   * @param id 任務 ID
   * @returns 完整的任務對象
   */
  async getTask(id: string): Promise<Task | null> {
    // 獲取基本資訊
    const identity = await this.identityService.getTaskById(id);
    if (!identity) {
      return null;
    }

    // 並行獲取所有維度數據
    const [time, dependency, location, resource, progress, cost, quality, risk, safety, document, communication, change] =
      await Promise.all([
        this.timeService.getTaskTime(id),
        this.getTaskDependency(id),
        this.locationService.getTaskLocation(id),
        this.resourceService.getTaskResource(id),
        this.progressService.getTaskProgress(id),
        this.costService.getTaskCost(id),
        this.qualityService.getTaskQuality(id),
        this.riskService.getTaskRisks(id),
        this.safetyService.getTaskSafety(id),
        this.documentService.getTaskDocuments(id),
        this.communicationService.getTaskCommunication(id),
        this.changeService.getTaskChanges(id)
      ]);

    const scheduleSummary = this.buildScheduleSummary(time, progress);
    const dependencyOverview = this.buildDependencyOverview(dependency);
    const locationOverview = this.buildLocationOverview(location);

    // 合併為完整的 Task 對象
    const task: Task = {
      ...identity,
      time: time || undefined,
      scheduleSummary,
      dependency: dependency || undefined,
      dependencyOverview,
      location: location || undefined,
      locationOverview,
      resource: resource || undefined,
      progress: progress || undefined,
      cost: cost || undefined,
      quality: quality || undefined,
      risk: risk || undefined,
      safety: safety || undefined,
      document: document || undefined,
      communication: communication || undefined,
      change: change || undefined
    };

    return task;
  }

  /**
   * 獲取任務的依賴資訊（整合前置、後續、關聯任務）
   */
  private async getTaskDependency(taskId: string): Promise<TaskDependency | null> {
    const [predecessors, successors, relatedTasks] = await Promise.all([
      this.dependencyService.getPredecessors(taskId),
      this.dependencyService.getSuccessors(taskId),
      this.dependencyService.getRelatedTasks(taskId)
    ]);

    if (!predecessors && !successors && !relatedTasks) {
      return null;
    }

    return {
      predecessors: predecessors || undefined,
      successors: successors || undefined,
      relatedTasks: relatedTasks || undefined
    };
  }

  /**
   * 創建新任務，支援部分維度數據
   *
   * @param blueprintId 藍圖 ID
   * @param taskData 任務數據
   * @returns 創建的完整任務對象
   */
  async createTask(
    blueprintId: string,
    taskData: Partial<TaskIdentityComplete & Task> & { quantity?: TaskQuantityPayload }
  ): Promise<Task> {
    // 創建基本任務（注意參數順序：task, blueprintId）
    const identityData: Partial<TaskIdentityComplete> = {
      code: 'code' in taskData ? taskData.code : undefined,
      name: 'name' in taskData ? taskData.name : undefined,
      description: 'description' in taskData ? taskData.description : undefined,
      notes: 'notes' in taskData ? taskData.notes : undefined,
      tags: 'tags' in taskData ? taskData.tags : undefined,
      category: 'category' in taskData ? taskData.category : undefined,
      subcategory: 'subcategory' in taskData ? taskData.subcategory : undefined,
      workType: 'workType' in taskData ? taskData.workType : undefined,
      parentId: 'parentId' in taskData ? taskData.parentId : undefined,
      sortOrder: 'sortOrder' in taskData ? taskData.sortOrder : undefined
    };

    const identity = await this.identityService.createTask(identityData, blueprintId);

    const taskId = identity.id;

    // 如果提供時間數據，更新時間
    if (taskData.time?.planned) {
      await this.timeService.updatePlannedTime(taskId, taskData.time.planned);
    }

    // 如果提供依賴數據，添加依賴關係
    if (taskData.dependency?.predecessors) {
      for (const pred of taskData.dependency.predecessors.predecessors) {
        await this.dependencyService.addPredecessor(taskId, pred.taskId, pred.type, pred.lag, pred.lagUnit, pred.strength);
      }
    }

    if (taskData.dependency?.relatedTasks) {
      for (const related of taskData.dependency.relatedTasks.relatedTasks) {
        await this.dependencyService.addRelatedTask(
          taskId,
          related.taskId,
          related.relationType,
          related.description,
          related.strength,
          related.isSymmetric
        );
      }
    }

    // 如果提供位置數據，更新位置
    if (taskData.location?.physical) {
      await this.locationService.updatePhysicalLocation(taskId, taskData.location.physical);
    }

    // 如果提供資源數據，更新資源
    if (taskData.resource?.manpower) {
      await this.resourceService.updateHumanResources(taskId, taskData.resource.manpower);
    }
    if (taskData.resource?.equipment) {
      await this.resourceService.updateEquipmentResources(taskId, taskData.resource.equipment);
    }

    const quantityPayload = this.normalizeQuantityPayload(taskData.quantity);
    const actorId = await this.resolveCurrentUserId();
    const primaryMaterial = await this.resourceService.setQuantity(taskId, quantityPayload);
    await this.progressService.updateProgress(taskId, {
      quantity: {
        unit: primaryMaterial.unit,
        planned: primaryMaterial.plannedQuantity,
        installed: primaryMaterial.installedQuantity,
        used: primaryMaterial.usedQuantity
      },
      percentage: this.calculateQuantityPercentage(primaryMaterial),
      status: this.resolveProgressStatus(taskData.status, primaryMaterial),
      recordedBy: identity.updatedBy ?? identity.createdBy ?? actorId ?? undefined
    });

    if (taskData.cost?.cost) {
      await this.costService.updateBudget(taskId, taskData.cost.cost);
    }

    const qualityTargets = taskData.quality?.summary?.targets;
    if (qualityTargets && qualityTargets.length > 0) {
      await this.qualityService.updateQualityTargets(taskId, qualityTargets);
    }

    // 寫入完成後，不進行重型讀取以避免非關鍵維度（如文件/變更記錄）缺欄位導致報錯
    // 由 UI 端透過 effect 與 changed() 信號自動刷新
    const task: Task = identity as unknown as Task;
    // 觸發資料變更
    this.changed.update(v => v + 1);
    // TODO(ETMS_SPEC §0.9): 任務建立後需通知 BlueprintRepository 重算藍圖 KPI（進度、未完成任務數、成本偏差等）。
    return task;
  }

  /**
   * 更新任務，支援部分維度更新
   *
   * @param id 任務 ID
   * @param updates 更新數據
   * @returns 更新後的完整任務對象
   */
  async updateTask(id: string, updates: Partial<Task> & { quantity?: TaskQuantityPayload }): Promise<Task> {
    // 檢查任務是否存在
    const existing = await this.identityService.getTaskById(id);
    if (!existing) {
      throw new Error(`Task ${id} not found`);
    }

    // 更新基本資訊（使用類型安全的方式提取屬性）
    const identityUpdates: Partial<TaskIdentityComplete> = {};
    const identityKeys: Array<keyof TaskIdentityComplete> = [
      'name',
      'description',
      'notes',
      'tags',
      'category',
      'subcategory',
      'status',
      'priority',
      'assignedTo'
    ];
    for (const key of identityKeys) {
      if (key in updates && (updates as any)[key] !== undefined) {
        (identityUpdates as any)[key] = (updates as any)[key];
      }
    }

    if (Object.keys(identityUpdates).length > 0) {
      await this.identityService.updateTask(id, identityUpdates);
    }

    // 更新時間數據
    if (updates.time?.planned) {
      await this.timeService.updatePlannedTime(id, updates.time.planned);
    }
    if (updates.time?.actual) {
      await this.timeService.updateActualTime(id, updates.time.actual);
    }

    // 如果更新了依賴關係，清除緩存
    if (updates.dependency) {
      await this.calculator.clearCache(id);
    }

    // 如果更新了時間數據，重新計算 CPM
    if (updates.time) {
      await this.calculator.calculateCPM(id);
    }

    // 更新位置數據
    if (updates.location?.physical) {
      await this.locationService.updatePhysicalLocation(id, updates.location.physical);
    }

    // 更新其他維度
    if (updates.quantity) {
      const quantityPayload = this.normalizeQuantityPayload(updates.quantity);
      const actorId = await this.resolveCurrentUserId();
      const primaryMaterial = await this.resourceService.setQuantity(id, quantityPayload);
      await this.progressService.updateProgress(id, {
        quantity: {
          unit: primaryMaterial.unit,
          planned: primaryMaterial.plannedQuantity,
          installed: primaryMaterial.installedQuantity,
          used: primaryMaterial.usedQuantity
        },
        percentage: this.calculateQuantityPercentage(primaryMaterial),
        status: this.resolveProgressStatus(updates.status, primaryMaterial),
        recordedBy: existing.updatedBy ?? existing.createdBy ?? actorId ?? undefined
      });
    }

    if (updates.cost?.cost) {
      await this.costService.updateBudget(id, updates.cost.cost);
    }

    const updatedTargets = updates.quality?.summary?.targets;
    if (updatedTargets && updatedTargets.length > 0) {
      await this.qualityService.updateQualityTargets(id, updatedTargets);
    }

    // 返回更新後的基本任務資訊（避免在寫入流程中觸發重型讀取）
    const task: Task = (await this.identityService.getTaskById(id)) as unknown as Task;
    // 觸發資料變更
    this.changed.update(v => v + 1);
    // TODO(ETMS_SPEC §0.9): 任務更新後應觸發藍圖層彙總重算與活動記錄，避免儀表板數據陳舊。
    return task;
  }

  private normalizeQuantityPayload(payload?: TaskQuantityPayload | null): TaskQuantityPayload {
    const unit = payload?.unit?.trim() || 'item';
    const planned = Math.max(1, Math.floor(payload?.plannedQuantity ?? 1));
    const installedRaw = payload?.installedQuantity ?? 0;
    const usedRaw = payload?.usedQuantity ?? installedRaw;
    const installed = Math.min(Math.max(0, Math.floor(installedRaw)), planned);
    const used = Math.min(Math.max(0, Math.floor(usedRaw)), planned);

    return {
      unit,
      plannedQuantity: planned,
      installedQuantity: installed,
      usedQuantity: used,
      materialId: payload?.materialId,
      name: payload?.name ?? DEFAULT_QUANTITY_NAME
    };
  }

  private calculateQuantityPercentage(material: MaterialItem): number {
    if (!material || material.plannedQuantity <= 0) {
      return 0;
    }
    const completed = material.installedQuantity > 0 ? material.installedQuantity : material.usedQuantity;
    return Math.min(100, Math.max(0, (completed / material.plannedQuantity) * 100));
  }

  private resolveProgressStatus(identityStatus: string | undefined, material: MaterialItem): TaskStatus {
    const mappedStatus = this.mapIdentityStatus(identityStatus);
    if (mappedStatus) {
      return mappedStatus;
    }

    if (material.installedQuantity >= material.plannedQuantity || material.usedQuantity >= material.plannedQuantity) {
      return TaskStatus.COMPLETED;
    }

    if (material.installedQuantity > 0 || material.usedQuantity > 0) {
      return TaskStatus.IN_PROGRESS;
    }

    return TaskStatus.NOT_STARTED;
  }

  private mapIdentityStatus(status?: string): TaskStatus | undefined {
    switch (status) {
      case 'todo':
        return TaskStatus.NOT_STARTED;
      case 'in-progress':
        return TaskStatus.IN_PROGRESS;
      case 'completed':
        return TaskStatus.COMPLETED;
      case 'cancelled':
        return TaskStatus.CANCELLED;
      default:
        return undefined;
    }
  }

  private buildScheduleSummary(
    time: TaskTime | null | undefined,
    progress: TaskProgress | null | undefined
  ): TaskScheduleSummary | undefined {
    if (!time && !progress) {
      return undefined;
    }

    const planned = time?.planned;
    const actual = time?.actual;
    const flexibility = time?.flexibility;
    const quantitySnapshot = progress?.progress?.progress?.quantity;
    const progressPercentage = progress?.progress?.progress?.percentage ?? 0;

    const delayDays = actual?.delayDays ?? 0;
    const slack = flexibility?.totalFloat ?? null;

    let delayStatus: TaskDelayStatus = 'on-track';
    const progressStatus = progress?.progress?.progress?.status;
    if (progressPercentage >= 100 || progressStatus === TaskStatus.COMPLETED || progressStatus === TaskStatus.ACCEPTED) {
      delayStatus = 'completed';
    } else if (delayDays > 0) {
      delayStatus = 'delayed';
    } else if (slack !== null && slack <= 0) {
      delayStatus = 'at-risk';
    }

    const updatedAt =
      quantitySnapshot?.lastUpdatedAt ??
      actual?.actualEndDate ??
      actual?.actualStartDate ??
      planned?.plannedEndDate ??
      planned?.plannedStartDate ??
      new Date();

    const summary: TaskScheduleSummary = {
      plannedStart: planned?.plannedStartDate ?? null,
      plannedEnd: planned?.plannedEndDate ?? null,
      actualStart: actual?.actualStartDate ?? null,
      actualEnd: actual?.actualEndDate ?? null,
      plannedDuration: planned?.plannedDuration ?? null,
      actualDuration: actual?.actualDuration ?? null,
      progressPercentage,
      delayStatus,
      slackDays: slack,
      updatedAt,
      updatedBy: progress?.progress?.progress?.statusChangedBy ?? undefined
    };

    return summary;
  }

  private buildDependencyOverview(dependency: TaskDependency | null | undefined): TaskDependencyOverview | undefined {
    if (!dependency) {
      return undefined;
    }

    const predecessors = dependency.predecessors?.predecessors ?? [];
    const successors = dependency.successors?.successors ?? [];
    const blockingTasks = dependency.successors?.blockingTasks ?? [];
    const impactChain = dependency.successors?.impactChain ?? [];

    let summary: TaskDependencySummary | undefined;
    if (predecessors.length || successors.length || blockingTasks.length) {
      summary = {
        predecessors: predecessors.map(item => ({
          taskId: item.taskId,
          type: item.type,
          lagDays: item.lag
        })),
        successors: successors.map(item => item.taskId),
        isCritical: impactChain.some(item => item.isCritical),
        blockingCount: blockingTasks.length
      };
    }

    const relatedTasks = dependency.relatedTasks?.relatedTasks ?? [];
    let relations: TaskRelationSummary | undefined;
    if (relatedTasks.length) {
      const conflictIds = relatedTasks.filter(item => item.relationType === RelationType.CONFLICT).map(item => item.taskId);
      relations = {
        relatedTaskIds: Array.from(new Set(relatedTasks.map(item => item.taskId))),
        conflictTaskIds: Array.from(new Set(conflictIds))
      };
    }

    const milestones = dependency.milestones?.milestones ?? [];
    let milestoneLinks: TaskMilestoneLink[] | undefined;
    if (milestones.length) {
      milestoneLinks = milestones.map(milestone => ({
        milestoneId: milestone.id,
        status: milestone.status as TaskMilestoneStatus,
        plannedDate: milestone.plannedDate ?? null,
        actualDate: milestone.actualDate ?? null
      }));
    }

    if (!summary && !relations && (!milestoneLinks || milestoneLinks.length === 0)) {
      return undefined;
    }

    return {
      summary,
      relations,
      milestones: milestoneLinks
    };
  }

  private buildLocationOverview(location: TaskLocation | null | undefined): TaskLocationOverview | undefined {
    if (!location) {
      return undefined;
    }

    const physical = location.physical?.location;
    let locationSummary: TaskLocationSummary | undefined;
    if (physical) {
      const coordinates = physical.coordinates;
      locationSummary = {
        site: physical.site,
        zone: physical.zone,
        floor: physical.floor,
        room: physical.room,
        equipmentCode: physical.equipment,
        bimElementId: physical.bimElementId,
        coordinates: coordinates
          ? {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              elevation: coordinates.altitude ?? coordinates.relativeZ
            }
          : undefined
      };
    }

    const spatialRelations = location.relationships?.spatialRelations;
    let spatialSummary: TaskSpatialRiskSummary | undefined;
    if (spatialRelations) {
      const adjacentTaskIds = spatialRelations.adjacentTasks?.map(item => item.taskId) ?? [];
      const conflictTaskIds = [
        ...(spatialRelations.spatialConflicts?.map(item => item.taskId) ?? []),
        ...(spatialRelations.overlappingTasks?.map(item => item.taskId) ?? [])
      ];
      const accessPath = spatialRelations.accessPath ?? [];
      spatialSummary = {
        adjacentTaskIds: Array.from(new Set(adjacentTaskIds)),
        conflictTaskIds: Array.from(new Set(conflictTaskIds)),
        accessNotes: accessPath.length ? accessPath.join(' → ') : undefined
      };
    }

    if (
      !locationSummary &&
      (!spatialSummary || (!spatialSummary.adjacentTaskIds.length && !spatialSummary.conflictTaskIds.length && !spatialSummary.accessNotes))
    ) {
      return undefined;
    }

    return {
      location: locationSummary,
      spatial: spatialSummary
    };
  }

  /**
   * 刪除任務（軟刪除），同時處理相關數據
   *
   * @param id 任務 ID
   * @returns 刪除結果
   */
  async deleteTask(id: string): Promise<void> {
    // 檢查是否有後續任務依賴此任務
    const successors = await this.dependencyService.getSuccessors(id);
    if (successors && successors.successors.length > 0) {
      console.warn(`Task ${id} has ${successors.successors.length} successor(s). Deletion may break dependencies.`);
    }

    // 檢查是否有未完成的變更請求
    const changes = await this.changeService.getTaskChanges(id);
    if (changes?.changes) {
      const pendingChanges = changes.changes.changes.filter(
        (c: any) => c.status === 'draft' || c.status === 'submitted' || c.status === 'under-review'
      );
      if (pendingChanges.length > 0) {
        console.warn(`Task ${id} has ${pendingChanges.length} pending change request(s).`);
      }
    }

    // 從用戶上下文獲取 userId
    const userId = await this.resolveCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    await this.progressService.removeProgress(id);
    await this.costService.removeCost(id);
    await this.qualityService.removeQuality(id);
    await this.safetyService.removeSafety(id);
    await this.documentService.removeDocuments(id);
    await this.communicationService.removeCommunications(id);
    // 軟刪除任務
    await this.identityService.deleteTask(id, userId);
    // 觸發資料變更
    this.changed.update(v => v + 1);
    // TODO(ETMS_SPEC §0.9): 任務刪除後需同步減量藍圖 KPI 與重新評估里程碑狀態。
  }

  /**
   * 獲取藍圖下的所有任務，支援篩選和排序
   *
   * @param blueprintId 藍圖 ID
   * @param filters 篩選條件
   * @param sortBy 排序欄位
   * @param sortOrder 排序方向
   * @param includeDimensions 是否包含所有維度數據（預設 false，只返回基本資訊）
   * @returns 任務列表
   */
  async getTasksByBlueprint(
    blueprintId: string,
    filters?: TaskFilters,
    sortBy = 'plannedStartDate',
    sortOrder: 'asc' | 'desc' = 'asc',
    includeDimensions = false
  ): Promise<Task[]> {
    const records = await this.identityRepository.listByBlueprint(blueprintId, {
      taskIds: filters?.taskIds
    });
    const tasks = records.map(record => this.identityService.convertFromDb(record));

    // 應用篩選條件
    let filteredTasks = tasks;
    const remainingFilters = { ...filters, taskIds: undefined };

    if (remainingFilters) {
      if (remainingFilters.status) {
        filteredTasks = filteredTasks.filter((t: TaskIdentityComplete) => t.status === remainingFilters.status);
      }
      if (remainingFilters.priority) {
        filteredTasks = filteredTasks.filter((t: TaskIdentityComplete) => t.priority === remainingFilters.priority);
      }
      if (remainingFilters.assignedTo) {
        filteredTasks = filteredTasks.filter((t: TaskIdentityComplete) => t.assignedTo === remainingFilters.assignedTo);
      }
      if (remainingFilters.isCriticalPath !== undefined) {
        // 需要從時間維度獲取 isCriticalPath
        // 這裡簡化處理，實際應該並行查詢
      }
      if (remainingFilters.tags && remainingFilters.tags.length > 0) {
        filteredTasks = filteredTasks.filter((t: TaskIdentityComplete) =>
          remainingFilters.tags!.some((tag: string) => t.tags.includes(tag))
        );
      }
      if (remainingFilters.searchQuery) {
        const queryText = remainingFilters.searchQuery.toLowerCase();
        filteredTasks = filteredTasks.filter(
          (t: TaskIdentityComplete) =>
            t.name.toLowerCase().includes(queryText) ||
            t.description?.toLowerCase().includes(queryText) ||
            t.code.toLowerCase().includes(queryText)
        );
      }
    }

    // 應用排序
    filteredTasks.sort((a: TaskIdentityComplete, b: TaskIdentityComplete) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'plannedStartDate':
          // 需要從時間維度獲取，這裡簡化處理
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'priority':
          aValue = a.priority || '';
          bValue = b.priority || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    // 如果需要包含所有維度數據，並行獲取
    if (includeDimensions) {
      return Promise.all(filteredTasks.map((t: TaskIdentityComplete) => this.getTask(t.id))).then((tasks: Array<Task | null>) =>
        tasks.filter((t): t is Task => t !== null)
      );
    }

    return filteredTasks as Task[];
  }

  /**
   * 獲取父任務下的所有子任務
   *
   * @param blueprintId 藍圖 ID
   * @param parentId 父任務 ID（null 表示根任務）
   * @returns 子任務列表
   */
  async getTasksByParent(blueprintId: string, parentId: string | null): Promise<Task[]> {
    const records = await this.identityRepository.listByBlueprint(blueprintId);
    const tasks = records.map(record => this.identityService.convertFromDb(record));

    return tasks
      .filter((t: TaskIdentityComplete) => t.parentId === parentId)
      .sort((a: TaskIdentityComplete, b: TaskIdentityComplete) => (a.sortOrder || 0) - (b.sortOrder || 0)) as Task[];
  }

  /**
   * 獲取任務樹（階層結構），包含所有子任務
   *
   * @param blueprintId 藍圖 ID
   * @returns 任務樹
   */
  async getTaskTree(blueprintId: string): Promise<TaskTreeNode[]> {
    // 委託給 TaskTreeBuilderService，避免重複實現
    return this.treeBuilder.buildTree(blueprintId, {
      includeArchived: false,
      sortBy: 'sortOrder',
      sortOrder: 'asc'
    });
  }

  /**
   * 獲取藍圖的關鍵路徑
   *
   * @param blueprintId 藍圖 ID
   * @returns 關鍵路徑資訊
   */
  async getCriticalPath(blueprintId: string): Promise<CriticalPath | null> {
    return this.criticalPathService.getCriticalPath(blueprintId);
  }

  /**
   * 驗證任務數據完整性，檢查所有維度的約束
   *
   * @param task 任務對象
   * @returns 驗證結果
   */
  async validateTask(task: Partial<TaskIdentityComplete & Task>): Promise<TaskValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 檢查必要欄位
    const taskName = 'name' in task ? task.name : undefined;
    if (!taskName || taskName.trim() === '') {
      errors.push('Task name is required');
    }

    // 檢查時間數據
    if (task.time?.planned) {
      const planned = task.time.planned;
      if (planned.plannedStartDate && planned.plannedEndDate) {
        if (planned.plannedStartDate >= planned.plannedEndDate) {
          errors.push('Planned start date must be before planned end date');
        }
        if (planned.plannedDuration <= 0) {
          errors.push('Planned duration must be greater than 0');
        }
      }
    }

    if (task.time?.actual) {
      const actual = task.time.actual;
      if (actual.actualStartDate && actual.actualEndDate) {
        if (actual.actualStartDate > actual.actualEndDate) {
          errors.push('Actual start date must be before or equal to actual end date');
        }
      }
    }

    // 檢查依賴關係是否有循環（需要調用服務檢查）
    if (task.dependency?.predecessors) {
      for (const pred of task.dependency.predecessors.predecessors) {
        if (pred.taskId === task.id) {
          errors.push('Task cannot depend on itself');
        }
        // 這裡可以調用 checkCircularDependency，但需要任務已創建
      }
    }

    // 檢查進度是否在 0-100 範圍內
    if (task.progress?.progress?.progress) {
      const percentage = task.progress.progress.progress.percentage;
      if (percentage < 0 || percentage > 100) {
        errors.push('Progress percentage must be between 0 and 100');
      }
    }

    // 檢查成本是否合理
    if (task.cost?.cost) {
      const cost = task.cost.cost;
      if (cost.cost.budgetAmount < 0) {
        errors.push('Budget amount cannot be negative');
      }
      if (cost.cost.actualCost < 0) {
        errors.push('Actual cost cannot be negative');
      }
      if (cost.cost.actualCost > cost.cost.budgetAmount * 1.5) {
        warnings.push('Actual cost exceeds budget by more than 50%');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 批量更新任務，用於批量操作
   *
   * @param updates 任務更新陣列
   * @returns 批量更新結果
   */
  async bulkUpdateTasks(updates: Array<{ id: string; updates: Partial<Task> }>): Promise<BulkUpdateResult> {
    const results = await Promise.allSettled(updates.map(({ id, updates: taskUpdates }) => this.updateTask(id, taskUpdates)));

    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    const errors = results
      .map((r, index) => {
        if (r.status === 'rejected') {
          return {
            taskId: updates[index].id,
            error: r.reason?.message || 'Unknown error'
          };
        }
        return null;
      })
      .filter((e): e is { taskId: string; error: string } => e !== null);

    return { success, failed, errors };
  }

  /**
   * 搜尋任務，支援全文搜尋
   *
   * @param blueprintId 藍圖 ID
   * @param query 搜尋關鍵字
   * @param fields 搜尋欄位（title, description, code 等）
   * @returns 匹配的任務列表
   */
  async searchTasks(blueprintId: string, query: string, fields: string[] = ['name', 'description', 'code']): Promise<Task[]> {
    const records = await this.identityRepository.listByBlueprint(blueprintId);
    const tasks = records.map(record => this.identityService.convertFromDb(record));

    // 簡化搜尋：使用多欄位 LIKE 查詢
    const lowerQuery = query.toLowerCase();
    return tasks.filter((task: TaskIdentityComplete) => {
      for (const field of fields) {
        let value: string | undefined;
        switch (field) {
          case 'name':
            value = task.name?.toLowerCase();
            break;
          case 'description':
            value = task.description?.toLowerCase();
            break;
          case 'code':
            value = task.code?.toLowerCase();
            break;
        }
        if (value && value.includes(lowerQuery)) {
          return true;
        }
      }
      return false;
    }) as Task[];
  }
}
