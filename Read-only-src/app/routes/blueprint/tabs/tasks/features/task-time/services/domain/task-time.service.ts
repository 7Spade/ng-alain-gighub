/**
 * Task Time Service
 *
 * 任務時間維度管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：B. 時間維度
 *
 * 職責：
 * - 管理計畫時間（plannedStartDate, plannedEndDate, baseline）
 * - 管理實際時間（actualStartDate, actualEndDate, 延遲分析）
 * - 計算時間彈性（浮時、關鍵路徑、時間約束）
 * - 處理工作日曆與工時計算邏輯
 *
 * @see @ETMS_DESIGN_SPEC.md B. 時間維度
 */

import { Injectable, inject } from '@angular/core';
import type { PlannedTime, ActualTime, TimeFlexibility, PausedPeriod, TimeAdjustment, TaskTime } from '@models';
import { TaskTimeRepository, TaskTimeDbRecord } from '@tasks/shared/repository/task-time.repository';

/**
 * 數據庫任務時間格式（snake_case）
 */
@Injectable({
  providedIn: 'root'
})
export class TaskTimeService {
  private readonly repository = inject(TaskTimeRepository);

  /**
   * 更新任務的計畫時間
   *
   * @param taskId 任務 ID
   * @param plannedTime 計畫時間數據
   * @returns 更新後的計畫時間
   */
  async updatePlannedTime(taskId: string, plannedTime: Partial<PlannedTime>): Promise<PlannedTime> {
    const dbUpdates: Partial<TaskTimeDbRecord> = {};

    // 更新獨立欄位
    if (plannedTime.plannedStartDate !== undefined) {
      dbUpdates.planned_start_date = plannedTime.plannedStartDate.toISOString();
    }
    if (plannedTime.plannedEndDate !== undefined) {
      dbUpdates.planned_end_date = plannedTime.plannedEndDate.toISOString();
    }
    if (plannedTime.plannedDuration !== undefined) {
      dbUpdates.planned_duration = plannedTime.plannedDuration;
    }
    if (plannedTime.plannedWorkHours !== undefined) {
      dbUpdates.planned_work_hours = plannedTime.plannedWorkHours;
    }
    if (plannedTime.workCalendarId !== undefined) {
      dbUpdates.work_calendar_id = plannedTime.workCalendarId || null;
    }
    if (plannedTime.workingDaysPerWeek !== undefined) {
      dbUpdates.working_days_per_week = plannedTime.workingDaysPerWeek || null;
    }
    if (plannedTime.workingHoursPerDay !== undefined) {
      dbUpdates.working_hours_per_day = plannedTime.workingHoursPerDay || null;
    }
    if (plannedTime.baselineStart !== undefined) {
      dbUpdates.baseline_start = plannedTime.baselineStart?.toISOString() || null;
    }
    if (plannedTime.baselineEnd !== undefined) {
      dbUpdates.baseline_end = plannedTime.baselineEnd?.toISOString() || null;
    }
    if (plannedTime.baselineDuration !== undefined) {
      dbUpdates.baseline_duration = plannedTime.baselineDuration || null;
    }
    if (plannedTime.baselineVersion !== undefined) {
      dbUpdates.baseline_version = plannedTime.baselineVersion || null;
    }
    if (plannedTime.baselineDate !== undefined) {
      dbUpdates.baseline_date = plannedTime.baselineDate?.toISOString() || null;
    }
    if (plannedTime.targetStartDate !== undefined) {
      dbUpdates.target_start_date = plannedTime.targetStartDate?.toISOString() || null;
    }
    if (plannedTime.targetEndDate !== undefined) {
      dbUpdates.target_end_date = plannedTime.targetEndDate?.toISOString() || null;
    }
    if (plannedTime.contractStartDate !== undefined) {
      dbUpdates.contract_start_date = plannedTime.contractStartDate?.toISOString() || null;
    }
    if (plannedTime.contractEndDate !== undefined) {
      dbUpdates.contract_end_date = plannedTime.contractEndDate?.toISOString() || null;
    }

    // 更新 JSONB 欄位中的詳細資訊
    const currentTask = await this.repository.fetchTask(taskId, ['time_data']);
    const timeData = (currentTask?.time_data as any) || {};
    const plannedData = timeData.planned || {};

    // 更新 JSONB 中的 planned 數據
    if (plannedTime.contractMilestones !== undefined) {
      plannedData.contractMilestones = plannedTime.contractMilestones.map(d => d.toISOString());
    }

    // 合併 JSONB 數據
    dbUpdates.time_data = {
      ...timeData,
      planned: plannedData
    };

    // 更新數據庫
    const updated = await this.repository.updateTask(taskId, dbUpdates);

    return this.convertPlannedTimeFromDb(updated);
  }

