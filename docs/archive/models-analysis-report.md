# Models 层基础方法完整性分析报告

> **分析日期**: 2025-01-15  
> **参考标准**: Blueprint Models（完整实现）  
> **配对文档**: 
> - [Services 层基础方法完整性分析报告](./services-analysis-report.md)
> - [Types 层基础方法完整性分析报告](./types-analysis-report.md)
> - [Repositories 层基础方法完整性分析报告](./repositories-analysis-report.md)
> - [Facades 层基础方法完整性分析报告](./facades-analysis-report.md)

## 分析标准

### Models 层职责

Models 层（`shared/models/`）主要负责：

1. **类型定义**：从 `Database` 类型导出实体类型（Row, Insert, Update）
2. **枚举重新导出**：从 `core/infra/types` 重新导出枚举（统一导入路径，方便 Service 层使用）
3. **扩展接口**：定义业务相关的扩展接口（如 `TaskDetail`, `IssueDetail`）

### 基础要求（参考 Blueprint Models）

#### 1. 实体类型导出
- ✅ `export type Entity = Database['public']['Tables']['table_name']['Row']`
- ✅ `export type EntityInsert = Database['public']['Tables']['table_name']['Insert']`
- ✅ `export type EntityUpdate = Database['public']['Tables']['table_name']['Update']`

#### 2. 枚举重新导出
- ✅ `export { EnumType } from '@core'`（从 core 层导入）

#### 3. 扩展接口（可选）
- ✅ `export interface EntityDetail extends Entity { ... }`
- ✅ `export interface EntityWithRelations extends Entity { ... }`

---

## 各 Models 模块分析结果

### ✅ 1. Blueprint Models（完整 - 参考标准）

**文件**: `blueprint/blueprint.models.ts`

**状态**: ✅ 完整

**已有内容**:
- ✅ 枚举重新导出：`BlueprintStatus`, `BranchType`, `BranchStatus`, `PRStatus`
- ✅ 实体类型：`Blueprint`, `BlueprintInsert`, `BlueprintUpdate`
- ✅ 实体类型：`BlueprintConfig`, `BlueprintConfigInsert`, `BlueprintConfigUpdate`
- ✅ 实体类型：`BlueprintBranch`, `BlueprintBranchInsert`, `BlueprintBranchUpdate`
- ✅ 实体类型：`BranchFork`, `BranchForkInsert`, `BranchForkUpdate`
- ✅ 实体类型：`PullRequest`, `PullRequestInsert`, `PullRequestUpdate`

---

### ✅ 2. Task Models

**文件**: `task/task.models.ts`

**状态**: ✅ 完整

**已有内容**:
- ✅ 枚举重新导出：`TaskType`, `TaskStatus`, `TaskPriority`, `TaskAssigneeType`, `TaskListType`, `TaskDependencyType`
- ✅ 实体类型：`Task`, `TaskInsert`, `TaskUpdate`
- ✅ 实体类型：`TaskAssignment`, `TaskAssignmentInsert`, `TaskAssignmentUpdate`
- ✅ 实体类型：`TaskList`, `TaskListInsert`, `TaskListUpdate`
- ✅ 实体类型：`TaskStaging`, `TaskStagingInsert`, `TaskStagingUpdate`
- ✅ 实体类型：`TaskDependency`, `TaskDependencyInsert`, `TaskDependencyUpdate`
- ✅ 实体类型：`TaskTemplate`, `TaskTemplateInsert`, `TaskTemplateUpdate`
- ✅ 实体类型：`DailyReport`, `DailyReportInsert`, `DailyReportUpdate`
- ✅ 实体类型：`ReportPhoto`, `ReportPhotoInsert`, `ReportPhotoUpdate`
- ✅ 实体类型：`WeatherCache`, `WeatherCacheInsert`, `WeatherCacheUpdate`
- ✅ 扩展接口：`TaskTreeNode`, `TaskAssignmentWithAssignee`, `TaskDetail`

---

