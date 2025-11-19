import { Pipe, PipeTransform } from '@angular/core';

/**
 * File Size Pipe
 *
 * 格式化文件大小为人类可读的格式
 * 使用 Angular 20 独立管道模式
 *
 * 支持单位：
 * - B (Bytes)
 * - KB (Kilobytes)
 * - MB (Megabytes)
 * - GB (Gigabytes)
 * - TB (Terabytes)
 *
 * @example
 * ```html
 * <!-- 基本使用（默认 2 位小数） -->
 * <span>{{ 1024 | fileSize }}</span>
 * <!-- 输出: 1.00 KB -->
 *
 * <!-- 指定小数位数 -->
 * <span>{{ 1536000 | fileSize:0 }}</span>
 * <!-- 输出: 1 MB -->
 *
 * <!-- 大文件 -->
 * <span>{{ 1073741824 | fileSize:2 }}</span>
 * <!-- 输出: 1.00 GB -->
 *
 * <!-- 在文档列表中使用 -->
 * <div *ngFor="let doc of documents">
 *   {{ doc.name }} ({{ doc.size | fileSize }})
 * </div>
 * ```
 */
@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {
  private readonly units = ['B', 'KB', 'MB', 'GB', 'TB'];
  private readonly threshold = 1024;

  /**
   * 转换文件大小
   *
   * @param value 文件大小（字节）
   * @param precision 小数位数，默认 2
   * @returns 格式化后的文件大小字符串
   */
  transform(value: number | null | undefined, precision = 2): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0 B';
    }

    // 处理负数
    const isNegative = value < 0;
    const absoluteValue = Math.abs(value);

    // 处理零和小于 1 字节的情况
    if (absoluteValue === 0) {
      return '0 B';
    }

    if (absoluteValue < 1) {
      return `${isNegative ? '-' : ''}${absoluteValue.toFixed(precision)} B`;
    }

    // 计算单位索引
    const unitIndex = Math.floor(Math.log(absoluteValue) / Math.log(this.threshold));
    const clampedUnitIndex = Math.min(unitIndex, this.units.length - 1);

    // 计算大小
    const size = absoluteValue / Math.pow(this.threshold, clampedUnitIndex);

    // 格式化输出
    const formattedSize = size.toFixed(precision);
    const unit = this.units[clampedUnitIndex];

    return `${isNegative ? '-' : ''}${formattedSize} ${unit}`;
  }
}
