import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

/**
 * Debounce Click Directive
 *
 * 防抖点击指令，防止重复点击
 *
 * @example
 * ```html
 * <button appDebounceClick [debounceTime]="1000" (debounceClick)="submit()">
 *   提交
 * </button>
 * ```
 */
@Directive({
  selector: '[appDebounceClick]',
  standalone: true
})
export class DebounceClickDirective {
  /**
   * 防抖时间（毫秒），默认 300ms
   */
  @Input() debounceTime = 300;

  /**
   * 防抖点击事件
   */
  @Output() readonly debounceClick = new EventEmitter<MouseEvent>();

  private isProcessing = false;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.isProcessing) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.isProcessing = true;
    this.debounceClick.emit(event);

    setTimeout(() => {
      this.isProcessing = false;
    }, this.debounceTime);
  }
}
