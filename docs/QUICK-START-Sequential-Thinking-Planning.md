# Sequential Thinking & Software Planning Tool - Quick Start Guide

> **目的**：提供開發者快速參考指南，說明何時及如何使用 Sequential Thinking 與 Software Planning Tool

**最後更新**：2025-11-17  
**版本**：v1.0  
**維護者**：開發團隊

---

## 📋 快速檢查清單

開始任何開發任務前，使用此檢查清單：

### ✅ 階段 1：分析與規劃
- [ ] 評估任務複雜度（1-10）
- [ ] 如果複雜度 > 5，使用 **Sequential Thinking** 進行系統化分析
- [ ] 使用 **Software Planning Tool** 建立任務計畫
- [ ] 分解任務為可管理的子任務

### ✅ 階段 2：研究與驗證
- [ ] 使用 **Context7** 查詢相關技術文檔
- [ ] 使用 **Supabase MCP** 驗證資料庫結構與 RLS
- [ ] 檢查架構對齊性（Git-like 模型、RLS、Signals）

### ✅ 階段 3：實作與審查
- [ ] 遵循 Angular 20 + NG-ZORRO 最佳實踐
- [ ] 使用 Signals 進行狀態管理
- [ ] 編寫單元測試（目標 80%+ 覆蓋率）
- [ ] 執行 lint 和 type-check
- [ ] 進行架構審查

---

## 🎯 決策樹：選擇正確的工具

```
開始新任務
    ↓
評估複雜度
    ↓
├─ 複雜度 1-4/10：簡單任務
│   ├─ 文檔更新 → 直接編輯
│   ├─ CSS 調整 → 直接修改
│   └─ 小型 bug 修復 → 直接修正
│
├─ 複雜度 5-7/10：中等任務
│   ├─ 使用 Software Planning Tool 建立計畫
│   ├─ 使用 Context7 研究技術
│   ├─ 使用 Supabase MCP 驗證資料庫
│   └─ 實作功能
│
└─ 複雜度 8-10/10：高複雜度任務
    ├─ 使用 Sequential Thinking 深入分析
    ├─ 使用 Software Planning Tool 詳細規劃
    ├─ 使用 Context7 深入研究
    ├─ 使用 Supabase MCP 全面驗證
    ├─ 考慮切換至 GPT-5.1-Codex
    └─ 分階段實作
```

---

## 🧠 Sequential Thinking 使用時機

### ✅ 應該使用的情況

| 情境 | 複雜度 | 範例 |
|------|--------|------|
| 架構決策 | 8-10 | 選擇狀態管理模式、設計 API 層級 |
| 多模組重構 | 7-9 | 重組專案結構、更新共用服務 |
| 複雜功能設計 | 6-8 | Git-like 分支功能、即時協作系統 |
| 根因分析 | 5-8 | 複雜 bug 調查、效能問題診斷 |
| 風險評估 | 6-9 | 安全性審查、重大架構變更 |

### ❌ 不需要使用的情況

| 情境 | 複雜度 | 替代方案 |
|------|--------|----------|
| 簡單 CRUD | 3-4 | 直接實作 |
| UI 樣式調整 | 1-2 | 直接修改 |
| 文檔更新 | 1-2 | 直接編輯 |
| 配置變更 | 2-3 | 參考現有配置 |

### 💡 使用範例

**情境：實作照片上傳功能**

```markdown
Sequential Thinking 分析步驟：

Thought 1: 需求理解
- 使用者需要上傳多張照片至日報表
- 照片應支援 Git-like 分支模型
- 必須整合現有的 report_photos 表

Thought 2: Storage 結構分析
- 建立 Supabase Storage bucket 'report-photos'
- 資料夾結構：branch_id/report_id/photo_id.jpg
- 支援 PNG、JPG、HEIC 格式，最大 10MB

Thought 3: RLS 政策設計
- 上傳：具有 branch 寫入權限的使用者
- 查看：具有 branch 讀取權限的使用者
- 刪除：報表擁有者或 branch 管理員

Thought 4: UI 元件規劃
- 使用 NG-ZORRO Upload 元件
- 顯示預覽縮圖
- 進度指示器
- 錯誤處理

Thought 5: 資料流考量
- 上傳至 Storage → 取得 URL → 儲存至 report_photos 表
- 支援暫存機制（48 小時回滾）
- 透過 Supabase Realtime 即時更新

Thought 6: Git-like 模型對齊
- 照片屬於特定分支
- 可透過 PR 合併至主分支
- 分支權限控制存取

Thought 7: 測試策略定義
- 單元測試：上傳服務、元件邏輯
- 整合測試：Storage + 資料庫操作
- E2E 測試：完整上傳流程

Thought 8: 風險評估
- 檔案大小限制（透過驗證緩解）
- Storage 成本（實作壓縮）
- 網路失敗（實作重試邏輯）
```

---

## 📊 Software Planning Tool 使用時機

