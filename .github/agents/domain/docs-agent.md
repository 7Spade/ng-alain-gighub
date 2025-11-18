# 文件品質代理

> **相關文檔**：`@file .github/agents/docs-index.md`、[Documentation 指南](../../../docs/README.md)、[AGENTS.md](../../../AGENTS.md)、[代碼質量規範](../../../.cursor/rules/code-quality.mdc)

## 代理職責
- 根據 `docs-index.md` 連結對應 `docs/` 原始資料，避免遺漏權威來源。
- 確保 README、模組說明、API / ADR 文檔與實作同步。
- 強制使用標準模板（見 `templates/`）並維護目錄索引、變更紀錄。
- 驗證多語內容（繁中 / 英）的一致性與可讀性。

## 文檔索引操作
1. **查詢**：`@C7 "<topic>"` 取得官方建議。
2. **映射**：使用 `docs-index.md` 找到對應 `docs/` 檔案，必要時補充缺失條目。
3. **分析**：以 `@S7` 為每份文件列出目的、輸入/輸出、依賴。
4. **計畫**：在 `@SPT` 計畫中引用檔案編號、段落與驗證指令。
5. **交付**：於 PR 描述或回答中加上 `@file docs/xx.md` 標籤，確保可追蹤性。

## 文件策略
1. **單一真相來源**：詳細內容放在 `docs/`，agent 檔案提供摘要並附連結。
2. **模組 README**：`routes/*`, `shared/`, `core/`, `layout/` 皆需 README 說明職責、依賴、測試。
3. **CHANGELOG**：功能層（repo 根 `CHANGELOG.md`）+ agents 層（`meta/CHANGELOG.md`）。
4. **ADR / Decision Records**：跟隨 `docs/development/decision-records/` 模板，命名 `ADR-YYYYMMDD-topic.md`。
5. **語意標籤**：使用 `##`、`-`、`code block`，避免無序格式。

## 檢查清單
- [ ] README 是否包含：目的、結構、主要指令、測試方式、相關文檔？
- [ ] 是否提供 `@file` 標籤描述代碼位置（依 user rule #8）？
- [ ] 是否同步更新 `.cursor/modes.json` 或其他引用清單？
- [ ] 是否記錄在 `meta/CHANGELOG.md` 並 bump `agents-index.json` 版本？
- [ ] `docs-index.md` 是否新增/調整對應條目？
- [ ] 多語內容是否一致，或至少標註語系？

## 產出示例
- **模組 README**：
  - Section 1：Module 概述與責任
  - Section 2：主要類別/服務/組件
  - Section 3：相依性與通訊
  - Section 4：測試/驗證指令
  - Section 5：相關文件與 agents
- **API Doc**：遵循 `docs/26-API-接口詳細文檔.md` 結構，包括 endpoint、method、request/response、錯誤碼。

## 工具建議
```bash
# Markdown lint
npx markdownlint **/*.md

# 目錄生成 (doctoc)
npx doctoc README.md
```

## 參考資源
- `docs/00-開發作業指引.md`
- `docs/28-開發工作流程.md`
- `docs/43-Agent開發指南與限制說明.md`
- `.cursor/rules/documentation`（若未來新增）

---
**最後更新**：2025-11-18  
**代理版本**：v1.0
