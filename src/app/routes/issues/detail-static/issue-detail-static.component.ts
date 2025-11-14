import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

type Timeline = {
  readonly title: string;
  readonly description: string;
  readonly color: string;
};

@Component({
  selector: 'app-issue-detail-static',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'問題詳情骨架'" [nzSubtitle]="'提供靜態排查佈局'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="edit"></span>
          編輯占位
        </button>
        <button nz-button nzType="primary">
          <span nz-icon nzType="share-alt"></span>
          派送
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <nz-card nzTitle="基本資訊">
        <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }">
          <nz-descriptions-item nzTitle="問題標題">示意頁面：設備配寘錯誤</nz-descriptions-item>
          <nz-descriptions-item nzTitle="狀態">
            <nz-tag nzColor="orange">進行中</nz-tag>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="優先度">
            <nz-rate [ngModel]="3" nzDisabled></nz-rate>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="建立時間">2025-11-14 09:32</nz-descriptions-item>
          <nz-descriptions-item nzTitle="指派給">Issue Team</nz-descriptions-item>
        </nz-descriptions>
      </nz-card>

      <nz-card nzTitle="時間線">
        <nz-timeline>
          @for (item of timeline; track item.title) {
            <nz-timeline-item [nzColor]="item.color">
              <div class="timeline-title">{{ item.title }}</div>
              <div class="timeline-desc">{{ item.description }}</div>
            </nz-timeline-item>
          }
        </nz-timeline>
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
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .timeline-title {
        font-weight: 600;
      }

      .timeline-desc {
        color: rgba(0, 0, 0, 0.55);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueDetailStaticComponent {
  protected readonly timeline: Timeline[] = [
    { title: '建立問題', description: '由 QA Bot 建立', color: 'blue' },
    { title: '派送給 Issue Team', description: '待人工確認', color: 'green' },
    { title: '等待資料回填', description: '需系統紀錄', color: 'orange' }
  ];
}
