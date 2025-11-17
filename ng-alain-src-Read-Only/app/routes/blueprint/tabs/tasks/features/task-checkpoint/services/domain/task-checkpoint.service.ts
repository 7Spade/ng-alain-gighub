/**
 * Task Checkpoint Service
 *
 * 任務檢查點管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：F. 進度維度（檢查點部分）
 *
 * 職責：
 * - 管理任務檢查點（checklist、驗收、簽核）
 * - 處理檢查點依賴關係
 * - 管理檢查點狀態與簽名
 * - 追蹤檢查點歷史記錄
 *
 * @see @ETMS_DESIGN_SPEC.md F. 進度維度
 * @see 表: blueprint_task_checkpoints (21 個欄位)
 */

import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import type { Checkpoint, CheckpointItem, CheckpointSignature, CheckpointStatus } from '@models';

type DbCheckpointStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';

interface DbCheckpointRow {
  id: string;
  task_id: string;
  name: string;
  description: string | null;
  sequence: number;
  depends_on_checkpoints: string[] | null;
  status: DbCheckpointStatus;
  inspector_id: string | null;
  approver_id: string | null;
  witnesses: string[] | null;
  scheduled_date: string | null;
  actual_date: string | null;
  duration: number | null;
  checklist: unknown;
  findings: unknown;
  defects: unknown;
  corrective_actions: unknown;
  signatures: unknown;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
}

export interface CreateCheckpointInput {
  name: string;
  description?: string;
  sequence: number;
  dependsOn?: string[];
  status?: CheckpointStatus;
  inspector?: string | null;
  approver?: string | null;
  witnesses?: string[];
  scheduledDate?: Date | null;
  actualDate?: Date | null;
  duration?: number | null;
  checklist?: CheckpointItem[];
  findings?: Record<string, unknown> | null;
  defects?: Record<string, unknown> | null;
  correctiveActions?: Record<string, unknown> | null;
  signatures?: CheckpointSignature[];
  createdBy: string;
}

export interface UpdateCheckpointInput {
  name?: string;
  description?: string;
  status?: CheckpointStatus;
  inspector?: string | null;
  approver?: string | null;
  witnesses?: string[];
  dependsOn?: string[];
  scheduledDate?: Date | null;
  actualDate?: Date | null;
  duration?: number | null;
  checklist?: CheckpointItem[];
  findings?: Record<string, unknown> | null;
  defects?: Record<string, unknown> | null;
  correctiveActions?: Record<string, unknown> | null;
  signatures?: CheckpointSignature[];
}

