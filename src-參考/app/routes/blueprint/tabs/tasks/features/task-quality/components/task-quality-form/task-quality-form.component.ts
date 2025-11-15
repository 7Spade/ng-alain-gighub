import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '@shared';
import type { BlueprintMemberWithUser, BlueprintQualityCheckWithUsers } from '@shared/models/blueprint.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import type { NzSelectOptionInterface } from 'ng-zorro-antd/select';

import { CaptureQualityCheckInput, UpdateQualityCheckCaptureInput } from '../../../../shared/domain/task-data-capture.service';
import { TaskQualityFacade } from '../../../../shared/state/task-quality.facade';

interface QualityFormControls {
  title: FormControl<string>;
  description: FormControl<string>;
  category: FormControl<BlueprintQualityCheckWithUsers['category']>;
  status: FormControl<BlueprintQualityCheckWithUsers['status']>;
  score: FormControl<number | null>;
  inspector_id: FormControl<string | null>;
  check_date: FormControl<Date | null>;
  next_check_date: FormControl<Date | null>;
  notes: FormControl<string>;
}

type QualityFormGroup = FormGroup<QualityFormControls>;

@Component({
  selector: 'task-quality-form',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './task-quality-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskQualityFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(TaskQualityFacade);
  private readonly msg = inject(NzMessageService);

  readonly blueprintId = input.required<string>();
  readonly members = input<BlueprintMemberWithUser[]>([]);
  readonly editingQuality = input<BlueprintQualityCheckWithUsers | null>(null);

  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly loading = computed(() => this.facade.saving());
  readonly memberOptions = computed<NzSelectOptionInterface[]>(() =>
    this.members().map(member => ({
      label: member.user?.display_name || member.user?.email || member.user_id,
      value: member.user_id
    }))
  );

  readonly form: QualityFormGroup = this.fb.group<QualityFormControls>({
    title: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    description: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    category: this.fb.control<BlueprintQualityCheckWithUsers['category']>('safety', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    status: this.fb.control<BlueprintQualityCheckWithUsers['status']>('pending', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    score: this.fb.control<number | null>(null, { validators: [Validators.min(0), Validators.max(100)] }),
    inspector_id: this.fb.control<string | null>(null),
    check_date: this.fb.control<Date | null>(null),
    next_check_date: this.fb.control<Date | null>(null),
    notes: this.fb.control<string>('', { nonNullable: true })
  });

  constructor() {
    effect(() => {
      const quality = this.editingQuality();
      if (!quality) {
        this.resetForm();
        return;
      }

      this.form.reset({
        title: quality.title,
        description: quality.description,
        category: quality.category,
        status: quality.status,
        score: quality.score ?? null,
        inspector_id: quality.inspector_id ?? null,
        check_date: quality.check_date ? new Date(quality.check_date) : null,
        next_check_date: quality.next_check_date ? new Date(quality.next_check_date) : null,
        notes: quality.notes ?? ''
      });
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const blueprintId = this.blueprintId();
    const editing = this.editingQuality();
    const value = this.form.getRawValue();

    const resolvedInspectorId = value.inspector_id ?? editing?.inspector_id ?? null;
    if (!resolvedInspectorId) {
      this.msg.error('請選擇檢查員');
      return;
    }

    const payloadBase = {
      title: value.title,
      description: value.description,
      category: value.category,
      status: value.status,
      score: value.score ?? undefined,
      inspector_id: resolvedInspectorId,
      check_date: value.check_date ? value.check_date.toISOString() : undefined,
      next_check_date: value.next_check_date ? value.next_check_date.toISOString() : undefined,
      notes: value.notes?.trim() ? value.notes.trim() : undefined
    } as const;

    const success = editing
      ? await this.facade.update({
          qualityCheckId: editing.id,
          blueprintId,
          ...payloadBase
        } satisfies UpdateQualityCheckCaptureInput)
      : await this.facade.create({
          blueprintId,
          attachments: [],
          ...payloadBase
        } satisfies CaptureQualityCheckInput);

    if (!success) {
      this.msg.error(editing ? '更新品質檢查失敗' : '建立品質檢查失敗');
      return;
    }

    this.msg.success(editing ? '品質檢查已更新' : '品質檢查已建立');
    if (!editing) {
      this.resetForm();
    }
    this.saved.emit();
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  private resetForm(): void {
    this.form.reset({
      title: '',
      description: '',
      category: 'safety',
      status: 'pending',
      score: null,
      inspector_id: null,
      check_date: null,
      next_check_date: null,
      notes: ''
    });
  }

  trackMemberById(_index: number, member: BlueprintMemberWithUser): string {
    return member.user_id;
  }
}
