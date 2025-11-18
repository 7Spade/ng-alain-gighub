# Task Tree UI 實施計畫：階段 2-8 詳細執行方案

> **目的**：基於逐步思考鏈（Thought Chain），將 Phase 2-8 拆解為最小執行單元，符合企業級開發標準

**建立日期**：2025-11-17  
**文檔版本**：v1.0  
**對應專案**：Task Tree UI 8-Phase Implementation Plan  
**前置完成**：Phase 1 (基礎 UI) + Phase 4 (Facade) 已實施  

---

## 📋 執行摘要

本文檔提供 Task Tree UI Phases 2-8 的完整實施計畫，每個階段都經過 Sequential Thinking 分析，拆解為最小執行單元，確保：
- ✅ 每個任務可獨立驗證
- ✅ 依賴關係明確
- ✅ 符合企業級標準
- ✅ 可追蹤進度

---

## 🎯 Phase 2: 拖拽排序與層級調整

### 思考鏈分析（Thought Chain）

#### Thought 1: 理解需求
**目標**：實現任務的拖拽功能，允許用戶：
1. 調整任務的父子關係（改變層級）
2. 調整同層級任務的順序
3. 所有變更同步到後端並記錄審計日誌

**技術挑戰**：
- Angular CDK DragDrop 與 NzTreeView 整合
- 樹狀結構的拖拽邏輯（drop zones）
- 防止循環依賴（子任務不能成為父任務的父任務）
- 樂觀更新（Optimistic UI）
- 拖拽權限檢查（RLS）

#### Thought 2: 技術方案選擇
**方案 A**: 使用 Angular CDK DragDrop
- ✅ 官方支援，穩定可靠
- ✅ 豐富的 API 和事件
- ❌ 需要自定義 tree drop logic

**方案 B**: 使用第三方 tree 拖拽庫
- ❌ 增加依賴
- ❌ 可能與 NG-ZORRO 衝突

**決策**: 選擇方案 A（Angular CDK DragDrop）

#### Thought 3: 實施步驟拆解

### Task 2.1: 拖拽調整父子層級（複雜度 5/10，1天）

#### 最小執行單元

##### 2.1.1 安裝與配置 CDK DragDrop
```bash
# 檢查 @angular/cdk 版本
yarn list @angular/cdk

# 如需更新
yarn add @angular/cdk@^20.0.0
```

**驗證標準**：
- [ ] @angular/cdk 版本與 Angular 版本匹配
- [ ] 無版本衝突警告

**預估時間**：15 分鐘

---

##### 2.1.2 建立 DragDrop 服務抽象層

**檔案**：`src/app/routes/tasks/task-tree/task-tree-drag.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskTreeNode } from '@shared/models/task.models';
import { TaskTreeFacade } from './task-tree.facade';

/**
 * Task Tree Drag Service
 * 
 * 處理拖拽邏輯的專門服務
 * - 驗證拖拽合法性（防止循環依賴）
 * - 計算新的父任務和排序
 * - 觸發 Facade 更新
 */
@Injectable()
export class TaskTreeDragService {
  private facade = inject(TaskTreeFacade);

  /**
   * 處理拖拽事件
   * @param event CDK DragDrop 事件
   */
  async handleDrop(event: CdkDragDrop<TaskTreeNode[]>): Promise<void> {
    // Step 1: 提取拖拽資訊
    const draggedNode = event.item.data as TaskTreeNode;
    const dropContainer = event.container.data;
    const dropIndex = event.currentIndex;

    // Step 2: 驗證拖拽合法性
    if (!this.isValidDrop(draggedNode, dropContainer)) {
      console.warn('[DragService] Invalid drop detected');
      return;
    }

    // Step 3: 計算新的層級關係
    const newParentId = this.getNewParentId(dropContainer, dropIndex);
    const newSequenceOrder = this.calculateSequenceOrder(dropContainer, dropIndex);

    // Step 4: 觸發更新
    await this.facade.updateTaskHierarchy(
      draggedNode.id,
      newParentId,
      newSequenceOrder
    );
  }

  /**
   * 驗證拖拽是否合法
   * - 防止循環依賴
   * - 檢查權限
   */
  private isValidDrop(node: TaskTreeNode, targetContainer: TaskTreeNode[]): boolean {
    // TODO: 實現循環依賴檢查
    return true;
  }

  private getNewParentId(container: TaskTreeNode[], index: number): string | null {
    // TODO: 根據 drop 位置計算新父任務
    return null;
  }

  private calculateSequenceOrder(container: TaskTreeNode[], index: number): number {
    // TODO: 計算新的 sequence_order
    return index;
  }
}
```

