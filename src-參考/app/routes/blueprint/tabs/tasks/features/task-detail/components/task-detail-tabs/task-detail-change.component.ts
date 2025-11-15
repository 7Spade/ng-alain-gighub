/**
 * Task Detail Change Component
 *
 * 任務詳情 - 變更維度標籤頁
 * 對應 @ETMS_DESIGN_SPEC.md 文件：M. 變更維度
 *
 * 功能：
 * - 顯示變更申請與審批流程
 * - 顯示變更影響分析（範圍、時程、成本等）
 * - 顯示替代方案評估
 * - 顯示變更實施與驗證狀態
 *
 * @see @ETMS_DESIGN_SPEC.md M. 變更維度
 */

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Task } from '@models';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-detail-change',
  standalone: true,
  templateUrl: './task-detail-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskDetailChangeComponent {
  readonly task = input.required<Task>();

  readonly changeInfo = computed(() => {
    const t = this.task();
    return t?.change || null;
  });
}
