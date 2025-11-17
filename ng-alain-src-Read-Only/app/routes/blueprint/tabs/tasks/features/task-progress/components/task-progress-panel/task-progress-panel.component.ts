/**
 * Task Progress Panel Component
 *
 * 提供藍圖進度與里程碑的任務層資料採集 UI，
 * 整合 TaskProgressBoardFacade 與 TaskDataCaptureService。
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@core';
import { SHARED_IMPORTS } from '@shared';
import type { BlueprintMilestone, BlueprintProgress } from '@shared/models';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { TaskProgressBoardFacade } from '../../../../shared/state/task-progress-board.facade';

interface ProgressFormControls {
  stage: FormControl<string>;
  progress_percentage: FormControl<number>;
  notes: FormControl<string>;
}

interface MilestoneFormControls {
  name: FormControl<string>;
  description: FormControl<string>;
  target_date: FormControl<Date | null>;
  order_index: FormControl<number>;
}

type ProgressFormGroup = FormGroup<ProgressFormControls>;
type MilestoneFormGroup = FormGroup<MilestoneFormControls>;

@Component({
  selector: 'task-progress-panel',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './task-progress-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskProgressPanelComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(TaskProgressBoardFacade);
  private readonly msg = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly userService = inject(UserService);

  readonly blueprintId = input.required<string>();

  readonly progressRecords = this.facade.progressRecords;
  readonly milestones = this.facade.milestones;
  readonly loading = computed(() => this.facade.loading());
  readonly savingProgress = computed(() => this.facade.savingProgress());
  readonly savingMilestone = computed(() => this.facade.savingMilestone());

  readonly showProgressForm = signal(false);
  readonly showMilestoneForm = signal(false);
  readonly editingMilestone = signal<BlueprintMilestone | null>(null);

  readonly progressForm: ProgressFormGroup = this.fb.group<ProgressFormControls>({
    stage: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    progress_percentage: this.fb.control<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)]
    }),
    notes: this.fb.control<string>('', { nonNullable: true })
  });

  readonly milestoneForm: MilestoneFormGroup = this.fb.group<MilestoneFormControls>({
    name: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: this.fb.control<string>('', { nonNullable: true }),
    target_date: this.fb.control<Date | null>(null),
    order_index: this.fb.control<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] })
  });

  readonly sortedProgressRecords = computed(() =>
    [...this.progressRecords()].sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
  );

  readonly sortedMilestones = computed(() =>
    [...this.milestones()].sort((a, b) => {
      if (a.order_index !== b.order_index) {
        return a.order_index - b.order_index;
      }
      const aDate = a.target_date ? new Date(a.target_date).getTime() : Number.MAX_SAFE_INTEGER;
      const bDate = b.target_date ? new Date(b.target_date).getTime() : Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    })
  );

  readonly progressSummary = computed(() => {
    const records = this.sortedProgressRecords();
    const latest = records[0] ?? null;
    const previous = records[1] ?? null;
    const percent = latest?.progress_percentage ?? 0;
    const change = latest && previous ? latest.progress_percentage - previous.progress_percentage : 0;
    const trend: 'up' | 'down' | 'flat' = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
    const lastUpdatedAt = latest ? new Date(latest.recorded_at) : null;

    return {
      percent,
      change,
      trend,
      lastUpdatedAt,
      stage: latest?.stage ?? '',
      latest,
      totalRecords: records.length
    };
  });

  readonly milestoneStats = computed(() => {
    const list = this.milestones();
    if (!list.length) {
      return { total: 0, completed: 0, inProgress: 0, planned: 0, cancelled: 0, averageProgress: 0 };
    }

    let completed = 0;
    let inProgress = 0;
    let planned = 0;
    let cancelled = 0;
    let totalProgress = 0;

    for (const milestone of list) {
      totalProgress += milestone.progress_percentage ?? 0;
      switch (milestone.status) {
        case 'completed':
          completed += 1;
          break;
        case 'in-progress':
          inProgress += 1;
          break;
        case 'planned':
          planned += 1;
          break;
        case 'cancelled':
          cancelled += 1;
          break;
      }
    }

    return {
      total: list.length,
      completed,
      inProgress,
      planned,
      cancelled,
      averageProgress: totalProgress / list.length
    };
  });

  readonly averageMilestoneProgress = computed(() => Math.round(this.milestoneStats().averageProgress || 0));

  constructor() {
    effect(() => {
      const id = this.blueprintId();
      if (id) {
        void this.facade.load(id);
      } else {
        this.progressForm.reset();
        this.milestoneForm.reset();
      }
    });

    effect(() => {
      const error = this.facade.error();
      if (error) {
        this.msg.error(error);
        this.facade.clearError();
      }
    });
  }

  openProgressForm(): void {
    const summary = this.progressSummary();
    this.progressForm.reset({
      stage: summary.stage,
      progress_percentage: summary.percent,
      notes: ''
    });
    this.showProgressForm.set(true);
  }

  openMilestoneForm(milestone?: BlueprintMilestone): void {
    if (milestone) {
      this.editingMilestone.set(milestone);
      this.milestoneForm.patchValue({
        name: milestone.name,
        description: milestone.description ?? '',
        target_date: milestone.target_date ? new Date(milestone.target_date) : null,
        order_index: milestone.order_index
      });
    } else {
      this.editingMilestone.set(null);
      this.milestoneForm.reset({
        name: '',
        description: '',
        target_date: null,
        order_index: this.milestones().length
      });
    }
    this.showMilestoneForm.set(true);
  }

  closeProgressForm(): void {
    this.showProgressForm.set(false);
  }

  closeMilestoneForm(): void {
    this.showMilestoneForm.set(false);
    this.editingMilestone.set(null);
  }

  async submitProgress(): Promise<void> {
    if (this.progressForm.invalid) {
      Object.values(this.progressForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const blueprintId = this.blueprintId();
    const { data: currentUser } = await this.userService.getCurrentUser();
    if (!currentUser) {
      this.msg.error('請先登入');
      return;
    }

    const value = this.progressForm.getRawValue();
    const success = await this.facade.recordProgress({
      blueprintId,
      stage: value.stage,
      progressPercentage: value.progress_percentage,
      notes: value.notes || undefined,
      recordedBy: currentUser.id
    });

    if (success) {
      this.msg.success('進度紀錄已更新');
      this.closeProgressForm();
    }
  }

  async submitMilestone(): Promise<void> {
    if (this.milestoneForm.invalid) {
      Object.values(this.milestoneForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const blueprintId = this.blueprintId();
    const value = this.milestoneForm.value;
    const editing = this.editingMilestone();

    const payloadDate = value.target_date ? new Date(value.target_date).toISOString() : undefined;

    const success = editing
      ? await this.facade.updateMilestone({
          milestoneId: editing.id,
          blueprintId,
          name: value.name ?? editing.name,
          description: value.description || undefined,
          target_date: payloadDate,
          order_index: value.order_index ?? editing.order_index
        })
      : await this.facade.createMilestone({
          blueprint_id: blueprintId,
          name: value.name ?? '',
          description: value.description || undefined,
          target_date: payloadDate,
          order_index: value.order_index ?? this.milestones().length
        });

    if (success) {
      this.msg.success(editing ? '里程碑已更新' : '里程碑已建立');
      this.closeMilestoneForm();
    }
  }

  confirmDeleteMilestone(milestone: BlueprintMilestone): void {
    const blueprintId = this.blueprintId();
    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除里程碑「${milestone.name}」嗎？`,
      nzOkDanger: true,
      nzOnOk: async () => {
        const success = await this.facade.deleteMilestone(blueprintId, milestone.id);
        if (success) {
          this.msg.success('里程碑已刪除');
        }
      }
    });
  }

  getTimelineColor(delta: number, percent: number): string {
    if (delta > 0) {
      return percent >= 80 ? 'green' : 'blue';
    }
    if (delta < 0) {
      return 'red';
    }
    if (percent >= 80) {
      return 'green';
    }
    if (percent >= 50) {
      return 'blue';
    }
    return 'gray';
  }

  trackProgressById(_index: number, record: BlueprintProgress): string {
    return record.id;
  }

  trackMilestoneById(_index: number, milestone: BlueprintMilestone): string {
    return milestone.id;
  }

  getMilestoneStatusColor(status: BlueprintMilestone['status']): string {
    const colors: Record<BlueprintMilestone['status'], string> = {
      planned: 'default',
      'in-progress': 'processing',
      completed: 'success',
      cancelled: 'error'
    };
    return colors[status] ?? 'default';
  }
}