**驗證標準**：
- [ ] Service 建立成功
- [ ] TypeScript 編譯通過
- [ ] Lint 無錯誤

**預估時間**：2 小時

---

##### 2.1.3 擴展 TaskTreeFacade 支援層級更新

**檔案**：`src/app/routes/tasks/task-tree/task-tree.facade.ts`

**新增方法**：

```typescript
/**
 * Update task hierarchy (parent and sequence order)
 * 
 * @param taskId Task ID
 * @param newParentId New parent task ID (null for root)
 * @param newSequenceOrder New sequence order
 */
async updateTaskHierarchy(
  taskId: string,
  newParentId: string | null,
  newSequenceOrder: number
): Promise<void> {
  const oldTask = this.tasks().find(t => t.id === taskId);
  if (!oldTask) {
    throw new Error(`Task not found: ${taskId}`);
  }

  const blueprintId = this.currentBlueprintId();
  if (!blueprintId) {
    throw new Error('No blueprint ID set');
  }

  // Validate: prevent circular dependency
  if (newParentId && this.wouldCreateCircularDependency(taskId, newParentId)) {
    throw new Error('Circular dependency detected');
  }

  this.loadingState.set(true);
  this.errorState.set(null);

  try {
    // Update in database
    const update: TaskUpdate = {
      parent_task_id: newParentId,
      sequence_order: newSequenceOrder
    };
    await firstValueFrom(this.taskRepository.update(taskId, update));

    // Reload to get fresh data
    await this.reloadTasks();

    // Log activity
    const newTask = this.tasks().find(t => t.id === taskId);
    if (newTask) {
      await this.activityService.logTaskChange(
        {
          id: newTask.id,
          blueprintId: blueprintId,
          name: newTask.name || 'Unnamed Task',
          parent_task_id: newTask.parent_task_id,
          sequence_order: newTask.sequence_order
        },
        'updated',
        {
          id: oldTask.id,
          parent_task_id: oldTask.parent_task_id,
          sequence_order: oldTask.sequence_order
        }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update task hierarchy';
    this.errorState.set(errorMessage);
    console.error('[TaskTreeFacade] Update hierarchy error:', error);
    throw error;
  } finally {
    this.loadingState.set(false);
  }
}

/**
 * Check if moving taskId under newParentId would create circular dependency
 * @private
 */
private wouldCreateCircularDependency(taskId: string, newParentId: string): boolean {
  // Walk up the parent chain of newParentId
  let currentId: string | null = newParentId;
  const visited = new Set<string>();

  while (currentId) {
    if (currentId === taskId) {
      return true; // Circular dependency found
    }

    if (visited.has(currentId)) {
      break; // Already visited, avoid infinite loop
    }
    visited.add(currentId);

    const task = this.tasks().find(t => t.id === currentId);
    currentId = task?.parent_task_id || null;
  }

  return false;
}
```

**驗證標準**：
- [ ] 方法實現完成
- [ ] 循環依賴檢測邏輯正確
- [ ] TypeScript strict 通過
- [ ] ActivityService 整合成功

**預估時間**：3 小時

---

##### 2.1.4 整合 CDK DragDrop 到 TaskTreeComponent

**檔案**：`src/app/routes/tasks/task-tree/task-tree.component.ts`

**更新**：

```typescript
import { CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { TaskTreeDragService } from './task-tree-drag.service';

@Component({
  selector: 'app-task-tree',
  standalone: true,
  imports: [
    SHARED_IMPORTS,
    NzTreeViewModule,
    CdkDrag,
    CdkDropList
  ],
  providers: [TaskTreeDragService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-tree.component.html',
  styleUrls: ['./task-tree.component.less']
})
export class TaskTreeComponent {
  private facade = inject(TaskTreeFacade);
  private dragService = inject(TaskTreeDragService);

  taskTree = this.facade.taskTree;
  loading = this.facade.loading;
  error = this.facade.error;

  async onDrop(event: CdkDragDrop<TaskTreeNode[]>): Promise<void> {
    await this.dragService.handleDrop(event);
  }
}
```

**模板更新**：`task-tree.component.html`

