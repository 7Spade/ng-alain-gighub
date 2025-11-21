# Repositories 基础方法完整性分析报告

> **分析日期**: 2025-01-15  
> **参考标准**: BlueprintRepository（完整实现）  
> **配对文档**: 
> - [Facades 基础方法完整性分析报告](./facades-analysis-report.md)
> - [Services 层基础方法完整性分析报告](./services-analysis-report.md)
> - [Models 层基础方法完整性分析报告](./models-analysis-report.md)
> - [Types 层基础方法完整性分析报告](./types-analysis-report.md)

## 分析标准

### BaseRepository 提供的基础方法

所有 Repository 都继承自 `BaseRepository`，自动获得以下方法：

- ✅ `findAll(options?: QueryOptions)` - 查询所有记录
- ✅ `findById(id: string)` - 根据 ID 查询单条记录
- ✅ `create(data: TInsert)` - 创建记录
- ✅ `update(id: string, data: TUpdate)` - 更新记录
- ✅ `delete(id: string)` - 删除记录
- ✅ `findPaginated(options)` - 分页查询

### 参考标准（BlueprintRepository）额外方法

- ✅ `findByOwnerId(ownerId, options?)` - 按拥有者查询
- ✅ `findByStatus(status, options?)` - 按状态查询
- ✅ `findByProjectCode(projectCode)` - 按项目代码查询
- ✅ `findActive(options?)` - 查询活跃记录（便捷方法）
- ✅ `search(query, options?)` - 搜索功能（模糊查询）

---

## 各 Repository 分析结果

### ✅ 1. Blueprint Repository（完整 - 参考标准）

**文件**: `blueprint/blueprint.repository.ts`

**状态**: ✅ 完整

**已有方法**:
- ✅ findAll, findById, create, update, delete（继承自 BaseRepository）
- ✅ findByOwnerId
- ✅ findByStatus
- ✅ findByProjectCode
- ✅ findActive
- ✅ search

---

### ⚠️ 2. Task Repository

**文件**: `task/task.repository.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ findAll, findById, create, update, delete（继承自 BaseRepository）
- ✅ findByBlueprintId
- ✅ findByBranchId
- ✅ findChildren
- ✅ findRootTasks
- ✅ findByStatus
- ✅ findByType
- ✅ findByPriority
- ✅ findPending
- ✅ findInProgress
- ✅ findCompleted

**缺少方法**:
- ❌ `search(query, options?)` - 搜索任务（按标题、描述等）

**建议补充**:
```typescript
/**
 * 搜索任务（支持模糊查询）
 *
 * @param query 搜索关键词
 * @param options 查询选项
 * @returns Observable<Task[]>
 */
search(query: string, options?: QueryOptions): Observable<Task[]> {
  if (!query || query.trim().length === 0) {
    return of([]);
  }

  const trimmedQuery = query.trim();
  let searchQuery = this.supabase
    .from(this.tableName as any)
    .select(options?.select || '*')
    .or(`title.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`);

  // 应用排序
  if (options?.orderBy) {
    const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    searchQuery = searchQuery.order(snakeOrderBy, {
      ascending: options.orderDirection !== 'desc'
    });
  } else {
    searchQuery = searchQuery.order('created_at', { ascending: false });
  }

  // 应用分页
  if (options?.page && options?.pageSize) {
    const fromIndex = (options.page - 1) * options.pageSize;
    const toIndex = fromIndex + options.pageSize - 1;
    searchQuery = searchQuery.range(fromIndex, toIndex);
  }

  return from(searchQuery as unknown as Promise<PostgrestResponse<any>>).pipe(
    map((response: PostgrestResponse<any>) => {
      const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
      return Array.isArray(data) ? data.map(item => toCamelCaseData<Task>(item)) : [];
    })
  );
}
```

---

### ⚠️ 3. Issue Repository

**文件**: `issue/issue.repository.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ findAll, findById, create, update, delete（继承自 BaseRepository）
- ✅ findByBlueprintId
- ✅ findByBranchId
- ✅ findByTaskId
- ✅ findByStatus
- ✅ findBySeverity
- ✅ findByIssueType
- ✅ findByReportedBy
- ✅ findOpenIssues
- ✅ findSyncedToMain

