import { Component, OnInit, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { TeamService, Team } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'团队管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createTeam()">
          <span nz-icon nzType="plus"></span>
          新建团队
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="管理系统中的所有团队" style="margin-top: 16px;">
      <st
        #st
        [data]="teamService.teams()"
        [columns]="columns"
        [loading]="teamService.loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange($event)"
      >
        <ng-template #description let-record>
          {{ record.description || '-' }}
        </ng-template>
      </st>
    </nz-card>
  `
})
export class TeamListComponent implements OnInit {
  teamService = inject(TeamService);
  router = inject(Router);
  message = inject(NzMessageService);

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
          pop: true,
          click: (record: Team) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadTeams();
  }

  async loadTeams(): Promise<void> {
    try {
      await this.teamService.loadTeams();
    } catch (error) {
      this.message.error('加载团队列表失败');
    }
  }

  onTableChange(event: any): void {
    // 处理表格变化事件（分页、排序等）
  }

  createTeam(): void {
    this.router.navigate(['/accounts/teams/create']);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/accounts/teams', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/accounts/teams', id, 'edit']);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.teamService.deleteTeam(id);
      this.message.success('删除成功');
      await this.loadTeams();
    } catch (error) {
      this.message.error('删除失败');
    }
  }
}