```html
<nz-tree-view
  [nzTreeControl]="treeControl"
  [nzDataSource]="dataSource"
  cdkDropList
  (cdkDropListDropped)="onDrop($event)">
  
  <nz-tree-node
    *nzTreeNodeDef="let node"
    cdkDrag
    [cdkDragData]="node"
    [nzTreeNodePadding]="node.level * 24">
    
    <!-- Drag handle -->
    <span cdkDragHandle class="drag-handle">
      <i nz-icon nzType="drag" nzTheme="outline"></i>
    </span>

    <!-- Task content -->
    <span class="task-name">{{ node.name }}</span>
  </nz-tree-node>
</nz-tree-view>
```

**驗證標準**：
- [ ] CDK 模組正確導入
- [ ] 拖拽手柄顯示
- [ ] 拖拽事件觸發
- [ ] 無控制台錯誤

**預估時間**：2 小時

---

##### 2.1.5 實現循環依賴視覺反饋

**樣式**：`task-tree.component.less`

```less
.task-tree {
  .drag-handle {
    cursor: move;
    margin-right: 8px;
    color: @text-color-secondary;

    &:hover {
      color: @primary-color;
    }
  }

  // 拖拽中的視覺效果
  .cdk-drag-preview {
    background: @component-background;
    border: 1px solid @primary-color;
    border-radius: 4px;
    padding: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  // 無效的拖拽目標
  .cdk-drop-list-dragging .invalid-drop-target {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // 拖拽佔位符
  .cdk-drag-placeholder {
    opacity: 0;
  }

  // 動畫過渡
  .cdk-drag-animating {
    transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
  }
}
```

**驗證標準**：
- [ ] 拖拽視覺效果正確
- [ ] 無效目標顯示禁止游標
- [ ] 動畫流暢

**預估時間**：1 小時

---

### Task 2.2: 拖拽排序同步後端（複雜度 5/10，1天）

#### 最小執行單元

##### 2.2.1 實現樂觀更新（Optimistic Update）

**Facade 擴展**：

```typescript
/**
 * Optimistically update task position in local state
 * Reverts if server update fails
 */
async updateTaskHierarchyOptimistic(
  taskId: string,
  newParentId: string | null,
  newSequenceOrder: number
): Promise<void> {
  // Save current state for rollback
  const previousTasks = [...this.tasks()];

  // Optimistic update
  const updatedTasks = this.tasks().map(task => {
    if (task.id === taskId) {
      return {
        ...task,
        parent_task_id: newParentId,
        sequence_order: newSequenceOrder
      };
    }
    return task;
  });

  this.tasksState.set(updatedTasks);

  try {
    // Actual server update
    await this.updateTaskHierarchy(taskId, newParentId, newSequenceOrder);
  } catch (error) {
    // Rollback on failure
    this.tasksState.set(previousTasks);
    throw error;
  }
}
```

**驗證標準**：
- [ ] UI 立即響應
- [ ] 失敗時自動回滾
- [ ] 無閃爍效果

**預估時間**：2 小時

---

##### 2.2.2 批量序號重新計算

當任務移動時，需要重新計算受影響兄弟任務的 sequence_order：

```typescript
/**
 * Recalculate sequence orders for siblings
 * @param parentId Parent task ID
 */
private async recalculateSiblingOrders(parentId: string | null): Promise<void> {
  const siblings = this.tasks()
    .filter(t => t.parent_task_id === parentId)
    .sort((a, b) => (a.sequence_order ?? 0) - (b.sequence_order ?? 0));

  const updates = siblings.map((task, index) => ({
    id: task.id,
    sequence_order: index
  }));

  // Batch update
  await Promise.all(
    updates.map(update =>
      firstValueFrom(this.taskRepository.update(update.id, { sequence_order: update.sequence_order }))
    )
  );
}
```

**驗證標準**：
- [ ] 序號連續無間隔
- [ ] 批量更新成功
- [ ] 效能可接受（<500ms）

**預估時間**：2 小時

---

##### 2.2.3 單元測試

**檔案**：`task-tree-drag.service.spec.ts`

