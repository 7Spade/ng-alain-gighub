/**
 * Task Role View Service
 *
 * 任務角色視角服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：多維度視角管理
 *
 * 職責：
 * - 提供基於角色的任務視角（負責人、協作者、審核者等）
 * - 處理角色權限與任務可見性過濾
 * - 管理角色特定的事項與通知
 * - 提供角色工作負荷統計與分析
 *
 * @see @ETMS_DESIGN_SPEC.md 多維度視角管理
 */

import { Injectable, inject } from '@angular/core';
import type { AssignedPersonnel, Task } from '@models';
import { TaskRepository } from '@tasks/features/task-detail/services/repository/task.repository';
import { TaskResourceService } from '@tasks/features/task-resource/services/domain/task-resource.service';

/**
 * 角色視角數據
 */
export interface RoleViewData {
  /** 任務列表 */
  tasks: Task[];

  /** 篩選條件 */
  filters: {
    /** 角色類型 */
    role?: string;
    /** 用戶 ID */
    userId?: string;
    /** 技能等級 */
    skillLevel?: string;
  };

  /** 統計資訊 */
  statistics: {
    /** 總任務數 */
    totalTasks: number;
    /** 角色統計 */
    roleStats: Array<{
      role: string;
      count: number;
      totalHours: number;
      averageProductivity: number;
    }>;
    /** 用戶統計 */
    userStats: Array<{
      userId: string;
      name: string;
      role: string;
      taskCount: number;
      totalHours: number;
      averageProductivity: number;
    }>;
  };
}

/**
 * 角色視覺化數據
 */
export interface RoleVisualizationData {
  /** 角色節點 */
  nodes: Array<{
    id: string;
    name: string;
    role: string;
    taskCount: number;
    totalHours: number;
    utilization: number;
    x: number;
    y: number;
  }>;

  /** 任務分配邊 */
  edges: Array<{
    from: string; // 角色 ID
    to: string; // 任務 ID
    type: 'assigned' | 'collaborator' | 'reviewer';
    hours: number;
  }>;

  /** 佈局資訊 */
  layout: {
    width: number;
    height: number;
    layoutType: 'role-based' | 'user-based';
  };
}

@Injectable({
  providedIn: 'root'
})
export class TaskRoleViewService {
  private readonly taskRepository = inject(TaskRepository);
  private readonly resourceService = inject(TaskResourceService);

