import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface RoleItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly type: 'system' | 'custom';
  readonly userCount: number;
  readonly permissionCount: number;
  readonly createdAt: string;
}

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'角色管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createRole()">
          <span nz-icon nzType="plus"></span>
          创建角色
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="角色管理" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>类型</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterType()"
              (ngModelChange)="filterType.set($event)"
              nzPlaceHolder="全部类型"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="system" nzLabel="系统角色"></nz-option>
              <nz-option nzValue="custom" nzLabel="自定义角色"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 角色列表表格 -->
      <st
        #st
        [data]="filteredRoles()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #type let-record>
          @switch (record.type) {
            @case ('system') {
              <nz-tag nzColor="blue">系统角色</nz-tag>
            }
            @case ('custom') {
              <nz-tag nzColor="green">自定义角色</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class RoleManagementComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterType = signal<string | null>(null);
  roles = signal<RoleItem[]>([]);

  // Computed filtered roles
  filteredRoles = computed(() => {
    let result = this.roles();

    if (this.filterType()) {
      result = result.filter(item => item.type === this.filterType());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '角色名称', index: 'name', width: 200 },
    { title: '描述', index: 'description', width: 300 },
    { title: '类型', index: 'type', width: 120, render: 'type' },
    { title: '用户数', index: 'userCount', width: 100 },
    { title: '权限数', index: 'permissionCount', width: 100 },
    { title: '创建时间', index: 'createdAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 250,
      buttons: [
        {
          text: '查看',
          click: (record: RoleItem) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          iif: (record: RoleItem) => record.type === 'custom',
          click: (record: RoleItem) => this.edit(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          iif: (record: RoleItem) => record.type === 'custom',
          click: (record: RoleItem) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    // TODO: 加载角色列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.roles.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  createRole(): void {
    // TODO: 创建角色
    this.message.info('创建角色功能开发中');
  }

  viewDetail(id: string): void {
    // TODO: 查看角色详情
    this.message.info('查看详情功能开发中');
  }

  edit(id: string): void {
    // TODO: 编辑角色
    this.message.info('编辑角色功能开发中');
  }

  delete(id: string): void {
    // TODO: 删除角色
    this.message.info('删除角色功能开发中');
  }
}
