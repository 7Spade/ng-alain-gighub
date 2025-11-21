# Services 层基础方法完整性分析报告

> **分析日期**: 2025-01-15  
> **参考标准**: BlueprintService（完整实现）  
> **配对文档**: 
> - [Models 层基础方法完整性分析报告](./models-analysis-report.md)
> - [Types 层基础方法完整性分析报告](./types-analysis-report.md)
> - [Repositories 层基础方法完整性分析报告](./repositories-analysis-report.md)
> - [Facades 层基础方法完整性分析报告](./facades-analysis-report.md)

## 分析标准

### Services 层职责

Services 层（`shared/services/`）主要负责：

1. **业务逻辑**：封装业务规则和流程
2. **状态管理**：使用 Signals 管理应用状态
3. **数据聚合**：聚合多个 Repository 的数据
4. **错误处理**：统一的错误处理和状态管理

### 基础方法清单（参考 BlueprintService）

#### 1. CRUD 操作
- ✅ `loadAll()` / `loadXXXs()` - 加载所有
- ✅ `loadById(id)` - 按ID加载
- ✅ `loadByCondition()` - 按条件加载（如 loadByStatus, loadByOwnerId）
- ✅ `search(query, options?)` - 搜索功能
- ✅ `create(data)` - 创建
- ✅ `update(id, data)` - 更新
- ✅ `delete(id)` - 删除

#### 2. 状态管理 Signals
- ✅ `loading` - 加载状态（ReadonlySignal）
- ✅ `error` - 错误状态（ReadonlySignal）
- ✅ `items` / `xxxList` - 数据列表（ReadonlySignal）
- ✅ `selectedItem` / `selectedXXX` - 选中项（ReadonlySignal）
- ✅ Computed signals - 派生状态（如 `activeBlueprints`, `pendingTasks`）

#### 3. 选择方法
- ✅ `select(item)` - 选择项
- ✅ `setCurrent(id)` - 设置当前项（可选）

#### 4. 重置方法
- ✅ `reset()` - 重置状态

---

## 各 Service 分析结果

### ✅ 1. Blueprint Service（完整 - 参考标准）

**文件**: `blueprint/blueprint.service.ts`

**状态**: ✅ 完整

**已有方法**:
- ✅ `loadBlueprints()`, `loadBlueprintById()`, `loadBlueprintsByOwnerId()`, `loadBlueprintsByStatus()`, `loadBlueprintByProjectCode()`
- ✅ `searchBlueprints(query, options?)`
- ✅ `createBlueprint()`, `updateBlueprint()`, `deleteBlueprint()`
- ✅ `selectBlueprint()`
- ✅ `loadConfigs()`, `getConfig()`, `setConfig()`
- ✅ `reset()`

**Signals**:
- ✅ `blueprints`, `selectedBlueprint`, `configs`, `loading`, `error`
- ✅ `activeBlueprints`, `planningBlueprints`, `completedBlueprints` (computed)

---

### ⚠️ 2. Task Service

**文件**: `task/task.service.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ `loadTasksByBlueprint()`, `loadTasksByIds()`, `loadTaskById()`
- ✅ `createTask()`, `updateTask()`, `deleteTask()`
- ✅ `updateTaskStatus()`
- ✅ 任务分配、列表、模板、依赖管理

**缺少方法**:
- ❌ `loadTasks()` - 加载所有任务（无蓝图限制）
- ❌ `searchTasks(query, options?)` - 搜索任务
- ❌ `loadTasksByStatus(status)` - 按状态加载
- ❌ `loadTasksByAssignee(assigneeId)` - 按分配人加载
- ❌ `selectTask(task)` - 选择任务方法（可能有但需确认）
- ❌ `reset()` - 重置状态

**Signals**:
- ✅ `tasks`, `selectedTask`, `taskTree`, `loading`, `error`
- ✅ `pendingTasks`, `inProgressTasks`, `completedTasks`, `stagingTasks`, `highPriorityTasks` (computed)

---

### ⚠️ 3. Issue Service

**文件**: `issue/issue.service.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ `loadIssuesByBlueprint()`, `loadIssuesByBranch()`, `loadIssuesByTask()`, `loadIssueById()`
- ✅ `createIssue()`, `updateIssue()`, `deleteIssue()`
- ✅ `addIssuePhoto()`, `createSyncLog()`
- ✅ `reset()`, `clearError()`