  /**
   * 獲取角色視角數據
   *
   * @param blueprintId 藍圖 ID
   * @param filters 篩選條件
   * @returns 角色視角數據
   */
  async getViewData(
    blueprintId: string,
    filters?: {
      taskIds?: string[];
      role?: string;
      userId?: string;
      skillLevel?: string;
    }
  ): Promise<RoleViewData> {
    const repositoryFilters = filters?.taskIds?.length ? { taskIds: filters.taskIds } : undefined;

    // 獲取任務列表
    const tasks = await this.taskRepository.getTasksByBlueprint(blueprintId, repositoryFilters);

    // 並行獲取所有任務的資源資訊（包含人力資源）
    const tasksWithResources = await Promise.all(
      tasks.map(async task => {
        const resource = await this.resourceService.getTaskResource(task.id);
        return { ...task, resource };
      })
    );

    // 收集所有角色和用戶資訊
    const roleMap = new Map<string, { count: number; totalHours: number; productivities: number[] }>();
    const userMap = new Map<
      string,
      {
        name: string;
        role: string;
        taskCount: number;
        totalHours: number;
        productivities: number[];
      }
    >();

    tasksWithResources.forEach(task => {
      const personnel = task.resource?.manpower?.manpower.assignedPersonnel || [];

      personnel.forEach((person: AssignedPersonnel) => {
        // 角色統計
        const roleKey = person.role || 'unknown';
        const roleData = roleMap.get(roleKey) || { count: 0, totalHours: 0, productivities: [] };
        roleData.count++;
        roleData.totalHours += person.assignedHours || 0;
        if (person.productivity !== undefined) {
          roleData.productivities.push(person.productivity);
        }
        roleMap.set(roleKey, roleData);

        // 用戶統計
        const userKey = person.userId;
        if (userKey) {
          const userData = userMap.get(userKey) || {
            name: person.name || 'Unknown',
            role: person.role || 'unknown',
            taskCount: 0,
            totalHours: 0,
            productivities: []
          };
          userData.taskCount++;
          userData.totalHours += person.assignedHours || 0;
          if (person.productivity !== undefined) {
            userData.productivities.push(person.productivity);
          }
          userMap.set(userKey, userData);
        }
      });
    });

    // 過濾任務
    let filteredTasks = tasksWithResources;

    if (filters?.role) {
      filteredTasks = filteredTasks.filter(task => {
        const personnel = task.resource?.manpower?.manpower.assignedPersonnel || [];
        return personnel.some((p: AssignedPersonnel) => p.role === filters.role);
      });
    }

    if (filters?.userId) {
      filteredTasks = filteredTasks.filter(task => {
        const personnel = task.resource?.manpower?.manpower.assignedPersonnel || [];
        return personnel.some((p: AssignedPersonnel) => p.userId === filters.userId);
      });
    }

    if (filters?.skillLevel) {
      filteredTasks = filteredTasks.filter(task => {
        const personnel = task.resource?.manpower?.manpower.assignedPersonnel || [];
        return personnel.some((p: AssignedPersonnel) => p.skillLevel === filters.skillLevel);
      });
    }

    // 構建角色統計
    const roleStats = Array.from(roleMap.entries()).map(([role, data]) => ({
      role,
      count: data.count,
      totalHours: data.totalHours,
      averageProductivity:
        data.productivities.length > 0 ? data.productivities.reduce((sum, p) => sum + p, 0) / data.productivities.length : 0
    }));

    // 構建用戶統計
    const userStats = Array.from(userMap.entries()).map(([userId, data]) => ({
      userId,
      name: data.name,
      role: data.role,
      taskCount: data.taskCount,
      totalHours: data.totalHours,
      averageProductivity:
        data.productivities.length > 0 ? data.productivities.reduce((sum, p) => sum + p, 0) / data.productivities.length : 0
    }));

    const statistics = {
      totalTasks: filteredTasks.length,
      roleStats,
      userStats
    };

    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tasks: filteredTasks.map(({ resource: _resource, ...task }) => task),
      filters: filters || {},
      statistics
    };
  }

  /**
   * 生成角色視覺化數據
   *
   * @param blueprintId 藍圖 ID
   * @param options 選項
   * @returns 視覺化數據
   */
  async getVisualizationData(
    blueprintId: string,
    options?: {
      layoutType?: 'role-based' | 'user-based';
    }
  ): Promise<RoleVisualizationData> {
    // 獲取任務列表
    const tasks = await this.taskRepository.getTasksByBlueprint(blueprintId);

    // 並行獲取所有任務的資源資訊
    const tasksWithResources = await Promise.all(
      tasks.map(async task => {
        const resource = await this.resourceService.getTaskResource(task.id);
        return { ...task, resource };
      })
    );

    // 收集角色和用戶資訊
    const roleMap = new Map<
      string,
      {
        taskIds: string[];
        totalHours: number;
        utilization: number;
      }
    >();

    const userMap = new Map<
      string,
      {
        name: string;
        role: string;
        taskIds: string[];
        totalHours: number;
        utilization: number;
      }
    >();

    tasksWithResources.forEach(task => {
      const personnel = task.resource?.manpower?.manpower.assignedPersonnel || [];

      personnel.forEach((person: AssignedPersonnel) => {
        // 角色統計
        const roleKey = person.role || 'unknown';
        const roleData = roleMap.get(roleKey) || {
          taskIds: [],
          totalHours: 0,
          utilization: 0
        };
        if (!roleData.taskIds.includes(task.id)) {
          roleData.taskIds.push(task.id);
        }
        roleData.totalHours += person.assignedHours || 0;
        roleMap.set(roleKey, roleData);

        // 用戶統計
        const userKey = person.userId;
        if (userKey) {
          const userData = userMap.get(userKey) || {
            name: person.name || 'Unknown',
            role: person.role || 'unknown',
            taskIds: [],
            totalHours: 0,
            utilization: 0
          };
          if (!userData.taskIds.includes(task.id)) {
            userData.taskIds.push(task.id);
          }
          userData.totalHours += person.assignedHours || 0;
          userMap.set(userKey, userData);
        }
      });
    });

    // 計算使用率（假設標準工作時間為 8 小時/天，一個月 22 天 = 176 小時）
    const standardHoursPerMonth = 176;

    roleMap.forEach(data => {
      data.utilization = (data.totalHours / standardHoursPerMonth) * 100;
    });

    userMap.forEach(data => {
      data.utilization = (data.totalHours / standardHoursPerMonth) * 100;
    });

    // 構建節點
    const nodes: RoleVisualizationData['nodes'] = [];
    const layoutType = options?.layoutType || 'role-based';

    if (layoutType === 'role-based') {
      // 按角色分組
      let currentX = 100;
      let currentY = 50;
      const rowSpacing = 100;
      const columnSpacing = 200;

      roleMap.forEach((data, role) => {
        nodes.push({
          id: `role-${role}`,
          name: role,
          role,
          taskCount: data.taskIds.length,
          totalHours: data.totalHours,
          utilization: data.utilization,
          x: currentX,
          y: currentY
        });

        currentY += rowSpacing;

        if (currentY > 600) {
          currentY = 50;
          currentX += columnSpacing;
        }
      });
    } else {
      // 按用戶分組
      let currentX = 100;
      let currentY = 50;
      const rowSpacing = 100;
      const columnSpacing = 200;

      userMap.forEach((data, userId) => {
        nodes.push({
          id: `user-${userId}`,
          name: data.name,
          role: data.role,
          taskCount: data.taskIds.length,
          totalHours: data.totalHours,
          utilization: data.utilization,
          x: currentX,
          y: currentY
        });

        currentY += rowSpacing;

        if (currentY > 600) {
          currentY = 50;
          currentX += columnSpacing;
        }
      });
    }

    // 構建邊（任務分配）
    const edges: RoleVisualizationData['edges'] = [];

    tasksWithResources.forEach(task => {
      const personnel = task.resource?.manpower?.manpower.assignedPersonnel || [];

      personnel.forEach((person: AssignedPersonnel) => {
        if (layoutType === 'role-based') {
          edges.push({
            from: `role-${person.role || 'unknown'}`,
            to: task.id,
            type: 'assigned',
            hours: person.assignedHours || 0
          });
        } else {
          if (person.userId) {
            edges.push({
              from: `user-${person.userId}`,
              to: task.id,
              type: 'assigned',
              hours: person.assignedHours || 0
            });
          }
        }
      });
    });

    // 計算佈局
    const maxX = Math.max(...nodes.map(n => n.x), 100) + 200;
    const maxY = Math.max(...nodes.map(n => n.y), 100) + 100;

    return {
      nodes,
      edges,
      layout: {
        width: maxX,
        height: maxY,
        layoutType
      }
    };
  }
}
