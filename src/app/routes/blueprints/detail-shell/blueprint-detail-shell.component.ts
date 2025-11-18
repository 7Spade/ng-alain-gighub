import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

interface Metric {
  readonly label: string;
  readonly value: string;
  readonly trend: string;
  readonly color: string;
}

interface DeliveryStage {
  readonly name: string;
  readonly owner: string;
  readonly status: 'wait' | 'process' | 'finish' | 'error';
  readonly updatedAt: string;
}

interface RiskItem {
  readonly title: string;
  readonly detail: string;
  readonly owner: string;
  readonly level: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-blueprint-detail-shell',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'藍圖詳情骨架'" [nzSubtitle]="'靜態頁面占位，方便開發排查'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="sync"></span>
          同步配置
        </button>
        <button nz-button nzType="primary" nzShape="round">
          <span nz-icon nzType="edit"></span>
          進入表單
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <nz-row [nzGutter]="16">
        @for (metric of overviewMetrics; track metric.label) {
          <nz-col nzXs="24" nzSm="12" nzXl="6">
            <nz-card nzSize="small" class="metric-card" [nzBodyStyle]="{ padding: '12px 16px' }">
              <div class="metric-label">{{ metric.label }}</div>
              <div class="metric-value" [style.color]="metric.color">{{ metric.value }}</div>
              <div class="metric-trend">{{ metric.trend }}</div>
            </nz-card>
          </nz-col>
        }
      </nz-row>

      <nz-card nzTitle="交付階段視圖" class="section-card">
        <nz-steps nzDirection="vertical">
          @for (stage of deliveryStages; track stage.name) {
            <nz-step [nzTitle]="stage.name" [nzStatus]="stage.status">
              <ng-template #nzDescription>
                <div class="stage-owner">
                  Owner：{{ stage.owner }}
                  <nz-tag nzColor="purple">{{ stage.updatedAt }}</nz-tag>
                </div>
              </ng-template>
            </nz-step>
          }
        </nz-steps>
      </nz-card>

      <nz-card nzTitle="風險與依賴" class="section-card">
        <nz-list [nzDataSource]="riskList" nzItemLayout="horizontal">
          <ng-template #renderItem let-item>
            <nz-list-item>
              <nz-list-item-meta [nzTitle]="item.title" [nzDescription]="item.detail + ' · 負責人：' + item.owner"></nz-list-item-meta>
              <nz-tag [nzColor]="item.level === 'high' ? 'red' : item.level === 'medium' ? 'orange' : 'green'">
                {{ item.level | uppercase }}
              </nz-tag>
            </nz-list-item>
          </ng-template>
        </nz-list>
      </nz-card>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page-section {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .metric-card {
        min-height: 110px;
      }

      .metric-label {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.65);
      }

      .metric-value {
        font-size: 26px;
        font-weight: 600;
        margin: 6px 0;
      }

      .metric-trend {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }

      .stage-owner {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlueprintDetailShellComponent {
  protected readonly overviewMetrics: Metric[] = [
    { label: '模組數', value: '18', trend: '新增 2 個子模組', color: '#1890ff' },
    { label: '活躍任務', value: '42', trend: '進行中 16 · 待審核 8', color: '#52c41a' },
    { label: '阻塞項', value: '5', trend: '需跨組協作處理', color: '#fa8c16' },
    { label: '熱度指數', value: '87%', trend: '最近 24h 互動', color: '#722ed1' }
  ];

  protected readonly deliveryStages: DeliveryStage[] = [
    { name: '藍圖草稿', owner: 'Alice', status: 'finish', updatedAt: '09:12' },
    { name: '主分支同步', owner: 'Branch Bot', status: 'process', updatedAt: '10:45' },
    { name: '審核與驗證', owner: 'Reviewer Team', status: 'wait', updatedAt: '待排程' },
    { name: '部署與驗證', owner: 'Infra', status: 'wait', updatedAt: '等待觸發' }
  ];

  protected readonly riskList: RiskItem[] = [
    {
      title: '資料模型重構',
      detail: '需核對 51 張表差異與 RLS 規則',
      owner: 'DB Guild',
      level: 'high'
    },
    {
      title: '工作流分支切換',
      detail: '新舊流程共存，需防止權限錯置',
      owner: 'Workflow Squad',
      level: 'medium'
    },
    {
      title: '文件服務',
      detail: '縮圖與大檔分流需測試',
      owner: 'Document Team',
      level: 'low'
    }
  ];
}