export interface CheckpointSignatureInput {
  userId: string;
  userName: string;
  role: string;
  signature: string;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskCheckpointService {
  private readonly supabase = inject(SupabaseService);
  private readonly tableName = 'blueprint_task_checkpoints';

  /**
   * 創建檢查點
   */
  async createCheckpoint(taskId: string, checkpoint: CreateCheckpointInput): Promise<Checkpoint> {
    const timestamp = this.nowIsoString();
    const payload = {
      task_id: taskId,
      name: checkpoint.name,
      description: checkpoint.description ?? null,
      sequence: checkpoint.sequence,
      depends_on_checkpoints: checkpoint.dependsOn && checkpoint.dependsOn.length > 0 ? checkpoint.dependsOn : [],
      status: this.toDbStatus(checkpoint.status),
      inspector_id: checkpoint.inspector ?? null,
      approver_id: checkpoint.approver ?? null,
      witnesses: checkpoint.witnesses ?? [],
      scheduled_date: this.serializeDate(checkpoint.scheduledDate),
      actual_date: this.serializeDate(checkpoint.actualDate),
      duration: checkpoint.duration ?? null,
      checklist: this.serializeChecklist(checkpoint.checklist),
      findings: checkpoint.findings ?? null,
      defects: checkpoint.defects ?? null,
      corrective_actions: checkpoint.correctiveActions ?? null,
      signatures: this.serializeSignatures(checkpoint.signatures),
      created_by: checkpoint.createdBy,
      created_at: timestamp,
      updated_at: timestamp
    };

    const { data, error } = await this.supabase.client.from(this.tableName).insert(payload).select('*').single();

    if (error || !data) {
      throw new Error(`Failed to create checkpoint: ${error?.message ?? 'unknown error'}`);
    }

    return this.mapRowToCheckpoint(data as DbCheckpointRow);
  }

  /**
   * 更新檢查點
   */
  async updateCheckpoint(checkpointId: string, updates: UpdateCheckpointInput): Promise<Checkpoint> {
    const payload: Partial<DbCheckpointRow> & { updated_at: string } = {
      updated_at: this.nowIsoString()
    };

    if (updates.name !== undefined) {
      payload.name = updates.name ?? null;
    }

    if (updates.description !== undefined) {
      payload.description = updates.description ?? null;
    }

    if (updates.status !== undefined) {
      payload.status = this.toDbStatus(updates.status);
    }

    if (updates.inspector !== undefined) {
      payload.inspector_id = updates.inspector ?? null;
    }

    if (updates.approver !== undefined) {
      payload.approver_id = updates.approver ?? null;
    }

    if (updates.witnesses !== undefined) {
      payload.witnesses = updates.witnesses ?? [];
    }

    if (updates.dependsOn !== undefined) {
      payload.depends_on_checkpoints = updates.dependsOn ?? [];
    }

    if (updates.scheduledDate !== undefined) {
      payload.scheduled_date = this.serializeDate(updates.scheduledDate);
    }

    if (updates.actualDate !== undefined) {
      payload.actual_date = this.serializeDate(updates.actualDate);
    }

    if (updates.duration !== undefined) {
      payload.duration = updates.duration ?? null;
    }

    if (updates.checklist !== undefined) {
      payload.checklist = this.serializeChecklist(updates.checklist);
    }

    if (updates.findings !== undefined) {
      payload.findings = updates.findings ?? null;
    }

    if (updates.defects !== undefined) {
      payload.defects = updates.defects ?? null;
    }

    if (updates.correctiveActions !== undefined) {
      payload.corrective_actions = updates.correctiveActions ?? null;
    }

    if (updates.signatures !== undefined) {
      payload.signatures = this.serializeSignatures(updates.signatures);
    }

    const { data, error } = await this.supabase.client.from(this.tableName).update(payload).eq('id', checkpointId).select('*').single();

    if (error || !data) {
      throw new Error(`Failed to update checkpoint: ${error?.message ?? 'unknown error'}`);
    }

    return this.mapRowToCheckpoint(data as DbCheckpointRow);
  }

  /**
   * 刪除檢查點
   */
  async deleteCheckpoint(checkpointId: string): Promise<void> {
    const { data: dependents, error: dependencyError } = (await this.supabase.client
      .from(this.tableName)
      .select('id, name')
      .contains('depends_on_checkpoints', [checkpointId])) as {
      data: Array<{ id: string; name: string | null }> | null;
      error: { message: string } | null;
    };

    if (dependencyError) {
      throw new Error(`Failed to validate checkpoint dependencies: ${dependencyError.message}`);
    }

    if (Array.isArray(dependents) && dependents.length > 0) {
      const dependentNames = dependents
        .map(d => d.name)
        .filter(Boolean)
        .join(', ');
      throw new Error(`Cannot delete checkpoint because it is referenced by other checkpoints: ${dependentNames || dependents.length}`);
    }

    const { error } = await this.supabase.client.from(this.tableName).delete().eq('id', checkpointId);

    if (error) {
      throw new Error(`Failed to delete checkpoint: ${error.message}`);
    }
  }

  /**
   * 取得指定任務的所有檢查點
   */
  async getCheckpointsByTask(taskId: string): Promise<Checkpoint[]> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('task_id', taskId)
      .order('sequence', { ascending: true });

    if (error) {
      throw new Error(`Failed to load checkpoints: ${error.message}`);
    }

    const rows = (data ?? []) as DbCheckpointRow[];

    return rows.map(row => this.mapRowToCheckpoint(row));
  }

  /**
   * 取得單一檢查點
   */
  async getCheckpointById(checkpointId: string): Promise<Checkpoint | null> {
    const { data, error } = await this.supabase.client.from(this.tableName).select('*').eq('id', checkpointId).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to load checkpoint: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.mapRowToCheckpoint(data as DbCheckpointRow);
  }

  /**
   * 更新檢查點狀態
   */
  async updateCheckpointStatus(checkpointId: string, status: CheckpointStatus): Promise<Checkpoint> {
    const updates: UpdateCheckpointInput = { status };

    if (status === 'completed') {
      updates.actualDate = new Date();
    }

    return this.updateCheckpoint(checkpointId, updates);
  }

  /**
   * 添加檢查點簽名
   */
  async addCheckpointSignature(checkpointId: string, signature: CheckpointSignatureInput): Promise<Checkpoint> {
    const checkpoint = await this.getCheckpointById(checkpointId);
    if (!checkpoint) {
      throw new Error('Checkpoint not found');
    }

    const existingSignatures = checkpoint.signatures ?? [];
    const normalizedSignature: CheckpointSignature = {
      ...signature,
      timestamp: signature.timestamp ?? new Date()
    };

    return this.updateCheckpoint(checkpointId, {
      signatures: [...existingSignatures, normalizedSignature]
    });
  }

  /**
   * 依序列號取得檢查點
   */
  async getCheckpointsBySequence(taskId: string, sequence: number): Promise<Checkpoint[]> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('task_id', taskId)
      .eq('sequence', sequence)
      .order('updated_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to load checkpoints by sequence: ${error.message}`);
    }

