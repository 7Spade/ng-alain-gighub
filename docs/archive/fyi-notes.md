# 一般備忘 (FYI - Notes)

> 參考：[@fyi.md](./fyi.md)

用來放置暫存筆記、靈感、研究結果、未分類但值得保留的資訊。

- --

## 開發方法論

### Sequential Thinking + Software Planning Tool

**使用場景**：
- 複雜任務的分析和拆解
- 實施計劃的制定和驗證
- 問題診斷和解決方案設計

**工作流程**：
1. 使用 Sequential Thinking 進行系統性分析
2. 使用 Software Planning Tool 創建實施計劃
3. 逐步實施並驗證
4. 記錄決策和權衡

**參考文檔**：
- [Sequential Thinking 與 Software Planning Tool 方法論](./DISCUSSION-Sequential-Thinking-Planning-Tool-方法論.md)

- --

## 技術研究筆記

### Angular 20 現代特性

**Standalone Components**：
- 所有新組件使用 Standalone 模式
- 避免 NgModules，簡化依賴管理
- 使用 `SHARED_IMPORTS` 統一導入

**Signals 狀態管理**：
- 使用 `signal()` 創建響應式狀態
- 使用 `computed()` 創建派生狀態
- 使用 `effect()` 處理副作用（謹慎使用）

**現代控制流**：
- 使用 `@if`, `@for`, `@switch` 替代 `*ngIf`, `*ngFor`, `[ngSwitch]`
- 使用 `track` 函數優化 `@for` 性能
- 使用 `@defer` 實現漸進式懶加載

- --

## 架構設計筆記

### Repository 模式實施

**設計決策**：
- BaseRepository 提供通用 CRUD 操作
- 自動處理 snake_case ↔ camelCase 轉換
- 統一錯誤處理機制

**擴展方式**：
1. 定義類型（從 `database.types.ts` 提取）
2. 繼承 `BaseRepository`
3. 設置 `tableName`

**參考**：
- [基礎設施模組實施總結](./基礎設施模組實施總結.md)

- --

## 性能優化筆記

### Bundle 大小優化

**當前狀態**：
- Bundle 大小：3.49 MB（超過預算 2.00 MB）
- 需要優化：代碼分割、懶加載、Tree Shaking

**優化策略**：
- 使用 `@defer` 實現漸進式懶加載
- 路由懶加載
- 動態導入大型依賴

- --

## 問題診斷筆記

### RLS 遞歸問題

**問題**：accounts 表 RLS 策略存在遞歸查詢

**解決方案**：使用 SECURITY DEFINER 函數

**參考**：
- [Supabase-RLS遞歸問題處理方法.md](./Supabase-RLS遞歸問題處理方法.md)
- [工作總結-完整流程-accounts-RLS修復-2025-01-15.md](./工作總結-完整流程-accounts-RLS修復-2025-01-15.md)

- --

## 開發靈感

### 狀態管理最佳實踐

**單例服務的狀態是全局的**：
- 多個組件共享同一個服務實例時，狀態會互相影響
- 避免在子組件中修改父組件依賴的狀態
- 優先加載主要功能，輔助功能非阻塞加載

**參考案例**：
- [工作總結-組織管理頁面無限加載問題修復-2025-01-15.md](./工作總結-組織管理頁面無限加載問題修復-2025-01-15.md)

- --

## 待研究項目

### 性能優化

- [ ] Bundle 大小優化（當前 3.49 MB > 2.00 MB 預算）
- [ ] 代碼分割策略
- [ ] 懶加載優化
- [ ] Tree Shaking 優化

### 測試覆蓋率

- [ ] 單元測試覆蓋率提升至 80%+
- [ ] E2E 測試實施
- [ ] 關鍵業務邏輯 100% 覆蓋

### 功能增強

- [ ] CreateBotComponent 擴展（添加組織選擇器）
- [ ] 類型定義更新（使用 Supabase MCP 工具重新生成）
- [ ] 權限同步問題修復（`Failed to sync roles: column roles_1.code does not exist`）

- --

## 臨時決策記錄

### 2025-01-15: 模型結構清理

**決策**：統一使用 `types.ts` 命名，刪除 `.model.ts` 後綴

**原因**：
- 統一文件結構，提升可維護性
- 消除混淆，避免技術債務

**結果**：
- ✅ 刪除 `activity-log.model.ts` 和 `quality-check.model.ts`
- ✅ 統一文件命名規範

- --

## 參考資源

### 外部資源

- [Angular 官方文檔](https://angular.dev)
- [Supabase 官方文檔](https://supabase.com/docs)
- [ng-alain 官方文檔](https://ng-alain.com)

### 內部文檔

- [開發最佳實踐指南](./guides/development-best-practices.md)
- [SHARED_IMPORTS 使用指南](./reference/shared-imports-guide.md)
- [Agent 開發指南與限制說明](./guides/agent-development-guide.md)

- --

**最後更新**：2025-01-15
**維護者**：開發團隊


