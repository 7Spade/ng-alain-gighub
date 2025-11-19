# 构建错误清单

## 错误总数：15 个

---

## 1. collaboration.facade.ts - read_at 类型不匹配 (第485行)

**错误信息：**
```
TS2345: Argument of type '...' is not assignable to parameter of type '...'
Types of property 'read_at' are incompatible.
Type 'Date' is not assignable to type 'string'.
```

**位置：** `src/app/core/facades/collaboration.facade.ts:485:29`

**问题：** `markAsRead()` 方法中，将 `read_at` 设置为 `new Date()`，但类型定义要求 `string | null`

**代码：**
```typescript
const notifs = this.notifications().map(n => (n.id === notificationId ? { ...n, read_at: new Date() } : n));
```

---

## 2. collaboration.facade.ts - read_at 类型不匹配 (第514行)

**错误信息：**
```
TS2345: Argument of type '...' is not assignable to parameter of type '...'
Types of property 'read_at' are incompatible.
Type 'string | Date' is not assignable to type 'string | null'.
Type 'Date' is not assignable to type 'string'.
```

**位置：** `src/app/core/facades/collaboration.facade.ts:514:29`

**问题：** `markAllAsRead()` 方法中，`read_at` 可能是 `Date` 类型，但类型定义要求 `string | null`

**代码：**
```typescript
const notifs = this.notifications().map(n => ({
  ...n,
  read_at: n.read_at || new Date()
}));
```

---

## 3. collaboration.facade.ts - clearAllNotifications 参数错误 (第561行)

**错误信息：**
```
TS2554: Expected 0 arguments, but got 1.
```

**位置：** `src/app/core/facades/collaboration.facade.ts:561:59`

**问题：** `notificationService.clearAllNotifications()` 方法不接受参数，但 facade 传入了 `userId`

**代码：**
```typescript
await this.notificationService.clearAllNotifications(userId);
```

**实际方法签名：** `clearAllNotifications(): Promise<void>`

---

## 4. document.facade.ts - doc 可能为 null (第174行，第一个错误)

**错误信息：**
```
TS2322: Type '... | null' is not assignable to type '...'
Type 'null' is not assignable to type '{ ... }'.
```

**位置：** `src/app/core/facades/document.facade.ts:174:28`

**问题：** `getDocumentById()` 返回 `Document | null`，但代码直接使用 `doc` 添加到数组

**代码：**
```typescript
this.documents.set([...current, doc]);
```

---

## 5. document.facade.ts - doc 可能为 null (第174行，第二个错误)

**错误信息：**
```
TS2322: Type '... | null' is not assignable to type '...'
Type 'null' is not assignable to type '{ ... }'.
```

**位置：** `src/app/core/facades/document.facade.ts:174:40`

**问题：** 同上，`doc` 可能为 `null`

---

## 6. document.facade.ts - versionData 缺少必需属性 (第310行)

**错误信息：**
```
TS2345: Argument of type '{ file_path: string; file_size: number; ... }' is not assignable to parameter of type 'Omit<DocumentVersionInsert, "documentId">'.
Type '{ file_path: string; ... }' is missing the following properties: created_by, document_id, file_name, storage_path
```

**位置：** `src/app/core/facades/document.facade.ts:310:67`

**问题：** `createDocumentVersion()` 需要的参数类型与传入的 `versionData` 不匹配

**代码：**
```typescript
versionData: {
  file_path: string;
  file_size: number;
  version_number: number;
  changes_summary?: string;
  uploaded_by: string;
}
```

**需要：** `Omit<DocumentVersionInsert, 'documentId'>`，包含 `created_by`, `document_id`, `file_name`, `storage_path` 等属性

---

## 7. issue.facade.ts - loadIssuesByBlueprint 返回 void (第161行)

**错误信息：**
```
TS2345: Argument of type 'void' is not assignable to parameter of type 'Issue[]'.
```

**位置：** `src/app/core/facades/issue.facade.ts:161:22`

**问题：** `issueService.loadIssuesByBlueprint()` 返回 `Promise<void>`，但代码试图将返回值赋给 `issues`

**代码：**
```typescript
const issues = await this.issueService.loadIssuesByBlueprint(blueprintId);
this.issues.set(issues);
```

**实际方法签名：** `loadIssuesByBlueprint(blueprintId: string): Promise<void>`

---

## 8. issue.facade.ts - loadIssuesByBranch 返回 void (第184行)

**错误信息：**
```
TS2345: Argument of type 'void' is not assignable to parameter of type 'Issue[]'.
```

**位置：** `src/app/core/facades/issue.facade.ts:184:22`

**问题：** `issueService.loadIssuesByBranch()` 返回 `Promise<void>`，但代码试图将返回值赋给 `issues`

