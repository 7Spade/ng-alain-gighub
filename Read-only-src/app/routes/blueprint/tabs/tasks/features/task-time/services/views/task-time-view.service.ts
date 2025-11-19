/**
 * Task Time View Service
 *
 * 任務時間視角服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：B. 時間維度
 *
 * 職責：
 * - 提供甘特圖視角的數據組織
 * - 處理時間軸的縮放與定位
 * - 管理時間相關的篩選（日期範圍、延遲狀態等）
 * - 提供時間衝突檢測與視覺化
 *
 * @see @ETMS_DESIGN_SPEC.md B. 時間維度
 */

import { Injectable, inject } from '@angular/core';
import type { Task } from '@models';
import { TaskRepository } from '@tasks/features/task-detail/services/repository/task.repository';

/**
 * 時間視角數據
 */
export interface TimeViewData {
  /** 任務列表 */
  tasks: Task[];

  /** 篩選條件 */
  filters: {
    /** 開始日期範圍 */
    startDateRange?: { from: Date; to: Date };
    /** 結束日期範圍 */
    endDateRange?: { from: Date; to: Date };
    /** 延遲狀態 */
    delayStatus?: 'on-time' | 'delayed' | 'early';
    /** 關鍵路徑 */
    isCriticalPath?: boolean;
  };

  /** 統計資訊 */
  statistics: {
    /** 總任務數 */
    totalTasks: number;
    /** 延遲任務數 */
    delayedTasks: number;
    /** 提前完成任務數 */
    earlyTasks: number;
    /** 關鍵路徑任務數 */
    criticalPathTasks: number;
  };
}

/**
 * 時間視覺化數據（甘特圖）
 */
export interface TimeVisualizationData {
  /** 甘特圖節點 */
  nodes: Array<{
    id: string;
    code: string;
    name: string;
    startDate: Date;
    endDate: Date;
    duration: number;
    progress: number;
    isCritical: boolean;
    isDelayed: boolean;
    level: number; // 階層深度
  }>;

  /** 依賴關係邊 */
  edges: Array<{
    from: string;
    to: string;
    type: string;
    lag: number;
  }>;