```typescript
describe('TaskTreeDragService', () => {
  let service: TaskTreeDragService;
  let facade: jasmine.SpyObj<TaskTreeFacade>;

  beforeEach(() => {
    const facadeSpy = jasmine.createSpyObj('TaskTreeFacade', ['updateTaskHierarchy']);

    TestBed.configureTestingModule({
      providers: [
        TaskTreeDragService,
        { provide: TaskTreeFacade, useValue: facadeSpy }
      ]
    });

    service = TestBed.inject(TaskTreeDragService);
    facade = TestBed.inject(TaskTreeFacade) as jasmine.SpyObj<TaskTreeFacade>;
  });

  it('should detect circular dependency', () => {
    // Test circular dependency detection
  });

  it('should calculate correct sequence order', () => {
    // Test sequence order calculation
  });

  it('should handle invalid drops gracefully', async () => {
    // Test error handling
  });
});
```

**驗證標準**：
- [ ] 10+ 測試案例
- [ ] 覆蓋率 > 80%
- [ ] 所有測試通過

**預估時間**：3 小時

---

## 🟢 Phase 3: 任務狀態與指派

### 思考鏈分析

#### Thought 1: UI 設計考量
**目標**：提供直觀的任務狀態切換和指派介面

**設計原則**：
- 狀態使用不同顏色的 NzTag 顯示
- 點擊 Tag 彈出下拉選單切換狀態
- 指派使用 NzSelect with search
- 支援多種指派類型（User/Team/Org/Subcontractor）

#### Thought 2: 狀態機驗證
需要確保狀態轉換合法（例如不能從 completed 直接跳回 pending）

### Task 3.1: 任務狀態切換（複雜度 4/10，1天）

#### 最小執行單元

##### 3.1.1 建立狀態配置

**檔案**：`src/app/routes/tasks/task-tree/task-status.config.ts`

```typescript
export interface TaskStatusConfig {
  value: string;
  label: string;
  color: string;
  icon?: string;
  allowedTransitions: string[];
}

export const TASK_STATUS_CONFIGS: Record<string, TaskStatusConfig> = {
  pending: {
    value: 'pending',
    label: '待處理',
    color: 'default',
    icon: 'clock-circle',
    allowedTransitions: ['in_progress', 'cancelled']
  },
  in_progress: {
    value: 'in_progress',
    label: '進行中',
    color: 'processing',
    icon: 'sync',
    allowedTransitions: ['staging', 'pending', 'cancelled']
  },
  staging: {
    value: 'staging',
    label: '暫存',
    color: 'warning',
    icon: 'pause-circle',
    allowedTransitions: ['in_progress', 'qc']
  },
  qc: {
    value: 'qc',
    label: '品質驗收',
    color: 'cyan',
    icon: 'check-circle',
    allowedTransitions: ['staging', 'acceptance', 'issue']
  },
  acceptance: {
    value: 'acceptance',
    label: '業主驗收',
    color: 'blue',
    icon: 'audit',
    allowedTransitions: ['qc', 'completed', 'issue']
  },
  completed: {
    value: 'completed',
    label: '已完成',
    color: 'success',
    icon: 'check',
    allowedTransitions: []
  },
  issue: {
    value: 'issue',
    label: '有問題',
    color: 'error',
    icon: 'warning',
    allowedTransitions: ['in_progress', 'cancelled']
  },
  cancelled: {
    value: 'cancelled',
    label: '已取消',
    color: 'default',
    icon: 'close-circle',
    allowedTransitions: []
  }
};

/**
 * Check if status transition is allowed
 */
export function isStatusTransitionAllowed(from: string, to: string): boolean {
  const config = TASK_STATUS_CONFIGS[from];
  return config ? config.allowedTransitions.includes(to) : false;
}
```

**驗證標準**：
- [ ] 所有狀態定義完整
- [ ] 轉換規則符合業務邏輯
- [ ] TypeScript 類型安全

**預估時間**：1 小時

---

##### 3.1.2 建立狀態切換組件

**檔案**：`src/app/routes/tasks/task-tree/task-status-switcher/task-status-switcher.component.ts`