**缺少方法**:
- ❌ `search(query, options?)` - 搜索问题（按标题、描述等）
- ❌ `findByPriority(priority, options?)` - 按优先级查询（如果有 priority 字段）

**建议补充**:
```typescript
/**
 * 搜索问题（支持模糊查询）
 *
 * @param query 搜索关键词
 * @param options 查询选项
 * @returns Observable<Issue[]>
 */
search(query: string, options?: QueryOptions): Observable<Issue[]> {
  if (!query || query.trim().length === 0) {
    return of([]);
  }

  const trimmedQuery = query.trim();
  let searchQuery = this.supabase
    .from(this.tableName as any)
    .select(options?.select || '*')
    .or(`title.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`);

  // 应用排序
  if (options?.orderBy) {
    const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    searchQuery = searchQuery.order(snakeOrderBy, {
      ascending: options.orderDirection !== 'desc'
    });
  } else {
    searchQuery = searchQuery.order('created_at', { ascending: false });
  }

  // 应用分页
  if (options?.page && options?.pageSize) {
    const fromIndex = (options.page - 1) * options.pageSize;
    const toIndex = fromIndex + options.pageSize - 1;
    searchQuery = searchQuery.range(fromIndex, toIndex);
  }

  return from(searchQuery as unknown as Promise<PostgrestResponse<any>>).pipe(
    map((response: PostgrestResponse<any>) => {
      const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
      return Array.isArray(data) ? data.map(item => toCamelCaseData<Issue>(item)) : [];
    })
  );
}
```

---

### ⚠️ 4. QualityCheck Repository

**文件**: `quality/quality-check.repository.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ findAll, findById, create, update, delete（继承自 BaseRepository）
- ✅ findByTaskId
- ✅ findByInspectorId
- ✅ findByStatus

**缺少方法**:
- ❌ `findByBlueprintId(blueprintId, options?)` - 按蓝图查询（需要通过 task 关联）
- ❌ `search(query, options?)` - 搜索质检记录

**建议补充**:
```typescript
/**
 * 搜索品质检查（支持模糊查询）
 *
 * @param query 搜索关键词
 * @param options 查询选项
 * @returns Observable<QualityCheck[]>
 */
search(query: string, options?: QueryOptions): Observable<QualityCheck[]> {
  if (!query || query.trim().length === 0) {
    return of([]);
  }

  const trimmedQuery = query.trim();
  let searchQuery = this.supabase
    .from(this.tableName as any)
    .select(options?.select || '*')
    .or(`notes.ilike.%${trimmedQuery}%,check_result.ilike.%${trimmedQuery}%`);

  // 应用排序
  if (options?.orderBy) {
    const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    searchQuery = searchQuery.order(snakeOrderBy, {
      ascending: options.orderDirection !== 'desc'
    });
  } else {
    searchQuery = searchQuery.order('checked_at', { ascending: false });
  }

  // 应用分页
  if (options?.page && options?.pageSize) {
    const fromIndex = (options.page - 1) * options.pageSize;
    const toIndex = fromIndex + options.pageSize - 1;
    searchQuery = searchQuery.range(fromIndex, toIndex);
  }

  return from(searchQuery as unknown as Promise<PostgrestResponse<any>>).pipe(
    map((response: PostgrestResponse<any>) => {
      const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
      return Array.isArray(data) ? data.map(item => toCamelCaseData<QualityCheck>(item)) : [];
    })
  );
}
```

**注意**: `findByBlueprintId` 需要通过 tasks 表关联查询，建议在 Service 层实现或使用数据库 RPC 函数。

---

### ⚠️ 5. Inspection Repository

**文件**: `quality/inspection.repository.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ findAll, findById, create, update, delete（继承自 BaseRepository）
- ✅ findByTaskId
- ✅ findByInspectorId
- ✅ findByStatus

**缺少方法**:
- ❌ `findByBlueprintId(blueprintId, options?)` - 按蓝图查询（需要通过 task 关联）
- ❌ `findByInspectionType(type, options?)` - 按检查类型查询（如果有 inspection_type 字段）
- ❌ `search(query, options?)` - 搜索检查记录