**缺少方法**:
- ❌ `loadIssues()` - 加载所有问题（无蓝图限制）
- ❌ `searchIssues(query, options?)` - 搜索问题
- ❌ `loadIssuesByStatus(status)` - 按状态加载
- ❌ `loadIssuesByPriority(priority)` - 按优先级加载
- ❌ `loadIssuesBySeverity(severity)` - 按严重程度加载
- ❌ `loadIssuesByAssignee(assigneeId)` - 按分配人加载
- ❌ `selectIssue(issue)` - 选择问题方法（可能有但需确认）

**Signals**:
- ✅ `issues`, `selectedIssue`, `loading`, `error`
- ✅ `openIssues`, `criticalIssues` (computed)

---

### ⚠️ 4. Account Service

**文件**: `account/account.service.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ `loadAccounts()`, `loadAccountById()`, `loadAccountsByType()`, `loadAccountsByIds()`
- ✅ `createOrganization()`, `createBot()`, `updateAccount()`, `deleteAccount()`
- ✅ `selectAccount()`
- ✅ `getUserCreatedOrganizations()`, `getUserJoinedOrganizations()`, `getUserCreatedTeams()`, `getUserTeams()`
- ✅ `reset()`

**缺少方法**:
- ❌ `searchAccounts(query, options?)` - 搜索账户

**Signals**:
- ✅ `accounts`, `selectedAccount`, `loading`, `error`
- ✅ `activeAccounts`, `userAccounts`, `organizationAccounts`, `botAccounts`, `personalBotAccounts`, `organizationBotAccounts` (computed)

---

### ⚠️ 5. Quality Check Service

**文件**: `quality/quality-check.service.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ `getById()` - 根据ID获取质检详情
- ✅ `create()`, `update()`

**已有方法**:
- ✅ `getById()` - 根据ID获取质检详情
- ✅ `create()`, `update()`, `delete()`
- ✅ `clearError()`

**缺少方法**:
- ❌ `loadQualityChecks()` - 加载所有质检
- ❌ `loadQualityChecksByTask(taskId)` - 按任务加载
- ❌ `loadQualityChecksByBlueprint(blueprintId)` - 按蓝图加载
- ❌ `loadQualityChecksByStatus(status)` - 按状态加载
- ❌ `searchQualityChecks(query, options?)` - 搜索质检
- ❌ `selectQualityCheck(qc)` - 选择质检
- ❌ `reset()` - 重置状态

**Signals**:
- ✅ `loading`, `error`
- ❌ 缺少 `qualityChecks`, `selectedQualityCheck` signals（需要添加）

---

### ⚠️ 6. Inspection Service

**文件**: `quality/inspection.service.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ `loadByTask()`, `loadByType()`, `loadInspectionById()`
- ✅ `create()`, `update()`, `delete()`
- ✅ `uploadPhotos()`, `complete()`, `transferResponsibility()`
- ✅ `clear()` - 清空本地状态

**缺少方法**:
- ❌ `loadInspections()` - 加载所有检查（无任务限制）
- ❌ `loadInspectionsByBlueprint(blueprintId)` - 按蓝图加载
- ❌ `searchInspections(query, options?)` - 搜索检查
- ❌ `selectInspection(inspection)` - 选择检查方法（已有 `selectedInspection` signal，但缺少选择方法）
- ❌ `reset()` - 重置状态（有 `clear()` 但命名不一致）

**Signals**:
- ✅ `inspections`, `selectedInspection`, `loading`, `error`
- ✅ `pendingInspections`, `passedInspections`, `failedInspections`, `completedInspections` (computed)

---

### ⚠️ 7. Document Service

**文件**: `document/document.service.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ `loadByBlueprint()`, `loadByUploader()`, `loadDocumentById()`
- ✅ `createDocument()`, `updateDocument()`, `deleteDocument()`
- ✅ `searchDocuments()`
- ✅ 版本管理、缩图管理

