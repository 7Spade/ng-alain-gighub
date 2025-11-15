/**
 * 错误类型定义
 *
 * 提供统一的错误类型，与现有错误处理模式兼容
 */

/**
 * 错误类型枚举
 */
export type ErrorType = 'http' | 'network' | 'validation' | 'business' | 'permission' | 'unknown';

/**
 * 错误严重程度
 */
export type ErrorSeverity = 'critical' | 'error' | 'warning' | 'info';

/**
 * 应用错误接口
 * 扩展标准 Error，添加额外信息
 */
export interface AppError extends Error {
  /** 错误类型 */
  type: ErrorType;
  /** 错误严重程度 */
  severity: ErrorSeverity;
  /** 错误代码（可选） */
  code?: string;
  /** 错误详情（可选） */
  details?: string;
  /** 错误来源（可选） */
  source?: string;
  /** 元数据（可选） */
  metadata?: Record<string, unknown>;
  /** 是否可重试 */
  retryable?: boolean;
}

/**
 * 创建应用错误
 */
export function createAppError(
  message: string,
  type: ErrorType = 'unknown',
  severity: ErrorSeverity = 'error',
  options?: {
    code?: string;
    details?: string;
    source?: string;
    metadata?: Record<string, unknown>;
    retryable?: boolean;
  }
): AppError {
  const error = new Error(message) as AppError;
  error.type = type;
  error.severity = severity;
  error.code = options?.code;
  error.details = options?.details;
  error.source = options?.source;
  error.metadata = options?.metadata;
  error.retryable = options?.retryable ?? false;
  return error;
}
