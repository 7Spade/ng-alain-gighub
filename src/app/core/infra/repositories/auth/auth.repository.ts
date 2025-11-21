import { Injectable, inject } from '@angular/core';
import { AuthError, AuthResponse, AuthTokenResponsePassword, Session, User } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { SupabaseService } from '../../../supabase/supabase.service';

/**
 * 登入請求介面
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * 註冊請求介面
 */
export interface SignUpRequest {
  email: string;
  password: string;
  metadata?: Record<string, any>;
}

/**
 * 認證回應介面
 */
export interface AuthRepositoryResponse {
  session: Session | null;
  user: User | null;
  error: AuthError | null;
}

/**
 * Auth Repository
 *
 * 職責：
 * - 封裝所有 Supabase Auth API 調用
 * - 處理認證相關的資料存取
 * - 不包含業務邏輯
 *
 * 依賴：
 * - SupabaseService (core) - 基礎設施
 *
 * 注意：此 Repository 與其他 Repositories 不同，因為 Supabase Auth
 * 是獨立的服務，不是資料表。所以不繼承 BaseRepository。
 *
 * @example
 * ```typescript
 * const authRepo = inject(AuthRepository);
 *
 * // 登入
 * authRepo.signIn({ email: 'user@example.com', password: 'password' })
 *   .subscribe(response => {
 *     if (!response.error && response.session) {
 *       console.log('登入成功');
 *     }
 *   });
 *
 * // 登出
 * authRepo.signOut().subscribe(() => {
 *   console.log('登出成功');
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AuthRepository {
  private readonly supabaseService = inject(SupabaseService);

  /**
   * 使用 Email 和密碼登入
   *
   * @param request 登入請求
   * @returns Observable<AuthRepositoryResponse>
   */
  signIn(request: SignInRequest): Observable<AuthRepositoryResponse> {
    return from(
      this.supabaseService.client.auth.signInWithPassword({
        email: request.email,
        password: request.password
      })
    ).pipe(
      map((response: AuthTokenResponsePassword) => ({
        session: response.data.session,
        user: response.data.user,
        error: response.error
      }))
    );
  }

  /**
   * 使用 Email 和密碼註冊
   *
   * @param request 註冊請求
   * @returns Observable<AuthRepositoryResponse>
   */
  signUp(request: SignUpRequest): Observable<AuthRepositoryResponse> {
    return from(
      this.supabaseService.client.auth.signUp({
        email: request.email,
        password: request.password,
        options: {
          data: request.metadata
        }
      })
    ).pipe(
      map((response: AuthResponse) => ({
        session: response.data.session,
        user: response.data.user,
        error: response.error
      }))
    );
  }

  /**
   * 登出
   *
   * @returns Observable<{ error: AuthError | null }>
   */
  signOut(): Observable<{ error: AuthError | null }> {
    return from(this.supabaseService.client.auth.signOut()).pipe(
      map(response => ({
        error: response.error
      }))
    );
  }

  /**
   * 獲取當前 Session
   *
   * @returns Observable<Session | null>
   */
  getSession(): Observable<Session | null> {
    return from(this.supabaseService.client.auth.getSession()).pipe(
      map(response => {
        if (response.error) {
          throw response.error;
        }
        return response.data.session;
      })
    );
  }

  /**
   * 獲取當前用戶
   *
   * @returns Observable<User | null>
   */
  getUser(): Observable<User | null> {
    return from(this.supabaseService.client.auth.getUser()).pipe(
      map(response => {
        if (response.error) {
          throw response.error;
        }
        return response.data.user;
      })
    );
  }

  /**
   * 刷新 Session
   *
   * @returns Observable<AuthRepositoryResponse>
   */
  refreshSession(): Observable<AuthRepositoryResponse> {
    return from(this.supabaseService.client.auth.refreshSession()).pipe(
      map((response: AuthResponse) => ({
        session: response.data.session,
        user: response.data.user,
        error: response.error
      }))
    );
  }

  /**
   * 重設密碼（發送重設郵件）
   *
   * @param email 用戶 Email
   * @returns Observable<{ error: AuthError | null }>
   */
  resetPasswordForEmail(email: string): Observable<{ error: AuthError | null }> {
    return from(this.supabaseService.client.auth.resetPasswordForEmail(email)).pipe(
      map(response => ({
        error: response.error
      }))
    );
  }

  /**
   * 更新用戶資料
   *
   * @param attributes 用戶屬性
   * @returns Observable<AuthRepositoryResponse>
   */
  updateUser(attributes: { email?: string; password?: string; data?: Record<string, any> }): Observable<AuthRepositoryResponse> {
    return from(this.supabaseService.client.auth.updateUser(attributes)).pipe(
      map(response => {
        const user = response.data?.user ?? null;
        return {
          session: null, // updateUser doesn't return session
          user: user,
          error: response.error
        };
      })
    );
  }
}
