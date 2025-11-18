# Src 目錄開發指南

> 🤖 **AI Agent 提醒**: 每次開發都要清除冗餘並更新 memory.json（含去重）

## 📋 職責範圍

`src` 是應用程式源碼根目錄，包含所有 Angular 應用程式碼。

### 核心目錄
- `app/` - [應用程式根目錄](./app/AGENTS.md)
- `assets/` - 靜態資源
- `environments/` - 環境配置
- `styles/` - 全域樣式

> 📖 **通用規範**參見 [根目錄 AGENTS.md](../../AGENTS.md)

## 🎯 共享模組優先使用

### ⚠️ **強制要求：優先使用共享模組配置**

所有 UI 層組件**必須**優先使用以下共享模組配置，避免零碎引入：

#### 1. `SHARED_IMPORTS` - 統一導入配置 ⭐ **最高優先級**

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS] // ✅ 優先使用
})
export class MyComponent {}
```

**包含內容**：
- ✅ Angular 表單模組（`FormsModule`、`ReactiveFormsModule`）
- ✅ Angular 路由（`RouterLink`、`RouterOutlet`）
- ✅ Angular Common 管道（`DatePipe`、`CurrencyPipe`、`AsyncPipe` 等）
- ✅ @delon/theme 管道（`I18nPipe`、`DelonDatePipe`）
- ✅ @delon 組件集合（`STModule`、`SVModule`、`DelonFormModule` 等）
- ✅ ng-zorro-antd 組件集合（所有 Nz 模組）

#### 2. `SHARED_ZORRO_MODULES` - ng-zorro-antd 組件集合

```typescript
import { SHARED_ZORRO_MODULES } from '@shared/shared-zorro.module';

@Component({
  standalone: true,
  imports: [SHARED_ZORRO_MODULES] // ✅ 如需完整 zorro 組件
})
export class MyComponent {}
```

**包含內容**：
- ✅ 反饋類組件（`NzAlertModule`、`NzModalModule`、`NzDrawerModule` 等）
- ✅ 數據展示類組件（`NzTableModule`、`NzCardModule`、`NzListModule` 等）
- ✅ 數據錄入類組件（`NzFormModule`、`NzInputModule`、`NzSelectModule` 等）
- ✅ 布局類組件（`NzLayoutModule`、`NzGridModule`、`NzFlexModule` 等）
- ✅ 導航類組件（`NzMenuModule`、`NzTabsModule`、`NzBreadCrumbModule` 等）
- ✅ 所有 ng-zorro-antd 組件模組

#### 3. `SHARED_DELON_MODULES` - @delon 組件集合

```typescript
import { SHARED_DELON_MODULES } from '@shared/shared-delon.module';

@Component({
  standalone: true,
  imports: [SHARED_DELON_MODULES] // ✅ 如需完整 delon 組件
})
export class MyComponent {}
```

**包含內容**：
- ✅ 智能表格（`STModule`）
- ✅ 鍵值描述視圖（`SVModule`）
- ✅ 表單佈局（`SEModule`）
- ✅ 動態表單（`DelonFormModule`）
- ✅ 圖表組件（`G2BarModule`、`G2PieModule`、`ChartEChartsModule` 等）
- ✅ 所有 @delon 組件模組

### 📝 使用範例

#### ✅ **正確做法：使用 SHARED_IMPORTS**

```typescript
import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  selector: 'app-example',
  imports: [SHARED_IMPORTS], // ✅ 一次導入所有常用模組
  template: `
    <nz-card>
      <nz-form>
        <input nz-input [(ngModel)]="value" />
        <button nz-button nzType="primary">提交</button>
      </nz-form>
    </nz-card>
  `
})
export class ExampleComponent {
  value = '';
}
```

#### ❌ **錯誤做法：零碎引入模組**

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
// ❌ 不要零碎引入，應該使用 SHARED_IMPORTS

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzCardModule,
    NzFormModule
  ] // ❌ 違反規範
})
export class ExampleComponent {}
```

## 🚫 絕對禁止事項（零容忍）

