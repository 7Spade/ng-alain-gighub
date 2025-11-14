import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-permission-matrix',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'权限矩阵'"></page-header>

    <nz-card nzTitle="权限矩阵" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="权限矩阵功能建设中"
        nzDescription="此页面将展示角色、模块与操作的矩阵映射。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class PermissionMatrixComponent {}


