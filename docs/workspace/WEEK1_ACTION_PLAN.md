# 立即行動計畫 - 第一週執行指南

> **目的**: 提供可立即執行的詳細步驟  
> **時間範圍**: 第 1 週 (5 個工作日)  
> **目標**: 完成快速勝利點，將進度從 5% 提升至 10%

---

## 📅 第一週時間表

```
Day 1 (Monday)     ████████████████████ 項目啟動
Day 2 (Tuesday)    ████████████████████ 技術債務清理
Day 3 (Wednesday)  ████████████████████ Types層補充 + 文檔改善
Day 4 (Thursday)   ████████████████████ Repository搜索方法 (1/2)
Day 5 (Friday)     ████████████████████ Repository搜索方法 (2/2) + 單元測試
```

---

## Day 1: 項目啟動 (Monday)

### 上午 (9:00 - 12:00)

#### 1. 項目啟動會議 (9:00 - 11:00)
**參與者**: 全體團隊成員

**議程**:
1. 專案背景與目標介紹 (30 分鐘)
   - 回顧 Phase 1 規劃成果
   - 介紹剩餘 191 項工作
   - 說明 30 週穩健計畫

2. 第一週目標說明 (30 分鐘)
   - 快速勝利點介紹
   - 任務分配預告
   - 成功標準說明

3. 工作流程與規範 (30 分鐘)
   - Git 工作流程 (feature branch + PR)
   - Code Review 流程
   - 測試要求 (每個 PR 需包含測試)
   - 溝通機制 (Daily Standup)

4. Q&A (30 分鐘)

**輸出**:
- [ ] 會議紀錄
- [ ] 任務分配表

#### 2. 環境準備檢查 (11:00 - 12:00)
**負責人**: 每位開發者自行檢查

**檢查清單**:
- [ ] Node.js 版本正確 (根據 .nvmrc)
- [ ] 依賴安裝成功 (`npm install` 無錯誤)
- [ ] 本地開發伺服器啟動正常 (`npm start`)
- [ ] ESLint 配置正常 (`npm run lint`)
- [ ] 測試執行正常 (`npm test`)
- [ ] Git 配置正確 (name, email)
- [ ] 能夠建立 feature branch

**問題處理**:
- 遇到問題立即在團隊群組提出
- 架構師協助解決環境問題

### 下午 (13:30 - 18:00)

#### 3. 熟悉專案結構 (13:30 - 15:30)
**活動**: 每人自行閱讀文檔

**必讀文檔**:
1. [REMAINING_WORK_ANALYSIS.md](./REMAINING_WORK_ANALYSIS.md) (30 分鐘)
2. [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) (15 分鐘)
3. [facades-implementation-guide.md](./facades-implementation-guide.md) (30 分鐘)
4. [five-layer-architecture-enhancement-plan.md](./five-layer-architecture-enhancement-plan.md) (30 分鐘)
5. 瀏覽 `src/app/core/` 目錄結構 (15 分鐘)

**理解要點**:
- [ ] 五層架構 (Types → Repositories → Models → Services → Facades)
- [ ] 開發順序 (必須從下層到上層)
- [ ] 測試要求 (>80% 覆蓋率)
- [ ] 代碼規範 (ESLint, TypeScript strict)

#### 4. 任務認領與準備 (15:30 - 17:00)
**活動**: 團隊討論

**Day 2-5 任務分配**:

**Developer 1**: 技術債務清理
- Day 2: 移除死代碼和舊註解
- Day 3: 協助 Developer 2

**Developer 2**: Types 層補充
- Day 3: 補充 10 個枚舉定義
- Day 4-5: 協助 Repository 開發

**Developer 3**: 文檔改善
- Day 3 上午: 更新 README 和修正連結
- Day 3 下午 - Day 5: Repository 開發

**Developer 4-5**: Repository 搜索方法
- Day 4-5: TaskRepository, IssueRepository, DocumentRepository

**Tester 1-2**: 測試準備
- Day 2-3: 建立測試框架和 Mock 工廠
- Day 4-5: Repository 單元測試

#### 5. Git 工作流程實踐 (17:00 - 18:00)
**活動**: 全員練習

