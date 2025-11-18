import { ChangeDetectionStrategy, Component, OnInit, inject, signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-workplace',
  standalone: true,
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class DashboardWorkplaceComponent implements OnInit {
  private readonly http = inject(_HttpClient);
  readonly msg = inject(NzMessageService);

  // 使用 toSignal 轉換 HTTP Observable
  private readonly data$ = zip(this.http.get('/chart'), this.http.get('/api/notice'), this.http.get('/api/activities')).pipe(
    map(([chart, notice, activities]: [any, any, any]) => ({
      radarData: chart.radarData,
      notice,
      activities: activities.map((item: any) => {
        item.template = item.template.split(/@\{([^{}]*)\}/gi).map((key: string) => {
          if (item[key]) {
            return `<a>${item[key].name}</a>`;
          }
          return key;
        });
        return item;
      })
    }))
  );
  private readonly data = toSignal(this.data$, { initialValue: null });

  readonly notice = signal<any[]>([]);
  readonly activities = signal<any[]>([]);
  readonly radarData = signal<any[]>([]);
  readonly loading = signal(true);

  readonly links = signal([
    {
      title: '操作一',
      href: ''
    },
    {
      title: '操作二',
      href: ''
    },
    {
      title: '操作三',
      href: ''
    },
    {
      title: '操作四',
      href: ''
    },
    {
      title: '操作五',
      href: ''
    },
    {
      title: '操作六',
      href: ''
    }
  ]);
  readonly members = signal([
    {
      id: 'members-1',
      title: '科學搬磚組',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      link: ''
    },
    {
      id: 'members-2',
      title: '程序員日常',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      link: ''
    },
    {
      id: 'members-3',
      title: '設計天團',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      link: ''
    },
    {
      id: 'members-4',
      title: '中二少女團',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      link: ''
    },
    {
      id: 'members-5',
      title: '騙你學計算機',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      link: ''
    }
  ]);

  constructor() {
    // 使用 effect 監聽 data 變化並更新 signals
    effect(() => {
      const data = this.data();
      if (data) {
        this.radarData.set(data.radarData);
        this.notice.set(data.notice);
        this.activities.set(data.activities);
        this.loading.set(false);
      }
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // 保留空方法以符合 OnInit 接口要求，初始化邏輯已移至 effect
  }

  /**
   * 添加連結
   */
  addLink(): void {
    this.links.update(links => [...links, { title: 'new titel', href: 'href' }]);
  }
}
