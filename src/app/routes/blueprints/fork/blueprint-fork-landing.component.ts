import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

interface ForkStep {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-blueprint-fork-landing',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'Fork 任務骨架'" [nzSubtitle]="'以 Step Form 呈現流程'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="download"></span>
          匯出設定
        </button>
        <button nz-button nzType="primary">
          <span nz-icon nzType="apartment"></span>
          建立 Fork
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <nz-card>
        <nz-steps [nzCurrent]="1">
          @for (step of forkSteps; track step.title) {
            <nz-step [nzTitle]="step.title" [nzDescription]="step.description"></nz-step>
          }
        </nz-steps>

        <div class="fork-form">
          <form nz-form nzLayout="vertical">
            <nz-form-item>
              <nz-form-label>來源藍圖</nz-form-label>
              <nz-form-control>
                <nz-select nzPlaceHolder="選擇藍圖">
                  <nz-option nzValue="blueprint-main" nzLabel="主幹 Blueprint"></nz-option>
                  <nz-option nzValue="blueprint-release" nzLabel="Release Blueprint"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label>Fork 名稱</nz-form-label>
              <nz-form-control>
                <input nz-input placeholder="ex: feature/org-collab" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label>引用模組</nz-form-label>
              <nz-form-control>
                <nz-transfer [nzDataSource]="transferData" [nzTitles]="['可選模組', '已加入']" nzShowSearch></nz-transfer>
              </nz-form-control>
            </nz-form-item>

            <div class="actions">
              <button nz-button nzType="default">上一步</button>
              <button nz-button nzType="primary">預覽結果</button>
            </div>
          </form>
        </div>
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

      .fork-form {
        margin-top: 32px;
      }

      .actions {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlueprintForkLandingComponent {
  protected readonly forkSteps: ForkStep[] = [
    { title: '選擇來源', description: '主幹 / release / 任務分支' },
    { title: '定義 Fork', description: '命名與模組選取' },
    { title: '審核與同步', description: '設定守護腳本' }
  ];

  protected readonly transferData = [
    { key: 'account', title: 'Account 模組', direction: 'left' as const },
    { key: 'task', title: 'Task 模組', direction: 'left' as const },
    { key: 'document', title: 'Document 模組', direction: 'left' as const },
    { key: 'quality', title: 'Quality 模組', direction: 'right' as const }
  ];
}
