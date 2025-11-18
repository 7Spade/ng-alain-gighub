import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

/**
 * Status Badge Component
 *
 * 状态徽章组件，用于显示各种状态标签
 * 使用 Angular 20 Signal Inputs 和 OnPush 策略
 *
 * 功能：
 * - 支持多种状态类型
 * - 自动颜色映射
 * - 可自定义文本和颜色
 * - 支持图标
 *
 * @example
 * ```html
 * <!-- 基本使用 -->
 * <app-status-badge [status]="'active'" />
 *
 * <!-- 指定类型 -->
 * <app-status-badge [status]="'planning'" [type]="'blueprint'" />
 *
 * <!-- 自定义颜色 -->
 * <app-status-badge [status]="'custom'" [color]="'purple'" [text]="'自定义状态'" />
 *
 * <!-- 带图标 -->
 * <app-status-badge [status]="'completed'" [showIcon]="true" />
 * ```
 */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-tag [nzColor]="badgeColor()">
      @if (showIcon()) {
        <span nz-icon [nzType]="iconType()" [nzTheme]="'outline'"></span>
      }
      {{ displayText() }}
    </nz-tag>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      nz-tag {
        margin: 0;
      }

      [nz-icon] {
        margin-right: 4px;
      }
    `
  ]
})
export class StatusBadgeComponent {
  /** 状态值 */
  status = input.required<string>();

  /** 状态类型（blueprint, task, issue 等） */
  type = input<string>('default');

  /** 自定义显示文本 */
  text = input<string>('');

  /** 自定义颜色 */
  color = input<string>('');

  /** 是否显示图标 */
  showIcon = input<boolean>(false);

  // 状态颜色映射
  private readonly colorMap: Record<string, string> = {
    // 通用状态
    active: 'green',
    inactive: 'default',
    pending: 'orange',
    in_progress: 'blue',
    completed: 'green',
    cancelled: 'default',
    failed: 'red',
    success: 'green',
    error: 'red',
    warning: 'orange',
    
    // 蓝图状态
    planning: 'blue',
    on_hold: 'orange',
    archived: 'default',
    
    // 分支状态
    merged: 'purple',
    closed: 'default',
    
    // 问题状态
    open: 'red',
    resolved: 'green',
    reopened: 'orange',
    
    // PR 状态
    reviewing: 'blue',
    approved: 'green',
    rejected: 'red',
    
    // QC 状态
    passed: 'green',
    recheck_required: 'orange',
    
    // 通知状态
    unread: 'red',
    read: 'default'
  };

  // 状态图标映射
  private readonly iconMap: Record<string, string> = {
    active: 'check-circle',
    inactive: 'minus-circle',
    pending: 'clock-circle',
    in_progress: 'sync',
    completed: 'check-circle',
    cancelled: 'close-circle',
    failed: 'close-circle',
    success: 'check-circle',
    error: 'close-circle',
    warning: 'exclamation-circle',
    planning: 'file-text',
    on_hold: 'pause-circle',
    archived: 'inbox',
    merged: 'merge',
    closed: 'close-circle',
    open: 'issues-close',
    resolved: 'check',
    reopened: 'redo',
    reviewing: 'eye',
    approved: 'check',
    rejected: 'close',
    passed: 'check',
    recheck_required: 'redo',
    unread: 'mail',
    read: 'mail'
  };

  /** 计算徽章颜色 */
  badgeColor = computed(() => {
    // 优先使用自定义颜色
    if (this.color()) {
      return this.color();
    }
    
    // 使用状态映射颜色
    const status = this.status().toLowerCase();
    return this.colorMap[status] || 'default';
  });

  /** 计算显示文本 */
  displayText = computed(() => {
    // 优先使用自定义文本
    if (this.text()) {
      return this.text();
    }
    
    // 使用状态文本映射
    const status = this.status().toLowerCase();
    const type = this.type();
    const textMap = this.statusTextMap[type] || this.statusTextMap['default'];
    
    return textMap[status] || this.status();
  });

  // 状态文本映射
  private readonly statusTextMap: Record<string, Record<string, string>> = {
    blueprint: {
      planning: '规划中',
      active: '进行中',
      on_hold: '暂停',
      completed: '已完成',
      archived: '已归档'
    },
    branch: {
      active: '活跃',
      merged: '已合并',
      closed: '已关闭'
    },
    task: {
      pending: '待处理',
      in_progress: '进行中',
      completed: '已完成',
      cancelled: '已取消'
    },
    issue: {
      open: '待处理',
      in_progress: '处理中',
      resolved: '已解决',
      closed: '已关闭',
      reopened: '已重开'
    },
    pr: {
      open: '打开',
      reviewing: '审核中',
      approved: '已批准',
      rejected: '已拒绝',
      merged: '已合并',
      closed: '已关闭'
    },
    qc: {
      pending: '待检查',
      passed: '已通过',
      failed: '未通过',
      recheck_required: '需重检'
    },
    bot: {
      active: '活跃',
      inactive: '非活跃',
      suspended: '已暂停',
      pending: '待执行',
      running: '执行中',
      completed: '已完成',
      failed: '失败',
      cancelled: '已取消'
    },
    notification: {
      unread: '未读',
      read: '已读',
      archived: '已归档'
    },
    default: {
      active: '活跃',
      inactive: '非活跃',
      pending: '待处理',
      in_progress: '进行中',
      completed: '已完成',
      failed: '失败',
      success: '成功',
      error: '错误',
      warning: '警告'
    }
  };

  /** 计算图标类型 */
  iconType = computed(() => {
    const status = this.status().toLowerCase();
    return this.iconMap[status] || 'info-circle';
  });
}
