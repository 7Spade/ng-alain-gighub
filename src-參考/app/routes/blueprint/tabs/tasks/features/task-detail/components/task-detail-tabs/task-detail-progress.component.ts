/**
 * Task Detail Progress Component
 *
 * 任務詳情 - 進度維度標籤頁
 * 對應 @ETMS_DESIGN_SPEC.md 文件：F. 進度維度
 *
 * 功能：
 * - 顯示進度狀態與百分比
 * - 顯示檢查點與驗收記錄
 * - 顯示實獲值分析（EVM）指標
 * - 提供進度更新與檢查點管理功能
 *
 * @see @ETMS_DESIGN_SPEC.md F. 進度維度
 */

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Task } from '@models';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-detail-progress',
  standalone: true,
  templateUrl: './task-detail-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskDetailProgressComponent {
  readonly task = input.required<Task>();

  readonly progressInfo = computed(() => {
    const t = this.task();
    return t?.progress || null;
  });
}
