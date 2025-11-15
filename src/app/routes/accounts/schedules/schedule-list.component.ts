import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, OrganizationScheduleService, OrganizationSchedule } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'排班管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createSchedule()">
          <span nz-icon nzType="plus"></span>
          新建排班
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="管理系统中的所有排班" style="margin-top: 16px;">
      <st
        #st
        [data]="scheduleService.schedules()"
        [columns]="columns"
        [loading]="scheduleService.loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange($event)"
      >
        <ng-template #date let-record>
          {{ record.scheduleDate | date: 'yyyy-MM-dd' }}
        </ng-template>
      </st>
    </nz-card>
  `
})
export class ScheduleListComponent implements OnInit {
  scheduleService = inject(OrganizationScheduleService);
  router = inject(Router);
  message = inject(NzMessageService);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '日期', index: 'schedule_date', width: 120, render: 'date' },
    { title: '组织ID', index: 'organization_id', width: 200 },
    { title: '蓝图ID', index: 'blueprint_id', width: 200 },
    { title: '分支ID', index: 'branch_id', width: 200 },
    { title: '账户ID', index: 'account_id', width: 200 },
    { title: '团队ID', index: 'team_id', width: 200 },
    { title: '备注', index: 'notes', width: 200 },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '编辑',
          click: (record: OrganizationSchedule) => this.edit(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: OrganizationSchedule) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadSchedules();
  }

  async loadSchedules(): Promise<void> {
    try {
      await this.scheduleService.loadSchedules();
    } catch (error) {
      this.message.error('加载排班列表失败');
    }
  }

  onTableChange(event: any): void {
    // 处理表格变化事件（分页、排序等）
  }

  createSchedule(): void {
    // TODO: 实现创建排班功能（可以使用 Modal 或跳转到创建页面）
    this.message.info('创建排班功能待实现');
  }

  edit(id: string): void {
    // TODO: 实现编辑排班功能
    this.message.info('编辑排班功能待实现');
  }

  async delete(id: string): Promise<void> {
    try {
      await this.scheduleService.deleteSchedule(id);
      this.message.success('删除成功');
      await this.loadSchedules();
    } catch (error) {
      this.message.error('删除失败');
    }
  }
}
