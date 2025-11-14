```mermaid
flowchart TD
    Start([資料生命週期開始]) --> DataSourceDecision{資料來源類型}
    
    %% ==================== 用戶輸入資料 ====================
    DataSourceDecision -->|用戶輸入| UserInput[👤 用戶操作<br/>- 表單提交<br/>- 檔案上傳<br/>- 狀態變更]
    
    UserInput --> FrontendValidation[🔍 前端驗證<br/>- Zod Schema<br/>- Angular Typed Forms<br/>- 即時驗證]
    
    FrontendValidation -->|驗證失敗| ValidationError[❌ 顯示錯誤訊息<br/>- 欄位標紅<br/>- 錯誤提示]
    ValidationError --> UserInput
    
    FrontendValidation -->|驗證通過| APICall[📡 API 調用<br/>- Supabase Client<br/>- JWT Token 附加<br/>- HTTPS 加密]
    
    %% ==================== 第三方資料 ====================
    DataSourceDecision -->|第三方 API| ThirdPartyAPI[🌐 外部資料源<br/>- 天氣 API<br/>- OAuth Provider<br/>- 郵件服務]
    
    ThirdPartyAPI --> EdgeFunction[⚙️ Edge Function 處理<br/>- API Key 管理<br/>- 錯誤處理<br/>- 重試機制]
    
    EdgeFunction --> APICache{需要快取?}
    APICache -->|是| CacheWrite[💾 寫入快取<br/>- weather_cache 表<br/>- TTL: 6 小時<br/>- Redis (可選)]
    APICache -->|否| APICall
    CacheWrite --> APICall
    
    %% ==================== Realtime 訂閱 ====================
    DataSourceDecision -->|即時訂閱| RealtimeSubscribe[⚡ Realtime 訂閱<br/>- WebSocket 連線<br/>- Database 變更<br/>- Broadcast 廣播]
    
    %% ==================== Extract: 資料擷取 ====================
    APICall --> BackendValidation[🔍 後端驗證<br/>- PostgreSQL Constraints<br/>- RLS Policy 檢查<br/>- Trigger 前驗證]
    
    BackendValidation -->|驗證失敗| APIError[❌ API 錯誤回應<br/>- 4xx/5xx 狀態碼<br/>- 錯誤訊息<br/>- Stack Trace (dev)]
    APIError --> FrontendError[前端錯誤處理<br/>- Toast 通知<br/>- 錯誤日誌]
    FrontendError --> End([結束])
    
    BackendValidation -->|驗證通過| RLSCheck{RLS 權限檢查}
    
    RLSCheck -->|無權限| PermissionDenied[🚫 權限拒絕<br/>- 403 Forbidden<br/>- 無資料回應]
    PermissionDenied --> FrontendError
    
    %% ==================== Transform: 資料轉換 ====================
    RLSCheck -->|有權限| DataOperation{資料操作類型}
    
    DataOperation -->|INSERT| InsertData[📝 插入資料<br/>- 自動生成 UUID<br/>- 設定預設值<br/>- 時間戳記]
    
    DataOperation -->|UPDATE| UpdateData[✏️ 更新資料<br/>- 樂觀鎖檢查<br/>- 更新時間戳記<br/>- 版本號遞增]
    
    DataOperation -->|DELETE| DeleteData[🗑️ 刪除資料<br/>- 軟刪除 (可選)<br/>- 級聯處理<br/>- 歸檔備份]
    
    DataOperation -->|SELECT| SelectData[📖 查詢資料<br/>- 索引優化<br/>- 分頁處理<br/>- 關聯查詢]
    
    %% ==================== Trigger & Automation ====================
    InsertData --> DBTrigger{Database Trigger}
    UpdateData --> DBTrigger
    DeleteData --> DBTrigger
    
    DBTrigger --> ActivityLog[📋 活動記錄<br/>- activity_logs 表<br/>- 記錄變更內容<br/>- IP/User Agent]
    
    DBTrigger --> NotificationTrigger{需要通知?}
    NotificationTrigger -->|是| CreateNotification[🔔 建立通知<br/>- notifications 表<br/>- 通知類型分類<br/>- 目標用戶]
    NotificationTrigger -->|否| RealtimeBroadcast
    
    CreateNotification --> RealtimeBroadcast[⚡ Realtime 廣播<br/>- WebSocket 推送<br/>- 訂閱者接收<br/>- UI 即時更新]
    
    ActivityLog --> RealtimeBroadcast
    
    %% ==================== Storage 處理 ====================
    InsertData --> FileCheck{包含檔案?}
    FileCheck -->|是| FileUpload[📦 Storage 上傳<br/>- Bucket 隔離<br/>- 路徑規劃<br/>- 權限設定]
    FileCheck -->|否| LoadResponse
    
    FileUpload --> ImageProcess{圖片處理?}
    ImageProcess -->|是| ImageOptimize[🖼️ 圖片優化<br/>- 壓縮 (WebP)<br/>- 縮圖生成<br/>- EXIF 提取]
    ImageProcess -->|否| StoreMetadata
    
    ImageOptimize --> StoreMetadata[💾 儲存元資料<br/>- 檔案大小<br/>- MIME 類型<br/>- Storage 路徑]
    
    StoreMetadata --> LoadResponse
    
    %% ==================== Load: 資料載入 ====================
    RealtimeBroadcast --> LoadResponse[📤 載入回應<br/>- JSON 序列化<br/>- 資料轉換<br/>- 關聯資料 JOIN]
    
    SelectData --> CacheCheck{快取檢查}
    CacheCheck -->|命中| CacheHit[⚡ 快取命中<br/>- Redis/Memory<br/>- 快速回應]
    CacheCheck -->|未命中| QueryDB[🗄️ 資料庫查詢<br/>- 複雜查詢<br/>- Materialized Views<br/>- 索引優化]
    
    CacheHit --> LoadResponse
    QueryDB --> CacheUpdate[💾 更新快取<br/>- 寫入 Redis<br/>- 設定 TTL]
    CacheUpdate --> LoadResponse
    
    LoadResponse --> APIResponse[✅ API 回應<br/>- 200 OK<br/>- JSON 資料<br/>- ETag 標頭]
    
    %% ==================== 前端資料處理 ====================
    APIResponse --> FrontendProcess[🖥️ 前端處理<br/>- JSON 解析<br/>- 類型轉換<br/>- 資料正規化]
    
    FrontendProcess --> StateUpdate[📊 狀態更新<br/>- Angular Signals 快取<br/>- Signals 全局狀態<br/>- Angular 元件重渲染]
    
    StateUpdate --> UIRender[🎨 UI 渲染<br/>- Angular 變更檢測<br/>- 增量更新<br/>- 樂觀 UI]
    
    %% ==================== Realtime 即時更新 ====================
    RealtimeSubscribe --> RealtimeReceive[📨 接收 Realtime 事件<br/>- INSERT/UPDATE/DELETE<br/>- Broadcast 訊息<br/>- Presence 狀態]
    
    RealtimeReceive --> RealtimeProcess[⚙️ 事件處理<br/>- 事件類型判斷<br/>- 資料合併<br/>- 衝突解決]
    
    RealtimeProcess --> StateUpdate
    
    %% ==================== 資料分析與 ETL ====================
    UIRender --> AnalyticsCheck{需要分析?}
    AnalyticsCheck -->|否| End
    AnalyticsCheck -->|是| AnalyticsQueue[📊 分析佇列<br/>- Edge Function<br/>- 非同步處理<br/>- 批次計算]
    
    AnalyticsQueue --> DataAggregation[📈 資料聚合<br/>- 統計計算<br/>- 趨勢分析<br/>- KPI 計算]
    
    DataAggregation --> MaterializedView[💎 物化視圖<br/>- 預計算結果<br/>- 定期更新<br/>- 查詢加速]
    
    MaterializedView --> AnalyticsStore[💾 分析資料存儲<br/>- progress_tracking 表<br/>- 統計報表<br/>- 歷史趨勢]
    
    AnalyticsStore --> End
    
    %% ==================== 資料備份與歸檔 ====================
    ActivityLog --> BackupSchedule{備份排程}
    BackupSchedule -->|每日| DailyBackup[📦 每日備份<br/>- pg_dump<br/>- 增量備份<br/>- 壓縮加密]
    BackupSchedule -->|每週| WeeklyBackup[📦 每週完整備份<br/>- 完整資料匯出<br/>- Storage 檔案<br/>- 異地儲存]
    
    DailyBackup --> BackupStorage[☁️ 備份儲存<br/>- AWS S3<br/>- 版本控制<br/>- 保留 30 天]
    WeeklyBackup --> BackupStorage
    
    BackupStorage --> End
    
    %% ==================== 資料清理與歸檔 ====================
    MaterializedView --> DataRetention{資料保留政策}
    DataRetention -->|過期資料| Archive[📚 資料歸檔<br/>- 移至冷儲存<br/>- 壓縮儲存<br/>- 保留索引]
    DataRetention -->|活躍資料| End
    
    Archive --> ColdStorage[❄️ 冷儲存<br/>- 長期保存<br/>- 低成本<br/>- 可檢索]
    ColdStorage --> End
    
    %% 樣式定義
    classDef inputStyle fill:#4CAF50,stroke:#2E7D32,color:#fff,stroke-width:2px
    classDef processStyle fill:#2196F3,stroke:#1565C0,color:#fff,stroke-width:2px
    classDef errorStyle fill:#F44336,stroke:#C62828,color:#fff,stroke-width:2px
    classDef storageStyle fill:#9C27B0,stroke:#6A1B9A,color:#fff,stroke-width:2px
    classDef realtimeStyle fill:#FF9800,stroke:#E65100,color:#fff,stroke-width:2px
    classDef analyticsStyle fill:#00BCD4,stroke:#00838F,color:#fff,stroke-width:2px
    classDef endStyle fill:#607D8B,stroke:#37474F,color:#fff,stroke-width:3px
    
    class UserInput,ThirdPartyAPI,RealtimeSubscribe inputStyle
    class FrontendValidation,BackendValidation,DataOperation,FrontendProcess,RealtimeProcess processStyle
    class ValidationError,APIError,PermissionDenied,FrontendError errorStyle
    class FileUpload,ImageOptimize,StoreMetadata,BackupStorage,ColdStorage storageStyle
    class RealtimeBroadcast,RealtimeReceive,CreateNotification realtimeStyle
    class AnalyticsQueue,DataAggregation,MaterializedView,AnalyticsStore analyticsStyle
    class Start,End endStyle
```

