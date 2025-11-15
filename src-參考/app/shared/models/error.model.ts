/**
 * Error Models
 *
 * 錯誤狀態管理相關的模型定義
 */

/**
 * 錯誤類型
 */
export type ErrorType =
  | 'http' // HTTP 請求錯誤
  | 'network' // 網路連線錯誤
  | 'validation' // 表單驗證錯誤
  | 'business' // 業務邏輯錯誤
  | 'permission' // 權限錯誤
  | 'unknown'; // 未知錯誤

/**
 * 錯誤嚴重程度
 */
export type ErrorSeverity =
  | 'critical' // 嚴重（需立即處理）
  | 'error' // 錯誤（需處理）
  | 'warning' // 警告（可忽略）
  | 'info'; // 資訊（僅提示）

/**
 * 錯誤記錄
 */
export interface ErrorRecord {
  /** 錯誤唯一 ID */
  id: string;

  /** 錯誤類型 */
  type: ErrorType;

  /** 嚴重程度 */
  severity: ErrorSeverity;

  /** 錯誤訊息 */
  message: string;

  /** 詳細資訊 */
  details?: string;

  /** 錯誤來源（組件/服務名稱） */
  source?: string;

  /** 發生時間 */
  timestamp: Date;

  /** 相關 URL（HTTP 錯誤） */
  url?: string;

  /** HTTP 狀態碼 */
  statusCode?: number;

  /** 是否可重試 */
  retryable: boolean;

  /** 重試函數 */
  retryFn?: () => void;

  /** 額外元數據 */
  metadata?: Record<string, any>;

  /** 是否已清除（用於過濾） */
  cleared?: boolean;
}
