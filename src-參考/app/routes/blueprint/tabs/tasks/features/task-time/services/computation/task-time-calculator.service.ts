/**
 * Task Time Calculator Service
 *
 * 任務時間計算服務（CPM - Critical Path Method）
 * 對應 @ETMS_DESIGN_SPEC.md 文件：B. 時間維度、關鍵計算邏輯
 *
 * 職責：
 * - 計算關鍵路徑（CPM 演算法）
 * - 計算最早/最晚開始/完成時間（ES, LS, EF, LF）
 * - 計算總浮時與自由浮時
 * - 計算拖延係數與緩衝天數
 *
 * @see @ETMS_DESIGN_SPEC.md B. 時間維度、關鍵計算邏輯
 */

import { Injectable, inject } from '@angular/core';
import { DependencyType } from '@models';
import type { TimeFlexibility, TimeConstraint } from '@models';
import { TaskDependencyService } from '@tasks/features/task-dependency/services/domain/task-dependency.service';
import { TaskTimeRepository, TaskDependencyDbRecord, TaskRiskSummaryRecord } from '@tasks/shared/repository/task-time.repository';
// Break circular dependency: Calculator should not depend on TaskTimeService

/**
 * 任務基本資訊（用於 CPM 計算）
 */
interface TaskBasicInfo {
  id: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  plannedDuration: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskTimeCalculatorService {
  private readonly dependencyService = inject(TaskDependencyService);
  private readonly repository = inject(TaskTimeRepository);

  // 緩存 CPM 計算結果，避免重複計算
  private readonly cpmCache = new Map<string, { result: TimeFlexibility; timestamp: number }>();
  private readonly CACHE_TTL = 60000; // 60 秒

  /**
   * 計算任務的 CPM 結果
   *
   * @param taskId 任務 ID
   * @returns 時間彈性資訊
   */
  async calculateCPM(taskId: string): Promise<TimeFlexibility> {
    // 檢查緩存
    const cached = this.cpmCache.get(taskId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }

    const ES = await this.calculateEarliestStart(taskId);
    const LS = await this.calculateLatestStart(taskId);
    const EF = await this.calculateEarliestFinish(taskId);
    const LF = await this.calculateLatestFinish(taskId);
    const totalFloat = await this.calculateTotalFloat(taskId);
    const freeFloat = await this.calculateFreeFloat(taskId);
    const isCriticalPath = totalFloat === 0;
    const criticalityIndex = isCriticalPath ? 1.0 : Math.max(0, 1 - totalFloat / 30); // 假設 30 天為最大浮時

    // 獲取時間約束
    const constraint = await this.getTimeConstraint(taskId);

    const result: TimeFlexibility = {
      earliestStart: ES,
      latestStart: LS,
      earliestFinish: EF,
      latestFinish: LF,
      totalFloat,
      freeFloat,
      isCriticalPath,
      criticalityIndex,
      bufferDays: await this.calculateBufferDays(taskId),
      dragCoefficient: await this.calculateDragCoefficient(taskId),
      constraint
    };

    // 更新緩存
    this.cpmCache.set(taskId, { result, timestamp: Date.now() });

    // 更新數據庫中的 CPM 結果
    await this.updateCPMResults(taskId, result);

    return result;
  }

  /**
   * 計算任務的最早開始時間（ES）- 正向遍歷
   *
   * @param taskId 任務 ID
   * @returns 最早開始時間
   */
  async calculateEarliestStart(taskId: string): Promise<Date> {
    const taskInfo = await this.getTaskBasicInfo(taskId);
    if (!taskInfo) {
      throw new Error(`Task ${taskId} not found`);
    }

    const predecessors = await this.getPredecessors(taskId);
    if (predecessors.length === 0) {
      // 沒有前置任務，ES = 專案開始日期或任務的 plannedStartDate
      return taskInfo.plannedStartDate;
    }

    let maxES = new Date(0);

    for (const pred of predecessors) {
      const predES = await this.calculateEarliestStart(pred.depends_on_task_id);
      const predEF = await this.calculateEarliestFinish(pred.depends_on_task_id);
      const lagDays = pred.lag_days || 0;

      let candidateES: Date;

      switch (pred.dependency_type) {
        case DependencyType.FS: // Finish-to-Start: ES = max(predecessor.earliestFinish + lag)
          candidateES = this.addWorkingDays(predEF, lagDays);
          break;
        case DependencyType.SS: // Start-to-Start: ES = max(predecessor.earliestStart + lag)
          candidateES = this.addWorkingDays(predES, lagDays);
          break;
        case DependencyType.FF: {
          // Finish-to-Finish: ES = max(predecessor.earliestFinish - taskDuration + lag)
          const predTaskInfo = await this.getTaskBasicInfo(pred.depends_on_task_id);
          if (predTaskInfo) {
            const taskDuration = taskInfo.plannedDuration;
            candidateES = this.subtractWorkingDays(predEF, taskDuration - lagDays);
          } else {
            candidateES = this.addWorkingDays(predEF, lagDays);
          }
          break;
        }
        case DependencyType.SF: {
          // Start-to-Finish: ES = max(predecessor.earliestStart - taskDuration + lag)
          const predTaskInfoSF = await this.getTaskBasicInfo(pred.depends_on_task_id);
          if (predTaskInfoSF) {
            const taskDurationSF = taskInfo.plannedDuration;
            candidateES = this.subtractWorkingDays(predES, taskDurationSF - lagDays);
          } else {
            candidateES = this.addWorkingDays(predES, lagDays);
          }
          break;
        }
        default:
          candidateES = this.addWorkingDays(predEF, lagDays);
      }

      if (candidateES > maxES) {
        maxES = candidateES;
      }
    }

    // 確保 ES 不早於任務的 plannedStartDate
    return maxES > taskInfo.plannedStartDate ? maxES : taskInfo.plannedStartDate;
  }

  /**
   * 計算任務的最早完成時間（EF）
   *
   * @param taskId 任務 ID
   * @returns 最早完成時間
   */
  async calculateEarliestFinish(taskId: string): Promise<Date> {
    const ES = await this.calculateEarliestStart(taskId);
    const taskInfo = await this.getTaskBasicInfo(taskId);
    if (!taskInfo) {
      throw new Error(`Task ${taskId} not found`);
    }

    return this.addWorkingDays(ES, taskInfo.plannedDuration);
  }

  /**
   * 計算任務的最晚完成時間（LF）- 反向遍歷
   *
   * @param taskId 任務 ID
   * @returns 最晚完成時間
   */
  async calculateLatestFinish(taskId: string): Promise<Date> {
    const taskInfo = await this.getTaskBasicInfo(taskId);
    if (!taskInfo) {
      throw new Error(`Task ${taskId} not found`);
    }

    const successors = await this.getSuccessors(taskId);
    if (successors.length === 0) {
      // 沒有後續任務，LF = 專案結束日期或任務的 plannedEndDate
      return taskInfo.plannedEndDate;
    }

    let minLF = new Date(Number.MAX_SAFE_INTEGER);

    for (const succ of successors) {
      const succLS = await this.calculateLatestStart(succ.task_id);
      const succLF = await this.calculateLatestFinish(succ.task_id);
      const lagDays = succ.lag_days || 0;

      let candidateLF: Date;

      switch (succ.dependency_type) {
        case DependencyType.FS: // Finish-to-Start: LF = min(successor.latestStart - lag)
          candidateLF = this.subtractWorkingDays(succLS, lagDays);
          break;
        case DependencyType.SS: {
          // Start-to-Start: LF = min(successor.latestStart + taskDuration - lag)
          const succTaskInfo = await this.getTaskBasicInfo(succ.task_id);
          if (succTaskInfo) {
            const taskDuration = taskInfo.plannedDuration;
            candidateLF = this.addWorkingDays(succLS, taskDuration - lagDays);
          } else {
            candidateLF = this.subtractWorkingDays(succLS, lagDays);
          }
          break;
        }
        case DependencyType.FF: // Finish-to-Finish: LF = min(successor.latestFinish - lag)
          candidateLF = this.subtractWorkingDays(succLF, lagDays);
          break;
        case DependencyType.SF: // Start-to-Finish: LF = min(successor.latestStart - lag)
          candidateLF = this.subtractWorkingDays(succLS, lagDays);
          break;
        default:
          candidateLF = this.subtractWorkingDays(succLS, lagDays);
      }

      if (candidateLF < minLF) {
        minLF = candidateLF;
      }
    }

    // 確保 LF 不晚於任務的 plannedEndDate
    return minLF < taskInfo.plannedEndDate ? minLF : taskInfo.plannedEndDate;
  }

  /**
   * 計算任務的最晚開始時間（LS）
   *
   * @param taskId 任務 ID
   * @returns 最晚開始時間
   */
  async calculateLatestStart(taskId: string): Promise<Date> {
    const LF = await this.calculateLatestFinish(taskId);
    const taskInfo = await this.getTaskBasicInfo(taskId);
    if (!taskInfo) {
      throw new Error(`Task ${taskId} not found`);
    }

    return this.subtractWorkingDays(LF, taskInfo.plannedDuration);
  }

  /**
   * 計算總浮時（Total Float）
   * Total Float = LS - ES
   *
   * @param taskId 任務 ID
   * @returns 總浮時（天數）
   */
  async calculateTotalFloat(taskId: string): Promise<number> {
    const ES = await this.calculateEarliestStart(taskId);
    const LS = await this.calculateLatestStart(taskId);
    return this.calculateWorkingDays(ES, LS);
  }

  /**
   * 計算自由浮時（Free Float）
   * Free Float = min(所有後續任務的 ES) - EF
   *
   * @param taskId 任務 ID
   * @returns 自由浮時（天數）
   */
  async calculateFreeFloat(taskId: string): Promise<number> {
    const EF = await this.calculateEarliestFinish(taskId);
    const successors = await this.getSuccessors(taskId);

    if (successors.length === 0) {
      return 0;
    }

    let minSuccessorES = new Date(Number.MAX_SAFE_INTEGER);

    for (const succ of successors) {
      const succES = await this.calculateEarliestStart(succ.task_id);
      if (succES < minSuccessorES) {
        minSuccessorES = succES;
      }
    }

    return this.calculateWorkingDays(EF, minSuccessorES);
  }

  /**
   * 更新整個藍圖的關鍵路徑標記
   *
   * @param blueprintId 藍圖 ID
   */
  async updateCriticalPath(blueprintId: string): Promise<void> {
    const taskIds = await this.repository.listTaskIdsByBlueprint(blueprintId);

    if (!taskIds.length) {
      return;
    }

    // 對每個任務計算 CPM
    const updates: Array<{ id: string; patch: Record<string, unknown> }> = [];

    for (const taskId of taskIds) {
      const cpm = await this.calculateCPM(taskId);
      updates.push({
        id: taskId,
        patch: { is_critical_path: cpm.isCriticalPath }
      });
    }

    await this.repository.updateMultipleTasks(updates);
  }

  /**
   * 獲取任務基本資訊
   */
  private async getTaskBasicInfo(taskId: string): Promise<TaskBasicInfo | null> {
    const data = await this.repository.fetchTask(taskId, ['planned_start_date', 'planned_end_date', 'planned_duration']);

    if (!data) {
      return null;
    }

    return {
      id: taskId,
      plannedStartDate: data.planned_start_date ? new Date(data.planned_start_date) : new Date(),
      plannedEndDate: data.planned_end_date ? new Date(data.planned_end_date) : new Date(),
      plannedDuration: data.planned_duration || 0
    };
  }

  /**
   * 獲取前置任務
   */
  private async getPredecessors(taskId: string): Promise<TaskDependencyDbRecord[]> {
    return this.repository.listDependenciesByTask(taskId);
  }

  /**
   * 獲取後續任務
   */
  private async getSuccessors(taskId: string): Promise<TaskDependencyDbRecord[]> {
    return this.repository.listDependenciesByDependsOn(taskId);
  }

  /**
   * 獲取時間約束
   */
  private async getTimeConstraint(taskId: string): Promise<TimeConstraint | null> {
    const data = await this.repository.fetchTask(taskId, ['time_constraint_type', 'time_constraint_date']);

    if (!data || !data.time_constraint_type) {
      return null;
    }

    return {
      type: data.time_constraint_type as any,
      date: data.time_constraint_date ? new Date(data.time_constraint_date) : undefined
    };
  }

  /**
   * 更新數據庫中的 CPM 結果
   */
  private async updateCPMResults(taskId: string, flexibility: TimeFlexibility): Promise<void> {
    try {
      await this.repository.updateTaskFlags(taskId, {
        earliest_start: flexibility.earliestStart.toISOString(),
        latest_start: flexibility.latestStart.toISOString(),
        earliest_finish: flexibility.earliestFinish.toISOString(),
        latest_finish: flexibility.latestFinish.toISOString(),
        total_float: flexibility.totalFloat,
        free_float: flexibility.freeFloat,
        is_critical_path: flexibility.isCriticalPath,
        criticality_index: flexibility.criticalityIndex,
        buffer_days: flexibility.bufferDays,
        drag_coefficient: flexibility.dragCoefficient
      });
    } catch (error) {
      console.warn(`Failed to update CPM results: ${(error as Error).message}`);
    }
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

  /**
   * 添加工作日數（排除週末）
   */
  private addWorkingDays(date: Date, days: number): Date {
    const result = new Date(date);
    let remainingDays = days;

    while (remainingDays > 0) {
      result.setDate(result.getDate() + 1);
      const dayOfWeek = result.getDay();
      // 排除週末
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        remainingDays--;
      }
    }

    return result;
  }

  /**
   * 減去工作日數（排除週末）
   */
  private subtractWorkingDays(date: Date, days: number): Date {
    const result = new Date(date);
    let remainingDays = days;

    while (remainingDays > 0) {
      result.setDate(result.getDate() - 1);
      const dayOfWeek = result.getDay();
      // 排除週末
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        remainingDays--;
      }
    }

    return result;
  }

