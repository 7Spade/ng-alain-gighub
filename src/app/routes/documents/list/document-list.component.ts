import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface DocumentListItem {
  readonly id: string;
  readonly name: string;
  readonly fileType: string;
  readonly fileSize: number;
  readonly uploaderId: string;
  readonly blueprintId: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'文档列表'">
      <ng-template #extra>
        <button nz-button nzType="primary" routerLink="/documents/upload">
          <span nz-icon nzType="upload"></span>
          上传文档
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="文档列表" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>文件类型</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterFileType()"
              (ngModelChange)="filterFileType.set($event)"
              nzPlaceHolder="全部类型"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="pdf" nzLabel="PDF"></nz-option>
              <nz-option nzValue="image" nzLabel="图片"></nz-option>
              <nz-option nzValue="document" nzLabel="文档"></nz-option>
              <nz-option nzValue="drawing" nzLabel="图纸"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>搜索</nz-form-label>
          <nz-form-control>
            <input nz-input [ngModel]="searchKeyword()" (ngModelChange)="searchKeyword.set($event)" placeholder="搜索文档名称" style="width: 250px;" />
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 文档列表表格 -->
      <st
        #st
        [data]="filteredDocuments()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #fileType let-record>
          @switch (record.fileType) {
            @case ('pdf') {
              <nz-tag nzColor="red">PDF</nz-tag>
            }
            @case ('image') {
              <nz-tag nzColor="blue">图片</nz-tag>
            }
            @case ('document') {
              <nz-tag nzColor="green">文档</nz-tag>
            }
            @case ('drawing') {
              <nz-tag nzColor="purple">图纸</nz-tag>
            }
            @default {
              <nz-tag>{{ record.fileType }}</nz-tag>
            }
          }
        </ng-template>

        <ng-template #fileSize let-record>
          {{ record.fileSize | fileSize }}
        </ng-template>
      </st>
    </nz-card>
  `
})
export class DocumentListComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterFileType = signal<string | null>(null);
  searchKeyword = signal<string>('');
  documents = signal<DocumentListItem[]>([]);

  // Computed filtered documents
  filteredDocuments = computed(() => {
    let result = this.documents();

    if (this.filterFileType()) {
      result = result.filter(item => item.fileType === this.filterFileType());
    }

    if (this.searchKeyword()) {
      const keyword = this.searchKeyword().toLowerCase();
      result = result.filter(item => item.name.toLowerCase().includes(keyword));
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '文档名称', index: 'name', width: 300 },
    { title: '文件类型', index: 'fileType', width: 120, render: 'fileType' },
    { title: '文件大小', index: 'fileSize', width: 120, render: 'fileSize' },
    { title: '上传者', index: 'uploaderId', width: 120 },
    { title: '关联蓝图', index: 'blueprintId', width: 150 },
    { title: '创建时间', index: 'createdAt', type: 'date', width: 180 },
    { title: '更新时间', index: 'updatedAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 250,
      buttons: [
        {
          text: '查看',
          click: (record: DocumentListItem) => this.viewDetail(record.id)
        },
        {
          text: '预览',
          click: (record: DocumentListItem) => this.preview(record.id)
        },
        {
          text: '下载',
          click: (record: DocumentListItem) => this.download(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: DocumentListItem) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    // TODO: 加载文档列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.documents.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }


  viewDetail(id: string): void {
    this.router.navigate(['/documents', id]);
  }

  preview(id: string): void {
    this.router.navigate(['/documents/preview'], { queryParams: { id } });
  }

  download(id: string): void {
    // TODO: 实现下载逻辑
    this.message.info('下载功能开发中');
  }

  delete(id: string): void {
    // TODO: 实现删除逻辑
    this.message.info('删除功能开发中');
  }
}
