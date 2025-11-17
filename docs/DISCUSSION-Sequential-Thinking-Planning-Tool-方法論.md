# Sequential Thinking 與 Software Planning Tool 開發方法論討論文檔

> **目的**：討論如何使用 Sequential Thinking 與 Software Planning Tool 作為核心開發方法論，並規劃 ng-alain-src-Read-Only 功能遷移策略

**建立日期**：2025-11-17  
**文檔類型**：方法論討論 + 實施計畫  
**狀態**：待團隊審查

---

## 📋 執行摘要

本文檔透過 **Sequential Thinking** 系統化分析，結合 **Software Planning Tool** 組織管理，評估了從 ng-alain-src-Read-Only 遷移關鍵功能的策略，並建立了一套可追溯、可驗證的開發方法論。

### 核心結論

1. **方法論價值確認** ⭐⭐⭐⭐⭐
   - Sequential Thinking：提供系統化分析框架
   - Software Planning Tool：提供組織追蹤機制
   - Context7 & Supabase MCP：提供即時驗證能力

2. **功能遷移建議** 🎯
   - **高優先級**：天氣預報（2-3天）、照片上傳（5-7天）
   - **中優先級**：Facade Pattern、Repository Layer（漸進式）
   - **低優先級**：多維度模型（需求驅動）

3. **架構對齊確認** ✅
   - 所有決策符合 `docs/01-系統架構思維導圖.mermaid.md`
   - Git-like 分支模型完全支持
   - RLS 權限控制整合完善

---

## 🧠 Sequential Thinking 分析過程

### 思維步驟 1-10：系統化分解

#### 步驟 1：任務理解
- 目標：建立方法論 + 功能遷移規劃
- 範圍：不產生代碼，先討論
- 基礎：系統架構思維導圖 + 功能分析報告

#### 步驟 2：現有資源分析
- 已有完整的功能分析報告（41,412 行）
- 三大功能模組：Tasks（129檔案）、Weather（971行）、Documents（9檔案）
- 明確的優先級建議和 ROI 分析

#### 步驟 3：工具角色定位
- **Sequential Thinking**：複雜功能的拆解、風險評估、決策分析
- **Software Planning Tool**：待辦管理、複雜度評分、進度追蹤
- **Context7**：Angular/NG-ZORRO/Supabase 文檔查詢
- **Supabase MCP**：51 張表 schema 驗證、RLS 政策檢查

#### 步驟 4：功能價值評估
根據分析報告的建議：
- ✅ **天氣預報**：完整實現、低風險、高價值（ROI ⭐⭐⭐⭐⭐）
- ✅ **照片上傳**：用戶需求強烈、中等風險（ROI ⭐⭐⭐⭐⭐）
- ⚖️ **架構模式**：選擇性採用（Facade、Repository、Domain Logic）
- ❌ **完整重構**：成本過高、價值不明確

#### 步驟 5：實施方法論設計
**理想開發工作流程**：
```
分析階段 (Sequential Thinking)
    ↓
規劃階段 (Software Planning Tool)
    ↓
研究階段 (Context7)
    ↓
驗證階段 (Supabase MCP)
    ↓
實施階段 (迭代開發)
    ↓
審查階段 (架構對齊檢查)
```

#### 步驟 6：Context7 與 Supabase MCP 應用

**Context7 典型使用場景**：
- 遷移天氣組件：查詢 "angular 20 signals toSignal toObservable"
- 實作照片上傳：查詢 "supabase storage upload RLS"
- 採用 Facade：查詢 "angular 20 computed signal effect"

**Supabase MCP 典型使用場景**：
- 理解 51 張表：`list_tables`、`execute_sql`
- 驗證 RLS：`execute_sql` 測試政策
- 檢查 migrations：`list_migrations`
- 查詢關聯：複雜 JOIN 驗證

#### 步驟 7：架構思維導圖對齊

必須遵守的核心原則：
1. **Git-like 分支模型**：所有功能必須支持主分支/組織分支分離
2. **RLS 權限控制**：所有資料訪問必須經過 RLS 檢查
3. **Realtime 協作**：新功能應整合 Realtime 訂閱
4. **48小時暫存**：支持暫存與回滾機制

#### 步驟 8：實施流程設計

