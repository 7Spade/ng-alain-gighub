import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface BackupItem {
  readonly id: string;
  readonly name: string;
  readonly type: 'full' | 'incremental';
  readonly status: 'pending' | 'running' | 'completed' | 'failed';
  readonly size: number;
  readonly createdAt: string;
  readonly completedAt: string | null;
}

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'备份管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createBackup()">
          <span nz-icon nzType="plus"></span>
          创建备份
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="备份管理" style="margin-top: 16px;">
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
              <nz-option nzValue="full" nzLabel="完整备份"></nz-option>
              <nz-option nzValue="incremental" nzLabel="增量备份"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

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
              <nz-option nzValue="pending" nzLabel="待执行"></nz-option>
              <nz-option nzValue="running" nzLabel="执行中"></nz-option>
              <nz-option nzValue="completed" nzLabel="已完成"></nz-option>
              <nz-option nzValue="failed" nzLabel="失败"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 备份列表表格 -->
      <st
        #st
        [data]="filteredBackups()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #type let-record>
          @switch (record.type) {
            @case ('full') {
              <nz-tag nzColor="blue">完整备份</nz-tag>
            }
            @case ('incremental') {
              <nz-tag nzColor="green">增量备份</nz-tag>
            }
          }
        </ng-template>

        <ng-template #status let-record>
          @switch (record.status) {
            @case ('pending') {
              <nz-tag nzColor="default">待执行</nz-tag>
            }
            @case ('running') {
              <nz-tag nzColor="processing">执行中</nz-tag>
            }
            @case ('completed') {
              <nz-tag nzColor="success">已完成</nz-tag>
            }
            @case ('failed') {
              <nz-tag nzColor="error">失败</nz-tag>
            }
          }
        </ng-template>

        <ng-template #size let-record>
          {{ record.size | fileSize }}
        </ng-template>
      </st>
    </nz-card>
  `
})
export class Backup implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterType = signal<string | null>(null);
  filterStatus = signal<string | null>(null);
  backups = signal<BackupItem[]>([]);

  // Computed filtered backups
  filteredBackups = computed(() => {
    let result = this.backups();

    if (this.filterType()) {
      result = result.filter(item => item.type === this.filterType());
    }

    if (this.filterStatus()) {
      result = result.filter(item => item.status === this.filterStatus());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '名称', index: 'name', width: 300 },
    { title: '类型', index: 'type', width: 120, render: 'type' },
    { title: '状态', index: 'status', width: 120, render: 'status' },
    { title: '大小', index: 'size', width: 120, render: 'size' },
    { title: '创建时间', index: 'createdAt', type: 'date', width: 180 },
    { title: '完成时间', index: 'completedAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 250,
      buttons: [
        {
          text: '下载',
          iif: (record: BackupItem) => record.status === 'completed',
          click: (record: BackupItem) => this.download(record.id)
        },
        {
          text: '恢复',
          iif: (record: BackupItem) => record.status === 'completed',
          click: (record: BackupItem) => this.restore(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: BackupItem) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadBackups();
  }

  loadBackups(): void {
    // TODO: 加载备份列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.backups.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  createBackup(): void {
    // TODO: 创建备份
    this.message.info('创建备份功能开发中');
  }

  download(id: string): void {
    // TODO: 下载备份
    this.message.info('下载功能开发中');
  }

  restore(id: string): void {
    // TODO: 恢复备份
    this.message.info('恢复功能开发中');
  }

  delete(id: string): void {
    // TODO: 删除备份
    this.message.info('删除功能开发中');
  }
}
