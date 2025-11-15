/**
 * Task Detail Component
 *
 * 任務詳情組件（多維度展示）
 * 對應 @ETMS_DESIGN_SPEC.md 文件：完整任務模型
 *
 * 功能：
 * - 整合所有維度的任務資訊展示
 * - 提供多標籤頁切換不同維度
 * - 支援任務編輯與更新
 * - 顯示任務歷史與版本追蹤
 *
 * @see @ETMS_DESIGN_SPEC.md 完整任務模型
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { TaskDetailFacade } from '@tasks/shared/state';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';

import { TaskDetailBasicComponent } from './task-detail-tabs/task-detail-basic.component';
import { TaskDetailChangeComponent } from './task-detail-tabs/task-detail-change.component';
import { TaskDetailCostComponent } from './task-detail-tabs/task-detail-cost.component';
import { TaskDetailDependencyComponent } from './task-detail-tabs/task-detail-dependency.component';
import { TaskDetailProgressComponent } from './task-detail-tabs/task-detail-progress.component';
import { TaskDetailQualityComponent } from './task-detail-tabs/task-detail-quality.component';
import { TaskDetailResourceComponent } from './task-detail-tabs/task-detail-resource.component';
import { TaskDetailRiskComponent } from './task-detail-tabs/task-detail-risk.component';
import { TaskDetailSafetyComponent } from './task-detail-tabs/task-detail-safety.component';
import { TaskDetailTimeComponent } from './task-detail-tabs/task-detail-time.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  templateUrl: './task-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SHARED_IMPORTS,
    TaskDetailBasicComponent,
    TaskDetailTimeComponent,
    TaskDetailDependencyComponent,
    TaskDetailResourceComponent,
    TaskDetailProgressComponent,
    TaskDetailCostComponent,
    TaskDetailQualityComponent,
    TaskDetailRiskComponent,
    TaskDetailSafetyComponent,
    TaskDetailChangeComponent
  ]
})
export class TaskDetailComponent {
  private readonly facade = inject(TaskDetailFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly msg = inject(NzMessageService);

  // 從路由參數獲取任務 ID
  readonly taskId = toSignal(this.route.params.pipe(map(params => params['id'] as string)), { initialValue: '' });

  // 任務資料
  readonly task = this.facade.task;
  readonly loading = this.facade.loading;

  // 當前標籤頁
  readonly activeTab = signal<string>('basic');

  // 計算屬性
  readonly hasTask = computed(() => this.task() !== null);

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
        this.router.navigate(['../'], { relativeTo: this.route.parent });
      } else {
        this.msg.error('載入任務失敗');
      }

      queueMicrotask(() => this.facade.clearError());
    });
  }

  /**
   * 切換標籤頁
   */
  onTabChange(index: number): void {
    const tabs = ['basic', 'time', 'dependency', 'resource', 'progress', 'cost', 'quality', 'risk', 'safety', 'change'];
    this.activeTab.set(tabs[index] || 'basic');
  }

  /**
   * 返回任務列表
   */
  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route.parent });
  }
}