## ETL 流程詳細說明

### Extract (擷取階段)

#### 1. 資料來源
- **用戶輸入**: 表單、檔案上傳、互動操作
- **第三方 API**: 天氣資料、OAuth 資訊、郵件回執
- **Realtime 訂閱**: 即時資料變更通知

#### 2. 前端驗證
- **技術**: Zod Schema + Angular Typed Forms
- **驗證內容**:
  - 必填欄位檢查
  - 資料類型驗證
  - 格式驗證 (Email, URL, 日期)
  - 自訂業務規則
- **優點**: 即時反饋，減少無效請求

#### 3. API 調用
- **協議**: HTTPS REST API
- **認證**: JWT Token (Bearer)
- **錯誤處理**: 
  - 網路錯誤重試 (3 次)
  - 超時處理 (30 秒)
  - 降級策略 (離線模式)

### Transform (轉換階段)

#### 1. 後端驗證
- **PostgreSQL Constraints**: 
  - NOT NULL, UNIQUE, CHECK, FOREIGN KEY
  - 資料完整性保證
- **RLS Policy**: 
  - 基於 JWT Claims 的權限檢查
  - 細粒度存取控制
- **Trigger 前驗證**: 
  - 業務邏輯檢查
  - 狀態機驗證

#### 2. 資料操作
- **INSERT**: 
  - 自動生成 UUID (gen_random_uuid())
  - 預設值填充 (created_at, updated_at)
  - 關聯資料建立
