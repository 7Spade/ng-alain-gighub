# 測試代理

> **相關文檔**：參考 [測試規範](../../../.cursor/rules/testing.mdc)、[測試指南](../../../docs/38-測試指南.md)

## 代理職責

測試代理負責確保專案的測試覆蓋率和測試質量符合標準。

## 檢查項目

### 1. 測試覆蓋率要求

- ✅ 單元測試覆蓋率 ≥ 80%
- ✅ 組件測試覆蓋率 ≥ 70%
- ✅ 服務測試覆蓋率 ≥ 90%
- ✅ 關鍵業務邏輯覆蓋率 = 100%

```bash
# 執行測試並生成覆蓋率報告
yarn test:coverage

# 查看覆蓋率報告
open coverage/index.html
```

### 2. 測試框架配置

專案使用 **Karma + Jasmine** 進行單元測試：

- **Karma**：測試執行器
- **Jasmine**：測試框架
- **karma-coverage**：覆蓋率報告

### 3. Angular Testing Utilities

使用 Angular 提供的測試工具：

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### 4. 測試類型

#### 單元測試（Unit Tests）

測試單個組件或服務的功能：

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch user data', () => {
    const mockUser = { id: '1', name: 'Test User' };
    
    service.getUser('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
```

#### 組件測試（Component Tests）

測試組件的行為和交互：

```typescript
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, SHARED_IMPORTS]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should display error for invalid email', () => {
    const emailInput = fixture.nativeElement.querySelector('input[type="email"]');
    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const errorMsg = fixture.nativeElement.querySelector('.error-message');
    expect(errorMsg.textContent).toContain('請輸入有效的電子郵件');
  });
});
```

#### Signal 測試

測試 Angular Signals：

```typescript
describe('CounterComponent with Signals', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
  });

  it('should update signal value', () => {
    expect(component.count()).toBe(0);
    
    component.increment();
    expect(component.count()).toBe(1);
  });

  it('should compute derived value', () => {
    component.count.set(5);
    expect(component.double()).toBe(10);
  });
});
```

### 5. Mock 和 Spy

使用 Jasmine Spy 模擬依賴：

```typescript
describe('UserComponent with Mock Service', () => {
  let component: UserComponent;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', ['getUser', 'updateUser']);

    TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    });

    component = TestBed.createComponent(UserComponent).componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should call getUser on init', () => {
    userService.getUser.and.returnValue(of({ id: '1', name: 'Test' }));
    
    component.ngOnInit();
    
    expect(userService.getUser).toHaveBeenCalledWith('1');
  });
});
```

### 6. 異步測試

處理異步操作：

```typescript
describe('Async Operations', () => {
  it('should handle async data loading', fakeAsync(() => {
    let data: any;
    
    service.loadData().subscribe(result => {
      data = result;
    });
    
    tick(1000); // 模擬 1 秒後
    
    expect(data).toBeDefined();
  }));

  it('should handle promise', async () => {
    const result = await service.loadDataPromise();
    expect(result).toBeDefined();
  });
});
```

## 測試最佳實踐

### 1. AAA 模式

遵循 Arrange-Act-Assert 模式：

```typescript
it('should calculate total price', () => {
  // Arrange：準備測試數據
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 }
  ];
  
  // Act：執行被測試的操作
  const total = calculateTotal(items);
  
  // Assert：驗證結果
  expect(total).toBe(250);
});
```

### 2. 測試描述清晰

```typescript
// ❌ 錯誤：不清楚的描述
it('test 1', () => {});

// ✅ 正確：清晰的描述
it('should return empty array when no items are provided', () => {});
```

### 3. 一個測試一個斷言

```typescript
// ❌ 錯誤：多個不相關的斷言
it('should test multiple things', () => {
  expect(user.name).toBe('John');
  expect(user.email).toBe('john@example.com');
  expect(user.age).toBe(30);
});

// ✅ 正確：分開測試
it('should have correct name', () => {
  expect(user.name).toBe('John');
});

it('should have correct email', () => {
  expect(user.email).toBe('john@example.com');
});
```

### 4. 測試邊界情況

```typescript
describe('validateAge', () => {
  it('should accept age 18', () => {
    expect(validateAge(18)).toBe(true);
  });

  it('should reject age 17', () => {
    expect(validateAge(17)).toBe(false);
  });

  it('should handle negative age', () => {
    expect(validateAge(-1)).toBe(false);
  });

  it('should handle age 0', () => {
    expect(validateAge(0)).toBe(false);
  });
});
```

## 自動化測試

### Pre-commit 測試

```bash
# 執行單元測試
yarn test

# 執行測試並生成覆蓋率報告
yarn test:coverage
```

### Pull Request 測試

在 Pull Request 中，代理會自動執行：

1. 所有單元測試
2. 覆蓋率檢查
3. 測試質量驗證
4. 失敗測試報告

## 測試配置

### karma.conf.js

```javascript
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage')
    ],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ]
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    browsers: ['ChromeHeadless']
  });
};
```

## 參考資源

- [Jasmine 官方文檔](https://jasmine.github.io/)
- [Karma 官方文檔](https://karma-runner.github.io/)
- [Angular Testing 指南](https://angular.dev/guide/testing)
- [專案測試規範](../../../.cursor/rules/testing.mdc)
- [測試指南](../../../docs/38-測試指南.md)

---

**最後更新**：2025-11-15  
**代理版本**：v1.0
