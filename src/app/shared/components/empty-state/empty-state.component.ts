import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

/**
 * 空狀態元件
 * 
 * 用途：統一的空資料狀態顯示
 * 
 * @example
 * ```html
 * <app-empty-state 
 *   [description]="'暫無資料'" 
 *   [icon]="'inbox'"
 *   [actionText]="'新增項目'"
 *   (action)="handleCreate()" />
 * ```
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-empty 
      [nzNotFoundContent]="contentTemplate"
      [nzNotFoundImage]="image() || 'simple'"
      class="empty-state">
      <ng-template #contentTemplate>
        <div class="empty-content">
          @if (icon()) {
            <span nz-icon [nzType]="icon()!" class="empty-icon"></span>
          }
          <p class="empty-description">{{ description() }}</p>
          @if (actionText()) {
            <button nz-button nzType="primary" (click)="handleAction()">
              {{ actionText() }}
            </button>
          }
        </div>
      </ng-template>
    </nz-empty>
  `,
  styles: [`
    .empty-state {
      padding: 48px 24px;
    }

    .empty-content {
      text-align: center;

      .empty-icon {
        font-size: 64px;
        color: #d9d9d9;
        margin-bottom: 16px;
        display: block;
      }

      .empty-description {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        margin-bottom: 16px;
      }
    }
  `]
})
export class EmptyStateComponent {
  /** 空狀態描述文字 */
  description = input<string>('暫無資料');

  /** 顯示的圖示 */
  icon = input<string>();

  /** 自訂圖片 URL */
  image = input<string>();

  /** 操作按鈕文字 */
  actionText = input<string>();

  /** 操作按鈕點擊事件 */
  action = input<() => void>();

  handleAction(): void {
    const actionFn = this.action();
    if (actionFn) {
      actionFn();
    }
  }
}