  /**
   * 計算緩衝天數（bufferDays）
   * 根據任務的風險等級和複雜度計算緩衝天數，用於風險緩衝
   *
   * @param taskId 任務 ID
   * @returns 緩衝天數
   */
  private async calculateBufferDays(taskId: string): Promise<number> {
    const taskInfo = await this.getTaskBasicInfo(taskId);
    if (!taskInfo) {
      return 0;
    }

    const risks: TaskRiskSummaryRecord[] = await this.repository.listRiskSummaries(taskId);

    // 基礎緩衝：計畫持續時間的 10%
    const baseBuffer = Math.ceil(taskInfo.plannedDuration * 0.1);

    // 如果沒有風險資訊，返回基礎緩衝
    if (!risks.length) {
      return baseBuffer;
    }

    // 找到最高風險等級和風險分數
    let maxRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let maxRiskScore = 0;

    for (const risk of risks) {
      const riskLevel = risk.risk_level as 'low' | 'medium' | 'high' | 'critical';
      const riskScore = risk.risk_score || 0;

      if (riskScore > maxRiskScore) {
        maxRiskScore = riskScore;
        maxRiskLevel = riskLevel;
      }
    }

    // 根據風險等級計算風險緩衝
    let riskBuffer = 0;
    switch (maxRiskLevel) {
      case 'low':
        riskBuffer = Math.ceil(taskInfo.plannedDuration * 0.05); // 5%
        break;
      case 'medium':
        riskBuffer = Math.ceil(taskInfo.plannedDuration * 0.1); // 10%
        break;
      case 'high':
        riskBuffer = Math.ceil(taskInfo.plannedDuration * 0.15); // 15%
        break;
      case 'critical':
        riskBuffer = Math.ceil(taskInfo.plannedDuration * 0.25); // 25%
        break;
    }

    // 總緩衝天數 = 基礎緩衝 + 風險緩衝
    return baseBuffer + riskBuffer;
  }

