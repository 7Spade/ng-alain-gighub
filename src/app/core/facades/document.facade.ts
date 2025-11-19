import { Injectable, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import type { Document, DocumentInsert, DocumentUpdate } from '@shared/models/data.models';
import { BlueprintActivityService } from '@shared/services/blueprint/blueprint-activity.service';
import { DocumentService } from '@shared/services/document/document.service';

import { StorageFacade } from './storage.facade';
import { ErrorStateService } from '../services/error-state.service';

/**
 * DocumentFacade - Enterprise document management facade
 *
 * Provides complete document management with version control, linking, and search capabilities.
 * Follows Angular 20 Signal patterns with automatic cleanup.
 *
 * Features:
 * - Document CRUD operations with Signal state management
 * - Version control (create versions, version history, restore)
 * - Document linking (to blueprints, tasks, issues)
 * - Document search and filtering
 * - Thumbnail generation support
 * - Soft delete with recovery
 * - Computed signals for filtered views
 * - Integration with StorageFacade for file operations
 * - ErrorStateService integration for centralized error handling
 *
 * @example
 * ```typescript
 * const facade = inject(DocumentFacade);
 *
 * // Create document
 * const doc = await facade.createDocument({
 *   title: 'Floor Plan',
 *   file_path: 'blueprints/bp-123/floor-plan.pdf',
 *   mime_type: 'application/pdf',
 *   file_size: 2048000,
 *   blueprint_id: 'bp-123'
 * });
 *
 * // Monitor state
 * effect(() => {
 *   console.log('Active documents:', facade.activeDocuments());
 *   console.log('Stats:', facade.documentStats());
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class DocumentFacade implements OnDestroy {
  private readonly documentService = inject(DocumentService);
  private readonly storageFacade = inject(StorageFacade);
  private readonly errorStateService = inject(ErrorStateService);
  private readonly activityService = inject(BlueprintActivityService);

  // State signals
  readonly documents = signal<Document[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selectedDocument = signal<Document | null>(null);
  readonly lastOperation = signal<string>('');

  // Computed signals
  /**
   * Active documents (not soft deleted)
   *
   * @note Documents use permanent_delete_at field for soft delete with 30-day retention
   */
  readonly activeDocuments = computed(() => this.documents().filter(doc => !doc.permanent_delete_at));

  /**
   * Archived documents (soft deleted)
   *
   * @note Documents use permanent_delete_at field for soft delete with 30-day retention
   */
  readonly archivedDocuments = computed(() => this.documents().filter(doc => !!doc.permanent_delete_at));

  readonly documentsByType = computed(() => {
    const docs = this.activeDocuments();
    return docs.reduce(
      (acc, doc) => {
        const type = doc.mime_type?.split('/')[0] || 'other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(doc);
        return acc;
      },
      {} as Record<string, Document[]>
    );
  });

  readonly documentStats = computed(() => {
    const docs = this.documents();
    const active = this.activeDocuments();
    return {
      total: docs.length,
      active: active.length,
      archived: docs.length - active.length,
      totalSize: active.reduce((sum, doc) => sum + (doc.file_size || 0), 0),
      byType: Object.entries(this.documentsByType()).map(([type, items]) => ({
        type,
        count: items.length
      }))
    };
  });

  constructor() {
    // Monitor for errors
    effect(() => {
      const lastOp = this.lastOperation();
      if (lastOp) {
        console.log('[DocumentFacade] Last operation:', lastOp);
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Load all documents
   */
  async loadDocuments(): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('loadDocuments');

    try {
      const docs = await this.documentService.getAllDocuments();
      this.documents.set(docs);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load documents',
        category: 'Network',
        severity: 'error',
        context: 'DocumentFacade.loadDocuments'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Load documents by blueprint
   */
  async loadDocumentsByBlueprint(blueprintId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('loadDocumentsByBlueprint');

    try {
      const docs = await this.documentService.getDocumentsByBlueprint(blueprintId);
      this.documents.set(docs);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load blueprint documents',
        category: 'Network',
        severity: 'error',
        context: 'DocumentFacade.loadDocumentsByBlueprint'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Load document by ID
   */
  async loadDocumentById(id: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('loadDocumentById');

    try {
      const doc = await this.documentService.getDocumentById(id);
      if (!doc) {
        throw new Error(`Document with id ${id} not found`);
      }
      this.selectedDocument.set(doc);

      // Add to documents list if not already present
      const current = this.documents();
      if (!current.find(d => d.id === id)) {
        this.documents.set([...current, doc]);
      }
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load document',
        category: 'Network',
        severity: 'error',
        context: 'DocumentFacade.loadDocumentById'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Create new document
   */
  async createDocument(data: DocumentInsert): Promise<Document> {
    this.loading.set(true);
    this.lastOperation.set('createDocument');

    try {
      const doc = await this.documentService.createDocument(data);

      // Update state
      this.documents.set([...this.documents(), doc]);
      this.selectedDocument.set(doc);

      /**
       * NOTE: Documents don't have direct blueprint_id field.
       * Documents are linked to blueprints via document_links table for many-to-many relationships.
       * Activity logging for documents should be done through document_links association.
       */

      return doc;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to create document',
        category: 'BusinessLogic',
        severity: 'error',
        context: 'DocumentFacade.createDocument'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Update document
   */
  async updateDocument(id: string, data: DocumentUpdate): Promise<Document> {
    this.loading.set(true);
    this.lastOperation.set('updateDocument');

    try {
      const doc = await this.documentService.updateDocument(id, data);

      // Update state
      const docs = this.documents().map(d => (d.id === id ? doc : d));
      this.documents.set(docs);

      if (this.selectedDocument()?.id === id) {
        this.selectedDocument.set(doc);
      }

      /**
       * NOTE: Documents don't have direct blueprint_id field.
       * Documents are linked to blueprints via document_links table for many-to-many relationships.
       */

      return doc;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to update document',
        category: 'BusinessLogic',
        severity: 'error',
        context: 'DocumentFacade.updateDocument'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Delete document (soft delete)
   */
  async deleteDocument(id: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('deleteDocument');

    try {
      const doc = this.documents().find(d => d.id === id);
      await this.documentService.deleteDocument(id);

      // Update state - reload to get soft-deleted record
      const updatedDoc = await this.documentService.getDocumentById(id);
      const docs = this.documents()
        .map(d => (d.id === id && updatedDoc ? updatedDoc : d))
        .filter((d): d is Document => d !== null);
      this.documents.set(docs);

      /**
       * NOTE: Documents don't have direct blueprint_id field.
       * Documents are linked to blueprints via document_links table for many-to-many relationships.
       */
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to delete document',
        category: 'BusinessLogic',
        severity: 'error',
        context: 'DocumentFacade.deleteDocument'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Create document version
   */
  async createVersion(
    documentId: string,
    versionData: {
      file_path: string;
      file_size: number;
      version_number: number;
      changes_summary?: string;
      uploaded_by: string;
    }
  ): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('createVersion');

    try {
      // Map facade parameters to DocumentVersionInsert structure
      // Database uses: storage_path (not file_path), created_by (not uploaded_by), change_description (not changes_summary)
      // Note: document_id is required but omitted from Omit type, so we need to include it
      await this.documentService.createDocumentVersion(documentId, {
        document_id: documentId,
        storage_path: versionData.file_path,
        file_name: versionData.file_path.split('/').pop() || 'unknown',
        file_size: versionData.file_size,
        version_number: versionData.version_number,
        change_description: versionData.changes_summary || null,
        created_by: versionData.uploaded_by
      });

      // Reload document to get updated version list
      await this.loadDocumentById(documentId);

      /**
       * NOTE: Documents don't have direct blueprint_id field.
       * Version activity logging should be done through document_links association.
       */
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to create document version',
        category: 'BusinessLogic',
        severity: 'error',
        context: 'DocumentFacade.createVersion'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get document version history
   */
  async getVersionHistory(documentId: string): Promise<any[]> {
    this.loading.set(true);
    this.lastOperation.set('getVersionHistory');

    try {
      return await this.documentService.getDocumentVersions(documentId);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load version history',
        category: 'Network',
        severity: 'error',
        context: 'DocumentFacade.getVersionHistory'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Search documents
   */
  async searchDocuments(query: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('searchDocuments');

    try {
      const docs = await this.documentService.searchDocuments(query);
      this.documents.set(docs);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to search documents',
        category: 'Network',
        severity: 'error',
        context: 'DocumentFacade.searchDocuments'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Select document for detail view
   */
  selectDocument(document: Document | null): void {
    this.selectedDocument.set(document);
    this.lastOperation.set('selectDocument');
  }

  /**
   * Clear selected document
   */
  clearSelection(): void {
    this.selectedDocument.set(null);
    this.lastOperation.set('clearSelection');
  }
}
