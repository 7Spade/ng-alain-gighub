import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-permission-assignment',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'权限分配'"></page-header>

    <nz-card nzTitle="权限分配" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="权限分配功能建设中"
        nzDescription="此页面将提供权限授予、审批流程与历史记录。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class PermissionAssignmentComponent {}


