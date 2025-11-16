import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DocumentRepository, DocumentUpdate } from '@core';

@Component({
  selector: 'app-document-metadata',
  standalone: true,
  imports: [SHARED_IMPORTS, SFComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'文档元数据'">
      <ng-template #action>
        <button nz-button (click)="goBack()">
          <span nz-icon nzType="arrow-left" nzTheme="outline"></span>
          返回
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="编辑文档元数据" style="margin-top: 16px;">
      @if (loading()) {
        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
      } @else if (documentData()) {
        <!-- Document Info Section -->
        <nz-descriptions nzBordered [nzColumn]="2" style="margin-bottom: 24px;">
          <nz-descriptions-item nzTitle="文件名">{{ documentData()!.file_name }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="文件类型">
            <nz-tag [nzColor]="getFileTypeColor(documentData()!.file_type)">
              {{ documentData()!.file_type }}
            </nz-tag>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="文件大小">{{ formatFileSize(documentData()!.file_size) }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="存储路径">{{ documentData()!.storage_path }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="上传时间">{{ documentData()!.created_at | date:'yyyy-MM-dd HH:mm:ss' }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="最后更新">{{ documentData()!.updated_at | date:'yyyy-MM-dd HH:mm:ss' }}</nz-descriptions-item>
        </nz-descriptions>

        <!-- Metadata Edit Form -->
        <sf
          [schema]="schema"
          [ui]="ui"
          [formData]="formData"
          [button]="button"
          (formSubmit)="onSubmit($event)"
          [loading]="submitting()"
        ></sf>
      } @else {
        <nz-empty nzNotFoundContent="文档不存在"></nz-empty>
      }
    </nz-card>
  `
})
export class DocumentMetadataComponent implements OnInit {
  private documentRepo = inject(DocumentRepository);
  private message = inject(NzMessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  documentId = signal<string | null>(null);
  documentData = signal<any>(null);
  loading = signal(false);
  submitting = signal(false);
  formData: any = {};

  schema: SFSchema = {
    properties: {
      document_type: {
        type: 'string',
        title: '文档类型',
        enum: [
          { label: '合同文件', value: 'contract' },
          { label: '工程图纸', value: 'drawing' },
          { label: '规范标准', value: 'specification' },
          { label: '报告文档', value: 'report' },
          { label: '现场照片', value: 'photo' },
          { label: '其他文档', value: 'other' }
        ],
        ui: {
          widget: 'select',
          grid: { span: 12 }
        }
      },
      version_number: {
        type: 'string',
        title: '版本号',
        maxLength: 20,
        ui: {
          placeholder: '例如: 1.0, v2.3',
          grid: { span: 12 }
        }
      },
      version_notes: {
        type: 'string',
        title: '版本说明',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
          placeholder: '描述此版本的变更内容',
          grid: { span: 24 }
        }
      },
      is_public: {
        type: 'boolean',
        title: '公开访问',
        default: false,
        ui: {
          widget: 'checkbox',
          checkboxLabel: '允许所有项目成员访问此文档',
          grid: { span: 24 }
        }
      },
      tags: {
        type: 'string',
        title: '标签',
        ui: {
          widget: 'string',
          placeholder: '多个标签用逗号分隔',
          grid: { span: 24 }
        }
      },
      description: {
        type: 'string',
        title: '文档描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 4, maxRows: 8 },
          placeholder: '详细描述文档内容、用途等信息',
          grid: { span: 24 }
        }
      }
    }
  };

  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 120,
      grid: { span: 24 }
    }
  };

  button = {
    submit: '保存元数据',
    reset: '重置'
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.documentId.set(id);
        this.loadDocumentData(id);
      } else {
        this.message.error('缺少文档ID参数');
        this.goBack();
      }
    });
  }

  loadDocumentData(id: string): void {
    this.loading.set(true);
    this.documentRepo.findOne(id).subscribe({
      next: (data) => {
        this.documentData.set(data);
        
        // Prepare form data
        this.formData = {
          document_type: data.document_type,
          version_number: data.version_number,
          version_notes: data.version_notes,
          is_public: data.is_public,
          tags: data.tags?.join(', ') || '',
          description: data.description || ''
        };
        
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load document:', err);
        this.message.error('加载文档数据失败');
        this.loading.set(false);
        this.goBack();
      }
    });
  }

  onSubmit(value: any): void {
    if (!this.documentId()) {
      return;
    }

    this.submitting.set(true);

    // Parse tags from comma-separated string
    let tagsArray: string[] | null = null;
    if (value.tags) {
      tagsArray = value.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);
    }

    const updateData: Partial<DocumentUpdate> = {
      document_type: value.document_type,
      version_number: value.version_number,
      version_notes: value.version_notes,
      is_public: value.is_public,
      tags: tagsArray,
      description: value.description
    };

    this.documentRepo.update(this.documentId()!, updateData).subscribe({
      next: () => {
        this.message.success('文档元数据已更新');
        this.submitting.set(false);
        this.goBack();
      },
      error: (err) => {
        console.error('Failed to update document:', err);
        this.message.error('更新文档元数据失败');
        this.submitting.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/documents/list']);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileTypeColor(fileType: string): string {
    const colorMap: Record<string, string> = {
      'PDF': 'red',
      'Word': 'blue',
      'Excel': 'green',
      '图纸': 'cyan',
      '图片': 'orange',
      'PPT': 'volcano',
      'ZIP': 'purple',
      'TXT': 'default'
    };
    return colorMap[fileType] || 'default';
  }
}
