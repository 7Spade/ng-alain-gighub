import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import type { BlueprintDocument } from '@shared/models/blueprint.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import type { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import type { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

import { DocumentDetailPanelComponent } from '../../../../../documents/components/document-detail-panel.component';
import { DocumentTreePanelComponent } from '../../../../../documents/components/document-tree-panel.component';
import type { DocumentTreeNode } from '../../../../../documents/document-tree-node.model';
import { TaskDocumentsFacade } from '../../../../shared/state/task-documents.facade';

@Component({
  selector: 'task-documents-panel',
  standalone: true,
  imports: [SHARED_IMPORTS, DocumentTreePanelComponent, DocumentDetailPanelComponent],
  templateUrl: './task-documents-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDocumentsPanelComponent {
  private readonly facade = inject(TaskDocumentsFacade);
  private readonly modal = inject(NzModalService);
  private readonly msg = inject(NzMessageService);

  readonly blueprintId = input.required<string>();

  readonly loading = this.facade.loading;
  readonly documentTree = this.facade.documentTree;
  readonly expandedKeys = this.facade.expandedKeys;
  readonly selectedKey = this.facade.selectedKey;
  readonly selectedDocument = this.facade.selectedDocument;
  readonly documentVersions = this.facade.documentVersions;
  readonly selectedTabIndex = this.facade.selectedTabIndex;
  readonly fileList = this.facade.fileList;
  readonly uploading = this.facade.uploading;
  readonly showFolderModal = this.facade.showCreateFolderModal;
  readonly folderForm = this.facade.folderForm;
  readonly metadataForm = this.facade.metadataForm;
  readonly metadataSaving = this.facade.metadataSaving;
  readonly disciplineOptions = this.facade.disciplineOptions;
  readonly phaseOptions = this.facade.phaseOptions;
  readonly packageOptions = this.facade.packageOptions;
  readonly disciplineSummary = this.facade.disciplineSummary;
  readonly phaseSummary = this.facade.phaseSummary;
  readonly packageSummary = this.facade.packageSummary;
  readonly disciplineFilter = this.facade.disciplineFilter;
  readonly phaseFilter = this.facade.phaseFilter;
  readonly packageFilter = this.facade.packageFilter;
  readonly hasActiveFilters = this.facade.hasActiveFilters;

  constructor() {
    effect(() => {
      const id = this.blueprintId();
      if (id) {
        this.facade.setBlueprintId(id);
      }
    });

    effect(() => {
      const error = this.facade.error();
      if (error) {
        this.msg.error(error);
        this.facade.clearError();
      }
    });

    effect(() => {
      const message = this.facade.successMessage();
      if (message) {
        this.msg.success(message);
        this.facade.clearNotifications();
      }
    });
  }

  onTreeSelect(event: NzFormatEmitEvent): void {
    void this.facade.handleTreeSelect(event);
  }

  onTreeExpand(event: NzFormatEmitEvent): void {
    this.facade.handleTreeExpand(event);
  }

  openCreateFolderModal(): void {
    this.facade.openCreateFolderModal();
  }

  closeCreateFolderModal(): void {
    this.facade.closeCreateFolderModal();
  }

  setCreateFolderModalVisible(visible: boolean): void {
    this.facade.setCreateFolderModalVisible(visible);
  }

  async submitCreateFolder(): Promise<void> {
    await this.facade.submitCreateFolder();
  }

  setSelectedTabIndex(index: number): void {
    this.facade.setSelectedTabIndex(index);
  }

  setFileList(fileList: NzUploadFile[]): void {
    this.facade.setFileList(fileList);
  }

  setDisciplineFilter(value: string | null): void {
    this.facade.setDisciplineFilter(value);
  }

  setPhaseFilter(value: string | null): void {
    this.facade.setPhaseFilter(value);
  }

  setPackageFilter(value: string | null): void {
    this.facade.setPackageFilter(value);
  }

  clearFilters(): void {
    this.facade.clearFilters();
  }

  async deleteDocument(document: BlueprintDocument): Promise<void> {
    if (!document) {
      return;
    }

    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除${document.type === 'directory' ? '目錄' : '文件'}「${document.name}」嗎？${
        document.type === 'directory' ? '（將同時刪除目錄下的所有內容）' : ''
      }`,
      nzOkDanger: true,
      nzOnOk: async () => {
        await this.facade.deleteDocument(document);
      }
    });
  }

  trackNodeByKey(_index: number, node: DocumentTreeNode): string {
    return node.key;
  }

  readonly beforeUpload = this.facade.beforeUpload;
  readonly uploadRequest = this.facade.uploadRequest;

  async onUploadChange(event: NzUploadChangeParam): Promise<void> {
    await this.facade.handleUploadChange(event);
  }

  formatFileSize(value: number | null | undefined): string {
    return this.facade.formatFileSize(value);
  }

  formatDate(value: string | null | undefined): string {
    return this.facade.formatDate(value);
  }

  async saveMetadata(): Promise<void> {
    await this.facade.saveDocumentMetadata();
  }

  resetMetadata(): void {
    this.facade.resetMetadataForm();
  }
}
