import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface PullRequest {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: 'open' | 'merged' | 'closed';
  readonly source_branch: string;
  readonly target_branch: string;
  readonly author: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly reviewers?: string[];
}

interface Activity {
  readonly id: string;
  readonly type: 'commit' | 'comment' | 'review' | 'status_change';
  readonly title: string;
  readonly description: string;
  readonly author: string;
  readonly timestamp: string;
  readonly color: string;
}

@Component({
  selector: 'app-pull-request-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './pull-request-detail.html',
  styleUrl: './pull-request-detail.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PullRequestDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(NzMessageService);

  // Signals for state management
  loading = signal<boolean>(true);
  pullRequest = signal<PullRequest | null>(null);
  activities = signal<Activity[]>([]);
  error = signal<string | null>(null);

  // Computed properties
  statusColor = computed(() => {
    const pr = this.pullRequest();
    if (!pr) return 'default';
    switch (pr.status) {
      case 'open':
        return 'processing';
      case 'merged':
        return 'success';
      case 'closed':
        return 'error';
      default:
        return 'default';
    }
  });

  statusText = computed(() => {
    const pr = this.pullRequest();
    if (!pr) return '';
    switch (pr.status) {
      case 'open':
        return '進行中';
      case 'merged':
        return '已合併';
      case 'closed':
        return '已關閉';
      default:
        return pr.status;
    }
  });

  ngOnInit(): void {
    const prId = this.route.snapshot.paramMap.get('id');
    if (prId) {
      this.loadPullRequest(prId);
    } else {
      // Load with mock data for demonstration
      this.loadMockData();
    }
  }

  private loadMockData(): void {
    // Simulate API call delay
    setTimeout(() => {
      this.pullRequest.set({
        id: 'pr-001',
        title: '新增任務指派功能',
        description: '實作任務指派功能，支援多人協作與權限控制',
        status: 'open',
        source_branch: 'feature/task-assignment',
        target_branch: 'main',
        author: 'Developer A',
        created_at: '2025-11-15 10:30:00',
        updated_at: '2025-11-16 14:20:00',
        reviewers: ['Reviewer B', 'Reviewer C']
      });

      this.activities.set([
        {
          id: 'act-1',
          type: 'commit',
          title: '建立 Pull Request',
          description: '由 Developer A 從 feature/task-assignment 分支建立',
          author: 'Developer A',
          timestamp: '2025-11-15 10:30:00',
          color: 'blue'
        },
        {
          id: 'act-2',
          type: 'review',
          title: '請求審查',
          description: '指派給 Reviewer B, Reviewer C 進行審查',
          author: 'System',
          timestamp: '2025-11-15 10:32:00',
          color: 'purple'
        },
        {
          id: 'act-3',
          type: 'commit',
          title: '新增 3 個提交',
          description: '更新任務指派邏輯與測試',
          author: 'Developer A',
          timestamp: '2025-11-16 09:15:00',
          color: 'green'
        },
        {
          id: 'act-4',
          type: 'comment',
          title: 'Reviewer B 評論',
          description: '建議優化權限檢查邏輯',
          author: 'Reviewer B',
          timestamp: '2025-11-16 11:45:00',
          color: 'orange'
        },
        {
          id: 'act-5',
          type: 'commit',
          title: '修正審查意見',
          description: '優化權限檢查與錯誤處理',
          author: 'Developer A',
          timestamp: '2025-11-16 14:20:00',
          color: 'green'
        }
      ]);

      this.loading.set(false);
    }, 800);
  }

  private async loadPullRequest(id: string): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);

      // TODO: Replace with actual API call
      // const data = await this.pullRequestService.getById(id);
      // this.pullRequest.set(data);

      // For now, load mock data
      this.loadMockData();
    } catch (err) {
      this.error.set('載入 Pull Request 詳情失敗');
      this.message.error('載入失敗');
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/blueprints/pull-requests']);
  }

  merge(): void {
    this.message.info('合併功能待實作');
  }

  close(): void {
    this.message.info('關閉功能待實作');
  }

  approve(): void {
    this.message.info('核准功能待實作');
  }

  requestChanges(): void {
    this.message.info('請求變更功能待實作');
  }
}
