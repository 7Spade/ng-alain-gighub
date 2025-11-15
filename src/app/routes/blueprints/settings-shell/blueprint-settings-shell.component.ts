import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

interface SettingTab {
  readonly key: string;
  readonly title: string;
  readonly description: string;
}

interface Reviewer {
  readonly name: string;
  readonly role: string;
  readonly availability: string;
}

@Component({
  selector: 'app-blueprint-settings-shell',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'藍圖設定骨架'" [nzSubtitle]="'使用 ng-zorro form 樣板呈現配置區'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="history"></span>
          查看版本
        </button>
        <button nz-button nzType="primary">
          <span nz-icon nzType="save"></span>
          快速儲存
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <nz-card nzTitle="設定面板" class="section-card">
        <nz-tabset nzTabPosition="top" nzType="line">
          @for (tab of settingTabs; track tab.key) {
            <nz-tab [nzTitle]="tab.title">
              <p class="tab-description">{{ tab.description }}</p>

              <form nz-form nzLayout="vertical" class="settings-form">
                <nz-form-item>
                  <nz-form-label>名稱</nz-form-label>
                  <nz-form-control>
                    <input nz-input [placeholder]="'輸入 ' + tab.title + ' 名稱'" />
                  </nz-form-control>
                </nz-form-item>

                <nz-form-item>
                  <nz-form-label>描述</nz-form-label>
                  <nz-form-control>
                    <textarea nz-input rows="3" placeholder="補充說明／適用範圍"></textarea>
                  </nz-form-control>
                </nz-form-item>

                <nz-form-item>
                  <nz-form-label>責任群組</nz-form-label>
                  <nz-form-control>
                    <nz-select nzMode="multiple" nzPlaceHolder="選擇群組">
                      <nz-option nzValue="owner" nzLabel="Owner Guild"></nz-option>
                      <nz-option nzValue="reviewer" nzLabel="Reviewer Squad"></nz-option>
                      <nz-option nzValue="ops" nzLabel="Ops Support"></nz-option>
                    </nz-select>
                  </nz-form-control>
                </nz-form-item>

                <div class="actions">
                  <button nz-button nzType="default">草稿</button>
                  <button nz-button nzType="primary">儲存 {{ tab.title }}</button>
                </div>
              </form>
            </nz-tab>
          }
        </nz-tabset>
      </nz-card>

      <nz-card nzTitle="預設審核人" class="section-card">
        <nz-list [nzDataSource]="reviewers" nzItemLayout="horizontal">
          <ng-template #renderItem let-item>
            <nz-list-item>
              <nz-list-item-meta
                nzAvatar="https://gw.alipayobjects.com/zos/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                [nzTitle]="item.name"
                [nzDescription]="item.role"
              ></nz-list-item-meta>
              <div class="availability">
                <span nz-typography>{{ item.availability }}</span>
                <button nz-button nzType="link">調整</button>
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
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .tab-description {
        color: rgba(0, 0, 0, 0.55);
        margin-bottom: 16px;
      }

      .settings-form {
        max-width: 520px;
      }

      .actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .availability {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlueprintSettingsShellComponent {
  protected readonly settingTabs: SettingTab[] = [
    { key: 'metadata', title: '基本資訊', description: '維護藍圖名稱、說明與主要負責人。' },
    { key: 'permissions', title: '權限策略', description: '設定可訪問與提交變更的成員群組。' },
    { key: 'automation', title: '自動化任務', description: '定義分支同步、審核提醒與合併策略。' }
  ];

  protected readonly reviewers: Reviewer[] = [
    { name: 'Evelyn', role: '流程審核', availability: '每日 10:00 - 18:00' },
    { name: 'Howard', role: '主分支維運', availability: '專案期間全時段' },
    { name: 'Lucas', role: 'DevOps', availability: '需提前預約' }
  ];
}
