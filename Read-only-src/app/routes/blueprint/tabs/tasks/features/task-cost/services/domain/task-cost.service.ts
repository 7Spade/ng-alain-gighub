/**
 * Task Cost Service
 *
 * 任務成本維度管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：G. 成本維度
 *
 * 職責：
 * - 管理預算與實際支出（預算金額、實際成本、剩餘預算）
 * - 處理成本分項（人工、材料、機具、外包、管理費等）
 * - 管理變更單、索賠、付款記錄
 * - 計算成本差異與成本趨勢分析
 *
 * @see @ETMS_DESIGN_SPEC.md G. 成本維度
 */

import { Injectable, inject } from '@angular/core';
import { UserService } from '@core/account/user/user.service';
import type { BudgetAndExpense, CostBreakdown, TaskCost, Currency, CostType, Discount, Markup } from '@models';
import {
  ChangeOrderRecord,
  InsertTaskCostExpenseInput,
  TaskCostRepository,
  TaskCostSummaryRecord,
  UpsertTaskCostSummaryInput
} from '@tasks/shared/repository/task-cost.repository';

interface ChangeOrder {
  id: string;
  changeNumber: string;
  type: 'budget' | 'addition' | 'deduction' | 'adjustment';
  amount: number;
  currency: Currency;
  status: string;
  date: Date;
  approvedDate?: Date;
  description: string;
  reason: string;
  approvedBy: string;
}

