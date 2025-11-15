/**
 * Blueprint Quality Check Service
 *
 * 藍圖品質檢查服務
 *
 * 職責：
 * - 管理藍圖的品質檢查記錄
 * - 處理品質檢查的創建、更新、刪除
 * - 支援品質檢查狀態追蹤和評分
 *
 * @see 表: blueprint_quality_checks (15 個欄位)
 * @see 維度: H. 品質維度（藍圖層級）
 */

import { Injectable, inject } from '@angular/core';
import type { BlueprintQualityCheck, BlueprintQualityCheckWithUsers, CreateQualityCheckInput, UpdateQualityCheckInput } from '@shared';

import { ErrorStateService } from '../../net/error';
import { SupabaseService } from '../../supabase/supabase.service';

/**
 * TODO: 實作 BlueprintQualityCheckService
 *
 * 對應表: blueprint_quality_checks (15 個欄位)
 * 功能: 管理藍圖的品質檢查記錄
 * 對應維度: H. 品質維度（藍圖層級）
 *
 * 需要實作的方法:
 * 1. getQualityChecks(blueprintId, filters?) - 獲取品質檢查列表
 *    - 從 blueprint_quality_checks 表查詢
 *    - 支援篩選: status, category, inspector_id, checked_by, check_date
 *    - 按 check_date 降序排序
 *
 * 2. createQualityCheck(blueprintId, check) - 創建品質檢查
 *    - 插入到 blueprint_quality_checks 表
 *    - 欄位: blueprint_id, title, description, category, status, score, inspector_id, checked_by, check_date, next_check_date, attachments, notes
 *    - 自動設置 created_at, updated_at
 *
 * 3. updateQualityCheck(checkId, updates) - 更新品質檢查
 *    - 更新 blueprint_quality_checks 表
 *    - 可更新欄位: title, description, category, status, score, inspector_id, checked_by, check_date, next_check_date, attachments, notes
 *    - 自動更新 updated_at
 *
 * 4. deleteQualityCheck(checkId) - 刪除品質檢查
 *    - 從 blueprint_quality_checks 表刪除
 *    - 注意: 軟刪除或硬刪除需要根據業務需求決定
 *
 * 5. getQualityCheckById(checkId) - 獲取單個品質檢查
 *    - 從 blueprint_quality_checks 表查詢
 *    - 返回完整的品質檢查數據
 *
 * 6. updateQualityCheckStatus(checkId, status) - 更新檢查狀態
 *    - 更新 blueprint_quality_checks 表的 status 欄位
 *    - 狀態: 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled'
 *    - 如果狀態為 'completed'，自動設置 check_date = 當前時間
 *
 * 7. scheduleNextCheck(checkId, nextDate) - 安排下次檢查
 *    - 更新 blueprint_quality_checks 表的 next_check_date 欄位
 *    - 用於定期檢查的排程
 *
 * 8. getQualityChecksByStatus(blueprintId, status) - 根據狀態獲取品質檢查
 *     - 從 blueprint_quality_checks 表查詢
 *     - 返回指定狀態的所有品質檢查
 *
 * 9. getQualityChecksByCategory(blueprintId, category) - 根據類別獲取品質檢查
 *     - 從 blueprint_quality_checks 表查詢
 *     - 類別: 'safety' | 'quality' | 'compliance' | 'inspection' | 'audit' | 'other'
 *
 * 10. getQualityChecksByInspector(blueprintId, inspectorId) - 根據檢查員獲取品質檢查
 *     - 從 blueprint_quality_checks 表查詢
 *     - 返回指定檢查員的所有品質檢查
 *
 * 11. getOverdueQualityChecks(blueprintId) - 獲取過期品質檢查
 *     - 從 blueprint_quality_checks 表查詢
 *     - 條件: next_check_date < 當前日期 AND status != 'completed'
 *
 * 12. getQualityCheckStatistics(blueprintId) - 獲取品質檢查統計
 *     - 統計各狀態的品質檢查數量
 *     - 統計各類別的品質檢查數量
 *     - 計算平均分數
 *     - 統計通過率
 *
 * 表結構參考 (blueprint_quality_checks):
 * - id (uuid) - 品質檢查 ID
 * - blueprint_id (uuid) - 藍圖 ID (外鍵: blueprints.id)
 * - title (text) - 檢查標題
 * - description (text) - 檢查描述
 * - category (text) - 類別: 'safety' | 'quality' | 'compliance' | 'inspection' | 'audit' | 'other'
 * - status (text) - 狀態: 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled'
 * - score (integer) - 評分（0-100）
 * - inspector_id (uuid) - 檢查員 ID (外鍵: users.id)
 * - checked_by (uuid) - 檢查人 ID (外鍵: users.id)
 * - check_date (timestamptz) - 檢查日期
 * - next_check_date (timestamptz) - 下次檢查日期
 * - attachments (text[]) - 附件陣列（文件路徑）
 * - notes (text) - 備註
 * - created_at (timestamptz) - 創建時間
 * - updated_at (timestamptz) - 更新時間
 */

@Injectable({
  providedIn: 'root'
})
export class BlueprintQualityCheckService {
  private readonly supabase = inject(SupabaseService);
  private readonly errorService = inject(ErrorStateService);