6 階段迭代開發：
1. **分析** → 使用 Sequential Thinking 拆解
2. **規劃** → 使用 Planning Tool 建立 todos
3. **研究** → 使用 Context7 查文檔
4. **驗證** → 使用 Supabase MCP 檢查
5. **實施** → 編寫代碼
6. **審查** → 架構對齊檢查

#### 步驟 9：選擇性採用原則

**不全盤接受 Read-Only 版本的理由**：
- 當前專案規模：22 檔案 vs Read-Only 129 檔案
- 團隊規模：不適合過度架構
- 時間壓力：需要務實選擇
- 用戶價值：優先交付而非完美架構

**平衡策略**：
- 採用**完整功能**（天氣、照片）
- 學習**架構模式**（Facade、Repository）
- 遵循**設計原則**（Signal、OnPush、TypeScript strict）
- 避免**過度設計**（27模組、13維度）

#### 步驟 10：方法論建立

這不僅是一次性的功能遷移，而是建立了**可追溯、可驗證、可重複**的開發流程：
- 每個決策 → Sequential Thinking 分析
- 每個任務 → Planning Tool 追蹤
- 每個技術選擇 → Context7 驗證
- 每個資料庫變更 → Supabase MCP 檢查

---

## 📊 Software Planning Tool 實施計畫

### 已建立的待辦事項

#### 🔴 階段一：高價值功能遷移（2-3週）

**Todo 1: 天氣預報 - 依賴確認** (複雜度: 3/10)
```
檢查項目：
- WeatherService 是否存在於 @core
- TAIWAN_CITIES 常數定義
- CWA API 授權碼配置
- weather_cache 資料表結構

使用工具：
- Supabase MCP: list_tables, execute_sql
- grep 搜尋現有代碼
```

**Todo 2: 天氣預報 - 組件遷移** (複雜度: 5/10)
```
步驟：
1. 複製 weather.component.ts (971行)
2. 調整 import 路徑
3. 整合路由
4. 測試編譯

使用 Context7：
- "angular 20 signals toSignal"
- "ng-zorro-antd select API"
```

**Todo 3: 天氣預報 - 功能測試** (複雜度: 4/10)
```
測試範圍：
- 3 種資料集切換
- 22 個縣市選擇
- 錯誤處理
- 快取機制

驗證：
- Supabase MCP 檢查 weather_cache 寫入
```

**Todo 4: 照片上傳 - Sequential Thinking 分析** (複雜度: 6/10)
```
分析面向：
1. Storage Bucket 結構設計
2. RLS 政策設計
3. 前端實作方案
4. Git-like 模型對齊

產出：
- 詳細設計文檔
- 風險評估
- 實施步驟
```

**Todo 5: 照片上傳 - Storage 與 RLS** (複雜度: 7/10)
```
實施：
1. 建立 'report-photos' bucket
2. 配置 RLS 政策（上傳、查看）
3. 建立 migration
4. 測試權限

使用 Supabase MCP：
- apply_migration
- execute_sql 測試
```

**Todo 6: 照片上傳 - 前端 UI** (複雜度: 6/10)
```
實施：
1. PhotoUploadComponent 建立
2. NG-ZORRO Upload 整合
3. 整合到 daily-report-form
4. 預覽與進度顯示

使用 Context7：
- "ng-zorro-antd upload custom request"
- "angular 20 signal output"
```

#### 🟡 階段二：架構優化（4週）

**Todo 7: Facade Pattern 引入** (複雜度: 5/10)
```
候選頁面：
- Dashboard (複雜聚合)
- Quality Review (多資料源)
- Task Detail (多維度)

評估標準：
- 狀態複雜度
- 資料來源數量
- Effect 需求

產出：
- 範例實作
- 重構對比
```

**Todo 8: Repository 層建立** (複雜度: 6/10)
```
目標：
- TaskRepository
- BlueprintRepository
- QualityRepository
- IssueRepository

策略：
- 新功能優先使用
- 漸進式遷移
- 保持向後相容
```

---

## 🔧 工具整合方案

### 1. Context7 使用指南

#### Angular 20 查詢範例
```bash
# Signal APIs
context7 query "angular 20 signal computed effect"
context7 query "angular 20 signal inputs outputs"
context7 query "angular 20 viewChild contentChild queries"

# Forms
context7 query "angular 20 typed forms"
context7 query "angular 20 reactive forms signals"
```

