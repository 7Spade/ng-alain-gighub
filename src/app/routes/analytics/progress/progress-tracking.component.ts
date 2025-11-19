import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ProgressItem {
  readonly id: string;
  readonly name: string;
  readonly progress: number;
  readonly status: string;
  readonly startDate: string;
  readonly endDate: string;
}

@Component({
  selector: 'app-progress-tracking',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'进度追踪'">
      <ng-template #extra>
        <nz-select
          [ngModel]="selectedBlueprintId()"
          (ngModelChange)="selectedBlueprintId.set($event); onBlueprintChange()"
          nzPlaceHolder="选择蓝图"
          style="width: 250px;"
        >
          <!-- TODO: 加载蓝图列表 -->
        </nz-select>
      </ng-template>
    </page-header>

    <nz-card nzTitle="进度追踪" style="margin-top: 16px;">
      @if (!selectedBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else {
        <!-- 进度概览 -->
        <div style="margin-bottom: 24px;">
          <nz-row [nzGutter]="16">
            @for (item of progressItems(); track item.id) {
              <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8">
                <nz-card [nzBordered]="true" style="margin-bottom: 16px;">
                  <div style="margin-bottom: 8px;">
                    <strong>{{ item.name }}</strong>
                  </div>
                  <nz-progress [nzPercent]="item.progress" [nzStatus]="getProgressStatus(item.status)"></nz-progress>
                  <div style="margin-top: 8px; font-size: 12px; color: #666;"> {{ item.startDate }} - {{ item.endDate }} </div>
                </nz-card>
              </div>
            }
          </nz-row>
        </div>

        <!-- 进度图表 -->
        <nz-card nzTitle="进度趋势图" [nzBordered]="true">
          <div style="height: 400px; display: flex; align-items: center; justify-content: center; color: #999;">
            <nz-empty nzNotFoundContent="图表开发中"></nz-empty>
          </div>
        </nz-card>
      }
    </nz-card>
  `
})
export class ProgressTrackingComponent implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  selectedBlueprintId = signal<string | null>(null);
  progressItems = signal<ProgressItem[]>([]);

  ngOnInit(): void {
    // TODO: 初始化
  }

  onBlueprintChange(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    // TODO: 加载进度数据
    // 暂时使用空数组，实际开发时连接真实数据
    this.progressItems.set([]);
  }

  getProgressStatus(status: string): 'success' | 'exception' | 'active' | 'normal' | undefined {
    switch (status) {
      case 'completed':
        return 'success';
      case 'error':
        return 'exception';
      case 'active':
        return 'active';
      default:
        return 'normal';
    }
  }
}
