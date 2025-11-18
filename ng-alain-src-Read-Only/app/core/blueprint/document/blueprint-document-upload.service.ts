import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import type { BlueprintDocument, BlueprintDocumentVersion } from '@shared';

import { SupabaseService } from '../../supabase/supabase.service';
import { BlueprintService } from '../blueprint.service';

interface DocumentClassificationPayload {
  discipline?: string | null;
  phase?: string | null;
  package?: string | null;
  hierarchyPath?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface UploadNewDocumentParams {
  blueprintId: string;
  parentDocument: BlueprintDocument | null;
  file: File;
  userId: string;
  signal?: AbortSignal;
  changeDescription?: string;
  classification: DocumentClassificationPayload;
}

interface UploadNewVersionParams {
  document: BlueprintDocument;
  file: File;
  userId: string;
  signal?: AbortSignal;
  changeDescription?: string;
  classification: DocumentClassificationPayload;
}

interface UploadResult {
  document: BlueprintDocument;
  version: BlueprintDocumentVersion;
  publicUrl: string | null;
}

interface VersionUploadResult {
  version: BlueprintDocumentVersion;
  publicUrl: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class BlueprintDocumentUploadService {
  private readonly supabase = inject(SupabaseService);
  private readonly blueprintService = inject(BlueprintService);

  private readonly bucketName = this.resolveBucketName();

  async uploadNewDocument(params: UploadNewDocumentParams): Promise<UploadResult> {
    const { blueprintId, parentDocument, file, userId, signal, changeDescription, classification } = params;

    if (!file) {
      throw new Error('未提供有效的文件');
    }

    const documentPath = this.buildDocumentPath(parentDocument, file.name);
    const storagePath = this.buildStoragePath(blueprintId, parentDocument, file.name);
    const classificationPayload = classification ?? {};
    const hierarchyPath = classificationPayload.hierarchyPath ?? this.extractHierarchyPath(documentPath);

    let uploadedPath: string | null = null;
    let createdDocument: BlueprintDocument | null = null;

    try {
      const uploadData = await this.uploadToStorage(storagePath, file, signal);
      uploadedPath = uploadData.path;

      const { data: document, error: createError } = await this.blueprintService.createDocument({
        blueprint_id: blueprintId,
        name: file.name,
        path: documentPath,
        type: 'file',
        mime_type: file.type || 'application/octet-stream',
        size: file.size,
        storage_path: uploadData.path,
        parent_id: parentDocument?.type === 'directory' ? parentDocument.id : undefined,
        created_by: userId,
        current_version: 0,
        discipline: classificationPayload.discipline ?? null,
        phase: classificationPayload.phase ?? null,
        package: classificationPayload.package ?? null,
        hierarchy_path: hierarchyPath,
        metadata: classificationPayload.metadata ?? null
      });

      if (createError || !document) {
        throw createError ?? new Error('創建文件記錄失敗');
      }

      createdDocument = document;

      const fileHash = await this.computeSHA256(file);

      const { data: version, error: versionError } = await this.blueprintService.uploadDocumentVersion({
        document_id: document.id,
        storage_path: uploadData.path,
        file_hash: fileHash,
        change_description: changeDescription ?? '初始上傳',
        changed_by: userId
      });

      if (versionError || !version) {
        throw versionError ?? new Error('建立文件版本失敗');
      }

      const updatedDocument: BlueprintDocument = {
        ...document,
        current_version: version.version,
        storage_path: uploadData.path,
        size: file.size,
        mime_type: file.type || 'application/octet-stream',
        discipline: classificationPayload.discipline ?? document.discipline ?? null,
        phase: classificationPayload.phase ?? document.phase ?? null,
        package: classificationPayload.package ?? document.package ?? null,
        hierarchy_path: hierarchyPath,
        metadata: classificationPayload.metadata ?? document.metadata ?? null
      };

      const publicUrlResponse = this.supabase.client.storage.from(this.bucketName).getPublicUrl(uploadData.path);
      const publicUrl = publicUrlResponse.data?.publicUrl ?? null;

      return {
        document: updatedDocument,
        version,
        publicUrl
      };
    } catch (error) {
      if (createdDocument) {
        const { error: deleteError } = await this.blueprintService.deleteDocument(createdDocument.id);
        if (deleteError) {
          console.warn('清理失敗：刪除文件記錄時發生錯誤', deleteError);
        }
      }
      if (uploadedPath) {
        await this.removeUploadedFile(uploadedPath);
      }
      throw error;
    }
  }

  async uploadNewVersion(params: UploadNewVersionParams): Promise<VersionUploadResult> {
    const { document, file, userId, signal, changeDescription, classification } = params;

    if (!file) {
      throw new Error('未提供有效的文件');
    }

    const storagePath = this.buildStoragePath(document.blueprint_id, document, file.name);

    let uploadedPath: string | null = null;
    let createdVersion: BlueprintDocumentVersion | null = null;
    const previousDocumentSnapshot = {
      storage_path: document.storage_path,
      size: document.size,
      mime_type: document.mime_type,
      current_version: document.current_version ?? 0,
      discipline: document.discipline ?? null,
      phase: document.phase ?? null,
      package: document.package ?? null,
      metadata: document.metadata ?? null
    };

    try {
      const uploadData = await this.uploadToStorage(storagePath, file, signal);
      uploadedPath = uploadData.path;

      const fileHash = await this.computeSHA256(file);

      const { data: version, error: versionError } = await this.blueprintService.uploadDocumentVersion({
        document_id: document.id,
        storage_path: uploadData.path,
        file_hash: fileHash,
        change_description: changeDescription ?? `上傳新版本 (${file.name})`,
        changed_by: userId
      });

      if (versionError || !version) {
        throw versionError ?? new Error('建立文件版本失敗');
      }

      createdVersion = version;

      const { error: updateError } = await this.blueprintService.updateDocument(document.id, {
        storage_path: uploadData.path,
        size: file.size,
        mime_type: file.type || 'application/octet-stream',
        discipline: classification?.discipline ?? undefined,
        phase: classification?.phase ?? undefined,
        package: classification?.package ?? undefined,
        metadata: classification?.metadata ?? undefined
      });

      if (updateError) {
        throw updateError;
      }

      const publicUrlResponse = this.supabase.client.storage.from(this.bucketName).getPublicUrl(uploadData.path);
      const publicUrl = publicUrlResponse.data?.publicUrl ?? null;

      return {
        version,
        publicUrl
      };
    } catch (error) {
      if (createdVersion) {
        await this.tryDeleteDocumentVersion(createdVersion.id);
        const { error: revertError } = await this.blueprintService.updateDocument(document.id, {
          current_version: previousDocumentSnapshot.current_version,
          storage_path: previousDocumentSnapshot.storage_path ?? undefined,
          size: previousDocumentSnapshot.size ?? undefined,
          mime_type: previousDocumentSnapshot.mime_type ?? undefined,
          discipline: previousDocumentSnapshot.discipline ?? undefined,
          phase: previousDocumentSnapshot.phase ?? undefined,
          package: previousDocumentSnapshot.package ?? undefined,
          metadata: previousDocumentSnapshot.metadata ?? undefined
        });
        if (revertError) {
          console.warn('清理失敗：回復文件狀態時發生錯誤', revertError);
        }
      }

      if (uploadedPath) {
        await this.removeUploadedFile(uploadedPath);
      }

      throw error;
    }
  }

  private async uploadToStorage(path: string, file: File, signal?: AbortSignal) {
    const uploadPromise = this.supabase.client.storage.from(this.bucketName).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream'
    });

