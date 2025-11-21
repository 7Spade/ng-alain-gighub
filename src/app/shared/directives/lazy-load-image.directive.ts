import { Directive, ElementRef, Input, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';

/**
 * Lazy Load Image Directive
 *
 * 图片懒加载指令，使用 Intersection Observer API
 * 当图片进入视口时自动加载
 *
 * @example
 * ```html
 * <img appLazyLoadImage [lazySrc]="imageUrl" [lazyPlaceholder]="placeholderUrl" alt="图片" />
 * ```
 */
@Directive({
  selector: '[appLazyLoadImage]',
  standalone: true
})
export class LazyLoadImageDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLImageElement>);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * 要懒加载的图片 URL
   */
  @Input() lazySrc = '';

  /**
   * 占位图 URL（可选）
   */
  @Input() lazyPlaceholder = '';

  /**
   * Intersection Observer 的 rootMargin
   * 用于提前开始加载图片，默认 '50px'
   */
  @Input() rootMargin = '50px';

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const img = this.elementRef.nativeElement;

    if (!this.lazySrc) {
      console.warn('[LazyLoadImage] lazySrc is empty');
      return;
    }

    // 设置占位图
    if (this.lazyPlaceholder) {
      img.src = this.lazyPlaceholder;
    }

    // 检查浏览器支持 Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // 不支持则直接加载
      console.warn('[LazyLoadImage] IntersectionObserver not supported, loading image immediately');
      img.src = this.lazySrc;
      return;
    }

    // 创建 Intersection Observer
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 图片进入视口，开始加载
            img.src = this.lazySrc;
            // 加载完成后停止观察
            this.observer?.unobserve(img);
          }
        });
      },
      {
        rootMargin: this.rootMargin
      }
    );

    this.observer.observe(img);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
