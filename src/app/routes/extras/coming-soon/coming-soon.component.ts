import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UnderDevelopmentComponent } from '@shared';

/**
 * Coming Soon Example Page
 *
 * 示範如何在未完成的路由中使用 UnderDevelopmentComponent
 * 這是一個實際應用案例，展示如何快速標記開發中的功能
 */
@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [UnderDevelopmentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-under-development
      [title]="'高級報表分析'"
      [description]="'我們正在開發全新的報表分析功能，將為您提供更強大的數據洞察能力'"
      [variant]="'detailed'"
      [icon]="'bar-chart'"
      [iconTheme]="'outline'"
      [progressPercent]="75"
      [features]="features"
      [estimatedCompletion]="'預計 2025 年 3 月上線'"
      [contactEmail]="'product@example.com'"
      [showFeedback]="true"
    />
  `
})
export class ComingSoonComponent {
  features = [
    '多維度數據透視 - 支援自定義維度和指標分析',
    '智能圖表推薦 - AI 自動推薦最適合的可視化方式',
    '實時數據更新 - 支援 WebSocket 實時數據推送',
    '報表排程功能 - 自動生成並發送定期報表',
    '協作分享機制 - 團隊成員可共同編輯和查看報表',
    '移動端優化 - 完整的響應式設計支援'
  ];
}
