# RLS 安全脈絡 (FYI - RLS)

> 參考：[@fyi.md](./fyi.md)

記錄 Row Level Security (RLS) 策略的設計決策、實施細節、權限控制邏輯、安全考量等。

**相關文檔**：
- [安全與 RLS 權限矩陣](./21-安全與-RLS-權限矩陣.md) - RLS 策略詳細說明
- [安全檢查清單](./41-安全檢查清單.md) - RLS 檢查項目
- [架構說明](./fyi-architecture.md) - 權限系統架構

---

## RLS 核心概念

### 什麼是 RLS？

Row Level Security (RLS) 是 PostgreSQL 的原生功能，Supabase 基於此提供細粒度的資料存取控制。每個資料表都可以定義多個策略 (Policy)，策略基於 JWT Token 中的聲明 (Claims) 進行判斷。

### JWT Token 結構

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",  // user_id (auth.uid())
  "email": "user@example.com",
  "role": "authenticated",
  "user_metadata": {
    "account_id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

### 策略類型

- **SELECT Policy**: 控制讀取權限
- **INSERT Policy**: 控制新增權限
- **UPDATE Policy**: 控制更新權限
- **DELETE Policy**: 控制刪除權限

---

## 系統架構中的 RLS

### Git-like 分支模型與 RLS

系統採用 Git-like 分支模型，RLS 策略需要支援：

1. **主分支（擁有者控制）**
   - 只有藍圖擁有者可以修改任務結構
   - 只有藍圖擁有者可以審核和合併 PR

2. **組織分支（協作組織）**
   - 協作組織只能填寫承攬欄位
   - 協作組織可以創建 PR，但不能直接修改主分支

3. **權限分離**
   - 分支權限必須在資料庫層（RLS）與應用層雙重驗證
   - RLS 作為最後一道防線，確保資料安全

### 51 張資料表的 RLS 策略

所有 51 張資料表均啟用 RLS 策略，分為 11 個模組：

- 🔐 帳戶與身份系統 (4 張)
- 🤝 組織協作系統 (3 張)
- 🔒 權限系統 (5 張)
- 🎯 藍圖/專案系統 (5 張)
- 📋 任務執行系統 (9 張)
- ✅ 品質驗收系統 (4 張)
- ⚠️ 問題追蹤系統 (4 張)
- 💬 協作溝通系統 (6 張)
- 📊 資料分析系統 (6 張)
- 🤖 機器人系統 (3 張)
- ⚙️ 系統管理 (2 張)

---

## 角色系統與 RLS

### 預設角色

| 角色名稱 | 角色代碼 | 優先級 | 描述 |
|---------|---------|--------|------|
| 系統管理員 | `system_admin` | 1000 | 全系統權限，管理所有專案 |
| 專案經理 | `project_manager` | 800 | 專案管理，任務指派，報表審核 |
| 工地主任 | `site_supervisor` | 600 | 現場管理，日報提交，問題處理 |
| 品管人員 | `quality_controller` | 500 | 品質驗收，問題開立 |
| 施工人員 | `worker` | 300 | 執行任務，提交進度 |
| 觀察者 | `viewer` | 100 | 唯讀權限，查看專案 |

### 角色與 RLS 策略

RLS 策略通過 `user_roles` 和 `roles` 表來判斷用戶權限：

```sql
-- 檢查用戶是否為系統管理員
EXISTS (
  SELECT 1 FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.account_id = auth.uid()
  AND r.name = 'system_admin'
)
```

---

## RLS 策略設計模式

### 模式 1：擁有者檢查

```sql
-- 藍圖擁有者可以查看和編輯
owner_id = auth.uid()
```

### 模式 2：角色檢查

```sql
-- 檢查用戶是否具有特定角色
EXISTS (
  SELECT 1 FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.account_id = auth.uid()
  AND ur.blueprint_id = blueprints.id
  AND r.name IN ('project_manager', 'site_supervisor')
)
```

### 模式 3：成員檢查

```sql
-- 檢查用戶是否為藍圖成員
EXISTS (
  SELECT 1 FROM user_roles ur
  WHERE ur.account_id = auth.uid()
  AND ur.blueprint_id = blueprints.id
)
```

### 模式 4：分支權限檢查

```sql
-- 檢查用戶是否有分支權限
EXISTS (
  SELECT 1 FROM branch_permissions bp
  WHERE bp.branch_id = blueprint_branches.id
  AND bp.account_id = auth.uid()
  AND bp.permission_level IN ('read', 'write', 'admin')
)
```

### 模式 5：組合檢查

```sql
-- 系統管理員 OR 擁有者 OR 成員
(
  EXISTS (SELECT 1 FROM user_roles WHERE account_id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'system_admin'))
  OR
  owner_id = auth.uid()
  OR
  EXISTS (SELECT 1 FROM user_roles WHERE account_id = auth.uid() AND blueprint_id = blueprints.id)
)
```

---

## 特殊場景的 RLS 策略

### 暫存區 (Staging Area) 策略

暫存區表 (`task_staging`) 需要特殊處理：

1. **提交者**：可以查看和撤回自己的提交（48 小時內）
2. **藍圖擁有者**：可以查看所有提交，但不能撤回

```sql
-- SELECT: 提交者可以查看自己的提交，擁有者可以查看所有提交
CREATE POLICY "Users can view their own staging submissions"
ON task_staging FOR SELECT
USING (
  submitted_by = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM blueprints b
    WHERE b.id = task_staging.blueprint_id
    AND b.owner_id = auth.uid()
  )
);

-- UPDATE: 只有提交者可以在 48 小時內撤回
CREATE POLICY "Users can withdraw their own submissions within 48h"
ON task_staging FOR UPDATE
USING (
  submitted_by = auth.uid()
  AND expires_at > NOW()
);
```

### Bot 賬戶策略

Bot 賬戶需要區分個人 Bot 和組織 Bot：

1. **個人 Bot**：`auth_organization_id = NULL`，只有創建者可查看
2. **組織 Bot**：`auth_organization_id = 組織ID`，創建者和組織成員都可查看

```sql
-- accounts 表 SELECT 策略（Bot 部分）
CREATE POLICY "Users can view own account or organization/bot accounts they belong or created"
ON accounts FOR SELECT
USING (
  -- 自己創建的 Bot（無論個人還是組織 Bot）
  ((type)::text = 'Bot'::text AND auth_bot_id = (SELECT auth.uid()))
  OR
  -- 所屬組織的 Bot（如果用戶是該組織的成員）
  (
    (type)::text = 'Bot'::text 
    AND auth_organization_id IS NOT NULL
    AND (SELECT private.is_user_org_member(auth_organization_id, auth.uid()))
  )
);
```

**設計決策**：
- 使用 `auth_bot_id` 記錄創建者（用戶ID）
- 使用 `auth_organization_id` 區分個人 Bot（NULL）和組織 Bot（組織ID）
- 組織成員可以查看所屬組織的 Bot

### PR (Pull Request) 策略

PR 表 (`pull_requests`) 需要支援：

1. **創建者**：可以查看和更新自己的 PR
2. **藍圖擁有者**：可以查看、審核和合併所有 PR
3. **分支成員**：可以查看相關分支的 PR

```sql
-- SELECT: 創建者、擁有者、分支成員可以查看
CREATE POLICY "Users can view PRs they are involved in"
ON pull_requests FOR SELECT
USING (
  created_by = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM blueprints b
    WHERE b.id = pull_requests.blueprint_id
    AND b.owner_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM blueprint_branches bb
    WHERE bb.id = pull_requests.branch_id
    AND bb.organization_id = auth.uid()
  )
);
```

### 分支權限策略

分支權限表 (`branch_permissions`) 需要確保：

1. **藍圖擁有者**：可以管理所有分支權限
2. **分支擁有者**：可以管理自己分支的權限
3. **其他用戶**：只能查看自己的權限

```sql
-- SELECT: 用戶可以查看自己的權限，擁有者可以查看所有權限
CREATE POLICY "Users can view branch permissions"
ON branch_permissions FOR SELECT
USING (
  account_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM blueprint_branches bb
    JOIN blueprints b ON bb.blueprint_id = b.id
    WHERE bb.id = branch_permissions.branch_id
    AND (b.owner_id = auth.uid() OR bb.organization_id = auth.uid())
  )
);
```

---

## RLS 與應用層權限驗證

### 雙重驗證原則

**設計決策**：分支權限必須在資料庫層（RLS）與應用層雙重驗證

**原因**：
- RLS 作為最後一道防線，即使應用層邏輯有漏洞，資料庫層也能保護資料
- 應用層驗證提供更好的用戶體驗（提前拒絕，明確錯誤訊息）
- 雙重驗證確保安全性

**實施方式**：
1. **應用層**：在 Service 層檢查權限，提前拒絕無權限操作
2. **資料庫層**：RLS 策略作為最後防線，即使繞過應用層也無法存取資料

### 權限檢查流程

```
用戶操作請求
  ↓
應用層權限檢查 (Service)
  ↓ (通過)
Repository 調用
  ↓
Supabase Client
  ↓
PostgreSQL RLS 策略檢查
  ↓ (通過)
資料庫操作
```

---

## RLS 策略測試與驗證

### 使用 Supabase MCP 工具檢查

```bash
# 列出所有表
@SUPABASE 列出所有資料庫表

# 檢查 RLS 策略
# 在 Supabase Dashboard 中檢查每個表的 RLS 策略
```

### SQL 查詢檢查

```sql
-- 檢查表是否啟用 RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- 檢查策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### 測試場景

1. **系統管理員**：應該可以存取所有資料
2. **藍圖擁有者**：應該可以存取自己藍圖的所有資料
3. **協作組織**：應該只能存取自己分支的資料，且只能修改承攬欄位
4. **查看者**：應該只能查看，不能修改
5. **未授權用戶**：應該無法存取任何資料

---

## 常見問題與解決方案

### 問題 1：RLS 策略過於複雜

**問題**：策略包含多個 EXISTS 子查詢，性能較差

**解決方案**：
- 使用索引優化查詢
- 考慮使用函數封裝複雜邏輯
- 使用物化視圖（Materialized View）預計算權限

### 問題 2：跨表權限檢查

**問題**：需要檢查多個表的關聯關係

**解決方案**：
- 使用 JOIN 或 EXISTS 子查詢
- 確保外鍵關係正確
- 使用遞迴 CTE（Common Table Expression）處理樹狀結構

### 問題 3：動態權限

**問題**：權限需要根據資料內容動態判斷

**解決方案**：
- 使用函數封裝動態邏輯
- 在策略中調用函數
- 確保函數性能良好

---

## 設計決策記錄

### 2025-01-15: RLS 策略設計

**決策**：所有 51 張資料表均啟用 RLS 策略

**原因**：
- 確保資料安全，即使應用層有漏洞也能保護資料
- 符合最小權限原則
- 支援 Git-like 分支模型的權限需求

**權衡**：
- 性能考量：RLS 策略會增加查詢複雜度，但可以通過索引優化
- 開發複雜度：需要為每個表設計策略，但提供更好的安全性

---

## 參考資源

- [Supabase RLS 文檔](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS 文檔](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [安全與 RLS 權限矩陣](./21-安全與-RLS-權限矩陣.md)
- [安全檢查清單](./41-安全檢查清單.md)

---

**最後更新**：2025-01-15  
**維護者**：開發團隊

