import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { OrganizationContextService, OrganizationService } from '@core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-org-settings-general',
  standalone: true,
  template: `
    <nz-card [nzBordered]="false">
      <h3>基本設置</h3>
      <p class="text-muted">管理組織的基本資訊</p>

      @if (orgContext.currentOrganization(); as org) {
        <nz-descriptions [nzBordered]="true" [nzColumn]="1">
          <nz-descriptions-item nzTitle="組織名稱">{{ org.name }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="組織代號">{{ org.slug }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="描述">{{ org.description || '暫無描述' }}</nz-descriptions-item>
        </nz-descriptions>
      }
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class OrgSettingsGeneralComponent implements OnInit {
  readonly orgContext = inject(OrganizationContextService);
  readonly orgService = inject(OrganizationService);

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // 保留空方法以符合 OnInit 接口要求，初始化邏輯已移至其他位置
  }
}
