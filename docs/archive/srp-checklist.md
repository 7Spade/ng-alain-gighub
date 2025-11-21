# SRP 合規性檢查清單

## 📑 目錄

- [✅ Component 檢查清單](#-component-檢查清單)
- [✅ Service 檢查清單](#-service-檢查清單)
- [✅ Repository 檢查清單](#-repository-檢查清單)
- [✅ Facade 檢查清單](#-facade-檢查清單)
- [❌ 常見違規模式](#-常見違規模式)
  - [🚫 Component 直接使用 Repository](#-component-直接使用-repository)
  - [🚫 Service 直接使用 SupabaseService.client](#-service-直接使用-supabaseserviceclient)
  - [🚫 Repository 包含業務邏輯](#-repository-包含業務邏輯)
- [🎯 快速決策樹](#-快速決策樹)
- [📋 Code Review 檢查清單](#-code-review-檢查清單)
  - [Component PR](#component-pr)
  - [Service PR](#service-pr)
  - [Repository PR](#repository-pr)
  - [Facade PR](#facade-pr)

---


**用途**: 開發新功能時的快速檢查清單
**更新**: 2025-11-19

- --

## ✅ Component 檢查清單

在創建或修改 Component 時，檢查以下項目：

- [ ] **只處理 UI 邏輯**
  - [ ] 沒有業務邏輯
  - [ ] 沒有直接的資料存取
  - [ ] 沒有複雜的計算

- [ ] **正確的依賴注入**
  - [ ] 注入 Facade 或 Service（不是 Repository）
  - [ ] 不注入 SupabaseService
  - [ ] 使用 inject() 函數

- [ ] **使用 Signals**
  - [ ] 從 Service/Facade 獲取 ReadonlySignal
  - [ ] 使用 computed() 創建 UI 派生狀態
  - [ ] 不直接修改 Service 的 Signal

- [ ] **範例**:
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS]
})
export class ExampleComponent {
  private readonly exampleService = inject(ExampleService);

  // ✅ 使用 Service 的 signals
  readonly items = this.exampleService.items;
  readonly loading = this.exampleService.loading;

  // ✅ UI 邏輯
  async onAction(): Promise<void> {
    await this.exampleService.performAction();
  }
}
```

- --

## ✅ Service 檢查清單

在創建或修改 Service 時，檢查以下項目：

- [ ] **只處理業務邏輯**
  - [ ] 沒有直接的 API 調用
  - [ ] 沒有 UI 邏輯
  - [ ] 沒有 DOM 操作

- [ ] **正確的依賴注入**
  - [ ] 注入 Repository（不是 SupabaseService.client）
  - [ ] 注入其他 Service（如果需要）
  - [ ] 注入 Facade（用於跨模組通信）

- [ ] **使用 Signals 管理狀態**
  - [ ] 私有 signal() 用於內部狀態
  - [ ] 暴露 ReadonlySignal 給外部
  - [ ] 使用 computed() 創建派生狀態

- [ ] **完整的錯誤處理**
  - [ ] try-catch 包裹異步操作
  - [ ] 設置 errorState
  - [ ] 返回用戶友好的錯誤訊息

- [ ] **範例**:
```typescript
@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private readonly exampleRepository = inject(ExampleRepository);

  // ✅ 使用 Signals 管理狀態
  private itemsState = signal<Item[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  readonly items = this.itemsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // ✅ 業務邏輯方法
  async loadItems(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const items = await firstValueFrom(this.exampleRepository.findAll());
      this.itemsState.set(items);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }
}
```

- --

## ✅ Repository 檢查清單

在創建或修改 Repository 時，檢查以下項目：

- [ ] **只處理資料存取**
  - [ ] 沒有業務邏輯
  - [ ] 沒有 UI 轉換
  - [ ] 沒有狀態管理

- [ ] **繼承 BaseRepository**
  - [ ] 設置正確的 tableName
  - [ ] 使用泛型定義類型

- [ ] **使用 Observable**
  - [ ] 所有方法返回 Observable
  - [ ] 使用 from() 包裝 Promise
  - [ ] 使用 map() 進行型別轉換

- [ ] **完整的類型定義**
  - [ ] 從 Database 類型導出
  - [ ] 定義 Insert 和 Update 類型

- [ ] **範例**:
```typescript
type ExampleRow = Database['public']['Tables']['examples']['Row'];
type ExampleInsert = Database['public']['Tables']['examples']['Insert'];
type ExampleUpdate = Database['public']['Tables']['examples']['Update'];

export type Example = ExampleRow;
export type { ExampleInsert, ExampleUpdate };

@Injectable({
  providedIn: 'root'
})
export class ExampleRepository extends BaseRepository<Example, ExampleInsert, ExampleUpdate> {
  protected tableName = 'examples';

  // ✅ 自定義查詢方法
  findByUserId(userId: string): Observable<Example[]> {
    return this.findAll({
      filters: { userId }
    });
  }
}
```

- --

## ✅ Facade 檢查清單

在創建或修改 Facade 時，檢查以下項目：

- [ ] **統一的狀態接口**
  - [ ] 協調多個 Service
  - [ ] 暴露統一的 Signal 接口
  - [ ] 處理跨模組通信

- [ ] **不直接操作 API**
  - [ ] 不注入 Repository
  - [ ] 不注入 SupabaseService
  - [ ] 透過 Service 操作

- [ ] **活動記錄（如果適用）**
  - [ ] 注入 ActivityService
  - [ ] 記錄重要操作

- [ ] **範例**:
```typescript
@Injectable({
  providedIn: 'root'
})
export class ExampleFacade {
  private readonly exampleService = inject(ExampleService);
  private readonly activityService = inject(ActivityService);

  // ✅ 暴露 Service 的 signals
  readonly items = this.exampleService.items;
  readonly loading = this.exampleService.loading;

  // ✅ 協調多個 Service
  async performComplexOperation(): Promise<void> {
    await this.exampleService.doSomething();
    await this.activityService.log({
      action: 'complex_operation',
      entity: 'example'
    });
  }
}
```

- --

## ❌ 常見違規模式

### 🚫 Component 直接使用 Repository

```typescript
// ❌ 錯誤
export class BadComponent {
  private readonly repository = inject(ExampleRepository);

  async load(): Promise<void> {
    const items = await firstValueFrom(this.repository.findAll());
  }
}

// ✅ 正確
export class GoodComponent {
  private readonly service = inject(ExampleService);

  async load(): Promise<void> {
    await this.service.loadItems();
  }
}
```

- --

### 🚫 Service 直接使用 SupabaseService.client

```typescript
// ❌ 錯誤
export class BadService {
  private readonly supabase = inject(SupabaseService);

  async signIn(email: string, password: string): Promise<void> {
    const { data } = await this.supabase.client.auth.signInWithPassword({
      email, password
    });
  }
}

// ✅ 正確
export class GoodService {
  private readonly authRepository = inject(AuthRepository);

  signIn(request: SignInRequest): Observable<AuthResult> {
    return this.authRepository.signIn(request).pipe(
      map(response => this.handleAuthResponse(response))
    );
  }
}
```

- --

### 🚫 Repository 包含業務邏輯

```typescript
// ❌ 錯誤
export class BadRepository {
  findActiveUsers(): Observable<User[]> {
    return this.findAll().pipe(
      map(users => users.filter(u => u.status === 'active' && u.lastLoginAt > someDate))
    );
  }
}

// ✅ 正確
export class GoodRepository {
  findAll(): Observable<User[]> {
    return super.findAll();
  }
}

// ✅ 業務邏輯放在 Service
export class UserService {
  readonly activeUsers = computed(() =>
    this.users().filter(u => u.status === 'active' && this.isRecentlyActive(u))
  );
}
```

- --

## 🎯 快速決策樹

**我應該在哪裡寫這段代碼？**

```
是否是 UI 邏輯（點擊、顯示、表單）？
  └─ 是 → Component
  └─ 否 ↓

是否是資料存取（API 調用、資料庫查詢）？
  └─ 是 → Repository
  └─ 否 ↓

是否是業務規則（計算、驗證、狀態轉換）？
  └─ 是 → Service
  └─ 否 ↓

是否需要協調多個 Service？
  └─ 是 → Facade
  └─ 否 → 重新思考職責
```

- --

## 📋 Code Review 檢查清單

審查 PR 時，檢查以下項目：

### Component PR
- [ ] 沒有注入 Repository
- [ ] 沒有注入 SupabaseService
- [ ] 沒有複雜的業務邏輯
- [ ] 使用 Service/Facade 的 signals

### Service PR
- [ ] 沒有直接使用 SupabaseService.client
- [ ] 使用 Repository 進行資料存取
- [ ] 使用 Signals 管理狀態
- [ ] 錯誤處理完整

### Repository PR
- [ ] 繼承 BaseRepository
- [ ] 只包含資料存取方法
- [ ] 沒有業務邏輯
- [ ] 類型定義完整

### Facade PR
- [ ] 不直接注入 Repository
- [ ] 協調多個 Service
- [ ] 暴露統一的 Signal 接口

- --

**更新日期**: 2025-11-19
**維護者**: 開發團隊
**參考**: [SRP 重構完成報告](./SRP-重構完成報告.md)
