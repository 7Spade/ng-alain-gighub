import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import type { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'上传文档'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="cancel()" style="margin-right: 8px;">
          <span nz-icon nzType="close"></span>
          取消
        </button>
        <button nz-button nzType="primary" (click)="upload()" [nzLoading]="uploading()">
          <span nz-icon nzType="upload"></span>
          上传
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="上传文档" style="margin-top: 16px;">
      <form nz-form [formGroup]="uploadForm" nzLayout="vertical">
        <nz-form-item>
          <nz-form-label>关联蓝图</nz-form-label>
          <nz-form-control>
            <nz-select formControlName="blueprintId" nzPlaceHolder="请选择蓝图（可选）" nzAllowClear>
              <!-- TODO: 加载蓝图列表 -->
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>文档名称</nz-form-label>
          <nz-form-control [nzErrorTip]="'请输入文档名称'">
            <input nz-input formControlName="name" placeholder="请输入文档名称" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>描述</nz-form-label>
          <nz-form-control>
            <textarea nz-input formControlName="description" rows="3" placeholder="请输入文档描述（可选）"></textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>文件上传</nz-form-label>
          <nz-form-control [nzErrorTip]="'请选择要上传的文件'">
            <nz-upload
              nzType="drag"
              [nzMultiple]="true"
              [nzFileList]="fileList()"
              (nzFileListChange)="fileList.set($event)"
              [nzBeforeUpload]="beforeUpload"
            >
              <p class="ant-upload-drag-icon">
                <span nz-icon nzType="inbox"></span>
              </p>
              <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p class="ant-upload-hint">支持单个或批量上传，支持 PDF、图片、文档、图纸等格式</p>
            </nz-upload>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>版本注释</nz-form-label>
          <nz-form-control>
            <textarea nz-input formControlName="versionNote" rows="2" placeholder="请输入版本注释（可选）"></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
  `
})
export class DocumentUploadComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);
  fb = inject(FormBuilder);

  uploading = signal(false);
  fileList = signal<NzUploadFile[]>([]);

  uploadForm: FormGroup = this.fb.group({
    blueprintId: [null],
    name: ['', [Validators.required]],
    description: [''],
    versionNote: ['']
  });

  ngOnInit(): void {
    // TODO: 初始化表单数据
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    // TODO: 实现文件验证逻辑
    return true;
  };

  upload(): void {
    if (this.uploadForm.invalid) {
      Object.values(this.uploadForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('请填写完整的表单信息');
      return;
    }

    if (this.fileList().length === 0) {
      this.message.error('请选择要上传的文件');
      return;
    }

    this.uploading.set(true);
    // TODO: 实现上传逻辑
    setTimeout(() => {
      this.uploading.set(false);
      this.message.success('文档上传成功');
      this.router.navigate(['/documents']);
    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/documents']);
  }
}
