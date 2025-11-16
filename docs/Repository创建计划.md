# Repository 创建计划

> 📋 **目的**：为所有缺失的数据表创建 Repository 类，提供基本 CRUD 操作和业务查询方法

**生成时间**：2025-01-15  
**现有 Repositories**：28 个  
**需要创建**：25 个  
**总计**：53 个（覆盖 51 张表）

---

## 📊 Repository 完成度统计

| 模块 | 表数 | 已有 | 缺失 | 完成度 |
|------|------|------|------|--------|
| 🔐 账户与身份系统 | 4 | 4 | 0 | ✅ 100% |
| 🤝 组织协作系统 | 3 | 3 | 0 | ✅ 100% |
| 🎯 蓝图/专案系统 | 5 | 5 | 0 | ✅ 100% |
| 📋 任务执行系统 | 9 | 9 | 0 | ✅ 100% |
| 🔒 权限系统 | 5 | 1 | 4 | ⚠️ 20% |
| ✅ 品质验收系统 | 4 | 3 | 1 | ⚠️ 75% |
| ⚠️ 问题追踪系统 | 4 | 0 | 4 | ❌ 0% |
| 💬 协作沟通系统 | 6 | 0 | 6 | ❌ 0% |
| 📊 资料分析系统 | 6 | 1 | 5 | ⚠️ 17% |
| 🤖 机器人系统 | 3 | 0 | 3 | ❌ 0% |
| ⚙️ 系统管理 | 2 | 0 | 2 | ❌ 0% |
| **总计** | **51** | **28** | **25** | **55%** |

---

## 📋 需要创建的 Repositories 清单

### 1. 🔒 权限系统 (4 个)

#### 1.1 RoleRepository
**表名**：`roles`  
**文件**：`role.repository.ts`  
**业务方法**：
- `findByName(name: string): Observable<Role | null>` - 根据名称查询角色
- `findSystemRoles(): Observable<Role[]>` - 查询系统角色
- `findCustomRoles(): Observable<Role[]>` - 查询自定义角色

#### 1.2 UserRoleRepository
**表名**：`user_roles`  
**文件**：`user-role.repository.ts`  
**业务方法**：
- `findByAccountId(accountId: string, options?: QueryOptions): Observable<UserRole[]>` - 根据账户ID查询
- `findByRoleId(roleId: string, options?: QueryOptions): Observable<UserRole[]>` - 根据角色ID查询
- `findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<UserRole[]>` - 根据蓝图ID查询
- `findByBranchId(branchId: string, options?: QueryOptions): Observable<UserRole[]>` - 根据分支ID查询
- `findByAccountAndBlueprint(accountId: string, blueprintId: string): Observable<UserRole | null>` - 查询账户在蓝图中的角色

#### 1.3 PermissionRepository
**表名**：`permissions`  
**文件**：`permission.repository.ts`  
**业务方法**：
- `findByName(name: string): Observable<Permission | null>` - 根据名称查询权限
- `findByResource(resource: string, options?: QueryOptions): Observable<Permission[]>` - 根据资源查询权限
- `findSystemPermissions(): Observable<Permission[]>` - 查询系统权限
- `findByResourceAndAction(resource: string, action: string): Observable<Permission | null>` - 根据资源和操作查询

#### 1.4 RolePermissionRepository
**表名**：`role_permissions`  
**文件**：`role-permission.repository.ts`  
**业务方法**：
- `findByRoleId(roleId: string, options?: QueryOptions): Observable<RolePermission[]>` - 根据角色ID查询
- `findByPermissionId(permissionId: string, options?: QueryOptions): Observable<RolePermission[]>` - 根据权限ID查询
- `findByRoleAndPermission(roleId: string, permissionId: string): Observable<RolePermission | null>` - 查询角色权限关联

---

### 2. ⚠️ 问题追踪系统 (4 个)