#### NG-ZORRO 查詢範例
```bash
# 組件 API
context7 query "ng-zorro-antd 20 upload component"
context7 query "ng-zorro-antd 20 select component"
context7 query "ng-zorro-antd 20 modal service"
```

#### Supabase 查詢範例
```bash
# Storage
context7 query "supabase storage upload typescript"
context7 query "supabase storage RLS policies"

# Auth
context7 query "supabase auth session typescript"
context7 query "supabase auth JWT claims"
```

### 2. Supabase MCP 使用指南

#### Schema 檢查
```typescript
// 列出所有表
supabase.list_tables()

// 檢查特定表結構
supabase.execute_sql("SELECT * FROM information_schema.columns WHERE table_name = 'report_photos'")

// 檢查 Foreign Keys
supabase.execute_sql("SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY'")
```

#### RLS 政策驗證
```typescript
// 查看現有政策
supabase.execute_sql("SELECT * FROM pg_policies WHERE tablename = 'tasks'")

// 測試政策（以特定用戶身份）
supabase.execute_sql("SET LOCAL ROLE authenticated; SELECT * FROM tasks WHERE id = '...'")
```

#### Migration 管理
```typescript
// 列出所有 migrations
supabase.list_migrations()

// 執行 migration
supabase.apply_migration("add_report_photos_bucket", "CREATE POLICY ...")
```

### 3. 工作流程整合範例

#### 範例場景：實作照片上傳功能

**Step 1: Sequential Thinking 分析**
```
使用 Sequential Thinking 拆解：
1. Storage 結構設計
2. RLS 權限分析
3. 前端 UI 設計
4. 資料流規劃
5. Git-like 模型對齊
6. 測試策略
7. 風險評估
8. 回滾計畫
```

**Step 2: Software Planning Tool 規劃**
```
建立 todos：
- [複雜度 6] Storage Bucket 設計與實作
- [複雜度 7] RLS 政策配置
- [複雜度 6] PhotoUploadComponent 實作
- [複雜度 5] 整合到 daily-report-form
- [複雜度 4] 單元測試編寫
- [複雜度 3] E2E 測試編寫
```

**Step 3: Context7 研究**
```bash
# 查詢最佳實踐
context7 query "supabase storage upload multiple files"
context7 query "ng-zorro-antd upload component custom request"
context7 query "angular 20 signal form control"
```

**Step 4: Supabase MCP 驗證**
```typescript
// 檢查 report_photos 表結構
supabase.execute_sql(`
  SELECT 
    column_name, 
    data_type, 
    is_nullable
  FROM information_schema.columns
  WHERE table_name = 'report_photos'
`)

// 檢查現有 Storage buckets
supabase.execute_sql("SELECT * FROM storage.buckets")

// 測試 RLS 政策
supabase.execute_sql(`
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claims TO '{"sub": "user-123"}';
  INSERT INTO storage.objects (bucket_id, name, owner) 
  VALUES ('report-photos', 'test/photo.jpg', 'user-123');
`)
```

**Step 5: 實施開發**
```typescript
// 實際編寫代碼
// 參考 Context7 查詢結果
// 使用 Planning Tool 更新狀態
```

**Step 6: 架構審查**
```
檢查清單：
✅ 符合 Git-like 分支模型
✅ RLS 政策完整覆蓋
✅ Signal-based 響應式
✅ OnPush 變更檢測
✅ TypeScript strict 模式
✅ 單元測試覆蓋 80%+
```

---

## 📈 功能遷移策略

### 從 ng-alain-src-Read-Only 學到什麼

#### ✅ 應該採用的內容

**1. 完整功能模組**
- **天氣預報組件** (971行)
  - 理由：完整實現、生產級品質、獨立性高
  - ROI：⭐⭐⭐⭐⭐
  - 風險：低
  - 時間：2-3 人天

- **照片上傳模式**
  - 理由：用戶強烈需求、功能缺失
  - ROI：⭐⭐⭐⭐⭐
  - 風險：中（Storage 整合）
  - 時間：5-7 人天

**2. 架構模式（選擇性）**
- **Facade Pattern** - 複雜狀態管理
  - 適用：Dashboard、Analytics、複雜表單
  - 不適用：簡單 CRUD、單一資料源頁面