  /**
   * 更新任務的實際時間
   *
   * @param taskId 任務 ID
   * @param actualTime 實際時間數據
   * @returns 更新後的實際時間
   */
  async updateActualTime(taskId: string, actualTime: Partial<ActualTime>): Promise<ActualTime> {
    const dbUpdates: Partial<TaskTimeDbRecord> = {};

    // 更新獨立欄位
    if (actualTime.actualStartDate !== undefined) {
      dbUpdates.actual_start_date = actualTime.actualStartDate?.toISOString() || null;
    }
    if (actualTime.actualEndDate !== undefined) {
      dbUpdates.actual_end_date = actualTime.actualEndDate?.toISOString() || null;
    }
    if (actualTime.actualDuration !== undefined) {
      dbUpdates.actual_duration = actualTime.actualDuration;
    }
    if (actualTime.actualWorkHours !== undefined) {
      dbUpdates.actual_work_hours = actualTime.actualWorkHours;
    }
    if (actualTime.delayDays !== undefined) {
      dbUpdates.delay_days = actualTime.delayDays;
    }
    if (actualTime.delayReason !== undefined) {
      dbUpdates.delay_reason = actualTime.delayReason || null;
    }
    if (actualTime.delayCategory !== undefined) {
      dbUpdates.delay_category = actualTime.delayCategory || null;
    }
    if (actualTime.delayResponsibility !== undefined) {
      dbUpdates.delay_responsibility = actualTime.delayResponsibility || null;
    }
    if (actualTime.delayImpact !== undefined) {
      dbUpdates.delay_impact = actualTime.delayImpact || null;
    }

    // 更新 JSONB 欄位中的詳細資訊
    const currentTask = await this.repository.fetchTask(taskId, ['time_data']);
    const timeData = (currentTask?.time_data as any) || {};
    const actualData = timeData.actual || {};

    // 更新 JSONB 中的 actual 數據
    if (actualTime.pausedPeriods !== undefined) {
      actualData.pausedPeriods = actualTime.pausedPeriods.map(p => ({
        from: p.from.toISOString(),
        to: p.to.toISOString(),
        reason: p.reason,
        approvedBy: p.approvedBy
      }));
      // 重新計算 totalPausedDays
      actualData.totalPausedDays = this.calculateTotalPausedDays(actualTime.pausedPeriods);
    }
    if (actualTime.totalPausedDays !== undefined) {
      actualData.totalPausedDays = actualTime.totalPausedDays;
    }
    if (actualTime.timeAdjustments !== undefined) {
      actualData.timeAdjustments = actualTime.timeAdjustments.map(t => ({
        date: t.date.toISOString(),
        oldStart: t.oldStart.toISOString(),
        newStart: t.newStart.toISOString(),
        oldEnd: t.oldEnd.toISOString(),
        newEnd: t.newEnd.toISOString(),
        reason: t.reason,
        approvedBy: t.approvedBy
      }));
    }

    // 合併 JSONB 數據
    dbUpdates.time_data = {
      ...timeData,
      actual: actualData
    };

    // 更新數據庫
    const updated = await this.repository.updateTask(taskId, dbUpdates);

    return this.convertActualTimeFromDb(updated);
  }

  /**
   * 記錄任務暫停期間
   *
   * @param taskId 任務 ID
   * @param pausedPeriod 暫停期間
   * @returns 更新後的實際時間
   */
  async recordPause(taskId: string, pausedPeriod: PausedPeriod): Promise<ActualTime> {
    const currentActual = await this.getActualTime(taskId);
    const pausedPeriods = currentActual?.pausedPeriods || [];
    pausedPeriods.push(pausedPeriod);

    return this.updateActualTime(taskId, {
      pausedPeriods,
      totalPausedDays: this.calculateTotalPausedDays(pausedPeriods)
    });
  }

