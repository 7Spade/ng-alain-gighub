# Supabase 服務

> ⚠️ 只有 `core/` 層的服務或 Repository 可以直接注入 `SupabaseService`。Routes/UI 必須透過 Facade/Repository 間接取得資料，並保留 Supabase MCP 操作紀錄。

## 概述

`SupabaseService` 提供封裝於核心服務內的 Supabase 客戶端，用於與 Supabase 後端進行交互。

## 配置

### 1. 環境變數設置

在專案根目錄創建 `.env` 檔案（參考 `.env.example`）：

```env
NG_APP_SUPABASE_URL=https://your-project.supabase.co
NG_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. 取得 Supabase 憑證

1. 登入 [Supabase Dashboard](https://app.supabase.com)
2. 選擇您的專案
3. 前往 **Settings > API**
4. 複製：
   - **Project URL** → `NG_APP_SUPABASE_URL`
   - **anon public** key → `NG_APP_SUPABASE_ANON_KEY`

## 使用方式

### 基本封裝（Service / Repository）

```typescript
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core';

@Injectable({ providedIn: 'root' })
export class TaskRepository {
  private readonly supabase = inject(SupabaseService);

  async listTasks() {
    const { data, error } = await this.supabase.client
      .from('tasks')
      .select('*');

    if (error) {
      throw error; // 交由 ErrorStateService 或上層處理
    }

    return data;
  }
}
```

### UI 層呼叫範例（透過 Facade/Repository）

```typescript
import { Component, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { TaskRepository } from '@core/blueprint/task/repository/task.repository';
import type { Task } from '@shared/models/task/task.model';

@Component({
  standalone: true,
  selector: 'app-task-list',
  imports: [SHARED_IMPORTS],
  template: `
    @if (loading()) {
      <nz-spin nzSimple />
    }
    @else {
      @for (task of tasks(); track task.id) {
        <div>{{ task.name }}</div>
      }
    }
  `
})
export class TaskListComponent {
  private readonly repo = inject(TaskRepository);
  private readonly #loading = signal(false);
  private readonly #tasks = signal<readonly Task[]>([]);

  readonly loading = this.#loading.asReadonly();
  readonly tasks = this.#tasks.asReadonly();

  async ngOnInit(): Promise<void> {
    this.#loading.set(true);
    try {
      this.#tasks.set(await this.repo.listTasks());
    } finally {
      this.#loading.set(false);
    }
  }
}
```

### 典型資料操作（服務內）

```typescript
// 查詢所有記錄
const { data, error } = await this.supabase.client
  .from('users')
  .select('*');

// 條件查詢
const { data, error } = await this.supabase.client
  .from('users')
  .select('*')
  .eq('status', 'active');

// 插入資料
const { data, error } = await this.supabase.client
  .from('users')
  .insert({ name: 'John', email: 'john@example.com' });

// 更新資料
const { data, error } = await this.supabase.client
  .from('users')
  .update({ name: 'Jane' })
  .eq('id', 1);

// 刪除資料
const { data, error } = await this.supabase.client
  .from('users')
  .delete()
  .eq('id', 1);
```

### 認證

```typescript
// 註冊
const { data, error } = await this.supabase.client.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// 登入
const { data, error } = await this.supabase.client.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// 登出
await this.supabase.client.auth.signOut();

// 獲取當前用戶
const { data: { user } } = await this.supabase.client.auth.getUser();
```

### 即時訂閱

```typescript
const subscription = this.supabase.client
  .channel('changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'users' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// 取消訂閱
subscription.unsubscribe();
```

### 檔案儲存

```typescript
// 上傳檔案
const { data, error } = await this.supabase.client.storage
  .from('bucket-name')
  .upload('path/to/file.jpg', file);

// 下載檔案
const { data, error } = await this.supabase.client.storage
  .from('bucket-name')
  .download('path/to/file.jpg');

// 獲取公開 URL
const { data } = this.supabase.client.storage
  .from('bucket-name')
  .getPublicUrl('path/to/file.jpg');
```

### 檢查配置狀態

```typescript
if (this.supabase.isConfigured) {
  // Supabase 已正確配置
} else {
  // 請檢查環境變數設置
  console.warn('Supabase 尚未配置');
}
```

## MCP 操作提醒

- 使用 Supabase MCP 工具（`list_tables`、`execute_sql`、`apply_migration` 等）執行資料庫任務。
- 在 PR 或設計文件中附上 MCP 執行情況，並同步更新 `docs/blueprint_schema.md` 與相關 AGENTS/ADR。
- UI 層不得繞過 MCP 或直接呼叫 Supabase SDK。

## 相關資源

- [Supabase JavaScript Client 文檔](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Dashboard](https://app.supabase.com)
# Supabase 服務

## 概述

`SupabaseService` 提供了 Supabase 客戶端實例，用於與 Supabase 後端進行交互。

## 配置

### 1. 環境變數設置

在專案根目錄創建 `.env` 檔案（參考 `.env.example`）：

```env
NG_APP_SUPABASE_URL=https://your-project.supabase.co
NG_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. 取得 Supabase 憑證

1. 登入 [Supabase Dashboard](https://app.supabase.com)
2. 選擇您的專案
3. 前往 **Settings > API**
4. 複製：
   - **Project URL** → `NG_APP_SUPABASE_URL`
   - **anon public** key → `NG_APP_SUPABASE_ANON_KEY`

## 使用方式

### 基本使用

```typescript
import { inject } from '@angular/core';
import { SupabaseService } from '@core';

export class MyComponent {
  private supabase = inject(SupabaseService);

  async loadData() {
    const { data, error } = await this.supabase.client
      .from('table_name')
      .select('*');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Data:', data);
  }
}
```

### 資料庫查詢

```typescript
// 查詢所有記錄
const { data, error } = await this.supabase.client
  .from('users')
  .select('*');

// 條件查詢
const { data, error } = await this.supabase.client
  .from('users')
  .select('*')
  .eq('status', 'active');

// 插入資料
const { data, error } = await this.supabase.client
  .from('users')
  .insert({ name: 'John', email: 'john@example.com' });

// 更新資料
const { data, error } = await this.supabase.client
  .from('users')
  .update({ name: 'Jane' })
  .eq('id', 1);

// 刪除資料
const { data, error } = await this.supabase.client
  .from('users')
  .delete()
  .eq('id', 1);
```

### 認證

```typescript
// 註冊
const { data, error } = await this.supabase.client.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// 登入
const { data, error } = await this.supabase.client.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// 登出
await this.supabase.client.auth.signOut();

// 獲取當前用戶
const { data: { user } } = await this.supabase.client.auth.getUser();
```

### 即時訂閱

```typescript
const subscription = this.supabase.client
  .channel('changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'users' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// 取消訂閱
subscription.unsubscribe();
```

### 檔案儲存

```typescript
// 上傳檔案
const { data, error } = await this.supabase.client.storage
  .from('bucket-name')
  .upload('path/to/file.jpg', file);

// 下載檔案
const { data, error } = await this.supabase.client.storage
  .from('bucket-name')
  .download('path/to/file.jpg');

// 獲取公開 URL
const { data } = this.supabase.client.storage
  .from('bucket-name')
  .getPublicUrl('path/to/file.jpg');
```

## 檢查配置狀態

```typescript
if (this.supabase.isConfigured) {
  // Supabase 已正確配置
} else {
  // 請檢查環境變數設置
  console.warn('Supabase 尚未配置');
}
```

## 相關資源

- [Supabase JavaScript Client 文檔](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Dashboard](https://app.supabase.com)

