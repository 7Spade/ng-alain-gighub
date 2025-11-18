# Template Agent 指南

此文件定義所有 AI / Copilot 在撰寫輸出時應套用的結構化模板，並說明如何使用 `templates/` 內的範本。

## 1. 回覆格式
1. **Context**：引用 `ng-project-agent.md` 或 domain 文件的章節，確保答案可追溯。
2. **Analysis**：使用 Sequential Thinking，列出假設、風險與依賴。
3. **Plan / Steps**：對應 `@SPT` 任務節點，清楚標示 Step 1, Step 2 ...。
4. **Changes / Code**：必要時使用 fenced code block，並標記 `@file path`。
5. **Validation**：列出 type-check、lint、test、build、runtime 驗證狀態。
6. **Next Actions**：說明後續建議或風險。

## 2. 常用模板（位於 `templates/`）
| 檔名 | 用途 |
| --- | --- |
| `agent-prompt-template.md` | 建立全新 Agent 或 Chat Prompt 的前置欄位（Role, Context, Rules, Checklist）。 |
| `issue-template-for-agents.md` | 在 GitHub Issues 中指派給 Agent 任務時的填寫格式。 |

## 3. 使用規範
- 所有模板皆需列出：**目標、輸入、輸出、風險、驗證、依賴**。
- 調整模板時需更新 `meta/CHANGELOG.md` 並 bump `agents-index.json` 版本欄位。
- 若模板引用外部規範，需提供相對路徑（例如 `../domain/security-agent.md`）。

## 4. 範例
請參考 `examples/sample-patch-response.md` 了解 code review / patch 回覆，以及 `examples/sample-agent-config.md` 了解在 Actions 中載入模板的方式。

---
**最後更新**：2025-11-18  
**維護者**：模板工作小組