- **Repository Pattern** - 資料訪問抽象
  - 適用：核心業務邏輯
  - 策略：漸進式遷移，新功能優先

- **Domain Logic 分離** - 純函數業務規則
  - 適用：複雜計算、可重用邏輯
  - 優點：易測試、可重用

**3. 設計原則**
- Signal-based 響應式架構
- OnPush 變更檢測策略
- TypeScript strict 模式
- Standalone Components

#### ❌ 不應採用的內容

**1. 過度拆分的結構**
- 27 個子功能模組（vs 當前 14 頁面）
- 理由：當前規模不需要、維護成本高
- 替代：功能導向模組化，適度拆分

**2. 完整的多維度模型**
- 13 個維度完整實現
- 理由：過度設計、實施成本高（20-30人天）
- 替代：需求驅動，逐步擴展

**3. 大規模重構**
- Feature-First 完整重組
- 理由：破壞性大、價值不明確
- 替代：evolutionary architecture，漸進式改進

#### ⚖️ 選擇性採用的內容

**Facade Pattern 使用時機**
```
✅ 適合使用：
- 複雜狀態管理（5+ signals）
- 多資料來源協調（3+ repositories）
- 實時更新需求（多個 effects）
- 複雜業務邏輯

❌ 不適合使用：
- 簡單 CRUD 頁面
- 單一資料來源
- 靜態展示頁面
- 無狀態組件
```

**Repository Pattern 使用時機**
```
✅ 適合使用：
- 核心業務邏輯
- 需要高測試覆蓋
- 複雜查詢邏輯
- 多處重用的資料訪問

❌ 不適合使用：
- 簡單的單表查詢
- 一次性使用的查詢
- 效能敏感的直接訪問
```

---

## 🎯 實施路線圖

### Phase 1: 快速價值交付（Sprint 1-2，2-3週）

**Week 1-2: 天氣預報遷移**
- Day 1-2: 依賴確認與環境準備
- Day 3-4: 組件複製與整合
- Day 5: 功能測試與 Bug 修復

**交付物**：
- ✅ 完整天氣預報功能
- ✅ 3 種資料集支持
- ✅ 22 縣市覆蓋
- ✅ 測試通過

**Week 2-3: 照片上傳實作**
- Day 1-2: Sequential Thinking 分析與設計
- Day 3-5: Storage Bucket 與 RLS 設置
- Day 6-8: 前端 UI 實作
- Day 9-10: 整合測試

**交付物**：
- ✅ Storage bucket 已配置
- ✅ RLS 政策已部署
- ✅ PhotoUploadComponent 已實作
- ✅ 整合到日報表單
- ✅ 測試覆蓋率 80%+

### Phase 2: 架構提升（Sprint 3-4，4週）

**Week 3-4: Facade Pattern 引入**
- 選擇 2-3 個複雜頁面
- 實作 Facade 範例
- 重構與測試
- 文檔更新

**交付物**：
- ✅ DashboardFacade
- ✅ QualityReviewFacade
- ✅ 使用指南文檔
- ✅ 重構前後對比報告

**Week 5-6: Repository 層建立**
- 建立 4 個核心 Repository
- 遷移現有 Service
- 單元測試編寫
- 使用文檔

**交付物**：
- ✅ TaskRepository
- ✅ BlueprintRepository
- ✅ QualityRepository
- ✅ IssueRepository
- ✅ 測試覆蓋率 85%+

### Phase 3: 持續優化（Long-term）

**持續活動**：
- 新功能採用新模式（Facade、Repository）
- 舊功能漸進式重構
- 測試覆蓋率提升
- 文檔持續更新

**不急於完成**：
- 多維度資料模型（需求驅動）
- Feature-First 重組（保持現狀）
- 全面 Repository 化（漸進式）

---

## 🔐 架構對齊檢查

### 與系統架構思維導圖對齊

所有決策都必須符合 `docs/01-系統架構思維導圖.mermaid.md` 的核心原則：

#### 1. Git-like 分支模型支持

**檢查項目**：
- ✅ 天氣預報：支持藍圖位置自動載入
- ✅ 照片上傳：支持分支隔離、PR 合併
- ✅ Facade Pattern：狀態管理考慮分支切換
- ✅ Repository：查詢自動套用 RLS 分支過濾

