import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentRepository, Document } from '@core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'文档列表'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="uploadDocument()">
          <span nz-icon nzType="upload"></span>
          上传文档
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="文档列表" style="margin-top: 16px;">
      <st
        #st
        [data]="documents()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{
          show: true,
          showSize: true,
          front: false
        }"
        [responsive]="true"
        [scroll]="{ x: '1400px' }"
      ></st>
    </nz-card>
  `
})
export class DocumentListComponent implements OnInit {
  private documentRepo = inject(DocumentRepository);
  private message = inject(NzMessageService);
  private router = inject(Router);

  // Signals for reactive state
  documents = signal<STData[]>([]);
  loading = signal(false);

  // ST Table columns configuration
  columns: STColumn[] = [
    {
      title: '文档名称',
      index: 'title',
      width: 250,
      fixed: 'left'
    },
    {
      title: '文件类型',
      index: 'file_type',
      width: 120,
      type: 'tag',
      tag: {
        pdf: { text: 'PDF', color: 'red' },
        doc: { text: 'Word', color: 'blue' },
        docx: { text: 'Word', color: 'blue' },
        xls: { text: 'Excel', color: 'green' },
        xlsx: { text: 'Excel', color: 'green' },
        dwg: { text: '图纸', color: 'orange' },
        jpg: { text: '图片', color: 'cyan' },
        png: { text: '图片', color: 'cyan' }
      }
    },
    {
      title: '文件大小',
      index: 'file_size',
      width: 120,
      format: (item: STData) => {
        const size = item['file_size'] as number;
        if (!size) return '-';
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
      }
    },
    {
      title: '状态',
      index: 'status',
      width: 100,
      type: 'badge',
      badge: {
        active: { text: '正常', color: 'success' },
        archived: { text: '归档', color: 'default' },
        deleted: { text: '已删除', color: 'error' }
      }
    },
    {
      title: '版本号',
      index: 'version',
      width: 100
    },
    {
      title: '上传人',
      index: 'uploaded_by_name',
      width: 120
    },
    {
      title: '上传时间',
      index: 'created_at',
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm',
      width: 160
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      buttons: [
        {
          text: '预览',
          type: 'link',
          click: (item: STData) => this.previewDocument(item['id'] as string)
        },
        {
          text: '下载',
          type: 'link',
          click: (item: STData) => this.downloadDocument(item['id'] as string)
        },
        {
          text: '版本',
          type: 'link',
          click: (item: STData) => this.viewVersions(item['id'] as string)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadDocuments();
  }

  /**
   * 加载文档列表
   */
  loadDocuments(): void {
    this.loading.set(true);

    this.documentRepo
      .findAll({
        orderBy: 'created_at',
        orderDirection: 'desc',
        pageSize: 100,
        filters: {
          status: 'active' // 只显示正常状态的文档
        }
      })
      .subscribe({
        next: data => {
          this.documents.set(data as STData[]);
          this.loading.set(false);
        },
        error: err => {
          console.error('加载文档列表失败:', err);
          this.message.error('加载文档列表失败');
          this.loading.set(false);
        }
      });
  }

  /**
   * 预览文档
   */
  previewDocument(id: string): void {
    this.router.navigate(['/documents/preview'], { queryParams: { id } });
  }

  /**
   * 下载文档
   */
  downloadDocument(id: string): void {
    this.message.info('下载功能待实现');
  }

  /**
   * 查看版本历史
   */
  viewVersions(id: string): void {
    this.router.navigate(['/documents/versions'], { queryParams: { id } });
  }

  /**
   * 上传文档
   */
  uploadDocument(): void {
    this.router.navigate(['/documents/upload']);
  }
}