**建议补充**: 同 QualityCheck Repository

---

### ⚠️ 6. Document Repository

**文件**: `document/document.repository.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ findAll, findById, create, update, delete（继承自 BaseRepository）
- ✅ findByUploaderId
- ✅ findByStorageBucket
- ✅ findByFileType
- ✅ findNotDeleted
- ✅ findPublicDocuments
- ✅ findByUploadSource

**缺少方法**:
- ❌ `findByBlueprintId(blueprintId, options?)` - 按蓝图查询（如果有 blueprint_id 字段）
- ❌ `search(query, options?)` - 搜索文档（按标题、文件名等）

**建议补充**:
```typescript
/**
 * 根据蓝图 ID 查询文档
 *
 * @param blueprintId 蓝图 ID
 * @param options 查询选项
 * @returns Observable<Document[]>
 */
findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<Document[]> {
  return this.findAll({
    ...options,
    filters: {
      ...options?.filters,
      blueprintId // 会自动转换为 blueprint_id
    }
  });
}

/**
 * 搜索文档（支持模糊查询）
 *
 * @param query 搜索关键词
 * @param options 查询选项
 * @returns Observable<Document[]>
 */
search(query: string, options?: QueryOptions): Observable<Document[]> {
  if (!query || query.trim().length === 0) {
    return of([]);
  }

  const trimmedQuery = query.trim();
  let searchQuery = this.supabase
    .from(this.tableName as any)
    .select(options?.select || '*')
    .or(`title.ilike.%${trimmedQuery}%,file_name.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`);

  // 只搜索未删除的文档
  searchQuery = searchQuery.is('soft_deleted_at', null);

  // 应用排序
  if (options?.orderBy) {
    const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    searchQuery = searchQuery.order(snakeOrderBy, {
      ascending: options.orderDirection !== 'desc'
    });
  } else {
    searchQuery = searchQuery.order('uploaded_at', { ascending: false });
  }

  // 应用分页
  if (options?.page && options?.pageSize) {
    const fromIndex = (options.page - 1) * options.pageSize;
    const toIndex = fromIndex + options.pageSize - 1;
    searchQuery = searchQuery.range(fromIndex, toIndex);
  }

  return from(searchQuery as unknown as Promise<PostgrestResponse<any>>).pipe(
    map((response: PostgrestResponse<any>) => {
      const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
      return Array.isArray(data) ? data.map(item => toCamelCaseData<Document>(item)) : [];
    })
  );
}
```

---

### ✅ 7. Account Repository（完整）

**文件**: `account/account.repository.ts`

**状态**: ✅ 完整

**已有方法**:
- ✅ findAll, findById, create, update, delete（继承自 BaseRepository）
- ✅ findByType
- ✅ findByStatus
- ✅ findByAuthUserId
- ✅ findByAuthOrganizationId
- ✅ findByIds
- ✅ findByEmail
- ✅ findByName
- ✅ findActive
- ✅ search

---

### ⚠️ 8. OrganizationCollaboration Repository

**文件**: `collaboration/organization-collaboration.repository.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ findAll, findById, create, update, delete（继承自 BaseRepository）
- ✅ findByBlueprintId
- ✅ findByOwnerOrgId
- ✅ findByCollaboratorOrgId
- ✅ findByCollaborationType
- ✅ findByStatus

**缺少方法**:
- ❌ `findActive(options?)` - 查询活跃的协作（便捷方法）

**建议补充**:
```typescript
/**
 * 查询活跃的协作关系（状态为 active）
 *
 * @param options 查询选项
 * @returns Observable<OrganizationCollaboration[]>
 */
findActive(options?: QueryOptions): Observable<OrganizationCollaboration[]> {
  return this.findByStatus(CollaborationStatus.ACTIVE, options);
}
```

---

### ⚠️ 9. Comment Repository

**文件**: `communication/comment.repository.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ findAll, findById, create, update, delete（继承自 BaseRepository）
- ✅ findByCommentableType
- ✅ findByCommentableId
- ✅ findByParentCommentId
- ✅ findByAuthorId
- ✅ findRootComments

**缺少方法**:
- ❌ `search(query, options?)` - 搜索评论（按内容）

**建议补充**:
```typescript
/**
 * 搜索评论（支持模糊查询）
 *
 * @param query 搜索关键词
 * @param options 查询选项
 * @returns Observable<Comment[]>
 */
