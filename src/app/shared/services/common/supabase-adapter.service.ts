import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Adapter Service
 *
 * 提供統一的 Supabase 客戶端介面給 shared 模組使用
 * 作為 core/SupabaseService 的適配器層，保持關注點分離
 *
 * 此服務為 singleton，不暴露任何真實金鑰
 * 所有配置透過環境變數管理
 *
 * @example
 * ```typescript
 * const adapter = inject(SupabaseAdapterService);
 * const { data, error } = await adapter.client
 *   .from('quality_checks')
 *   .select('*')
 *   .eq('id', id)
 *   .single();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SupabaseAdapterService {
  private supabaseService = inject(SupabaseService);

  /**
   * 獲取 Supabase 客戶端實例
   * 透過 core/SupabaseService 提供的單例客戶端
   */
  get client(): SupabaseClient {
    return this.supabaseService.client;
  }

  /**
   * 執行資料庫查詢
   * 提供 type-safe 的查詢介面
   *
   * @param table 資料表名稱
   * @returns Supabase query builder
   */
  from(table: string) {
    return this.client.from(table);
  }

  /**
   * 獲取認證狀態
   */
  get auth() {
    return this.client.auth;
  }

  /**
   * 獲取儲存服務
   */
  get storage() {
    return this.client.storage;
  }

  /**
   * 獲取即時訂閱服務
   */
  get realtime() {
    return this.client.realtime;
  }
}
