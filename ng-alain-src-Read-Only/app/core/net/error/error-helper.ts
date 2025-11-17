import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import type { ErrorRecord, ErrorSeverity, ErrorType } from '@shared';

/**
 * Error Helper
 *
 * 錯誤處理工具函數
 */

/**
 * 判斷錯誤嚴重程度
 */
export function determineErrorSeverity(statusCode?: number): ErrorSeverity {
  if (!statusCode) {
    return 'error';
  }

  if (statusCode >= 500) {
    return 'critical';
  } else if (statusCode >= 400) {
    return 'error';
  } else {
    return 'warning';
  }
}

/**
 * 判斷是否為可重試錯誤
 */
export function isRetryableError(statusCode?: number, error?: any): boolean {
  if (!statusCode) {
    // 網路錯誤通常可重試
    return error?.name === 'NetworkError' || error?.message?.includes('network');
  }

  // 5xx 錯誤通常可重試
  if (statusCode >= 500) {
    return true;
  }

  // 408 Request Timeout 可重試
  if (statusCode === 408) {
    return true;
  }

  // 429 Too Many Requests 可重試
  if (statusCode === 429) {
    return true;
  }

  return false;
}

/**
 * 判斷錯誤類型
 */
export function determineErrorType(statusCode?: number, error?: any): ErrorType {
  if (!statusCode) {
    // 沒有狀態碼可能是網路錯誤
    if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
      return 'network';
    }
    return 'unknown';
  }

  if (statusCode === 401 || statusCode === 403) {
    return 'permission';
  }

  if (statusCode >= 400 && statusCode < 500) {
    return 'http';
  }

  if (statusCode >= 500) {
    return 'http';
  }

  return 'unknown';
}

/**
 * 從 HTTP 錯誤響應創建錯誤記錄
 */
export function createErrorFromHttpResponse(
  ev: HttpErrorResponse,
  req: HttpRequest<any>,
  source?: string
): Omit<ErrorRecord, 'id' | 'timestamp'> {
  const statusCode = ev.status;
  const severity = determineErrorSeverity(statusCode);
  const type = determineErrorType(statusCode, ev.error);
  const retryable = isRetryableError(statusCode, ev.error);

  // 構建錯誤訊息
  let message = ev.error?.message || ev.message || `HTTP ${statusCode} 錯誤`;
  if (ev.error?.msg) {
    message = ev.error.msg;
  }

  // 構建詳細資訊
  let details: string | undefined;
  if (ev.error?.error) {
    details = typeof ev.error.error === 'string' ? ev.error.error : JSON.stringify(ev.error.error);
  } else if (ev.error && typeof ev.error === 'object') {
    details = JSON.stringify(ev.error);
  }

  return {
    type,
    severity,
    message,
    details,
    source: source || 'HTTP Interceptor',
    url: req.urlWithParams || req.url,
    statusCode,
    retryable,
    cleared: false,
    metadata: {
      method: req.method,
      headers: req.headers.keys(),
      error: ev.error
    }
  };
}
