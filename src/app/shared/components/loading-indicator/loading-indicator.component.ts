import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

/**
 * 載入指示器元件
 *
 * 用途：統一的載入中狀態顯示
 *
 * @example
 * ```html
 * <app-loading-indicator [loading]="isLoading()" [text]="'載入中...'" />
 * ```
 */
@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <div class="loading-container" [ngClass]="{ fullscreen: fullscreen() }">
        <nz-spin [nzSize]="size()" [nzTip]="text()" />
      </div>
    }
  `,
  styles: [
    `
      .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;

        &.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.8);
          z-index: 1000;
        }
      }
    `
  ]
})
export class LoadingIndicatorComponent {
  /** 是否顯示載入狀態 */
  loading = input<boolean>(false);

  /** 載入提示文字 */
  text = input<string>('載入中...');

  /** 載入指示器大小 */
  size = input<'small' | 'default' | 'large'>('default');

  /** 是否全螢幕顯示 */
  fullscreen = input<boolean>(false);
}
