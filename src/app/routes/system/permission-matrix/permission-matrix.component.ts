import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface PermissionMatrixItem {
  readonly roleId: string;
  readonly roleName: string;
  readonly module: string;
  readonly permissions: Record<string, boolean>;
}

@Component({
  selector: 'app-permission-matrix',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'权限矩阵'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="exportMatrix()">
          <span nz-icon nzType="download"></span>
          导出矩阵
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="权限矩阵" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>模块</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterModule()"
              (ngModelChange)="filterModule.set($event)"
              nzPlaceHolder="全部模块"
              nzAllowClear
              style="width: 200px;"
            >
              <nz-option nzValue="blueprint" nzLabel="蓝图"></nz-option>
              <nz-option nzValue="task" nzLabel="任务"></nz-option>
              <nz-option nzValue="issue" nzLabel="问题"></nz-option>
              <nz-option nzValue="quality" nzLabel="质量"></nz-option>
              <nz-option nzValue="document" nzLabel="文档"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 权限矩阵表格 -->
      <st
        #st
        [data]="filteredMatrix()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #permissions let-record>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            @for (perm of getPermissionKeys(record.permissions); track perm) {
              @if (record.permissions[perm]) {
                <nz-tag nzColor="green">{{ perm }}</nz-tag>
              } @else {
                <nz-tag nzColor="default">{{ perm }}</nz-tag>
              }
            }
          </div>
        </ng-template>
      </st>
    </nz-card>
  `
})
export class PermissionMatrixComponent implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterModule = signal<string | null>(null);
  matrix = signal<PermissionMatrixItem[]>([]);

  // Computed filtered matrix
  filteredMatrix = computed(() => {
    let result = this.matrix();

    if (this.filterModule()) {
      result = result.filter(item => item.module === this.filterModule());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: '角色', index: 'roleName', width: 200 },
    { title: '模块', index: 'module', width: 150 },
    { title: '权限', index: 'permissions', width: 400, render: 'permissions' },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '编辑',
          click: (record: PermissionMatrixItem) => this.edit(record.roleId, record.module)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadMatrix();
  }

  loadMatrix(): void {
    // TODO: 加载权限矩阵
    // 暂时使用空数组，实际开发时连接真实数据
    this.matrix.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  getPermissionKeys(permissions: Record<string, boolean>): string[] {
    return Object.keys(permissions);
  }

  edit(roleId: string, module: string): void {
    // TODO: 编辑权限矩阵
    this.message.info('编辑权限矩阵功能开发中');
  }

  exportMatrix(): void {
    // TODO: 导出权限矩阵
    this.message.info('导出矩阵功能开发中');
  }
}
