/**
 * Task View Service
 *
 * 任務多視角切換服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：多維度視角管理
 *
 * 職責：
 * - 管理多種視角的切換（時間、資源、空間、角色等）
 * - 提供視角特定的篩選與排序邏輯
 * - 管理視角狀態的保存與恢復
 * - 協調各專用視角服務的互動
 *
 * @see @ETMS_DESIGN_SPEC.md 多維度視角管理
 */

import { Injectable, inject, signal } from '@angular/core';
import type { Task } from '@models';
import { TaskCostService } from '@tasks/features/task-cost/services/domain/task-cost.service';
import { TaskDependencyService } from '@tasks/features/task-dependency/services/domain/task-dependency.service';
import { TaskRepository } from '@tasks/features/task-detail/services/repository/task.repository';
import { TaskQualityService } from '@tasks/features/task-quality/services/domain/task-quality.service';
import { TaskRoleViewService } from '@tasks/features/task-role/services/views/task-role-view.service';
import { TaskTimeViewService } from '@tasks/features/task-time/services/views/task-time-view.service';

import { TaskLocationViewService } from '../../../task-location/services/views/task-location-view.service';
import { TaskResourceViewService } from '../../../task-resource/services/views/task-resource-view.service';

/**
 * 視角類型
 */
export type ViewType = 'time' | 'resource' | 'role' | 'location' | 'dependency' | 'cost' | 'quality';

/**
 * 視角配置
 */
export interface ViewConfig {
  /** 視角類型 */
  type: ViewType;
  /** 視角名稱 */
  name: string;
  /** 視角描述 */
  description: string;
  /** 視角圖標（可選） */
  icon?: string;
  /** 是否啟用 */
  enabled: boolean;
  /** 視角特定的配置選項 */
  options?: Record<string, any>;
}

/**
 * 視角數據
 */
export interface ViewData {
  /** 視角類型 */
  type: ViewType;
  /** 任務數據（視角特定的組織方式） */
  tasks: Task[];
  /** 視角特定的元數據 */
  metadata?: Record<string, any>;
  /** 視角特定的篩選選項 */
  filters?: Record<string, any>;
  /** 視角特定的排序選項 */
  sort?: { field: string; ascending: boolean };
}

/**
 * 視角切換選項
 */
