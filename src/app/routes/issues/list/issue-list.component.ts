import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IssueRepository, Issue } from '@core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent],
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
      <st
        #st
        [data]="issues()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{
          show: true,
          showSize: true,
          front: false
        }"
        [responsive]="true"
        [scroll]="{ x: '1200px' }"
      ></st>
    </nz-card>
  `
})
export class IssueListComponent implements OnInit {
  private router = inject(Router);
  private message = inject(NzMessageService);
  private issueRepo = inject(IssueRepository);

  // Signals for reactive state
  issues = signal<STData[]>([]);
  loading = signal(false);

  // ST Table columns configuration
  columns: STColumn[] = [
    {
      title: '编号',
      index: 'issue_number',
      width: 100,
      fixed: 'left'
    },
    {
      title: '标题',
      index: 'title',
      width: 250,
      format: (item: STData) => item['title'] || '-'
    },
    {
      title: '状态',
      index: 'status',
      width: 120,
      type: 'badge',
      badge: {
        open: { text: '打开', color: 'processing' },
        in_progress: { text: '处理中', color: 'warning' },
        resolved: { text: '已解决', color: 'success' },
        closed: { text: '已关闭', color: 'default' }
      }
    },
    {
      title: '优先级',
      index: 'priority',
      width: 100,
      type: 'badge',
      badge: {
        high: { text: '高', color: 'error' },
        medium: { text: '中', color: 'warning' },
        low: { text: '低', color: 'default' }
      }
    },
    {
      title: '类型',
      index: 'issue_type',
      width: 120
    },
    {
      title: '创建时间',
      index: 'created_at',
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm',
      width: 160
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      buttons: [
        {
          text: '查看',
          type: 'link',
          click: (item: STData) => this.viewIssue(item['id'] as string)
        },
        {
          text: '处理',
          type: 'link',
          click: (item: STData) => this.handleIssue(item['id'] as string)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadIssues();
  }

  /**
   * 加载问题列表
   */
  loadIssues(): void {
    this.loading.set(true);

    this.issueRepo
      .findAll({
        orderBy: 'created_at',
        orderDirection: 'desc',
        pageSize: 100
      })
      .subscribe({
        next: data => {
          this.issues.set(data as STData[]);
          this.loading.set(false);
        },
        error: err => {
          console.error('加载问题列表失败:', err);
          this.message.error('加载问题列表失败');
          this.loading.set(false);
        }
      });
  }

  /**
   * 查看问题详情
   */
  viewIssue(id: string): void {
    this.router.navigate(['/issues', id]);
  }

  /**
   * 处理问题
   */
  handleIssue(id: string): void {
    this.router.navigate(['/issues', id, 'handle']);
  }

  /**
   * 创建新问题
   */
  createIssue(): void {
    this.router.navigate(['/issues/create']);
  }
}
