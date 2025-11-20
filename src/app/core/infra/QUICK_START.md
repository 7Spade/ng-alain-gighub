# 基础设施快速开始指南

> **原则**：先做基础，方便扩展，开发平顺，避免错误

## ✅ 当前基础设施状态

### 已完成的核心功能

1. **类型定义** - 51 张表的完整 TypeScript 类型
2. **错误处理** - 统一的错误转换和处理机制
3. **数据转换** - 自动 snake_case ↔ camelCase 转换
4. **基础 Repository** - 通用 CRUD 操作
5. **示例 Repository** - BlueprintRepository 作为参考

### 设计原则

- ✅ **简单优先** - 只提供必要的通用功能
- ✅ **易于扩展** - 通过继承 BaseRepository 轻松添加新 Repository
- ✅ **类型安全** - 完整的 TypeScript 类型支持
- ✅ **错误预防** - 统一的错误处理和类型检查

- --

## 🚀 如何创建新的 Repository

### 三步创建新 Repository

```typescript
// 1. 导入基础类和类型
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository, QueryOptions } from '@core';
import { Database } from '@core';

// 2. 定义类型（从数据库类型中提取）
type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

// 3. 创建 Repository（继承 BaseRepository）
@Injectable({ providedIn: 'root' })
export class TaskRepository extends BaseRepository<Task, TaskInsert, TaskUpdate> {
  protected tableName = 'tasks'; // 设置表名

  // 可选：添加特定查询方法
  findByBlueprintId(blueprintId: string): Observable<Task[]> {
    return this.findAll({
      filters: { blueprintId } // 自动转换为 blueprint_id
    });
  }
}
```

### 立即可用的方法

继承 `BaseRepository` 后，自动获得以下方法：

- ✅ `findAll(options?)` - 查询所有（支持筛选、排序、分页）
- ✅ `findById(id)` - 根据 ID 查询
- ✅ `create(data)` - 创建记录
- ✅ `update(id, data)` - 更新记录
- ✅ `delete(id)` - 删除记录
- ✅ `findPaginated(options)` - 分页查询

**所有方法都自动处理**：
- ✅ snake_case ↔ camelCase 转换
- ✅ 错误处理和转换
- ✅ 类型安全

- --

## 📝 使用示例

### 在 Service 中使用 Repository

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BlueprintRepository } from '@core';

@Injectable({ providedIn: 'root' })
export class BlueprintService {
  private readonly blueprintRepo = inject(BlueprintRepository);

  // 获取用户的所有蓝图
  getUserBlueprints(userId: string): Observable<Blueprint[]> {
    return this.blueprintRepo.findByOwnerId(userId);
  }

  // 创建新蓝图
  createBlueprint(data: BlueprintInsert): Observable<Blueprint> {
    return this.blueprintRepo.create(data);
  }
}
```

### 在 Component 中使用

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { BlueprintRepository } from '@core';

@Component({
  selector: 'app-blueprint-list',
  standalone: true,
  // ...
})
export class BlueprintListComponent implements OnInit {
  private readonly blueprintRepo = inject(BlueprintRepository);

  blueprints: Blueprint[] = [];

  ngOnInit() {
    this.blueprintRepo.findAll().subscribe(blueprints => {
      this.blueprints = blueprints;
    });
  }
}
```

- --

## 🛡️ 错误预防机制

### 1. 类型安全

- ✅ 所有方法都有完整的类型定义
- ✅ 编译时类型检查
- ✅ 数据库类型与 TypeScript 类型自动同步

### 2. 统一错误处理

- ✅ 自动转换 Supabase 错误为友好的应用错误
- ✅ 错误分类（http、network、validation、business、permission）
- ✅ 统一的错误消息格式

### 3. 数据转换

- ✅ 自动处理字段名转换（snake_case ↔ camelCase）
- ✅ 无需手动转换，减少错误

- --

## 🔄 未来扩展方式

### 添加新的 Repository

只需三步：
1. 创建新文件（如 `task.repository.ts`）
2. 继承 `BaseRepository`
3. 设置 `tableName` 和添加特定方法（可选）

### 扩展 BaseRepository

如果需要添加新的通用功能：
1. 在 `BaseRepository` 中添加新方法
2. 所有子类自动获得新功能

### 添加新的错误类型

1. 在 `error.types.ts` 中添加新类型
2. 在 `supabase-error.transformer.ts` 中添加转换逻辑

- --

## 📚 参考文档

- [完整使用指南](./README.md) - 详细的功能说明和 API 文档
- [BaseRepository 源码](repositories/base.repository.ts) - 查看所有可用方法
- [BlueprintRepository 示例](repositories/blueprint.repository.ts) - 参考实现

- --

## ⚠️ 注意事项

1. **表名使用 snake_case** - 数据库表名必须使用 snake_case
2. **类型从 Database 提取** - 使用 `Database['public']['Tables']['table_name']['Row']` 提取类型
3. **自动转换** - 字段名会自动转换，无需手动处理
4. **错误处理** - 所有错误都会自动转换，无需手动处理

- --

**最后更新**：2025-01-15
**维护者**：开发团队

