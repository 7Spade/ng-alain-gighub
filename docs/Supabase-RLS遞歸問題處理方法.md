# Supabase RLS 遞歸問題處理方法

> **來源**：Supabase 官方文檔  
> **日期**：2025-01-15  
> **參考**：[Row Level Security 文檔](https://supabase.com/docs/guides/database/postgres/row-level-security#use-security-definer-functions)

---

## 📋 問題描述

當 RLS 策略在查詢中又查詢其他表時，如果這些表也有 RLS 策略，可能會形成循環查詢，導致 **"infinite recursion detected in policy"** 錯誤。

---

## ✅ 官方解決方案：使用 SECURITY DEFINER 函數

### 核心原理

**SECURITY DEFINER 函數**以函數創建者的權限執行，而不是調用者的權限。如果函數由具有 `bypassrls` 權限的角色（如 `postgres`）創建，則函數內部可以繞過 RLS 檢查，避免遞歸問題。

### 實施步驟

#### 1. 創建 private schema（推薦）

```sql
-- 創建 private schema 存放安全函數
-- 注意：private schema 不應該在 "Exposed schemas" 中
create schema if not exists private;
```

#### 2. 創建 SECURITY DEFINER 函數

```sql
-- 示例：檢查用戶是否是組織成員
create or replace function private.is_user_org_member(
  org_account_id UUID, 
  user_auth_id UUID
)
returns boolean
language plpgsql
security definer  -- 關鍵：以創建者權限執行
set search_path = ''  -- 防止 search_path 注入攻擊
as $$
begin
  return exists (
    select 1
    from public.team_members tm
    join public.teams t on tm.team_id = t.id
    join public.accounts a on tm.account_id = a.id
    where t.organization_id = org_account_id
      and a.auth_user_id = user_auth_id
  );
end;
$$;
```

#### 3. 在 RLS 策略中使用函數

```sql
-- 更新 accounts 表的 SELECT 策略
create policy "Users can view own account or organization accounts they belong"
on accounts for select
to authenticated
using (
  (select auth.uid()) = auth_user_id
  OR (
    type = 'Organization'
    AND (select private.is_user_org_member(id, auth.uid()))
  )
);
```

---

## 🔑 關鍵要點

### 1. SECURITY DEFINER 的作用

- **以創建者權限執行**：函數內部查詢不受調用者的 RLS 限制
- **避免遞歸**：函數內部查詢 `accounts` 表時不會觸發 `accounts` 表的 RLS 策略
- **性能優化**：減少 RLS 檢查次數，提高查詢性能

### 2. 安全注意事項

⚠️ **重要**：
- **不要將 SECURITY DEFINER 函數放在暴露的 schema 中**
- 使用 `set search_path = ''` 防止 search_path 注入攻擊
- 函數應該放在 `private` schema 中，並確保 `private` schema 不在 "Exposed schemas" 列表中

### 3. 性能優化建議

官方文檔建議使用 `select` 包裝函數調用以提高性能：

```sql
-- ❌ 不推薦：函數在每行都執行
using ( private.is_user_org_member(id, auth.uid()) )

-- ✅ 推薦：函數只執行一次，結果被緩存
using ( (select private.is_user_org_member(id, auth.uid())) )
```

---

## 📚 官方文檔示例

### 完整示例（來自 Supabase 文檔）

```sql
-- 創建 private schema
create schema if not exists private;

-- 創建 SECURITY DEFINER 函數
create function private.has_good_role()
returns boolean
language plpgsql
security definer  -- 以創建者權限執行
as $$
begin
  return exists (
    select 1 from roles_table
    where (select auth.uid()) = user_id 
      and role = 'good_role'
  );
end;
$$;

-- 在 RLS 策略中使用函數
create policy "rls_test_select"
on test_table
to authenticated
using ( (select private.has_good_role()) );
```

---

## 🎯 我們的實施方案

### 針對 accounts 表的 RLS 遞歸問題

#### 1. 創建輔助函數

```sql
-- 檢查用戶是否是組織成員
create or replace function private.is_user_org_member(
  org_account_id UUID, 
  user_auth_id UUID
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1
    from public.team_members tm
    join public.teams t on tm.team_id = t.id
    join public.accounts a on tm.account_id = a.id
    where t.organization_id = org_account_id
      and a.auth_user_id = user_auth_id
  );
end;
$$;

-- 檢查用戶是否是組織管理員
create or replace function private.is_user_org_admin(
  org_account_id UUID, 
  user_auth_id UUID
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1
    from public.team_members tm
    join public.teams t on tm.team_id = t.id
    join public.accounts a on tm.account_id = a.id
    where t.organization_id = org_account_id
      and a.auth_user_id = user_auth_id
      and tm.role = 'leader'
  );
end;
$$;
```

#### 2. 更新 RLS 策略

```sql
-- 刪除舊策略
drop policy if exists "Users can view own account or organization accounts they belong" on accounts;
drop policy if exists "Users can update own account or organization accounts they mana" on accounts;

-- 創建新策略（使用 SECURITY DEFINER 函數）
create policy "Users can view own account or organization accounts they belong"
on accounts for select
to authenticated
using (
  (select auth.uid()) = auth_user_id
  OR (
    type = 'Organization'
    AND (select private.is_user_org_member(id, auth.uid()))
  )
);

create policy "Users can update own account or organization accounts they manage"
on accounts for update
to authenticated
using (
  (select auth.uid()) = auth_user_id
  OR (
    type = 'Organization'
    AND (select private.is_user_org_admin(id, auth.uid()))
  )
)
with check (
  (select auth.uid()) = auth_user_id
  OR (
    type = 'Organization'
    AND (select private.is_user_org_admin(id, auth.uid()))
  )
);
```

---

## ✅ 驗證步驟

1. **檢查函數是否創建成功**：
```sql
SELECT proname, prosecdef 
FROM pg_proc 
WHERE pronamespace = 'private'::regnamespace;
```

2. **測試查詢**：
```sql
-- 應該返回 200 OK，不再出現遞歸錯誤
GET /rest/v1/accounts?select=*
```

3. **驗證權限控制**：
- 用戶只能看到自己的 account
- 用戶可以看到所屬組織的 account
- 用戶只能更新自己的 account 或管理的組織 account

---

## 📖 參考資源

- [Supabase RLS 文檔](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [SECURITY DEFINER 函數說明](https://supabase.com/docs/guides/database/postgres/row-level-security#use-security-definer-functions)
- [RLS 性能最佳實踐](https://github.com/orgs/supabase/discussions/14576)

---

**最後更新**：2025-01-15  
**維護者**：開發團隊

