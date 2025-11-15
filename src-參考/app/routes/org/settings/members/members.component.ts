import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { OrganizationContextService, OrganizationService } from '@core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-org-settings-members',
  standalone: true,
  template: `
    <nz-card [nzBordered]="false">
      <h3>成員管理</h3>
      <p class="text-muted">管理組織成員</p>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class OrgSettingsMembersComponent implements OnInit {
  readonly orgContext = inject(OrganizationContextService);
  readonly orgService = inject(OrganizationService);

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // 保留空方法以符合 OnInit 接口要求，初始化邏輯已移至其他位置
  }
}
