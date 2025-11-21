# Facades 基础方法完整性分析报告

> **分析日期**: 2025-01-15  
> **参考标准**: BlueprintCrudFacade（完整实现）  
> **配对文档**: 
> - [Repositories 基础方法完整性分析报告](./repositories-analysis-report.md)
> - [Services 层基础方法完整性分析报告](./services-analysis-report.md)
> - [Models 层基础方法完整性分析报告](./models-analysis-report.md)
> - [Types 层基础方法完整性分析报告](./types-analysis-report.md)

## 分析标准

### 基础方法清单（参考 BlueprintCrudFacade）

#### 1. CRUD 操作
- ✅ `loadAll()` / `loadXXXs()` - 加载所有
- ✅ `loadById(id)` - 按ID加载
- ✅ `loadByCondition()` - 按条件加载（如 loadByStatus, loadByOwnerId）
- ✅ `search(query, options?)` - 搜索功能
- ✅ `create(data)` - 创建
- ✅ `update(id, data)` - 更新
- ✅ `delete(id)` - 删除

#### 2. 状态管理 Signals
- ✅ `loading` - 加载状态
- ✅ `error` - 错误状态
- ✅ `items` / `xxxList` - 数据列表
- ✅ `selectedItem` / `selectedXXX` - 选中项
- ✅ `operationInProgress` - 操作进行中
- ✅ `lastOperation` - 最后操作

#### 3. 选择方法
- ✅ `select(item)` - 选择项
- ✅ `setCurrent(id)` - 设置当前项

---

## 各 Facade 分析结果

### ✅ 1. Blueprint Facade（完整）

**状态**: ✅ 完整（已拆分，作为参考标准）

**包含方法**:
- ✅ loadBlueprints, loadBlueprintsByOwnerId, loadBlueprintsByStatus
- ✅ loadBlueprintById, loadBlueprintByProjectCode
- ✅ searchBlueprints
- ✅ createBlueprint, updateBlueprint, deleteBlueprint
- ✅ selectBlueprint
- ✅ 所有 Signals 完整

---

### ⚠️ 2. Task Facade

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ loadTasksByBlueprint, loadTaskById, loadTaskTree
- ✅ createTask, updateTask, deleteTask
- ✅ updateTaskStatus
- ✅ 任务分配、列表、模板、依赖管理

**缺少方法**:
- ❌ `loadTasks()` - 加载所有任务（无蓝图限制）
- ❌ `searchTasks(query, options?)` - 搜索任务
- ❌ `loadTasksByStatus(status)` - 按状态加载
- ❌ `loadTasksByAssignee(assigneeId)` - 按分配人加载
- ❌ `selectTask(task)` - 选择任务方法（可能有但需确认）

**建议补充**:
```typescript
async loadTasks(): Promise<void>
async searchTasks(query: string, options?: QueryOptions): Promise<Task[]>
async loadTasksByStatus(status: TaskStatus): Promise<Task[]>
async loadTasksByAssignee(assigneeId: string, assigneeType: 'user' | 'team' | 'org'): Promise<Task[]>
selectTask(task: Task | null): void
```

---

### ⚠️ 3. Issue Facade

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ loadIssues, loadIssuesByBlueprint, loadIssuesByBranch
- ✅ loadIssueById
- ✅ createIssue, updateIssue, deleteIssue

**缺少方法**:
- ❌ `searchIssues(query, options?)` - 搜索问题
- ❌ `loadIssuesByStatus(status)` - 按状态加载
- ❌ `loadIssuesByPriority(priority)` - 按优先级加载
- ❌ `loadIssuesBySeverity(severity)` - 按严重程度加载
- ❌ `loadIssuesByAssignee(assigneeId)` - 按分配人加载
- ❌ `selectIssue(issue)` - 选择问题方法（可能有但需确认）

**建议补充**:
```typescript
async searchIssues(query: string, options?: QueryOptions): Promise<Issue[]>
async loadIssuesByStatus(status: IssueStatus): Promise<Issue[]>
async loadIssuesByPriority(priority: IssuePriority): Promise<Issue[]>
async loadIssuesBySeverity(severity: IssueSeverity): Promise<Issue[]>
async loadIssuesByAssignee(assigneeId: string): Promise<Issue[]>
selectIssue(issue: Issue | null): void
```

---

### ⚠️ 4. Quality Facade

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ loadQualityCheckById, loadQualityChecksByTask
- ✅ createQualityCheck, updateQualityCheck
- ✅ loadInspectionsByTask, loadInspectionById
- ✅ createInspection, updateInspection

