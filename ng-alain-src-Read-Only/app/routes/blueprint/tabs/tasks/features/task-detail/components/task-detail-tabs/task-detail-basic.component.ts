/**
 * Task Detail Basic Component
 *
 * 任務詳情 - 基本資訊標籤頁
 * 對應 @ETMS_DESIGN_SPEC.md 文件：A. 任務本體屬性
 *
 * 功能：
 * - 顯示任務識別屬性（ID、編碼、版本）
 * - 顯示任務描述（名稱、說明、標籤、分類）
 * - 顯示任務階層資訊
 * - 提供基本資訊編輯功能
 *
 * @see @ETMS_DESIGN_SPEC.md A. 任務本體屬性
 */

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Task } from '@models';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-detail-basic',
  standalone: true,
  templateUrl: './task-detail-basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskDetailBasicComponent {
  // 從父組件接收任務資料
  readonly task = input.required<Task>();

  // 計算屬性
  readonly hasTask = computed(() => this.task() !== null);
  readonly taskInfo = computed(() => {
    const t = this.task();
    if (!t) return null;
    return {
      id: t.id,
      code: t.code,
      name: t.name,
      description: t.description,
      notes: t.notes,
      tags: t.tags || [],
      category: t.category,
      subcategory: t.subcategory,
      workType: t.workType,
      discipline: t.discipline,
      status: t.status,
      priority: t.priority,
      assignedTo: t.assignedTo,
      parentId: t.parentId,
      level: t.level,
      path: t.path,
      version: t.version,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    };
  });
}