**實施要點**：
```typescript
// 所有 Repository 查詢都應包含分支上下文
async getTasks(branchId: string): Promise<Task[]> {
  const { data, error } = await this.supabase
    .from('tasks')
    .select('*')
    .eq('branch_id', branchId)  // ✅ 明確指定分支
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
```

#### 2. RLS 權限控制整合

**檢查項目**：
- ✅ Storage RLS：照片上傳/查看權限
- ✅ Table RLS：所有表都有 RLS 政策
- ✅ Branch Permissions：分支權限檢查
- ✅ JWT Claims：使用 Supabase Auth token

**實施要點**：
```sql
-- 所有 Storage 操作都需要 RLS 政策
CREATE POLICY "Upload photos with branch permission"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'report-photos' AND
  auth.uid() IN (
    SELECT account_id FROM branch_permissions
    WHERE branch_id = (storage.foldername(name))[1]
    AND can_write = true
  )
);
```

#### 3. Realtime 協作機制

**檢查項目**：
- ✅ 照片上傳觸發通知
- ✅ 天氣資料變更廣播
- ✅ 任務狀態更新訂閱
- ✅ 評論與 @mentions

**實施要點**：
```typescript
// 訂閱 Realtime 變更
this.supabase
  .channel(`branch:${branchId}`)
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'report_photos' },
    (payload) => {
      // 更新 UI
      this.photosSignal.update(photos => [...photos, payload.new]);
    }
  )
  .subscribe();
```

#### 4. 48小時暫存機制

**檢查項目**：
- ✅ task_staging 表整合
- ✅ 照片上傳支持暫存
- ✅ 暫存資料可回滾
- ✅ 48 小時自動清理

**實施要點**：
```typescript
// 照片上傳先進暫存區
async uploadPhotoToStaging(file: File, taskId: string): Promise<void> {
  const photoUrl = await this.uploadToStorage(file);
  
  await this.supabase
    .from('task_staging')
    .insert({
      task_id: taskId,
      staging_type: 'photo_upload',
      staging_data: { photo_url: photoUrl },
      expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
    });
}
```

---

## 📊 成功指標

### 方法論指標

**Sequential Thinking 使用率**
- 目標：100% 新功能都經過 Sequential Thinking 分析
- 衡量：分析文檔數量 / 新功能數量
- 預期：每個新功能都有對應的思維拆解文檔

**Software Planning Tool 覆蓋率**
- 目標：100% 開發任務都在 Planning Tool 追蹤
- 衡量：追蹤任務數 / 實際任務數
- 預期：所有 todos 都有複雜度評分和狀態追蹤

**Context7 查詢頻率**
- 目標：技術決策前都查詢文檔
- 衡量：Context7 查詢次數 / 技術決策次數
- 預期：平均每個技術決策查詢 2-3 次

**Supabase MCP 驗證率**
- 目標：100% 資料庫變更都經過驗證
- 衡量：MCP 查詢次數 / Schema 變更次數
- 預期：每次 migration 前後都有驗證查詢

### 功能指標

**交付時效**
- 天氣預報：2-3 天內上線 ✅
- 照片上傳：2 週內完成 ✅
- Facade Pattern：4 週內引入 2-3 個頁面
- Repository Layer：6 週內建立 4 個核心 Repository

**品質指標**
- 測試覆蓋率：新功能 ≥ 80%
- Lint 通過率：100%
- TypeScript `any` 使用：0（或有明確註解）
- RLS 政策覆蓋：100%

**架構指標**
- Git-like 模型支持：100%
- Realtime 整合：關鍵功能 100%
- 48小時暫存支持：寫入操作 100%
- Signal-based 架構：新組件 100%

---

## 🚀 下一步行動

### 立即執行（本週）

1. **團隊審查本文檔** 📋
   - 確認方法論可行性
   - 討論優先級調整
   - 確定時程安排

2. **環境準備** 🔧
   - 確認 Context7 可用性
   - 確認 Supabase MCP 連接
   - 設置 Planning Tool

3. **開始天氣預報遷移** 🌤️
   - 執行 Todo 1: 依賴確認
   - 使用 Sequential Thinking 分析潛在問題
   - 使用 Supabase MCP 檢查 weather_cache

### 短期目標（2週內）

