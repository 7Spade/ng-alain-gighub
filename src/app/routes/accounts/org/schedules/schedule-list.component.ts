import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { AccountService, OrganizationSchedule, OrganizationScheduleService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 组织排班管理组件
 *
 * 职责：在组织上下文中管理排班
 * - 显示组织的排班列表
 * - 创建、编辑、删除排班
 *
 * 遵循 SRP 原则：
 * - Component 只处理 UI 展示和用户交互
 * - 业务逻辑由 OrganizationScheduleService 处理
 * - 数据访问由 Repository 层处理
 */
@Component({
  selector: 'app-org-schedule-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'排班管理'" />
    <div style="padding: 16px;">
      @if (loading()) {
        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
      } @else if (error()) {
        <nz-alert nzType="error" [nzMessage]="'載入失敗'" [nzDescription]="error()" nzShowIcon style="margin: 16px;"></nz-alert>
      } @else if (organizationName()) {
        <nz-card [nzBordered]="false">
          <div class="flex justify-between mb-md">
            <div>
              <h2>{{ organizationName() }}</h2>
              <p class="text-muted">組織排班管理</p>
            </div>
            <button nz-button nzType="primary" (click)="createSchedule()">
              <span nz-icon nzType="plus"></span>
              新建排班
            </button>
          </div>

          @if (scheduleService.schedules().length === 0) {
            <nz-empty nzNotFoundContent="尚無排班記錄">
              <button nz-button nzType="primary" (click)="createSchedule()">建立第一個排班</button>
            </nz-empty>
          } @else {
            <st
              #st
              [data]="scheduleService.schedules()"
              [columns]="columns"
              [loading]="scheduleService.loading()"
              [page]="{ front: false, show: true, showSize: true }"
              (change)="onTableChange($event)"
            >
              <ng-template st-row="date" let-record>
                {{ record.scheduleDate | date: 'yyyy-MM-dd' }}
              </ng-template>
            </st>
          }
        </nz-card>
      }
    </div>
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
export class OrgScheduleListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  readonly scheduleService = inject(OrganizationScheduleService);
  private readonly accountService = inject(AccountService);

  readonly organizationId = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly organizationName = computed(() => {
    const orgId = this.organizationId();
    if (!orgId) return '';
    const org = this.accountService.organizationAccounts().find(o => o.id === orgId);
    return org?.name || '';
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '日期', index: 'scheduleDate', width: 120, render: 'date' },
    { title: '組織ID', index: 'organization_id', width: 200 },
    { title: '藍圖ID', index: 'blueprint_id', width: 200 },
    { title: '分支ID', index: 'branch_id', width: 200 },
    { title: '帳戶ID', index: 'account_id', width: 200 },
    { title: '團隊ID', index: 'team_id', width: 200 },
    { title: '備註', index: 'notes', width: 200 },
    { title: '創建時間', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '編輯',
          click: (record: OrganizationSchedule) => this.edit(record.id)
        },
        {
          text: '刪除',
          type: 'del',
          pop: true,
          click: (record: OrganizationSchedule) => this.delete(record.id)
        }
      ]
    }
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

    // 加载组织列表（如果为空）
    if (this.accountService.organizationAccounts().length === 0) {
      await this.accountService.loadAccounts().catch(error => {
        console.error('載入組織列表失敗:', error);
      });
    }

    await this.loadSchedules(orgId);
  }

  async loadSchedules(organizationId: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      await this.scheduleService.loadSchedulesByOrganizationId(organizationId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入排班列表失敗';
      this.error.set(errorMessage);
      this.message.error(errorMessage);
    } finally {
      this.loading.set(false);
    }
  }

  onTableChange(_event: unknown): void {
    // 处理表格变化事件（分页、排序等）
  }

  createSchedule(): void {
    const orgId = this.organizationId();
    if (orgId) {
      // 导航到组织详情页面，在详情页面中创建排班
      this.router.navigate(['/accounts', orgId], { queryParams: { tab: 'schedules' } });
    } else {
      this.message.warning('缺少組織 ID');
    }
  }

  edit(id: string): void {
    const orgId = this.organizationId();
    if (orgId) {
      // 导航到组织详情页面，在详情页面中编辑排班
      this.router.navigate(['/accounts', orgId], { queryParams: { tab: 'schedules', scheduleId: id } });
    } else {
      this.message.warning('缺少組織 ID');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.scheduleService.deleteSchedule(id);
      this.message.success('刪除成功');
      const orgId = this.organizationId();
      if (orgId) {
        await this.loadSchedules(orgId);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '刪除失敗';
      this.message.error(errorMessage);
    }
  }
}
