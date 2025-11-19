import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import type { TaskIdentityComplete } from '@models';

export interface TaskIdentityDbRecord {
  id: string;
  blueprint_id: string;
  code: string;
  version: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_archived: boolean;
  archived_at?: string | null;
  archived_by?: string | null;
  title?: string;
  description?: string;
  notes?: string;
  tags?: string[];
  category?: string;
  subcategory?: string;
  work_type?: string;
  discipline?: string;
  contractor_id?: string;
  subcontractor_id?: string;
  client_reference?: string;
  parent_id?: string | null;
  level?: number;
  path?: string;
  sort_order?: number;
  is_leaf?: boolean;
  is_expandable?: boolean;
  children_count?: number;
  status?: string;
  priority?: string;
  assigned_to?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskIdentityRepository {
  private readonly supabase = inject(SupabaseService);

  async generateTaskCode(parentId: string | null, blueprintId: string): Promise<string> {
    if (!parentId) {
      const { data, error } = await this.supabase.client
        .from('blueprint_tasks')
        .select('code')
        .eq('blueprint_id', blueprintId)
        .is('parent_id', null)
        .is('is_archived', false)
        .order('code', { ascending: false })
        .limit(1);

      if (error) {
        throw new Error(`Failed to generate task code: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return '10';
      }

      const lastCode = (data[0] as { code: string }).code;
      const lastNumber = Number.parseInt(lastCode, 10);
      return (lastNumber + 10).toString();
    }

    const { data: parentData, error: parentError } = await this.supabase.client
      .from('blueprint_tasks')
      .select('code, id')
      .eq('id', parentId)
      .single();

    if (parentError || !parentData) {
      throw new Error(`Failed to find parent task: ${parentError?.message ?? 'Parent not found'}`);
    }

    const parentCode = (parentData as { code: string }).code;
    const { data: siblings, error: siblingsError } = await this.supabase.client
      .from('blueprint_tasks')
      .select('code')
      .eq('parent_id', parentId)
      .is('is_archived', false)
      .order('code', { ascending: false })
      .limit(1);

    if (siblingsError) {
      throw new Error(`Failed to generate task code: ${siblingsError.message}`);
    }

    if (!siblings || siblings.length === 0) {
      return `${parentCode}.1`;
    }

    const lastSiblingCode = (siblings[0] as { code: string }).code;
    const parts = lastSiblingCode.split('.');
    const lastPart = Number.parseInt(parts[parts.length - 1], 10);
    return `${parentCode}.${lastPart + 1}`;
  }

  async insertTask(record: Partial<TaskIdentityDbRecord>): Promise<TaskIdentityDbRecord> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').insert(record).select().single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return data as TaskIdentityDbRecord;
  }

  async updateTask(id: string, updates: Partial<TaskIdentityDbRecord>): Promise<TaskIdentityDbRecord> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').update(updates).eq('id', id).select().single();

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return data as TaskIdentityDbRecord;
  }

  async getTaskById(id: string): Promise<TaskIdentityDbRecord | null> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').select('*').eq('id', id).single();

    if (error) {
      if ((error as { code?: string }).code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to get task: ${error.message}`);
    }

    return (data as TaskIdentityDbRecord) ?? null;
  }

  async archiveTask(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('blueprint_tasks')
      .update({
        is_archived: true,
        archived_at: new Date().toISOString(),
        archived_by: userId,
        updated_at: new Date().toISOString(),
        updated_by: userId
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  async restoreTask(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('blueprint_tasks')
      .update({
        is_archived: false,
        archived_at: null,
        archived_by: null,
        updated_at: new Date().toISOString(),
        updated_by: userId
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to restore task: ${error.message}`);
    }
  }

  async listByBlueprint(
    blueprintId: string,
    options: {
      includeArchived?: boolean;
      taskIds?: string[];
      orderBy?: keyof TaskIdentityDbRecord;
      ascending?: boolean;
    } = {}
  ): Promise<TaskIdentityDbRecord[]> {
    const { includeArchived = false, taskIds, orderBy = 'sort_order', ascending = true } = options;
    let query = this.supabase.client.from('blueprint_tasks').select('*').eq('blueprint_id', blueprintId);

    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }

    if (taskIds?.length) {
      query = query.in('id', taskIds);
    }

    const { data, error } = await query.order(orderBy as string, { ascending });

    if (error) {
      throw new Error(`Failed to list tasks: ${error.message}`);
    }

    return (data as TaskIdentityDbRecord[]) ?? [];
  }

  async findChildren(parentId: string | null, options: { includeArchived?: boolean } = {}): Promise<TaskIdentityDbRecord[]> {
    const { includeArchived = false } = options;
    let query = this.supabase.client.from('blueprint_tasks').select('*');

    if (parentId === null) {
      query = query.is('parent_id', null);
    } else {
      query = query.eq('parent_id', parentId);
    }

    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }

    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch children: ${error.message}`);
    }

    return (data as TaskIdentityDbRecord[]) ?? [];
  }

  async countChildren(parentId: string): Promise<number> {
    const { count, error } = await this.supabase.client
      .from('blueprint_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('parent_id', parentId)
      .eq('is_archived', false);

    if (error) {
      throw new Error(`Failed to count children: ${error.message}`);
    }

    return count ?? 0;
  }

  convertFromDb(dbTask: TaskIdentityDbRecord | Record<string, any>): TaskIdentityComplete {
    const task = dbTask as TaskIdentityDbRecord;
    return {
      id: task.id,
      blueprintId: task.blueprint_id,
      code: task.code,
      version: task.version,
      createdAt: new Date(task.created_at),
      createdBy: task.created_by,
      updatedAt: new Date(task.updated_at),
      updatedBy: task.updated_by,
      isArchived: task.is_archived,
      archivedAt: task.archived_at ? new Date(task.archived_at) : undefined,
      archivedBy: task.archived_by ?? undefined,
      status: task.status as any,
      priority: task.priority as any,
      assignedTo: task.assigned_to ?? undefined,
      name: task.title ?? '',
      description: task.description ?? undefined,
      notes: task.notes ?? undefined,
      tags: task.tags ?? [],
      category: task.category ?? undefined,
      subcategory: task.subcategory ?? undefined,
      workType: task.work_type as any,
      discipline: task.discipline ?? undefined,
      contractorId: task.contractor_id ?? undefined,
      subcontractorId: task.subcontractor_id ?? undefined,
      clientReference: task.client_reference ?? undefined,
      parentId: task.parent_id ?? null,
      level: task.level ?? 1,
      path: task.path ?? task.code,
      sortOrder: task.sort_order ?? 0,
      isLeaf: task.is_leaf ?? true,
      isExpandable: task.is_expandable ?? true,
      childrenCount: task.children_count ?? 0
    };
  }

  convertToDb(task: Partial<TaskIdentityComplete>): Partial<TaskIdentityDbRecord> {
    const dbTask: Partial<TaskIdentityDbRecord> = {};

    if (task.id !== undefined) dbTask.id = task.id;
    if (task.code !== undefined) dbTask.code = task.code;
    if (task.version !== undefined) dbTask.version = task.version;
    if (task.createdAt !== undefined) dbTask.created_at = task.createdAt.toISOString();
    if (task.createdBy !== undefined) dbTask.created_by = task.createdBy;
    if (task.updatedAt !== undefined) dbTask.updated_at = task.updatedAt.toISOString();
    if (task.updatedBy !== undefined) dbTask.updated_by = task.updatedBy;
    if (task.isArchived !== undefined) dbTask.is_archived = task.isArchived;
    if (task.archivedAt !== undefined) dbTask.archived_at = task.archivedAt?.toISOString();
    if (task.archivedBy !== undefined) dbTask.archived_by = task.archivedBy;
    if (task.name !== undefined) dbTask.title = task.name;
    if (task.description !== undefined) dbTask.description = task.description;
    if (task.notes !== undefined) dbTask.notes = task.notes;
    if (task.tags !== undefined) dbTask.tags = task.tags;
    if (task.category !== undefined) dbTask.category = task.category;
    if (task.subcategory !== undefined) dbTask.subcategory = task.subcategory;
    if (task.workType !== undefined) dbTask.work_type = task.workType;
    if (task.discipline !== undefined) dbTask.discipline = task.discipline;
    if (task.contractorId !== undefined) dbTask.contractor_id = task.contractorId;
    if (task.subcontractorId !== undefined) dbTask.subcontractor_id = task.subcontractorId;
    if (task.clientReference !== undefined) dbTask.client_reference = task.clientReference;
    if (task.parentId !== undefined) dbTask.parent_id = task.parentId;
    if (task.level !== undefined) dbTask.level = task.level;
    if (task.path !== undefined) dbTask.path = task.path;
    if (task.sortOrder !== undefined) dbTask.sort_order = task.sortOrder;
    if (task.isLeaf !== undefined) dbTask.is_leaf = task.isLeaf;
    if (task.isExpandable !== undefined) dbTask.is_expandable = task.isExpandable;
    if (task.childrenCount !== undefined) dbTask.children_count = task.childrenCount;
    if (task.status !== undefined) dbTask.status = task.status;
    if (task.priority !== undefined) dbTask.priority = task.priority;
    if (task.assignedTo !== undefined) dbTask.assigned_to = task.assignedTo;

    return dbTask;
  }
}
