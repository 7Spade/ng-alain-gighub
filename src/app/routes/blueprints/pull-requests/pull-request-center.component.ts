import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

type PullRequest = {
  readonly title: string;
  readonly author: string;
  readonly reviewers: string[];
  readonly status: 'open' | 'review' | 'merged';
};

@Component({
  selector: 'app-blueprint-pull-request-center',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'Pull Request 中心骨架'" [nzSubtitle]="'列出待審核項目'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="filter"></span>
          篩選
        </button>
        <button nz-button nzType="primary">
          <span nz-icon nzType="plus"></span>
          建立 PR
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <nz-card nzTitle="PR 清單">
        <nz-list [nzDataSource]="pullRequests" nzItemLayout="vertical">
          <ng-template #renderItem let-item>
            <nz-list-item>
              <nz-list-item-meta
                [nzTitle]="item.title"
                [nzDescription]="'作者：' + item.author"
              ></nz-list-item-meta>
              <div class="pr-meta">
                <nz-tag nzColor="blue" *nzStringTemplateOutlet="statusText(item.status)">
                  {{ statusText(item.status) }}
                </nz-tag>
                <div class="reviewers">
                  @for (reviewer of item.reviewers; track reviewer) {
                    <nz-avatar nzSize="small" [nzText]="reviewer[0]"></nz-avatar>
                  }
                  <span class="reviewer-label">審核人</span>
                </div>
              </div>
              <div class="pr-actions">
                <button nz-button nzType="default" nzSize="small">查看差異</button>
                <button nz-button nzType="primary" nzSize="small">進入審核</button>
              </div>
            </nz-list-item>
          </ng-template>
        </nz-list>
      </nz-card>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page-section {
        padding: 16px;
      }

      .pr-meta {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .reviewers {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .reviewer-label {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }

      .pr-actions {
        margin-top: 12px;
        display: flex;
        gap: 8px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PullRequestCenterComponent {
  protected readonly pullRequests: PullRequest[] = [
    { title: '調整主分支同步策略', author: 'Alice', reviewers: ['Howard', 'Leo'], status: 'review' },
    { title: 'Account 模組新增權限', author: 'Kevin', reviewers: ['Nina'], status: 'open' },
    { title: '文件管理上線版本', author: 'Mia', reviewers: ['Olivia', 'Paul'], status: 'merged' }
  ];

  protected statusText(status: PullRequest['status']): string {
    switch (status) {
      case 'open':
        return '待處理';
      case 'review':
        return '審核中';
      case 'merged':
        return '已合併';
      default:
        return '未知';
    }
  }
}

