# Workspace System 遺漏工作項分析報告

> **📋 目的**：全面識別除了已列出的 86 個頁面重新設計工作之外，尚未納入 @workspace 系統的其他工作項

**文件版本**：v1.0  
**分析日期**：2025-01-21  
**分析範圍**：整個 ng-alain-gighub 項目  
**已知工作項**：86 個頁面重新設計（已記錄於 pages-requiring-redesign.md）

---

## 📑 目錄

- [執行摘要](#執行摘要)
- [1. 遺漏的功能模組](#1-遺漏的功能模組)
- [2. 基礎設施工作](#2-基礎設施工作)
- [3. 代碼技術債務](#3-代碼技術債務)
- [4. 服務層整合](#4-服務層整合)
- [5. 共享組件整合](#5-共享組件整合)
- [6. 路由與導航改進](#6-路由與導航改進)
- [7. 數據層優化](#7-數據層優化)
- [8. 文檔完善](#8-文檔完善)
- [9. 實施建議與優先級](#9-實施建議與優先級)
- [附錄：統計數據](#附錄統計數據)

---

## 執行摘要

### 關鍵發現

通過對整個項目的全面掃描，識別出以下 **7 大類別、共計 47 個工作項**尚未納入 workspace 系統文檔：

| 類別 | 工作項數量 | P0 | P1 | P2 | 說明 |
|------|-----------|----|----|----|----|
| 遺漏的功能模組 | 5 | 2 | 2 | 1 | Explore、Dashboard 等未列出的模組 |
| 基礎設施工作 | 12 | 3 | 5 | 4 | 測試、性能、安全、文檔 |
| 代碼技術債務 | 8 | 2 | 4 | 2 | TODO/FIXME 標記的待實現功能 |
| 服務層整合 | 6 | 3 | 2 | 1 | 需要適配 workspace context 的服務 |
| 共享組件整合 | 7 | 1 | 3 | 3 | 共享組件的 context 感知能力 |
| 路由與導航改進 | 4 | 2 | 1 | 1 | URL 結構、導航邏輯優化 |
| 數據層優化 | 5 | 1 | 2 | 2 | Repository、緩存策略優化 |
| **總計** | **47** | **14** | **19** | **14** | |

### 與現有工作的關係

- **已知工作**：86 個頁面重新設計（UI 層面改造）
- **新增工作**：47 個工作項（架構、基礎設施、技術債務）
- **總計**：**133 個工作項**

### 關鍵洞察

1. **功能模組遺漏**：Explore（全局搜索）和 Dashboard（儀表板）模組完全未在 workspace 文檔中提及
2. **基礎設施薄弱**：測試覆蓋率極低（37 個測試 vs 226 個組件），E2E 測試幾乎空白
3. **技術債務累積**：代碼中存在大量 TODO/FIXME 標記（50+ 處），需要系統性清理
4. **服務層適配不足**：20+ 個服務需要適配 workspace context，但未在文檔中規劃
5. **文檔不完整**：workspace 系統的完整使用指南、遷移手冊、最佳實踐等文檔缺失

---

## 1. 遺漏的功能模組

### 1.1 Explore 模組（全局搜索）⭐⭐⭐⭐⭐

**優先級**：P0 - 立即實施  
**關聯性**：強關聯 - 核心功能

#### 現狀分析
- **元件位置**：`src/app/routes/explore/explore.component.ts`
- **功能描述**：全局搜索功能，支援搜索帳戶（Account）和藍圖（Blueprint）
- **當前實現**：已實現基本搜索功能，使用 `ExploreService`
- **workspace 狀態**：❌ 未在 pages-requiring-redesign.md 中列出

#### 問題陳述
Explore 模組是用戶查找組織、團隊、藍圖的核心入口，但未考慮 workspace context：
- 搜索結果未按當前上下文過濾
- 用戶無法選擇「僅搜索當前組織」或「全局搜索」
- 搜索結果不顯示與當前上下文的關聯性

#### 整合需求

**a) 上下文過濾模式**
```typescript
// 需要添加的功能
interface ExploreSearchOptions {
  scope: 'global' | 'current-context' | 'current-org' | 'current-team';
  contextId?: string;
}
```

**b) 搜索結果增強**
- 標記搜索結果是否屬於當前上下文
- 顯示用戶在該組織/團隊中的角色
- 優先顯示當前上下文相關的結果

**c) 快速切換**
- 提供「切換到此組織」按鈕
- 提供「在此組織中打開」選項

#### 實施方案

**階段一：基本整合（1 天）**
1. 注入 `WorkspaceContextFacade`
2. 在搜索 UI 添加上下文過濾選項
3. 修改 `ExploreService.search()` 支援 context 過濾

**階段二：增強體驗（2 天）**
1. 搜索結果顯示上下文標記
2. 添加快速切換功能
3. 優化搜索排序（當前上下文優先）

**注意事項**
- Explore 是全局功能，需保留「全局搜索」選項
- 搜索結果需要考慮權限（用戶可能看不到某些組織）
- 搜索性能優化（大量結果時的分頁處理）

---

### 1.2 Dashboard 模組（儀表板）

**優先級**：P0 - 立即實施  
**關聯性**：強關聯 - 核心功能

#### 現狀分析
- **元件位置**：
  - `src/app/routes/dashboard/workplace/workplace.component.ts`
  - `src/app/routes/dashboard/analysis/analysis.component.ts`
  - `src/app/routes/dashboard/monitor/monitor.component.ts`
  - `src/app/routes/dashboard/v1/v1.component.ts`
- **功能描述**：用戶工作台、數據分析、系統監控儀表板
- **workspace 狀態**：❌ 未在 pages-requiring-redesign.md 中列出

#### 問題陳述
Dashboard 是用戶進入系統後的首頁，應該根據當前上下文顯示不同的數據：
- 個人視角：顯示我的任務、我的通知、我的藍圖
- 組織視角：顯示組織數據、團隊進度、項目統計
- 團隊視角：顯示團隊任務、團隊成員活動、團隊目標

#### 整合需求

**a) Workplace（工作台）**
- 根據上下文顯示不同的數據卡片
- 個人視角：我的待辦、最近活動、快速入口
- 組織視角：組織概覽、項目進度、團隊狀態
- 團隊視角：團隊任務、成員動態、協作看板

**b) Analysis（分析儀表板）**
- 僅組織上下文可用
- 顯示組織級別的數據分析
- 支援跨分支、跨團隊的數據對比

**c) Monitor（監控儀表板）**
- 系統管理員專用
- 不受 workspace context 影響
- 顯示全局系統健康狀態

#### 實施方案

**階段一：Workplace 改造（2 天）**
1. 整合 `WorkspaceContextFacade`
2. 實現三種視角的數據源切換
3. 添加上下文指示器

**階段二：Analysis 整合（1 天）**
1. 限制僅組織上下文可訪問
2. 添加上下文驗證邏輯
3. 根據組織 ID 過濾數據

**注意事項**
- Dashboard 是首頁，需要考慮默認上下文（用戶首次登錄）
- 數據加載性能至關重要（考慮使用緩存）
- 需要優雅的加載狀態與錯誤處理

---

### 1.3 Passport 模組（登錄/註冊）

**優先級**：P1 - 短期實施  
**關聯性**：中關聯 - 輔助功能

#### 現狀分析
- **元件位置**：
  - `src/app/routes/passport/login/login.component.ts`
  - `src/app/routes/passport/register/register.component.ts`
  - `src/app/routes/passport/register-result/register-result.component.ts`
  - `src/app/routes/passport/callback.component.ts`
  - `src/app/routes/passport/lock/lock.component.ts`
- **workspace 狀態**：❌ 未在文檔中考慮

#### 整合需求

**a) 登錄後默認上下文**
- 用戶登錄成功後，應該初始化一個默認的 workspace context
- 如果用戶只屬於一個組織，自動切換到該組織視角
- 如果用戶屬於多個組織，顯示選擇界面或默認使用個人視角

**b) 註冊流程優化**
- 註冊成功後引導用戶創建/加入組織
- 提供快速創建組織的選項
- 引導新用戶理解 workspace context 概念

#### 實施方案
1. 在 `AuthService` 中添加登錄後的上下文初始化邏輯
2. 修改登錄跳轉邏輯，考慮用戶的組織數量
3. 添加首次登錄引導流程

---

### 1.4 Exception 模組（錯誤頁面）

**優先級**：P2 - 長期實施  
**關聯性**：弱關聯 - 輔助功能

#### 現狀分析
- **元件位置**：
  - `src/app/routes/exception/exception.component.ts`
  - `src/app/routes/exception/trigger.component.ts`
- **功能描述**：404、403、500 等錯誤頁面
- **workspace 狀態**：❌ 未考慮

#### 整合需求
- 錯誤頁面應該保留當前的 workspace context
- 「返回首頁」按鈕應該返回當前上下文的首頁
- 403 權限錯誤應該提示切換上下文可能解決問題

---

### 1.5 Demo 模組

**優先級**：P2 - 長期實施  
**關聯性**：無關聯 - 示範代碼

#### 現狀分析
- **元件位置**：`src/app/routes/demo/`
- **功能描述**：ng-alain 框架的示範代碼
- **workspace 狀態**：❌ 不需要整合

#### 建議
Demo 模組是框架示範代碼，建議：
1. 在生產環境中禁用 Demo 路由
2. 或將 Demo 路由移到獨立的路徑（如 `/dev/demo`）
3. 不需要整合 workspace context

---

## 2. 基礎設施工作

### 2.1 測試覆蓋率提升 ⭐⭐⭐⭐⭐

**優先級**：P0 - 立即實施  
**關聯性**：強關聯 - 質量保障

#### 現狀分析
- **當前測試文件數**：37 個 `.spec.ts` 文件
- **組件總數**：226 個 TypeScript 文件
- **測試覆蓋率**：約 16% （估算）
- **E2E 測試**：僅 4 個文件

#### 問題陳述
極低的測試覆蓋率意味著：
1. Workspace Context Manager 整合後缺乏自動化驗證
2. 重構風險極高，容易引入 regression bug
3. 無法保證 86 個頁面改造後的功能正確性

#### 工作項列表

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | Workspace Context 核心服務測試 | P0 | 3 天 | WorkspaceContextFacade 完整單元測試 |
| 2 | 已整合頁面的測試補充 | P0 | 2 天 | 4 個已整合頁面（org, task-board, task-todo, task-assignments） |
| 3 | P0 頁面單元測試（35 個） | P0 | 7 天 | 為 35 個 P0 頁面添加基本單元測試 |
| 4 | P1 頁面單元測試（28 個） | P1 | 6 天 | 為 28 個 P1 頁面添加基本單元測試 |
| 5 | P2 頁面單元測試（22 個） | P1 | 4 天 | 為 22 個 P2 頁面添加基本單元測試 |
| 6 | 共享服務測試 | P1 | 5 天 | 20+ 個共享服務的單元測試 |
| 7 | 核心流程 E2E 測試 | P0 | 5 天 | 登錄→切換上下文→查看數據→創建任務→提交 PR |
| 8 | 上下文切換 E2E 測試 | P1 | 3 天 | 測試各種上下文切換場景 |
| 9 | 權限系統 E2E 測試 | P1 | 3 天 | 測試不同角色在不同上下文下的權限 |
| 10 | 測試工具與輔助函數 | P1 | 2 天 | 創建測試工具類（Mock 工廠、測試數據生成器） |
| 11 | 測試文檔與規範 | P2 | 1 天 | 完善測試指南，添加示範測試 |
| 12 | 持續集成（CI）測試配置 | P2 | 2 天 | 配置 GitHub Actions 自動運行測試 |

**總預估工時**：43 天

#### 實施建議

**階段一：核心功能測試（Week 1-2）**
- 優先為 WorkspaceContextFacade 添加完整測試
- 為已整合的 4 個頁面補充測試
- 建立測試工具庫

**階段二：頁面測試（Week 3-5）**
- 按優先級為頁面添加測試
- 採用測試驅動開發（TDD）方式進行重新設計

**階段三：E2E 測試（Week 6-7）**
- 建立核心業務流程的 E2E 測試
- 建立上下文切換的 E2E 測試

**測試覆蓋率目標**
- P0 完成後：50% 覆蓋率
- P1 完成後：70% 覆蓋率
- P2 完成後：80% 覆蓋率

---

### 2.2 性能優化

**優先級**：P1 - 短期實施  
**關聯性**：強關聯 - 用戶體驗

#### 工作項列表

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | Bundle 大小分析與優化 | P1 | 3 天 | 使用 source-map-explorer 分析，去除未使用的依賴 |
| 2 | 上下文切換性能優化 | P1 | 2 天 | 優化數據加載策略，避免重複請求 |
| 3 | 虛擬滾動實施 | P1 | 5 天 | 為大列表（任務列表、文檔列表）實施虛擬滾動 |
| 4 | 圖片懶加載與優化 | P2 | 3 天 | 照片牆、縮圖等圖片資源優化 |
| 5 | Service Worker 與離線支援 | P2 | 5 天 | PWA 支援，提升載入速度 |

**總預估工時**：18 天

---

### 2.3 安全性加固

**優先級**：P0 - 立即實施  
**關聯性**：強關聯 - 系統安全

#### 工作項列表

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | RLS 策略完整性審查 | P0 | 3 天 | 審查所有 51 張表的 RLS 策略 |
| 2 | 上下文權限驗證 | P0 | 2 天 | 確保前端 context 切換時驗證權限 |
| 3 | XSS 防護審查 | P1 | 2 天 | 審查所有用戶輸入點 |
| 4 | CSRF 防護實施 | P1 | 1 天 | 確保所有 POST/PUT/DELETE 請求有 CSRF token |
| 5 | 敏感數據加密 | P2 | 3 天 | 審查並加密敏感欄位 |

**總預估工時**：11 天

---

### 2.4 文檔完善

**優先級**：P1 - 短期實施  
**關聯性**：中關聯 - 開發者體驗

#### 工作項列表

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | Workspace Context 完整使用指南 | P1 | 2 天 | 詳細的 API 文檔、使用範例、最佳實踐 |
| 2 | 頁面遷移逐步手冊 | P1 | 2 天 | 手把手教學如何將頁面改造為 context-aware |
| 3 | 故障排查指南 | P1 | 1 天 | 常見問題與解決方案 |
| 4 | 架構決策記錄（ADR） | P2 | 2 天 | 記錄 workspace 系統的設計決策 |

**總預估工時**：7 天

---

## 3. 代碼技術債務

### 3.1 TODO/FIXME 標記清理

**優先級**：P0 - 立即實施  
**關聯性**：強關聯 - 功能完整性

#### 現狀分析
代碼掃描發現 **50+ 處 TODO/FIXME 標記**，集中在以下模組：
- Issues 模組：10+ 處
- Documents 模組：20+ 處
- Blueprints 模組：10+ 處
- Tasks 模組：5+ 處

#### 關鍵 TODO 項目

**a) Issues 模組**
```typescript
// issue-form.component.ts
// TODO: 加载蓝图列表
// TODO: 加载任务列表
// TODO: 实现保存逻辑

// issue-detail.component.ts
// TODO: 实现编辑功能

// issue-list.component.ts
// TODO: 加载问题列表
// TODO: 实现删除逻辑

// issue-assignments.component.ts
// TODO: 加载问题分配数据
// TODO: 实现重新分配逻辑
```

**b) Documents 模組**
```typescript
// document-upload.component.ts
// TODO: 加载蓝图列表
// TODO: 实现文件验证逻辑
// TODO: 实现上传逻辑

// document-preview.component.ts
// TODO: 加载文档数据
// TODO: 实现下载逻辑

// document-browser.component.ts
// TODO: 加载当前文件夹内容
// TODO: 实现文件夹导航逻辑
// TODO: 实现创建文件夹逻辑
// TODO: 实现查看详情逻辑
// TODO: 实现删除逻辑

// document-version.component.ts
// TODO: 加载版本列表
// TODO: 实现上传新版本逻辑
// TODO: 实现查看版本逻辑
// TODO: 实现下载版本逻辑
// TODO: 实现回滚版本逻辑
// TODO: 实现对比版本逻辑

// document-metadata.component.ts
// TODO: 加载文档元数据
// TODO: 实现保存逻辑

// document-permission.component.ts
// TODO: 加载权限列表
// TODO: 实现添加权限逻辑
// TODO: 实现编辑权限逻辑
// TODO: 实现删除权限逻辑
// TODO: 实现保存逻辑
// TODO: 实现复制分享链接逻辑

// drawing-viewer.component.ts
// TODO: 加载图纸数据
// TODO: 实现添加批注逻辑
```

**c) Blueprints 模組**
```typescript
// branch-detail.ts
// TODO: 從 AuthStateService 獲取當前用戶ID

// pull-request-list.component.ts
// TODO: 实际应该选择具体的分支，这里简化处理

// pull-request-detail.ts
// TODO: Replace with actual API call

// blueprint-detail.component.ts
// TODO: 实现同步配置功能
// TODO: 实现完整的依赖检查逻辑

// blueprint-settings.component.ts
// TODO: 根据配置填充表单
// TODO: 实现草稿保存
// TODO: 根据 tabKey 保存不同的配置
// TODO: 实现版本历史查看
```

