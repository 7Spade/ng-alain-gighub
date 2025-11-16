import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ProgressTrackingRepository, ProgressTracking } from '@core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-progress-tracking',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'进度追踪'"></page-header>

    <nz-card nzTitle="进度追踪" style="margin-top: 16px;">
      <st
        #st
        [data]="progressData()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{
          show: true,
          showSize: true,
          front: false
        }"
        [responsive]="true"
        [scroll]="{ x: '1400px' }"
      ></st>
    </nz-card>
  `
})
export class ProgressTrackingComponent implements OnInit {
  private progressRepo = inject(ProgressTrackingRepository);
  private message = inject(NzMessageService);

  // Signals for reactive state
  progressData = signal<STData[]>([]);
  loading = signal(false);

  // ST Table columns configuration
  columns: STColumn[] = [
    {
      title: '项目/蓝图',
      index: 'entity_name',
      width: 200,
      fixed: 'left'
    },
    {
      title: '类型',
      index: 'entity_type',
      width: 100,
      type: 'tag',
      tag: {
        Blueprint: { text: '蓝图', color: 'blue' },
        Task: { text: '任务', color: 'green' },
        Branch: { text: '分支', color: 'orange' }
      }
    },
    {
      title: '计划进度',
      index: 'planned_progress',
      width: 120,
      type: 'number',
      numberDigits: '1.0-2',
      format: (item: STData) => {
        const progress = item['planned_progress'] as number;
        return progress ? `${progress}%` : '0%';
      }
    },
    {
      title: '实际进度',
      index: 'actual_progress',
      width: 120,
      type: 'number',
      numberDigits: '1.0-2',
      format: (item: STData) => {
        const progress = item['actual_progress'] as number;
        return progress ? `${progress}%` : '0%';
      }
    },
    {
      title: '进度偏差',
      index: 'progress_variance',
      width: 120,
      format: (item: STData) => {
        const actual = (item['actual_progress'] as number) || 0;
        const planned = (item['planned_progress'] as number) || 0;
        const variance = actual - planned;
        const sign = variance >= 0 ? '+' : '';
        return `${sign}${variance.toFixed(2)}%`;
      },
      className: (item: STData) => {
        const actual = (item['actual_progress'] as number) || 0;
        const planned = (item['planned_progress'] as number) || 0;
        const variance = actual - planned;
        if (variance < -10) return 'text-error';
        if (variance < -5) return 'text-warning';
        if (variance > 5) return 'text-success';
        return '';
      }
    },
    {
      title: '状态',
      index: 'status',
      width: 100,
      type: 'badge',
      badge: {
        on_track: { text: '按计划', color: 'success' },
        at_risk: { text: '有风险', color: 'warning' },
        delayed: { text: '延期', color: 'error' },
        completed: { text: '已完成', color: 'default' }
      }
    },
    {
      title: '更新时间',
      index: 'tracked_at',
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm',
      width: 160
    },
    {
      title: '备注',
      index: 'notes',
      width: 200
    }
  ];

  ngOnInit(): void {
    this.loadProgressData();
  }

  /**
   * 加载进度数据
   */
  loadProgressData(): void {
    this.loading.set(true);

    this.progressRepo
      .findAll({
        orderBy: 'tracked_at',
        orderDirection: 'desc',
        pageSize: 100
      })
      .subscribe({
        next: data => {
          this.progressData.set(data as STData[]);
          this.loading.set(false);
        },
        error: err => {
          console.error('加载进度数据失败:', err);
          this.message.error('加载进度数据失败');
          this.loading.set(false);
        }
      });
  }
}
