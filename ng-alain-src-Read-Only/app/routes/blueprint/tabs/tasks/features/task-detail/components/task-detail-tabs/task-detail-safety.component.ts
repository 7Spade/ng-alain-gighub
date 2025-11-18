/**
 * Task Detail Safety Component
 *
 * 任務詳情 - 安全維度標籤頁
 * 對應 @ETMS_DESIGN_SPEC.md 文件：J. 安全維度
 *
 * 功能：
 * - 顯示危害辨識（HIRA）結果
 * - 顯示許可證系統（PTW）狀態
 * - 顯示 PPE 要求與安全訓練記錄
 * - 顯示事故/事件記錄與安全 KPI
 *
 * @see @ETMS_DESIGN_SPEC.md J. 安全維度
 */

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Task } from '@models';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-detail-safety',
  standalone: true,
  templateUrl: './task-detail-safety.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskDetailSafetyComponent {
  readonly task = input.required<Task>();

  readonly safetyInfo = computed(() => {
    const t = this.task();
    return t?.safety || null;
  });
}