- **UPDATE**: 
  - 樂觀鎖 (version 欄位)
  - 更新時間戳記
  - 部分更新支援
- **DELETE**: 
  - 軟刪除 (deleted_at 欄位)
  - 級聯刪除 (ON DELETE CASCADE)
  - 歸檔備份
- **SELECT**: 
  - 索引優化 (B-Tree, GiST)
  - 分頁查詢 (LIMIT/OFFSET)
  - 關聯查詢 (JOIN)

#### 3. Database Triggers
- **活動記錄**: 所有 CUD 操作自動記錄
- **通知觸發**: 根據業務規則產生通知
- **資料同步**: 更新相關聚合資料

#### 4. 檔案處理
- **上傳**:
  - 分段上傳 (Multipart Upload)
  - 斷點續傳 (Resumable Upload)
  - 進度追蹤
- **圖片優化**:
  - 壓縮 (TinyPNG, ImageMagick)
  - 格式轉換 (WebP)
  - 縮圖生成 (多尺寸)
  - EXIF 提取與清理
- **Storage 管理**:
  - Bucket 隔離 (images/, documents/, drawings/)
  - 路徑規劃 ({blueprint_id}/{entity_type}/{filename})
  - CDN 加速

### Load (載入階段)

#### 1. 快取策略
- **多層快取**:
  - L1: Browser Cache (Service Worker)
  - L2: CDN Cache (Cloudflare)
  - L3: Redis Cache (可選)
  - L4: PostgreSQL Shared Buffers
