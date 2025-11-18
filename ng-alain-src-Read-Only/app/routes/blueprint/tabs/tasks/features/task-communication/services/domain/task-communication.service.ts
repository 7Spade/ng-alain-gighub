/**
 * Task Communication Service
 *
 * 任務溝通維度管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：L. 溝通維度
 *
 * 職責：
 * - 管理溝通記錄（會議、郵件、通話、現場指示等）
 * - 處理 RFI（Request for Information）與回應追蹤
 * - 管理會議記錄與行動項目
 * - 追蹤溝通狀態與閱讀確認
 *
 * @see @ETMS_DESIGN_SPEC.md L. 溝通維度
 */

import { Injectable, inject } from '@angular/core';
import { UserService } from '@core/account/user/user.service';
import type {
  TaskCommunication,
  TaskCommunicationCategory,
  TaskCommunicationMessage,
  TaskCommunicationThread,
  TaskCommunicationThreadStatus
} from '@models';
import {
  TaskCommunicationRepository,
  type InsertTaskCommunicationMessageInput,
  type TaskCommunicationMessageRecord,
  type TaskCommunicationThreadRecord,
  type UpdateTaskCommunicationThreadInput
} from '@tasks/shared/repository/task-communication.repository';

interface CreateTaskCommunicationInput {
  topic: string;
  category?: TaskCommunicationCategory;
  status?: TaskCommunicationThreadStatus;
  metadata?: Record<string, unknown>;
  message: {
    content: string;
    attachments?: string[];
    metadata?: Record<string, unknown>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TaskCommunicationService {
  private readonly userService = inject(UserService);
  private readonly repository = inject(TaskCommunicationRepository);

  async addCommunication(taskId: string, input: CreateTaskCommunicationInput): Promise<TaskCommunicationThread> {
    const userId = await this.getCurrentUserId();

    const threadRecord = await this.repository.createThread({
      taskId,
      topic: input.topic,
      category: input.category ?? 'general',
      status: input.status ?? 'open',
      createdBy: userId,
      updatedBy: userId,
      metadata: input.metadata ?? {},
      lastMessageAt: undefined
    });

    const messageRecord = await this.repository.insertMessage({
      communicationId: threadRecord.id,
      authorId: userId,
      content: input.message.content,
      attachments: input.message.attachments ?? [],
      metadata: input.message.metadata ?? {},
      createdAt: undefined,
      taskId
    });

    await this.repository.updateThread(threadRecord.id, {
      updatedBy: userId,
      lastMessageAt: messageRecord.createdAt
    });

    return this.toThread(threadRecord, [messageRecord]);
  }

  async addMessage(
    threadId: string,
    content: string,
    attachments: string[] = [],
    metadata: Record<string, unknown> = {}
  ): Promise<TaskCommunicationMessage> {
    const userId = await this.getCurrentUserId();
    const payload: InsertTaskCommunicationMessageInput = {
      communicationId: threadId,
      authorId: userId,
      content,
      attachments,
      metadata
    };

    const record = await this.repository.insertMessage(payload);
    await this.repository.updateThread(threadId, { updatedBy: userId, lastMessageAt: record.createdAt });

    return this.toMessage(record);
  }

  async getTaskCommunication(taskId: string): Promise<TaskCommunication | null> {
    let threads = await this.repository.listThreads(taskId);

    if (!threads.length) {
      const migrated = await this.migrateLegacyCommunicationData(taskId);
      if (migrated) {
        threads = await this.repository.listThreads(taskId);
      }
    }

    if (!threads.length) {
      return { threads: [] };
    }

    const messagesMap = await this.repository.listMessagesByThreadIds(threads.map(thread => thread.id));

    return {
      threads: threads.map(thread => this.toThread(thread, messagesMap.get(thread.id) ?? []))
    };
  }

  async removeCommunications(taskIds: string | string[]): Promise<void> {
    const normalized = Array.isArray(taskIds) ? taskIds : [taskIds];
    if (!normalized.length) {
      return;
    }

    await this.repository.deleteThreadsByTaskIds(normalized);
  }

  private toThread(record: TaskCommunicationThreadRecord, messages: TaskCommunicationMessageRecord[]): TaskCommunicationThread {
    return {
      summary: {
        id: record.id,
        taskId: record.taskId,
        topic: record.topic,
        category: record.category as TaskCommunicationCategory,
        status: record.status as TaskCommunicationThreadStatus,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        lastMessageAt: record.lastMessageAt,
        metadata: record.metadata ?? {}
      },
      messages: messages.map(message => this.toMessage(message))
    };
  }

  private toMessage(record: TaskCommunicationMessageRecord): TaskCommunicationMessage {
    return {
      id: record.id,
      communicationId: record.communicationId,
      authorId: record.authorId,
      content: record.content,
      attachments: Array.isArray(record.attachments) ? (record.attachments as string[]) : [],
      metadata: record.metadata ?? {},
      createdAt: record.createdAt
    };
  }

  private async migrateLegacyCommunicationData(taskId: string): Promise<boolean> {
    const legacyData = await this.repository.getLegacyCommunicationData(taskId);
    const legacyCommunications = Array.isArray((legacyData as any)?.communications) ? ((legacyData as any).communications as any[]) : [];

    if (!legacyCommunications.length) {
      return false;
    }

    const grouped = this.groupLegacyCommunications(legacyCommunications);
    const userId = await this.getCurrentUserId();

    for (const group of grouped) {
      const threadRecord = await this.repository.createThread({
        taskId,
        topic: group.topic,
        category: group.category,
        status: group.status,
        createdBy: userId,
        updatedBy: userId,
        metadata: group.metadata,
        lastMessageAt: group.lastMessageAt
      });

      for (const message of group.messages) {
        await this.repository.insertMessage({
          communicationId: threadRecord.id,
          authorId: message.authorId,
          content: message.content,
          attachments: message.attachments,
          metadata: message.metadata,
          createdAt: message.createdAt
        });
      }

      const patch: UpdateTaskCommunicationThreadInput = {
        updatedBy: userId,
        lastMessageAt: group.lastMessageAt,
        metadata: group.metadata
      };
      await this.repository.updateThread(threadRecord.id, patch);
    }

    await this.repository.clearLegacyCommunicationData(taskId);
    return true;
  }

  private groupLegacyCommunications(communications: any[]): Array<{
    topic: string;
    category: TaskCommunicationCategory;
    status: TaskCommunicationThreadStatus;
    metadata: Record<string, unknown>;
    messages: Array<{
      authorId: string | null;
      content: string;
      attachments: string[];
      metadata: Record<string, unknown>;
      createdAt: Date;
    }>;
    lastMessageAt: Date | null;
  }> {
    const groups = new Map<string, ReturnType<TaskCommunicationService['groupLegacyCommunications']>[number]>();

    for (const item of communications) {
      const subject = typeof item.subject === 'string' && item.subject.trim().length > 0 ? (item.subject as string) : '任務溝通';
      const reference =
        typeof item.referenceNumber === 'string' && item.referenceNumber.length > 0 ? (item.referenceNumber as string) : undefined;
      const key = reference ?? subject;
      const category = this.mapLegacyTypeToCategory(item.type as string | undefined);
      const status = this.mapLegacyStatusToThreadStatus(item.status as string | undefined);
      const timestamp = item.timestamp ? new Date(item.timestamp as string) : new Date();
      const attachments = Array.isArray(item.attachments) ? (item.attachments as string[]) : [];
      const messageMetadata: Record<string, unknown> = {
        legacyType: item.type,
        referenceNumber: item.referenceNumber,
        priority: item.priority,
        status: item.status,
        from: item.from,
        to: item.to,
        cc: item.cc,
        relatedTaskIds: item.relatedTaskIds,
        replyToId: item.replyToId
      };

      const message = {
        authorId: (item.from as any)?.userId ?? null,
        content: (item.content as string) ?? '',
        attachments,
        metadata: messageMetadata,
        createdAt: timestamp
      };

      const existing = groups.get(key);
      if (existing) {
        existing.messages.push(message);
        existing.lastMessageAt =
          !existing.lastMessageAt || existing.lastMessageAt.getTime() < timestamp.getTime() ? timestamp : existing.lastMessageAt;
      } else {
        groups.set(key, {
          topic: subject,
          category,
          status,
          metadata: {
            legacy: true,
            referenceNumber: item.referenceNumber,
            priority: item.priority,
            direction: item.direction,
            source: 'communication_data'
          },
          messages: [message],
          lastMessageAt: timestamp
        });
      }
    }

    return Array.from(groups.values());
  }

  private mapLegacyTypeToCategory(type: string | undefined): TaskCommunicationCategory {
    switch (type) {
      case 'rfi':
        return 'rfi';
      case 'meeting':
        return 'meeting';
      case 'notice':
      case 'issue':
        return 'issue';
      default:
        return 'general';
    }
  }

  private mapLegacyStatusToThreadStatus(status: string | undefined): TaskCommunicationThreadStatus {
    switch (status) {
      case 'acknowledged':
      case 'replied':
        return 'resolved';
      default:
        return 'open';
    }
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
}