search(query: string, options?: QueryOptions): Observable<Comment[]> {
  if (!query || query.trim().length === 0) {
    return of([]);
  }

  const trimmedQuery = query.trim();
  let searchQuery = this.supabase
    .from(this.tableName as any)
    .select(options?.select || '*')
    .ilike('content', `%${trimmedQuery}%`);

  // 应用排序
  if (options?.orderBy) {
    const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    searchQuery = searchQuery.order(snakeOrderBy, {
      ascending: options.orderDirection !== 'desc'
    });
  } else {
    searchQuery = searchQuery.order('created_at', { ascending: false });
  }

  // 应用分页
  if (options?.page && options?.pageSize) {
    const fromIndex = (options.page - 1) * options.pageSize;
    const toIndex = fromIndex + options.pageSize - 1;
    searchQuery = searchQuery.range(fromIndex, toIndex);
  }

  return from(searchQuery as unknown as Promise<PostgrestResponse<any>>).pipe(
    map((response: PostgrestResponse<any>) => {
      const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
      return Array.isArray(data) ? data.map(item => toCamelCaseData<Comment>(item)) : [];
    })
  );
}
```

---

### ⚠️ 10. Bot Repository

**文件**: `bot/bot.repository.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ findAll, findById, create, update, delete（继承自 BaseRepository）
- ✅ findByAccountId
- ✅ findByBotType
- ✅ findEnabledBots
- ✅ findByCreatedBy

**缺少方法**:
- ❌ `findByStatus(status, options?)` - 按状态查询（如果有 status 字段）
- ❌ `search(query, options?)` - 搜索机器人（按名称、描述等）

**建议补充**:
```typescript
/**
 * 搜索机器人（支持模糊查询）
 *
 * @param query 搜索关键词
 * @param options 查询选项
 * @returns Observable<Bot[]>
 */
search(query: string, options?: QueryOptions): Observable<Bot[]> {
  if (!query || query.trim().length === 0) {
    return of([]);
  }

  const trimmedQuery = query.trim();
  let searchQuery = this.supabase
    .from(this.tableName as any)
    .select(options?.select || '*')
    .or(`name.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`);

  // 应用排序
  if (options?.orderBy) {
    const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    searchQuery = searchQuery.order(snakeOrderBy, {
      ascending: options.orderDirection !== 'desc'
    });
  } else {
    searchQuery = searchQuery.order('created_at', { ascending: false });
  }

  // 应用分页
  if (options?.page && options?.pageSize) {
    const fromIndex = (options.page - 1) * options.pageSize;
    const toIndex = fromIndex + options.pageSize - 1;
    searchQuery = searchQuery.range(fromIndex, toIndex);
  }

  return from(searchQuery as unknown as Promise<PostgrestResponse<any>>).pipe(
    map((response: PostgrestResponse<any>) => {
      const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
      return Array.isArray(data) ? data.map(item => toCamelCaseData<Bot>(item)) : [];
    })
  );
}
```

---

### ⚠️ 11. BlueprintBranch Repository

**文件**: `blueprint/blueprint-branch.repository.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ findAll, findById, create, update, delete（继承自 BaseRepository）
- ✅ findByBlueprintId
- ✅ findByOrganizationId
- ✅ findByStatus
- ✅ findByBranchType
- ✅ findActive
- ✅ findByBlueprintAndOrganization

**缺少方法**:
- ❌ `search(query, options?)` - 搜索分支（按分支名称等）

**建议补充**: 搜索功能（如果需要）

---

### ⚠️ 12. PullRequest Repository

**文件**: `blueprint/blueprint-pull-request.repository.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ findAll, findById, create, update, delete（继承自 BaseRepository）
- ✅ findByBlueprintId
- ✅ findByBranchId
- ✅ findByStatus
- ✅ findOpen

**缺少方法**:
- ❌ `search(query, options?)` - 搜索 PR（按标题、描述等）

**建议补充**: 搜索功能（如果需要）

