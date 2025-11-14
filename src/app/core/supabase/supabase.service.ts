import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env/environment';

/**
 * Supabase 客戶端服務
 * 
 * 提供 Supabase 客戶端單例，用於訪問 Supabase 的所有功能：
 * - Database (PostgreSQL)
 * - Authentication
 * - Storage
 * - Realtime
 * 
 * @example
 * ```typescript
 * const supabase = inject(SupabaseService);
 * const client = supabase.client;
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor() {
    const supabaseConfig = (environment as any)['supabase'];
    if (!supabaseConfig?.url || !supabaseConfig?.anonKey) {
      throw new Error('Supabase configuration is missing. Please check environment variables.');
    }

    this.supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
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
    return this.supabase;
  }
}