### ✅ 3. Issue Models

**文件**: `issue/issue.models.ts`

**状态**: ✅ 完整

**已有内容**:
- ✅ 实体类型：`Issue`, `IssueInsert`, `IssueUpdate`
- ✅ 实体类型：`IssueAssignment`, `IssueAssignmentInsert`, `IssueAssignmentUpdate`
- ✅ 实体类型：`IssuePhoto`, `IssuePhotoInsert`, `IssuePhotoUpdate`
- ✅ 实体类型：`IssueSyncLog`, `IssueSyncLogInsert`, `IssueSyncLogUpdate`

**缺少内容**:
- ❌ 枚举重新导出：`IssueStatus`, `IssuePriority`, `IssueSeverity`, `IssuePhotoType`, `IssueSyncStatus`（枚举定义在 `core/infra/types/issue/issue.types.ts`，但 Models 层没有重新导出）

**建议补充**:
```typescript
export { IssueStatus, IssuePriority, IssueSeverity, IssuePhotoType, IssueSyncStatus } from '@core';
```

---

### ✅ 4. Account Models

**文件**: `account/account.models.ts`

**状态**: ✅ 完整

**已有内容**:
- ✅ 枚举重新导出：`AccountType`, `AccountStatus`, `TeamMemberRole`
- ✅ 实体类型：`Account`, `AccountInsert`, `AccountUpdate`
- ✅ 实体类型：`Team`, `TeamInsert`, `TeamUpdate`
- ✅ 实体类型：`TeamMember`, `TeamMemberInsert`, `TeamMemberUpdate`
- ✅ 实体类型：`OrganizationSchedule`, `OrganizationScheduleInsert`, `OrganizationScheduleUpdate`

**缺少内容**:
- ❌ `OrganizationMember` 相关类型（在 `index.ts` 中有注释提到，但 `account.models.ts` 中没有定义）

**建议补充**:
```typescript
export type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];
export type OrganizationMemberInsert = Database['public']['Tables']['organization_members']['Insert'];
export type OrganizationMemberUpdate = Database['public']['Tables']['organization_members']['Update'];
```

---

### ✅ 5. Quality Models

**文件**: `quality/quality.models.ts`

**状态**: ✅ 完整

**已有内容**:
- ✅ 实体类型：`QualityCheck`, `QualityCheckInsert`, `QualityCheckUpdate`
- ✅ 实体类型：`Inspection`, `InspectionInsert`, `InspectionUpdate`
- ✅ 实体类型：`QcPhoto`, `QcPhotoInsert`, `QcPhotoUpdate`
- ✅ 实体类型：`InspectionPhoto`, `InspectionPhotoInsert`, `InspectionPhotoUpdate`
- ✅ 扩展接口：`QualityCheckDetail`（在 models 层定义）
- ✅ 枚举定义：`QualityCheckType`, `QualityCheckStatus`（在 models 层定义，与 core/types 中的定义重复）

**注意**: `QualityCheckStatus` 在 core/types 和 models 层都有定义，应统一到 core/types 层，models 层删除定义，只重新导出。`QualityCheckType` 只在 models 层定义，应移动到 core/types 层。

**补充说明**:
- ⚠️ `InspectionDetail` - 在 `inspection.service.ts` 中定义，不在 models 层（建议移动到 models 层）

---

### ✅ 6. Document Models

**文件**: `data/data.models.ts`（注意：Document 相关类型定义在 data 模块中）

**状态**: ✅ 完整（但位置特殊）

**已有内容**:
- ✅ 实体类型：`Document`, `DocumentInsert`, `DocumentUpdate`（在 `data/data.models.ts` 中定义）
- ✅ 实体类型：`DocumentVersion`, `DocumentVersionInsert`, `DocumentVersionUpdate`（在 `data/data.models.ts` 中定义）
- ✅ 实体类型：`DocumentThumbnail`, `DocumentThumbnailInsert`, `DocumentThumbnailUpdate`（在 `data/data.models.ts` 中定义）

