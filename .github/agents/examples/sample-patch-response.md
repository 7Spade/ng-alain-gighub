# Sample Patch Response

```
## Findings
1. **High – Security** (`src/app/core/auth/token.service.ts`)
   - Refresh token 未檢查過期時間，違反 domain/security-agent.md 要求。
2. **Medium – Angular** (`src/app/routes/tasks/task-list.component.ts`)
   - `@for` 未使用 `track`，可能導致重複渲染。

## Proposed Changes
```diff
@@ src/app/core/auth/token.service.ts
-  refreshSession(token);
+  if (!isTokenFresh(token)) {
+    throw new Error('Refresh token expired');
+  }
+  refreshSession(token);
@@ src/app/routes/tasks/task-list.component.ts
-  @for (task of tasks()) {
+  @for (task of tasks(); track task.id) {
     <app-task-card [task]="task" />
  }
```

## Validation
- [x] yarn lint
- [x] yarn type-check
- [x] yarn test --watch=false
- [ ] yarn build *(待 reviewer 在 CI 驗證)*

## Risks / Rollback
- 若刷新流程出現大量錯誤，可暫時關閉新檢查並回退至 commit `<hash>`。

## Follow-up
- 更新 `docs/45-SHARED_IMPORTS-使用指南.md` 說明新的 task list 指南。
```

> 回覆時請務必引用 `domain/*` 指南並提供完整驗證紀錄。
