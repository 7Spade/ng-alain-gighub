# Edge Functions

這個目錄包含 Supabase Edge Functions。

## Edge Functions 架構

根據文檔 `docs/20-部署基礎設施視圖.mermaid.md`，系統需要以下 Edge Functions:

### 1. weather-api
天氣 API 整合功能，每 6 小時緩存一次天氣資料。

**功能**：
- 調用 OpenWeather API
- 緩存天氣資料到 `weather_cache` 表
- 提供天氣資料查詢接口

### 2. notification-handler
通知處理功能，處理系統通知邏輯。

**功能**：
- 處理站內通知
- 發送 Email 通知（透過 SendGrid）
- 發送推播通知
- 通知規則引擎

### 3. progress-calculator
進度計算功能，計算任務和專案進度。

**功能**：
- 計算任務完成進度
- 更新 `progress_tracking` 表
- 生成進度報表

### 4. analytics-processor
數據分析處理功能，處理分析資料。

**功能**：
- 數據聚合
- 報表生成
- 更新 `analytics_cache` 表

### 5. branch-merge
分支合併功能，處理 Git-like 分支模型的合併邏輯。

**功能**：
- 處理 Pull Request 合併
- 數據同步到主分支
- 合併衝突檢測

### 6. webhook
Webhook 處理功能，處理外部 Webhook 事件。

**功能**：
- 接收外部 Webhook
- 事件分發
- 事件記錄

## 開發指南

### 創建新 Function

```bash
supabase functions new <function_name>
```

### Function 結構

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // 初始化 Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // 處理請求
    const data = {
      message: "Hello from Edge Function!"
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          "Content-Type": "application/json",
          "Connection": "keep-alive"
        } 
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" } 
      }
    )
  }
})
```

### 本地測試

```bash
# 啟動本地 Function
supabase functions serve <function_name>

# 測試 Function
curl -i --location --request POST 'http://localhost:54321/functions/v1/<function_name>' \
  --header 'Authorization: Bearer <anon_key>' \
  --header 'Content-Type: application/json' \
  --data '{"key":"value"}'
```

### 部署

```bash
supabase functions deploy <function_name>
```

## 環境變數

Edge Functions 可以使用以下環境變數：

- `SUPABASE_URL` - Supabase URL
- `SUPABASE_ANON_KEY` - Supabase Anon Key
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key（僅後端使用）

設置環境變數：

```bash
supabase secrets set KEY=VALUE
```

## 監控與日誌

查看 Function 日誌：

```bash
supabase functions logs <function_name>
```

## 參考資料

- [Edge Functions 文檔](https://supabase.com/docs/guides/functions)
- [Deno 文檔](https://deno.land/manual)
- [部署基礎設施視圖](../../docs/20-部署基礎設施視圖.mermaid.md)