#### 2.1 IssueRepository
**表名**：`issues`  
**文件**：`issue.repository.ts`  
**业务方法**：
- `findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<Issue[]>` - 根据蓝图ID查询
- `findByBranchId(branchId: string, options?: QueryOptions): Observable<Issue[]>` - 根据分支ID查询
- `findByTaskId(taskId: string, options?: QueryOptions): Observable<Issue[]>` - 根据任务ID查询
- `findByStatus(status: string, options?: QueryOptions): Observable<Issue[]>` - 根据状态查询
- `findBySeverity(severity: string, options?: QueryOptions): Observable<Issue[]>` - 根据严重程度查询
- `findByIssueType(issueType: string, options?: QueryOptions): Observable<Issue[]>` - 根据问题类型查询
- `findByReportedBy(reportedBy: string, options?: QueryOptions): Observable<Issue[]>` - 根据报告人查询
- `findOpenIssues(blueprintId?: string): Observable<Issue[]>` - 查询未解决的问题（需要状态过滤，可能需要枚举类型）
- `findSyncedToMain(): Observable<Issue[]>` - 查询已同步到主分支的问题（需要 `synced_to_main = true` 或相关字段过滤）

#### 2.2 IssueAssignmentRepository
**表名**：`issue_assignments`  
**文件**：`issue-assignment.repository.ts`  
**业务方法**：
- `findByIssueId(issueId: string, options?: QueryOptions): Observable<IssueAssignment[]>` - 根据问题ID查询
- `findByAssigneeId(assigneeId: string, options?: QueryOptions): Observable<IssueAssignment[]>` - 根据被指派人ID查询
- `findByAssignedBy(assignedBy: string, options?: QueryOptions): Observable<IssueAssignment[]>` - 根据指派人ID查询
- `findByIssueAndAssignee(issueId: string, assigneeId: string): Observable<IssueAssignment | null>` - 查询问题指派关系

#### 2.3 IssuePhotoRepository
**表名**：`issue_photos`  
**文件**：`issue-photo.repository.ts`  
**业务方法**：
- `findByIssueId(issueId: string, options?: QueryOptions): Observable<IssuePhoto[]>` - 根据问题ID查询
- `findByDocumentId(documentId: string, options?: QueryOptions): Observable<IssuePhoto[]>` - 根据文档ID查询
- `findByPhotoType(photoType: string, options?: QueryOptions): Observable<IssuePhoto[]>` - 根据照片类型查询

#### 2.4 IssueSyncLogRepository
**表名**：`issue_sync_logs`  
**文件**：`issue-sync-log.repository.ts`  
**业务方法**：
- `findByIssueId(issueId: string, options?: QueryOptions): Observable<IssueSyncLog[]>` - 根据问题ID查询
- `findBySourceBranchId(sourceBranchId: string, options?: QueryOptions): Observable<IssueSyncLog[]>` - 根据源分支ID查询
- `findByTargetBlueprintId(targetBlueprintId: string, options?: QueryOptions): Observable<IssueSyncLog[]>` - 根据目标蓝图ID查询
- `findBySyncType(syncType: string, options?: QueryOptions): Observable<IssueSyncLog[]>` - 根据同步类型查询

---

### 3. 💬 协作沟通系统 (6 个)

#### 3.1 CommentRepository
**表名**：`comments`  
**文件**：`comment.repository.ts`  
**业务方法**：
- `findByCommentableType(commentableType: string, options?: QueryOptions): Observable<Comment[]>` - 根据可评论类型查询
- `findByCommentableId(commentableType: string, commentableId: string, options?: QueryOptions): Observable<Comment[]>` - 根据可评论对象查询
- `findByParentCommentId(parentCommentId: string, options?: QueryOptions): Observable<Comment[]>` - 根据父评论ID查询（嵌套回复）
- `findByAuthorId(authorId: string, options?: QueryOptions): Observable<Comment[]>` - 根据作者ID查询
- `findRootComments(commentableType: string, commentableId: string): Observable<Comment[]>` - 查询根评论（无父评论）

#### 3.2 NotificationRepository
**表名**：`notifications`  
**文件**：`notification.repository.ts`  
**业务方法**：
- `findByRecipientId(recipientId: string, options?: QueryOptions): Observable<Notification[]>` - 根据接收人ID查询
- `findUnreadByRecipientId(recipientId: string, options?: QueryOptions): Observable<Notification[]>` - 查询未读通知（需要特殊处理：`is_read = false`）
- `findBySenderId(senderId: string, options?: QueryOptions): Observable<Notification[]>` - 根据发送人ID查询
- `findByNotificationType(notificationType: string, options?: QueryOptions): Observable<Notification[]>` - 根据通知类型查询
- `findByRelatedType(relatedType: string, relatedId: string, options?: QueryOptions): Observable<Notification[]>` - 根据关联对象查询
- `markAsRead(notificationId: string): Observable<void>` - 标记为已读（使用 `update()` 方法）
- `markAllAsRead(recipientId: string): Observable<void>` - 标记所有为已读（需要批量更新，可能需要 RPC 或直接使用 Supabase client）

