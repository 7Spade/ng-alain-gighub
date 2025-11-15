# 開發種子資料

這個目錄包含開發環境的種子資料腳本。

## 用途

種子資料用於：
1. 本地開發環境初始化
2. 測試環境數據準備
3. 開發人員快速啟動

## 種子資料組織

### 1. 基礎資料 (01_基礎資料.sql)
- 系統設定
- 功能開關
- 預設角色和權限

### 2. 測試帳戶 (02_測試帳戶.sql)
- 測試用戶
- 測試團隊
- 測試組織

### 3. 範例專案 (03_範例專案.sql)
- 範例藍圖
- 範例分支
- 範例任務

### 4. 測試資料 (04_測試資料.sql)
- 測試任務
- 測試品質記錄
- 測試問題

## 執行順序

種子資料應按以下順序執行：

```sql
-- 1. 基礎資料
\i 01_基礎資料.sql

-- 2. 測試帳戶
\i 02_測試帳戶.sql

-- 3. 範例專案
\i 03_範例專案.sql

-- 4. 測試資料（可選）
\i 04_測試資料.sql
```

## 使用方式

### 透過 Supabase CLI

```bash
# 執行所有種子資料
supabase db seed

# 執行特定種子資料
psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed/01_基礎資料.sql
```

### 透過 Supabase MCP 工具

```typescript
// 讀取種子資料檔案
const seedSQL = await fs.readFile('supabase/seed/01_基礎資料.sql', 'utf-8');

// 執行種子資料
await supabase.executeSQL(seedSQL);
```

## 注意事項

1. **不要在生產環境執行種子資料**
2. 種子資料應該是冪等的（可重複執行）
3. 使用 `ON CONFLICT` 處理重複資料
4. 密碼應使用安全的雜湊值

## 範例種子資料

```sql
-- 01_基礎資料.sql
-- 插入預設角色
INSERT INTO roles (id, name, description)
VALUES 
  ('owner', '擁有者', '專案擁有者，擁有所有權限'),
  ('admin', '管理員', '管理專案和團隊'),
  ('member', '成員', '一般成員'),
  ('viewer', '查看者', '僅能查看')
ON CONFLICT (id) DO NOTHING;

-- 插入預設權限
INSERT INTO permissions (id, resource, action, description)
VALUES
  ('blueprint.create', 'blueprint', 'create', '建立藍圖'),
  ('blueprint.read', 'blueprint', 'read', '查看藍圖'),
  ('blueprint.update', 'blueprint', 'update', '更新藍圖'),
  ('blueprint.delete', 'blueprint', 'delete', '刪除藍圖')
ON CONFLICT (id) DO NOTHING;
```

## 參考文檔

- [資料表清單總覽](../../docs/30-資料表清單總覽.md)
- [完整 SQL 表結構定義](../../docs/30-0-完整SQL表結構定義.md)