- **快取失效**:
  - Time-based (TTL)
  - Event-based (Realtime 通知)
  - Manual Invalidation (手動清除)

#### 2. 資料載入
- **序列化**: JSON.stringify() with BigInt support
- **資料轉換**: 
  - 日期字串 → Date 物件
  - Enum → 人類可讀文字
  - 關聯 ID → 完整物件
- **分頁載入**: 
  - Cursor-based Pagination (無限滾動)
  - Offset-based Pagination (傳統分頁)

#### 3. 前端狀態管理
- **Angular Signals**:
  - 自動快取與重取
  - 背景更新
  - 樂觀更新 (Optimistic Updates)
- **Signals**: 
  - 全局狀態管理
  - 用戶資訊、主題設定
- **Angular State**: 
  - 元件級狀態
  - 表單狀態

#### 4. Realtime 即時更新
- **事件類型**:
  - INSERT: 新增資料推送
  - UPDATE: 更新資料推送
  - DELETE: 刪除資料推送
  - BROADCAST: 自訂訊息廣播
- **衝突解決**:
  - Last Write Wins (最後寫入優先)
  - Operational Transformation (操作轉換)
  - Conflict Resolution UI (衝突解決介面)

### 資料分析與聚合

#### 1. 分析佇列
- **非同步處理**: Edge Function 背景執行
- **批次計算**: 聚合多筆資料後處理
- **防抖動**: 避免頻繁計算

#### 2. 資料聚合
- **統計計算**:
  - 任務完成率
  - 問題解決率
  - 施工進度百分比
- **趨勢分析**:
  - 每日/每週/每月趨勢
  - 同期對比
  - 預測模型

#### 3. 物化視圖
- **預計算**: 複雜查詢結果預先計算
- **定期更新**: Cron Job 每小時更新
- **查詢加速**: 直接查詢視圖，速度提升 10-100 倍

### 備份與歸檔

#### 1. 備份策略
- **每日增量備份**: 
  - 只備份變更資料
  - pg_dump with --incremental
  - 壓縮後上傳 S3
- **每週完整備份**: 
  - 完整資料匯出
  - Storage 檔案打包
  - 異地儲存 (Multi-Region)

#### 2. 資料歸檔
- **觸發條件**: 
  - 專案完成超過 6 個月
  - 用戶手動歸檔
  - 自動歸檔排程
- **歸檔處理**: 
  - 移至冷儲存 (Glacier)
  - 壓縮儲存 (gzip, zstd)
  - 保留元資料索引