### ✅ 應該使用的情況

所有功能開發工作都**必須**使用 Software Planning Tool：

- 新功能開發
- Bug 修復（複雜度 > 3）
- 重構工作
- 技術債務清理
- 架構改進

### 複雜度評分參考

| 分數 | 類型 | 描述 | 範例 |
|------|------|------|------|
| 1-2 | 簡單 | 配置、樣式、小修正 | 更新顏色、修改文案 |
| 3-4 | 標準 | CRUD 操作、簡單元件 | 建立表單元件、簡單 API |
| 5-6 | 中等 | 整合、多元件功能 | 照片上傳、篩選器 |
| 7-8 | 高 | 架構變更、複雜整合 | Git-like 分支系統 |
| 9-10 | 極高 | 重大重構、關鍵系統 | 認證系統、資料庫遷移 |

### 💡 使用範例

```typescript
// 開始規劃
software_planning_tool.start_planning({
  goal: "實作照片上傳功能於日報表"
})

// 新增任務
software_planning_tool.add_todo({
  title: "建立 Storage bucket 與 RLS 政策",
  description: `
    步驟：
    1. 在 Supabase Storage 建立 'report-photos' bucket
    2. 配置上傳、查看、刪除的 RLS 政策
    3. 測試不同使用者角色的政策
    4. 記錄 bucket 結構
    
    驗收標準：
    - Bucket 已建立且配置正確
    - RLS 政策已測試並通過
    - 文檔已更新
  `,
  complexity: 7,
  codeExample: `
    CREATE POLICY "Upload with branch permission"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'report-photos' AND
      auth.uid() IN (
        SELECT account_id FROM branch_permissions
        WHERE branch_id = (storage.foldername(name))[1]
        AND can_write = true
      )
    );
  `
})

// 更新狀態
software_planning_tool.update_todo_status({
  todoId: "1234567890",
  isComplete: true
})

// 儲存計畫
software_planning_tool.save_plan({
  plan: "完整實作計畫，包含所有待辦事項..."
})
```

---

## 🔍 Context7 使用指南

### 查詢時機

**實作前**務必使用 Context7 查詢：
- 技術選型決策
- API 使用方式
- 最佳實踐驗證
- 框架能力確認

### 常用查詢模板

#### Angular 20 查詢

```bash
# Signals
"angular 20 signal computed effect"
"angular 20 signal inputs outputs"
"angular 20 toSignal toObservable"

# 表單
"angular 20 typed reactive forms"
"angular 20 form validation signals"

# 元件
"angular 20 standalone components"
"angular 20 viewChild contentChild"
"angular 20 OnPush change detection"
```

#### NG-ZORRO 查詢

```bash
# Upload 元件
"ng-zorro-antd 20 upload component API"
"ng-zorro-antd 20 upload custom request"
"ng-zorro-antd 20 upload file list"

# Table 元件
"ng-zorro-antd 20 table component"
"ng-zorro-antd 20 table pagination"
"ng-zorro-antd 20 table virtual scroll"

# Form 元件
"ng-zorro-antd 20 form validation"
"ng-zorro-antd 20 modal service"
"ng-zorro-antd 20 message service"
```

#### Supabase 查詢

```bash
# Storage
"supabase storage upload typescript"
"supabase storage RLS policies"
"supabase storage multiple files"
"supabase storage public vs private"

# Database
"supabase postgresql RLS"
"supabase realtime subscriptions"
"supabase row level security"

# Auth
"supabase auth JWT claims"
"supabase auth session management"
"supabase auth custom claims"
```

---

## 🗄️ Supabase MCP 使用指南

### 使用時機

**資料庫操作前**務必使用 Supabase MCP：
- 驗證表結構
- 測試 RLS 政策
- 驗證 migrations
- 檢查資料關聯
- 測試複雜查詢

### 常用操作

#### 檢查表結構
```typescript
supabase_mcp.execute_sql({
  query: `
    SELECT 
      column_name, 
      data_type, 
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_name = 'tasks'
    ORDER BY ordinal_position
  `
})
```

#### 驗證 RLS 政策
```typescript
supabase_mcp.execute_sql({
  query: `
    SELECT 
      policyname,
      permissive,
      roles,
      cmd,
      qual,
      with_check
    FROM pg_policies
    WHERE tablename = 'tasks'
  `
})
```

#### 測試政策（模擬使用者）
```typescript
supabase_mcp.execute_sql({
  query: `
    SET LOCAL ROLE authenticated;
    SET LOCAL request.jwt.claims TO '{"sub": "user-123"}';
    
    SELECT * FROM tasks WHERE id = 'task-456'
  `
})
```

---

## 🔄 模型切換策略

### 何時切換模型

| 複雜度 | 建議模型 | 使用情境 |
|--------|----------|----------|
| 8-10 | **GPT-5.1-Codex** | 架構重構、複雜演算法、安全關鍵代碼 |
| 5-7 | **GPT-5-Codex** | 標準功能、服務層、元件開發 |
| 1-4 | **Default** | 簡單變更、文檔、樣式 |

