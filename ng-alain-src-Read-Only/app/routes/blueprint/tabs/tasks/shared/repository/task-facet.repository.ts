import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';

export interface TaskFacetRecord<TPayload = unknown> {
  id: string;
  taskId: string;
  facetType: string;
  payload: TPayload;
  metadata: Record<string, unknown>;
  version: number;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
}

export interface UpsertTaskFacetInput<TPayload = unknown> {
  taskId: string;
  facetType: string;
  payload: TPayload;
  metadata?: Record<string, unknown>;
  userId?: string | null;
  version?: number;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskFacetRepository {
  private readonly supabase = inject(SupabaseService);

  async getFacet<TPayload = unknown>(taskId: string, facetType: string): Promise<TaskFacetRecord<TPayload> | null> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_facets')
      .select('*')
      .eq('task_id', taskId)
      .eq('facet_type', facetType)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch facet ${facetType} for task ${taskId}: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.mapFacetRow<TPayload>(data);
  }

  async upsertFacet<TPayload = unknown>(input: UpsertTaskFacetInput<TPayload>): Promise<TaskFacetRecord<TPayload>> {
    const timestamp = input.timestamp ?? new Date();
    const payload = {
      task_id: input.taskId,
      facet_type: input.facetType,
      payload: input.payload,
      metadata: input.metadata ?? {},
      version: input.version ?? 1,
      updated_at: timestamp.toISOString(),
      updated_by: input.userId ?? null
    };

    const { data, error } = await this.supabase.client
      .from('blueprint_task_facets')
      .upsert(payload, { onConflict: 'task_id,facet_type' })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to upsert facet ${input.facetType} for task ${input.taskId}: ${error.message}`);
    }

    return this.mapFacetRow<TPayload>(data);
  }

  async deleteFacetsByTaskIds(taskIds: string[], facetType?: string): Promise<void> {
    if (!taskIds.length) {
      return;
    }

    let query = this.supabase.client.from('blueprint_task_facets').delete().in('task_id', taskIds);
    if (facetType) {
      query = query.eq('facet_type', facetType);
    }

    const { error } = await query;

    if (error) {
      throw new Error(`Failed to delete facets: ${error.message}`);
    }
  }

  private mapFacetRow<TPayload = unknown>(row: any): TaskFacetRecord<TPayload> {
    return {
      id: row.id as string,
      taskId: row.task_id as string,
      facetType: row.facet_type as string,
      payload: (row.payload as TPayload) ?? ({} as TPayload),
      metadata: (row.metadata as Record<string, unknown>) ?? {},
      version: Number(row.version ?? 1),
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      createdBy: (row.created_by as string | null) ?? null,
      updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
      updatedBy: (row.updated_by as string | null) ?? null
    };
  }
}
