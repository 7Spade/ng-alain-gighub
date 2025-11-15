import { Injectable, signal, computed } from '@angular/core';

import { Account } from '../../models';
import { AuthState } from './auth.types';

/**
 * 认证状态管理服务（使用 Signals）
 *
 * 提供响应式的认证状态管理
 */
@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly isAuthenticatedState = signal<boolean>(false);
  private readonly userState = signal<Account | null>(null);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给外部
  readonly isAuthenticated = this.isAuthenticatedState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly state = computed<AuthState>(() => ({
    isAuthenticated: this.isAuthenticatedState(),
    user: this.userState(),
    loading: this.loadingState(),
    error: this.errorState()
  }));

  /**
   * 设置认证状态
   */
  setAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedState.set(isAuthenticated);
  }

  /**
   * 设置用户信息
   */
  setUser(user: Account | null): void {
    this.userState.set(user);
    this.isAuthenticatedState.set(user !== null);
  }

  /**
   * 设置加载状态
   */
  setLoading(loading: boolean): void {
    this.loadingState.set(loading);
  }

  /**
   * 设置错误信息
   */
  setError(error: string | null): void {
    this.errorState.set(error);
  }

  /**
   * 清除所有状态
   */
  clear(): void {
    this.isAuthenticatedState.set(false);
    this.userState.set(null);
    this.loadingState.set(false);
    this.errorState.set(null);
  }
}

