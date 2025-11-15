# API 介面映射圖

> 📋 **目的**：展示前端與後端 API 的映射關係，包含 Supabase REST API、RPC Functions、Realtime 等介面

**最後更新**：2025-11-15  
**維護者**：開發團隊

---

```mermaid
graph TB
    subgraph "前端應用 Frontend Application"
        WebApp[Web 應用<br/>Angular 20.3.x + NG-ZORRO 20.3.x + NG-ALAIN 20.0.x]
        MobileApp[Mobile PWA]
    end

    subgraph "API Gateway Layer"
        PostgREST[PostgREST<br/>自動生成 REST API]
        RealtimeGW[Realtime Gateway<br/>WebSocket]
        StorageGW[Storage Gateway<br/>檔案 API]
        AuthGW[Auth Gateway<br/>認證 API]
        EdgeGW[Edge Functions<br/>自訂 API]
    end

    subgraph "認證與授權 Auth APIs"
        direction LR
        A1[POST /auth/v1/signup<br/>用戶註冊]
        A2[POST /auth/v1/login<br/>Email 登入]
        A3[POST /auth/v1/token?grant_type=refresh_token<br/>Token 刷新]
        A4[GET /auth/v1/user<br/>獲取用戶資訊]
        A5[POST /auth/v1/logout<br/>登出]
        A6[POST /auth/v1/magiclink<br/>Magic Link]
        A7[POST /auth/v1/otp<br/>OTP 驗證]
    end

    subgraph "藍圖/專案 APIs"
        direction LR
        B1[GET /rest/v1/blueprints<br/>查詢專案列表]
        B2[GET /rest/v1/blueprints?id=eq.{id}<br/>查詢專案詳情]
        B3[POST /rest/v1/blueprints<br/>建立專案]
        B4[PATCH /rest/v1/blueprints?id=eq.{id}<br/>更新專案]
        B5[DELETE /rest/v1/blueprints?id=eq.{id}<br/>刪除專案]
        B6[GET /rest/v1/blueprints?owner_id=eq.{uid}<br/>查詢我的專案]
    end

    subgraph "任務管理 APIs"
        direction LR
        T1[GET /rest/v1/tasks?blueprint_id=eq.{id}<br/>查詢任務列表]
        T2[GET /rest/v1/tasks?id=eq.{id}&select=*,task_assignments!inner⭐<br/>任務詳情含指派]
        T3[POST /rest/v1/tasks<br/>建立任務]
        T4[PATCH /rest/v1/tasks?id=eq.{id}<br/>更新任務]
        T5[DELETE /rest/v1/tasks?id=eq.{id}<br/>刪除任務]
        T6[POST /rest/v1/task_assignments<br/>指派任務]
        T7[GET /rest/v1/tasks?status=in.⭐pending,in_progress⭐<br/>篩選狀態]
        T8[POST /rest/v1/staging_submissions<br/>建立暫存提交]
        T9[PATCH /rest/v1/staging_submissions?id=eq.{id}<br/>撤回/確認暫存]
    end

    subgraph "每日報表 APIs"
        direction LR
        R1[GET /rest/v1/daily_reports?task_id=eq.{id}<br/>查詢報表列表]
        R2[POST /rest/v1/daily_reports<br/>提交報表]
        R3[PATCH /rest/v1/daily_reports?id=eq.{id}<br/>更新報表]
        R4[POST /storage/v1/object/images/{path}<br/>上傳施工照片]
        R5[GET /rest/v1/weather_cache?weather_date=eq.{date}<br/>獲取天氣快取]
        R6[POST /functions/v1/fetch-weather<br/>Edge Function 天氣 API]
    end

    subgraph "品質驗收 APIs"
        direction LR
        Q1[GET /rest/v1/quality_checks?task_id=eq.{id}<br/>查詢驗收列表]
        Q2[POST /rest/v1/quality_checks<br/>建立驗收]
        Q3[PATCH /rest/v1/quality_checks?id=eq.{id}<br/>更新驗收結果]
        Q4[POST /storage/v1/object/images/{path}<br/>上傳驗收照片]
        Q5[POST /functions/v1/process-qc-result<br/>處理驗收結果 Edge]
    end

    subgraph "問題追蹤 APIs"
        direction LR
        I1[GET /rest/v1/issues?blueprint_id=eq.{id}<br/>查詢問題列表]
        I2[GET /rest/v1/issues?id=eq.{id}&select=*,issue_assignments⭐<br/>問題詳情]
        I3[POST /rest/v1/issues<br/>開立問題]
        I4[PATCH /rest/v1/issues?id=eq.{id}<br/>更新問題狀態]
        I5[POST /rest/v1/issue_assignments<br/>指派問題]
        I6[POST /functions/v1/notify-issue<br/>問題通知 Edge]
        I7[GET /rest/v1/issues?status=eq.open&severity=eq.high<br/>篩選高優先級問題]
    end

    subgraph "分支治理 APIs"
        direction LR
        G1[POST /rest/v1/branch_forks<br/>建立 Fork 任務]
        G2[POST /rest/v1/blueprint_branches<br/>建立承攬分支]
        G3[POST /rest/v1/organization_collaborations<br/>發送協作邀請]
        G4[GET /rest/v1/blueprint_branches?blueprint_id=eq.{id}<br/>查詢分支列表]
        G5[POST /rest/v1/pull_requests<br/>提交 PR]
        G6[POST /rest/v1/pull_request_reviews<br/>審查 PR]
        G7[POST /functions/v1/branch-merge<br/>Edge 合併主分支]
        G8[GET /rest/v1/branch_metrics?blueprint_id=eq.{id}<br/>查詢承攬績效]
    end

    subgraph "協作通訊 APIs"
        direction LR
        C1[GET /rest/v1/comments?task_id=eq.{id}<br/>查詢留言列表]
        C2[POST /rest/v1/comments<br/>發布留言]
        C3[PATCH /rest/v1/comments?id=eq.{id}<br/>編輯留言]
        C4[DELETE /rest/v1/comments?id=eq.{id}<br/>刪除留言]
        C5[GET /rest/v1/notifications?recipient_id=eq.{uid}<br/>查詢通知]
        C6[PATCH /rest/v1/notifications?id=eq.{id}<br/>標記已讀]
        C7[GET /rest/v1/todos?account_id=eq.{uid}<br/>查詢待辦]
    end

    subgraph "文件管理 APIs"
        direction LR
        D1[POST /storage/v1/object/documents/{path}<br/>上傳文件]
        D2[GET /storage/v1/object/public/documents/{path}<br/>下載文件]
        D3[POST /rest/v1/documents<br/>記錄元資料]
        D4[GET /rest/v1/documents?blueprint_id=eq.{id}<br/>查詢文件列表]
        D5[DELETE /storage/v1/object/documents/{path}<br/>刪除檔案]
        D6[POST /storage/v1/object/drawings/{path}<br/>上傳圖紙]
    end

    subgraph "數據分析 APIs"
        direction LR
        N1[GET /rest/v1/progress_tracking?blueprint_id=eq.{id}<br/>查詢進度統計]
        N2[POST /functions/v1/calculate-progress<br/>計算進度 Edge]
        N3[GET /rest/v1/materialized_view_stats<br/>查詢物化視圖]
        N4[POST /functions/v1/generate-report<br/>生成報表 Edge]
        N5[GET /rest/v1/activity_logs?blueprint_id=eq.{id}<br/>查詢活動日誌]
    end

    subgraph "系統管理 APIs"
        direction LR
        S1[GET /rest/v1/roles<br/>查詢角色列表]
        S2[POST /rest/v1/user_roles<br/>指派角色]
        S3[GET /rest/v1/settings?key=eq.{key}<br/>查詢系統設定]
        S4[PATCH /rest/v1/settings?key=eq.{key}<br/>更新設定]
        S5[GET /rest/v1/teams?organization_id=eq.{id}<br/>查詢團隊]
    end

    subgraph "Realtime 訂閱 APIs"
        direction LR
        RT1[Channel: realtime:tasks<br/>訂閱任務變更]
        RT2[Channel: realtime:issues<br/>訂閱問題變更]
        RT3[Channel: realtime:comments<br/>訂閱留言變更]
        RT4[Channel: realtime:notifications<br/>訂閱通知推送]
        RT5[Broadcast: presence<br/>線上狀態]
    end

    %% 連接關係
    WebApp --> PostgREST
    WebApp --> RealtimeGW
    WebApp --> StorageGW
    WebApp --> AuthGW
    WebApp --> EdgeGW
    
    MobileApp --> PostgREST
    MobileApp --> RealtimeGW
    MobileApp --> StorageGW
    MobileApp --> AuthGW

    AuthGW --> A1 & A2 & A3 & A4 & A5 & A6 & A7
    PostgREST --> B1 & B2 & B3 & B4 & B5 & B6
    PostgREST --> T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9
    PostgREST --> R1 & R2 & R3 & R5
    StorageGW --> R4
    EdgeGW --> R6
    
    PostgREST --> Q1 & Q2 & Q3
    StorageGW --> Q4
    EdgeGW --> Q5
    
    PostgREST --> I1 & I2 & I3 & I4 & I5 & I7
    EdgeGW --> I6
    
    PostgREST --> C1 & C2 & C3 & C4 & C5 & C6 & C7
    
    StorageGW --> D1 & D2 & D5 & D6
    PostgREST --> D3 & D4
    
    PostgREST --> N1 & N3 & N5
    EdgeGW --> N2 & N4
    
    PostgREST --> S1 & S2 & S3 & S4 & S5
    
    PostgREST --> G1 & G2 & G3 & G4 & G5 & G6 & G8
    EdgeGW --> G7
    
    RealtimeGW --> RT1 & RT2 & RT3 & RT4 & RT5

    %% 樣式
    classDef authStyle fill:#E91E63,stroke:#880E4F,color:#fff
    classDef restStyle fill:#2196F3,stroke:#1565C0,color:#fff
    classDef storageStyle fill:#9C27B0,stroke:#6A1B9A,color:#fff
    classDef edgeStyle fill:#FF9800,stroke:#E65100,color:#fff
    classDef realtimeStyle fill:#4CAF50,stroke:#2E7D32,color:#fff

    class A1,A2,A3,A4,A5,A6,A7 authStyle
    class B1,B2,B3,B4,B5,B6,T1,T2,T3,T4,T5,T6,T7 restStyle
    class R1,R2,R3,R5,Q1,Q2,Q3,I1,I2,I3,I4,I5,I7 restStyle
    class C1,C2,C3,C4,C5,C6,C7,D3,D4,N1,N3,N5,S1,S2,S3,S4,S5 restStyle
    class R4,Q4,D1,D2,D5,D6 storageStyle
    class R6,Q5,I6,N2,N4 edgeStyle
    class RT1,RT2,RT3,RT4,RT5 realtimeStyle
```