**實作步驟**:
```bash
# 1. 更新主分支
git checkout main
git pull origin main

# 2. 建立 feature branch
git checkout -b feature/week1-quick-wins

# 3. 做一個小改動 (例如：更新 README)
echo "## Week 1 Progress" >> README.md

# 4. Commit
git add README.md
git commit -m "docs: add week 1 progress section"

# 5. Push
git push origin feature/week1-quick-wins

# 6. 在 GitHub 建立 Pull Request
# 7. 請求 Code Review
```

**Day 1 結束檢查**:
- [ ] 所有人環境準備完成
- [ ] 所有人熟悉專案結構
- [ ] 所有人知道自己 Day 2 的任務
- [ ] 所有人會使用 Git 工作流程

---

## Day 2: 技術債務清理 (Tuesday)

### Developer 1 任務

#### 上午: 死代碼移除 (9:00 - 12:00)

**目標**: 移除所有註解掉的舊代碼

**步驟**:
```bash
# 1. 建立 feature branch
git checkout -b feature/cleanup-dead-code

# 2. 搜尋註解掉的代碼
# 使用 VS Code 全專案搜尋:
# 搜尋模式: /\*[\s\S]*?\*/|//.*
# 手動檢查每個結果，移除確認不需要的註解代碼

# 3. 重點檢查目錄
# - src/app/routes/
# - src/app/shared/services/
# - src/app/core/facades/

# 4. 每移除 10 處就 commit 一次
git add .
git commit -m "chore: remove dead code in routes module"
```

**注意事項**:
- ⚠️ 保留有用的註解 (JSDoc, 解釋性註解)
- ⚠️ 不確定的代碼先標記，與架構師確認
- ⚠️ 每個 commit 保持小而精確

**預期成果**:
- [ ] 移除 20+ 處死代碼
- [ ] 3-5 個小 commits
- [ ] 無功能影響

#### 下午: 命名規範統一 (13:30 - 18:00)

**目標**: 統一變數和函數命名

**檢查項目**:
1. 變數名語義化
   ```typescript
   // ❌ Bad
   const st = this.selectedTask();
   const d = new Date();
   
   // ✅ Good
   const selectedTask = this.selectedTask();
   const currentDate = new Date();
   ```

2. 函數名動詞開頭
   ```typescript
   // ❌ Bad
   task() { ... }
   userInfo() { ... }
   
   // ✅ Good
   loadTask() { ... }
   getUserInfo() { ... }
   ```

3. 布林值使用 is/has/can 前綴
   ```typescript
   // ❌ Bad
   const loading = signal(false);
   const admin = signal(false);
   
   // ✅ Good
   const isLoading = signal(false);
   const isAdmin = signal(false);
   ```

**執行**:
```bash
# 使用 VS Code 重構功能批量重命名
# F2 或 右鍵 → Rename Symbol

# 每個檔案完成後測試
npm run lint
npm test

# Commit
git add .
git commit -m "refactor: standardize variable and function naming"
```

**預期成果**:
- [ ] 統一 30+ 個命名
- [ ] 2-3 個 commits
- [ ] ESLint 0 errors

#### 晚上: 提交 PR (17:30 - 18:00)
```bash
git push origin feature/cleanup-dead-code

# 在 GitHub 建立 PR
# Title: chore: Clean up dead code and standardize naming
# Description: 參考 PR template
```

### Tester 1-2 任務: 測試框架準備

#### 全天: Mock 工廠建立 (9:00 - 18:00)

**目標**: 建立可重用的 Mock 工廠

**檔案**: `src/testing/mock-factories.ts`

```typescript
// src/testing/mock-factories.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { signal } from '@angular/core';

/**
 * Mock Supabase Client Factory
 */
export function createMockSupabaseClient(): Partial<SupabaseClient> {
  return {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  };
}

/**
 * Mock Task Factory
 */
export function createMockTask(overrides?: Partial<Task>): Task {
  return {
    id: 'test-id',
    title: 'Test Task',
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Mock Issue Factory
 */
export function createMockIssue(overrides?: Partial<Issue>): Issue {
  return {
    id: 'test-id',
    title: 'Test Issue',
    status: 'open',
    priority: 'medium',
    ...overrides,
  };
}

// ... 更多 Mock 工廠
```

