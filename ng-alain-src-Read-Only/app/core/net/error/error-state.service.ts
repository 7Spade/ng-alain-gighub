import { Injectable, computed, signal } from '@angular/core';
import type { ErrorRecord, ErrorSeverity, ErrorType } from '@shared';

/**
 * Error State Service
 *
 * 錯誤狀態管理服務
 * 使用 Signal 管理全域錯誤狀態，提供錯誤查詢、過濾、歷史記錄等功能
 *
 * @example
 * ```typescript
 * constructor(private errorService: ErrorStateService) {}
 *
 * // 監聽錯誤
 * readonly errors = this.errorService.activeErrors;
 * readonly hasErrors = this.errorService.hasErrors;
 *
 * // 添加錯誤
 * this.errorService.addError({
 *   type: 'business',
 *   severity: 'error',
 *   message: '操作失敗',
 *   retryable: false
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorStateService {
  /** 當前活躍的錯誤列表 */
  readonly #errors = signal<ErrorRecord[]>([]);

  /** 錯誤歷史記錄（包含已清除的錯誤） */
  readonly #errorHistory = signal<ErrorRecord[]>([]);

  /** 只讀的錯誤列表 */
  readonly errors = this.#errors.asReadonly();

  /** 只讀的錯誤歷史 */
  readonly errorHistory = this.#errorHistory.asReadonly();

  /** 當前活躍的錯誤（未清除的） */
  readonly activeErrors = computed(() => this.#errors().filter(e => !e.cleared));

  /** 是否有錯誤 */
  readonly hasErrors = computed(() => this.activeErrors().length > 0);

  /** 錯誤數量 */
  readonly errorCount = computed(() => this.activeErrors().length);

  /** 嚴重錯誤列表 */
  readonly criticalErrors = computed(() => this.activeErrors().filter(e => e.severity === 'critical'));

  /** 一般錯誤列表 */
  readonly normalErrors = computed(() => this.activeErrors().filter(e => e.severity !== 'critical'));

  /**
   * 添加錯誤
   *
   * @param error 錯誤記錄（不包含 id 和 timestamp）
   * @returns 錯誤 ID
   */
  addError(error: Omit<ErrorRecord, 'id' | 'timestamp'>): string {
    const id = this.generateErrorId();
    const timestamp = new Date();

    const errorRecord: ErrorRecord = {
      ...error,
      id,
      timestamp
    };

    // 添加到當前錯誤列表
    this.#errors.update(errors => [...errors, errorRecord]);

    // 添加到歷史記錄
    this.#errorHistory.update(history => [...history, errorRecord]);

    return id;
  }

  /**
   * 移除錯誤（標記為已清除）
   *
   * @param id 錯誤 ID
   */
  removeError(id: string): void {
    this.#errors.update(errors => errors.map(error => (error.id === id ? { ...error, cleared: true } : error)));
  }

  /**
   * 清除所有錯誤
   */
  clearErrors(): void {
    this.#errors.update(errors => errors.map(error => ({ ...error, cleared: true })));
  }

  /**
   * 清除特定類型的錯誤
   *
   * @param type 錯誤類型
   */
  clearErrorsByType(type: ErrorType): void {
    this.#errors.update(errors => errors.map(error => (error.type === type ? { ...error, cleared: true } : error)));
  }

  /**
   * 清除特定嚴重程度的錯誤
   *
   * @param severity 嚴重程度
   */
  clearErrorsBySeverity(severity: ErrorSeverity): void {
    this.#errors.update(errors => errors.map(error => (error.severity === severity ? { ...error, cleared: true } : error)));
  }

  /**
   * 重試錯誤
   *
   * @param id 錯誤 ID
   */
  retryError(id: string): void {
    const error = this.#errors().find(e => e.id === id);
    if (error && error.retryable && error.retryFn) {
      error.retryFn();
      // 重試後移除錯誤
      this.removeError(id);
    }
  }

  /**
   * 獲取錯誤
   *
   * @param id 錯誤 ID
   * @returns 錯誤記錄或 undefined
   */
  getError(id: string): ErrorRecord | undefined {
    return this.#errors().find(e => e.id === id);
  }

  /**
   * 過濾錯誤
   *
   * @param predicate 過濾條件
   * @returns 符合條件的錯誤列表
   */
  filterErrors(predicate: (error: ErrorRecord) => boolean): ErrorRecord[] {
    return this.activeErrors().filter(predicate);
  }

  /**
   * 清除錯誤歷史（保留當前活躍的錯誤）
   */
  clearHistory(): void {
    const activeErrors = this.activeErrors();
    this.#errorHistory.set([...activeErrors]);
  }

  /**
   * 生成錯誤 ID
   *
   * @returns 唯一的錯誤 ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
