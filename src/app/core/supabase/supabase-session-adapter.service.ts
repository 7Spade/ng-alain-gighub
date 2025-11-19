import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { SupabaseService } from './supabase.service';

/**
 * Supabase Session 适配器服务（基础设施层）
 *
 * 职责：
 * 1. Session 格式转换（Supabase Session → @delon/auth Token 格式）
 * 2. Token 同步到 TokenService
 * 3. Auth 状态监听和同步
 * 4. Session 恢复和刷新
 *
 * 不包含业务逻辑（如 signIn, signUp, signOut），这些应该在 shared/services/auth 中实现
 *
 * @example
 * ```typescript
 * const adapter = inject(SupabaseSessionAdapterService);
 * adapter.restoreSession().subscribe();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SupabaseSessionAdapterService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly platformId = inject(PLATFORM_ID);
  private authListenerInitialized = false;

  constructor() {
    // 在瀏覽器環境中初始化 Auth 監聽器
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAuthListener();
    }
  }

  /**
   * 刷新 Session
   *
   * @returns Observable<Session>
   */
  refreshSession(): Observable<Session> {
    return from(this.supabaseService.client.auth.refreshSession()).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => error);
        }
        if (!data.session) {
          return throwError(() => new Error('No session available'));
        }
        this.syncSessionToTokenService(data.session);
        return of(data.session);
      })
    );
  }

  /**
   * 恢復 Session（應用啟動時調用）
   *
   * 修復執行順序問題：確保即使沒有 session 也設置正確的狀態
   * 這樣路由守衛可以正確檢測到未登錄狀態
   *
   * @returns Observable<void>
   */
  restoreSession(): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(undefined);
    }

    return from(this.supabaseService.client.auth.getSession()).pipe(
      tap(({ data }) => {
        if (data.session) {
          this.syncSessionToTokenService(data.session);
        } else {
          // 如果沒有 session，確保 TokenService 是空的
          // 這樣路由守衛可以正確檢測到未登錄狀態
          this.tokenService.clear();
        }
      }),
      map(() => undefined),
      catchError(() => {
        // 錯誤時也清除 token，確保狀態正確
        this.tokenService.clear();
        return of(undefined);
      })
    );
  }

  /**
   * 初始化 Auth 狀態監聽器
   * 監聽 Supabase Auth 狀態變化，自動同步到 TokenService
   */
  initializeAuthListener(): void {
    if (this.authListenerInitialized || !isPlatformBrowser(this.platformId)) {
      return;
    }

    this.supabaseService.client.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        this.syncSessionToTokenService(session);
      } else if (event === 'SIGNED_OUT') {
        this.tokenService.clear();
      }
    });

    this.authListenerInitialized = true;
  }

  /**
   * 將 Supabase Session 轉換為 @delon/auth Token 格式
   *
   * @param session Supabase Session
   * @returns @delon/auth Token 格式對象
   */
  convertSessionToTokenFormat(session: Session): {
    token: string;
    refresh_token: string;
    expired: number;
    user: {
      id: string;
      email?: string;
      [key: string]: any;
    };
  } {
    const expiresIn = session.expires_in || 3600; // 預設 1 小時
    const expired = Date.now() + expiresIn * 1000;

    return {
      token: session.access_token,
      refresh_token: session.refresh_token,
      expired,
      user: {
        id: session.user.id,
        email: session.user.email,
        ...session.user.user_metadata,
        ...session.user.app_metadata
      }
    };
  }

  /**
   * 同步 Supabase Session 到 @delon/auth TokenService
   *
   * @param session Supabase Session
   */
  syncSessionToTokenService(session: Session): void {
    const tokenData = this.convertSessionToTokenFormat(session);
    this.tokenService.set(tokenData);
  }

  /**
   * 清除 TokenService（登出时调用）
   */
  clearTokenService(): void {
    this.tokenService.clear();
  }

  /**
   * 獲取當前 Session
   *
   * @returns Observable<Session | null>
   */
  getCurrentSession(): Observable<Session | null> {
    return from(this.supabaseService.client.auth.getSession()).pipe(map(({ data }) => data.session));
  }
}
