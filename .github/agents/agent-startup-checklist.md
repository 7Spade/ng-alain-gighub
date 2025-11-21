# 🚀 Agent 啟動檢查清單

> **目的**：確保每個 GitHub Copilot Agent 在執行任務前都遵循企業標準流程，並充分利用專案知識庫

**版本**：v1.0.0  
**最後更新**：2025-01-15  
**適用對象**：所有 GitHub Copilot Agents

---

## ⚠️ 強制執行項目（每次任務開始前）

### 🧠 第 1 步：查閱專案記憶庫（必須）

**位置**：[.github/copilot/memory.jsonl](../copilot/memory.jsonl)

```
✓ 打開記憶庫文件
✓ 搜尋與當前任務相關的實體（entities）
✓ 檢查相關關係（relations）
✓ 記錄關鍵發現
```

**記憶庫包含**（v4.0 - 149 實體 + 170 關係）：
- 📐 架構設計原則（Git-like Branch Model、51 張資料表、五層架構）
- 🛡️ 安全與權限規範（RLS 策略、認證流程、分支權限規則）
- 📝 開發標準（SOLID、DRY、KISS、四大核心開發原則）
- 🚀 效能優化（OnPush 策略、Lazy Loading、Bundle 優化）
- 🧪 測試策略（單元測試、E2E 測試、覆蓋率要求）
- 📚 文檔結構（232 個文檔的組織架構和閱讀路徑）

**如何使用**：
```bash
# 快速搜尋相關實體
grep -i "關鍵字" .github/copilot/memory.jsonl

# 或使用 jq 查詢
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("關鍵字"))'
```

**常見查詢範例**：
- 開發新功能 → 搜尋 "Five Layer Development Order", "Repository Pattern", "Security Best Practices"
- 代碼審查 → 搜尋 "Code Review Standards", "Four Core Development Principles", "Testing Strategy"
- 架構設計 → 搜尋 "Git-like Branch Model", "Five Layer Architecture", "Dependency Direction"
- UI 開發 → 搜尋 "UI Component Priority", "OnPush Strategy", "NG-ZORRO"

---

### 🗺️ 第 2 步：檢查系統架構思維導圖（必須）

**位置**：[docs/architecture/01-system-architecture-mindmap.mermaid.md](../../docs/architecture/01-system-architecture-mindmap.mermaid.md)

```
✓ 打開系統架構思維導圖
✓ 理解系統整體架構
✓ 確認當前任務在架構中的位置
✓ 識別相關模組和依賴關係
```

**架構思維導圖包含**：
- 🔐 身份認證層（Supabase Auth、帳戶系統、組織管理）
- 🔒 權限控制層（RLS Policies、角色系統、權限矩陣）
- 🎯 專案藍圖層（Git-like 分支模型、主分支、組織分支、PR 機制）
- 📋 任務執行模組（任務管理、暫存區、品質驗收、進度儀表板）
- ⚠️ 異常處理模組（問題追蹤、跨分支同步）
- 💬 協作溝通模組（討論區、通知中心、待辦中心）
- 📊 資料分析模組（文件管理、活動記錄、數據分析）
- ⚙️ 系統管理模組（系統設定、功能開關、機器人系統）
- ⚡ Supabase 核心服務（Database、Storage、Realtime、Edge Functions、RLS）

**關鍵問題**：
1. 我的任務涉及哪些模組？
2. 需要與哪些其他模組互動？
3. 有哪些依賴關係？
4. 需要遵循哪些架構原則？

---

### 📚 第 3 步：閱讀相關文檔（視任務而定）

**核心文檔**（⭐⭐⭐⭐⭐ 必讀）：
```
✓ docs/20-完整架構流程圖.mermaid.md - Git-like 分支模型
✓ docs/21-架構審查報告.md - 生產就緒版架構（100/100 分）
✓ docs/22-完整SQL表結構定義.md - 51 張表結構
✓ docs/37-SHARED_IMPORTS-使用指南.md - 共用模組規範
✓ docs/42-開發最佳實踐指南.md - 代碼示例與最佳實踐
```

