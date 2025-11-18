import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

/**
 * Date Range Picker Component
 *
 * 日期范围选择组件
 * 使用 Angular 20 Signal Inputs/Outputs 和 OnPush 策略
 *
 * 功能：
 * - 日期范围选择
 * - 快速选择（今天、本周、本月等）
 * - 自定义日期格式
 * - 禁用日期范围
 * - 清除选择
 *
 * @example
 * ```html
 * <!-- 基本使用 -->
 * <app-date-range-picker
 *   (rangeChange)="onDateRangeChange($event)"
 * />
 *
 * <!-- 带快速选择 -->
 * <app-date-range-picker
 *   [showQuickSelect]="true"
 *   [format]="'yyyy-MM-dd'"
 *   (rangeChange)="onDateRangeChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="date-range-picker-container">
      @if (showQuickSelect()) {
        <div class="quick-select">
          <nz-button-group>
            <button
              nz-button
              nzSize="small"
              [nzType]="selectedQuick() === 'today' ? 'primary' : 'default'"
              (click)="selectQuick('today')"
            >
              今天
            </button>
            <button
              nz-button
              nzSize="small"
              [nzType]="selectedQuick() === 'week' ? 'primary' : 'default'"
              (click)="selectQuick('week')"
            >
              本周
            </button>
            <button
              nz-button
              nzSize="small"
              [nzType]="selectedQuick() === 'month' ? 'primary' : 'default'"
              (click)="selectQuick('month')"
            >
              本月
            </button>
            <button
              nz-button
              nzSize="small"
              [nzType]="selectedQuick() === 'quarter' ? 'primary' : 'default'"
              (click)="selectQuick('quarter')"
            >
              本季
            </button>
            <button
              nz-button
              nzSize="small"
              [nzType]="selectedQuick() === 'year' ? 'primary' : 'default'"
              (click)="selectQuick('year')"
            >
              今年
            </button>
          </nz-button-group>
        </div>
      }

      <nz-range-picker
        [nzFormat]="format()"
        [nzPlaceHolder]="[startPlaceholder(), endPlaceholder()]"
        [nzDisabled]="disabled()"
        [nzAllowClear]="allowClear()"
        [ngModel]="dateRangeState()"
        (ngModelChange)="handleRangeChange($event)"
        style="width: 100%"
      />
    </div>
  `,
  styles: [
    `
      .date-range-picker-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .quick-select {
        display: flex;
        justify-content: flex-start;
      }
    `
  ]
})
export class DateRangePickerComponent {
  /** 日期格式 */
  format = input<string>('yyyy-MM-dd');

  /** 开始日期占位符 */
  startPlaceholder = input<string>('开始日期');

  /** 结束日期占位符 */
  endPlaceholder = input<string>('结束日期');

  /** 是否显示快速选择 */
  showQuickSelect = input<boolean>(false);

  /** 是否允许清除 */
  allowClear = input<boolean>(true);

  /** 是否禁用 */
  disabled = input<boolean>(false);

  /** 日期范围变化事件 */
  rangeChange = output<[Date | null, Date | null]>();

  // 内部状态
  dateRangeState = signal<[Date, Date] | null>(null);
  selectedQuick = signal<string | null>(null);

  /**
   * 处理日期范围变化
   */
  handleRangeChange(dates: [Date, Date] | null): void {
    this.dateRangeState.set(dates);
    this.selectedQuick.set(null); // 清除快速选择状态
    
    if (dates) {
      this.rangeChange.emit([dates[0], dates[1]]);
    } else {
      this.rangeChange.emit([null, null]);
    }
  }

  /**
   * 快速选择日期范围
   */
  selectQuick(type: string): void {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (type) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      
      case 'week':
        const dayOfWeek = now.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 周一为第一天
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
        endDate = now;
        break;
      
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
        break;
      
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = now;
        break;
      
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = now;
        break;
      
      default:
        return;
    }

    this.selectedQuick.set(type);
    this.dateRangeState.set([startDate, endDate]);
    this.rangeChange.emit([startDate, endDate]);
  }
}
