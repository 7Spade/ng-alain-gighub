import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import type { RiskItem, RiskLevel, RiskStrategy, RiskStatus, PotentialImpacts } from '@models';

interface RiskDbRow {
  id: string;
  task_id: string;
  risk_number: string | null;
  title: string | null;
  description: string | null;
  category: string | null;
  probability: number | null;
  impact: number | null;
  risk_score: number | null;
  risk_level: string | null;
  strategy: string | null;
  mitigation_plan: string | null;
  contingency_plan: string | null;
  fallback_plan: string | null;
  owner_id: string | null;
  action_owner_id: string | null;
  status: string | null;
  potential_impacts: PotentialImpacts | null;
}

export interface CreateRiskInput {
  taskId: string;
  riskNumber?: string;
  title: string;
  description?: string;
  category: RiskItem['category'];
  probability: number;
  impact: number;
  riskScore: number;
  riskLevel: RiskLevel;
  strategy: RiskStrategy;
  mitigationPlan?: string;
  contingencyPlan?: string;
  fallbackPlan?: string;
  ownerId: string;
  actionOwnerId?: string;
  status: RiskStatus;
  potentialImpacts?: PotentialImpacts;
}

export interface UpdateMitigationInput {
  taskId: string;
  riskId: string;
  mitigationPlan?: string;
  contingencyPlan?: string;
  fallbackPlan?: string;
  actions?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class TaskRiskRepository {
  private readonly supabase = inject(SupabaseService);

  async createRisk(input: CreateRiskInput): Promise<RiskItem> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_risks')
      .insert({
        task_id: input.taskId,
        risk_number: input.riskNumber ?? '',
        title: input.title,
        description: input.description ?? '',
        category: input.category,
        probability: input.probability,
        impact: input.impact,
        risk_score: input.riskScore,
        risk_level: input.riskLevel,
        strategy: input.strategy,
        mitigation_plan: input.mitigationPlan ?? '',
        contingency_plan: input.contingencyPlan ?? '',
        fallback_plan: input.fallbackPlan ?? '',
        owner_id: input.ownerId,
        action_owner_id: input.actionOwnerId ?? null,
        status: input.status,
        potential_impacts: input.potentialImpacts ?? {
          cost: 0,
          schedule: 0,
          quality: '',
          safety: '',
          reputation: ''
        }
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create risk: ${error.message}`);
    }

    return this.mapRiskRow(data as RiskDbRow);
  }

  async updateMitigation(input: UpdateMitigationInput): Promise<void> {
    const { error } = await this.supabase.client
      .from('blueprint_task_risks')
      .update({
        mitigation_plan: input.mitigationPlan ?? '',
        contingency_plan: input.contingencyPlan ?? '',
        fallback_plan: input.fallbackPlan ?? '',
        actions: input.actions ? JSON.stringify(input.actions) : null
      })
      .eq('id', input.riskId)
      .eq('task_id', input.taskId);

    if (error) {
      throw new Error(`Failed to update risk mitigation: ${error.message}`);
    }
  }

  async listRisks(taskId: string): Promise<RiskItem[]> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_risks')
      .select('*')
      .eq('task_id', taskId)
      .order('risk_score', { ascending: false });

    if (error) {
      throw new Error(`Failed to list risks: ${error.message}`);
    }

    return (data as RiskDbRow[]).map(row => this.mapRiskRow(row));
  }

  async getRiskSnapshot(taskId: string): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').select('risk_data').eq('id', taskId).maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch risk snapshot: ${error.message}`);
    }

    return (data?.risk_data as Record<string, unknown> | undefined) ?? null;
  }

  async updateRiskSnapshot(taskId: string, snapshot: Record<string, unknown> | null): Promise<void> {
    const { error } = await this.supabase.client.from('blueprint_tasks').update({ risk_data: snapshot }).eq('id', taskId);

    if (error) {
      throw new Error(`Failed to update risk snapshot: ${error.message}`);
    }
  }

  private mapRiskRow(row: RiskDbRow): RiskItem {
    return {
      id: row.id,
      riskNumber: row.risk_number ?? '',
      title: row.title ?? '',
      description: row.description ?? '',
      category: (row.category as RiskItem['category']) ?? 'technical',
      probability: Number(row.probability ?? 0),
      impact: Number(row.impact ?? 0),
      riskScore: Number(row.risk_score ?? 0),
      riskLevel: (row.risk_level as RiskLevel) ?? 'low',
      potentialImpacts: row.potential_impacts ?? {
        cost: 0,
        schedule: 0,
        quality: '',
        safety: '',
        reputation: ''
      },
      strategy: (row.strategy as RiskStrategy) ?? 'accept',
      mitigationPlan: row.mitigation_plan ?? undefined,
      contingencyPlan: row.contingency_plan ?? undefined,
      fallbackPlan: row.fallback_plan ?? undefined,
      owner: row.owner_id ?? '',
      actionOwner: row.action_owner_id ?? undefined,
      status: (row.status as RiskStatus) ?? 'identified'
    };
  }
}