**补充说明**:
- ⚠️ `DocumentDetail` - 在 `document.service.ts` 中定义，不在 models 层（建议移动到 models 层）
- ❌ 枚举重新导出：`DocumentType`, `DocumentStatus`, `DocumentVersionStatus`（枚举定义在 `core/infra/types/analytics/data.types.ts`，但 Models 层没有重新导出）

**建议**: 考虑创建 `document/document.models.ts` 文件，统一导出所有 Document 相关类型，或保持现状（从 data 模块导出）。

---

### ✅ 7. Bot Models

**文件**: `bot/bot.models.ts`

**状态**: ✅ 部分完整

**已有内容**:
- ✅ 实体类型：`Bot`, `BotInsert`, `BotUpdate`
- ✅ 实体类型：`BotTask`, `BotTaskInsert`, `BotTaskUpdate`
- ✅ 实体类型：`BotExecutionLog`, `BotExecutionLogInsert`, `BotExecutionLogUpdate`

**补充说明**:
- ⚠️ `BotDetail` - 在 `bot.service.ts` 中定义，不在 models 层（建议移动到 models 层）
- ❌ 枚举重新导出：`BotStatus`, `BotTaskStatus`, `BotTaskPriority`, `BotExecutionStatus`（枚举定义在 `core/infra/types/bot/bot.types.ts`，但 Models 层没有重新导出）

---

### ✅ 8. Communication Models

**文件**: `communication/communication.models.ts`

**状态**: ✅ 部分完整

**已有内容**:
- ✅ 实体类型：`Comment`, `CommentInsert`, `CommentUpdate`
- ✅ 实体类型：`Notification`, `NotificationInsert`, `NotificationUpdate`
- ✅ 实体类型：`NotificationRule`, `NotificationRuleInsert`, `NotificationRuleUpdate`
- ✅ 实体类型：`NotificationSubscription`, `NotificationSubscriptionInsert`, `NotificationSubscriptionUpdate`
- ✅ 实体类型：`PersonalTodo`, `PersonalTodoInsert`, `PersonalTodoUpdate`
- ✅ 实体类型：`TodoStatusTracking`, `TodoStatusTrackingInsert`, `TodoStatusTrackingUpdate`

**补充说明**:
- ⚠️ `CommentDetail` - 在 `comment.service.ts` 中定义，不在 models 层（建议移动到 models 层）
- ❌ 枚举重新导出：`CommentableType`, `NotificationType`, `NotificationStatus`, `NotificationPriority`, `NotificationSubscriptionType`（枚举定义在 `core/infra/types/collab/communication.types.ts`，但 Models 层没有重新导出）

---

### ✅ 9. Collaboration Models

**文件**: `collaboration/collaboration.models.ts`

**状态**: ✅ 部分完整

**已有内容**:
- ✅ 实体类型：`OrganizationCollaboration`, `OrganizationCollaborationInsert`, `OrganizationCollaborationUpdate`
- ✅ 实体类型：`CollaborationInvitation`, `CollaborationInvitationInsert`, `CollaborationInvitationUpdate`
- ✅ 实体类型：`CollaborationMember`, `CollaborationMemberInsert`, `CollaborationMemberUpdate`

**补充说明**:
- ❌ 枚举重新导出：`CollaborationType`, `CollaborationStatus`, `InvitationStatus`（枚举定义在 `core/infra/types/org/collaboration.types.ts`，但 Models 层没有重新导出）

---

### ✅ 10. System Models

**文件**: `system/system.models.ts`

**状态**: ✅ 完整

**已有内容**:
- ✅ 实体类型：`Setting`, `SettingInsert`, `SettingUpdate`
- ✅ 实体类型：`FeatureFlag`, `FeatureFlagInsert`, `FeatureFlagUpdate`

**补充说明**:
- ❌ 枚举重新导出：`FeatureFlagStatus`, `FeatureFlagTargetType`, `SettingCategory`, `SettingValueType`（枚举定义在 `core/infra/types/system/system.types.ts`，但 Models 层没有重新导出）

