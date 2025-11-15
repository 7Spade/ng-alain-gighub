/**
 * Task Form Component
 *
 * 任務表單組件（多維度編輯）
 * 對應 @ETMS_DESIGN_SPEC.md 文件：完整任務模型
 *
 * 功能：
 * - 提供多維度任務資訊的表單編輯
 * - 整合各維度的表單區段
 * - 支援任務創建與更新
 * - 提供表單驗證與提交邏輯
 *
 * @see @ETMS_DESIGN_SPEC.md 完整任務模型
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import {
  TaskFormGroup,
  buildTaskQuantityPayload,
  createTaskFormGroup,
  extractPrimaryTaskQuantity,
  resetTaskFormGroup,
  taskIdentityFormValue,
  taskQuantityFormValue
} from '@tasks/features/task-form/services/task-form.helpers';
import { TaskDetailFacade, TaskCommandFacade } from '@tasks/shared/state';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class TaskFormComponent {
  private readonly detailFacade = inject(TaskDetailFacade);
  private readonly commandFacade = inject(TaskCommandFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly msg = inject(NzMessageService);
  private readonly fb = inject(FormBuilder);

  // 從路由參數獲取任務 ID（編輯模式）和 Blueprint ID
  readonly taskId = toSignal(this.route.params.pipe(map(params => params['id'] as string | undefined)), { initialValue: undefined });
  readonly blueprintId = toSignal(
    this.route.parent?.params.pipe(map(params => params['blueprintId'] as string | undefined)) ?? of(undefined),
    { initialValue: undefined }
  );

  // 任務資料
  readonly task = this.detailFacade.task;
  readonly loading = computed(() => this.detailFacade.loading() || this.commandFacade.loading());
  readonly quantityLoading = signal(false);

  // 表單
  readonly taskForm: TaskFormGroup = createTaskFormGroup(this.fb);

  // 計算屬性
  readonly isEditMode = computed(() => !!this.taskId());
  readonly hasTask = computed(() => this.task() !== null);

  constructor() {
    // 當任務 ID 變化時，載入任務資料（編輯模式）
    effect(() => {
      const id = this.taskId();
      if (id) {
        this.quantityLoading.set(true);
        void this.detailFacade
          .loadTask(id)
          .then(() => {
            const task = this.task();
            if (task) {
              resetTaskFormGroup(this.taskForm, {
                ...taskIdentityFormValue(task),
                ...taskQuantityFormValue(extractPrimaryTaskQuantity(task))
              });
            }
          })
          .finally(() => {
            this.quantityLoading.set(false);
          });
      } else {
        resetTaskFormGroup(this.taskForm);
        this.quantityLoading.set(false);
      }
    });

    effect(() => {
      const error = this.detailFacade.error();
      if (!error) {
        return;
      }

      if (error === 'NOT_FOUND') {
        this.msg.error('任務不存在');
        this.router.navigate(['../'], { relativeTo: this.route.parent });
      } else {
        this.msg.error('載入任務失敗');
      }

      queueMicrotask(() => this.detailFacade.clearError());
    });
  }

  /**
   * 提交表單
   */
  async onSubmit(): Promise<void> {
    if (this.taskForm.invalid) {
      Object.values(this.taskForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const blueprintId = this.blueprintId();
    if (!blueprintId) {
      this.msg.error('無法獲取藍圖資訊');
      return;
    }

    const formValue = this.taskForm.getRawValue();
    const editing = this.isEditMode();
    const taskId = this.taskId();

    const quantityPayload = buildTaskQuantityPayload(formValue);
    const payload = {
      name: formValue.name!,
      description: formValue.description || undefined,
      notes: formValue.notes || undefined,
      tags: formValue.tags || [],
      category: formValue.category || undefined,
      subcategory: formValue.subcategory || undefined,
      workType: formValue.workType as any,
      discipline: formValue.discipline || undefined,
      status: formValue.status as any,
      priority: formValue.priority as any,
      assignedTo: formValue.assignedTo || undefined,
      parentId: formValue.parentId || undefined,
      quantity: quantityPayload
    };

    const success =
      editing && taskId ? await this.commandFacade.updateTask(taskId, payload) : await this.commandFacade.createTask(blueprintId, payload);

    if (!success) {
      const errorMessage = this.commandFacade.error();
      this.msg.error((editing ? '任務更新失敗' : '任務創建失敗') + (errorMessage ? `：${errorMessage}` : ''));
      return;
    }

    this.commandFacade.clearError();
    this.msg.success(editing ? '任務更新成功' : '任務創建成功');
    this.router.navigate(['../'], { relativeTo: this.route.parent });
  }

  /**
   * 取消編輯
   */
  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route.parent });
  }
}
