/**
 * Task EVM Calculator Service
 *
 * 任務實獲值分析計算服務（Earned Value Management）
 * 對應 @ETMS_DESIGN_SPEC.md 文件：F.18 實獲值分析、關鍵計算邏輯
 *
 * 職責：
 * - 計算實獲值指標（PV, EV, AC, CV, SV, CPI, SPI, CSI）
 * - 計算完工預測（EAC, ETC, VAC, TCPI）
 * - 生成 EVM 歷史時間序列數據
 * - 提供成本與進度績效分析
 *
 * @see @ETMS_DESIGN_SPEC.md F.18 實獲值分析、關鍵計算邏輯
 */

import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import { TaskCostService } from '@tasks/features/task-cost/services/domain/task-cost.service';
import { TaskProgressService } from '@tasks/features/task-progress/services/domain/task-progress.service';
import { TaskTimeService } from '@tasks/features/task-time/services/domain/task-time.service';

/**
 * EVM 報告接口
 * 包含所有實獲值分析指標和趨勢分析
 */
export interface EVMReport {
  /** 計畫價值（Planned Value） */
  pv: number;
  /** 實獲值（Earned Value） */
  ev: number;
  /** 實際成本（Actual Cost） */
  ac: number;
  /** 完工預算（Budget at Completion） */
  bac: number;
  /** 進度績效指數（Schedule Performance Index） */
  spi: number;
  /** 成本績效指數（Cost Performance Index） */
  cpi: number;
  /** 成本與進度綜合指數（Cost Schedule Index） */
  csi: number;
  /** 完工估算（Estimate at Completion） */
  eac: number;
  /** 完工尚需估算（Estimate to Complete） */
  etc: number;
  /** 完工預算差異（Variance at Completion） */
  vac: number;
  /** 進度差異（Schedule Variance = EV - PV） */
  sv: number;
  /** 成本差異（Cost Variance = EV - AC） */
  cv: number;
  /** 趨勢分析 */
  trend: 'improving' | 'declining' | 'stable';
  /** 計算時間戳 */
  calculatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskEvmCalculatorService {
  // @ts-expect-error - 為將來實現準備
  private readonly supabase = inject(SupabaseService);
  private readonly timeService = inject(TaskTimeService);
  private readonly progressService = inject(TaskProgressService);
  private readonly costService = inject(TaskCostService);

  /**
   * 計算計畫價值（Planned Value）
   * PV = (實際日期 - 計畫開始日期) / 計畫持續時間 * 預算金額
   *
   * @param taskId 任務 ID
   * @param asOfDate 計算基準日期（預設為今天）
   * @returns 計畫價值
   */
  async calculatePV(taskId: string, asOfDate?: Date): Promise<number> {
    const today = asOfDate || new Date();
    const plannedTime = await this.timeService.getPlannedTime(taskId);
    const cost = await this.costService.getTaskCost(taskId);

    if (!plannedTime || !cost?.cost?.cost) {
      return 0;
    }

    const budget = cost.cost.cost.budgetAmount || 0;
    if (budget === 0) {
      return 0;
    }

    const plannedStart = new Date(plannedTime.plannedStartDate);
    const plannedEnd = new Date(plannedTime.plannedEndDate);
    const plannedDuration = plannedTime.plannedDuration || 0;

    if (plannedDuration === 0) {
      return 0;
    }

    // 如果今天早於計畫開始日期，PV = 0
    if (today < plannedStart) {
      return 0;
    }

    // 如果今天晚於計畫結束日期，PV = BAC（完工預算）
    if (today > plannedEnd) {
      return budget;
    }

    // 計算已過時間（從開始日期到今天的時間）
    const elapsedDays = Math.max(0, Math.floor((today.getTime() - plannedStart.getTime()) / (1000 * 60 * 60 * 24)));
    const plannedProgressPercent = Math.min(100, (elapsedDays / plannedDuration) * 100);

    // PV = 計畫進度百分比 * 預算金額
    return (plannedProgressPercent / 100) * budget;
  }

  /**
   * 計算實獲值（Earned Value）
   * EV = 進度百分比 * 預算金額
   *
   * @param taskId 任務 ID
   * @returns 實獲值
   */
  async calculateEV(taskId: string): Promise<number> {
    const progress = await this.progressService.getTaskProgress(taskId);
    const cost = await this.costService.getTaskCost(taskId);

    if (!progress || !cost?.cost?.cost) {
      return 0;
    }

    const budget = cost.cost.cost.budgetAmount || 0;
    if (budget === 0) {
      return 0;
    }

    const progressPercentage = progress.progress?.progress?.percentage || 0;
    return (progressPercentage / 100) * budget;
  }

  /**
   * 計算實際成本（Actual Cost）
   * AC = 已完成工作的實際支出
   *
   * @param taskId 任務 ID
   * @returns 實際成本
   */
  async calculateAC(taskId: string): Promise<number> {
    const cost = await this.costService.getTaskCost(taskId);

    if (!cost?.cost?.cost) {
      return 0;
    }

    // 使用實際成本作為 AC
    return cost.cost.cost.actualCost || 0;
  }

  /**
   * 計算進度績效指數（Schedule Performance Index）
   * SPI = EV / PV
   * SPI > 1 表示進度超前，SPI < 1 表示進度落後
   *
   * @param taskId 任務 ID
   * @param asOfDate 計算基準日期（預設為今天）
   * @returns 進度績效指數
   */
  async calculateSPI(taskId: string, asOfDate?: Date): Promise<number> {
    const [ev, pv] = await Promise.all([this.calculateEV(taskId), this.calculatePV(taskId, asOfDate)]);

    if (pv === 0) {
      return 0;
    }

    return ev / pv;
  }

  /**
   * 計算成本績效指數（Cost Performance Index）
   * CPI = EV / AC
   * CPI > 1 表示成本節省，CPI < 1 表示成本超支
   *
   * @param taskId 任務 ID
   * @returns 成本績效指數
   */
  async calculateCPI(taskId: string): Promise<number> {
    const [ev, ac] = await Promise.all([this.calculateEV(taskId), this.calculateAC(taskId)]);

    if (ac === 0) {
      return 0;
    }

    return ev / ac;
  }

  /**
   * 計算完工估算（Estimate at Completion）
   * EAC = BAC / CPI（如果 CPI 保持不變）
   *
   * @param taskId 任務 ID
   * @returns 完工估算
   */
  async calculateEAC(taskId: string): Promise<number> {
    const cost = await this.costService.getTaskCost(taskId);
    const cpi = await this.calculateCPI(taskId);

    if (!cost?.cost?.cost) {
      return 0;
    }

    const bac = cost.cost.cost.budgetAmount || 0;
    if (bac === 0) {
      return 0;
    }

    // 如果 CPI = 0，返回 BAC（假設按原預算完成）
    if (cpi === 0) {
      return bac;
    }

    // EAC = BAC / CPI
    return bac / cpi;
  }

  /**
   * 計算完工尚需估算（Estimate to Complete）
   * ETC = EAC - AC
   *
   * @param taskId 任務 ID
   * @returns 完工尚需估算
   */
  async calculateETC(taskId: string): Promise<number> {
    const [eac, ac] = await Promise.all([this.calculateEAC(taskId), this.calculateAC(taskId)]);

    return Math.max(0, eac - ac);
  }

  /**
   * 計算完工預算差異（Variance at Completion）
   * VAC = BAC - EAC
   *
   * @param taskId 任務 ID
   * @returns 完工預算差異（正值表示在預算內，負值表示超預算）
   */
  async calculateVAC(taskId: string): Promise<number> {
    const cost = await this.costService.getTaskCost(taskId);
    const eac = await this.calculateEAC(taskId);

    if (!cost?.cost?.cost) {
      return 0;
    }

    const bac = cost.cost.cost.budgetAmount || 0;
    return bac - eac;
  }

  /**
   * 生成完整的 EVM 報告
   * 包含所有指標和趨勢分析
   *
   * @param taskId 任務 ID
   * @param asOfDate 計算基準日期（預設為今天）
   * @returns 完整的 EVM 報告
   */
  async getEVMReport(taskId: string, asOfDate?: Date): Promise<EVMReport> {
    const today = asOfDate || new Date();

    // 並行計算所有基礎指標
    const [pv, ev, ac, cost, spi, cpi] = await Promise.all([
      this.calculatePV(taskId, today),
      this.calculateEV(taskId),
      this.calculateAC(taskId),
      this.costService.getTaskCost(taskId),
      this.calculateSPI(taskId, today),
      this.calculateCPI(taskId)
    ]);

    const bac = cost?.cost?.cost?.budgetAmount || 0;

    // 計算衍生指標
    const csi = cpi * spi; // Cost Schedule Index
    const sv = ev - pv; // Schedule Variance
    const cv = ev - ac; // Cost Variance

    // 計算預測指標
    const eac = cpi > 0 ? bac / cpi : bac;
    const etc = Math.max(0, eac - ac);
    const vac = bac - eac;

    // 趨勢分析
    const trend = this.analyzeTrend(spi, cpi);

    return {
      pv,
      ev,
      ac,
      bac,
      spi,
      cpi,
      csi,
      eac,
      etc,
      vac,
      sv,
      cv,
      trend,
      calculatedAt: today
    };
  }

  /**
   * 分析趨勢
   * 根據 SPI 和 CPI 判斷趨勢是 improving、declining 還是 stable
   *
   * @param spi 進度績效指數
   * @param cpi 成本績效指數
   * @returns 趨勢
   */
  private analyzeTrend(spi: number, cpi: number): 'improving' | 'declining' | 'stable' {
    // 如果 SPI 和 CPI 都大於 1，表示趨勢改善
    if (spi >= 1 && cpi >= 1) {
      return 'improving';
    }

    // 如果 SPI 和 CPI 都小於 1，表示趨勢惡化
    if (spi < 1 && cpi < 1) {
      return 'declining';
    }

    // 如果一個大於 1，一個小於 1，或都在 0.95-1.05 之間，視為穩定
    if (Math.abs(spi - 1) < 0.05 && Math.abs(cpi - 1) < 0.05) {
      return 'stable';
    }

    // 根據平均值判斷
    const average = (spi + cpi) / 2;
    if (average > 1.05) {
      return 'improving';
    } else if (average < 0.95) {
      return 'declining';
    }

    return 'stable';
  }
}
