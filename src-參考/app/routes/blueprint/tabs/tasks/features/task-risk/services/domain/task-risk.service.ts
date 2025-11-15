/**
 * Task Risk Service
 *
 * 任務風險維度管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：I. 風險維度
 *
 * 職責：
 * - 管理風險識別與評估（機率、影響、風險分數）
 * - 處理應對策略（避免、減緩、轉移、接受）
 * - 管理風險監控指標與觸發條件
 * - 追蹤風險實現與實際影響分析
 *
 * @see @ETMS_DESIGN_SPEC.md I. 風險維度
 */

import { Injectable, inject } from '@angular/core';
import type { RiskItem, TaskRisk } from '@models';
import { TaskRiskRepository } from '@tasks/shared/repository/task-risk.repository';

@Injectable({
  providedIn: 'root'
})
export class TaskRiskService {
  private readonly repository = inject(TaskRiskRepository);

  /**
   * 添加風險項目
   *
   * @param taskId 任務 ID
   * @param risk 風險數據
   * @returns 創建的風險項目
   */
  async addRisk(taskId: string, risk: Omit<RiskItem, 'id'>): Promise<RiskItem> {
    // 計算風險分數
    const riskScore = (risk.probability || 0) * (risk.impact || 0);

    // 計算風險等級
    const riskLevel = this.calculateRiskLevel(riskScore);

    // 插入到 blueprint_task_risks 表
    const created = await this.repository.createRisk({
      taskId,
      riskNumber: risk.riskNumber,
      title: risk.title,
      description: risk.description,
      category: risk.category,
      probability: risk.probability,
      impact: risk.impact,
      riskScore,
      riskLevel,
      strategy: risk.strategy,
      mitigationPlan: risk.mitigationPlan,
      contingencyPlan: risk.contingencyPlan,
      fallbackPlan: risk.fallbackPlan,
      ownerId: risk.owner,
      actionOwnerId: risk.actionOwner,
      status: risk.status,
      potentialImpacts: risk.potentialImpacts
    });

    await this.updateRiskSnapshot(taskId, risks => {
      risks.push({
        id: created.id,
        ...risk,
        riskScore,
        riskLevel
      });
      return risks;
    });

    return created;
  }

  /**
   * 更新風險緩解計畫
   *
   * @param taskId 任務 ID
   * @param riskId 風險 ID
   * @param mitigation 緩解計畫數據
   */
  async updateRiskMitigation(taskId: string, riskId: string, mitigation: any): Promise<void> {
    // 更新 blueprint_task_risks 表
    await this.repository.updateMitigation({
      taskId,
      riskId,
      mitigationPlan: mitigation.mitigationPlan,
      contingencyPlan: mitigation.contingencyPlan,
      fallbackPlan: mitigation.fallbackPlan,
      actions: mitigation.actions
    });

    await this.updateRiskSnapshot(taskId, risks => {
      const index = risks.findIndex((r: any) => r.id === riskId);
      if (index >= 0) {
        risks[index].mitigation = mitigation;
      }
      return risks;
    });
  }

  /**
   * 獲取任務的所有風險項目
   *
   * @param taskId 任務 ID
   * @returns 完整的風險資訊
   */
  async getTaskRisks(taskId: string): Promise<TaskRisk | null> {
    // 從 blueprint_task_risks 表查詢風險
    const risks = await this.repository.listRisks(taskId);

    if (risks.length === 0) {
      const snapshot = await this.repository.getRiskSnapshot(taskId);

      if (snapshot) {
        const riskData = snapshot as any;
        const management = riskData.management || {};
        return {
          risks: {
            risks: (management.risks || []).map((r: any) => this.deserializeRisk(r))
          }
        };
      }

      return null;
    }

    return {
      risks: {
        risks
      }
    };
  }

  /**
   * 更新風險數據（內部方法）
   */
  private async updateRiskSnapshot(taskId: string, updater: (risks: any[]) => any[]): Promise<void> {
    const riskData = ((await this.repository.getRiskSnapshot(taskId)) || {}) as Record<string, unknown>;
    const management = (riskData['management'] as Record<string, unknown> | undefined) ?? {};
    const currentRisks = Array.isArray(management['risks']) ? (management['risks'] as any[]) : [];
    const updatedRisks = updater(currentRisks);

    await this.repository.updateRiskSnapshot(taskId, {
      ...riskData,
      management: {
        ...management,
        risks: updatedRisks
      }
    });
  }

  /**
   * 計算風險等級
   */
  private calculateRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 0.8) {
      return 'critical';
    } else if (riskScore >= 0.5) {
      return 'high';
    } else if (riskScore >= 0.2) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * 從數據庫格式轉換為 RiskItem
   */
  private deserializeRisk(data: any): RiskItem {
    return {
      id: data.id,
      riskNumber: data.riskNumber || '',
      title: data.title || '',
      description: data.description || '',
      category: data.category,
      probability: data.probability || 0,
      impact: data.impact || 0,
      riskScore: data.riskScore || 0,
      riskLevel: data.riskLevel || 'low',
      strategy: data.strategy || 'accept',
      mitigationPlan: data.mitigationPlan || '',
      contingencyPlan: data.contingencyPlan || '',
      fallbackPlan: data.fallbackPlan || '',
      owner: data.owner || '',
      actionOwner: data.actionOwner || '',
      status: data.status || 'identified',
      potentialImpacts: data.potentialImpacts || {
        cost: 0,
        schedule: 0,
        quality: '',
        safety: '',
        reputation: ''
      }
    };
  }
}
