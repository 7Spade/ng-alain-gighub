import { Component, inject, OnInit, signal } from '@angular/core';
import { TeamMemberRepository } from '@core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';

export interface OrgTeamMemberDeleteData {
  memberId: string;
  accountName: string;
}

/**
 * 组织团队成员删除确认组件
 *
 * 职责：确认删除团队成员操作
 *
 * 特点：
 * - 仅支持 Modal 模式
 */
@Component({
  selector: 'app-org-team-member-delete',
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
export class OrgTeamMemberDeleteComponent implements OnInit {
  private teamMemberRepository = inject(TeamMemberRepository);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);

  readonly data: OrgTeamMemberDeleteData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);

  ngOnInit(): void {
    // 组件初始化
  }

  async confirm(): Promise<void> {
    this.submitting.set(true);
    try {
      await firstValueFrom(this.teamMemberRepository.delete(this.data.memberId));
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
