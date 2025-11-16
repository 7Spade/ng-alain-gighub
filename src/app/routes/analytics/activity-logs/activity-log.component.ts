import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivityLogRepository, ActivityLog } from '@core';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'活动日志'">
      <ng-template #action>
        <button nz-button nzType="primary" (click)="loadLogs()">
          <i nz-icon nzType="reload"></i>
          刷新
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="系统活动日志" style="margin-top: 16px;">
      <st
        #st
        [data]="logs()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{show: true, showSize: true, front: false}"
        [scroll]="{x: '1400px'}"
      ></st>
    </nz-card>
  `
})
export class ActivityLogComponent implements OnInit {
  private activityLogRepo = inject(ActivityLogRepository);
  private message = inject(NzMessageService);

  logs = signal<STData[]>([]);
  loading = signal(false);

  columns: STColumn[] = [
    {
      title: '操作时间',
      index: 'createdAt',
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm:ss',
      width: 180,
      fixed: 'left',
      sort: { compare: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() }
    },
    {
      title: '操作人',
      index: 'actorName',
      width: 120,
      format: (item: STData) => item.actorName || 'Unknown'
    },
    {
      title: '操作动作',
      index: 'action',
      width: 150,
      type: 'tag',
      tag: {
        created: { text: '创建', color: 'green' },
        updated: { text: '更新', color: 'blue' },
        deleted: { text: '删除', color: 'red' },
        assigned: { text: '分配', color: 'orange' },
        submitted: { text: '提交', color: 'cyan' },
        approved: { text: '批准', color: 'green' },
        rejected: { text: '拒绝', color: 'red' },
        merged: { text: '合并', color: 'purple' },
        resolved: { text: '解决', color: 'green' },
        closed: { text: '关闭', color: 'default' }
      }
    },
    {
      title: '资源类型',
      index: 'resourceType',
      width: 120,
      type: 'tag',
      tag: {
        blueprint: { text: '蓝图', color: 'blue' },
        branch: { text: '分支', color: 'cyan' },
        task: { text: '任务', color: 'green' },
        issue: { text: '问题', color: 'red' },
        pr: { text: 'PR', color: 'purple' },
        comment: { text: '评论', color: 'default' },
        document: { text: '文档', color: 'orange' },
        inspection: { text: '验收', color: 'geekblue' },
        qa: { text: '质检', color: 'magenta' }
      }
    },
    {
      title: '资源ID',
      index: 'resourceId',
      width: 280,
      format: (item: STData) => item.resourceId?.substring(0, 8) + '...' || 'N/A'
    },
    {
      title: '蓝图ID',
      index: 'blueprintId',
      width: 280,
      format: (item: STData) => item.blueprintId?.substring(0, 8) + '...' || 'N/A'
    },
    {
      title: '分支ID',
      index: 'branchId',
      width: 280,
      format: (item: STData) => item.branchId?.substring(0, 8) + '...' || 'N/A'
    },
    {
      title: 'IP地址',
      index: 'ipAddress',
      width: 140
    },
    {
      title: '操作详情',
      index: 'actionDetails',
      width: 200,
      format: (item: STData) => {
        if (!item.actionDetails) return 'N/A';
        const details = typeof item.actionDetails === 'string' 
          ? item.actionDetails 
          : JSON.stringify(item.actionDetails);
        return details.length > 50 ? details.substring(0, 50) + '...' : details;
      }
    }
  ];

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading.set(true);
    this.activityLogRepo
      .findAll({
        orderBy: 'created_at',
        orderDirection: 'desc',
        pageSize: 100
      })
      .subscribe({
        next: (data: ActivityLog[]) => {
          this.logs.set(data.map(log => ({
            ...log,
            actorName: this.getActorName(log)
          })));
          this.loading.set(false);
        },
        error: (err: any) => {
          console.error('Failed to load activity logs:', err);
          this.message.error('加载活动日志失败');
          this.loading.set(false);
        }
      });
  }

  private getActorName(log: ActivityLog): string {
    // TODO: In real implementation, join with accounts table
    // For now, return placeholder
    return `User-${log.actorId?.substring(0, 8)}`;
  }
}
