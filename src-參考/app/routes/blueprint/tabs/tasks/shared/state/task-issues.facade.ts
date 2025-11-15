import { Injectable, computed, inject, signal } from '@angular/core';
import type { BlueprintMemberWithUser } from '@shared';
import { TaskIssuesService } from '@tasks/features/task-issues/services/domain/task-issues.service';
import type { IssueViewModel } from '@tasks/shared/domain/issues.domain';

@Injectable({
  providedIn: 'root'
})
export class TaskIssuesFacade {
  private readonly service = inject(TaskIssuesService);

  private readonly blueprintIdSignal = signal<string | null>(null);
  private readonly issuesSignal = signal<IssueViewModel[]>([]);
  private readonly membersSignal = signal<BlueprintMemberWithUser[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly issues = this.issuesSignal.asReadonly();
  readonly members = this.membersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly hasIssues = computed(() => this.issuesSignal().length > 0);

  async load(blueprintId: string): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.blueprintIdSignal.set(blueprintId);

    try {
      const result = await this.service.loadByBlueprintId(blueprintId);

      if (result.success) {
        this.issuesSignal.set(result.issues);
        this.membersSignal.set(result.members);
        return true;
      }

      this.issuesSignal.set([]);
      this.membersSignal.set([]);
      this.errorSignal.set(result.error);
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async refresh(): Promise<boolean> {
    const blueprintId = this.blueprintIdSignal();
    if (!blueprintId) {
      this.errorSignal.set('缺少藍圖識別碼');
      return false;
    }
    return this.load(blueprintId);
  }

  clear(): void {
    this.blueprintIdSignal.set(null);
    this.issuesSignal.set([]);
    this.membersSignal.set([]);
    this.errorSignal.set(null);
    this.loadingSignal.set(false);
  }

  acknowledgeError(): void {
    this.errorSignal.set(null);
  }
}
