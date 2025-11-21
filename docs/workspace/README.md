# 工作區系統文檔 (Workspace Context System)

> **目的**: 本目錄包含 ng-alain-gighub 工作區上下文系統的完整文檔

## 目標讀者 (Audience)

- 前端開發者
- 架構師
- 新成員
- AI Agents

## 系統概述

工作區上下文系統是 ng-alain-gighub 專案的核心功能之一，提供**多層級上下文切換**能力，讓使用者能在個人、團隊、組織和專案之間無縫切換，並保持各自獨立的資料視圖。

### 核心特性

- **四層上下文**: 個人 (User) → 團隊 (Team) → 組織 (Organization) → 專案 (Project)
- **上下文隔離**: 各層級資料完全隔離，互不干擾
- **快速切換**: 提供便捷的上下文切換機制
- **狀態保持**: 切換後保持之前的操作狀態

## 文檔清單

### 總覽文檔

- **workspace-context-overview.md** - 工作區上下文功能總覽
  - 系統架構
  - 核心概念
  - 功能特性
  - 使用場景

### 使用指南

- **workspace-context-usage-guide.md** - 工作區上下文使用與規劃指南
  - 使用方式
  - 切換流程
  - 權限管理
  - 最佳實踐

- **workspace-system-quick-reference.md** - 工作區系統快速參考指南
  - 常用操作
  - 快捷鍵
  - 疑難排解
  - Q&A

### 架構設計

- **workspace-context-architecture-review.md** - 工作區上下文系統架構審查
  - 技術架構
  - 資料模型
  - 狀態管理
  - 效能考量

- **workspace-context-switch-flowchart.mermaid.md** - 工作區上下文切換流程圖
  - 切換流程圖
  - 狀態轉換
  - 事件流
  - 錯誤處理

### 上下文菜單文檔

- **user-context-menu-documentation.md** - 個人上下文菜單功能說明
  - 個人資料管理
  - 個人設定
  - 個人任務
  - 個人通知

- **team-context-menu-documentation.md** - 團隊上下文菜單功能說明
  - 團隊管理
  - 成員管理
  - 團隊專案
  - 團隊協作

- **organization-context-menu-documentation.md** - 組織上下文菜單功能說明
  - 組織管理
  - 組織設定
  - 組織專案
  - 權限控制

### 遷移與重新設計文檔 ⭐ **NEW**

- **workspace-context-migration-plan.md** - Workspace Context Manager 頁面重新設計需求明確化文件
  - 86 個需要重新設計的頁面清單
  - 詳細設計需求規範
  - 技術實施指南
  - 優先級與時程規劃（6 週計畫）
  - 測試策略與成功指標

- **pages-requiring-redesign.md** - 需要重新設計的頁面清單（快速查詢版）
  - P0 高優先級頁面（35 個）：核心功能
  - P1 中優先級頁面（28 個）：重要功能
  - P2 低優先級頁面（22 個）：次要功能
  - 按模組和上下文分類統計
  - 核心設計原則與範例代碼

- **workspace-missing-work-items-analysis.md** ⭐⭐⭐ - Workspace 系統遺漏工作項全面分析報告
  - 識別出 **47 個額外工作項**（除了 86 個頁面重新設計）
  - 7 大類別：功能模組、基礎設施、技術債務、服務層、共享組件、路由、數據層
  - 詳細優先級評估（P0: 14 項，P1: 19 項，P2: 14 項）
  - 預估工時：184 天（37 週）
  - 實施建議與時程規劃

- **ANALYSIS-SUMMARY-ZH.md** ⭐ - 遺漏工作項分析報告摘要（中文版）
  - 快速概覽版本，適合快速了解核心發現
  - 關鍵問題突出顯示
  - 實施建議與資源需求
  - 風險與挑戰分析

### Facades 與 Repositories 增強文檔 ⭐⭐⭐ **NEW (2025-01-15)**

