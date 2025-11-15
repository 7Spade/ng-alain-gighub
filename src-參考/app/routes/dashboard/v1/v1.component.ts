import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, effect, DOCUMENT } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Chart } from '@antv/g2';
import { OnboardingService } from '@delon/abc/onboarding';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-v1',
  standalone: true,
  templateUrl: './v1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class DashboardV1Component implements OnInit {
  private readonly http = inject(_HttpClient);
  private readonly obSrv = inject(OnboardingService);
  private readonly platform = inject(Platform);
  private readonly doc = inject(DOCUMENT);

  readonly todoData = signal([
    {
      completed: true,
      avatar: '1',
      name: '蘇先生',
      content: `請告訴我，我應該說點什麼好？`
    },
    {
      completed: false,
      avatar: '2',
      name: 'はなさき',
      content: `ハルカソラトキヘダツヒカリ`
    },
    {
      completed: false,
      avatar: '3',
      name: 'cipchk',
      content: `this world was never meant for one as beautiful as you.`
    },
    {
      completed: false,
      avatar: '4',
      name: 'Kent',
      content: `my heart is beating with hers`
    },
    {
      completed: false,
      avatar: '5',
      name: 'Are you',
      content: `They always said that I love beautiful girl than my friends`
    },
    {
      completed: false,
      avatar: '6',
      name: 'Forever',
      content: `Walking through green fields ，sunshine in my eyes.`
    }
  ]);

  // 使用 toSignal 轉換 HTTP Observable
  private readonly chartData$ = this.http.get('/chart').pipe(
    map((res: any) => ({
      webSite: res.visitData.slice(0, 10),
      salesData: res.salesData,
      offlineChartData: res.offlineChartData
    }))
  );
  private readonly chartData = toSignal(this.chartData$, { initialValue: null });

  readonly webSite = signal<any[]>([]);
  readonly salesData = signal<any[]>([]);
  readonly offlineChartData = signal<any[]>([]);

  constructor() {
    timer(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.genOnboarding());

    // 使用 effect 監聽 chartData 變化並更新 signals
    effect(() => {
      const data = this.chartData();
      if (data) {
        this.webSite.set(data.webSite);
        this.salesData.set(data.salesData);
        this.offlineChartData.set(data.offlineChartData);
      }
    });
  }

  fixDark(chart: Chart): void {
    if (!this.platform.isBrowser || (this.doc.body as HTMLBodyElement).getAttribute('data-theme') !== 'dark') return;

    chart.theme({
      styleSheet: {
        backgroundColor: 'transparent'
      }
    });
  }

  ngOnInit(): void {
    // 初始化邏輯已移至 effect
  }

  /**
   * 移除待辦事項
   */
  removeTodoItem(item: { completed: boolean; avatar: string; name: string; content: string }): void {
    const currentData = this.todoData();
    const index = currentData.indexOf(item);
    if (index > -1) {
      this.todoData.update(data => {
        const newData = [...data];
        newData.splice(index, 1);
        return newData;
      });
    }
  }

  private genOnboarding(): void {
    const KEY = 'on-boarding';
    if (!this.platform.isBrowser || localStorage.getItem(KEY) === '1') {
      return;
    }
    this.http.get(`./assets/tmp/on-boarding.json`).subscribe(res => {
      this.obSrv.start(res);
      localStorage.setItem(KEY, '1');
    });
  }
}
