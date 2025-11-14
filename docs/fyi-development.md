# 開發脈絡記錄 (FYI - Development)

> 參考：[@fyi.md](./fyi.md)

記錄專案在開發過程中的思路、嘗試、技術選型原因、權衡、取捨、重大決策與其背景。

---

## 2025-01-15: 實施階段 1 - 權限服務模組（core/permissions/）

### 背景
根據 PRD 要求和 Git-like 分支模型架構，需要實現完整的 RBAC 權限控制系統。整合 @delon/acl 和 Supabase 數據庫，實現權限檢查、角色管理、分支權限控制等功能。

### 設計決策

#### 技術選型
- **整合 @delon/acl**：使用 ACLService 作為本地權限緩存
  - **原因**：ng-alain 框架已提供完整的 ACL 功能，無需重複造輪
  - **優勢**：與框架深度整合，支持路由守衛、指令等
  - **權衡**：需要適配 Supabase 數據庫權限系統

#### 架構設計
- **獨立類型定義**：創建 `types.ts` 文件，便於未來平坦開發
  - **原因**：用戶要求以未來平坦開發為主
  - **優勢**：類型定義集中管理，易於維護和擴展

#### 性能優化
- **內存緩存策略**：5 分鐘 TTL，減少數據庫查詢
  - **原因**：權限檢查頻繁，每次查詢數據庫會影響性能
  - **權衡**：緩存時間過短會增加查詢，過長會導致權限更新延遲
  - **選擇**：5 分鐘平衡性能和實時性
  - **詳細說明**：參考 [性能優化策略](./fyi-performance.md#權限系統緩存策略)

#### 錯誤處理
- **權限檢查失敗時拋出異常**
  - **原因**：用戶明確要求
  - **優勢**：明確的錯誤處理，便於調試和日誌記錄

#### 日誌記錄
- **規劃文件中提到需要，後續實現 activity_logs 整合**
  - **原因**：PRD 要求活動記錄功能
  - **狀態**：已規劃，待實施

### 實施細節

#### 權限檢查流程設計
```
權限檢查請求
  ↓
1. 檢查 @delon/acl ACLService 本地緩存
  ↓ (如果沒有)
2. 檢查內存緩存（5 分鐘 TTL）
  ↓ (如果沒有)
3. 查詢 Supabase 數據庫（user_roles + role_permissions + permissions）
  ↓
4. 同步到 ACLService 和內存緩存
  ↓
5. 返回權限檢查結果
```

**設計考量**：
- 三層緩存策略：ACLService → 內存緩存 → 數據庫
- 減少數據庫查詢，提升性能
- 自動同步，保持一致性
- **詳細說明**：參考 [性能優化策略](./fyi-performance.md#權限系統緩存策略)

#### 與 @delon/acl 整合策略
- 使用 `ACLService.set({ role: [...], abilities: [...] })` 同步權限
- 使用 `ACLService.can()` 檢查本地緩存
- 自動同步角色和權限到 ACLService

**設計考量**：
- 保留框架原有功能，無需修改業務代碼
- 雙向同步，確保權限一致性

---

## 2025-11-14: Supabase 與 @delon/auth 整合

### 背景
專案需要整合 Supabase 作為後端服務，同時保留現有的 `@delon/auth` 認證系統，確保零破壞性整合。

### 設計決策

#### 適配器模式
- **創建 `SupabaseAuthAdapterService` 作為 Supabase Auth 與 `@delon/auth` 之間的橋樑**
  - **原因**：需要整合兩個不同的認證系統
  - **優勢**：零破壞性，保留所有現有代碼
  - **權衡**：增加一層抽象，但換來兼容性

#### Session 同步機制
- **自動將 Supabase Session 轉換為 @delon/auth Token 格式並同步到 `TokenService`**
  - **原因**：兩個系統的 Session 格式不同
  - **實現**：格式轉換函數 `convertSessionToTokenFormat()`
  - **優勢**：自動同步，無需手動處理

#### 零破壞性整合
- **保留所有現有的 `@delon/auth` 使用方式，無需修改業務代碼**
  - **原因**：避免大規模重構
  - **優勢**：降低風險，快速整合

### 技術細節

#### Session 格式轉換
- `access_token` → `token`
- `refresh_token` → `refresh_token`
- `expires_in` → `expired` (計算過期時間戳)

#### 自動狀態同步
- 監聽 Supabase Auth 狀態變化
- 自動同步到 TokenService
- 應用啟動時自動恢復 Session

---

## 2025-11-14: 註冊功能改為 Supabase Auth，移除手機號登入

### 背景
將註冊功能改為使用 Supabase Auth，並移除登入頁面的手機號登入功能，統一使用 Email/Password 認證方式。

### 設計決策

#### 統一認證方式
- **僅使用 Email/Password 認證，移除手機號登入**
  - **原因**：簡化認證流程，降低維護成本
  - **權衡**：失去手機號登入便利性，但換來一致性

#### 簡化 UI
- **移除登入頁面的 Tab 切換，簡化表單結構**
  - **原因**：只有一種認證方式，無需切換
  - **優勢**：UI 更簡潔，用戶體驗更好

#### 保持一致性
- **註冊和登入都使用 Supabase Auth**
  - **原因**：統一認證流程
  - **優勢**：代碼更一致，維護更容易

---

## 2025-11-14: 移除社交登入功能（其他登入方式、Auth0）

### 背景
移除登入頁面的社交登入功能，包括"其他登入方式"區塊和 Auth0、GitHub、Weibo 等第三方登入選項，統一使用 Supabase Auth 的 Email/Password 認證。

### 設計決策

#### 簡化認證流程
- **僅保留 Supabase Auth 的 Email/Password 認證**
  - **原因**：減少依賴，降低複雜度
  - **權衡**：失去社交登入便利性，但換來系統簡化

#### 移除社交登入
- **移除所有第三方登入選項（Auth0、GitHub、Weibo）**
  - **原因**：不需要第三方認證
  - **優勢**：減少代碼複雜度，降低安全風險

#### 保留註冊連結
- **保留註冊頁面連結，方便新用戶註冊**
  - **原因**：用戶體驗考慮
  - **實現**：移至表單底部並居中顯示

---

## 2025-01-15: 項目結構重構規劃

### 背景
基於 51 張資料表的 11 個業務模組分類、業務流程圖、帳戶層流程圖和實體關係圖，需要重構項目文件夾結構，使其符合 Angular 20 + ng-alain 最佳實踐，並反映 Git-like 分支模型架構。

### 設計決策

#### 分層架構
- **嚴格遵循 `routes` → `shared` → `core` 的依賴方向**
  - **原因**：清晰的依賴關係，避免循環依賴
  - **優勢**：代碼組織更清晰，維護更容易

#### 業務領域驅動
- **按 11 個業務模組組織文件夾結構**
  - **原因**：符合領域驅動設計（DDD）原則
  - **優勢**：業務邏輯清晰，易於擴展

#### Angular 20 最佳實踐
- **使用 Standalone Components、SHARED_IMPORTS、Signals**
  - **原因**：Angular 20 新特性，提升開發體驗
  - **優勢**：代碼更簡潔，性能更好

#### 資料表映射
- **每個業務模組對應相應的資料表集合和數據模型**
  - **原因**：清晰的數據模型映射
  - **優勢**：易於理解和維護

### 技術細節

#### 使用工具
- Context7 查詢 Angular 20 和 ng-alain 最佳實踐
- Sequential Thinking 分析項目結構和業務需求
- Software Planning Tool 創建重構計劃

#### 設計依據
- 業務流程圖
- 帳戶層流程圖
- 實體關係圖
- 51 張資料表結構定義

---

## 2025-01-15: 基礎 RLS 策略實施

### 背景
根據開發前檢查清單，所有 51 張資料表的 RLS 都是 `false`，需要啟用 RLS 確保基本安全性。考慮到開發過程會不斷調整，決定先建立基礎 RLS 策略，後續再逐步完善。

### 設計決策

#### 分階段實施策略
- **先建立基礎 RLS**：確保基本安全性，不阻塞後續開發
  - **原因**：完整的 RLS 策略需要對業務邏輯有深入理解，開發過程中會不斷調整
  - **優勢**：快速建立安全基礎（1-2 天），保持開發靈活性
  - **權衡**：策略較為寬鬆，但為後續細化留下空間

#### 基礎策略設計原則
- **最小權限原則**：只給必要的權限
- **已認證用戶基礎**：所有策略基於 `auth.uid()` 和 `auth.role()`
- **策略命名規範**：`[操作]_[表名]_[描述]`，便於維護
- **註釋說明**：標註 `TODO` 後續調整點

#### 策略分類
1. **accounts 表**：用戶只能操作自己的帳戶
2. **blueprints 表**：擁有者可以操作，已認證用戶可以查看
3. **其他核心表**：先建立最基礎的 SELECT 策略（已認證用戶）
4. **個人資料表**（notifications, personal_todos）：用戶只能查看自己的資料

### 實施細節

#### 遷移腳本結構
```sql
-- 1. 啟用所有 51 張表的 RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
-- ... 其他 50 張表

-- 2. 建立基礎策略
-- accounts 表：用戶只能操作自己的帳戶
CREATE POLICY "Users can view own account"
ON accounts FOR SELECT
TO authenticated
USING (auth.uid() = auth_user_id);

-- blueprints 表：基礎策略
CREATE POLICY "Authenticated users can view blueprints"
ON blueprints FOR SELECT
TO authenticated
USING (true);
-- TODO: 後續根據業務需求調整為更細粒度的權限控制
```

#### 策略覆蓋範圍
- ✅ 所有 51 張表已啟用 RLS
- ✅ 核心表（accounts, blueprints, tasks 等）建立基礎策略
- ✅ 個人資料表建立用戶級別策略
- ⏳ INSERT/UPDATE/DELETE 策略將在開發過程中逐步添加

### 後續完善計劃
- 參考 `docs/21-安全與-RLS-權限矩陣.md` 建立詳細策略
- 整合角色系統（user_roles 表）
- 實現 Git-like 分支權限控制
- 測試和驗證策略正確性

### 技術細節

#### 使用工具
- **Supabase MCP 工具**：執行遷移腳本
- **Context7**：查詢 Supabase RLS 最佳實踐
- **Sequential Thinking**：分析策略設計
- **Software Planning Tool**：規劃實施步驟

#### 驗證方式
```sql
-- 驗證 RLS 是否已啟用
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('accounts', 'blueprints', 'tasks', 'roles', 'permissions');
```

---

## 技術選型總結

### 為什麼選擇 @delon/acl？
- ng-alain 框架已提供完整的 ACL 功能
- 與框架深度整合，支持路由守衛、指令等
- 無需重複造輪，降低開發成本

### 為什麼選擇適配器模式？
- 零破壞性整合，保留所有現有代碼
- 清晰的職責分離
- 易於測試和維護

### 為什麼選擇內存緩存？
- 權限檢查頻繁，需要高性能
- 5 分鐘 TTL 平衡性能和實時性
- 減少數據庫查詢，提升響應速度

### 為什麼統一使用 Email/Password？
- 簡化認證流程，降低維護成本
- 與 Supabase Auth 深度整合
- 減少安全風險

---

## 2025-01-15: 開發順序決策 - 先開發賬戶系統而非藍圖系統

### 背景
在規劃 Phase 1 MVP 開發時，需要決定先開發賬戶系統（Accounts）還是藍圖系統（Blueprints）。使用 Sequential Thinking 和 Software Planning Tool 進行分析，確定最平坦的開發路徑。

### 設計決策

#### 依賴關係分析
- **賬戶系統（Accounts）**：
  - 基礎表，不依賴其他業務模組
  - 被多個系統依賴：
    - `blueprints.owner_id` → `accounts.id`（必須）
    - `teams.organization_id` → `accounts.id`
    - `team_members.account_id` → `accounts.id`
    - 權限系統、協作系統等都依賴 `accounts.id`

- **藍圖系統（Blueprints）**：
  - 依賴賬戶系統：
    - `blueprints.owner_id` → `accounts.id`（外鍵，必須）
    - 創建藍圖時必須提供有效的 `owner_id`
  - 約束：`owner_id` 必須是 `Organization` 類型的賬戶

#### 決策：先開發賬戶系統

**原因**：
1. **依賴方向**：賬戶是底層基礎，藍圖是上層業務
2. **平坦開發**：從基礎到業務，減少依賴複雜度
3. **測試便利**：賬戶系統可獨立測試，藍圖需要賬戶數據
4. **開發效率**：先完成賬戶後，藍圖可直接使用

**權衡**：
- 失去先開發核心業務功能的機會
- 但換來更穩固的基礎和更順暢的後續開發

### 實施計劃

#### 使用工具
- **Sequential Thinking**：分析依賴關係和開發順序
- **Software Planning Tool**：創建詳細實施計劃
- **Context7**：查詢 Angular 20 和 ng-alain 最佳實踐

#### 實施步驟（10 個任務）
1. **數據模型層**（shared/models/account/）- 複雜度：3/10
2. **服務層 - AccountService** - 複雜度：5/10
3. **服務層 - TeamService** - 複雜度：5/10
4. **路由層 - 賬戶列表頁面** - 複雜度：6/10
5. **路由層 - 賬戶詳情/編輯頁面** - 複雜度：5/10
6. **路由層 - 團隊管理頁面** - 複雜度：6/10
7. **路由配置** - 複雜度：3/10
8. **RLS 權限驗證** - 複雜度：4/10
9. **單元測試** - 複雜度：5/10
10. **集成測試和文檔更新** - 複雜度：4/10

**總複雜度**：平均 4.6/10  
**預計時間**：2-3 周

#### 技術要點
- Angular 20 Standalone Components
- Signals 狀態管理
- Repository 模式
- Typed Forms
- RLS 安全策略
- 分層架構（routes → shared → core）

### 後續計劃
完成賬戶系統後，將繼續開發藍圖系統，屆時可直接使用已完成的賬戶服務和數據模型。

---

## 2025-01-15：賬戶系統架構決策反覆

### 背景
在開始實施賬戶系統開發前，需要確定 Repository 和 Service 的正確位置，確保符合項目架構規範。

### 決策反覆過程

#### 第一次評估（初始計劃）
- **假設**：Service 直接使用 SupabaseService（參考 PermissionService 模式）
- **問題**：未充分利用已有的 BaseRepository 基礎設施
- **狀態**：❌ 未採用

#### 第二次評估（發現 Repository）
- **發現**：項目已有完整的 Repository 模式實現（`core/infra/repositories/`）
- **考慮**：是否應該使用 Repository 模式？
- **狀態**：🤔 評估中

#### 第三次評估（架構對齊）
- **分析**：
  - Repository 屬於基礎設施層（core）
  - Service 屬於共享層（shared）
  - 分層架構：routes → shared → core
- **確認**：Service → Repository → SupabaseService 符合分層架構
- **狀態**：✅ 最終決策

### 最終決策

#### Repository 位置
- **位置**：`core/infra/repositories/account.repository.ts`
- **理由**：屬於基礎設施層，已有 BaseRepository 實現
- **優勢**：
  - 自動數據轉換（snake_case ↔ camelCase）
  - 統一錯誤處理
  - 復用通用 CRUD 操作

#### Models 位置
- **位置**：`shared/models/account/types.ts`
- **理由**：類型定義屬於共享層
- **內容**：Account, Team, TeamMember 接口（camelCase）

#### Service 位置
- **位置**：`shared/services/account/account.service.ts`
- **理由**：業務邏輯屬於共享層
- **依賴**：使用 AccountRepository（符合 shared → core 依賴方向）

### 實施順序調整

**原計劃**：
1. Models → Service（直接使用 SupabaseService）

**新計劃**：
1. Models（類型定義）
2. Repository（數據訪問層，使用 BaseRepository）
3. Service（業務邏輯層，使用 Repository）

### 經驗教訓

1. **先評估現有代碼**：在制定計劃前，先全面了解現有代碼結構
2. **文檔與代碼對齊**：文檔規劃可能與實際代碼不一致，應以實際代碼為準
3. **分層架構的重要性**：明確各層的職責和依賴關係
4. **決策反覆的價值**：通過多次評估，找到最佳方案

### 相關文檔
- [結構評估總結](./賬戶系統開發-結構評估總結.md) - 詳細的評估過程和決策記錄
- [Core 基礎設施 README](../src/app/core/infra/README.md) - Repository 模式使用指南

---

---

## 2025-01-15: 基礎設施模組實施

### 背景
根據項目架構規劃和開發需求，需要建立數據訪問層基礎設施，為後續業務開發提供堅實基礎。遵循"先做基礎、方便擴展、開發平順、避免錯誤"的原則。

### 設計決策

#### 技術選型
- **Repository 模式**：封裝 Supabase 客戶端調用，提供統一數據訪問接口
  - **原因**：統一數據訪問邏輯，減少重複代碼，便於測試和維護
  - **優勢**：封裝複雜的 Supabase 查詢邏輯，提供簡潔的 API
  - **權衡**：需要額外的抽象層，但帶來更好的可維護性

#### 類型安全
- **使用 Supabase 生成的類型定義**：確保類型與數據庫結構一致
  - **原因**：類型安全是避免錯誤的關鍵
  - **優勢**：編譯時類型檢查，減少運行時錯誤
  - **實施**：使用 Supabase MCP 工具生成完整的 TypeScript 類型定義

#### 數據轉換
- **自動 snake_case ↔ camelCase 轉換**：數據庫使用 snake_case，TypeScript 使用 camelCase
  - **原因**：遵循各自的最佳實踐，同時保持一致性
  - **優勢**：自動轉換，無需手動處理，減少錯誤
  - **實施**：在 BaseRepository 中自動處理轉換

#### 錯誤處理
- **統一錯誤處理機制**：將 Supabase 錯誤轉換為友好的應用錯誤
  - **原因**：提供一致的錯誤處理體驗
  - **優勢**：錯誤分類和嚴重程度標記，便於處理和調試
  - **實施**：創建錯誤轉換工具，自動轉換 Supabase 錯誤

#### 代碼風格
- **返回 Observable**：與現有代碼風格一致
  - **原因**：項目已使用 RxJS，保持一致性
  - **優勢**：統一的異步處理方式，便於組合和測試
  - **實施**：所有 Repository 方法返回 Observable

### 架構設計

#### 模組結構
```
core/infra/
├── types/              # 類型定義
├── repositories/       # Repository 模式實現
├── errors/            # 錯誤處理
└── utils/             # 工具函數
```

#### BaseRepository 設計
- **抽象類**：提供通用 CRUD 操作
- **泛型支持**：確保類型安全
- **自動轉換**：自動處理數據轉換
- **統一錯誤處理**：自動轉換錯誤

#### 擴展方式
- **繼承 BaseRepository**：只需設置 `tableName` 即可獲得所有 CRUD 操作
- **添加特定方法**：可以添加特定查詢方法
- **三步完成**：定義類型 → 繼承類 → 設置表名

### 實施細節

#### 類型定義生成
- 使用 Supabase MCP 工具生成
- 包含所有 51 張表的類型定義
- 包含類型輔助工具（Tables、TablesInsert、TablesUpdate）

#### BaseRepository 實現
- 通用 CRUD 操作（findAll、findById、create、update、delete）
- 分頁查詢（findPaginated）
- 支持篩選、排序、分頁
- 自動數據轉換
- 統一錯誤處理

#### BlueprintRepository 示例
- 繼承 BaseRepository
- 實現特定查詢方法（findByOwnerId、findByStatus 等）
- 作為其他 Repository 的參考實現

### 權衡與取捨

#### 類型斷言的使用
- **問題**：Supabase 需要字面量類型，但 `tableName` 是運行時值
- **解決方案**：使用類型斷言 `as any`，添加註釋說明
- **權衡**：失去部分類型安全，但獲得靈活性
- **選擇**：使用類型斷言，通過文檔說明

#### 錯誤處理策略
- **問題**：Supabase 錯誤需要轉換為應用錯誤
- **解決方案**：創建錯誤轉換工具，自動轉換
- **權衡**：增加抽象層，但提供更好的錯誤處理
- **選擇**：統一錯誤處理，便於維護

### 經驗教訓

1. **先做基礎**：只提供必要的通用功能，不包含業務邏輯
2. **方便擴展**：通過繼承輕鬆添加新 Repository
3. **開發平順**：自動處理數據轉換和錯誤處理
4. **避免錯誤**：類型安全和統一錯誤處理機制

### 相關文檔
- [專案路線圖](./44-專案路線圖.md) - **專案開發路線圖與里程碑** ⭐ 新增
- [基礎設施模組實施總結](./基礎設施模組實施總結.md) - 詳細實施記錄
- [使用指南](../src/app/core/infra/README.md) - 完整使用指南
- [快速開始](../src/app/core/infra/QUICK_START.md) - 快速開始指南

---

## 2025-01-15: 專案路線圖建立

### 背景
為了更好地規劃和管理專案開發進度，需要建立一個統一的路線圖文檔，記錄開發計劃、里程碑和優先級。

### 決策
- **路線圖位置**：放在 `docs/44-專案路線圖.md`（正式技術文檔區）
  - **原因**：路線圖是面向所有開發者的正式參考文檔，需要定期更新和維護
  - **優勢**：與其他技術文檔放在一起，易於查找和維護
  - **參考**：在 `docs/README.md` 中建立索引，在 `fyi-history.md` 和 `fyi-development.md` 中建立引用

### 路線圖內容
- **當前狀態**：記錄已完成和進行中的工作
- **Phase 1 MVP**：3 個月的開發計劃（Month 1-3）
- **Phase 2 功能增強**：3 個月的增強計劃（Month 4-6）
- **Phase 3 進階功能**：待規劃的擴展方向
- **開發優先級**：P0/P1/P2 優先級分類
- **里程碑**：9 個關鍵里程碑（已完成 4 個，進行中 1 個，待開始 4 個）

### 文檔引用
- 在 `docs/README.md` 中新增「專案規劃（44）」分類
- 在 `fyi-history.md` 的「相關文檔」和「時間線總覽」中加入引用
- 在 `fyi-development.md` 中記錄決策背景

### 後續維護
- 路線圖需要根據專案進度定期更新（建議每月審查一次）
- 里程碑完成後需同步更新狀態
- 重大計劃變更需記錄在 `fyi-development.md` 中

---

## 2025-01-15: 账户系统架构违规修复

### 背景
在账户系统实施过程中，发现了架构依赖违规和路径别名使用错误的问题。这些问题违反了项目的分层架构原则，需要立即修复。

### 设计决策

#### 类型定义位置决策
**问题**：Repository 层需要使用 `AccountType`、`AccountStatus`、`TeamMemberRole` 枚举，但这些枚举最初定义在 `shared` 层。

**决策**：将枚举移到 `core/infra/types/account.types.ts`

**原因**：
- Repository 层属于基础设施层（core）
- 基础设施类型应该在基础设施层定义
- 符合分层架构：`core` 不依赖 `shared`

**权衡**：
- ✅ 架构合规：core 不依赖 shared
- ✅ 职责清晰：基础设施类型在基础设施层
- ⚠️ 需要重新导出：在 shared 层重新导出以保持向后兼容

#### 路径别名使用规范
**问题**：使用 `@core/infra/repositories/team.repository` 深层路径，但路径别名只配置到根导出文件。

**决策**：统一使用根导出

**原因**：
- 路径别名只配置到 `@core` 和 `@shared`，不支持深层路径
- 保持导入路径的一致性
- 简化导入语句

**实施**：
- Service 层：从 `@core` 和 `@shared` 根导出导入
- Repository 层：使用相对路径（core 层内部）
- 组件层：从 `@shared` 根导出导入

### 向后兼容策略

**策略**：在 shared 层重新导出 core 层的类型

**原因**：
- 避免大规模重构现有代码
- 保持现有导入路径不变
- 逐步迁移到新的导入路径

**实施**：
```typescript
// shared/models/account/types.ts
import { AccountType, AccountStatus, TeamMemberRole } from '@core';

// 重新导出，保持向后兼容
export { AccountType, AccountStatus, TeamMemberRole };
```

### 经验教训

1. **分层架构的重要性**：
   - 严格遵循分层架构原则，避免循环依赖
   - 基础设施类型应该在基础设施层定义
   - 在代码审查时检查依赖方向

2. **路径别名使用规范**：
   - 路径别名只配置到根导出文件，不支持深层路径
   - 统一使用根导出，保持导入路径一致性
   - 确保导出链完整

3. **类型定义位置决策原则**：
   - 被 Repository 使用的类型 → 放在 `core/infra/types/`
   - 被 Service 使用的类型 → 可以放在 `shared/models/`
   - 被组件使用的类型 → 可以放在 `shared/models/`

### 相关文档
- [账户系统架构违规修复总结](./账户系统架构违规修复总结.md) ⭐ 详细修复记录
- [分層架構規範](../.cursor/rules/architecture.mdc)

---

## 2025-01-15: 賬戶系統完整評估方法

### 背景
在開始實施賬戶系統 MVP 之前，需要全面評估當前實現狀態，確保實施計劃完整且準確。使用 Sequential Thinking + Software Planning Tool 進行系統性評估。

### 評估方法設計

#### Sequential Thinking 分析流程
1. **理解當前狀態**：分析已完成的工作和進行中的任務
2. **識別缺失功能**：系統性檢查所有相關文件
3. **確定優先級**：基於依賴關係和重要性排序
4. **制定評估清單**：列出需要檢查的所有項目
5. **執行系統性檢查**：文件系統檢查、代碼內容檢查、架構合規性檢查
6. **分析結果**：整理已完成和缺失的功能
7. **更新計劃**：使用 Software Planning Tool 更新實施計劃
8. **確認完整性**：確保所有重要信息都記錄在脈絡文檔中

#### Software Planning Tool 使用
- **創建實施計劃**：記錄所有任務和階段
- **更新任務狀態**：標記已完成和待完成的任務
- **添加詳細說明**：為每個任務提供代碼示例和依賴關係
- **追蹤進度**：實時更新任務完成狀態

### 評估發現

#### 架構合規性驗證
- ✅ **core 層不依賴 shared 層**：使用 grep 檢查，確認 core/infra/repositories 中無 @shared 導入
- ✅ **路徑別名使用正確**：統一使用 @core 和 @shared，不使用深層路徑
- ✅ **類型定義位置正確**：枚舉在 core 層定義，實體類型在 shared 層重新導出

#### 代碼質量檢查
- ✅ **Repository 層**：所有 Repository 正確繼承 BaseRepository，使用統一錯誤處理
- ✅ **Service 層**：AccountService 和 TeamService 使用 Signals 管理狀態，暴露 ReadonlySignal
- ✅ **類型安全**：完整的 TypeScript 類型定義，導出鏈完整

#### 功能完整性檢查
- ✅ **Repository 層**：4 個 Repository 全部完成（100%）
- ⚠️ **Service 層**：2/3 完成（66%），缺 OrganizationScheduleService
- ❌ **UI 層**：1/6 完成（16%），缺 5 個頁面組件
- ❌ **測試**：0% 完成，無單元測試

### 技術決策

#### 評估工具選擇
- **Sequential Thinking**：用於複雜問題的系統性分析
- **Software Planning Tool**：用於任務管理和進度追蹤
- **文件系統工具**：用於檢查文件存在性和目錄結構
- **代碼搜索工具**：用於驗證架構合規性

#### 評估範圍確定
- **Repository 層**：檢查所有 4 個 Repository
- **Service 層**：檢查所有 3 個 Service
- **類型定義**：檢查所有類型定義和導出鏈
- **路由和組件**：檢查所有頁面組件和路由配置
- **架構合規性**：檢查分層架構、路徑別名、類型定義位置

### 經驗教訓

1. **系統性評估的重要性**：
   - 使用 Sequential Thinking 確保不遺漏任何重要環節
   - 使用 Software Planning Tool 記錄所有發現和計劃

2. **架構合規性驗證**：
   - 使用 grep 等工具自動檢查架構違規
   - 定期驗證分層架構和路徑別名使用

3. **完整記錄**：
   - 所有評估結果都應記錄在脈絡文檔中
   - 確保後續開發可以參考評估結果

### 相關文檔
- [歷史紀錄](./fyi-history.md#2025-01-15-賬戶系統完整評估) - 評估記錄
- [專案路線圖](./44-專案路線圖.md) - 更新狀態
- Software Planning Tool - 完整實施計劃

---

---

## 2025-01-15: 賬戶系統 MVP 實施

### 背景
在完成系統性評估後，使用 Sequential Thinking + Software Planning Tool 推進實施，完成了賬戶系統 MVP 的核心功能。

### 實施方法

#### Sequential Thinking 分析流程
1. **理解當前狀態**：分析已完成的工作和缺失的功能
2. **確定優先級**：Service 層優先，UI 層依賴 Service 層
3. **逐步實施**：按依賴關係順序實施
4. **驗證構建**：每個階段完成後驗證構建

#### Software Planning Tool 使用
- 實時更新任務狀態
- 追蹤完成進度
- 記錄實施細節

### 技術決策

#### 字段名處理策略
- **問題**：BaseRepository 會自動轉換 snake_case → camelCase，但類型定義是 snake_case
- **決策**：在組件中統一使用 snake_case 字段名訪問數據
- **原因**：類型定義直接來自數據庫，保持一致性
- **影響**：所有組件都需要使用 snake_case

#### 組件設計模式
- **Standalone Components**：所有組件使用 standalone 模式
- **Signals 狀態管理**：使用 `signal()`, `computed()`, `inject()`
- **Typed Forms**：使用 `FormGroup<{}>`, `FormControl<>` 確保類型安全
- **Angular 20 語法**：使用 `@if`, `@for`, `@switch` 控制流程

#### 錯誤處理策略
- **Service 層**：使用 try-catch 和 Signals 管理錯誤狀態
- **組件層**：使用 NzMessageService 顯示用戶友好的錯誤信息
- **靜默失敗**：非關鍵操作（如加載團隊信息）靜默失敗，不影響主流程

### 經驗教訓

1. **字段名一致性**：
   - 類型定義和實際使用必須保持一致
   - BaseRepository 轉換是運行時行為，類型檢查是編譯時

2. **構建驗證**：
   - 每個階段完成後立即驗證構建
   - 及早發現和修復問題

3. **代碼規範**：
   - 嚴格遵循項目規範（SHARED_IMPORTS, Signals, Typed Forms）
   - 保持代碼風格一致性

### 相關文檔
- [實施完成總結](./账户系统MVP实施完成总结.md) ⭐ 詳細記錄
- [歷史紀錄](./fyi-history.md#2025-01-15-賬戶系統-mvp-實施完成) - 實施記錄
- [專案路線圖](./44-專案路線圖.md) - 更新狀態

---

## 2025-01-15: 賬戶系統 RLS 策略驗證和完善

### 背景
根據安全規範和架構要求，需要為賬戶系統的 4 張表（accounts, teams, team_members, organization_schedules）建立完整的 RLS 策略，確保數據訪問權限正確。

### 設計決策

#### RLS 策略設計原則
- **最小權限原則**：用戶只能訪問自己或所屬組織的數據
- **角色分離**：團隊負責人和組織管理員有額外權限
- **操作分離**：SELECT、INSERT、UPDATE、DELETE 分別控制

#### 策略實施方式
- 使用 Supabase MCP 工具進行遷移
- 先刪除舊策略（如果存在），再創建新策略
- 所有策略使用 `{public}` 角色（適用於所有認證用戶）

### 實施細節

#### accounts 表策略
- **SELECT**：用戶可查看自己的賬戶或所屬的組織賬戶
- **INSERT**：用戶可創建自己的賬戶
- **UPDATE**：用戶可更新自己的賬戶，組織管理員可更新組織賬戶

#### teams 表策略
- **SELECT**：組織成員可查看組織的團隊
- **INSERT**：組織管理員可創建團隊
- **UPDATE**：團隊負責人可更新團隊
- **DELETE**：組織管理員可刪除團隊

#### team_members 表策略
- **SELECT**：團隊成員可查看成員列表
- **INSERT**：團隊負責人可添加成員
- **UPDATE**：團隊負責人可更新成員角色
- **DELETE**：團隊負責人可移除成員，或成員可自己退出

#### organization_schedules 表策略
- **SELECT**：組織成員可查看排班
- **INSERT**：組織管理員可創建排班
- **UPDATE**：組織管理員可更新排班
- **DELETE**：組織管理員可刪除排班

### 驗證結果
- ✅ 共創建 15 個 RLS 策略
- ✅ 覆蓋所有操作類型（SELECT/INSERT/UPDATE/DELETE）
- ✅ 構建驗證通過

---

## 2025-01-15: 組織協作系統 - 數據模型和 Repository 層實施

### 背景
根據項目路線圖，組織協作系統是繼賬戶系統之後的第二個模組。需要完成數據模型層和 Repository 層開發，為後續 Service 層和 UI 層開發奠定基礎。

### 設計決策

#### 分層架構遵循
- **Core 層**：定義枚舉類型（CollaborationType, CollaborationStatus, InvitationStatus）
- **Shared 層**：定義數據模型類型（OrganizationCollaboration, CollaborationInvitation, CollaborationMember）
- **Repository 層**：繼承 BaseRepository，提供業務查詢方法

#### 代碼風格一致性
- 參考賬戶系統的實現方式
- 使用相同的命名規範和代碼結構
- 遵循 Angular 20 最佳實踐

### 實施細節

#### 類型定義（Core 層）
- **CollaborationType**：contractor/subcontractor/consultant/partner
- **CollaborationStatus**：pending/active/suspended/ended
- **InvitationStatus**：pending/accepted/rejected/expired

#### Repository 實現
- **OrganizationCollaborationRepository**：6 個查詢方法
  - findByBlueprintId, findByOwnerOrgId, findByCollaboratorOrgId
  - findByCollaborationType, findByStatus
- **CollaborationInvitationRepository**：6 個查詢方法
  - findByBlueprintId, findByFromOrgId, findByToOrgId
  - findByStatus, findExpired, findPending
- **CollaborationMemberRepository**：3 個查詢方法
  - findByCollaborationId, findByAccountId, findByRole

### 驗證結果
- ✅ 無 Lint 錯誤
- ✅ 類型檢查通過
- ✅ 構建驗證通過（`yarn build` 成功）

### 相關文檔
- [實施完成總結](./组织协作系统-数据模型和Repository层实施总结.md) ⭐ 詳細記錄
- [歷史紀錄](./fyi-history.md#2025-01-15-組織協作系統-數據模型和-repository-層實施) - 實施記錄
- [專案路線圖](./44-專案路線圖.md) - 更新狀態

---

**最後更新**：2025-01-15  
**維護者**：開發團隊
