import { PostgrestError } from '@supabase/supabase-js';
import { AppError, createAppError, ErrorType, ErrorSeverity } from './error.types';

/**
 * Supabase 错误代码映射
 */
const SUPABASE_ERROR_CODES: Record<string, { type: ErrorType; severity: ErrorSeverity; message: string }> = {
  // 认证错误
  'PGRST301': { type: 'permission', severity: 'error', message: '未授权访问' },
  'PGRST116': { type: 'business', severity: 'warning', message: '资源不存在' },
  
  // 数据验证错误
  '23505': { type: 'validation', severity: 'error', message: '数据已存在，违反唯一性约束' },
  '23503': { type: 'validation', severity: 'error', message: '外键约束违反' },
  '23502': { type: 'validation', severity: 'error', message: '必填字段为空' },
  '23514': { type: 'validation', severity: 'error', message: '检查约束违反' },
  
  // 权限错误
  '42501': { type: 'permission', severity: 'error', message: '权限不足' },
  
  // 网络错误
  'PGRST204': { type: 'network', severity: 'error', message: '请求超时' },
};

/**
 * 将 Supabase PostgrestError 转换为 AppError
 * 
 * @param error Supabase 错误
 * @param source 错误来源（可选）
 * @returns AppError
 */
export function transformSupabaseError(error: PostgrestError, source?: string): AppError {
  const errorCode = error.code || '';
  const errorInfo = SUPABASE_ERROR_CODES[errorCode];
  
  if (errorInfo) {
    return createAppError(
      errorInfo.message,
      errorInfo.type,
      errorInfo.severity,
      {
        code: errorCode,
        details: error.message || error.details || '',
        source,
        metadata: {
          hint: error.hint,
          details: error.details,
        },
        retryable: errorInfo.type === 'network',
      }
    );
  }
  
  // 默认错误处理
  return createAppError(
    error.message || '数据库操作失败',
    'unknown',
    'error',
    {
      code: errorCode,
      details: error.details || '',
      source,
      metadata: {
        hint: error.hint,
        details: error.details,
      },
      retryable: false,
    }
  );
}

/**
 * 检查 Supabase 响应并处理错误
 * 
 * @param response Supabase 响应 { data, error }
 * @param source 错误来源（可选）
 * @throws AppError 如果有错误
 */
export function handleSupabaseResponse<T>(
  response: { data: T | null; error: PostgrestError | null },
  source?: string
): T {
  if (response.error) {
    throw transformSupabaseError(response.error, source);
  }
  
  if (response.data === null) {
    throw createAppError(
      '数据不存在',
      'business',
      'warning',
      { source }
    );
  }
  
  return response.data;
}

