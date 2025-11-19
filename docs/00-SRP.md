# SRP (Single Responsibility Principle) 規範

## 核心原則

**Component**：只處理 UI → 單一職責

**Service**：只處理邏輯 → 單一職責

**Repository**：只處理 API/資料存取 → 單一職責

**Pipe**：只處理轉換 → 單一職責

**Directive**：只處理 DOM 行為 → 單一職責

**Facade**：只處理狀態與 UI 溝通 → 單一職責

## 企業級 Angular 規範

👉 Component 禁止放業務邏輯

👉 Service 不可同時處理 API + domain logic

👉 Repository 不能做 UI model mapping

👉 Facade 不能做 API mapping 或 UI 轉換

## 正確的依賴鏈

```
Component → Facade/Service → Repository → SupabaseService → Supabase
```

## 實際案例（2025-11-19 重構）

本專案已完成核心 SRP 重構，以下是實際案例：

### 案例 1：AuthService 重構

**之前（違規）**：
```typescript
// ❌ Service 直接使用 SupabaseService.client
export class AuthService {
  private readonly supabaseService = inject(SupabaseService);
  
  signIn(email: string, password: string) {
    return from(this.supabaseService.client.auth.signInWithPassword({
      email, password
    }));
  }
}
```

**之後（符合 SRP）**：
```typescript
// ✅ Service 透過 Repository
export class AuthService {
  private readonly authRepository = inject(AuthRepository);
  
  signIn(request: SignInRequest): Observable<AuthResult> {
    return this.authRepository.signIn(request).pipe(
      switchMap(response => {
        // 只處理業務邏輯：Session 同步、帳戶載入
        if (response.error) {
          this.authState.setError(response.error.message);
          return of({ success: false, error: response.error });
        }
        this.sessionAdapter.syncSessionToTokenService(response.session);
        return this.loadUserAccount(response.session.user.id);
      })
    );
  }
}

// ✅ Repository 只處理 API 調用
@Injectable({ providedIn: 'root' })
export class AuthRepository {
  private readonly supabaseService = inject(SupabaseService);
  
  signIn(request: SignInRequest): Observable<AuthRepositoryResponse> {
    return from(
      this.supabaseService.client.auth.signInWithPassword({
        email: request.email,
        password: request.password
      })
    ).pipe(
      map(response => ({
        session: response.data.session,
        user: response.data.user,
        error: response.error
      }))
    );
  }
}
```

### 案例 2：PersonalTodoService 重構

**之前（違規）**：
```typescript
// ❌ Service 直接管理 Realtime 頻道
export class PersonalTodoService {
  private supabaseService = inject(SupabaseService);
  private realtimeChannel: RealtimeChannel | null = null;
  
  async subscribeToUpdates(accountId: string): Promise<void> {
    this.realtimeChannel = this.supabaseService.client
      .channel(`personal_todos:${accountId}`)
      .on('postgres_changes', { ... }, callback)
      .subscribe();
  }
}
```

**之後（符合 SRP）**：
```typescript
// ✅ Service 透過 RealtimeFacade
export class PersonalTodoService {
  private realtimeFacade = inject(RealtimeFacade);
  private realtimeSubscriptionId: string | null = null;
  
  async subscribeToUpdates(accountId: string): Promise<void> {
    // 只處理業務邏輯：載入資料、設置訂閱
    await this.loadTodos(accountId);
    
    this.realtimeSubscriptionId = this.realtimeFacade.subscribeToTable<PersonalTodo>(
      {
        table: 'personal_todos',
        filter: `account_id=eq.${accountId}`,
        events: ['*']
      },
      payload => this.handleRealtimeEvent(payload)
    );
  }
}
```

### 案例 3：TaskStagingComponent 重構

**之前（違規）**：
```typescript
// ❌ Component 直接使用 Repository
export class TaskStagingComponent {
  private readonly taskStagingRepository = inject(TaskStagingRepository);
  
  async onBlueprintChange(): Promise<void> {
    const tasks = this.taskService.tasks();
    const stagingPromises = tasks.map(task => 
      firstValueFrom(this.taskStagingRepository.findByTaskId(task.id))
    );
    const stagingArrays = await Promise.all(stagingPromises);
    // ... 複雜的業務邏輯處理
  }
}
```

**之後（符合 SRP）**：
```typescript
// ✅ Component 透過 Service
export class TaskStagingComponent {
  private readonly taskStagingService = inject(TaskStagingService);
  
  // 使用 Service 的 signals
  readonly loading = this.taskStagingService.loading;
  readonly stagingRecords = this.taskStagingService.stagingItems;
  
  async onBlueprintChange(): Promise<void> {
    // 只處理 UI 邏輯：載入資料
    await this.taskService.loadTasksByBlueprint(blueprintId);
    await this.taskStagingService.loadStagingByBlueprint(blueprintId);
  }
}
```

## 參考文檔

- [SRP 重構完成報告](./SRP-重構完成報告.md) - 詳細的重構記錄和企業標準審查
- [SRP 檢查清單](./SRP-檢查清單.md) - 開發時的快速參考指南
- [開發工作流程](./28-開發工作流程.md) - 完整的開發流程規範

---

**最後更新**：2025-11-19  
**狀態**：✅ 核心重構已完成，符合企業標準