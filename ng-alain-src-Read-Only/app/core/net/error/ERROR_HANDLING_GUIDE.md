# 錯誤處理套件使用手冊

> 本文件說明如何使用 ng-alain 專案的統一錯誤狀態管理系統

## 📋 目錄

- [概述](#概述)
- [核心概念](#核心概念)
- [自動 HTTP 錯誤處理](#自動-http-錯誤處理)
- [手動添加錯誤](#手動添加錯誤)
- [在組件中使用](#在組件中使用)
- [顯示錯誤橫幅](#顯示錯誤橫幅)
- [錯誤查詢和過濾](#錯誤查詢和過濾)
- [錯誤重試](#錯誤重試)
- [錯誤清除](#錯誤清除)
- [最佳實踐](#最佳實踐)
- [完整示例](#完整示例)

---

## 概述

錯誤處理套件提供了一套完整的錯誤狀態管理系統，包括：

- ✅ **自動 HTTP 錯誤捕獲**：透過 HTTP 攔截器自動記錄所有 HTTP 錯誤
- ✅ **錯誤分類**：根據錯誤類型（HTTP、網路、驗證、業務、權限）和嚴重程度（critical、error、warning、info）分類
- ✅ **錯誤狀態管理**：使用 Angular Signals 實現響應式錯誤狀態管理
- ✅ **錯誤歷史記錄**：自動記錄所有錯誤歷史，方便追蹤和調試
- ✅ **錯誤重試機制**：支援對可重試的錯誤進行自動重試
- ✅ **UI 組件**：提供現成的錯誤橫幅組件，輕鬆顯示錯誤

---

## 核心概念

### ErrorRecord（錯誤記錄）

每個錯誤都是一個 `ErrorRecord` 物件，包含以下屬性：

```typescript
interface ErrorRecord {
  id: string;                    // 唯一錯誤 ID
  type: ErrorType;               // 錯誤類型
  severity: ErrorSeverity;       // 嚴重程度
  message: string;               // 錯誤訊息
  details?: string;              // 詳細資訊
  source?: string;               // 錯誤來源（組件/服務名稱）
  timestamp: Date;               // 發生時間
  url?: string;                  // 相關 URL（HTTP 錯誤）
  statusCode?: number;           // HTTP 狀態碼
  retryable: boolean;            // 是否可重試
  retryFn?: () => void;          // 重試函數
  metadata?: Record<string, any>; // 額外元數據
  cleared?: boolean;             // 是否已清除
}
```

### ErrorType（錯誤類型）

```typescript
type ErrorType =
  | 'http'        // HTTP 請求錯誤
  | 'network'     // 網路連線錯誤
  | 'validation'  // 表單驗證錯誤
  | 'business'    // 業務邏輯錯誤
  | 'permission'  // 權限錯誤
  | 'unknown';    // 未知錯誤
```

### ErrorSeverity（錯誤嚴重程度）

```typescript
type ErrorSeverity =
  | 'critical'  // 嚴重（需立即處理）
  | 'error'     // 錯誤（需處理）
  | 'warning'   // 警告（可忽略）
  | 'info';     // 資訊（僅提示）
```

---

## 自動 HTTP 錯誤處理

### 工作原理

系統已透過 `defaultInterceptor` 自動整合錯誤處理，所有 HTTP 錯誤會自動被記錄到 `ErrorStateService`。

**配置位置**：`src/app/core/net/default.interceptor.ts`

```typescript
// HTTP 錯誤會自動記錄到錯誤狀態管理
if (ev instanceof HttpErrorResponse) {
  const errorService = injector.get(ErrorStateService);
  const errorRecord = createErrorFromHttpResponse(ev, req);
  errorService.addError(errorRecord);
}
```

### 自動處理的錯誤類型

- ✅ HTTP 4xx 錯誤（客戶端錯誤）
- ✅ HTTP 5xx 錯誤（服務器錯誤）
- ✅ 網路連線錯誤
- ✅ 請求超時錯誤

### 無需額外配置

所有 HTTP 錯誤都會自動處理，無需在每個 HTTP 請求中手動添加錯誤處理邏輯。

---

## 手動添加錯誤

### 基本用法

在服務或組件中手動添加錯誤：

```typescript
import { inject } from '@angular/core';
import { ErrorStateService } from '@core/net';

export class MyService {
  private readonly errorService = inject(ErrorStateService);

  async performAction() {
    try {
      // 執行操作
      await someOperation();
    } catch (error) {
      // 手動添加錯誤
      this.errorService.addError({
        type: 'business',
        severity: 'error',
        message: '操作失敗',
        details: error.message,
        source: 'MyService',
        retryable: false
      });
    }
  }
}
```

### 帶重試功能的錯誤

```typescript
this.errorService.addError({
  type: 'network',
  severity: 'error',
  message: '網路連線失敗',
  details: '無法連接到服務器',
  source: 'DataService',
  retryable: true,
  retryFn: () => {
    // 重試邏輯
    this.loadData();
  }
});
```

### 驗證錯誤

```typescript
// 表單驗證錯誤
this.errorService.addError({
  type: 'validation',
  severity: 'warning',
  message: '表單驗證失敗',
  details: '請檢查輸入欄位',
  source: 'FormComponent',
  retryable: false
});
```

### 業務邏輯錯誤

```typescript
// 業務邏輯錯誤
this.errorService.addError({
  type: 'business',
  severity: 'error',
  message: '餘額不足',
  details: '您的帳戶餘額不足以完成此操作',
  source: 'PaymentService',
  retryable: false,
  metadata: {
    accountId: '123',
    amount: 1000,
    balance: 500
  }
});
```

---

## 在組件中使用

### 1. 注入 ErrorStateService

```typescript
import { Component, inject } from '@angular/core';
import { ErrorStateService } from '@core/net';

@Component({
  selector: 'app-my-component',
  standalone: true,
  template: `...`
})
export class MyComponent {
  private readonly errorService = inject(ErrorStateService);
}
```

### 2. 監聽錯誤狀態

```typescript
export class MyComponent {
  private readonly errorService = inject(ErrorStateService);

  // 當前活躍的錯誤（Signal）
  readonly errors = this.errorService.activeErrors;

  // 是否有錯誤（Signal）
  readonly hasErrors = this.errorService.hasErrors;

  // 錯誤數量（Signal）
  readonly errorCount = this.errorService.errorCount;

  // 嚴重錯誤（Signal）
  readonly criticalErrors = this.errorService.criticalErrors;
}
```

### 3. 在模板中使用

```html
@if (hasErrors()) {
  <div class="error-summary">
    <p>發現 {{ errorCount() }} 個錯誤</p>

    @for (error of criticalErrors(); track error.id) {
      <div class="critical-error">
        {{ error.message }}
      </div>
    }
  </div>
}
```

---

## 顯示錯誤橫幅

### 1. 在應用根組件中添加錯誤橫幅

**位置**：`src/app/app.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { ErrorStateService } from '@core/net';
import { ErrorBannerComponent } from '@shared/components/error-display';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ErrorBannerComponent, /* ...其他組件 */],
  template: `
    <app-error-banner
      [errors]="errorService.activeErrors()"
      (clear)="errorService.removeError($event)"
      (retry)="errorService.retryError($event)"
    />

    <!-- 其他應用內容 -->
    <router-outlet />
  `
})
export class AppComponent {
  readonly errorService = inject(ErrorStateService);
}
```

### 2. 自訂顯示數量

```html
<app-error-banner
  [errors]="errorService.activeErrors()"
  [maxDisplay]="5"
  (clear)="errorService.removeError($event)"
  (retry)="errorService.retryError($event)"
/>
```

### 3. 錯誤橫幅特性

- ✅ **自動排序**：按嚴重程度自動排序（critical > error > warning > info）
- ✅ **限制顯示數量**：預設顯示最多 3 個錯誤，可自訂
- ✅ **關閉按鈕**：每個錯誤都有關閉按鈕
- ✅ **重試按鈕**：可重試的錯誤會顯示重試按鈕
- ✅ **固定位置**：錯誤橫幅固定在頁面頂部（top: 64px）

---

## 錯誤查詢和過濾

### 1. 獲取所有活躍錯誤

```typescript
const errors = this.errorService.activeErrors();
```

### 2. 獲取特定錯誤

```typescript
const error = this.errorService.getError('error_1234567890_abc123');
if (error) {
  console.log('錯誤訊息:', error.message);
}
```

### 3. 過濾錯誤

```typescript
// 過濾特定類型的錯誤
const httpErrors = this.errorService.filterErrors(
  error => error.type === 'http'
);

// 過濾嚴重錯誤
const criticalErrors = this.errorService.filterErrors(
  error => error.severity === 'critical'
);

// 過濾特定來源的錯誤
const serviceErrors = this.errorService.filterErrors(
  error => error.source === 'MyService'
);
```

### 4. 錯誤歷史記錄

```typescript
// 獲取所有錯誤歷史（包含已清除的錯誤）
const history = this.errorService.errorHistory();

// 查看最近的錯誤
const recentErrors = history
  .slice(-10)
  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
```

---

## 錯誤重試

### 1. 自動重試（透過錯誤橫幅）

當錯誤的 `retryable` 為 `true` 且提供 `retryFn` 時，錯誤橫幅會自動顯示重試按鈕。

```typescript
this.errorService.addError({
  type: 'network',
  severity: 'error',
  message: '網路連線失敗',
  retryable: true,
  retryFn: () => {
    // 重新執行失敗的操作
    this.loadData();
  }
});
```

### 2. 手動重試

```typescript
// 透過錯誤 ID 重試
this.errorService.retryError('error_1234567890_abc123');
```

### 3. 重試後自動清除

重試成功後，錯誤會自動從活躍錯誤列表中移除。

---

## 錯誤清除

### 1. 清除單個錯誤

```typescript
this.errorService.removeError('error_1234567890_abc123');
```

### 2. 清除所有錯誤

```typescript
this.errorService.clearErrors();
```

### 3. 清除特定類型的錯誤

```typescript
// 清除所有 HTTP 錯誤
this.errorService.clearErrorsByType('http');

// 清除所有驗證錯誤
this.errorService.clearErrorsByType('validation');
```

### 4. 清除特定嚴重程度的錯誤

```typescript
// 清除所有警告
this.errorService.clearErrorsBySeverity('warning');

// 清除所有資訊提示
this.errorService.clearErrorsBySeverity('info');
```

### 5. 清除歷史記錄

```typescript
// 清除歷史記錄（但保留當前活躍的錯誤）
this.errorService.clearHistory();
```

---

## 最佳實踐

### 1. 錯誤分類原則

- **HTTP 錯誤**：網路請求相關的錯誤（自動處理）
- **網路錯誤**：連線失敗、超時等
- **驗證錯誤**：表單驗證、輸入驗證錯誤
- **業務邏輯錯誤**：業務規則違反、操作失敗
- **權限錯誤**：無權限訪問、身份驗證失敗

### 2. 嚴重程度選擇

- **critical**：系統級錯誤，需要立即處理（如 500 錯誤）
- **error**：一般錯誤，需要處理（如 400、404 錯誤）
- **warning**：警告，可忽略（如驗證警告）
- **info**：資訊提示（如操作成功提示）

### 3. 錯誤訊息撰寫

```typescript
// ✅ 好的錯誤訊息
message: '無法載入用戶資料'
details: '網路連線失敗，請檢查您的網路設定'

// ❌ 不好的錯誤訊息
message: 'Error'
details: 'Something went wrong'
```

### 4. 錯誤來源標記

始終提供 `source` 參數，方便追蹤錯誤來源：

```typescript
this.errorService.addError({
  // ...
  source: 'UserService.loadUserProfile', // 清晰的來源標記
});
```

### 5. 錯誤元數據

使用 `metadata` 儲存有用的調試資訊：

```typescript
this.errorService.addError({
  // ...
  metadata: {
    userId: '123',
    operation: 'updateProfile',
    requestData: { name: 'John' }
  }
});
```

### 6. 避免重複錯誤

在添加錯誤前檢查是否已存在相同錯誤：

```typescript
const existingError = this.errorService
  .activeErrors()
  .find(e => e.message === '網路連線失敗');

if (!existingError) {
  this.errorService.addError({
    // ...
  });
}
```

---

## 完整示例

### 示例 1：服務中使用錯誤處理

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorStateService } from '@core/net';
import { catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorStateService);

  loadUser(userId: string) {
    return this.http.get(`/api/users/${userId}`).pipe(
      catchError(error => {
        // HTTP 錯誤會被自動記錄，但可以添加額外的業務邏輯
        if (error.status === 404) {
          this.errorService.addError({
            type: 'business',
            severity: 'error',
            message: '用戶不存在',
            details: `找不到 ID 為 ${userId} 的用戶`,
            source: 'UserService.loadUser',
            retryable: false,
            metadata: { userId }
          });
        }
        return throwError(() => error);
      })
    );
  }
}
```

### 示例 2：組件中使用錯誤處理

```typescript
import { Component, inject, signal } from '@angular/core';
import { ErrorStateService } from '@core/net';
import { ErrorBannerComponent } from '@shared/components/error-display';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ErrorBannerComponent],
  template: `
    <!-- 錯誤橫幅 -->
    <app-error-banner
      [errors]="errorService.activeErrors()"
      (clear)="errorService.removeError($event)"
      (retry)="errorService.retryError($event)"
    />

    <!-- 用戶資料 -->
    @if (user(); as userData) {
      <div class="user-profile">
        <h1>{{ userData.name }}</h1>
        <p>{{ userData.email }}</p>
      </div>
    }

    <!-- 錯誤摘要 -->
    @if (errorService.hasErrors()) {
      <div class="error-summary">
        發現 {{ errorService.errorCount() }} 個錯誤
      </div>
    }
  `
})
export class UserProfileComponent {
  readonly userService = inject(UserService);
  readonly errorService = inject(ErrorStateService);

  readonly user = signal<any>(null);

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.userService.loadUser('123').subscribe({
      next: (user) => this.user.set(user),
      error: (error) => {
        // 錯誤已被自動記錄，這裡可以添加額外處理
        console.error('載入用戶失敗', error);
      }
    });
  }
}
```

### 示例 3：表單驗證錯誤

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ErrorStateService } from '@core/net';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" type="email" />
      @if (form.get('email')?.invalid && form.get('email')?.touched) {
        <span class="error">請輸入有效的電子郵件地址</span>
      }

      <button type="submit" [disabled]="form.invalid">提交</button>
    </form>
  `
})
export class ContactFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly errorService = inject(ErrorStateService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.form.invalid) {
      // 添加驗證錯誤
      this.errorService.addError({
        type: 'validation',
        severity: 'warning',
        message: '表單驗證失敗',
        details: '請檢查所有必填欄位',
        source: 'ContactFormComponent',
        retryable: false
      });
      return;
    }

    // 提交表單...
  }
}
```

---

## API 參考

### ErrorStateService

#### 屬性（Signal）

- `errors` - 所有錯誤列表（只讀）
- `errorHistory` - 錯誤歷史記錄（只讀）
- `activeErrors` - 當前活躍的錯誤（已過濾清除的錯誤）
- `hasErrors` - 是否有錯誤（boolean）
- `errorCount` - 錯誤數量（number）
- `criticalErrors` - 嚴重錯誤列表
- `normalErrors` - 一般錯誤列表

#### 方法

- `addError(error)` - 添加錯誤，返回錯誤 ID
- `removeError(id)` - 移除/清除錯誤
- `clearErrors()` - 清除所有錯誤
- `clearErrorsByType(type)` - 清除特定類型的錯誤
- `clearErrorsBySeverity(severity)` - 清除特定嚴重程度的錯誤
- `retryError(id)` - 重試錯誤
- `getError(id)` - 獲取特定錯誤
- `filterErrors(predicate)` - 過濾錯誤
- `clearHistory()` - 清除歷史記錄

---

## 常見問題

### Q: HTTP 錯誤會被自動記錄嗎？

A: 是的，所有 HTTP 錯誤都會透過 `defaultInterceptor` 自動記錄到 `ErrorStateService`。

### Q: 如何禁用特定 HTTP 請求的錯誤記錄？

A: 目前不支援，但可以透過自訂 HTTP Context 來實現（需要修改攔截器）。

### Q: 錯誤會自動消失嗎？

A: 不會，錯誤會一直保留直到手動清除。建議在錯誤解決後清除相關錯誤。

### Q: 錯誤歷史記錄會無限增長嗎？

A: 是的，目前沒有自動清理機制。建議定期調用 `clearHistory()` 清理舊的錯誤記錄。

### Q: 如何在錯誤橫幅中自訂樣式？

A: 可以透過覆蓋 `.error-banner-container` 和 `.error-banner-item` 的 CSS 類來自訂樣式。

---

## 相關文件

- [錯誤模型定義](../../../shared/models/error.model.ts)
- [錯誤狀態服務](./error-state.service.ts)
- [錯誤處理工具](./error-helper.ts)
- [HTTP 攔截器](../default.interceptor.ts)
- [錯誤橫幅組件](../../../shared/components/error-display/error-banner.component.ts)

---

**最後更新**：2025-01-04  
**版本**：1.0.0
