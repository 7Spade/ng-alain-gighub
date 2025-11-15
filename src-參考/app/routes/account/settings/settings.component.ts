import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, effect } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivationEnd, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMenuModeType } from 'ng-zorro-antd/menu';
import { fromEvent, debounceTime, filter, startWith } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class ProAccountSettingsComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly d$ = inject(DestroyRef);

  readonly mode = signal<NzMenuModeType>('inline');
  readonly title = signal<string>('');
  readonly menus = signal<Array<{ key: string; title: string; selected?: boolean }>>([
    {
      key: 'base',
      title: '基本設置'
    },
    {
      key: 'security',
      title: '安全設置'
    },
    {
      key: 'binding',
      title: '賬號綁定'
    },
    {
      key: 'notification',
      title: '新消息通知'
    }
  ]);

  constructor() {
    // 使用 toSignal 轉換 resize events
    const resize$ = fromEvent(window, 'resize').pipe(
      debounceTime(200),
      startWith(null),
      map(() => {
        const el = this.el;
        let mode: NzMenuModeType = 'inline';
        const { offsetWidth } = el;
        if (offsetWidth < 641 && offsetWidth > 400) {
          mode = 'horizontal';
        }
        if (window.innerWidth < 768 && offsetWidth > 400) {
          mode = 'horizontal';
        }
        return mode;
      })
    );
    const resizeMode = toSignal(resize$, { initialValue: 'inline' });

    // 使用 effect 監聽 resize 變化
    effect(() => {
      const mode = resizeMode();
      if (mode) {
        this.mode.set(mode);
      }
    });

    // 使用 effect 監聽 router 變化
    effect(() => {
      void this.router.url; // 觸發 effect 執行
      this.setActive();
    });
  }

  private setActive(): void {
    const key = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    const updatedMenus = this.menus().map(i => ({
      ...i,
      selected: i.key === key
    }));
    this.menus.set(updatedMenus);
    const selectedMenu = updatedMenus.find(w => w.selected);
    if (selectedMenu) {
      this.title.set(selectedMenu.title);
    }
  }

  to(item: { key: string }): void {
    this.router.navigateByUrl(`/account/settings/${item.key}`);
  }

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.d$),
        filter(e => e instanceof ActivationEnd)
      )
      .subscribe(() => this.setActive());

    this.setActive();
  }
}