**缺少方法**:
- ❌ `loadDocuments()` - 加载所有文档（无蓝图限制）
- ❌ `loadDocumentsByType(type)` - 按类型加载
- ❌ `selectDocument(doc)` - 选择文档方法（已有 `selectedDocument` signal，但缺少选择方法）
- ❌ `reset()` - 重置状态

**Signals**:
- ✅ `documents`, `selectedDocument`, `loading`, `error`
- ✅ `activeDocuments`, `deletedDocuments`, `documentsByType` (computed)

---

### ⚠️ 8. Comment Service

**文件**: `collab/comment.service.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ `loadByResource()`, `loadByTask()`, `loadByIssue()`, `loadByBlueprint()`
- ✅ `createComment()`, `updateComment()`, `deleteComment()`

**缺少方法**:
- ❌ `loadComments()` - 加载所有评论（无资源限制）
- ❌ `searchComments(query, options?)` - 搜索评论
- ❌ `selectComment(comment)` - 选择评论方法（已有 `selectedComment` signal，但缺少选择方法）
- ❌ `reset()` - 重置状态（有 `clear()` 但命名不一致）

**Signals**:
- ✅ `comments`, `loading`, `error`
- ✅ `topLevelComments`, `commentCount`, `recentComments` (computed)
- ❌ 缺少 `selectedComment` signal（需要添加）

---

### ⚠️ 9. Bot Service

**文件**: `bot/bot.service.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ `loadBots()`, `createBot()`, `updateBot()`, `deleteBot()`
- ✅ Bot 任务管理、执行控制

**已有方法**:
- ✅ `loadBots()`, `loadBotById()` - 按ID加载
- ✅ `createBot()`, `updateBot()`, `deleteBot()`
- ✅ Bot 任务管理、执行控制

**缺少方法**:
- ❌ `searchBots(query, options?)` - 搜索机器人
- ❌ `loadBotsByType(type)` - 按类型加载
- ❌ `loadBotsByStatus(status)` - 按状态加载
- ❌ `selectBot(bot)` - 选择机器人方法（已有 `selectedBot` signal，但缺少选择方法）
- ❌ `reset()` - 重置状态

**Signals**:
- ✅ `bots`, `tasks`, `executionLogs`, `selectedBot`, `loading`, `error`
- ✅ `activeBots`, `pendingTasks`, `runningTasks`, `failedTasks`, `recentExecutions` (computed)

---

### ⚠️ 10. Collaboration Service

**文件**: `org/collaboration.service.ts`

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ `loadCollaborations()`, `loadCollaborationById()`, `loadCollaborationsByBlueprintId()`
- ✅ `createCollaboration()`, `updateCollaboration()`, `deleteCollaboration()`
- ✅ `selectCollaboration()`
- ✅ 协作邀请管理方法

**缺少方法**:
- ❌ `loadCollaborationsByStatus(status)` - 按状态加载
- ❌ `searchCollaborations(query, options?)` - 搜索协作
- ❌ `reset()` - 重置状态

**Signals**:
- ✅ `collaborations`, `selectedCollaboration`, `loading`, `error`
- ✅ `activeCollaborations`, `pendingCollaborations`, `contractorCollaborations` (computed)

---

### ⚠️ 11. Notification Service

**文件**: `collab/notification.service.ts`

**状态**: ⚠️ 部分完整（特殊用途）

**说明**: Notification Service 是通知专用，可能不需要完整 CRUD 模式。

---

### ⚠️ 12. Analytics Service

**文件**: `analytics/analytics.service.ts`

**状态**: ⚠️ 部分完整（特殊用途）

**说明**: Analytics Service 是分析专用，可能不需要完整 CRUD 模式。

---

### ⚠️ 13. System Services

**文件**: `system/setting.service.ts`, `system/feature-flag.service.ts`

**状态**: ⚠️ 部分完整（特殊用途）

**说明**: System Services 是系统配置专用，可能不需要完整 CRUD 模式。

---

## 总结

### 需要补充基础方法的 Service（优先级排序）

#### 高优先级（核心业务模块）

