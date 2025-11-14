import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
import { Observable, from, of, throwError, EMPTY } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

import { SupabaseService } from './supabase.service';

/**
 * Supabase Auth 與 @delon/auth 適配器服務
 * 
 * 作為 Supabase Auth 與 @delon/auth 之間的橋樑，實現：
 * 1. Session 格式轉換（Supabase Session → @delon/auth Token 格式）
 * 2. 自動同步 Session 到 TokenService
 * 3. 監聽 Auth 狀態變化
 * 4. Token 刷新處理
 * 
 * @example
 * ```typescript
 * const adapter = inject(SupabaseAuthAdapterService);
 * adapter.signIn('user@example.com', 'password').subscribe();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SupabaseAuthAdapterService {
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
   * 登入
   * 
   * @param email 用戶郵箱
   * @param password 密碼
   * @returns Observable<{ error: AuthError | null }>
   */
  signIn(email: string, password: string): Observable<{ error: AuthError | null }> {
    return from(
      this.supabaseService.client.auth.signInWithPassword({
        email,
        password
      })
    ).pipe(
      tap(({ data, error }) => {
        if (!error && data.session) {
          this.syncSessionToTokenService(data.session);
        }
      }),
      map(({ error }) => ({ error }))
    );
  }

  /**
   * 註冊
   * 
   * @param email 用戶郵箱
   * @param password 密碼
   * @param metadata 用戶元數據（可選）
   * @returns Observable<{ error: AuthError | null }>
   */
  signUp(
    email: string,
    password: string,
    metadata?: Record<string, any>
  ): Observable<{ error: AuthError | null }> {
    return from(
      this.supabaseService.client.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
    ).pipe(
      tap(({ data, error }) => {
        if (!error && data.session) {
          this.syncSessionToTokenService(data.session);
        }
      }),
      map(({ error }) => ({ error }))
    );
  }

  /**
   * 登出
   * 
   * @returns Observable<{ error: AuthError | null }>
   */
  signOut(): Observable<{ error: AuthError | null }> {
    return from(this.supabaseService.client.auth.signOut()).pipe(
      tap(() => {
        // 清除 TokenService
        this.tokenService.clear();
      }),
      map(({ error }) => ({ error }))
    );
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
        }
      }),
      map(() => undefined),
      catchError(() => of(undefined))
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

    this.supabaseService.client.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (session) {
          this.syncSessionToTokenService(session);
        } else if (event === 'SIGNED_OUT') {
          this.tokenService.clear();
        }
      }
    );

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
  private syncSessionToTokenService(session: Session): void {
    const tokenData = this.convertSessionToTokenFormat(session);
    this.tokenService.set(tokenData);
  }

  /**
   * 獲取當前 Session
   * 
   * @returns Observable<Session | null>
   */
  getCurrentSession(): Observable<Session | null> {
    return from(this.supabaseService.client.auth.getSession()).pipe(
      map(({ data }) => data.session)
    );
  }
}