#### 工作項列表

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | Issues 模組 TODO 清理 | P0 | 3 天 | 實現所有標記為 TODO 的功能 |
| 2 | Documents 模組 TODO 清理 | P0 | 5 天 | 實現文檔管理的完整功能 |
| 3 | Blueprints 模組 TODO 清理 | P1 | 3 天 | 完善藍圖管理功能 |
| 4 | Tasks 模組 TODO 清理 | P1 | 2 天 | 完善任務管理功能 |
| 5 | 其他模組 TODO 清理 | P2 | 2 天 | 清理其他零散的 TODO |
| 6 | TODO 標記規範制定 | P2 | 1 天 | 制定 TODO 標記的使用規範，避免累積 |

**總預估工時**：16 天

#### 實施建議
1. 在重新設計頁面時，一併清理該頁面的所有 TODO
2. 優先清理 P0 頁面的 TODO（與頁面重新設計同步進行）
3. 建立 TODO 清理的持續跟蹤機制（如 GitHub Issues）

---

### 3.2 ActivatedRoute 遷移至 WorkspaceContextFacade

**優先級**：P0 - 立即實施  
**關聯性**：強關聯 - 核心重構

#### 現狀分析
- **使用 ActivatedRoute 的組件數**：36 個
- **已遷移組件數**：4 個
- **待遷移組件數**：32 個