export interface TaskCostExpenseInput {
  expenseType: string;
  description?: string | null;
  amount: number;
  currency: Currency;
  incurredOn?: Date | null;
  paidOn?: Date | null;
  vendor?: string | null;
  referenceNumber?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface LegacyCostData {
  cost?: {
    budgetAmount?: number;
    budgetCurrency?: Currency;
    exchangeRate?: number;
    actualCost?: number;
    committedCost?: number;
    remainingBudget?: number;
    costBreakdown?: CostBreakdown;
    costType?: CostType;
    discount?: Discount;
    markup?: Markup;
    expenses?: Array<{
      id?: string;
      expenseType?: string;
      description?: string;
      amount?: number;
      currency?: Currency;
      date?: string | Date;
      vendor?: string;
      referenceNumber?: string;
      metadata?: Record<string, unknown>;
    }>;
    changeOrders?: Array<Partial<ChangeOrder>>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TaskCostService {
  private readonly userService = inject(UserService);
  private readonly repository = inject(TaskCostRepository);

  private readonly defaultBreakdown: CostBreakdown = {
    labor: 0,
    material: 0,
    equipment: 0,
    subcontract: 0,
    overhead: 0,
    contingency: 0,
    profit: 0,
    other: 0
  };

  /**
   * 更新任務預算
   *
   * @param taskId 任務 ID
   * @param budget 預算數據
   */
  async updateBudget(taskId: string, budget: Partial<BudgetAndExpense>): Promise<void> {
    if (!budget.cost) {
      return;
    }

    const userId = await this.getCurrentUserId();
    const timestamp = new Date();

    let summaryRecord = await this.repository.getSummary(taskId);

    if (!summaryRecord) {
      summaryRecord = await this.repository.upsertSummary({
        taskId,
        userId,
        timestamp,
        summary: this.createDefaultSummaryPayload(budget.cost)
      });
    }

    const metadata = (summaryRecord.metadata as Record<string, unknown>) ?? {};
    const metadataCostType = metadata['costType'] as CostType | undefined;
    const metadataDiscount = metadata['discount'] as Discount | undefined;
    const metadataMarkup = metadata['markup'] as Markup | undefined;

    const updatedSummary: UpsertTaskCostSummaryInput = {
      taskId,
      userId,
      timestamp,
      summary: {
        currency: budget.cost.budgetCurrency ?? summaryRecord.currency,
        budgetAmount: budget.cost.budgetAmount ?? summaryRecord.budgetAmount,
        committedCost: budget.cost.committedCost ?? summaryRecord.committedCost,
        actualCost: budget.cost.actualCost ?? summaryRecord.actualCost,
        remainingBudget: budget.cost.remainingBudget ?? summaryRecord.remainingBudget,
        exchangeRate: budget.cost.exchangeRate ?? summaryRecord.exchangeRate ?? null,
        costBreakdown: budget.cost.costBreakdown ?? summaryRecord.costBreakdown ?? this.defaultBreakdown,
        changeOrders: summaryRecord.changeOrders ?? [],
        invoices: summaryRecord.invoices ?? [],
        metadata: {
          ...metadata,
          costType: budget.cost.costType ?? metadataCostType ?? 'direct',
          discount: budget.cost.discount ?? metadataDiscount ?? undefined,
          markup: budget.cost.markup ?? metadataMarkup ?? undefined
        }
      }
    };

    await this.repository.upsertSummary(updatedSummary);
    await this.clearLegacyCostData(taskId);
  }

  /**
   * 記錄實際支出
   *
   * @param taskId 任務 ID
   * @param expense 支出項目
   */
  async recordExpense(taskId: string, expense: TaskCostExpenseInput): Promise<void> {
    const userId = await this.getCurrentUserId();
    const timestamp = new Date();

    let summary = await this.repository.getSummary(taskId);
    if (!summary) {
      summary = await this.repository.upsertSummary({
        taskId,
        userId,
        timestamp,
        summary: this.createDefaultSummaryPayload({
          budgetAmount: 0,
          budgetCurrency: expense.currency ?? 'TWD',
          actualCost: 0,
          committedCost: 0,
          remainingBudget: 0,
          costType: 'direct',
          costBreakdown: this.defaultBreakdown
        })
      });
    }

    const insertInput: InsertTaskCostExpenseInput = {
      taskId,
      costId: summary.id,
      userId,
      expense: {
        expenseType: expense.expenseType,
        description: expense.description ?? null,
        amount: expense.amount,
        currency: expense.currency,
        incurredOn: expense.incurredOn ?? null,
        paidOn: expense.paidOn ?? null,
        vendor: expense.vendor ?? null,
        referenceNumber: expense.referenceNumber ?? null,
        metadata: expense.metadata ?? null
      }
    };

    await this.repository.insertExpense(insertInput);

    const totalExpense = await this.repository.sumExpenses(taskId, summary.id);
    await this.repository.upsertSummary({
      taskId,
      userId,
      timestamp,
      summary: {
        currency: summary.currency,
        budgetAmount: summary.budgetAmount,
        committedCost: summary.committedCost,
        actualCost: totalExpense,
        remainingBudget: summary.budgetAmount - totalExpense,
        exchangeRate: summary.exchangeRate,
        costBreakdown: summary.costBreakdown,
        changeOrders: summary.changeOrders,
        invoices: summary.invoices,
        metadata: summary.metadata
      }
    });

    await this.clearLegacyCostData(taskId);
  }

  /**
   * 添加變更訂單
   *
   * @param taskId 任務 ID
   * @param changeOrder 變更訂單
   * @returns 創建的變更訂單
   */
  async addChangeOrder(taskId: string, changeOrder: Omit<ChangeOrder, 'id'>): Promise<ChangeOrder> {
    const userId = await this.getCurrentUserId();
    const timestamp = new Date();

    const summary = await this.ensureSummary(taskId, userId);

    const newChangeOrder: ChangeOrderRecord = {
      id: crypto.randomUUID(),
      changeNumber: changeOrder.changeNumber,
      type: changeOrder.type,
      amount: changeOrder.amount,
      currency: changeOrder.currency,
      status: changeOrder.status,
      date: changeOrder.date.toISOString(),
      approvedDate: changeOrder.approvedDate?.toISOString() ?? null,
      description: changeOrder.description,
      reason: changeOrder.reason,
      approvedBy: changeOrder.approvedBy
    };

    const changeOrders = [...summary.changeOrders, newChangeOrder];
    let budgetAmount = summary.budgetAmount;
    let remainingBudget = summary.remainingBudget;

    if (changeOrder.status === 'approved') {
      budgetAmount += changeOrder.amount;
      remainingBudget += changeOrder.amount;
    }

    await this.repository.upsertSummary({
      taskId,
      userId,
      timestamp,
      summary: {
        currency: summary.currency,
        budgetAmount,
        committedCost: summary.committedCost,
        actualCost: summary.actualCost,
        remainingBudget,
        exchangeRate: summary.exchangeRate,
        costBreakdown: summary.costBreakdown,
        changeOrders,
        invoices: summary.invoices,
        metadata: summary.metadata
      }
    });

    await this.clearLegacyCostData(taskId);

    return {
      ...changeOrder,
      id: newChangeOrder.id
    };
  }

  /**
   * 獲取任務的完整成本資訊
   *
   * @param taskId 任務 ID
   * @returns 完整的成本資訊
   */
  async getTaskCost(taskId: string): Promise<TaskCost | null> {
    let summary = await this.repository.getSummary(taskId);

    if (!summary) {
      const migrated = await this.migrateLegacyCostData(taskId);
      summary = migrated ?? null;
    }

    if (!summary) {
      return null;
    }

    return this.buildTaskCost(summary);
  }

  async removeCost(taskId: string): Promise<void> {
    await this.repository.deleteByTaskIds([taskId]);
    await this.clearLegacyCostData(taskId);
  }

  /**
   * 序列化成本明細
   */
  private async getCurrentUserId(): Promise<string | null> {
    const { data, error } = await this.userService.getCurrentUser();

    if (data?.id) {
      return data.id;
    }

    if (error) {
      throw error;
    }

    return null;
  }

  private createDefaultSummaryPayload(budget?: Partial<BudgetAndExpense['cost']>): UpsertTaskCostSummaryInput['summary'] {
    const breakdown = budget?.costBreakdown ?? this.defaultBreakdown;
    return {
      currency: budget?.budgetCurrency ?? 'TWD',
      budgetAmount: budget?.budgetAmount ?? 0,
      committedCost: budget?.committedCost ?? 0,
      actualCost: budget?.actualCost ?? 0,
      remainingBudget: budget?.remainingBudget ?? budget?.budgetAmount ?? 0,
      exchangeRate: budget?.exchangeRate ?? null,
      costBreakdown: breakdown,
      changeOrders: [],
      invoices: [],
      metadata: {
        costType: budget?.costType ?? 'direct',
        discount: budget?.discount,
        markup: budget?.markup
      }
    };
  }

  private async ensureSummary(taskId: string, userId: string | null): Promise<TaskCostSummaryRecord> {
    const existing = await this.repository.getSummary(taskId);
    if (existing) {
      return existing;
    }

    return this.repository.upsertSummary({
      taskId,
      userId,
      timestamp: new Date(),
      summary: this.createDefaultSummaryPayload({
        budgetCurrency: 'TWD',
        budgetAmount: 0,
        actualCost: 0,
        committedCost: 0,
        remainingBudget: 0,
        costType: 'direct',
        costBreakdown: this.defaultBreakdown
      })
    });
  }

  private buildTaskCost(summary: TaskCostSummaryRecord): TaskCost {
    const metadata = (summary.metadata as Record<string, unknown>) ?? {};
    const metadataCostType = metadata['costType'] as CostType | undefined;
    const metadataDiscount = metadata['discount'] as Discount | undefined;
    const metadataMarkup = metadata['markup'] as Markup | undefined;

    return {
      cost: {
        cost: {
          budgetAmount: summary.budgetAmount,
          budgetCurrency: summary.currency,
          exchangeRate: summary.exchangeRate ?? undefined,
          actualCost: summary.actualCost,
          committedCost: summary.committedCost,
          remainingBudget: summary.remainingBudget,
          costBreakdown: summary.costBreakdown,
          costType: metadataCostType ?? 'direct',
          discount: metadataDiscount,
          markup: metadataMarkup
        }
      }
    };
  }

  private async clearLegacyCostData(taskId: string): Promise<void> {
    await this.repository.clearLegacyCostData(taskId);
  }

  private async migrateLegacyCostData(taskId: string): Promise<TaskCostSummaryRecord | null> {
    const legacyCost = (await this.repository.getLegacyCostData(taskId)) as LegacyCostData | null;
    if (!legacyCost?.cost) {
      return null;
    }

    const userId = await this.getCurrentUserId();
    const timestamp = new Date();

    const summaryInput: UpsertTaskCostSummaryInput = {
      taskId,
      userId,
      timestamp,
      summary: {
        currency: legacyCost.cost.budgetCurrency ?? 'TWD',
        budgetAmount: legacyCost.cost.budgetAmount ?? 0,
        committedCost: legacyCost.cost.committedCost ?? 0,
        actualCost: legacyCost.cost.actualCost ?? 0,
        remainingBudget: legacyCost.cost.remainingBudget ?? 0,
        exchangeRate: legacyCost.cost.exchangeRate ?? null,
        costBreakdown: legacyCost.cost.costBreakdown ?? this.defaultBreakdown,
        changeOrders: (legacyCost.cost.changeOrders ?? []).map(order => ({
          id: order?.id ?? crypto.randomUUID(),
          changeNumber: order?.changeNumber ?? '',
          type: order?.type ?? 'adjustment',
          amount: order?.amount ?? 0,
          currency: (order?.currency as Currency) ?? 'TWD',
          status: order?.status ?? 'draft',
          date: (order?.date instanceof Date ? order.date : new Date(order?.date ?? timestamp)).toISOString(),
          approvedDate:
            order?.approvedDate instanceof Date
              ? order.approvedDate.toISOString()
              : order?.approvedDate
                ? new Date(order.approvedDate).toISOString()
                : null,
          description: order?.description ?? '',
          reason: order?.reason ?? '',
          approvedBy: order?.approvedBy ?? ''
        })),
        invoices: [],
        metadata: {
          costType: legacyCost.cost.costType ?? 'direct',
          discount: legacyCost.cost.discount,
          markup: legacyCost.cost.markup
        }
      }
    };

    const summary = await this.repository.upsertSummary(summaryInput);

    // Migrate expenses
    const legacyExpenses = legacyCost.cost.expenses ?? [];
    for (const legacyExpense of legacyExpenses) {
      const expenseInput: TaskCostExpenseInput = {
        expenseType: legacyExpense.expenseType ?? 'general',
        description: legacyExpense.description ?? null,
        amount: legacyExpense.amount ?? 0,
        currency: legacyExpense.currency ?? summary.currency,
        incurredOn: legacyExpense.date ? new Date(legacyExpense.date) : null,
        paidOn: null,
        vendor: legacyExpense.vendor ?? null,
        referenceNumber: legacyExpense.referenceNumber ?? null,
        metadata: legacyExpense.metadata ?? null
      };
      await this.recordExpense(summary.taskId, expenseInput);
    }

    await this.clearLegacyCostData(taskId);
    return summary;
  }
}
