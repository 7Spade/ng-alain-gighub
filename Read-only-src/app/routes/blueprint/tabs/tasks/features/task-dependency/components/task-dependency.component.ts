/**
 * Task Dependency Component
 *
 * 任務依賴關係視圖組件
 * 對應 @ETMS_DESIGN_SPEC.md 文件：C. 關聯維度
 *
 * 功能：
 * - 顯示任務的前置/後續依賴關係
 * - 視覺化 FS/SS/FF/SF 四種依賴類型
 * - 顯示影響鏈分析與關鍵路徑
 * - 提供依賴關係編輯功能
 *
 * @see @ETMS_DESIGN_SPEC.md C. 關聯維度
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { TaskDetailFacade } from '@tasks/shared/state';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-task-dependency',
  standalone: true,
  templateUrl: './task-dependency.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskDependencyComponent {
  private readonly facade = inject(TaskDetailFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly msg = inject(NzMessageService);

  // 從路由參數獲取任務 ID
  readonly taskId = toSignal(this.route.params.pipe(map(params => params['id'] as string)), { initialValue: '' });

  // 任務資料
  readonly task = this.facade.task;
  readonly loading = this.facade.loading;

  // 計算屬性
  readonly dependencyInfo = computed(() => {
    const t = this.task();
    return t?.dependency || null;
  });

  readonly predecessors = computed(() => this.dependencyInfo()?.predecessors || []);
  readonly successors = computed(() => this.dependencyInfo()?.successors || []);
  readonly relatedTasks = computed(() => this.dependencyInfo()?.relatedTasks || []);

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
