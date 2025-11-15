/**
 * Task Document Service
 *
 * 任務文件維度管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：K. 文件維度
 *
 * 職責：
 * - 管理文件（圖說、規範、報告、照片、影片等）
 * - 處理文件版本控制與審批流程
 * - 管理文件狀態（草稿、審查中、已批准、已取代）
 * - 追蹤文件變更歷史
 *
 * @see @ETMS_DESIGN_SPEC.md K. 文件維度
 */

import { Injectable, inject } from '@angular/core';
import { UserService } from '@core/account/user/user.service';
import { BlueprintDocumentUploadService } from '@core/blueprint/document/blueprint-document-upload.service';
import { SupabaseService } from '@core/supabase/supabase.service';
import { environment } from '@env/environment';
import type {
  DocumentItem,
  DocumentRevision,
  DocumentStatus,
  TaskDocument,
  TaskDocumentLink,
  TaskDocumentLinkRole,
  TaskDocumentLinkStatus
} from '@models';
import {
  TaskDocumentRepository,
  type LinkTaskDocumentInput,
  type TaskDocumentLinkRecord,
  type UpdateTaskDocumentLinkInput
} from '@tasks/shared/repository/task-document.repository';

interface TaskDocumentLinkMetadata extends Record<string, unknown> {
  name?: string;
  type?: DocumentItem['type'];
  category?: string;
  discipline?: string;
  phase?: string;
  package?: string;
  folderPath?: string;
  version?: string;
  url?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  storagePath?: string;
  hash?: string;
  status?: DocumentStatus;
  workflowStage?: string;
  author?: string;
  reviewer?: string;
  approver?: string;
  issuedBy?: string;
  createdAt?: string;
  submittedAt?: string;
  approvedAt?: string;
  issuedAt?: string;
  revisionHistory?: DocumentRevision[];
}

