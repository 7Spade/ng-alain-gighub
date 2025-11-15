import { Component, inject, viewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { ModalHelper } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ExtrasPoiEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-extras-poi',
  standalone: true,
  templateUrl: './poi.component.html',
  imports: SHARED_IMPORTS
})
export class ExtrasPoiComponent {
  private readonly msg = inject(NzMessageService);
  private readonly modal = inject(ModalHelper);

  readonly st = viewChild.required<STComponent>('st');
  s = {
    pi: 1,
    ps: 10,
    user_id: '',
    s: '',
    q: ''
  };
  url = '/pois';
  columns: STColumn[] = [
    { title: '編號', index: 'id', width: '100px' },
    { title: '門店名稱', index: 'name' },
    { title: '分店名', index: 'branch_name' },
    { title: '狀態', index: 'status_str', width: '100px' },
    {
      title: '操作',
      width: '180px',
      buttons: [
        {
          text: '編輯',
          type: 'modal',
          modal: {
            component: ExtrasPoiEditComponent,
            paramsName: 'i'
          },
          click: () => this.msg.info('回調，重新發起列表刷新')
        },
        { text: '圖片', click: () => this.msg.info('click photo') },
        { text: '經營SKU', click: () => this.msg.info('click sku') }
      ]
    }
  ];

  add(): void {
    this.modal.createStatic(ExtrasPoiEditComponent, { i: { id: 0 } }).subscribe(() => {
      this.st().load();
      this.msg.info('回調，重新發起列表刷新');
    });
  }
}
