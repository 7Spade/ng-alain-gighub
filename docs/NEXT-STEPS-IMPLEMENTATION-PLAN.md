# 下一步實施計畫 (Next Steps Implementation Plan)

**文件版本**: v1.0  
**最後更新**: 2025-11-18  
**維護者**: 開發團隊  
**狀態**: ✅ 已審核並準備執行

---

## 📋 執行摘要

本文件提供 ng-alain-github 專案的下一步實施計畫，基於完成的元件缺口分析報告 (`docs/COMPONENT-MAPPING-REPORT.md`)。目前已完成 BlueprintFacade 實作，接下來將按照優先順序實作剩餘的關鍵 Facades 與元件。

### 當前狀態
- ✅ **元件缺口分析完成** (199 個元件已分析)
- ✅ **BlueprintFacade 實作完成** (2/6 Facades, 33%)
- ⏳ **待實作 Facades**: 4 個高優先級 Facades
- ⏳ **待實作元件**: 15+ 個共用元件
- ⏳ **測試覆蓋率**: 需要提升至 85%+

---

## 🎯 優先順序總覽

### P0 - 核心基礎設施 (Critical)
**預計完成時間**: 2-3 週

1. **BlueprintAggregationRefreshService** 🔴 最高優先
2. **ErrorStateService** 🔴 最高優先
3. **AuthFacade** 🔴 最高優先
4. **RealtimeFacade** 🔴 最高優先

### P1 - 共用 UI 元件 (High)
**預計完成時間**: 3-4 週

5. **AccountFacade** 🟡 高優先
6. **StorageFacade** 🟡 高優先
7. **TaskFacade (通用)** 🟡 高優先
8. Atomic UI 元件 (8-10 個)

### P2 - 業務複合元件 (Medium)
**預計完成時間**: 4-6 週

9. 業務特定元件
10. Storybook 設置與 Stories
11. 測試覆蓋率提升

---

## 📅 詳細實施計畫

### 第一週：P0-1 BlueprintAggregationRefreshService

**目標**: 實作聚合刷新模式，支援自動更新

#### 工作項目
- [ ] 建立 `BlueprintAggregationRefreshService` 類別
- [ ] 實作 `emit()` 方法 (發送聚合更新事件)
- [ ] 實作 `listen()` 方法 (訂閱聚合更新事件)
- [ ] 與 BlueprintFacade 整合
- [ ] 與 Task/Document/Quality 服務整合
- [ ] 撰寫單元測試 (目標 90%+ 覆蓋率)
- [ ] 更新文件

#### 技術規格
```typescript
@Injectable({ providedIn: 'root' })
export class BlueprintAggregationRefreshService {
  private refreshSubject = new Subject<RefreshEvent>();
  
  // 發送聚合更新事件
  emit(event: RefreshEvent): void;
  
  // 訂閱聚合更新事件
  listen(): Observable<RefreshEvent>;
  
  // 針對特定藍圖發送更新
  emitForBlueprint(blueprintId: string, source: string): void;
}

interface RefreshEvent {
  blueprintId: string;
  source: 'task' | 'document' | 'quality' | 'issue';
  timestamp: string;
}
```

#### 驗收標準
- ✅ Service 正確實作 emit/listen 模式
- ✅ BlueprintFacade 整合完成 (取消註解 line 138)
- ✅ 測試涵蓋所有情境
- ✅ 文件包含使用範例

#### 預估工時
- 實作: 4-6 小時
- 測試: 2-3 小時
- 文件: 1-2 小時
- **總計**: 7-11 小時

---

### 第一週：P0-2 ErrorStateService

**目標**: 集中式錯誤處理與重試邏輯

#### 工作項目
- [ ] 建立 `ErrorStateService` 類別
- [ ] 實作錯誤狀態管理 (Signal-based)
- [ ] 實作重試邏輯 (exponential backoff)
- [ ] 實作錯誤記錄功能
- [ ] 與現有 Facades 整合
- [ ] 撰寫單元測試 (目標 90%+ 覆蓋率)
- [ ] 更新文件

