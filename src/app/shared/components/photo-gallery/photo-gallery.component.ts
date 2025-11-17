import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

export interface PhotoItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  exif?: {
    camera?: string;
    lens?: string;
    iso?: string;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
    dateTaken?: string;
    gps?: {
      latitude: number;
      longitude: number;
    };
  };
}

/**
 * 照片畫廊元件
 * 
 * 用途：顯示照片集合，支援 Lightbox 檢視和 EXIF 資訊
 * 
 * @example
 * ```html
 * <app-photo-gallery 
 *   [photos]="photoList()" 
 *   [showExif]="true" />
 * ```
 */
@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="photo-gallery">
      <div class="gallery-grid">
        @for (photo of photos(); track photo.id) {
          <div class="photo-item" (click)="openLightbox(photo)">
            <img 
              [src]="photo.thumbnailUrl || photo.url" 
              [alt]="photo.title || '照片'"
              class="photo-thumbnail" />
            @if (photo.title) {
              <div class="photo-title">{{ photo.title }}</div>
            }
          </div>
        }
      </div>

      <!-- Lightbox Modal -->
      <nz-modal
        [nzVisible]="isLightboxVisible()"
        [nzTitle]="currentPhoto()?.title || '照片'"
        [nzFooter]="null"
        [nzWidth]="'90%'"
        [nzBodyStyle]="{ padding: '24px' }"
        (nzOnCancel)="closeLightbox()">
        @if (currentPhoto()) {
          <div class="lightbox-content">
            <img 
              [src]="currentPhoto()!.url" 
              [alt]="currentPhoto()!.title || '照片'"
              class="lightbox-image" />
            
            @if (showExif() && currentPhoto()!.exif) {
              <div class="exif-info">
                <h4>照片資訊 (EXIF)</h4>
                <nz-descriptions [nzColumn]="2" nzSize="small">
                  @if (currentPhoto()!.exif?.camera) {
                    <nz-descriptions-item nzTitle="相機">
                      {{ currentPhoto()!.exif!.camera }}
                    </nz-descriptions-item>
                  }
                  @if (currentPhoto()!.exif?.lens) {
                    <nz-descriptions-item nzTitle="鏡頭">
                      {{ currentPhoto()!.exif!.lens }}
                    </nz-descriptions-item>
                  }
                  @if (currentPhoto()!.exif?.iso) {
                    <nz-descriptions-item nzTitle="ISO">
                      {{ currentPhoto()!.exif!.iso }}
                    </nz-descriptions-item>
                  }
                  @if (currentPhoto()!.exif?.aperture) {
                    <nz-descriptions-item nzTitle="光圈">
                      {{ currentPhoto()!.exif!.aperture }}
                    </nz-descriptions-item>
                  }
                  @if (currentPhoto()!.exif?.shutterSpeed) {
                    <nz-descriptions-item nzTitle="快門">
                      {{ currentPhoto()!.exif!.shutterSpeed }}
                    </nz-descriptions-item>
                  }
                  @if (currentPhoto()!.exif?.focalLength) {
                    <nz-descriptions-item nzTitle="焦距">
                      {{ currentPhoto()!.exif!.focalLength }}
                    </nz-descriptions-item>
                  }
                  @if (currentPhoto()!.exif?.dateTaken) {
                    <nz-descriptions-item nzTitle="拍攝時間">
                      {{ currentPhoto()!.exif!.dateTaken }}
                    </nz-descriptions-item>
                  }
                  @if (currentPhoto()!.exif?.gps) {
                    <nz-descriptions-item nzTitle="GPS 座標" [nzSpan]="2">
                      {{ currentPhoto()!.exif!.gps!.latitude }}, 
                      {{ currentPhoto()!.exif!.gps!.longitude }}
                    </nz-descriptions-item>
                  }
                </nz-descriptions>
              </div>
            }

            @if (currentPhoto()!.description) {
              <p class="photo-description">{{ currentPhoto()!.description }}</p>
            }

            <!-- Navigation buttons -->
            <div class="lightbox-nav">
              <button 
                nz-button 
                nzType="default"
                [disabled]="!canGoPrevious()"
                (click)="previousPhoto()">
                <span nz-icon nzType="left"></span>
                上一張
              </button>
              <span class="photo-counter">
                {{ currentIndex() + 1 }} / {{ photos().length }}
              </span>
              <button 
                nz-button 
                nzType="default"
                [disabled]="!canGoNext()"
                (click)="nextPhoto()">
                下一張
                <span nz-icon nzType="right"></span>
              </button>
            </div>
          </div>
        }
      </nz-modal>
    </div>
  `,
  styles: [`
    .photo-gallery {
      width: 100%;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      padding: 16px 0;
    }

    .photo-item {
      position: relative;
      cursor: pointer;
      border-radius: 4px;
      overflow: hidden;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.05);

        .photo-title {
          opacity: 1;
        }
      }
    }

    .photo-thumbnail {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
    }

    .photo-title {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 8px;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .lightbox-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .lightbox-image {
      width: 100%;
      height: auto;
      max-height: 60vh;
      object-fit: contain;
      border-radius: 4px;
    }

    .exif-info {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;

      h4 {
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .photo-description {
      color: rgba(0, 0, 0, 0.65);
      line-height: 1.6;
    }

    .lightbox-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;

      .photo-counter {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
  `]
})
export class PhotoGalleryComponent {
  /** 照片列表 */
  photos = input.required<PhotoItem[]>();

  /** 是否顯示 EXIF 資訊 */
  showExif = input<boolean>(true);

  /** 是否顯示 Lightbox */
  isLightboxVisible = signal(false);

  /** 當前顯示的照片 */
  currentPhoto = signal<PhotoItem | null>(null);

  /** 當前照片索引 */
  currentIndex = signal(0);

  /**
   * 開啟 Lightbox
   */
  openLightbox(photo: PhotoItem): void {
    const index = this.photos().findIndex(p => p.id === photo.id);
    this.currentIndex.set(index);
    this.currentPhoto.set(photo);
    this.isLightboxVisible.set(true);
  }

  /**
   * 關閉 Lightbox
   */
  closeLightbox(): void {
    this.isLightboxVisible.set(false);
    this.currentPhoto.set(null);
  }

  /**
   * 上一張照片
   */
  previousPhoto(): void {
    if (this.canGoPrevious()) {
      const newIndex = this.currentIndex() - 1;
      this.currentIndex.set(newIndex);
      this.currentPhoto.set(this.photos()[newIndex]);
    }
  }

  /**
   * 下一張照片
   */
  nextPhoto(): void {
    if (this.canGoNext()) {
      const newIndex = this.currentIndex() + 1;
      this.currentIndex.set(newIndex);
      this.currentPhoto.set(this.photos()[newIndex]);
    }
  }

  /**
   * 是否可以前往上一張
   */
  canGoPrevious(): boolean {
    return this.currentIndex() > 0;
  }

  /**
   * 是否可以前往下一張
   */
  canGoNext(): boolean {
    return this.currentIndex() < this.photos().length - 1;
  }
}