1. **完成天氣預報遷移** ✅
   - 組件複製與整合
   - 功能測試通過
   - 文檔更新

2. **開始照片上傳分析** 🎯
   - Sequential Thinking 詳細分析
   - 設計文檔編寫
   - 風險評估

3. **建立方法論文檔** 📚
   - 工作流程指南
   - 工具使用手冊
   - 最佳實踐範例

### 中期目標（1個月內）

1. **完成照片上傳功能** ✅
2. **引入 Facade Pattern 範例** 🏗️
3. **建立核心 Repository** 📦
4. **測試覆蓋率達標** 🧪

---

## 📚 參考文檔

### 核心文檔
- [系統架構思維導圖](./01-系統架構思維導圖.mermaid.md) - **必讀**
- [ng-alain-src-Read-Only 功能分析報告](../ng-alain-src-Read-Only功能分析報告.md) - **詳細分析**
- [AI 助手角色配置](./41-AI助手角色配置.md) - 方法論補充

### 架構文檔
- [完整架構流程圖](./27-完整架構流程圖.mermaid.md) - Git-like 模型
- [架構審查報告](./28-架構審查報告.md) - 生產就緒檢查
- [帳戶層流程圖](./13-帳戶層流程圖.mermaid.md) - 認證系統
- [完整 SQL 表結構](./30-0-完整SQL表結構定義.md) - 51 張表定義

### 開發指南
- [開發作業指引](./00-開發作業指引.md) - 開發規範
- [SHARED_IMPORTS 使用指南](./45-SHARED_IMPORTS-使用指南.md) - 模組使用
- [測試指南](./38-測試指南.md) - 測試規範
- [錯誤處理指南](./37-錯誤處理指南.md) - 錯誤處理

---

## 💡 關鍵洞察

### 為什麼這個方法論重要？

**1. 可追溯性** 🔍
- 每個決策都有 Sequential Thinking 分析記錄
- 未來可以回顧為什麼做出某個選擇
- 新成員可以快速理解決策脈絡

**2. 可驗證性** ✅
- Context7 確保技術選擇有文檔支持
- Supabase MCP 確保資料庫操作正確
- Planning Tool 確保進度透明可見

**3. 可重複性** 🔄
- 建立標準化的開發流程
- 降低團隊成員差異
- 提升整體開發效率

**4. 風險控制** 🛡️
- 早期識別潛在問題
- 有計劃的風險緩解
- 避免臨時抱佛腳

### 方法論的長期價值

**團隊層面**：
- 知識累積與傳承
- 決策品質提升
- 溝通效率改善

**專案層面**：
- 技術債務減少
- 架構一致性提高
- 維護成本降低

**產品層面**：
- 交付品質穩定
- 用戶價值優先
- 持續改進機制

---

## 🎓 學習與改進

### 本次實踐的學習

1. **Sequential Thinking 的威力** 🧠
   - 系統化拆解避免遺漏
   - 早期發現潛在問題
   - 決策更加理性

2. **Planning Tool 的價值** 📋
   - 複雜度評分幫助估算
   - 進度追蹤提升透明度
   - 優先級調整更靈活

3. **Context7 的必要性** 📚
   - 避免過時資訊誤導
   - 快速獲取最佳實踐
   - 降低技術風險

4. **Supabase MCP 的實用性** 🔧
   - Schema 驗證避免錯誤
   - RLS 測試提升安全
   - Migration 管理更規範

### 後續改進方向

1. **自動化提升** 🤖
   - 整合 CI/CD 流程
   - 自動執行 MCP 檢查
   - 自動生成文檔

2. **模板建立** 📝
   - Sequential Thinking 模板
   - Planning 範本
   - 常見場景腳本

3. **指標追蹤** 📊
   - 建立 Dashboard
   - 追蹤方法論指標
   - 持續優化流程

---

**文檔版本**：v1.0  
**最後更新**：2025-11-17  
**下次審查**：Sprint 1 完成後  
**維護者**：開發團隊

---

> 💡 **關鍵訊息**：這不僅是一份遷移計畫，更是一套**系統化開發方法論**的建立。我們透過 Sequential Thinking 與 Software Planning Tool，結合 Context7 與 Supabase MCP，創造了一個**可追溯、可驗證、可重複**的開發流程。這個方法論將成為團隊的長期資產。
