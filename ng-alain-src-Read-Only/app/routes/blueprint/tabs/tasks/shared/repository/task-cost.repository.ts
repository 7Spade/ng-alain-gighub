import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import type { CostBreakdown, Currency } from '@models';
import { TaskEventRepository, TaskEventRecord } from '@tasks/shared/repository/task-event.repository';
import { TaskFacetRepository, TaskFacetRecord } from '@tasks/shared/repository/task-facet.repository';

const COST_FACET_TYPE = 'cost';
const COST_EXPENSE_EVENT = 'cost-expense';

export interface TaskCostSummaryRecord {
  id: string;
  taskId: string;
  currency: Currency;
  budgetAmount: number;
  committedCost: number;
  actualCost: number;
  remainingBudget: number;
  exchangeRate: number | null;
  costBreakdown: CostBreakdown;
  changeOrders: ChangeOrderRecord[];
  invoices: InvoiceRecord[];
  metadata: Record<string, unknown> | null;
  updatedAt: Date;
  updatedBy: string | null;
}

export interface ChangeOrderRecord {
  id: string;
  changeNumber: string;
  type: string;
  amount: number;
  currency: Currency;
  status: string;
  date: string;
  approvedDate?: string | null;
  description?: string | null;
  reason?: string | null;
  approvedBy?: string | null;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: Currency;
  issuedOn: string;
  dueOn?: string | null;
  status: string;
  vendor?: string | null;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface TaskCostExpenseRecord {
  id: string;
  taskId: string;
  costId: string;
  expenseType: string;
  description: string | null;
  amount: number;
  currency: Currency;
  incurredOn: Date | null;
  paidOn: Date | null;
  vendor: string | null;
  referenceNumber: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date | null;
  updatedBy: string | null;
}

export interface UpsertTaskCostSummaryInput {
  taskId: string;
  summary: {
    currency: Currency;
    budgetAmount: number;
    committedCost: number;
    actualCost: number;
    remainingBudget: number;
    exchangeRate?: number | null;
    costBreakdown: CostBreakdown;
    changeOrders?: ChangeOrderRecord[];
    invoices?: InvoiceRecord[];
    metadata?: Record<string, unknown> | null;
  };
  userId: string | null;
  timestamp: Date;
}

export interface InsertTaskCostExpenseInput {
  taskId: string;
  costId: string;
  expense: Omit<TaskCostExpenseRecord, 'id' | 'taskId' | 'costId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>;
  userId: string | null;
}

interface CostFacetPayload {
  currency: Currency;
  budgetAmount: number;
  committedCost: number;
  actualCost: number;
  remainingBudget: number;
  exchangeRate: number | null;
  costBreakdown: CostBreakdown;
  changeOrders: ChangeOrderRecord[];
  invoices: InvoiceRecord[];
}

interface CostExpenseEventPayload {
  costId: string;
  expenseType: string;
  description: string | null;
  amount: number;
  currency: Currency;
  incurredOn: string | null;
  paidOn: string | null;
  vendor: string | null;
  referenceNumber: string | null;
  metadata: Record<string, unknown> | null;
  updatedBy: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskCostRepository {
  private readonly supabase = inject(SupabaseService);
  private readonly facetRepository = inject(TaskFacetRepository);
  private readonly eventRepository = inject(TaskEventRepository);

  async getSummary(taskId: string): Promise<TaskCostSummaryRecord | null> {
    const facet = await this.facetRepository.getFacet<CostFacetPayload>(taskId, COST_FACET_TYPE);

    if (!facet) {
      return null;
    }

    return this.mapSummaryFacet(facet);
  }

  async upsertSummary(input: UpsertTaskCostSummaryInput): Promise<TaskCostSummaryRecord> {
    const payload: CostFacetPayload = {
      currency: input.summary.currency,
      budgetAmount: input.summary.budgetAmount,
      committedCost: input.summary.committedCost,
      actualCost: input.summary.actualCost,
      remainingBudget: input.summary.remainingBudget,
      exchangeRate: input.summary.exchangeRate ?? null,
      costBreakdown: input.summary.costBreakdown,
      changeOrders: input.summary.changeOrders ?? [],
      invoices: input.summary.invoices ?? []
    };

    const facet = await this.facetRepository.upsertFacet<CostFacetPayload>({
      taskId: input.taskId,
      facetType: COST_FACET_TYPE,
      payload,
      metadata: input.summary.metadata ?? undefined,
      userId: input.userId,
      timestamp: input.timestamp
    });

    return this.mapSummaryFacet(facet);
  }

  async deleteByTaskIds(taskIds: string[]): Promise<void> {
    await this.facetRepository.deleteFacetsByTaskIds(taskIds, COST_FACET_TYPE);
    await this.eventRepository.deleteEventsByTaskIds(taskIds, COST_FACET_TYPE, COST_EXPENSE_EVENT);
  }

  async listExpenses(taskId: string, costId: string): Promise<TaskCostExpenseRecord[]> {
    const events = await this.eventRepository.listEvents<CostExpenseEventPayload>(taskId, {
      facetType: COST_FACET_TYPE,
      eventType: COST_EXPENSE_EVENT
    });

    return events.filter(event => event.payload?.costId === costId).map(event => this.mapExpenseEvent(event));
  }

  async insertExpense(input: InsertTaskCostExpenseInput): Promise<TaskCostExpenseRecord> {
    const payload: CostExpenseEventPayload = {
      costId: input.costId,
      expenseType: input.expense.expenseType,
      description: input.expense.description ?? null,
      amount: input.expense.amount,
      currency: input.expense.currency,
      incurredOn: input.expense.incurredOn ? input.expense.incurredOn.toISOString() : null,
      paidOn: input.expense.paidOn ? input.expense.paidOn.toISOString() : null,
      vendor: input.expense.vendor ?? null,
      referenceNumber: input.expense.referenceNumber ?? null,
      metadata: input.expense.metadata ?? null,
      updatedBy: input.userId ?? null
    };

    const event = await this.eventRepository.insertEvent<CostExpenseEventPayload>({
      taskId: input.taskId,
      facetType: COST_FACET_TYPE,
      eventType: COST_EXPENSE_EVENT,
      payload,
      occurredAt: input.expense.incurredOn ?? new Date(),
      userId: input.userId,
      metadata: {
        costId: input.costId
      }
    });

    return this.mapExpenseEvent(event);
  }

  async sumExpenses(taskId: string, costId: string): Promise<number> {
    const expenses = await this.listExpenses(taskId, costId);
    return expenses.reduce((total, record) => total + record.amount, 0);
  }

  async getLegacyCostData(taskId: string): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').select('cost_data').eq('id', taskId).maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch legacy task cost data: ${error.message}`);
    }

