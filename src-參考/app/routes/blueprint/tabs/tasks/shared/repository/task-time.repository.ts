import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';

export interface TaskTimeDbRecord {
  id?: string;
  code?: string | null;
  title?: string | null;
  planned_start_date?: string | null;
  planned_end_date?: string | null;
  planned_duration?: number | null;
  planned_work_hours?: number | null;
  work_calendar_id?: string | null;
  working_days_per_week?: number | null;
  working_hours_per_day?: number | null;
  baseline_start?: string | null;
  baseline_end?: string | null;
  baseline_duration?: number | null;
  baseline_version?: number | null;
  baseline_date?: string | null;
  target_start_date?: string | null;
  target_end_date?: string | null;
  contract_start_date?: string | null;
  contract_end_date?: string | null;
  actual_start_date?: string | null;
  actual_end_date?: string | null;
  actual_duration?: number | null;
  actual_work_hours?: number | null;
  delay_days?: number | null;
  delay_reason?: string | null;
  delay_category?: string | null;
  delay_responsibility?: string | null;
  delay_impact?: string | null;
  earliest_start?: string | null;
  latest_start?: string | null;
  earliest_finish?: string | null;
  latest_finish?: string | null;
  total_float?: number | null;
  free_float?: number | null;
  is_critical_path?: boolean | null;
  criticality_index?: number | null;
  buffer_days?: number | null;
  drag_coefficient?: number | null;
  time_constraint_type?: string | null;
  time_constraint_date?: string | null;
  time_data?: any;
}

export interface TaskDependencyDbRecord {
  task_id: string;
  depends_on_task_id: string;
  dependency_type: string;
  lag_days: number | null;
  lag_unit: string | null;
}

export interface TaskRiskSummaryRecord {
  risk_level: string | null;
  risk_score: number | null;
  status: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskTimeRepository {
  private readonly supabase = inject(SupabaseService);

  async fetchTask(taskId: string, columns: string[]): Promise<TaskTimeDbRecord | null> {
    const selectClause = columns.join(', ');
    const { data, error } = await this.supabase.client.from('blueprint_tasks').select(selectClause).eq('id', taskId).maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch task ${taskId}: ${error.message}`);
    }

    return (data as TaskTimeDbRecord | null) ?? null;
  }

  async updateTask(taskId: string, updates: Record<string, unknown>): Promise<TaskTimeDbRecord> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').update(updates).eq('id', taskId).select('*').single();

    if (error) {
      throw new Error(`Failed to update task ${taskId}: ${error.message}`);
    }

    return data as TaskTimeDbRecord;
  }

  async listTaskIdsByBlueprint(blueprintId: string): Promise<string[]> {
    const { data, error } = await this.supabase.client
      .from('blueprint_tasks')
      .select('id')
      .eq('blueprint_id', blueprintId)
      .eq('is_archived', false);

    if (error) {
      throw new Error(`Failed to list tasks for blueprint ${blueprintId}: ${error.message}`);
    }

    return (data ?? []).map(row => row.id as string);
  }

  async listTasksByBlueprint(
    blueprintId: string,
    columns: string[],
    options: { onlyCritical?: boolean; includeArchived?: boolean } = {}
  ): Promise<TaskTimeDbRecord[]> {
    let query = this.supabase.client.from('blueprint_tasks').select(columns.join(', ')).eq('blueprint_id', blueprintId);

    if (!options.includeArchived) {
      query = query.eq('is_archived', false);
    }

    if (options.onlyCritical) {
      query = query.eq('is_critical_path', true);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list tasks for blueprint ${blueprintId}: ${error.message}`);
    }

    return (data as TaskTimeDbRecord[]) ?? [];
  }

  async listDependenciesByTask(taskId: string): Promise<TaskDependencyDbRecord[]> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_dependencies')
      .select('task_id, depends_on_task_id, dependency_type, lag_days, lag_unit')
      .eq('task_id', taskId);

    if (error) {
      throw new Error(`Failed to fetch dependencies for task ${taskId}: ${error.message}`);
    }

    return (data as TaskDependencyDbRecord[]) ?? [];
  }

  async listDependenciesByDependsOn(taskId: string): Promise<TaskDependencyDbRecord[]> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_dependencies')
      .select('task_id, depends_on_task_id, dependency_type, lag_days, lag_unit')
      .eq('depends_on_task_id', taskId);

    if (error) {
      throw new Error(`Failed to fetch successor dependencies for task ${taskId}: ${error.message}`);
    }

    return (data as TaskDependencyDbRecord[]) ?? [];
  }

  async listRiskSummaries(taskId: string): Promise<TaskRiskSummaryRecord[]> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_risks')
      .select('risk_level, risk_score, status')
      .eq('task_id', taskId)
      .neq('status', 'closed');

    if (error) {
      throw new Error(`Failed to fetch risk summary for task ${taskId}: ${error.message}`);
    }

    return (data as TaskRiskSummaryRecord[]) ?? [];
  }

  async updateTaskFlags(taskId: string, patch: Record<string, unknown>): Promise<void> {
    const { error } = await this.supabase.client.from('blueprint_tasks').update(patch).eq('id', taskId);

    if (error) {
      throw new Error(`Failed to update task flags for ${taskId}: ${error.message}`);
    }
  }

  async updateMultipleTasks(updates: Array<{ id: string; patch: Record<string, unknown> }>): Promise<void> {
    for (const update of updates) {
      await this.updateTaskFlags(update.id, update.patch);
    }
  }
}
