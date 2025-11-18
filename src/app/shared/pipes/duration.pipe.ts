import { Pipe, PipeTransform } from '@angular/core';

/**
 * Duration Pipe
 *
 * 格式化时间长度为人类可读的格式
 * 使用 Angular 20 独立管道模式
 *
 * 支持输入格式：
 * - 秒数（默认）
 * - 毫秒（指定 'ms' 单位）
 * - 分钟（指定 'minutes' 单位）
 * - 小时（指定 'hours' 单位）
 *
 * 输出格式：
 * - short: "2h 30m" （默认）
 * - long: "2 小时 30 分钟"
 * - compact: "2:30:45"
 *
 * @example
 * ```html
 * <!-- 基本使用（秒数，short 格式） -->
 * <span>{{ 3661 | duration }}</span>
 * <!-- 输出: 1h 1m 1s -->
 *
 * <!-- 长格式 -->
 * <span>{{ 7200 | duration:'seconds':'long' }}</span>
 * <!-- 输出: 2 小时 -->
 *
 * <!-- 紧凑格式 -->
 * <span>{{ 3661 | duration:'seconds':'compact' }}</span>
 * <!-- 输出: 01:01:01 -->
 *
 * <!-- 毫秒输入 -->
 * <span>{{ 5000 | duration:'ms' }}</span>
 * <!-- 输出: 5s -->
 *
 * <!-- 在任务列表中使用 -->
 * <div *ngFor="let task of tasks">
 *   耗时: {{ task.duration | duration:'seconds':'long' }}
 * </div>
 * ```
 */
@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  /**
   * 转换时间长度
   * 
   * @param value 时间值
   * @param unit 输入单位，默认 'seconds'
   * @param format 输出格式，默认 'short'
   * @returns 格式化后的时间长度字符串
   */
  transform(
    value: number | null | undefined,
    unit: 'ms' | 'seconds' | 'minutes' | 'hours' = 'seconds',
    format: 'short' | 'long' | 'compact' = 'short'
  ): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0s';
    }

    // 转换为秒
    let seconds = value;
    switch (unit) {
      case 'ms':
        seconds = value / 1000;
        break;
      case 'minutes':
        seconds = value * 60;
        break;
      case 'hours':
        seconds = value * 3600;
        break;
    }

    // 处理负数
    const isNegative = seconds < 0;
    seconds = Math.abs(seconds);

    // 计算各个单位
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    // 根据格式返回结果
    const prefix = isNegative ? '-' : '';

    switch (format) {
      case 'long':
        return prefix + this.formatLong(days, hours, minutes, secs);
      case 'compact':
        return prefix + this.formatCompact(days, hours, minutes, secs);
      case 'short':
      default:
        return prefix + this.formatShort(days, hours, minutes, secs);
    }
  }

  /**
   * 短格式：2h 30m 45s
   */
  private formatShort(days: number, hours: number, minutes: number, seconds: number): string {
    const parts: string[] = [];
    
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
  }

  /**
   * 长格式：2 天 3 小时 30 分钟 45 秒
   */
  private formatLong(days: number, hours: number, minutes: number, seconds: number): string {
    const parts: string[] = [];
    
    if (days > 0) parts.push(`${days} 天`);
    if (hours > 0) parts.push(`${hours} 小时`);
    if (minutes > 0) parts.push(`${minutes} 分钟`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} 秒`);

    return parts.join(' ');
  }

  /**
   * 紧凑格式：02:30:45 或 30:45
   */
  private formatCompact(days: number, hours: number, minutes: number, seconds: number): string {
    const totalHours = days * 24 + hours;
    
    if (totalHours > 0) {
      return `${this.padZero(totalHours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
    } else if (minutes > 0) {
      return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
    } else {
      return `0:${this.padZero(seconds)}`;
    }
  }

  /**
   * 补零到两位数
   */
  private padZero(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
