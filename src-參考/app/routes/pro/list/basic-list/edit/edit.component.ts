import { Component, inject } from '@angular/core';
import { SFSchema } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-basic-list-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  imports: SHARED_IMPORTS
})
export class ProBasicListEditComponent {
  private readonly modal = inject(NzModalRef);
  private readonly msgSrv = inject(NzMessageService);

  record: any = {};
  schema: SFSchema = {
    properties: {
      title: { type: 'string', title: '任務名稱', maxLength: 50 },
      createdAt: { type: 'string', title: '開始時間', format: 'date' },
      owner: {
        type: 'string',
        title: '任務負責人',
        enum: [
          { value: 'asdf', label: 'asdf' },
          { value: '卡色', label: '卡色' },
          { value: 'cipchk', label: 'cipchk' }
        ]
      },
      subDescription: {
        type: 'string',
        title: '產品描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 6 }
        }
      }
    },
    required: ['title', 'createdAt', 'owner'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 }
    }
  };

  save(value: any): void {
    this.msgSrv.success('保存成功');
    this.modal.close(value);
  }

  close(): void {
    this.modal.destroy();
  }
}
