import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { IssueSyncLogRepository, IssueSyncLog } from '@core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-sync-logs',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'问题同步日志'"></page-header>

    <nz-card nzTitle="同步日志" style="margin-top: 16px;">
      <st
        #st
        [data]="logs()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{
          show: true,
          showSize: true,
          front: false
        }"
        [responsive]="true"
        [scroll]="{ x: '1200px' }"
      ></st>
    </nz-card>
  `
})
export class SyncLogs implements OnInit {
  private syncLogRepo = inject(IssueSyncLogRepository);
  private message = inject(NzMessageService);

  // Signals for reactive state
  logs = signal<STData[]>([]);
  loading = signal(false);

  // ST Table columns configuration
  columns: STColumn[] = [
    {
      title: '问题编号',
      index: 'issue_number',
      width: 120
    },
    {
      title: '同步状态',
      index: 'sync_status',
      width: 120,
      type: 'badge',
      badge: {
        pending: { text: '待同步', color: 'default' },
        syncing: { text: '同步中', color: 'processing' },
        synced: { text: '已同步', color: 'success' },
        failed: { text: '失败', color: 'error' }
      }
    },
    {
      title: '源分支',
      index: 'source_branch_name',
      width: 150
    },
    {
      title: '目标分支',
      index: 'target_branch_name',
      width: 150
    },
    {
      title: '同步时间',
      index: 'synced_at',
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm:ss',
      width: 180
    },
    {
      title: '操作人',
      index: 'synced_by_name',
      width: 120
    },
    {
      title: '备注',
      index: 'sync_notes',
      width: 200
    }
  ];

  ngOnInit(): void {
    this.loadSyncLogs();
  }

  /**
   * 加载同步日志
   */
  loadSyncLogs(): void {
    this.loading.set(true);

    this.syncLogRepo
      .findAll({
        orderBy: 'synced_at',
        orderDirection: 'desc',
        pageSize: 100
      })
      .subscribe({
        next: data => {
          this.logs.set(data as STData[]);
          this.loading.set(false);
        },
        error: err => {
          console.error('加载同步日志失败:', err);
          this.message.error('加载同步日志失败');
          this.loading.set(false);
        }
      });
  }
}
