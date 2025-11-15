/**
 * Task Cost Calculator Service
 *
 * 任務成本計算服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：G. 成本維度、關鍵計算邏輯
 *
 * 職責：
 * - 計算預算差異（PV - EV），分析預算超支或節省
 * - 計算成本趨勢，預測完工成本（EAC - Estimate at Completion）
 * - 計算成本分項（人工、材料、機具、外包等）的實際佔比
 * - 分析成本風險，識別可能超支的項目
 *
 * @see @ETMS_DESIGN_SPEC.md G. 成本維度、關鍵計算邏輯
 */

import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import type { CostBreakdown } from '@models';
import { TaskProgressService } from '@tasks/features/task-progress/services/domain/task-progress.service';
import { TaskTimeService } from '@tasks/features/task-time/services/domain/task-time.service';

import { TaskCostService } from '../domain/task-cost.service';

/**
 * 預算差異分析結果
 */
export interface BudgetVarianceResult {
  /** 預算差異金額（PV - EV） */
  variance: number;
  /** 差異百分比 */
  variancePercentage: number;
  /** 預算狀態 */
  status: 'over-budget' | 'on-budget' | 'under-budget';
}

/**
 * 成本趨勢預測結果
 */
export interface CostTrendResult {
  /** 完工預算（Budget at Completion） */
  BAC: number;
  /** 計畫值（Planned Value） */
  PV: number;
  /** 實獲值（Earned Value） */
  EV: number;
  /** 實際成本（Actual Cost） */
  AC: number;
  /** 成本績效指數（CPI = EV / AC） */
  CPI: number;
  /** 預測完工成本（EAC = BAC / CPI） */
  EAC: number;
  /** 完工預算差異（VAC = BAC - EAC） */
  VAC: number;
  /** 完成尚需成本（ETC = EAC - AC） */
  ETC: number;
}

/**
 * 成本分項佔比結果
 */
export interface CostBreakdownResult {
  /** 人工成本佔比 */
  laborPercentage: number;
  /** 材料成本佔比 */
  materialPercentage: number;
  /** 機具成本佔比 */
  equipmentPercentage: number;
  /** 外包成本佔比 */
  subcontractPercentage: number;
  /** 管理費佔比 */
  overheadPercentage: number;
  /** 應急費佔比 */
  contingencyPercentage: number;
  /** 利潤佔比 */
  profitPercentage: number;
  /** 其他成本佔比 */
  otherPercentage: number;
}

/**
 * 成本風險項目
 */
