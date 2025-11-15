import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { OrganizationContextService } from '@core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-org-overview',
  standalone: true,
  template: `
    <page-header [title]="'組織概覽'" />
    <nz-card [nzBordered]="false">
      @if (orgContext.currentOrganization(); as org) {
        <nz-descriptions [nzBordered]="true" [nzColumn]="2">
          <nz-descriptions-item nzTitle="組織名稱">{{ org.name }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="組織代號">{{ org.slug }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="描述" [nzSpan]="2">
            {{ org.description || '暫無描述' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="創建時間">
            {{ org.created_at | date: 'yyyy-MM-dd HH:mm' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="是否公開">
            <nz-tag [nzColor]="org.is_public ? 'green' : 'default'">
              {{ org.is_public ? '公開' : '私有' }}
            </nz-tag>
          </nz-descriptions-item>
        </nz-descriptions>
      } @else {
        <nz-empty nzNotFoundContent="請先選擇一個組織"></nz-empty>
      }
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class OrgOverviewComponent implements OnInit {
  readonly orgContext = inject(OrganizationContextService);

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // 保留空方法以符合 OnInit 接口要求，初始化邏輯已移至其他位置
  }
}
