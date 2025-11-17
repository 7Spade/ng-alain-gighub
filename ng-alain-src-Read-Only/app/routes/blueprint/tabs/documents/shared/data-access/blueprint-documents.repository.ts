import { inject, Injectable } from '@angular/core';
import { BlueprintDocumentUploadService, BlueprintService, UserService } from '@core';
import type { BlueprintAggregationDimension, BlueprintAggregationResult } from '@shared/models/blueprint-aggregation.model';
import type { BlueprintDocument, BlueprintDocumentVersion, CreateDocumentInput } from '@shared/models/blueprint.model';
import type { NzUploadFile } from 'ng-zorro-antd/upload';

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
  signal: AbortSignal;
  classification: DocumentClassificationPayload;
  changeDescription?: string;
}

interface UploadNewVersionParams {
  document: BlueprintDocument;
  file: File;
  userId: string;
  signal: AbortSignal;
  classification: DocumentClassificationPayload;
  changeDescription?: string;
}

@Injectable({ providedIn: 'root' })
export class BlueprintDocumentsRepository {
  private readonly blueprintService = inject(BlueprintService);
  private readonly userService = inject(UserService);
  private readonly uploadService = inject(BlueprintDocumentUploadService);

  listDocuments(blueprintId: string): Promise<{ data: BlueprintDocument[] | null; error: Error | null }> {
    return this.blueprintService.getBlueprintDocuments(blueprintId);
  }

  listDocumentVersions(documentId: string): Promise<{ data: BlueprintDocumentVersion[] | null; error: Error | null }> {
    return this.blueprintService.getDocumentVersions(documentId);
  }

  createDirectory(input: CreateDocumentInput): Promise<{ data: BlueprintDocument | null; error: Error | null }> {
    return this.blueprintService.createDocument(input);
  }

  deleteDocument(documentId: string): Promise<{ error: Error | null }> {
    return this.blueprintService.deleteDocument(documentId);
  }

  async getCurrentUserId(): Promise<string | null> {
    const { data } = await this.userService.getCurrentUser();
    return data?.id ?? null;
  }

  uploadNewDocument(params: UploadNewDocumentParams): ReturnType<BlueprintDocumentUploadService['uploadNewDocument']> {
    return this.uploadService.uploadNewDocument(params);
  }

  uploadNewVersion(params: UploadNewVersionParams): ReturnType<BlueprintDocumentUploadService['uploadNewVersion']> {
    return this.uploadService.uploadNewVersion(params);
  }

  recalculateDocumentsAggregation(
    blueprintId: string,
    dimensions: readonly BlueprintAggregationDimension[] = ['documents']
  ): Promise<{ data: BlueprintAggregationResult | null; error: Error | null }> {
    return this.blueprintService.recalculateBlueprintAggregation(blueprintId, {
      includeDimensions: [...new Set(dimensions)]
    });
  }

  updateDocumentMetadata(
    documentId: string,
    payload: DocumentClassificationPayload
  ): Promise<{ data: BlueprintDocument | null; error: Error | null }> {
    return this.blueprintService.updateDocument(documentId, {
      discipline: payload.discipline,
      phase: payload.phase,
      package: payload.package,
      hierarchy_path: payload.hierarchyPath,
      metadata: payload.metadata ?? undefined
    });
  }

  toNzUploadFileList(files: NzUploadFile[]): NzUploadFile[] {
    return [...files];
  }
}
