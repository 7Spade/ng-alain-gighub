import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

interface BranchSnapshot {
  readonly name: string;
  readonly commits: number;
  readonly reviewer: string;
  readonly status: string;
}

interface TimelineItem {
  readonly title: string;
  readonly detail: string;
  readonly color: string;
}

@Component({
  selector: 'app-blueprint-main-branch',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'主分支管控骨架'" [nzSubtitle]="'Git-like 流程示意'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="sync"></span>
          立即同步
        </button>
        <button nz-button nzType="primary">
          <span nz-icon nzType="safety"></span>
          建立保護規則
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <nz-row [nzGutter]="16">
        <nz-col nzSpan="24">
          <nz-card nzTitle="分支健康度" class="section-card">
            <nz-table [nzData]="branchSnapshots" nzSize="middle" [nzFrontPagination]="false">
              <thead>
                <tr>
                  <th>分支名稱</th>
                  <th>未合併提交</th>
                  <th>主要審核人</th>
                  <th>狀態</th>
                </tr>
              </thead>
              <tbody>
                @for (snapshot of branchSnapshots; track snapshot.name) {
                  <tr>
                    <td>{{ snapshot.name }}</td>
                    <td>{{ snapshot.commits }}</td>
                    <td>{{ snapshot.reviewer }}</td>
                    <td>
                      <nz-tag [nzColor]="snapshot.status === '需要行動' ? 'red' : 'green'">{{ snapshot.status }}</nz-tag>
                    </td>
                  </tr>
                }
              </tbody>
            </nz-table>
          </nz-card>
        </nz-col>

        <nz-col nzXs="24" nzXl="12">
          <nz-card nzTitle="最近活動" class="section-card">
            <nz-timeline>
              @for (item of activityTimeline; track item.title) {
                <nz-timeline-item [nzColor]="item.color">
                  <div class="timeline-title">{{ item.title }}</div>
                  <div class="timeline-detail">{{ item.detail }}</div>
                </nz-timeline-item>
              }
            </nz-timeline>
          </nz-card>
        </nz-col>

        <nz-col nzXs="24" nzXl="12">
          <nz-card nzTitle="部署窗口" class="section-card">
            <nz-calendar [nzFullscreen]="false"></nz-calendar>
            <div class="calendar-helper">
              <nz-badge nzStatus="processing" nzText="綠燈可部署"></nz-badge>
              <nz-badge nzStatus="warning" nzText="需檢查依賴"></nz-badge>
            </div>
          </nz-card>
        </nz-col>
      </nz-row>
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

      .section-card {
        height: 100%;
      }

      .timeline-title {
        font-weight: 600;
      }

      .timeline-detail {
        color: rgba(0, 0, 0, 0.55);
      }

      .calendar-helper {
        margin-top: 12px;
        display: flex;
        gap: 16px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlueprintMainBranchComponent {
  protected readonly branchSnapshots: BranchSnapshot[] = [
    { name: 'main', commits: 3, reviewer: 'System', status: '健康' },
    { name: 'release/2402', commits: 7, reviewer: 'Release Guild', status: '需要行動' },
    { name: 'feature/blueprint', commits: 2, reviewer: 'Blueprint Squad', status: '健康' }
  ];

  protected readonly activityTimeline: TimelineItem[] = [
    { title: '合併 #123 到 main', detail: '審核人：Howard · 10:20', color: 'green' },
    { title: 'release/2402 觸發異常', detail: 'Lint 失敗 · 09:05', color: 'red' },
    { title: 'Branch Bot 自動同步', detail: '完成 staging 對齊 · 08:12', color: 'blue' }
  ];
}