  /** 佈局資訊 */
  layout: {
    /** 時間軸開始日期 */
    startDate: Date;
    /** 時間軸結束日期 */
    endDate: Date;
    /** 時間軸寬度（像素） */
    width: number;
    /** 行高（像素） */
    rowHeight: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TaskTimeViewService {
  private readonly taskRepository = inject(TaskRepository);

  /**
   * 獲取時間視角數據
   *
   * @param blueprintId 藍圖 ID
   * @param filters 篩選條件
   * @returns 時間視角數據
   */
  async getViewData(
    blueprintId: string,
    filters?: {
      taskIds?: string[];
      startDateRange?: { from: Date; to: Date };
      endDateRange?: { from: Date; to: Date };
      delayStatus?: 'on-time' | 'delayed' | 'early';
      isCriticalPath?: boolean;
    }
  ): Promise<TimeViewData> {
    const repositoryFilters = filters?.taskIds?.length ? { taskIds: filters.taskIds } : undefined;

    // 獲取任務列表
    const tasks = await this.taskRepository.getTasksByBlueprint(blueprintId, repositoryFilters);

    // 過濾任務
    let filteredTasks = tasks;

    if (filters?.startDateRange) {
      filteredTasks = filteredTasks.filter(task => {
        if (!task.time?.planned?.plannedStartDate) return false;
        const startDate = task.time.planned.plannedStartDate;
        return startDate >= filters.startDateRange!.from && startDate <= filters.startDateRange!.to;
      });
    }

    if (filters?.endDateRange) {
      filteredTasks = filteredTasks.filter(task => {
        if (!task.time?.planned?.plannedEndDate) return false;
        const endDate = task.time.planned.plannedEndDate;
        return endDate >= filters.endDateRange!.from && endDate <= filters.endDateRange!.to;
      });
    }

    if (filters?.delayStatus) {
      filteredTasks = filteredTasks.filter(task => {
        const actual = task.time?.actual;
        if (!actual || actual.delayDays === 0) {
          return filters.delayStatus === 'on-time';
        }
        if (actual.delayDays > 0) {
          return filters.delayStatus === 'delayed';
        }
        return filters.delayStatus === 'early';
      });
    }

    if (filters?.isCriticalPath !== undefined) {
      filteredTasks = filteredTasks.filter(task => {
        const isCritical = task.time?.flexibility?.isCriticalPath ?? false;
        return isCritical === filters.isCriticalPath;
      });
    }

    // 計算統計資訊
    const statistics = {
      totalTasks: filteredTasks.length,
      delayedTasks: filteredTasks.filter(t => (t.time?.actual?.delayDays ?? 0) > 0).length,
      earlyTasks: filteredTasks.filter(t => (t.time?.actual?.delayDays ?? 0) < 0).length,
      criticalPathTasks: filteredTasks.filter(t => t.time?.flexibility?.isCriticalPath ?? false).length
    };

    return {
      tasks: filteredTasks,
      filters: filters || {},
      statistics
    };
  }

  /**
   * 生成時間視覺化數據（甘特圖）
   *
   * @param blueprintId 藍圖 ID
   * @param options 選項
   * @returns 視覺化數據
   */
  async getVisualizationData(
    blueprintId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      rowHeight?: number;
    }
  ): Promise<TimeVisualizationData> {
    // 獲取任務列表
    const tasks = await this.taskRepository.getTasksByBlueprint(blueprintId);

    // 計算時間範圍
    let minDate = options?.startDate;
    let maxDate = options?.endDate;

    if (!minDate || !maxDate) {
      const dates = tasks
        .map(t => [
          t.time?.planned?.plannedStartDate,
          t.time?.planned?.plannedEndDate,
          t.time?.actual?.actualStartDate,
          t.time?.actual?.actualEndDate
        ])
        .flat()
        .filter((d): d is Date => d instanceof Date);

      if (dates.length > 0) {
        minDate = minDate || new Date(Math.min(...dates.map(d => d.getTime())));
        maxDate = maxDate || new Date(Math.max(...dates.map(d => d.getTime())));
      } else {
        minDate = minDate || new Date();
        maxDate = maxDate || new Date();
      }
    }

    // 構建節點
    const nodes = tasks.map(task => {
      const planned = task.time?.planned;
      const actual = task.time?.actual;
      const flexibility = task.time?.flexibility;

      const startDate = actual?.actualStartDate || planned?.plannedStartDate || new Date();
      const endDate = actual?.actualEndDate || planned?.plannedEndDate || new Date();
      const duration = planned?.plannedDuration || 0;

      // 計算進度（如果有實際進度）
      const progress = actual?.actualDuration && duration > 0 ? Math.min(100, (actual.actualDuration / duration) * 100) : 0;

      const isCritical = flexibility?.isCriticalPath ?? false;
      const isDelayed = (actual?.delayDays ?? 0) > 0;

      // 計算階層深度（根據 parentId）
      let level = 0;
      let currentTask = task;
      while (currentTask.parentId) {
        level++;
        const parent = tasks.find(t => t.id === currentTask.parentId);
        if (!parent) break;
        currentTask = parent;
      }

      return {
        id: task.id,
        code: task.code,
        name: task.name,
        startDate,
        endDate,
        duration,
        progress,
        isCritical,
        isDelayed,
        level
      };
    });

    // 構建邊（依賴關係）
    const edges: Array<{ from: string; to: string; type: string; lag: number }> = [];

    for (const task of tasks) {
      if (task.dependency?.predecessors) {
        for (const pred of task.dependency.predecessors.predecessors) {
          edges.push({
            from: pred.taskId,
            to: task.id,
            type: pred.type,
            lag: pred.lag || 0
          });
        }
      }
    }

    // 計算佈局
    const rowHeight = options?.rowHeight || 40;
    const daysDiff = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const width = Math.max(800, daysDiff * 10); // 每 10 像素代表一天

    return {
      nodes,
      edges,
      layout: {
        startDate: minDate,
        endDate: maxDate,
        width,
        rowHeight
      }
    };
  }
}