#### 3.3 NotificationRuleRepository
**表名**：`notification_rules`  
**文件**：`notification-rule.repository.ts`  
**业务方法**：
- `findByAccountId(accountId: string, options?: QueryOptions): Observable<NotificationRule[]>` - 根据账户ID查询
- `findByNotificationType(notificationType: string, options?: QueryOptions): Observable<NotificationRule[]>` - 根据通知类型查询
- `findEnabledRules(accountId: string): Observable<NotificationRule[]>` - 查询启用的规则
- `findByChannel(channel: string, options?: QueryOptions): Observable<NotificationRule[]>` - 根据渠道查询

#### 3.4 NotificationSubscriptionRepository
**表名**：`notification_subscriptions`  
**文件**：`notification-subscription.repository.ts`  
**业务方法**：
- `findByAccountId(accountId: string, options?: QueryOptions): Observable<NotificationSubscription[]>` - 根据账户ID查询
- `findBySubscribableType(subscribableType: string, options?: QueryOptions): Observable<NotificationSubscription[]>` - 根据订阅类型查询
- `findBySubscribableId(subscribableType: string, subscribableId: string, options?: QueryOptions): Observable<NotificationSubscription[]>` - 根据订阅对象查询
- `findByAccountAndSubscribable(accountId: string, subscribableType: string, subscribableId: string): Observable<NotificationSubscription | null>` - 查询订阅关系

#### 3.5 PersonalTodoRepository
**表名**：`personal_todos`  
**文件**：`personal-todo.repository.ts`  
**业务方法**：
- `findByAccountId(accountId: string, options?: QueryOptions): Observable<PersonalTodo[]>` - 根据账户ID查询
- `findByStatus(status: string, options?: QueryOptions): Observable<PersonalTodo[]>` - 根据状态查询
- `findByTodoType(todoType: string, options?: QueryOptions): Observable<PersonalTodo[]>` - 根据待办类型查询
- `findByRelatedType(relatedType: string, relatedId: string, options?: QueryOptions): Observable<PersonalTodo[]>` - 根据关联对象查询
- `findByPriority(priority: string, options?: QueryOptions): Observable<PersonalTodo[]>` - 根据优先级查询
- `findOverdue(accountId: string): Observable<PersonalTodo[]>` - 查询过期待办（需要日期比较：`due_date < NOW()`，可能需要特殊处理）
- `findPending(accountId: string): Observable<PersonalTodo[]>` - 查询待执行的待办（使用 `findByStatus()` 或 `findByAccountId()` + filters）

#### 3.6 TodoStatusTrackingRepository
**表名**：`todo_status_tracking`  
**文件**：`todo-status-tracking.repository.ts`  
**业务方法**：
- `findByTodoId(todoId: string, options?: QueryOptions): Observable<TodoStatusTracking[]>` - 根据待办ID查询
- `findByChangedBy(changedBy: string, options?: QueryOptions): Observable<TodoStatusTracking[]>` - 根据变更人ID查询
- `findByToStatus(toStatus: string, options?: QueryOptions): Observable<TodoStatusTracking[]>` - 根据目标状态查询

---

### 4. 🤖 机器人系统 (3 个)

#### 4.1 BotRepository
**表名**：`bots`  
**文件**：`bot.repository.ts`  
**业务方法**：
- `findByAccountId(accountId: string, options?: QueryOptions): Observable<Bot[]>` - 根据账户ID查询
- `findByBotType(botType: string, options?: QueryOptions): Observable<Bot[]>` - 根据机器人类型查询
- `findEnabledBots(options?: QueryOptions): Observable<Bot[]>` - 查询启用的机器人
- `findByCreatedBy(createdBy: string, options?: QueryOptions): Observable<Bot[]>` - 根据创建人ID查询

