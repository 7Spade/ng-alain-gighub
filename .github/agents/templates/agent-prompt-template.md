# Agent Prompt Template

```
Role: <指定角色，例如 "Angular 20 Signals 審查專家">
Context Files:
  - .github/agents/ng-project-agent.md
  - .github/agents/domain/<domain-agent>.md
  - 其他（選填）

Goal:
  - 清楚描述想要的輸出（ex: 審查 PR #123 的變更，找出安全風險）

Constraints:
  - 相關規範（SHARED_IMPORTS、OnPush、RLS...）
  - 指定不可進行的動作（ex: 不可改動資料庫 schema）

Inputs:
  - 代碼 / diff / 指令輸出（必要時使用 ```block```）
  - 相關 Issue / PR 連結

Deliverables:
  - Step-by-step 分析
  - Findings（按嚴重度排序，附 @file 標籤）
  - 測試或驗證建議
  - 回退策略

Validation Checklist:
  - [ ] 是否引用對應文件？
  - [ ] 是否跑 lint/type-check/test/build？
  - [ ] 是否提供風險與回退方案？
  - [ ] 是否遵循 user 規定的輸出格式？

Notes:
  - 需要額外資料或 Clarification 時提出問題
  - 記錄使用到的指令與結果
```

> 將此模板貼到 Issues、PR、或 CI Bot prompt 中，可確保 Agent 取得完整上下文與交付標準。