#### 技術規格
```typescript
@Injectable({ providedIn: 'root' })
export class ErrorStateService {
  // Signal 狀態
  private errorsState = signal<ErrorRecord[]>([]);
  readonly errors = this.errorsState.asReadonly();
  
  // 記錄錯誤
  logError(error: ErrorRecord): void;
  
  // 重試操作 (with exponential backoff)
  retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T>;
  
  // 清除錯誤
  clearErrors(context?: string): void;
  
  // 取得特定上下文的錯誤
  getErrors(context: string): ErrorRecord[];
}

interface ErrorRecord {
  id: string;
  context: string; // e.g., 'blueprint', 'task', 'auth'
  error: Error;
  timestamp: string;
  retryCount: number;
  maxRetries: number;
}
```

#### 驗收標準
- ✅ Service 正確管理錯誤狀態
- ✅ Retry logic 使用 exponential backoff
- ✅ Facades 可選擇性整合
- ✅ 測試涵蓋重試邏輯
- ✅ 文件包含錯誤處理最佳實踐

#### 預估工時
- 實作: 6-8 小時
- 測試: 3-4 小時
- 文件: 1-2 小時
- **總計**: 10-14 小時

---

### 第二週：P0-3 AuthFacade

**目標**: 統一認證狀態管理，封裝 Supabase Auth + @delon/auth

#### 工作項目
- [ ] 建立 `AuthFacade` 類別
- [ ] 封裝 AuthService 與 AuthStateService
- [ ] 實作 Signal-based 認證狀態
- [ ] 實作登入/登出/註冊方法
- [ ] 實作 Session 管理
- [ ] 與 SupabaseSessionAdapter 整合
- [ ] 撰寫單元測試 (目標 85%+ 覆蓋率)
- [ ] 更新文件

#### 技術規格
```typescript
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  // Inject dependencies
  private authService = inject(AuthService);
  private authState = inject(AuthStateService);
  
  // Signal 狀態
  readonly user = this.authState.user;
  readonly isAuthenticated = this.authState.isAuthenticated;
  readonly loading = this.authState.loading;
  
  // Computed
  readonly userRole = computed(() => this.user()?.role);
  readonly userPermissions = computed(() => this.user()?.permissions);
  
  // 登入
  async signIn(credentials: SignInCredentials): Promise<void>;
  
  // 登出
  async signOut(): Promise<void>;
  
  // 註冊
  async signUp(userData: SignUpData): Promise<void>;
  
  // 重設密碼
  async resetPassword(email: string): Promise<void>;
  
  // 檢查權限
  hasPermission(permission: string): boolean;
}
```

#### 驗收標準
- ✅ Facade 正確封裝 AuthService
- ✅ Signal 狀態同步更新
- ✅ 整合 Supabase Auth 流程
- ✅ 測試涵蓋所有認證流程
- ✅ 文件包含使用範例與安全最佳實踐

#### 預估工時
- 實作: 8-10 小時
- 測試: 4-5 小時
- 文件: 2-3 小時
- **總計**: 14-18 小時

---

### 第二週：P0-4 RealtimeFacade

**目標**: 統一 Realtime 訂閱管理，連線池與重連機制

#### 工作項目
- [ ] 建立 `RealtimeFacade` 類別
- [ ] 實作訂閱管理 (subscribe/unsubscribe)
- [ ] 實作連線池管理
- [ ] 實作自動重連機制
- [ ] 實作 Signal-based 訂閱狀態
- [ ] 與 Supabase Realtime 整合
- [ ] 撰寫單元測試 (目標 85%+ 覆蓋率)
- [ ] 更新文件

#### 技術規格
```typescript
@Injectable({ providedIn: 'root' })
export class RealtimeFacade {
  private supabase = inject(SupabaseService);
  
  // Signal 狀態
  private subscriptionsState = signal<Map<string, RealtimeSubscription>>(new Map());
  readonly subscriptions = this.subscriptionsState.asReadonly();
  
  private connectionStateState = signal<ConnectionState>('disconnected');
  readonly connectionState = this.connectionStateState.asReadonly();
  
  // 訂閱資料表變更
  subscribeToTable<T>(
    table: string,
    callback: (payload: RealtimePayload<T>) => void,
    filter?: RealtimeFilter
  ): RealtimeSubscription;
  
  // 取消訂閱
  unsubscribe(subscriptionId: string): void;
  
  // 取消所有訂閱
  unsubscribeAll(): void;
  
  // 重新連線
  reconnect(): Promise<void>;
}

interface RealtimeSubscription {
  id: string;
  table: string;
  filter?: RealtimeFilter;
  status: 'active' | 'paused' | 'error';
  createdAt: string;
}
```

