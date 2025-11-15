import { AuthError } from '@supabase/supabase-js';

import { Account } from '../../models';

/**
 * 登录请求
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * 注册请求
 */
export interface SignUpRequest {
  email: string;
  password: string;
  metadata?: Record<string, any>;
}

/**
 * 认证结果
 */
export interface AuthResult {
  success: boolean;
  error?: AuthError | null;
  user?: Account | null;
}

/**
 * 认证状态
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: Account | null;
  loading: boolean;
  error: string | null;
}

