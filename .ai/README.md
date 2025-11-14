# .ai 目錄說明

> **目的**：存放項目級別的 AI 上下文文件，為 Cursor IDE 的 AI 功能提供項目背景、架構決策和業務需求等上下文信息。

## 📁 目錄結構

```
.ai/
├── README.md                    # 本文件 - 目錄說明
├── quick-reference.md           # 快速參考指南 ⭐ 推薦
├── architecture.md              # 架構文檔 ✅ 已填充
├── tech-stack.md                # 技術棧說明 ✅ 已填充
├── business-context.md          # 業務上下文 ✅ 已填充
├── project-idea.md              # 項目概念和願景 ✅ 已填充
├── database-overview.md         # 數據庫概覽 ✅ 已創建
├── api-overview.md              # API 概覽 ✅ 已創建
├── prd.md                       # 產品需求文檔（待填充）
│
├── user-stories/                # 用戶故事
│   ├── story-cert-upload.md     # 證書上傳故事（待填充）
│   ├── story-cert-list.md       # 證書列表故事（待填充）
│   └── README.md                # 用戶故事說明
│
├── epics/                       # Epic 文檔
│   └── epic-training/           # 培訓 Epic
│       └── README.md            # Epic 說明
│
└── development/                 # 開發相關文檔
    └── README.md                # 開發文檔說明
```

## 📄 文件說明

### 核心文檔

#### `project-idea.md`
- **用途**：項目概念、願景和核心原則
- **內容**：Angular 開發指南、技術原則、最佳實踐
- **狀態**：✅ 已有內容

#### `architecture.md`
- **用途**：系統架構概述和設計決策
- **內容**：
  - 系統架構總覽
  - 分層架構說明（routes → shared → core）
  - Git-like 分支模型
  - 51 張資料表架構
  - 核心設計原則
- **狀態**：⏳ 待填充
- **參考**：`docs/13-1.md`, `docs/13-2.md`, `docs/10-系統架構思維導圖.mermaid.md`

#### `prd.md`
- **用途**：產品需求文檔
- **內容**：
  - 產品目標和願景
  - 功能需求
  - 用戶角色和用例
  - 業務流程
- **狀態**：⏳ 待填充
- **參考**：`docs/PRD.md`（如果存在）

#### `tech-stack.md`
- **用途**：技術棧說明
- **內容**：
  - Angular 20.3.x
  - ng-zorro-antd 20.3.x
  - ng-alain 20.0.x
  - Supabase
  - Yarn 4.9.2
  - 其他關鍵技術
- **狀態**：✅ 已填充

#### `business-context.md`
- **用途**：業務上下文和領域知識
- **內容**：
  - 業務領域說明
  - 核心業務概念
  - 業務流程概述
  - 術語表
- **狀態**：✅ 已填充
- **參考**：`docs/42-詞彙表.md`, `docs/14-業務流程圖.mermaid.md`

#### `quick-reference.md` ⭐
- **用途**：快速參考指南，提供項目核心概念和常用操作的快速參考
- **內容**：
  - 項目核心概念（Git-like 分支模型、任務管理）
  - 數據庫概覽（51 張表分類）
  - API 概覽（主要端點）
  - 技術棧快速參考
  - 項目結構
  - 關鍵文檔鏈接
- **狀態**：✅ 已創建
- **推薦**：所有模式都應該包含此文件

#### `database-overview.md`
- **用途**：數據庫架構快速參考
- **內容**：
  - 51 張資料表分類說明
  - 關鍵關聯關係
  - 安全機制
- **狀態**：✅ 已創建
- **參考**：`docs/30-資料表清單總覽.md`, `docs/30-1-完整SQL表結構定義.md`

#### `api-overview.md`
- **用途**：API 接口快速參考
- **內容**：
  - API 架構說明
  - 主要 API 端點
  - 認證和權限控制
- **狀態**：✅ 已創建
- **參考**：`docs/33-API-接口詳細文檔.md`

### 用戶故事

#### `user-stories/`
- **用途**：存放用戶故事和功能需求
- **格式**：遵循 User Story 格式（As a... I want... So that...）
- **文件命名**：`story-{feature-name}.md`
- **狀態**：部分文件已創建，待填充內容

### Epic 文檔

#### `epics/`
- **用途**：存放 Epic 級別的功能文檔
- **格式**：Epic 描述、相關用戶故事、驗收標準
- **文件命名**：`epic-{epic-name}/`
- **狀態**：`epic-training/` 目錄已存在

### 開發文檔

> **注意**：`api-overview.md` 和 `database-overview.md` 已移至根目錄，作為基礎參考文件。

#### `development/decision-records/`
- **用途**：架構決策記錄（Architecture Decision Records, ADR）
- **格式**：遵循 ADR 格式
- **內容**：重要技術決策、決策背景、影響分析
- **狀態**：⏳ 待創建

## 🔗 與其他目錄的關係

### `.cursor/rules/`
- **關係**：`.ai` 提供項目上下文，`.cursor/rules` 提供開發規範
- **區別**：
  - `.ai/`：項目背景、業務需求、架構決策
  - `.cursor/rules/`：代碼規範、最佳實踐、技術標準

### `.cursor/modes.json`
- **關係**：`modes.json` 定義不同模式使用的 `.ai/` 文件
- **使用方式**：
  - `development` 模式：使用 `quick-reference.md`, `architecture.md`, `tech-stack.md`, `business-context.md`
  - `architecture` 模式：使用 `architecture.md`, `database-overview.md`, `api-overview.md`
  - `api-development` 模式：使用 `api-overview.md`, `database-overview.md`
- **參考**：`.cursor/modes.json` 配置文件

### `docs/`
- **關係**：`.ai/` 是 `docs/` 的摘要和 AI 優化版本
- **區別**：
  - `docs/`：完整詳細的文檔
  - `.ai/`：精簡的 AI 上下文，便於快速理解項目
- **引用**：`.ai/` 文件應引用 `docs/` 中的詳細文檔

### `AGENTS.md`
- **關係**：`.ai/` 提供項目背景，`AGENTS.md` 提供開發指引
- **區別**：
  - `.ai/`：項目是什麼、為什麼這樣設計
  - `AGENTS.md`：如何開發、遵循什麼規範

## 📝 使用建議

1. **保持簡潔**：`.ai/` 目錄的文件應該精簡，便於 AI 快速理解
2. **定期更新**：當架構或需求變更時，同步更新 `.ai/` 目錄的文件
3. **引用詳細文檔**：在 `.ai/` 文件中引用 `docs/` 中的詳細文檔
4. **結構化組織**：按照功能模組或業務領域組織文件
5. **與 modes.json 配合**：確保 `modes.json` 中引用的文件都存在且內容完整

## 🎯 推薦文件組合

### 日常開發
- `quick-reference.md` - 快速參考
- `architecture.md` - 架構概述
- `tech-stack.md` - 技術棧
- `business-context.md` - 業務上下文

### 架構設計
- `architecture.md` - 架構概述
- `database-overview.md` - 數據庫概覽
- `api-overview.md` - API 概覽

### API 開發
- `api-overview.md` - API 概覽
- `database-overview.md` - 數據庫概覽
- `architecture.md` - 架構概述

## 🎯 目標

`.ai` 目錄的目標是為 Cursor IDE 的 AI 功能提供：
- ✅ 項目背景和上下文
- ✅ 架構決策和設計原則
- ✅ 業務需求和用戶故事
- ✅ 技術棧和開發環境
- ✅ 快速參考和摘要

---

**最後更新**：2025-01-15  
**維護者**：開發團隊

