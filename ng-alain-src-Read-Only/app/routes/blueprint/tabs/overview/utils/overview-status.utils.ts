import type { Blueprint } from '@shared';

type BlueprintStatus = Blueprint['status'];

const STATUS_CONFIG: Record<
  BlueprintStatus,
  {
    readonly color: 'default' | 'processing' | 'warning' | 'success';
    readonly text: string;
  }
> = {
  planning: { color: 'default', text: '規劃中' },
  active: { color: 'processing', text: '進行中' },
  'on-hold': { color: 'warning', text: '暫停' },
  completed: { color: 'success', text: '已完成' },
  archived: { color: 'default', text: '已歸檔' }
};

export function getStatusColor(status: BlueprintStatus): string {
  return STATUS_CONFIG[status]?.color ?? 'default';
}

export function getStatusText(status: BlueprintStatus): string {
  return STATUS_CONFIG[status]?.text ?? status;
}
