import { Component, ChangeDetectionStrategy, signal, output } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: string;
  annotations?: Array<{
    text: string;
    x: number;
    y: number;
  }>;
}

/**
 * 品管相機元件
 *
 * 用途：整合相機功能，支援拍照和照片標註
 *
 * @example
 * ```html
 * <app-qc-camera
 *   (photoCapture)="handlePhotoCapture($event)"
 *   (photosComplete)="handleComplete($event)" />
 * ```
 */
@Component({
  selector: 'app-qc-camera',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-card nzTitle="品管拍照" class="qc-camera-card">
      <div class="camera-container">
        @if (isCapturing()) {
          <!-- Camera view (placeholder) -->
          <div class="camera-view">
            <span nz-icon nzType="camera" nzTheme="outline" class="camera-icon"></span>
            <p>相機視圖</p>
            <p class="camera-hint">實際應用需整合 WebRTC MediaDevices API</p>

            <div class="camera-controls">
              <button nz-button nzType="primary" nzSize="large" nzShape="circle" (click)="capturePhoto()">
                <span nz-icon nzType="camera" nzTheme="outline"></span>
              </button>
              <button nz-button nzType="default" (click)="stopCapture()"> 取消 </button>
            </div>
          </div>
        } @else {
          <!-- Start button -->
          <div class="camera-start">
            <button nz-button nzType="primary" nzSize="large" (click)="startCapture()">
              <span nz-icon nzType="camera" nzTheme="outline"></span>
              開始拍照
            </button>

            <nz-divider nzText="或"></nz-divider>

            <button nz-button nzType="default" (click)="uploadFromFile()">
              <span nz-icon nzType="upload" nzTheme="outline"></span>
              從檔案上傳
            </button>
          </div>
        }

        <!-- Captured photos -->
        @if (capturedPhotos().length > 0) {
          <div class="captured-photos">
            <nz-divider nzText="已拍攝照片"></nz-divider>

            <div class="photos-grid">
              @for (photo of capturedPhotos(); track photo.id) {
                <div class="photo-item">
                  <img [src]="photo.dataUrl" [alt]="'照片 ' + photo.id" />
                  <div class="photo-overlay">
                    <button nz-button nzType="primary" nzSize="small" nzShape="circle" (click)="annotatePhoto(photo)">
                      <span nz-icon nzType="edit" nzTheme="outline"></span>
                    </button>
                    <button nz-button nzDanger nzSize="small" nzShape="circle" (click)="deletePhoto(photo)">
                      <span nz-icon nzType="delete" nzTheme="outline"></span>
                    </button>
                  </div>
                  <div class="photo-info">
                    {{ photo.timestamp | date: 'yyyy-MM-dd HH:mm:ss' }}
                  </div>
                </div>
              }
            </div>

            <div class="photos-actions">
              <button nz-button nzType="primary" [disabled]="capturedPhotos().length === 0" (click)="completePhotos()">
                <span nz-icon nzType="check" nzTheme="outline"></span>
                完成拍攝 ({{ capturedPhotos().length }})
              </button>
              <button nz-button nzType="default" (click)="clearPhotos()"> 清除全部 </button>
            </div>
          </div>
        }
      </div>

      <!-- Annotation Modal -->
      <nz-modal
        [nzVisible]="isAnnotating()"
        nzTitle="照片標註"
        [nzFooter]="annotationFooter"
        [nzWidth]="'80%'"
        (nzOnCancel)="closeAnnotation()"
      >
        @if (currentAnnotatingPhoto()) {
          <div class="annotation-container">
            <div class="annotation-canvas">
              <img [src]="currentAnnotatingPhoto()!.dataUrl" alt="標註照片" class="annotation-image" />
              <!-- Canvas overlay for annotations would go here -->
              <div class="annotation-hint"> 點擊照片可添加標註文字 </div>
            </div>

            <div class="annotation-controls">
              <nz-input-group [nzPrefix]="prefixTemplate">
                <input nz-input placeholder="輸入標註文字" [(ngModel)]="annotationText" />
              </nz-input-group>
              <button nz-button nzType="primary" [disabled]="!annotationText.trim()" (click)="addAnnotation()"> 添加標註 </button>

              <ng-template #prefixTemplate>
                <span nz-icon nzType="edit" nzTheme="outline"></span>
              </ng-template>
            </div>

            @if (currentAnnotatingPhoto()!.annotations && currentAnnotatingPhoto()!.annotations!.length > 0) {
              <div class="annotations-list">
                <h4>已添加的標註：</h4>
                <nz-list [nzDataSource]="currentAnnotatingPhoto()!.annotations!" nzSize="small">
                  <ng-template #renderItem let-annotation let-index="index">
                    <nz-list-item [nzActions]="[deleteAction]">
                      <span>{{ index + 1 }}. {{ annotation.text }}</span>
                      <ng-template #deleteAction>
                        <a (click)="removeAnnotation(index)">刪除</a>
                      </ng-template>
                    </nz-list-item>
                  </ng-template>
                </nz-list>
              </div>
            }
          </div>
        }

        <ng-template #annotationFooter>
          <button nz-button nzType="default" (click)="closeAnnotation()">關閉</button>
          <button nz-button nzType="primary" (click)="saveAnnotation()">儲存</button>
        </ng-template>
      </nz-modal>
    </nz-card>
  `,
  styles: [
    `
      .qc-camera-card {
        :host ::ng-deep .ant-card-body {
          padding: 24px;
        }
      }

      .camera-container {
        min-height: 400px;
      }

      .camera-view {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 400px;
        background: #000;
        border-radius: 4px;
        color: #fff;

        .camera-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .camera-hint {
          color: #bfbfbf;
          font-size: 12px;
          margin-top: 8px;
        }

        .camera-controls {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }
      }

      .camera-start {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
      }

      .captured-photos {
        margin-top: 24px;
      }

      .photos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      }

      .photo-item {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #d9d9d9;

        img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .photo-overlay {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        &:hover .photo-overlay {
          opacity: 1;
        }

        .photo-info {
          padding: 8px;
          background: #fafafa;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.65);
          text-align: center;
        }
      }

      .photos-actions {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 16px;
      }

      .annotation-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .annotation-canvas {
        position: relative;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;

        .annotation-image {
          width: 100%;
          height: auto;
          display: block;
        }

        .annotation-hint {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
        }
      }

      .annotation-controls {
        display: flex;
        gap: 8px;

        nz-input-group {
          flex: 1;
        }
      }

      .annotations-list {
        h4 {
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 500;
        }
      }
    `
  ]
})
export class QcCameraComponent {
  /** 是否正在拍照 */
  isCapturing = signal(false);

  /** 是否正在標註 */
  isAnnotating = signal(false);

  /** 已拍攝的照片 */
  capturedPhotos = signal<CapturedPhoto[]>([]);

  /** 當前標註的照片 */
  currentAnnotatingPhoto = signal<CapturedPhoto | null>(null);

  /** 標註文字 */
  annotationText = '';

  /** 拍照事件 */
  readonly photoCapture = output<CapturedPhoto>();

  /** 完成拍照事件 */
  readonly photosComplete = output<CapturedPhoto[]>();

  /**
   * 開始拍照
   */
  startCapture(): void {
    this.isCapturing.set(true);
    // Actual implementation would initialize camera using MediaDevices API
  }

  /**
   * 停止拍照
   */
  stopCapture(): void {
    this.isCapturing.set(false);
  }

  /**
   * 拍照
   */
  capturePhoto(): void {
    // Simulate photo capture
    const photo: CapturedPhoto = {
      id: Date.now().toString(),
      dataUrl:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5ZOB566h5ri45r2HP+eBvjwvdGV4dD48L3N2Zz4=',
      timestamp: new Date().toISOString(),
      annotations: []
    };

    this.capturedPhotos.update(photos => [...photos, photo]);
    this.photoCapture.emit(photo);
  }

  /**
   * 從檔案上傳
   */
  uploadFromFile(): void {
    // Trigger file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const photo: CapturedPhoto = {
            id: Date.now().toString(),
            dataUrl: event.target.result,
            timestamp: new Date().toISOString(),
            annotations: []
          };
          this.capturedPhotos.update(photos => [...photos, photo]);
          this.photoCapture.emit(photo);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  /**
   * 標註照片
   */
  annotatePhoto(photo: CapturedPhoto): void {
    this.currentAnnotatingPhoto.set(photo);
    this.isAnnotating.set(true);
  }

  /**
   * 關閉標註
   */
  closeAnnotation(): void {
    this.isAnnotating.set(false);
    this.currentAnnotatingPhoto.set(null);
    this.annotationText = '';
  }

  /**
   * 儲存標註
   */
  saveAnnotation(): void {
    this.closeAnnotation();
  }

  /**
   * 添加標註
   */
  addAnnotation(): void {
    const photo = this.currentAnnotatingPhoto();
    const text = this.annotationText.trim();

    if (photo && text) {
      const annotation = {
        text,
        x: Math.random() * 100,
        y: Math.random() * 100
      };

      photo.annotations = photo.annotations || [];
      photo.annotations.push(annotation);

      this.annotationText = '';
    }
  }

  /**
   * 移除標註
   */
  removeAnnotation(index: number): void {
    const photo = this.currentAnnotatingPhoto();
    if (photo && photo.annotations) {
      photo.annotations.splice(index, 1);
    }
  }

  /**
   * 刪除照片
   */
  deletePhoto(photo: CapturedPhoto): void {
    this.capturedPhotos.update(photos => photos.filter(p => p.id !== photo.id));
  }

  /**
   * 清除所有照片
   */
  clearPhotos(): void {
    this.capturedPhotos.set([]);
  }

  /**
   * 完成拍攝
   */
  completePhotos(): void {
    this.photosComplete.emit(this.capturedPhotos());
  }
}
