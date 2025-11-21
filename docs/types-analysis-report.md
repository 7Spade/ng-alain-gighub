# Types 层基础方法完整性分析报告

> **分析日期**: 2025-01-15  
> **参考标准**: Blueprint Types（完整实现）  
> **配对文档**: 
> - [Models 层基础方法完整性分析报告](./models-analysis-report.md)
> - [Services 层基础方法完整性分析报告](./services-analysis-report.md)
> - [Repositories 层基础方法完整性分析报告](./repositories-analysis-report.md)
> - [Facades 层基础方法完整性分析报告](./facades-analysis-report.md)

## 分析标准

### Types 层职责

Types 层（`core/infra/types/`）主要负责：

1. **枚举定义**：定义业务枚举（Status, Type, Priority 等）
2. **类型定义**：定义基础设施相关的类型（不依赖 shared 层）
3. **数据库类型**：从 Supabase 生成的 `Database` 类型

### 基础要求（参考 Blueprint Types）

#### 1. 枚举定义
- ✅ `export enum EntityStatus { ... }` - 状态枚举
- ✅ `export enum EntityType { ... }` - 类型枚举
- ✅ `export enum EntityPriority { ... }` - 优先级枚举（如果有）

#### 2. 枚举值规范
- ✅ 使用小写字符串值（如 `'active'`, `'pending'`）
- ✅ 枚举名称使用 UPPER_SNAKE_CASE
- ✅ 提供清晰的 JSDoc 注释

---

## 各 Types 模块分析结果

### ✅ 1. Blueprint Types（完整 - 参考标准）

**文件**: `blueprint/blueprint.types.ts`

**状态**: ✅ 完整

**已有枚举**:
- ✅ `BlueprintStatus` - 蓝图状态（PLANNING, ACTIVE, ON_HOLD, COMPLETED, ARCHIVED）
- ✅ `BranchType` - 分支类型（CONTRACTOR, SUBCONTRACTOR, CONSULTANT）
- ✅ `BranchStatus` - 分支状态（ACTIVE, MERGED, CLOSED）
- ✅ `PRStatus` - Pull Request 状态（OPEN, REVIEWING, APPROVED, REJECTED, MERGED, CLOSED）

---

### ✅ 2. Task Types

**文件**: `task/task.types.ts`

**状态**: ✅ 完整

**已有枚举**:
- ✅ `TaskType` - 任务类型（MILESTONE, PHASE, TASK, SUBTASK）
- ✅ `TaskStatus` - 任务状态（PENDING, ASSIGNED, IN_PROGRESS, STAGING, IN_QA, IN_INSPECTION, COMPLETED, CANCELLED）
- ✅ `TaskPriority` - 任务优先级（LOW, MEDIUM, HIGH, URGENT）
- ✅ `TaskAssigneeType` - 任务指派类型（INDIVIDUAL, TEAM, ORGANIZATION, CONTRACTOR）
- ✅ `TaskListType` - 任务列表类型（ASSIGNED, WATCHING, ARCHIVED）
- ✅ `TaskDependencyType` - 任务依赖类型（FINISH_TO_START, START_TO_START, FINISH_TO_FINISH, START_TO_FINISH）

---

### ✅ 3. Issue Types

**文件**: `issue/issue.types.ts`

**状态**: ✅ 完整

**已有枚举**:
- ✅ `IssueStatus` - 问题状态（OPEN, IN_PROGRESS, RESOLVED, CLOSED, REOPENED）
- ✅ `IssuePriority` - 问题优先级（LOW, MEDIUM, HIGH, CRITICAL）
- ✅ `IssueSeverity` - 问题严重程度（MINOR, MODERATE, MAJOR, CRITICAL）
- ✅ `IssuePhotoType` - 问题照片类型（DISCOVERY, BEFORE_FIX, AFTER_FIX）
- ✅ `IssueSyncStatus` - 问题同步状态（PENDING, IN_PROGRESS, SUCCESS, FAILED）

---

### ✅ 4. Account Types

**文件**: `account/account.types.ts`

**状态**: ✅ 完整

**已有枚举**:
- ✅ `AccountType` - 账户类型（USER, BOT, ORGANIZATION）
- ✅ `AccountStatus` - 账户状态（ACTIVE, INACTIVE, SUSPENDED）
- ✅ `TeamMemberRole` - 团队成员角色（LEADER, MEMBER）
- ✅ `OrganizationMemberRole` - 组织成员角色（OWNER, ADMIN, MEMBER）