#### 工作項
這 32 個組件的遷移已包含在 86 個頁面重新設計工作中，但需要額外關注：

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | 創建遷移工具腳本 | P0 | 2 天 | 自動化識別和替換 ActivatedRoute 的使用 |
| 2 | 遷移驗證清單 | P0 | 1 天 | 確保每個遷移都經過檢查 |

**總預估工時**：3 天

---

## 4. 服務層整合

### 4.1 需要適配 Workspace Context 的服務

**優先級**：P0-P1  
**關聯性**：強關聯 - 數據層整合

#### 服務清單

| # | 服務 | 路徑 | 優先級 | 預估工時 | 整合需求 |
|---|------|------|--------|---------|---------|
| 1 | TaskService | shared/services/task/ | P0 | 2 天 | 根據 context 過濾任務 |
| 2 | IssueService | shared/services/issue/ | P0 | 2 天 | 根據 context 過濾問題 |
| 3 | DocumentService | shared/services/document/ | P0 | 2 天 | 根據 context 過濾文檔 |
| 4 | BlueprintService | shared/services/blueprint/ | P0 | 1 天 | 驗證訪問權限 |
| 5 | BranchService | shared/services/blueprint/ | P1 | 1 天 | 驗證訪問權限 |
| 6 | PullRequestService | shared/services/blueprint/ | P1 | 1 天 | 驗證訪問權限 |
| 7 | NotificationService | shared/services/collab/ | P1 | 2 天 | 根據 context 過濾通知 |
| 8 | CommentService | shared/services/collab/ | P1 | 1 天 | 驗證評論權限 |
| 9 | PersonalTodoService | shared/services/todo/ | P1 | 1 天 | 根據 context 過濾待辦 |
| 10 | QualityCheckService | shared/services/quality/ | P1 | 2 天 | 根據 context 過濾品管數據 |
| 11 | ExploreService | shared/services/explore/ | P1 | 2 天 | 支援 context 過濾搜索 |
| 12 | AnalyticsService | shared/services/analytics/ | P2 | 2 天 | 根據 context 過濾分析數據 |