    const { data, error } = (await this.awaitWithAbort(uploadPromise, signal)) as {
      data: { path: string } | null;
      error: { name?: string; message?: string } | null;
    };

    if (error || !data) {
      if (error?.name === 'AbortError') {
        throw error;
      }
      throw error ?? new Error('文件上傳至儲存桶失敗');
    }

    return data;
  }

  private buildDocumentPath(parentDocument: BlueprintDocument | null, fileName: string): string {
    const sanitizedName = this.normalizeDocumentFileName(fileName);
    const basePath = parentDocument?.type === 'file' ? this.extractDirectoryPath(parentDocument.path) : (parentDocument?.path ?? '');

    if (!basePath || basePath === '/') {
      return `/${sanitizedName}`;
    }

    const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    return `${normalizedBase}/${sanitizedName}`;
  }

  private buildStoragePath(blueprintId: string, parentDocument: BlueprintDocument | null, fileName: string): string {
    const sanitizedName = this.sanitizeFileName(fileName);
    const uniqueName = `${crypto.randomUUID()}-${sanitizedName}`;
    const parentPath = parentDocument?.type === 'file' ? this.extractDirectoryPath(parentDocument.path) : (parentDocument?.path ?? '');
    const normalizedParentPath = parentPath.replace(/^\//, '').replace(/\/$/u, '');

    if (normalizedParentPath) {
      return `${blueprintId}/${normalizedParentPath}/${uniqueName}`;
    }

    return `${blueprintId}/${uniqueName}`;
  }

  private sanitizeFileName(fileName: string): string {
    const sanitized = fileName
      .replace(/[\\/:*?"<>|]/g, '-')
      .replace(/\s+/g, '-')
      .trim();
    return sanitized.length > 0 ? sanitized : 'unnamed-file';
  }

  private normalizeDocumentFileName(fileName: string): string {
    const normalized = fileName.replace(/[/\\]/g, '-').trim();
    return normalized.length > 0 ? normalized : 'unnamed-file';
  }

  private extractDirectoryPath(path: string | null | undefined): string {
    if (!path) {
      return '';
    }
    const normalized = path.replace(/\/{2,}/g, '/');
    const segments = normalized.split('/').filter(Boolean);
    if (segments.length <= 1) {
      return '';
    }
    segments.pop();
    return `/${segments.join('/')}`;
  }

  private extractHierarchyPath(path: string | null | undefined): string | null {
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
    const hierarchy = normalized.slice(0, lastSlash);
    return hierarchy.length > 0 ? hierarchy : '/';
  }

  private async computeSHA256(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private resolveBucketName(): string {
    const supabaseConfig = (environment as { supabase?: { storage?: { documentBucket?: string } } }).supabase;
    const configuredBucket = supabaseConfig?.storage?.documentBucket;
    return configuredBucket && configuredBucket.trim().length > 0 ? configuredBucket : 'blueprint-documents';
  }

  private async removeUploadedFile(path: string): Promise<void> {
    try {
      const response = (await this.supabase.client.storage.from(this.bucketName).remove([path])) as { error: unknown };
      if (response.error) {
        // swallow error but keep trace for debugging
        console.warn('清理上傳檔案失敗', response.error);
      }
    } catch (cleanupError) {
      console.warn('清理上傳檔案時發生例外', cleanupError);
    }
  }

  private async tryDeleteDocumentVersion(versionId: string): Promise<void> {
    const { error } = await this.blueprintService.deleteDocumentVersion(versionId);
    if (error) {
      console.warn('刪除文件版本失敗', error);
    }
  }

  private async awaitWithAbort<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
    if (!signal) {
      return promise;
    }

    if (signal.aborted) {
      throw new DOMException('操作已被中止', 'AbortError');
    }

    return new Promise<T>((resolve, reject) => {
      const abortHandler = () => reject(new DOMException('操作已被中止', 'AbortError'));

      signal.addEventListener('abort', abortHandler, { once: true });

      promise
        .then(result => {
          signal.removeEventListener('abort', abortHandler);
          resolve(result);
        })
        .catch(error => {
          signal.removeEventListener('abort', abortHandler);
          reject(error);
        });
    });
  }
}