  /**
   * 記錄時間調整歷史
   *
   * @param taskId 任務 ID
   * @param timeAdjustment 時間調整記錄
   * @returns 更新後的實際時間
   */
  async recordTimeAdjustment(taskId: string, timeAdjustment: TimeAdjustment): Promise<ActualTime> {
    const currentActual = await this.getActualTime(taskId);
    const timeAdjustments = currentActual?.timeAdjustments || [];
    timeAdjustments.push(timeAdjustment);

    return this.updateActualTime(taskId, { timeAdjustments });
  }

  /**
   * 獲取任務的計畫時間
   *
   * @param taskId 任務 ID
   * @returns 計畫時間或 null
   */
  async getPlannedTime(taskId: string): Promise<PlannedTime | null> {
    const data = await this.repository.fetchTask(taskId, [
      'planned_start_date',
      'planned_end_date',
      'planned_duration',
      'planned_work_hours',
      'work_calendar_id',
      'working_days_per_week',
      'working_hours_per_day',
      'baseline_start',
      'baseline_end',
      'baseline_duration',
      'baseline_version',
      'baseline_date',
      'target_start_date',
      'target_end_date',
      'contract_start_date',
      'contract_end_date',
      'time_data'
    ]);

    if (!data) {
      return null;
    }

    return this.convertPlannedTimeFromDb(data);
  }

  /**
   * 獲取任務的實際時間
   *
   * @param taskId 任務 ID
   * @returns 實際時間或 null
   */
  async getActualTime(taskId: string): Promise<ActualTime | null> {
    const data = await this.repository.fetchTask(taskId, [
      'actual_start_date',
      'actual_end_date',
      'actual_duration',
      'actual_work_hours',
      'delay_days',
      'delay_reason',
      'delay_category',
      'delay_responsibility',
      'delay_impact',
      'time_data'
    ]);

    if (!data) {
      return null;
    }

    return this.convertActualTimeFromDb(data);
  }

  /**
   * 獲取時間彈性資訊
   *
   * @param taskId 任務 ID
   * @returns 時間彈性資訊或 null
   */
  async getTimeFlexibility(taskId: string): Promise<TimeFlexibility | null> {
    const data = await this.repository.fetchTask(taskId, [
      'earliest_start',
      'latest_start',
      'earliest_finish',
      'latest_finish',
      'total_float',
      'free_float',
      'is_critical_path',
      'criticality_index',
      'buffer_days',
      'drag_coefficient',
      'time_constraint_type',
      'time_constraint_date'
    ]);

    if (!data) {
      return null;
    }

    return {
      earliestStart: data.earliest_start ? new Date(data.earliest_start) : new Date(0),
      latestStart: data.latest_start ? new Date(data.latest_start) : new Date(0),
      earliestFinish: data.earliest_finish ? new Date(data.earliest_finish) : new Date(0),
      latestFinish: data.latest_finish ? new Date(data.latest_finish) : new Date(0),
      totalFloat: Number(data.total_float) || 0,
      freeFloat: Number(data.free_float) || 0,
      isCriticalPath: !!data.is_critical_path,
      criticalityIndex: Number(data.criticality_index) || 0,
      bufferDays: Number(data.buffer_days) || 0,
      dragCoefficient: Number(data.drag_coefficient) || 0,
      constraint: data.time_constraint_type
        ? {
            type: data.time_constraint_type,
            date: data.time_constraint_date ? new Date(data.time_constraint_date) : undefined
          }
        : null
    } as TimeFlexibility;
  }

  /**
   * 獲取完整的任務時間資訊
   *
   * @param taskId 任務 ID
   * @returns 完整的任務時間資訊
   */
  async getTaskTime(taskId: string): Promise<TaskTime | null> {
    const planned = await this.getPlannedTime(taskId);
    const actual = await this.getActualTime(taskId);
    const flexibility = await this.getTimeFlexibility(taskId);

    if (!planned && !actual && !flexibility) {
      return null;
    }

    return {
      planned: planned || undefined,
      actual: actual || undefined,
      flexibility: flexibility || undefined
    };
  }

