/**
 * Task Critical Path Service
 *
 * 任務關鍵路徑計算服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：B.6 時間彈性、C.7 前置任務、關鍵計算邏輯
 *
 * 職責：
 * - 識別關鍵路徑上的任務
 * - 計算關鍵性指數（0-1）
 * - 分析任務延遲對專案完成日的影響
 * - 提供關鍵路徑優化建議
 *
 * @see @ETMS_DESIGN_SPEC.md B.6 時間彈性、C.7 前置任務、關鍵計算邏輯
 */

import { Injectable, inject } from '@angular/core';
import { DependencyType } from '@models';
import type { TimeFlexibility } from '@models';
import { TaskDependencyService } from '@tasks/features/task-dependency/services/domain/task-dependency.service';
import { TaskTimeRepository } from '@tasks/shared/repository/task-time.repository';

import { TaskTimeCalculatorService } from './task-time-calculator.service';
import { TaskTimeService } from '../domain/task-time.service';

/**
 * 關鍵路徑任務資訊
 */
interface CriticalPathTask {
  id: string;
  code: string;
  name: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  plannedDuration: number;
  flexibility: TimeFlexibility;
  dragCoefficient: number;
}

/**
 * 關鍵路徑
 */
export interface CriticalPath {
  /** 關鍵路徑任務陣列（按順序排列） */
  tasks: CriticalPathTask[];

  /** 關鍵路徑總持續時間（天數） */
  totalDuration: number;

  /** 關鍵路徑開始日期 */
  startDate: Date;

  /** 關鍵路徑結束日期 */
  endDate: Date;
}

/**
 * 關鍵路徑分析結果
 */
export interface CriticalPathAnalysis {
  /** 關鍵路徑任務總數 */
  totalTasks: number;

  /** 關鍵路徑總持續時間（天數） */
  totalDuration: number;

  /** 瓶頸任務陣列 */
  bottlenecks: CriticalPathTask[];

  /** 高風險任務陣列（criticalityIndex > 0.8） */
  riskTasks: CriticalPathTask[];

  /** 優化建議 */
  recommendations: string[];
}

/**
 * 視覺化節點
 */
export interface VisualizationNode {
  id: string;
  code: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  startDate: Date;
  endDate: Date;
  duration: number;
}

/**
 * 視覺化邊
 */
export interface VisualizationEdge {
  from: string;
  to: string;
  type: string;
  style: string;
  lag: number;
}

/**
 * 關鍵路徑視覺化數據
 */
export interface PathVisualization {
  /** 任務節點陣列 */
  nodes: VisualizationNode[];

  /** 依賴關係邊陣列 */
  edges: VisualizationEdge[];