---

### ✅ 5. Quality Types

**文件**: `quality/quality.types.ts`

**状态**: ✅ 部分完整

**已有枚举**:
- ✅ `QualityCheckStatus` - 质检状态枚举（PENDING, PASSED, FAILED, RECHECK_REQUIRED）
- ✅ `QcPhotoType` - QC 照片类型枚举（BEFORE, DURING, AFTER, DEFECT）
- ✅ `InspectionPhotoType` - 检查照片类型枚举（SITE, ISSUE, PROGRESS）

**补充说明**:
- ✅ `QualityCheckType` - 质检类型枚举（在 `shared/models/quality/quality.models.ts` 中定义：ROUTINE, MILESTONE, FINAL, SPOT_CHECK）
- ❌ `InspectionType` - 检查类型枚举（不存在，使用字符串类型）
- ❌ `InspectionStatus` - 检查状态枚举（不存在，使用字符串类型，但数据库有 status 字段）

---

### ✅ 6. Document Types

**文件**: `analytics/data.types.ts`（注意：Document 相关枚举定义在 analytics 模块中）

**状态**: ✅ 完整

**已有枚举**:
- ✅ `DocumentType` - 文档类型枚举（DESIGN, SPECIFICATION, CONTRACT, REPORT, OTHER）
- ✅ `DocumentStatus` - 文档状态枚举（DRAFT, UNDER_REVIEW, APPROVED, ARCHIVED）
- ✅ `DocumentVersionStatus` - 文档版本状态枚举（DRAFT, CURRENT, OBSOLETE）

**补充说明**:
- ❌ `DocumentUploadSource` - 文档上传来源枚举（不存在，使用字符串类型）

---

### ✅ 7. Bot Types

**文件**: `bot/bot.types.ts`

**状态**: ✅ 部分完整

**已有枚举**:
- ✅ `BotStatus` - 机器人状态枚举（ACTIVE, INACTIVE, SUSPENDED）
- ✅ `BotTaskStatus` - 机器人任务状态枚举（PENDING, RUNNING, COMPLETED, FAILED, CANCELLED）
- ✅ `BotTaskPriority` - 机器人任务优先级枚举（LOW, MEDIUM, HIGH）
- ✅ `BotExecutionStatus` - 机器人执行日志状态枚举（STARTED, IN_PROGRESS, SUCCESS, FAILED, TIMEOUT）

**补充说明**:
- ❌ `BotType` - 机器人类型枚举（不存在，使用字符串类型）

---

### ✅ 8. Communication Types

**文件**: `collab/communication.types.ts`

**状态**: ✅ 完整

**已有枚举**:
- ✅ `CommentableType` - 评论类型枚举（TASK, ISSUE, DOCUMENT, QUALITY_CHECK, PULL_REQUEST）
- ✅ `NotificationType` - 通知类型枚举（SYSTEM, TASK_ASSIGNMENT, TASK_UPDATE, ISSUE_MENTION, COMMENT_REPLY, PR_REVIEW, COLLABORATION_INVITE）
- ✅ `NotificationStatus` - 通知状态枚举（UNREAD, READ, ARCHIVED）
- ✅ `NotificationPriority` - 通知优先级枚举（LOW, MEDIUM, HIGH）
- ✅ `NotificationSubscriptionType` - 通知订阅类型枚举（BLUEPRINT, BRANCH, TASK, ISSUE）

**补充说明**:
- ❌ `CommentStatus` - 评论状态枚举（不存在，评论不需要状态枚举）

---

### ✅ 9. Collaboration Types

**文件**: `org/collaboration.types.ts`

**状态**: ✅ 完整

**已有枚举**:
- ✅ `CollaborationType` - 协作类型枚举（CONTRACTOR, SUBCONTRACTOR, CONSULTANT, PARTNER）
- ✅ `CollaborationStatus` - 协作状态枚举（PENDING, ACTIVE, SUSPENDED, ENDED）
- ✅ `InvitationStatus` - 邀请状态枚举（PENDING, ACCEPTED, REJECTED, EXPIRED）

---

### ✅ 10. Permission Types

**文件**: `permission/permission.types.ts`