## API 詳細說明文檔

### 1. 認證與授權 APIs

#### 1.1 用戶註冊
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "options": {
    "data": {
      "display_name": "張三",
      "phone": "+886912345678"
    }
  }
}

Response 200 OK:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "created_at": "2025-01-15T08:30:00Z"
  }
}
```

#### 1.2 Email 登入
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response 200 OK:
{
  "access_token": "...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": { ... }
}
```

#### 1.3 Token 刷新
```http
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json

{
  "refresh_token": "..."
}

Response 200 OK:
{
  "access_token": "...", // 新的 access token
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "..." // 新的 refresh token
}
```

### 2. PostgREST API 慣例

#### 2.1 查詢語法

**基本查詢**:
```http
GET /rest/v1/tasks
Authorization: Bearer {token}
```

**篩選 (Filter)**:
```http
GET /rest/v1/tasks?status=eq.in_progress
GET /rest/v1/tasks?priority=in.(high,urgent)
GET /rest/v1/tasks?title=ilike.*施工*
```

**排序 (Order)**:
```http
GET /rest/v1/tasks?order=created_at.desc
GET /rest/v1/tasks?order=priority.desc,created_at.asc
```

**分頁 (Pagination)**:
```http
GET /rest/v1/tasks?limit=20&offset=0
Headers:
  Range: 0-19
  Prefer: count=exact
```

