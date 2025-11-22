# 完整檢查清單（企業標準）

## 開發前檢查

### 需求分析（使用 Sequential Thinking）
- [ ] 明確功能需求
- [ ] 確認業務流程和規則
- [ ] 識別相關模組和依賴
- [ ] 評估複雜度和優先級

### 資料庫設計（使用 Supabase MCP）
- [ ] 設計資料表結構
- [ ] 設計 RLS 策略
- [ ] 準備資料庫遷移腳本
- [ ] 驗證設計

### 架構規劃（使用 Software Planning）
- [ ] 確認功能屬於哪個業務模組
- [ ] 規劃需要哪些層級
- [ ] 確認與現有模組的整合點
- [ ] 設計 API 介面（如需要）

## 開發中檢查（按開發順序）

### 第 1 步：Types 層

- [ ] 使用 Supabase MCP 生成/更新 database.types.ts
- [ ] 創建業務模組類型文件（如需要）
- [ ] 類型定義完整，與資料庫結構一致
- [ ] 類型已正確導出
- [ ] 通過 TypeScript 編譯檢查（`yarn type-check`）

**企業標準檢查**：
- [ ] 類型定義遵循 TypeScript 最佳實踐
- [ ] 類型定義完整，無 `any` 類型
- [ ] 類型命名語義化
- [ ] 類型定義可用，編譯無錯誤

### 第 2 步：Repositories 層

- [ ] Repository 繼承自 BaseRepository
- [ ] tableName 已正確設置（snake_case）
- [ ] 類型參數正確（Entity, Insert, Update）
- [ ] 特定查詢方法已實現（如需要）
- [ ] Repository 已正確導出
- [ ] 通過 TypeScript 編譯檢查

**企業標準檢查**：
- [ ] 遵循 Repository 模式
- [ ] 代碼結構清晰，職責分離明確
- [ ] 查詢方法命名語義化
- [ ] 基本 CRUD 操作可用

### 第 3 步：Models 層

- [ ] Models 文件已創建
- [ ] 從 Types 層正確提取類型
- [ ] 業務相關枚舉和類型已定義
- [ ] Models 已正確導出
- [ ] 通過 TypeScript 編譯檢查

**企業標準檢查**：
- [ ] 模型定義完整，枚舉值明確
- [ ] 模型命名語義化
- [ ] 模型定義可用，類型正確

### 第 4 步：Services 層

- [ ] Service 使用 `@Injectable({ providedIn: 'root' })`
- [ ] 使用 `inject()` 進行依賴注入
- [ ] 使用 Signals 管理狀態
- [ ] 暴露 ReadonlySignal 給組件
- [ ] 業務邏輯方法已實現
- [ ] 錯誤處理已實現
- [ ] Loading 狀態管理已實現
- [ ] Service 已正確導出
- [ ] 通過 TypeScript 編譯檢查

**企業標準檢查**：
- [ ] 遵循 Angular 20 現代語法
- [ ] 代碼結構清晰，職責分離明確
- [ ] 錯誤處理完善
- [ ] 狀態管理規範（使用 Signals，避免全局狀態污染）
- [ ] 測試覆蓋率 ≥80%

### 第 5 步：Facades 層

- [ ] Facade 使用 `@Injectable({ providedIn: 'root' })`
- [ ] 使用 `inject()` 進行依賴注入
- [ ] 協調多個 Services（如需要）
- [ ] 提供統一接口給 Components
- [ ] 使用 Signals 管理 UI 狀態
- [ ] 暴露 ReadonlySignal 給組件
- [ ] 錯誤處理已實現（轉換為用戶友好的錯誤訊息）
- [ ] Loading 狀態管理已實現
- [ ] Facade 已正確導出
- [ ] 通過 TypeScript 編譯檢查

**企業標準檢查**：
- [ ] 遵循 Facade 模式
- [ ] 代碼結構清晰，職責分離明確（只處理狀態與 UI 溝通）
- [ ] 錯誤處理完善（用戶友好的錯誤提示）
- [ ] 狀態管理規範（使用 Signals）
- [ ] 接口清晰，易於使用
- [ ] 測試覆蓋率 ≥80%

