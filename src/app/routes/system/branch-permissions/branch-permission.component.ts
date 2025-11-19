import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface BranchPermissionItem {
  readonly id: string;
  readonly branchId: string;
  readonly branchName: string;
  readonly userId: string;
  readonly userName: string;
  readonly permission: 'OWNER' | 'ADMIN' | 'WRITE' | 'READ';
  readonly grantedAt: string;
  readonly grantedBy: string;
}

@Component({
  selector: 'app-branch-permission',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'分支权限管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="grantPermission()">
          <span nz-icon nzType="plus"></span>
          授予权限
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="分支权限管理" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>权限级别</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterPermission()"
              (ngModelChange)="filterPermission.set($event)"
              nzPlaceHolder="全部权限"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="OWNER" nzLabel="所有者"></nz-option>
              <nz-option nzValue="ADMIN" nzLabel="管理员"></nz-option>
              <nz-option nzValue="WRITE" nzLabel="写入"></nz-option>
              <nz-option nzValue="READ" nzLabel="只读"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>分支</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterBranch()"
              (ngModelChange)="filterBranch.set($event)"
              nzPlaceHolder="全部分支"
              nzAllowClear
              style="width: 200px;"
            >
              @for (branch of branches(); track branch.id) {
                <nz-option [nzValue]="branch.id" [nzLabel]="branch.name"></nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 分支权限列表表格 -->
      <st
        #st
        [data]="filteredPermissions()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #permission let-record>
          @switch (record.permission) {
            @case ('OWNER') {
              <nz-tag nzColor="red">所有者</nz-tag>
            }
            @case ('ADMIN') {
              <nz-tag nzColor="orange">管理员</nz-tag>
            }
            @case ('WRITE') {
              <nz-tag nzColor="blue">写入</nz-tag>
            }
            @case ('READ') {
              <nz-tag nzColor="default">只读</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class BranchPermissionComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterPermission = signal<string | null>(null);
  filterBranch = signal<string | null>(null);
  permissions = signal<BranchPermissionItem[]>([]);
  branches = signal<Array<{ id: string; name: string }>>([]);

  // Computed filtered permissions
  filteredPermissions = computed(() => {
    let result = this.permissions();

    if (this.filterPermission()) {
      result = result.filter(item => item.permission === this.filterPermission());
    }

    if (this.filterBranch()) {
      result = result.filter(item => item.branchId === this.filterBranch());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '分支', index: 'branchName', width: 200 },
    { title: '用户', index: 'userName', width: 150 },
    { title: '权限级别', index: 'permission', width: 120, render: 'permission' },
    { title: '授予时间', index: 'grantedAt', type: 'date', width: 180 },
    { title: '授予人', index: 'grantedBy', width: 150 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '编辑',
          click: (record: BranchPermissionItem) => this.edit(record.id)
        },
        {
          text: '撤销',
          type: 'del',
          pop: true,
          click: (record: BranchPermissionItem) => this.revoke(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadPermissions();
    this.loadBranches();
  }

  loadPermissions(): void {
    // TODO: 加载分支权限列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.permissions.set([]);
  }

  loadBranches(): void {
    // TODO: 加载分支列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.branches.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  grantPermission(): void {
    // TODO: 授予权限
    this.message.info('授予权限功能开发中');
  }

  edit(id: string): void {
    // TODO: 编辑权限
    this.message.info('编辑权限功能开发中');
  }

  revoke(id: string): void {
    // TODO: 撤销权限
    this.message.info('撤销权限功能开发中');
  }
}