1. **Task Service** - 缺少 `loadTasks()`, `searchTasks()`, `loadTasksByStatus()`, `loadTasksByAssignee()`, `selectTask()`, `reset()`
2. **Issue Service** - 缺少 `loadIssues()`, `searchIssues()`, `loadIssuesByStatus/Priority/Severity/Assignee()`, `selectIssue()`
3. **Quality Check Service** - 缺少大量基础方法（loadAll, search, delete, select, reset）和 Signals
4. **Inspection Service** - 缺少大量基础方法（loadAll, search, delete, select, reset）和 Signals

#### 中优先级（辅助业务模块）

5. **Account Service** - 缺少 `searchAccounts()`
6. **Document Service** - 缺少 `loadDocuments()`, `loadDocumentsByType()`, `selectDocument()`, `reset()`
7. **Comment Service** - 缺少 `loadComments()`, `searchComments()`, `selectComment()`, `reset()`
8. **Bot Service** - 缺少 `searchBots()`, `loadBotsByType/Status()`, `selectBot()`, `reset()`
9. **Collaboration Service** - 缺少基础查询和选择方法

#### 低优先级（特殊用途，可选）

10. **Notification Service** - 可考虑添加搜索方法
11. **Analytics Service** - 可考虑添加搜索方法
12. **System Services** - 可考虑添加搜索方法

### 建议实施顺序

1. **第一阶段**: Task, Issue, Quality Check, Inspection（核心业务）
2. **第二阶段**: Account, Document, Comment（常用功能）
3. **第三阶段**: Bot, Collaboration（辅助功能）
4. **第四阶段**: Notification, Analytics, System（可选优化）

### 代码示例（基础方法模板）

参考 `BlueprintService` 的实现模式：

```typescript
// 1. Signals 定义
private itemsState = signal<Item[]>([]);
private selectedItemState = signal<Item | null>(null);
private loadingState = signal<boolean>(false);
private errorState = signal<string | null>(null);

readonly items = this.itemsState.asReadonly();
readonly selectedItem = this.selectedItemState.asReadonly();
readonly loading = this.loadingState.asReadonly();
readonly error = this.errorState.asReadonly();

// 2. 加载方法
async loadItems(): Promise<void> {
  this.loadingState.set(true);
  this.errorState.set(null);
  try {
    const items = await firstValueFrom(this.repository.findAll());
    this.itemsState.set(items);
  } catch (error) {
    this.errorState.set(error instanceof Error ? error.message : '加载失败');
    throw error;
  } finally {
    this.loadingState.set(false);
  }
}

// 3. 搜索方法
async searchItems(query: string, options?: QueryOptions): Promise<Item[]> {
  this.loadingState.set(true);
  this.errorState.set(null);
  try {
    const items = await firstValueFrom(this.repository.search(query, options));
    return items;
  } catch (error) {
    this.errorState.set(error instanceof Error ? error.message : '搜索失败');
    throw error;
  } finally {
    this.loadingState.set(false);
  }
}

// 4. 选择方法
selectItem(item: Item | null): void {
  this.selectedItemState.set(item);
}

// 5. 重置方法
reset(): void {
  this.itemsState.set([]);
  this.selectedItemState.set(null);
  this.errorState.set(null);
}
```

---

## 与 Repositories 层的对应关系

| Service 层 | Repository 层 | 状态 |
|-----------|--------------|------|
| Task Service | Task Repository | Service 需要补充 search, loadByStatus, loadByAssignee |
| Issue Service | Issue Repository | Service 需要补充 search, loadByStatus/Priority/Severity/Assignee |
| Account Service | Account Repository | Repository 完整，Service 需要补充 search |
| Document Service | Document Repository | Service 需要补充 loadDocuments, loadByType |
| Quality Check Service | QualityCheck Repository | Service 需要补充大量基础方法 |
| Inspection Service | Inspection Repository | Service 需要补充大量基础方法 |
| Comment Service | Comment Repository | Service 需要补充 search, select, reset |
| Bot Service | Bot Repository | Service 需要补充 search, loadByType/Status |

**建议**: 先补充 Repository 层的方法，再补充 Service 层的方法，确保数据访问层完整。

---

**最后更新**: 2025-01-15  
**维护者**: 开发团队

