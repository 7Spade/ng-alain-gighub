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

**最後更新**：2025-01-15  
**維護者**：開發團隊