#### 驗收標準
- ✅ Facade 正確管理訂閱
- ✅ 連線池有效運作
- ✅ 自動重連機制可靠
- ✅ 測試涵蓋連線失敗情境
- ✅ 文件包含訂閱模式最佳實踐

#### 預估工時
- 實作: 10-12 小時
- 測試: 4-6 小時
- 文件: 2-3 小時
- **總計**: 16-21 小時

---

### 第三週：P1-1 AccountFacade

**目標**: 帳戶操作統一介面

#### 工作項目
- [ ] 建立 `AccountFacade` 類別
- [ ] 封裝 AccountService
- [ ] 實作 CRUD 操作
- [ ] 實作團隊/組織管理
- [ ] 撰寫單元測試 (目標 85%+ 覆蓋率)
- [ ] 更新文件

#### 技術規格
```typescript
@Injectable({ providedIn: 'root' })
export class AccountFacade {
  private accountService = inject(AccountService);
  
  // Signal 狀態
  readonly accounts = this.accountService.accounts;
  readonly currentAccount = this.accountService.currentAccount;
  readonly loading = this.accountService.loading;
  
  // CRUD operations
  async loadAccounts(): Promise<void>;
  async loadAccountById(id: string): Promise<Account | null>;
  async updateAccount(id: string, data: AccountUpdate): Promise<Account>;
  
  // Team/Organization management
  async getTeams(accountId: string): Promise<Team[]>;
  async getOrganizations(accountId: string): Promise<Organization[]>;
}
```

#### 預估工時
- 實作: 6-8 小時
- 測試: 3-4 小時
- 文件: 1-2 小時
- **總計**: 10-14 小時

---

### 第三週：P1-2 StorageFacade

**目標**: 檔案上傳/下載統一介面，支援優化

#### 工作項目
- [ ] 建立 `StorageFacade` 類別
- [ ] 實作上傳方法 (單檔/多檔)
- [ ] 實作下載方法
- [ ] 實作進度追蹤 (Signal-based)
- [ ] 實作檔案壓縮/優化
- [ ] 實作斷點續傳 (可選)
- [ ] 撰寫單元測試 (目標 85%+ 覆蓋率)
- [ ] 更新文件

#### 技術規格
```typescript
@Injectable({ providedIn: 'root' })
export class StorageFacade {
  private supabase = inject(SupabaseService);
  
  // Signal 狀態
  private uploadProgressState = signal<Map<string, number>>(new Map());
  readonly uploadProgress = this.uploadProgressState.asReadonly();
  
  // 上傳檔案
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: UploadOptions
  ): Promise<UploadResult>;
  
  // 批次上傳
  async uploadFiles(
    bucket: string,
    files: FileUploadRequest[]
  ): Promise<UploadResult[]>;
  
  // 下載檔案
  async downloadFile(bucket: string, path: string): Promise<Blob>;
  
  // 取得公開 URL
  getPublicUrl(bucket: string, path: string): string;
  
  // 刪除檔案
  async deleteFile(bucket: string, path: string): Promise<void>;
}
```

#### 預估工時
- 實作: 8-10 小時
- 測試: 4-5 小時
- 文件: 2-3 小時
- **總計**: 14-18 小時

---

### 第四週：P1-3 TaskFacade (通用)

**目標**: 通用任務操作介面 (超越 TaskTreeFacade)

#### 工作項目
- [ ] 建立 `TaskFacade` 類別
- [ ] 實作通用 CRUD 操作
- [ ] 實作狀態管理
- [ ] 實作指派管理
- [ ] 實作附件管理
- [ ] 與 TaskTreeFacade 整合
- [ ] 撰寫單元測試 (目標 85%+ 覆蓋率)
- [ ] 更新文件

#### 技術規格
```typescript
@Injectable({ providedIn: 'root' })
export class TaskFacade {
  private taskService = inject(TaskService);
  
  // Signal 狀態
  readonly tasks = this.taskService.tasks;
  readonly loading = this.taskService.loading;
  
  // Computed
  readonly tasksByStatus = computed(() => {
    // Group tasks by status
  });
  
  // CRUD operations
  async loadTasks(filters?: TaskFilters): Promise<void>;
  async createTask(data: TaskInsert): Promise<Task>;
  async updateTask(id: string, data: TaskUpdate): Promise<Task>;
  async deleteTask(id: string): Promise<void>;
  
  // Assignment management
  async assignTask(taskId: string, assigneeId: string): Promise<void>;
  async unassignTask(taskId: string, assigneeId: string): Promise<void>;
  
  // Status management
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<void>;
}
```

