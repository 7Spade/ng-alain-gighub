/**
 * Task Location Component
 *
 * 任務空間視圖組件
 * 對應 @ETMS_DESIGN_SPEC.md 文件：D. 空間維度
 *
 * 功能：
 * - 顯示階層式位置（工地>建築>樓層>區域）
 * - 提供空間衝突檢測視覺化
 * - 整合 BIM 元素關聯與 3D 視圖
 * - 顯示鄰近任務與空間重疊分析
 *
 * @see @ETMS_DESIGN_SPEC.md D. 空間維度
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { TaskDetailFacade } from '@tasks/shared/state';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-task-location',
  standalone: true,
  templateUrl: './task-location.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskLocationComponent {
  private readonly facade = inject(TaskDetailFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly msg = inject(NzMessageService);

  // 從路由參數獲取任務 ID
  readonly taskId = toSignal(this.route.params.pipe(map(params => params['id'] as string)), { initialValue: '' });

  // 任務資料
  readonly task = this.facade.task;
  readonly loading = this.facade.loading;

  // 計算屬性
  readonly locationInfo = computed(() => {
    const t = this.task();
    return t?.location || null;
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