- **facades-repositories-enhancement-plan.md** ⭐⭐⭐⭐⭐ - Facades 與 Repositories 基礎方法完整性增強計畫
  - 總體規劃與目標
  - 10 個需要增強的 Facades（Task, Issue, Quality, Document, Account, Collaboration, Communication, Bot, Analytics, System）
  - 拆分原則與參考架構（Blueprint Facade 模式）
  - 缺失方法清單與實施優先級
  - 7 個階段的詳細實施計畫（20-31 天）
  - 程式碼結構規範與成功指標

- **facades-implementation-guide.md** ⭐⭐⭐⭐ - Facades 實施指南
  - 拆分原則與步驟（何時拆分、如何拆分）
  - 7 步驟實施流程（分析、建立、遷移、補充、重構、匯出、測試）
  - 完整程式碼範例（子 Facade、主 Facade 協調器）
  - 常見問題解答（10+ FAQ）
  - 檢查清單（拆分前、中、後）

- **facades-enhancement-checklist.md** ⭐⭐⭐⭐ - Facades 增強檢查清單
  - 總體進度追蹤（7 個 Phase）
  - 每個 Phase 的詳細檢查項目
  - Task Facade 完整檢查清單（60+ 項）
  - Issue Facade 完整檢查清單（40+ 項）
  - Quality Facade 完整檢查清單（50+ 項）
  - 測試與驗證檢查清單
  - 成果統計與經驗總結模板

- **facades-quick-reference.md** ⭐⭐⭐ - Facades 增強快速參考指南
  - 核心概念速查（拆分模式、基礎方法、Signal 狀態）
  - 程式碼模板（子 Facade、主 Facade）
  - 常用命令速查（建立檔案、檢查測試）
  - 缺失方法速查表（Task, Issue, Quality, Document）
  - 優先級排序與時間估算
  - 實用技巧與尋求幫助

- **facades-getting-started.md** ⭐⭐⭐⭐⭐ - Facades 增強開始指南
  - 快速開始（5 分鐘）
  - 工作模式與拆分原則
  - 優先級排序
  - 快速範例與程式碼模板
  - 檢查清單（最小版）
  - 遇到問題的解決方案

- **facades-project-summary.md** ⭐⭐⭐⭐⭐ - Facades 增強計畫 - 專案總結
  - 專案概覽（目標、參考標準）
  - Phase 1 完成總結（文檔、分析、策略）
  - Phase 2-7 實施計畫
  - 統計資訊（工作量估算、檔案統計）
  - 成功指標與學習資源
  - 設計決策與注意事項

- **facades-enhancement-progress-history.md** ⭐⭐⭐⭐⭐ - Facades 增強計畫 - 進度歷程
  - 項目時間線與進度追蹤
  - Phase 1 完成記錄（2025-01-15）
  - Phase 2-7 進度規劃
  - 詳細統計資訊與指標
  - 經驗教訓與改進建議
  - 變更日誌與實施筆記

- **facades-implementation-record.md** ⭐⭐⭐⭐⭐ - Facades 增強 - 實施記錄
  - 詳細實施活動記錄
  - 技術決策日誌（6 個核心決策）
  - 代碼指標與分析
  - 階段性洞察與經驗教訓
  - 未來階段實施筆記
  - 進度追蹤與下一步行動

## 使用方法 (Usage)

### 快速理解系統

推薦閱讀順序：
1. **workspace-context-overview.md** - 了解整體概念
2. **workspace-context-switch-flowchart.mermaid.md** - 理解切換流程
3. **workspace-system-quick-reference.md** - 掌握常用操作

### 深入學習

進階學習路徑：
1. **workspace-context-architecture-review.md** - 深入技術架構
2. **workspace-context-usage-guide.md** - 學習規劃與最佳實踐
3. 各上下文菜單文檔 - 了解具體功能

### 日常開發參考

開發工作區相關功能時：
1. 參考 **workspace-context-architecture-review.md** 了解架構
2. 查閱對應的上下文菜單文檔
3. 使用 **workspace-context-switch-flowchart.mermaid.md** 理解狀態流