#### 4.2 BotTaskRepository
**表名**：`bot_tasks`  
**文件**：`bot-task.repository.ts`  
**业务方法**：
- `findByBotId(botId: string, options?: QueryOptions): Observable<BotTask[]>` - 根据机器人ID查询
- `findByStatus(status: string, options?: QueryOptions): Observable<BotTask[]>` - 根据状态查询
- `findPendingTasks(options?: QueryOptions): Observable<BotTask[]>` - 查询待处理任务
- `findByTaskType(taskType: string, options?: QueryOptions): Observable<BotTask[]>` - 根据任务类型查询
- `findScheduledTasks(scheduledAt: Date): Observable<BotTask[]>` - 查询计划执行的任务（需要日期比较，可能需要特殊处理）

#### 4.3 BotExecutionLogRepository
**表名**：`bot_execution_logs`  
**文件**：`bot-execution-log.repository.ts`  
**业务方法**：
- `findByBotId(botId: string, options?: QueryOptions): Observable<BotExecutionLog[]>` - 根据机器人ID查询
- `findByBotTaskId(botTaskId: string, options?: QueryOptions): Observable<BotExecutionLog[]>` - 根据机器人任务ID查询
- `findByExecutionStatus(executionStatus: string, options?: QueryOptions): Observable<BotExecutionLog[]>` - 根据执行状态查询
- `findRecentLogs(botId?: string, limit?: number): Observable<BotExecutionLog[]>` - 查询最近的执行日志
- `findFailedLogs(botId?: string, options?: QueryOptions): Observable<BotExecutionLog[]>` - 查询失败的执行日志

---

### 5. ⚙️ 系统管理 (2 个)

#### 5.1 SettingRepository
**表名**：`settings`  
**文件**：`setting.repository.ts`  
**业务方法**：
- `findByKey(settingKey: string): Observable<Setting | null>` - 根据键查询
- `findByType(settingType: string, options?: QueryOptions): Observable<Setting[]>` - 根据类型查询
- `findByScopeId(scopeId: string, options?: QueryOptions): Observable<Setting[]>` - 根据作用域ID查询
- `findPublicSettings(options?: QueryOptions): Observable<Setting[]>` - 查询公开设置
- `findByTypeAndScope(settingType: string, scopeId: string): Observable<Setting[]>` - 根据类型和作用域查询

#### 5.2 FeatureFlagRepository
**表名**：`feature_flags`  
**文件**：`feature-flag.repository.ts`  
**业务方法**：
- `findByKey(flagKey: string): Observable<FeatureFlag | null>` - 根据键查询
- `findEnabledFlags(options?: QueryOptions): Observable<FeatureFlag[]>` - 查询启用的功能开关
- `findByTargetAccount(accountId: string): Observable<FeatureFlag[]>` - 根据目标账户查询
- `findByTargetOrganization(organizationId: string): Observable<FeatureFlag[]>` - 根据目标组织查询
- `findActiveFlags(): Observable<FeatureFlag[]>` - 查询当前有效的功能开关（在有效期内，需要日期比较：`enabled = true AND (starts_at IS NULL OR starts_at <= NOW()) AND (ends_at IS NULL OR ends_at >= NOW())`，可能需要特殊处理或 RPC）

---

### 6. 📊 资料分析系统 (5 个)

#### 6.1 DocumentRepository
**表名**：`documents`  
**文件**：`document.repository.ts`  
**业务方法**：
- `findByUploaderId(uploaderId: string, options?: QueryOptions): Observable<Document[]>` - 根据上传人ID查询
- `findByStorageBucket(storageBucket: string, options?: QueryOptions): Observable<Document[]>` - 根据存储桶查询
- `findByFileType(fileType: string, options?: QueryOptions): Observable<Document[]>` - 根据文件类型查询
- `findNotDeleted(options?: QueryOptions): Observable<Document[]>` - 查询未删除的文件
- `findPublicDocuments(options?: QueryOptions): Observable<Document[]>` - 查询公开文件
- `findByUploadSource(uploadSource: string, options?: QueryOptions): Observable<Document[]>` - 根据上传来源查询
- `findSoftDeleted(): Observable<Document[]>` - 查询软删除的文件

