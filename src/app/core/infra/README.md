# 基础设施模块 (Infrastructure)

> **位置**：`src/app/core/infra/`  
> **职责**：提供数据访问、错误处理、类型定义等基础设施功能

## 📋 模块结构

```
infra/
├── types/              # 类型定义
│   ├── database.types.ts    # Supabase 生成的数据库类型定义（51 张表）
│   └── index.ts
├── repositories/       # Repository 模式实现
│   ├── base.repository.ts   # 基础 Repository 类
│   ├── blueprint.repository.ts  # Blueprint Repository 示例
│   └── index.ts
├── errors/            # 错误处理
│   ├── error.types.ts       # 错误类型定义
│   ├── supabase-error.transformer.ts  # Supabase 错误转换工具
│   └── index.ts
├── utils/             # 工具函数
│   ├── transformers.ts      # 数据转换工具（snake_case ↔ camelCase）
│   └── index.ts
└── index.ts           # 统一导出
```

---

## 🎯 核心功能

### 1. 类型定义 (`types/`)

从 Supabase 生成的完整 TypeScript 类型定义，包含所有 51 张表的类型。

**使用方式**：
```typescript
import { Database, Tables } from '@core/infra';

// 使用 Tables 类型辅助工具
type Blueprint = Tables<'blueprints'>;
type BlueprintInsert = TablesInsert<'blueprints'>;
type BlueprintUpdate = TablesUpdate<'blueprints'>;
```

---

### 2. Repository 模式 (`repositories/`)

提供统一的数据访问层，封装 Supabase 客户端调用。

#### BaseRepository

基础 Repository 类，提供通用 CRUD 操作：

```typescript
import { BaseRepository } from '@core/infra';

@Injectable({ providedIn: 'root' })
export class MyRepository extends BaseRepository<MyEntity, MyEntityInsert, MyEntityUpdate> {
  protected tableName = 'my_table';
  
  // 可以添加特定查询方法
  findByCustomField(value: string): Observable<MyEntity[]> {
    return this.findAll({
      filters: { customField: value }
    });
  }
}
```

**可用方法**：
- `findAll(options?)` - 查询所有记录（支持筛选、排序、分页）
- `findById(id)` - 根据 ID 查询单条记录
- `create(data)` - 创建新记录
- `update(id, data)` - 更新记录
- `delete(id)` - 删除记录
- `findPaginated(options)` - 分页查询

**特性**：
- ✅ 自动 snake_case ↔ camelCase 转换
- ✅ 统一错误处理
- ✅ 类型安全
- ✅ 支持分页、排序、筛选

#### BlueprintRepository

蓝图 Repository 示例，展示如何扩展 BaseRepository：

```typescript
import { BlueprintRepository } from '@core/infra';

const blueprintRepo = inject(BlueprintRepository);

// 查询拥有者的所有蓝图
blueprintRepo.findByOwnerId('user-id').subscribe(blueprints => {
  console.log('Blueprints:', blueprints);
});

// 查询活跃的蓝图
blueprintRepo.findActive().subscribe(blueprints => {
  console.log('Active blueprints:', blueprints);
});
```

---

### 3. 错误处理 (`errors/`)

统一的错误处理机制，将 Supabase 错误转换为友好的应用错误。

**错误类型**：
- `http` - HTTP 请求错误
- `network` - 网络连線错误
- `validation` - 表單驗證错误
- `business` - 業務邏輯错误
- `permission` - 權限错误
- `unknown` - 未知错误

**使用方式**：
```typescript
import { transformSupabaseError, handleSupabaseResponse } from '@core/infra/errors';

// 转换 Supabase 错误
try {
  const { data, error } = await supabase.from('table').select();
  if (error) {
    throw transformSupabaseError(error, 'MyService');
  }
} catch (error) {
  // error 是 AppError 类型，包含 type, severity, code 等信息
  console.error(error.type, error.severity, error.message);
}

// 或使用便捷函数
const data = handleSupabaseResponse(response, 'MyService');
```

---

### 4. 数据转换工具 (`utils/`)

提供 snake_case ↔ camelCase 转换功能。

**使用方式**：
```typescript
import { toCamelCaseData, toSnakeCaseData } from '@core/infra/utils';

// 数据库数据（snake_case）→ 应用数据（camelCase）
const dbData = { user_id: '123', created_at: '2025-01-01' };
const appData = toCamelCaseData(dbData);
// { userId: '123', createdAt: '2025-01-01' }

// 应用数据（camelCase）→ 数据库数据（snake_case）
const appData = { userId: '123', createdAt: '2025-01-01' };
const dbData = toSnakeCaseData(appData);
// { user_id: '123', created_at: '2025-01-01' }
```

**注意**：BaseRepository 会自动进行转换，通常不需要手动调用。

---

## 📖 使用示例

### 创建新的 Repository

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository, QueryOptions } from '@core/infra';
import { Database } from '@core/infra/types';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

@Injectable({ providedIn: 'root' })
export class TaskRepository extends BaseRepository<Task, TaskInsert, TaskUpdate> {
  protected tableName = 'tasks';

  /**
   * 根据蓝图 ID 查询任务
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId, // 会自动转换为 blueprint_id
      },
    });
  }

  /**
   * 查询待处理的任务
   */
  findPending(options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status: 'pending',
      },
    });
  }
}
```

### 在 Service 中使用 Repository

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BlueprintRepository } from '@core/infra';

@Injectable({ providedIn: 'root' })
export class BlueprintService {
  private readonly blueprintRepo = inject(BlueprintRepository);

  /**
   * 获取用户的所有蓝图
   */
  getUserBlueprints(userId: string): Observable<Blueprint[]> {
    return this.blueprintRepo.findByOwnerId(userId);
  }

  /**
   * 创建新蓝图
   */
  createBlueprint(data: BlueprintInsert): Observable<Blueprint> {
    return this.blueprintRepo.create(data);
  }
}
```

---

## 🔧 技术细节

### 类型安全

- 所有 Repository 方法都有完整的类型定义
- 数据库类型与 TypeScript 类型自动同步
- 编译时类型检查，减少运行时错误

### 错误处理

- 统一的错误转换机制
- 友好的错误消息
- 错误分类和严重程度标记

### 数据转换

- 自动处理 snake_case ↔ camelCase 转换
- 支持嵌套对象转换
- 支持数组转换

---

## 📚 相关文档

- [API 设计规范](../../../../.cursor/rules/api-design.mdc)
- [错误处理规范](../../../../.cursor/rules/error-handling.mdc)
- [类型安全规范](../../../../.cursor/rules/typescript.mdc)
- [Core 模組規範](../../../../.cursor/rules/core-specific.mdc)

---

**最后更新**：2025-01-15  
**维护者**：开发团队

