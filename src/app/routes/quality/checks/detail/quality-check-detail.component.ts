import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS, QualityCheckService, QualityCheckStatus, QualityCheckItem } from '@shared';
import type { QualityCheckDetail } from '@shared';

@Component({
  selector: 'app-quality-check-detail',
  imports: [SHARED_IMPORTS],
  templateUrl: './quality-check-detail.component.html',
  styleUrl: './quality-check-detail.component.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QualityCheckDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private qualityCheckService = inject(QualityCheckService);

  // Signals for component state
  qualityCheck = signal<QualityCheckDetail | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  isEditMode = signal<boolean>(false);
  saving = signal<boolean>(false);

  // Typed reactive form
  editForm!: FormGroup<{
    status: FormControl<QualityCheckStatus | null>;
    findings: FormControl<string | null>;
    recommendations: FormControl<string | null>;
  }>;

  // Status options
  statusOptions = [
    { label: '待檢查', value: QualityCheckStatus.PENDING },
    { label: '檢查中', value: QualityCheckStatus.IN_PROGRESS },
    { label: '通過', value: QualityCheckStatus.PASSED },
    { label: '未通過', value: QualityCheckStatus.FAILED },
    { label: '條件通過', value: QualityCheckStatus.CONDITIONAL_PASS }
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadQualityCheck();
  }

  private initForm(): void {
    this.editForm = this.fb.group({
      status: this.fb.control<QualityCheckStatus | null>(QualityCheckStatus.PENDING, Validators.required),
      findings: this.fb.control<string | null>(''),
      recommendations: this.fb.control<string | null>('')
    });
  }

  private async loadQualityCheck(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('缺少品質檢查 ID');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await this.qualityCheckService.getById(id);
      if (data) {
        this.qualityCheck.set(data);
        this.updateForm(data);
      } else {
        this.error.set('找不到品質檢查記錄');
      }
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : '載入失敗');
    } finally {
      this.loading.set(false);
    }
  }

  private updateForm(data: QualityCheckDetail): void {
    this.editForm.patchValue({
      status: (data.status as QualityCheckStatus) || null,
      findings: data.findings || '',
      recommendations: data.recommendations || ''
    });
  }

  toggleEditMode(): void {
    this.isEditMode.set(!this.isEditMode());
    if (!this.isEditMode() && this.qualityCheck()) {
      this.updateForm(this.qualityCheck()!);
    }
  }

  async saveChanges(): Promise<void> {
    if (this.editForm.invalid || !this.qualityCheck()) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const formValue = this.editForm.value;
      await this.qualityCheckService.update(this.qualityCheck()!.id, {
        status: formValue.status ?? undefined,
        findings: formValue.findings || null,
        recommendations: formValue.recommendations || null,
        completedAt:
          formValue.status === QualityCheckStatus.PASSED ||
          formValue.status === QualityCheckStatus.FAILED ||
          formValue.status === QualityCheckStatus.CONDITIONAL_PASS
            ? new Date().toISOString()
            : null
      } as any); // 使用類型斷言，因為 Service 層會處理 snake_case 轉換

      // 重新載入最新資料
      await this.loadQualityCheck();
      this.isEditMode.set(false);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : '儲存失敗');
    } finally {
      this.saving.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/quality/checks']);
  }

  getStatusLabel(status: string | null): string {
    if (!status) return '未知';
    const statusEnum = status as QualityCheckStatus;
    const option = this.statusOptions.find(opt => opt.value === statusEnum);
    return option ? option.label : status;
  }

  getStatusColor(status: string | null): string {
    if (!status) return 'default';
    const statusEnum = status as QualityCheckStatus;
    switch (statusEnum) {
      case QualityCheckStatus.PASSED:
        return 'success';
      case QualityCheckStatus.FAILED:
        return 'error';
      case QualityCheckStatus.CONDITIONAL_PASS:
        return 'warning';
      case QualityCheckStatus.IN_PROGRESS:
        return 'processing';
      default:
        return 'default';
    }
  }

  /**
   * 檢查 checkItems 是否為有效數組
   */
  hasCheckItems(checkItems: unknown[] | null): boolean {
    return checkItems !== null && Array.isArray(checkItems) && checkItems.length > 0;
  }

  /**
   * 獲取 checkItems 數組（確保類型安全）
   */
  getCheckItems(checkItems: unknown[] | null): QualityCheckItem[] {
    if (checkItems === null || !Array.isArray(checkItems)) {
      return [];
    }
    // 類型斷言：假設數組中的項目符合 QualityCheckItem 結構
    return checkItems as QualityCheckItem[];
  }
}