---

### ✅ 11. Permission Models

**文件**: `permission/permission.models.ts`

**状态**: ✅ 完整

**已有内容**:
- ✅ 实体类型：`Permission`, `PermissionInsert`, `PermissionUpdate`
- ✅ 实体类型：`Role`, `RoleInsert`, `RoleUpdate`
- ✅ 实体类型：`UserRole`, `UserRoleInsert`, `UserRoleUpdate`
- ✅ 实体类型：`RolePermission`, `RolePermissionInsert`, `RolePermissionUpdate`
- ✅ 实体类型：`BranchPermission`, `BranchPermissionInsert`, `BranchPermissionUpdate`
- ⚠️ 枚举定义：`BranchPermissionLevel`（在 models 层定义，与 core/types 重复）

**补充说明**:
- ❌ `BranchPermissionLevel` 枚举在 models 层和 core/types 层都有定义（重复定义，应统一到 core/types 层，models 层删除定义，只重新导出）
- ❌ 枚举重新导出：`PermissionAction`（枚举定义在 `core/infra/types/permission/permission.types.ts`，但 Models 层没有重新导出）

---

### ✅ 12. Data Models

**文件**: `data/data.models.ts`

**状态**: ✅ 完整

**已有内容**:
- ✅ 实体类型：`Document`, `DocumentInsert`, `DocumentUpdate`（Document 相关类型在此定义）
- ✅ 实体类型：`DocumentVersion`, `DocumentVersionInsert`, `DocumentVersionUpdate`
- ✅ 实体类型：`DocumentThumbnail`, `DocumentThumbnailInsert`, `DocumentThumbnailUpdate`
- ✅ 实体类型：`ProgressTracking`, `ProgressTrackingInsert`, `ProgressTrackingUpdate`
- ✅ 实体类型：`ActivityLog`, `ActivityLogInsert`, `ActivityLogUpdate`（接口定义，camelCase）
- ✅ 实体类型：`AnalyticsCache`, `AnalyticsCacheInsert`, `AnalyticsCacheUpdate`
- ✅ 扩展接口：`ActivityLogDetail`
- ✅ 通用接口：`ActivityLogFilters`
- ⚠️ 枚举定义：`ActivityLogResourceType`（在 models 层定义，与 core/types 重复）

**补充说明**:
- ❌ `ActivityLogResourceType` 枚举在 models 层和 core/types 层都有定义（重复定义，应统一到 core/types 层，models 层删除定义，只重新导出）

---

### ✅ 13. Explore Models

**文件**: `explore/explore.models.ts`

**状态**: ✅ 完整（探索功能类型较少）

**已有内容**:
- ✅ 探索相关类型定义（如 `AccountWithAvatar`, `BlueprintWithDescription` 等）

**补充说明**:
- ❌ 枚举重新导出：`SearchType`（枚举定义在 `core/infra/types/explore/explore.types.ts`，但 Models 层没有重新导出）

---

## 总结

### Models 层特点

1. **类型定义为主**：Models 层主要是类型定义，不包含业务逻辑方法
2. **从 Database 类型导出**：所有实体类型都从 `Database['public']['Tables']` 导出
3. **枚举重新导出**：从 `core/infra/types` 重新导出枚举（统一导入路径，方便 Service 层使用）
4. **扩展接口**：定义业务相关的扩展接口（如 `TaskDetail`, `IssueDetail`）

### 需要补充的内容

#### 1. 枚举重新导出状态

**已有枚举重新导出**:
- ✅ **Blueprint Models**: 已重新导出 `BlueprintStatus`, `BranchType`, `BranchStatus`, `PRStatus`
- ✅ **Task Models**: 已重新导出 `TaskType`, `TaskStatus`, `TaskPriority`, `TaskAssigneeType`, `TaskListType`, `TaskDependencyType`
- ✅ **Account Models**: 已重新导出 `AccountType`, `AccountStatus`, `TeamMemberRole`

