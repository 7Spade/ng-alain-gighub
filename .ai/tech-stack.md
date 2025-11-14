# 技術棧說明

> **目的**：為 AI 提供項目技術棧的快速參考，幫助理解項目使用的技術和工具。

## 🛠️ 核心技術

### 前端框架

- **Angular 20.3.x**
  - Standalone Components
  - Signals 狀態管理
  - 現代控制流程（@if, @for, @switch）
  - Typed Forms
  - OnPush 變更檢測策略

### UI 框架

- **ng-zorro-antd 20.3.x** - Ant Design for Angular
- **ng-alain 20.0.x** - 企業級 UI 解決方案

### 後端服務

- **Supabase**
  - PostgreSQL 數據庫
  - Authentication
  - Storage
  - Realtime
  - Edge Functions

### 開發工具

- **包管理**：Yarn 4.9.2
- **語言**：TypeScript (嚴格模式)
- **代碼檢查**：ESLint
- **代碼格式化**：Prettier
- **樣式檢查**：Stylelint
- **測試框架**：Karma + Jasmine
- **E2E 測試**：Protractor

## 📦 關鍵依賴

### Angular 核心

- `@angular/core` - Angular 核心
- `@angular/common` - Angular 通用模組
- `@angular/forms` - 表單處理
- `@angular/router` - 路由

### UI 組件

- `ng-zorro-antd` - Ant Design 組件
- `@delon/*` - ng-alain 工具庫

### 狀態管理

- Angular Signals（內建）

### HTTP 客戶端

- `@angular/common/http` - HTTP 客戶端
- `@supabase/supabase-js` - Supabase 客戶端

## 🔧 開發工具配置

### TypeScript

- 嚴格模式啟用
- 所有 strict 編譯選項啟用
- 類型安全優先

### 代碼質量

- ESLint：代碼檢查
- Prettier：代碼格式化
- Stylelint：樣式檢查
- Husky：Git Hooks
- lint-staged：提交前檢查

### 構建工具

- Angular CLI
- Source Map Explorer（性能分析）

## 📚 參考文檔

- [package.json](../../package.json) - 完整依賴列表
- [TypeScript 配置](../../tsconfig.json)
- [Angular 配置](../../angular.json)
- [開發規範](../../.cursor/rules/angular.mdc)

---

**最後更新**：2025-01-15

