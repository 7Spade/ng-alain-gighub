import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-comment-create',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'发表评论'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="cancel()" style="margin-right: 8px;">
          <span nz-icon nzType="close"></span>
          取消
        </button>
        <button nz-button nzType="primary" (click)="submit()" [nzLoading]="submitting()">
          <span nz-icon nzType="send"></span>
          发布
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="发布评论" style="margin-top: 16px;">
      <form nz-form [formGroup]="commentForm" nzLayout="vertical">
        <nz-form-item>
          <nz-form-label nzRequired>资源类型</nz-form-label>
          <nz-form-control [nzErrorTip]="'请选择资源类型'">
            <nz-select formControlName="resourceType" nzPlaceHolder="请选择资源类型">
              <nz-option nzValue="task" nzLabel="任务"></nz-option>
              <nz-option nzValue="issue" nzLabel="问题"></nz-option>
              <nz-option nzValue="blueprint" nzLabel="蓝图"></nz-option>
              <nz-option nzValue="quality_check" nzLabel="品质检查"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>资源ID</nz-form-label>
          <nz-form-control [nzErrorTip]="'请输入资源ID'">
            <input nz-input formControlName="resourceId" placeholder="请输入资源ID" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>父评论ID</nz-form-label>
          <nz-form-control>
            <input nz-input formControlName="parentId" placeholder="留空表示顶级评论" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>评论内容</nz-form-label>
          <nz-form-control [nzErrorTip]="'请输入评论内容'">
            <textarea nz-input formControlName="content" rows="6" placeholder="请输入评论内容，支持 @ 提及功能"></textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>附件</nz-form-label>
          <nz-form-control>
            <nz-upload
              nzType="drag"
              [nzMultiple]="true"
              [nzFileList]="fileList()"
              (nzFileListChange)="fileList.set($event)"
            >
              <p class="ant-upload-drag-icon">
                <span nz-icon nzType="inbox"></span>
              </p>
              <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p class="ant-upload-hint">支持单个或批量上传</p>
            </nz-upload>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
  `
})
export class CommentCreateComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);
  fb = inject(FormBuilder);

  submitting = signal(false);
  fileList = signal<any[]>([]);

  commentForm: FormGroup = this.fb.group({
    resourceType: ['', [Validators.required]],
    resourceId: ['', [Validators.required]],
    parentId: [null],
    content: ['', [Validators.required]]
  });

  ngOnInit(): void {
    // TODO: 初始化表单数据
  }

  submit(): void {
    if (this.commentForm.invalid) {
      Object.values(this.commentForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('请填写完整的表单信息');
      return;
    }

    this.submitting.set(true);
    // TODO: 实现提交逻辑
    setTimeout(() => {
      this.submitting.set(false);
      this.message.success('评论发布成功');
      this.router.navigate(['/communication/comments']);
    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/communication/comments']);
  }
}
