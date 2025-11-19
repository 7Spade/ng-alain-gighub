import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface KPIItem {
  readonly title: string;
  readonly value: number;
  readonly unit: string;
  readonly trend: number;
  readonly color: string;
}

@Component({
  selector: 'app-analytics-statistics',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'统计总览'"></page-header>

    <nz-card nzTitle="统计总览" style="margin-top: 16px;">
      <!-- KPI 卡片 -->
      <div nz-row [nzGutter]="16" style="margin-bottom: 24px;">
        @for (kpi of kpis(); track kpi.title) {
          <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="6">
            <nz-card [nzBordered]="true" style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: {{ kpi.color }};"> {{ kpi.value }}{{ kpi.unit }} </div>
              <div style="margin-top: 8px; color: #666;">{{ kpi.title }}</div>
              @if (kpi.trend !== 0) {
                <div style="margin-top: 8px; font-size: 12px;" [style.color]="kpi.trend > 0 ? '#52c41a' : '#ff4d4f'">
                  <span nz-icon [nzType]="kpi.trend > 0 ? 'arrow-up' : 'arrow-down'"></span>
                  {{ Math.abs(kpi.trend) }}%
                </div>
              }
            </nz-card>
          </div>
        }
      </div>

      <!-- 图表区域 -->
      <nz-row [nzGutter]="16">
        <nz-col [nzXs]="24" [nzLg]="12">
          <nz-card nzTitle="任务完成趋势" [nzBordered]="true">
            <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">
              <nz-empty nzNotFoundContent="图表开发中"></nz-empty>
            </div>
          </nz-card>
        </nz-col>
        <nz-col [nzXs]="24" [nzLg]="12">
          <nz-card nzTitle="问题处理趋势" [nzBordered]="true">
            <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">
              <nz-empty nzNotFoundContent="图表开发中"></nz-empty>
            </div>
          </nz-card>
        </nz-col>
      </nz-row>
    </nz-card>
  `
})
export class StatisticsComponent implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  kpis = signal<KPIItem[]>([]);

  // Expose Math to template
  Math = Math;

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    // TODO: 加载统计数据
    // 暂时使用空数组，实际开发时连接真实数据
    this.kpis.set([]);
  }
}
