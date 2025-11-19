/**
 * Task Resource Component
 *
 * 任務資源視圖組件
 * 對應 @ETMS_DESIGN_SPEC.md 文件：E. 資源維度
 *
 * 功能：
 * - 顯示人力、物料、機具資源配置
 * - 提供資源負荷視圖與衝突檢測
 * - 顯示資源使用率統計
 * - 支援資源分配與優化建議
 *
 * @see @ETMS_DESIGN_SPEC.md E. 資源維度
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { TaskDetailFacade } from '@tasks/shared/state';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-task-resource',
  standalone: true,
  templateUrl: './task-resource.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskResourceComponent {
  private readonly facade = inject(TaskDetailFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly msg = inject(NzMessageService);

  // 從路由參數獲取任務 ID
  readonly taskId = toSignal(this.route.params.pipe(map(params => params['id'] as string)), { initialValue: '' });

  // 任務資料
  readonly task = this.facade.task;
  readonly loading = this.facade.loading;

  // 計算屬性
  readonly resourceInfo = computed(() => {
    const t = this.task();
    return t?.resource || null;
  });

  constructor() {
    // 當任務 ID 變化時，載入任務資料
    effect(() => {
      const id = this.taskId();
      if (id) {
        void this.facade.loadTask(id);
      }
    });

    effect(() => {
      const error = this.facade.error();
      if (!error) {
        return;
      }

      if (error === 'NOT_FOUND') {
        this.msg.error('任務不存在');
      } else {
        this.msg.error('載入任務失敗');
      }

      queueMicrotask(() => this.facade.clearError());
    });
  }
}
