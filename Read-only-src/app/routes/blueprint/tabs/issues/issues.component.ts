import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BlueprintIssueService, BlueprintService, OrganizationContextService } from '@core';
import { STColumn } from '@delon/abc/st';
import type { BlueprintIssue, CreateIssueInput, UpdateIssueInput } from '@shared';
import { SHARED_IMPORTS } from '@shared';
import { IssueViewModel } from '@tasks/shared/domain/issues.domain';
import { TaskIssuesFacade } from '@tasks/shared/state';
import { NzMessageService } from 'ng-zorro-antd/message';
import { combineLatest, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

type IssueStatus = BlueprintIssue['status'];
type IssuePriority = BlueprintIssue['priority'];
type IssueSeverity = BlueprintIssue['severity'];

interface IssueFormControls {
  title: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<IssueStatus>;
  priority: FormControl<IssuePriority>;
  severity: FormControl<IssueSeverity>;
  assigned_to: FormControl<string | null>;
  labels: FormControl<string[]>;
  due_date: FormControl<Date | null>;
}

type IssueFormGroup = FormGroup<IssueFormControls>;

@Component({
  selector: 'app-blueprint-issues',
  standalone: true,
  templateUrl: './issues.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class BlueprintIssuesComponent {
  // ========== 依賴注入 ==========
  private readonly blueprintService = inject(BlueprintService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly msg = inject(NzMessageService);
  private readonly fb = inject(FormBuilder);
  private readonly issueService = inject(BlueprintIssueService);
  private readonly taskIssuesFacade = inject(TaskIssuesFacade);

  // ========== 路由參數處理 ==========
  private readonly parentRouteParams = toSignal(this.route.parent?.params ?? of({ org: '', slug: '' }), {
    initialValue: { org: '', slug: '' }
  });

  private readonly blueprintSlug = computed(() => this.parentRouteParams()?.['slug'] || null);

  // ========== Blueprint ID 計算 ==========
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

  // ========== Blueprint 資料載入 ==========
  readonly blueprint = toSignal(
    toObservable(this.blueprintId).pipe(
      switchMap(blueprintId => {
        if (!blueprintId) {
          return of(null);
        }
        return from(this.blueprintService.getBlueprintById(blueprintId)).pipe(
          switchMap(({ data, error }) => {
            if (error || !data) {
              this.msg.error(error?.message || '獲取藍圖資料失敗');
              return of(null);
            }
            return of(data);
          }),
          catchError(error => {
            this.msg.error(error?.message || '載入藍圖資料失敗');
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  // ========== 載入狀態 ==========
  readonly loading = computed(() => {
    const blueprintId = this.blueprintId();
    const blueprint = this.blueprint();
    const issuesLoading = this.taskIssuesFacade.loading();
    return (blueprintId !== null && blueprint === null) || issuesLoading;
  });

  // ========== 組件狀態 ==========
  readonly issues = this.taskIssuesFacade.issues;
  readonly members = this.taskIssuesFacade.members;

  // 計算屬性
  readonly openCount = computed(() => this.issues().filter(i => i.status === 'open').length);
  readonly inProgressCount = computed(() => this.issues().filter(i => i.status === 'in-progress').length);
  readonly resolvedCount = computed(() => this.issues().filter(i => i.status === 'resolved' || i.status === 'closed').length);

  // 表單
  readonly issueForm: IssueFormGroup = this.createIssueForm();
  readonly showIssueModal = signal(false);
  readonly editingIssue = signal<IssueViewModel | null>(null);

  // 篩選器
  readonly statusFilter = signal<'all' | IssueStatus>('all');
  readonly priorityFilter = signal<'all' | IssuePriority>('all');
  readonly severityFilter = signal<'all' | IssueSeverity>('all');
  readonly assignedFilter = signal<'all' | string>('all');
  readonly searchText = signal('');

  // 計算過濾後的問題
  readonly filteredIssues = computed(() => {
    let filtered = [...this.issues()];
    const search = this.searchText();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    const severity = this.severityFilter();
    const assigned = this.assignedFilter();

    // 搜尋過濾
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        issue =>
          issue.title.toLowerCase().includes(searchLower) ||
          issue.description.toLowerCase().includes(searchLower) ||
          (issue.labels ?? []).some(label => label.toLowerCase().includes(searchLower))
      );
    }

    // 狀態過濾
    if (status !== 'all') {
      filtered = filtered.filter(issue => issue.status === status);
    }

    // 優先級過濾
    if (priority !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priority);
    }

    // 嚴重性過濾
    if (severity !== 'all') {
      filtered = filtered.filter(issue => issue.severity === severity);
    }

    // 負責人過濾
    if (assigned !== 'all') {
      if (assigned === 'none') {
        filtered = filtered.filter(issue => !issue.assigned_to);
      } else {
        filtered = filtered.filter(issue => issue.assigned_to === assigned);
      }
    }

    return filtered;
  });

  // 表格列
  readonly columns: STColumn[] = [
    { title: '標題', index: 'title', render: 'title' },
    { title: '狀態', render: 'status' },
    { title: '優先級', render: 'priority' },
    { title: '嚴重性', render: 'severity' },
    { title: '負責人', render: 'assigned' },
    { title: '創建時間', index: 'created_at', type: 'date' },
    { title: '操作', render: 'actions' }
  ];

  constructor() {
    effect(() => {
      const blueprint = this.blueprint();
      if (blueprint?.id) {
        void this.taskIssuesFacade.load(blueprint.id);
      } else {
        this.taskIssuesFacade.clear();
      }
    });

    effect(() => {
      const error = this.taskIssuesFacade.error();
      if (error) {
        this.msg.error(error);
        this.taskIssuesFacade.acknowledgeError();
      }
    });
  }

  // ========== 私有方法 ==========
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

  private createIssueForm(): IssueFormGroup {
    return this.fb.group<IssueFormControls>({
      title: this.fb.control('', {
        validators: [Validators.required, Validators.maxLength(200)],
        nonNullable: true
      }),
      description: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      status: this.fb.control<IssueStatus>('open', {
        validators: [Validators.required],
        nonNullable: true
      }),
      priority: this.fb.control<IssuePriority>('medium', {
        validators: [Validators.required],
        nonNullable: true
      }),
      severity: this.fb.control<IssueSeverity>('medium', {
        validators: [Validators.required],
        nonNullable: true
      }),
      assigned_to: this.fb.control<string | null>(null),
      labels: this.fb.control<string[]>([], { nonNullable: true }),
      due_date: this.fb.control<Date | null>(null)
    });
  }

  private getDefaultFormValue(): IssueFormGroup['value'] {
    return {
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      severity: 'medium',
      assigned_to: null,
      labels: [],
      due_date: null
    };
  }

  private resetForm(): void {
    this.issueForm.reset(this.getDefaultFormValue());
    this.issueForm.markAsPristine();
    this.issueForm.markAsUntouched();
  }

  // ========== 公開方法 ==========
  openCreateIssueModal(): void {
    this.editingIssue.set(null);
    this.resetForm();
    this.showIssueModal.set(true);
  }

  editIssue(issue: IssueViewModel): void {
    this.editingIssue.set(issue);
    this.issueForm.setValue({
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      severity: issue.severity,
      assigned_to: issue.assigned_to ?? null,
      labels: issue.labels ?? [],
      due_date: issue.due_date ? new Date(issue.due_date) : null
    });
    this.showIssueModal.set(true);
  }

  onFilterChange(): void {
    // filteredIssues computed 會自動響應篩選器變化
  }

  onSearch(): void {
    // filteredIssues computed 會自動響應 searchText 變化
  }

  async onCreateSubmit(): Promise<void> {
    if (this.issueForm.invalid) {
      Object.values(this.issueForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const blueprint = this.blueprint();
    if (!blueprint) {
      this.msg.error('無法獲取藍圖資訊');
      return;
    }
    const editing = this.editingIssue();

    try {
      const formValue = this.issueForm.getRawValue();
      const dueDateIso = formValue.due_date ? formValue.due_date.toISOString() : null;

      if (editing) {
        const updatePayload: UpdateIssueInput = {
          title: formValue.title,
          description: formValue.description,
          status: formValue.status,
          priority: formValue.priority,
          severity: formValue.severity,
          assigned_to: formValue.assigned_to ?? null,
          labels: formValue.labels,
          due_date: dueDateIso
        };

        const { error } = await this.issueService.updateIssue(editing.id, updatePayload);
        if (error) {
          this.msg.error(error.message || '更新問題失敗');
          return;
        }

        this.msg.success('問題已更新');
      } else {
        const createPayload: CreateIssueInput = {
          blueprint_id: blueprint.id,
          title: formValue.title,
          description: formValue.description,
          status: formValue.status,
          priority: formValue.priority,
          severity: formValue.severity,
          assigned_to: formValue.assigned_to ?? undefined,
          labels: formValue.labels,
          due_date: dueDateIso ?? undefined
        };

        const { error } = await this.issueService.createIssue(createPayload);
        if (error) {
          this.msg.error(error.message || '創建問題失敗');
          return;
        }

        this.msg.success('問題已創建');
      }

      await this.taskIssuesFacade.load(blueprint.id);

      this.showIssueModal.set(false);
      this.resetForm();
      this.editingIssue.set(null);
    } catch (error) {
      this.msg.error(editing ? '更新問題失敗' : '創建問題失敗');
      console.error('Failed to save issue:', error);
    }
  }

  onCancel(): void {
    this.showIssueModal.set(false);
    this.resetForm();
    this.editingIssue.set(null);
  }

  getStatusColor(status: IssueStatus): string {
    const colors: Record<IssueStatus, string> = {
      open: 'blue',
      'in-progress': 'processing',
      resolved: 'success',
      closed: 'default',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  }

  getStatusText(status: IssueStatus): string {
    const texts: Record<IssueStatus, string> = {
      open: '開啟',
      'in-progress': '處理中',
      resolved: '已解決',
      closed: '已關閉',
      cancelled: '已取消'
    };
    return texts[status] || status;
  }

  getPriorityColor(priority: IssuePriority): string {
    const colors: Record<IssuePriority, string> = {
      low: 'default',
      medium: 'blue',
      high: 'orange',
      critical: 'red'
    };
    return colors[priority] || 'default';
  }

  getPriorityText(priority: IssuePriority): string {
    const texts: Record<IssuePriority, string> = {
      low: '低',
      medium: '中',
      high: '高',
      critical: '危急'
    };
    return texts[priority] || priority;
  }

  getSeverityColor(severity: IssueSeverity): string {
    const colors: Record<IssueSeverity, string> = {
      low: 'default',
      medium: 'blue',
      high: 'orange',
      critical: 'red'
    };
    return colors[severity] || 'default';
  }

  getSeverityText(severity: IssueSeverity): string {
    const texts: Record<IssueSeverity, string> = {
      low: '低',
      medium: '中',
      high: '高',
      critical: '危急'
    };
    return texts[severity] || severity;
  }
}
