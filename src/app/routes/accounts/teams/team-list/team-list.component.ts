import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { AccountService, SHARED_IMPORTS, Team, TeamService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { TeamCreateComponent } from '../team-create/team-create.component';
import { TeamDeleteComponent, TeamDeleteData } from '../team-delete/team-delete.component';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'团队管理'"></page-header>

    <div style="padding: 16px;">
      <!-- 组织选择器和新建团队按钮 -->
      <nz-card nzTitle="选择组织" style="margin-bottom: 16px;">
        <nz-form-item>
          <nz-form-label>组织</nz-form-label>
          <nz-form-control>
            <div style="display: flex; gap: 8px; align-items: center;">
              <nz-select
                [ngModel]="selectedOrganizationId()"
                (ngModelChange)="onOrganizationChange($event)"
                nzPlaceHolder="请选择组织"
                [nzLoading]="accountService.loading()"
                style="width: 300px;"
              >
                @for (org of accountService.organizationAccounts(); track org.id) {
                  <nz-option [nzValue]="org.id" [nzLabel]="org.name"></nz-option>
                }
              </nz-select>
              <button nz-button nzType="primary" (click)="createTeam()">
                <span nz-icon nzType="plus"></span>
                新建团队
              </button>
            </div>
          </nz-form-control>
        </nz-form-item>
        @if (!selectedOrganizationId()) {
          <nz-alert
            nzType="info"
            nzMessage="请先选择组织"
            nzDescription="团队是组织专有功能，请先选择一个组织以查看该组织的团队。"
            nzShowIcon
            style="margin-top: 16px;"
          ></nz-alert>
        }
      </nz-card>

      <!-- 团队列表 -->
      @if (selectedOrganizationId()) {
        <nz-card [nzTitle]="'组织团队列表：' + selectedOrganizationName()">
          <st
            #st
            [data]="teamService.teams()"
            [columns]="columns"
            [loading]="teamService.loading()"
            [page]="{ front: false, show: true, showSize: true }"
          >
            <ng-template #description let-record>
              {{ record.description || '-' }}
            </ng-template>
          </st>
        </nz-card>
      }
    </div>
  `
})
export class TeamListComponent implements OnInit {
  teamService = inject(TeamService);
  accountService = inject(AccountService);
  router = inject(Router);
  message = inject(NzMessageService);
  modal = inject(NzModalService);

  selectedOrganizationId = signal<string | null>(null);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '团队名称', index: 'name', width: 200 },
    { title: '描述', index: 'description', width: 300, render: 'description' },
    { title: '组织ID', index: 'organization_id', width: 200 },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: Team) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: Team) => this.edit(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: false,
          click: (record: Team) => this.delete(record)
        }
      ]
    }
  ];

  selectedOrganizationName = computed(() => {
    const orgId = this.selectedOrganizationId();
    if (!orgId) return '';
    const org = this.accountService.organizationAccounts().find(o => o.id === orgId);
    return org?.name || '';
  });

  ngOnInit(): void {
    // 先加载组织列表
    this.loadOrganizations();
  }

  async loadOrganizations(): Promise<void> {
    try {
      await this.accountService.loadAccounts();
      // 如果只有一个组织，自动选择
      const orgs = this.accountService.organizationAccounts();
      if (orgs.length === 1) {
        this.selectedOrganizationId.set(orgs[0].id);
        await this.loadTeams(orgs[0].id);
      }
    } catch (error) {
      console.error('加载组织列表失败:', error);
      this.message.error('加载组织列表失败');
    }
  }

  async onOrganizationChange(organizationId: string | null): Promise<void> {
    this.selectedOrganizationId.set(organizationId);
    if (organizationId) {
      await this.loadTeams(organizationId);
    }
    // 如果没有选择组织，列表会通过 RLS 策略自动过滤为空
  }

  async loadTeams(organizationId: string): Promise<void> {
    try {
      await this.teamService.loadTeamsByOrganizationId(organizationId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载团队列表失败';
      this.message.error(errorMessage);
    }
  }

  createTeam(): void {
    const orgId = this.selectedOrganizationId();

    const modalRef = this.modal.create({
      nzTitle: '创建团队',
      nzContent: TeamCreateComponent,
      nzData: {
        organizationId: orgId || null
      },
      nzWidth: 800,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        // 如果创建成功，刷新团队列表
        if (orgId) {
          this.loadTeams(orgId);
        }
      }
    });
  }

  viewDetail(id: string): void {
    this.router.navigate(['/accounts/teams', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/accounts/teams', id, 'edit']);
  }

  delete(team: Team): void {
    const modalRef = this.modal.create({
      nzTitle: '删除团队',
      nzContent: TeamDeleteComponent,
      nzData: {
        teamId: team.id,
        teamName: team.name
      } as TeamDeleteData,
      nzWidth: 500,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        const orgId = this.selectedOrganizationId();
        if (orgId) {
          this.loadTeams(orgId);
        }
      }
    });
  }
}
