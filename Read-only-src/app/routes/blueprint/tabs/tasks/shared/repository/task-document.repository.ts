import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import { TaskEventRepository, TaskEventRecord } from '@tasks/shared/repository/task-event.repository';

const DOCUMENT_FACET_TYPE = 'document';
const DOCUMENT_LINK_EVENT = 'document-link';

export interface TaskDocumentLinkRecord {
  id: string;
  taskId: string;
  documentId: string;
  role: string;
  status: string;
  version: string | null;
  linkedAt: Date;
  linkedBy: string | null;
  metadata: Record<string, unknown>;
  document?: BlueprintDocumentRecord | null;
}

export interface BlueprintDocumentRecord {
  id: string;
  blueprint_id: string;
  name: string;
  path: string;
  type: string;
  mime_type: string | null;
  size: number | null;
  storage_path: string | null;
  current_version: number | null;
  created_at: string | null;
  created_by: string | null;
  discipline?: string | null;
  phase?: string | null;
  package?: string | null;
  hierarchy_path?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface LinkTaskDocumentInput {
  taskId: string;
  documentId: string;
  role: string;
  status: string;
  version?: string | null;
  linkedBy: string | null;
  metadata?: Record<string, unknown>;
}

export interface UpdateTaskDocumentLinkInput {
  role?: string;
  status?: string;
  version?: string | null;
  metadata?: Record<string, unknown>;
}

export interface CreateBlueprintDocumentInput {
  blueprintId: string;
  documentId?: string;
  name: string;
  path: string;
  mimeType?: string | null;
  size?: number | null;
  storagePath?: string | null;
  currentVersion?: number | null;
  discipline?: string | null;
  phase?: string | null;
  package?: string | null;
  hierarchyPath?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface DocumentLinkEventPayload {
  documentId: string;
  role: string;
  status: string;
  version: string | null;
  metadata?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root'
})
export class TaskDocumentRepository {
  private readonly supabase = inject(SupabaseService);
  private readonly eventRepository = inject(TaskEventRepository);

  async createBlueprintDocument(input: CreateBlueprintDocumentInput): Promise<BlueprintDocumentRecord> {
    const payload = {
      id: input.documentId,
      blueprint_id: input.blueprintId,
      name: input.name,
      path: input.path,
      type: 'file',
      mime_type: input.mimeType ?? null,
      size: input.size ?? null,
      storage_path: input.storagePath ?? input.path ?? null,
      current_version: input.currentVersion ?? 1,
      discipline: input.discipline ?? null,
      phase: input.phase ?? null,
      package: input.package ?? null,
      hierarchy_path: input.hierarchyPath ?? null,
      metadata: input.metadata ?? null
    };

    const { data, error } = await this.supabase.client.from('blueprint_documents').insert(payload).select('*').single();

    if (error) {
      throw new Error(`Failed to create blueprint document: ${error.message}`);
    }

    return data as BlueprintDocumentRecord;
  }

  async linkDocument(input: LinkTaskDocumentInput): Promise<TaskDocumentLinkRecord> {
    const payload: DocumentLinkEventPayload = {
      documentId: input.documentId,
      role: input.role,
      status: input.status,
      version: input.version ?? null,
      metadata: input.metadata ?? {}
    };

    const event = await this.eventRepository.insertEvent<DocumentLinkEventPayload>({
      taskId: input.taskId,
      facetType: DOCUMENT_FACET_TYPE,
      eventType: DOCUMENT_LINK_EVENT,
      payload,
      userId: input.linkedBy ?? undefined,
      occurredAt: new Date(),
      metadata: {
        blueprintDocumentId: input.documentId
      }
    });

    const docMap = await this.fetchBlueprintDocuments([input.documentId]);

    return this.mapEventToLink(event, docMap.get(input.documentId) ?? null);
  }