**總預估工時**：19 天

#### 實施方案

**標準模式：注入 WorkspaceContextFacade**
```typescript
export class TaskService {
  private readonly contextFacade = inject(WorkspaceContextFacade);
  private readonly supabase = inject(SupabaseService);

  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const contextType = this.contextFacade.contextType();
    const contextId = this.contextFacade.contextId();

    let query = this.supabase.client
      .from('tasks')
      .select('*');

    // 根據上下文過濾
    switch (contextType) {
      case 'user':
        query = query.eq('assigned_to', contextId);
        break;
      case 'organization':
        query = query.eq('organization_id', contextId);
        break;
      case 'team':
        query = query.eq('team_id', contextId);
        break;
    }

    // 應用額外過濾條件
    if (filters) {
      // ...
    }

    const { data, error } = await query;
    // ...
  }
}
```

---

### 4.2 WorkspaceMenuService 增強

**優先級**：P1  
**關聯性**：強關聯 - 導航體驗

#### 現狀分析
- **位置**：`src/app/core/services/workspace-menu.service.ts`
- **功能**：根據 workspace context 動態生成菜單
- **問題**：功能可能不完整，需要增強

#### 工作項

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | 菜單權限驗證 | P1 | 2 天 | 根據用戶角色動態隱藏/顯示菜單項 |
| 2 | 菜單狀態持久化 | P1 | 1 天 | 保存用戶的菜單展開/收合狀態 |
| 3 | 快捷鍵支援 | P2 | 2 天 | 為常用菜單項添加快捷鍵 |

