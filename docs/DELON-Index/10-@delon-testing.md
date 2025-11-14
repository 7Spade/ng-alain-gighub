# @delon/testing - 測試工具

> **包分類**：測試工具 (Testing Utilities)  
> **版本**：^20.1.0  
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/testing` |
| **官方文檔** | [@delon/testing](https://ng-alain.com/testing) |
| **GitHub** | [ng-alain/delon](https://github.com/ng-alain/delon) |
| **主要用途** | 提供測試輔助函數和工具，用於單元測試和集成測試 |

## 安裝

```bash
yarn add -D @delon/testing
```

**注意**：這是開發依賴，僅在測試環境使用。

## 使用方式

### 導入測試工具

```typescript
import { DelonTestingModule } from '@delon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';

describe('ExampleComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        DelonTestingModule,
        // 其他需要的模組
      ],
    });
  });
});
```

## 主要功能

### 1. DelonTestingModule - 測試模組

提供所有 @delon 組件的測試支持。

```typescript
import { DelonTestingModule } from '@delon/testing';

TestBed.configureTestingModule({
  imports: [DelonTestingModule],
});
```

### 2. 測試工具函數

```typescript
import {
  createTestContext,
  TestContext,
  TestComponentContext,
} from '@delon/testing';
```

### 3. Mock 服務

```typescript
import { MockAuthService } from '@delon/testing';
import { AuthService } from '@delon/auth';

TestBed.configureTestingModule({
  providers: [
    { provide: AuthService, useClass: MockAuthService },
  ],
});
```

## 基本用法示例

### 組件測試

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DelonTestingModule } from '@delon/testing';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { ExampleComponent } from './example.component';

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        DelonTestingModule,
        SHARED_IMPORTS,
        ExampleComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### 服務測試

```typescript
import { TestBed } from '@angular/core/testing';
import { DelonTestingModule } from '@delon/testing';
import { AuthService } from '@delon/auth';
import { MockAuthService } from '@delon/testing';

describe('MyService', () => {
  let service: MyService;
  let authService: MockAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DelonTestingModule],
      providers: [
        MyService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    service = TestBed.inject(MyService);
    authService = TestBed.inject(AuthService) as MockAuthService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

### 測試工具函數

```typescript
import { createTestContext } from '@delon/testing';

describe('Component with @delon components', () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext(ExampleComponent, {
      imports: [DelonTestingModule, SHARED_IMPORTS],
    });
  });

  it('should render', () => {
    expect(context.fixture).toBeTruthy();
  });
});
```

## Mock 服務

### MockAuthService

```typescript
import { MockAuthService } from '@delon/testing';

TestBed.configureTestingModule({
  providers: [
    { provide: AuthService, useClass: MockAuthService },
  ],
});

// 在測試中使用
const authService = TestBed.inject(AuthService) as MockAuthService;
authService.setToken('mock-token');
authService.setUser({ id: 1, name: 'Test User' });
```

### MockCacheService

```typescript
import { MockCacheService } from '@delon/testing';
import { CacheService } from '@delon/cache';

TestBed.configureTestingModule({
  providers: [
    { provide: CacheService, useClass: MockCacheService },
  ],
});
```

## 測試最佳實踐

### 1. 使用 NoopAnimationsModule

```typescript
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

TestBed.configureTestingModule({
  imports: [NoopAnimationsModule, DelonTestingModule],
});
```

### 2. 使用 SHARED_IMPORTS

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

TestBed.configureTestingModule({
  imports: [DelonTestingModule, SHARED_IMPORTS],
});
```

### 3. Mock HTTP 請求

```typescript
import { HttpClientTestingModule } from '@angular/common/http/testing';

TestBed.configureTestingModule({
  imports: [
    HttpClientTestingModule,
    DelonTestingModule,
  ],
});
```

## 項目中的使用

在測試文件中使用 `DelonTestingModule` 和相關的 Mock 服務，確保測試環境正確配置。

## 相關資源

- [官方文檔](https://ng-alain.com/testing)
- [GitHub 倉庫](https://github.com/ng-alain/delon)
- [Angular 測試指南](https://angular.dev/guide/testing)
- [返回索引](./README.md)