**預期成果**:
- [ ] 10+ 個 Mock 工廠函數
- [ ] 單元測試驗證 Mock 工廠正確性
- [ ] 提交 PR

---

## Day 3: Types 層補充 + 文檔改善 (Wednesday)

### Developer 2 任務: Types 層

#### 上午: 枚舉定義補充 (9:00 - 12:00)

**目標**: 補充 10 個缺失的枚舉定義

**步驟**:
```bash
git checkout -b feature/types-layer-enums

# 1. 檢查 types-layer-enhancement-checklist.md
# 2. 根據清單補充枚舉

# 檔案: src/app/core/infra/types/quality/quality.types.ts
# 新增: InspectionStatus, InspectionType

# 檔案: src/app/core/infra/types/document/document.types.ts
# 新增: DocumentUploadSource

# 檔案: src/app/core/infra/types/bot/bot.types.ts
# 新增: BotType

# ... 其他枚舉
```

**範例**:
```typescript
// src/app/core/infra/types/quality/quality.types.ts

/**
 * 檢查狀態枚舉
 */
export enum InspectionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

/**
 * 檢查類型枚舉
 */
export enum InspectionType {
  INITIAL = 'initial',
  ROUTINE = 'routine',
  SPECIAL = 'special'
}
```

**預期成果**:
- [ ] 補充 10 個枚舉
- [ ] 所有枚舉有 JSDoc 註解
- [ ] ESLint 通過

#### 下午: 重複定義統一 (13:30 - 18:00)

**目標**: 移除 3 處重複的枚舉定義

**檢查項目**:
1. IssueStatus (Service 層 vs Types 層)
2. TaskStatus (Service 層 vs Types 層)
3. DocumentStatus (Service 層 vs Types 層)

**步驟**:
```typescript
// ❌ 錯誤: 在 Service 層重複定義
// src/app/shared/services/task/task.service.ts
enum TaskStatus {
  PENDING = 'pending',
  // ...
}

// ✅ 正確: 從 Types 層導入
// src/app/shared/services/task/task.service.ts
import { TaskStatus } from '@core/infra/types';

// 更新所有使用該枚舉的地方
```

**預期成果**:
- [ ] 移除 3 處重複定義
- [ ] 更新所有引用
- [ ] 測試通過
- [ ] 提交 PR

### Developer 3 任務: 文檔改善

#### 上午: README 更新 (9:00 - 12:00)

**檔案**: `README.md`

**更新內容**:
1. 更新專案狀態
   ```markdown
   ## 🚀 專案狀態
   
   - ✅ Phase 1: 分析與規劃 (100%)
   - 🔄 Phase 2-7: 實施中 (10%)
   - 📊 測試覆蓋率: 16% → 目標 80%
   ```

2. 更新快速開始指南
   - 確保所有命令都是最新的
   - 補充環境變數說明
   - 更新依賴版本

3. 修正錯誤連結
   - 檢查所有 `[文字](連結)` 格式
   - 確保連結可以正常開啟

**預期成果**:
- [ ] README 更新完成
- [ ] 所有連結有效
- [ ] 提交 PR

#### 下午: 加入 Repository 開發 (13:30 - 18:00)

協助 Developer 4-5 進行 Repository 開發

---

## Day 4-5: Repository 搜索方法 + 單元測試 (Thu-Fri)

### Developer 3-5 任務: Repository 開發

#### 目標: 實現 3 個 Repository 的搜索方法

**分工**:
- Developer 3: TaskRepository
- Developer 4: IssueRepository
- Developer 5: DocumentRepository

#### TaskRepository.search() 實現

**檔案**: `src/app/core/infra/repositories/task/task.repository.ts`

