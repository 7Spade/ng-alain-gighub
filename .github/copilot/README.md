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

**版本 v2.0** - 完整企業級開發標準

#### 實體統計（84 個實體）
- **專案**：ng-alain-gighub（企業級資源中心）
- **技術棧**：Angular 20、NG-ZORRO、@delon、TypeScript、Supabase、RxJS
- **架構設計**：Git-like Branch Model、Database Schema、Layered Architecture、Five Layer Architecture
- **核心原則**：OnPush Strategy、SOLID Principles、Code Quality、Enterprise Development Principles、UI Component Priority、Consistency Principle、Composability Principle、Dependency Direction Principle、Low Coupling High Cohesion
- **功能特性**：Staging Area Mechanism（48h 可撤回）、Todo Center System（五種狀態）、Issue Synchronization、Activity Logging System、Document Management System、Task Tree Structure、Data Analysis System、Notification System、Bot System
- **設計模式**：SHARED_IMPORTS、Repository Pattern
- **安全性**：Authentication Flow、Security Principles、Security Best Practices、Branch Permission Rules
- **標準規範**：Testing Strategy、Testing Requirements、Commit Convention、Git Commit Guidelines、Pull Request Standards、Accessibility、Documentation Standards、Documentation Requirements、Validation Sequence、Path Alias Standards、Modern Angular Syntax、Agent Operation Constraints、Production Readiness Checklist
- **效能優化**：Performance Optimization、Performance Benchmarks、Performance Optimization Techniques、Database Query Optimization
- **開發流程**：API Design Standards、Error Handling Strategy、Build and Deployment、Dependency Management、Core Module Standards、Shared Module Standards、Routes Module Standards、Linting Standards、Code Formatting、Git Workflow Standards、Internationalization、Caching Strategy、Logging and Monitoring、Code Review Standards、CI/CD Pipeline、Version Control Strategy、Environment Management、State Management Patterns、Form Handling Standards、HTTP Client Standards、Component Communication、Lazy Loading Strategy、Bundle Optimization、Browser Compatibility、Mobile Responsiveness、Debugging Practices、Migration Strategy、Code Quality Checklist、SRP Enforcement
- **約束條件**：Forbidden Practices

#### 關係統計（97 個關係）
- **技術使用關係**：ng-alain-gighub → Angular 20/NG-ZORRO/@delon/Supabase/TypeScript/Git-like Branch Model/Database Schema
- **架構實作關係**：Five Layer Architecture → Layered Architecture、Git-like Branch Model → Database Schema
- **技術整合關係**：Angular 20 → NG-ZORRO/RxJS/OnPush Strategy、@delon → NG-ZORRO/Supabase
- **安全實作關係**：Supabase → Authentication Flow → Security Principles、Branch Permission Rules → Security Best Practices
- **品質保證關係**：SOLID Principles/Testing Strategy/Code Review Standards → Code Quality
- **效能關係**：Performance Optimization Techniques → Performance Benchmarks
- **支援關係**：Staging Area Mechanism/Issue Synchronization → Git-like Branch Model、Notification System → Todo Center System
- **組織關係**：Task Tree Structure/Data Analysis System/Activity Logging System → Git-like Branch Model
- **原則實作**：SRP Enforcement → SOLID Principles、Consistency Principle → Code Quality Checklist

### 🎯 使用目的

這個記憶檔案幫助 GitHub Copilot 理解：

1. **專案技術棧**：使用的框架、函式庫及其版本
2. **架構設計**：Git-like 分支模型、51 張資料表架構、五層架構開發順序
3. **核心原則**：SOLID、DRY、KISS、YAGNI、一致性原則、可組合性原則、依賴方向原則
4. **開發規範**：程式碼風格、命名規則、最佳實踐、UI 元件優先級
5. **功能特性**：暫存區機制（48h 可撤回）、待辦中心（五種狀態）、問題同步、活動記錄、文件管理
6. **安全原則**：認證流程、權限控制（Owner/Collaborator/Viewer）、資料保護、RLS 策略
7. **測試策略**：單元測試（≥80% 覆蓋率）、E2E 測試要求
8. **效能優化**：OnPush 策略、Lazy Loading、快取機制、Bundle 優化、效能基準（LCP < 2.5s）
9. **開發流程**：驗證序列（lint → lint:style → type-check → build → test）、Git workflow、CI/CD
10. **禁止事項**：不應該做的事情與限制（Agent 操作約束）

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

**版本歷史**：
- **v2.0** (2025-11-20): 新增 61 個企業標準實體和 73 個關係，建立完整的企業級開發標準記憶庫
  - 新增功能特性：暫存區機制、待辦中心、問題同步、活動記錄、文件管理、任務樹、數據分析、通知系統、Bot 系統
  - 新增核心原則：企業開發原則、UI 元件優先級、一致性原則、可組合性原則、依賴方向原則
  - 新增標準規範：效能基準、安全最佳實踐、資料庫查詢優化、分支權限規則、驗證序列
  - 新增開發流程：五層架構、代碼質量檢查清單、SRP 強制執行、現代 Angular 語法、Agent 操作約束
  - 總計：84 個實體、97 個關係
- **v1.0** (2025-11-19): 初始版本，基礎專案知識
  - 基礎技術棧、架構設計、開發原則
  - 總計：23 個實體、24 個關係

**最後更新**：2025-11-20  
**維護者**：開發團隊