**總預估工時**：5 天

---

## 5. 共享組件整合

### 5.1 需要 Context-Aware 的共享組件

**優先級**：P1-P2  
**關聯性**：中關聯 - 可復用性

#### 組件清單

| # | 組件 | 路徑 | 優先級 | 預估工時 | 整合需求 |
|---|------|------|--------|---------|---------|
| 1 | AccountSelectorComponent | shared/components/account-selector/ | P1 | 2 天 | 根據 context 過濾可選帳戶 |
| 2 | TodoWidgetComponent | shared/components/todo-widget/ | P1 | 2 天 | 根據 context 顯示待辦 |
| 3 | PhotoGalleryComponent | shared/components/photo-gallery/ | P1 | 1 天 | 驗證照片訪問權限 |
| 4 | CommentThreadComponent | shared/components/comment-thread/ | P2 | 2 天 | 驗證評論權限 |
| 5 | PermissionGuardComponent | shared/components/permission-guard/ | P2 | 2 天 | 整合 context 權限檢查 |
| 6 | FileUploadComponent | shared/components/file-upload/ | P2 | 1 天 | 根據 context 設定上傳路徑 |
| 7 | ChartWrapperComponent | shared/components/chart-wrapper/ | P2 | 1 天 | 根據 context 過濾數據 |

