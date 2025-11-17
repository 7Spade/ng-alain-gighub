import { Component, ChangeDetectionStrategy, input, effect } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';

/**
 * 圖表封裝元件
 * 
 * 用途：統一的圖表顯示介面，支援多種圖表類型
 * 
 * @example
 * ```html
 * <app-chart-wrapper 
 *   [type]="'bar'"
 *   [data]="chartData()"
 *   [title]="'月度統計'"
 *   [height]="300" />
 * ```
 */
@Component({
  selector: 'app-chart-wrapper',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-card [nzTitle]="title()" class="chart-card">
      @if (loading()) {
        <div class="chart-loading">
          <nz-spin nzSize="large" />
        </div>
      } @else if (data()) {
        <div class="chart-container" [style.height.px]="height()">
          <!-- Chart will be rendered here using a charting library -->
          <div class="chart-placeholder">
            <span nz-icon nzType="bar-chart" nzTheme="outline" class="chart-icon"></span>
            <p class="chart-type-label">{{ getChartTypeLabel() }} 圖表</p>
            <p class="chart-info">圖表類型: {{ type() }}</p>
            <p class="chart-info">資料點數: {{ getDataPointsCount() }}</p>
            
            <!-- Simple data preview -->
            <div class="data-preview">
              <h4>資料預覽：</h4>
              <nz-tag *ngFor="let label of data()!.labels.slice(0, 5)" nzColor="blue">
                {{ label }}
              </nz-tag>
              @if (data()!.labels.length > 5) {
                <nz-tag>...</nz-tag>
              }
            </div>

            <nz-alert
              nzType="info"
              nzMessage="圖表渲染說明"
              nzDescription="此元件為圖表封裝介面，實際圖表渲染需整合 ECharts 或 ngx-charts 等圖表庫。"
              [nzCloseable]="true"
              class="chart-alert" />
          </div>
        </div>
      } @else {
        <nz-empty nzNotFoundContent="暫無圖表資料" />
      }

      @if (description()) {
        <div class="chart-description">
          {{ description() }}
        </div>
      }
    </nz-card>
  `,
  styles: [`
    .chart-card {
      height: 100%;

      :host ::ng-deep .ant-card-body {
        padding: 24px;
      }
    }

    .chart-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }

    .chart-container {
      position: relative;
      width: 100%;
    }

    .chart-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: #fafafa;
      border: 2px dashed #d9d9d9;
      border-radius: 4px;
      padding: 24px;

      .chart-icon {
        font-size: 64px;
        color: #d9d9d9;
        margin-bottom: 16px;
      }

      .chart-type-label {
        font-size: 18px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 8px;
      }

      .chart-info {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 4px;
      }

      .data-preview {
        margin-top: 16px;
        text-align: center;

        h4 {
          font-size: 14px;
          margin-bottom: 8px;
        }

        nz-tag {
          margin: 4px;
        }
      }

      .chart-alert {
        margin-top: 16px;
        max-width: 500px;
      }
    }

    .chart-description {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      line-height: 1.6;
    }
  `]
})
export class ChartWrapperComponent {
  /** 圖表類型 */
  type = input.required<ChartType>();

  /** 圖表資料 */
  data = input<ChartData>();

  /** 圖表標題 */
  title = input<string>('圖表');

  /** 圖表高度 */
  height = input<number>(300);

  /** 圖表描述 */
  description = input<string>();

  /** 載入狀態 */
  loading = input<boolean>(false);

  /**
   * 取得圖表類型標籤
   */
  getChartTypeLabel(): string {
    const labels: Record<ChartType, string> = {
      line: '折線',
      bar: '柱狀',
      pie: '圓餅',
      doughnut: '環圈',
      radar: '雷達',
      polarArea: '極區'
    };
    return labels[this.type()];
  }

  /**
   * 取得資料點數量
   */
  getDataPointsCount(): number {
    const chartData = this.data();
    if (!chartData) return 0;
    
    return chartData.datasets.reduce((sum, dataset) => {
      return sum + dataset.data.length;
    }, 0);
  }

  constructor() {
    // Effect to handle data changes and trigger chart rendering
    effect(() => {
      const chartData = this.data();
      const chartType = this.type();
      
      if (chartData && chartType) {
        // Here you would integrate with actual charting library
        // e.g., ECharts, Chart.js, or ngx-charts
        console.log('Chart data updated:', { type: chartType, data: chartData });
      }
    });
  }
}