### 第 6 步：Routes/Components 層

- [ ] Component 使用 Standalone 模式
- [ ] 使用 `SHARED_IMPORTS` 導入（優先使用）
- [ ] 使用 `inject()` 進行依賴注入
- [ ] 使用 `OnPush` 變更檢測策略
- [ ] 從 Facade 獲取狀態（ReadonlySignal）
- [ ] 調用 Facade 方法處理用戶交互
- [ ] 路由配置已正確設置
- [ ] 響應式設計已實現
- [ ] 無障礙功能已實現（ARIA 標籤、鍵盤導航）
- [ ] 通過 TypeScript 編譯檢查

**企業標準檢查**：
- [ ] 遵循 Angular 20 現代語法（Standalone Components）
- [ ] 代碼結構清晰，職責分離明確（只處理 UI 展示與用戶交互）
- [ ] UI/UX 符合規範（列表頁只查看，詳情頁編輯刪除）
- [ ] 響應式設計（支持多種屏幕尺寸）
- [ ] 無障礙功能（WCAG 2.1 AA 標準）
- [ ] 組件職責單一，可組合性強
- [ ] 建議編寫組件測試

### 第 7 步：測試與文檔

- [ ] Service 層單元測試已編寫（覆蓋率 ≥80%）
- [ ] Facade 層單元測試已編寫（覆蓋率 ≥80%）
- [ ] Component 層測試已編寫（建議）
- [ ] 關鍵業務邏輯測試覆蓋率 100%
- [ ] 所有測試通過
- [ ] 更新模組 README.md（如需要）
- [ ] 更新架構文檔（如需要）
- [ ] 更新 API 文檔（如需要）
- [ ] 建議 memory.jsonl 更新（在 PR 描述中記錄）

**企業標準檢查**：
- [ ] 測試覆蓋率符合標準（Service ≥80%，Facade ≥80%，關鍵邏輯 100%）
- [ ] 測試質量高（測試意圖清晰，易於維護）
- [ ] 文檔完整（README、API 文檔、架構文檔）
- [ ] 文檔與代碼一致

> **注意**：在 GitHub Agent 環境中，不要使用 `store_memory` 工具（會報錯）。
> 改為在 PR 描述中添加 "建議更新 memory.jsonl" 章節，描述新的模式或規範。

## 開發後檢查

### 代碼質量檢查
- [ ] 通過 TypeScript 編譯檢查（`yarn type-check`）
- [ ] 通過 ESLint 檢查（`yarn lint`）
- [ ] 通過 Stylelint 檢查（`yarn lint:style`）
- [ ] 通過 Prettier 格式化檢查
- [ ] 無循環依賴（使用 `madge` 檢查）

### 構建檢查
- [ ] 項目構建成功（`yarn build`）
- [ ] 無構建警告或錯誤
- [ ] 生產構建大小合理

### 運行時檢查
- [ ] 開發服務器啟動成功（`yarn start`）
- [ ] 功能在瀏覽器中正常工作
- [ ] 無控制台錯誤
- [ ] 無網絡請求錯誤

### 企業標準驗證
- [ ] **常見做法檢查**：是否符合 Angular/TypeScript/ng-alain 最佳實踐？
- [ ] **企業標準檢查**：代碼結構、職責分離、錯誤處理、狀態管理、測試覆蓋
- [ ] **邏輯一致性檢查**：數據流、命名、條件判斷、狀態更新
- [ ] **符合常理檢查**：功能可用、用戶體驗、避免過度設計

### 文檔與決策記錄
- [ ] 記錄關鍵決策（Memory MCP）
- [ ] 更新架構文檔（如需要）
- [ ] 更新 CHANGELOG.md（如需要）
- [ ] 準備 Code Review

---

**相關資源**：
- [企業合規檢查清單](../guides/enterprise-compliance-checklist.md) ⭐⭐⭐⭐⭐
- [開發順序指南](../guides/development-sequence-guide.md) ⭐⭐⭐⭐⭐
