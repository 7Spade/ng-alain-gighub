import type { BlueprintTaskPriority, BlueprintTaskStatus } from '@shared/models/blueprint-aggregation.model';

type TaskPriority = BlueprintTaskPriority | null | undefined;
type TaskStatus = BlueprintTaskStatus | null | undefined;

export function getTaskPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case 'urgent':
      return 'red';
    case 'high':
      return 'orange';
    case 'medium':
      return 'blue';
    case 'low':
      return 'green';
    default:
      return 'default';
  }
}

export function getTaskStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'processing';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
}
