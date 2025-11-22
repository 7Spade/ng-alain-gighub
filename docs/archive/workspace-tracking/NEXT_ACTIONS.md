# 下一步行動計劃 (Next Actions Plan)

> **創建日期**: 2025-11-22  
> **狀態**: 待執行  
> **負責人**: 開發團隊

---

## 📊 當前狀態總覽

### 已完成的追蹤體系
- ✅ **INCOMPLETE_ITEMS.csv** - 98 個未完成項目清單
- ✅ **DEFINITION_OF_DONE.md** - 企業級 DoD 標準  
- ✅ **TECHNICAL_DEBT_BACKLOG.md** - 技術債務清單與執行計劃
- ✅ **PROGRESS_REPORT.md** - 進度報告

### 項目統計
- **GitHub Issues**: 2 個開放（#124, #121）
- **GitHub PRs**: 1 個草稿（#146 本 PR）
- **TODO 註釋**: 51 個（已記錄在 CSV）
- **總未完成項目**: 98 個
- **測試覆蓋率**: 16%（目標 80%）
- **工作區系統**: 6/86 頁面完成（7.0%）

---

## 🎯 立即行動項目（本週內）

### 優先級 P0 - 安全與穩定性

#### 1. 安全漏洞評估與修復（2-4 小時）⭐⭐⭐⭐⭐

**問題清單**：
- `@delon/mock` → 依賴 `mockjs` (Prototype Pollution)
- `@delon/abc` → 依賴 `xlsx` (Prototype Pollution + ReDoS)
- `@delon/theme`, `@delon/form`, `@delon/chart` → 間接依賴

**執行步驟**：
1. 分析當前 `@delon` 版本相容性
2. 評估升級到安全版本的影響
3. 在 feature branch 執行升級
4. 執行完整測試驗證
5. 記錄升級過程和回滾步驟

**驗收標準**：
- [ ] `npm audit` 無高危漏洞
- [ ] 所有測試通過
- [ ] 應用正常運行
- [ ] 升級文檔完整

#### 2. 設置 Copilot Instructions（2-4 小時）⭐⭐⭐

**對應 Issue**: #121

**執行步驟**：
1. 審查現有 `.github/copilot/` 配置
2. 根據最佳實踐更新配置
3. 測試 Copilot 行為
4. 文檔化配置決策

**驗收標準**：
- [ ] Copilot 配置完整
- [ ] 配置符合專案需求
- [ ] Issue #121 關閉

---

### 優先級 P0 - 核心功能實現

#### 3. Issues 模組 - 加載問題列表（4 小時）⭐⭐⭐⭐

**目標文件**: `src/app/routes/issues/list/issue-list.component.ts`

**當前狀態**: UI 完整，缺少數據加載邏輯

**TODO 項目**：
- 實現 `loadIssues()` 方法
- 整合 `IssueFacade`
- 添加分頁和過濾邏輯
- 實現刪除邏輯

**技術要求**：
- 遵循五層架構（Types → Repositories → Models → Services → Facades → Components）
- 使用 Signals 進行狀態管理
- OnPush 變更檢測策略
- 單元測試覆蓋率 ≥ 80%

**驗收標準**：
- [ ] 問題列表正確顯示
- [ ] 分頁和過濾功能正常
- [ ] 刪除功能正常
- [ ] 單元測試通過
- [ ] DoD 檢查清單通過

#### 4. Issues 模組 - 問題表單數據加載和保存（6 小時）⭐⭐⭐⭐

**目標文件**: `src/app/routes/issues/form/issue-form.component.ts`

**當前狀態**: 表單 UI 完整，缺少以下功能：
- 加載現有問題數據（編輯模式）
- 實現保存邏輯（創建/更新）
- 加載藍圖列表下拉選項
- 加載任務列表下拉選項

**TODO 項目**：
- 實現數據加載（ID from route params）
- 實現 `save()` 方法
- 整合 Blueprint 和 Task 服務
- 添加表單驗證

**驗收標準**：
- [ ] 編輯模式正確加載數據
- [ ] 創建和更新功能正常
- [ ] 藍圖和任務下拉正常
- [ ] 表單驗證正確
- [ ] 單元測試通過

#### 5. Blueprints 模組 - 獲取當前用戶 ID（1 小時）⭐⭐⭐⭐

**目標文件**: `src/app/routes/blueprints/branches/branch-detail/branch-detail.ts`

