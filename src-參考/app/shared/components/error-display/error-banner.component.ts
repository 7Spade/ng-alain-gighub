import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { ErrorRecord } from '@shared';
import { SHARED_IMPORTS } from '@shared';

/**
 * Error Banner Component
 *
 * 錯誤橫幅組件
 * 顯示當前活躍的錯誤，支援清除和重試功能
 *
 * @example
 * ```html
 * <app-error-banner
 *   [errors]="errorService.activeErrors()"
 *   (clear)="errorService.removeError($event)"
 *   (retry)="errorService.retryError($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-error-banner',
  standalone: true,
  template: `
    @if (displayErrors().length > 0) {
      <div class="error-banner-container">
        @for (error of displayErrors(); track error.id) {
          <nz-alert
            [nzType]="getAlertType(error.severity)"
            [nzMessage]="error.message"
            [nzDescription]="error.details ?? null"
            [nzShowIcon]="true"
            [nzCloseable]="true"
            (nzOnClose)="onClear(error.id)"
            class="error-banner-item"
          >
            <div class="error-banner-actions">
              @if (error.retryable && error.retryFn) {
                <button nz-button nzType="link" nzSize="small" (click)="onRetry(error.id)">
                  <span nz-icon nzType="reload" nzTheme="outline"></span>
                  重試
                </button>
              }
              <button nz-button nzType="link" nzSize="small" (click)="onClear(error.id)">
                <span nz-icon nzType="close" nzTheme="outline"></span>
                關閉
              </button>
            </div>
          </nz-alert>
        }
      </div>
    }
  `,
  styles: [
    `
      .error-banner-container {
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        z-index: 1050;
        padding: 0 24px;
        pointer-events: none;
      }

      .error-banner-item {
        margin-bottom: 8px;
        pointer-events: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .error-banner-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        justify-content: flex-end;
      }

      :host ::ng-deep .ant-alert-with-description {
        padding: 16px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class ErrorBannerComponent {
  /** 錯誤列表 */
  readonly errors = input<ErrorRecord[]>([]);

  /** 最大顯示數量（預設 3） */
  readonly maxDisplay = input<number>(3);

  /** 清除錯誤事件 */
  readonly clear = output<string>();

  /** 重試錯誤事件 */
  readonly retry = output<string>();

  /** 要顯示的錯誤列表（按嚴重程度排序，只顯示最嚴重的幾個） */
  readonly displayErrors = computed(() => {
    const errorList = this.errors();
    const max = this.maxDisplay();

    // 按嚴重程度排序：critical > error > warning > info
    const severityOrder: Record<string, number> = {
      critical: 0,
      error: 1,
      warning: 2,
      info: 3
    };

    return errorList
      .filter(e => !e.cleared)
      .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
      .slice(0, max);
  });

  /**
   * 獲取 Alert 類型
   */
  getAlertType(severity: ErrorRecord['severity']): 'error' | 'warning' | 'info' {
    switch (severity) {
      case 'critical':
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  }

  /**
   * 處理清除錯誤
   */
  onClear(errorId: string): void {
    this.clear.emit(errorId);
  }

  /**
   * 處理重試錯誤
   */
  onRetry(errorId: string): void {
    this.retry.emit(errorId);
  }
}