**總預估工時**：11 天

---

## 6. 路由與導航改進

### 6.1 URL 結構優化

**優先級**：P0  
**關聯性**：強關聯 - 用戶體驗

#### 問題陳述
當前 URL 結構可能不清晰，無法直觀體現 workspace context：
```text
建議：/@myorg/tasks/list 或 /workspace/org/abc123/tasks/list
```

#### 工作項

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | URL 結構設計決策 | P0 | 1 天 | 與團隊討論並確定 URL 結構 |
| 2 | 路由配置重構 | P0 | 3 天 | 重新配置 Angular Router |
| 3 | URL 向後兼容處理 | P0 | 2 天 | 處理舊 URL 重定向 |
| 4 | 深度鏈接支援 | P1 | 2 天 | 確保分享的 URL 可正確打開 |

**總預估工時**：8 天

---

### 6.2 導航守衛增強

**優先級**：P1  
**關聯性**：強關聯 - 安全性

#### 工作項

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | Context 權限守衛 | P1 | 2 天 | 驗證用戶是否有權限訪問該 context |
| 2 | Context 存在性守衛 | P1 | 1 天 | 驗證 contextId 是否有效 |
| 3 | 優雅降級處理 | P1 | 1 天 | 當 context 無效時，自動切換到有效 context |

**總預估工時**：4 天

---

## 7. 數據層優化

### 7.1 Repository Pattern 完善

**優先級**：P1  
**關聯性**：中關聯 - 架構優化

#### 工作項

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | Context-Aware Repository 基類 | P1 | 2 天 | 創建 BaseRepository，自動處理 context 過濾 |
| 2 | 重構現有 Service 使用 Repository | P1 | 5 天 | 將現有 Service 改為使用 Repository Pattern |
| 3 | Repository 單元測試 | P2 | 3 天 | 為所有 Repository 添加測試 |

**總預估工時**：10 天

---

### 7.2 緩存策略優化

**優先級**：P2  
**關聯性**：中關聯 - 性能優化

#### 工作項

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | Context-Based 緩存鍵 | P2 | 2 天 | 緩存鍵包含 context 信息 |
| 2 | 緩存失效策略 | P2 | 2 天 | Context 切換時清除相關緩存 |
| 3 | 智能預加載 | P2 | 3 天 | 預測用戶可能切換的 context 並預加載數據 |

**總預估工時**：7 天

---

## 8. 文檔完善

### 8.1 開發者文檔

**優先級**：P1  
**關聯性**：強關聯 - 開發者體驗

#### 工作項

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | Workspace Context API 完整文檔 | P1 | 2 天 | 詳細的 API 參考文檔 |
| 2 | 頁面遷移教程 | P1 | 2 天 | 逐步教程，包含實例代碼 |
| 3 | 常見問題解答（FAQ） | P1 | 1 天 | 收集並解答常見問題 |
| 4 | 最佳實踐指南 | P1 | 2 天 | Do's and Don'ts |
| 5 | 故障排查指南 | P2 | 1 天 | 調試技巧與工具 |
| 6 | 架構決策記錄（ADR） | P2 | 2 天 | 為什麼選擇這樣的設計 |

**總預估工時**：10 天

---

### 8.2 用戶文檔

**優先級**：P2  
**關聯性**：中關聯 - 用戶體驗

#### 工作項