#### 預估工時
- 實作: 8-10 小時
- 測試: 4-5 小時
- 文件: 2-3 小時
- **總計**: 14-18 小時

---

## 🧩 第五-六週：P1 共用 UI 元件

### 優先實作清單

#### 1. Icon Button Wrapper
```typescript
@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [NzButtonModule, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconButtonComponent {
  icon = input.required<string>();
  type = input<'primary' | 'default' | 'dashed' | 'text' | 'link'>('default');
  size = input<'large' | 'default' | 'small'>('default');
  disabled = input<boolean>(false);
  clicked = output<MouseEvent>();
}
```

#### 2. Table Wrapper
```typescript
@Component({
  selector: 'app-table-wrapper',
  standalone: true,
  imports: [NzTableModule, SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableWrapperComponent<T> {
  data = input.required<T[]>();
  columns = input.required<TableColumn[]>();
  loading = input<boolean>(false);
  pageSize = input<number>(10);
  // ... more inputs
}
```

#### 3. Paginated Table
擴展 TableWrapper，加入分頁功能

#### 4. Filter Panel
通用篩選面板元件

#### 5. Avatar With Menu
頭像 + 下拉選單

#### 6. Tag Pill
標籤元件

#### 7. Loading Skeleton
載入骨架屏

#### 8. Confirm Modal
確認對話框 (已存在，需改進)

**每個元件預估工時**: 4-6 小時
**總計**: 32-48 小時

---

## 📊 第七-八週：P2 測試與 Storybook

### 工作項目

#### 1. 測試覆蓋率提升
- [ ] 為現有未測試元件新增測試
- [ ] 提升 Shared 元件測試覆蓋率至 90%+
- [ ] 提升 Core 服務測試覆蓋率至 85%+
- [ ] 提升 Route 元件測試覆蓋率至 80%+

#### 2. Storybook 設置
- [ ] 安裝與配置 Storybook
- [ ] 建立 story 模板
- [ ] 為關鍵元件建立 stories
  - BlueprintFacade 使用範例
  - 共用 UI 元件展示
  - 業務元件互動範例

#### 3. 整合測試
- [ ] Facade + Service + Repository 整合測試
- [ ] 端到端流程測試
- [ ] 效能測試

**預估工時**: 40-60 小時

---

## 📈 進度追蹤

### 里程碑

| 里程碑 | 預計完成 | 狀態 | 工作項 |
|--------|----------|------|--------|
| **M1: Core Facades** | Week 2 | ⏳ In Progress | P0-1 ~ P0-4 |
| **M2: Extended Facades** | Week 4 | ⏳ Pending | P1-1 ~ P1-3 |
| **M3: Shared UI Components** | Week 6 | ⏳ Pending | P1 UI 元件 |
| **M4: Testing & Storybook** | Week 8 | ⏳ Pending | P2 測試與文件 |

### 每週檢查點

**每週五下午**進行進度檢查：
1. 已完成工作項回顧
2. 遇到的問題與解決方案
3. 下週工作計畫調整
4. Demo 新完成的功能

---

## 🔧 技術債務追蹤

### 已知問題

1. **Pre-existing Test Errors**
   - `blueprint-activity.service.spec.ts` 有型別錯誤
   - 需要修復後才能執行測試套件
   - **優先級**: 🔴 高

2. **Database Schema Gaps**
   - `blueprints` 表缺少 `forked_from` 欄位
   - `branch_forks` 表結構不支援跨藍圖追蹤
   - **優先級**: 🟡 中 (可使用 metadata 欄位暫時解決)

3. **Missing Aggregation Service**
   - BlueprintFacade 等待整合
   - **優先級**: 🔴 高 (Week 1)

---

## 📚 文件更新計畫

### 需要更新的文件

1. **COMPONENT-MAPPING-REPORT.md**
   - 每完成一個 Facade/元件，更新狀態
   - 標記為 "✅ Completed"

2. **BLUEPRINT-FACADE-IMPLEMENTATION.md**
   - 新增整合範例
   - 補充最佳實踐

