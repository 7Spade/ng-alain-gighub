import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppError } from '@core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, OrganizationScheduleService, OrganizationSchedule, AccountService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'排班管理'">
      <ng-template #extra>
        @if (selectedOrganizationId()) {
          <button nz-button nzType="primary" (click)="createSchedule()">
            <span nz-icon nzType="plus"></span>
            新建排班
          </button>
        }
      </ng-template>
    </page-header>

    <div style="padding: 16px;">
      <!-- 组织选择器 -->
      <nz-card nzTitle="选择组织" style="margin-bottom: 16px;">
        <nz-form-item>
          <nz-form-label>组织</nz-form-label>
          <nz-form-control>
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
          </nz-form-control>
        </nz-form-item>
        @if (!selectedOrganizationId()) {
          <nz-alert
            nzType="info"
            nzMessage="请先选择组织"
            nzDescription="排班是组织专有功能，请先选择一个组织以查看该组织的排班。"
            nzShowIcon
            style="margin-top: 16px;"
          ></nz-alert>
        }
      </nz-card>

      <!-- 排班列表 -->
      @if (selectedOrganizationId()) {
        <nz-card [nzTitle]="'组织排班列表：' + selectedOrganizationName()">
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
      }
    </div>
  `
})
export class ScheduleListComponent implements OnInit {
  scheduleService = inject(OrganizationScheduleService);
  accountService = inject(AccountService);
  router = inject(Router);
  message = inject(NzMessageService);

  selectedOrganizationId = signal<string | null>(null);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '日期', index: 'scheduleDate', width: 120, render: 'date' },
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
        await this.loadSchedules(orgs[0].id);
      }
    } catch (error) {
      console.error('加载组织列表失败:', error);
      this.message.error('加载组织列表失败');
    }
  }

  async onOrganizationChange(organizationId: string | null): Promise<void> {
    this.selectedOrganizationId.set(organizationId);
    if (organizationId) {
      await this.loadSchedules(organizationId);
    }
    // 如果没有选择组织，列表会通过 RLS 策略自动过滤为空
  }

  async loadSchedules(organizationId: string): Promise<void> {
    try {
      await this.scheduleService.loadSchedulesByOrganizationId(organizationId);
    } catch (error) {
      // 显示详细的错误信息
      let errorMessage = '加载排班列表失败';

      if (error instanceof Error) {
        const appError = error as AppError;
        if (appError.type && appError.severity) {
          errorMessage = appError.message || errorMessage;
          if (appError.details) {
            errorMessage += `: ${appError.details}`;
          }
        } else {
          errorMessage = error.message || errorMessage;
        }
      }

      console.error('加载排班列表失败:', error);
      this.message.error(errorMessage, { nzDuration: 5000 });
    }
  }

  onTableChange(event: any): void {
    // 处理表格变化事件（分页、排序等）
  }

  createSchedule(): void {
    const orgId = this.selectedOrganizationId();
    if (orgId) {
      // 导航到组织详情页面，在详情页面中创建排班
      this.router.navigate(['/accounts', orgId], { queryParams: { tab: 'schedules' } });
    } else {
      this.message.warning('请先选择组织');
    }
  }

  edit(id: string): void {
    const orgId = this.selectedOrganizationId();
    if (orgId) {
      // 导航到组织详情页面，在详情页面中编辑排班
      this.router.navigate(['/accounts', orgId], { queryParams: { tab: 'schedules', scheduleId: id } });
    } else {
      this.message.warning('请先选择组织');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.scheduleService.deleteSchedule(id);
      this.message.success('删除成功');
      const orgId = this.selectedOrganizationId();
      if (orgId) {
        await this.loadSchedules(orgId);
      }
    } catch (error) {
      // 显示详细的错误信息
      let errorMessage = '删除失败';

      if (error instanceof Error) {
        const appError = error as AppError;
        if (appError.type && appError.severity) {
          errorMessage = appError.message || errorMessage;
          if (appError.details) {
            errorMessage += `: ${appError.details}`;
          }
        } else {
          errorMessage = error.message || errorMessage;
        }
      }

      console.error('删除失败:', error);
      this.message.error(errorMessage, { nzDuration: 5000 });
    }
  }
}