**關聯查詢 (Join)**:
```http
GET /rest/v1/tasks?select=*,task_assignments(account_id,role)
GET /rest/v1/blueprints?select=*,tasks(count)
```

#### 2.2 插入資料
```http
POST /rest/v1/tasks
Authorization: Bearer {token}
Content-Type: application/json
Prefer: return=representation

{
  "blueprint_id": "...",
  "title": "基礎施工",
  "description": "地基開挖與鋼筋綁紮",
  "status": "pending",
  "priority": "high",
  "start_date": "2025-01-20",
  "due_date": "2025-01-30"
}

Response 201 Created:
{
  "id": "...",
  "blueprint_id": "...",
  "title": "基礎施工",
  ...
  "created_at": "2025-01-15T08:30:00Z"
}
```

#### 2.3 更新資料
```http
PATCH /rest/v1/tasks?id=eq.{task_id}
Authorization: Bearer {token}
Content-Type: application/json
Prefer: return=representation

{
  "status": "in_progress",
  "actual_hours": 8.5
}

Response 200 OK:
{
  "id": "...",
  "status": "in_progress",
  "actual_hours": 8.5,
  "updated_at": "2025-01-15T16:30:00Z"
}
```

#### 2.4 刪除資料
```http
DELETE /rest/v1/tasks?id=eq.{task_id}
Authorization: Bearer {token}

Response 204 No Content
```

