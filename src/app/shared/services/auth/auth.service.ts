import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccountRepository, SupabaseService, SupabaseSessionAdapterService } from '@core';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { Account } from '../../models';
import { AuthStateService } from './auth.state';
import { AuthResult, SignInRequest, SignUpRequest } from './auth.types';

/**
 * 认证服务（业务层）
 *
 * 职责：
 * 1. 认证操作（signIn, signUp, signOut）
 * 2. 认证状态管理
 * 3. 用户信息管理
 *
 * 依赖：
 * - SupabaseService (core) - 基础设施
 * - SupabaseSessionAdapterService (core) - Session 适配器
 * - AccountRepository (core) - 数据访问
 * - AuthStateService (shared) - 状态管理
 *
 * @example
 * ```typescript
 * const authService = inject(AuthService);
 * authService.signIn({ email: 'user@example.com', password: 'password' })
 *   .subscribe(result => {
 *     if (result.success) {
 *       console.log('登录成功');
 *     }
 *   });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly sessionAdapter = inject(SupabaseSessionAdapterService);
  private readonly accountRepository = inject(AccountRepository);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  /**
   * 登录
   *
   * @param request 登录请求
   * @returns Observable<AuthResult>
   */
  signIn(request: SignInRequest): Observable<AuthResult> {
    this.authState.setLoading(true);
    this.authState.setError(null);

    return from(
      this.supabaseService.client.auth.signInWithPassword({
        email: request.email,
        password: request.password
      })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          this.authState.setLoading(false);
          this.authState.setError(error.message);
          return of({
            success: false,
            error,
            user: null
          } as AuthResult);
        }

        if (!data.session) {
          this.authState.setLoading(false);
          this.authState.setError('登录失败：未返回 Session');
          return of({
            success: false,
            error: null,
            user: null
          } as AuthResult);
        }

        // 同步 Session 到 TokenService
        this.sessionAdapter.syncSessionToTokenService(data.session);

        // 加载用户账户信息
        return this.loadUserAccount(data.session.user.id).pipe(
          map(account => {
            this.authState.setLoading(false);
            if (account) {
              this.authState.setUser(account);
              return {
                success: true,
                error: null,
                user: account
              } as AuthResult;
            } else {
              this.authState.setError('无法加载用户账户信息');
              return {
                success: false,
                error: null,
                user: null
              } as AuthResult;
            }
          }),
          catchError(err => {
            this.authState.setLoading(false);
            this.authState.setError(err.message || '加载用户信息失败');
            return of({
              success: false,
              error: null,
              user: null
            } as AuthResult);
          })
        );
      }),
      catchError(err => {
        this.authState.setLoading(false);
        this.authState.setError(err.message || '登录失败');
        return of({
          success: false,
          error: err,
          user: null
        } as AuthResult);
      })
    );
  }

  /**
   * 注册
   *
   * @param request 注册请求
   * @returns Observable<AuthResult>
   */
  signUp(request: SignUpRequest): Observable<AuthResult> {
    this.authState.setLoading(true);
    this.authState.setError(null);

    return from(
      this.supabaseService.client.auth.signUp({
        email: request.email,
        password: request.password,
        options: {
          data: request.metadata
        }
      })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          this.authState.setLoading(false);
          this.authState.setError(error.message);
          return of({
            success: false,
            error,
            user: null
          } as AuthResult);
        }

        // Supabase 注册可能返回 session（email 验证关闭）或 null（email 验证开启）
        if (data.session && data.user) {
          // 同步 Session 到 TokenService
          this.sessionAdapter.syncSessionToTokenService(data.session);

          // 加载用户账户信息（如果已创建）
          return this.loadUserAccount(data.user.id).pipe(
            map(account => {
              this.authState.setLoading(false);
              if (account) {
                this.authState.setUser(account);
                return {
                  success: true,
                  error: null,
                  user: account
                } as AuthResult;
              } else {
                // 账户可能还未创建（需要触发器），但注册成功
                return {
                  success: true,
                  error: null,
                  user: null
                } as AuthResult;
              }
            }),
            catchError(() => {
              // 即使加载账户失败，注册也可能成功（需要 email 验证）
              this.authState.setLoading(false);
              return of({
                success: true,
                error: null,
                user: null
              } as AuthResult);
            })
          );
        } else {
          // Email 验证已开启，需要用户验证邮箱
          this.authState.setLoading(false);
          return of({
            success: true,
            error: null,
            user: null
          } as AuthResult);
        }
      }),
      catchError(err => {
        this.authState.setLoading(false);
        this.authState.setError(err.message || '注册失败');
        return of({
          success: false,
          error: err,
          user: null
        } as AuthResult);
      })
    );
  }

  /**
   * 登出
   *
   * @returns Observable<void>
   */
  signOut(): Observable<void> {
    this.authState.setLoading(true);

    return from(this.supabaseService.client.auth.signOut()).pipe(
      tap(() => {
        // 清除认证状态
        this.authState.clear();
        // 清除 TokenService
        this.sessionAdapter.clearTokenService();
        this.authState.setLoading(false);
      }),
      map(() => undefined),
      catchError(err => {
        this.authState.setLoading(false);
        this.authState.setError(err.message || '登出失败');
        // 即使登出失败，也清除本地状态
        this.authState.clear();
        this.sessionAdapter.clearTokenService();
        return throwError(() => err);
      })
    );
  }

  /**
   * 获取当前用户
   *
   * @returns Observable<Account | null>
   */
  getCurrentUser(): Observable<Account | null> {
    return this.sessionAdapter.getCurrentSession().pipe(
      switchMap(session => {
        if (!session) {
          return of(null);
        }
        return this.loadUserAccount(session.user.id);
      })
    );
  }

  /**
   * 检查认证状态
   *
   * @returns Observable<boolean>
   */
  checkAuthStatus(): Observable<boolean> {
    return this.sessionAdapter.getCurrentSession().pipe(
      map(session => {
        const isAuthenticated = session !== null;
        this.authState.setAuthenticated(isAuthenticated);
        return isAuthenticated;
      })
    );
  }

  /**
   * 加载用户账户信息
   *
   * @param authUserId 认证用户 ID
   * @returns Observable<Account | null>
   */
  private loadUserAccount(authUserId: string): Observable<Account | null> {
    return this.accountRepository.findByAuthUserId(authUserId).pipe(
      tap(account => {
        if (account) {
          this.authState.setUser(account);
        }
      })
    );
  }
}
