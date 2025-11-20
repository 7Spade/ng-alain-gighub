import { Component, inject, OnInit, signal } from '@angular/core';
import { SHARED_IMPORTS, TeamService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface OrgTeamDeleteData {
  teamId: string;
  teamName: string;
}

/**
 * 组织团队删除确认组件
 *
 * 职责：确认删除团队操作
 *
 * 特点：
 * - 仅支持 Modal 模式
 */
@Component({
  selector: 'app-org-team-delete',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div style="padding: 16px;">
      <nz-alert
        nzType="warning"
        nzMessage="警告"
        [nzDescription]="'確定要刪除團隊「' + data.teamName + '」嗎？此操作不可恢復，將同時刪除所有團隊成員關係。'"
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
export class OrgTeamDeleteComponent implements OnInit {
  private teamService = inject(TeamService);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);

  readonly data: OrgTeamDeleteData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);

  ngOnInit(): void {
    // 组件初始化
  }

  async confirm(): Promise<void> {
    this.submitting.set(true);
    try {
      await this.teamService.deleteTeam(this.data.teamId);
      this.message.success('刪除成功');
      this.modalRef.close(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '刪除失敗';
      this.message.error(errorMessage);
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
