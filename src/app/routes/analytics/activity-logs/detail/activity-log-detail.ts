import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS, AnalyticsService } from '@shared';
import type { ActivityLogDetail } from '@shared';

@Component({
  selector: 'app-activity-log-detail',
  imports: [SHARED_IMPORTS],
  templateUrl: './activity-log-detail.html',
  styleUrl: './activity-log-detail.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityLogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);

  // Signals for component state
  activityLog = signal<ActivityLogDetail | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadActivityLog();
  }

  private async loadActivityLog(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('缺少活動記錄 ID');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await this.analyticsService.getActivityLogById(id);
      if (data) {
        this.activityLog.set(data);
      } else {
        this.error.set('找不到活動記錄');
      }
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : '載入失敗');
    } finally {
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/analytics/activity-logs']);
  }

  getResourceTypeLabel(resourceType: string): string {
    const labels: Record<string, string> = {
      blueprint: '藍圖',
      branch: '分支',
      task: '任務',
      issue: '問題',
      pr: 'Pull Request',
      comment: '留言',
      document: '文件',
      inspection: '檢查',
      qa: '品質驗收'
    };
    return labels[resourceType] || resourceType;
  }

  formatActionDetails(details: Record<string, unknown> | null): string {
    if (!details) {
      return '無';
    }
    return JSON.stringify(details, null, 2);
  }
}
