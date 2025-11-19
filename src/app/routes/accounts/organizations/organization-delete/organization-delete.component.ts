import { Component, inject, signal } from '@angular/core';
import { AccountService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface OrganizationDeleteData {
  organizationId: string;
  organizationName: string;
}

/**
 * 刪除組織確認元件
 * 職責：確認刪除組織操作
 */
@Component({
  selector: 'app-organization-delete',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div style="padding: 16px;">
      <nz-alert
        nzType="warning"
        nzMessage="警告"
        [nzDescription]="'確定要刪除組織「' + data.organizationName + '」嗎？此操作不可恢復，所有相關的資料將被永久刪除。'"
        nzShowIcon
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-alert
        nzType="info"
        nzMessage="提示"
        nzDescription="刪除組織後，以下資料將會受到影響：組織成員關係、組織權限設定、組織相關的專案資料。"
        nzShowIcon
        style="margin-bottom: 16px;"
      ></nz-alert>

      <div style="text-align: right; margin-top: 24px;">
        <button nz-button nzType="default" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;"> 取消 </button>
        <button nz-button nzType="primary" nzDanger (click)="confirm()" [nzLoading]="submitting()" [disabled]="submitting()">
          確認刪除
        </button>
      </div>
    </div>
  `
})
export class OrganizationDeleteComponent {
  private accountService = inject(AccountService);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);

  readonly data: OrganizationDeleteData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);

  async confirm(): Promise<void> {
    this.submitting.set(true);
    try {
      await this.accountService.deleteAccount(this.data.organizationId);
      this.message.success('刪除成功');
      this.modalRef.close(true);
    } catch (error) {
      let errorMessage = '刪除失敗';
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      console.error('刪除組織失敗:', error);
      this.message.error(errorMessage, { nzDuration: 5000 });
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
