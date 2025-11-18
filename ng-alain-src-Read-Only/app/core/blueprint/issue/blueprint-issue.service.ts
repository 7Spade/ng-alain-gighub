/**
 * Blueprint Issue Service
 *
 * 藍圖問題追蹤服務
 *
 * 職責：
 * - 管理藍圖的問題追蹤（類似 JIRA Issues）
 * - 處理問題的創建、更新、分配、解決
 * - 支援問題狀態追蹤和優先級管理
 *
 * @see 表: blueprint_issues (14 個欄位)
 */

import { Injectable, inject } from '@angular/core';
import type { BlueprintIssue, CreateIssueInput, UpdateIssueInput } from '@shared';
import type { PostgrestError } from '@supabase/supabase-js';

import { ErrorStateService } from '../../net/error';
import { SupabaseService } from '../../supabase/supabase.service';

const TABLE_NAME = 'blueprint_issues';

type IssueStatus = BlueprintIssue['status'];
type IssuePriority = BlueprintIssue['priority'];
type IssueSeverity = BlueprintIssue['severity'];

interface BlueprintIssueFilters {
  status?: IssueStatus | IssueStatus[];
  priority?: IssuePriority | IssuePriority[];
  severity?: IssueSeverity | IssueSeverity[];
  assignedTo?: string | null | Array<string | null>;
  reporterId?: string | string[];
  labels?: string[];
  dueBefore?: string;
  dueAfter?: string;
  search?: string;
}

