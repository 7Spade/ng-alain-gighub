import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ExportTaskItem {
  readonly id: string;
  readonly reportName: string;
  readonly format: string;
  readonly status: string;
  readonly scheduledAt: string;
  readonly completedAt: string | null;
  readonly downloadUrl: string | null;
}

@Component({
  selector: 'app-report-export',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'报表导出'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createExportTask()">
          <span nz-icon nzType="plus"></span>
          新建导出任务
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="报表导出任务" style="margin-top: 16px;">
      <!-- 导出任务列表 -->
      <st
        #st
        [data]="exportTasks()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #format let-record>
          @switch (record.format) {
            @case ('pdf') {
              <nz-tag nzColor="red">PDF</nz-tag>
            }
            @case ('excel') {
              <nz-tag nzColor="green">Excel</nz-tag>
            }
            @case ('html') {
              <nz-tag nzColor="blue">HTML</nz-tag>
            }
          }
        </ng-template>

        <ng-template #status let-record>
          @switch (record.status) {
            @case ('pending') {
              <nz-tag nzColor="default">待处理</nz-tag>
            }
            @case ('processing') {
              <nz-tag nzColor="processing">处理中</nz-tag>
            }
            @case ('completed') {
              <nz-tag nzColor="success">已完成</nz-tag>
            }
            @case ('failed') {
              <nz-tag nzColor="error">失败</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class ReportExportComponent implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  exportTasks = signal<ExportTaskItem[]>([]);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '报告名称', index: 'reportName', width: 250 },
    { title: '格式', index: 'format', width: 100, render: 'format' },
    { title: '状态', index: 'status', width: 120, render: 'status' },
    { title: '计划时间', index: 'scheduledAt', type: 'date', width: 180 },
    { title: '完成时间', index: 'completedAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '下载',
          iif: (record: ExportTaskItem) => record.status === 'completed' && record.downloadUrl !== null,
          click: (record: ExportTaskItem) => this.download(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: ExportTaskItem) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadExportTasks();
  }

  loadExportTasks(): void {
    // TODO: 加载导出任务列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.exportTasks.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  createExportTask(): void {
    // TODO: 实现创建导出任务逻辑
    this.message.info('创建导出任务功能开发中');
  }

  download(id: string): void {
    // TODO: 实现下载逻辑
    this.message.info('下载功能开发中');
  }

  delete(id: string): void {
    // TODO: 实现删除逻辑
    this.message.info('删除功能开发中');
  }
}