---

### ✅ 13. 其他 Repository（辅助表）

以下 Repository 通常不需要完整的 CRUD 和搜索功能，因为它们主要用于关联查询：

- ✅ `task-assignment.repository.ts` - 任务分配（关联表）
- ✅ `task-dependency.repository.ts` - 任务依赖（关联表）
- ✅ `task-list.repository.ts` - 任务列表（关联表）
- ✅ `issue-assignment.repository.ts` - 问题分配（关联表）
- ✅ `collaboration-invitation.repository.ts` - 协作邀请（关联表）
- ✅ `organization-member.repository.ts` - 组织成员（关联表）
- ✅ `team-member.repository.ts` - 团队成员（关联表）
- ✅ `document-version.repository.ts` - 文档版本（关联表）
- ✅ `document-thumbnail.repository.ts` - 文档缩略图（关联表）
- ✅ `qc-photo.repository.ts` - 质检照片（关联表）
- ✅ `inspection-photo.repository.ts` - 检查照片（关联表）
- ✅ `issue-photo.repository.ts` - 问题照片（关联表）
- ✅ `report-photo.repository.ts` - 报告照片（关联表）
- ✅ `bot-task.repository.ts` - 机器人任务（关联表）
- ✅ `bot-execution-log.repository.ts` - 机器人执行日志（关联表）
- ✅ `progress-tracking.repository.ts` - 进度跟踪（关联表）
- ✅ `analytics-cache.repository.ts` - 分析缓存（关联表）
- ✅ `weather-cache.repository.ts` - 天气缓存（关联表）
- ✅ `activity-log.repository.ts` - 活动日志（关联表）
- ✅ `issue-sync-log.repository.ts` - 问题同步日志（关联表）
- ✅ `todo-status-tracking.repository.ts` - 待办状态跟踪（关联表）
- ✅ `personal-todo.repository.ts` - 个人待办（关联表）
- ✅ `task-template.repository.ts` - 任务模板（可能需要搜索）
- ✅ `task-staging.repository.ts` - 任务暂存（关联表）
- ✅ `setting.repository.ts` - 系统设置（可能需要搜索）
- ✅ `feature-flag.repository.ts` - 功能标志（可能需要搜索）
- ✅ `notification.repository.ts` - 通知（可能需要搜索）
- ✅ `notification-rule.repository.ts` - 通知规则（关联表）
- ✅ `notification-subscription.repository.ts` - 通知订阅（关联表）
- ✅ `daily-report.repository.ts` - 日报（可能需要搜索）
- ✅ `blueprint-config.repository.ts` - 蓝图配置（关联表）
- ✅ `blueprint-branch-fork.repository.ts` - 分支 Fork（关联表）
- ✅ `permission.repository.ts` - 权限（可能需要搜索）
- ✅ `role.repository.ts` - 角色（可能需要搜索）
- ✅ `user-role.repository.ts` - 用户角色（关联表）
- ✅ `role-permission.repository.ts` - 角色权限（关联表）
- ✅ `branch-permission.repository.ts` - 分支权限（关联表）
- ✅ `team.repository.ts` - 团队（可能需要搜索）
- ✅ `auth.repository.ts` - 认证（特殊用途）

---

## 总结

### 需要补充基础方法的主表 Repository（优先级排序）

#### 高优先级（核心业务模块）

1. **Task Repository** - 缺少 `search()`
2. **Issue Repository** - 缺少 `search()`
3. **Document Repository** - 缺少 `search()`, `findByBlueprintId()`
4. **QualityCheck Repository** - 缺少 `search()`, `findByBlueprintId()`
5. **Inspection Repository** - 缺少 `search()`, `findByBlueprintId()`

#### 中优先级（辅助业务模块）

6. **Comment Repository** - 缺少 `search()`
7. **Bot Repository** - 缺少 `search()`, `findByStatus()`
8. **OrganizationCollaboration Repository** - 缺少 `findActive()`
9. **BlueprintBranch Repository** - 缺少 `search()`
10. **PullRequest Repository** - 缺少 `search()`

#### 低优先级（可选优化）

