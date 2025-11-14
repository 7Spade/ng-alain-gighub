# API 概覽

> **目的**：為 AI 提供 API 接口的快速參考，幫助理解系統的 API 結構和主要端點。

## 🔌 API 架構

系統使用 **Supabase** 作為後端服務，提供以下 API 層：

- **PostgREST** - 自動生成 REST API（基於 PostgreSQL 表結構）
- **Realtime Gateway** - WebSocket 實時通信
- **Storage Gateway** - 檔案 API
- **Auth Gateway** - 認證 API
- **Edge Functions** - 自訂 API

## 🔐 認證 API

### 用戶註冊
```
POST /auth/v1/signup
```

### 用戶登入
```
POST /auth/v1/login
```

### Token 刷新
```
POST /auth/v1/token?grant_type=refresh_token
```

### 獲取用戶資訊
```
GET /auth/v1/user
```

### 用戶登出
```
POST /auth/v1/logout
```

## 🎯 藍圖/專案 API

### 查詢專案列表
```
GET /rest/v1/blueprints
GET /rest/v1/blueprints?owner_id=eq.{uid}  # 查詢我的專案
```

### 查詢專案詳情
```
GET /rest/v1/blueprints?id=eq.{id}
```

### 建立專案
```
POST /rest/v1/blueprints
```

### 更新專案
```
PATCH /rest/v1/blueprints?id=eq.{id}
```

### 刪除專案
```
DELETE /rest/v1/blueprints?id=eq.{id}
```

## 📋 任務管理 API

### 查詢任務列表
```
GET /rest/v1/tasks?blueprint_id=eq.{id}
GET /rest/v1/tasks?status=in.(pending,in_progress)  # 篩選狀態
```

### 查詢任務詳情
```
GET /rest/v1/tasks?id=eq.{id}&select=*,task_assignments!inner
```

### 建立任務
```
POST /rest/v1/tasks
```

### 更新任務
```
PATCH /rest/v1/tasks?id=eq.{id}
```

### 刪除任務
```
DELETE /rest/v1/tasks?id=eq.{id}
```

### 指派任務
```
POST /rest/v1/task_assignments
```

## 📝 施工日誌 API

### 查詢施工日誌
```
GET /rest/v1/daily_reports?task_id=eq.{id}
```

### 建立施工日誌
```
POST /rest/v1/daily_reports
```

### 上傳施工日誌照片
```
POST /rest/v1/report_photos
```

## ✅ 品質驗收 API

### 查詢品管檢查
```
GET /rest/v1/quality_checks?task_id=eq.{id}
```

### 建立品管檢查
```
POST /rest/v1/quality_checks
```

### 查詢驗收記錄
```
GET /rest/v1/inspections?task_id=eq.{id}
```

### 建立驗收記錄
```
POST /rest/v1/inspections
```

## ⚠️ 問題追蹤 API

### 查詢問題列表
```
GET /rest/v1/issues?branch_id=eq.{id}
```

### 建立問題
```
POST /rest/v1/issues
```

### 更新問題
```
PATCH /rest/v1/issues?id=eq.{id}
```

## 🔄 PR 管理 API

### 查詢 PR 列表
```
GET /rest/v1/pull_requests?branch_id=eq.{id}
```

### 建立 PR
```
POST /rest/v1/pull_requests
```

### 審核 PR
```
PATCH /rest/v1/pull_requests?id=eq.{id}
```

## 📄 文件管理 API

### 查詢文件列表
```
GET /rest/v1/documents?blueprint_id=eq.{id}
```

### 上傳文件
```
POST /rest/v1/documents
```

### 下載文件
```
GET /storage/v1/object/public/{bucket}/{path}
```

## 🔒 權限控制

所有 API 請求都需要：
1. **認證 Token**：通過 `Authorization: Bearer {token}` 頭部傳遞
2. **RLS 檢查**：資料庫層自動檢查行級權限
3. **應用層驗證**：Repository 模式封裝權限驗證邏輯

## 📚 參考文檔

- [API 接口詳細文檔](../../docs/33-API-接口詳細文檔.md)
- [API 介面映射圖](../../docs/25-API-介面映射圖.mermaid.md)
- [Supabase 文檔](https://supabase.com/docs)

---

**最後更新**：2025-01-15