### 3. Storage APIs

#### 3.1 上傳檔案
```http
POST /storage/v1/object/images/{blueprint_id}/daily_reports/{filename}
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  file: (binary data)

Response 200 OK:
{
  "Key": "images/{blueprint_id}/daily_reports/photo.jpg",
  "Id": "...",
  "Bucket": "images"
}
```

#### 3.2 下載檔案
```http
GET /storage/v1/object/public/images/{path}
或
GET /storage/v1/object/sign/images/{path}?expiresIn=3600
Authorization: Bearer {token}

Response 200 OK:
(binary file data)
```

#### 3.3 刪除檔案
```http
DELETE /storage/v1/object/images/{path}
Authorization: Bearer {token}

Response 200 OK:
{
  "message": "Successfully deleted"
}
```

### 4. Edge Functions APIs

#### 4.1 天氣 API 整合
```http
POST /functions/v1/fetch-weather
Authorization: Bearer {token}
Content-Type: application/json

{
  "blueprint_id": "...",
  "date": "2025-01-15",
  "location": {
    "lat": 25.0330,
    "lon": 121.5654
  }
}

Response 200 OK:
{
  "weather_date": "2025-01-15",
  "condition": "晴天",
  "temperature": 22.5,
  "humidity": 65,
  "wind_speed": 3.2,
  "cached": false
}
```

#### 4.2 通知處理
```http
POST /functions/v1/notify-issue
Authorization: Bearer {token}
Content-Type: application/json

{
  "issue_id": "...",
  "action": "assigned",
  "recipient_ids": ["...", "..."]
}

Response 200 OK:
{
  "notifications_created": 2,
  "emails_sent": 1
}
```

#### 4.3 進度計算
```http
POST /functions/v1/calculate-progress
Authorization: Bearer {token}
Content-Type: application/json

{
  "blueprint_id": "..."
}

Response 200 OK:
{
  "completion_rate": 68.5,
  "total_tasks": 50,
  "completed_tasks": 34,
  "pending_issues": 3,
  "calculated_at": "2025-01-15T16:30:00Z"
}
```

### 5. Realtime APIs

#### 5.1 訂閱任務變更
```typescript
const channel = supabase
  .channel('tasks-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'tasks',
      filter: 'blueprint_id=eq.' + blueprintId
    },
    (payload) => {
      console.log('Task change:', payload);
      // payload.eventType: 'INSERT' | 'UPDATE' | 'DELETE'
      // payload.new: 新資料
      // payload.old: 舊資料
    }
  )
  .subscribe();
```

#### 5.2 廣播訊息
```typescript
// 發送廣播
await channel.send({
  type: 'broadcast',
  event: 'cursor-pos',
  payload: { x: 100, y: 200, user: 'Alice' }
});

// 接收廣播
channel.on('broadcast', { event: 'cursor-pos' }, (payload) => {
  console.log('Cursor position:', payload);
});
```

#### 5.3 線上狀態追蹤
```typescript
// 追蹤線上用戶
const presenceChannel = supabase.channel('online-users', {
  config: { presence: { key: userId } }
});

presenceChannel
  .on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState();
    console.log('Online users:', Object.keys(state));
  })
  .on('presence', { event: 'join' }, ({ newPresences }) => {
    console.log('User joined:', newPresences);
  })
  .on('presence', { event: 'leave' }, ({ leftPresences }) => {
    console.log('User left:', leftPresences);
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presenceChannel.track({ online_at: new Date().toISOString() });
    }
  });
```

### 6. 錯誤處理

#### 6.1 錯誤回應格式
```json
{
  "error": {
    "code": "PGRST116",
    "message": "The result contains 0 rows",
    "details": null,
    "hint": null
  }
}
```

