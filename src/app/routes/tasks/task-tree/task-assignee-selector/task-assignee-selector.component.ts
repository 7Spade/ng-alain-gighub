import { Component, OnInit, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

import { Assignee, AssigneeType, AssignmentChangeEvent, getAssigneeIcon, getAssigneeTypeLabel } from '../task-assignment.types';

/**
 * Task Assignee Selector Component
 *
 * Dropdown component for assigning tasks to users, teams, organizations, or subcontractors
 * - Multi-type assignee selection with grouping
 * - Search functionality
 * - Avatar/icon display
 * - Clear assignment option
 *
 * Implements Phase 3 (Task 3.2.2) from EXECUTION-PLAN-TaskTreeUI-Phases-2-8.md
 *
 * @example
 * ```html
 * <app-task-assignee-selector
 *   [taskId]="task.id"
 *   [currentAssigneeId]="task.assigned_to"
 *   [blueprintId]="blueprintId"
 *   (assigneeChanged)="onAssigneeChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-task-assignee-selector',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-select
      [ngModel]="currentAssigneeId()"
      (ngModelChange)="onAssigneeChange($event)"
      nzShowSearch
      nzAllowClear
      [nzPlaceHolder]="placeholder()"
      [nzLoading]="loading()"
      [nzDisabled]="disabled()"
      class="assignee-selector"
      style="min-width: 180px;"
    >
      @if (users().length > 0) {
        <nz-option-group [nzLabel]="getAssigneeTypeLabel('user')">
          @for (user of users(); track user.id) {
            <nz-option [nzValue]="user.id" [nzLabel]="user.name">
              <div class="assignee-option">
                @if (user.avatar) {
                  <nz-avatar [nzSize]="24" [nzSrc]="user.avatar"></nz-avatar>
                } @else {
                  <nz-avatar [nzSize]="24" [nzIcon]="'user'"></nz-avatar>
                }
                <span class="assignee-name">{{ user.name }}</span>
                @if (user.email) {
                  <span class="assignee-email">{{ user.email }}</span>
                }
              </div>
            </nz-option>
          }
        </nz-option-group>
      }

      @if (teams().length > 0) {
        <nz-option-group [nzLabel]="getAssigneeTypeLabel('team')">
          @for (team of teams(); track team.id) {
            <nz-option [nzValue]="team.id" [nzLabel]="team.name">
              <div class="assignee-option">
                <span nz-icon [nzType]="getAssigneeIcon('team')" class="assignee-icon"></span>
                <span class="assignee-name">{{ team.name }}</span>
                @if (team.description) {
                  <span class="assignee-email">{{ team.description }}</span>
                }
              </div>
            </nz-option>
          }
        </nz-option-group>
      }

      @if (organizations().length > 0) {
        <nz-option-group [nzLabel]="getAssigneeTypeLabel('organization')">
          @for (org of organizations(); track org.id) {
            <nz-option [nzValue]="org.id" [nzLabel]="org.name">
              <div class="assignee-option">
                <span nz-icon [nzType]="getAssigneeIcon('organization')" class="assignee-icon"></span>
                <span class="assignee-name">{{ org.name }}</span>
                @if (org.description) {
                  <span class="assignee-email">{{ org.description }}</span>
                }
              </div>
            </nz-option>
          }
        </nz-option-group>
      }

      @if (subcontractors().length > 0) {
        <nz-option-group [nzLabel]="getAssigneeTypeLabel('subcontractor')">
          @for (sub of subcontractors(); track sub.id) {
            <nz-option [nzValue]="sub.id" [nzLabel]="sub.name">
              <div class="assignee-option">
                <span nz-icon [nzType]="getAssigneeIcon('subcontractor')" class="assignee-icon"></span>
                <span class="assignee-name">{{ sub.name }}</span>
                @if (sub.description) {
                  <span class="assignee-email">{{ sub.description }}</span>
                }
              </div>
            </nz-option>
          }
        </nz-option-group>
      }

      @if (hasNoAssignees()) {
        <nz-option [nzValue]="null" [nzLabel]="'無可用的指派對象'" [nzDisabled]="true"> </nz-option>
      }
    </nz-select>
  `,
  styles: [
    `
      .assignee-selector {
        :host ::ng-deep {
          .ant-select-selection-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        }
      }

      .assignee-option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;

        .assignee-icon {
          font-size: 18px;
          color: rgba(0, 0, 0, 0.65);
        }

        .assignee-name {
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
          flex-shrink: 0;
        }

        .assignee-email {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);
          margin-left: auto;
          flex-shrink: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    `
  ]
})
export class TaskAssigneeSelectorComponent implements OnInit {
  // Inputs
  readonly taskId = input.required<string>();
  readonly currentAssigneeId = input<string | null>(null);
  readonly blueprintId = input<string | null>(null);
  readonly disabled = input<boolean>(false);

  // Outputs
  readonly assigneeChanged = output<AssignmentChangeEvent>();

  // State
  readonly loading = signal<boolean>(false);
  readonly users = signal<Assignee[]>([]);
  readonly teams = signal<Assignee[]>([]);
  readonly organizations = signal<Assignee[]>([]);
  readonly subcontractors = signal<Assignee[]>([]);

  // Computed
  readonly hasNoAssignees = computed(() => {
    return (
      this.users().length === 0 && this.teams().length === 0 && this.organizations().length === 0 && this.subcontractors().length === 0
    );
  });

  readonly placeholder = computed(() => {
    return this.loading() ? '載入中...' : '選擇指派對象';
  });

  // Helper function access
  getAssigneeIcon = getAssigneeIcon;
  getAssigneeTypeLabel = getAssigneeTypeLabel;

  async ngOnInit(): Promise<void> {
    await this.loadAssignees();
  }

  /**
   * Load assignees from backend
   * TODO: Replace with actual service calls
   */
  private async loadAssignees(): Promise<void> {
    this.loading.set(true);

    try {
      // Mock data for now - replace with actual service calls
      // const blueprintId = this.blueprintId();

      // TODO: Load from UserService, TeamService, etc.
      // For now, use mock data
      await this.loadMockData();
    } catch (error) {
      console.error('[TaskAssigneeSelector] Failed to load assignees:', error);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Mock data loader - replace with actual service integration
   *
   * @private
   */
  private async loadMockData(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock users
    this.users.set([
      {
        id: 'user-1',
        name: '張三',
        type: 'user',
        email: 'zhang@example.com',
        avatar: undefined
      },
      {
        id: 'user-2',
        name: '李四',
        type: 'user',
        email: 'li@example.com',
        avatar: undefined
      }
    ]);

    // Mock teams
    this.teams.set([
      {
        id: 'team-1',
        name: '開發團隊',
        type: 'team',
        description: '負責系統開發'
      },
      {
        id: 'team-2',
        name: '測試團隊',
        type: 'team',
        description: '負責品質保證'
      }
    ]);

    // Mock organizations
    this.organizations.set([
      {
        id: 'org-1',
        name: 'ABC 建設公司',
        type: 'organization',
        description: '合作廠商'
      }
    ]);

    // Mock subcontractors
    this.subcontractors.set([
      {
        id: 'sub-1',
        name: '王五',
        type: 'subcontractor',
        description: '電工專業'
      }
    ]);
  }

  /**
   * Handle assignee change selection
   */
  onAssigneeChange(assigneeId: string | null): void {
    if (this.disabled()) {
      return;
    }

    // Don't emit if assignee hasn't changed
    if (assigneeId === this.currentAssigneeId()) {
      return;
    }

    // Find assignee type
    let assigneeType: AssigneeType | undefined;

    if (assigneeId) {
      if (this.users().find(u => u.id === assigneeId)) {
        assigneeType = 'user';
      } else if (this.teams().find(t => t.id === assigneeId)) {
        assigneeType = 'team';
      } else if (this.organizations().find(o => o.id === assigneeId)) {
        assigneeType = 'organization';
      } else if (this.subcontractors().find(s => s.id === assigneeId)) {
        assigneeType = 'subcontractor';
      }
    }

    this.assigneeChanged.emit({
      taskId: this.taskId(),
      assigneeId,
      assigneeType
    });
  }
}
