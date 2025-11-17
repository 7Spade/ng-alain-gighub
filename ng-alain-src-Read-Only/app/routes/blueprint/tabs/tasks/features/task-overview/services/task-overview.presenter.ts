import { computed, effect, inject, signal, type WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BlueprintService, OrganizationContextService } from '@core';
import type { TaskDocumentLink, TaskFlatNode, TaskIdentityComplete, TaskTreeNode } from '@models';
import { TaskRepository } from '@tasks/features/task-detail/services/repository/task.repository';
import { TaskDocumentService } from '@tasks/features/task-document/services/task-document.service';
import {
  TaskFormGroup,
  buildTaskQuantityPayload,
  createTaskFormGroup,
  extractPrimaryTaskQuantity,
  resetTaskFormGroup,
  taskIdentityFormValue,
  taskQuantityFormValue
} from '@tasks/features/task-form/services/task-form.helpers';
import { TaskHierarchyTableState } from '@tasks/features/task-overview/task-hierarchy-table/task-hierarchy-table.state';
import { TaskProgressService } from '@tasks/features/task-progress/services/domain/task-progress.service';
import { TaskTreeBuilderService } from '@tasks/features/task-tree/services/computation/task-tree-builder.service';
import { TaskTreeConfigService } from '@tasks/features/task-tree/services/views/task-tree-config.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import type { NzUploadChangeParam, NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Subscription, combineLatest, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

interface TaskHierarchyRow {
  node: TaskTreeNode;
  depth: number;
}

export abstract class TaskOverviewPresenter {
  // ========== 依賴注入 ==========
  protected readonly blueprintService = inject(BlueprintService);
  protected readonly orgContext = inject(OrganizationContextService);
  protected readonly route = inject(ActivatedRoute);
  protected readonly message = inject(NzMessageService);
  protected readonly fb = inject(FormBuilder);
  protected readonly modal = inject(NzModalService);
  protected readonly taskRepository = inject(TaskRepository);
  protected readonly treeBuilder = inject(TaskTreeBuilderService);
  protected readonly treeConfigService = inject(TaskTreeConfigService);
  protected readonly taskProgressService = inject(TaskProgressService);
  protected readonly taskDocumentService = inject(TaskDocumentService);
  private readonly maxImagesPerTask = 4;

  // ========== 路由參數處理 ==========
  protected readonly parentRouteParams = toSignal(this.route.parent?.params ?? of({ org: '', slug: '' }), {
    initialValue: { org: '', slug: '' }
  });

  protected readonly blueprintSlug = computed(() => this.parentRouteParams()?.['slug'] || null);

