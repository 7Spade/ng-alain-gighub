import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-document-version',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'版本管理'"></page-header>

    <nz-card nzTitle="版本管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="版本管理功能建设中"
        nzDescription="此页面将提供版本比对、回滚与审批流程。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class DocumentVersionComponent {}