#### 6.2 DocumentVersionRepository
**表名**：`document_versions`  
**文件**：`document-version.repository.ts`  
**业务方法**：
- `findByDocumentId(documentId: string, options?: QueryOptions): Observable<DocumentVersion[]>` - 根据文档ID查询
- `findLatestVersion(documentId: string): Observable<DocumentVersion | null>` - 查询最新版本（需要按版本号或创建时间排序，取第一条）
- `findByVersionNumber(documentId: string, versionNumber: number): Observable<DocumentVersion | null>` - 根据版本号查询
- `findByCreatedBy(createdBy: string, options?: QueryOptions): Observable<DocumentVersion[]>` - 根据创建人ID查询

#### 6.3 DocumentThumbnailRepository
**表名**：`document_thumbnails`  
**文件**：`document-thumbnail.repository.ts`  
**业务方法**：
- `findByDocumentId(documentId: string, options?: QueryOptions): Observable<DocumentThumbnail[]>` - 根据文档ID查询
- `findBySize(documentId: string, thumbnailSize: string): Observable<DocumentThumbnail | null>` - 根据尺寸查询
- `findByDocumentAndSize(documentId: string, thumbnailSize: string): Observable<DocumentThumbnail | null>` - 查询指定文档和尺寸的缩图

#### 6.4 ProgressTrackingRepository
**表名**：`progress_tracking`  
**文件**：`progress-tracking.repository.ts`  
**业务方法**：
- `findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<ProgressTracking[]>` - 根据蓝图ID查询
- `findByBranchId(branchId: string, options?: QueryOptions): Observable<ProgressTracking[]>` - 根据分支ID查询
- `findByTrackingDate(trackingDate: Date, options?: QueryOptions): Observable<ProgressTracking[]>` - 根据追踪日期查询
- `findLatestByBlueprintId(blueprintId: string, branchId?: string): Observable<ProgressTracking | null>` - 查询最新的进度追踪（需要按日期排序，取第一条）
- `findByDateRange(blueprintId: string, startDate: Date, endDate: Date, branchId?: string): Observable<ProgressTracking[]>` - 根据日期范围查询（需要日期比较，可能需要特殊处理）

#### 6.5 AnalyticsCacheRepository
**表名**：`analytics_cache`  
**文件**：`analytics-cache.repository.ts`  
**业务方法**：
- `findByCacheKey(cacheKey: string): Observable<AnalyticsCache | null>` - 根据缓存键查询
- `findByCacheType(cacheType: string, options?: QueryOptions): Observable<AnalyticsCache[]>` - 根据缓存类型查询
- `findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<AnalyticsCache[]>` - 根据蓝图ID查询
- `findByBranchId(branchId: string, options?: QueryOptions): Observable<AnalyticsCache[]>` - 根据分支ID查询
- `findExpiredCaches(): Observable<AnalyticsCache[]>` - 查询过期的缓存（需要日期比较：`expires_at < NOW()`，可能需要特殊处理）
- `findValidCaches(options?: QueryOptions): Observable<AnalyticsCache[]>` - 查询有效的缓存（未过期，需要日期比较：`expires_at >= NOW()`，可能需要特殊处理）

---

### 7. ✅ 品质验收系统补充 (1 个)

#### 7.1 QcPhotoRepository
**表名**：`qc_photos`  
**文件**：`qc-photo.repository.ts`  
**业务方法**：
- `findByQcId(qcId: string, options?: QueryOptions): Observable<QcPhoto[]>` - 根据品质检查ID查询
- `findByDocumentId(documentId: string, options?: QueryOptions): Observable<QcPhoto[]>` - 根据文档ID查询
- `findByPhotoType(photoType: string, options?: QueryOptions): Observable<QcPhoto[]>` - 根据照片类型查询
- `findByUploadedBy(uploadedBy: string, options?: QueryOptions): Observable<QcPhoto[]>` - 根据上传人ID查询

---

## 🎯 Repository 设计模式

### 基本结构

**重要**：Repository 层遵循分层架构原则，**core 层不依赖 shared 层**，因此：
- ✅ Repository 在文件内部定义类型（从 Database 类型提取）
- ✅ 枚举类型从 `core/infra/types` 导入（如果存在）
- ❌ **不要**从 `@shared/models` 导入类型

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';
// 如果有枚举类型，从 core/infra/types 导入
// import { EntityStatus, EntityType } from '../types/entity.types';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type EntityRow = Database['public']['Tables']['table_name']['Row'];
type EntityInsert = Database['public']['Tables']['table_name']['Insert'];
type EntityUpdate = Database['public']['Tables']['table_name']['Update'];