### 1. ❌ **嚴禁重複造輪（Reinventing the Wheel）**

- ❌ **嚴禁**重新實作現有功能或工具，除非有明確的技術理由
- ❌ **嚴禁**無視專案內既有的服務、工具、組件或公共模組
- ❌ **嚴禁**建立功能重複的檔案或模組
- ✅ **必須**在實作前先搜尋專案內是否有現成解決方案
- ✅ **必須**優先重構或擴展現有功能，而非從零建立
- ✅ **必須**查閱 `SHARED_IMPORTS` 與公共模組，優先使用既有工具

**違規範例**：
```typescript
// ❌ 錯誤：重新實作日期格式化功能
export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

// ✅ 正確：使用 Angular DatePipe 或 @delon/theme DatePipe
import { DatePipe } from '@angular/common';
// 或使用 SHARED_IMPORTS 中的 DelonDatePipe
```

### 2. ❌ **嚴禁「權宜式/懶惰式」修改（Workaround/Hack）**

- ❌ **嚴禁**使用臨時 workaround、quick fix、hack 等權宜式解法
- ❌ **嚴禁**為了快速解決問題而犧牲程式碼品質與架構一致性
- ❌ **嚴禁**延後處理技術債務或將其標記為「TODO: refactor later」
- ✅ **必須**採用結構化解法，完整思考問題根源
- ✅ **必須**提供可持續、可維護的解決方案
- ✅ **必須**在實作前分析影響範圍與相依關係

**違規範例**：
```typescript
// ❌ 錯誤：使用權宜式解法
@Component({
  selector: 'app-bad',
  template: `<div>{{ value }}</div>`
})
export class BadComponent {
  value: any; // ❌ 使用 any 類型，缺乏類型安全
  // TODO: refactor later // ❌ 延後處理技術債務
}

// ✅ 正確：結構化解法
@Component({
  selector: 'app-good',
  template: `<div>{{ value() }}</div>`
})
export class GoodComponent {
  readonly value = signal<string>(''); // ✅ 使用 Signal 與明確類型
}
```

## 🛡️ 強制規範

### 模組導入優先級

1. ⭐ **最高優先級**：`SHARED_IMPORTS` - 適用於所有 UI 層組件
2. **次優先級**：`SHARED_ZORRO_MODULES` - 僅需 ng-zorro-antd 組件時
3. **次優先級**：`SHARED_DELON_MODULES` - 僅需 @delon 組件時
4. **最後選擇**：個別模組導入 - 僅在 `SHARED_IMPORTS` 確實無法滿足需求時

### 檢查清單

在建立新組件前，**必須**檢查：

- [ ] 是否已使用 `SHARED_IMPORTS` 而非零碎引入？
- [ ] 是否搜尋過專案內是否有現成解決方案？
- [ ] 是否避免重新實作現有功能？
- [ ] 是否採用結構化解法而非權宜式修改？
- [ ] 是否使用明確類型而非 `any`？
- [ ] 是否避免使用 `TODO: refactor later`？

## ✅ 工作準則

### Do

- ✅ **優先使用** `SHARED_IMPORTS` 統一導入模組
- ✅ **先搜尋**專案內是否有現成解決方案
- ✅ **優先重構**或擴展現有功能
- ✅ **採用結構化**解法，完整思考問題
- ✅ **提供可持續**、可維護的解決方案
- ✅ **分析影響範圍**與相依關係

### Don't

- ❌ **不零碎引入**模組，優先使用 `SHARED_IMPORTS`
- ❌ **不重複造輪**，不使用現成功能重新實作
- ❌ **不權宜式修改**，不犧牲程式碼品質
- ❌ **不延後處理**技術債務或標記 TODO
- ❌ **不使用 `any`** 類型，缺乏類型安全
- ❌ **不無視**專案內既有服務、工具、組件

## 📚 相關文檔

- [App 目錄 AGENTS.md](./app/AGENTS.md)
- [Shared 模組 AGENTS.md](./app/shared/AGENTS.md)
- [專案根目錄 AGENTS.md](../../AGENTS.md)

---

*最後更新: 2025-01-27*

