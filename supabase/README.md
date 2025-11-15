# Supabase Infrastructure

這個目錄包含 Supabase 相關的基礎設施配置和腳本。

## 目錄結構

```
supabase/
├── config.toml          # Supabase 配置文件
├── migrations/          # 資料庫遷移腳本
├── functions/           # Edge Functions
└── seed/               # 開發種子資料
```

## 使用方式

### 本地開發

1. 安裝 Supabase CLI:
```bash
npm install -g supabase
```

2. 啟動本地 Supabase:
```bash
supabase start
```

3. 停止本地 Supabase:
```bash
supabase stop
```

### 資料庫遷移

創建新遷移:
```bash
supabase migration new <migration_name>
```

執行遷移:
```bash
supabase db push
```

重置資料庫:
```bash
supabase db reset
```

### Edge Functions

創建新 Function:
```bash
supabase functions new <function_name>
```

本地測試 Function:
```bash
supabase functions serve <function_name>
```

部署 Function:
```bash
supabase functions deploy <function_name>
```

### 種子資料

執行種子資料:
```bash
supabase db seed
```

## 配置說明

詳細配置請參考 `config.toml` 文件中的註釋。

## 參考資料

- [Supabase CLI 文檔](https://supabase.com/docs/reference/cli)
- [Supabase 遷移指南](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Edge Functions 指南](https://supabase.com/docs/guides/functions)
