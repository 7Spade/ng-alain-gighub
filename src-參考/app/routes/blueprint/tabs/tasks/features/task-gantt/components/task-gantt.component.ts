/**
 * Task Gantt Component
 *
 * 任務甘特圖視圖組件
 * 對應 @ETMS_DESIGN_SPEC.md 文件：B. 時間維度
 *
 * 功能：
 * - 顯示時間軸上的任務排程
 * - 支援任務依賴關係視覺化
 * - 顯示關鍵路徑與浮時
 * - 提供時間軸縮放與拖拽調整
 *
 * @see @ETMS_DESIGN_SPEC.md B. 時間維度
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BlueprintService, OrganizationContextService } from '@core';
import type { TaskTreeNode } from '@models/tree/task-tree.model';
import { SHARED_IMPORTS } from '@shared';
import { TaskTreeBuilderService } from '@tasks/features/task-tree/services/computation/task-tree-builder.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { combineLatest, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-task-gantt',
  standalone: true,
  templateUrl: './task-gantt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskGanttComponent {
  private readonly blueprintService = inject(BlueprintService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly msg = inject(NzMessageService);
  private readonly treeBuilder = inject(TaskTreeBuilderService);

  // 從路由參數獲取 Blueprint ID
  private readonly parentRouteParams = toSignal(this.route.parent?.params ?? of({ org: '', slug: '' }), {
    initialValue: { org: '', slug: '' }
  });

  private readonly blueprintSlug = computed(() => this.parentRouteParams()?.['slug'] || null);

  private readonly blueprintId = toSignal(
    combineLatest([toObservable(this.orgContext.currentOrganizationId), toObservable(this.blueprintSlug)]).pipe(
      switchMap(([, slug]) => {
        if (!slug) {
          return of(null);
        }
        return from(this.getBlueprintIdBySlug()).pipe(
          catchError(error => {
            console.error('計算 Blueprint ID 失敗:', error);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  // 任務資料
  readonly tasks = signal<TaskTreeNode[]>([]);
  readonly loading = signal(false);

  // 計算屬性
  readonly hasTasks = computed(() => this.tasks().length > 0);

  constructor() {
    // 當 Blueprint ID 變化時，載入任務資料
    effect(() => {
      const blueprintId = this.blueprintId();
      if (blueprintId) {
        this.loadTasks(blueprintId);
      } else {
        this.tasks.set([]);
      }
    });
  }

  /**
   * 根據路由參數獲取 Blueprint ID
   */
  private async getBlueprintIdBySlug(): Promise<string | null> {
    const params = this.parentRouteParams() ?? { org: '', slug: '' };
    const orgSlug = params['org'];
    const slug = params['slug'];

    if (!slug) {
      return null;
    }

    const isUserView = !orgSlug;

    try {
      if (isUserView) {
        const { data } = await this.blueprintService.getBlueprintBySlug(null, slug);
        return data?.id || null;
      } else {
        const org = this.orgContext.currentOrganization();
        if (!org) {
          return null;
        }
        const { data } = await this.blueprintService.getBlueprintBySlug(org.id, slug);
        return data?.id || null;
      }
    } catch (error) {
      console.error('獲取 Blueprint ID 失敗:', error);
      return null;
    }
  }

  /**
   * 載入任務資料
   */
  private async loadTasks(blueprintId: string): Promise<void> {
    this.loading.set(true);
    try {
      // 使用 TaskTreeBuilderService 構建任務樹
      const tree = await this.treeBuilder.buildTree(blueprintId, {
        includeArchived: false,
        sortBy: 'sortOrder',
        sortOrder: 'asc'
      });
      this.tasks.set(tree);
    } catch (error) {
      this.msg.error('載入任務失敗');
      console.error('Failed to load tasks:', error);
      this.tasks.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
