import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface IssueListItem {
  readonly id: string;
  readonly title: string;
  readonly status: string;
  readonly priority: string;
  readonly severity: string;
  readonly reportedBy: string;
  readonly reportedAt: string;
  readonly blueprintName: string;
  readonly taskName: string;
}

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
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterStatus = signal<string | null>(null);
  filterPriority = signal<string | null>(null);
  filterSeverity = signal<string | null>(null);
  issues = signal<IssueListItem[]>([]);

  // Computed filtered issues
  filteredIssues = computed(() => {
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
    { title: '报告人', index: 'reportedBy', width: 120 },
    { title: '报告时间', index: 'reportedAt', type: 'date', width: 180 },
    { title: '关联蓝图', index: 'blueprintName', width: 200 },
    { title: '关联任务', index: 'taskName', width: 200 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: IssueListItem) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: IssueListItem) => this.edit(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: IssueListItem) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadIssues();
  }

  loadIssues(): void {
    // TODO: 加载问题列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.issues.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
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

  delete(id: string): void {
    // TODO: 实现删除逻辑
    this.message.info('删除功能开发中');
  }
}
