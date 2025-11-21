import { DestroyRef, Directive, ElementRef, EventEmitter, inject, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

/**
 * Click Outside Directive
 *
 * 监听点击外部区域事件，常用于关闭下拉菜单、模态框等
 *
 * @example
 * ```html
 * <div appClickOutside (clickOutside)="closeMenu()">
 *   <button>菜单</button>
 * </div>
 * ```
 */
@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * 点击外部区域时触发的事件
   */
  @Output() readonly clickOutside = new EventEmitter<MouseEvent>();

  constructor() {
    // 延迟绑定，避免立即触发
    setTimeout(() => {
      fromEvent<MouseEvent>(document, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event: MouseEvent) => {
          const target = event.target as HTMLElement;
          const clickedInside = this.elementRef.nativeElement.contains(target);

          if (!clickedInside) {
            this.clickOutside.emit(event);
          }
        });
    }, 0);
  }
}
