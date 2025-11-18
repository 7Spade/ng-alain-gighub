import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase 客戶端服務
 *
 * 提供 Supabase 客戶端實例，用於與 Supabase 後端進行交互
 *
 * @example
 * ```typescript
 * constructor(private supabase: SupabaseService) {}
 *
 * async getUsers() {
 *   const { data, error } = await this.supabase.client
 *     .from('users')
 *     .select('*');
 *   return { data, error };
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly _client: SupabaseClient;

  constructor() {
    const supabaseConfig = (environment as { supabase?: { url: string; anonKey: string } })['supabase'];
    const url = supabaseConfig?.url || '';
    const anonKey = supabaseConfig?.anonKey || '';

    if (!url || !anonKey) {
      console.warn('Supabase 配置未完成。請設置 NG_APP_SUPABASE_URL 和 NG_APP_SUPABASE_ANON_KEY 環境變數。');
    }

    this._client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  /**
   * 獲取 Supabase 客戶端實例
   */
  get client(): SupabaseClient {
    return this._client;
  }

  /**
   * 檢查 Supabase 是否已配置
   */
  get isConfigured(): boolean {
    const supabaseConfig = (environment as { supabase?: { url: string; anonKey: string } })['supabase'];
    const url = supabaseConfig?.url || '';
    const anonKey = supabaseConfig?.anonKey || '';
    return !!(url && anonKey);
  }
}
