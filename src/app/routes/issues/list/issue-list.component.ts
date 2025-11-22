import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IssueFacade } from '@core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'问题列表'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createIssue()">
          <span nz-icon nzType="plus"></span>
          新建问题
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="问题跟踪管理" style="margin-top: 16px;">
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
              <nz-option nzValue="open" nzLabel="待处理"></nz-option>
              <nz-option nzValue="in_progress" nzLabel="处理中"></nz-option>
              <nz-option nzValue="resolved" nzLabel="已解决"></nz-option>
              <nz-option nzValue="closed" nzLabel="已关闭"></nz-option>
              <nz-option nzValue="reopened" nzLabel="已重新开启"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>优先级</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterPriority()"
              (ngModelChange)="filterPriority.set($event)"
              nzPlaceHolder="全部优先级"
              nzAllowClear
              style="width: 120px;"
            >
              <nz-option nzValue="low" nzLabel="低"></nz-option>
              <nz-option nzValue="medium" nzLabel="中"></nz-option>
              <nz-option nzValue="high" nzLabel="高"></nz-option>
              <nz-option nzValue="critical" nzLabel="紧急"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>严重程度</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterSeverity()"
              (ngModelChange)="filterSeverity.set($event)"
              nzPlaceHolder="全部严重程度"
              nzAllowClear
              style="width: 120px;"
            >
              <nz-option nzValue="minor" nzLabel="轻微"></nz-option>
              <nz-option nzValue="moderate" nzLabel="中等"></nz-option>
              <nz-option nzValue="major" nzLabel="严重"></nz-option>
              <nz-option nzValue="critical" nzLabel="紧急"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 问题列表表格 -->
      <st
        #st
        [data]="filteredIssues()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #status let-record>
          @switch (record.status) {
            @case ('open') {
              <nz-tag nzColor="default">待处理</nz-tag>
            }
            @case ('in_progress') {
              <nz-tag nzColor="processing">处理中</nz-tag>
            }
            @case ('resolved') {
              <nz-tag nzColor="success">已解决</nz-tag>
            }
            @case ('closed') {
              <nz-tag nzColor="default">已关闭</nz-tag>
            }
            @case ('reopened') {
              <nz-tag nzColor="orange">已重新开启</nz-tag>
            }
          }
        </ng-template>

        <ng-template #priority let-record>
          @switch (record.priority) {
            @case ('low') {
              <nz-tag nzColor="default">低</nz-tag>
            }
            @case ('medium') {
              <nz-tag nzColor="blue">中</nz-tag>
            }
            @case ('high') {
              <nz-tag nzColor="orange">高</nz-tag>
            }
            @case ('critical') {
              <nz-tag nzColor="red">紧急</nz-tag>
            }
          }
        </ng-template>

        <ng-template #severity let-record>
          @switch (record.severity) {
            @case ('minor') {
              <nz-tag nzColor="default">轻微</nz-tag>
            }
            @case ('moderate') {
              <nz-tag nzColor="blue">中等</nz-tag>
            }
            @case ('major') {
              <nz-tag nzColor="orange">严重</nz-tag>
            }
            @case ('critical') {
              <nz-tag nzColor="red">紧急</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class IssueListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly issueFacade = inject(IssueFacade);

  // Component signals
  readonly filterStatus = signal<string | null>(null);
  readonly filterPriority = signal<string | null>(null);
  readonly filterSeverity = signal<string | null>(null);

  // Facade signals
  readonly loading = this.issueFacade.loading;
  readonly issues = this.issueFacade.issues;

  // Computed filtered issues
  readonly filteredIssues = computed(() => {
    let result = this.issues();

    if (this.filterStatus()) {
      result = result.filter(item => item.status === this.filterStatus());
    }

    if (this.filterPriority()) {
      result = result.filter(item => item.priority === this.filterPriority());
    }

    if (this.filterSeverity()) {
      result = result.filter(item => item.severity === this.filterSeverity());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '标题', index: 'title', width: 300 },
    { title: '状态', index: 'status', width: 120, render: 'status' },
    { title: '优先级', index: 'priority', width: 100, render: 'priority' },
    { title: '严重程度', index: 'severity', width: 100, render: 'severity' },
    { title: '报告人', index: 'reported_by', width: 120 },
    { title: '报告时间', index: 'reported_at', type: 'date', width: 180 },
    { title: '关联蓝图', index: 'blueprint_id', width: 200 },
    { title: '关联任务', index: 'task_id', width: 200 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: any) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: any) => this.edit(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: any) => this.delete(record.id)
        }
      ]
    }
  ];

  async ngOnInit(): Promise<void> {
    await this.loadIssues();
  }

  async loadIssues(): Promise<void> {
    try {
      // Load all issues - this will be refined later to filter by workspace context
      await this.issueFacade.loadIssues();
    } catch (error) {
      this.message.error('加载问题列表失敗');
      console.error('Failed to load issues:', error);
    }
  }

  onTableChange(): void {
    // Handle table change events (pagination, sorting, etc.)
  }

  createIssue(): void {
    this.router.navigate(['/issues/create']);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/issues', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/issues', id, 'edit']);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.issueFacade.deleteIssue(id);
      this.message.success('删除成功');
      // Reload the list
      await this.loadIssues();
    } catch (error) {
      this.message.error('删除失败');
      console.error('Failed to delete issue:', error);
    }
  }
}
