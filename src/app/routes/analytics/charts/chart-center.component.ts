import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ChartItem {
  readonly id: string;
  readonly title: string;
  readonly type: string;
  readonly config: Record<string, unknown>;
}

@Component({
  selector: 'app-chart-center',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'图表中心'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="addChart()">
          <span nz-icon nzType="plus"></span>
          添加图表
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="图表中心" style="margin-top: 16px;">
      <!-- 图表网格 -->
      <div nz-row [nzGutter]="16">
        @for (chart of charts(); track chart.id) {
          <div nz-col [nzXs]="24" [nzSm]="12" [nzLg]="8">
            <nz-card [nzBordered]="true" [nzTitle]="chart.title" style="margin-bottom: 16px;">
              <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">
                <nz-empty [nzNotFoundContent]="'图表类型: ' + chart.type"></nz-empty>
              </div>
              <div style="margin-top: 16px; text-align: right;">
                <button nz-button nzType="link" nzSize="small" (click)="editChart(chart.id)">编辑</button>
                <button nz-button nzType="link" nzSize="small" nzDanger (click)="deleteChart(chart.id)">删除</button>
              </div>
            </nz-card>
          </div>
        }
        @empty {
          <div nz-col [nzSpan]="24">
            <nz-empty nzNotFoundContent="暂无图表，点击添加图表按钮创建"></nz-empty>
          </div>
        }
      </div>
    </nz-card>
  `
})
export class ChartCenterComponent implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  charts = signal<ChartItem[]>([]);

  ngOnInit(): void {
    this.loadCharts();
  }

  loadCharts(): void {
    // TODO: 加载图表配置
    // 暂时使用空数组，实际开发时连接真实数据
    this.charts.set([]);
  }

  addChart(): void {
    // TODO: 实现添加图表逻辑
    this.message.info('添加图表功能开发中');
  }

  editChart(id: string): void {
    // TODO: 实现编辑图表逻辑
    this.message.info('编辑图表功能开发中');
  }

  deleteChart(id: string): void {
    // TODO: 实现删除图表逻辑
    this.message.info('删除图表功能开发中');
  }
}