/**
 * Entity 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Entity = EntityRow;
export type { EntityInsert, EntityUpdate };

/**
 * Entity Repository
 *
 * 提供 Entity 相关的数据访问方法
 *
 * @example
 * ```typescript
 * const entityRepo = inject(EntityRepository);
 * entityRepo.findByXxx('value').subscribe(entities => {
 *   console.log('Entities:', entities);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class EntityRepository extends BaseRepository<Entity, EntityInsert, EntityUpdate> {
  protected tableName = 'table_name';

  /**
   * 业务查询方法示例
   *
   * @param param 查询参数
   * @param options 查询选项
   * @returns Observable<Entity[]>
   */
  findByXxx(param: string, options?: QueryOptions): Observable<Entity[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        paramField: param // 会自动转换为 param_field
      }
    });
  }

  /**
   * 查询单条记录示例（返回第一条或 null）
   *
   * @param param 查询参数
   * @returns Observable<Entity | null>
   */
  findOneByXxx(param: string): Observable<Entity | null> {
    return this.findAll({
      filters: {
        paramField: param
      }
    }).pipe(map(entities => (entities.length > 0 ? entities[0] : null)));
  }
}
```

### BaseRepository 提供的通用方法

所有 Repository 自动继承以下方法：

- `findAll(options?: QueryOptions): Observable<T[]>` - 查询所有记录
- `findById(id: string): Observable<T | null>` - 根据ID查询
- `create(data: TInsert): Observable<T>` - 创建记录
- `update(id: string, data: TUpdate): Observable<T>` - 更新记录
- `delete(id: string): Observable<void>` - 删除记录
- `findPaginated(options: QueryOptions & { page: number; pageSize: number }): Observable<PaginatedResult<T>>` - 分页查询

---

## 📝 实施优先级

### 优先级 1：核心功能模块（高优先级）

1. **权限系统 Repositories** (4个)
   - 影响：所有需要权限控制的功能
   - 依赖：account 模块
   - 注意：BranchPermissionRepository 已存在，只需创建其他 4 个

2. **问题追踪系统 Repositories** (4个)
   - 影响：问题管理功能
   - 依赖：task, blueprint 模块

3. **协作沟通系统 Repositories** (6个)
   - 影响：通知、留言、待办中心
   - 依赖：account, task, issue 模块

### 优先级 2：辅助功能模块（中优先级）

4. **资料分析系统 Repositories** (5个)
   - 补充缺失的 5 个 Repository
   - 依赖：blueprint, task 模块
   - 注意：ActivityLogRepository 已存在，只需创建其他 5 个

5. **品质验收系统补充** (1个)
   - 补充 QcPhotoRepository
   - 依赖：quality-check 模块
   - 注意：QualityCheckRepository, InspectionRepository, InspectionPhotoRepository 已存在

### 优先级 3：扩展功能模块（低优先级）

6. **机器人系统 Repositories** (3个)
   - 影响：自动化任务
   - 依赖：account 模块

7. **系统管理 Repositories** (2个)
   - 影响：系统配置
   - 依赖：account 模块

---

## ⚠️ 重要注意事项

### 1. 类型定义模式

**遵循现有模式**：Repository 在文件内部定义类型，不从 `@shared/models` 导入

```typescript
// ✅ 正确：在 Repository 内部定义类型
type EntityRow = Database['public']['Tables']['table_name']['Row'];
export type Entity = EntityRow;

// ❌ 错误：从 shared 层导入类型（违反分层架构）
import { Entity } from '@shared/models/module';
```

### 2. 枚举类型导入

如果有枚举类型，从 `core/infra/types` 导入：

```typescript
// ✅ 正确：从 core 层导入枚举
import { TaskStatus, TaskType } from '../types/task.types';

