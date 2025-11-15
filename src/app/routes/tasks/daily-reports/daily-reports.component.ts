import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, TaskService, Task, DailyReport, BlueprintService } from '@shared';
import { DailyReportRepository } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-daily-reports',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'施工日志'">
      <ng-template #extra>
        <nz-select
          [ngModel]="selectedBlueprintId()"
          (ngModelChange)="selectedBlueprintId.set($event); onBlueprintChange()"
          nzPlaceHolder="请选择蓝图"
          style="width: 300px; margin-right: 8px;"
        >
          @for (blueprint of blueprintService.blueprints(); track blueprint.id) {
            <nz-option [nzValue]="blueprint.id" [nzLabel]="blueprint.name"></nz-option>
          }
        </nz-select>
        <button nz-button nzType="primary" (click)="createReport()">
          <span nz-icon nzType="plus"></span>
          新建日志
        </button>
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      @if (!selectedBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else if (loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else {
        <st
          #st
          [data]="reports()"
          [columns]="columns"
          [loading]="loading()"
          [page]="{ front: false, show: true, showSize: true }"
        >
          <ng-template #weather let-record>
            @if (record.weather_data) {
              <nz-tag>{{ record.weather_data }}</nz-tag>
            } @else {
              <span>-</span>
            }
          </ng-template>
        </st>
      }
    </nz-card>
  `
})
export class DailyReportsComponent implements OnInit {
  readonly taskService = inject(TaskService);
  readonly blueprintService = inject(BlueprintService);
  private readonly dailyReportRepository = inject(DailyReportRepository);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly reports = signal<DailyReport[]>([]);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '任务ID', index: 'task_id', width: 120 },
    { title: '任务标题', index: 'taskTitle', width: 200, format: (item: any) => item.taskTitle || item.task_id },
    { title: '报告日期', index: 'report_date', type: 'date', width: 120 },
    { title: '报告者ID', index: 'reported_by', width: 120 },
    { title: '工作内容', index: 'work_content', width: 300 },
    { title: '天气', index: 'weather_data', width: 100, render: 'weather' },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '查看',
          click: (record: DailyReport) => this.viewReport(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadBlueprints();
  }

  async loadBlueprints(): Promise<void> {
    try {
      await this.blueprintService.loadBlueprints();
    } catch (error) {
      this.message.error('加载蓝图列表失败');
    }
  }

  async onBlueprintChange(): Promise<void> {
    const blueprintId = this.selectedBlueprintId();
    if (!blueprintId) return;

    this.loading.set(true);
    try {
      // 先加载任务列表
      await this.taskService.loadTasksByBlueprint(blueprintId);
      
      // 然后加载所有任务的施工日志
      const tasks = this.taskService.tasks();
      const reportPromises = tasks.map(task => 
        firstValueFrom(this.dailyReportRepository.findByTaskId(task.id))
      );
      const reportArrays = await Promise.all(reportPromises);
      const allReports = reportArrays.flat();
      
      // 关联任务标题
      const reportsWithTitle = allReports.map(report => {
        const task = tasks.find(t => t.id === report.task_id);
        return {
          ...report,
          taskTitle: task?.title || '任务不存在'
        } as any;
      });
      
      this.reports.set(reportsWithTitle as DailyReport[]);
    } catch (error) {
      this.message.error('加载施工日志失败');
    } finally {
      this.loading.set(false);
    }
  }

  createReport(): void {
    // TODO: 导航到创建日志页面
    this.message.info('创建日志功能待实现');
  }

  viewReport(id: string): void {
    // TODO: 导航到日志详情页面
    this.message.info('日志详情功能待实现');
  }
}