  /** 佈局資訊 */
  layout: {
    width: number;
    height: number;
    startDate: Date;
    endDate: Date;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TaskCriticalPathService {
  private readonly calculator = inject(TaskTimeCalculatorService);
  private readonly dependencyService = inject(TaskDependencyService);
  private readonly timeService = inject(TaskTimeService);
  private readonly repository = inject(TaskTimeRepository);

  /**
   * 獲取整個藍圖的關鍵路徑
   *
   * @param blueprintId 藍圖 ID
   * @returns 關鍵路徑
   */
  async getCriticalPath(blueprintId: string): Promise<CriticalPath | null> {
    // 先更新關鍵路徑標記
    await this.calculator.updateCriticalPath(blueprintId);

    // 獲取所有關鍵路徑任務
    const criticalTasks = await this.getCriticalPathTasks(blueprintId);
    if (!criticalTasks || criticalTasks.length === 0) {
      return null;
    }

    // 構建關鍵路徑鏈
    const path = await this.buildPath(criticalTasks);

    if (path.length === 0) {
      return null;
    }

    // 計算總持續時間
    const totalDuration = this.calculateTotalDuration(path);

    return {
      tasks: path,
      totalDuration,
      startDate: path[0].plannedStartDate,
      endDate: path[path.length - 1].plannedEndDate
    };
  }

  /**
   * 獲取藍圖下所有關鍵路徑任務
   *
   * @param blueprintId 藍圖 ID
   * @returns 關鍵路徑任務陣列
   */
  async getCriticalPathTasks(blueprintId: string): Promise<CriticalPathTask[]> {
    // 查詢所有關鍵路徑任務
    const tasks = await this.repository.listTasksByBlueprint(
      blueprintId,
      [
        'id',
        'code',
        'title',
        'planned_start_date',
        'planned_end_date',
        'planned_duration',
        'is_critical_path',
        'earliest_start',
        'latest_start',
        'earliest_finish',
        'latest_finish',
        'total_float',
        'free_float',
        'criticality_index',
        'drag_coefficient'
      ],
      { onlyCritical: true }
    );

    if (!tasks.length) {
      return [];
    }

    const criticalTasks: CriticalPathTask[] = [];

    for (const task of tasks) {
      const taskId = task.id;
      if (!taskId) {
        continue;
      }

      const plannedTime = await this.timeService.getPlannedTime(taskId);
      if (!plannedTime) continue;

      const flexibility = await this.calculator.calculateCPM(taskId);
      if (!flexibility) continue;

      // 計算 dragCoefficient（如果尚未計算）
      let dragCoefficient = task.drag_coefficient || 0;
      if (dragCoefficient === 0) {
        dragCoefficient = await this.calculateDragCoefficient(taskId);
      }

      criticalTasks.push({
        id: taskId,
        code: task.code ?? '',
        name: task.title ?? '',
        plannedStartDate: plannedTime.plannedStartDate,
        plannedEndDate: plannedTime.plannedEndDate,
        plannedDuration: plannedTime.plannedDuration,
        flexibility,
        dragCoefficient
      });
    }

    return criticalTasks;
  }

  /**
   * 構建關鍵路徑鏈（使用拓撲排序）
   *
   * @param tasks 關鍵路徑任務陣列
   * @returns 排序後的關鍵路徑任務陣列
   */
  async buildPath(tasks: CriticalPathTask[]): Promise<CriticalPathTask[]> {
    if (tasks.length === 0) {
      return [];
    }

    // 構建任務圖（鄰接表）
    const taskMap = new Map<string, CriticalPathTask>();
    const inDegree = new Map<string, number>();
    const graph = new Map<string, string[]>();

    // 初始化
    for (const task of tasks) {
      taskMap.set(task.id, task);
      inDegree.set(task.id, 0);
      graph.set(task.id, []);
    }

    // 構建依賴關係圖
    for (const task of tasks) {
      const predecessors = await this.dependencyService.getPredecessors(task.id);
      if (predecessors && predecessors.predecessors.length > 0) {
        for (const pred of predecessors.predecessors) {
          // 只考慮關鍵路徑上的前置任務
          if (taskMap.has(pred.taskId)) {
            const currentDegree = inDegree.get(task.id) || 0;
            inDegree.set(task.id, currentDegree + 1);
            const predList = graph.get(pred.taskId) || [];
            predList.push(task.id);
            graph.set(pred.taskId, predList);
          }
        }
      }
    }

    // 拓撲排序
    const queue: string[] = [];
    const result: CriticalPathTask[] = [];

    // 找到所有入度為 0 的節點（沒有前置任務的任務）
    for (const [taskId, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(taskId);
      }
    }

    // 拓撲排序
    while (queue.length > 0) {
      // 按計畫開始時間排序，確保路徑順序正確
      queue.sort((a, b) => {
        const taskA = taskMap.get(a)!;
        const taskB = taskMap.get(b)!;
        return taskA.plannedStartDate.getTime() - taskB.plannedStartDate.getTime();
      });

      const current = queue.shift()!;
      const task = taskMap.get(current)!;
      result.push(task);

      // 處理後續任務
      const successors = graph.get(current) || [];
      for (const succ of successors) {
        const currentDegree = inDegree.get(succ) || 0;
        inDegree.set(succ, currentDegree - 1);
        if (currentDegree - 1 === 0) {
          queue.push(succ);
        }
      }
    }

    // 如果結果數量不等於任務數量，說明存在循環依賴（理論上不應該發生在關鍵路徑上）
    if (result.length !== tasks.length) {
      console.warn('Critical path contains cycles, using fallback sorting');
      // 使用備用排序：按計畫開始時間排序
      return tasks.sort((a, b) => a.plannedStartDate.getTime() - b.plannedStartDate.getTime());
    }

    return result;
  }

  /**
   * 計算關鍵路徑的總持續時間
   *
   * @param path 關鍵路徑任務陣列
   * @returns 總持續時間（天數）
   */
  calculateTotalDuration(path: CriticalPathTask[]): number {
    if (path.length === 0) {
      return 0;
    }

    // 計算從第一個任務開始到最後一個任務結束的總時間
    const startDate = path[0].plannedStartDate;
    const endDate = path[path.length - 1].plannedEndDate;

    // 計算工作日數（排除週末）
    return this.calculateWorkingDays(startDate, endDate);
  }

  /**
   * 分析關鍵路徑
   *
   * @param blueprintId 藍圖 ID
   * @returns 關鍵路徑分析結果
   */
  async analyzeCriticalPath(blueprintId: string): Promise<CriticalPathAnalysis> {
    const criticalPath = await this.getCriticalPath(blueprintId);
    if (!criticalPath) {
      return {
        totalTasks: 0,
        totalDuration: 0,
        bottlenecks: [],
        riskTasks: [],
        recommendations: []
      };
    }

    // 找出瓶頸任務
    const bottlenecks = await this.findBottlenecks(blueprintId);

    // 找出高風險任務（criticalityIndex > 0.8）
    const riskTasks = criticalPath.tasks.filter(task => task.flexibility.criticalityIndex > 0.8);

    // 生成優化建議
    const recommendations = await this.generateRecommendations(criticalPath, bottlenecks);

    return {
      totalTasks: criticalPath.tasks.length,
      totalDuration: criticalPath.totalDuration,
      bottlenecks,
      riskTasks,
      recommendations
    };
  }

  /**
   * 生成關鍵路徑視覺化數據
   *
   * @param blueprintId 藍圖 ID
   * @returns 視覺化數據
   */
  async getPathVisualization(blueprintId: string): Promise<PathVisualization | null> {
    const criticalPath = await this.getCriticalPath(blueprintId);
    if (!criticalPath || criticalPath.tasks.length === 0) {
      return null;
    }

    const nodes: VisualizationNode[] = [];
    const edges: VisualizationEdge[] = [];

    // 生成節點
    const nodeWidth = 120;
    const nodeHeight = 60;
    const horizontalSpacing = 200;

    let currentX = 50;
    let currentY = 50;

    for (let i = 0; i < criticalPath.tasks.length; i++) {
      const task = criticalPath.tasks[i];

      nodes.push({
        id: task.id,
        code: task.code,
        name: task.name,
        x: currentX,
        y: currentY,
        width: nodeWidth,
        height: nodeHeight,
        color: task.flexibility.isCriticalPath ? '#ff4d4f' : '#1890ff',
        startDate: task.plannedStartDate,
        endDate: task.plannedEndDate,
        duration: task.plannedDuration
      });

      // 生成邊（連接到下一個任務）
      if (i < criticalPath.tasks.length - 1) {
        const nextTask = criticalPath.tasks[i + 1];
        const predecessors = await this.dependencyService.getPredecessors(nextTask.id);

        if (predecessors && predecessors.predecessors.length > 0) {
          const pred = predecessors.predecessors.find(p => p.taskId === task.id);
          if (pred) {
            edges.push({
              from: task.id,
              to: nextTask.id,
              type: pred.type,
              style: pred.isViolated ? 'dashed' : 'solid',
              lag: pred.lag
            });
          }
        }
      }

      // 更新位置
      currentX += nodeWidth + horizontalSpacing;
    }

    return {
      nodes,
      edges,
      layout: {
        width: currentX + 50,
        height: 300,
        startDate: criticalPath.startDate,
        endDate: criticalPath.endDate
      }
    };
  }

  /**
   * 找出關鍵路徑上的瓶頸任務
   *
   * @param blueprintId 藍圖 ID
   * @param threshold 瓶頸閾值（預設 0.5）
   * @returns 瓶頸任務陣列
   */
  async findBottlenecks(blueprintId: string, threshold = 0.5): Promise<CriticalPathTask[]> {
    const criticalTasks = await this.getCriticalPathTasks(blueprintId);
    if (!criticalTasks || criticalTasks.length === 0) {
      return [];
    }

    const bottlenecks: CriticalPathTask[] = [];

    for (const task of criticalTasks) {
      // 計算或獲取 dragCoefficient
      let dragCoefficient = task.dragCoefficient;
      if (!dragCoefficient || dragCoefficient === 0) {
        dragCoefficient = await this.calculateDragCoefficient(task.id);
      }

      if (dragCoefficient > threshold) {
        bottlenecks.push({
          ...task,
          dragCoefficient
        });
      }
    }

    // 按 dragCoefficient 降序排序
    return bottlenecks.sort((a, b) => b.dragCoefficient - a.dragCoefficient);
  }

  /**
   * 計算任務的拖延係數（dragCoefficient）
   * dragCoefficient 表示此任務延遲一天會導致專案完成日延遲多少天
   *
   * @param taskId 任務 ID
   * @param blueprintId 藍圖 ID
   * @returns 拖延係數
   */
  private async calculateDragCoefficient(taskId: string): Promise<number> {
    // 獲取任務的後續任務
    const successors = await this.dependencyService.getSuccessors(taskId);
    if (!successors || successors.successors.length === 0) {
      // 如果沒有後續任務，dragCoefficient = 0
      return 0;
    }

    // 檢查是否有其他關鍵路徑任務可以替代此任務的作用
    // 如果有，dragCoefficient 較小；如果沒有，dragCoefficient = 1
    let hasAlternative = false;

    for (const succ of successors.successors) {
      // 檢查後續任務是否在關鍵路徑上
      const succTask = await this.repository.fetchTask(succ.taskId, ['is_critical_path']);

      if (succTask && succTask.is_critical_path) {
        // 檢查後續任務是否有其他關鍵路徑前置任務
        const succPredecessors = await this.dependencyService.getPredecessors(succ.taskId);
        if (succPredecessors && succPredecessors.predecessors.length > 1) {
          // 檢查是否有其他關鍵路徑前置任務
          let criticalPredecessorCount = 0;
          for (const pred of succPredecessors.predecessors) {
            const predTask = await this.repository.fetchTask(pred.taskId, ['is_critical_path']);

            if (predTask && predTask.is_critical_path) {
              criticalPredecessorCount++;
            }
          }

          if (criticalPredecessorCount > 1) {
            hasAlternative = true;
            break;
          }
        }
      }
    }

    // 如果沒有替代方案，dragCoefficient = 1；否則根據浮時計算
    if (!hasAlternative) {
      const flexibility = await this.calculator.calculateCPM(taskId);
      if (flexibility && flexibility.totalFloat === 0) {
        return 1.0;
      }
    }

    // 簡化計算：根據總浮時計算
    const flexibility = await this.calculator.calculateCPM(taskId);
    if (flexibility && flexibility.totalFloat === 0) {
      return 0.8; // 關鍵路徑任務，但可能有替代方案
    }

    return 0.0; // 非關鍵路徑任務
  }

  /**
   * 提供關鍵路徑優化建議
   *
   * @param criticalPath 關鍵路徑
   * @param bottlenecks 瓶頸任務
   * @returns 優化建議陣列
   */
  private async generateRecommendations(criticalPath: CriticalPath, bottlenecks: CriticalPathTask[]): Promise<string[]> {
    const recommendations: string[] = [];

    // 瓶頸任務優化建議
    if (bottlenecks.length > 0) {
      recommendations.push(
        `發現 ${bottlenecks.length} 個瓶頸任務，建議優先優化：${bottlenecks
          .slice(0, 3)
          .map(t => t.name)
          .join('、')}`
      );
      recommendations.push('建議：縮短瓶頸任務的持續時間，或增加資源投入');
    }

    // 高風險任務建議
    const riskTasks = criticalPath.tasks.filter(t => t.flexibility.criticalityIndex > 0.8);
    if (riskTasks.length > 0) {
      recommendations.push(`發現 ${riskTasks.length} 個高風險任務，建議加強監控和風險管理`);
    }

    // 依賴關係優化建議
    const fsDependencies = new Set<string>();
    for (const task of criticalPath.tasks) {
      const predecessors = await this.dependencyService.getPredecessors(task.id);
      if (predecessors && predecessors.predecessors.length > 0) {
        for (const pred of predecessors.predecessors) {
          if (pred.type === DependencyType.FS) {
            fsDependencies.add(`${pred.taskCode} -> ${task.code}`);
          }
        }
      }
    }

    if (fsDependencies.size > 0) {
      recommendations.push(`考慮將部分 FS 依賴改為 SS 依賴，以縮短關鍵路徑總時間`);
    }

    // 資源分配建議
    if (criticalPath.totalDuration > 30) {
      recommendations.push('關鍵路徑較長（超過 30 天），建議：重新分配非關鍵任務的資源到關鍵任務');
    }

    // 緩衝建議
    if (criticalPath.tasks.length > 10) {
      recommendations.push('關鍵路徑任務較多，建議：為關鍵路徑添加緩衝時間，以應對風險');
    }

    return recommendations;
  }

  /**
   * 計算工作日數（排除週末）
   */
  private calculateWorkingDays(start: Date, end: Date): number {
    let days = 0;
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      // 排除週末（0 = 週日, 6 = 週六）
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days++;
      }
      current.setDate(current.getDate() + 1);
    }

    return days;
  }
}
