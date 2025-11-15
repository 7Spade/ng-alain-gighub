import { ChangeDetectionStrategy, Component, OnInit, inject, signal, effect, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { STColumn } from '@delon/abc/st';
import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { getTimeDistance } from '@delon/util/date-time';
import { deepCopy } from '@delon/util/other';
import { SHARED_IMPORTS, yuan } from '@shared';
import type { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-analysis',
  standalone: true,
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class DashboardAnalysisComponent implements OnInit {
  private readonly http = inject(_HttpClient);
  readonly msg = inject(NzMessageService);
  private readonly i18n = inject(ALAIN_I18N_TOKEN);

  // 使用 toSignal 轉換 HTTP Observable
  private readonly chartData$ = this.http.get('/chart').pipe(
    map((res: any) => {
      res.offlineData.forEach((item: any) => {
        item.chart = deepCopy(res.offlineChartData);
      });
      return res;
    })
  );
  private readonly chartData = toSignal(this.chartData$, { initialValue: null });

  readonly data = signal<any>({});
  readonly loading = signal(true);
  readonly dateRange = signal<Date[]>([]);
  readonly dateRangeTypes = ['today', 'week', 'month', 'year'];
  readonly dateRangeType = signal<string>(this.dateRangeTypes[0]);
  readonly rankingListData = signal<Array<{ title: string; total: number }>>(
    Array(7)
      .fill({})
      .map((_, i) => {
        return {
          title: this.i18n.fanyi('app.analysis.test', { no: i }),
          total: 323234
        };
      })
  );
  readonly titleMap = {
    y1: this.i18n.fanyi('app.analysis.traffic'),
    y2: this.i18n.fanyi('app.analysis.payments')
  };
  readonly searchColumn: STColumn[] = [
    { title: { text: '排名', i18n: 'app.analysis.table.rank' }, index: 'index' },
    {
      title: { text: '搜索關鍵詞', i18n: 'app.analysis.table.search-keyword' },
      index: 'keyword',
      click: item => this.msg.success(item.keyword)
    },
    {
      type: 'number',
      title: { text: '用戶數', i18n: 'app.analysis.table.users' },
      index: 'count',
      sort: {
        compare: (a, b) => a.count - b.count
      }
    },
    {
      type: 'number',
      title: { text: '周漲幅', i18n: 'app.analysis.table.weekly-range' },
      index: 'range',
      render: 'range',
      sort: {
        compare: (a, b) => a.range - b.range
      }
    }
  ];

  readonly salesType = signal<string>('all');
  readonly salesPieData = signal<any>(null);
  readonly salesTotal = computed(() => {
    const pieData = this.salesPieData();
    if (!pieData) return 0;
    return pieData.reduce((pre: number, now: { y: number }) => now.y + pre, 0);
  });

  readonly saleTabs: string[] = ['sales', 'visits'];

  readonly offlineIdx = signal<number>(0);

  constructor() {
    // 使用 effect 監聽 chartData 變化並更新 signals
    effect(() => {
      const chartData = this.chartData();
      if (chartData) {
        this.data.set(chartData);
        this.loading.set(false);
        this.changeSaleType();
      }
    });

    // 使用 computed 監聽 salesType 變化
    effect(() => {
      const salesType = this.salesType();
      const data = this.data();
      if (data) {
        const pieData =
          salesType === 'all' ? data.salesTypeData : salesType === 'online' ? data.salesTypeDataOnline : data.salesTypeDataOffline;
        this.salesPieData.set(pieData);
      }
    });
  }

  ngOnInit(): void {
    // 初始化邏輯已移至 effect
  }

  setDate(type: string): void {
    this.dateRange.set(getTimeDistance(type as NzSafeAny));
    this.dateRangeType.set(type);
  }

  changeSaleType(): void {
    // 由 effect 自動處理
  }

  handlePieValueFormat(value: string | number): string {
    return yuan(value);
  }

  offlineChange(idx: number): void {
    const data = this.data();
    if (data && data.offlineData && data.offlineData[idx] && data.offlineData[idx].show !== true) {
      data.offlineData[idx].show = true;
      this.data.set({ ...data });
    }
  }
}
