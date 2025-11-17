/**
 * Task Detail Risk Component
 *
 * 任務詳情 - 風險維度標籤頁
 * 對應 @ETMS_DESIGN_SPEC.md 文件：I. 風險維度
 *
 * 功能：
 * - 顯示風險識別與評估結果
 * - 顯示應對策略與行動項目
 * - 顯示風險監控指標與觸發條件
 * - 顯示風險實現記錄與影響分析
 *
 * @see @ETMS_DESIGN_SPEC.md I. 風險維度
 */

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Task } from '@models';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-detail-risk',
  standalone: true,
  templateUrl: './task-detail-risk.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskDetailRiskComponent {
  readonly task = input.required<Task>();

  readonly riskInfo = computed(() => {
    const t = this.task();
    return t?.risk || null;
  });
}
