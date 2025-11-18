import { Pipe, PipeTransform } from '@angular/core';

/**
 * Status Pipe
 *
 * 格式化状态值为人类可读的文本
 * 使用 Angular 20 独立管道模式
 *
 * 支持的状态类型：
 * - Blueprint: planning, active, on_hold, completed, archived
 * - Branch: active, merged, closed
 * - Task: pending, in_progress, completed, cancelled
 * - Issue: open, in_progress, resolved, closed, reopened
 * - PR: open, reviewing, approved, rejected, merged, closed
 * - QC: pending, passed, failed, recheck_required
 * - Bot: active, inactive, suspended
 * - Notification: unread, read, archived
 *
 * @example
 * ```html
 * <!-- 基本使用 -->
 * <span>{{ 'active' | status }}</span>
 * <!-- 输出: 活跃 -->
 *
 * <!-- 指定类型 -->
 * <span>{{ 'planning' | status:'blueprint' }}</span>
 * <!-- 输出: 规划中 -->
 *
 * <!-- 在组件中使用 -->
 * <span [class.text-success]="status === 'completed'">
 *   {{ status | status:'task' }}
 * </span>
 * ```
 */
@Pipe({
  name: 'status',
  standalone: true
})
export class StatusPipe implements PipeTransform {
  private readonly statusMap: Record<string, Record<string, string>> = {
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

  transform(value: string | null | undefined, type: string = 'default'): string {
    if (!value) return '';

    const normalizedValue = value.toLowerCase();
    const typeMap = this.statusMap[type] || this.statusMap.default;
    
    return typeMap[normalizedValue] || value;
  }
}