  /**
   * 計算拖延係數（dragCoefficient）
   * 表示此任務延遲一天會導致專案完成日延遲多少天
   *
   * @param taskId 任務 ID
   * @returns 拖延係數（0-1）
   */
  private async calculateDragCoefficient(taskId: string): Promise<number> {
    // 如果任務不在關鍵路徑上，dragCoefficient = 0
    const totalFloat = await this.calculateTotalFloat(taskId);
    if (totalFloat > 0) {
      return 0;
    }

    // 獲取任務的後續任務
    const successors = await this.dependencyService.getSuccessors(taskId);
    if (!successors || successors.successors.length === 0) {
      // 如果沒有後續任務，dragCoefficient = 0（終點任務的延遲影響已在專案完成日計算中）
      return 0;
    }

    // 檢查是否有其他關鍵路徑任務可以替代此任務的作用
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

    // 如果沒有替代方案，dragCoefficient = 1（完全影響專案完成日）
    if (!hasAlternative) {
      return 1.0;
    }

    // 如果有替代方案，dragCoefficient = 0.5-0.8（部分影響）
    // 根據替代方案的數量調整係數
    return 0.6;
  }

  /**
   * 清除緩存
   */
  clearCache(taskId?: string): void {
    if (taskId) {
      this.cpmCache.delete(taskId);
    } else {
      this.cpmCache.clear();
    }
  }
}
