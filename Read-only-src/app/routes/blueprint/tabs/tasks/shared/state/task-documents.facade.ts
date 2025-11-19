import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import type { AggregationDistributionEntry, BlueprintAggregationDimension } from '@shared/models/blueprint-aggregation.model';
import type { BlueprintDocument, BlueprintDocumentVersion } from '@shared/models/blueprint.model';
import type { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import type { NzUploadChangeParam, NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';

import type { DocumentTreeNode } from '../../../documents/document-tree-node.model';
import { BlueprintDocumentsRepository } from '../../../documents/shared/data-access/blueprint-documents.repository';
import { BlueprintAggregationRefreshService } from '../../../shared/state/blueprint-aggregation-refresh.service';

const DOCUMENT_CLASSIFICATION_CONFIG = {
  discipline: {
    emptyLabel: '未設定專業',
    extractor: (doc: BlueprintDocument) => doc.discipline
  },
  phase: {
    emptyLabel: '未設定階段',
    extractor: (doc: BlueprintDocument) => doc.phase
  },
  package: {
    emptyLabel: '未設定工作包',
    extractor: (doc: BlueprintDocument) => doc.package
  }
} as const;

type DocumentClassificationKey = keyof typeof DOCUMENT_CLASSIFICATION_CONFIG;

interface DocumentClassificationFormValue {
  discipline: string;
  phase: string;
  package: string;
}

interface DocumentClassificationPayload {
  discipline: string | null;
  phase: string | null;
  package: string | null;
  hierarchyPath?: string | null;
  metadata?: Record<string, unknown> | null;
}

const DOCUMENT_REFRESH_DIMENSIONS: BlueprintAggregationDimension[] = ['documents', 'activities'];

@Injectable({ providedIn: 'root' })
export class TaskDocumentsFacade {
  private readonly documentsRepository = inject(BlueprintDocumentsRepository);
  private readonly fb = inject(FormBuilder);
  private readonly refreshService = inject(BlueprintAggregationRefreshService);

  private readonly blueprintIdSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly documentsSignal = signal<BlueprintDocument[]>([]);
  private readonly versionsSignal = signal<BlueprintDocumentVersion[]>([]);
  private readonly expandedKeysSignal = signal<string[]>([]);
  private readonly selectedKeySignal = signal<string | null>(null);
  private readonly selectedTabIndexSignal = signal(0);
  private readonly fileListSignal = signal<NzUploadFile[]>([]);
  private readonly uploadingSignal = signal(false);
  private readonly showCreateFolderModalSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly successSignal = signal<string | null>(null);
  private readonly disciplineFilterSignal = signal<string | null>(null);
  private readonly phaseFilterSignal = signal<string | null>(null);
  private readonly packageFilterSignal = signal<string | null>(null);
  private readonly metadataSavingSignal = signal(false);
  private createFolderParentId: string | null = null;
  private lastSelectedFileId: string | null = null;

  readonly folderForm = this.fb.nonNullable.group({
    name: ['', Validators.required]
  });
  readonly metadataForm = this.fb.nonNullable.group({
    discipline: [''],
    phase: [''],
    package: ['']
  });

  constructor() {
    this.metadataForm.disable({ emitEvent: false });
    effect(() => {
      const blueprintId = this.blueprintIdSignal();
      if (blueprintId) {
        void this.loadDocuments(blueprintId);
      } else {
        this.resetState();
      }
    });

    effect(() => {
      const doc = this.selectedDocument();
      this.fileListSignal.set([]);
      this.syncMetadataForm(doc);

      if (!doc) {
        this.versionsSignal.set([]);
        this.lastSelectedFileId = null;
        return;
      }

      if (doc.type === 'file') {
        if (this.lastSelectedFileId === doc.id) {
          return;
        }
        this.lastSelectedFileId = doc.id;
        void this.loadDocumentVersions(doc.id);
      } else {
        this.versionsSignal.set([]);
        this.lastSelectedFileId = null;
      }
    });

    effect(() => {
      const selectedId = this.selectedKeySignal();
      if (!selectedId) {
        return;
      }
      const visibleIds = new Set(this.visibleDocuments().map(doc => doc.id));
      if (!visibleIds.has(selectedId)) {
        this.selectedKeySignal.set(null);
      }
    });
  }

  readonly loading = computed(() => this.loadingSignal());
  readonly documents = computed(() => this.documentsSignal());
  readonly visibleDocuments = computed(() =>
    this.applyDocumentFilters(this.documentsSignal(), this.disciplineFilterSignal(), this.phaseFilterSignal(), this.packageFilterSignal())
  );
  readonly documentTree = computed<DocumentTreeNode[]>(() => this.buildDocumentTree(this.visibleDocuments()));
  readonly expandedKeys = computed(() => this.expandedKeysSignal());
  readonly selectedKey = computed(() => this.selectedKeySignal());
  readonly selectedDocument = computed<BlueprintDocument | null>(() => {
    const id = this.selectedKeySignal();
    if (!id) {
      return null;
    }
    return this.documentsSignal().find(item => item.id === id) ?? null;
  });
  readonly documentVersions = computed(() => this.versionsSignal());
  readonly selectedTabIndex = computed(() => this.selectedTabIndexSignal());
  readonly fileList = computed(() => this.fileListSignal());
  readonly uploading = computed(() => this.uploadingSignal());
  readonly showCreateFolderModal = computed(() => this.showCreateFolderModalSignal());
  readonly error = computed(() => this.errorSignal());
  readonly successMessage = computed(() => this.successSignal());
  readonly metadataSaving = computed(() => this.metadataSavingSignal());
  readonly disciplineFilter = computed(() => this.disciplineFilterSignal());
  readonly phaseFilter = computed(() => this.phaseFilterSignal());
  readonly packageFilter = computed(() => this.packageFilterSignal());
  readonly classificationSummary = computed(() => this.buildClassificationSummaryMap(this.visibleDocuments()));
  readonly disciplineOptions = computed(() => this.computeClassificationOptions('discipline'));
  readonly phaseOptions = computed(() => this.computeClassificationOptions('phase'));
  readonly packageOptions = computed(() => this.computeClassificationOptions('package'));
  readonly disciplineSummary = computed(() => this.classificationSummary().discipline);
  readonly phaseSummary = computed(() => this.classificationSummary().phase);
  readonly packageSummary = computed(() => this.classificationSummary().package);
  readonly hasActiveFilters = computed(() => !!(this.disciplineFilterSignal() || this.phaseFilterSignal() || this.packageFilterSignal()));

  setBlueprintId(blueprintId: string): void {
    if (this.blueprintIdSignal() === blueprintId) {
      return;
    }
    this.clearFilters();
    this.blueprintIdSignal.set(blueprintId);
  }

  clearNotifications(): void {
    this.errorSignal.set(null);
    this.successSignal.set(null);
  }

  setDisciplineFilter(value: string | null): void {
    this.disciplineFilterSignal.set(this.normalizeFilterValue(value));
  }

  setPhaseFilter(value: string | null): void {
    this.phaseFilterSignal.set(this.normalizeFilterValue(value));
  }

  setPackageFilter(value: string | null): void {
    this.packageFilterSignal.set(this.normalizeFilterValue(value));
  }

  clearFilters(): void {
    this.disciplineFilterSignal.set(null);
    this.phaseFilterSignal.set(null);
    this.packageFilterSignal.set(null);
  }

  resetMetadataForm(): void {
    this.syncMetadataForm(this.selectedDocument());
  }

  async saveDocumentMetadata(): Promise<void> {
    const document = this.selectedDocument();
    if (!document || document.type !== 'file') {
      return;
    }
    if (this.metadataForm.disabled || this.metadataForm.pristine) {
      return;
    }

    this.metadataSavingSignal.set(true);
    const classification = this.getClassificationPayload();

    try {
      const { error } = await this.documentsRepository.updateDocumentMetadata(document.id, {
        discipline: classification.discipline,
        phase: classification.phase,
        package: classification.package,
        hierarchyPath: this.deriveHierarchyPath(document.path)
      });

      if (error) {
        this.errorSignal.set(error.message || '更新文件分類失敗');
        return;
      }

      this.successSignal.set('文件分類已更新');
      this.metadataForm.markAsPristine();
      await this.refreshDocumentState(document.id, {
        preserveSelection: true,
        loadVersions: false
      });
      await this.invalidateDocumentsAggregation(DOCUMENT_REFRESH_DIMENSIONS);
    } catch (error) {
      this.errorSignal.set((error as Error | undefined)?.message ?? '更新文件分類失敗');
    } finally {
      this.metadataSavingSignal.set(false);
    }
  }

  async refresh(): Promise<void> {
    const blueprintId = this.blueprintIdSignal();
    if (!blueprintId) {
      return;
    }
    await this.loadDocuments(blueprintId);
  }

  async handleTreeSelect(event: NzFormatEmitEvent): Promise<void> {
    const node = event.node;
    if (!node) {
      return;
    }
    const docId = node.key as string;
    if (this.selectedKeySignal() !== docId) {
      this.selectedKeySignal.set(docId);
    }
    const document = this.documentsSignal().find(item => item.id === docId) ?? null;
    this.ensureExpandedPath(document);
  }

  handleTreeExpand(event: NzFormatEmitEvent): void {
    const node = event.node;
    if (!node) {
      return;
    }
    const docId = node.key as string;
    const expanded = !!node.isExpanded;
    this.expandedKeysSignal.update(keys => {
      const next = new Set(keys);
      if (expanded) {
        next.add(docId);
      } else {
        next.delete(docId);
      }
      return Array.from(next);
    });
  }

  openCreateFolderModal(): void {
    const selected = this.selectedDocument();
    this.showCreateFolderModalSignal.set(true);
    this.folderForm.reset({
      name: ''
    });
    this.createFolderParentId = selected?.type === 'directory' ? selected.id : null;
  }

  closeCreateFolderModal(): void {
    this.showCreateFolderModalSignal.set(false);
    this.folderForm.reset({ name: '' });
    this.createFolderParentId = null;
  }

  setCreateFolderModalVisible(visible: boolean): void {
    const current = this.showCreateFolderModalSignal();
    if (visible === current) {
      return;
    }
    if (visible) {
      this.openCreateFolderModal();
    } else {
      this.closeCreateFolderModal();
    }
  }

  async submitCreateFolder(): Promise<void> {
    if (this.folderForm.invalid) {
      this.folderForm.markAllAsTouched();
      return;
    }

    const blueprintId = this.blueprintIdSignal();
    if (!blueprintId) {
      this.errorSignal.set('無法獲取藍圖 ID');
      return;
    }

    const currentUserId = await this.documentsRepository.getCurrentUserId();
    if (!currentUserId) {
      this.errorSignal.set('請先登入');
      return;
    }

    const documentsMap = new Map(this.documentsSignal().map(doc => [doc.id, doc] as const));
    const parentDocument = this.createFolderParentId ? (documentsMap.get(this.createFolderParentId) ?? null) : null;
    const formName = this.folderForm.get('name')?.value?.trim();
    if (!formName) {
      this.errorSignal.set('請輸入目錄名稱');
      return;
    }

    const parentPath = parentDocument?.path?.replace(/\/+$/u, '') ?? '';
    const normalizedPath = parentPath ? `${parentPath}/${formName}` : `/${formName}`;

    const payload = {
      blueprint_id: blueprintId,
      name: formName,
      path: normalizedPath,
      type: 'directory' as const,
      parent_id: parentDocument?.id ?? undefined,
      created_by: currentUserId
    };

    this.loadingSignal.set(true);
    const { data, error } = await this.documentsRepository.createDirectory(payload);
    this.loadingSignal.set(false);

    if (error) {
      this.errorSignal.set(error.message || '創建目錄失敗');
      return;
    }

    this.successSignal.set('目錄已創建');
    this.closeCreateFolderModal();
    await this.reloadDocumentsAndSelect(data?.id ?? null, false);
    await this.invalidateDocumentsAggregation(DOCUMENT_REFRESH_DIMENSIONS);
  }

  setSelectedTabIndex(index: number): void {
    this.selectedTabIndexSignal.set(index);
  }

  setFileList(fileList: NzUploadFile[]): void {
    this.fileListSignal.set(this.documentsRepository.toNzUploadFileList(fileList));
  }

  async deleteDocument(document: BlueprintDocument): Promise<void> {
    const { error } = await this.documentsRepository.deleteDocument(document.id);
    if (error) {
      this.errorSignal.set(error.message || '刪除失敗');
      return;
    }
    this.successSignal.set(`${document.type === 'directory' ? '目錄' : '文件'}已刪除`);
    this.selectedKeySignal.set(document.parent_id ?? null);
    await this.reloadDocumentsAndSelect(document.parent_id ?? null, false);
    await this.invalidateDocumentsAggregation(DOCUMENT_REFRESH_DIMENSIONS);
  }

  uploadRequest = (item: NzUploadXHRArgs) => {
    const controller = new AbortController();
    const subscription = new Subscription(() => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    });

    const uploadFile = item.file as NzUploadFile | undefined;
    const rawFile = uploadFile?.originFileObj ?? (item.file as unknown as File | undefined);

    if (!rawFile) {
      const error = new Error('無法讀取原始檔案');
      item.onError?.(error, item.file);
      return subscription;
    }

    this.uploadingSignal.set(true);
    this.processUpload(rawFile, controller.signal)
      .then(result => {
        item.onSuccess?.(result, uploadFile ?? item.file, undefined);
        this.successSignal.set(result.message);
      })
      .catch(error => {
        this.errorSignal.set((error as Error | undefined)?.message ?? '文件上傳失敗');
        item.onError?.(error as Error, item.file);
      })
      .finally(() => this.uploadingSignal.set(false));

    return subscription;
  };

  readonly handleUploadChange = async (info: NzUploadChangeParam): Promise<void> => {
    const { file } = info;

    switch (file.status) {
      case 'uploading':
        this.uploadingSignal.set(true);
        return;
      case 'done':
        this.uploadingSignal.set(false);
        this.fileListSignal.set([]);
        return;
      case 'error':
        this.uploadingSignal.set(false);
        if (file.error?.name === 'AbortError') {
          return;
        }
        this.errorSignal.set((file.error as Error | undefined)?.message ?? '文件上傳失敗');
        return;
      default:
        return;
    }
  };

  readonly beforeUpload = () => true;

  formatFileSize(bytes: number | null | undefined): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleString('zh-TW');
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  private async loadDocuments(blueprintId: string): Promise<void> {
    this.loadingSignal.set(true);
    const { data, error } = await this.documentsRepository.listDocuments(blueprintId);
    this.loadingSignal.set(false);

    if (error) {
      this.errorSignal.set(error.message || '獲取文件列表失敗');
      this.documentsSignal.set([]);
      return;
    }

    this.documentsSignal.set(data ?? []);
    this.errorSignal.set(null);
    this.syncSelectionAfterReload(this.selectedKeySignal());
  }

  private async loadDocumentVersions(documentId: string): Promise<void> {
    const { data, error } = await this.documentsRepository.listDocumentVersions(documentId);
    if (error) {
      this.errorSignal.set(error.message || '獲取文件版本失敗');
      this.versionsSignal.set([]);
      return;
    }
    this.versionsSignal.set(data ?? []);
  }

  private async reloadDocumentsAndSelect(documentId: string | null, preserveSelection: boolean): Promise<void> {
    const blueprintId = this.blueprintIdSignal();
    if (!blueprintId) {
      return;
    }
    await this.loadDocuments(blueprintId);
    this.syncSelectionAfterReload(preserveSelection ? this.selectedKeySignal() : documentId);
  }

  private syncMetadataForm(document: BlueprintDocument | null): void {
    const form = this.metadataForm;
    form.enable({ emitEvent: false });

    if (!document || document.type !== 'file') {
      form.setValue({ discipline: '', phase: '', package: '' }, { emitEvent: false });
      form.markAsPristine();
      return;
    }

    form.setValue(
      {
        discipline: document.discipline ?? '',
        phase: document.phase ?? '',
        package: document.package ?? ''
      },
      { emitEvent: false }
    );
    form.markAsPristine();
  }

  private getClassificationPayload(): DocumentClassificationPayload {
    const raw = this.metadataForm.getRawValue() as DocumentClassificationFormValue;
    return {
      discipline: this.normalizeClassificationInput(raw.discipline),
      phase: this.normalizeClassificationInput(raw.phase),
      package: this.normalizeClassificationInput(raw.package)
    };
  }

  private normalizeClassificationInput(value: string | null | undefined): string | null {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : null;
  }

  private hierarchyPathForNewDocument(parent: BlueprintDocument | null): string | null {
    if (!parent || parent.type !== 'directory') {
      return '/';
    }
    const normalized = parent.path?.replace(/\/{2,}/g, '/').trim();
    if (!normalized || normalized.length === 0) {
      return '/';
    }
    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }

  private deriveHierarchyPath(path: string | null | undefined): string | null {
    if (!path || path === '/') {
      return '/';
    }
    const normalized = path.replace(/\/{2,}/g, '/').trim();
    if (!normalized || normalized === '/') {
      return '/';
    }
    const lastSlash = normalized.lastIndexOf('/');
    if (lastSlash <= 0) {
      return '/';
    }
    return normalized.slice(0, lastSlash);
  }

  private applyDocumentFilters(
    documents: BlueprintDocument[],
    discipline: string | null,
    phase: string | null,
    pkg: string | null
  ): BlueprintDocument[] {
    if (!discipline && !phase && !pkg) {
      return documents;
    }

    return documents.filter(doc => {
      if (doc.type !== 'file') {
        return true;
      }
      const matchDiscipline = !discipline || this.compareClassificationValue(doc.discipline, discipline);
      const matchPhase = !phase || this.compareClassificationValue(doc.phase, phase);
      const matchPackage = !pkg || this.compareClassificationValue(doc.package, pkg);
      return matchDiscipline && matchPhase && matchPackage;
    });
  }

  private buildClassificationSummaryMap(documents: BlueprintDocument[]): Record<DocumentClassificationKey, AggregationDistributionEntry[]> {
    const result = {} as Record<DocumentClassificationKey, AggregationDistributionEntry[]>;
    for (const key of Object.keys(DOCUMENT_CLASSIFICATION_CONFIG) as DocumentClassificationKey[]) {
      result[key] = this.buildClassificationSummary(documents, key);
    }
    return result;
  }

  private buildClassificationSummary(documents: BlueprintDocument[], key: DocumentClassificationKey): AggregationDistributionEntry[] {
    const config = DOCUMENT_CLASSIFICATION_CONFIG[key];
    const counter = new Map<string, number>();

    for (const doc of documents) {
      if (doc.type !== 'file') {
        continue;
      }
      const normalized = this.normalizeClassificationValue(config.extractor(doc));
      counter.set(normalized, (counter.get(normalized) ?? 0) + 1);
    }

    return Array.from(counter.entries())
      .map<AggregationDistributionEntry>(([key, value]) => ({
        key,
        label: key === '__EMPTY__' ? config.emptyLabel : key,
        value
      }))
      .sort((a, b) => b.value - a.value);
  }

  private computeClassificationOptions(key: DocumentClassificationKey): string[] {
    const documents = this.documentsSignal();
    const { extractor } = DOCUMENT_CLASSIFICATION_CONFIG[key];
    const values = new Set<string>();

    for (const doc of documents) {
      if (doc.type !== 'file') {
        continue;
      }
      const value = this.normalizeFilterValue(extractor(doc));
      if (value) {
        values.add(value);
      }
    }

    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }

  private normalizeFilterValue(value: string | null | undefined): string | null {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }

  private normalizeClassificationValue(value: string | null | undefined): string {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : '__EMPTY__';
  }

  private compareClassificationValue(a: string | null | undefined, b: string): boolean {
    return this.normalizeClassificationValue(a) === this.normalizeClassificationValue(b);
  }

  private async processUpload(file: File, signal: AbortSignal): Promise<{ message: string }> {
    const blueprintId = this.blueprintIdSignal();
    if (!blueprintId) {
      throw new Error('無法取得藍圖 ID，無法上傳文件');
    }

    const userId = await this.documentsRepository.getCurrentUserId();
    if (!userId) {
      throw new Error('請先登入後再上傳文件');
    }

    const selected = this.selectedDocument();
    const classification = this.getClassificationPayload();

    if (!selected || selected.type === 'directory') {
      const result = await this.documentsRepository.uploadNewDocument({
        blueprintId,
        parentDocument: selected?.type === 'directory' ? selected : null,
        file,
        userId,
        signal,
        classification: {
          ...classification,
          hierarchyPath: this.hierarchyPathForNewDocument(selected?.type === 'directory' ? selected : null)
        }
      });

      await this.refreshDocumentState(result.document.id, {
        preserveSelection: false,
        loadVersions: true,
        tabIndex: 0
      });
      await this.invalidateDocumentsAggregation(DOCUMENT_REFRESH_DIMENSIONS);
      return { message: '文件已上傳' };
    }

    const versionResult = await this.documentsRepository.uploadNewVersion({
      document: selected,
      file,
      userId,
      signal,
      classification: {
        ...classification,
        hierarchyPath: this.deriveHierarchyPath(selected.path)
      }
    });

    await this.refreshDocumentState(selected.id, {
      preserveSelection: true,
      loadVersions: true
    });
    await this.invalidateDocumentsAggregation(DOCUMENT_REFRESH_DIMENSIONS);
    return { message: `新版本 v${versionResult.version.version} 已上傳` };
  }

  private async refreshDocumentState(
    documentId: string,
    options: { preserveSelection?: boolean; loadVersions?: boolean; tabIndex?: number } = {}
  ): Promise<void> {
    const { preserveSelection = false, loadVersions = false, tabIndex } = options;
    await this.reloadDocumentsAndSelect(documentId, preserveSelection);
    if (loadVersions) {
      await this.loadDocumentVersions(documentId);
      this.lastSelectedFileId = documentId;
    }
    if (typeof tabIndex === 'number') {
      this.selectedTabIndexSignal.set(tabIndex);
    }
  }

  private async invalidateDocumentsAggregation(
    dimensions: readonly BlueprintAggregationDimension[] = DOCUMENT_REFRESH_DIMENSIONS
  ): Promise<void> {
    const blueprintId = this.blueprintIdSignal();
    if (!blueprintId) {
      return;
    }
    await this.documentsRepository.recalculateDocumentsAggregation(blueprintId, dimensions);
    this.refreshService.emit(blueprintId, dimensions);
  }

  private resetState(): void {
    this.loadingSignal.set(false);
    this.documentsSignal.set([]);
    this.versionsSignal.set([]);
    this.expandedKeysSignal.set([]);
    this.selectedKeySignal.set(null);
    this.selectedTabIndexSignal.set(0);
    this.fileListSignal.set([]);
    this.uploadingSignal.set(false);
    this.showCreateFolderModalSignal.set(false);
    this.errorSignal.set(null);
    this.successSignal.set(null);
    this.disciplineFilterSignal.set(null);
    this.phaseFilterSignal.set(null);
    this.packageFilterSignal.set(null);
    this.folderForm.reset({ name: '' });
    this.metadataForm.setValue({ discipline: '', phase: '', package: '' }, { emitEvent: false });
    this.metadataForm.markAsPristine();
    this.metadataForm.disable({ emitEvent: false });
    this.lastSelectedFileId = null;
    this.createFolderParentId = null;
  }

  private buildDocumentTree(documents: BlueprintDocument[]): DocumentTreeNode[] {
    const byParent = documents.reduce<Map<string | null, BlueprintDocument[]>>((acc, doc) => {
      const parentKey = doc.parent_id ?? null;
      const bucket = acc.get(parentKey);
      if (bucket) {
        bucket.push(doc);
      } else {
        acc.set(parentKey, [doc]);
      }
      return acc;
    }, new Map());

    const buildNodes = (parentId: string | null): DocumentTreeNode[] =>
      (byParent.get(parentId) ?? []).map(doc => {
        const rawChildren = doc.type === 'directory' ? buildNodes(doc.id) : undefined;
        const children = rawChildren && rawChildren.length > 0 ? rawChildren : undefined;
        return {
          title: doc.name,
          key: doc.id,
          isLeaf: doc.type === 'file' || !children,
          document: doc,
          children
        };
      });

    return buildNodes(null);
  }

  private ensureExpandedPath(document: BlueprintDocument | null): void {
    if (!document) {
      return;
    }

    const expanded = new Set(this.expandedKeysSignal());
    if (document.type === 'directory') {
      expanded.add(document.id);
    }

    const documentsMap = new Map(this.documentsSignal().map(doc => [doc.id, doc] as const));
    let parentId = document.parent_id ?? null;

    while (parentId) {
      expanded.add(parentId);
      parentId = documentsMap.get(parentId)?.parent_id ?? null;
    }

    const nextExpandedKeys = Array.from(expanded);
    const currentExpandedKeys = this.expandedKeysSignal();
    if (!this.areKeySetsEqual(currentExpandedKeys, nextExpandedKeys)) {
      this.expandedKeysSignal.set(nextExpandedKeys);
    }
  }

  private syncSelectionAfterReload(documentId: string | null | undefined): void {
    if (!documentId) {
      this.selectedKeySignal.set(null);
      return;
    }

    const documentsMap = new Map(this.documentsSignal().map(doc => [doc.id, doc] as const));
    const selected = documentsMap.get(documentId) ?? null;
    this.ensureExpandedPath(selected ?? null);
    if (selected) {
      this.selectedKeySignal.set(selected.id);
    } else {
      this.selectedKeySignal.set(null);
    }
  }

  private areKeySetsEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    const setA = new Set(a);
    if (setA.size !== b.length) {
      return false;
    }
    return b.every(key => setA.has(key));
  }
}