11. **TaskTemplate Repository** - 可考虑添加 `search()`
12. **Setting Repository** - 可考虑添加 `search()`
13. **FeatureFlag Repository** - 可考虑添加 `search()`
14. **Notification Repository** - 可考虑添加 `search()`
15. **DailyReport Repository** - 可考虑添加 `search()`
16. **Team Repository** - 可考虑添加 `search()`
17. **Permission Repository** - 可考虑添加 `search()`
18. **Role Repository** - 可考虑添加 `search()`

### 建议实施顺序

1. **第一阶段**: Task, Issue, Document（核心业务，最常用）
2. **第二阶段**: QualityCheck, Inspection（品质管理）
3. **第三阶段**: Comment, Bot, OrganizationCollaboration（辅助功能）
4. **第四阶段**: BlueprintBranch, PullRequest（蓝图相关）
5. **第五阶段**: 其他可选优化

### 代码示例（search 方法模板）

参考 `BlueprintRepository.search()` 的实现模式：

```typescript
import { PostgrestResponse } from '@supabase/supabase-js';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { handleSupabaseResponse } from '../../errors/supabase-error.transformer';
import { toCamelCaseData } from '../../utils/transformers';

/**
 * 搜索 XXX（支持模糊查询）
 *
 * @param query 搜索关键词
 * @param options 查询选项
 * @returns Observable<XXX[]>
 */
search(query: string, options?: QueryOptions): Observable<XXX[]> {
  if (!query || query.trim().length === 0) {
    return of([]);
  }

  const trimmedQuery = query.trim();
  let searchQuery = this.supabase
    .from(this.tableName as any)
    .select(options?.select || '*')
    .or(`field1.ilike.%${trimmedQuery}%,field2.ilike.%${trimmedQuery}%`);

  // 应用排序
  if (options?.orderBy) {
    const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    searchQuery = searchQuery.order(snakeOrderBy, {
      ascending: options.orderDirection !== 'desc'
    });
  } else {
    searchQuery = searchQuery.order('created_at', { ascending: false });
  }

  // 应用分页
  if (options?.page && options?.pageSize) {
    const fromIndex = (options.page - 1) * options.pageSize;
    const toIndex = fromIndex + options.pageSize - 1;
    searchQuery = searchQuery.range(fromIndex, toIndex);
  }

  return from(searchQuery as unknown as Promise<PostgrestResponse<any>>).pipe(
    map((response: PostgrestResponse<any>) => {
      const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
      return Array.isArray(data) ? data.map(item => toCamelCaseData<XXX>(item)) : [];
    })
  );
}
```

### 注意事项

1. **关联查询**: `findByBlueprintId` 对于需要通过其他表关联的 Repository（如 QualityCheck, Inspection），建议：
   - 在 Service 层实现（先查询关联表，再查询主表）
   - 或使用数据库 RPC 函数（性能更好）

2. **搜索字段**: 根据实际业务需求选择搜索字段，常见字段：
   - 标题类: `title`, `name`
   - 描述类: `description`, `content`, `notes`
   - 代码类: `project_code`, `code`
   - 文件名: `file_name`

3. **性能优化**: 
   - 搜索时考虑添加索引
   - 使用数据库全文搜索功能（如 PostgreSQL 的 `tsvector`）
   - 限制搜索结果数量

---

## 与 Facades 分析报告的对应关系

| Repository 层 | Facade 层 | 状态 |
|--------------|-----------|------|
| Task Repository | Task Facade | 都需要补充 search |
| Issue Repository | Issue Facade | 都需要补充 search |
| Document Repository | Document Facade | 都需要补充 search |
| QualityCheck Repository | Quality Facade | 都需要补充 search |
| Inspection Repository | Quality Facade | 都需要补充 search |
| Account Repository | Account Facade | Repository 完整，Facade 需要补充 search |
| Comment Repository | Communication Facade | 都需要补充 search |
| Bot Repository | Bot Facade | 都需要补充 search |
| OrganizationCollaboration Repository | Collaboration Facade | Repository 需要 findActive，Facade 需要基础查询 |

**建议**: 先补充 Repository 层的方法，再补充 Facade 层的方法，确保数据访问层完整。

---

**最后更新**: 2025-01-15  
**维护者**: 开发团队

