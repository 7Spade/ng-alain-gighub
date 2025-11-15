import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS, BlueprintService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-quality-photos',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'验收照片'">
      <ng-template #extra>
        <nz-select
          [ngModel]="selectedBlueprintId()"
          (ngModelChange)="selectedBlueprintId.set($event); onBlueprintChange()"
          nzPlaceHolder="请选择蓝图"
          style="width: 300px; margin-right: 8px;"
        >
          @for (blueprint of blueprintService.blueprints(); track blueprint.id) {
            <nz-option [nzValue]="blueprint.id" [nzLabel]="blueprint.name"></nz-option>
          }
        </nz-select>
        <button nz-button nzType="primary" (click)="uploadPhoto()">
          <span nz-icon nzType="upload"></span>
          上传照片
        </button>
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      @if (!selectedBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else if (loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else if (photos().length === 0) {
        <nz-empty nzNotFoundContent="暂无照片"></nz-empty>
      } @else {
        <nz-spin [nzSpinning]="loading()">
          <div nz-row [nzGutter]="[16, 16]">
            @for (photo of photos(); track photo.id) {
              <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6" [nzXl]="4">
                <nz-card
                  [nzHoverable]="true"
                  [nzCover]="cover"
                  style="cursor: pointer;"
                  (click)="viewPhoto(photo)"
                >
                  <ng-template #cover>
                    <div style="width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                      <span nz-icon nzType="picture" nzTheme="outline" style="font-size: 48px; color: #ccc;"></span>
                    </div>
                  </ng-template>
                  <nz-card-meta
                    [nzTitle]="photo.caption || '无标题'"
                    [nzDescription]="photo.type || '验收照片'"
                  ></nz-card-meta>
                  <div style="margin-top: 8px; font-size: 12px; color: #999;">
                    {{ photo.uploaded_at | date: 'yyyy-MM-dd HH:mm' }}
                  </div>
                </nz-card>
              </div>
            }
          </div>
        </nz-spin>
      }
    </nz-card>
  `
})
export class QualityPhotosComponent implements OnInit {
  readonly blueprintService = inject(BlueprintService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly photos = signal<any[]>([]);

  ngOnInit(): void {
    this.loadBlueprints();
  }

  async loadBlueprints(): Promise<void> {
    try {
      await this.blueprintService.loadBlueprints();
    } catch (error) {
      this.message.error('加载蓝图列表失败');
    }
  }

  async onBlueprintChange(): Promise<void> {
    const blueprintId = this.selectedBlueprintId();
    if (blueprintId) {
      this.loading.set(true);
      // TODO: 加载验收照片数据
      setTimeout(() => {
        this.photos.set([]);
        this.loading.set(false);
      }, 500);
    }
  }

  uploadPhoto(): void {
    // TODO: 实现照片上传功能
    this.message.info('照片上传功能待实现');
  }

  viewPhoto(photo: any): void {
    // TODO: 实现照片查看功能（预览大图）
    this.message.info('照片查看功能待实现');
  }
}