  /**
   * 根據藍圖取得品質檢查列表
   */
  async getQualityChecks(blueprintId: string): Promise<{ data: BlueprintQualityCheckWithUsers[]; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_quality_checks')
        .select(
          `
          *,
          inspector:users!blueprint_quality_checks_inspector_id_fkey(*),
          checked_user:users!blueprint_quality_checks_checked_by_fkey(*)
        `
        )
        .eq('blueprint_id', blueprintId)
        .order('check_date', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '載入品質檢查失敗',
          details: error.message ?? '無法載入品質檢查資料',
          source: 'BlueprintQualityCheckService.getQualityChecks',
          retryable: true,
          metadata: { blueprintId }
        });
        return { data: [], error };
      }

      const mapped = (data ?? []).map(raw => this.mapQualityCheck(raw));
      return { data: mapped, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '載入品質檢查失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'BlueprintQualityCheckService.getQualityChecks',
        retryable: false,
        metadata: { blueprintId }
      });
      return { data: [], error: error as Error };
    }
  }

  /**
   * 根據 ID 取得品質檢查
   */
  async getQualityCheckById(id: string): Promise<{ data: BlueprintQualityCheckWithUsers | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_quality_checks')
        .select(
          `
          *,
          inspector:users!blueprint_quality_checks_inspector_id_fkey(*),
          checked_user:users!blueprint_quality_checks_checked_by_fkey(*)
        `
        )
        .eq('id', id)
        .maybeSingle();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '載入品質檢查失敗',
          details: error.message ?? '無法取得品質檢查資料',
          source: 'BlueprintQualityCheckService.getQualityCheckById',
          retryable: true,
          metadata: { id }
        });
        return { data: null, error };
      }

      if (!data) {
        return { data: null, error: null };
      }

      return { data: this.mapQualityCheck(data), error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '載入品質檢查失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'BlueprintQualityCheckService.getQualityCheckById',
        retryable: false,
        metadata: { id }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 創建品質檢查
   */
  async createQualityCheck(input: CreateQualityCheckInput): Promise<{ data: BlueprintQualityCheckWithUsers | null; error: Error | null }> {
    try {
      const payload = this.buildCreatePayload(input);
      const { data, error } = await this.supabase.client.from('blueprint_quality_checks').insert(payload).select('id').maybeSingle();

      if (error || !data) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '創建品質檢查失敗',
          details: error?.message ?? '無法創建品質檢查',
          source: 'BlueprintQualityCheckService.createQualityCheck',
          retryable: true,
          metadata: { blueprintId: input.blueprint_id }
        });
        return { data: null, error: error ?? new Error('未能取得新建品質檢查資料') };
      }

      return this.getQualityCheckById(data.id);
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '創建品質檢查失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'BlueprintQualityCheckService.createQualityCheck',
        retryable: false,
        metadata: { blueprintId: input.blueprint_id }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 更新品質檢查
   */
  async updateQualityCheck(
    id: string,
    updates: UpdateQualityCheckInput
  ): Promise<{ data: BlueprintQualityCheckWithUsers | null; error: Error | null }> {
    try {
      const payload = this.buildUpdatePayload(updates);
      const { error } = await this.supabase.client.from('blueprint_quality_checks').update(payload).eq('id', id);

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '更新品質檢查失敗',
          details: error.message ?? '無法更新品質檢查',
          source: 'BlueprintQualityCheckService.updateQualityCheck',
          retryable: true,
          metadata: { id }
        });
        return { data: null, error };
      }

      return this.getQualityCheckById(id);
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '更新品質檢查失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'BlueprintQualityCheckService.updateQualityCheck',
        retryable: false,
        metadata: { id }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 刪除品質檢查
   */
  async deleteQualityCheck(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.client.from('blueprint_quality_checks').delete().eq('id', id);

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '刪除品質檢查失敗',
          details: error.message ?? '無法刪除品質檢查',
          source: 'BlueprintQualityCheckService.deleteQualityCheck',
          retryable: true,
          metadata: { id }
        });
        return { error };
      }

      return { error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '刪除品質檢查失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'BlueprintQualityCheckService.deleteQualityCheck',
        retryable: false,
        metadata: { id }
      });
      return { error: error as Error };
    }
  }

  private buildCreatePayload(input: CreateQualityCheckInput): Partial<BlueprintQualityCheck> {
    return {
      blueprint_id: input.blueprint_id,
      title: input.title,
      description: input.description,
      category: input.category,
      status: input.status ?? 'pending',
      score: input.score ?? null,
      inspector_id: input.inspector_id,
      checked_by: input.checked_by ?? null,
      check_date: input.check_date ?? null,
      next_check_date: input.next_check_date ?? null,
      attachments: input.attachments ?? [],
      notes: input.notes ?? null
    };
  }

  private buildUpdatePayload(updates: UpdateQualityCheckInput): Partial<BlueprintQualityCheck> {
    const payload: Partial<BlueprintQualityCheck> = {};

    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.score !== undefined) payload.score = updates.score ?? null;
    if (updates.inspector_id !== undefined) payload.inspector_id = updates.inspector_id ?? null;
    if (updates.checked_by !== undefined) payload.checked_by = updates.checked_by ?? null;
    if (updates.check_date !== undefined) payload.check_date = updates.check_date ?? null;
    if (updates.next_check_date !== undefined) payload.next_check_date = updates.next_check_date ?? null;
    if (updates.attachments !== undefined) payload.attachments = updates.attachments ?? [];
    if (updates.notes !== undefined) payload.notes = updates.notes ?? null;

    return payload;
  }

  private mapQualityCheck(raw: any): BlueprintQualityCheckWithUsers {
    return {
      id: raw.id,
      blueprint_id: raw.blueprint_id,
      title: raw.title,
      description: raw.description,
      category: raw.category,
      status: raw.status,
      score: raw.score ?? null,
      inspector_id: raw.inspector_id,
      checked_by: raw.checked_by ?? null,
      check_date: raw.check_date ?? null,
      next_check_date: raw.next_check_date ?? null,
      attachments: raw.attachments ?? [],
      notes: raw.notes ?? null,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      inspector: raw.inspector ?? null,
      checked_user: raw.checked_user ?? null
    };
  }
}
