import { Injectable, inject } from '@angular/core';
import { ErrorStateService } from '@core/net';
import type { User, CreateUserInput, UpdateUserInput } from '@shared';

import { SupabaseService } from '../../supabase/supabase.service';

/**
 * User Service
 *
 * 提供用戶資料的 CRUD 操作
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly supabase = inject(SupabaseService);
  private readonly errorService = inject(ErrorStateService);

  /**
   * 獲取當前登入用戶的資料
   */
  async getCurrentUser(): Promise<{ data: User | null; error: Error | null }> {
    try {
      const {
        data: { user }
      } = await this.supabase.client.auth.getUser();

      if (!user) {
        return { data: null, error: null };
      }

      const { data, error } = await this.supabase.client.from('users').select('*').eq('id', user.id).single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '獲取用戶資料失敗',
          details: error.message || '無法從資料庫獲取用戶資料',
          source: 'UserService.getCurrentUser',
          retryable: true,
          retryFn: () => {
            // 重試邏輯由調用方處理
          }
        });
        return { data: null, error };
      }

      return { data: data as User, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 根據 ID 獲取用戶資料
   */
  async getUserById(id: string): Promise<{ data: User | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client.from('users').select('*').eq('id', id).single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '獲取用戶資料失敗',
          details: error.message || '無法從資料庫獲取用戶資料',
          source: 'UserService.getUserById',
          retryable: true,
          metadata: { userId: id }
        });
        return { data: null, error };
      }

      return { data: data as User, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '獲取用戶資料失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'UserService.getUserById',
        retryable: false,
        metadata: { userId: id }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 根據 Email 獲取用戶資料
   */
  async getUserByEmail(email: string): Promise<{ data: User | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client.from('users').select('*').eq('email', email).single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '獲取用戶資料失敗',
          details: error.message || '無法從資料庫獲取用戶資料',
          source: 'UserService.getUserByEmail',
          retryable: true,
          metadata: { email }
        });
        return { data: null, error };
      }

      return { data: data as User, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '獲取用戶資料失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'UserService.getUserByEmail',
        retryable: false,
        metadata: { email }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 創建用戶資料（通常在註冊時由 trigger 自動創建，但也可以手動創建）
   */
  async createUser(input: CreateUserInput): Promise<{ data: User | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('users')
        .insert({
          id: input.id,
          email: input.email,
          display_name: input.display_name,
          avatar_url: input.avatar_url,
          bio: input.bio,
          timezone: input.timezone ?? 'UTC',
          locale: input.locale ?? 'zh-TW'
        })
        .select()
        .single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '創建用戶失敗',
          details: error.message || '無法創建用戶資料',
          source: 'UserService.createUser',
          retryable: true,
          metadata: { input }
        });
        return { data: null, error };
      }

      return { data: data as User, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '創建用戶失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'UserService.createUser',
        retryable: false,
        metadata: { input }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 更新當前用戶的資料
   */
  async updateCurrentUser(input: UpdateUserInput): Promise<{ data: User | null; error: Error | null }> {
    try {
      const {
        data: { user }
      } = await this.supabase.client.auth.getUser();

      if (!user) {
        this.errorService.addError({
          type: 'permission',
          severity: 'error',
          message: '更新用戶資料失敗',
          details: '用戶未認證，無法更新資料',
          source: 'UserService.updateCurrentUser',
          retryable: false
        });
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await this.supabase.client
        .from('users')
        .update({
          display_name: input.display_name,
          avatar_url: input.avatar_url,
          bio: input.bio,
          timezone: input.timezone,
          locale: input.locale
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '更新用戶資料失敗',
          details: error.message || '無法更新用戶資料',
          source: 'UserService.updateCurrentUser',
          retryable: true,
          metadata: { input }
        });
        return { data: null, error };
      }

      return { data: data as User, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '更新用戶資料失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'UserService.updateCurrentUser',
        retryable: false,
        metadata: { input }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 更新指定用戶的資料（僅限管理員）
   */
  async updateUser(id: string, input: UpdateUserInput): Promise<{ data: User | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('users')
        .update({
          display_name: input.display_name,
          avatar_url: input.avatar_url,
          bio: input.bio,
          timezone: input.timezone,
          locale: input.locale
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '更新用戶資料失敗',
          details: error.message || '無法更新用戶資料',
          source: 'UserService.updateUser',
          retryable: true,
          metadata: { userId: id, input }
        });
        return { data: null, error };
      }

      return { data: data as User, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '更新用戶資料失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'UserService.updateUser',
        retryable: false,
        metadata: { userId: id, input }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 刪除用戶資料（軟刪除由 auth.users cascade 處理）
   */
  async deleteUser(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.client.from('users').delete().eq('id', id);

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '刪除用戶失敗',
          details: error.message || '無法刪除用戶資料',
          source: 'UserService.deleteUser',
          retryable: false,
          metadata: { userId: id }
        });
        return { error };
      }

      return { error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '刪除用戶失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'UserService.deleteUser',
        retryable: false,
        metadata: { userId: id }
      });
      return { error: error as Error };
    }
  }
}