| # | 工作項 | 優先級 | 預估工時 | 說明 |
|---|--------|--------|---------|------|
| 1 | Workspace Context 用戶指南 | P2 | 2 天 | 什麼是 workspace、如何切換 |
| 2 | 快速入門教程 | P2 | 1 天 | 新用戶 5 分鐘上手 |
| 3 | 視頻教程 | P2 | 3 天 | 錄製操作視頻 |

**總預估工時**：6 天

---

## 9. 實施建議與優先級

### 9.1 總體時程規劃

#### 統計總覽

| 階段 | 優先級 | 工作項數量 | 預估工時（天） | 預估週數 |
|------|--------|-----------|--------------|---------|
| 階段一 | P0 | 14 | 54 | 11 週 |
| 階段二 | P1 | 19 | 84 | 17 週 |
| 階段三 | P2 | 14 | 46 | 9 週 |
| **總計** | | **47** | **184** | **37 週** |

#### 與現有工作的整合

**已知工作**：86 個頁面重新設計
- P0：35 個頁面（2 週）
- P1：28 個頁面（2 週）
- P2：22 個頁面（2 週）
- 總計：6 週

**新增工作**：47 個工作項（本報告識別）
- 37 週（按序執行）
- 可與頁面重新設計並行：約 20 週

**總時程預估**：
- 樂觀估計（高度並行）：20 週（5 個月）
- 現實估計（部分並行）：30 週（7.5 個月）
- 保守估計（序列執行）：43 週（10.75 個月）

---

### 9.2 階段一：P0 工作項（11 週）

#### 關鍵路徑
1. **Week 1-2：測試基礎設施**
   - Workspace Context 核心服務測試
   - 已整合頁面的測試補充
   - 測試工具與輔助函數

2. **Week 3-4：核心功能模組**
   - Explore 模組整合
   - Dashboard 模組整合

3. **Week 5-6：服務層整合**
   - TaskService、IssueService、DocumentService、BlueprintService

4. **Week 7-8：技術債務清理**
   - Issues 模組 TODO 清理
   - Documents 模組 TODO 清理

5. **Week 9：安全性加固**
   - RLS 策略完整性審查
   - 上下文權限驗證

6. **Week 10-11：路由優化**
   - URL 結構設計與重構
   - URL 向後兼容處理

#### 里程碑
- **M1（Week 4）**：核心功能模組整合完成
- **M2（Week 8）**：服務層整合與技術債務清理完成
- **M3（Week 11）**：P0 所有工作項完成，系統可用

---

### 9.3 階段二：P1 工作項（17 週）

#### 關鍵任務
1. **測試覆蓋率提升**
   - P0 & P1 頁面單元測試
   - 共享服務測試
   - 核心流程 E2E 測試

2. **性能優化**
   - Bundle 大小優化
   - 虛擬滾動實施

3. **服務層與組件整合**
   - 剩餘 8 個服務整合
   - 7 個共享組件整合

4. **文檔完善**
   - Workspace Context 完整使用指南
   - 頁面遷移逐步手冊

---

### 9.4 階段三：P2 工作項（9 週）

#### 長期優化
1. **完整測試覆蓋**
   - P2 頁面單元測試
   - E2E 測試補充

2. **性能極致優化**
   - Service Worker 與離線支援
   - 智能預加載

3. **文檔完善**
   - 用戶文檔
   - 視頻教程

---

### 9.5 資源需求

#### 人力需求（建議配置）

| 角色 | 人數 | 職責 | 關鍵技能 |
|------|------|------|---------|
| 前端架構師 | 1 | 整體設計、技術決策、Code Review | Angular 專家、架構設計 |
| 前端開發工程師 | 3-4 | 頁面重新設計、組件開發 | Angular、TypeScript、NG-ZORRO |
| 測試工程師 | 1-2 | 單元測試、E2E 測試、測試工具開發 | Jasmine、Playwright、測試策略 |
| 後端工程師 | 1 | RLS 策略、數據層優化 | Supabase、PostgreSQL、安全性 |
| 技術文檔工程師 | 1 | 文檔撰寫、教程製作 | 技術寫作、視頻製作 |
| **總計** | **7-9** | | |

#### 風險與挑戰

| 風險 | 影響 | 可能性 | 應對措施 |
|------|------|--------|---------|
| 測試覆蓋率提升時間超出預期 | 高 | 高 | 優先核心功能測試，次要功能可延後 |
| 技術債務比預估更多 | 中 | 中 | 設定清理上限，部分債務延後處理 |
| 性能優化效果不明顯 | 低 | 中 | 進行性能基準測試，有數據支撐 |
| 團隊成員對 workspace 概念理解不足 | 高 | 中 | 提前進行培訓，建立知識庫 |
| 用戶抗拒新的上下文切換方式 | 中 | 低 | 提供完整的用戶指南，收集反饋 |

