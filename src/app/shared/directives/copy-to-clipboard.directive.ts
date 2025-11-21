import { Directive, HostListener, Input, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * Copy to Clipboard Directive
 *
 * 复制文本到剪贴板
 *
 * @example
 * ```html
 * <button appCopyToClipboard [copyText]="'Hello World'" [successMessage]="'复制成功'">
 *   复制
 * </button>
 * ```
 */
@Directive({
  selector: '[appCopyToClipboard]',
  standalone: true
})
export class CopyToClipboardDirective {
  private readonly message = inject(NzMessageService);

  /**
   * 要复制的文本内容
   */
  @Input() copyText = '';

  /**
   * 复制成功时的提示消息
   */
  @Input() successMessage = '复制成功';

  /**
   * 复制失败时的提示消息
   */
  @Input() errorMessage = '复制失败';

  @HostListener('click')
  async onClick(): Promise<void> {
    if (!this.copyText) {
      console.warn('[CopyToClipboard] copyText is empty');
      return;
    }

    try {
      // 优先使用现代 Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(this.copyText);
        this.message.success(this.successMessage);
      } else {
        // 降级方案：使用传统方法
        this.fallbackCopyTextToClipboard(this.copyText);
        this.message.success(this.successMessage);
      }
    } catch (error) {
      console.error('[CopyToClipboard] Copy failed:', error);
      // 尝试降级方案
      try {
        this.fallbackCopyTextToClipboard(this.copyText);
        this.message.success(this.successMessage);
      } catch (fallbackError) {
        console.error('[CopyToClipboard] Fallback copy failed:', fallbackError);
        this.message.error(this.errorMessage);
      }
    }
  }

  /**
   * 降级方案：使用传统方法复制文本
   */
  private fallbackCopyTextToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        throw new Error('execCommand copy failed');
      }
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