### 切換時機指標

**切換至 GPT-5.1-Codex：**
- 初步使用 GPT-5-Codex 結果不理想
- 任務涉及關鍵業務邏輯或安全性
- 架構決策需要深入分析
- 效能優化至關重要
- 跨多模組的複雜重構

**保持 GPT-5-Codex：**
- 標準功能實作
- 需求明確定義
- 有既有模式可遵循
- 元件層級工作

---

## 📝 實際工作流程範例

### 情境：新增天氣預報功能

#### 步驟 1：評估複雜度
```
複雜度評估：6/10（中等偏高）
- 需要外部 API 整合
- 資料快取機制
- UI 元件開發
- 狀態管理
```

#### 步驟 2：Sequential Thinking 分析
```
使用 Sequential Thinking（8 個思考步驟）
- 需求理解
- API 分析
- 快取設計
- UI 結構
- 狀態管理
- 錯誤處理
- 測試策略
- 效能考量
```

#### 步驟 3：Software Planning Tool 規劃
```typescript
add_todo({ title: "Weather service 整合", complexity: 6 })
add_todo({ title: "快取機制實作", complexity: 5 })
add_todo({ title: "Weather component UI", complexity: 4 })
add_todo({ title: "單元測試", complexity: 4 })
```

#### 步驟 4：Context7 研究
```bash
context7 query "angular 20 http client interceptor"
context7 query "ng-zorro-antd 20 select component"
context7 query "supabase postgresql jsonb queries"
```

#### 步驟 5：Supabase MCP 驗證
```typescript
// 檢查 weather_cache 表
supabase_mcp.execute_sql({
  query: "SELECT * FROM information_schema.columns WHERE table_name = 'weather_cache'"
})
```

#### 步驟 6：實作
```
- 建立 weather.service.ts
- 建立 weather.component.ts
- 新增路由
- 編寫測試
```

#### 步驟 7：架構審查
```
✅ Git-like 模型支援
✅ RLS 政策已套用
✅ Signal-based 狀態
✅ OnPush 變更檢測
✅ TypeScript strict
✅ 測試通過
✅ Lint 通過
```

---

## 🎯 成功指標

追蹤這些指標以確保方法論有效性：

- ✅ 100% 複雜任務（>5/10）使用 Sequential Thinking
- ✅ 100% 功能在 Software Planning Tool 追蹤
- ✅ 每個技術決策 2-3 次 Context7 查詢
- ✅ 100% 資料庫變更透過 Supabase MCP 驗證
- ✅ 100% 合併前架構對齊檢查

---

## 🔗 相關文檔

### 詳細指南
- **完整方法論**：[`docs/DISCUSSION-Sequential-Thinking-Planning-Tool-方法論.md`](./DISCUSSION-Sequential-Thinking-Planning-Tool-方法論.md)
- **詳細說明**：[`.github/instructions/methodology.instructions.md`](../.github/instructions/methodology.instructions.md)
- **開發指引**：[`docs/00-開發作業指引.md`](./00-開發作業指引.md)

### 架構文檔
- **系統架構**：[`docs/01-系統架構思維導圖.mermaid.md`](./01-系統架構思維導圖.mermaid.md)
- **完整架構**：[`docs/27-完整架構流程圖.mermaid.md`](./27-完整架構流程圖.mermaid.md)
- **架構審查**：[`docs/28-架構審查報告.md`](./28-架構審查報告.md)

### 開發規範
- **貢獻指南**：[`CONTRIBUTING.md`](../CONTRIBUTING.md)
- **測試指南**：[`docs/38-測試指南.md`](./38-測試指南.md)
- **錯誤處理**：[`docs/37-錯誤處理指南.md`](./37-錯誤處理指南.md)

---

## ❓ 常見問題

### Q: 什麼時候使用 Sequential Thinking？
**A:** 當任務複雜度 > 5/10，或涉及架構決策、多模組變更時。

### Q: 我必須為所有任務使用 Software Planning Tool 嗎？
**A:** 所有功能開發工作都應使用。簡單的文檔更新或樣式調整可以跳過。

### Q: 如何決定複雜度分數？
**A:** 參考本文檔的複雜度評分表格，考慮：技術難度、影響範圍、風險程度、所需時間。

### Q: 何時應該切換至 GPT-5.1-Codex？
**A:** 當任務複雜度 ≥ 8/10，或涉及關鍵架構決策、複雜演算法、安全關鍵代碼時。

### Q: 我不確定如何對齊架構？
**A:** 查看 `docs/01-系統架構思維導圖.mermaid.md`，確保符合：Git-like 模型、RLS 政策、Signal-based 狀態、OnPush 變更檢測。

---

**版本**：v1.0  
**最後更新**：2025-11-17  
**維護者**：開發團隊
