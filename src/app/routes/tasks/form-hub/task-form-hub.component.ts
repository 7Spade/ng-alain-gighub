import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-form-hub',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'任務建立骨架'" [nzSubtitle]="'以 ng-zorro 表單呈現'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="copy"></span>
          套用模板
        </button>
        <button nz-button nzType="primary">
          <span nz-icon nzType="send"></span>
          送出
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <form nz-form nzLayout="vertical" class="form-layout">
        <nz-form-item>
          <nz-form-label>任務名稱</nz-form-label>
          <nz-form-control>
            <input nz-input placeholder="輸入任務名稱" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>負責人</nz-form-label>
          <nz-form-control>
            <nz-select nzShowSearch nzPlaceHolder="選擇成員">
              <nz-option nzValue="alice" nzLabel="Alice"></nz-option>
              <nz-option nzValue="bob" nzLabel="Bob"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>時間範圍</nz-form-label>
          <nz-form-control>
            <nz-range-picker></nz-range-picker>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>描述</nz-form-label>
          <nz-form-control>
            <textarea nz-input rows="4" placeholder="描述內容"></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
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

      .form-layout {
        max-width: 600px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormHubComponent {}
