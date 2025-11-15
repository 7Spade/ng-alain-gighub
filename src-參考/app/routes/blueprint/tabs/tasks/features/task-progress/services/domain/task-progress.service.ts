/**
 * Task Progress Service
 *
 * - 讀寫資料表：`blueprint_task_progress_history`
 * - 進度摘要來源為 Facet (`blueprint_task_facets`, facet_type='resource')，避免直接存取 legacy JSON 欄位
 */

import { Injectable, inject } from '@angular/core';
import type { TaskProgress, ProgressState, ProgressHistoryItem, QuantityProgressSnapshot } from '@models';
import { TaskStatus } from '@models';
import { TaskResourceService } from '@tasks/features/task-resource/services/domain/task-resource.service';
import { TaskHierarchyService } from '@tasks/features/task-tree/services/domain/task-hierarchy.service';
import {
  calculatePercentageFromSnapshot,
  clampPercentage,
  createSnapshotRecord,
  defaultProgressSnapshot,
  deriveStatusFromSnapshot,
  fromHistoryStatus,
  normalizeQuantitySnapshot,
  toHistoryStatus
} from '@tasks/shared/domain/progress.domain';
import { TaskProgressRepository, ProgressHistoryRecord, ProgressSnapshotRecord } from '@tasks/shared/repository/task-progress.repository';