#### 3. 災難復原
- **RTO** (Recovery Time Objective): 1 小時
- **RPO** (Recovery Point Objective): 15 分鐘
- **恢復測試**: 每季度演練一次

## 資料生命週期階段

### 1. 資料捕獲（Data Capture）
- **來源**：用戶輸入、外部系統、IoT 裝置
- **資料類型**：
  - `daily_reports`：每日報表（照片、進度、問題）
  - `tasks`：任務資料（13 維度）
  - `documents`：文件上傳
  - `quality_checks`：品質檢查記錄
- **捕獲方式**：前端表單提交、API 呼叫、批次匯入

### 2. 資料處理（Data Processing）
- **Edge Functions 計算**：
  - 任務進度計算（EVM、CPM）
  - 成本統計
  - 風險評估
  - 品質指標計算
- **物化視圖更新**：
  - `progress_tracking`：進度追蹤資料
  - 任務統計視圖：任務快照
  - 進度摘要視圖：進度摘要
- **觸發器處理**：
  - 自動計算衍生欄位
  - 維護關聯資料一致性

### 3. 資料分析（Data Analysis）
- **統計報表生成**：
  - Dashboard KPI 計算
  - 專案進度報表
  - 成本分析報表
  - 品質趨勢分析
- **圖表渲染**：
  - Gantt 圖（任務時間軸）
  - 進度圖表（EVM）
  - 品質分佈圖
  - 風險矩陣圖

### 4. 快取策略（Cache Strategy）
- **weather_cache**：
  - 快取第三方天氣 API 回應
  - 失效時間：1 小時
  - 觸發更新：任務建立、日期變更
- **進度快取**：
  - 快取計算後的進度資料
  - 失效條件：任務狀態變更、進度更新
  - 自動刷新：透過 `BlueprintAggregationRefreshService`

### 5. 資料匯出（Data Export）
- **報表匯出**：
  - CSV 格式：任務清單、進度報表
  - XLSX 格式：完整專案報表（含圖表）
  - PDF 格式：正式報告文件
- **匯出管道**：
  - Edge Function `/functions/v1/export`
  - 非同步處理大型報表
  - 提供下載連結

## 資料流轉詳細流程

### 任務資料流
```
用戶建立任務
  ↓
前端表單提交 → POST /rest/v1/tasks
  ↓
Repository.insert() → 寫入 tasks
  ↓
資料庫觸發器 → 更新關聯資料
  ↓
Edge Function 計算 → 更新進度、成本
  ↓
物化視圖刷新 → progress_tracking
  ↓
Aggregation Refresh Service → 通知 Facade
  ↓
前端 Signal 更新 → UI 自動刷新
```

### 文件資料流
```
用戶上傳文件
  ↓
前端上傳 → POST /storage/v1/object/documents/...
  ↓
Storage 儲存 → Supabase Storage
  ↓
Repository.insert() → 寫入 documents
  ↓
Edge Function 處理 → 產生縮圖、提取 metadata
  ↓
版本控制 → document_versions（如需要）
  ↓
聚合更新 → progress_tracking
```

### 報表資料流
```
用戶請求報表
  ↓
前端呼叫 → POST /functions/v1/export
  ↓
Edge Function 查詢 → 聚合多表資料
  ↓
資料轉換 → CSV/XLSX/PDF 格式
  ↓
Storage 暫存 → 產生下載連結
  ↓
通知用戶 → Email/Slack
  ↓
用戶下載 → GET /storage/v1/object/exports/...
```

## 資料品質保證

### 資料驗證
- **前端驗證**：Typed Forms 確保型別正確
- **後端驗證**：資料庫約束、觸發器檢查
- **業務規則**：Service 層驗證邏輯

### 資料一致性
- **事務處理**：關鍵操作使用資料庫事務
- **關聯維護**：觸發器自動維護外鍵關係
- **快取同步**：Aggregation Refresh 確保快取一致性

### 資料清理
- **歸檔策略**：90 天後歸檔舊資料
- **刪除策略**：軟刪除（標記 deleted_at）
- **備份保留**：定期備份，保留歷史版本