---

## 附錄：統計數據

### A. 代碼庫統計

| 指標 | 數值 | 說明 |
|------|------|------|
| 總組件數 | 226 | 所有 TypeScript 組件文件 |
| 已整合組件數 | 4 | 使用 WorkspaceContextFacade |
| 待整合組件數 | 86 | pages-requiring-redesign.md 列出 |
| 使用 ActivatedRoute 的組件 | 36 | 需要遷移到 WorkspaceContextFacade |
| TODO/FIXME 標記 | 50+ | 需要清理的技術債務 |
| 測試文件數 | 37 | .spec.ts 文件 |
| E2E 測試文件數 | 4 | e2e 目錄 |

### B. 數據表統計（51 張）

| 類別 | 表數量 | 說明 |
|------|--------|------|
| 帳戶與身份系統 | 4 | accounts, teams, team_members, organization_schedules |
| 組織協作系統 | 3 | organization_collaborations, collaboration_invitations, collaboration_members |
| 權限系統 | 5 | roles, user_roles, permissions, role_permissions, branch_permissions |
| 藍圖/專案系統 | 5 | blueprints, blueprint_configs, blueprint_branches, branch_forks, pull_requests |
| 任務執行系統 | 9 | tasks, task_assignments, task_lists, task_staging, daily_reports, 等 |
| 品質驗收系統 | 4 | quality_checks, qc_photos, inspections, inspection_photos |
| 問題追蹤系統 | 4 | issues, issue_assignments, issue_photos, issue_sync_logs |
| 協作溝通系統 | 6 | comments, notifications, notification_rules, 等 |
| 資料分析系統 | 6 | documents, document_versions, progress_tracking, activity_logs, 等 |
| 機器人系統 | 3 | bots, bot_tasks, bot_execution_logs |
| 系統管理 | 2 | settings, feature_flags |
| **總計** | **51** | |

### C. 工作項分類統計

| 類別 | P0 | P1 | P2 | 總計 | 預估工時（天） |
|------|----|----|-------|------|--------------|
| 遺漏的功能模組 | 2 | 2 | 1 | 5 | 9 |
| 基礎設施工作 | 3 | 5 | 4 | 12 | 79 |
| 代碼技術債務 | 2 | 4 | 2 | 8 | 19 |
| 服務層整合 | 3 | 2 | 1 | 6 | 19 |
| 共享組件整合 | 1 | 3 | 3 | 7 | 11 |
| 路由與導航改進 | 2 | 1 | 1 | 4 | 12 |
| 數據層優化 | 1 | 2 | 2 | 5 | 17 |
| 文檔完善 | 0 | 4 | 3 | 7 | 18 |
| **總計** | **14** | **23** | **17** | **54** | **184** |

---

## 結論

### 關鍵要點

1. **工作量顯著增加**：除了 86 個頁面重新設計，還需要額外 47 個工作項，總預估工時從 6 週增加到 20-30 週。

2. **基礎設施薄弱**：測試覆蓋率、性能優化、安全性加固等基礎設施工作需要優先處理，否則會成為長期隱患。

3. **技術債務嚴重**：50+ 處 TODO/FIXME 標記顯示項目存在大量未完成功能，需要在重新設計時一併解決。

4. **服務層是關鍵**：20+ 個服務需要適配 workspace context，這是整個系統正常運作的基礎。

5. **文檔缺失**：缺乏完整的開發者文檔和用戶文檔，會影響團隊協作效率和用戶接受度。

### 建議的執行策略

1. **分階段並行**：P0 工作與 P0 頁面重新設計並行，但測試工作必須先行。

2. **優先建立基礎**：
   - 先建立測試基礎設施和工具
   - 再開始大規模頁面重新設計
   - 確保每個重新設計的頁面都有測試

3. **持續集成**：
   - 每完成一個模組，立即進行集成測試
   - 不要等到所有頁面都完成才開始測試

4. **文檔先行**：
   - 在大規模開發前，先完善開發者文檔
   - 確保團隊成員理解 workspace context 概念

5. **風險管理**：
   - 定期回顧進度和風險
   - 預留 20% 的緩衝時間處理意外情況

---

**報告完成日期**：2025-01-21  
**報告作者**：AI 分析系統  
**下一步行動**：與團隊討論並確定最終實施計劃