  async updateLink(id: string, patch: UpdateTaskDocumentLinkInput): Promise<TaskDocumentLinkRecord> {
    const currentEvent = await this.eventRepository.getEventById<DocumentLinkEventPayload>(id);

    if (!currentEvent) {
      throw new Error(`Document link event ${id} not found`);
    }

    const mergedMetadata = patch.metadata ? { ...(currentEvent.payload.metadata ?? {}), ...patch.metadata } : currentEvent.payload.metadata;

    const updatedPayload: DocumentLinkEventPayload = {
      documentId: currentEvent.payload.documentId,
      role: patch.role ?? currentEvent.payload.role,
      status: patch.status ?? currentEvent.payload.status,
      version: patch.version ?? currentEvent.payload.version
    };

    if (mergedMetadata !== undefined) {
      updatedPayload.metadata = mergedMetadata;
    }

    const event = await this.eventRepository.updateEvent<DocumentLinkEventPayload>(id, {
      payload: updatedPayload,
      metadata: {
        ...currentEvent.metadata,
        blueprintDocumentId: currentEvent.payload.documentId
      }
    });

    const docMap = await this.fetchBlueprintDocuments([currentEvent.payload.documentId ?? '']);

    return this.mapEventToLink(event, docMap.get(currentEvent.payload.documentId ?? '') ?? null);
  }

  async listLinks(taskId: string): Promise<TaskDocumentLinkRecord[]> {
    const events = await this.eventRepository.listEvents<DocumentLinkEventPayload>(taskId, {
      facetType: DOCUMENT_FACET_TYPE,
      eventType: DOCUMENT_LINK_EVENT
    });

    const docIds = Array.from(new Set(events.map(event => event.payload.documentId).filter(Boolean)));
    const docMap = await this.fetchBlueprintDocuments(docIds);

    return events.map(event => this.mapEventToLink(event, docMap.get(event.payload.documentId) ?? null));
  }

  async deleteLinksByTaskIds(taskIds: string[]): Promise<void> {
    if (!taskIds.length) {
      return;
    }

    await this.eventRepository.deleteEventsByTaskIds(taskIds, DOCUMENT_FACET_TYPE, DOCUMENT_LINK_EVENT);
  }

  async getLegacyDocumentData(taskId: string): Promise<{ documentData: Record<string, unknown> | null; blueprintId: string | null }> {
    const { data, error } = await this.supabase.client
      .from('blueprint_tasks')
      .select('document_data, blueprint_id')
      .eq('id', taskId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch legacy document data: ${error.message}`);
    }

    return {
      documentData: (data?.document_data as Record<string, unknown> | undefined) ?? null,
      blueprintId: (data?.blueprint_id as string | null) ?? null
    };
  }

  async clearLegacyDocumentData(taskId: string): Promise<void> {
    const { error } = await this.supabase.client.from('blueprint_tasks').update({ document_data: null }).eq('id', taskId);

    if (error) {
      throw new Error(`Failed to clear legacy document data: ${error.message}`);
    }
  }

  async ensureBlueprintDocument(documentId: string, blueprintId: string, payload: CreateBlueprintDocumentInput): Promise<string> {
    const { data } = await this.supabase.client.from('blueprint_documents').select('id').eq('id', documentId).maybeSingle();

    if (data?.id) {
      return data.id as string;
    }

    await this.createBlueprintDocument({
      blueprintId,
      documentId,
      name: payload.name,
      path: payload.path,
      mimeType: payload.mimeType,
      size: payload.size,
      storagePath: payload.storagePath,
      currentVersion: payload.currentVersion,
      discipline: payload.discipline ?? null,
      phase: payload.phase ?? null,
      package: payload.package ?? null,
      hierarchyPath: payload.hierarchyPath ?? null,
      metadata: payload.metadata ?? null
    });

    return documentId;
  }

  private async fetchBlueprintDocuments(documentIds: string[]): Promise<Map<string, BlueprintDocumentRecord | null>> {
    const map = new Map<string, BlueprintDocumentRecord | null>();

    if (!documentIds.length) {
      return map;
    }

    const { data, error } = await this.supabase.client.from('blueprint_documents').select('*').in('id', documentIds);

    if (error) {
      throw new Error(`Failed to fetch blueprint documents: ${error.message}`);
    }

    for (const doc of data ?? []) {
      map.set(doc.id as string, doc as BlueprintDocumentRecord);
    }

    for (const id of documentIds) {
      if (!map.has(id)) {
        map.set(id, null);
      }
    }

    return map;
  }

  private mapEventToLink(
    event: TaskEventRecord<DocumentLinkEventPayload>,
    document?: BlueprintDocumentRecord | null
  ): TaskDocumentLinkRecord {
    return {
      id: event.id,
      taskId: event.taskId,
      documentId: event.payload.documentId,
      role: event.payload.role,
      status: event.payload.status,
      version: event.payload.version,
      linkedAt: event.createdAt,
      linkedBy: event.createdBy,
      metadata: {
        ...(event.metadata ?? {}),
        ...(event.payload.metadata ?? {})
      },
      document: document ?? null
    };
  }
}