**缺少方法**:
- ❌ `loadQualityChecks()` - 加载所有质检
- ❌ `loadQualityChecksByBlueprint(blueprintId)` - 按蓝图加载
- ❌ `loadQualityChecksByStatus(status)` - 按状态加载
- ❌ `searchQualityChecks(query, options?)` - 搜索质检
- ❌ `deleteQualityCheck(id)` - 删除质检
- ❌ `loadInspections()` - 加载所有检查
- ❌ `loadInspectionsByBlueprint(blueprintId)` - 按蓝图加载
- ❌ `loadInspectionsByType(type)` - 按类型加载
- ❌ `searchInspections(query, options?)` - 搜索检查
- ❌ `deleteInspection(id)` - 删除检查
- ❌ `selectQualityCheck(qc)` - 选择质检
- ❌ `selectInspection(inspection)` - 选择检查

**建议补充**:
```typescript
// Quality Check
async loadQualityChecks(): Promise<void>
async loadQualityChecksByBlueprint(blueprintId: string): Promise<void>
async loadQualityChecksByStatus(status: string): Promise<void>
async searchQualityChecks(query: string, options?: QueryOptions): Promise<QualityCheckDetail[]>
async deleteQualityCheck(id: string): Promise<void>
selectQualityCheck(qc: QualityCheckDetail | null): void

// Inspection
async loadInspections(): Promise<void>
async loadInspectionsByBlueprint(blueprintId: string): Promise<void>
async loadInspectionsByType(type: string): Promise<void>
async searchInspections(query: string, options?: QueryOptions): Promise<InspectionDetail[]>
async deleteInspection(id: string): Promise<void>
selectInspection(inspection: InspectionDetail | null): void
```

---

### ⚠️ 5. Document Facade

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ loadDocuments, loadDocumentsByBlueprint
- ✅ loadDocumentById
- ✅ createDocument, updateDocument, deleteDocument
- ✅ searchDocuments
- ✅ 版本管理方法

**缺少方法**:
- ❌ `loadDocumentsByType(type)` - 按类型加载
- ❌ `loadDocumentsByStatus(status)` - 按状态加载（如果有）
- ❌ `selectDocument(doc)` - 选择文档方法（可能有但需确认）

**建议补充**:
```typescript
async loadDocumentsByType(type: string): Promise<void>
async loadDocumentsByStatus(status: string): Promise<void>
selectDocument(doc: Document | null): void
```

---

### ⚠️ 6. Account Facade

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ loadAccounts, loadAccountById
- ✅ loadAccountsByType, loadAccountsByStatus
- ✅ createOrganization, createBot
- ✅ updateAccount, deleteAccount

**缺少方法**:
- ❌ `searchAccounts(query, options?)` - 搜索账户
- ❌ `selectAccount(account)` - 选择账户方法（可能有但需确认）

**建议补充**:
```typescript
async searchAccounts(query: string, options?: QueryOptions): Promise<Account[]>
selectAccount(account: Account | null): void
```

---

### ⚠️ 7. Collaboration Facade

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ 协作管理、邀请管理、通知管理

**缺少方法**:
- ❌ `loadCollaborations()` - 加载所有协作（需确认）
- ❌ `loadCollaborationsByBlueprint(blueprintId)` - 按蓝图加载
- ❌ `loadCollaborationsByStatus(status)` - 按状态加载
- ❌ `searchCollaborations(query, options?)` - 搜索协作
- ❌ `selectCollaboration(collab)` - 选择协作

**建议补充**:
```typescript
async loadCollaborations(): Promise<void>
async loadCollaborationsByBlueprint(blueprintId: string): Promise<void>
async loadCollaborationsByStatus(status: string): Promise<void>
async searchCollaborations(query: string, options?: QueryOptions): Promise<OrganizationCollaboration[]>
selectCollaboration(collab: OrganizationCollaboration | null): void
```

---

### ⚠️ 8. Communication Facade

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ 评论管理、通知管理

**缺少方法**:
- ❌ `loadComments()` - 加载所有评论（需确认）
- ❌ `searchComments(query, options?)` - 搜索评论
- ❌ `selectComment(comment)` - 选择评论

**建议补充**:
```typescript
async loadComments(): Promise<void>
async searchComments(query: string, options?: QueryOptions): Promise<Comment[]>
selectComment(comment: Comment | null): void
```

---

### ⚠️ 9. Bot Facade

**状态**: ⚠️ 部分完整

**已有方法**:
- ✅ loadBots, createBot, updateBot, deleteBot
- ✅ Bot 任务管理、执行控制

**缺少方法**:
- ❌ `loadBotById(id)` - 按ID加载（需确认）
- ❌ `searchBots(query, options?)` - 搜索机器人
- ❌ `loadBotsByType(type)` - 按类型加载
- ❌ `loadBotsByStatus(status)` - 按状态加载
- ❌ `selectBot(bot)` - 选择机器人（可能有但需确认）