**根據任務類型選擇**：
- **前端開發** → docs/00-Component規範.md, docs/38-ng-zorro-antd-組件清單與CLI指令.md
- **後端開發** → docs/00-API規範.md, docs/50-RLS策略開發指南.md
- **測試開發** → docs/00-測試規範.md, docs/測試策略.md
- **安全相關** → docs/00-安全規範.md, docs/51-Edge-Function開發指南.md

**文檔索引**：[docs/README.md](../../docs/README.md)

---

### 🎯 第 4 步：確認任務範圍與目標

```
✓ 明確任務目標
✓ 確認成功標準
✓ 識別約束條件
✓ 確定交付物
```

**關鍵問題**：
1. 要解決什麼問題？
2. 預期產出是什麼？
3. 有哪些限制？（時間、技術、資源）
4. 如何驗證成功？

---

### 🏗️ 第 5 步：規劃執行順序（遵循五層架構）

**⭐ 重要：新功能開發必須遵循五層架構開發順序**

**詳細指南**：[development-sequence-guide.md](./development-sequence-guide.md) ⭐⭐⭐⭐⭐

**標準開發順序**：
```
第 1 步：Types 層（P0 - 必須最先）
  ↓
第 2 步：Repositories 層（P0 - 依賴 Types）
  ↓
第 3 步：Models 層（P0 - 可與 Repositories 並行）
  ↓
第 4 步：Services 層（P0 - 依賴 Repositories + Models）
  ↓
第 5 步：Facades 層（P0 - 依賴 Services）
  ↓
第 6 步：Routes/Components 層（P0 - 依賴 Facades）
  ↓
第 7 步：測試與文檔（P0 - 必須完成）
```

**檢查清單**：
```
✓ 已閱讀開發順序指南（development-sequence-guide.md）
✓ 確認需要哪些層級
✓ 確認依賴關係
✓ 確認開發順序
✓ 理解每個層級的完成標準
✓ 預估每個步驟的時間
```

**從記憶庫查詢開發順序**：
```bash
# 查詢五層架構開發順序
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Five Layer Development Order"))'

# 查詢各層開發實踐
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Layer Development"))'
```

---

## 📋 執行中檢查

### 開發原則檢查

**四大核心開發原則**（從記憶庫中查閱）：
- [ ] **常見做法**：遵循業界標準，參考官方文檔和最佳實踐
- [ ] **企業標準**：代碼結構清晰、職責分離明確、錯誤處理完善、狀態管理規範
- [ ] **符合邏輯**：數據流清晰、命名語義化、條件判斷合理、組件初始化順序正確
- [ ] **符合常理**：功能真正可用、用戶體驗優先、避免過度設計、及時驗證

### 企業架構十大原則（SRP 核心）

- [ ] 1. **單一職責原則（SRP）**：每個模組只有一個改變的理由
- [ ] 2. **封裝與界限**：明確隔離不同層級，避免跨層依賴
- [ ] 3. **可組合性**：功能可自由組合，拆解後仍能運作
- [ ] 4. **明確的依賴方向**：依賴方向從上到下，避免循環依賴
- [ ] 5. **低耦合、高內聚**：相關功能放在一起，不同領域弱依賴
- [ ] 6. **可測試性**：架構必須為測試設計
- [ ] 7. **可維護性**：今天能維護，三年後也能維護
- [ ] 8. **可替換性**：能夠替換任何基礎設施層
- [ ] 9. **漸進式演進**：架構可部分重構，無需一次性重建
- [ ] 10. **一致性**：一致性比「聰明」更重要

### UI 元件優先級（必須遵守）

- [ ] 1. **優先 NG-ZORRO 元件**：所有 UI 需求優先從 NG-ZORRO 選擇
- [ ] 2. **次選 @delon/abc**：NG-ZORRO 無法滿足時使用業務元件
- [ ] 3. **最後才自訂**：僅當前兩者都無法滿足才自訂
- [ ] 4. **禁用原生 HTML**：不使用 `<input>`/`<select>`/`<button>`

### OnPush 策略（強制）

- [ ] 所有元件必須使用 `OnPush` 策略
- [ ] 使用 Signals 或不可變資料觸發檢測
- [ ] 需要時使用 `ChangeDetectorRef.markForCheck()`

