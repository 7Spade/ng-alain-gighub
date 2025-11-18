/**
 * Task Resource View Service
 *
 * 任務資源視角服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：E. 資源維度
 *
 * 職責：
 * - 提供資源負荷視角的數據組織
 * - 處理資源分配的視覺化
 * - 管理資源衝突檢測與優化建議
 * - 提供資源使用率統計與圖表數據
 *
 * @see @ETMS_DESIGN_SPEC.md E. 資源維度
 */

import { Injectable, inject } from '@angular/core';
import type { TaskResource, Task } from '@models';
import { TaskRepository } from '@tasks/features/task-detail/services/repository/task.repository';
import { TaskResourceService } from '@tasks/features/task-resource/services/domain/task-resource.service';

/**
 * 資源視角數據
 */
export interface ResourceViewData {
  /** 任務列表 */
  tasks: Task[];

  /** 篩選條件 */
  filters: {
    /** 資源類型 */
    resourceType?: 'human' | 'material' | 'equipment';
    /** 資源狀態 */
    resourceStatus?: string;
    /** 使用率範圍 */
    utilizationRange?: { min: number; max: number };
  };

  /** 統計資訊 */
  statistics: {
    /** 總任務數 */
    totalTasks: number;
    /** 人力資源任務數 */
    humanResourceTasks: number;
    /** 材料資源任務數 */
    materialResourceTasks: number;
    /** 機具資源任務數 */
    equipmentResourceTasks: number;
    /** 平均使用率 */
    averageUtilization: number;
  };
}

/**
 * 資源視覺化數據
 */
export interface ResourceVisualizationData {
  /** 資源節點 */
  nodes: Array<{
    id: string;
    code: string;
    name: string;
    resourceType: 'human' | 'material' | 'equipment';
    utilization: number;
    capacity: number;
    used: number;
    status: string;
    x: number;
    y: number;
  }>;

  /** 資源分配邊 */
  edges: Array<{
    from: string; // 資源 ID
    to: string; // 任務 ID
    type: string;
    allocation: number;
  }>;

  /** 佈局資訊 */
  layout: {
    width: number;
    height: number;
    resourceTypeLayout: 'grouped' | 'mixed';
  };
}

@Injectable({
  providedIn: 'root'
})
export class TaskResourceViewService {
  private readonly taskRepository = inject(TaskRepository);
  private readonly resourceService = inject(TaskResourceService);