### 頁面整合與遷移 ⭐ **NEW**

需要整合 Workspace Context Manager 的開發者：
1. **ANALYSIS-SUMMARY-ZH.md** ⭐ - **中文快速概覽** - 快速了解除了頁面重新設計之外還需要完成的工作
2. **workspace-missing-work-items-analysis.md** ⭐⭐⭐ - **完整英文報告** - 詳細的分析與實施建議
3. **pages-requiring-redesign.md** - 快速查詢需要重新設計的頁面清單（86 個頁面）
4. **workspace-context-migration-plan.md** - 完整的遷移計畫與技術規範
5. 參考已整合的頁面範例（task-board, task-todo, task-assignments）
6. 遵循設計原則：移除 URL 參數、使用 WorkspaceContextFacade、顯示上下文指示器

### Facades 與 Repositories 增強 ⭐⭐⭐ **NEW (2025-01-15, Updated 2025-11-21)**

需要增強 Facades 層和 Repositories 層的開發者：

**快速開始路徑**:
1. **facades-getting-started.md** ⭐⭐⭐⭐⭐ - **5 分鐘開始** - 最快理解整體概念和如何開始
2. **facades-quick-reference.md** ⭐⭐⭐⭐ - **快速參考** - 代碼模板和常用命令
3. **facades-project-summary.md** ⭐⭐⭐⭐⭐ - **專案總結** - 了解 Phase 1 完成狀態和後續計畫

**詳細實施路徑**:
1. **facades-repositories-enhancement-plan.md** ⭐⭐⭐⭐⭐ - **完整計畫** - 了解整體規劃、優先級、時程
2. **facades-implementation-guide.md** ⭐⭐⭐⭐ - **實施指南** - 執行具體實施的詳細步驟（7 步驟）
3. **facades-enhancement-checklist.md** ⭐⭐⭐⭐ - **檢查清單** - 追蹤進度、確保品質（500+ 項）

**進度追蹤**:
1. **facades-enhancement-progress-history.md** ⭐⭐⭐⭐⭐ - **進度歷程** - Phase 1 完成，Phase 2-7 規劃
2. **facades-implementation-record.md** ⭐⭐⭐⭐⭐ - **實施記錄** - 詳細實施日誌、技術決策、經驗教訓

**參考資源**:
- Blueprint Facade 實現：`src/app/core/facades/blueprint/`
- 設計原則：Signal 狀態管理、錯誤處理、活動日誌、主 Facade 協調器模式
- 成功標準：完整性、一致性、可維護性、測試覆蓋

## 核心概念

### 四層上下文結構

```sql
    ↓ 加入
團隊上下文 (Team Context)
    ↓ 隸屬
組織上下文 (Organization Context)
    ↓ 建立
專案上下文 (Project Context)
```

### 上下文切換機制

工作區上下文切換遵循以下原則：
1. **向下切換**: 從高層級切換到低層級（組織 → 團隊 → 個人）
2. **向上切換**: 從低層級切換到高層級（個人 → 團隊 → 組織）
3. **平行切換**: 在同層級之間切換（團隊 A → 團隊 B）
4. **快速切換**: 透過快捷鍵或菜單快速切換

### 資料隔離原則

- **個人資料**: 只有該使用者可見
- **團隊資料**: 只有團隊成員可見
- **組織資料**: 只有組織成員可見
- **專案資料**: 根據專案權限控制

## 技術實現

### 前端實現

```typescript
// 工作區上下文服務
@Injectable({ providedIn: 'root' })
export class WorkspaceContextService {
  // 當前上下文
  private currentContext$ = signal<WorkspaceContext>(...);
  
  // 切換上下文
  switchContext(newContext: WorkspaceContext): void {...}
  
  // 獲取當前上下文資料
  getCurrentData(): Observable<ContextData> {...}
}
```

### 後端實現

使用 Supabase RLS (Row Level Security) 實現資料隔離：