**缺少枚举重新导出**:
- ❌ **Issue Models**: 缺少重新导出 `IssueStatus`, `IssuePriority`, `IssueSeverity`, `IssuePhotoType`, `IssueSyncStatus`
- ❌ **Bot Models**: 缺少重新导出 `BotStatus`, `BotTaskStatus`, `BotTaskPriority`, `BotExecutionStatus`
- ❌ **Communication Models**: 缺少重新导出 `CommentableType`, `NotificationType`, `NotificationStatus`, `NotificationPriority`, `NotificationSubscriptionType`
- ❌ **Collaboration Models**: 缺少重新导出 `CollaborationType`, `CollaborationStatus`, `InvitationStatus`
- ❌ **System Models**: 缺少重新导出 `FeatureFlagStatus`, `FeatureFlagTargetType`, `SettingCategory`, `SettingValueType`
- ❌ **Explore Models**: 缺少重新导出 `SearchType`
- ❌ **Data Models**: 缺少重新导出 `DocumentType`, `DocumentStatus`, `DocumentVersionStatus`（在 analytics/data.types.ts 中定义）

#### 2. 扩展接口状态

**已有扩展接口**:
- ✅ **Quality Models**: `QualityCheckDetail` 已在 models 层定义

**缺少扩展接口**（在 service 层定义，应移动到 models 层）:
- ❌ **Quality Models**: `InspectionDetail` 在 service 层，应移动到 models 层
- ❌ **Document Models**: `DocumentDetail` 在 service 层，应移动到 models 层（且 Document Models 文件不存在）
- ❌ **Bot Models**: `BotDetail` 在 service 层，应移动到 models 层
- ❌ **Communication Models**: `CommentDetail` 在 service 层，应移动到 models 层

#### 3. 缺失的实体类型

**缺少实体类型**:
- ❌ **Account Models**: 缺少 `OrganizationMember` 相关类型（在 index.ts 中有注释提到，但未定义）

#### 4. 重复定义的枚举（应统一）

**重复定义的枚举**（应统一到 core/types 层，models 层删除定义，只重新导出）:
- ❌ **Quality Models**: `QualityCheckStatus` 在 core/types 和 models 层都有定义
- ❌ **Permission Models**: `BranchPermissionLevel` 在 core/types 和 models 层都有定义
- ❌ **Data Models**: `ActivityLogResourceType` 在 core/types 和 models 层都有定义

**说明**: 项目还在开发中，不需要考虑向后兼容。所有枚举应统一在 core/types 层定义，models 层只负责重新导出，避免重复定义。

### 建议检查清单

对于每个 Models 模块，检查：

- [ ] 是否导出了所有相关表的 Row, Insert, Update 类型
- [ ] 是否重新导出了所有相关枚举（从 core 层）
- [ ] 是否定义了必要的扩展接口（Detail, WithRelations 等）
- [ ] 是否与 Service 层使用的类型一致
- [ ] 是否与 Repository 层使用的类型一致

---

## 与 Services 层的对应关系

| Models 模块 | Services 模块 | 状态 |
|------------|--------------|------|
| Blueprint Models | Blueprint Service | ✅ 完整 |
| Task Models | Task Service | ✅ 完整 |
| Issue Models | Issue Service | ❌ 缺少枚举重新导出（IssueStatus, IssuePriority 等） |
| Account Models | Account Service | ❌ 缺少 OrganizationMember 类型定义 |
| Quality Models | Quality Service | ⚠️ InspectionDetail 在 service 层（建议移动到 models 层） |
| Data Models (Document) | Document Service | ⚠️ DocumentDetail 在 service 层（建议移动到 models 层） |
| Bot Models | Bot Service | ⚠️ BotDetail 在 service 层（建议移动到 models 层） |
| Communication Models | Comment Service | ⚠️ CommentDetail 在 service 层（建议移动到 models 层） |

---

**最后更新**: 2025-01-15  
**维护者**: 开发团队

