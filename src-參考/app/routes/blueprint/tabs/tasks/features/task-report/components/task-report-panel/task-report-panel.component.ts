/**
 * Task Report Panel Component
 *
 * 顯示藍圖施工日誌列表並提供新增 / 編輯 / 刪除功能，
 * 內部整合 TaskReportFacade 與 TaskDailyReportFormComponent。
 */

import { ChangeDetectionStrategy, Component, effect, inject, input, signal, computed } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import type { BlueprintDailyReport, BlueprintMemberWithUser } from '@shared/models/blueprint.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { TaskReportFacade } from '../../../../shared/state/task-report.facade';
import { TaskDailyReportFormComponent } from '../daily-report-form/daily-report-form.component';

@Component({
  selector: 'task-report-panel',
  standalone: true,
  imports: [SHARED_IMPORTS, TaskDailyReportFormComponent],
  templateUrl: './task-report-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskReportPanelComponent {
  private readonly facade = inject(TaskReportFacade);
  private readonly modal = inject(NzModalService);
  private readonly msg = inject(NzMessageService);

  readonly blueprintId = input.required<string>();
  readonly members = input<BlueprintMemberWithUser[]>([]);

  readonly reports = this.facade.reports;
  readonly loading = computed(() => this.facade.loading());

  readonly showForm = signal(false);
  readonly editingReport = signal<BlueprintDailyReport | null>(null);

  readonly totalReports = computed(() => this.reports().length);
  readonly todayReports = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.reports().filter(report => report.date === today).length;
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
    this.editingReport.set(null);
    this.showForm.set(true);
  }

  editReport(report: BlueprintDailyReport): void {
    this.editingReport.set(report);
    this.showForm.set(true);
  }

  onFormSaved(): void {
    this.showForm.set(false);
    this.editingReport.set(null);
  }

  onFormCancelled(): void {
    this.showForm.set(false);
    this.editingReport.set(null);
  }

  async deleteReport(report: BlueprintDailyReport): Promise<void> {
    const blueprintId = this.blueprintId();
    if (!blueprintId) {
      return;
    }

    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除 ${report.date} 的施工日誌嗎？`,
      nzOkDanger: true,
      nzOnOk: async () => {
        const success = await this.facade.delete(report.id, blueprintId);
        if (success) {
          this.msg.success('施工日誌已刪除');
        }
      }
    });
  }

  trackByReportId(_index: number, report: BlueprintDailyReport): string {
    return report.id;
  }

  getParticipantNames(participants: string[] | null | undefined): string {
    if (!participants || participants.length === 0) {
      return '無';
    }
    const memberMap = new Map(this.members().map(member => [member.user_id, member]));
    return participants
      .map(id => {
        const member = memberMap.get(id);
        return member?.user.display_name || member?.user.email || id;
      })
      .join('、');
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
