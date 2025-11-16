import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { DocumentRepository, SupabaseService } from '@core';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'上传文档'">
      <ng-template #action>
        <button nz-button nzType="default" (click)="goBack()">
          <span nz-icon nzType="left"></span>
          返回
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="上传文档" style="margin-top: 16px;">
      <!-- Upload Area -->
      <nz-upload
        nzType="drag"
        [nzMultiple]="true"
        [nzBeforeUpload]="beforeUpload"
        [nzFileList]="fileList()"
        (nzChange)="handleChange($event)"
        [nzShowUploadList]="{ showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: false }"
      >
        <p class="ant-upload-drag-icon">
          <span nz-icon nzType="inbox" style="color: #1890ff; font-size: 48px;"></span>
        </p>
        <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p class="ant-upload-hint">
          支持单个或批量上传。支持 PDF、Word、Excel、图片、图纸等格式。
          <br />
          单个文件大小不超过 50MB。
        </p>
      </nz-upload>

      <!-- Upload Info -->
      @if (fileList().length > 0) {
        <nz-divider></nz-divider>
        
        <div style="margin-bottom: 16px;">
          <nz-statistic 
            [nzValue]="fileList().length" 
            [nzTitle]="'待上传文件'"
            [nzPrefix]="fileIconTemplate"
          ></nz-statistic>
          <ng-template #fileIconTemplate>
            <span nz-icon nzType="file"></span>
          </ng-template>
        </div>

        <!-- Metadata Form -->
        <nz-form nzLayout="vertical">
          <nz-form-item>
            <nz-form-label>文档分类</nz-form-label>
            <nz-form-control>
              <nz-select 
                [(ngModel)]="documentType"
                nzPlaceHolder="请选择文档分类"
                style="width: 100%;"
              >
                <nz-option nzValue="contract" nzLabel="合同文件"></nz-option>
                <nz-option nzValue="drawing" nzLabel="工程图纸"></nz-option>
                <nz-option nzValue="specification" nzLabel="规范标准"></nz-option>
                <nz-option nzValue="report" nzLabel="报告文档"></nz-option>
                <nz-option nzValue="photo" nzLabel="现场照片"></nz-option>
                <nz-option nzValue="other" nzLabel="其他文档"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label>版本说明</nz-form-label>
            <nz-form-control>
              <textarea
                nz-input
                [(ngModel)]="versionNotes"
                placeholder="请输入版本说明（可选）"
                [nzAutosize]="{ minRows: 2, maxRows: 4 }"
              ></textarea>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-control>
              <label nz-checkbox [(ngModel)]="isPublic">
                <span>公开文档（所有项目成员可见）</span>
              </label>
            </nz-form-control>
          </nz-form-item>
        </nz-form>

        <!-- Action Buttons -->
        <div style="margin-top: 24px;">
          <button 
            nz-button 
            nzType="primary" 
            [nzSize]="'large'"
            [nzLoading]="uploading()"
            [disabled]="fileList().length === 0"
            (click)="handleUpload()"
            style="margin-right: 8px;"
          >
            <span nz-icon nzType="upload"></span>
            开始上传 ({{ fileList().length }})
          </button>
          <button 
            nz-button 
            nzType="default" 
            [nzSize]="'large'"
            [disabled]="uploading()"
            (click)="clearFiles()"
          >
            <span nz-icon nzType="delete"></span>
            清空列表
          </button>
        </div>

        <!-- Upload Progress -->
        @if (uploading()) {
          <nz-divider></nz-divider>
          <nz-progress 
            [nzPercent]="uploadProgress()" 
            nzStatus="active"
            [nzShowInfo]="true"
          ></nz-progress>
          <p style="margin-top: 8px; color: #666;">
            正在上传: {{ uploadedCount() }} / {{ fileList().length }}
          </p>
        }
      }
    </nz-card>
  `
})
export class DocumentUploadComponent {
  private router = inject(Router);
  private message = inject(NzMessageService);
  private supabase = inject(SupabaseService);
  private documentRepo = inject(DocumentRepository);

  // Signals for reactive state
  fileList = signal<NzUploadFile[]>([]);
  uploading = signal(false);
  uploadProgress = signal(0);
  uploadedCount = signal(0);

  // Form data
  documentType = 'other';
  versionNotes = '';
  isPublic = false;

  /**
   * Before upload handler - prevents auto upload
   */
  beforeUpload = (file: NzUploadFile): boolean => {
    // Add file to list but don't upload yet
    this.fileList.update(list => [...list, file]);
    return false;  // Prevent auto upload
  };

  /**
   * File list change handler
   */
  handleChange(info: NzUploadChangeParam): void {
    // Handle file list changes (remove, etc)
    const fileList = info.fileList;
    this.fileList.set(fileList);
  }

  /**
   * Clear all files
   */
  clearFiles(): void {
    this.fileList.set([]);
    this.uploadProgress.set(0);
    this.uploadedCount.set(0);
  }

  /**
   * Upload all files
   */
  async handleUpload(): Promise<void> {
    const files = this.fileList();
    if (files.length === 0) {
      return;
    }

    this.uploading.set(true);
    this.uploadProgress.set(0);
    this.uploadedCount.set(0);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Upload to Supabase Storage
        const uploaded = await this.uploadToStorage(file);
        
        if (uploaded) {
          // Create document record in database
          await this.createDocumentRecord(file, uploaded.path);
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error('Upload failed:', error);
        failCount++;
      }

      // Update progress
      this.uploadedCount.set(i + 1);
      this.uploadProgress.set(Math.round(((i + 1) / files.length) * 100));
    }

    this.uploading.set(false);

    // Show result message
    if (successCount > 0) {
      this.message.success(`成功上传 ${successCount} 个文件`);
    }
    if (failCount > 0) {
      this.message.error(`${failCount} 个文件上传失败`);
    }

    // Clear and navigate if all successful
    if (failCount === 0) {
      setTimeout(() => {
        this.clearFiles();
        this.goBack();
      }, 1500);
    }
  }

  /**
   * Upload file to Supabase Storage
   */
  private async uploadToStorage(file: NzUploadFile): Promise<{ path: string } | null> {
    try {
      const fileExt = file.name?.split('.').pop() || '';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { data, error } = await this.supabase.client.storage
        .from('documents')
        .upload(filePath, file as any, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        return null;
      }

      return { path: data.path };
    } catch (error) {
      console.error('Upload to storage failed:', error);
      return null;
    }
  }

  /**
   * Create document record in database
   */
  private async createDocumentRecord(file: NzUploadFile, storagePath: string): Promise<void> {
    const fileType = this.getFileType(file.name || '');
    
    const documentData = {
      file_name: file.name || 'unknown',
      file_type: fileType,
      file_size: file.size || 0,
      mime_type: file.type || 'application/octet-stream',
      storage_path: storagePath,
      storage_bucket: 'documents',
      document_type: this.documentType,
      version_number: '1.0',
      version_notes: this.versionNotes || null,
      is_public: this.isPublic,
      status: 'active' as const
    };

    try {
      await this.documentRepo.create(documentData as any).toPromise();
    } catch (error) {
      console.error('Failed to create document record:', error);
      throw error;
    }
  }

  /**
   * Get file type from extension
   */
  private getFileType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    const typeMap: Record<string, string> = {
      'pdf': 'PDF',
      'doc': 'Word',
      'docx': 'Word',
      'xls': 'Excel',
      'xlsx': 'Excel',
      'dwg': '图纸',
      'dxf': '图纸',
      'jpg': '图片',
      'jpeg': '图片',
      'png': '图片',
      'gif': '图片',
      'bmp': '图片'
    };

    return typeMap[ext] || '其他';
  }

  /**
   * Go back to document list
   */
  goBack(): void {
    this.router.navigate(['/documents/list']);
  }
}
