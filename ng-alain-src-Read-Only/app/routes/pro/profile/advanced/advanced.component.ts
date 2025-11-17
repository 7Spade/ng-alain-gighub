import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import type { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-profile-advanced',
  standalone: true,
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class ProProfileAdvancedComponent implements OnInit {
  readonly msg = inject(NzMessageService);
  private readonly http = inject(_HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  list: Array<Record<string, NzSafeAny>> = [];
  data = {
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: []
  };
  opColumns: STColumn[] = [
    { title: '操作類型', index: 'type' },
    { title: '操作人', index: 'name' },
    { title: '執行結果', index: 'status', render: 'status' },
    { title: '操作時間', index: 'updatedAt', type: 'date' },
    { title: '備註', index: 'memo', default: '-' }
  ];

  ngOnInit(): void {
    this.http.get('/profile/advanced').subscribe(res => {
      this.data = res;
      this.change({ index: 0, tab: null });
      this.cdr.detectChanges();
    });
  }

  change(args: NzTabChangeEvent): void {
    this.list = (this.data as NzSafeAny)[`advancedOperation${args.index! + 1}`];
  }
}
