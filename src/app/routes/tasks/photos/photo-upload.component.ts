import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportPhotoRepository } from '@core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';

export interface PhotoUploadData {
  reportId: string;
  reportType: 'daily' | 'quality';
}

@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>照片类型</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="请选择照片类型">
          <nz-select formControlName="photoType" nzPlaceHolder="选择照片类型">
            <nz-option nzValue="progress" nzLabel="施工进度"></nz-option>
            <nz-option nzValue="before" nzLabel="施工前"></nz-option>
            <nz-option nzValue="after" nzLabel="施工后"></nz-option>
            <nz-option nzValue="issue" nzLabel="问题记录"></nz-option>
            <nz-option nzValue="equipment" nzLabel="设备"></nz-option>
            <nz-option nzValue="material" nzLabel="材料"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">照片说明</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea
            nz-input
            formControlName="caption"
            [nzAutosize]="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入照片说明（可选）"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>选择照片</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="请选择照片文件">
          <nz-upload nzType="drag" [nzMultiple]="false" [nzBeforeUpload]="beforeUpload" nzAccept="image/*">
            <p class="ant-upload-drag-icon">
              <span nz-icon nzType="inbox"></span>
            </p>
            <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p class="ant-upload-hint">支持 JPG、PNG、GIF 等图片格式</p>
          </nz-upload>
          @if (selectedFile()) {
            <div style="margin-top: 8px;">
              <nz-tag nzColor="green">
                <span nz-icon nzType="file-image"></span>
                {{ selectedFile()?.name }}
              </nz-tag>
            </div>
          }
        </nz-form-control>
      </nz-form-item>

      <nz-alert
        nzType="info"
        nzMessage="提示"
        nzDescription="照片上传后将关联到当前报告。实际项目中，照片会先上传到 Supabase Storage，然后创建 document 记录。"
        nzShowIcon
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-form-item>
        <nz-form-control [nzSpan]="18" [nzOffset]="6">
          <button nz-button nzType="default" type="button" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;">
            取消
          </button>
          <button nz-button nzType="primary" type="submit" [nzLoading]="submitting()" [disabled]="!canSubmit() || submitting()">
            上传
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class PhotoUploadComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private reportPhotoRepo = inject(ReportPhotoRepository);

  readonly data: PhotoUploadData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);
  readonly selectedFile = signal<File | null>(null);

  form!: FormGroup;

  // File upload handler
  beforeUpload = (file: any): boolean => {
    // Validate file type
    const isImage = file.type?.startsWith('image/');
    if (!isImage) {
      this.message.error('只能上传图片文件！');
      return false;
    }

    // Validate file size (max 5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      this.message.error('图片大小不能超过 5MB！');
      return false;
    }

    // Store the original file
    if (file.originFileObj) {
      this.selectedFile.set(file.originFileObj);
    } else {
      this.selectedFile.set(file);
    }
    return false; // Prevent automatic upload
  };

  ngOnInit(): void {
    this.form = this.fb.group({
      photoType: ['progress', [Validators.required]],
      caption: ['']
    });
  }

  canSubmit(): boolean {
    return this.form.valid && this.selectedFile() !== null;
  }

  async submit(): Promise<void> {
    if (!this.canSubmit()) {
      this.message.warning('请选择照片文件');
      return;
    }

    this.submitting.set(true);
    try {
      const formValue = this.form.value;
      const file = this.selectedFile();

      if (!file) {
        throw new Error('未选择文件');
      }

      // TODO: 实际实现中，需要先上传到 Supabase Storage，然后创建 document 记录
      // 这里简化处理，创建一个临时的 document_id
      const tempDocumentId = `temp-${Date.now()}`;

      const photoRecord = {
        report_id: this.data.reportId,
        document_id: tempDocumentId,
        photo_type: formValue.photoType,
        caption: formValue.caption || null,
        sequence_order: 0,
        uploaded_by: 'temp-user-id' // 实际应该从当前登录用户获取
      };

      await firstValueFrom(this.reportPhotoRepo.create(photoRecord));

      this.message.success('照片上传成功（演示模式）');
      this.modalRef.close(true);
    } catch (error: any) {
      console.error('上传照片失败:', error);
      this.message.error(error.message || '上传失败，请重试');
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
