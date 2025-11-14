# @delon/theme - 主題系統

> **包分類**：主題系統 (Theme System)  
> **版本**：^20.1.0  
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/theme` |
| **官方文檔** | [@delon/theme](https://ng-alain.com/theme) |
| **GitHub** | [ng-alain/delon](https://github.com/ng-alain/delon) |
| **主要用途** | 提供主題系統，包括佈局、樣式、國際化等功能 |

## 安裝

```bash
yarn add @delon/theme
```

## 使用方式

### 導入模組

```typescript
// 默認佈局
import { LayoutDefaultModule } from '@delon/theme/layout-default';
// 設置抽屜
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
// 主題切換按鈕
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
// 管道
import { DatePipe as DelonDatePipe, I18nPipe } from '@delon/theme';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    LayoutDefaultModule,
    SettingDrawerModule,
    ThemeBtnComponent,
    DelonDatePipe,
    I18nPipe,
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
  imports: [SHARED_IMPORTS], // 包含 @delon/theme 組件和管道
  // ...
})
export class ExampleComponent {}
```

## 主要功能

### 1. LayoutDefault - 默認佈局

**導入**：`import { LayoutDefaultModule } from '@delon/theme/layout-default';`  
**文檔**：https://ng-alain.com/theme/layout-default

提供默認的後台管理佈局，包含頂部導航、側邊欄、內容區等。

```html
<layout-default>
  <layout-default-header></layout-default-header>
  <layout-default-sidebar></layout-default-sidebar>
  <layout-default-content>
    <router-outlet></router-outlet>
  </layout-default-content>
</layout-default>
```

### 2. SettingDrawer - 設置抽屜

**導入**：`import { SettingDrawerModule } from '@delon/theme/setting-drawer';`  
**文檔**：https://ng-alain.com/theme/setting-drawer

提供設置抽屜組件，用於主題配置。

```html
<setting-drawer></setting-drawer>
```

### 3. ThemeBtnComponent - 主題切換按鈕

**導入**：`import { ThemeBtnComponent } from '@delon/theme/theme-btn';`  
**文檔**：https://ng-alain.com/theme/theme-btn

主題切換按鈕組件。

```html
<theme-btn></theme-btn>
```

### 4. I18nPipe - 國際化管道

**導入**：`import { I18nPipe } from '@delon/theme';`  
**文檔**：https://ng-alain.com/theme

國際化翻譯管道。

```html
{{ 'app.title' | i18n }}
```

### 5. DatePipe - 日期管道

**導入**：`import { DatePipe as DelonDatePipe } from '@delon/theme';`  
**文檔**：https://ng-alain.com/theme

**注意**：@delon/theme 的 DatePipe 在模板中使用 `_date` pipe，Angular Common 的 DatePipe 使用 `date` pipe。

```html
{{ dateValue | _date: 'yyyy-MM-dd' }}
```

## 配置

### 主題配置

在 `app.config.ts` 中配置主題：

```typescript
import { provideDelonTheme } from '@delon/theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideDelonTheme({
      http: {
        method: 'GET',
        url: '/assets/app-data.json',
      },
    }),
    // ...
  ],
};
```

### 國際化配置

```typescript
import { provideDelonI18n } from '@delon/theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideDelonI18n({
      defaultLang: 'zh-CN',
      langs: [
        { code: 'zh-CN', text: '中文' },
        { code: 'en-US', text: 'English' },
      ],
    }),
    // ...
  ],
};
```

## 主題定制

### 顏色定制

在 `src/assets/color.less` 中定義主題顏色：

```less
@primary-color: #1890ff;
@success-color: #52c41a;
@warning-color: #faad14;
@error-color: #f5222d;
```

### 樣式定制

在 `src/styles/theme.less` 中定制主題樣式。

## 基本用法示例

### 使用佈局

```typescript
import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { LayoutDefaultModule } from '@delon/theme/layout-default';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SHARED_IMPORTS, LayoutDefaultModule],
  template: `
    <layout-default>
      <layout-default-header></layout-default-header>
      <layout-default-sidebar></layout-default-sidebar>
      <layout-default-content>
        <router-outlet></router-outlet>
      </layout-default-content>
    </layout-default>
  `,
})
export class LayoutComponent {}
```

### 使用國際化

```html
<!-- 模板中使用 -->
<h1>{{ 'app.title' | i18n }}</h1>
<p>{{ 'app.description' | i18n }}</p>
```

```typescript
// 組件中使用
import { inject } from '@angular/core';
import { I18nService } from '@delon/theme';

export class ExampleComponent {
  private i18n = inject(I18nService);

  getTitle() {
    return this.i18n.fanyi('app.title');
  }

  changeLang(lang: string) {
    this.i18n.use(lang);
  }
}
```

### 使用日期管道

```html
<!-- @delon/theme 的 DatePipe -->
{{ dateValue | _date: 'yyyy-MM-dd HH:mm:ss' }}

<!-- Angular Common 的 DatePipe -->
{{ dateValue | date: 'yyyy-MM-dd HH:mm:ss' }}
```

## 項目中的使用

在 `src/app/shared/shared-delon.module.ts` 中已導入 @delon/theme 組件和管道，並通過 `SHARED_IMPORTS` 提供給所有組件使用。

## 相關資源

- [官方文檔](https://ng-alain.com/theme)
- [GitHub 倉庫](https://github.com/ng-alain/delon)
- [返回索引](./README.md)

