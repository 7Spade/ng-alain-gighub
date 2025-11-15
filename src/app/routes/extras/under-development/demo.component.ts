import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SHARED_IMPORTS, UnderDevelopmentComponent } from '@shared';

/**
 * Under Development Demo Page
 *
 * 展示 UnderDevelopmentComponent 的各種使用方式
 */
@Component({
  selector: 'app-under-development-demo',
  standalone: true,
  imports: [SHARED_IMPORTS, UnderDevelopmentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'Under Development Component 示範'" [breadcrumb]="breadcrumb">
      <ng-template #breadcrumb>
        <nz-breadcrumb>
          <nz-breadcrumb-item>
            <a [routerLink]="['/']">首頁</a>
          </nz-breadcrumb-item>
          <nz-breadcrumb-item>
            <a [routerLink]="['/extras']">擴展功能</a>
          </nz-breadcrumb-item>
          <nz-breadcrumb-item>Under Development Demo</nz-breadcrumb-item>
        </nz-breadcrumb>
      </ng-template>
    </page-header>

    <div style="padding: 24px; background: #f0f2f5;">
      <nz-card nzTitle="使用說明" style="margin-bottom: 24px;">
        <p>
          <code>UnderDevelopmentComponent</code> 是一個企業級的「開發中」頁面組件，支援三種展示變體：
        </p>
        <ul>
          <li><strong>minimal</strong>: 最小化展示，僅顯示圖標、標題和描述</li>
          <li><strong>standard</strong>: 標準展示，包含進度條</li>
          <li><strong>detailed</strong>: 詳細展示，包含功能列表、時間軸和聯繫方式</li>
        </ul>
      </nz-card>

      <nz-tabset>
        <!-- Minimal Variant -->
        <nz-tab nzTitle="Minimal 變體">
          <app-under-development
            [title]="'簡單通知'"
            [description]="'此功能開發中，敬請期待'"
            [variant]="'minimal'"
            [showBackButton]="false"
          />
        </nz-tab>

        <!-- Standard Variant -->
        <nz-tab nzTitle="Standard 變體">
          <app-under-development
            [title]="'任務管理系統'"
            [description]="'我們正在開發全新的任務管理系統，將提供更強大的協作功能'"
            [variant]="'standard'"
            [icon]="'project'"
            [progressPercent]="45"
            [showBackButton]="false"
          />
        </nz-tab>

        <!-- Detailed Variant -->
        <nz-tab nzTitle="Detailed 變體">
          <app-under-development
            [title]="'藍圖協作系統'"
            [description]="'全新的 Git-like 分支協作模型即將上線，為您帶來更高效的團隊協作體驗'"
            [variant]="'detailed'"
            [icon]="'branches'"
            [iconTheme]="'twotone'"
            [progressPercent]="65"
            [features]="detailedFeatures"
            [estimatedCompletion]="'預計 2025 年 Q2 上線'"
            [contactEmail]="'support@example.com'"
            [showFeedback]="true"
            [showBackButton]="false"
          />
        </nz-tab>

        <!-- Custom Example -->
        <nz-tab nzTitle="自定義示例">
          <app-under-development
            [title]="'數據分析儀表板'"
            [description]="'我們正在打造全新的數據分析儀表板，提供更豐富的可視化圖表和實時數據監控'"
            [variant]="'detailed'"
            [icon]="'line-chart'"
            [iconTheme]="'outline'"
            [progressPercent]="80"
            [features]="customFeatures"
            [estimatedCompletion]="'即將完成，預計本季度內上線'"
            [contactEmail]="'analytics@example.com'"
            [showFeedback]="true"
            [showBackButton]="false"
          />
        </nz-tab>

        <!-- Code Examples -->
        <nz-tab nzTitle="程式碼示例">
          <nz-card nzTitle="使用範例">
            <nz-collapse>
              <nz-collapse-panel nzHeader="Minimal 示例">
                <pre><code>{{ minimalCode }}</code></pre>
              </nz-collapse-panel>
              <nz-collapse-panel nzHeader="Standard 示例">
                <pre><code>{{ standardCode }}</code></pre>
              </nz-collapse-panel>
              <nz-collapse-panel nzHeader="Detailed 示例">
                <pre><code>{{ detailedCode }}</code></pre>
              </nz-collapse-panel>
            </nz-collapse>
          </nz-card>
        </nz-tab>
      </nz-tabset>
    </div>
  `
})
export class UnderDevelopmentDemoComponent {
  detailedFeatures = [
    '分支管理與合併 - 類似 Git 的分支操作',
    'Pull Request 審查流程 - 完整的代碼審查機制',
    '權限分離機制 - 細粒度的權限控制',
    '即時數據同步 - WebSocket 實時通知',
    '活動記錄追蹤 - 完整的操作日誌'
  ];

  customFeatures = [
    '多維度數據分析 - 支援自定義維度和指標',
    '實時圖表更新 - 數據變化即時反映',
    '自定義儀表板 - 拖拽式配置界面',
    '數據導出功能 - 支援多種格式導出',
    '移動端適配 - 響應式設計'
  ];

  minimalCode = `<app-under-development
  [title]="'簡單通知'"
  [description]="'此功能開發中，敬請期待'"
  [variant]="'minimal'"
/>`;

  standardCode = `<app-under-development
  [title]="'任務管理系統'"
  [description]="'我們正在開發全新的任務管理系統'"
  [variant]="'standard'"
  [icon]="'project'"
  [progressPercent]="45"
/>`;

  detailedCode = `<app-under-development
  [title]="'藍圖協作系統'"
  [description]="'全新的 Git-like 分支協作模型即將上線'"
  [variant]="'detailed'"
  [icon]="'branches'"
  [iconTheme]="'twotone'"
  [progressPercent]="65"
  [features]="[
    '分支管理與合併',
    'Pull Request 審查流程',
    '權限分離機制'
  ]"
  [estimatedCompletion]="'預計 2025 年 Q2 上線'"
  [contactEmail]="'support@example.com'"
  [showFeedback]="true"
/>`;
}
