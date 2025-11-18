import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

/**
 * Connection Status Indicator Component
 *
 * Phase 5, Task 5.2: Connection Status Indicator
 *
 * Displays the Realtime connection status with visual indicators:
 * - Online (green): Connected to Supabase Realtime
 * - Offline (red): Disconnected
 * - Reconnecting (orange): Attempting to reconnect
 *
 * Features:
 * - Color-coded status badges
 * - Tooltips with detailed status info
 * - Auto-reconnection support
 * - Signal-based reactive updates
 *
 * @example
 * ```html
 * <app-connection-status
 *   [status]="connectionStatus()"
 *   [lastUpdated]="lastUpdate()"
 * />
 * ```
 */
@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="connection-status">
      <nz-badge [nzStatus]="badgeStatus()" [nzText]="statusText()" nz-tooltip [nzTooltipTitle]="tooltipContent()"> </nz-badge>

      @if (showReconnectButton()) {
        <button nz-button nzType="link" nzSize="small" (click)="onReconnect()">
          <i nz-icon nzType="reload"></i>
          重新連線
        </button>
      }
    </div>
  `,
  styles: [
    `
      .connection-status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        font-size: 12px;
      }
    `
  ]
})
export class ConnectionStatusComponent {
  // Inputs
  status = input<'connected' | 'disconnected' | 'reconnecting'>('connected');
  lastUpdated = input<Date | null>(null);
  reconnectFn = input<(() => void) | null>(null);

  // Computed: Badge status for NzBadge
  badgeStatus = computed(() => {
    const currentStatus = this.status();
    switch (currentStatus) {
      case 'connected':
        return 'success' as const;
      case 'disconnected':
        return 'error' as const;
      case 'reconnecting':
        return 'processing' as const;
      default:
        return 'default' as const;
    }
  });

  // Computed: Status text
  statusText = computed(() => {
    const currentStatus = this.status();
    switch (currentStatus) {
      case 'connected':
        return '線上';
      case 'disconnected':
        return '離線';
      case 'reconnecting':
        return '重新連線中...';
      default:
        return '未知';
    }
  });

  // Computed: Tooltip content with last updated time
  tooltipContent = computed(() => {
    const currentStatus = this.status();
    const lastUpdate = this.lastUpdated();

    let baseText = '';
    switch (currentStatus) {
      case 'connected':
        baseText = 'Realtime 連線正常';
        break;
      case 'disconnected':
        baseText = 'Realtime 連線中斷';
        break;
      case 'reconnecting':
        baseText = '正在嘗試重新連線...';
        break;
      default:
        baseText = '連線狀態未知';
    }

    if (lastUpdate) {
      const timeStr = lastUpdate.toLocaleTimeString('zh-TW');
      return `${baseText}\n最後更新: ${timeStr}`;
    }

    return baseText;
  });

  // Computed: Show reconnect button when disconnected
  showReconnectButton = computed(() => {
    return this.status() === 'disconnected' && this.reconnectFn() !== null;
  });

  // Handle reconnect button click
  onReconnect(): void {
    const fn = this.reconnectFn();
    if (fn) {
      fn();
    }
  }
}
