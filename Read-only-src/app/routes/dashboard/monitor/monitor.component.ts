import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import type { CountdownConfig } from 'ngx-countdown';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-monitor',
  standalone: true,
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class DashboardMonitorComponent implements OnInit, OnDestroy {
  private readonly http = inject(_HttpClient);

  // 使用 toSignal 轉換 HTTP Observable
  private readonly data$ = zip(this.http.get('/chart'), this.http.get('/chart/tags')).pipe(
    map(([res, tags]: [any, any]) => {
      tags.list[Math.floor(Math.random() * tags.list.length) + 1].value = 1000;
      return {
        data: res,
        tags: tags.list
      };
    })
  );
  private readonly chartData = toSignal(this.data$, { initialValue: null });

  readonly data = signal<any>({});
  readonly tags = signal<any[]>([]);
  readonly loading = signal(true);
  readonly q = signal({
    start: null,
    end: null
  });
  readonly percent = signal<number | null>(null);
  readonly cd: CountdownConfig = {
    format: `HH:mm:ss.S`,
    leftTime: 10000
  };

  // region: active chart
  private activeTime$: any;
  readonly activeData = signal<any[]>([]);
  readonly activeStat = signal({
    max: 0,
    min: 0,
    t1: '',
    t2: ''
  });

  constructor() {
    // 使用 effect 監聽 chartData 變化並更新 signals
    effect(() => {
      const chartData = this.chartData();
      if (chartData) {
        this.data.set(chartData.data);
        this.tags.set(chartData.tags);
        this.loading.set(false);
      }
    });
  }

  ngOnInit(): void {
    // active chart
    this.refData();
    this.activeTime$ = setInterval(() => this.refData(), 1000 * 2);
  }

  refData(): void {
    const activeData: any[] = [];
    for (let i = 0; i < 24; i += 1) {
      activeData.push({
        x: `${i.toString().padStart(2, '0')}:00`,
        y: i * 50 + Math.floor(Math.random() * 200)
      });
    }
    this.activeData.set(activeData);

    // stat
    const sorted = [...activeData].sort((a, b) => a.y - b.y);
    this.activeStat.set({
      max: sorted[sorted.length - 1].y + 200,
      min: sorted[Math.floor(activeData.length / 2)].y,
      t1: activeData[Math.floor(activeData.length / 2)].x,
      t2: activeData[activeData.length - 1].x
    });

    // percent
    this.percent.set(Math.floor(Math.random() * 100));
  }

  // endregion

  couponFormat(val: any): string {
    switch (parseInt(val, 10)) {
      case 20:
        return '差';
      case 40:
        return '中';
      case 60:
        return '良';
      case 80:
        return '優';
      default:
        return '';
    }
  }

  ngOnDestroy(): void {
    if (this.activeTime$) {
      clearInterval(this.activeTime$);
    }
  }
}