**状态**: ✅ 部分完整

**已有枚举**:
- ✅ `BranchPermissionLevel` - 分支权限级别枚举（OWNER, ADMIN, WRITE, READ）
- ✅ `PermissionAction` - 权限操作类型枚举（READ, WRITE, ADMIN, CREATE_TASK, MODIFY_TASK_STRUCTURE, FORK_BRANCH, REVIEW_PR, MERGE_PR, MANAGE_PERMISSIONS, FILL_CONTRACTOR_FIELDS, SUBMIT_PR, CREATE_DAILY_REPORT, CREATE_QUALITY_CHECK）
- ✅ `PermissionMatrix` - 权限矩阵类型定义
- ✅ `DEFAULT_PERMISSION_MATRIX` - 默认权限矩阵常量

**补充说明**:
- ❌ `PermissionType` - 权限类型枚举（不存在，使用 PermissionAction 代替）
- ❌ `RoleType` - 角色类型枚举（不存在，使用 BranchPermissionLevel 代替）
- ❌ `BranchPermissionType` - 分支权限类型枚举（不存在，使用 BranchPermissionLevel 代替）

---

### ✅ 11. System Types

**文件**: `system/system.types.ts`

**状态**: ✅ 完整

**已有枚举**:
- ✅ `FeatureFlagStatus` - 功能标志状态枚举（ENABLED, DISABLED）
- ✅ `FeatureFlagTargetType` - 功能标志目标类型枚举（GLOBAL, BLUEPRINT, ORGANIZATION, USER）
- ✅ `SettingCategory` - 设置分类枚举（SYSTEM, USER, PROJECT, NOTIFICATION）
- ✅ `SettingValueType` - 设置数据类型枚举（STRING, NUMBER, BOOLEAN, JSON）
- ✅ `ActivityLogAction` - 活动日志动作枚举（CREATED, UPDATED, DELETED, FORKED, MERGED, COMMENTED）
- ✅ `ActivityLogResourceType` - 活动日志资源类型枚举（BLUEPRINT, BRANCH, TASK, ISSUE, DOCUMENT, QUALITY_CHECK, PULL_REQUEST）

**补充说明**:
- ❌ `SettingType` - 设置类型枚举（不存在，使用 SettingCategory 和 SettingValueType 代替）

---

### ✅ 12. Common Types

**文件**: `common/database.types.ts`, `common/realtime.types.ts`

**状态**: ✅ 完整（基础设施类型）

**说明**: Common Types 包含数据库类型和实时通信类型，是基础设施层的基础。

---

### ✅ 13. Analytics Types

**文件**: `analytics/data.types.ts`

**状态**: ✅ 完整（包含 Document 相关枚举）

**已有枚举**:
- ✅ `DocumentType` - 文档类型枚举（DESIGN, SPECIFICATION, CONTRACT, REPORT, OTHER）
- ✅ `DocumentStatus` - 文档状态枚举（DRAFT, UNDER_REVIEW, APPROVED, ARCHIVED）
- ✅ `DocumentVersionStatus` - 文档版本状态枚举（DRAFT, CURRENT, OBSOLETE）
- ✅ `ReportPhotoType` - 报告照片类型枚举（PROGRESS, SITE, OTHER）
- ✅ `DailyReportType` - 日报类型枚举（CONSTRUCTION, INSPECTION, PROGRESS）

---

### ✅ 14. Explore Types

**文件**: `explore/explore.types.ts`

**状态**: ✅ 完整（探索功能类型较少）

**已有枚举**:
- ✅ `SearchType` - 搜索类型枚举（ALL, USERS, ORGANIZATIONS, BLUEPRINTS）

---

## 总结

### Types 层特点

1. **枚举定义为主**：Types 层主要定义业务枚举
2. **不依赖 shared 层**：符合分层架构，core 层不依赖 shared 层
3. **数据库字段对应**：枚举值对应数据库字段的值
4. **清晰的命名**：枚举名称使用 UPPER_SNAKE_CASE，值使用小写字符串

### 需要补充的内容

#### 1. 枚举定义状态

