/**
 * Task Detail Resource Component
 *
 * 任務詳情 - 資源維度標籤頁
 * 對應 @ETMS_DESIGN_SPEC.md 文件：E. 資源維度
 *
 * 功能：
 * - 顯示人力資源配置與工時統計
 * - 顯示物料資源採購與交付狀況
 * - 顯示機具設備排程與使用記錄
 * - 提供資源配置編輯功能
 *
 * @see @ETMS_DESIGN_SPEC.md E. 資源維度
 */

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Task } from '@models';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-detail-resource',
  standalone: true,
  templateUrl: './task-detail-resource.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskDetailResourceComponent {
  readonly task = input.required<Task>();

  readonly resourceInfo = computed(() => {
    const t = this.task();
    return t?.resource || null;
  });
}
