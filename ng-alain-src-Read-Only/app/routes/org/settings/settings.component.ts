import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivationEnd, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMenuModeType } from 'ng-zorro-antd/menu';
import { fromEvent, debounceTime, filter } from 'rxjs';

@Component({
  selector: 'app-org-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class OrgSettingsComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly d$ = inject(DestroyRef);
  mode: NzMenuModeType = 'inline';
  title!: string;
  menus: Array<{ key: string; title: string; selected?: boolean }> = [
    {
      key: 'general',
      title: '基本設置'
    },
    {
      key: 'teams',
      title: '團隊管理'
    },
    {
      key: 'members',
      title: '成員管理'
    }
  ];

  private setActive(): void {
    const key = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    this.menus.forEach(i => {
      i.selected = i.key === key;
    });
    this.title = this.menus.find(w => w.selected)?.title || '';
    this.cdr.detectChanges();
  }

  to(item: { key: string }): void {
    const slug = this.router.url.split('/')[2]; // 從 URL 獲取 slug
    this.router.navigateByUrl(`/org/${slug}/settings/${item.key}`);
  }

  private resize(): void {
    const el = this.el;
    let mode: NzMenuModeType = 'inline';
    const { offsetWidth } = el;
    if (offsetWidth < 641 && offsetWidth > 400) {
      mode = 'horizontal';
    }
    if (window.innerWidth < 768 && offsetWidth > 400) {
      mode = 'horizontal';
    }
    this.mode = mode;
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.d$),
        filter(e => e instanceof ActivationEnd)
      )
      .subscribe(() => this.setActive());

    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(this.d$), debounceTime(200))
      .subscribe(() => this.resize());

    this.setActive();
  }
}
