import { Component, inject, OnInit, signal } from '@angular/core';
import { SHARED_IMPORTS, TeamService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface TeamDeleteData {
  teamId: string;
  teamName: string;
}

/**
 * 删除团队确认组件
 * 职责：确认删除团队操作
 */
@Component({
  selector: 'app-team-delete',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div style="padding: 16px;">
      <nz-alert
        nzType="warning"
        nzMessage="警告"
        [nzDescription]="'确定要删除团队「' + data.teamName + '」吗？此操作不可恢复，将同时删除所有团队成员关系。'"
        nzShowIcon
        style="margin-bottom: 16px;"
      ></nz-alert>

      <div style="text-align: right; margin-top: 24px;">
        <button nz-button nzType="default" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;"> 取消 </button>
        <button nz-button nzType="primary" nzDanger (click)="confirm()" [nzLoading]="submitting()" [disabled]="submitting()">
          确认删除
        </button>
      </div>
    </div>
  `
})
export class TeamDeleteComponent implements OnInit {
  private teamService = inject(TeamService);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);

  readonly data: TeamDeleteData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);

  ngOnInit(): void {
    // 组件初始化
  }

  async confirm(): Promise<void> {
    this.submitting.set(true);
    try {
      await this.teamService.deleteTeam(this.data.teamId);
      this.message.success('删除成功');
      this.modalRef.close(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除失败';
      this.message.error(errorMessage);
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
