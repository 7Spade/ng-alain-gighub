# GitHub Agents 說明

本目錄包含專案的 GitHub Agents 配置文件，這些文件定義了自動化代理的行為和規範。

## 📁 Agents 文件結構

### 專案主要 Agent

- **ng-alain-project-agent.md** ⭐ - ng-alain-github 專案開發代理
  - 專案特定的 Git-like 分支模型
  - 51 張資料表架構理解
  - 認證系統（Supabase Auth + @delon/auth）
  - SHARED_IMPORTS 模式
  - 完整開發工作流程
  - 常見任務和問題排查

### 開發相關 Agents

- **typescript-agent.md** - TypeScript 開發代理
  - TypeScript 類型安全
  - 代碼質量檢查
  - 最佳實踐指引

- **angular-agent.md** - Angular 開發代理
  - Angular 20 現代語法
  - Standalone Components
  - Signals 狀態管理
  - 性能優化

- **architecture-agent.md** - 架構審查代理
  - Git-like 分支模型
  - 51 張資料表架構
  - 分層架構規範
  - 依賴關係檢查

- **code-quality-agent.md** - 代碼質量代理
  - 代碼規範檢查
  - 重複代碼偵測
  - 命名規範驗證
  - 文檔完整性

- **testing-agent.md** - 測試代理
  - 測試覆蓋率檢查
  - 測試質量驗證
  - Karma + Jasmine 配置
  - 測試最佳實踐

## 🤖 Agents 用途

GitHub Agents 用於：

1. **自動化代碼審查**：在 Pull Request 中自動檢查代碼質量
2. **架構合規性檢查**：確保代碼符合專案架構規範
3. **持續集成**：在 CI/CD 流程中執行自動化檢查
4. **開發輔助**：提供開發建議和最佳實踐指引

## 🚀 快速開始

### 對於新開發者

1. **首先閱讀**：[ng-alain-project-agent.md](./ng-alain-project-agent.md)
   - 理解專案的 Git-like 分支模型
   - 了解 51 張資料表架構
   - 掌握開發工作流程

2. **根據任務類型選擇對應 Agent**：
   - TypeScript 開發 → [typescript-agent.md](./typescript-agent.md)
   - Angular 組件 → [angular-agent.md](./angular-agent.md)
   - 架構設計 → [architecture-agent.md](./architecture-agent.md)
   - 代碼審查 → [code-quality-agent.md](./code-quality-agent.md)
   - 測試編寫 → [testing-agent.md](./testing-agent.md)

### 對於 AI Agent

使用 **ng-alain-project-agent.md** 作為主要指引，它包含：
- 完整的專案架構理解
- 開發標準和最佳實踐
- 常見任務處理方法
- 問題排查指南
- 與其他專門 Agent 的連結

## 🔧 使用方式

### 在 GitHub Actions 中使用

```yaml
# .github/workflows/code-review.yml
name: Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run TypeScript Agent
        run: |
          # 執行 TypeScript 代理檢查
```

### 在 Pull Request 中使用

Agent 會在 Pull Request 時自動運行，檢查：
- 代碼質量
- 架構合規性
- 測試覆蓋率
- TypeScript 類型安全

## 📚 相關文檔

- [Cursor Rules](./.cursor/rules/) - Cursor IDE 規則
- [AGENTS.md](../../AGENTS.md) - 高層次架構決策
- [開發作業指引](../../docs/00-開發作業指引.md) - 完整開發規範
- [專案結構說明](../../docs/01-專案結構說明.md) - 專案結構概覽

## 🔄 更新 Agents

當需要更新 Agent 時：

1. 編輯對應的 `.md` 文件
2. 更新相關的 GitHub Actions 工作流程（如需要）
3. Agent 會在下一次 Pull Request 時自動生效

## 🎯 Agent 類型

- **審查型 Agent**：在 Pull Request 中執行代碼審查
- **檢查型 Agent**：在 CI/CD 中執行自動化檢查
- **輔助型 Agent**：提供開發建議和文檔

---

**最後更新**：2025-11-15  
**維護者**：開發團隊
