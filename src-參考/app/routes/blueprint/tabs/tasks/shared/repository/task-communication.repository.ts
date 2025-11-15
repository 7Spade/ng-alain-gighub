import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import { TaskEventRepository, TaskEventRecord } from '@tasks/shared/repository/task-event.repository';

const COMMUNICATION_FACET_TYPE = 'communication';
const COMMUNICATION_THREAD_EVENT = 'communication-thread';
const COMMUNICATION_MESSAGE_EVENT = 'communication-message';

export interface TaskCommunicationThreadRecord {
  id: string;
  taskId: string;
  topic: string;
  category: string;
  status: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date | null;
  metadata: Record<string, unknown>;
}

export interface TaskCommunicationMessageRecord {
  id: string;
  communicationId: string;
  authorId: string | null;
  content: string;
  attachments: unknown[];
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface InsertTaskCommunicationThreadInput {
  taskId: string;
  topic: string;
  category: string;
  status: string;
  createdBy: string | null;
  updatedBy: string | null;
  metadata?: Record<string, unknown>;
  lastMessageAt?: Date | null;
}

export interface UpdateTaskCommunicationThreadInput {
  topic?: string;
  category?: string;
  status?: string;
  updatedBy?: string | null;
  lastMessageAt?: Date | null;
  metadata?: Record<string, unknown>;
}

export interface InsertTaskCommunicationMessageInput {
  communicationId: string;
  authorId: string | null;
  content: string;
  attachments?: unknown[];
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  taskId?: string;
}

interface CommunicationThreadEventPayload {
  topic: string;
  category: string;
  status: string;
  metadata?: Record<string, unknown>;
  updatedBy?: string | null;
  lastMessageAt?: string | null;
  updatedAt?: string;
}

interface CommunicationMessageEventPayload {
  communicationId: string;
  content: string;
  attachments?: unknown[];
  metadata?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root'
})
export class TaskCommunicationRepository {
  private readonly supabase = inject(SupabaseService);
  private readonly eventRepository = inject(TaskEventRepository);

  async createThread(input: InsertTaskCommunicationThreadInput): Promise<TaskCommunicationThreadRecord> {
    const now = new Date();
    const payload: CommunicationThreadEventPayload = {
      topic: input.topic,
      category: input.category,
      status: input.status,
      metadata: input.metadata ?? {},
      updatedBy: input.updatedBy,
      lastMessageAt: input.lastMessageAt ? input.lastMessageAt.toISOString() : null,
      updatedAt: now.toISOString()
    };

    const event = await this.eventRepository.insertEvent<CommunicationThreadEventPayload>({
      taskId: input.taskId,
      facetType: COMMUNICATION_FACET_TYPE,
      eventType: COMMUNICATION_THREAD_EVENT,
      payload,
      userId: input.createdBy ?? undefined,
      occurredAt: now,
      metadata: {
        category: input.category
      }
    });

    return this.mapThreadEvent(event);
  }

  async updateThread(threadId: string, patch: UpdateTaskCommunicationThreadInput): Promise<TaskCommunicationThreadRecord> {
    const current = await this.eventRepository.getEventById<CommunicationThreadEventPayload>(threadId);

    if (!current) {
      throw new Error(`Communication thread ${threadId} not found`);
    }

    const updatedPayload: CommunicationThreadEventPayload = {
      topic: patch.topic ?? current.payload.topic,
      category: patch.category ?? current.payload.category,
      status: patch.status ?? current.payload.status,
      metadata: patch.metadata ? { ...(current.payload.metadata ?? {}), ...patch.metadata } : current.payload.metadata,
      updatedBy: patch.updatedBy ?? current.payload.updatedBy ?? current.createdBy,
      lastMessageAt: patch.lastMessageAt ? patch.lastMessageAt.toISOString() : (current.payload.lastMessageAt ?? null),
      updatedAt: new Date().toISOString()
    };

    const event = await this.eventRepository.updateEvent<CommunicationThreadEventPayload>(threadId, {
      payload: updatedPayload,
      metadata: {
        ...current.metadata,
        category: updatedPayload.category
      },
      userId: updatedPayload.updatedBy ?? current.createdBy ?? null
    });

    return this.mapThreadEvent(event);
  }

