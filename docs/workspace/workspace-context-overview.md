# 工作區上下文功能總覽

## 📑 目錄

- [📊 三個上下文對比總覽](#-三個上下文對比總覽)
  - [核心定位對比](#核心定位對比)
  - [功能覆蓋對比](#功能覆蓋對比)
- [1️⃣ 個人上下文 (User Context)](#1-個人上下文-user-context)
  - [定位與特點](#定位與特點)
  - [功能模組清單（6 大模組，15 個頁面）](#功能模組清單6-大模組15-個頁面)
    - [1. 帳戶系統 (Account System)](#1-帳戶系統-account-system)
    - [2. 我的任務 (My Tasks)](#2-我的任務-my-tasks)
    - [3. 我的藍圖 (My Blueprints)](#3-我的藍圖-my-blueprints)
    - [4. 我的文檔 (My Documents)](#4-我的文檔-my-documents)
    - [5. 我的溝通 (My Communication)](#5-我的溝通-my-communication)
    - [6. 個人設置 (Personal Settings)](#6-個人設置-personal-settings)
  - [路由參數](#路由參數)
  - [使用場景](#使用場景)
- [2️⃣ 組織上下文 (Organization Context)](#2-組織上下文-organization-context)
  - [定位與特點](#定位與特點)
  - [功能模組清單（9 大模組，70+ 個頁面）](#功能模組清單9-大模組70-個頁面)
    - [1. 組織管理 (Organization Management) ⭐⭐⭐⭐⭐](#1-組織管理-organization-management-)
    - [2. 組織協作 (Organization Collaboration) ⭐⭐⭐⭐](#2-組織協作-organization-collaboration-)
    - [3. 組織藍圖 (Organization Blueprints) ⭐⭐⭐⭐⭐](#3-組織藍圖-organization-blueprints-)
    - [4. 組織任務 (Organization Tasks) ⭐⭐⭐⭐⭐](#4-組織任務-organization-tasks-)
    - [5. 組織品質 (Organization Quality) ⭐⭐⭐⭐](#5-組織品質-organization-quality-)
    - [6. 組織問題 (Organization Issues) ⭐⭐⭐⭐⭐](#6-組織問題-organization-issues-)
    - [7. 組織溝通 (Organization Communication) ⭐⭐⭐⭐](#7-組織溝通-organization-communication-)
    - [8. 組織分析 (Organization Analytics) ⭐⭐⭐⭐⭐](#8-組織分析-organization-analytics-)
    - [9. 組織文檔 (Organization Documents) ⭐⭐⭐⭐](#9-組織文檔-organization-documents-)
  - [路由參數](#路由參數)
  - [使用場景](#使用場景)
- [3️⃣ 團隊上下文 (Team Context)](#3-團隊上下文-team-context)
  - [定位與特點](#定位與特點)
  - [功能模組清單（5 大模組，20 個頁面）](#功能模組清單5-大模組20-個頁面)
    - [1. 團隊管理 (Team Management) ⭐⭐⭐](#1-團隊管理-team-management-)
    - [2. 團隊任務 (Team Tasks) ⭐⭐⭐⭐⭐](#2-團隊任務-team-tasks-)
    - [3. 團隊問題 (Team Issues) ⭐⭐⭐⭐](#3-團隊問題-team-issues-)
    - [4. 團隊溝通 (Team Communication) ⭐⭐⭐⭐](#4-團隊溝通-team-communication-)
    - [5. 團隊文檔 (Team Documents) ⭐⭐⭐](#5-團隊文檔-team-documents-)
  - [路由參數](#路由參數)
  - [使用場景](#使用場景)
- [🔍 三個上下文功能對比詳表](#-三個上下文功能對比詳表)
  - [任務管理功能對比](#任務管理功能對比)
  - [藍圖功能對比](#藍圖功能對比)
  - [問題追蹤功能對比](#問題追蹤功能對比)
  - [文檔管理功能對比](#文檔管理功能對比)
  - [溝通協作功能對比](#溝通協作功能對比)
- [🗂️ 數據文件結構](#-數據文件結構)
  - [JSON 結構說明](#json-結構說明)
  - [字段說明](#字段說明)
- [🔗 路由參數處理](#-路由參數處理)
  - [參數替換邏輯](#參數替換邏輯)
  - [參數獲取方式](#參數獲取方式)
- [📐 開發指南](#-開發指南)
  - [判斷功能應歸屬哪個上下文](#判斷功能應歸屬哪個上下文)
    - [應加入個人上下文的情況：](#應加入個人上下文的情況)
    - [應加入組織上下文的情況：](#應加入組織上下文的情況)
    - [應加入團隊上下文的情況：](#應加入團隊上下文的情況)
  - [添加新功能的步驟](#添加新功能的步驟)
  - [數據加載模式](#數據加載模式)
- [💡 最佳實踐](#-最佳實踐)
  - [DO's ✅](#dos-)
    - [個人上下文](#個人上下文)
    - [組織上下文](#組織上下文)
    - [團隊上下文](#團隊上下文)
  - [DON'Ts ❌](#donts-)
    - [個人上下文](#個人上下文)
    - [組織上下文](#組織上下文)
    - [團隊上下文](#團隊上下文)
- [🎨 使用場景範例](#-使用場景範例)
  - [場景 1：跨上下文協作流程](#場景-1跨上下文協作流程)
  - [場景 2：問題處理流程](#場景-2問題處理流程)
- [🔗 相關資源](#-相關資源)
  - [主要文檔](#主要文檔)
  - [數據文件](#數據文件)
  - [技術文檔](#技術文檔)

---


> 📋 **目的**：整合個人、組織、團隊三個上下文的所有功能與路由連結，提供完整的功能對比和開發指南

**最後更新**：2025-01-15
**數據文件**：
- `src/assets/tmp/user-data.json` - 個人上下文菜單數據
- `src/assets/tmp/organization-data.json` - 組織上下文菜單數據
- `src/assets/tmp/team-data.json` - 團隊上下文菜單數據

**相關文檔**：
- [工作區上下文使用與規劃指南](./工作區上下文使用與規劃指南.md) - 完整的上下文系統說明
- [工作區上下文切換流程圖](./工作區上下文切換流程圖.mermaid.md) - 視覺化流程圖
- [個人上下文菜單功能說明](./個人上下文菜單功能說明-user-data.md) - 個人上下文詳細說明
- [組織上下文菜單功能說明](./組織上下文菜單功能說明-organization-data.md) - 組織上下文詳細說明
- [團隊上下文菜單功能說明](./團隊上下文菜單功能說明-team-data.md) - 團隊上下文詳細說明

- --

## 📊 三個上下文對比總覽

### 核心定位對比

| 特性 | 個人上下文 | 組織上下文 | 團隊上下文 |
|------|-----------|-----------|-----------|
| **核心理念** | 輕量級個人生產力中心 | 組織全功能管理中心 | 團隊協作與任務執行中心 |
| **適用對象** | 所有系統用戶 | 組織管理員、專案經理 | 團隊成員、執行人員 |
| **使用場景** | 個人日常工作、獨立任務管理 | 組織管理、專案管理、團隊協作 | 團隊日常協作、任務執行 |
| **權限範圍** | 僅限個人數據 | 組織級別數據 | 團隊級別數據 |
| **設計特點** | 輕量、快速、專注於個人效率 | 功能最完整、管理能力最強 | 聚焦於執行、功能集是組織的子集 |
| **功能模組數** | 6 大模組 | 9 大模組 | 5 大模組 |
| **功能頁面數** | 15 個頁面 | 70+ 個頁面 | 20 個頁面 |

### 功能覆蓋對比

| 功能領域 | 個人上下文 | 組織上下文 | 團隊上下文 |
|---------|-----------|-----------|-----------|
| **帳戶/成員管理** | ✅ 個人資料、組織列表 | ✅ 完整成員和團隊管理 | ⚠️ 僅查看成員 |
| **任務管理** | ✅ 聚合視圖（只讀） | ✅ 完整管理（創建、編輯、刪除） | ✅ 執行和更新 |
| **藍圖功能** | ✅ 個人藍圖（簡化） | ✅ 完整 Git-like 分支管理 | ❌ 無（使用組織藍圖） |
| **問題追蹤** | ❌ | ✅ 完整管理 | ⚠️ 查看和指派 |
| **品質管理** | ❌ | ✅ 品質檢查、驗收 | ❌ |
| **數據分析** | ❌ | ✅ 完整分析和報表 | ❌ |
| **文檔管理** | ✅ 個人文檔 | ✅ 完整管理（版本、權限） | ⚠️ 基本訪問 |
| **溝通協作** | ✅ 通知、待辦 | ✅ 完整溝通系統 | ✅ 團隊討論 |
| **協作管理** | ❌ | ✅ 跨團隊協作 | ❌ |

- --

## 1️⃣ 個人上下文 (User Context)

### 定位與特點

**核心理念**：輕量級個人生產力中心

**設計原則**：
1. **聚合視圖**：匯總來自所有組織和團隊的個人相關數據
2. **快速訪問**：提供最常用功能的快捷入口
3. **跨上下文**：不受限於單一組織或團隊
4. **個人化**：根據個人偏好定制

### 功能模組清單（6 大模組，15 個頁面）

#### 1. 帳戶系統 (Account System)
- **我的個人資料** (`/accounts/:userId`) - 查看和編輯個人基本資訊
- **我的組織** (`/accounts/org`) - 查看所有加入的組織列表

#### 2. 我的任務 (My Tasks)
- **我的待辦清單** (`/tasks/todo`) - 個人待辦事項列表
- **我的指派任務** (`/tasks/assignments`) - 所有指派給我的任務（跨組織、跨團隊）

#### 3. 我的藍圖 (My Blueprints)
- **我的藍圖列表** (`/blueprints`) - 個人創建的藍圖列表
- **創建藍圖** (`/blueprints/create`) - 創建新的個人藍圖

#### 4. 我的文檔 (My Documents)
- **我的文檔列表** (`/documents`) - 個人文檔列表
- **上傳文檔** (`/documents/upload`) - 上傳新文檔

#### 5. 我的溝通 (My Communication)
- **我的通知** (`/communication/notifications`) - 系統通知列表（跨組織、跨團隊）
- **我的待辦** (`/communication/todos`) - 待處理事項提醒

#### 6. 個人設置 (Personal Settings)
- **個人偏好設置** (`/system/settings/personal`) - 個人化設置選項

### 路由參數

| 參數名 | 示例值 | 說明 | 獲取方式 |
|--------|--------|------|----------|
| `:userId` | `uuid-xxx-xxx` | 當前用戶的帳戶 ID | `WorkspaceContextService.currentUserAccountId()` |

### 使用場景

1. **新用戶首次登入**：完善個人資訊、查看組織、查看任務
2. **自由工作者管理個人專案**：管理個人藍圖、待辦事項
3. **跨組織成員查看所有任務**：一次性查看所有指派任務，不需切換上下文

- --

## 2️⃣ 組織上下文 (Organization Context)

### 定位與特點

**核心理念**：組織全功能管理中心

**設計原則**：
1. **完整功能集**：提供系統所有管理和分析功能
2. **Git-like 模型**：支援完整的藍圖分支管理系統
3. **階層管理**：從組織到團隊到成員的完整管理
4. **數據分析**：提供完整的數據分析和報表功能

### 功能模組清單（9 大模組，70+ 個頁面）

#### 1. 組織管理 (Organization Management) ⭐⭐⭐⭐⭐
- **組織成員** (`/accounts/org/:id/members`) - 組織成員列表、權限管理
- **組織團隊** (`/accounts/org/:id/teams`) - 團隊列表、創建團隊

#### 2. 組織協作 (Organization Collaboration) ⭐⭐⭐⭐
- **協作列表** (`/collaboration/list?org=:id`) - 協作專案列表
- **創建協作** (`/collaboration/create`) - 創建新的協作
- **協作邀請** (`/collaboration/invitations?org=:id`) - 管理協作邀請

#### 3. 組織藍圖 (Organization Blueprints) ⭐⭐⭐⭐⭐
**最重要的模組**，實現 Git-like 分支管理系統

- **藍圖列表** (`/blueprints?org=:id`) - 組織所有藍圖
- **創建藍圖** (`/blueprints/create`) - 創建新藍圖
- **藍圖詳情** (`/blueprints/detail`) - 藍圖詳細資訊
- **藍圖設置** (`/blueprints/settings`) - 藍圖配置
- **主分支** (`/blueprints/main-branch`) - 主分支管理
- **分支管理** (`/blueprints/branches`) - 所有分支列表
- **分支詳情** (`/blueprints/branch-detail`) - 分支詳細資訊
- **Fork 任務** (`/blueprints/fork`) - Fork 到組織分支
- **Pull Request** (`/blueprints/pull-requests`) - PR 列表
- **PR 詳情** (`/blueprints/pull-requests/detail`) - PR 詳細資訊
- **PR 審查** (`/blueprints/review`) - PR 審查界面

**Git-like 分支模型**：
```mermaid
  │
  ├─ 組織分支 1 (Org Branch A)
  │   ├─ 任務執行數據
  │   └─ PR → 提交回主分支
  │
  └─ 組織分支 2 (Org Branch B)
      ├─ 任務執行數據
      └─ PR → 提交回主分支
```

#### 4. 組織任務 (Organization Tasks) ⭐⭐⭐⭐⭐
完整的任務管理系統，支援多視角查看

- **任務看板** (`/tasks/board?org=:id`) - Kanban 視圖
- **任務日曆** (`/tasks/calendar?org=:id`) - 日曆視圖
- **任務列表** (`/tasks/list?org=:id`) - 列表視圖
- **任務樹狀圖** (`/tasks/tree?org=:id`) - 樹狀結構視圖
- **創建任務** (`/tasks/create`) - 創建新任務
- **任務詳情** (`/tasks/detail`) - 任務詳細資訊
- **任務表單** (`/tasks/form`) - 任務編輯表單
- **任務指派** (`/tasks/assignments?org=:id`) - 任務分配
- **待辦清單** (`/tasks/todo?org=:id`) - 待辦事項
- **日報** (`/tasks/daily-reports?org=:id`) - 施工日報
- **施工照片** (`/tasks/photos?org=:id`) - 現場照片
- **天氣記錄** (`/tasks/weather?org=:id`) - 天氣日誌
- **任務進度** (`/tasks/progress?org=:id`) - 進度追蹤

#### 5. 組織品質 (Organization Quality) ⭐⭐⭐⭐
品質檢查和驗收管理系統

- **品質檢查** (`/quality/checks?org=:id`) - 品質檢查列表
- **品質檢查詳情** (`/quality/checks/detail`) - 檢查詳情
- **提交驗收** (`/quality/submit`) - 提交驗收申請
- **驗收管理** (`/quality/inspections?org=:id`) - 驗收列表
- **驗收詳情** (`/quality/inspections/detail`) - 驗收詳情
- **驗收照片** (`/quality/photos?org=:id`) - 驗收照片
- **驗收結果** (`/quality/results?org=:id`) - 驗收結果

#### 6. 組織問題 (Organization Issues) ⭐⭐⭐⭐⭐
問題追蹤系統，支援即時同步至主分支

- **問題列表** (`/issues?org=:id`) - 問題追蹤列表
- **創建問題** (`/issues/create`) - 創建新問題
- **問題詳情** (`/issues/detail`) - 問題詳細資訊
- **問題指派** (`/issues/assignments?org=:id`) - 問題分配
- **問題處理** (`/issues/handle`) - 處理界面
- **處理照片** (`/issues/photos`) - 處理照片
- **關閉問題** (`/issues/close`) - 關閉問題
- **問題同步日誌** (`/issues/sync-logs?org=:id`) - 同步記錄

**問題同步機制**：問題會即時同步至主分支

#### 7. 組織溝通 (Organization Communication) ⭐⭐⭐⭐
組織內部溝通、通知和待辦管理

- **討論區** (`/communication/discussions?org=:id`) - 討論區
- **評論管理** (`/communication/comments?org=:id`) - 評論列表
- **發表評論** (`/communication/comments/create`) - 新增評論
- **通知中心** (`/communication/notifications?org=:id`) - 通知列表
- **通知詳情** (`/communication/notifications/detail`) - 通知詳情
- **通知規則** (`/communication/notifications/rules`) - 通知規則設定
- **即時通知** (`/communication/realtime`) - 即時通知
- **待辦中心** (`/communication/todos?org=:id`) - 待辦事項
- **團隊通知** (`/communication/team-notify?org=:id`) - 團隊通知

#### 8. 組織分析 (Organization Analytics) ⭐⭐⭐⭐⭐
完整的數據分析和報表系統

- **統計數據** (`/analytics/statistics?org=:id`) - 數據統計
- **進度追蹤** (`/analytics/progress?org=:id`) - 進度監控
- **進度更新** (`/analytics/progress-update`) - 更新進度
- **主分支報表** (`/analytics/main-reports?org=:id`) - 主分支數據報表
- **分支報表** (`/analytics/branch-reports?org=:id`) - 分支數據報表
- **跨分支總覽** (`/analytics/cross-branch`) - 跨分支數據對比
- **活動日誌** (`/analytics/activity-logs?org=:id`) - 活動記錄
- **活動日誌詳情** (`/analytics/activity-logs/detail`) - 活動詳情
- **數據報表** (`/analytics/reports?org=:id`) - 數據報表
- **匯出報表** (`/analytics/export`) - 報表匯出
- **圖表生成** (`/analytics/charts`) - 圖表工具

#### 9. 組織文檔 (Organization Documents) ⭐⭐⭐⭐
完整的文檔管理系統，支援版本控制和權限管理

- **文檔列表** (`/documents?org=:id`) - 文檔管理
- **上傳文檔** (`/documents/upload`) - 上傳文件
- **文檔瀏覽器** (`/documents/browser`) - 文件瀏覽
- **文檔預覽** (`/documents/preview`) - 預覽功能
- **圖紙查看器** (`/documents/drawings`) - CAD 圖紙查看
- **文檔元數據** (`/documents/metadata`) - 元數據管理
- **版本管理** (`/documents/versions`) - 版本控制
- **權限設置** (`/documents/permissions`) - 權限管理

### 路由參數

| 參數名 | 示例值 | 說明 | 獲取方式 |
|--------|--------|------|----------|
| `:id` | `uuid-org-xxx` | 組織 ID | `WorkspaceContextService.contextId()` |
| `?org=:id` | `?org=uuid-org-xxx` | 組織 ID（查詢參數） | URL 查詢參數 |

### 使用場景

1. **專案經理管理藍圖**：創建藍圖、設置主分支、審查 PR
2. **組織管理員日常工作**：進度追蹤、問題處理、驗收管理、任務調整
3. **數據分析師工作**：生成報表、跨分支對比、圖表生成

- --

## 3️⃣ 團隊上下文 (Team Context)

### 定位與特點

**核心理念**：團隊協作與任務執行中心

**設計原則**：
1. **執行導向**：聚焦於任務執行和進度更新
2. **簡化管理**：移除複雜的管理功能，保留核心執行功能
3. **團隊協作**：強化團隊內部溝通和協作
4. **快速訪問**：提供團隊常用功能的快捷入口

### 功能模組清單（5 大模組，20 個頁面）

#### 1. 團隊管理 (Team Management) ⭐⭐⭐
- **團隊成員** (`/accounts/org/teams/:id/members`) - 團隊成員列表（僅查看）

#### 2. 團隊任務 (Team Tasks) ⭐⭐⭐⭐⭐
團隊任務執行中心，提供多視角任務查看和更新

- **任務看板** (`/tasks/board?team=:id`) - Kanban 視圖
- **任務日曆** (`/tasks/calendar?team=:id`) - 日曆視圖
- **任務列表** (`/tasks/list?team=:id`) - 列表視圖
- **任務樹狀圖** (`/tasks/tree?team=:id`) - 樹狀結構視圖
- **待辦清單** (`/tasks/todo?team=:id`) - 待辦事項
- **日報** (`/tasks/daily-reports?team=:id`) - 施工日報
- **施工照片** (`/tasks/photos?team=:id`) - 現場照片
- **任務進度** (`/tasks/progress?team=:id`) - 進度追蹤

**與組織上下文的差異**：
- ❌ 沒有：創建任務、任務詳情、任務表單、任務指派、天氣記錄
- ✅ 保留：多視角查看、任務執行和狀態更新、待辦清單、施工日報、現場照片、進度更新

#### 3. 團隊問題 (Team Issues) ⭐⭐⭐⭐
團隊問題查看和指派（簡化版）

- **問題列表** (`/issues?team=:id`) - 問題列表（過濾團隊相關）
- **問題指派** (`/issues/assignments?team=:id`) - 團隊問題分配

**與組織上下文的差異**：
- ❌ 沒有：創建問題、問題詳情、問題處理、處理照片、關閉問題、問題同步日誌
- ✅ 保留：查看團隊相關問題、團隊內部問題指派

#### 4. 團隊溝通 (Team Communication) ⭐⭐⭐⭐
團隊內部溝通和協作（簡化版）

- **討論區** (`/communication/discussions?team=:id`) - 團隊討論區
- **評論管理** (`/communication/comments?team=:id`) - 評論列表
- **團隊通知** (`/communication/team-notify?team=:id`) - 團隊通知

**與組織上下文的差異**：
- ❌ 沒有：發表評論、通知中心、通知詳情、通知規則設定、即時通知、待辦中心
- ✅ 保留：團隊討論區、評論列表（只讀）、團隊通知（簡化版）

#### 5. 團隊文檔 (Team Documents) ⭐⭐⭐
團隊文檔快速訪問（簡化版）

- **文檔列表** (`/documents?team=:id`) - 團隊文檔（過濾團隊可訪問）
- **上傳文檔** (`/documents/upload`) - 上傳文件

**與組織上下文的差異**：
- ❌ 沒有：文檔瀏覽器、文檔預覽、圖紙查看器、文檔元數據管理、版本管理、權限設置
- ✅ 保留：文檔列表（團隊可訪問的文檔）、上傳文檔（基本功能）

### 路由參數

| 參數名 | 示例值 | 說明 | 獲取方式 |
|--------|--------|------|----------|
| `:id` | `uuid-team-xxx` | 團隊 ID | `WorkspaceContextService.contextId()` |
| `?team=:id` | `?team=uuid-team-xxx` | 團隊 ID（查詢參數） | URL 查詢參數 |

### 使用場景

1. **團隊成員每日任務檢視**：查看任務、更新狀態、上傳照片、填寫日報
2. **團隊負責人任務協調**：查看成員狀態、分配問題、發布公告
3. **施工現場記錄**：上傳照片、填寫日報、查看問題、討論現場問題

- --

## 🔍 三個上下文功能對比詳表

### 任務管理功能對比

| 功能 | 個人上下文 | 組織上下文 | 團隊上下文 |
|------|-----------|-----------|-----------|
| **查看任務** | ✅ 聚合視圖（跨組織、跨團隊） | ✅ 組織任務視圖 | ✅ 團隊任務視圖 |
| **創建任務** | ❌ | ✅ | ❌ |
| **編輯任務** | ❌ | ✅ | ❌ |
| **刪除任務** | ❌ | ✅ | ❌ |
| **任務指派** | ❌ | ✅ | ❌ |
| **更新任務狀態** | ✅ | ✅ | ✅ |
| **任務看板** | ❌ | ✅ | ✅ |
| **任務日曆** | ❌ | ✅ | ✅ |
| **任務列表** | ❌ | ✅ | ✅ |
| **任務樹狀圖** | ❌ | ✅ | ✅ |
| **日報** | ❌ | ✅ | ✅ |
| **施工照片** | ❌ | ✅ | ✅ |
| **天氣記錄** | ❌ | ✅ | ❌ |
| **任務進度** | ❌ | ✅ | ✅ |

### 藍圖功能對比

| 功能 | 個人上下文 | 組織上下文 | 團隊上下文 |
|------|-----------|-----------|-----------|
| **藍圖列表** | ✅ 個人藍圖 | ✅ 組織藍圖 | ❌ |
| **創建藍圖** | ✅ 個人藍圖（簡化） | ✅ 組織藍圖（完整） | ❌ |
| **Git-like 分支** | ❌ | ✅ 完整支援 | ❌ |
| **主分支管理** | ❌ | ✅ | ❌ |
| **分支管理** | ❌ | ✅ | ❌ |
| **Fork 任務** | ❌ | ✅ | ❌ |
| **Pull Request** | ❌ | ✅ | ❌ |
| **PR 審查** | ❌ | ✅ | ❌ |

### 問題追蹤功能對比

| 功能 | 個人上下文 | 組織上下文 | 團隊上下文 |
|------|-----------|-----------|-----------|
| **查看問題** | ❌ | ✅ | ✅ 僅團隊相關 |
| **創建問題** | ❌ | ✅ | ❌ |
| **編輯問題** | ❌ | ✅ | ❌ |
| **問題指派** | ❌ | ✅ | ✅ 團隊內部 |
| **問題處理** | ❌ | ✅ | ❌ |
| **關閉問題** | ❌ | ✅ | ❌ |
| **問題同步日誌** | ❌ | ✅ | ❌ |

### 文檔管理功能對比

| 功能 | 個人上下文 | 組織上下文 | 團隊上下文 |
|------|-----------|-----------|-----------|
| **文檔列表** | ✅ 個人文檔 | ✅ 組織文檔 | ✅ 團隊可訪問 |
| **上傳文檔** | ✅ | ✅ | ✅ |
| **下載文檔** | ✅ | ✅ | ✅ |
| **文檔預覽** | ✅ 基本 | ✅ 完整 | ✅ 基本 |
| **版本管理** | ❌ | ✅ | ❌ |
| **權限設置** | ❌ | ✅ | ❌ |
| **圖紙查看器** | ❌ | ✅ | ❌ |
| **文檔元數據** | ❌ | ✅ | ❌ |

### 溝通協作功能對比

| 功能 | 個人上下文 | 組織上下文 | 團隊上下文 |
|------|-----------|-----------|-----------|
| **通知中心** | ✅ 所有通知 | ✅ 組織通知 | ✅ 團隊通知 |
| **討論區** | ❌ | ✅ | ✅ |
| **評論管理** | ❌ | ✅ | ✅ 只讀 |
| **待辦中心** | ✅ 個人待辦 | ✅ 組織待辦 | ❌ |
| **通知規則** | ❌ | ✅ | ❌ |
| **即時通知** | ❌ | ✅ | ❌ |

- --

## 🗂️ 數據文件結構

### JSON 結構說明

三個上下文使用相同的 JSON 結構：

```json
{
  "app": {
    "name": "NG-ALAIN",
    "description": "Ng-zorro admin panel front-end framework"
  },
  "menu": [
    {
      "text": "Context Name",      // 菜單組名稱
      "i18n": "menu.context",      // 國際化 key
      "group": true,               // 標記為菜單組
      "hideInBreadcrumb": true,    // 不顯示在麵包屑中
      "children": [                // 子菜單項
        {
          "text": "Module Name",
          "i18n": "menu.context.module",
          "icon": "anticon-icon",  // NG-ZORRO 圖標
          "children": [
            {
              "text": "Feature Name",
              "link": "/path/:param",  // 路由路徑（支持參數）
              "i18n": "menu.context.module.feature"
            }
          ]
        }
      ]
    }
  ]
}
```

### 字段說明

| 字段 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `text` | string | ✅ | 菜單項顯示文字（英文） |
| `i18n` | string | ✅ | 國際化 key，用於多語言支援 |
| `icon` | string | ❌ | NG-ZORRO 圖標名稱（如 `anticon-user`） |
| `link` | string | ❌ | 路由路徑（如有 children 則不需要） |
| `group` | boolean | ❌ | 是否為菜單組 |
| `hideInBreadcrumb` | boolean | ❌ | 是否隱藏在麵包屑中 |
| `children` | array | ❌ | 子菜單項數組 |

- --

## 🔗 路由參數處理

### 參數替換邏輯

在 `WorkspaceMenuService` 中，路由會自動替換參數：

```typescript
// 個人上下文
'/accounts/:userId' → '/accounts/abc-123'  // 替換為當前用戶 ID

// 組織上下文
'/accounts/org/:id/members' → '/accounts/org/org-abc/members'  // 替換為組織 ID
'/tasks/board?org=:id' → '/tasks/board?org=org-abc'  // 替換為組織 ID

// 團隊上下文
'/accounts/org/teams/:id/members' → '/accounts/org/teams/team-abc/members'  // 替換為團隊 ID
'/tasks/board?team=:id' → '/tasks/board?team=team-abc'  // 替換為團隊 ID
```

### 參數獲取方式

| 上下文 | 參數類型 | 獲取方式 |
|--------|---------|---------|
| 個人 | `:userId` | `WorkspaceContextService.currentUserAccountId()` |
| 組織 | `:id` 或 `?org=:id` | `WorkspaceContextService.contextId()` |
| 團隊 | `:id` 或 `?team=:id` | `WorkspaceContextService.contextId()` |

- --

## 📐 開發指南

### 判斷功能應歸屬哪個上下文

#### 應加入個人上下文的情況：
- ✅ 是否為個人數據或偏好？
- ✅ 是否需要跨組織/團隊聚合視圖？
- ✅ 是否為個人快捷入口？

#### 應加入組織上下文的情況：
- ✅ 是否為組織管理功能？
- ✅ 是否需要完整的管理能力？
- ✅ 是否涉及 Git-like 分支管理？
- ✅ 是否需要數據分析和報表？
- ✅ 是否需要品質管理？

#### 應加入團隊上下文的情況：
- ✅ 是否為團隊執行功能？
- ✅ 是否需要團隊成員協作？
- ✅ 是否為簡化的查看功能？
- ❌ 不應包含：複雜管理功能、數據分析、個人數據

### 添加新功能的步驟

1. **更新對應的 JSON 數據文件**
   - 個人：`src/assets/tmp/user-data.json`
   - 組織：`src/assets/tmp/organization-data.json`
   - 團隊：`src/assets/tmp/team-data.json`

2. **添加國際化**
   ```typescript
   // src/assets/tmp/i18n/zh-TW.json
   {
     "menu": {
       "context": {
         "module": {
           "newfeature": "新功能"
         }
       }
     }
   }
   ```

3. **實現路由組件**
   ```typescript
   // src/app/routes/new-feature/new-feature.component.ts
   @Component({
     selector: 'app-new-feature',
     standalone: true,
     imports: [SHARED_IMPORTS],
     templateUrl: './new-feature.component.html'
   })
   export class NewFeatureComponent {
     // 實現邏輯
   }
   ```

4. **更新路由配置**
   ```typescript
   // src/app/routes/routes.ts
   {
     path: 'new-feature',
     loadComponent: () => import('./new-feature/new-feature.component')
       .then(m => m.NewFeatureComponent)
   }
   ```

### 數據加載模式

**推薦模式**（使用 Signals）：

```typescript
export class FeatureComponent {
  private workspaceContext = inject(WorkspaceContextService);
  private dataService = inject(YourDataService);

  // 使用 computed 或 effect 響應上下文變化
  readonly data = computed(() => {
    const contextId = this.workspaceContext.contextId();
    const contextType = this.workspaceContext.contextType();

    if (!contextId) return [];

    // 根據上下文類型加載數據
    switch (contextType) {
      case 'user':
        return this.dataService.loadUserData(contextId);
      case 'organization':
        return this.dataService.loadOrgData(contextId);
      case 'team':
        return this.dataService.loadTeamData(contextId);
      default:
        return [];
    }
  });
}
```

- --

## 💡 最佳實踐

### DO's ✅

#### 個人上下文
1. **保持輕量**：快速響應，避免複雜的數據處理
2. **聚合視圖**：充分利用跨組織聚合特性
3. **快速訪問**：提供最常用功能的快捷入口
4. **個人化**：根據用戶偏好定制顯示內容

#### 組織上下文
1. **充分利用完整功能**：提供最完整的功能集
2. **使用 Git-like 分支模型**：充分利用藍圖分支管理
3. **重視數據分析**：定期查看分析報表，做出數據驅動決策
4. **建立規範流程**：使用品質管理和 PR 審查建立質量保證

#### 團隊上下文
1. **快速更新狀態**：充分利用看板拖拽功能快速更新任務狀態
2. **及時記錄**：每日填寫日報和上傳照片，保持記錄完整
3. **團隊溝通**：積極使用討論區，保持團隊溝通暢通
4. **進度透明**：及時更新任務進度，讓團隊了解進展

### DON'Ts ❌

#### 個人上下文
1. **不要添加管理功能**：管理功能應放在組織上下文
2. **不要添加團隊特定功能**：團隊相關功能應放在團隊上下文
3. **不要添加重複功能**：避免與組織/團隊上下文功能重複
4. **不要過度複雜化**：保持個人上下文的簡潔性

#### 組織上下文
1. **不要在個人上下文添加組織功能**：組織管理功能應保留在組織上下文
2. **不要跳過 PR 審查**：確保數據質量，不要直接合併
3. **不要忽視權限管理**：正確設置成員和團隊權限
4. **不要過度簡化**：保持組織上下文的完整性

#### 團隊上下文
1. **不要期待完整管理功能**：複雜管理操作需切換到組織上下文
2. **不要忽視權限限制**：團隊上下文有意設計為簡化版
3. **不要繞過流程**：問題創建等功能需在組織上下文完成
4. **不要過度複雜化**：保持團隊上下文的簡潔性

- --

## 🎨 使用場景範例

### 場景 1：跨上下文協作流程

1. 專案經理（組織上下文）
```text

2. 組織分支（組織上下文）
   - Fork 任務 → 創建組織分支 → 開始執行

3. 團隊成員（團隊上下文）
   - 查看任務 → 更新狀態 → 上傳照片 → 填寫日報

4. 組織分支（組織上下文）
   - 完成任務 → 提交 PR → 等待審查

5. 專案經理（組織上下文）
   - 審查 PR → 批准合併 → 查看分析報表

6. 個人視角（個人上下文）
   - 查看所有指派任務 → 查看通知 → 管理個人待辦
```

### 場景 2：問題處理流程

1. 團隊成員（團隊上下文）
   - 發現問題 → 查看問題列表（只讀）
```text
2. 切換到組織上下文
   - 創建問題 → 問題即時同步至主分支

3. 主分支擁有者（組織上下文）
   - 收到通知 → 查看問題 → 處理問題

4. 問題更新同步回組織分支

5. 團隊成員（個人上下文）
   - 查看所有通知 → 查看問題更新
```

- --

## 🔗 相關資源

### 主要文檔
- [工作區上下文使用與規劃指南](./工作區上下文使用與規劃指南.md) - 完整系統說明
- [個人上下文菜單功能說明](./個人上下文菜單功能說明-user-data.md) - 個人上下文詳細說明
- [組織上下文菜單功能說明](./組織上下文菜單功能說明-organization-data.md) - 組織上下文詳細說明
- [團隊上下文菜單功能說明](./團隊上下文菜單功能說明-team-data.md) - 團隊上下文詳細說明
- [工作區上下文切換流程圖](./工作區上下文切換流程圖.mermaid.md) - 視覺化流程圖

### 數據文件
- [user-data.json](../src/assets/tmp/user-data.json) - 個人上下文菜單數據
- [organization-data.json](../src/assets/tmp/organization-data.json) - 組織上下文菜單數據
- [team-data.json](../src/assets/tmp/team-data.json) - 團隊上下文菜單數據

### 技術文檔
- [工作區上下文系統架構審查](./工作區上下文系統架構審查.md) - 技術架構
- [工作區系統快速參考指南](./工作區系統-快速參考指南.md) - 開發者參考
- [完整架構流程圖](./architecture/20-complete-architecture-flowchart.mermaid.md) - Git-like 分支模型
- [架構審查報告](./architecture/21-architecture-review-report.md) - 生產就緒版架構

- --

**文檔維護者**：開發團隊
**最後更新**：2025-01-15
**版本**：v1.0