export interface SwitchViewOptions {
  /** 藍圖 ID（可選） */
  blueprintId?: string;
  /** 任務 ID 列表（可選，用於篩選） */
  taskIds?: string[];
  /** 視角特定的配置選項 */
  options?: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class TaskViewService {
  private readonly timeViewService = inject(TaskTimeViewService);
  private readonly resourceViewService = inject(TaskResourceViewService);
  private readonly roleViewService = inject(TaskRoleViewService);
  private readonly locationViewService = inject(TaskLocationViewService);
  private readonly dependencyService = inject(TaskDependencyService);
  private readonly costService = inject(TaskCostService);
  private readonly qualityService = inject(TaskQualityService);
  private readonly taskRepository = inject(TaskRepository);

  /** 當前活動的視角 */
  private readonly currentView = signal<ViewType | null>(null);

  /** 視角配置緩存 */
  private readonly viewConfigCache = signal<Map<ViewType, ViewConfig>>(new Map());

  /**
   * 獲取可用的視角列表
   *
   * @returns 視角配置列表
   */
  getAvailableViews(): ViewConfig[] {
    const views: ViewConfig[] = [
      {
        type: 'time',
        name: '時間視角',
        description: '以時間軸方式展示任務，支援甘特圖視圖',
        icon: 'clock-circle',
        enabled: true,
        options: {
          showGantt: true,
          showTimeline: true,
          showCalendar: false
        }
      },
      {
        type: 'resource',
        name: '資源視角',
        description: '以資源分配方式展示任務，顯示資源負荷與衝突',
        icon: 'team',
        enabled: true,
        options: {
          showWorkload: true,
          showConflicts: true,
          showUtilization: true
        }
      },
      {
        type: 'role',
        name: '角色視角',
        description: '以角色為維度展示任務，支援負責人、協作者等視圖',
        icon: 'user',
        enabled: true,
        options: {
          showAssignees: true,
          showCollaborators: true,
          showReviewers: false
        }
      },
      {
        type: 'location',
        name: '空間視角',
        description: '以空間位置方式展示任務，支援階層式位置導航',
        icon: 'environment',
        enabled: true,
        options: {
          showHierarchy: true,
          showBim: false,
          show3d: false
        }
      },
      {
        type: 'dependency',
        name: '依賴視角',
        description: '以任務依賴關係展示任務，顯示前置與後續任務',
        icon: 'apartment',
        enabled: true,
        options: {
          showPredecessors: true,
          showSuccessors: true,
          showCriticalPath: false
        }
      },
      {
        type: 'cost',
        name: '成本視角',
        description: '以成本為維度展示任務，顯示預算與實際成本',
        icon: 'dollar',
        enabled: true,
        options: {
          showBudget: true,
          showActual: true,
          showVariance: true
        }
      },
      {
        type: 'quality',
        name: '品質視角',
        description: '以品質指標展示任務，顯示檢查點與品質狀態',
        icon: 'check-circle',
        enabled: true,
        options: {
          showCheckpoints: true,
          showQualityStatus: true,
          showDefects: false
        }
      }
    ];

    // 如果已經有緩存的配置，使用緩存的配置
    const cachedConfigs = this.viewConfigCache();
    if (cachedConfigs.size > 0) {
      return views.map(view => {
        const cached = cachedConfigs.get(view.type);
        return cached ? { ...view, ...cached } : view;
      });
    }

    // 初始化緩存
    const configMap = new Map<ViewType, ViewConfig>();
    views.forEach(view => configMap.set(view.type, view));
    this.viewConfigCache.set(configMap);

    return views;
  }

  /**
   * 切換視角
   *
   * @param viewType 視角類型
   * @param options 切換選項
   * @returns 視角數據
   */
  async switchView(viewType: ViewType, options?: SwitchViewOptions): Promise<ViewData> {
    // 驗證視角是否可用
    const availableViews = this.getAvailableViews();
    const viewConfig = availableViews.find(v => v.type === viewType);
    if (!viewConfig || !viewConfig.enabled) {
      throw new Error(`View type "${viewType}" is not available or disabled`);
    }

    // 更新當前視角
    this.currentView.set(viewType);

    // 根據視角類型調用對應的視圖服務
    let viewData: ViewData;

    switch (viewType) {
      case 'time':
        viewData = await this.getTimeViewData(options);
        break;
      case 'resource':
        viewData = await this.getResourceViewData(options);
        break;
      case 'role':
        viewData = await this.getRoleViewData(options);
        break;
      case 'location':
        viewData = await this.getLocationViewData(options);
        break;
      case 'dependency':
        viewData = await this.getDependencyViewData(options);
        break;
      case 'cost':
        viewData = await this.getCostViewData(options);
        break;
      case 'quality':
        viewData = await this.getQualityViewData(options);
        break;
      default:
        throw new Error(`Unsupported view type: ${viewType}`);
    }

    return viewData;
  }

  /**
   * 獲取當前視角
   *
   * @returns 當前視角類型或 null
   */
  getCurrentView(): ViewType | null {
    return this.currentView();
  }

  /**
   * 更新視角配置
   *
   * @param viewType 視角類型
   * @param config 配置更新
   */
  updateViewConfig(viewType: ViewType, config: Partial<ViewConfig>): void {
    const configs = new Map(this.viewConfigCache());
    const existing = configs.get(viewType);

    if (existing) {
      configs.set(viewType, { ...existing, ...config });
    } else {
      // 如果不存在，從可用視角列表中查找
      const availableViews = this.getAvailableViews();
      const view = availableViews.find(v => v.type === viewType);
      if (view) {
        configs.set(viewType, { ...view, ...config });
      }
    }

    this.viewConfigCache.set(configs);
  }

  /**
   * 獲取視角配置
   *
   * @param viewType 視角類型
   * @returns 視角配置或 null
   */
  getViewConfig(viewType: ViewType): ViewConfig | null {
    const configs = this.viewConfigCache();
    return configs.get(viewType) || null;
  }

  // ============================================
  // 私有方法：各視角的數據獲取
  // ============================================

  /**
   * 獲取時間視角數據
   */
  private async getTimeViewData(options?: SwitchViewOptions): Promise<ViewData> {
    if (!options?.blueprintId) {
      return {
        type: 'time',
        tasks: [],
        metadata: { viewType: 'time', ganttEnabled: true },
        filters: options?.options?.['filters'] || {},
        sort: options?.options?.['sort'] || { field: 'startDate', ascending: true }
      };
    }

    type TimeViewFilters = NonNullable<Parameters<TaskTimeViewService['getViewData']>[1]>;
    const rawFilters = (options?.options?.['filters'] ?? {}) as TimeViewFilters;
    const mergedFilters: TimeViewFilters =
      options?.taskIds && options.taskIds.length > 0 ? { ...rawFilters, taskIds: options.taskIds } : rawFilters;

    const timeViewData = await this.timeViewService.getViewData(options.blueprintId, mergedFilters);
    const filteredTasks = this.filterTasksByIds(timeViewData.tasks, options?.taskIds);

    return {
      type: 'time',
      tasks: filteredTasks,
      metadata: {
        viewType: 'time',
        ganttEnabled: true,
        statistics: timeViewData.statistics
      },
      filters: mergedFilters,
      sort: options?.options?.['sort'] || { field: 'startDate', ascending: true }
    };
  }

  /**
   * 獲取資源視角數據
   */
  private async getResourceViewData(options?: SwitchViewOptions): Promise<ViewData> {
    if (!options?.blueprintId) {
      return {
        type: 'resource',
        tasks: [],
        metadata: { viewType: 'resource', workloadEnabled: true },
        filters: options?.options?.['filters'] || {},
        sort: options?.options?.['sort'] || { field: 'resourceAllocation', ascending: false }
      };
    }

    type ResourceViewFilters = NonNullable<Parameters<TaskResourceViewService['getViewData']>[1]>;
    const rawFilters = (options?.options?.['filters'] ?? {}) as ResourceViewFilters;
    const mergedFilters: ResourceViewFilters =
      options?.taskIds && options.taskIds.length > 0 ? { ...rawFilters, taskIds: options.taskIds } : rawFilters;

    const resourceViewData = await this.resourceViewService.getViewData(options.blueprintId, mergedFilters);
    const filteredTasks = this.filterTasksByIds(resourceViewData.tasks, options?.taskIds);

    return {
      type: 'resource',
      tasks: filteredTasks,
      metadata: {
        viewType: 'resource',
        workloadEnabled: true,
        statistics: resourceViewData.statistics
      },
      filters: mergedFilters,
      sort: options?.options?.['sort'] || { field: 'resourceAllocation', ascending: false }
    };
  }

  /**
   * 獲取角色視角數據
   */
  private async getRoleViewData(options?: SwitchViewOptions): Promise<ViewData> {
    if (!options?.blueprintId) {
      return {
        type: 'role',
        tasks: [],
        metadata: { viewType: 'role', assigneesEnabled: true },
        filters: options?.options?.['filters'] || {},
        sort: options?.options?.['sort'] || { field: 'assignedTo', ascending: true }
      };
    }

    type RoleViewFilters = NonNullable<Parameters<TaskRoleViewService['getViewData']>[1]>;
    const rawFilters = (options?.options?.['filters'] ?? {}) as RoleViewFilters;
    const mergedFilters: RoleViewFilters =
      options?.taskIds && options.taskIds.length > 0 ? { ...rawFilters, taskIds: options.taskIds } : rawFilters;

    const roleViewData = await this.roleViewService.getViewData(options.blueprintId, mergedFilters);
    const filteredTasks = this.filterTasksByIds(roleViewData.tasks, options?.taskIds);

    return {
      type: 'role',
      tasks: filteredTasks,
      metadata: {
        viewType: 'role',
        assigneesEnabled: true,
        statistics: roleViewData.statistics
      },
      filters: mergedFilters,
      sort: options?.options?.['sort'] || { field: 'assignedTo', ascending: true }
    };
  }

  /**
   * 獲取空間視角數據
   */
  private async getLocationViewData(options?: SwitchViewOptions): Promise<ViewData> {
    if (!options?.blueprintId) {
      return {
        type: 'location',
        tasks: [],
        metadata: { viewType: 'location', hierarchyEnabled: true },
        filters: options?.options?.['filters'] || {},
        sort: options?.options?.['sort'] || { field: 'location', ascending: true }
      };
    }

    type LocationViewFilters = NonNullable<Parameters<TaskLocationViewService['getViewData']>[1]>;
    const rawFilters = (options?.options?.['filters'] ?? {}) as LocationViewFilters;
    const mergedFilters: LocationViewFilters =
      options?.taskIds && options.taskIds.length > 0 ? { ...rawFilters, taskIds: options.taskIds } : rawFilters;

    const locationViewData = await this.locationViewService.getViewData(options.blueprintId, mergedFilters);
    const filteredTasks = this.filterTasksByIds(locationViewData.tasks, options?.taskIds);

    return {
      type: 'location',
      tasks: filteredTasks,
      metadata: {
        viewType: 'location',
        hierarchyEnabled: true,
        statistics: locationViewData.statistics
      },
      filters: mergedFilters,
      sort: options?.options?.['sort'] || { field: 'location', ascending: true }
    };
  }

  /**
   * 獲取依賴視角數據
   */
  private async getDependencyViewData(options?: SwitchViewOptions): Promise<ViewData> {
    if (!options?.blueprintId) {
      return {
        type: 'dependency',
        tasks: [],
        metadata: { viewType: 'dependency', predecessorsEnabled: true, successorsEnabled: true },
        filters: options?.options?.['filters'] || {},
        sort: options?.options?.['sort'] || { field: 'dependencyOrder', ascending: true }
      };
    }

    // 獲取所有任務
    const repositoryFilters = options?.taskIds && options.taskIds.length > 0 ? { taskIds: options.taskIds } : undefined;
    const tasks = await this.taskRepository.getTasksByBlueprint(options.blueprintId, repositoryFilters);

    // 獲取所有任務的依賴資訊
    const tasksWithDependencies = await Promise.all(
      tasks.map(async task => {
        const dependency = await this.dependencyService.getTaskDependency(task.id);
        return { ...task, dependency: dependency || undefined };
      })
    );

    return {
      type: 'dependency',
      tasks: this.filterTasksByIds(tasksWithDependencies, options?.taskIds),
      metadata: {
        viewType: 'dependency',
        predecessorsEnabled: true,
        successorsEnabled: true
      },
      filters: options?.options?.['filters'] || {},
      sort: options?.options?.['sort'] || { field: 'dependencyOrder', ascending: true }
    };
  }

  /**
   * 獲取成本視角數據
   */
  private async getCostViewData(options?: SwitchViewOptions): Promise<ViewData> {
    if (!options?.blueprintId) {
      return {
        type: 'cost',
        tasks: [],
        metadata: { viewType: 'cost', budgetEnabled: true, actualEnabled: true },
        filters: options?.options?.['filters'] || {},
        sort: options?.options?.['sort'] || { field: 'cost', ascending: false }
      };
    }

    // 獲取所有任務
    const repositoryFilters = options?.taskIds && options.taskIds.length > 0 ? { taskIds: options.taskIds } : undefined;
    const tasks = await this.taskRepository.getTasksByBlueprint(options.blueprintId, repositoryFilters);

    // 獲取所有任務的成本資訊
    const tasksWithCosts = await Promise.all(
      tasks.map(async task => {
        const cost = await this.costService.getTaskCost(task.id);
        return cost ? { ...task, cost } : task;
      })
    );

    return {
      type: 'cost',
      tasks: this.filterTasksByIds(tasksWithCosts, options?.taskIds),
      metadata: {
        viewType: 'cost',
        budgetEnabled: true,
        actualEnabled: true
      },
      filters: options?.options?.['filters'] || {},
      sort: options?.options?.['sort'] || { field: 'cost', ascending: false }
    };
  }

  /**
   * 獲取品質視角數據
   */
  private async getQualityViewData(options?: SwitchViewOptions): Promise<ViewData> {
    if (!options?.blueprintId) {
      return {
        type: 'quality',
        tasks: [],
        metadata: { viewType: 'quality', checkpointsEnabled: true },
        filters: options?.options?.['filters'] || {},
        sort: options?.options?.['sort'] || { field: 'qualityScore', ascending: false }
      };
    }

    // 獲取所有任務
    const repositoryFilters = options?.taskIds && options.taskIds.length > 0 ? { taskIds: options.taskIds } : undefined;
    const tasks = await this.taskRepository.getTasksByBlueprint(options.blueprintId, repositoryFilters);

    // 獲取所有任務的品質資訊
    const tasksWithQuality = await Promise.all(
      tasks.map(async task => {
        const quality = await this.qualityService.getTaskQuality(task.id);
        return quality ? { ...task, quality } : task;
      })
    );

    return {
      type: 'quality',
      tasks: this.filterTasksByIds(tasksWithQuality, options?.taskIds),
      metadata: {
        viewType: 'quality',
        checkpointsEnabled: true
      },
      filters: options?.options?.['filters'] || {},
      sort: options?.options?.['sort'] || { field: 'qualityScore', ascending: false }
    };
  }

  /**
   * 根據指定的任務 ID 過濾任務清單
   */
  private filterTasksByIds<T extends { id: string }>(tasks: T[], taskIds?: string[]): T[] {
    if (!taskIds || taskIds.length === 0) {
      return tasks;
    }
    const allowedIds = new Set(taskIds);
    return tasks.filter(task => allowedIds.has(task.id));
  }
}
