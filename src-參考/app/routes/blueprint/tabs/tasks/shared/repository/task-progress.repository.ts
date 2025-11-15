import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';

export type TaskProgressHistoryStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled' | 'blocked' | 'on-hold';

export interface ProgressSnapshotRecord {
  unit: string;
  planned: number;
  installed: number;
  used: number;
  lastUpdatedAt?: string;
}

export interface ProgressHistoryRecord {
  id: string;
  taskId: string;
  recordedAt: Date;
  recordedBy: string | null;
  source: string | null;
  percentage: number;
  status: TaskProgressHistoryStatus;
  previousStatus: TaskProgressHistoryStatus | null;
  snapshot: ProgressSnapshotRecord;
  notes: string | null;
}

interface InsertProgressInput {
  taskId: string;
  recordedAt: Date;
  recordedBy: string | null;
  source: string | null;
  percentage: number;
  status: TaskProgressHistoryStatus;
  previousStatus: TaskProgressHistoryStatus | null;
  snapshot: ProgressSnapshotRecord;
  notes: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskProgressRepository {
  private readonly supabase = inject(SupabaseService);

  async insert(record: InsertProgressInput): Promise<ProgressHistoryRecord> {
    const payload = {
      task_id: record.taskId,
      recorded_at: record.recordedAt.toISOString(),
      recorded_by: record.recordedBy ?? null,
      source: record.source,
      percentage: record.percentage,
      status: record.status,
      previous_status: record.previousStatus,
      snapshot: {
        ...record.snapshot,
        lastUpdatedAt: record.snapshot.lastUpdatedAt ?? record.recordedAt.toISOString()
      },
      notes: record.notes
    };

    const { data, error } = await this.supabase.client.from('blueprint_task_progress_history').insert(payload).select().single();

    if (error) {
      throw new Error(`Failed to insert task progress history: ${error.message}`);
    }

    return this.mapRow(data);
  }

  async getLatest(taskId: string): Promise<ProgressHistoryRecord | null> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_progress_history')
      .select('*')
      .eq('task_id', taskId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch latest task progress: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.mapRow(data);
  }

  async getHistory(taskId: string, limit = 50): Promise<ProgressHistoryRecord[]> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_progress_history')
      .select('*')
      .eq('task_id', taskId)
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch task progress history: ${error.message}`);
    }

    if (!data?.length) {
      return [];
    }

    return data.map(row => this.mapRow(row)).reverse();
  }

  async getLatestMap(taskIds: string[]): Promise<Map<string, ProgressHistoryRecord>> {
    if (!taskIds.length) {
      return new Map();
    }

    const { data, error } = await this.supabase.client
      .from('blueprint_task_progress_history')
      .select('*')
      .in('task_id', taskIds)
      .order('task_id', { ascending: true })
      .order('recorded_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch progress history for tasks: ${error.message}`);
    }

    const map = new Map<string, ProgressHistoryRecord>();
    for (const row of data ?? []) {
      const record = this.mapRow(row);
      if (!map.has(record.taskId)) {
        map.set(record.taskId, record);
      }
    }
    return map;
  }

  async deleteByTaskIds(taskIds: string[]): Promise<void> {
    if (!taskIds.length) {
      return;
    }

    const { error } = await this.supabase.client.from('blueprint_task_progress_history').delete().in('task_id', taskIds);

    if (error) {
      throw new Error(`Failed to delete progress history: ${error.message}`);
    }
  }

  async deleteByTaskId(taskId: string): Promise<void> {
    await this.deleteByTaskIds([taskId]);
  }

  async updateTaskProgressMeta(taskId: string, patch: Record<string, unknown>): Promise<void> {
    const { error } = await this.supabase.client.from('blueprint_tasks').update(patch).eq('id', taskId);

    if (error) {
      throw new Error(`Failed to update task progress meta: ${error.message}`);
    }
  }

  async clearTaskProgressMeta(taskId: string): Promise<void> {
    await this.updateTaskProgressMeta(taskId, {
      progress_percentage: null,
      progress_calculation_method: null,
      progress_data: null,
      previous_status: null,
      status_changed_at: null,
      status_changed_by: null,
      updated_at: new Date().toISOString()
    });
  }

  private mapRow(row: any): ProgressHistoryRecord {
    return {
      id: row.id as string,
      taskId: row.task_id as string,
      recordedAt: new Date(row.recorded_at as string),
      recordedBy: (row.recorded_by as string | null) ?? null,
      source: (row.source as string | null) ?? null,
      percentage: Number(row.percentage ?? 0),
      status: (row.status as TaskProgressHistoryStatus) ?? 'todo',
      previousStatus: (row.previous_status as TaskProgressHistoryStatus | null) ?? null,
      snapshot: (row.snapshot as ProgressSnapshotRecord) ?? {
        unit: 'item',
        planned: 1,
        installed: 0,
        used: 0
      },
      notes: (row.notes as string | null) ?? null
    };
  }
}