  /**
   * 獲取資源視角數據
   *
   * @param blueprintId 藍圖 ID
   * @param filters 篩選條件
   * @returns 資源視角數據
   */
  async getViewData(
    blueprintId: string,
    filters?: {
      taskIds?: string[];
      resourceType?: 'human' | 'material' | 'equipment';
      resourceStatus?: string;
      utilizationRange?: { min: number; max: number };
    }
  ): Promise<ResourceViewData> {
    const repositoryFilters = filters?.taskIds?.length ? { taskIds: filters.taskIds } : undefined;

    // 獲取任務列表
    const tasks = await this.taskRepository.getTasksByBlueprint(blueprintId, repositoryFilters);

    // 並行獲取所有任務的資源資訊
    const tasksWithResources = await Promise.all(
      tasks.map(async task => {
        const resource = await this.resourceService.getTaskResource(task.id);
        return { ...task, resource };
      })
    );

    // 過濾任務
    let filteredTasks = tasksWithResources;

    if (filters?.resourceType) {
      filteredTasks = filteredTasks.filter(task => {
        if (!task.resource) return false;
        switch (filters.resourceType) {
          case 'human':
            return !!task.resource.manpower;
          case 'material':
            return !!task.resource.materials;
          case 'equipment':
            return !!task.resource.equipment;
          default:
            return false;
        }
      });
    }

    if (filters?.utilizationRange) {
      filteredTasks = filteredTasks.filter(task => {
        const utilization = this.calculateUtilization(task.resource ?? undefined);
        return utilization >= filters.utilizationRange!.min && utilization <= filters.utilizationRange!.max;
      });
    }

    // 計算統計資訊
    const humanResourceTasks = filteredTasks.filter(t => t.resource?.manpower).length;
    const materialResourceTasks = filteredTasks.filter(t => t.resource?.materials).length;
    const equipmentResourceTasks = filteredTasks.filter(t => t.resource?.equipment).length;

    const utilizations = filteredTasks.map(t => this.calculateUtilization(t.resource ?? undefined)).filter(u => u > 0);

    const averageUtilization = utilizations.length > 0 ? utilizations.reduce((sum, u) => sum + u, 0) / utilizations.length : 0;

    const statistics = {
      totalTasks: filteredTasks.length,
      humanResourceTasks,
      materialResourceTasks,
      equipmentResourceTasks,
      averageUtilization
    };

    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tasks: filteredTasks.map(({ resource: _resource, ...task }) => task),
      filters: filters || {},
      statistics
    };
  }

  /**
   * 生成資源視覺化數據
   *
   * @param blueprintId 藍圖 ID
   * @param options 選項
   * @returns 視覺化數據
   */
  async getVisualizationData(
    blueprintId: string,
    options?: {
      resourceType?: 'human' | 'material' | 'equipment';
      layout?: 'grouped' | 'mixed';
    }
  ): Promise<ResourceVisualizationData> {
    // 獲取任務列表
    const tasks = await this.taskRepository.getTasksByBlueprint(blueprintId);

    // 並行獲取所有任務的資源資訊
    const tasksWithResources = await Promise.all(
      tasks.map(async task => {
        const resource = await this.resourceService.getTaskResource(task.id);
        return { ...task, resource };
      })
    );

    // 構建節點
    const nodes: ResourceVisualizationData['nodes'] = [];
    const rowSpacing = 80;

    // 按資源類型分組
    const humanTasks: typeof tasksWithResources = [];
    const materialTasks: typeof tasksWithResources = [];
    const equipmentTasks: typeof tasksWithResources = [];

    tasksWithResources.forEach(task => {
      if (task.resource?.manpower) humanTasks.push(task);
      if (task.resource?.materials) materialTasks.push(task);
      if (task.resource?.equipment) equipmentTasks.push(task);
    });

    // 生成人力資源節點
    let currentY = 50;
    humanTasks.forEach(task => {
      const utilization = this.calculateHumanUtilization(task.resource ?? undefined);
      const capacity = task.resource?.manpower?.manpower.totalManHours || 0;
      const used = task.resource?.manpower?.manpower.completedManHours || 0;

      nodes.push({
        id: `human-${task.id}`,
        code: task.code,
        name: task.name,
        resourceType: 'human',
        utilization,
        capacity,
        used,
        status: this.getResourceStatus(utilization),
        x: 100,
        y: currentY
      });

      currentY += rowSpacing;
    });

    // 生成材料資源節點
    currentY = 50;
    materialTasks.forEach(task => {
      const utilization = this.calculateMaterialUtilization(task.resource ?? undefined);
      const capacity = this.calculateMaterialCapacity(task.resource ?? undefined);
      const used = this.calculateMaterialUsed(task.resource ?? undefined);

      nodes.push({
        id: `material-${task.id}`,
        code: task.code,
        name: task.name,
        resourceType: 'material',
        utilization,
        capacity,
        used,
        status: this.getResourceStatus(utilization),
        x: 400,
        y: currentY
      });

      currentY += rowSpacing;
    });

    // 生成機具資源節點
    currentY = 50;
    equipmentTasks.forEach(task => {
      const utilization = this.calculateEquipmentUtilization(task.resource ?? undefined);
      const capacity = this.calculateEquipmentCapacity(task.resource ?? undefined);
      const used = this.calculateEquipmentUsed(task.resource ?? undefined);

      nodes.push({
        id: `equipment-${task.id}`,
        code: task.code,
        name: task.name,
        resourceType: 'equipment',
        utilization,
        capacity,
        used,
        status: this.getResourceStatus(utilization),
        x: 700,
        y: currentY
      });

      currentY += rowSpacing;
    });

    // 構建邊（資源分配）
    const edges: ResourceVisualizationData['edges'] = [];

    tasksWithResources.forEach(task => {
      if (task.resource?.manpower) {
        edges.push({
          from: `human-${task.id}`,
          to: task.id,
          type: 'human',
          allocation: task.resource.manpower.manpower.totalManHours
        });
      }

      if (task.resource?.materials) {
        edges.push({
          from: `material-${task.id}`,
          to: task.id,
          type: 'material',
          allocation: this.calculateMaterialCapacity(task.resource)
        });
      }

      if (task.resource?.equipment) {
        edges.push({
          from: `equipment-${task.id}`,
          to: task.id,
          type: 'equipment',
          allocation: this.calculateEquipmentCapacity(task.resource)
        });
      }
    });

    // 計算佈局
    const maxY = Math.max(...nodes.map(n => n.y), 100) + rowSpacing;
    const width = 1000;
    const height = maxY;

    return {
      nodes,
      edges,
      layout: {
        width,
        height,
        resourceTypeLayout: options?.layout || 'grouped'
      }
    };
  }

  /**
   * 計算資源使用率
   */
  private calculateUtilization(resource?: TaskResource): number {
    if (!resource) return 0;

    let totalCapacity = 0;
    let totalUsed = 0;

    if (resource.manpower) {
      totalCapacity += resource.manpower.manpower.totalManHours || 0;
      totalUsed += resource.manpower.manpower.completedManHours || 0;
    }

    if (resource.materials) {
      totalCapacity += this.calculateMaterialCapacity(resource);
      totalUsed += this.calculateMaterialUsed(resource);
    }

    if (resource.equipment) {
      totalCapacity += this.calculateEquipmentCapacity(resource);
      totalUsed += this.calculateEquipmentUsed(resource);
    }

    return totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0;
  }

  /**
   * 計算人力資源使用率
   */
  private calculateHumanUtilization(resource?: TaskResource): number {
    if (!resource?.manpower) return 0;
    const total = resource.manpower.manpower.totalManHours || 0;
    const completed = resource.manpower.manpower.completedManHours || 0;
    return total > 0 ? (completed / total) * 100 : 0;
  }

  /**
   * 計算材料資源使用率
   */
  private calculateMaterialUtilization(resource?: TaskResource): number {
    if (!resource?.materials) return 0;
    const capacity = this.calculateMaterialCapacity(resource);
    const used = this.calculateMaterialUsed(resource);
    return capacity > 0 ? (used / capacity) * 100 : 0;
  }

  /**
   * 計算材料容量
   */
  private calculateMaterialCapacity(resource?: TaskResource): number {
    if (!resource?.materials) return 0;
    return resource.materials.materials.reduce((sum, m) => sum + (m.plannedQuantity || 0), 0);
  }

  /**
   * 計算材料已使用量
   */
  private calculateMaterialUsed(resource?: TaskResource): number {
    if (!resource?.materials) return 0;
    return resource.materials.materials.reduce((sum, m) => sum + (m.usedQuantity || 0), 0);
  }

  /**
   * 計算機具資源使用率
   */
  private calculateEquipmentUtilization(resource?: TaskResource): number {
    if (!resource?.equipment) return 0;
    const capacity = this.calculateEquipmentCapacity(resource);
    const used = this.calculateEquipmentUsed(resource);
    return capacity > 0 ? (used / capacity) * 100 : 0;
  }

  /**
   * 計算機具容量
   */
  private calculateEquipmentCapacity(resource?: TaskResource): number {
    if (!resource?.equipment) return 0;
    return resource.equipment.equipment.length;
  }

  /**
   * 計算機具已使用量
   */
  private calculateEquipmentUsed(resource?: TaskResource): number {
    if (!resource?.equipment) return 0;
    return resource.equipment.equipment.filter(e => e.status === 'in-use').length;
  }

  /**
   * 獲取資源狀態
   */
  private getResourceStatus(utilization: number): string {
    if (utilization >= 90) return 'overloaded';
    if (utilization >= 70) return 'high';
    if (utilization >= 50) return 'normal';
    if (utilization >= 30) return 'low';
    return 'idle';
  }
}
