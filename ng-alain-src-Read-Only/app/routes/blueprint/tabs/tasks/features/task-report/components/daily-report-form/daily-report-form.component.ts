/**
 * Task Daily Report Form Component
 *
 * 供任務層建立 / 編輯藍圖每日施工日誌。
 */

import { ChangeDetectionStrategy, Component, effect, inject, input, output, computed } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '@shared';
import type { BlueprintDailyReport, BlueprintMemberWithUser } from '@shared/models/blueprint.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import type { NzSelectOptionInterface } from 'ng-zorro-antd/select';

import { CaptureDailyReportInput, UpdateDailyReportCaptureInput } from '../../../../shared/domain/task-data-capture.service';
import { TaskReportFacade } from '../../../../shared/state/task-report.facade';

interface DailyReportFormControls {
  date: FormControl<Date>;
  weather: FormControl<string>;
  content: FormControl<string>;
  progress_percentage: FormControl<number | null>;
  participants: FormControl<string[]>;
  photos: FormControl<string>;
  issues: FormControl<string>;
  notes: FormControl<string>;
}

type DailyReportFormGroup = FormGroup<DailyReportFormControls>;

@Component({
  selector: 'task-daily-report-form',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './daily-report-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDailyReportFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(TaskReportFacade);
  private readonly msg = inject(NzMessageService);

  readonly blueprintId = input.required<string>();
  readonly editingReport = input<BlueprintDailyReport | null>(null);
  readonly members = input<BlueprintMemberWithUser[]>([]);

  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly loading = computed(() => this.facade.loading());
  readonly memberOptions = computed<NzSelectOptionInterface[]>(() =>
    this.members().map(member => ({
      label: member.user?.display_name || member.user?.email || member.user_id,
      value: member.user_id
    }))
  );

  readonly form: DailyReportFormGroup = this.fb.group<DailyReportFormControls>({
    date: this.fb.control(new Date(), { nonNullable: true, validators: [Validators.required] }),
    weather: this.fb.control('', { nonNullable: true }),
    content: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    progress_percentage: this.fb.control<number | null>(null, [Validators.min(0), Validators.max(100)]),
    participants: this.fb.control<string[]>([], { nonNullable: true }),
    photos: this.fb.control('', { nonNullable: true }),
    issues: this.fb.control('', { nonNullable: true }),
    notes: this.fb.control('', { nonNullable: true })
  });

  constructor() {
    effect(() => {
      const report = this.editingReport();
      if (!report) {
        this.resetForm();
        return;
      }

      this.form.reset({
        date: new Date(report.date),
        weather: report.weather ?? '',
        content: report.content,
        progress_percentage: report.progress_percentage ?? null,
        participants: report.participants ?? [],
        photos: (report.photos ?? []).join(', '),
        issues: report.issues ?? '',
        notes: report.notes ?? ''
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
    const editing = this.editingReport();
    const value = this.form.getRawValue();

    const date = value.date;
    const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (selectedDate > todayNormalized) {
      this.msg.error('日期不能晚於今天');
      return;
    }

    const photosArray = value.photos
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const payloadBase: Omit<CaptureDailyReportInput, 'blueprintId'> = {
      date: selectedDate.toISOString().split('T')[0],
      weather: value.weather || undefined,
      content: value.content,
      progress_percentage: value.progress_percentage ?? undefined,
      participants: value.participants?.length ? value.participants : undefined,
      photos: photosArray.length ? photosArray : undefined,
      issues: value.issues || undefined,
      notes: value.notes || undefined
    };

    const success = editing
      ? await this.facade.update({
          reportId: editing.id,
          blueprintId,
          ...payloadBase
        } as UpdateDailyReportCaptureInput)
      : await this.facade.create({
          blueprintId,
          ...payloadBase
        });

    if (!success) {
      this.msg.error('送出施工日誌失敗');
      return;
    }

    this.msg.success(editing ? '施工日誌已更新' : '施工日誌已建立');
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
      date: new Date(),
      weather: '',
      content: '',
      progress_percentage: null,
      participants: [],
      photos: '',
      issues: '',
      notes: ''
    });
  }

  trackMemberById(_index: number, member: BlueprintMemberWithUser): string {
    return member.user_id;
  }
}