    return (data?.cost_data as Record<string, unknown> | undefined) ?? null;
  }

  async clearLegacyCostData(taskId: string): Promise<void> {
    const { error } = await this.supabase.client.from('blueprint_tasks').update({ cost_data: null }).eq('id', taskId);

    if (error) {
      throw new Error(`Failed to clear legacy task cost data: ${error.message}`);
    }
  }

  private mapSummaryFacet(facet: TaskFacetRecord<CostFacetPayload>): TaskCostSummaryRecord {
    return {
      id: facet.id,
      taskId: facet.taskId,
      currency: facet.payload?.currency ?? 'TWD',
      budgetAmount: facet.payload?.budgetAmount ?? 0,
      committedCost: facet.payload?.committedCost ?? 0,
      actualCost: facet.payload?.actualCost ?? 0,
      remainingBudget: facet.payload?.remainingBudget ?? 0,
      exchangeRate: facet.payload?.exchangeRate ?? null,
      costBreakdown: facet.payload?.costBreakdown ?? ({} as CostBreakdown),
      changeOrders: facet.payload?.changeOrders ?? [],
      invoices: facet.payload?.invoices ?? [],
      metadata: facet.metadata ?? null,
      updatedAt: facet.updatedAt,
      updatedBy: facet.updatedBy
    };
  }

  private mapExpenseEvent(event: TaskEventRecord<CostExpenseEventPayload>): TaskCostExpenseRecord {
    return {
      id: event.id,
      taskId: event.taskId,
      costId: event.payload?.costId ?? event.taskId,
      expenseType: event.payload?.expenseType ?? 'general',
      description: event.payload?.description ?? null,
      amount: event.payload?.amount ?? 0,
      currency: event.payload?.currency ?? 'TWD',
      incurredOn: event.payload?.incurredOn ? new Date(event.payload.incurredOn) : null,
      paidOn: event.payload?.paidOn ? new Date(event.payload.paidOn) : null,
      vendor: event.payload?.vendor ?? null,
      referenceNumber: event.payload?.referenceNumber ?? null,
      metadata: event.payload?.metadata ?? null,
      createdAt: event.createdAt,
      createdBy: event.createdBy,
      updatedAt: event.occurredAt,
      updatedBy: event.createdBy ?? null
    };
  }
}
