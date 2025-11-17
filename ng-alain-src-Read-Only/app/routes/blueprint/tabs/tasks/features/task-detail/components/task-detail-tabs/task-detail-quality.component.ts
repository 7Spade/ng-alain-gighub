/**
 * Task Detail Quality Component
 *
 * 任務詳情 - 品質維度標籤頁
 * 對應 @ETMS_DESIGN_SPEC.md 文件：H. 品質維度
 *
 * 功能：
 * - 顯示品質標準與規範
 * - 顯示檢驗計畫與檢驗記錄
 * - 顯示不合格記錄（NCR）與矯正措施
 * - 顯示品質指標統計
 *
 * @see @ETMS_DESIGN_SPEC.md H. 品質維度
 */

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Task } from '@models';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-detail-quality',
  standalone: true,
  templateUrl: './task-detail-quality.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskDetailQualityComponent {
  readonly task = input.required<Task>();

  readonly qualityInfo = computed(() => {
    const t = this.task();
    return t?.quality || null;
  });
}
