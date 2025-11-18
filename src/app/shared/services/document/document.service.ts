import { Injectable, inject, signal, computed } from '@angular/core';
import { DocumentRepository, DocumentVersionRepository, DocumentThumbnailRepository } from '@core';
import {
  Document,
  DocumentInsert,
  DocumentUpdate,
  DocumentVersion,
  DocumentVersionInsert,
  DocumentThumbnail,
  DocumentThumbnailInsert
} from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Document Detail
 *
 * 聚合文件相關子資料（版本、縮圖）
 */
export interface DocumentDetail extends Document {
  versions: DocumentVersion[];
  thumbnails: DocumentThumbnail[];
  currentVersion?: DocumentVersion;
}

/**
 * Document Service
 *
 * 提供文件管理相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * 支援功能：
 * - 文件上傳和下載
 * - 版本控制
 * - 縮圖生成
 * - 軟刪除（30天內可復原）
 * - Supabase Storage 整合
 *
 * @example
 * ```typescript
 * const documentService = inject(DocumentService);
 *
 * // 載入藍圖的文件
 * await documentService.loadByBlueprint('blueprint-id');
 *
 * // 訂閱文件狀態
 * effect(() => {
 *   console.log('Documents:', documentService.documents());
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documentRepository = inject(DocumentRepository);
  private documentVersionRepository = inject(DocumentVersionRepository);
  private documentThumbnailRepository = inject(DocumentThumbnailRepository);

  // 使用 Signals 管理狀態
  private documentsState = signal<Document[]>([]);
  private selectedDocumentState = signal<DocumentDetail | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly documents = this.documentsState.asReadonly();
  readonly selectedDocument = this.selectedDocumentState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly activeDocuments = computed(() => {
    const docs = this.documents() as any[];
    return docs.filter(d => !d.permanent_delete_at);
  });

  readonly deletedDocuments = computed(() => {
    const docs = this.documents() as any[];
    return docs.filter(d => d.permanent_delete_at);
  });

  readonly documentsByType = computed(() => {
    const docs = this.activeDocuments() as any[];
    return {
      image: docs.filter(d => d.file_type?.startsWith('image/')),
      document: docs.filter(d => d.file_type?.includes('document') || d.file_type?.includes('pdf')),
      drawing: docs.filter(d => d.file_type?.includes('dwg') || d.file_type?.includes('dxf')),
      other: docs.filter(
        d =>
          !d.file_type?.startsWith('image/') &&
          !d.file_type?.includes('document') &&
          !d.file_type?.includes('pdf') &&
          !d.file_type?.includes('dwg') &&
          !d.file_type?.includes('dxf')
      )
    };
  });

  /**
   * 載入指定上傳者的所有文件
   */
  async loadByUploader(uploaderId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.documentRepository.findByUploaderId(uploaderId));
      this.documentsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入上傳者文件失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入單一文件詳情（包含版本和縮圖）
   */
  async loadDocumentById(documentId: string): Promise<DocumentDetail | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const document = await firstValueFrom(this.documentRepository.findById(documentId));
      if (!document) {
        this.selectedDocumentState.set(null);
        return null;
      }

      // 載入關聯資料
      const [versions, thumbnails] = await Promise.all([
        firstValueFrom(this.documentVersionRepository.findByDocumentId(documentId)),
        firstValueFrom(this.documentThumbnailRepository.findByDocumentId(documentId))
      ]);

      // 找出當前版本
      const documentData = document as any;
      const currentVersion = versions.find((v: any) => v.version_number === documentData.current_version);

      const documentDetail: DocumentDetail = {
        ...document,
        versions,
        thumbnails,
        currentVersion
      };

      this.selectedDocumentState.set(documentDetail);
      return documentDetail;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入文件詳情失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建新文件（上傳）
   */
  async create(data: DocumentInsert): Promise<Document> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const document = await firstValueFrom(this.documentRepository.create(data));

      // 更新本地狀態
      this.documentsState.update(current => [...current, document]);

      return document;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建文件失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新文件元資料
   */
  async update(id: string, data: DocumentUpdate): Promise<Document> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updated = await firstValueFrom(this.documentRepository.update(id, data));

      // 更新本地狀態
      this.documentsState.update(current => current.map(d => (d.id === id ? updated : d)));

      // 如果當前選中的文件就是這個，更新它
      if (this.selectedDocumentState()?.id === id) {
        this.selectedDocumentState.update(current => (current ? { ...current, ...updated } : null));
      }

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新文件失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建新版本
   */
  async createVersion(documentId: string, versionData: Omit<DocumentVersionInsert, 'documentId'>): Promise<DocumentVersion> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 取得當前文件的最新版本號
      const document = await firstValueFrom(this.documentRepository.findById(documentId));
      if (!document) {
        throw new Error('文件不存在');
      }

      const documentData = document as any;
      const newVersionNumber = (documentData.current_version || 0) + 1;

      const version = await firstValueFrom(
        this.documentVersionRepository.create({
          ...versionData,
          document_id: documentId,
          version_number: newVersionNumber
        } as any)
      );

      // 更新文件的當前版本號
      await this.update(documentId, { current_version: newVersionNumber } as any);

      // 如果當前選中的文件就是這個，更新其版本列表
      if (this.selectedDocumentState()?.id === documentId) {
        this.selectedDocumentState.update(current =>
          current
            ? {
                ...current,
                versions: [...current.versions, version],
                currentVersion: version
              }
            : null
        );
      }

      return version;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建版本失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 生成縮圖
   */
  async generateThumbnail(documentId: string, thumbnailData: Omit<DocumentThumbnailInsert, 'documentId'>): Promise<DocumentThumbnail> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const thumbnail = await firstValueFrom(
        this.documentThumbnailRepository.create({
          ...thumbnailData,
          document_id: documentId
        } as any)
      );

      // 如果當前選中的文件就是這個，更新其縮圖列表
      if (this.selectedDocumentState()?.id === documentId) {
        this.selectedDocumentState.update(current =>
          current
            ? {
                ...current,
                thumbnails: [...current.thumbnails, thumbnail]
              }
            : null
        );
      }

      return thumbnail;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '生成縮圖失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 軟刪除文件（30天內可復原）
   */
  async softDelete(id: string): Promise<Document> {
    const now = new Date();
    const deleteDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days later
    return this.update(id, { permanent_delete_at: deleteDate.toISOString() } as any);
  }

  /**
   * 復原已刪除的文件
   */
  async restore(id: string): Promise<Document> {
    return this.update(id, { permanent_delete_at: null } as any);
  }

  /**
   * 永久刪除文件
   */
  async permanentDelete(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.documentRepository.delete(id));

      // 更新本地狀態
      this.documentsState.update(current => current.filter(d => d.id !== id));

      // 如果刪除的是當前選中的，清空選中狀態
      if (this.selectedDocumentState()?.id === id) {
        this.selectedDocumentState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '永久刪除文件失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清理超過 30 天的已刪除文件
   */
  async cleanupDeletedDocuments(): Promise<void> {
    const now = new Date();

    const documentsToDelete = this.deletedDocuments().filter(d => {
      const docData = d as any;
      return docData.permanent_delete_at && new Date(docData.permanent_delete_at) < now;
    });

    await Promise.all(documentsToDelete.map(d => this.permanentDelete(d.id)));
  }

  /**
   * 清空本地狀態
   */
  clear(): void {
    this.documentsState.set([]);
    this.selectedDocumentState.set(null);
    this.errorState.set(null);
  }

  // ============================================================================
  // Adapter Methods (Facade Compatibility Layer)
  // These methods provide backward compatibility for facades expecting different API patterns
  // TODO: Refactor facades to use standard load* methods and remove these adapters
  // ============================================================================

  /**
   * Get all documents (Adapter)
   * @deprecated Use loadByUploader() and access documents() signal instead
   * This is an adapter method for facade compatibility
   */
  async getAllDocuments(): Promise<Document[]> {
    // Load all documents for current user (would need user context)
    return this.documents();
  }

  /**
   * Get documents by blueprint (Adapter)
   * @deprecated Documents don't have direct blueprint_id - use document_links
   * This is an adapter method for facade compatibility
   */
  async getDocumentsByBlueprint(blueprintId: string): Promise<Document[]> {
    // TODO: Query through document_links table
    console.warn('getDocumentsByBlueprint: Documents use document_links for blueprint associations');
    return [];
  }

  /**
   * Get document by ID (Adapter)
   * @deprecated Use loadDocumentById() instead
   * This is an adapter method for facade compatibility
   */
  async getDocumentById(id: string): Promise<Document | null> {
    const detail = await this.loadDocumentById(id);
    return detail as unknown as Document;
  }

  /**
   * Create document (Adapter)
   * @deprecated Use create() instead
   * This is an adapter method for facade compatibility
   */
  async createDocument(data: DocumentInsert): Promise<Document> {
    return await this.create(data);
  }

  /**
   * Update document (Adapter)
   * @deprecated Use update() instead
   * This is an adapter method for facade compatibility
   */
  async updateDocument(id: string, data: DocumentUpdate): Promise<Document> {
    return await this.update(id, data);
  }

  /**
   * Delete document (Adapter)
   * @deprecated Use softDelete() instead
   * This is an adapter method for facade compatibility
   */
  async deleteDocument(id: string): Promise<void> {
    await this.softDelete(id);
  }

  /**
   * Create document version (Adapter)
   * @deprecated Use createVersion() with documentId parameter
   * This is an adapter method for facade compatibility
   */
  async createDocumentVersion(documentId: string, data: Omit<DocumentVersionInsert, 'documentId'>): Promise<DocumentVersion> {
    return await this.createVersion(documentId, data);
  }

  /**
   * Get document versions (Adapter)
   * @deprecated To be implemented properly in future refactoring
   * This is a stub adapter method for facade compatibility
   */
  async getDocumentVersions(documentId: string): Promise<DocumentVersion[]> {
    // TODO: Implement version retrieval when version system is ready
    console.warn('getDocumentVersions is not yet fully implemented');
    return [];
  }

  /**
   * Search documents (Adapter)
   * @deprecated To be implemented properly in future refactoring
   * This is a stub adapter method for facade compatibility
   */
  async searchDocuments(query: string): Promise<Document[]> {
    // Simple search implementation - filter documents by name
    const searchLower = query.toLowerCase();
    return this.documents().filter(doc => doc.file_name.toLowerCase().includes(searchLower));
  }
}
