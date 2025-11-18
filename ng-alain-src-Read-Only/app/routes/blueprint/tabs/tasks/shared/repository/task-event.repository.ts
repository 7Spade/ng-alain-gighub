import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';

export interface TaskEventRecord<TPayload = unknown> {
  id: string;
  taskId: string;
  eventType: string;
  facetType: string | null;
  parentId: string | null;
  payload: TPayload;
  metadata: Record<string, unknown>;
  occurredAt: Date;
  createdAt: Date;
  createdBy: string | null;
}

export interface InsertTaskEventInput<TPayload = unknown> {
  id?: string;
  taskId: string;
  eventType: string;
  facetType?: string | null;
  parentId?: string | null;
  payload: TPayload;
  metadata?: Record<string, unknown>;
  occurredAt?: Date;
  userId?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskEventRepository {
  private readonly supabase = inject(SupabaseService);

  async listEvents<TPayload = unknown>(
    taskId: string,
    options?: { facetType?: string; eventType?: string }
  ): Promise<Array<TaskEventRecord<TPayload>>> {
    let query = this.supabase.client.from('blueprint_task_events').select('*').eq('task_id', taskId);

    if (options?.facetType) {
      query = query.eq('facet_type', options.facetType);
    }

    if (options?.eventType) {
      query = query.eq('event_type', options.eventType);
    }

    query = query.order('occurred_at', { ascending: false }).order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch task events: ${error.message}`);
    }

    return (data ?? []).map(row => this.mapEventRow<TPayload>(row));
  }

  async listEventsByParentIds<TPayload = unknown>(
    parentIds: string[],
    options?: {
      facetType?: string;
      eventType?: string;
    }
  ): Promise<Array<TaskEventRecord<TPayload>>> {
    if (!parentIds.length) {
      return [];
    }

    let query = this.supabase.client.from('blueprint_task_events').select('*').in('parent_id', parentIds);

    if (options?.facetType) {
      query = query.eq('facet_type', options.facetType);
    }

    if (options?.eventType) {
      query = query.eq('event_type', options.eventType);
    }

    query = query.order('occurred_at', { ascending: true }).order('created_at', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch child task events: ${error.message}`);
    }

    return (data ?? []).map(row => this.mapEventRow<TPayload>(row));
  }

  async insertEvent<TPayload = unknown>(input: InsertTaskEventInput<TPayload>): Promise<TaskEventRecord<TPayload>> {
    const payload = {
      id: input.id,
      task_id: input.taskId,
      event_type: input.eventType,
      facet_type: input.facetType ?? null,
      parent_id: input.parentId ?? null,
      payload: input.payload,
      metadata: input.metadata ?? {},
      occurred_at: (input.occurredAt ?? new Date()).toISOString(),
      created_by: input.userId ?? null
    };

    const { data, error } = await this.supabase.client.from('blueprint_task_events').insert(payload).select('*').single();

    if (error) {
      throw new Error(`Failed to insert task event: ${error.message}`);
    }

    return this.mapEventRow<TPayload>(data);
  }

  async updateEvent<TPayload = unknown>(
    id: string,
    patch: {
      payload?: Partial<TPayload> | TPayload;
      metadata?: Record<string, unknown> | null;
      occurredAt?: Date;
      userId?: string | null;
    }
  ): Promise<TaskEventRecord<TPayload>> {
    const updates: Record<string, unknown> = {};

    if (patch.payload !== undefined) {
      updates['payload'] = patch.payload;
    }

    if (patch.metadata !== undefined) {
      updates['metadata'] = patch.metadata ?? {};
    }

    if (patch.occurredAt) {
      updates['occurred_at'] = patch.occurredAt.toISOString();
    }

    if (patch.userId !== undefined) {
      updates['created_by'] = patch.userId;
    }

    if (!Object.keys(updates).length) {
      const { data, error } = await this.supabase.client.from('blueprint_task_events').select('*').eq('id', id).single();

      if (error) {
        throw new Error(`Failed to fetch task event: ${error.message}`);
      }

      return this.mapEventRow<TPayload>(data);
    }

    const { data, error } = await this.supabase.client.from('blueprint_task_events').update(updates).eq('id', id).select('*').single();

    if (error) {
      throw new Error(`Failed to update task event: ${error.message}`);
    }

    return this.mapEventRow<TPayload>(data);
  }

  async deleteEventsByTaskIds(taskIds: string[], facetType?: string, eventType?: string): Promise<void> {
    if (!taskIds.length) {
      return;
    }

    let query = this.supabase.client.from('blueprint_task_events').delete().in('task_id', taskIds);
    if (facetType) {
      query = query.eq('facet_type', facetType);
    }

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    const { error } = await query;

    if (error) {
      throw new Error(`Failed to delete task events: ${error.message}`);
    }
  }

  async deleteEventById(id: string): Promise<void> {
    const { error } = await this.supabase.client.from('blueprint_task_events').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete task event: ${error.message}`);
    }
  }

  async getEventById<TPayload = unknown>(id: string): Promise<TaskEventRecord<TPayload> | null> {
    const { data, error } = await this.supabase.client.from('blueprint_task_events').select('*').eq('id', id).maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch task event: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.mapEventRow<TPayload>(data);
  }

  private mapEventRow<TPayload = unknown>(row: any): TaskEventRecord<TPayload> {
    return {
      id: row.id as string,
      taskId: row.task_id as string,
      eventType: row.event_type as string,
      facetType: (row.facet_type as string | null) ?? null,
      parentId: (row.parent_id as string | null) ?? null,
      payload: (row.payload as TPayload) ?? ({} as TPayload),
      metadata: (row.metadata as Record<string, unknown>) ?? {},
      occurredAt: row.occurred_at ? new Date(row.occurred_at) : new Date(),
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      createdBy: (row.created_by as string | null) ?? null
    };
  }
}