#### 6.2 常見錯誤碼
- **400 Bad Request**: 請求參數錯誤
- **401 Unauthorized**: JWT Token 無效或過期
- **403 Forbidden**: RLS Policy 權限拒絕
- **404 Not Found**: 資源不存在
- **409 Conflict**: 資料衝突 (如 UNIQUE 約束)
- **500 Internal Server Error**: 伺服器錯誤

### 7. 速率限制

- **認證 API**: 5 requests/分鐘/IP
- **一般 API**: 100 requests/分鐘/用戶
- **檔案上傳**: 10 uploads/分鐘/用戶
- **Realtime**: 100 messages/秒/channel

### 8. API 版本控制

當前版本: **v1**

未來版本變更策略:
- 向後相容的變更: 直接更新 v1
- 破壞性變更: 發布 v2,保留 v1 至少 6 個月

## API 端點清單

### Supabase REST 端點
| 資源 | 方法 | 路徑 | 說明 | 權限 |
|------|------|------|------|------|
| Blueprints | `GET` | `/rest/v1/blueprints` | 取得藍圖列表，支援篩選/排序 | `authenticated` + RLS |
| Blueprints | `POST` | `/rest/v1/blueprints` | 建立藍圖 | `authenticated`（需 `admin`/`manager`） |
| Blueprint Detail | `GET` | `/rest/v1/blueprints?id=eq.{id}` | 取得單筆藍圖資訊 | `authenticated` |
| Tasks | `GET` | `/rest/v1/tasks` | 取得任務列表 | `authenticated` + RLS |
| Tasks | `PATCH` | `/rest/v1/tasks?id=eq.{id}` | 更新任務狀態 | `authenticated` + 任務擁有者 |
| Documents | `GET` | `/rest/v1/documents` | 取得文件列表 | `authenticated` + RLS |
| Documents | `DELETE` | `/rest/v1/documents?id=eq.{id}` | 刪除文件並觸發儲存桶清理 | `admin` |
| Activities | `GET` | `/rest/v1/activity_logs` | 取得活動記錄 | `authenticated` + RLS |

### Supabase RPC / Stored Procedure
| 名稱 | 路徑 | 輸入 | 用途 |
|------|------|------|------|
| `rpc_get_blueprint_stats` | `/rest/v1/rpc/get_blueprint_stats` | `{ org_id }` | 回傳統計資料供 Dashboard 使用 |
| `rpc_assign_task` | `/rest/v1/rpc/assign_task` | `{ task_id, user_id }` | 指派任務並寫入審計紀錄 |
| `rpc_bulk_update_visibility` | `/rest/v1/rpc/bulk_update_visibility` | `{ ids[], visibility }` | 批次更新藍圖公開設定 |

### Edge Function / 自建服務
| 服務 | 方法 | 路徑 | 說明 |
|------|------|------|------|
| Export Service | `POST` | `/functions/v1/export` | 產生報表 (CSV/XLSX)，回傳下載連結 |
| Notification Relay | `POST` | `/functions/v1/notify` | 透過 Email / Slack 發送通知 |
| Webhook Receiver | `POST` | `/functions/v1/webhooks/{provider}` | 接收第三方事件（如付款成功） |

### Storage API
| 操作 | 方法 | 路徑 | 說明 |
|------|------|------|------|
| 上傳檔案 | `POST` | `/storage/v1/object/<bucket>/<path>` | 上傳後必須在 `documents` 資料表寫入 metadata |
| 下載檔案 | `GET` | `/storage/v1/object/<bucket>/<path>` | 透過 RLS 控制存取權限 |
| 列出檔案 | `GET` | `/storage/v1/object/list/<bucket>` | 列出指定路徑下的檔案 |

## 前端元件與 API 對應關係

| 前端元件 | 使用的 API | 說明 |
|----------|------------|------|
| **Account Module** | `/rest/v1/accounts` | 帳戶管理 |
| **Blueprint Module** | `/rest/v1/blueprints`、`/rest/v1/tasks`、`/rest/v1/documents` | 藍圖、任務、文件管理 |
| **Dashboard Module** | `/rest/v1/rpc/get_blueprint_stats` | 統計資料 |
| **Org Module** | `/rest/v1/accounts?account_type=eq.organization`、`/rest/v1/teams`、`/rest/v1/team_members` | 組織與成員管理 |
```