**代码：**
```typescript
const issues = await this.issueService.loadIssuesByBranch(branchId);
this.issues.set(issues);
```

**实际方法签名：** `loadIssuesByBranch(branchId: string): Promise<void>`

---

## 9. issue.facade.ts - tags 属性不存在 (第409行)

**错误信息：**
```
TS2339: Property 'tags' does not exist on type 'Issue'.
```

**位置：** `src/app/core/facades/issue.facade.ts:409:32`

**问题：** `Issue` 类型中没有 `tags` 属性

**代码：**
```typescript
const currentTags = issue.tags || [];
```

---

## 10. issue.facade.ts - tags 属性不能赋值 (第415行)

**错误信息：**
```
TS2353: Object literal may only specify known properties, and 'tags' does not exist in type 'IssueUpdate'.
```

**位置：** `src/app/core/facades/issue.facade.ts:415:8`

**问题：** `IssueUpdate` 类型中不允许 `tags` 属性

**代码：**
```typescript
const updatedIssue = await this.updateIssue(issueId, {
  tags: [...currentTags, tag]
});
```

---

## 11. issue.facade.ts - tags 属性不存在 (第443行)

**错误信息：**
```
TS2339: Property 'tags' does not exist on type 'Issue'.
```

**位置：** `src/app/core/facades/issue.facade.ts:443:32`

**问题：** 同上，`Issue` 类型中没有 `tags` 属性

**代码：**
```typescript
const currentTags = issue.tags || [];
```

---

## 12. issue.facade.ts - tags 属性不能赋值 (第445行)

**错误信息：**
```
TS2353: Object literal may only specify known properties, and 'tags' does not exist in type 'IssueUpdate'.
```

**位置：** `src/app/core/facades/issue.facade.ts:445:8`

**问题：** `IssueUpdate` 类型中不允许 `tags` 属性

**代码：**
```typescript
const updatedIssue = await this.updateIssue(issueId, {
  tags: currentTags.filter((t: string) => t !== tag)
});
```

---

## 13. issue.facade.ts - resolved_at 类型不匹配 (第505行)

**错误信息：**
```
TS2322: Type 'Date' is not assignable to type 'string'.
```

**位置：** `src/app/core/facades/issue.facade.ts:505:6`

**问题：** `resolved_at` 应该是 `string | null`，但代码使用了 `new Date()`

**代码：**
```typescript
resolved_at: new Date()
```

**期望类型：** `resolved_at?: string | null`

---

## 14. issue.facade.ts - resolution 属性不存在 (第515行)

**错误信息：**
```
TS2353: Object literal may only specify known properties, and 'resolution' does not exist in type 'IssueUpdate'.
```

**位置：** `src/app/core/facades/issue.facade.ts:515:6`

**问题：** `IssueUpdate` 类型中没有 `resolution` 属性，应该使用 `resolution_note`

**代码：**
```typescript
resolution: null,
```

**数据库字段：** `resolution_note?: string | null`

---

## 15. issue.facade.ts - assigned_to 属性不存在 (第561行)

**错误信息：**
```
TS2339: Property 'assigned_to' does not exist on type 'Issue'.
```

**位置：** `src/app/core/facades/issue.facade.ts:561:47`

**问题：** `Issue` 类型中没有 `assigned_to` 属性，分配关系存储在 `issue_assignments` 表中

**代码：**
```typescript
return this.issues().filter(issue => issue.assigned_to === assigneeId);
```

---

## 错误分类总结

### 类型不匹配 (4个)
- collaboration.facade.ts:485 - read_at (Date → string)
- collaboration.facade.ts:514 - read_at (Date → string)
- document.facade.ts:174 - doc (null 检查)
- issue.facade.ts:505 - resolved_at (Date → string)

### 方法签名不匹配 (3个)
- collaboration.facade.ts:561 - clearAllNotifications 参数
- issue.facade.ts:161 - loadIssuesByBlueprint 返回值
- issue.facade.ts:184 - loadIssuesByBranch 返回值

### 属性不存在 (6个)
- issue.facade.ts:409, 443 - tags 属性
- issue.facade.ts:415, 445 - tags 属性（Update）
- issue.facade.ts:515 - resolution 属性（应为 resolution_note）
- issue.facade.ts:561 - assigned_to 属性

### 参数类型不匹配 (2个)
- document.facade.ts:310 - versionData 缺少必需属性

---

## 修复优先级

1. **高优先级** - 方法签名不匹配（影响功能）
   - issue.facade.ts:161, 184 - loadIssuesByBlueprint/Branch
   - collaboration.facade.ts:561 - clearAllNotifications

2. **中优先级** - 类型不匹配（运行时错误）
   - 所有 Date → string 转换
   - null 检查

3. **低优先级** - 属性不存在（需要确认业务逻辑）
   - tags, resolution, assigned_to 属性

