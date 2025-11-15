/**
 * Task Detail Cost Component
 *
 * 任務詳情 - 成本維度標籤頁
 * 對應 @ETMS_DESIGN_SPEC.md 文件：G. 成本維度
 *
 * 功能：
 * - 顯示預算與實際支出
 * - 顯示成本分項與趨勢分析
 * - 顯示變更單、索賠、付款記錄
 * - 提供成本資訊編輯功能
 *
 * @see @ETMS_DESIGN_SPEC.md G. 成本維度
 */

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Task } from '@models';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-detail-cost',
  standalone: true,
  templateUrl: './task-detail-cost.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskDetailCostComponent {
  readonly task = input.required<Task>();

  readonly costInfo = computed(() => {
    const t = this.task();
    return t?.cost || null;
  });
}