  // ========== Blueprint ID 計算 ==========
  protected readonly blueprintId = toSignal(
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
              this.message.error(error?.message || '獲取藍圖資料失敗');
              return of(null);
            }
            return of(data);
          }),
          catchError(error => {
            this.message.error(error?.message || '載入藍圖資料失敗');
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
    return blueprintId !== null && blueprint === null;
  });

  // ========== 組件狀態 ==========
  readonly tasksLoading = signal(false);
  readonly taskTree = signal<TaskTreeNode[]>([]);
  readonly allTasks = signal<TaskIdentityComplete[]>([]);
  readonly taskProgressLoading = signal(false);
  protected readonly taskProgress = signal<Record<string, number>>({});
  readonly quantityFormLoading = signal(false);

  // 表單
  readonly showTaskModal = signal(false);
  readonly editingTask = signal<TaskIdentityComplete | null>(null);
  readonly taskForm: TaskFormGroup = createTaskFormGroup(this.fb);

  // 篩選器
  readonly statusFilter = signal<'all' | 'todo' | 'in-progress' | 'completed' | 'cancelled'>('all');
  readonly priorityFilter = signal<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  readonly assignedFilter = signal<'all' | 'none' | string>('all');
  readonly searchText = signal('');

  // 視圖模式（使用 WritableSignal）
  readonly viewMode = signal<'tree' | 'list'>('tree');

  // Tooltip 顯示控制（預設關閉）
  readonly showTooltip = signal(false);

  // 樹狀葉節點圖示顯示開關
  readonly showLeafIcon = signal(false);

  // 任務圖片縮圖
  readonly taskImages = signal<Record<string, string[]>>({});
  readonly taskImageLoading = signal<Record<string, boolean>>({});

  // 顯示欄位設定
  readonly showMainCode = signal(true);
  readonly showLevelColumn = signal(true);
  readonly showSequence = signal(true);
  readonly showActions = signal(true);
  readonly displayToggleOptions: ReadonlyArray<{ label: string; signal: WritableSignal<boolean> }> = [
    { label: '顯示提示', signal: this.showTooltip },
    { label: '顯示葉節點', signal: this.showLeafIcon },
    { label: '顯示主碼', signal: this.showMainCode },
    { label: '顯示層級', signal: this.showLevelColumn },
    { label: '顯示序號', signal: this.showSequence },
    { label: '顯示操作', signal: this.showActions }
  ];

  // 統計
  readonly todoCount = computed(() => this.allTasks().filter(t => t.status === 'todo').length);
  readonly inProgressCount = computed(() => this.allTasks().filter(t => t.status === 'in-progress').length);
  readonly completedCount = computed(() => this.allTasks().filter(t => t.status === 'completed').length);

  // 篩選後的任務
  readonly filteredTasks = computed(() => {
    const search = this.searchText().trim().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    const assigned = this.assignedFilter();

    if (!search && status === 'all' && priority === 'all' && assigned === 'all') {
      return this.allTasks();
    }

    return this.allTasks().filter(task => {
      if (search && ![task.name, task.description ?? '', task.code, ...task.tags].some(value => value.toLowerCase().includes(search))) {
        return false;
      }

      if (status !== 'all' && task.status !== status) {
        return false;
      }

      if (priority !== 'all' && task.priority !== priority) {
        return false;
      }

      if (assigned === 'none' && task.assignedTo) {
        return false;
      }

      if (assigned !== 'all' && assigned !== 'none' && task.assignedTo !== assigned) {
        return false;
      }

      return true;
    });
  });

  // TreeView 控制與資料（使用 TaskTreeConfigService 統一配置）
  readonly treeConfig = this.treeConfigService.createTreeConfig({});
  readonly treeControl = this.treeConfig.treeControl;
  readonly dataSource = this.treeConfig.dataSource;
  readonly hasChild = this.treeConfig.hasChild;

  private readonly listHierarchyState = new TaskHierarchyTableState<TaskTreeNode>();

  readonly filteredTaskTree = computed(() => {
    const nodes = this.taskTree();
    if (!nodes.length) {
      return nodes;
    }
    const filtered = this.filteredTasks();
    if (!filtered.length) {
      return [];
    }
    const allowedIds = new Set(filtered.map(task => task.id));
    return this.filterTree(nodes, node => allowedIds.has(node.id));
  });

  readonly hierarchyRows = computed<TaskHierarchyRow[]>(() => {
    const rows: TaskHierarchyRow[] = [];
    const expanded = this.listHierarchyState.expandedIds();
    const traverse = (items: TaskTreeNode[], depth: number) => {
      for (const item of items) {
        rows.push({ node: item, depth });
        if (item.children?.length && expanded.has(item.id)) {
          traverse(item.children, depth + 1);
        }
      }
    };
    traverse(this.filteredTaskTree(), 0);
    return rows;
  });

  protected constructor() {
    effect(() => {
      const bp = this.blueprint();
      this.taskRepository.changed();
      if (bp) {
        queueMicrotask(() => this.loadTasks());
      } else {
        this.taskTree.set([]);
        this.allTasks.set([]);
      }
    });

    effect(() => {
      this.dataSource.setData(this.filteredTaskTree());
    });
  }

  /**
   * 根據路由參數獲取 Blueprint ID
   */
  private async getBlueprintIdBySlug(): Promise<string | null> {
    const { org = '', slug = '' } = this.parentRouteParams() ?? { org: '', slug: '' };
    if (!slug) return null;

    const orgId = org ? (this.orgContext.currentOrganization()?.id ?? null) : null;
    if (org && !orgId) return null;

    try {
      const { data } = await this.blueprintService.getBlueprintBySlug(orgId, slug);
      return data?.id ?? null;
    } catch (error) {
      console.error('獲取 Blueprint ID 失敗:', error);
      return null;
    }
  }

  /**
   * 加載任務數據
   */
  async loadTasks(): Promise<void> {
    const bp = this.blueprint();
    if (!bp) return;

    this.tasksLoading.set(true);
    this.taskImages.set({});
    this.taskImageLoading.set({});
    try {
      const tree = await this.treeBuilder.buildTree(bp.id, {
        includeArchived: false,
        sortBy: 'sortOrder',
        sortOrder: 'asc'
      });

      this.taskTree.set(tree);
      this.listHierarchyState.expandAll(tree);
      this.listHierarchyState.setAllChecked([], false);
      this.dataSource.setData(this.filteredTaskTree());

      const flatTasks = this.treeBuilder.flattenTree(tree);
      this.allTasks.set(flatTasks);
      await this.refreshTaskProgress(flatTasks);
      await this.loadTaskImages(flatTasks, true);
    } catch (error) {
      this.message.error('加載任務失敗');
      console.error('Failed to load tasks:', error);
    } finally {
      this.tasksLoading.set(false);
    }
  }

  openAddTaskModal(parentTask?: TaskIdentityComplete): void {
    this.editingTask.set(null);
    resetTaskFormGroup(this.taskForm, {
      parentId: parentTask?.id ?? null
    });
    this.quantityFormLoading.set(false);
    this.showTaskModal.set(true);
  }

  async openEditTaskModal(task: TaskIdentityComplete): Promise<void> {
    this.editingTask.set(task);
    resetTaskFormGroup(this.taskForm, taskIdentityFormValue(task));
    this.quantityFormLoading.set(true);
    try {
      const fullTask = await this.taskRepository.getTask(task.id);
      const quantity = extractPrimaryTaskQuantity(fullTask);
      this.taskForm.patchValue(taskQuantityFormValue(quantity));
    } catch (error) {
      console.error('Failed to load quantity for task:', error);
      this.message.warning('無法載入任務數量資料，已套用預設值');
      this.taskForm.patchValue(taskQuantityFormValue(extractPrimaryTaskQuantity(null)));
    } finally {
      this.quantityFormLoading.set(false);
    }
    this.showTaskModal.set(true);
  }

  closeTaskModal(): void {
    this.showTaskModal.set(false);
    this.editingTask.set(null);
    this.taskForm.reset();
  }

  async submitTaskForm(): Promise<void> {
    if (this.taskForm.invalid) {
      Object.values(this.taskForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const bp = this.blueprint();
    if (!bp) return;

    const formValue = this.taskForm.getRawValue();
    const editing = this.editingTask();

    this.tasksLoading.set(true);
    try {
      const quantityPayload = buildTaskQuantityPayload(formValue);

      if (editing) {
        await this.taskRepository.updateTask(editing.id, {
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
          quantity: quantityPayload
        } as any);
        this.message.success('任務更新成功');
      } else {
        await this.taskRepository.createTask(bp.id, {
          name: formValue.name!,
          description: formValue.description || undefined,
          notes: formValue.notes || undefined,
          tags: formValue.tags || [],
          category: formValue.category || undefined,
          subcategory: formValue.subcategory || undefined,
          workType: formValue.workType as any,
          discipline: formValue.discipline || undefined,
          parentId: formValue.parentId,
          status: formValue.status as any,
          priority: formValue.priority as any,
          assignedTo: formValue.assignedTo || undefined,
          quantity: quantityPayload
        });
        this.message.success('任務創建成功');
      }

      this.closeTaskModal();
    } catch (error) {
      this.message.error(editing ? '任務更新失敗' : '任務創建失敗');
      console.error('Failed to save task:', error);
    } finally {
      this.tasksLoading.set(false);
    }
  }

  deleteTask(task: TaskIdentityComplete): void {
    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除任務「${task.name}」嗎？`,
      nzOkText: '刪除',
      nzOkDanger: true,
      nzOnOk: async () => {
        this.tasksLoading.set(true);
        try {
          await this.taskRepository.deleteTask(task.id);
          this.message.success('任務刪除成功');
        } catch (error) {
          this.message.error('任務刪除失敗');
          console.error('Failed to delete task:', error);
        } finally {
          this.tasksLoading.set(false);
        }
      }
    });
  }

  onStatusFilterChange(value: any): void {
    this.statusFilter.set(value);
  }

  onPriorityFilterChange(value: any): void {
    this.priorityFilter.set(value);
  }

  onAssignedFilterChange(value: any): void {
    this.assignedFilter.set(value);
  }

  switchViewMode(mode: 'tree' | 'list'): void {
    this.viewMode.set(mode);
  }

  onHierarchyItemChecked(id: string, checked: boolean): void {
    this.listHierarchyState.setChecked(id, checked);
  }

  onHierarchyAllChecked(checked: boolean): void {
    this.listHierarchyState.setAllChecked(this.filteredTaskTree(), checked);
  }

  onHierarchyItemExpand(id: string, expanded: boolean): void {
    this.listHierarchyState.setExpanded(id, expanded);
  }

  expandAllHierarchy(): void {
    this.listHierarchyState.expandAll(this.filteredTaskTree());
  }

  collapseAllHierarchy(): void {
    this.listHierarchyState.collapseAll();
  }

  isHierarchyChecked(id: string): boolean {
    return this.listHierarchyState.isChecked(id);
  }

  isHierarchyExpanded(id: string): boolean {
    return this.listHierarchyState.isExpanded(id);
  }

  isHierarchyAllChecked(): boolean {
    return this.listHierarchyState.isAllChecked(this.filteredTaskTree());
  }

  isHierarchyIndeterminate(): boolean {
    return this.listHierarchyState.isIndeterminate(this.filteredTaskTree());
  }

  taskImageUrls(taskId: string): string[] {
    return this.taskImages()[taskId] ?? [];
  }

  isTaskImageBusy(taskId: string): boolean {
    return this.taskImageLoading()[taskId] ?? false;
  }

  readonly onTaskUploadRequest = (item: NzUploadXHRArgs): Subscription => {
    const data = (item.data as { taskId?: string }) ?? {};
    const taskId = data.taskId;
    if (!taskId) {
      const error = new Error('缺少任務識別資訊');
      item.onError?.(error, item.file);
      return new Subscription();
    }

    const blueprintId = this.blueprintId();
    if (!blueprintId) {
      const error = new Error('尚未取得藍圖資料，無法上傳圖片');
      item.onError?.(error, item.file);
      return new Subscription();
    }

    const uploadFile = item.file as NzUploadFile;
    const rawFile = uploadFile.originFileObj ?? (uploadFile as unknown as File | undefined);
    if (!rawFile) {
      const error = new Error('無法讀取上傳檔案');
      item.onError?.(error, item.file);
      return new Subscription();
    }

    const isImageType =
      (rawFile.type && rawFile.type.toLowerCase().startsWith('image/')) || /\.(png|jpe?g|gif|bmp|webp|svg)$/iu.test(rawFile.name);
    if (!isImageType) {
      const error = new Error('僅支援上傳圖片格式');
      item.onError?.(error, item.file);
      this.message.error(error.message);
      return new Subscription();
    }

    const controller = new AbortController();
    const subscription = new Subscription(() => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    });

    this.setTaskImageLoading(taskId, true);

    this.taskDocumentService
      .uploadTaskImages(taskId, blueprintId, [rawFile], { signal: controller.signal })
      .then(links => {
        this.appendTaskImages(taskId, links);
        item.onSuccess?.(links, item.file, undefined);
        this.message.success('圖片上傳成功');
      })
      .catch(error => {
        const err = error instanceof Error ? error : new Error('圖片上傳失敗');
        item.onError?.(err, item.file);
        this.message.error(err.message);
      })
      .finally(() => {
        this.setTaskImageLoading(taskId, false);
      });

    return subscription;
  };

  onTaskUploadChange(taskId: string, event: NzUploadChangeParam): void {
    if (event.file.status === 'removed') {
      return;
    }

    if (event.file.status === 'error') {
      const error = event.file.error instanceof Error ? event.file.error : new Error('圖片上傳失敗');
      this.message.error(error.message);
      this.setTaskImageLoading(taskId, false);
    }
  }

  taskById(id: string | null | undefined): TaskIdentityComplete | null {
    if (!id) return null;
    return this.allTasks().find(t => t.id === id) || null;
  }

  getStatusTag(status: string): { color: string; text: string } {
    switch (status) {
      case 'todo':
        return { color: 'default', text: '待辦' };
      case 'in-progress':
        return { color: 'processing', text: '進行中' };
      case 'completed':
        return { color: 'success', text: '已完成' };
      case 'cancelled':
        return { color: 'error', text: '已取消' };
      default:
        return { color: 'default', text: status };
    }
  }

  getPriorityTag(priority: string): { color: string; text: string } {
    switch (priority) {
      case 'low':
        return { color: 'default', text: '低' };
      case 'medium':
        return { color: 'blue', text: '中' };
      case 'high':
        return { color: 'orange', text: '高' };
      case 'urgent':
        return { color: 'red', text: '緊急' };
      default:
        return { color: 'default', text: priority };
    }
  }

  getTaskProgressPercent(taskId: string): number {
    const value = this.taskProgress()[taskId];
    return typeof value === 'number' ? value : 0;
  }

  protected filterTree(nodes: TaskTreeNode[], matcher: (node: TaskTreeNode) => boolean): TaskTreeNode[] {
    const result: TaskTreeNode[] = [];
    for (const current of nodes || []) {
      const children = this.filterTree(current.children || [], matcher);
      if (matcher(current) || children.length > 0) {
        result.push({ ...current, children });
      }
    }
    return result;
  }

  protected async refreshTaskProgress(tasks: TaskIdentityComplete[]): Promise<void> {
    if (!tasks.length) {
      this.taskProgress.set({});
      return;
    }

    this.taskProgressLoading.set(true);
    try {
      const results = await Promise.allSettled(
        tasks.map(async task => {
          try {
            const progress = await this.taskProgressService.getTaskProgress(task.id);
            const percentage = progress?.progress?.progress?.percentage ?? 0;
            return { id: task.id, percentage: this.normalizePercentage(percentage) };
          } catch (error) {
            console.error(`Failed to load progress for task ${task.id}:`, error);
            return { id: task.id, percentage: 0 };
          }
        })
      );

      const next: Record<string, number> = {};
      for (const result of results) {
        if (result.status === 'fulfilled') {
          next[result.value.id] = result.value.percentage;
        } else {
          console.error('Task progress request rejected:', result.reason);
        }
      }
      this.taskProgress.set(next);
    } finally {
      this.taskProgressLoading.set(false);
    }
  }

  private async loadTaskImages(tasks: TaskIdentityComplete[], force = false): Promise<void> {
    if (!tasks.length) {
      if (force) {
        this.taskImages.set({});
      }
      return;
    }

    const current = force ? {} : { ...this.taskImages() };
    const targetTasks = force ? tasks : tasks.filter(task => current[task.id] === undefined);
    if (!targetTasks.length) {
      if (force) {
        this.taskImages.set(current);
      }
      return;
    }

    const results = await Promise.allSettled(
      targetTasks.map(async task => {
        const links = await this.taskDocumentService.getTaskImageLinks(task.id);
        return { taskId: task.id, links };
      })
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        current[result.value.taskId] = this.extractImageUrls(result.value.links);
      } else {
        console.error('Failed to load task images:', result.reason);
      }
    }

    this.taskImages.set(current);
  }

  private appendTaskImages(taskId: string, links: TaskDocumentLink[]): void {
    if (!links.length) {
      return;
    }
    const nextUrls = this.extractImageUrls(links);
    if (!nextUrls.length) {
      return;
    }

    this.taskImages.update(state => {
      const existing = state[taskId] ?? [];
      const merged = [...nextUrls, ...existing];
      const unique = Array.from(new Set(merged)).slice(0, this.maxImagesPerTask);
      return {
        ...state,
        [taskId]: unique
      };
    });
  }

  private extractImageUrls(links: TaskDocumentLink[]): string[] {
    const seen = new Set<string>();
    const urls: string[] = [];
    for (const link of links) {
      const url = link.document?.url;
      if (url && !seen.has(url)) {
        seen.add(url);
        urls.push(url);
        if (urls.length >= this.maxImagesPerTask) {
          break;
        }
      }
    }
    return urls;
  }

  private setTaskImageLoading(taskId: string, loading: boolean): void {
    this.taskImageLoading.update(state => {
      if (loading) {
        if (state[taskId] === true) {
          return state;
        }
        return {
          ...state,
          [taskId]: true
        };
      }

      if (!(taskId in state)) {
        return state;
      }

      const next = { ...state };
      delete next[taskId];
      return next;
    });
  }

  protected normalizePercentage(value: number): number {
    if (!Number.isFinite(value)) {
      return 0;
    }
    const rounded = Math.round(value);
    if (rounded < 0) {
      return 0;
    }
    if (rounded > 100) {
      return 100;
    }
    return rounded;
  }

  protected getFamilyCode(item: Pick<TaskFlatNode, 'code' | 'name'> | Partial<TaskIdentityComplete>): string {
    const segments = this.splitCode(item.code);
    if (segments.length > 0) {
      return segments[0];
    }
    return item.code ?? item.name ?? '';
  }

  protected getSequenceCode(item: Pick<TaskFlatNode, 'code' | 'name'> | Partial<TaskIdentityComplete>): string {
    const segments = this.splitCode(item.code);
    const sequenceSource = segments.length > 1 ? segments[segments.length - 1]! : (item.name ?? segments[0] ?? '');
    const normalized = `${sequenceSource}`.trim();
    if (!normalized) {
      return '00';
    }
    return normalized.padStart(2, '0');
  }

  protected getDisplayLevel(level: number | null | undefined): number {
    if (typeof level !== 'number' || !Number.isFinite(level)) {
      return 0;
    }
    const adjusted = level - 1;
    return adjusted >= 0 ? adjusted : 0;
  }

  private splitCode(code?: string | null): string[] {
    return (code ?? '')
      .split('.')
      .map(part => part.trim())
      .filter(Boolean);
  }
}