export interface CostRiskItem {
  /** 成本項目名稱 */
  item: string;
  /** 預算金額 */
  budget: number;
  /** 實際成本 */
  actual: number;
  /** 差異金額 */
  variance: number;
  /** 差異百分比 */
  variancePercentage: number;
  /** 風險等級 */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * 成本風險分析結果
 */
export interface CostRiskAnalysisResult {
  /** 有風險的成本項目 */
  atRiskItems: CostRiskItem[];
  /** 風險等級 */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  /** 成本控制建議 */
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskCostCalculatorService {
  private readonly costService = inject(TaskCostService);
  private readonly timeService = inject(TaskTimeService);
  private readonly progressService = inject(TaskProgressService);

  // @ts-expect-error - 為將來實現準備
  private readonly supabase = inject(SupabaseService);

  /**
   * 計算預算差異（PV - EV），分析預算超支或節省
   *
   * 注意：PV - EV 實際上是進度差異（Schedule Variance），
   * 但根據任務描述，這裡用於分析預算差異。
   * 實際的成本差異應該是 CV = EV - AC。
   *
   * @param taskId 任務 ID
   * @returns 預算差異分析結果
   */
  async calculateBudgetVariance(taskId: string): Promise<BudgetVarianceResult> {
    // 獲取成本數據
    const cost = await this.costService.getTaskCost(taskId);
    if (!cost?.cost?.cost) {
      throw new Error('Task cost data not found');
    }

    const costInfo = cost.cost.cost;
    const budget = costInfo.budgetAmount || 0;

    // 獲取進度數據以計算 PV 和 EV
    const progress = await this.progressService.getTaskProgress(taskId);
    const progressPercentage = progress?.progress?.progress?.percentage || 0;

    // 計算 PV（計畫值）：基於時間進度
    const plannedTime = await this.timeService.getPlannedTime(taskId);
    if (!plannedTime) {
      throw new Error('Planned time data not found');
    }

    const today = new Date();
    const plannedStart = plannedTime.plannedStartDate;
    const plannedDuration = plannedTime.plannedDuration || 0;

    // 計算計畫進度百分比（已過時間 / 總計畫時間）
    let plannedProgressPercent = 0;
    if (plannedDuration > 0) {
      const elapsedDays = Math.max(0, Math.floor((today.getTime() - plannedStart.getTime()) / (1000 * 60 * 60 * 24)));
      plannedProgressPercent = Math.min(100, (elapsedDays / plannedDuration) * 100);
    }

    // PV = 計畫進度百分比 × 預算
    const PV = (plannedProgressPercent / 100) * budget;

    // EV = 實際進度百分比 × 預算
    const EV = (progressPercentage / 100) * budget;

    // 計算預算差異（PV - EV）
    // 注意：這裡使用 PV - EV 來分析預算差異
    // 正值表示實際進度落後於計畫（預算可能超支）
    // 負值表示實際進度超前於計畫（預算可能節省）
    const variance = PV - EV;

    // 計算差異百分比
    const variancePercentage = EV !== 0 ? (variance / EV) * 100 : 0;

    // 判斷預算狀態
    let status: 'over-budget' | 'on-budget' | 'under-budget';
    if (variancePercentage > 10) {
      // 差異超過 10%，視為超預算風險
      status = 'over-budget';
    } else if (variancePercentage < -10) {
      // 差異低於 -10%，視為節省預算
      status = 'under-budget';
    } else {
      // 差異在 ±10% 內，視為正常
      status = 'on-budget';
    }

    return {
      variance,
      variancePercentage,
      status
    };
  }

  /**
   * 計算成本趨勢，預測完工成本（EAC - Estimate at Completion）
   *
   * 算法：
   * 1. 使用實際成本（AC）和進度百分比
   * 2. 計算成本績效指數（CPI = EV / AC）
   * 3. 預測完工成本：EAC = BAC / CPI
   * 4. 計算完工預算差異：VAC = BAC - EAC
   *
   * @param taskId 任務 ID
   * @returns 成本趨勢預測結果
   */
  async calculateCostTrend(taskId: string): Promise<CostTrendResult> {
    // 獲取成本數據
    const cost = await this.costService.getTaskCost(taskId);
    if (!cost?.cost?.cost) {
      throw new Error('Task cost data not found');
    }

    const costInfo = cost.cost.cost;
    const BAC = costInfo.budgetAmount || 0; // Budget at Completion（完工預算）
    const AC = costInfo.actualCost || 0; // Actual Cost（實際成本）

    // 獲取進度數據以計算 EV
    const progress = await this.progressService.getTaskProgress(taskId);
    const progressPercentage = progress?.progress?.progress?.percentage || 0;

    // 計算 EV（實獲值）= 實際進度百分比 × 預算
    const EV = (progressPercentage / 100) * BAC;

    // 計算 PV（計畫值）：基於時間進度
    const plannedTime = await this.timeService.getPlannedTime(taskId);
    if (!plannedTime) {
      throw new Error('Planned time data not found');
    }

    const today = new Date();
    const plannedStart = plannedTime.plannedStartDate;
    const plannedDuration = plannedTime.plannedDuration || 0;

    let PV = 0;
    if (plannedDuration > 0) {
      const elapsedDays = Math.max(0, Math.floor((today.getTime() - plannedStart.getTime()) / (1000 * 60 * 60 * 24)));
      const plannedProgressPercent = Math.min(100, (elapsedDays / plannedDuration) * 100);
      PV = (plannedProgressPercent / 100) * BAC;
    }

    // 計算 CPI（成本績效指數）= EV / AC
    // 如果 AC 為 0，則使用預設值 1（表示成本正常）
    const CPI = AC !== 0 ? EV / AC : 1;

    // 預測完工成本：EAC = BAC / CPI
    // 如果 CPI 為 0，則使用 BAC（表示無法預測）
    const EAC = CPI !== 0 ? BAC / CPI : BAC;

    // 計算完工預算差異：VAC = BAC - EAC
    const VAC = BAC - EAC;

    // 計算完成尚需成本：ETC = EAC - AC
    const ETC = EAC - AC;

    return {
      BAC,
      PV,
      EV,
      AC,
      CPI,
      EAC,
      VAC,
      ETC
    };
  }

  /**
   * 計算成本分項（人工、材料、機具、外包等）的實際佔比
   *
   * @param taskId 任務 ID
   * @returns 成本分項佔比結果
   */
  async calculateCostBreakdown(taskId: string): Promise<CostBreakdownResult> {
    // 獲取成本數據
    const cost = await this.costService.getTaskCost(taskId);
    if (!cost?.cost?.cost) {
      throw new Error('Task cost data not found');
    }

    const costInfo = cost.cost.cost;
    const costBreakdown = costInfo.costBreakdown || {
      labor: 0,
      material: 0,
      equipment: 0,
      subcontract: 0,
      overhead: 0,
      contingency: 0,
      profit: 0,
      other: 0
    };

    // 計算總成本
    const totalCost = Object.values(costBreakdown).reduce((sum, value) => sum + (value || 0), 0);

    // 如果總成本為 0，則所有佔比為 0
    if (totalCost === 0) {
      return {
        laborPercentage: 0,
        materialPercentage: 0,
        equipmentPercentage: 0,
        subcontractPercentage: 0,
        overheadPercentage: 0,
        contingencyPercentage: 0,
        profitPercentage: 0,
        otherPercentage: 0
      };
    }

    // 計算各項佔比
    return {
      laborPercentage: (costBreakdown.labor / totalCost) * 100,
      materialPercentage: (costBreakdown.material / totalCost) * 100,
      equipmentPercentage: (costBreakdown.equipment / totalCost) * 100,
      subcontractPercentage: (costBreakdown.subcontract / totalCost) * 100,
      overheadPercentage: (costBreakdown.overhead / totalCost) * 100,
      contingencyPercentage: (costBreakdown.contingency / totalCost) * 100,
      profitPercentage: (costBreakdown.profit / totalCost) * 100,
      otherPercentage: (costBreakdown.other / totalCost) * 100
    };
  }

  /**
   * 分析成本風險，識別可能超支的項目
   *
   * @param taskId 任務 ID
   * @returns 成本風險分析結果
   */
  async analyzeCostRisk(taskId: string): Promise<CostRiskAnalysisResult> {
    // 獲取成本數據
    const cost = await this.costService.getTaskCost(taskId);
    if (!cost?.cost?.cost) {
      throw new Error('Task cost data not found');
    }

    const costInfo = cost.cost.cost;
    const costBreakdown = costInfo.costBreakdown || {
      labor: 0,
      material: 0,
      equipment: 0,
      subcontract: 0,
      overhead: 0,
      contingency: 0,
      profit: 0,
      other: 0
    };

    const actualCost = costInfo.actualCost || 0;

    // 計算各項預算和實際成本
    // 注意：這裡簡化處理，實際應該從費用記錄中統計各項實際成本
    // 目前使用總實際成本按比例分配（僅作為示例）
    const totalBudget = Object.values(costBreakdown).reduce((sum, value) => sum + (value || 0), 0);
    const atRiskItems: CostRiskItem[] = [];

    // 分析各項成本
    const costItems = [
      { name: '人工', key: 'labor' as keyof CostBreakdown },
      { name: '材料', key: 'material' as keyof CostBreakdown },
      { name: '機具', key: 'equipment' as keyof CostBreakdown },
      { name: '外包', key: 'subcontract' as keyof CostBreakdown },
      { name: '管理費', key: 'overhead' as keyof CostBreakdown },
      { name: '應急費', key: 'contingency' as keyof CostBreakdown },
      { name: '利潤', key: 'profit' as keyof CostBreakdown },
      { name: '其他', key: 'other' as keyof CostBreakdown }
    ];

    for (const item of costItems) {
      const budget = costBreakdown[item.key] || 0;

      // 簡化處理：按預算比例分配實際成本
      // 實際應用中應該從費用記錄中統計各項實際成本
      const actual = totalBudget > 0 ? (budget / totalBudget) * actualCost : 0;

      const variance = actual - budget;
      const variancePercentage = budget !== 0 ? (variance / budget) * 100 : 0;

      // 判斷風險等級
      let riskLevel: 'low' | 'medium' | 'high' | 'critical';
      if (variancePercentage > 20) {
        riskLevel = 'critical';
      } else if (variancePercentage > 10) {
        riskLevel = 'high';
      } else if (variancePercentage > 5) {
        riskLevel = 'medium';
      } else {
        riskLevel = 'low';
      }

      // 只記錄有風險的項目（差異超過 5%）
      if (variancePercentage > 5 || variancePercentage < -5) {
        atRiskItems.push({
          item: item.name,
          budget,
          actual,
          variance,
          variancePercentage,
          riskLevel
        });
      }
    }

    // 計算整體風險等級
    const criticalCount = atRiskItems.filter(item => item.riskLevel === 'critical').length;
    const highCount = atRiskItems.filter(item => item.riskLevel === 'high').length;
    const mediumCount = atRiskItems.filter(item => item.riskLevel === 'medium').length;

    let overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (criticalCount > 0) {
      overallRiskLevel = 'critical';
    } else if (highCount > 0) {
      overallRiskLevel = 'high';
    } else if (mediumCount > 0) {
      overallRiskLevel = 'medium';
    } else {
      overallRiskLevel = 'low';
    }

    // 生成建議
    const recommendations: string[] = [];
    if (overallRiskLevel === 'critical' || overallRiskLevel === 'high') {
      recommendations.push('立即檢查成本超支項目，採取緊急控制措施');
      recommendations.push('重新評估剩餘工作預算，必要時申請預算調整');
    }
    if (overallRiskLevel === 'medium') {
      recommendations.push('密切監控成本趨勢，及時調整資源配置');
    }
    if (atRiskItems.length > 0) {
      recommendations.push(`重點關注 ${atRiskItems.map(item => item.item).join('、')} 等項目的成本控制`);
    }
    if (recommendations.length === 0) {
      recommendations.push('目前成本控制良好，繼續保持');
    }

    return {
      atRiskItems,
      riskLevel: overallRiskLevel,
      recommendations
    };
  }
}
