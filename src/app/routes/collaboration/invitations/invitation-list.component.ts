import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { InvitationService, CollaborationInvitation } from '@shared';
import { InvitationStatus } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-invitation-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'协作邀请管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createInvitation()">
          <span nz-icon nzType="plus"></span>
          发送邀请
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="管理系统中的所有协作邀请" style="margin-top: 16px;">
      <st
        #st
        [data]="invitationService.invitations()"
        [columns]="columns"
        [loading]="invitationService.loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #status let-record>
          @switch (record.status) {
            @case ('pending') {
              <nz-tag nzColor="orange">待处理</nz-tag>
            }
            @case ('accepted') {
              <nz-tag nzColor="success">已接受</nz-tag>
            }
            @case ('rejected') {
              <nz-tag nzColor="error">已拒绝</nz-tag>
            }
            @case ('expired') {
              <nz-tag nzColor="default">已过期</nz-tag>
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
export class InvitationListComponent implements OnInit {
  invitationService = inject(InvitationService);
  router = inject(Router);
  message = inject(NzMessageService);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '蓝图ID', index: 'blueprint_id', width: 150 },
    { title: '发送组织', index: 'from_org_id', width: 150 },
    { title: '接收组织', index: 'to_org_id', width: 150 },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '邀请消息', index: 'message', width: 200 },
    { title: '过期时间', index: 'expires_at', type: 'date', width: 180 },
    { title: '响应时间', index: 'responded_at', type: 'date', width: 180 },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 250,
      buttons: [
        {
          text: '查看',
          click: (record: CollaborationInvitation) => this.viewDetail(record.id)
        },
        {
          text: '接受',
          type: 'link',
          click: (record: CollaborationInvitation) => this.accept(record.id),
          iif: (record: CollaborationInvitation) => record.status === InvitationStatus.PENDING
        },
        {
          text: '拒绝',
          type: 'link',
          click: (record: CollaborationInvitation) => this.reject(record.id),
          iif: (record: CollaborationInvitation) => record.status === InvitationStatus.PENDING
        },
        {
          text: '删除',
          type: 'del',
          pop: {
            title: '确定要删除这个邀请吗？',
            okType: 'danger'
          },
          click: (record: CollaborationInvitation) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      await this.invitationService.loadInvitations();
    } catch (error) {
      this.message.error('加载邀请列表失败');
    }
  }

  onTableChange(): void {
    // 表格变化处理
  }

  createInvitation(): void {
    this.router.navigate(['/collaboration/invitations/create']);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/collaboration/invitations', id]);
  }

  async accept(id: string): Promise<void> {
    try {
      await this.invitationService.acceptInvitation(id);
      this.message.success('接受邀请成功');
      await this.loadData();
    } catch (error) {
      this.message.error('接受邀请失败');
    }
  }

  async reject(id: string): Promise<void> {
    try {
      await this.invitationService.rejectInvitation(id);
      this.message.success('拒绝邀请成功');
      await this.loadData();
    } catch (error) {
      this.message.error('拒绝邀请失败');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.invitationService.deleteInvitation(id);
      this.message.success('删除成功');
      await this.loadData();
    } catch (error) {
      this.message.error('删除失败');
    }
  }
}

