import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  inject,
  signal,
  output
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SHARED_IMPORTS } from '@shared';
import { Subject, debounceTime, distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'header-search',
  template: `
    <nz-input-group [nzPrefix]="iconTpl" [nzSuffix]="loadingTpl">
      <ng-template #iconTpl>
        <i nz-icon [nzType]="focus() ? 'arrow-down' : 'search'"></i>
      </ng-template>
      <ng-template #loadingTpl>
        @if (loading()) {
          <i nz-icon nzType="loading"></i>
        }
      </ng-template>
      <input
        type="text"
        nz-input
        [(ngModel)]="q"
        [nzAutocomplete]="auto"
        (input)="search($event)"
        (focus)="qFocus()"
        (blur)="qBlur()"
        hotkey="F1"
        [attr.placeholder]="'menu.search.placeholder' | i18n"
      />
    </nz-input-group>
    <nz-autocomplete nzBackfill #auto>
      @for (i of options(); track $index) {
        <nz-auto-option [nzValue]="i">{{ i }}</nz-auto-option>
      }
    </nz-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class HeaderSearchComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  q = '';
  qIpt: HTMLInputElement | null = null;
  readonly options = signal<string[]>([]);
  private readonly search$ = new Subject<string>();
  readonly loading = signal(false);

  @HostBinding('class.alain-default__search-focus')
  readonly focus = signal(false);

  @HostBinding('class.alain-default__search-toggled')
  readonly searchToggled = signal(false);

  // TODO: Skipped for migration because:
  //  Accessor inputs cannot be migrated as they are too complex.
  @Input()
  set toggleChange(value: boolean) {
    if (typeof value === 'undefined') {
      return;
    }
    this.searchToggled.set(value);
    this.focus.set(value);
    if (value) {
      setTimeout(() => this.qIpt!.focus());
    }
  }
  readonly toggleChangeChange = output<boolean>();

  constructor() {
    // 設置搜索效果：debounce + distinctUntilChanged
    this.search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.loading.set(true);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        this.options.set(value ? [value, value + value, value + value + value] : []);
        this.loading.set(false);
      });
  }

  ngAfterViewInit(): void {
    this.qIpt = this.el.querySelector('.ant-input') as HTMLInputElement;
  }

  ngOnDestroy(): void {
    this.search$.complete();
  }

  qFocus(): void {
    this.focus.set(true);
  }

  qBlur(): void {
    this.focus.set(false);
    this.searchToggled.set(false);
    this.options.set([]);
    this.toggleChangeChange.emit(false);
  }

  search(ev: Event): void {
    this.search$.next((ev.target as HTMLInputElement).value);
  }
}
