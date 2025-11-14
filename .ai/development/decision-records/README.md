# Decision Records（ADR）說明

> 目的：以輕量 ADR 格式記錄關鍵架構/產品決策，讓 AI 與開發者快速理解決策背景與影響。對應 `.cursor/rules/architecture.mdc` 的「設計與實現同步」要求。

## 格式建議
```
ADR-YYYYMMDD-短標題.md
1. Context
2. Decision
3. Consequences
4. Alternatives
5. References
```

## 當前狀態
- ✅ ADR 框架已建立，後續重大決策（例如 PR 審核流程調整、文件上傳安全策略、Signals 狀態管理方案）需在此新增記錄。
- 📌 建議至少維持：
  - Git-like 分支模型與 RLS 佈局
  - 文件/證書治理策略
  - 通知/待辦整合方案

## 更新流程
1. 撰寫 ADR 草稿並鏈接對應 `docs/`、`.cursor/rules/`、Issue/PR。
2. 與團隊審核後合併。
3. 若決策被取代，更新舊 ADR 狀態為 `Superseded by ADR-xxxx`。

## 相關文檔
- `docs/28-架構審查報告.md`
- `docs/37-錯誤處理指南.md`
- `.cursor/rules/architecture.mdc`
