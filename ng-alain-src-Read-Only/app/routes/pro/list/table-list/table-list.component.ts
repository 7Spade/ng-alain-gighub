import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, inject, viewChild } from '@angular/core';
import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-table-list',
  standalone: true,
  templateUrl: './table-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class ProTableListComponent implements OnInit {
  private readonly http = inject(_HttpClient);
  private readonly msg = inject(NzMessageService);
  private readonly modalSrv = inject(NzModalService);
  private readonly cdr = inject(ChangeDetectorRef);

  q: {
    pi: number;
    ps: number;
    no: string;
    sorter: string;
    status: number | null;
    statusList: NzSafeAny[];
  } = {
    pi: 1,
    ps: 10,
    no: '',
    sorter: '',
    status: null,
    statusList: []
  };
  data: any[] = [];
  loading = false;
  status = [
    { index: 0, text: '關閉', value: false, type: 'default', checked: false },
    {
      index: 1,
      text: '運行中',
      value: false,
      type: 'processing',
      checked: false
    },
    { index: 2, text: '已上線', value: false, type: 'success', checked: false },
    { index: 3, text: '異常', value: false, type: 'error', checked: false }
  ];
  readonly st = viewChild.required<STComponent>('st');
  columns: STColumn[] = [
    { title: '', index: 'key', type: 'checkbox' },
    { title: '規則編號', index: 'no' },
    { title: '描述', index: 'description' },
    {
      title: '服務調用次數',
      index: 'callNo',
      type: 'number',
      format: item => `${item.callNo} 萬`,
      sort: {
        compare: (a, b) => a.callNo - b.callNo
      }
    },
    {
      title: '狀態',
      index: 'status',
      render: 'status',
      filter: {
        menus: this.status,
        fn: (filter, record) => record.status === filter['index']
      }
    },
    {
      title: '更新時間',
      index: 'updatedAt',
      type: 'date',
      sort: {
        compare: (a, b) => a.updatedAt - b.updatedAt
      }
    },
    {
      title: '操作',
      buttons: [
        {
          text: '配置',
          click: item => this.msg.success(`配置${item.no}`)
        },
        {
          text: '訂閱警報',
          click: item => this.msg.success(`訂閱警報${item.no}`)
        }
      ]
    }
  ];
  selectedRows: STData[] = [];
  description = '';
  totalCallNo = 0;
  expandForm = false;

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.loading = true;
    this.q.statusList = this.status.filter(w => w.checked).map(item => item.index);
    if (this.q.status !== null && this.q.status > -1) {
      this.q.statusList.push(this.q.status);
    }
    this.http
      .get('/rule', this.q)
      .pipe(
        map((list: Array<{ status: number; statusText: string; statusType: string }>) =>
          list.map(i => {
            const statusItem = this.status[i.status];
            i.statusText = statusItem.text;
            i.statusType = statusItem.type;
            return i;
          })
        ),
        tap(() => (this.loading = false))
      )
      .subscribe(res => {
        this.data = res;
        this.cdr.detectChanges();
      });
  }

  stChange(e: STChange): void {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv['callNo'], 0);
        this.cdr.detectChanges();
        break;
      case 'filter':
        this.getData();
        break;
    }
  }

  remove(): void {
    this.http.delete('/rule', { nos: this.selectedRows.map(i => i['no']).join(',') }).subscribe(() => {
      this.getData();
      this.st().clearCheck();
    });
  }

  approval(): void {
    this.msg.success(`審批了 ${this.selectedRows.length} 筆`);
  }

  add(tpl: TemplateRef<unknown>): void {
    this.modalSrv.create({
      nzTitle: '新建規則',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.http.post('/rule', { description: this.description }).subscribe(() => this.getData());
      }
    });
  }

  reset(): void {
    // wait form reset updated finished
    setTimeout(() => this.getData());
  }
}
