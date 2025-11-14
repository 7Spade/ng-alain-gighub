# 開發文檔目錄

> **目的**：存放開發相關的技術文檔，為 AI 提供技術實現的上下文。

## 📁 目錄結構

```
development/
├── README.md              # 本文件
├── api-spec.md            # API 規範摘要 ✅
├── database-schema.md     # 數據庫架構摘要 ✅
└── decision-records/      # 架構決策記錄（ADR）
    └── README.md          # ADR 說明 ✅
```

## 📄 文件說明

### `api-spec.md`
- **用途**：API 規範摘要
- **內容**：認證流程、主要 REST/Storage/Realtime 端點、錯誤處理方針
- **參考**：`docs/33-API-接口詳細文檔.md`, `docs/25-API-介面映射圖.mermaid.md`

### `database-schema.md`
- **用途**：數據庫架構摘要
- **內容**：11 大模組、關鍵關聯、RLS 與一致性要求
- **參考**：`docs/30-資料表清單總覽.md`, `docs/30-0-完整SQL表結構定義.md`, `docs/12-實體關係圖.mermaid.md`

### `decision-records/`
- **用途**：架構決策記錄（Architecture Decision Records, ADR）
- **格式**：遵循 ADR 模板（Context/Decision/Consequences/Alternatives/References）
- **內容**：重要技術決策、決策背景、影響分析
- **當前狀態**：`README.md` 已建立流程指引，後續決策請新增 `ADR-yyyymmdd-*.md`

## 🔗 相關文檔

- [架構文檔](../architecture.md)
- [技術棧說明](../tech-stack.md)
- [完整開發規範](../../.cursor/rules/)

---

**最後更新**：2025-11-14

