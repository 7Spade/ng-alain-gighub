import { Injectable, inject } from '@angular/core';
import { TaskResourceService } from '@tasks/features/task-resource/services/domain/task-resource.service';

/**
 * Task Progress Calculator Service (Quantity Only)
 *
 * 與 quantity 進度規則對齊，僅提供數量型進度計算。
 */
@Injectable({
  providedIn: 'root'
})
export class TaskProgressCalculatorService {
  private readonly resourceService = inject(TaskResourceService);

  /**
   * 根據數量計算進度百分比（已完成數量 / 總數量 * 100）
   */
  async calculateByQuantity(taskId: string): Promise<number> {
    const resource = await this.resourceService.getTaskResource(taskId);
    const materials = resource?.materials?.materials ?? [];

    if (materials.length === 0) {
      return 0;
    }

    let totalQuantity = 0;
    let completedQuantity = 0;

    for (const material of materials) {
      const plannedQty = material.plannedQuantity || 0;
      const installedQty = material.installedQuantity || 0;
      const usedQty = material.usedQuantity || 0;
      const completedQty = installedQty > 0 ? installedQty : usedQty;

      totalQuantity += plannedQty;
      completedQuantity += completedQty;
    }

    if (totalQuantity === 0) {
      return 0;
    }

    const progress = (completedQuantity / totalQuantity) * 100;
    return Math.max(0, Math.min(100, progress));
  }
}
