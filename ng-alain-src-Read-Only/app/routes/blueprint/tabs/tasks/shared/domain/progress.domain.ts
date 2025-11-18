import type { QuantityProgressSnapshot } from '@models';
import { TaskStatus } from '@models';
import { TaskProgressHistoryStatus } from '@tasks/shared/repository/task-progress.repository';

export interface NormalizeQuantityInput {
  unit: string;
  planned: number;
  installed: number;
  used: number;
}

export function normalizeQuantitySnapshot(quantity: NormalizeQuantityInput): QuantityProgressSnapshot {
  const unit = quantity.unit?.trim() || 'item';
  const planned = Math.max(1, Math.floor(quantity.planned));
  const installed = Math.min(Math.max(0, Math.floor(quantity.installed)), planned);
  const used = Math.min(Math.max(0, Math.floor(quantity.used)), planned);

  return {
    unit,
    planned,
    installed,
    used,
    lastUpdatedAt: new Date()
  };
}

export function calculatePercentageFromSnapshot(snapshot: QuantityProgressSnapshot): number {
  if (snapshot.planned <= 0) {
    return 0;
  }
  const completed = snapshot.installed > 0 ? snapshot.installed : snapshot.used;
  return clampPercentage((completed / snapshot.planned) * 100);
}

export function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 100) {
    return 100;
  }
  return Number(Math.round((value + Number.EPSILON) * 100) / 100);
}

export function deriveStatusFromSnapshot(snapshot: QuantityProgressSnapshot, override?: TaskStatus): TaskStatus {
  if (override) {
    return override;
  }

  if (snapshot.installed >= snapshot.planned || snapshot.used >= snapshot.planned) {
    return TaskStatus.COMPLETED;
  }

  if (snapshot.installed > 0 || snapshot.used > 0) {
    return TaskStatus.IN_PROGRESS;
  }

  return TaskStatus.NOT_STARTED;
}

export function defaultProgressSnapshot(): QuantityProgressSnapshot {
  return {
    unit: 'item',
    planned: 1,
    installed: 0,
    used: 0,
    lastUpdatedAt: new Date()
  };
}

export function createSnapshotRecord(snapshot: QuantityProgressSnapshot, timestamp: Date) {
  return {
    unit: snapshot.unit,
    planned: snapshot.planned,
    installed: snapshot.installed,
    used: snapshot.used,
    lastUpdatedAt: snapshot.lastUpdatedAt?.toISOString() ?? timestamp.toISOString()
  };
}

export function toHistoryStatus(status: TaskStatus): TaskProgressHistoryStatus {
  switch (status) {
    case TaskStatus.IN_PROGRESS:
    case TaskStatus.UNDER_REVIEW:
    case TaskStatus.DELAYED:
      return 'in-progress';
    case TaskStatus.COMPLETED:
    case TaskStatus.VERIFIED:
    case TaskStatus.ACCEPTED:
      return 'completed';
    case TaskStatus.CANCELLED:
      return 'cancelled';
    case TaskStatus.PAUSED:
    case TaskStatus.ON_HOLD:
      return 'on-hold';
    case TaskStatus.READY_TO_START:
    case TaskStatus.WAITING_APPROVAL:
    case TaskStatus.NOT_STARTED:
    default:
      return 'todo';
  }
}

export function fromHistoryStatus(status: TaskProgressHistoryStatus | null | undefined): TaskStatus {
  switch (status) {
    case 'in-progress':
      return TaskStatus.IN_PROGRESS;
    case 'completed':
      return TaskStatus.COMPLETED;
    case 'cancelled':
      return TaskStatus.CANCELLED;
    case 'blocked':
      return TaskStatus.DELAYED;
    case 'on-hold':
      return TaskStatus.ON_HOLD;
    case 'todo':
    default:
      return TaskStatus.NOT_STARTED;
  }
}
