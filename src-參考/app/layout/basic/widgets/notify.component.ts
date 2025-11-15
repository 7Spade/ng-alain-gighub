import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { NoticeIconList, NoticeIconSelect, NoticeItem } from '@delon/abc/notice-icon';
import { SHARED_IMPORTS } from '@shared';
import { add, formatDistanceToNow, parse } from 'date-fns';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'header-notify',
  template: `
    <notice-icon
      [data]="data"
      [count]="count"
      [loading]="loading"
      btnClass="alain-default__nav-item"
      btnIconClass="alain-default__nav-item-icon"
      (select)="select($event)"
      (clear)="clear($event)"
      (popoverVisibleChange)="loadData()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class HeaderNotifyComponent {
  private readonly msg = inject(NzMessageService);
  private readonly nzI18n = inject(NzI18nService);
  private readonly cdr = inject(ChangeDetectorRef);
  data: NoticeItem[] = [
    {
      title: '通知',
      list: [],
      emptyText: '你已查看所有通知',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
      clearText: '清空通知'
    },
    {
      title: '消息',
      list: [],
      emptyText: '您已讀完所有消息',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
      clearText: '清空消息'
    },
    {
      title: '待辦',
      list: [],
      emptyText: '你已完成所有待辦',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
      clearText: '清空待辦'
    }
  ];
  count = 5;
  loading = false;

  private updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach(i => (i.list = []));

    notices.forEach(item => {
      const newItem = { ...item } as NoticeIconList;
      if (typeof newItem.datetime === 'string') {
        newItem.datetime = parse(newItem.datetime, 'yyyy-MM-dd', new Date());
      }
      if (newItem.datetime) {
        newItem.datetime = formatDistanceToNow(newItem.datetime as Date, { locale: this.nzI18n.getDateLocale() });
      }
      if (newItem.extra && newItem['status']) {
        newItem['color'] = (
          {
            todo: undefined,
            processing: 'blue',
            urgent: 'red',
            doing: 'gold'
          } as Record<string, string | undefined>
        )[newItem['status']];
      }
      data.find(w => w.title === newItem['type'])!.list.push(newItem);
    });
    return data;
  }

  loadData(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const now = new Date();
      this.data = this.updateNoticeData([
        {
          id: '000000001',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '你收到了 14 份新週報',
          datetime: add(now, { days: 10 }),
          type: '通知'
        },
        {
          id: '000000002',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
          title: '你推薦的 曲妮妮 已通過第三輪面試',
          datetime: add(now, { days: -3 }),
          type: '通知'
        },
        {
          id: '000000003',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
          title: '這種模板可以區分多種通知類型',
          datetime: add(now, { months: -3 }),
          read: true,
          type: '通知'
        },
        {
          id: '000000004',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
          title: '左側圖標用於區分不同的類型',
          datetime: add(now, { years: -1 }),
          type: '通知'
        },
        {
          id: '000000005',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '內容不要超過兩行字，超出時自動截斷',
          datetime: '2017-08-07',
          type: '通知'
        },
        {
          id: '000000006',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '曲麗麗 評論了你',
          description: '描述信息描述信息描述信息',
          datetime: '2017-08-07',
          type: '消息'
        },
        {
          id: '000000007',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '朱偏右 回覆了你',
          description: '這種模板用於提醒誰與你發生了互動，左側放『誰』的頭像',
          datetime: '2017-08-07',
          type: '消息'
        },
        {
          id: '000000008',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '標題',
          description: '這種模板用於提醒誰與你發生了互動，左側放『誰』的頭像',
          datetime: '2017-08-07',
          type: '消息'
        },
        {
          id: '000000009',
          title: '任務名稱',
          description: '任務需要在 2017-01-12 20:00 前啟動',
          extra: '未開始',
          status: 'todo',
          type: '待辦'
        },
        {
          id: '000000010',
          title: '第三方緊急代碼變更',
          description: '冠霖提交於 2017-01-06，需在 2017-01-07 前完成代碼變更任務',
          extra: '馬上到期',
          status: 'urgent',
          type: '待辦'
        },
        {
          id: '000000011',
          title: '信息安全考試',
          description: '指派竹爾於 2017-01-09 前完成更新併發布',
          extra: '已耗時 8 天',
          status: 'doing',
          type: '待辦'
        },
        {
          id: '000000012',
          title: 'ABCD 版本發佈',
          description: '冠霖提交於 2017-01-06，需在 2017-01-07 前完成代碼變更任務',
          extra: '進行中',
          status: 'processing',
          type: '待辦'
        }
      ]);

      this.loading = false;
      this.cdr.detectChanges();
    }, 500);
  }

  clear(type: string): void {
    this.msg.success(`清空了 ${type}`);
  }

  select(res: NoticeIconSelect): void {
    this.msg.success(`點擊了 ${res.title} 的 ${res.item.title}`);
  }
}
