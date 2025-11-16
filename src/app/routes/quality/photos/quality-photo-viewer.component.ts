import { Component, inject } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SHARED_IMPORTS, InspectionPhoto } from '@shared';

export interface QualityPhotoViewData {
  photo: InspectionPhoto;
  photoUrl: string;
}

@Component({
  selector: 'app-quality-photo-viewer',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div style="text-align: center;">
      <img 
        [src]="data.photoUrl" 
        [alt]="data.photo.caption || '验收照片'"
        style="max-width: 100%; max-height: 70vh; object-fit: contain;"
      />
    </div>
    
    <nz-divider></nz-divider>
    
    <nz-descriptions nzBordered [nzColumn]="1" nzSize="small">
      @if (data.photo.caption) {
        <nz-descriptions-item nzTitle="说明">{{ data.photo.caption }}</nz-descriptions-item>
      }
      <nz-descriptions-item nzTitle="类型">
        @switch (data.photo.photo_type) {
          @case ('acceptance') {
            <nz-tag nzColor="blue">验收照片</nz-tag>
          }
          @case ('defect') {
            <nz-tag nzColor="red">缺陷照片</nz-tag>
          }
          @case ('before_correction') {
            <nz-tag nzColor="orange">纠正前</nz-tag>
          }
          @case ('after_correction') {
            <nz-tag nzColor="green">纠正后</nz-tag>
          }
          @case ('handover') {
            <nz-tag nzColor="purple">移交照片</nz-tag>
          }
          @default {
            <nz-tag>{{ data.photo.photo_type }}</nz-tag>
          }
        }
      </nz-descriptions-item>
      <nz-descriptions-item nzTitle="上传时间">
        {{ data.photo.uploaded_at | date:'yyyy-MM-dd HH:mm:ss' }}
      </nz-descriptions-item>
      <nz-descriptions-item nzTitle="上传者ID">{{ data.photo.uploaded_by }}</nz-descriptions-item>
    </nz-descriptions>
    
    <div style="margin-top: 16px; text-align: right;">
      <button nz-button nzType="default" (click)="close()">关闭</button>
    </div>
  `
})
export class QualityPhotoViewerComponent {
  private modalRef = inject(NzModalRef);
  readonly data: QualityPhotoViewData = inject(NZ_MODAL_DATA);

  close(): void {
    this.modalRef.close();
  }
}
