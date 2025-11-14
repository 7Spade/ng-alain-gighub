import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

type SummaryCard = {
  readonly title: string;
  readonly value: string;
  readonly note: string;
};

@Component({
  selector: 'app-issue-close-summary',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'結案摘要骨架'" [nzSubtitle]="'示意總結資訊'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="file-text"></span>
          匯出報告
        </button>
        <button nz-button nzType="primary">
          <span nz-icon nzType="check"></span>
          完成結案
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <nz-row [nzGutter]="16">
        @for (card of summaryCards; track card.title) {
          <nz-col nzXs="24" nzSm="12" nzXl="6">
            <nz-card nzSize="small">
              <div class="card-value">{{ card.value }}</div>
              <div class="card-title">{{ card.title }}</div>
              <div class="card-note">{{ card.note }}</div>
            </nz-card>
          </nz-col>
        }
      </nz-row>

      <nz-card nzTitle="結案說明">
        <nz-typography>
          <p>
            這裡提供靜態說明文本，用於開發時快速確認佈局。可加入 Markdown、富文字或表格等自訂內容。
          </p>
        </nz-typography>
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

      .card-value {
        font-size: 26px;
        font-weight: 600;
      }

      .card-title {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
      }

      .card-note {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueCloseSummaryComponent {
  protected readonly summaryCards: SummaryCard[] = [
    { title: '平均處理時間', value: '2.4h', note: '含自動化流程' },
    { title: '參與人數', value: '5', note: '跨模組協作' },
    { title: '剩餘追蹤', value: '1', note: '待補驗證' },
    { title: '重現次數', value: '0', note: '已確認修復' }
  ];
}

