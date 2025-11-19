import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-document-metadata',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'文档元数据'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="cancel()" style="margin-right: 8px;"> 取消 </button>
        <button nz-button nzType="primary" (click)="save()" [nzLoading]="saving()">
          <span nz-icon nzType="save"></span>
          保存
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="文档元数据" style="margin-top: 16px;">
      <form nz-form [formGroup]="metadataForm" nzLayout="vertical">
        <nz-row [nzGutter]="16">
          <nz-col [nzXs]="24" [nzSm]="12">
            <nz-form-item>
              <nz-form-label>文档名称</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="name" readonly />
              </nz-form-control>
            </nz-form-item>
          </nz-col>

          <nz-col [nzXs]="24" [nzSm]="12">
            <nz-form-item>
              <nz-form-label>文件类型</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="fileType" readonly />
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </nz-row>

        <nz-row [nzGutter]="16">
          <nz-col [nzXs]="24" [nzSm]="12">
            <nz-form-item>
              <nz-form-label>文件大小</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="fileSize" readonly />
              </nz-form-control>
            </nz-form-item>
          </nz-col>

          <nz-col [nzXs]="24" [nzSm]="12">
            <nz-form-item>
              <nz-form-label>上传者</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="uploader" readonly />
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </nz-row>

        <nz-form-item>
          <nz-form-label>描述</nz-form-label>
          <nz-form-control>
            <textarea nz-input formControlName="description" rows="4" placeholder="请输入文档描述"></textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>标签</nz-form-label>
          <nz-form-control>
            <nz-select formControlName="tags" nzMode="tags" nzPlaceHolder="输入标签后按回车添加" style="width: 100%;"></nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>关联蓝图</nz-form-label>
          <nz-form-control>
            <nz-select formControlName="blueprintId" nzPlaceHolder="请选择蓝图（可选）" nzAllowClear>
              <!-- TODO: 加载蓝图列表 -->
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
  `
})
export class DocumentMetadataComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);
  fb = inject(FormBuilder);

  // Component signals
  saving = signal(false);
  documentId = signal<string | null>(null);

  metadataForm: FormGroup = this.fb.group({
    name: [''],
    fileType: [''],
    fileSize: [''],
    uploader: [''],
    description: [''],
    tags: [[]],
    blueprintId: [null]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.documentId.set(id);
      this.loadMetadata();
    } else {
      this.message.error('缺少文档ID参数');
    }
  }

  loadMetadata(): void {
    // TODO: 加载文档元数据
    // 暂时使用空表单，实际开发时连接真实数据
  }

  save(): void {
    this.saving.set(true);
    // TODO: 实现保存逻辑
    setTimeout(() => {
      this.saving.set(false);
      this.message.success('元数据保存成功');
    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/documents']);
  }
}
