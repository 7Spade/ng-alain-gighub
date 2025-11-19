import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';

export interface TaskChangeDbRecord {
  id: string;
  task_id: string;
  change_number: string | null;
  type: string;
  title: string | null;
  description: string | null;
  impact: Record<string, unknown> | null;
  status: string | null;
  priority: string | null;
  submitted_date: string | null;
  submitted_by: string | null;
  approved_by: string | null;
  approved_date: string | null;
  rejected_by: string | null;
  rejected_date: string | null;
  rejected_reason: string | null;
  implementation_date: string | null;
  implemented_by: string | null;
  verified_date: string | null;
  verified_by: string | null;
  alternatives: unknown;
  related_changes: unknown;
  attachments: unknown;
  [column: string]: unknown;
}

export interface CreateTaskChangeInput {
  taskId: string;
  changeNumber?: string | null;
  type: string;
  title?: string | null;
  description?: string | null;
  impact?: Record<string, unknown> | null;
  status?: string | null;
  priority?: string | null;
  submittedDate?: Date | string | null;
  submittedBy?: string | null;
  approvedBy?: string | null;
  approvedDate?: Date | string | null;
  rejectedBy?: string | null;
  rejectedDate?: Date | string | null;
  rejectedReason?: string | null;
  implementationDate?: Date | string | null;
  implementedBy?: string | null;
  relatedChanges?: unknown;
  attachments?: unknown;
}

export interface UpdateTaskChangeInput {
  changeId: string;
  taskId: string;
  patch: Partial<Omit<CreateTaskChangeInput, 'taskId' | 'changeId'>>;
}

@Injectable({
  providedIn: 'root'
})
export class TaskChangeRepository {
  private readonly supabase = inject(SupabaseService);

  async createChange(input: CreateTaskChangeInput): Promise<TaskChangeDbRecord> {
    const payload = {
      task_id: input.taskId,
      change_number: input.changeNumber ?? '',
      type: input.type,
      title: input.title ?? '',
      description: input.description ?? '',
      impact: input.impact ?? null,
      status: input.status ?? 'draft',
      priority: input.priority ?? 'normal',
      submitted_date: this.serializeDate(input.submittedDate) ?? new Date().toISOString(),
      submitted_by: input.submittedBy ?? '',
      approved_by: input.approvedBy ?? null,
      approved_date: this.serializeDate(input.approvedDate),
      rejected_by: input.rejectedBy ?? null,
      rejected_date: this.serializeDate(input.rejectedDate),
      rejected_reason: input.rejectedReason ?? null,
      implementation_date: this.serializeDate(input.implementationDate),
      implemented_by: input.implementedBy ?? null,
      verified_date: null,
      verified_by: null,
      alternatives: null,
      related_changes: input.relatedChanges ?? [],
      attachments: input.attachments ?? []
    };

    const { data, error } = await this.supabase.client.from('blueprint_task_changes').insert(payload).select('*').single();

    if (error) {
      throw new Error(`Failed to create change request: ${error.message}`);
    }

    return data as TaskChangeDbRecord;
  }

  async updateChange(input: UpdateTaskChangeInput): Promise<void> {
    const updateData: Record<string, unknown> = {};
    const patch = input.patch;

    if (patch.changeNumber !== undefined) updateData['change_number'] = patch.changeNumber;
    if (patch.type !== undefined) updateData['type'] = patch.type;
    if (patch.title !== undefined) updateData['title'] = patch.title;
    if (patch.description !== undefined) updateData['description'] = patch.description;
    if (patch.impact !== undefined) updateData['impact'] = patch.impact;
    if (patch.status !== undefined) updateData['status'] = patch.status;
    if (patch.priority !== undefined) updateData['priority'] = patch.priority;
    if (patch.submittedDate !== undefined) updateData['submitted_date'] = this.serializeDate(patch.submittedDate);
    if (patch.submittedBy !== undefined) updateData['submitted_by'] = patch.submittedBy;
    if (patch.approvedBy !== undefined) updateData['approved_by'] = patch.approvedBy;
    if (patch.approvedDate !== undefined) updateData['approved_date'] = this.serializeDate(patch.approvedDate);
    if (patch.rejectedBy !== undefined) updateData['rejected_by'] = patch.rejectedBy;
    if (patch.rejectedDate !== undefined) updateData['rejected_date'] = this.serializeDate(patch.rejectedDate);
    if (patch.rejectedReason !== undefined) updateData['rejected_reason'] = patch.rejectedReason;
    if (patch.implementationDate !== undefined) updateData['implementation_date'] = this.serializeDate(patch.implementationDate);
    if (patch.implementedBy !== undefined) updateData['implemented_by'] = patch.implementedBy;
    if (patch.relatedChanges !== undefined) updateData['related_changes'] = patch.relatedChanges;
    if (patch.attachments !== undefined) updateData['attachments'] = patch.attachments;

    if (!Object.keys(updateData).length) {
      return;
    }

    const { error } = await this.supabase.client
      .from('blueprint_task_changes')
      .update(updateData)
      .eq('id', input.changeId)
      .eq('task_id', input.taskId);

    if (error) {
      throw new Error(`Failed to update change request: ${error.message}`);
    }
  }

  async getChangeById(taskId: string, changeId: string): Promise<TaskChangeDbRecord | null> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_changes')
      .select('*')
      .eq('id', changeId)
      .eq('task_id', taskId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch change request: ${error.message}`);
    }

    return (data as TaskChangeDbRecord | null) ?? null;
  }

  async listChanges(taskId: string): Promise<TaskChangeDbRecord[]> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_changes')
      .select('*')
      .eq('task_id', taskId)
      .order('submitted_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      if (typeof error.message === 'string' && error.message.includes('submitted_date')) {
        const retry = await this.supabase.client.from('blueprint_task_changes').select('*').eq('task_id', taskId);
        if (retry.error) {
          if (retry.error.code === 'PGRST116') {
            return [];
          }
          throw new Error(`Failed to get changes: ${retry.error.message}`);
        }
        return (retry.data as TaskChangeDbRecord[]) ?? [];
      }
      if (error.code === 'PGRST116') {
        return [];
      }
      throw new Error(`Failed to get changes: ${error.message}`);
    }

    return (data as TaskChangeDbRecord[]) ?? [];
  }

  async mutateChangeData(taskId: string, updater: (changes: any[]) => any[]): Promise<void> {
    const currentData = await this.getLegacyChangeData(taskId);
    const changeData = (currentData ?? {}) as Record<string, unknown>;
    const management = (changeData['management'] as Record<string, unknown> | undefined) ?? {};
    const changes = (management['changes'] as any[]) ?? [];
    const updatedChanges = updater(changes);

    const { error } = await this.supabase.client
      .from('blueprint_tasks')
      .update({
        change_data: {
          ...changeData,
          management: {
            ...management,
            changes: updatedChanges
          }
        }
      })
      .eq('id', taskId);

    if (error) {
      throw new Error(`Failed to update change data: ${error.message}`);
    }
  }

  async getLegacyChangeData(taskId: string): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').select('change_data').eq('id', taskId).maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch change data: ${error.message}`);
    }

    return (data?.change_data as Record<string, unknown> | undefined) ?? null;
  }

  async clearLegacyChangeData(taskId: string): Promise<void> {
    const { error } = await this.supabase.client.from('blueprint_tasks').update({ change_data: null }).eq('id', taskId);

    if (error) {
      throw new Error(`Failed to clear change data: ${error.message}`);
    }
  }

  private serializeDate(value: Date | string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof value === 'string' && value.length > 0) {
      return new Date(value).toISOString();
    }

    return null;
  }
}