  async listThreads(taskId: string): Promise<TaskCommunicationThreadRecord[]> {
    const events = await this.eventRepository.listEvents<CommunicationThreadEventPayload>(taskId, {
      facetType: COMMUNICATION_FACET_TYPE,
      eventType: COMMUNICATION_THREAD_EVENT
    });

    return events.map(event => this.mapThreadEvent(event));
  }

  async deleteThreadsByTaskIds(taskIds: string[]): Promise<void> {
    if (!taskIds.length) {
      return;
    }

    await this.eventRepository.deleteEventsByTaskIds(taskIds, COMMUNICATION_FACET_TYPE);
  }

  async insertMessage(input: InsertTaskCommunicationMessageInput): Promise<TaskCommunicationMessageRecord> {
    const timestamp = input.createdAt ?? new Date();
    const payload: CommunicationMessageEventPayload = {
      communicationId: input.communicationId,
      content: input.content,
      attachments: input.attachments ?? [],
      metadata: input.metadata ?? {}
    };

    const taskId = input.taskId ?? (await this.resolveTaskId(input.communicationId));

    const event = await this.eventRepository.insertEvent<CommunicationMessageEventPayload>({
      taskId,
      facetType: COMMUNICATION_FACET_TYPE,
      eventType: COMMUNICATION_MESSAGE_EVENT,
      payload,
      parentId: input.communicationId,
      userId: input.authorId ?? undefined,
      occurredAt: timestamp
    });

    return this.mapMessageEvent(event);
  }

  async listMessagesByThreadIds(threadIds: string[]): Promise<Map<string, TaskCommunicationMessageRecord[]>> {
    const result = new Map<string, TaskCommunicationMessageRecord[]>();

    const events = await this.eventRepository.listEventsByParentIds<CommunicationMessageEventPayload>(threadIds, {
      facetType: COMMUNICATION_FACET_TYPE,
      eventType: COMMUNICATION_MESSAGE_EVENT
    });

    for (const event of events) {
      const record = this.mapMessageEvent(event);
      const existing = result.get(record.communicationId);
      if (existing) {
        existing.push(record);
      } else {
        result.set(record.communicationId, [record]);
      }
    }

    return result;
  }

  async getLegacyCommunicationData(taskId: string): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').select('communication_data').eq('id', taskId).maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch legacy communication data: ${error.message}`);
    }

    return (data?.communication_data as Record<string, unknown> | undefined) ?? null;
  }

  async clearLegacyCommunicationData(taskId: string): Promise<void> {
    const { error } = await this.supabase.client.from('blueprint_tasks').update({ communication_data: null }).eq('id', taskId);

    if (error) {
      throw new Error(`Failed to clear legacy communication data: ${error.message}`);
    }
  }

  private async resolveTaskId(threadId: string): Promise<string> {
    const event = await this.eventRepository.getEventById<CommunicationThreadEventPayload>(threadId);
    if (!event) {
      throw new Error(`Communication thread ${threadId} not found`);
    }
    return event.taskId;
  }

  private mapThreadEvent(event: TaskEventRecord<CommunicationThreadEventPayload>): TaskCommunicationThreadRecord {
    return {
      id: event.id,
      taskId: event.taskId,
      topic: event.payload?.topic ?? '',
      category: event.payload?.category ?? 'general',
      status: event.payload?.status ?? 'open',
      createdBy: event.createdBy,
      updatedBy: event.payload?.updatedBy ?? event.createdBy,
      createdAt: event.createdAt,
      updatedAt: event.occurredAt,
      lastMessageAt: event.payload?.lastMessageAt ? new Date(event.payload.lastMessageAt) : null,
      metadata: event.payload?.metadata ?? {}
    };
  }

  private mapMessageEvent(event: TaskEventRecord<CommunicationMessageEventPayload>): TaskCommunicationMessageRecord {
    return {
      id: event.id,
      communicationId: event.payload?.communicationId ?? event.parentId ?? '',
      authorId: event.createdBy,
      content: event.payload?.content ?? '',
      attachments: event.payload?.attachments ?? [],
      metadata: event.payload?.metadata ?? {},
      createdAt: event.createdAt
    };
  }
}
