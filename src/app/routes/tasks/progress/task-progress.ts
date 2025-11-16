import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface TaskProgressData {
  readonly task_id: string;
  readonly task_name: string;
  readonly blueprint_name: string;
  readonly total_items: number;
  readonly completed_items: number;
  readonly pending_items: number;
  readonly staging_items: number;
  readonly qc_items: number;
  readonly issue_items: number;
  readonly start_date: string;
  readonly target_date: string;
  readonly current_date: string;
}

interface ProgressItem {
  readonly id: string;
  readonly name: string;
  readonly status: 'completed' | 'pending' | 'staging' | 'qc' | 'issue';
  readonly assignee: string;
  readonly updated_at: string;
  readonly progress: number;
}

interface Milestone {
  readonly id: string;
  readonly name: string;
  readonly date: string;
  readonly completed: boolean;
  readonly description: string;
}

@Component({
  selector: 'app-task-progress',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './task-progress.html',
  styleUrl: './task-progress.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskProgressComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(NzMessageService);

  // Signals for state management
  loading = signal<boolean>(true);
  taskProgress = signal<TaskProgressData | null>(null);
  progressItems = signal<ProgressItem[]>([]);
  milestones = signal<Milestone[]>([]);
  error = signal<string | null>(null);

  // Computed properties
  overallProgress = computed(() => {
    const progress = this.taskProgress();
    if (!progress || progress.total_items === 0) return 0;
    return Math.round((progress.completed_items / progress.total_items) * 100);
  });

  completionRate = computed(() => {
    const progress = this.taskProgress();
    if (!progress || progress.total_items === 0) return '0%';
    return `${this.overallProgress()}%`;
  });

  scheduleStatus = computed(() => {
    const progress = this.taskProgress();
    if (!progress) return 'normal';

    const current = new Date(progress.current_date);
    const target = new Date(progress.target_date);
    const start = new Date(progress.start_date);

    const totalDays = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const timeProgress = (elapsedDays / totalDays) * 100;
    const workProgress = this.overallProgress();

    if (workProgress >= timeProgress) return 'success';
    if (workProgress >= timeProgress - 10) return 'normal';
    return 'exception';
  });

  progressColor = computed(() => {
    const status = this.scheduleStatus();
    switch (status) {
      case 'success':
        return '#52c41a';
      case 'normal':
        return '#1890ff';
      case 'exception':
        return '#ff4d4f';
      default:
        return '#1890ff';
    }
  });

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTaskProgress(taskId);
    } else {
      // Load with mock data for demonstration
      this.loadMockData();
    }
  }

  private loadMockData(): void {
    // Simulate API call delay
    setTimeout(() => {
      this.taskProgress.set({
        task_id: 'task-001',
        task_name: '建築主體結構施工',
        blueprint_name: 'XX 商業大樓建設專案',
        total_items: 25,
        completed_items: 15,
        pending_items: 3,
        staging_items: 4,
        qc_items: 2,
        issue_items: 1,
        start_date: '2025-10-01',
        target_date: '2025-12-31',
        current_date: '2025-11-16'
      });

      this.progressItems.set([
        {
          id: 'item-1',
          name: '基礎工程完成',
          status: 'completed',
          assignee: 'Team A',
          updated_at: '2025-10-15',
          progress: 100
        },
        {
          id: 'item-2',
          name: '一樓結構施工',
          status: 'completed',
          assignee: 'Team A',
          updated_at: '2025-11-01',
          progress: 100
        },
        {
          id: 'item-3',
          name: '二樓結構施工',
          status: 'qc',
          assignee: 'Team B',
          updated_at: '2025-11-10',
          progress: 95
        },
        {
          id: 'item-4',
          name: '三樓結構施工',
          status: 'staging',
          assignee: 'Team B',
          updated_at: '2025-11-15',
          progress: 85
        },
        {
          id: 'item-5',
          name: '四樓結構施工',
          status: 'pending',
          assignee: 'Team C',
          updated_at: '2025-11-16',
          progress: 30
        }
      ]);

      this.milestones.set([
        {
          id: 'ms-1',
          name: '基礎工程完工',
          date: '2025-10-15',
          completed: true,
          description: '地基與基礎結構完成'
        },
        {
          id: 'ms-2',
          name: '主體結構 50% 完成',
          date: '2025-11-15',
          completed: true,
          description: '建築主體結構達到 50% 進度'
        },
        {
          id: 'ms-3',
          name: '主體結構封頂',
          date: '2025-12-15',
          completed: false,
          description: '建築主體結構完工'
        },
        {
          id: 'ms-4',
          name: '專案驗收',
          date: '2025-12-31',
          completed: false,
          description: '完成最終驗收與交付'
        }
      ]);

      this.loading.set(false);
    }, 800);
  }

  private async loadTaskProgress(_id: string): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);

      // TODO: Replace with actual API call
      // const data = await this.taskService.getProgressById(id);
      // this.taskProgress.set(data);

      // For now, load mock data
      this.loadMockData();
    } catch {
      this.error.set('載入任務進度失敗');
      this.message.error('載入失敗');
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  viewDetails(_itemId: string): void {
    this.message.info(`查看項目 ${_itemId} 詳情`);
  }

  exportReport(): void {
    this.message.info('匯出報表功能待實作');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'success';
      case 'qc':
        return 'processing';
      case 'staging':
        return 'warning';
      case 'issue':
        return 'error';
      case 'pending':
        return 'default';
      default:
        return 'default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'qc':
        return '品檢中';
      case 'staging':
        return '暫存區';
      case 'issue':
        return '問題追蹤';
      case 'pending':
        return '進行中';
      default:
        return status;
    }
  }
}
