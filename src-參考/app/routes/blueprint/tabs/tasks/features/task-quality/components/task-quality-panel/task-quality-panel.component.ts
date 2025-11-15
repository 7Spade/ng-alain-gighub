import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import type { BlueprintMemberWithUser, BlueprintQualityCheckWithUsers } from '@shared/models/blueprint.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { TaskQualityFacade } from '../../../../shared/state/task-quality.facade';
import { TaskQualityFormComponent } from '../task-quality-form/task-quality-form.component';

@Component({
  selector: 'task-quality-panel',
  standalone: true,
  imports: [SHARED_IMPORTS, TaskQualityFormComponent],
  templateUrl: './task-quality-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskQualityPanelComponent {
  private readonly facade = inject(TaskQualityFacade);
  private readonly modal = inject(NzModalService);
  private readonly msg = inject(NzMessageService);

  readonly blueprintId = input.required<string>();
  readonly members = input<BlueprintMemberWithUser[]>([]);

  readonly qualityChecks = this.facade.qualityChecks;
  readonly loading = computed(() => this.facade.loading());
  readonly saving = computed(() => this.facade.saving());

  readonly showForm = signal(false);
  readonly editingQuality = signal<BlueprintQualityCheckWithUsers | null>(null);

  readonly searchText = signal('');
  readonly categoryFilter = signal<'all' | BlueprintQualityCheckWithUsers['category']>('all');
  readonly statusFilter = signal<'all' | BlueprintQualityCheckWithUsers['status']>('all');

  readonly totalChecks = computed(() => this.qualityChecks().length);
  readonly passedCount = computed(() => this.qualityChecks().filter(q => q.status === 'passed').length);
  readonly inProgressCount = computed(() => this.qualityChecks().filter(q => q.status === 'in-progress' || q.status === 'pending').length);
  readonly failedCount = computed(() => this.qualityChecks().filter(q => q.status === 'failed' || q.status === 'needs-improvement').length);

  readonly filteredQualityChecks = computed(() => {
    let filtered = [...this.qualityChecks()];
    const search = this.searchText();
    const category = this.categoryFilter();
    const status = this.statusFilter();

    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(check => check.title.toLowerCase().includes(lower) || check.description.toLowerCase().includes(lower));
    }

    if (category !== 'all') {
      filtered = filtered.filter(check => check.category === category);
    }

    if (status !== 'all') {
      filtered = filtered.filter(check => check.status === status);
    }

    return filtered;
  });

  constructor() {
    effect(() => {
      const id = this.blueprintId();
      if (id) {
        void this.facade.load(id);
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

  openCreate(): void {
    this.editingQuality.set(null);
    this.showForm.set(true);
  }

  editQuality(check: BlueprintQualityCheckWithUsers): void {
    this.editingQuality.set(check);
    this.showForm.set(true);
  }

  onFormSaved(): void {
    this.showForm.set(false);
    this.editingQuality.set(null);
  }

  onFormCancelled(): void {
    this.showForm.set(false);
    this.editingQuality.set(null);
  }

  onModalVisibleChange(visible: boolean): void {
    if (!visible) {
      this.onFormCancelled();
    }
  }

  async deleteQuality(check: BlueprintQualityCheckWithUsers): Promise<void> {
    const blueprintId = this.blueprintId();
    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除品質檢查「${check.title}」嗎？`,
      nzOkDanger: true,
      nzOnOk: async () => {
        const success = await this.facade.delete(blueprintId, check.id);
        if (success) {
          this.msg.success('品質檢查已刪除');
        }
      }
    });
  }

  setSearch(value: string): void {
    this.searchText.set(value);
  }

  setCategory(value: 'all' | BlueprintQualityCheckWithUsers['category']): void {
    this.categoryFilter.set(value);
  }

  setStatus(value: 'all' | BlueprintQualityCheckWithUsers['status']): void {
    this.statusFilter.set(value);
  }

  formatScore = (percent?: number | null): string => {
    return percent !== undefined && percent !== null ? `${percent}分` : '';
  };

  getCategoryColor(category: BlueprintQualityCheckWithUsers['category']): string {
    const colors: Record<BlueprintQualityCheckWithUsers['category'], string> = {
      safety: 'red',
      structure: 'orange',
      material: 'blue',
      process: 'green',
      documentation: 'purple',
      other: 'default'
    };
    return colors[category] ?? 'default';
  }

  getCategoryText(category: BlueprintQualityCheckWithUsers['category']): string {
    const texts: Record<BlueprintQualityCheckWithUsers['category'], string> = {
      safety: '安全',
      structure: '結構',
      material: '材料',
      process: '工藝',
      documentation: '文檔',
      other: '其他'
    };
    return texts[category] ?? category;
  }

  getStatusColor(status: BlueprintQualityCheckWithUsers['status']): string {
    const colors: Record<BlueprintQualityCheckWithUsers['status'], string> = {
      pending: 'default',
      'in-progress': 'processing',
      passed: 'success',
      failed: 'error',
      'needs-improvement': 'warning'
    };
    return colors[status] ?? 'default';
  }

  getStatusText(status: BlueprintQualityCheckWithUsers['status']): string {
    const texts: Record<BlueprintQualityCheckWithUsers['status'], string> = {
      pending: '待檢查',
      'in-progress': '檢查中',
      passed: '通過',
      failed: '未通過',
      'needs-improvement': '需改進'
    };
    return texts[status] ?? status;
  }

  trackQualityById(_index: number, check: BlueprintQualityCheckWithUsers): string {
    return check.id;
  }
}
