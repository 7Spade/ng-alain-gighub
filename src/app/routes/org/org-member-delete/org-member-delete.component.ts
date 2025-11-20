import { Component, inject, OnInit, signal } from '@angular/core';
import { OrganizationMemberService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface OrgMemberDeleteData {
  memberId: string;
  accountName: string;
}

/**
 * 组织成员删除确认组件
 *
 * 职责：确认删除组织成员操作
 *
 * 特点：
 * - 仅支持 Modal 模式
 */
@Component({
  selector: 'app-org-member-delete',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div style="padding: 16px;">
      <nz-alert
        nzType="warning"
        nzMessage="警告"
        [nzDescription]="'確定要移除成員「' + data.accountName + '」嗎？此操作不可恢復。'"
        nzShowIcon
        style="margin-bottom: 16px;"
      ></nz-alert>

      <div style="text-align: right; margin-top: 24px;">
        <button nz-button nzType="default" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;"> 取消 </button>
        <button nz-button nzType="primary" nzDanger (click)="confirm()" [nzLoading]="submitting()" [disabled]="submitting()">
          確認移除
        </button>
      </div>
    </div>
  `
})
export class OrgMemberDeleteComponent implements OnInit {
  private organizationMemberService = inject(OrganizationMemberService);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);

  readonly data: OrgMemberDeleteData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);

  ngOnInit(): void {
    // 组件初始化
  }

  async confirm(): Promise<void> {
    this.submitting.set(true);
    try {
      await this.organizationMemberService.removeMember(this.data.memberId);
      this.message.success('移除成功');
      this.modalRef.close(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '移除失敗';
      this.message.error(errorMessage);
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
