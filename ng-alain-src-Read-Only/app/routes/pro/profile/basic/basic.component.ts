import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { tap } from 'rxjs';

@Component({
  selector: 'app-profile-basic',
  standalone: true,
  templateUrl: './basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class ProProfileBaseComponent {
  private readonly http = inject(_HttpClient);
  private readonly msg = inject(NzMessageService);

  basicNum = 0;
  amountNum = 0;
  goods = this.http.get('/profile/goods').pipe(
    tap((list: Array<{ num: number; amount: number }>) => {
      list.forEach(item => {
        this.basicNum += Number(item.num);
        this.amountNum += Number(item.amount);
      });
    })
  );
  goodsColumns: STColumn[] = [
    {
      title: '商品編號',
      index: 'id',
      type: 'link',
      click: item => this.msg.success(`show ${item.id}`)
    },
    { title: '商品名稱', index: 'name' },
    { title: '商品條碼', index: 'barcode' },
    { title: '單價', index: 'price', type: 'currency' },
    { title: '數量（件）', index: 'num', className: 'text-right' },
    { title: '金額', index: 'amount', type: 'currency' }
  ];
  progress = this.http.get('/profile/progress');
  progressColumns: STColumn[] = [
    { title: '時間', index: 'time' },
    { title: '當前進度', index: 'rate' },
    {
      title: '狀態',
      index: 'status',
      type: 'badge',
      badge: {
        success: { text: '成功', color: 'success' },
        processing: { text: '進行中', color: 'processing' }
      }
    },
    { title: '操作員ID', index: 'operator' },
    { title: '耗時', index: 'cost' }
  ];
}