**已有枚举**:
- ✅ **Quality Types**: `QualityCheckStatus` 已定义，`QualityCheckType` 在 models 层定义（应移动到 core/types）
- ✅ **Document Types**: `DocumentStatus` 和 `DocumentType` 已定义（在 analytics/data.types.ts）
- ✅ **Bot Types**: `BotStatus` 和 `BotTaskStatus` 已定义
- ✅ **Communication Types**: `NotificationType` 和 `NotificationStatus` 已定义
- ✅ **Collaboration Types**: `CollaborationStatus`, `CollaborationType`, `InvitationStatus` 已定义
- ✅ **Permission Types**: `BranchPermissionLevel` 和 `PermissionAction` 已定义

**缺少枚举**（使用字符串类型代替）:
- ❌ **Quality Types**: `InspectionStatus` 和 `InspectionType` 未定义
- ❌ **Document Types**: `DocumentUploadSource` 未定义
- ❌ **Bot Types**: `BotType` 未定义
- ❌ **Permission Types**: `PermissionType`, `RoleType`, `BranchPermissionType` 未定义（使用现有枚举代替）

#### 2. 枚举值规范检查
- ⚠️ 确保所有枚举值使用小写字符串
- ⚠️ 确保所有枚举都有清晰的 JSDoc 注释
- ⚠️ 确保枚举值与数据库字段值一致

### 建议检查清单

对于每个 Types 模块，检查：

- [ ] 是否定义了所有相关枚举（Status, Type, Priority 等）
- [ ] 枚举值是否使用小写字符串
- [ ] 枚举是否有清晰的 JSDoc 注释
- [ ] 枚举值是否与数据库字段值一致
- [ ] 枚举是否在 Models 层重新导出（如果需要）

---

## 与 Models 层的对应关系

| Types 模块 | Models 模块 | 状态 |
|-----------|------------|------|
| Blueprint Types | Blueprint Models | ✅ 完整（已重新导出） |
| Task Types | Task Models | ✅ 完整（已重新导出） |
| Issue Types | Issue Models | ❌ 缺少重新导出（IssueStatus, IssuePriority, IssueSeverity 等） |
| Account Types | Account Models | ✅ 完整（已重新导出） |
| Quality Types | Quality Models | ⚠️ 部分（QualityCheckStatus 在 core/types 和 models 都有，QualityCheckType 在 models 层） |
| Document Types | Data Models | ❌ 缺少重新导出（DocumentType, DocumentStatus 在 analytics/data.types.ts） |
| Bot Types | Bot Models | ❌ 缺少重新导出（BotStatus, BotTaskStatus 等） |
| Communication Types | Communication Models | ❌ 缺少重新导出（NotificationType, NotificationStatus 等） |
| Collaboration Types | Collaboration Models | ❌ 缺少重新导出（CollaborationType, CollaborationStatus 等） |
| Permission Types | Permission Models | ⚠️ 部分（BranchPermissionLevel 在 models 层重复定义，PermissionAction 缺少重新导出） |
| System Types | System Models | ❌ 缺少重新导出（FeatureFlagStatus, SettingCategory 等） |
| Explore Types | Explore Models | ❌ 缺少重新导出（SearchType） |

---

## 与 Repositories 层的对应关系

| Types 模块 | Repository 层 | 状态 |
|-----------|--------------|------|
| Blueprint Types | Blueprint Repository | ✅ 完整 |
| Task Types | Task Repository | ✅ 完整 |
| Issue Types | Issue Repository | ✅ 完整 |
| Account Types | Account Repository | ✅ 完整 |
| Quality Types | QualityCheck Repository | ✅ 完整（使用 QualityCheckStatus 枚举） |
| Document Types | Document Repository | ✅ 完整（使用 DocumentType, DocumentStatus 枚举） |
| Bot Types | Bot Repository | ✅ 完整（使用 BotStatus, BotTaskStatus 枚举） |
| Communication Types | Comment Repository | ✅ 完整（使用 CommentableType 枚举） |
| Collaboration Types | OrganizationCollaboration Repository | ✅ 完整（使用 CollaborationType, CollaborationStatus 枚举） |
| Permission Types | BranchPermission Repository | ✅ 完整（使用 BranchPermissionLevel, PermissionAction 枚举） |
| System Types | Setting/FeatureFlag Repository | ✅ 完整（使用 FeatureFlagStatus, SettingCategory 枚举） |

**建议**: 确保 Types 层定义的枚举在 Repository 层正确使用，保持类型一致性。

---

**最后更新**: 2025-01-15  
**维护者**: 开发团队