    const rows = (data ?? []) as DbCheckpointRow[];

    return rows.map(row => this.mapRowToCheckpoint(row));
  }

  /**
   * 驗證檢查點依賴關係是否已完成
   */
  async validateCheckpointDependencies(checkpointId: string): Promise<boolean> {
    const checkpoint = await this.getCheckpointById(checkpointId);
    if (!checkpoint) {
      throw new Error('Checkpoint not found');
    }

    const dependencies = await this.getCheckpointDependencies(checkpointId);
    const incomplete = dependencies.filter(dep => dep.status !== 'completed' && dep.status !== 'skipped');

    if (incomplete.length > 0) {
      const names = incomplete.map(dep => dep.name).join(', ');
      throw new Error(`Checkpoint dependencies are not completed: ${names}`);
    }

    return true;
  }

  /**
   * 取得檢查點依賴項
   */
  async getCheckpointDependencies(checkpointId: string): Promise<Checkpoint[]> {
    const checkpoint = await this.getCheckpointById(checkpointId);
    if (!checkpoint) {
      throw new Error('Checkpoint not found');
    }

    const dependencyIds = checkpoint.dependsOn ?? [];
    if (dependencyIds.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase.client.from(this.tableName).select('*').in('id', dependencyIds);

    if (error) {
      throw new Error(`Failed to load checkpoint dependencies: ${error.message}`);
    }

    const rows = (data ?? []) as DbCheckpointRow[];

    return rows.map(row => this.mapRowToCheckpoint(row));
  }

  private mapRowToCheckpoint(row: DbCheckpointRow): Checkpoint {
    return {
      id: row.id,
      taskId: row.task_id,
      name: row.name,
      description: row.description ?? '',
      sequence: row.sequence,
      dependsOn: this.normalizeStringArray(row.depends_on_checkpoints),
      status: this.fromDbStatus(row.status),
      checklist: this.deserializeChecklist(row.checklist),
      inspector: row.inspector_id,
      approver: row.approver_id,
      witnesses: this.normalizeStringArray(row.witnesses),
      plannedDate: this.deserializeDate(row.scheduled_date),
      actualDate: this.deserializeDate(row.actual_date),
      duration: row.duration,
      findings: (row.findings as Record<string, unknown> | null) ?? null,
      defects: (row.defects as Record<string, unknown> | null) ?? null,
      correctiveActions: (row.corrective_actions as Record<string, unknown> | null) ?? null,
      signatures: this.deserializeSignatures(row.signatures),
      createdAt: this.deserializeDate(row.created_at),
      updatedAt: this.deserializeDate(row.updated_at),
      createdBy: row.created_by
    };
  }

  private serializeChecklist(checklist?: CheckpointItem[]): unknown {
    if (!checklist || checklist.length === 0) {
      return [];
    }

    return checklist.map(item => ({
      ...item,
      checkedAt: item.checkedAt ? item.checkedAt.toISOString() : null
    }));
  }

  private deserializeChecklist(value: unknown): CheckpointItem[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((item: any) => ({
      item: item.item,
      required: Boolean(item.required),
      checked: Boolean(item.checked),
      checkedBy: item.checkedBy ?? undefined,
      checkedAt: item.checkedAt ? new Date(item.checkedAt) : undefined,
      notes: item.notes ?? undefined,
      photos: Array.isArray(item.photos) ? item.photos : undefined,
      attachments: Array.isArray(item.attachments) ? item.attachments : undefined,
      result: item.result ?? undefined
    }));
  }

  private serializeSignatures(signatures?: CheckpointSignature[]): unknown {
    if (!signatures || signatures.length === 0) {
      return [];
    }

    return signatures.map(signature => {
      const timestamp = signature.timestamp ?? new Date();
      return {
        ...signature,
        timestamp: timestamp.toISOString()
      };
    });
  }

  private deserializeSignatures(value: unknown): CheckpointSignature[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((signature: any) => ({
      userId: signature.userId,
      userName: signature.userName,
      role: signature.role,
      signature: signature.signature,
      timestamp: signature.timestamp ? new Date(signature.timestamp) : new Date()
    }));
  }

  private normalizeStringArray(value?: string[] | null): string[] {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.filter((item): item is string => typeof item === 'string');
  }

  private serializeDate(value?: Date | null): string | null {
    if (!value) {
      return null;
    }
    return value.toISOString();
  }

  private deserializeDate(value: string | null): Date | undefined {
    if (!value) {
      return undefined;
    }
    return new Date(value);
  }

  private toDbStatus(status?: CheckpointStatus): DbCheckpointStatus {
    if (!status) {
      return 'pending';
    }
    return status;
  }

  private fromDbStatus(status: DbCheckpointStatus): CheckpointStatus {
    return status;
  }

  private nowIsoString(): string {
    return new Date().toISOString();
  }
}