**當前狀態**: TODO 註釋提示需要從 AuthStateService 獲取用戶 ID

**執行步驟**：
1. 檢查 AuthStateService 是否存在
2. 注入 AuthStateService
3. 獲取當前用戶 ID
4. 使用 computed Signal 提供響應式訪問

**驗收標準**：
- [ ] 用戶 ID 正確獲取
- [ ] 使用 Signals 響應式管理
- [ ] 代碼通過類型檢查

---

### 優先級 P1 - 文檔完善

#### 6. 創建部署指南（4 小時）⭐⭐

**目標**: 創建 `docs/deployment/DEPLOYMENT.md`

**內容要求**：
- 環境準備（Node.js、Yarn、Supabase）
- 環境變量配置
- 建構步驟
- 部署步驟（開發、測試、生產）
- 部署驗證清單
- 常見問題排解

**驗收標準**：
- [ ] 文檔完整清晰
- [ ] 步驟可重現
- [ ] 包含代碼示例

#### 7. 創建回滾步驟文檔（2 小時）⭐⭐

**目標**: 創建 `docs/deployment/ROLLBACK.md`

**內容要求**：
- 回滾觸發條件
- 回滾步驟（代碼、資料庫、配置）
- 回滾驗證
- 緊急聯絡程序
- 回滾後的修復計劃

**驗收標準**：
- [ ] 文檔完整清晰
- [ ] 步驟可執行
- [ ] 包含決策流程圖

---

## 📅 本週執行時間表（Week 1）

| 日期 | 任務 | 負責人 | 狀態 | 預估時間 |
|------|------|--------|------|----------|
| Day 1 | 安全漏洞評估 | 待分配 | 🔴 待處理 | 4h |
| Day 2 | 設置 Copilot Instructions | 待分配 | 🔴 待處理 | 4h |
| Day 2-3 | Issues 模組 - 列表功能 | 待分配 | 🔴 待處理 | 4h |
| Day 3-4 | Issues 模組 - 表單功能 | 待分配 | 🔴 待處理 | 6h |
| Day 4 | Blueprints 模組 - 用戶 ID | 待分配 | 🔴 待處理 | 1h |
| Day 4-5 | 部署和回滾文檔 | 待分配 | 🔴 待處理 | 6h |

**總計**: 25 小時 ≈ 3-4 個工作日（單人）或 1-2 天（2-3 人團隊）

---

## 🔄 每日更新流程

1. **早上**：
   - 檢查 NEXT_ACTIONS.md
   - 選擇當日任務
   - 創建 feature branch

2. **開發中**：
   - 遵循五層架構開發順序
   - 頻繁提交到 feature branch
   - 執行 DoD 檢查清單

3. **完成時**：
   - 提交 PR（包含變更摘要、測試結果、風險評估）
   - 請求代碼審查
   - 更新 INCOMPLETE_ITEMS.csv
   - 更新 NEXT_ACTIONS.md

4. **晚上**：
   - 更新 PROGRESS_REPORT.md
   - 準備次日任務

---

## 📋 DoD 快速檢查清單

每個任務完成前必須通過：

### 代碼質量
- [ ] `yarn type-check` 通過
- [ ] `yarn lint` 通過
- [ ] `yarn lint:style` 通過
- [ ] `yarn build` 成功

### 測試
- [ ] 單元測試通過
- [ ] 測試覆蓋率 ≥ 80%（服務層）
- [ ] 功能在瀏覽器中驗證

### 文檔
- [ ] 代碼註釋完整
- [ ] 相關文檔已更新
- [ ] PR 描述完整

### 企業標準
- [ ] 常見做法 ✓
- [ ] 企業標準 ✓
- [ ] 符合邏輯 ✓
- [ ] 符合常理 ✓

---

## 🎯 成功指標（本週）

- [ ] 安全漏洞清零或降至中低危
- [ ] Issue #121 關閉
- [ ] Issues 模組核心功能完成（列表 + 表單）
- [ ] 部署和回滾文檔完成
- [ ] 至少 3 個 TODO 項目完成
- [ ] CI 保持全綠

---

## 📞 需要協助？

- **技術問題**: 在相關文件中提出 Issue
- **優先級調整**: 與產品負責人討論
- **資源需求**: 聯絡專案經理

---

**最後更新**: 2025-11-22  
**下次審查**: 2025-11-25（Week 1 中期）  
**維護者**: 開發團隊
