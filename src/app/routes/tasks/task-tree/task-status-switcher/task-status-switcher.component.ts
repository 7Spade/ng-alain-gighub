import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

import { TASK_STATUS_CONFIGS, getAllowedNextStatuses, getStatusConfig } from '../task-status.config';

/**
 * Task Status Switcher Component
 *
 * Dropdown component for switching task status
 * - Displays current status as a colored tag
 * - Shows only allowed status transitions in dropdown
 * - Emits status change events
 * - Prevents invalid state transitions
 *
 * Implements Phase 3 (Task 3.1.2) from EXECUTION-PLAN-TaskTreeUI-Phases-2-8.md
 *
 * @example
 * ```html
 * <app-task-status-switcher
 *   [taskId]="task.id"
 *   [currentStatus]="task.status"
 *   (statusChanged)="onStatusChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-task-status-switcher',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-tag [nzColor]="currentStatusConfig().color" nz-dropdown [nzDropdownMenu]="menu" [nzTrigger]="'click'" class="status-tag clickable">
      @if (currentStatusConfig().icon) {
        <span nz-icon [nzType]="currentStatusConfig().icon!"></span>
      }
      {{ currentStatusConfig().label }}
    </nz-tag>

    <nz-dropdown-menu #menu="nzDropdownMenu">
      <ul nz-menu>
        @if (allowedStatuses().length === 0) {
          <li nz-menu-item [nzDisabled]="true">
            <span style="color: rgba(0, 0, 0, 0.45);">無可用的狀態變更</span>
          </li>
        }
        @for (status of allowedStatuses(); track status.value) {
          <li nz-menu-item (click)="onStatusChange(status.value)">
            <span nz-icon [nzType]="status.icon || 'tag'" [style.color]="getIconColor(status.color)"></span>
            <span style="margin-left: 8px;">{{ status.label }}</span>
            @if (status.description) {
              <span style="margin-left: 8px; color: rgba(0, 0, 0, 0.45); font-size: 12px;"> ({{ status.description }}) </span>
            }
          </li>
        }
      </ul>
    </nz-dropdown-menu>
  `,
  styles: [
    `
      .status-tag {
        cursor: pointer;
        user-select: none;
        transition: all 0.2s;

        &.clickable:hover {
          opacity: 0.8;
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
        }
      }

      :host ::ng-deep {
        .ant-dropdown-menu-item {
          display: flex;
          align-items: center;
          min-width: 200px;

          &:hover {
            .ant-dropdown-menu-title-content {
              color: #1890ff;
            }
          }
        }
      }
    `
  ]
})
export class TaskStatusSwitcherComponent {
  // Inputs
  readonly taskId = input.required<string>();
  readonly currentStatus = input.required<string>();
  readonly disabled = input<boolean>(false);

  // Outputs
  readonly statusChanged = output<{ taskId: string; newStatus: string }>();

  // Computed signals
  readonly currentStatusConfig = computed(() => {
    return getStatusConfig(this.currentStatus());
  });

  readonly allowedStatuses = computed(() => {
    const current = this.currentStatus();
    return getAllowedNextStatuses(current);
  });

  /**
   * Handle status change selection
   */
  onStatusChange(newStatus: string): void {
    if (this.disabled()) {
      return;
    }

    const currentStatus = this.currentStatus();

    // Don't emit if status hasn't changed
    if (newStatus === currentStatus) {
      return;
    }

    // Double-check transition is allowed (defensive programming)
    const config = TASK_STATUS_CONFIGS[currentStatus];
    if (!config || !config.allowedTransitions.includes(newStatus)) {
      console.warn(`[TaskStatusSwitcher] Invalid transition: ${currentStatus} → ${newStatus}`);
      return;
    }

    this.statusChanged.emit({
      taskId: this.taskId(),
      newStatus
    });
  }

  /**
   * Get icon color from color name
   *
   * @private
   */
  getIconColor(colorName: string): string {
    const colorMap: Record<string, string> = {
      success: '#52c41a',
      processing: '#1890ff',
      error: '#ff4d4f',
      warning: '#faad14',
      cyan: '#13c2c2',
      blue: '#1890ff',
      default: '#d9d9d9'
    };
    return colorMap[colorName] || '#d9d9d9';
  }
}
