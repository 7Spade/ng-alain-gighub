# UnderDevelopment Component

> 企業級「開發中」頁面組件 - 專業、可配置、響應式

## 📋 概述

`UnderDevelopmentComponent` 是一個高品質、企業級的「功能開發中」頁面組件，用於優雅地展示尚未完成的功能頁面。遵循 ng-alain 設計規範，提供三種展示變體，滿足不同場景需求。

## ✨ 特性

- ✅ **三種展示變體**：minimal、standard、detailed
- ✅ **企業級標準**：遵循 Angular 20 + ng-zorro-antd 最佳實踐
- ✅ **完全可配置**：支援自定義圖標、標題、描述、功能列表等
- ✅ **響應式設計**：完美適配桌面端和移動端
- ✅ **動畫效果**：流暢的動畫和過渡效果
- ✅ **OnPush 策略**：高性能變更檢測
- ✅ **Standalone 組件**：現代 Angular 架構
- ✅ **Signal 狀態管理**：使用最新的 Angular Signals API

## 📦 安裝

組件已整合在 `@shared` 模組中，可直接使用：

```typescript
import { UnderDevelopmentComponent } from '@shared';
```

## 🚀 快速開始

### 最小化使用

```typescript
import { Component } from '@angular/core';
import { UnderDevelopmentComponent } from '@shared';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [UnderDevelopmentComponent],
  template: `<app-under-development />`
})
export class MyPageComponent {}
```

### 標準使用（推薦）

```typescript
@Component({
  template: `
    <app-under-development
      [title]="'任務管理系統'"
      [description]="'我們正在開發全新的任務管理系統'"
      [variant]="'standard'"
      [icon]="'project'"
      [progressPercent]="45"
    />
  `
})
export class TaskManagementPage {}
```

### 詳細展示（功能預告）

```typescript
@Component({
  template: `
    <app-under-development
      [title]="'藍圖協作系統'"
      [description]="'全新的 Git-like 分支協作模型即將上線'"
      [variant]="'detailed'"
      [icon]="'branches'"
      [iconTheme]="'twotone'"
      [progressPercent]="65"
      [features]="features"
      [estimatedCompletion]="'預計 2025 年 Q2 上線'"
      [contactEmail]="'support@example.com'"
      [showFeedback]="true"
    />
  `
})
export class BlueprintCollaborationPage {
  features = [
    '分支管理與合併',
    'Pull Request 審查流程',
    '權限分離機制',
    '即時數據同步',
    '活動記錄追蹤'
  ];
}
```

## 🎨 API 文檔

### Input Properties

| 屬性 | 類型 | 預設值 | 說明 |
|-----|------|--------|-----|
| `title` | `string` | `''` | 頁面標題，空白時顯示「功能開發中」 |
| `description` | `string` | `''` | 描述文字，空白時顯示預設描述 |
| `icon` | `string` | `'build'` | ng-zorro 圖標類型 |
| `iconTheme` | `'fill' \| 'outline' \| 'twotone'` | `'outline'` | 圖標主題風格 |
| `variant` | `'minimal' \| 'standard' \| 'detailed'` | `'standard'` | 展示變體 |
| `progressPercent` | `number` | `35` | 開發進度百分比（0-100） |
| `features` | `string[]` | `[]` | 功能列表（僅 detailed 變體顯示） |
| `estimatedCompletion` | `string` | `''` | 預計完成時間（僅 detailed 變體顯示） |
| `contactEmail` | `string` | `''` | 聯繫郵箱（僅 detailed 變體顯示） |
| `showFeedback` | `boolean` | `false` | 是否顯示反饋按鈕（僅 detailed 變體） |
| `showBackButton` | `boolean` | `true` | 是否顯示返回按鈕 |

### 展示變體說明

#### 1. Minimal（最小化）
- 適用場景：快速標記、簡單通知
- 包含內容：圖標、標題、描述
- 特點：極簡設計，快速加載

```html
<app-under-development
  [variant]="'minimal'"
  [title]="'功能開發中'"
  [description]="'敬請期待'"
/>
```

#### 2. Standard（標準）⭐ 推薦
- 適用場景：一般功能頁面、常規使用
- 包含內容：圖標、標題、描述、進度條
- 特點：平衡美觀與信息量

```html
<app-under-development
  [variant]="'standard'"
  [title]="'數據分析'"
  [description]="'全新的分析功能正在開發中'"
  [progressPercent]="60"
/>
```

#### 3. Detailed（詳細）
- 適用場景：重要功能預告、產品發布
- 包含內容：完整信息（功能列表、時間軸、聯繫方式）
- 特點：豐富的信息展示，提高期待感

```html
<app-under-development
  [variant]="'detailed'"
  [title]="'新功能發布'"
  [features]="['功能A', '功能B', '功能C']"
  [estimatedCompletion]="'2025 Q2'"
  [contactEmail]="'team@example.com'"
/>
```

## 🎯 使用場景

### 1. 未完成的路由頁面

