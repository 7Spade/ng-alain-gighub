/**
 * Task Detail Time Component
 *
 * 任務詳情 - 時間維度標籤頁
 * 對應 @ETMS_DESIGN_SPEC.md 文件：B. 時間維度
 *
 * 功能：
 * - 顯示計畫時間與實際時間
 * - 顯示時間彈性與關鍵路徑分析
 * - 顯示延遲分析與調整記錄
 * - 提供時間資訊編輯功能
 *
 * @see @ETMS_DESIGN_SPEC.md B. 時間維度
 */

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Task } from '@models';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-detail-time',
  standalone: true,
  templateUrl: './task-detail-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskDetailTimeComponent {
  readonly task = input.required<Task>();

  readonly timeInfo = computed(() => {
    const t = this.task();
    return t?.time || null;
  });
}
