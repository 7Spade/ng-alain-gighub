/**
 * Task Detail Dependency Component
 *
 * 任務詳情 - 關聯維度標籤頁
 * 對應 @ETMS_DESIGN_SPEC.md 文件：C. 關聯維度
 *
 * 功能：
 * - 顯示前置/後續任務與依賴關係
 * - 顯示關聯任務與里程碑
 * - 顯示影響鏈分析
 * - 提供依賴關係編輯功能
 *
 * @see @ETMS_DESIGN_SPEC.md C. 關聯維度
 */

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Task } from '@models';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-detail-dependency',
  standalone: true,
  templateUrl: './task-detail-dependency.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskDetailDependencyComponent {
  readonly task = input.required<Task>();

  readonly dependencyInfo = computed(() => {
    const t = this.task();
    return t?.dependency || null;
  });
}
