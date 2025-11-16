import { ChangeDetectionStrategy, Component, OnInit, inject, signal, Injector } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IssueRepository } from '@core/repositories/issue.repository';
import { DocumentRepository } from '@core/repositories/document.repository';
import { ProgressTrackingRepository } from '@core/repositories/progress-tracking.repository';
import { ActivityLogRepository } from '@core/repositories/activity-log.repository';

@Component({
  selector: 'app-report-export',
  standalone: true,
  imports: [SHARED_IMPORTS, SFComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'数据导出'">
      <ng-template #action>
        <button nz-button nzType="primary" [nzLoading]="loading()" (click)="sf.submit()">
          <span nz-icon nzType="download"></span>
          导出数据
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="导出配置" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="数据导出"
        nzDescription="选择要导出的数据类型、时间范围和格式，点击导出按钮即可下载。"
        [nzShowIcon]="true"
        style="margin-bottom: 24px;"
      ></nz-alert>
      
      <sf #sf [schema]="schema" [ui]="ui" [button]="button" (formSubmit)="onExport($event)"></sf>
    </nz-card>
  `
})
export class ReportExportComponent implements OnInit {
  private message = inject(NzMessageService);
  private injector = inject(Injector);
  private issueRepo = inject(IssueRepository);
  private documentRepo = inject(DocumentRepository);
  private progressRepo = inject(ProgressTrackingRepository);
  private activityLogRepo = inject(ActivityLogRepository);

  loading = signal(false);

  schema: SFSchema = {
    properties: {
      entity_type: {
        type: 'string',
        title: '数据类型',
        enum: [
          { label: '问题记录', value: 'issues' },
          { label: '进度跟踪', value: 'progress' },
          { label: '文档资料', value: 'documents' },
          { label: '活动日志', value: 'activity_logs' }
        ],
        default: 'issues',
        ui: {
          widget: 'select',
          grid: { span: 12 }
        }
      },
      date_range: {
        type: 'string',
        title: '时间范围',
        ui: {
          widget: 'date',
          mode: 'range',
          grid: { span: 12 },
          placeholder: ['开始日期', '结束日期']
        }
      },
      format: {
        type: 'string',
        title: '导出格式',
        enum: [
          { label: 'CSV', value: 'csv' },
          { label: 'JSON', value: 'json' },
          { label: 'Excel (XLSX)', value: 'xlsx' }
        ],
        default: 'csv',
        ui: {
          widget: 'select',
          grid: { span: 12 }
        }
      },
      filters: {
        type: 'string',
        title: '额外过滤条件',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          grid: { span: 12 },
          placeholder: '例如: status=open (可选)'
        }
      }
    },
    required: ['entity_type', 'format']
  };

  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 120,
      grid: { span: 24 }
    }
  };

  button = {
    submit: '导出数据',
    reset: '重置'
  };

  ngOnInit(): void {}

  async onExport(value: any): Promise<void> {
    this.loading.set(true);
    
    try {
      // Get data from appropriate repository
      const data = await this.fetchData(value.entity_type, value.date_range);
      
      if (!data || data.length === 0) {
        this.message.warning('没有数据可导出');
        this.loading.set(false);
        return;
      }

      // Convert to selected format
      const formatted = this.formatData(data, value.format);
      const filename = `${value.entity_type}_export_${new Date().toISOString().split('T')[0]}.${this.getFileExtension(value.format)}`;
      const mimeType = this.getMimeType(value.format);

      // Trigger download
      this.downloadFile(formatted, filename, mimeType);
      
      this.message.success(`成功导出 ${data.length} 条记录`);
    } catch (error: any) {
      this.message.error(`导出失败: ${error.message || '未知错误'}`);
    } finally {
      this.loading.set(false);
    }
  }

  private async fetchData(entityType: string, dateRange?: string[]): Promise<any[]> {
    const filters: any = {};
    
    if (dateRange && dateRange.length === 2) {
      filters.created_at_gte = dateRange[0];
      filters.created_at_lte = dateRange[1];
    }

    const repo = this.getRepository(entityType);
    
    return new Promise((resolve, reject) => {
      repo.findAll({ filters, pageSize: 10000 }).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err)
      });
    });
  }

  private getRepository(entityType: string): any {
    switch (entityType) {
      case 'issues':
        return this.issueRepo;
      case 'progress':
        return this.progressRepo;
      case 'documents':
        return this.documentRepo;
      case 'activity_logs':
        return this.activityLogRepo;
      default:
        return this.issueRepo;
    }
  }

  private formatData(data: any[], format: string): string {
    switch (format) {
      case 'csv':
        return this.convertToCSV(data);
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'xlsx':
        return this.convertToCSV(data); // Simplified: use CSV for Excel
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const keys = Object.keys(data[0]);
    const header = keys.join(',');
    const rows = data.map(item => 
      keys.map(key => {
        const value = item[key];
        if (value === null || value === undefined) return '';
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );
    
    return [header, ...rows].join('\n');
  }

  private getFileExtension(format: string): string {
    switch (format) {
      case 'csv': return 'csv';
      case 'json': return 'json';
      case 'xlsx': return 'xlsx';
      default: return 'txt';
    }
  }

  private getMimeType(format: string): string {
    switch (format) {
      case 'csv': return 'text/csv';
      case 'json': return 'application/json';
      case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default: return 'text/plain';
    }
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
