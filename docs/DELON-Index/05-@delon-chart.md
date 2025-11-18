# @delon/chart - 圖表組件

> **包分類**：圖表組件 (Chart Components)  
> **版本**：^20.1.0  
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/chart` |
| **官方文檔** | [@delon/chart](https://ng-alain.com/docs/chart) |
| **GitHub** | [ng-alain/delon](https://github.com/ng-alain/delon) |
| **主要用途** | 提供圖表組件，基於 G2 和 ECharts 構建 |

## 安裝

```bash
yarn add @delon/chart
```

## 使用方式

### 導入模組

**注意**：@delon/chart 必須從子模組導入，而非從 `@delon/chart` 直接導入。

```typescript
// 柱狀圖
import { G2BarModule } from '@delon/chart/bar';
// 餅圖
import { G2PieModule } from '@delon/chart/pie';
// 迷你面積圖
import { G2MiniAreaModule } from '@delon/chart/mini-area';
// 迷你柱狀圖
import { G2MiniBarModule } from '@delon/chart/mini-bar';
// ECharts 圖表
import { ChartEChartsModule } from '@delon/chart/chart-echarts';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    G2BarModule,
    G2PieModule,
    // ... 其他需要的模組
  ],
  // ...
})
export class ExampleComponent {}
```

### 或使用 SHARED_IMPORTS

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS], // 包含所有 @delon/chart 組件
  // ...
})
export class ExampleComponent {}
```

## 主要組件

### 1. G2Bar - 柱狀圖

**導入**：`import { G2BarModule } from '@delon/chart/bar';`  
**文檔**：https://ng-alain.com/chart/bar

```html
<g2-bar [data]="barData" [height]="300"></g2-bar>
```

### 2. G2Pie - 餅圖

**導入**：`import { G2PieModule } from '@delon/chart/pie';`  
**文檔**：https://ng-alain.com/chart/pie

```html
<g2-pie [data]="pieData" [height]="300"></g2-pie>
```

### 3. G2MiniArea - 迷你面積圖

**導入**：`import { G2MiniAreaModule } from '@delon/chart/mini-area';`  
**文檔**：https://ng-alain.com/chart/mini-area

```html
<g2-mini-area [data]="areaData" [height]="45"></g2-mini-area>
```

### 4. G2MiniBar - 迷你柱狀圖

**導入**：`import { G2MiniBarModule } from '@delon/chart/mini-bar';`  
**文檔**：https://ng-alain.com/chart/mini-bar

```html
<g2-mini-bar [data]="barData" [height]="45"></g2-mini-bar>
```

### 5. G2MiniProgress - 迷你進度條

**導入**：`import { G2MiniProgressModule } from '@delon/chart/mini-progress';`  
**文檔**：https://ng-alain.com/chart/mini-progress

```html
<g2-mini-progress [percent]="75" [height]="8"></g2-mini-progress>
```

### 6. G2Gauge - 儀表盤

**導入**：`import { G2GaugeModule } from '@delon/chart/gauge';`  
**文檔**：https://ng-alain.com/chart/gauge

```html
<g2-gauge [percent]="75" [height]="200"></g2-gauge>
```

### 7. G2Radar - 雷達圖

**導入**：`import { G2RadarModule } from '@delon/chart/radar';`  
**文檔**：https://ng-alain.com/chart/radar

```html
<g2-radar [data]="radarData" [height]="300"></g2-radar>
```

### 8. G2TagCloud - 標籤雲

**導入**：`import { G2TagCloudModule } from '@delon/chart/tag-cloud';`  
**文檔**：https://ng-alain.com/chart/tag-cloud

```html
<g2-tag-cloud [data]="tagData" [height]="300"></g2-tag-cloud>
```

### 9. G2Timeline - 時間軸

**導入**：`import { G2TimelineModule } from '@delon/chart/timeline';`  
**文檔**：https://ng-alain.com/chart/timeline

```html
<g2-timeline [data]="timelineData" [height]="300"></g2-timeline>
```

### 10. G2WaterWave - 水波圖

**導入**：`import { G2WaterWaveModule } from '@delon/chart/water-wave';`  
**文檔**：https://ng-alain.com/chart/water-wave

```html
<g2-water-wave [percent]="75" [height]="200"></g2-water-wave>
```

### 11. G2SingleBar - 單一柱狀圖

**導入**：`import { G2SingleBarModule } from '@delon/chart/single-bar';`  
**文檔**：https://ng-alain.com/chart/single-bar

```html
<g2-single-bar [data]="barData" [height]="300"></g2-single-bar>
```

### 12. G2Card - 圖表卡片

**導入**：`import { G2CardModule } from '@delon/chart/card';`  
**文檔**：https://ng-alain.com/chart/card

```html
<g2-card [title]="'圖表標題'" [total]="'總計'">
  <g2-mini-area [data]="areaData"></g2-mini-area>
</g2-card>
```

### 13. NumberInfo - 數據文本

**導入**：`import { NumberInfoModule } from '@delon/chart/number-info';`  
**文檔**：https://ng-alain.com/chart/number-info

```html
<number-info [title]="'總銷售額'" [total]="12345" [subTotal]="1234"></number-info>
```

### 14. Trend - 趨勢標記

**導入**：`import { TrendModule } from '@delon/chart/trend';`  
**文檔**：https://ng-alain.com/chart/trend

```html
<trend [flag]="'up'" [value]="12.5"></trend>
```

### 15. ChartECharts - ECharts 圖表

**導入**：`import { ChartEChartsModule } from '@delon/chart/chart-echarts';`  
**文檔**：https://ng-alain.com/chart/chart-echarts

```html
<chart-echarts [option]="echartsOption" [height]="400"></chart-echarts>
```

## 基本用法示例

```typescript
import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-row [nzGutter]="16">
      <nz-col [nzSpan]="12">
        <g2-bar [data]="barData" [height]="300"></g2-bar>
      </nz-col>
      <nz-col [nzSpan]="12">
        <g2-pie [data]="pieData" [height]="300"></g2-pie>
      </nz-col>
    </nz-row>
  `,
})
export class DashboardComponent {
  barData = [
    { x: 'Jan', y: 100 },
    { x: 'Feb', y: 200 },
    { x: 'Mar', y: 150 },
  ];

  pieData = [
    { x: '類型A', y: 27 },
    { x: '類型B', y: 25 },
    { x: '類型C', y: 18 },
  ];
}
```

## 項目中的使用

在 `src/app/shared/shared-delon.module.ts` 中已統一導入所有 @delon/chart 組件，並通過 `SHARED_IMPORTS` 提供給所有組件使用。

## 相關資源

- [官方文檔](https://ng-alain.com/docs/chart)
- [GitHub 倉庫](https://github.com/ng-alain/delon)
- [返回索引](./README.md)