// 如果枚举不存在，需要先在 core/infra/types 中创建
```

### 3. 业务方法命名规范

- `findByXxx()` - 返回数组
- `findOneByXxx()` - 返回单条记录或 null
- `findXxx()` - 特殊查询（如 `findOpen()`, `findPending()`）

### 4. 复杂查询处理

对于需要复杂条件或数据库函数的查询（如日期比较、ltree 查询），可能需要：
- 使用 RPC 函数
- 直接使用 Supabase client 的高级查询方法（`.gte()`, `.lte()`, `.in()`, `.is()` 等）
- 在 BaseRepository 中扩展查询能力
- 或标记为 TODO，后续实现

**示例：批量查询**
```typescript
findByIds(ids: string[]): Observable<Entity[]> {
  if (ids.length === 0) {
    return of([]);
  }
  return from(this.supabase.from(this.tableName).select('*').in('id', ids)).pipe(
    map((response: { data: any[] | null; error: any }) => {
      if (response.error) {
        throw new Error(response.error.message || '批量查询失败');
      }
      return (response.data || []).map(item => toCamelCaseData<Entity>(item));
    })
  );
}
```

**示例：日期范围查询**
```typescript
findByDateRange(startDate: Date, endDate: Date): Observable<Entity[]> {
  return from(
    this.supabase
      .from(this.tableName)
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
  ).pipe(
    map((response: { data: any[] | null; error: any }) => {
      if (response.error) {
        throw new Error(response.error.message || '日期范围查询失败');
      }
      return (response.data || []).map(item => toCamelCaseData<Entity>(item));
    })
  );
}
```

### 5. 批量操作方法

对于需要批量操作的场景，考虑添加：
- `findByIds(ids: string[]): Observable<Entity[]>` - 批量查询
- `createMany(data: TInsert[]): Observable<T[]>` - 批量创建（如果业务需要）
- `updateMany(ids: string[], data: TUpdate): Observable<T[]>` - 批量更新（如果业务需要）

### 6. 业务方法设计原则

- **单一职责**：每个方法只做一件事
- **可组合性**：方法应该可以组合使用（通过 options.filters）
- **类型安全**：使用枚举类型而不是字符串字面量
- **错误处理**：所有方法都应该有适当的错误处理
- **文档完整**：每个方法都应该有清晰的 JSDoc 注释，包括参数说明和返回值说明

### 7. 特殊业务方法

对于需要特殊业务逻辑的方法（如 `markAsRead()`, `markAllAsRead()`），应该：
- 使用 `update()` 方法或直接使用 Supabase client
- 确保有适当的错误处理
- 提供清晰的业务语义

---

## ✅ 实施检查清单

### 准备工作
- [ ] 检查是否需要创建新的枚举类型文件（core/infra/types）
- [ ] 确认所有表名和字段名正确

### 创建 Repositories
- [ ] 创建权限系统 Repositories (4个)
  - [ ] RoleRepository
  - [ ] UserRoleRepository
  - [ ] PermissionRepository
  - [ ] RolePermissionRepository
- [ ] 创建问题追踪系统 Repositories (4个)
  - [ ] IssueRepository
  - [ ] IssueAssignmentRepository
  - [ ] IssuePhotoRepository
  - [ ] IssueSyncLogRepository
- [ ] 创建协作沟通系统 Repositories (6个)
  - [ ] CommentRepository
  - [ ] NotificationRepository
  - [ ] NotificationRuleRepository
  - [ ] NotificationSubscriptionRepository
  - [ ] PersonalTodoRepository
  - [ ] TodoStatusTrackingRepository
- [ ] 创建机器人系统 Repositories (3个)
  - [ ] BotRepository
  - [ ] BotTaskRepository
  - [ ] BotExecutionLogRepository
- [ ] 创建系统管理 Repositories (2个)
  - [ ] SettingRepository
  - [ ] FeatureFlagRepository
- [ ] 创建资料分析系统 Repositories (5个)
  - [ ] DocumentRepository
  - [ ] DocumentVersionRepository
  - [ ] DocumentThumbnailRepository
  - [ ] ProgressTrackingRepository
  - [ ] AnalyticsCacheRepository
- [ ] 创建品质验收系统补充 Repository (1个)
  - [ ] QcPhotoRepository

### 收尾工作
- [ ] 更新 Repository 导出文件 (index.ts) - 按字母顺序或模块顺序排列
- [ ] 验证类型检查（`npx tsc --noEmit`）
- [ ] 验证代码质量（`yarn lint`）
- [ ] 验证代码格式（`yarn format` 或 Prettier）
- [ ] 检查所有方法都有完整的 JSDoc 注释
- [ ] 检查所有复杂查询都有适当的实现或 TODO 标记
- [ ] 更新文档

---

---

## 📌 关键发现与调整

### 1. 类型定义模式确认

经过审查现有代码，确认：
- ✅ **Repository 在文件内部定义类型**（从 Database 类型提取）
- ✅ **枚举类型从 `core/infra/types` 导入**（如果存在）
- ❌ **不从 `@shared/models` 导入类型**（违反分层架构）

**原因**：遵循分层架构原则，core 层不依赖 shared 层。

### 2. 现有枚举类型文件

已存在的枚举类型文件：
- `core/infra/types/account.types.ts` - AccountType, AccountStatus, TeamMemberRole
- `core/infra/types/task.types.ts` - TaskType, TaskStatus, TaskPriority, TaskAssigneeType, TaskListType, TaskDependencyType
- `core/infra/types/blueprint.types.ts` - BlueprintStatus, BranchType, BranchStatus, PRStatus
- `core/infra/types/collaboration.types.ts` - CollaborationType, CollaborationStatus, InvitationStatus

**可能需要创建的新枚举类型文件**：
- `core/infra/types/issue.types.ts` - IssueType, IssueStatus, IssueSeverity, IssuePriority
- `core/infra/types/communication.types.ts` - NotificationType, NotificationChannel, TodoStatus, TodoType
- `core/infra/types/bot.types.ts` - BotType, BotTaskStatus, BotExecutionStatus
- `core/infra/types/system.types.ts` - SettingType, FeatureFlagStatus

### 3. 方法实现注意事项

- **简单查询**：使用 `findAll()` + `filters`（BaseRepository 自动处理）
- **单条记录查询**：使用 `findAll()` + `map()` 返回第一条或 null
- **复杂查询**：可能需要 RPC 函数或标记为 TODO
- **日期比较**：BaseRepository 的 filters 只支持等值查询，日期范围查询需要特殊处理

### 4. 与现有代码的一致性

所有新创建的 Repository 应该：
- 遵循现有 Repository 的代码风格
- 使用相同的注释格式（JSDoc）
- 保持方法命名一致性
- 导出类型供其他模块使用（如需要）
- 所有方法都有完整的错误处理
- 复杂查询有清晰的实现说明或 TODO 标记
- 使用枚举类型而不是字符串字面量（如果存在枚举）
- 遵循单一职责原则
- 提供清晰的业务语义

---

---

## 🏆 企业级标准检查清单

### 代码质量
- ✅ 类型安全：所有类型从 Database 类型提取，确保与数据库结构一致
- ✅ 错误处理：所有方法都有适当的错误处理（通过 handleSupabaseResponse）
- ✅ 代码风格：遵循现有 Repository 的代码风格和命名规范
- ✅ 文档完整：所有方法都有完整的 JSDoc 注释

### 架构设计
- ✅ 分层架构：core 层不依赖 shared 层，类型在 Repository 内部定义
- ✅ 单一职责：每个 Repository 只负责一个数据表的操作
- ✅ 可扩展性：方法设计支持组合使用（通过 options.filters）
- ✅ 可维护性：代码结构清晰，易于理解和维护

### 功能完整性
- ✅ 基本 CRUD：所有 Repository 继承 BaseRepository，自动获得 CRUD 方法
- ✅ 业务查询：为每个表提供必要的业务查询方法
- ✅ 复杂查询：对复杂查询有清晰的实现说明或 TODO 标记
- ✅ 批量操作：在需要时提供批量操作方法

### 性能优化
- ✅ 查询优化：使用适当的排序和分页
- ✅ 批量查询：对于需要批量查询的场景，使用 `.in()` 方法
- ✅ 索引利用：查询方法设计考虑数据库索引的使用

### 测试准备
- ✅ 方法可测试：所有方法都返回 Observable，易于单元测试
- ✅ 错误可追踪：错误信息包含方法名，便于调试
- ✅ 类型安全：TypeScript 类型检查确保类型正确

---

**最后更新**：2025-01-15  
**审查状态**：✅ 已审查并调整，符合企业级标准  
**审查者**：AI Assistant  
**维护者**：开发团队