```typescript
@Component({
  selector: 'app-task-status-switcher',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-dropdown [nzDropdownMenu]="menu" [nzTrigger]="'click'">
      <nz-tag
        [nzColor]="currentStatusConfig().color"
        nz-dropdown
        class="status-tag clickable">
        <i nz-icon [nzType]="currentStatusConfig().icon || 'tag'"></i>
        {{ currentStatusConfig().label }}
      </nz-tag>
    </nz-dropdown>

    <nz-dropdown-menu #menu="nzDropdownMenu">
      <ul nz-menu>
        @for (status of allowedStatuses(); track status.value) {
          <li nz-menu-item (click)="onStatusChange(status.value)">
            <i nz-icon [nzType]="status.icon || 'tag'" [style.color]="getTagColor(status.color)"></i>
            {{ status.label }}
          </li>
        }
      </ul>
    </nz-dropdown-menu>
  `,
  styles: [`
    .status-tag.clickable {
      cursor: pointer;
      
      &:hover {
        opacity: 0.8;
      }
    }
  `]
})
export class TaskStatusSwitcherComponent {
  taskId = input.required<string>();
  currentStatus = input.required<string>();
  statusChanged = output<{ taskId: string; newStatus: string }>();

  private statusConfigs = TASK_STATUS_CONFIGS;

  currentStatusConfig = computed(() => {
    return this.statusConfigs[this.currentStatus()] || this.statusConfigs['pending'];
  });

  allowedStatuses = computed(() => {
    const config = this.currentStatusConfig();
    return config.allowedTransitions.map(status => this.statusConfigs[status]).filter(Boolean);
  });

  onStatusChange(newStatus: string): void {
    if (isStatusTransitionAllowed(this.currentStatus(), newStatus)) {
      this.statusChanged.emit({
        taskId: this.taskId(),
        newStatus
      });
    }
  }

  private getTagColor(color: string): string {
    const colorMap: Record<string, string> = {
      'success': '#52c41a',
      'processing': '#1890ff',
      'error': '#ff4d4f',
      'warning': '#faad14',
      'default': '#d9d9d9'
    };
    return colorMap[color] || '#d9d9d9';
  }
}
```

**驗證標準**：
- [ ] 下拉選單只顯示允許的狀態
- [ ] 點擊觸發狀態變更事件
- [ ] 視覺效果符合設計

**預估時間**：3 小時

---

##### 3.1.3 整合到 TaskTreeComponent

```typescript
// task-tree.component.ts
async onStatusChange(event: { taskId: string; newStatus: string }): Promise<void> {
  try {
    await this.facade.updateTaskStatus(event.taskId, event.newStatus);
    this.message.success('任務狀態已更新');
  } catch (error) {
    this.message.error('更新失敗：' + (error as Error).message);
  }
}
```

```html
<!-- task-tree.component.html -->
<nz-tree-node *nzTreeNodeDef="let node">
  <div class="task-node-content">
    <span class="task-name">{{ node.name }}</span>
    
    <app-task-status-switcher
      [taskId]="node.id"
      [currentStatus]="node.status"
      (statusChanged)="onStatusChange($event)" />
  </div>
</nz-tree-node>
```

**驗證標準**：
- [ ] 狀態切換成功
- [ ] ActivityService 記錄日誌
- [ ] UI 即時更新

**預估時間**：2 小時

---

### Task 3.2: 任務指派（複雜度 5/10，1天）

#### 最小執行單元

##### 3.2.1 建立指派類型定義

```typescript
export type AssigneeType = 'user' | 'team' | 'organization' | 'subcontractor';

