import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'文档预览'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="download()" style="margin-right: 8px;">
          <span nz-icon nzType="download"></span>
          下载
        </button>
        <button nz-button nzType="default" (click)="viewMetadata()" style="margin-right: 8px;">
          <span nz-icon nzType="info-circle"></span>
          元数据
        </button>
        <button nz-button nzType="default" (click)="viewVersions()">
          <span nz-icon nzType="history"></span>
          版本历史
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="文档预览" style="margin-top: 16px;">
      @if (loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else {
        <!-- 文档信息 -->
        <div style="margin-bottom: 16px; padding: 16px; background: #f5f5f5; border-radius: 4px;">
          <div style="margin-bottom: 8px;"> <strong>文档名称：</strong>{{ documentName() }} </div>
          <div style="margin-bottom: 8px;"> <strong>文件类型：</strong>{{ fileType() }} </div>
          <div> <strong>文件大小：</strong>{{ fileSize() }} </div>
        </div>

        <!-- 预览区域 -->
        <div style="border: 1px solid #d9d9d9; border-radius: 4px; min-height: 600px; padding: 16px;">
          @if (fileType().startsWith('image/')) {
            <div style="text-align: center;">
              <img [src]="previewUrl()" [alt]="documentName()" style="max-width: 100%; max-height: 600px;" />
            </div>
          } @else if (fileType() === 'application/pdf') {
            <div style="text-align: center; padding: 100px;">
              <nz-empty nzNotFoundContent="PDF 预览功能开发中"></nz-empty>
            </div>
          } @else {
            <div style="text-align: center; padding: 100px;">
              <nz-empty nzNotFoundContent="此文件类型暂不支持预览"></nz-empty>
            </div>
          }
        </div>
      }
    </nz-card>
  `
})
export class DocumentPreviewComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  documentId = signal<string | null>(null);
  documentName = signal<string>('');
  fileType = signal<string>('');
  fileSize = signal<string>('');
  previewUrl = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.documentId.set(id);
      this.loadDocument();
    } else {
      this.message.error('缺少文档ID参数');
    }
  }

  loadDocument(): void {
    // TODO: 加载文档数据
    // 暂时使用空数据，实际开发时连接真实数据
    this.documentName.set('示例文档');
    this.fileType.set('application/pdf');
    this.fileSize.set('0 B');
    this.previewUrl.set('');
  }

  download(): void {
    // TODO: 实现下载逻辑
    this.message.info('下载功能开发中');
  }

  viewMetadata(): void {
    const id = this.documentId();
    if (id) {
      this.router.navigate(['/documents/metadata'], { queryParams: { id } });
    }
  }

  viewVersions(): void {
    const id = this.documentId();
    if (id) {
      this.router.navigate(['/documents/versions'], { queryParams: { id } });
    }
  }
}
