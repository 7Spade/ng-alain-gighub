import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

export interface TodoItem {
  id: string;
  title: string;
  status: 'pending' | 'staging' | 'qc' | 'acceptance' | 'issue';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignee?: string;
}

export type TodoStatusFilter = 'all' | 'pending' | 'staging' | 'qc' | 'acceptance' | 'issue';

/**
 * 待辦小工具元件
 *
 * 用途：顯示個人待辦事項的小工具，用於側邊欄或儀表板
 *
 * @example
 * ```html
 * <app-todo-widget
 *   [todos]="todoList()"
 *   [loading]="isLoading()"
 *   (itemClick)="handleItemClick($event)"
 *   (statusChange)="handleStatusChange($event)" />
 * ```
 */
@Component({
  selector: 'app-todo-widget',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-card [nzTitle]="cardTitle" [nzExtra]="extraTemplate" [nzBodyStyle]="{ padding: '0' }" class="todo-widget">
      <ng-template #cardTitle>
        <span nz-icon nzType="check-square" nzTheme="outline"></span>
        待辦中心
      </ng-template>

      <ng-template #extraTemplate>
        <nz-badge [nzCount]="filteredTodos().length" [nzShowZero]="true" />
      </ng-template>

      <!-- Status filter tabs -->
      <nz-tabset [(nzSelectedIndex)]="selectedTabIndex" (nzSelectedIndexChange)="handleTabChange($event)" nzSize="small">
        <nz-tab nzTitle="全部">
          <ng-template nz-tab>
            <span nz-icon nzType="appstore" nzTheme="outline"></span>
            全部 ({{ getCountByStatus('all') }})
          </ng-template>
        </nz-tab>

        <nz-tab nzTitle="待執行">
          <ng-template nz-tab>
            <span nz-icon nzType="clock-circle" nzTheme="outline"></span>
            待執行 ({{ getCountByStatus('pending') }})
          </ng-template>
        </nz-tab>

        <nz-tab nzTitle="暫存中">
          <ng-template nz-tab>
            <span nz-icon nzType="inbox" nzTheme="outline"></span>
            暫存中 ({{ getCountByStatus('staging') }})
          </ng-template>
        </nz-tab>

        <nz-tab nzTitle="品管中">
          <ng-template nz-tab>
            <span nz-icon nzType="safety" nzTheme="outline"></span>
            品管中 ({{ getCountByStatus('qc') }})
          </ng-template>
        </nz-tab>

        <nz-tab nzTitle="驗收中">
          <ng-template nz-tab>
            <span nz-icon nzType="file-done" nzTheme="outline"></span>
            驗收中 ({{ getCountByStatus('acceptance') }})
          </ng-template>
        </nz-tab>

        <nz-tab nzTitle="問題追蹤">
          <ng-template nz-tab>
            <span nz-icon nzType="warning" nzTheme="outline"></span>
            問題 ({{ getCountByStatus('issue') }})
          </ng-template>
        </nz-tab>
      </nz-tabset>

      <!-- Todo list -->
      <div class="todo-list">
        @if (loading()) {
          <div class="loading-state">
            <nz-spin nzSimple />
          </div>
        } @else if (filteredTodos().length === 0) {
          <nz-empty nzNotFoundContent="暫無待辦事項" [nzNotFoundImage]="'simple'" class="empty-state" />
        } @else {
          @for (todo of filteredTodos(); track todo.id) {
            <div
              class="todo-item"
              [class.priority-high]="todo.priority === 'high'"
              [class.priority-urgent]="todo.priority === 'urgent'"
              (click)="handleItemClick(todo)"
            >
              <div class="todo-content">
                <nz-badge [nzStatus]="getStatusBadge(todo.status)" [nzText]="todo.title" />

                @if (todo.dueDate) {
                  <div class="todo-meta">
                    <span nz-icon nzType="calendar" nzTheme="outline"></span>
                    {{ todo.dueDate | date: 'yyyy-MM-dd' }}
                  </div>
                }
              </div>

              @if (todo.priority) {
                <nz-tag [nzColor]="getPriorityColor(todo.priority)" class="priority-tag">
                  {{ getPriorityLabel(todo.priority) }}
                </nz-tag>
              }
            </div>
          }
        }
      </div>

      @if (!loading() && filteredTodos().length > 0 && showViewAll()) {
        <div class="todo-footer">
          <a (click)="handleViewAll()">查看全部 →</a>
        </div>
      }
    </nz-card>
  `,
  styles: [
    `
      .todo-widget {
        height: 100%;

        :host ::ng-deep .ant-card-body {
          padding: 0;
        }
      }

      .todo-list {
        max-height: 400px;
        overflow-y: auto;
      }

      .loading-state {
        padding: 48px;
        text-align: center;
      }

      .empty-state {
        padding: 48px 24px;
      }

      .todo-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f5f5f5;
        }

        &:last-child {
          border-bottom: none;
        }

        &.priority-high {
          border-left: 3px solid #faad14;
        }

        &.priority-urgent {
          border-left: 3px solid #ff4d4f;
        }
      }

      .todo-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .todo-meta {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .priority-tag {
        margin-left: 8px;
      }

      .todo-footer {
        padding: 12px 16px;
        text-align: center;
        border-top: 1px solid #f0f0f0;

        a {
          color: #1890ff;
          cursor: pointer;

          &:hover {
            color: #40a9ff;
          }
        }
      }
    `
  ]
})
export class TodoWidgetComponent {
  /** 待辦事項列表 */
  todos = input.required<TodoItem[]>();

  /** 載入狀態 */
  loading = input<boolean>(false);

  /** 是否顯示「查看全部」連結 */
  showViewAll = input<boolean>(true);

  /** 點擊待辦事項 */
  itemClick = output<TodoItem>();

  /** 狀態變更 */
  statusChange = output<TodoStatusFilter>();

  /** 查看全部 */
  viewAll = output<void>();

  /** 當前選中的 Tab 索引 */
  selectedTabIndex = signal(0);

  /** 當前篩選狀態 */
  currentFilter = signal<TodoStatusFilter>('all');

  /**
   * 篩選後的待辦事項
   */
  filteredTodos = () => {
    const filter = this.currentFilter();
    const todos = this.todos();

    if (filter === 'all') {
      return todos;
    }

    return todos.filter(todo => todo.status === filter);
  };

  /**
   * 取得指定狀態的待辦數量
   */
  getCountByStatus(status: TodoStatusFilter): number {
    if (status === 'all') {
      return this.todos().length;
    }
    return this.todos().filter(todo => todo.status === status).length;
  }

  /**
   * Tab 切換處理
   */
  handleTabChange(index: number): void {
    const statuses: TodoStatusFilter[] = ['all', 'pending', 'staging', 'qc', 'acceptance', 'issue'];
    const newFilter = statuses[index];
    this.currentFilter.set(newFilter);
    this.statusChange.emit(newFilter);
  }

  /**
   * 點擊待辦事項
   */
  handleItemClick(todo: TodoItem): void {
    this.itemClick.emit(todo);
  }

  /**
   * 查看全部
   */
  handleViewAll(): void {
    this.viewAll.emit();
  }

  /**
   * 取得狀態徽章類型
   */
  getStatusBadge(status: TodoItem['status']): 'success' | 'processing' | 'warning' | 'error' | 'default' {
    const statusMap = {
      pending: 'default',
      staging: 'processing',
      qc: 'warning',
      acceptance: 'processing',
      issue: 'error'
    } as const;

    return statusMap[status] || 'default';
  }

  /**
   * 取得優先級顏色
   */
  getPriorityColor(priority: TodoItem['priority']): string {
    const colorMap = {
      low: 'default',
      medium: 'blue',
      high: 'orange',
      urgent: 'red'
    };

    return colorMap[priority || 'low'];
  }

  /**
   * 取得優先級標籤
   */
  getPriorityLabel(priority: TodoItem['priority']): string {
    const labelMap = {
      low: '低',
      medium: '中',
      high: '高',
      urgent: '緊急'
    };

    return labelMap[priority || 'low'];
  }
}
