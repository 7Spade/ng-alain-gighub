import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from '@core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, TeamService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { OrgTeamCreateComponent } from './team-create/team-create.component';
import { OrgTeamDeleteComponent, OrgTeamDeleteData } from './team-delete/team-delete.component';
import { OrgTeamEditComponent, OrgTeamEditData } from './team-edit/team-edit.component';

/**
 * 组织团队列表组件
 *
 * 职责：在组织上下文下显示和管理团队列表
 *
 * 遵循 SRP 原则：
 * - Component 只处理 UI 展示和用户交互
 * - 业务逻辑由 TeamService 处理
 * - 数据访问由 Repository 层处理
 *
 * 遵循职责边界：
 * - routes/org：组织上下文视角，提供完整的团队管理功能
 */
@Component({
  selector: 'app-org-teams',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'團隊管理'" />
    <nz-card [nzBordered]="false">
      <div class="flex justify-between mb-md">
        <div>
          <h2>團隊</h2>
          <p class="text-muted">管理組織內的團隊</p>
        </div>
        <button nz-button nzType="primary" (click)="createTeam()">
          <span nz-icon nzType="plus"></span>
          建立團隊
        </button>
      </div>

      @if (teamService.loading()) {
        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
      } @else if (teamService.error()) {
        <nz-alert nzType="error" [nzMessage]="'載入失敗'" [nzDescription]="teamService.error()" nzShowIcon style="margin: 16px;"></nz-alert>
      } @else if (teamService.teams().length === 0) {
        <nz-empty nzNotFoundContent="尚無團隊">
          <button nz-button nzType="primary" (click)="createTeam()">建立第一個團隊</button>
        </nz-empty>
      } @else {
        <st
          #st
          [columns]="columns"
          [data]="teamService.teams()"
          [loading]="teamService.loading()"
          [page]="{ front: false, show: true, showSize: true }"
          (change)="stChange($event)"
        >
          <ng-template st-row="description" let-record>
            {{ record.description || '-' }}
          </ng-template>
          <ng-template st-row="action" let-record>
            <button nz-button nzType="link" nzSize="small" (click)="manageMembers(record.id)">成員管理</button>
            <button nz-button nzType="link" nzSize="small" (click)="editTeam(record)">編輯</button>
            <button nz-button nzType="link" nzDanger nzSize="small" (click)="deleteTeam(record)">刪除</button>
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
      .text-muted {
        color: rgba(0, 0, 0, 0.45);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgTeamsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  readonly teamService = inject(TeamService);

  readonly organizationId = signal<string | null>(null);

  columns: STColumn[] = [
    { title: '團隊名稱', index: 'name', width: 200 },
    { title: '描述', index: 'description', width: 300, render: 'description' },
    { title: '創建時間', index: 'created_at', type: 'date', width: 180 },
    { title: '操作', render: 'action', width: 300 }
  ];

  async ngOnInit(): Promise<void> {
    // 从路由参数获取组织 ID
    const orgId = this.route.snapshot.paramMap.get('id');
    if (!orgId) {
      this.message.error('缺少組織 ID');
      this.router.navigate(['/accounts/org']);
      return;
    }

    this.organizationId.set(orgId);

    // 先清空状态，确保加载的是当前组织的团队
    this.teamService.reset();
    await this.loadTeams();
  }

  /**
   * 加载团队列表
   */
  async loadTeams(): Promise<void> {
    const orgId = this.organizationId();
    if (!orgId) {
      return;
    }

    try {
      await this.teamService.loadTeamsByOrganizationId(orgId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入團隊列表失敗';
      this.message.error(errorMessage);
    }
  }

  /**
   * 创建团队
   */
  createTeam(): void {
    const orgId = this.organizationId();
    if (!orgId) {
      this.message.warning('缺少組織 ID');
      return;
    }

    // 使用 OrgTeamCreateComponent，传入 organizationId
    const modalRef = this.modal.create({
      nzTitle: '建立團隊',
      nzContent: OrgTeamCreateComponent,
      nzData: { organizationId: orgId },
      nzWidth: 800,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.loadTeams();
      }
    });
  }

  /**
   * 编辑团队
   */
  editTeam(team: Team): void {
    // 使用 OrgTeamEditComponent
    const modalRef = this.modal.create({
      nzTitle: '編輯團隊',
      nzContent: OrgTeamEditComponent,
      nzData: { team } as OrgTeamEditData,
      nzWidth: 800,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.loadTeams();
      }
    });
  }

  /**
   * 删除团队
   */
  deleteTeam(team: Team): void {
    // 使用 OrgTeamDeleteComponent
    const modalRef = this.modal.create({
      nzTitle: '刪除團隊',
      nzContent: OrgTeamDeleteComponent,
      nzData: {
        teamId: team.id,
        teamName: team.name
      } as OrgTeamDeleteData,
      nzWidth: 500,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.loadTeams();
      }
    });
  }

  /**
   * 管理团队成员
   */
  manageMembers(teamId: string): void {
    // 跳转到团队成员管理
    this.router.navigate(['/accounts/org/teams', teamId, 'members']);
  }

  /**
   * 处理表格变化事件
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stChange(_e: unknown): void {
    // 处理表格变化事件（分页、排序等）
  }
}
