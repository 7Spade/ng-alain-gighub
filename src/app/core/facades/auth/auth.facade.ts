import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { type Account } from '../../../shared/models';
import { AuthService, type SignInRequest, type SignUpRequest } from '@shared/services/auth';
import type { User, Session } from '@supabase/supabase-js';
import { firstValueFrom } from 'rxjs';

import { ErrorStateService } from '@core';

/**
 * Auth Facade
 *
 * Enterprise-grade authentication facade following BlueprintFacade pattern.
 * Provides unified interface for all authentication operations with Signal-based state management.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Facade pattern: Component → Facade → Service → Repository → Supabase
 * - Non-invasive error handling via ErrorStateService
 * - Session management and auto-refresh
 * - User profile management
 *
 * Key Features:
 * - Login (email/password, OAuth, magic link support via AuthService)
 * - Logout with state cleanup
 * - Session management and monitoring
 * - User profile access
 * - Authentication state tracking
 * - Computed authentication status
 * - Error handling integration
 *
 * @example
 * ```typescript
 * const authFacade = inject(AuthFacade);
 *
 * // Login
 * const result = await authFacade.login('user@example.com', 'password');
 * if (result.success) {
 *   console.log('Logged in:', authFacade.user());
 * }
 *
 * // Check authentication
 * effect(() => {
 *   if (authFacade.isAuthenticated()) {
 *     console.log('User is logged in:', authFacade.user());
 *   }
 * });
 *
 * // Logout
 * await authFacade.logout();
 * ```
 *
 * @see docs/11-元件模組視圖.mermaid.md
 * @see docs/27-完整架構流程圖.mermaid.md
 */
