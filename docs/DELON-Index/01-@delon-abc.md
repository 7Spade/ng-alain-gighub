# @delon/abc - 業務組件庫

> **包分類**：業務組件庫 (Business Components)  
> **版本**：^20.1.0  
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/abc` |
| **官方文檔** | [@delon/abc](https://ng-alain.com/components) |
| **GitHub** | [ng-alain/delon](https://github.com/ng-alain/delon) |
| **主要用途** | 提供業務組件庫，包含 ST 表格、SV 鍵值描述、SE 表單佈局等常用組件 |

## 安裝

```bash
yarn add @delon/abc
```

## 使用方式

### 導入模組

```typescript
// 單個組件導入
import { STModule } from '@delon/abc/st';
import { SVModule } from '@delon/abc/sv';
import { SEModule } from '@delon/abc/se';
import { PageHeaderModule } from '@delon/abc/page-header';
import { EllipsisComponent } from '@delon/abc/ellipsis';
import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
import { FullContentModule } from '@delon/abc/full-content';
import { ReuseTabModule } from '@delon/abc/reuse-tab';
import { TagSelectComponent } from '@delon/abc/tag-select';
import { OnboardingModule } from '@delon/abc/onboarding';
import { QuickMenuModule } from '@delon/abc/quick-menu';
import { CountDownModule } from '@delon/abc/count-down';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { ExceptionModule } from '@delon/abc/exception';
import { NoticeIconModule } from '@delon/abc/notice-icon';
import { DownFileDirective } from '@delon/abc/down-file';
import { CellModule } from '@delon/abc/cell';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    STModule,
    SVModule,
    SEModule,
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
  imports: [SHARED_IMPORTS], // 包含所有 @delon/abc 組件
  // ...
})
export class ExampleComponent {}
```

## 主要組件

### 1. ST (Smart Table) - 智能表格

**導入**：`import { STModule } from '@delon/abc/st';`  
**文檔**：https://ng-alain.com/components/st

功能強大的數據表格組件，支持排序、篩選、分頁等功能。

```html
<st [data]="users" [columns]="columns"></st>
```

### 2. SV (Simple View) - 鍵值描述視圖

**導入**：`import { SVModule } from '@delon/abc/sv';`  
**文檔**：https://ng-alain.com/components/sv

用於鍵值對形式的數據展示。

```html
<sv [col]="2" [data]="data"></sv>
```

### 3. SE (Simple Edit) - 表單佈局

**導入**：`import { SEModule } from '@delon/abc/se';`  
**文檔**：https://ng-alain.com/components/se

簡潔的表單佈局組件，快速排版表單項。

```html
<se [col]="2" [gutter]="32">
  <se-item label="用戶名">
    <input nz-input [(ngModel)]="username" />
  </se-item>
</se>
```

### 4. PageHeader - 頁面標題

**導入**：`import { PageHeaderModule } from '@delon/abc/page-header';`  
**文檔**：https://ng-alain.com/components/page-header

頁面標題區，包含麵包屑和操作區。

```html
<page-header [title]="'頁面標題'" [breadcrumb]="breadcrumb"></page-header>
```

### 5. Ellipsis - 文本省略

**導入**：`import { EllipsisComponent } from '@delon/abc/ellipsis';`  
**文檔**：https://ng-alain.com/components/ellipsis

文本超出省略顯示組件。

```html
<ellipsis [tooltip]="true" [length]="50">{{ text }}</ellipsis>
```

### 6. FooterToolbar - 底部工具欄

**導入**：`import { FooterToolbarModule } from '@delon/abc/footer-toolbar';`  
**文檔**：https://ng-alain.com/components/footer-toolbar

頁面底部操作工具欄。

```html
<footer-toolbar>
  <button nz-button>取消</button>
  <button nz-button nzType="primary">確定</button>
</footer-toolbar>
```

### 7. FullContent - 全屏內容

**導入**：`import { FullContentModule } from '@delon/abc/full-content';`  
**文檔**：https://ng-alain.com/components/full-content

內容區全屏/填充切換。

```html
<full-content [fullscreen]="fullscreen"></full-content>
```

### 8. ReuseTab - 標籤頁（路由快取）

**導入**：`import { ReuseTabModule } from '@delon/abc/reuse-tab';`  
**文檔**：https://ng-alain.com/components/reuse-tab

標籤頁組件，支持路由快取。

### 9. TagSelect - 標籤選擇

**導入**：`import { TagSelectComponent } from '@delon/abc/tag-select';`  
**文檔**：https://ng-alain.com/components/tag-select

Tag 多選與展開/收起選擇器。

```html
<tag-select [(ngModel)]="selectedTags" [expandable]="true"></tag-select>
```

### 10. Onboarding - 引導式操作

**導入**：`import { OnboardingModule } from '@delon/abc/onboarding';`  
**文檔**：https://ng-alain.com/components/onboarding

引導式操作組件。

### 11. QuickMenu - 快捷菜單

**導入**：`import { QuickMenuModule } from '@delon/abc/quick-menu';`  
**文檔**：https://ng-alain.com/components/quick-menu

快捷菜單組件。

### 12. CountDown - 倒計時

**導入**：`import { CountDownModule } from '@delon/abc/count-down';`  
**文檔**：https://ng-alain.com/components/count-down

倒計時組件。

```html
<count-down [target]="targetTime" (end)="onEnd()"></count-down>
```

### 13. GlobalFooter - 全局頁腳

**導入**：`import { GlobalFooterModule } from '@delon/abc/global-footer';`  
**文檔**：https://ng-alain.com/components/global-footer

全局頁腳組件。

### 14. Exception - 異常頁面

**導入**：`import { ExceptionModule } from '@delon/abc/exception';`  
**文檔**：https://ng-alain.com/components/exception

異常頁面組件（404、403、500 等）。

```html
<exception type="404" [backRouterLink]="['/']"></exception>
```

### 15. NoticeIcon - 通知圖標

**導入**：`import { NoticeIconModule } from '@delon/abc/notice-icon';`  
**文檔**：https://ng-alain.com/components/notice-icon

通知圖標組件。

### 16. DownFile - 下載文件指令

**導入**：`import { DownFileDirective } from '@delon/abc/down-file';`  
**文檔**：https://ng-alain.com/components/down-file

下載文件指令。

```html
<button nz-button [down-file]="fileUrl">下載</button>
```

### 17. Cell - 單元格渲染

**導入**：`import { CellModule } from '@delon/abc/cell';`  
**文檔**：https://ng-alain.com/components/cell/zh

單元格渲染組件。

## 項目中的使用

在 `src/app/shared/shared-delon.module.ts` 中已統一導入所有 @delon/abc 組件，並通過 `SHARED_IMPORTS` 提供給所有組件使用。

## 相關資源

- [官方文檔](https://ng-alain.com/components)
- [GitHub 倉庫](https://github.com/ng-alain/delon)
- [返回索引](./README.md)

