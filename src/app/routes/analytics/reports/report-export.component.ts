import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-report-export',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'报表导出'"></page-header>

    <nz-card nzTitle="报表导出" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="报表导出功能建设中"
        nzDescription="此页面将支持多格式导出与排程任务。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class ReportExportComponent {}
