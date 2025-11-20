# GitHub Copilot Memory Configuration

此目錄包含 GitHub Copilot Memory MCP（Model Context Protocol）的配置文件。

## 📄 memory.jsonl

記憶檔案採用 JSONL (JSON Lines) 格式，每一行都是一個 JSON 物件，用於定義專案的知識圖譜。

### 檔案結構

記憶檔案包含兩種類型的記錄：

1. **實體（Entity）**：定義專案中的核心概念
   ```json
   {"type":"entity","name":"實體名稱","label":"分類","observations":["觀察1","觀察2"]}
   ```

2. **關係（Relation）**：定義實體之間的關聯
   ```json
   {"type":"relation","from":"來源實體","to":"目標實體","relationType":"關係類型"}
   ```

### 📊 目前包含的知識

#### 實體統計（23 個實體）
- **專案**：ng-alain-gighub
- **技術棧**：Angular 20、NG-ZORRO、@delon、TypeScript、Supabase、RxJS
- **架構設計**：Git-like Branch Model、Database Schema、Layered Architecture
- **開發原則**：OnPush Strategy、SOLID Principles、Code Quality
- **設計模式**：SHARED_IMPORTS、Repository Pattern
- **安全性**：Authentication Flow、Security Principles
- **標準規範**：Testing Strategy、Commit Convention、Accessibility、Documentation
- **效能優化**：Performance Optimization
- **約束條件**：Forbidden Practices

#### 關係統計（24 個關係）
- 技術使用關係：ng-alain-gighub → Angular 20/NG-ZORRO/@delon/Supabase/TypeScript
- 架構實作關係：ng-alain-gighub → Git-like Branch Model/Database Schema
- 技術整合關係：Angular 20 → NG-ZORRO/RxJS/OnPush Strategy
- 擴展關係：@delon → NG-ZORRO
- 安全實作關係：Supabase → Authentication Flow → Security Principles
- 品質保證關係：SOLID Principles/Testing Strategy → Code Quality

### 🎯 使用目的

這個記憶檔案幫助 GitHub Copilot 理解：

1. **專案技術棧**：使用的框架、函式庫及其版本
2. **架構設計**：Git-like 分支模型、51 張資料表架構
3. **開發規範**：程式碼風格、命名規則、最佳實踐
4. **安全原則**：認證流程、權限控制、資料保護
5. **測試策略**：單元測試、E2E 測試要求
6. **效能優化**：OnPush 策略、Lazy Loading、快取機制
7. **禁止事項**：不應該做的事情與限制

### 📝 維護建議

當專案有以下變更時，應更新此檔案：

1. **技術棧升級**：框架或函式庫版本變更
2. **架構調整**：新增或修改核心架構設計
3. **規範變更**：開發規範或編碼標準更新
4. **新增限制**：發現新的禁止事項或約束條件

### 🔍 驗證方法

使用以下命令驗證 JSONL 格式：

```bash
# 列出所有實體
cat memory.jsonl | jq -r 'select(.type=="entity") | .name'

# 列出所有關係
cat memory.jsonl | jq -r 'select(.type=="relation") | "\(.from) → \(.to) (\(.relationType))"'

# 統計實體數量
cat memory.jsonl | jq -s '[.[] | select(.type=="entity")] | length'

# 統計關係數量
cat memory.jsonl | jq -s '[.[] | select(.type=="relation")] | length'
```

### 📚 相關文件

- [專案總覽](../../AGENTS.md) - AI 助手配置總覽
- [開發指引](../../.copilot-instructions.md) - GitHub Copilot 主要開發規範
- [架構文件](../../docs/20-完整架構流程圖.mermaid.md) - Git-like 分支模型詳解
- [資料表結構](../../docs/22-完整SQL表結構定義.md) - 51 張資料表完整定義

### 🤖 Memory MCP 說明

Memory MCP 是 GitHub Copilot 的記憶系統，允許：

- **持久化知識**：儲存專案特定的知識與規範
- **上下文感知**：Copilot 可以參考這些知識提供更準確的建議
- **團隊共享**：整個團隊共享相同的專案知識基礎
- **版本控制**：記憶檔案可以透過 Git 版本控制追蹤變更

---

**最後更新**：2025-11-20  
**維護者**：開發團隊
