import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal, inject } from '@angular/core';
import { OrganizationService, OrganizationContextService } from '@core';
import { STChange, STColumn } from '@delon/abc/st';
import type { OrganizationMemberWithUser } from '@shared';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-org-members',
  standalone: true,
  template: `
    <page-header [title]="'成員管理'" />
    <nz-card [nzBordered]="false">
      <div class="flex justify-between mb-md">
        <div>
          <h2>組織成員</h2>
          <p class="text-muted">管理組織成員</p>
        </div>
        <button nz-button nzType="primary">
          <i nz-icon nzType="plus"></i>
          邀請成員
        </button>
      </div>

      @if (loading()) {
        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
      } @else if (members().length === 0) {
        <nz-empty nzNotFoundContent="尚無成員">
          <button *nzButton="null" nz-button nzType="primary">邀請第一個成員</button>
        </nz-empty>
      } @else {
        <st #st [columns]="columns" [data]="members()" [loading]="loading()" (change)="stChange($event)">
          <ng-template st-row="avatar" let-i>
            <nz-avatar [nzSrc]="i.user.avatar_url" [nzText]="i.user.display_name?.charAt(0)"></nz-avatar>
          </ng-template>
          <ng-template st-row="role" let-i>
            <nz-tag [nzColor]="i.role === 'owner' ? 'red' : i.role === 'admin' ? 'orange' : 'blue'">
              {{ i.role }}
            </nz-tag>
          </ng-template>
          <ng-template st-row="action" let-i>
            <button nz-button nzSize="small" nzType="link">查看</button>
            <button nz-button nzSize="small" nzType="link" nzDanger>移除</button>
          </ng-template>
        </st>
      }
    </nz-card>
  `,
  styles: [
    `
      .flex {
        display: flex;
      }
      .justify-between {
        justify-content: space-between;
      }
      .mb-md {
        margin-bottom: 16px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class OrgMembersComponent implements OnInit {
  private readonly orgService = inject(OrganizationService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly msg = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly members = signal<OrganizationMemberWithUser[]>([]);
  readonly loading = signal(false);

  columns: STColumn[] = [
    { title: '用戶', render: 'avatar' },
    { title: '姓名', index: 'user.display_name' },
    { title: 'Email', index: 'user.email' },
    { title: '角色', render: 'role' },
    { title: '加入時間', index: 'joined_at', type: 'date' },
    { title: '操作', render: 'action' }
  ];

  ngOnInit(): void {
    this.loadMembers();
  }

  async loadMembers(): Promise<void> {
    const org = this.orgContext.currentOrganization();
    if (!org) {
      this.msg.warning('請先選擇組織');
      return;
    }

    this.loading.set(true);
    this.cdr.detectChanges();

    const { data, error } = await this.orgService.getOrganizationMembers(org.id);

    if (error) {
      this.msg.error(error.message || '獲取成員列表失敗');
      this.loading.set(false);
      this.cdr.detectChanges();
      return;
    }

    this.members.set(data || []);
    this.loading.set(false);
    this.cdr.detectChanges();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stChange(_e: STChange): void {
    // 處理表格變化事件
  }
}