3. **新增文件** (每個 Facade)
   - `AUTH-FACADE-IMPLEMENTATION.md`
   - `REALTIME-FACADE-IMPLEMENTATION.md`
   - `STORAGE-FACADE-IMPLEMENTATION.md`
   - 等等...

4. **README.md**
   - 更新架構說明
   - 新增快速開始指南

---

## ✅ 驗收標準總覽

### Code Quality
- ✅ TypeScript strict mode
- ✅ 無 ESLint 錯誤
- ✅ 所有測試通過
- ✅ 建置成功無警告

### Architecture
- ✅ Facade pattern 正確實作
- ✅ Signal-based 狀態管理
- ✅ Repository pattern 遵循
- ✅ 無元件直接呼叫 Supabase

### Testing
- ✅ 單元測試覆蓋率 85%+
- ✅ 整合測試涵蓋關鍵流程
- ✅ E2E 測試 (可選)

### Documentation
- ✅ JSDoc 完整
- ✅ README 更新
- ✅ 使用範例齊全
- ✅ 架構圖更新

---

## 🚀 快速開始 (團隊成員)

### 認領任務

1. 查看 [GitHub Projects](https://github.com/7Spade/ng-alain-gighub/projects) 
2. 選擇一個未指派的任務
3. 建立分支: `feat/<facade-name>-implementation`
4. 依照本文件的技術規格開始實作
5. 提交 PR 並請求 code review

### 開發流程

```bash
# 1. 建立分支
git checkout -b feat/auth-facade-implementation

# 2. 實作 Facade
# 參考 blueprint.facade.ts 模式

# 3. 撰寫測試
# 參考 blueprint.facade.spec.ts 模式

# 4. 執行測試
yarn test

# 5. 建置檢查
yarn build

# 6. 提交變更
git add .
git commit -m "feat(core): implement AuthFacade with comprehensive tests"

# 7. 推送並建立 PR
git push origin feat/auth-facade-implementation
```

### Code Review Checklist

審查者請檢查：
- [ ] 遵循 Facade pattern
- [ ] Signal-based 狀態管理
- [ ] 完整的 JSDoc
- [ ] 測試覆蓋率 85%+
- [ ] 無 TypeScript errors
- [ ] 建置成功
- [ ] 文件已更新

---

## 📞 聯絡與支援

### 問題回報
- GitHub Issues: [建立 Issue](https://github.com/7Spade/ng-alain-gighub/issues/new)
- 標籤使用: `facade`, `component`, `bug`, `enhancement`

### 技術討論
- GitHub Discussions: 架構討論
- PR Comments: 程式碼審查

### 緊急聯絡
- 專案負責人: @7Spade
- 技術負責人: Development Team

---

## 📝 附錄

### A. 參考資料

1. **架構文件**
   - [元件模組視圖](./11-元件模組視圖.mermaid.md)
   - [元件模組視圖補充](./12-元件模組視圖-補充.md)
   - [完整架構流程圖](./27-完整架構流程圖.mermaid.md)

2. **實作指南**
   - [開發作業指引](./00-開發作業指引.md)
   - [測試指南](./38-測試指南.md)
   - [SHARED_IMPORTS 使用指南](./45-SHARED_IMPORTS-使用指南.md)

3. **API 文件**
   - [API 介面映射圖](./16-API-介面映射圖.mermaid.md)
   - [Supabase 架構流程圖](./17-Supabase架構流程圖.mermaid.md)

### B. 技術棧版本

- Angular: 20.3.x
- NG-ZORRO: 20.3.x
- NG-ALAIN: 20.1.x
- TypeScript: 5.x
- Node.js: 20.19.5
- Yarn: 4.9.2

### C. 常見問題

**Q: 為什麼 Facade 這麼重要？**
A: Facade 提供統一介面，簡化元件邏輯，便於測試和維護，並確保架構一致性。

**Q: 測試覆蓋率目標為何設定 85%+？**
A: 這是企業級專案的標準，確保程式碼品質和可靠性。

**Q: 如何處理現有不符標準的程式碼？**
A: 在 mapping report 中標記為 Partial，制定漸進式重構計畫。

**Q: Storybook 是必須的嗎？**
A: 對於共用元件強烈建議，有助於元件展示和文件化。

---

**文件結束**

**下次更新**: 完成 Week 1 任務後
**維護者**: 開發團隊
**版本**: v1.0
