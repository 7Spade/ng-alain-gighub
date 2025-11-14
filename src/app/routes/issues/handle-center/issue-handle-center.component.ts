import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

type ChecklistItem = {
  readonly label: string;
  readonly done: boolean;
};

@Component({
  selector: 'app-issue-handle-center',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'處理中心骨架'" [nzSubtitle]="'示意流程與表單'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="tool"></span>
          呼叫 Bot
        </button>
        <button nz-button nzType="primary">
          <span nz-icon nzType="play-circle"></span>
          執行腳本
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <nz-row [nzGutter]="16">
        <nz-col nzXs="24" nzXl="12">
          <nz-card nzTitle="處理腳本">
            <form nz-form nzLayout="vertical">
              <nz-form-item>
                <nz-form-label>腳本模板</nz-form-label>
                <nz-form-control>
                  <nz-select nzPlaceHolder="選擇模板">
                    <nz-option nzValue="rollback" nzLabel="Rollback 設備設定"></nz-option>
                    <nz-option nzValue="sync" nzLabel="同步參數"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-label>備註</nz-form-label>
                <nz-form-control>
                  <textarea nz-input rows="3"></textarea>
                </nz-form-control>
              </nz-form-item>
            </form>
          </nz-card>
        </nz-col>

        <nz-col nzXs="24" nzXl="12">
          <nz-card nzTitle="處理清單">
            <nz-list>
              @for (item of checklist; track item.label) {
                <nz-list-item>
                  <label nz-checkbox [ngModel]="item.done">{{ item.label }}</label>
                </nz-list-item>
              }
            </nz-list>
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
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueHandleCenterComponent {
  protected readonly checklist: ChecklistItem[] = [
    { label: '確認問題描述', done: true },
    { label: '同步設備紀錄', done: false },
    { label: '排程二次驗證', done: false }
  ];
}
