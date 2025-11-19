import { Component, inject } from '@angular/core';
import { SHARED_IMPORTS, ReportPhoto } from '@shared';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface PhotoViewData {
  photo: ReportPhoto;
  photoUrl: string;
}

@Component({
  selector: 'app-photo-viewer',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div style="text-align: center;">
      <img [src]="data.photoUrl" [alt]="data.photo.caption || '照片'" style="max-width: 100%; max-height: 70vh; object-fit: contain;" />
    </div>

    <nz-divider></nz-divider>

    <nz-descriptions nzBordered [nzColumn]="1" nzSize="small">
      @if (data.photo.caption) {
        <nz-descriptions-item nzTitle="说明">{{ data.photo.caption }}</nz-descriptions-item>
      }
      <nz-descriptions-item nzTitle="类型">
        @switch (data.photo.photo_type) {
          @case ('progress') {
            <nz-tag nzColor="blue">施工进度</nz-tag>
          }
          @case ('before') {
            <nz-tag nzColor="orange">施工前</nz-tag>
          }
          @case ('after') {
            <nz-tag nzColor="green">施工后</nz-tag>
          }
          @case ('issue') {
            <nz-tag nzColor="red">问题记录</nz-tag>
          }
          @case ('equipment') {
            <nz-tag nzColor="purple">设备</nz-tag>
          }
          @case ('material') {
            <nz-tag nzColor="cyan">材料</nz-tag>
          }
          @default {
            <nz-tag>{{ data.photo.photo_type }}</nz-tag>
          }
        }
      </nz-descriptions-item>
      <nz-descriptions-item nzTitle="上传时间">
        {{ data.photo.uploaded_at | date: 'yyyy-MM-dd HH:mm:ss' }}
      </nz-descriptions-item>
      <nz-descriptions-item nzTitle="上传者ID">{{ data.photo.uploaded_by }}</nz-descriptions-item>
    </nz-descriptions>

    <div style="margin-top: 16px; text-align: right;">
      <button nz-button nzType="default" (click)="close()">关闭</button>
    </div>
  `
})
export class PhotoViewerComponent {
  private modalRef = inject(NzModalRef);
  readonly data: PhotoViewData = inject(NZ_MODAL_DATA);

  close(): void {
    this.modalRef.close();
  }
}