  /**
   * 從數據庫格式轉換為 PlannedTime（snake_case -> camelCase）
   */
  private convertPlannedTimeFromDb(dbData: TaskTimeDbRecord): PlannedTime {
    const timeData = (dbData.time_data as any) || {};
    const plannedData = timeData.planned || {};

    return {
      plannedStartDate: dbData.planned_start_date ? new Date(dbData.planned_start_date) : new Date(),
      plannedEndDate: dbData.planned_end_date ? new Date(dbData.planned_end_date) : new Date(),
      plannedDuration: dbData.planned_duration || 0,
      plannedWorkHours: Number(dbData.planned_work_hours) || 0,
      workCalendarId: dbData.work_calendar_id || undefined,
      workingDaysPerWeek: dbData.working_days_per_week || 5,
      workingHoursPerDay: Number(dbData.working_hours_per_day) || 8,
      baselineStart: dbData.baseline_start ? new Date(dbData.baseline_start) : undefined,
      baselineEnd: dbData.baseline_end ? new Date(dbData.baseline_end) : undefined,
      baselineDuration: dbData.baseline_duration || undefined,
      baselineVersion: dbData.baseline_version || undefined,
      baselineDate: dbData.baseline_date ? new Date(dbData.baseline_date) : undefined,
      targetStartDate: dbData.target_start_date ? new Date(dbData.target_start_date) : undefined,
      targetEndDate: dbData.target_end_date ? new Date(dbData.target_end_date) : undefined,
      contractStartDate: dbData.contract_start_date ? new Date(dbData.contract_start_date) : undefined,
      contractEndDate: dbData.contract_end_date ? new Date(dbData.contract_end_date) : undefined,
      contractMilestones: plannedData.contractMilestones ? plannedData.contractMilestones.map((d: string) => new Date(d)) : []
    };
  }

  /**
   * 從數據庫格式轉換為 ActualTime（snake_case -> camelCase）
   */
  private convertActualTimeFromDb(dbData: TaskTimeDbRecord): ActualTime {
    const timeData = (dbData.time_data as any) || {};
    const actualData = timeData.actual || {};

    return {
      actualStartDate: dbData.actual_start_date ? new Date(dbData.actual_start_date) : null,
      actualEndDate: dbData.actual_end_date ? new Date(dbData.actual_end_date) : null,
      actualDuration: dbData.actual_duration || 0,
      actualWorkHours: Number(dbData.actual_work_hours) || 0,
      pausedPeriods: actualData.pausedPeriods
        ? actualData.pausedPeriods.map((p: any) => ({
            from: new Date(p.from),
            to: new Date(p.to),
            reason: p.reason,
            approvedBy: p.approvedBy
          }))
        : [],
      totalPausedDays: actualData.totalPausedDays || dbData.delay_days || 0,
      delayDays: dbData.delay_days || 0,
      delayReason: dbData.delay_reason || undefined,
      delayCategory: (dbData.delay_category as any) || undefined,
      delayResponsibility: (dbData.delay_responsibility as any) || undefined,
      delayImpact: (dbData.delay_impact as any) || undefined,
      timeAdjustments: actualData.timeAdjustments
        ? actualData.timeAdjustments.map((t: any) => ({
            date: new Date(t.date),
            oldStart: new Date(t.oldStart),
            newStart: new Date(t.newStart),
            oldEnd: new Date(t.oldEnd),
            newEnd: new Date(t.newEnd),
            reason: t.reason,
            approvedBy: t.approvedBy
          }))
        : []
    };
  }

  /**
   * 計算總暫停天數
   */
  private calculateTotalPausedDays(pausedPeriods: PausedPeriod[]): number {
    return pausedPeriods.reduce((total, period) => {
      const days = Math.ceil((period.to.getTime() - period.from.getTime()) / (1000 * 60 * 60 * 24));
      return total + Math.max(0, days);
    }, 0);
  }
}
