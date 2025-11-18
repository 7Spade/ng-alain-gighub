import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  signal,
  effect,
  viewChild
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivationEnd, Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import { zip, filter } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account-center',
  standalone: true,
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class ProAccountCenterComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly http = inject(_HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  private readonly tagInput = viewChild.required<ElementRef<HTMLInputElement>>('tagInput');

  // 使用 toSignal 轉換 HTTP Observable
  private readonly data$ = zip(this.http.get('/user/current'), this.http.get('/api/notice')).pipe(
    map(([user, notice]: [any, any]) => ({ user, notice }))
  );
  private readonly data = toSignal(this.data$, { initialValue: null });

  readonly user = signal<any>(null);
  readonly notice = signal<any>(null);
  readonly tabs = signal([
    {
      key: 'articles',
      tab: '文章 (8)'
    },
    {
      key: 'applications',
      tab: '應用 (8)'
    },
    {
      key: 'projects',
      tab: '項目 (8)'
    }
  ]);
  readonly pos = signal(0);
  readonly taging = signal(false);
  readonly tagValue = signal('');

  constructor() {
    // 使用 effect 監聽 data 變化並更新 signals
    effect(() => {
      const data = this.data();
      if (data) {
        this.user.set(data.user);
        this.notice.set(data.notice);
      }
    });

    // 使用 effect 監聽 router 變化
    effect(() => {
      void this.router.url; // 觸發 effect 執行
      this.setActive();
    });

    // 監聽 router events
    this.router.events
      .pipe(
        filter(e => e instanceof ActivationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.setActive());
  }

  private setActive(): void {
    const key = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    const idx = this.tabs().findIndex(w => w.key === key);
    if (idx !== -1) {
      this.pos.set(idx);
    }
  }

  ngOnInit(): void {
    this.setActive();
  }

  to(item: { key: string }): void {
    this.router.navigateByUrl(`/account/center/${item.key}`);
  }

  tagShowIpt(): void {
    this.taging.set(true);
    setTimeout(() => this.tagInput().nativeElement.focus(), 0);
  }

  tagBlur(): void {
    const user = this.user();
    const tagValue = this.tagValue();
    if (tagValue && user && user.tags && user.tags.filter((tag: { label: string }) => tag.label === tagValue).length === 0) {
      const updatedUser = { ...user, tags: [...user.tags, { label: tagValue }] };
      this.user.set(updatedUser);
    }
    this.tagValue.set('');
    this.taging.set(false);
  }

  tagEnter(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.tagBlur();
    }
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // cleanup 由 takeUntilDestroyed 處理
  }
}