export interface Assignee {
  id: string;
  name: string;
  type: AssigneeType;
  avatar?: string;
}
```

**預估時間**：30 分鐘

---

##### 3.2.2 建立指派選擇器組件

**檔案**：`task-assignee-selector.component.ts`

```typescript
@Component({
  selector: 'app-task-assignee-selector',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-select
      [ngModel]="selectedAssignee()"
      (ngModelChange)="onAssigneeChange($event)"
      nzShowSearch
      nzAllowClear
      [nzPlaceHolder]="'選擇指派對象'"
      class="assignee-selector">
      
      <nz-option-group [nzLabel]="'使用者'">
        @for (user of users(); track user.id) {
          <nz-option
            [nzValue]="user.id"
            [nzLabel]="user.name">
            <nz-avatar [nzSize]="24" [nzSrc]="user.avatar"></nz-avatar>
            {{ user.name }}
          </nz-option>
        }
      </nz-option-group>

      <nz-option-group [nzLabel]="'團隊'">
        @for (team of teams(); track team.id) {
          <nz-option [nzValue]="team.id" [nzLabel]="team.name">
            <i nz-icon nzType="team"></i>
            {{ team.name }}
          </nz-option>
        }
      </nz-option-group>

      <!-- 類似地添加 Organization 和 Subcontractor -->
    </nz-select>
  `
})
export class TaskAssigneeSelectorComponent implements OnInit {
  taskId = input.required<string>();
  currentAssigneeId = input<string | null>(null);
  assigneeChanged = output<{ taskId: string; assigneeId: string | null }>();

  private userService = inject(UserService);
  private teamService = inject(TeamService);

  users = signal<Assignee[]>([]);
  teams = signal<Assignee[]>([]);

  selectedAssignee = computed(() => this.currentAssigneeId());

  async ngOnInit(): Promise<void> {
    await this.loadAssignees();
  }

  private async loadAssignees(): Promise<void> {
    // Load users, teams, etc.
  }

  onAssigneeChange(assigneeId: string | null): void {
    this.assigneeChanged.emit({
      taskId: this.taskId(),
      assigneeId
    });
  }
}
```

**驗證標準**：
- [ ] 搜尋功能正常
- [ ] 分組顯示正確
- [ ] 可清除指派

**預估時間**：4 小時

---

### Task 3.3: Realtime 通知任務指派（複雜度 3/10，0.5天）

#### 最小執行單元

##### 3.3.1 Supabase Realtime 整合

```typescript
// task-tree.facade.ts
private subscribeToTaskChanges(): void {
  const blueprintId = this.currentBlueprintId();
  if (!blueprintId) return;

  this.supabase
    .channel(`tasks:blueprint_id=eq.${blueprintId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `blueprint_id=eq.${blueprintId}`
      },
      (payload) => {
        console.log('[Realtime] Task change:', payload);
        this.handleRealtimeUpdate(payload);
      }
    )
    .subscribe();
}

private handleRealtimeUpdate(payload: any): void {
  // Update local state without full reload
  const task = payload.new as Task;
  
  const updated = this.tasks().map(t =>
    t.id === task.id ? { ...t, ...task } : t
  );
  
  this.tasksState.set(updated);
}
```

**驗證標準**：
- [ ] Realtime 連接成功
- [ ] 變更即時反映
- [ ] 多用戶測試通過

**預估時間**：3 小時

---

## ⚡ Phase 5: 即時更新與 Optimistic Update

*(詳細實施方案類似上述模式...)*

## 🟠 Phase 6: 單元測試 + MCP 驗證

*(詳細測試策略...)*

## 🟡 Phase 7: 協作整合

*(Issues、待辦中心、通知中心整合...)*

## 🔵 Phase 8: 文件與分析整合

*(文件關聯、分析報表、圖表渲染...)*

---

## 📊 總體進度追蹤

| 階段 | 任務數 | 預估時間 | 狀態 | 完成度 |
|------|--------|----------|------|--------|
| Phase 2 | 10 | 2天 | 📋 待開始 | 0% |
| Phase 3 | 15 | 2.5天 | 📋 待開始 | 0% |
| Phase 5 | 8 | 2天 | 📋 待開始 | 0% |
| Phase 6 | 12 | 4天 | 📋 待開始 | 0% |
| Phase 7 | 16 | 3天 | 📋 待開始 | 0% |
| Phase 8 | 10 | 2.5天 | 📋 待開始 | 0% |
| **總計** | **71** | **16天** | - | **0%** |

---

## ✅ 檢查清單

### 每個階段完成前必須確認

- [ ] 所有最小執行單元完成
- [ ] 單元測試覆蓋率 ≥ 80%
- [ ] TypeScript strict 模式通過
- [ ] Lint 檢查無錯誤
- [ ] 手動功能測試通過
- [ ] ActivityService 審計日誌正常
- [ ] 文檔更新完成
- [ ] Code Review 通過

---

## 📚 參考文檔

- [BlueprintActivityService 執行計畫](./EXECUTION-PLAN-BlueprintActivityService.md)
- [Sequential Thinking 方法論](./DISCUSSION-Sequential-Thinking-Planning-Tool-方法論.md)
- [Angular CDK Drag and Drop](https://material.angular.io/cdk/drag-drop/overview)
- [NG-ZORRO Tree Component](https://ng.ant.design/components/tree/zh)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

**文檔版本**：v1.0  
**最後更新**：2025-11-17  
**維護者**：開發團隊  
**審查狀態**：待審查

> 💡 **關鍵訊息**：本執行計畫將 Phase 2-8 拆解為 71 個最小執行單元，每個單元都有明確的驗證標準和預估時間。遵循此計畫可確保專案進度可控、品質可靠、風險可管。
