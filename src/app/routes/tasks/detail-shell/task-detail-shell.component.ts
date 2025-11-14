import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

type Checklist = {
  readonly content: string;
  readonly done: boolean;
};

@Component({
  selector: 'app-task-detail-shell',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'任務詳情骨架'" [nzSubtitle]="'快速對照 UI'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="schedule"></span>
          排程
        </button>
        <button nz-button nzType="primary">
          <span nz-icon nzType="team"></span>
          指派
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <nz-card nzTitle="任務 Metadata">
        <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }">
          <nz-descriptions-item nzTitle="名稱">示意任務</nz-descriptions-item>
          <nz-descriptions-item nzTitle="狀態">
            <nz-tag nzColor="processing">進行中</nz-tag>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="負責人">Task Bot</nz-descriptions-item>
          <nz-descriptions-item nzTitle="開始時間">2025-11-14</nz-descriptions-item>
        </nz-descriptions>
      </nz-card>

      <nz-card nzTitle="Checklist">
        <nz-timeline>
          @for (item of checklist; track item.content) {
            <nz-timeline-item [nzColor]="item.done ? 'green' : 'gray'">
              {{ item.content }}
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
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailShellComponent {
  protected readonly checklist: Checklist[] = [
    { content: '確認需求', done: true },
    { content: '完成設計', done: false },
    { content: '安排測試', done: false }
  ];
}
