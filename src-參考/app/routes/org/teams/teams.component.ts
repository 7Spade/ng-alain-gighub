import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal, inject } from '@angular/core';
import { TeamService, OrganizationContextService } from '@core';
import { STChange, STColumn } from '@delon/abc/st';
import type { Team } from '@shared';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { CreateTeamModalComponent } from '../components/create-team-modal/create-team-modal.component';

@Component({
  selector: 'app-org-teams',
  standalone: true,
  template: `
    <page-header [title]="'團隊管理'" />
    <nz-card [nzBordered]="false">
      <div class="flex justify-between mb-md">
        <div>
          <h2>團隊</h2>
          <p class="text-muted">管理組織內的團隊</p>
        </div>
        <button nz-button nzType="primary" (click)="openCreateTeamModal()">
          <i nz-icon nzType="plus"></i>
          建立團隊
        </button>
      </div>

      @if (loading()) {
        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
      } @else if (teams().length === 0) {
        <nz-empty nzNotFoundContent="尚無團隊">
          <button *nzButton="null" nz-button nzType="primary" (click)="openCreateTeamModal()"> 建立第一個團隊 </button>
        </nz-empty>
      } @else {
        <st #st [columns]="columns" [data]="teams()" [loading]="loading()" (change)="stChange($event)">
          <ng-template st-row="privacy" let-i>
            <nz-tag [nzColor]="i.privacy === 'secret' ? 'orange' : 'blue'">
              {{ i.privacy === 'secret' ? '隱藏' : '可見' }}
            </nz-tag>
          </ng-template>
          <ng-template st-row="action" let-i>
            <button nz-button nzSize="small" nzType="link">查看</button>
            <button nz-button nzSize="small" nzType="link" nzDanger (click)="deleteTeam(i)"> 刪除 </button>
          </ng-template>
        </st>
      }
    </nz-card>
  `,
  styles: [
    `
      .flex {
        display: flex;
      }
      .justify-between {
        justify-content: space-between;
      }
      .mb-md {
        margin-bottom: 16px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class OrgTeamsComponent implements OnInit {
  private readonly teamService = inject(TeamService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly modal = inject(NzModalService);
  private readonly msg = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly teams = signal<Team[]>([]);
  readonly loading = signal(false);

  columns: STColumn[] = [
    { title: '團隊名稱', index: 'name' },
    { title: '團隊代號', index: 'slug' },
    { title: '描述', index: 'description' },
    { title: '隱私設定', render: 'privacy' },
    { title: '創建時間', index: 'created_at', type: 'date' },
    { title: '操作', render: 'action' }
  ];

  ngOnInit(): void {
    this.loadTeams();
  }

  async loadTeams(): Promise<void> {
    const org = this.orgContext.currentOrganization();
    if (!org) {
      this.msg.warning('請先選擇組織');
      return;
    }

    this.loading.set(true);
    this.cdr.detectChanges();

    const { data, error } = await this.teamService.getOrganizationTeams(org.id);

    if (error) {
      this.msg.error(error.message || '獲取團隊列表失敗');
      this.loading.set(false);
      this.cdr.detectChanges();
      return;
    }

    this.teams.set(data || []);
    this.loading.set(false);
    this.cdr.detectChanges();
  }

  openCreateTeamModal(): void {
    const modalRef = this.modal.create({
      nzTitle: '',
      nzContent: CreateTeamModalComponent,
      nzWidth: 600,
      nzFooter: null,
      nzClosable: true
    });
    modalRef.afterClose.subscribe(() => {
      this.loadTeams();
    });
  }

  async deleteTeam(team: Team): Promise<void> {
    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除團隊「${team.name}」嗎？此操作無法撤銷。`,
      nzOnOk: async () => {
        const { error } = await this.teamService.deleteTeam(team.id);
        if (error) {
          this.msg.error(error.message || '刪除團隊失敗');
          return;
        }
        this.msg.success('團隊已刪除');
        await this.loadTeams();
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stChange(_e: STChange): void {
    // 處理表格變化事件
  }
}
