import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import { QualityCheck, QualityCheckInsert, QualityCheckUpdate, QualityCheckDetail } from '@shared';

/**
 * Quality Check Service
 *
 * 提供品質檢查相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * @example
 * ```typescript
 * const qcService = inject(QualityCheckService);
 *
 * // 載入品質檢查詳情
 * await qcService.getById('check-id');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class QualityCheckService {
  private supabase = inject(SupabaseService);

  // 使用 Signals 管理狀態
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 根據 ID 取得品質檢查詳情
   */
  async getById(id: string): Promise<QualityCheckDetail | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const { data, error } = await this.supabase.client
        .from('quality_checks')
        .select(
          `
          *,
          task:tasks!quality_checks_task_id_fkey(id, name, code),
          inspector:accounts!quality_checks_inspector_id_fkey(id, name, email)
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      // 將 snake_case 轉換為 camelCase
      const qualityCheck: QualityCheckDetail = {
        id: data.id,
        taskId: data.task_id,
        stagingId: data.staging_id,
        inspectorId: data.inspector_id,
        checkType: data.check_type,
        status: data.status,
        checkItems: data.check_items,
        findings: data.findings,
        recommendations: data.recommendations,
        checkedAt: data.checked_at,
        completedAt: data.completed_at,
        task: data.task
          ? {
              id: data.task.id,
              name: data.task.name,
              code: data.task.code
            }
          : undefined,
        inspector: data.inspector
          ? {
              id: data.inspector.id,
              name: data.inspector.name,
              email: data.inspector.email
            }
          : undefined
      };

      return qualityCheck;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入品質檢查失敗';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 新增品質檢查
   */
  async create(data: QualityCheckInsert): Promise<QualityCheck> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const insertData = {
        task_id: data.taskId,
        staging_id: data.stagingId,
        inspector_id: data.inspectorId,
        check_type: data.checkType,
        status: data.status || 'pending',
        check_items: data.checkItems,
        findings: data.findings,
        recommendations: data.recommendations,
        checked_at: data.checkedAt || new Date().toISOString(),
        completed_at: data.completedAt
      };

      const { data: result, error } = await this.supabase.client
        .from('quality_checks')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 將 snake_case 轉換為 camelCase
      const qualityCheck: QualityCheck = {
        id: result.id,
        taskId: result.task_id,
        stagingId: result.staging_id,
        inspectorId: result.inspector_id,
        checkType: result.check_type,
        status: result.status,
        checkItems: result.check_items,
        findings: result.findings,
        recommendations: result.recommendations,
        checkedAt: result.checked_at,
        completedAt: result.completed_at
      };

      return qualityCheck;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '新增品質檢查失敗';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新品質檢查
   */
  async update(id: string, data: QualityCheckUpdate): Promise<QualityCheck> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updateData: Record<string, unknown> = {};
      if (data.status !== undefined) updateData.status = data.status;
      if (data.checkItems !== undefined) updateData.check_items = data.checkItems;
      if (data.findings !== undefined) updateData.findings = data.findings;
      if (data.recommendations !== undefined) updateData.recommendations = data.recommendations;
      if (data.completedAt !== undefined) updateData.completed_at = data.completedAt;

      const { data: result, error } = await this.supabase.client
        .from('quality_checks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 將 snake_case 轉換為 camelCase
      const qualityCheck: QualityCheck = {
        id: result.id,
        taskId: result.task_id,
        stagingId: result.staging_id,
        inspectorId: result.inspector_id,
        checkType: result.check_type,
        status: result.status,
        checkItems: result.check_items,
        findings: result.findings,
        recommendations: result.recommendations,
        checkedAt: result.checked_at,
        completedAt: result.completed_at
      };

      return qualityCheck;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新品質檢查失敗';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 刪除品質檢查
   */
  async delete(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const { error } = await this.supabase.client.from('quality_checks').delete().eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '刪除品質檢查失敗';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清除錯誤狀態
   */
  clearError(): void {
    this.errorState.set(null);
  }
}
