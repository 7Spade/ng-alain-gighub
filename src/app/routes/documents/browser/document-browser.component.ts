import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { DocumentRepository } from '@core';

interface FolderNode extends NzTreeNodeOptions {
  title: string;
  key: string;
  children?: FolderNode[];
  isLeaf?: boolean;
  expanded?: boolean;
  path: string;
}

@Component({
  selector: 'app-document-browser',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'文档浏览器'">
      <ng-template #action>
        <button nz-button nzType="primary" (click)="loadDocuments()">
          <span nz-icon nzType="reload" nzTheme="outline"></span>
          刷新
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="文档浏览器" style="margin-top: 16px;">
      <nz-radio-group [(ngModel)]="viewMode" (ngModelChange)="onViewModeChange()" style="margin-bottom: 16px;">
        <label nz-radio-button nzValue="tree">
          <span nz-icon nzType="folder" nzTheme="outline"></span>
          树形视图
        </label>
        <label nz-radio-button nzValue="list">
          <span nz-icon nzType="unordered-list" nzTheme="outline"></span>
          列表视图
        </label>
      </nz-radio-group>

      @if (viewMode === 'tree') {
        <nz-tree
          [nzData]="treeNodes()"
          [nzShowLine]="true"
          [nzShowIcon]="true"
          (nzClick)="onTreeNodeClick($event)"
        >
        </nz-tree>
      } @else {
        <st
          [data]="documents()"
          [columns]="columns"
          [loading]="loading()"
          [page]="{ show: true, showSize: true, front: false }"
          [scroll]="{ x: '1200px' }"
        ></st>
      }
    </nz-card>
  `
})
export class DocumentBrowserComponent implements OnInit {
  private documentRepo = inject(DocumentRepository);
  private message = inject(NzMessageService);
  private router = inject(Router);

  viewMode = signal<'tree' | 'list'>('tree');
  documents = signal<STData[]>([]);
  treeNodes = signal<FolderNode[]>([]);
  loading = signal(false);

  columns: STColumn[] = [
    {
      title: '文件名',
      index: 'file_name',
      width: 250,
      fixed: 'left',
      format: (item: any) => {
        const icon = this.getFileIcon(item.file_type);
        return `<span nz-icon nzType="${icon}" nzTheme="outline"></span> ${item.file_name}`;
      }
    },
    {
      title: '路径',
      index: 'storage_path',
      width: 300
    },
    {
      title: '文档类型',
      index: 'document_type',
      width: 120,
      type: 'tag',
      tag: {
        contract: { text: '合同', color: 'blue' },
        drawing: { text: '图纸', color: 'cyan' },
        specification: { text: '规范', color: 'purple' },
        report: { text: '报告', color: 'green' },
        photo: { text: '照片', color: 'orange' },
        other: { text: '其他', color: 'default' }
      }
    },
    {
      title: '文件大小',
      index: 'file_size',
      width: 100,
      format: (item: any) => this.formatFileSize(item.file_size)
    },
    {
      title: '状态',
      index: 'status',
      width: 100,
      type: 'badge',
      badge: {
        active: { text: '活跃', color: 'success' },
        archived: { text: '归档', color: 'default' },
        deleted: { text: '已删除', color: 'error' }
      }
    },
    {
      title: '版本',
      index: 'version_number',
      width: 80
    },
    {
      title: '上传时间',
      index: 'created_at',
      type: 'date',
      width: 180,
      sort: true
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      buttons: [
        {
          text: '预览',
          icon: 'eye',
          click: (record: any) => this.previewDocument(record.id)
        },
        {
          text: '下载',
          icon: 'download',
          click: (record: any) => this.downloadDocument(record.id)
        },
        {
          text: '元数据',
          icon: 'info-circle',
          click: (record: any) => this.viewMetadata(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading.set(true);
    this.documentRepo
      .findAll({
        orderBy: 'created_at',
        orderDirection: 'desc',
        pageSize: 1000
      })
      .subscribe({
        next: (data) => {
          this.documents.set(data);
          this.buildTreeStructure(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load documents:', err);
          this.message.error('加载文档失败');
          this.loading.set(false);
        }
      });
  }

  buildTreeStructure(documents: any[]): void {
    const folderMap = new Map<string, FolderNode>();
    const rootNodes: FolderNode[] = [];

    // Build folder structure from storage paths
    documents.forEach(doc => {
      const pathParts = doc.storage_path.split('/');
      let currentPath = '';

      // Create folder nodes for each path segment
      for (let i = 0; i < pathParts.length - 1; i++) {
        const segment = pathParts[i];
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;

        if (!folderMap.has(currentPath)) {
          const folderNode: FolderNode = {
            title: segment,
            key: currentPath,
            path: currentPath,
            children: [],
            isLeaf: false,
            expanded: i === 0,
            icon: 'folder'
          };

          folderMap.set(currentPath, folderNode);

          if (parentPath) {
            const parentNode = folderMap.get(parentPath);
            if (parentNode) {
              parentNode.children!.push(folderNode);
            }
          } else {
            rootNodes.push(folderNode);
          }
        }
      }

      // Add file as leaf node
      const fileName = pathParts[pathParts.length - 1];
      const parentPath = pathParts.slice(0, -1).join('/');
      const fileNode: FolderNode = {
        title: `${this.getFileIcon(doc.file_type)} ${fileName}`,
        key: doc.id,
        path: doc.storage_path,
        isLeaf: true,
        icon: this.getFileIcon(doc.file_type)
      };

      if (parentPath && folderMap.has(parentPath)) {
        folderMap.get(parentPath)!.children!.push(fileNode);
      } else {
        rootNodes.push(fileNode);
      }
    });

    this.treeNodes.set(rootNodes);
  }

  onViewModeChange(): void {
    // View mode changed, data already loaded
  }

  onTreeNodeClick(event: any): void {
    if (event.node.isLeaf) {
      const docId = event.node.key;
      this.previewDocument(docId);
    }
  }

  previewDocument(id: string): void {
    this.router.navigate(['/documents/preview'], { queryParams: { id } });
  }

  downloadDocument(id: string): void {
    this.message.info('下载功能开发中');
  }

  viewMetadata(id: string): void {
    this.router.navigate(['/documents/metadata'], { queryParams: { id } });
  }

  getFileIcon(fileType: string): string {
    const iconMap: Record<string, string> = {
      'PDF': 'file-pdf',
      'Word': 'file-word',
      'Excel': 'file-excel',
      '图纸': 'file-image',
      '图片': 'picture',
      'PPT': 'file-ppt',
      'ZIP': 'file-zip',
      'TXT': 'file-text',
      '其他': 'file'
    };
    return iconMap[fileType] || 'file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