```sql
-- 個人資料 RLS 策略
CREATE POLICY "Users can only see their own data"
ON user_data
FOR SELECT
USING (auth.uid() = user_id);

-- 團隊資料 RLS 策略
CREATE POLICY "Team members can see team data"
ON team_data
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_id = team_data.team_id
    AND user_id = auth.uid()
  )
);
```

## 使用場景

### 場景 1: 個人開發者
個人開發者使用個人上下文管理自己的任務和專案。

### 場景 2: 團隊協作
團隊成員切換到團隊上下文，查看團隊的共享專案和任務。

### 場景 3: 組織管理
組織管理員切換到組織上下文，管理組織下的所有團隊和專案。

### 場景 4: 專案工作
專案成員切換到特定專案上下文，專注於該專案的開發工作。

## 開發指引

### 新增上下文類型

如需新增新的上下文類型：
1. 更新 `WorkspaceContext` 類型定義
2. 實作對應的 RLS 策略
3. 更新前端切換邏輯
4. 新增對應的菜單文檔

### 新增上下文功能

新增上下文相關功能時：
1. 確定功能所屬的上下文層級
2. 實作資料隔離邏輯
3. 更新對應的菜單文檔
4. 新增測試案例

## 疑難排解

### 常見問題

**Q: 切換上下文後資料沒有更新？**
A: 檢查 RLS 策略是否正確，確認快取是否需要清除。

**Q: 無法切換到某個上下文？**
A: 確認使用者是否有該上下文的訪問權限。

**Q: 上下文切換很慢？**
A: 檢查是否有不必要的資料查詢，考慮實作快取機制。

詳見：**workspace-system-quick-reference.md**

## 相關資源 (References)

### 架構設計
- [architecture/20-complete-architecture-flowchart.mermaid.md](../architecture/20-complete-architecture-flowchart.mermaid.md) - Git-like 分支模型
- [architecture/21-architecture-review-report.md](../architecture/21-architecture-review-report.md) - 架構審查

### 資料庫設計
- [reference/sql-schema-definition.md](../reference/sql-schema-definition.md) - 工作區相關表結構
- [architecture/09-security-rls-permission-matrix.md](../architecture/09-security-rls-permission-matrix.md) - RLS 權限矩陣

### 開發指南
- [guides/frontend-state-management-guide.md](../guides/frontend-state-management-guide.md) - 狀態管理
- [guides/rls-policy-development-guide.md](../guides/rls-policy-development-guide.md) - RLS 開發

### 官方文檔
- [Supabase RLS 文檔](https://supabase.com/docs/guides/auth/row-level-security)
- [Angular Signals](https://angular.dev/guide/signals)
- [RxJS](https://rxjs.dev/)

---

## 統計資訊

- **文檔數量**: 19 個工作區文檔
  - 基礎功能文檔：11 個
  - Facades 增強文檔：8 個（新增：3 個進度追蹤文檔）
- **需要整合的頁面**: 86 個（4 個已完成，82 個待處理）
- **額外識別的工作項**: 47 個（基礎設施、技術債務、服務層等）
- **Facades 增強計畫**: 
  - 10 個 Facades（Task, Issue, Quality, Document, Account, Collaboration, Communication, Bot, Analytics, System）
  - 50+ 個缺失方法需要補充
  - 25+ 個子 Facades 需要建立
  - Phase 1 已完成（2025-01-15），Phase 2-7 待實施
- **總工作量預估**: 
  - 頁面重新設計：6 週
  - 額外工作項：20-37 週（取決於並行程度）
  - Facades 增強：4-6 週（可並行進行）
  - 總計：20-30 週（現實估計）
- **功能狀態**: 
  - ✅ 核心功能生產就緒
  - 🔶 頁面整合進行中
  - ✅ Facades 增強規劃完成（Phase 1）
  - 📋 Facades 增強實施待開始（Phase 2-7）
  - ⚠️ 基礎設施需加強

**最後更新**: 2025-11-21  
**維護者**: 前端團隊