@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  // Inject dependencies
  private readonly authService = inject(AuthService);
  private readonly errorService = inject(ErrorStateService);
  private readonly router = inject(Router);

  // Signal state
  private readonly userState = signal<Account | null>(null);
  private readonly loadingState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Concurrent control for checkAuthStatus
  private checkAuthStatusPromise: Promise<boolean> | null = null;

  // Readonly signals exposed to components
  /** Current authenticated user */
  readonly user = this.userState.asReadonly();

  /** Loading state for auth operations */
  readonly loading = this.loadingState.asReadonly();

  /** Last authentication operation performed */
  readonly lastOperation = this.lastOperationState.asReadonly();

  /** Whether user is authenticated */
  readonly isAuthenticated = computed(() => this.user() !== null);

  /** User display name (computed from user data) */
  readonly displayName = computed(() => {
    const user = this.user();
    if (!user) return null;
    return user.name || user.email || 'User';
  });

  /** User email */
  readonly userEmail = computed(() => this.user()?.email || null);

  /** User ID */
  readonly userId = computed(() => this.user()?.id || null);

  constructor() {
    // Check authentication status on initialization
    this.checkAuthStatus();

    // Log authentication state changes
    effect(() => {
      if (this.isAuthenticated()) {
        console.log('[AuthFacade] User authenticated:', this.user()?.email);
      } else {
        console.log('[AuthFacade] User not authenticated');
      }
    });
  }

  // ============================================================================
  // Authentication Operations
  // ============================================================================

  /**
   * Login with email and password
   *
   * @param email User email
   * @param password User password
   * @returns Promise<AuthResult>
   */
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.loadingState.set(true);
    this.lastOperationState.set('login');

    try {
      const request: SignInRequest = { email, password };
      const result = await firstValueFrom(this.authService.signIn(request));

      if (result.success && result.user) {
        this.userState.set(result.user);
        console.log('[AuthFacade] Login successful:', email);
        return { success: true };
      } else {
        const errorMessage = result.error?.message || 'Login failed';
        this.errorService.addError({
          category: 'Authorization',
          severity: 'error',
          message: errorMessage,
          context: 'AuthFacade.login'
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('[AuthFacade] Login error:', error);
      this.errorService.addError({
        category: 'Authorization',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AuthFacade.login'
      });
      return { success: false, error: errorMessage };
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Register new user
   *
   * @param email User email
   * @param password User password
   * @param metadata Optional user metadata
   * @returns Promise<AuthResult>
   */
  async register(
    email: string,
    password: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean }> {
    this.loadingState.set(true);
    this.lastOperationState.set('register');

    try {
      const request: SignUpRequest = { email, password, metadata };
      const result = await firstValueFrom(this.authService.signUp(request));

      if (result.success) {
        if (result.user) {
          this.userState.set(result.user);
          console.log('[AuthFacade] Registration successful with immediate login:', email);
          return { success: true, requiresEmailVerification: false };
        } else {
          console.log('[AuthFacade] Registration successful, email verification required:', email);
          return { success: true, requiresEmailVerification: true };
        }
      } else {
        const errorMessage = result.error?.message || 'Registration failed';
        this.errorService.addError({
          category: 'Authorization',
          severity: 'error',
          message: errorMessage,
          context: 'AuthFacade.register'
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      console.error('[AuthFacade] Registration error:', error);
      this.errorService.addError({
        category: 'Authorization',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AuthFacade.register'
      });
      return { success: false, error: errorMessage };
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Logout current user
   *
   * @param redirectTo Optional redirect path after logout
   * @returns Promise<void>
   */
  async logout(redirectTo?: string): Promise<void> {
    this.loadingState.set(true);
    this.lastOperationState.set('logout');

    try {
      await firstValueFrom(this.authService.signOut());

      // Clear local state
      this.userState.set(null);

      console.log('[AuthFacade] Logout successful');

      // Redirect if path provided
      if (redirectTo) {
        await this.router.navigate([redirectTo]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      console.error('[AuthFacade] Logout error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'warning',
        message: errorMessage,
        details: error,
        context: 'AuthFacade.logout'
      });

      // Clear state even if logout fails
      this.userState.set(null);
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Check current authentication status
   *
   * Queries the backend to verify session validity and loads user data.
   * Uses promise caching to prevent concurrent calls and Navigator LockManager conflicts.
   *
   * @returns Promise<boolean> True if authenticated
   */
  async checkAuthStatus(): Promise<boolean> {
    // If a check is already in progress, return the existing promise
    if (this.checkAuthStatusPromise) {
      return this.checkAuthStatusPromise;
    }

    // Create new promise for this check
    this.checkAuthStatusPromise = this._performCheckAuthStatus();

    try {
      const result = await this.checkAuthStatusPromise;
      return result;
    } finally {
      // Clear the promise cache after completion
      this.checkAuthStatusPromise = null;
    }
  }

  /**
   * Internal method to perform the actual authentication check
   *
   * @private
   */
  private async _performCheckAuthStatus(): Promise<boolean> {
    this.loadingState.set(true);
    this.lastOperationState.set('check_auth_status');

    try {
      const isAuthenticated = await firstValueFrom(this.authService.checkAuthStatus());

      if (isAuthenticated) {
        // Load current user
        const user = await firstValueFrom(this.authService.getCurrentUser());
        this.userState.set(user);
      } else {
        this.userState.set(null);
      }

      return isAuthenticated;
    } catch (error) {
      console.error('[AuthFacade] Check auth status error:', error);
      this.userState.set(null);
      return false;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Refresh current user data
   *
   * Reloads user profile from backend.
   *
   * @returns Promise<Account | null>
   */
  async refreshUser(): Promise<Account | null> {
    this.loadingState.set(true);
    this.lastOperationState.set('refresh_user');

    try {
      const user = await firstValueFrom(this.authService.getCurrentUser());
      this.userState.set(user);
      return user;
    } catch (error) {
      console.error('[AuthFacade] Refresh user error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'warning',
        message: 'Failed to refresh user data',
        details: error,
        context: 'AuthFacade.refreshUser'
      });
      return null;
    } finally {
      this.loadingState.set(false);
    }
  }

  // ============================================================================
  // Navigation Guards
  // ============================================================================

  /**
   * Require authentication
   *
   * Helper method for route guards. Redirects to login if not authenticated.
   *
   * @param redirectUrl URL to redirect to after successful login
   * @returns Promise<boolean> True if authenticated
   */
  async requireAuth(redirectUrl?: string): Promise<boolean> {
    const isAuth = await this.checkAuthStatus();

    if (!isAuth) {
      console.log('[AuthFacade] Authentication required, redirecting to login');
      await this.router.navigate(['/passport/login'], {
        queryParams: redirectUrl ? { returnUrl: redirectUrl } : undefined
      });
      return false;
    }

    return true;
  }

  /**
   * Require guest (not authenticated)
   *
   * Helper method for route guards. Redirects to home if already authenticated.
   *
   * @returns Promise<boolean> True if not authenticated
   */
  async requireGuest(): Promise<boolean> {
    const isAuth = await this.checkAuthStatus();

    if (isAuth) {
      console.log('[AuthFacade] Already authenticated, redirecting to home');
      await this.router.navigate(['/']);
      return false;
    }

    return true;
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Clear error state
   *
   * Useful for dismissing auth-related errors in the UI.
   */
  clearErrors(): void {
    this.errorService.clearActiveErrors();
  }
}
