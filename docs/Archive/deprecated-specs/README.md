# 已棄用的規範文檔

**移動日期**：2025-11-20  
**原因**：與 `.cursor/rules/` 目錄中的規則重複

## 📋 已移動的文檔

這些文檔是較早期的規範格式，已被 `.cursor/rules/` 目錄中更完整和結構化的規則取代。

### 移動的文檔列表（14 個）
1. 00-API規範.md → 請參考 [.cursor/rules/api-design.mdc](../../../.cursor/rules/api-design.mdc)
2. 00-Component規範.md → 請參考 [.cursor/rules/angular.mdc](../../../.cursor/rules/angular.mdc)
3. 00-DevOps規範.md → 請參考 [.cursor/rules/build-deploy.mdc](../../../.cursor/rules/build-deploy.mdc)
4. 00-SRP.md → 請參考 [.cursor/rules/development-principles.mdc](../../../.cursor/rules/development-principles.mdc)
5. 00-State規範.md → 請參考 [.cursor/rules/angular.mdc](../../../.cursor/rules/angular.mdc)
6. 00-一致性規範.md → 請參考 [.cursor/rules/code-quality.mdc](../../../.cursor/rules/code-quality.mdc)
7. 00-可組合性規範.md → 請參考 [.cursor/rules/code-quality.mdc](../../../.cursor/rules/code-quality.mdc)
8. 00-可維護性規範.md → 請參考 [.cursor/rules/code-quality.mdc](../../../.cursor/rules/code-quality.mdc)
9. 00-命名標準化規範.md → 請參考 [.cursor/rules/typescript.mdc](../../../.cursor/rules/typescript.mdc)
10. 00-安全規範.md → 請參考 [.cursor/rules/security.mdc](../../../.cursor/rules/security.mdc)
11. 00-性能規範.md → 請參考 [.cursor/rules/performance.mdc](../../../.cursor/rules/performance.mdc)
12. 00-架構治理規範.md → 請參考 [.cursor/rules/architecture.mdc](../../../.cursor/rules/architecture.mdc)
13. 00-測試規範.md → 請參考 [.cursor/rules/testing.mdc](../../../.cursor/rules/testing.mdc)
14. 00-現代化語法規範.md → 請參考 [.cursor/rules/modern-angular.mdc](../../../.cursor/rules/modern-angular.mdc)

## 為什麼移動這些文檔？

### 1. 重複內容
這些 00-* 系列文檔與 `.cursor/rules/` 目錄中的規則文件有大量重複內容。保留兩套規範會導致：
- 維護困難（需要在兩處更新）
- 可能出現不一致
- AI Agent 可能收到衝突的指引

### 2. 格式問題
- 00-* 文檔是簡單的要點列表
- `.cursor/rules/*.mdc` 文檔更結構化，有完整的說明、交叉引用和範例

### 3. 整合優勢
- `.cursor/rules/` 目錄會被 Cursor IDE 自動載入
- `.cursor/rules/` 文檔有更好的組織結構和跨文檔引用
- 統一規範來源，降低混淆

## 如何查找規範？

### For Cursor IDE Users
Cursor IDE 會自動載入 `.cursor/rules/` 目錄中的所有規則，無需手動查找。

### For Other Users
請參考 [.cursor/rules/README.md](../../../.cursor/rules/README.md) 了解完整的規則體系。

### 快速對照表

| 主題 | 新規則文件 |
|------|-----------|
| API 設計 | [.cursor/rules/api-design.mdc](../../../.cursor/rules/api-design.mdc) |
| Angular 開發 | [.cursor/rules/angular.mdc](../../../.cursor/rules/angular.mdc) |
| TypeScript | [.cursor/rules/typescript.mdc](../../../.cursor/rules/typescript.mdc) |
| 代碼質量 | [.cursor/rules/code-quality.mdc](../../../.cursor/rules/code-quality.mdc) |
| 安全性 | [.cursor/rules/security.mdc](../../../.cursor/rules/security.mdc) |
| 效能優化 | [.cursor/rules/performance.mdc](../../../.cursor/rules/performance.mdc) |
| 測試 | [.cursor/rules/testing.mdc](../../../.cursor/rules/testing.mdc) |
| 架構 | [.cursor/rules/architecture.mdc](../../../.cursor/rules/architecture.mdc) |

---

**維護者**：開發團隊  
**如有疑問**：請參考 [docs/README.md](../../README.md) 或 [AGENTS.md](../../../AGENTS.md)
