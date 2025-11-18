import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface PermissionAssignmentItem {
  readonly id: string;
  readonly userId: string;
  readonly userName: string;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly permission: string;
  readonly status: 'pending' | 'approved' | 'rejected';
  readonly requestedAt: string;
  readonly approvedAt: string | null;
  readonly approvedBy: string | null;
}

@Component({
  selector: 'app-permission-assignment',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'权限分配'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="requestPermission()">
          <span nz-icon nzType="plus"></span>
          申请权限
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="权限分配" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>状态</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterStatus()"
              (ngModelChange)="filterStatus.set($event)"
              nzPlaceHolder="全部状态"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="pending" nzLabel="待审批"></nz-option>
              <nz-option nzValue="approved" nzLabel="已批准"></nz-option>
              <nz-option nzValue="rejected" nzLabel="已拒绝"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>资源类型</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterResourceType()"
              (ngModelChange)="filterResourceType.set($event)"
              nzPlaceHolder="全部资源"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="blueprint" nzLabel="蓝图"></nz-option>
              <nz-option nzValue="task" nzLabel="任务"></nz-option>
              <nz-option nzValue="issue" nzLabel="问题"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 权限分配列表表格 -->
      <st
        #st
        [data]="filteredAssignments()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #status let-record>
          @switch (record.status) {
            @case ('pending') {
              <nz-tag nzColor="orange">待审批</nz-tag>
            }
            @case ('approved') {
              <nz-tag nzColor="success">已批准</nz-tag>
            }
            @case ('rejected') {
              <nz-tag nzColor="error">已拒绝</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class PermissionAssignmentComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterStatus = signal<string | null>(null);
  filterResourceType = signal<string | null>(null);
  assignments = signal<PermissionAssignmentItem[]>([]);

  // Computed filtered assignments
  filteredAssignments = computed(() => {
    let result = this.assignments();

    if (this.filterStatus()) {
      result = result.filter(item => item.status === this.filterStatus());
    }

    if (this.filterResourceType()) {
      result = result.filter(item => item.resourceType === this.filterResourceType());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '用户', index: 'userName', width: 150 },
    { title: '资源类型', index: 'resourceType', width: 120 },
    { title: '资源ID', index: 'resourceId', width: 150 },
    { title: '权限', index: 'permission', width: 150 },
    { title: '状态', index: 'status', width: 120, render: 'status' },
    { title: '申请时间', index: 'requestedAt', type: 'date', width: 180 },
    { title: '批准时间', index: 'approvedAt', type: 'date', width: 180 },
    { title: '批准人', index: 'approvedBy', width: 150 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '审批',
          iif: (record: PermissionAssignmentItem) => record.status === 'pending',
          click: (record: PermissionAssignmentItem) => this.approve(record.id)
        },
        {
          text: '查看',
          click: (record: PermissionAssignmentItem) => this.viewDetail(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    // TODO: 加载权限分配列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.assignments.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  requestPermission(): void {
    // TODO: 申请权限
    this.message.info('申请权限功能开发中');
  }

  approve(id: string): void {
    // TODO: 审批权限
    this.message.info('审批权限功能开发中');
  }

  viewDetail(id: string): void {
    // TODO: 查看详情
    this.message.info('查看详情功能开发中');
  }
}