```typescript
// routes/my-feature/routes.ts
export const routes: Routes = [
  {
    path: 'new-feature',
    component: UnderDevelopmentComponent,
    data: {
      title: '新功能',
      description: '功能開發中，敬請期待'
    }
  }
];
```

### 2. 功能開關（Feature Flag）

```typescript
@Component({
  template: `
    @if (featureEnabled()) {
      <app-actual-feature />
    } @else {
      <app-under-development
        [title]="'高級功能'"
        [description]="'此功能需要升級至企業版'"
      />
    }
  `
})
export class FeaturePage {
  featureEnabled = signal(false);
}
```

### 3. 階段性發布

```typescript
@Component({
  template: `
    <app-under-development
      [variant]="'detailed'"
      [title]="'藍圖 2.0'"
      [description]="'下一代藍圖系統即將推出'"
      [features]="nextGenFeatures"
      [estimatedCompletion]="'2025 年 Q3'"
      [progressPercent]="85"
    />
  `
})
export class BlueprintV2Page {
  nextGenFeatures = [
    'AI 輔助設計',
    '3D 可視化',
    '雲端協作'
  ];
}
```

## 🎨 自定義樣式

組件支援通過全域樣式覆蓋：

```less
// styles.less
app-under-development {
  .under-development-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .main-icon {
    color: #fff;
  }
}
```

## 📱 響應式設計

組件內建響應式支援：

- **桌面端（>768px）**：完整展示所有內容
- **移動端（≤768px）**：
  - 圖標大小調整（60px）
  - 標題文字縮小（24px）
  - 按鈕全寬顯示
  - 內容區域優化

## 🌐 國際化（i18n）

組件設計支援國際化，可通過 input 傳入不同語言文字：

```typescript
// 英文版本
<app-under-development
  [title]="'Feature in Development'"
  [description]="'This feature is actively being developed'"
/>

// 中文版本
<app-under-development
  [title]="'功能開發中'"
  [description]="'此功能正在積極開發中'"
/>
```

## 🔧 進階使用

### 動態配置

```typescript
@Component({
  template: `
    <app-under-development
      [title]="config.title"
      [description]="config.description"
      [variant]="config.variant"
      [icon]="config.icon"
      [progressPercent]="config.progress"
      [features]="config.features"
    />
  `
})
export class DynamicPage {
  config = signal({
    title: '動態功能',
    description: '根據配置動態顯示',
    variant: 'detailed' as const,
    icon: 'rocket',
    progress: 70,
    features: ['功能1', '功能2']
  });
}
```

### 與路由數據結合

```typescript
// routes.ts
{
  path: 'new-module',
  component: UnderDevelopmentWrapper,
  data: {
    underDevelopment: {
      title: '新模組',
      variant: 'standard',
      progress: 50
    }
  }
}

// component.ts
@Component({
  template: `
    <app-under-development
      [title]="routeData().title"
      [variant]="routeData().variant"
      [progressPercent]="routeData().progress"
    />
  `
})
export class UnderDevelopmentWrapper {
  private route = inject(ActivatedRoute);
  routeData = toSignal(
    this.route.data.pipe(map(d => d['underDevelopment']))
  );
}
```

## 📚 示例頁面

專案中提供了完整的示例頁面：

- **路由**：`/extras/under-development`
- **包含內容**：
  - 三種變體的實際展示
  - 互動式配置示例
  - 複製貼上用的程式碼範例

## 🤝 最佳實踐

1. **選擇合適的變體**：
   - 快速標記：使用 `minimal`
   - 一般頁面：使用 `standard`（推薦）
   - 重要功能：使用 `detailed`

2. **提供有用信息**：
   - 清楚說明功能用途
   - 給出合理的開發進度
   - 提供預計完成時間

3. **保持一致性**：
   - 整個應用使用統一的變體
   - 使用相同的描述風格
   - 統一的聯繫方式

4. **及時更新**：
   - 功能完成後移除組件
   - 定期更新開發進度
   - 修正預計完成時間

## 🐛 常見問題

### Q: 組件不顯示？
A: 確認已正確導入：
```typescript
import { UnderDevelopmentComponent } from '@shared';

@Component({
  imports: [UnderDevelopmentComponent]
})
```

### Q: 樣式異常？
A: 檢查是否正確導入 SHARED_IMPORTS 或組件本身

### Q: 如何修改預設文字？
A: 通過 input 屬性傳入自定義文字：
```html
<app-under-development
  [title]="'自定義標題'"
  [description]="'自定義描述'"
/>
```

## 📄 授權

MIT License - 可自由使用、修改和分發

## 🔗 相關資源

- [ng-alain 官方文檔](https://ng-alain.com/)
- [ng-zorro-antd 組件庫](https://ng.ant.design/)
- [Angular 官方文檔](https://angular.dev/)

## 📧 聯繫方式

如有問題或建議，請通過以下方式聯繫：
- GitHub Issues
- 郵件：support@example.com

---

**建立日期**：2025-11-15  
**維護者**：開發團隊  
**版本**：1.0.0
