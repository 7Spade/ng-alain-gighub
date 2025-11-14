import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { CollaborationService, OrganizationCollaboration } from '@shared';
import { CollaborationType, CollaborationStatus } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-collaboration-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'协作关系管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createCollaboration()">
          <span nz-icon nzType="plus"></span>
          新建协作关系
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="管理系统中的所有协作关系" style="margin-top: 16px;">
      <st
        #st
        [data]="collaborationService.collaborations()"
        [columns]="columns"
        [loading]="collaborationService.loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #type let-record>
          @switch (record.collaboration_type) {
            @case ('contractor') {
              <nz-tag nzColor="blue">承揽商</nz-tag>
            }
            @case ('subcontractor') {
              <nz-tag nzColor="cyan">次承揽商</nz-tag>
            }
            @case ('consultant') {
              <nz-tag nzColor="purple">顾问</nz-tag>
            }
            @case ('partner') {
              <nz-tag nzColor="green">合作伙伴</nz-tag>
            }
            @default {
              <nz-tag>未知</nz-tag>
            }
          }
        </ng-template>

        <ng-template #status let-record>
          @switch (record.status) {
            @case ('pending') {
              <nz-tag nzColor="orange">待处理</nz-tag>
            }
            @case ('active') {
              <nz-tag nzColor="success">活跃</nz-tag>
            }
            @case ('suspended') {
              <nz-tag nzColor="warning">已暂停</nz-tag>
            }
            @case ('ended') {
              <nz-tag nzColor="default">已结束</nz-tag>
            }
            @default {
              <nz-tag>未知</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class CollaborationListComponent implements OnInit {
  collaborationService = inject(CollaborationService);
  router = inject(Router);
  message = inject(NzMessageService);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '蓝图ID', index: 'blueprint_id', width: 150 },
    { title: '拥有者组织', index: 'owner_org_id', width: 150 },
    { title: '协作组织', index: 'collaborator_org_id', width: 150 },
    { title: '协作类型', index: 'collaboration_type', width: 120, render: 'type' },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '合同开始日期', index: 'contract_start_date', type: 'date', width: 120 },
    { title: '合同结束日期', index: 'contract_end_date', type: 'date', width: 120 },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: OrganizationCollaboration) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: OrganizationCollaboration) => this.edit(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: {
            title: '确定要删除这个协作关系吗？',
            okType: 'danger'
          },
          click: (record: OrganizationCollaboration) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      await this.collaborationService.loadCollaborations();
    } catch (error) {
      this.message.error('加载协作关系列表失败');
    }
  }

  onTableChange(): void {
    // 表格变化处理
  }

  createCollaboration(): void {
    this.router.navigate(['/collaboration/create']);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/collaboration', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/collaboration', id, 'edit']);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collaborationService.deleteCollaboration(id);
      this.message.success('删除成功');
      await this.loadData();
    } catch (error) {
      this.message.error('删除失败');
    }
  }
}