interface BlueprintIssueRow {
  id: string;
  blueprint_id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  assigned_to: string | null;
  reporter_id: string;
  labels: string[] | null;
  due_date: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlueprintIssueService {
  private readonly supabase = inject(SupabaseService);
  private readonly errorService = inject(ErrorStateService);

  async getIssues(blueprintId: string, filters: BlueprintIssueFilters = {}): Promise<{ data: BlueprintIssue[]; error: Error | null }> {
    try {
      const query = this.applyFilters(this.baseQuery(blueprintId), filters);
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: this.handlePostgrestError(error, 'BlueprintIssueService.getIssues', { blueprintId, filters }) };
      }

      const issues = (data ?? []).map(row => this.mapRowToIssue(row as BlueprintIssueRow));
      return { data: issues, error: null };
    } catch (error) {
      return { data: [], error: this.handleUnknownError(error, 'BlueprintIssueService.getIssues', { blueprintId, filters }) };
    }
  }

  async getIssueById(issueId: string): Promise<{ data: BlueprintIssue | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client.from(TABLE_NAME).select('*').eq('id', issueId).single();

      if (error) {
        return {
          data: null,
          error: this.handlePostgrestError(error, 'BlueprintIssueService.getIssueById', { issueId }, true)
        };
      }

      if (!data) {
        return { data: null, error: null };
      }

      return { data: this.mapRowToIssue(data as BlueprintIssueRow), error: null };
    } catch (error) {
      return { data: null, error: this.handleUnknownError(error, 'BlueprintIssueService.getIssueById', { issueId }) };
    }
  }

  async createIssue(input: CreateIssueInput): Promise<{ data: BlueprintIssue | null; error: Error | null }> {
    try {
      const reporterId = await this.resolveReporterId(input.reporter_id);
      if (!reporterId) {
        const error = new Error('Reporter not authenticated');
        this.errorService.addError({
          type: 'permission',
          severity: 'error',
          message: '建立問題失敗',
          details: '必須登入才能建立問題',
          source: 'BlueprintIssueService.createIssue',
          retryable: false
        });
        return { data: null, error };
      }

      const payload = this.buildInsertPayload({
        ...input,
        reporter_id: reporterId
      });

      const { data, error } = await this.supabase.client.from(TABLE_NAME).insert(payload).select().single();

      if (error) {
        return {
          data: null,
          error: this.handlePostgrestError(error, 'BlueprintIssueService.createIssue', { input })
        };
      }

      return { data: this.mapRowToIssue(data as BlueprintIssueRow), error: null };
    } catch (error) {
      return { data: null, error: this.handleUnknownError(error, 'BlueprintIssueService.createIssue', { input }) };
    }
  }

  async updateIssue(issueId: string, updates: UpdateIssueInput): Promise<{ data: BlueprintIssue | null; error: Error | null }> {
    try {
      const payload = this.buildUpdatePayload(updates);

      if (Object.keys(payload).length === 0) {
        return this.getIssueById(issueId);
      }

      const { data, error } = await this.supabase.client.from(TABLE_NAME).update(payload).eq('id', issueId).select().single();

      if (error) {
        return {
          data: null,
          error: this.handlePostgrestError(error, 'BlueprintIssueService.updateIssue', { issueId, updates })
        };
      }

      return { data: this.mapRowToIssue(data as BlueprintIssueRow), error: null };
    } catch (error) {
      return { data: null, error: this.handleUnknownError(error, 'BlueprintIssueService.updateIssue', { issueId, updates }) };
    }
  }

  async deleteIssue(issueId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.client.from(TABLE_NAME).delete().eq('id', issueId);

      if (error) {
        return {
          error: this.handlePostgrestError(error, 'BlueprintIssueService.deleteIssue', { issueId })
        };
      }

      return { error: null };
    } catch (error) {
      return { error: this.handleUnknownError(error, 'BlueprintIssueService.deleteIssue', { issueId }) };
    }
  }

  async assignIssue(issueId: string, userId: string | null): Promise<{ data: BlueprintIssue | null; error: Error | null }> {
    return this.updateIssue(issueId, { assigned_to: userId });
  }

  async resolveIssue(issueId: string): Promise<{ data: BlueprintIssue | null; error: Error | null }> {
    return this.updateIssue(issueId, {
      status: 'resolved',
      resolved_at: new Date().toISOString()
    });
  }

  async reopenIssue(issueId: string): Promise<{ data: BlueprintIssue | null; error: Error | null }> {
    return this.updateIssue(issueId, {
      status: 'open',
      resolved_at: null
    });
  }

  async updateIssueStatus(issueId: string, status: IssueStatus): Promise<{ data: BlueprintIssue | null; error: Error | null }> {
    const resolvedAt = status === 'resolved' || status === 'closed' ? new Date().toISOString() : null;
    return this.updateIssue(issueId, {
      status,
      resolved_at: resolvedAt
    });
  }

  async getIssuesByStatus(
    blueprintId: string,
    status: IssueStatus | IssueStatus[]
  ): Promise<{ data: BlueprintIssue[]; error: Error | null }> {
    return this.getIssues(blueprintId, { status });
  }

  async getIssuesByPriority(
    blueprintId: string,
    priority: IssuePriority | IssuePriority[]
  ): Promise<{ data: BlueprintIssue[]; error: Error | null }> {
    return this.getIssues(blueprintId, { priority });
  }

  async getIssuesBySeverity(
    blueprintId: string,
    severity: IssueSeverity | IssueSeverity[]
  ): Promise<{ data: BlueprintIssue[]; error: Error | null }> {
    return this.getIssues(blueprintId, { severity });
  }

  async getIssuesByAssignee(blueprintId: string, userId: string | null): Promise<{ data: BlueprintIssue[]; error: Error | null }> {
    return this.getIssues(blueprintId, { assignedTo: userId });
  }

  async getIssuesByReporter(blueprintId: string, userId: string): Promise<{ data: BlueprintIssue[]; error: Error | null }> {
    return this.getIssues(blueprintId, { reporterId: userId });
  }

  async getOverdueIssues(blueprintId: string): Promise<{ data: BlueprintIssue[]; error: Error | null }> {
    try {
      const nowIso = new Date().toISOString();
      const { data, error } = await this.supabase.client
        .from(TABLE_NAME)
        .select('*')
        .eq('blueprint_id', blueprintId)
        .lt('due_date', nowIso)
        .not('status', 'in', '("resolved","closed")')
        .order('due_date', { ascending: true });

      if (error) {
        return {
          data: [],
          error: this.handlePostgrestError(error, 'BlueprintIssueService.getOverdueIssues', { blueprintId })
        };
      }

      const issues = (data ?? []).map(row => this.mapRowToIssue(row as BlueprintIssueRow));
      return { data: issues, error: null };
    } catch (error) {
      return { data: [], error: this.handleUnknownError(error, 'BlueprintIssueService.getOverdueIssues', { blueprintId }) };
    }
  }

  private baseQuery(blueprintId: string) {
    return this.supabase.client.from(TABLE_NAME).select('*').eq('blueprint_id', blueprintId);
  }

  private applyFilters(query: ReturnType<BlueprintIssueService['baseQuery']>, filters: BlueprintIssueFilters) {
    let builder = query;

    if (filters.status !== undefined) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      builder = builder.in('status', statuses);
    }

    if (filters.priority !== undefined) {
      const priorities = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
      builder = builder.in('priority', priorities);
    }

    if (filters.severity !== undefined) {
      const severities = Array.isArray(filters.severity) ? filters.severity : [filters.severity];
      builder = builder.in('severity', severities);
    }

    if (filters.assignedTo !== undefined) {
      if (filters.assignedTo === null) {
        builder = builder.is('assigned_to', null);
      } else if (Array.isArray(filters.assignedTo)) {
        const values = filters.assignedTo.filter((value): value is string => value !== null);
        const includeNull = filters.assignedTo.includes(null);
        if (values.length > 0 && includeNull) {
          const valueList = values.map(v => `"${v}"`).join(',');
          builder = builder.or(`assigned_to.is.null,assigned_to.in.(${valueList})`);
        } else if (values.length > 0) {
          builder = builder.in('assigned_to', values);
        } else if (includeNull) {
          builder = builder.is('assigned_to', null);
        }
      } else {
        builder = builder.eq('assigned_to', filters.assignedTo);
      }
    }

    if (filters.reporterId !== undefined) {
      const reporterIds = Array.isArray(filters.reporterId) ? filters.reporterId : [filters.reporterId];
      builder = builder.in('reporter_id', reporterIds);
    }

    if (filters.labels && filters.labels.length > 0) {
      builder = builder.contains('labels', filters.labels);
    }

    if (filters.dueBefore) {
      builder = builder.lte('due_date', filters.dueBefore);
    }

    if (filters.dueAfter) {
      builder = builder.gte('due_date', filters.dueAfter);
    }

    if (filters.search && filters.search.trim().length > 0) {
      const keyword = filters.search.trim().replace(/"/g, '\\"');
      builder = builder.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
    }

    return builder;
  }

  private mapRowToIssue(row: BlueprintIssueRow): BlueprintIssue {
    return {
      id: row.id,
      blueprint_id: row.blueprint_id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      severity: row.severity,
      assigned_to: row.assigned_to ?? null,
      reporter_id: row.reporter_id,
      labels: row.labels ?? [],
      due_date: row.due_date ?? null,
      resolved_at: row.resolved_at ?? null,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  private buildInsertPayload(input: CreateIssueInput & { reporter_id: string }): Record<string, unknown> {
    const status: IssueStatus = input.status ?? 'open';
    const priority: IssuePriority = input.priority ?? 'medium';
    const severity: IssueSeverity = input.severity ?? 'medium';
    const resolvedAt =
      status === 'resolved' || status === 'closed' ? (input.resolved_at ?? new Date().toISOString()) : (input.resolved_at ?? null);

    return {
      blueprint_id: input.blueprint_id,
      title: input.title,
      description: input.description,
      status,
      priority,
      severity,
      assigned_to: input.assigned_to ?? null,
      reporter_id: input.reporter_id,
      labels: input.labels ?? [],
      due_date: input.due_date ?? null,
      resolved_at: resolvedAt
    };
  }

  private buildUpdatePayload(updates: UpdateIssueInput): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    if (updates.title !== undefined) payload['title'] = updates.title;
    if (updates.description !== undefined) payload['description'] = updates.description;

    if (updates.status !== undefined) {
      payload['status'] = updates.status;
      if (updates.status === 'resolved' || updates.status === 'closed') {
        payload['resolved_at'] = updates.resolved_at ?? new Date().toISOString();
      } else {
        payload['resolved_at'] = updates.resolved_at ?? null;
      }
    } else if (updates.resolved_at !== undefined) {
      payload['resolved_at'] = updates.resolved_at;
    }

    if (updates.priority !== undefined) payload['priority'] = updates.priority;
    if (updates.severity !== undefined) payload['severity'] = updates.severity;
    if (updates.assigned_to !== undefined) payload['assigned_to'] = updates.assigned_to;
    if (updates.labels !== undefined) payload['labels'] = updates.labels;
    if (updates.due_date !== undefined) payload['due_date'] = updates.due_date;

    return payload;
  }

  private async resolveReporterId(explicitReporterId?: string): Promise<string | null> {
    if (explicitReporterId) {
      return explicitReporterId;
    }

    const {
      data: { user }
    } = await this.supabase.client.auth.getUser();

    return user?.id ?? null;
  }

  private handlePostgrestError(error: PostgrestError, source: string, metadata?: Record<string, unknown>, retryable = false): Error {
    const wrappedError = new Error(error.message);
    this.errorService.addError({
      type: 'http',
      severity: 'error',
      message: '問題追蹤操作失敗',
      details: error.message ?? 'Supabase 查詢失敗',
      source,
      retryable,
      metadata
    });
    return wrappedError;
  }

  private handleUnknownError(error: unknown, source: string, metadata?: Record<string, unknown>): Error {
    const wrappedError = error instanceof Error ? error : new Error('發生未知錯誤');
    this.errorService.addError({
      type: 'unknown',
      severity: 'error',
      message: '問題追蹤操作失敗',
      details: wrappedError.message,
      source,
      retryable: false,
      metadata
    });
    return wrappedError;
  }
}
