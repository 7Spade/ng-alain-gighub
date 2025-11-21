import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacade, WorkspaceContextFacade } from '@core';
import { BlueprintService, SHARED_IMPORTS, TaskInsert, TaskService, TaskUpdate } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="isEdit() ? '编辑任务' : '新建任务'" [extra]="extraTemplate">
      <ng-template #extraTemplate>
        <button nz-button nzType="default" (click)="cancel()">
          <span nz-icon nzType="close"></span>
          取消
        </button>
        <button nz-button nzType="primary" (click)="submit()" [nzLoading]="taskService.loading()" style="margin-left: 8px;">
          <span nz-icon nzType="check"></span>
          {{ isEdit() ? '保存' : '创建' }}
        </button>
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      @if (taskService.loading() && isEdit()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else {
        <form nz-form [formGroup]="form" (ngSubmit)="submit()">
          <nz-form-item>
            <nz-form-label [nzSpan]="4" nzRequired>蓝图</nz-form-label>
            <nz-form-control [nzSpan]="20" nzErrorTip="请选择蓝图">
              <nz-select formControlName="blueprintId" nzPlaceHolder="请选择蓝图">
                @for (blueprint of blueprintService.blueprints(); track blueprint.id) {
                  <nz-option [nzValue]="blueprint.id" [nzLabel]="blueprint.name"></nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="4" nzRequired>标题</nz-form-label>
            <nz-form-control [nzSpan]="20" nzErrorTip="请输入任务标题">
              <input nz-input formControlName="title" placeholder="请输入任务标题" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="4">描述</nz-form-label>
            <nz-form-control [nzSpan]="20">
              <textarea
                nz-input
                formControlName="description"
                [nzAutosize]="{ minRows: 3, maxRows: 6 }"
                placeholder="请输入任务描述"
              ></textarea>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="4" nzRequired>任务类型</nz-form-label>
            <nz-form-control [nzSpan]="20" nzErrorTip="请选择任务类型">
              <nz-select formControlName="taskType" nzPlaceHolder="请选择任务类型">
                <nz-option [nzValue]="'milestone'" nzLabel="里程碑"></nz-option>
                <nz-option [nzValue]="'phase'" nzLabel="阶段"></nz-option>
                <nz-option [nzValue]="'task'" nzLabel="任务"></nz-option>
                <nz-option [nzValue]="'subtask'" nzLabel="子任务"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="4" nzRequired>状态</nz-form-label>
            <nz-form-control [nzSpan]="20" nzErrorTip="请选择状态">
              <nz-select formControlName="status" nzPlaceHolder="请选择状态">
                <nz-option [nzValue]="'pending'" nzLabel="待处理"></nz-option>
                <nz-option [nzValue]="'assigned'" nzLabel="已指派"></nz-option>
                <nz-option [nzValue]="'in_progress'" nzLabel="进行中"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="4" nzRequired>优先级</nz-form-label>
            <nz-form-control [nzSpan]="20" nzErrorTip="请选择优先级">
              <nz-select formControlName="priority" nzPlaceHolder="请选择优先级">
                <nz-option [nzValue]="'low'" nzLabel="低"></nz-option>
                <nz-option [nzValue]="'medium'" nzLabel="中"></nz-option>
                <nz-option [nzValue]="'high'" nzLabel="高"></nz-option>
                <nz-option [nzValue]="'urgent'" nzLabel="紧急"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="4">计划开始日期</nz-form-label>
            <nz-form-control [nzSpan]="20">
              <nz-date-picker formControlName="plannedStartDate" nzFormat="yyyy-MM-dd" style="width: 100%;"></nz-date-picker>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="4">计划结束日期</nz-form-label>
            <nz-form-control [nzSpan]="20">
              <nz-date-picker formControlName="plannedEndDate" nzFormat="yyyy-MM-dd" style="width: 100%;"></nz-date-picker>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="4">进度 (%)</nz-form-label>
            <nz-form-control [nzSpan]="20">
              <nz-input-number
                formControlName="progressPercentage"
                [nzMin]="0"
                [nzMax]="100"
                [nzStep]="1"
                style="width: 100%;"
              ></nz-input-number>
            </nz-form-control>
          </nz-form-item>
        </form>
      }
    </nz-card>
  `
})
export class TaskFormComponent implements OnInit {
  readonly taskService = inject(TaskService);
  readonly blueprintService = inject(BlueprintService);
  private readonly authFacade = inject(AuthFacade);
  private readonly contextFacade = inject(WorkspaceContextFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly fb = inject(FormBuilder);

  readonly isEdit = signal<boolean>(false);
  readonly taskId = signal<string>('');
  readonly isUserContext = computed(() => this.contextFacade.contextType() === 'user');
  readonly contextType = computed(() => this.contextFacade.contextType());
  form!: FormGroup;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit.set(!!id);
    if (id) {
      this.taskId.set(id);
    }

    this.initForm();
    this.loadBlueprints();

    if (this.isEdit()) {
      this.loadTask();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      blueprintId: [null, [Validators.required]],
      title: ['', [Validators.required]],
      description: [''],
      taskType: ['task', [Validators.required]],
      status: ['pending', [Validators.required]],
      priority: ['medium', [Validators.required]],
      plannedStartDate: [null],
      plannedEndDate: [null],
      progressPercentage: [0]
    });
  }

  async loadBlueprints(): Promise<void> {
    try {
      await this.blueprintService.loadBlueprints();
    } catch (error) {
      this.message.error('加载蓝图列表失败');
    }
  }

  async loadTask(): Promise<void> {
    const id = this.taskId();
    if (!id) return;

    try {
      const detail = await this.taskService.loadTaskById(id);
      if (detail) {
        this.form.patchValue({
          blueprintId: detail.blueprint_id,
          title: detail.title,
          description: detail.description || '',
          taskType: detail.task_type,
          status: detail.status,
          priority: detail.priority,
          plannedStartDate: detail.planned_start_date ? new Date(detail.planned_start_date) : null,
          plannedEndDate: detail.planned_end_date ? new Date(detail.planned_end_date) : null,
          progressPercentage: detail.progress_percentage || 0
        });
      }
    } catch (error) {
      this.message.error('加载任务失败');
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    // 获取当前用户ID（创建任务时必填字段）
    const currentUserId = this.authFacade.userId();
    if (!currentUserId) {
      this.message.error('无法获取当前用户信息，请重新登录');
      return;
    }

    const formValue = this.form.value;
    const taskData: TaskInsert | TaskUpdate = {
      blueprint_id: formValue.blueprintId,
      title: formValue.title,
      description: formValue.description || null,
      task_type: formValue.taskType,
      status: formValue.status,
      priority: formValue.priority,
      planned_start_date: formValue.plannedStartDate ? formValue.plannedStartDate.toISOString() : null,
      planned_end_date: formValue.plannedEndDate ? formValue.plannedEndDate.toISOString() : null,
      progress_percentage: formValue.progressPercentage || 0,
      created_by: currentUserId // 设置创建者ID（必填字段）
    };

    try {
      if (this.isEdit()) {
        await this.taskService.updateTask(this.taskId(), taskData as TaskUpdate);
        this.message.success('任务更新成功');
      } else {
        await this.taskService.createTask(taskData as TaskInsert);
        this.message.success('任务创建成功');
      }
      // 导航到列表页面，传递蓝图ID作为查询参数
      const blueprintId = formValue.blueprintId;
      if (blueprintId) {
        this.router.navigate(['/tasks/list'], {
          queryParams: { blueprintId }
        });
      } else {
        this.router.navigate(['/tasks/list']);
      }
    } catch (error) {
      console.error('Task operation error:', error);
      const errorMessage = error instanceof Error ? error.message : '操作失败';
      this.message.error(this.isEdit() ? `任务更新失败：${errorMessage}` : `任务创建失败：${errorMessage}`);
    }
  }

  cancel(): void {
    this.router.navigate(['/tasks/list']);
  }
}
