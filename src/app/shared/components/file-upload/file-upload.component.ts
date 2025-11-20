import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzUploadFile, NzUploadChangeParam } from 'ng-zorro-antd/upload';

/**
 * File Upload Component
 *
 * 文件上传组件，支持预览、拖拽上传、文件类型限制
 * 使用 Angular 20 Signal Inputs/Outputs 和 OnPush 策略
 *
 * 功能：
 * - 支持单文件/多文件上传
 * - 拖拽上传
 * - 文件预览（图片、文档）
 * - 文件类型和大小限制
 * - 上传进度显示
 * - 文件列表管理
 *
 * @example
 * ```html
 * <!-- 基本使用 -->
 * <app-file-upload
 *   [maxSize]="10"
 *   [accept]="'.jpg,.png,.pdf'"
 *   (filesChange)="onFilesChange($event)"
 * />
 *
 * <!-- 多文件上传 -->
 * <app-file-upload
 *   [multiple]="true"
 *   [maxCount]="5"
 *   [listType]="'picture-card'"
 *   (filesChange)="onFilesChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-upload
      [nzAccept]="accept()"
      [nzMultiple]="multiple()"
      [nzLimit]="maxCount()"
      [nzSize]="maxSize() * 1024"
      [nzFileList]="fileListState()"
      [nzListType]="listType()"
      [nzShowUploadList]="showList()"
      [nzDisabled]="disabled()"
      [nzBeforeUpload]="beforeUpload"
      (nzChange)="handleChange($event)"
    >
      @if (listType() === 'picture-card') {
        <div>
          <span nz-icon nzType="plus"></span>
          <div style="margin-top: 8px">{{ uploadText() }}</div>
        </div>
      } @else {
        <button nz-button [nzType]="'default'" [nzLoading]="uploading()">
          <span nz-icon nzType="upload"></span>
          {{ uploadText() }}
        </button>
      }
    </nz-upload>

    @if (showSizeHint()) {
      <div class="upload-hint">
        <span nz-icon nzType="info-circle" nzTheme="outline"></span>
        支持 {{ accept() || '所有类型' }} 文件，单个文件不超过 {{ maxSize() }} MB
        @if (multiple() && maxCount() > 0) {
          ，最多 {{ maxCount() }} 个文件
        }
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .upload-hint {
        margin-top: 8px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;

        [nz-icon] {
          margin-right: 4px;
        }
      }
    `
  ]
})
export class FileUploadComponent {
  /** 接受的文件类型，如 '.jpg,.png,.pdf' */
  accept = input<string>('');

  /** 是否支持多文件上传 */
  multiple = input<boolean>(false);

  /** 最大文件数量 */
  maxCount = input<number>(0);

  /** 最大文件大小（MB） */
  maxSize = input<number>(10);

  /** 列表类型 */
  listType = input<'text' | 'picture' | 'picture-card'>('text');

  /** 是否显示文件列表 */
  showList = input<boolean>(true);

  /** 是否显示大小提示 */
  showSizeHint = input<boolean>(true);

  /** 上传按钮文本 */
  uploadText = input<string>('上传文件');

  /** 是否禁用 */
  disabled = input<boolean>(false);

  /** 文件列表变化事件 */
  readonly filesChange = output<NzUploadFile[]>();

  /** 上传错误事件 */
  readonly uploadError = output<{ file: NzUploadFile; error: string }>();

  // 内部状态
  fileListState = signal<NzUploadFile[]>([]);
  uploading = signal<boolean>(false);

  /**
   * 文件上传前的钩子
   */
  beforeUpload = (file: NzUploadFile): boolean => {
    // 检查文件大小
    const maxSizeBytes = this.maxSize() * 1024 * 1024;
    if (file.size && file.size > maxSizeBytes) {
      this.uploadError.emit({
        file,
        error: `文件大小超过限制（${this.maxSize()} MB）`
      });
      return false;
    }

    // 检查文件数量
    if (this.maxCount() > 0 && this.fileListState().length >= this.maxCount()) {
      this.uploadError.emit({
        file,
        error: `文件数量超过限制（${this.maxCount()} 个）`
      });
      return false;
    }

    // 添加到文件列表（不实际上传，由父组件处理）
    this.fileListState.update(files => [...files, file]);
    this.filesChange.emit(this.fileListState());

    return false; // 阻止自动上传
  };

  /**
   * 文件列表变化处理
   */
  handleChange(info: NzUploadChangeParam): void {
    const fileList = [...info.fileList];

    // 更新状态
    this.fileListState.set(fileList);

    // 发出变化事件
    this.filesChange.emit(fileList);

    // 更新上传状态
    const uploading = fileList.some(file => file.status === 'uploading');
    this.uploading.set(uploading);
  }
}