**建议补充**:
```typescript
async loadBotById(id: string): Promise<Bot | null>
async searchBots(query: string, options?: QueryOptions): Promise<Bot[]>
async loadBotsByType(type: string): Promise<void>
async loadBotsByStatus(status: string): Promise<void>
selectBot(bot: Bot | null): void
```

---

### ⚠️ 10. Analytics Facade

**状态**: ⚠️ 部分完整（特殊用途，可能不需要完整 CRUD）

**已有方法**:
- ✅ 进度跟踪、活动日志、缓存管理、报告生成

**缺少方法**:
- ⚠️ Analytics 是特殊用途 Facade，可能不需要完整 CRUD
- ❌ 但可以考虑添加搜索和过滤方法

**建议补充**（可选）:
```typescript
async searchActivityLogs(query: string, filters?: ActivityLogFilters): Promise<ActivityLog[]>
async searchProgressTracking(query: string): Promise<ProgressTracking[]>
```

---

### ⚠️ 11. System Facade

**状态**: ⚠️ 部分完整（特殊用途，可能不需要完整 CRUD）

**已有方法**:
- ✅ 设置管理、功能标志管理

**缺少方法**:
- ⚠️ System 是特殊用途 Facade，可能不需要完整 CRUD
- ❌ 但可以考虑添加搜索方法

**建议补充**（可选）:
```typescript
async searchSettings(query: string): Promise<Setting[]>
async searchFeatureFlags(query: string): Promise<FeatureFlag[]>
```

---

### ✅ 12. Storage Facade

**状态**: ✅ 完整（特殊用途，文件存储不需要传统 CRUD）

**已有方法**:
- ✅ uploadFile, downloadFile, deleteFile
- ✅ getPublicUrl, getSignedUrl
- ✅ listFiles

**说明**: Storage Facade 是文件存储专用，不需要传统 CRUD 模式。

---

### ✅ 13. Auth Facade

**状态**: ✅ 完整（认证专用，不需要传统 CRUD）

**说明**: Auth Facade 是认证专用，不需要传统 CRUD 模式。

---

### ✅ 14. Realtime Facade

**状态**: ✅ 完整（实时通信专用，不需要传统 CRUD）

**说明**: Realtime Facade 是实时通信专用，不需要传统 CRUD 模式。

---

## 总结

### 需要补充基础方法的 Facade（优先级排序）

1. **高优先级**（核心业务模块）:
   - ⚠️ **Task Facade** - 缺少 search, loadByStatus, loadByAssignee, select
   - ⚠️ **Issue Facade** - 缺少 search, loadByStatus/Priority/Severity/Assignee, select
   - ⚠️ **Quality Facade** - 缺少大量基础方法（loadAll, search, delete, select）
   - ⚠️ **Document Facade** - 缺少 loadByType, select

2. **中优先级**（辅助业务模块）:
   - ⚠️ **Account Facade** - 缺少 search, select
   - ⚠️ **Collaboration Facade** - 缺少基础查询和选择方法
   - ⚠️ **Communication Facade** - 缺少 search, select
   - ⚠️ **Bot Facade** - 缺少 search, loadByType/Status, select

3. **低优先级**（特殊用途，可选）:
   - ⚠️ **Analytics Facade** - 可考虑添加搜索方法
   - ⚠️ **System Facade** - 可考虑添加搜索方法

### 建议实施顺序

1. **第一阶段**: Task, Issue, Quality（核心业务）
2. **第二阶段**: Document, Account（常用功能）
3. **第三阶段**: Collaboration, Communication, Bot（辅助功能）
4. **第四阶段**: Analytics, System（可选优化）

---

## 与 Repositories 分析报告的对应关系

| Facade 层 | Repository 层 | 状态 |
|-----------|--------------|------|
| Task Facade | Task Repository | 都需要补充 search |
| Issue Facade | Issue Repository | 都需要补充 search |
| Document Facade | Document Repository | 都需要补充 search |
| Quality Facade | QualityCheck/Inspection Repository | 都需要补充 search |
| Account Facade | Account Repository | Repository 完整，Facade 需要补充 search |
| Communication Facade | Comment Repository | 都需要补充 search |
| Bot Facade | Bot Repository | 都需要补充 search |
| Collaboration Facade | OrganizationCollaboration Repository | Repository 需要 findActive，Facade 需要基础查询 |

**建议**: 先补充 Repository 层的方法，再补充 Facade 层的方法，确保数据访问层完整。

---

**最后更新**: 2025-01-15  
**维护者**: 开发团队