interface QuantityUpdateInput {
  quantity: {
    unit: string;
    planned: number;
    installed: number;
    used: number;
  };
  percentage?: number;
  status?: TaskStatus;
  recordedBy?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskProgressService {
  private readonly resourceService = inject(TaskResourceService);
  private readonly hierarchyService = inject(TaskHierarchyService);
  private readonly progressRepository = inject(TaskProgressRepository);

  /**
   * 更新任務進度（僅接受 quantity 計算）
   */
  async updateProgress(taskId: string, data: QuantityUpdateInput, options?: { cascade?: boolean }): Promise<ProgressState> {
    const normalized = normalizeQuantitySnapshot(data.quantity);
    const snapshotTimestamp = new Date();
    const snapshotRecord = createSnapshotRecord(normalized, snapshotTimestamp);

    const percentage = data.percentage !== undefined ? clampPercentage(data.percentage) : calculatePercentageFromSnapshot(normalized);

    const previousRecord = await this.progressRepository.getLatest(taskId);
    const previousStatus = previousRecord ? fromHistoryStatus(previousRecord.status) : null;
    const status = deriveStatusFromSnapshot(normalized, data.status);

    await this.progressRepository.insert({
      taskId,
      recordedAt: snapshotTimestamp,
      recordedBy: data.recordedBy ?? null,
      source: data.notes ? 'manual' : null,
      percentage,
      status: toHistoryStatus(status),
      previousStatus: previousStatus ? toHistoryStatus(previousStatus) : null,
      snapshot: snapshotRecord,
      notes: data.notes ?? null
    });

    const updatePayload: Record<string, unknown> = {
      progress_percentage: percentage,
      progress_calculation_method: 'quantity',
      progress_data: null,
      updated_at: snapshotTimestamp.toISOString()
    };

    if (status !== previousStatus) {
      updatePayload['previous_status'] = previousStatus;
      updatePayload['status_changed_at'] = snapshotTimestamp.toISOString();
      updatePayload['status_changed_by'] = data.recordedBy ?? null;
    }

    await this.progressRepository.updateTaskProgressMeta(taskId, updatePayload);

    if (options?.cascade !== false) {
      await this.updateAncestorProgress(taskId);
    }

    const historyRecords = await this.progressRepository.getHistory(taskId);
    return this.buildProgressStateFromHistory(historyRecords, normalized);
  }

  /**
   * 取得任務進度
   */
  async getTaskProgress(taskId: string): Promise<TaskProgress | null> {
    const historyRecords = await this.progressRepository.getHistory(taskId);

    if (!historyRecords.length) {
      const fallbackSnapshot = await this.buildSnapshotFromResources(taskId);
      const progressState = this.buildProgressStateFromHistory([], fallbackSnapshot ?? undefined);
      return { progress: progressState };
    }

    const latestSnapshot = this.convertSnapshotRecord(
      historyRecords[historyRecords.length - 1]!.snapshot,
      historyRecords[historyRecords.length - 1]!.recordedAt
    );
    const progressState = this.buildProgressStateFromHistory(historyRecords, latestSnapshot);

    const syncedProgress = await this.syncProgressWithChildrenIfNeeded(taskId, progressState);

    return { progress: syncedProgress };
  }

  private buildProgressStateFromHistory(records: ProgressHistoryRecord[], fallbackSnapshot?: QuantityProgressSnapshot): ProgressState {
    if (!records.length) {
      const snapshot = fallbackSnapshot ?? defaultProgressSnapshot();
      const percentage = calculatePercentageFromSnapshot(snapshot);
      const status = deriveStatusFromSnapshot(snapshot);

      return {
        progress: {
          percentage,
          calculationMethod: 'quantity',
          quantity: snapshot,
          status,
          previousStatus: undefined,
          statusChangedAt: undefined,
          statusChangedBy: undefined,
          progressHistory: [],
          completionCriteria: [],
          verificationMethod: ''
        }
      };
    }

    const sorted = [...records].sort((a, b) => a.recordedAt.getTime() - b.recordedAt.getTime());
    const latest = sorted[sorted.length - 1]!;
    const snapshot = this.convertSnapshotRecord(latest.snapshot, latest.recordedAt);
    const history = sorted.map<ProgressHistoryItem>(record => ({
      date: record.recordedAt,
      percentage: clampPercentage(record.percentage),
      status: fromHistoryStatus(record.status),
      recordedBy: record.recordedBy ?? 'system',
      notes: record.notes ?? undefined
    }));

    const { statusChangedAt, statusChangedBy } = this.resolveStatusChangeMeta(sorted);

    return {
      progress: {
        percentage: clampPercentage(latest.percentage),
        calculationMethod: 'quantity',
        quantity: snapshot,
        status: fromHistoryStatus(latest.status),
        previousStatus: latest.previousStatus ? fromHistoryStatus(latest.previousStatus) : undefined,
        statusChangedAt,
        statusChangedBy,
        progressHistory: history.slice(-50),
        completionCriteria: [],
        verificationMethod: ''
      }
    };
  }

  private convertSnapshotRecord(record: ProgressSnapshotRecord, fallbackDate: Date): QuantityProgressSnapshot {
    const planned = Math.max(1, Math.floor(Number(record.planned ?? 1)));
    const installed = Math.min(Math.max(0, Math.floor(Number(record.installed ?? 0))), planned);
    const used = Math.min(Math.max(0, Math.floor(Number(record.used ?? installed))), planned);
    const lastUpdatedAt = record.lastUpdatedAt ? new Date(record.lastUpdatedAt) : fallbackDate;

    return {
      unit: record.unit?.trim() || 'item',
      planned,
      installed,
      used,
      lastUpdatedAt: Number.isNaN(lastUpdatedAt.getTime()) ? fallbackDate : lastUpdatedAt
    };
  }

  private resolveStatusChangeMeta(records: ProgressHistoryRecord[]): { statusChangedAt?: Date; statusChangedBy?: string } {
    for (let i = records.length - 1; i >= 0; i--) {
      const current = records[i]!;
      const previous = records[i - 1];
      if (!previous || previous.status !== current.status) {
        return {
          statusChangedAt: current.recordedAt,
          statusChangedBy: current.recordedBy ?? 'system'
        };
      }
    }
    return {};
  }

  private async buildSnapshotFromResources(taskId: string): Promise<QuantityProgressSnapshot | null> {
    const resource = await this.resourceService.getTaskResource(taskId);
    const material = resource?.materials?.materials?.[0];

    if (!material) {
      return null;
    }

    const planned = Math.max(1, Math.floor(material.plannedQuantity ?? 1));
    const installed = Math.min(Math.max(0, Math.floor(material.installedQuantity ?? 0)), planned);
    const used = Math.min(Math.max(0, Math.floor(material.usedQuantity ?? installed)), planned);

    return {
      unit: material.unit?.trim() || 'item',
      planned,
      installed,
      used,
      lastUpdatedAt: new Date()
    };
  }

  private async syncProgressWithChildrenIfNeeded(taskId: string, current: ProgressState): Promise<ProgressState> {
    const aggregate = await this.aggregateChildrenProgress(taskId);
    if (!aggregate) {
      return current;
    }

    const quantity = current.progress.quantity ?? defaultProgressSnapshot();
    const percentageDiff = Math.abs(aggregate.percentage - current.progress.percentage);
    const plannedDiff = Math.abs(aggregate.planned - quantity.planned);
    const installedDiff = Math.abs(aggregate.installed - quantity.installed);
    const usedDiff = Math.abs(aggregate.used - quantity.used);
    const unitChanged = quantity.unit !== aggregate.unit;

    if (percentageDiff <= 0.5 && plannedDiff === 0 && installedDiff === 0 && usedDiff === 0 && !unitChanged) {
      return current;
    }

    const updatedMaterial = await this.resourceService.setQuantity(taskId, {
      unit: aggregate.unit,
      plannedQuantity: aggregate.planned,
      installedQuantity: aggregate.installed,
      usedQuantity: aggregate.used
    });

    const updatedProgress = await this.updateProgress(taskId, {
      quantity: {
        unit: updatedMaterial.unit,
        planned: updatedMaterial.plannedQuantity,
        installed: updatedMaterial.installedQuantity,
        used: updatedMaterial.usedQuantity
      },
      percentage: aggregate.percentage
    });

    return updatedProgress;
  }

  private async updateAncestorProgress(taskId: string): Promise<void> {
    const ancestors = await this.hierarchyService.getAncestors(taskId);
    if (!ancestors.length) {
      return;
    }

    const orderedAncestors = [...ancestors].sort((a, b) => b.level - a.level);

    for (const ancestor of orderedAncestors) {
      const aggregate = await this.aggregateChildrenProgress(ancestor.id);
      if (!aggregate) {
        continue;
      }

      const updatedMaterial = await this.resourceService.setQuantity(ancestor.id, {
        unit: aggregate.unit,
        plannedQuantity: aggregate.planned,
        installedQuantity: aggregate.installed,
        usedQuantity: aggregate.used
      });

      await this.updateProgress(
        ancestor.id,
        {
          quantity: {
            unit: updatedMaterial.unit,
            planned: updatedMaterial.plannedQuantity,
            installed: updatedMaterial.installedQuantity,
            used: updatedMaterial.usedQuantity
          },
          percentage: aggregate.percentage
        },
        { cascade: false }
      );
    }
  }

  private async aggregateChildrenProgress(taskId: string): Promise<{
    planned: number;
    installed: number;
    used: number;
    percentage: number;
    unit: string;
  } | null> {
    const children = await this.hierarchyService.getChildren(taskId);
    if (!children.length) {
      return null;
    }

    const childIds = children.map(child => child.id);
    const latestMap = await this.progressRepository.getLatestMap(childIds);

    const childSnapshots = await Promise.all(
      children.map(async child => {
        const record = latestMap.get(child.id);
        let snapshot: QuantityProgressSnapshot | null = null;

        if (record) {
          snapshot = this.convertSnapshotRecord(record.snapshot, record.recordedAt);
        } else {
          snapshot = (await this.buildSnapshotFromResources(child.id)) ?? defaultProgressSnapshot();
        }

        const planned = Math.max(1, Math.floor(snapshot.planned));
        const installed = Math.min(Math.max(0, Math.floor(snapshot.installed)), planned);
        const used = Math.min(Math.max(0, Math.floor(snapshot.used)), planned);
        const completed = Math.min(planned, Math.max(installed, used));
        const unit = snapshot.unit?.trim() || 'item';

        return { planned, installed, used, completed, unit };
      })
    );

    let plannedTotal = 0;
    let installedTotal = 0;
    let usedTotal = 0;
    let completedTotal = 0;
    const unitSet = new Set<string>();

    for (const item of childSnapshots) {
      plannedTotal += item.planned;
      installedTotal += item.installed;
      usedTotal += item.used;
      completedTotal += item.completed;
      unitSet.add(item.unit);
    }

    if (plannedTotal <= 0) {
      plannedTotal = childSnapshots.length > 0 ? childSnapshots.length : 1;
    }

    const safeCompleted = Math.min(plannedTotal, Math.max(0, completedTotal));
    const safeInstalled = Math.min(plannedTotal, Math.max(0, installedTotal, safeCompleted));
    const safeUsed = Math.min(plannedTotal, Math.max(0, usedTotal));
    const percentage = clampPercentage(plannedTotal > 0 ? (safeCompleted / plannedTotal) * 100 : 0);
    const unit = unitSet.size === 1 ? Array.from(unitSet)[0]! : 'item';

    return {
      planned: plannedTotal,
      installed: safeInstalled,
      used: safeUsed,
      percentage,
      unit
    };
  }

  async removeProgress(taskId: string): Promise<void> {
    await this.progressRepository.deleteByTaskId(taskId);

    await this.progressRepository.clearTaskProgressMeta(taskId);
  }
}