---

## ✅ 完成前檢查

### 代碼質量

- [ ] TypeScript 編譯通過（`yarn type-check`）
- [ ] ESLint 檢查通過（`yarn lint`）
- [ ] Stylelint 檢查通過（`yarn lint:style`）
- [ ] Prettier 格式化完成
- [ ] 無循環依賴

### 構建與測試

- [ ] 項目構建成功（`yarn build`）
- [ ] 單元測試通過（Service ≥80%、Facade ≥80%）
- [ ] E2E 測試通過（關鍵流程）
- [ ] 無控制台錯誤或警告

### 企業標準驗證

- [ ] **常見做法檢查**：符合 Angular/TypeScript 最佳實踐
- [ ] **企業標準檢查**：代碼結構、職責分離、錯誤處理、狀態管理
- [ ] **邏輯一致性檢查**：數據流、命名、條件判斷、狀態更新
- [ ] **符合常理檢查**：功能可用、用戶體驗、避免過度設計

### 文檔與記錄

- [ ] 更新相關文檔（README、API 文檔）
- [ ] 記錄關鍵決策（如需要，更新 memory.jsonl）
- [ ] Commit 訊息符合規範（`<type>(<scope>): <subject>`）
- [ ] PR 描述清晰完整

---

## 🚫 禁止事項（必須避免）

從記憶庫中的 "Forbidden Practices" 實體：

❌ **禁止使用原生 HTML 元件**
❌ **禁止跳過 OnPush 策略**
❌ **禁止繞過 @delon/auth 認證**
❌ **禁止在程式碼中寫入機密資訊**
❌ **禁止使用 any 類型**
❌ **禁止使用舊版 Angular 語法**（`*ngIf`, `*ngFor` → 使用 `@if`, `@for`）
❌ **禁止未經審核修改 Schema**
❌ **禁止副作用外洩**
❌ **禁止過度耦合**
❌ **禁止 Agent 自動修改 infrastructure 配置**
❌ **禁止 Agent 自動修改 migrations 腳本**
❌ **禁止 Agent 自動修改 production 配置**

---

## 📊 任務完成自評

### 完成度評分

| 項目 | 分數 (0-10) | 備註 |
|------|------------|------|
| 記憶庫查閱 | __ / 10 | 是否充分利用記憶庫知識？ |
| 架構理解 | __ / 10 | 是否理解系統架構與模組關係？ |
| 標準遵循 | __ / 10 | 是否遵循企業標準與最佳實踐？ |
| 代碼質量 | __ / 10 | 是否通過所有檢查？ |
| 測試覆蓋 | __ / 10 | 是否達到測試覆蓋率要求？ |
| 文檔完整 | __ / 10 | 是否更新相關文檔？ |
| **總分** | __ / 60 | 目標：≥ 54 分（90%） |

### 改進建議

```
記錄需要改進的地方：

1. 
2. 
3. 
```

---

## 🔗 相關資源

### 核心配置文件
- [ng-alain-github-agent.md](./ng-alain-github-agent.md) - 主 Agent 配置
- [QUICK-START.md](./QUICK-START.md) - 快速開始指南
- [README.md](./README.md) - Agents 目錄總覽

### 記憶庫與架構
- [memory.jsonl](../copilot/memory.jsonl) - 專案記憶庫（149 實體 + 170 關係）
- [MEMORY_SUMMARY.md](../copilot/MEMORY_SUMMARY.md) - 記憶庫摘要
- [01-system-architecture-mindmap.mermaid.md](../../docs/architecture/01-system-architecture-mindmap.mermaid.md) - 系統架構思維導圖

### 領域專家
- [domain/angular-agent.md](./domain/angular-agent.md) - Angular 開發規範
- [domain/typescript-agent.md](./domain/typescript-agent.md) - TypeScript 規範
- [domain/code-quality-agent.md](./domain/code-quality-agent.md) - 代碼質量規範
- [domain/testing-agent.md](./domain/testing-agent.md) - 測試規範
- [domain/security-agent.md](./domain/security-agent.md) - 安全規範

---

**最後更新**：2025-01-15  
**版本**：v1.0.0  
**維護者**：開發團隊