export interface UploadTaskImageOptions {
  role?: TaskDocumentLinkRole;
  status?: DocumentStatus;
  category?: string;
  signal?: AbortSignal;
  changeDescription?: string;
  discipline?: string;
  phase?: string;
  package?: string;
  folderPath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskDocumentService {
  private readonly userService = inject(UserService);
  private readonly repository = inject(TaskDocumentRepository);
  private readonly supabase = inject(SupabaseService);
  private readonly documentUploadService = inject(BlueprintDocumentUploadService);
  private readonly documentBucket = this.resolveBucketName();

  async addDocument(taskId: string, blueprintId: string, document: Omit<DocumentItem, 'id'>): Promise<DocumentItem> {
    const userId = await this.getCurrentUserId();

    const blueprintDocument = await this.repository.createBlueprintDocument({
      blueprintId,
      name: document.name,
      path: document.url ?? '',
      mimeType: document.mimeType ?? null,
      size: document.fileSize ?? null,
      storagePath: document.storagePath ?? document.url ?? '',
      currentVersion: Number.parseInt(document.version ?? '1', 10) || 1,
      discipline: document.discipline ?? null,
      phase: document.phase ?? null,
      package: document.package ?? null,
      hierarchyPath: document.folderPath ?? null,
      metadata: document.linkMetadata ?? null
    });

    const linkPayload: LinkTaskDocumentInput = {
      taskId,
      documentId: blueprintDocument.id,
      role: document.linkRole ?? 'attachment',
      status: this.mapDocumentStatusToLinkStatus(document.status ?? 'draft'),
      version: document.version ?? null,
      linkedBy: userId,
      metadata: this.buildLinkMetadata({
        ...document,
        id: blueprintDocument.id,
        createdAt: new Date(blueprintDocument.created_at ?? new Date().toISOString()),
        revisionHistory: document.revisionHistory ?? [],
        linkRole: document.linkRole ?? 'attachment',
        linkStatus: document.linkStatus ?? 'active',
        linkMetadata: document.linkMetadata ?? {}
      })
    };

    const linkRecord = await this.repository.linkDocument(linkPayload);
    return this.toDocumentLink(linkRecord).document;
  }

  async updateDocumentStatus(
    taskId: string,
    documentId: string,
    status: DocumentStatus,
    extraMetadata: Record<string, unknown> = {}
  ): Promise<void> {
    const links = await this.repository.listLinks(taskId);
    const link = links.find(item => item.documentId === documentId);

    if (!link) {
      throw new Error(`Document link not found for task ${taskId}`);
    }

    const patch: UpdateTaskDocumentLinkInput = {
      status: this.mapDocumentStatusToLinkStatus(status),
      metadata: {
        ...(link.metadata ?? {}),
        status,
        ...extraMetadata
      }
    };

    await this.repository.updateLink(link.id, patch);
  }

  async getTaskDocuments(taskId: string): Promise<TaskDocument | null> {
    let links = await this.repository.listLinks(taskId);

    if (!links.length) {
      const migrated = await this.migrateLegacyDocumentData(taskId);
      if (migrated) {
        links = await this.repository.listLinks(taskId);
      }
    }

    if (!links.length) {
      return { links: [] };
    }

    return {
      links: links.map(record => this.toDocumentLink(record))
    };
  }

  async uploadTaskImages(
    taskId: string,
    blueprintId: string,
    files: File[],
    options: UploadTaskImageOptions = {}
  ): Promise<TaskDocumentLink[]> {
    if (!files.length) {
      return [];
    }

    const userId = await this.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const uploads = files.map(file => this.uploadSingleTaskImage(taskId, blueprintId, userId, file, options));
    return await Promise.all(uploads);
  }

  async getTaskImageLinks(taskId: string): Promise<TaskDocumentLink[]> {
    const documents = await this.getTaskDocuments(taskId);
    if (!documents) {
      return [];
    }

    return documents.links.filter(link => this.isImageDocument(link.document));
  }

  async removeDocuments(taskIds: string | string[]): Promise<void> {
    const normalized = Array.isArray(taskIds) ? taskIds : [taskIds];
    if (!normalized.length) {
      return;
    }

    await this.repository.deleteLinksByTaskIds(normalized);
  }

  private toDocumentLink(record: TaskDocumentLinkRecord): TaskDocumentLink {
    const metadata = (record.metadata ?? {}) as TaskDocumentLinkMetadata;
    const documentRow = record.document ?? null;
    const storagePath = (documentRow?.storage_path as string | null) ?? (metadata.storagePath as string | undefined) ?? null;
    const publicUrl =
      this.resolvePublicUrl(storagePath) ?? (metadata.url as string | undefined) ?? (documentRow?.path as string | undefined) ?? null;

    const revisionHistory = Array.isArray(metadata.revisionHistory)
      ? metadata.revisionHistory.map(revision => this.normalizeRevision(revision))
      : [];

    const documentFolderPath =
      (metadata.folderPath as string | undefined) ??
      (documentRow?.path
        ? (() => {
            const normalized = documentRow.path.trim();
            if (!normalized) {
              return undefined;
            }
            if (documentRow.type === 'directory') {
              return normalized;
            }
            const lastSlash = normalized.lastIndexOf('/');
            if (lastSlash <= 0) {
              return '/';
            }
            return normalized.slice(0, lastSlash);
          })()
        : undefined);

    const document: DocumentItem = {
      id: record.documentId,
      name: (documentRow?.name as string) ?? metadata.name ?? '',
      type: metadata.type ?? 'other',
      category: metadata.category ?? '',
      discipline: (documentRow?.discipline as string | null) ?? (metadata.discipline as string | undefined),
      phase: (documentRow?.phase as string | null) ?? (metadata.phase as string | undefined),
      package: (documentRow?.package as string | null) ?? (metadata.package as string | undefined),
      folderPath: documentFolderPath,
      version: record.version ?? metadata.version ?? '1.0',
      revisionHistory,
      url: publicUrl ?? '',
      fileName: metadata.fileName ?? '',
      fileSize: (documentRow?.size as number | null) ?? metadata.fileSize ?? 0,
      mimeType: (documentRow?.mime_type as string | null) ?? metadata.mimeType ?? '',
      storagePath: storagePath ?? undefined,
      hash: metadata.hash,
      status: metadata.status ?? 'draft',
      workflowStage: metadata.workflowStage ?? '',
      author: metadata.author ?? '',
      reviewer: metadata.reviewer,
      approver: metadata.approver,
      issuedBy: metadata.issuedBy,
      createdAt: this.resolveDate(documentRow?.created_at ?? metadata.createdAt),
      submittedAt: this.resolveNullableDate(metadata.submittedAt),
      approvedAt: this.resolveNullableDate(metadata.approvedAt),
      issuedAt: this.resolveNullableDate(metadata.issuedAt),
      linkRole: record.role as TaskDocumentLinkRole,
      linkStatus: record.status as TaskDocumentLinkStatus,
      linkMetadata: metadata
    };

    return {
      id: record.id,
      taskId: record.taskId,
      documentId: record.documentId,
      role: record.role as TaskDocumentLinkRole,
      status: record.status as TaskDocumentLinkStatus,
      version: record.version,
      linkedAt: record.linkedAt,
      linkedBy: record.linkedBy,
      metadata,
      document
    };
  }

  private async migrateLegacyDocumentData(taskId: string): Promise<boolean> {
    const legacyPayload = await this.repository.getLegacyDocumentData(taskId);
    const legacy = legacyPayload.documentData as any;
    const documents = Array.isArray(legacy?.documents) ? (legacy.documents as any[]) : [];
    if (!documents.length) {
      return false;
    }

    const blueprintId = legacyPayload.blueprintId ?? undefined;
    if (!blueprintId) {
      throw new Error('Blueprint ID is required to migrate document data.');
    }

    const userId = await this.getCurrentUserId();

    for (const raw of documents) {
      const document = this.deserializeDocument(raw);
      const documentId = await this.repository.ensureBlueprintDocument(document.id, blueprintId, {
        blueprintId,
        documentId: document.id,
        name: document.name,
        path: document.url ?? '',
        mimeType: document.mimeType ?? null,
        size: document.fileSize ?? null,
        storagePath: document.storagePath ?? document.url ?? '',
        currentVersion: Number.parseInt(document.version ?? '1', 10) || 1
      });
      const metadata = this.buildLinkMetadata(document);

      await this.repository.linkDocument({
        taskId,
        documentId,
        role: document.linkRole ?? 'attachment',
        status: this.mapDocumentStatusToLinkStatus(document.status ?? 'draft'),
        version: document.version ?? null,
        linkedBy: userId,
        metadata
      });
    }

    await this.repository.clearLegacyDocumentData(taskId);
    return true;
  }

  private async uploadSingleTaskImage(
    taskId: string,
    blueprintId: string,
    userId: string,
    file: File,
    options: UploadTaskImageOptions
  ): Promise<TaskDocumentLink> {
    const uploadResult = await this.documentUploadService.uploadNewDocument({
      blueprintId,
      parentDocument: null,
      file,
      userId,
      signal: options.signal,
      changeDescription: options.changeDescription ?? '任務圖片上傳',
      classification: this.buildClassificationPayload(options)
    });

    const versionValue = uploadResult.version?.version ?? 1;
    const versionString = String(versionValue);
    const storagePath = uploadResult.document.storage_path ?? uploadResult.version.storage_path ?? undefined;

    const metadata: TaskDocumentLinkMetadata = {
      name: uploadResult.document.name,
      type: 'photo',
      category: options.category ?? 'task-photo',
      discipline: options.discipline,
      phase: options.phase,
      package: options.package,
      folderPath: options.folderPath,
      version: versionString,
      url: uploadResult.publicUrl ?? undefined,
      storagePath,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || uploadResult.document.mime_type || 'application/octet-stream',
      status: options.status ?? 'approved',
      author: userId,
      createdAt: uploadResult.document.created_at ?? new Date().toISOString(),
      revisionHistory: []
    };

    const linkRecord = await this.repository.linkDocument({
      taskId,
      documentId: uploadResult.document.id,
      role: options.role ?? 'attachment',
      status: this.mapDocumentStatusToLinkStatus(options.status ?? 'approved'),
      version: versionString,
      linkedBy: userId,
      metadata
    });

    return this.toDocumentLink(linkRecord);
  }

  private buildLinkMetadata(document: DocumentItem): TaskDocumentLinkMetadata {
    return {
      name: document.name,
      type: document.type,
      category: document.category,
      discipline: document.discipline,
      phase: document.phase,
      package: document.package,
      folderPath: document.folderPath,
      version: document.version,
      url: document.url,
      fileName: document.fileName,
      fileSize: document.fileSize,
      mimeType: document.mimeType,
      storagePath: document.storagePath,
      hash: document.hash,
      status: document.status,
      workflowStage: document.workflowStage,
      author: document.author,
      reviewer: document.reviewer,
      approver: document.approver,
      issuedBy: document.issuedBy,
      createdAt: document.createdAt.toISOString(),
      submittedAt: document.submittedAt?.toISOString(),
      approvedAt: document.approvedAt?.toISOString(),
      issuedAt: document.issuedAt?.toISOString(),
      revisionHistory: document.revisionHistory
    };
  }

  private buildClassificationPayload(options: UploadTaskImageOptions): {
    discipline: string | null;
    phase: string | null;
    package: string | null;
    hierarchyPath: string | null;
  } {
    return {
      discipline: options.discipline ?? null,
      phase: options.phase ?? null,
      package: options.package ?? null,
      hierarchyPath: this.normalizeFolderPath(options.folderPath)
    };
  }

  private normalizeFolderPath(path: string | undefined): string | null {
    if (!path || path.trim().length === 0) {
      return '/';
    }
    const normalized = path.trim().replace(/\/{2,}/g, '/');
    if (normalized === '' || normalized === '/') {
      return '/';
    }
    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }

  private mapDocumentStatusToLinkStatus(status: DocumentStatus): TaskDocumentLinkStatus {
    switch (status) {
      case 'superseded':
      case 'obsolete':
      case 'void':
        return 'archived';
      default:
        return 'active';
    }
  }

  private normalizeRevision(revision: any): DocumentRevision {
    return {
      version: (revision?.version as string) ?? '',
      date: this.resolveDate(revision?.date),
      author: (revision?.author as string) ?? '',
      changes: (revision?.changes as string) ?? ''
    };
  }

  private resolveDate(value: unknown): Date {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'string' && value.length > 0) {
      return new Date(value);
    }

    return new Date();
  }