**實作**:
```typescript
/**
 * 搜尋任務
 * @param query 搜尋關鍵字
 * @param options 搜尋選項
 * @returns 搜尋結果
 */
async search(
  query: string,
  options?: {
    status?: TaskStatus[];
    assigneeId?: string;
    blueprintId?: string;
    limit?: number;
    offset?: number;
  }
): Promise<Task[]> {
  try {
    let queryBuilder = this.supabase
      .from('tasks')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    // 應用篩選條件
    if (options?.status?.length) {
      queryBuilder = queryBuilder.in('status', options.status);
    }

    if (options?.assigneeId) {
      queryBuilder = queryBuilder.eq('assignee_id', options.assigneeId);
    }

    if (options?.blueprintId) {
      queryBuilder = queryBuilder.eq('blueprint_id', options.blueprintId);
    }

    // 應用分頁
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, error } = await queryBuilder;

    if (error) throw error;

    // 轉換 snake_case 為 camelCase
    return (data ?? []).map(this.toCamelCase);
  } catch (error) {
    console.error('[TaskRepository] Search error:', error);
    throw error;
  }
}
```

**預期成果**:
- [ ] 3 個 Repository 實現搜索方法
- [ ] 所有方法有完整 JSDoc
- [ ] 支援分頁和篩選
- [ ] ESLint 通過

### Tester 1-2 任務: Repository 單元測試

#### 目標: 為新增的搜索方法編寫單元測試

**檔案**: `src/app/core/infra/repositories/task/task.repository.spec.ts`

**測試案例**:
```typescript
describe('TaskRepository', () => {
  let repository: TaskRepository;
  let mockSupabase: Partial<SupabaseClient>;

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    repository = new TaskRepository(mockSupabase as SupabaseClient);
  });

  describe('search()', () => {
    it('should search tasks by title', async () => {
      // Arrange
      const mockTasks = [createMockTask({ title: 'Test Task' })];
      mockSupabase.single = jest.fn().mockResolvedValue({ 
        data: mockTasks, 
        error: null 
      });

      // Act
      const result = await repository.search('Test');

      // Assert
      expect(result).toEqual(mockTasks);
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
    });

    it('should filter by status', async () => {
      // Arrange
      const mockTasks = [createMockTask({ status: 'pending' })];
      mockSupabase.single = jest.fn().mockResolvedValue({ 
        data: mockTasks, 
        error: null 
      });

      // Act
      const result = await repository.search('Test', { 
        status: [TaskStatus.PENDING] 
      });

      // Assert
      expect(result).toEqual(mockTasks);
      expect(mockSupabase.in).toHaveBeenCalledWith('status', ['pending']);
    });

    it('should handle search errors', async () => {
      // Arrange
      const mockError = new Error('Search failed');
      mockSupabase.single = jest.fn().mockResolvedValue({ 
        data: null, 
        error: mockError 
      });

      // Act & Assert
      await expect(repository.search('Test')).rejects.toThrow('Search failed');
    });

    // ... 更多測試案例
  });
});
```

**預期成果**:
- [ ] 每個方法 5+ 個測試案例
- [ ] 覆蓋率 >80%
- [ ] 所有測試通過

---

## 第一週結束檢查

### 交付物檢查清單

#### 代碼交付
- [ ] 3 個 PR 已合併
  - [ ] PR 1: 技術債務清理
  - [ ] PR 2: Types 層補充
  - [ ] PR 3: Repository 搜索方法

#### 質量檢查
- [ ] ESLint 0 errors
- [ ] 所有測試通過
- [ ] 測試覆蓋率提升 (16% → 25%)
- [ ] Code Review 全部通過

#### 進度檢查
- [ ] 技術債務清理 20+
- [ ] Types 層補充 10 個枚舉
- [ ] 3 個 Repository 增強
- [ ] Repository 測試覆蓋率 >80%
- [ ] 整體進度 5% → 10%

### 週五下午: 週回顧會議 (16:00 - 17:00)

**議程**:
1. 回顧本週完成的工作 (20 分鐘)
2. 分享學習與心得 (20 分鐘)
3. 識別問題與改進點 (10 分鐘)
4. 預告下週計畫 (10 分鐘)

**輸出**:
- [ ] 週報告
- [ ] 改進行動項
- [ ] 下週任務分配

---

## 下週預告

### Week 2 重點: Repositories & Models 層完善

**主要任務**:
1. 完成剩餘 7 個 Repository 搜索方法
2. Models 層枚舉重新導出
3. Repository 單元測試達標

**預期成果**:
- 整體進度 10% → 20%
- Repository 層完整度 100%
- 測試覆蓋率 25% → 35%

---

**最後更新**: 2025-11-22  
**負責人**: 架構師  
**狀態**: ✅ Ready to Execute
