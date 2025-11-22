import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { IssueAssignmentRepository, IssueRepository } from '@core';
import { AccountService } from '@shared';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { firstValueFrom } from 'rxjs';

interface IssueAssignmentItem {
  readonly id: string;
  readonly issueId: string;
  readonly issueTitle: string;
  readonly assigneeId: string;
  readonly assigneeName: string;
  readonly assignedAt: string;
  readonly status: string;
}

@Component({
  selector: 'app-issue-assignments',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'问题分配'"></page-header>

    <nz-card nzTitle="问题分配管理" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>状态</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterStatus()"
              (ngModelChange)="filterStatus.set($event)"
              nzPlaceHolder="全部状态"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="pending" nzLabel="待处理"></nz-option>
              <nz-option nzValue="accepted" nzLabel="已接受"></nz-option>
              <nz-option nzValue="rejected" nzLabel="已拒绝"></nz-option>
              <nz-option nzValue="completed" nzLabel="已完成"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>被分配人</nz-form-label>
          <nz-form-control>
            <input
              nz-input
              [ngModel]="filterAssignee()"
              (ngModelChange)="filterAssignee.set($event)"
              placeholder="搜索被分配人"
              style="width: 200px;"
            />
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 分配列表表格 -->
      <st
        #st
        [data]="filteredAssignments()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #status let-record>
          @switch (record.status) {
            @case ('pending') {
              <nz-tag nzColor="default">待处理</nz-tag>
            }
            @case ('accepted') {
              <nz-tag nzColor="success">已接受</nz-tag>
            }
            @case ('rejected') {
              <nz-tag nzColor="error">已拒绝</nz-tag>
            }
            @case ('completed') {
              <nz-tag nzColor="processing">已完成</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class IssueAssignmentsComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);
  issueAssignmentRepo = inject(IssueAssignmentRepository);
  issueRepo = inject(IssueRepository);
  accountService = inject(AccountService);

  // Component signals
  loading = signal(false);
  filterStatus = signal<string | null>(null);
  filterAssignee = signal<string>('');
  assignments = signal<IssueAssignmentItem[]>([]);

  // Computed filtered assignments
  filteredAssignments = computed(() => {
    let result = this.assignments();

    if (this.filterStatus()) {
      result = result.filter(item => item.status === this.filterStatus());
    }

    if (this.filterAssignee()) {
      const keyword = this.filterAssignee().toLowerCase();
      result = result.filter(item => item.assigneeName.toLowerCase().includes(keyword));
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '问题ID', index: 'issueId', width: 150 },
    { title: '问题标题', index: 'issueTitle', width: 300 },
    { title: '被分配人', index: 'assigneeName', width: 120 },
    { title: '分配时间', index: 'assignedAt', type: 'date', width: 180 },
    { title: '状态', index: 'status', width: 120, render: 'status' },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看问题',
          click: (record: IssueAssignmentItem) => this.viewIssue(record.issueId)
        },
        {
          text: '重新分配',
          click: (record: IssueAssignmentItem) => this.reassign(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadAssignments();
  }

  async loadAssignments(): Promise<void> {
    this.loading.set(true);
    try {
      // Load all issue assignments
      const assignments = await firstValueFrom(this.issueAssignmentRepo.findAll());
      
      // Load related data (issues and accounts) and transform to display format
      const items: IssueAssignmentItem[] = await Promise.all(
        assignments.map(async assignment => {
          // Load issue details
          const issue = await firstValueFrom(
            this.issueRepo.findById(assignment.issue_id)
          ).catch(() => null);
          
          // Load assignee account details
          await this.accountService.loadAccountById(assignment.assignee_id).catch(() => {});
          const assignee = this.accountService.accounts().find(a => a.id === assignment.assignee_id);
          
          return {
            id: assignment.id,
            issueId: assignment.issue_id,
            issueTitle: issue?.title || 'Unknown Issue',
            assigneeId: assignment.assignee_id,
            assigneeName: assignee?.name || assignment.assignee_id,
            assignedAt: assignment.assigned_at || '',
            status: assignment.assignment_note || 'pending'
          };
        })
      );
      
      this.assignments.set(items);
    } catch (error) {
      this.message.error('加載問題分配數據失敗');
      console.error('Failed to load assignments:', error);
    } finally {
      this.loading.set(false);
    }
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  viewIssue(issueId: string): void {
    this.router.navigate(['/issues', issueId]);
  }

  async reassign(assignmentId: string): Promise<void> {
    this.loading.set(true);
    try {
      // Find the current assignment
      const currentAssignment = this.assignments().find(a => a.id === assignmentId);
      if (!currentAssignment) {
        this.message.error('找不到分配記錄');
        return;
      }

      // Load all available users for reassignment
      // In a real implementation, this would open a modal to select a new assignee
      // For now, we'll show a message that the feature needs UI implementation
      this.message.info('請在彈出的對話框中選擇新的被分配人（UI 待實現）');
      
      // TODO: Open modal to select new assignee
      // Example flow:
      // 1. Open NzModalService with assignee selector
      // 2. User selects new assignee
      // 3. Call issueAssignmentRepo.update() or create new assignment
      // 4. Reload assignments list
      
      console.log('Reassignment for:', currentAssignment);
      
    } catch (error) {
      this.message.error('重新分配失敗');
      console.error('Failed to reassign:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