  private resolveNullableDate(value: unknown): Date | undefined {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'string' && value.length > 0) {
      return new Date(value);
    }

    return undefined;
  }

  private deserializeDocument(data: any): DocumentItem {
    const revisionHistory = Array.isArray(data.revisionHistory) ? (data.revisionHistory as any[]) : [];

    return {
      id: (data.id as string) ?? this.generateUuid(),
      name: (data.name as string) ?? '',
      type: (data.type as DocumentItem['type']) ?? 'other',
      category: (data.category as string) ?? '',
      discipline: (data.discipline as string | undefined) ?? undefined,
      phase: (data.phase as string | undefined) ?? undefined,
      package: (data.package as string | undefined) ?? undefined,
      folderPath: (data.folderPath as string | undefined) ?? undefined,
      version: (data.version as string) ?? '1.0',
      revisionHistory: revisionHistory.map(revision => this.normalizeRevision(revision)),
      url: (data.url as string) ?? '',
      fileName: (data.fileName as string) ?? '',
      fileSize: (data.fileSize as number | undefined) ?? 0,
      mimeType: (data.mimeType as string) ?? '',
      storagePath: (data.storagePath as string | undefined) ?? undefined,
      hash: data.hash as string | undefined,
      status: (data.status as DocumentStatus) ?? 'draft',
      workflowStage: (data.workflowStage as string) ?? '',
      author: (data.author as string) ?? '',
      reviewer: (data.reviewer as string | undefined) ?? undefined,
      approver: (data.approver as string | undefined) ?? undefined,
      issuedBy: (data.issuedBy as string | undefined) ?? undefined,
      createdAt: this.resolveDate(data.createdAt),
      submittedAt: this.resolveNullableDate(data.submittedAt),
      approvedAt: this.resolveNullableDate(data.approvedAt),
      issuedAt: this.resolveNullableDate(data.issuedAt),
      linkRole: (data.linkRole as TaskDocumentLinkRole | undefined) ?? 'attachment',
      linkStatus: (data.linkStatus as TaskDocumentLinkStatus | undefined) ?? 'active',
      linkMetadata: (data.linkMetadata as Record<string, unknown> | undefined) ?? {}
    };
  }

  private isImageDocument(document?: DocumentItem | null): boolean {
    if (!document) {
      return false;
    }
    const mime = document.mimeType?.toLowerCase() ?? '';
    if (mime.startsWith('image/')) {
      return true;
    }
    const url = document.url ?? '';
    return /\.(png|jpe?g|gif|bmp|webp|svg)$/iu.test(url);
  }

  private resolvePublicUrl(storagePath?: string | null): string | null {
    if (!storagePath) {
      return null;
    }
    const normalized = storagePath.startsWith('/') ? storagePath.slice(1) : storagePath;
    const { data } = this.supabase.client.storage.from(this.documentBucket).getPublicUrl(normalized);
    return data?.publicUrl ?? null;
  }

  private resolveBucketName(): string {
    const supabaseConfig = (environment as { supabase?: { storage?: { documentBucket?: string } } }).supabase;
    const configuredBucket = supabaseConfig?.storage?.documentBucket;
    if (configuredBucket && configuredBucket.trim().length > 0) {
      return configuredBucket;
    }
    return 'blueprint-documents';
  }

  private async getCurrentUserId(): Promise<string | null> {
    const { data, error } = await this.userService.getCurrentUser();

    if (data?.id) {
      return data.id;
    }

    if (error) {
      throw error;
    }

    return null;
  }

  private generateUuid(): string {
    if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
      return globalThis.crypto.randomUUID();
    }

    return `doc-${Math.random().toString(36).slice(2, 10)}`;
  }
}
