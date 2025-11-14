import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

type ReviewNote = {
  readonly author: string;
  readonly content: string;
  readonly datetime: string;
};

@Component({
  selector: 'app-blueprint-review-workspace',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'PR 審核工作區骨架'" [nzSubtitle]="'支援評論與任務分派'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="highlight"></span>
          加入批註
        </button>
        <button nz-button nzType="primary">
          <span nz-icon nzType="check-circle"></span>
          通過審核
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <nz-row [nzGutter]="16">
        <nz-col nzXs="24" nzXl="14">
          <nz-card nzTitle="Diff 區塊（示意）">
            <pre class="code-preview">{{ diffPreview }}</pre>
          </nz-card>

          <nz-card nzTitle="審核評論" class="section-card">
            @for (note of reviewNotes; track note.datetime) {
              <nz-comment [nzAuthor]="note.author" [nzDatetime]="note.datetime">
                <nz-comment-content>{{ note.content }}</nz-comment-content>
              </nz-comment>
            }
          </nz-card>
        </nz-col>

        <nz-col nzXs="24" nzXl="10">
          <nz-card nzTitle="待辦事項" class="section-card">
            <nz-list nzBordered>
              <nz-list-item>
                <label nz-checkbox [ngModel]="false">補充 Branch 策略文件</label>
              </nz-list-item>
              <nz-list-item>
                <label nz-checkbox [ngModel]="true">驗證自動化腳本輸出</label>
              </nz-list-item>
              <nz-list-item>
                <label nz-checkbox [ngModel]="false">更新版本 log</label>
              </nz-list-item>
            </nz-list>
          </nz-card>

          <nz-card nzTitle="審核設定" class="section-card">
            <form nz-form nzLayout="vertical">
              <nz-form-item>
                <nz-form-label>優先度</nz-form-label>
                <nz-form-control>
                  <nz-segmented [nzOptions]="priorityOptions"></nz-segmented>
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-label>通知頻率</nz-form-label>
                <nz-form-control>
                  <nz-radio-group nzName="notify" nzDirection="vertical">
                    <label nz-radio nzValue="instant">即時</label>
                    <label nz-radio nzValue="hourly">每小時</label>
                    <label nz-radio nzValue="daily">每日摘要</label>
                  </nz-radio-group>
                </nz-form-control>
              </nz-form-item>
            </form>
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

      .code-preview {
        background: #0f172a;
        color: #f8fafc;
        padding: 16px;
        border-radius: 6px;
        font-family: 'Fira Code', Consolas, monospace;
        font-size: 13px;
        min-height: 260px;
        white-space: pre-wrap;
      }

      nz-comment {
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding-bottom: 12px;
        margin-bottom: 12px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlueprintReviewWorkspaceComponent {
  protected diffPreview = `diff --git a/src/app/example.ts b/src/app/example.ts
@@ -1,3 +1,6 @@
 export class ExampleComponent {
-  status = 'draft';
+  status = 'ready';
+  syncBranches(): void {
+    // TODO: call blueprint API
+  }
 }`;

  protected readonly reviewNotes: ReviewNote[] = [
    { author: 'Reviewer A', content: '請在同步前加入權限檢查。', datetime: '今天 10:20' },
    { author: 'Reviewer B', content: '建議拆分為兩個提交，方便回溯。', datetime: '今天 09:48' }
  ];

  protected readonly priorityOptions = [
    { label: '低', value: 'low' },
    { label: '中', value: 'medium' },
    { label: '高', value: 'high' }
  ];
}

