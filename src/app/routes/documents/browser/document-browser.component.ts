import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface FolderItem {
  readonly id: string;
  readonly name: string;
  readonly type: 'folder' | 'file';
  readonly size?: number;
  readonly modifiedAt: string;
}

@Component({
  selector: 'app-document-browser',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'文档浏览器'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="createFolder()" style="margin-right: 8px;">
          <span nz-icon nzType="folder-add"></span>
          新建文件夹
        </button>
        <button nz-button nzType="primary" routerLink="/documents/upload">
          <span nz-icon nzType="upload"></span>
          上传文件
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="文档浏览器" style="margin-top: 16px;">
      <!-- 面包屑导航 -->
      <div style="margin-bottom: 16px;">
        <nz-breadcrumb>
          @for (crumb of breadcrumbs(); track crumb.id) {
            <nz-breadcrumb-item>
              @if (crumb.id === currentFolderId()) {
                <span>{{ crumb.name }}</span>
              } @else {
                <a (click)="navigateToFolder(crumb.id)">{{ crumb.name }}</a>
              }
            </nz-breadcrumb-item>
          }
        </nz-breadcrumb>
      </div>

      <!-- 文件列表 -->
      <nz-table #table [nzData]="items()" [nzLoading]="loading()" [nzShowPagination]="false">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>大小</th>
            <th>修改时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          @for (item of items(); track item.id) {
            <tr>
              <td>
                @if (item.type === 'folder') {
                  <span nz-icon nzType="folder" style="margin-right: 8px; color: #1890ff;"></span>
                  <a (click)="navigateToFolder(item.id)">{{ item.name }}</a>
                } @else {
                  <span nz-icon nzType="file" style="margin-right: 8px;"></span>
                  <a (click)="openFile(item.id)">{{ item.name }}</a>
                }
              </td>
              <td>{{ item.type === 'folder' ? '文件夹' : '文件' }}</td>
              <td>{{ item.size ? (item.size | fileSize) : '-' }}</td>
              <td>{{ item.modifiedAt | date: 'yyyy-MM-dd HH:mm' }}</td>
              <td>
                <button nz-button nzType="link" nzSize="small" (click)="viewDetail(item.id)">查看</button>
                <button nz-button nzType="link" nzSize="small" nzDanger (click)="deleteItem(item.id)">删除</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="5" style="text-align: center; padding: 40px;">
                <nz-empty nzNotFoundContent="当前文件夹为空"></nz-empty>
              </td>
            </tr>
          }
        </tbody>
      </nz-table>
    </nz-card>
  `
})
export class DocumentBrowserComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  currentFolderId = signal<string | null>(null);
  breadcrumbs = signal<Array<{ id: string; name: string }>>([{ id: 'root', name: '根目录' }]);
  items = signal<FolderItem[]>([]);

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    // TODO: 加载当前文件夹内容
    // 暂时使用空数组，实际开发时连接真实数据
    this.items.set([]);
  }

  navigateToFolder(folderId: string): void {
    // TODO: 实现文件夹导航逻辑
    this.currentFolderId.set(folderId);
    this.loadItems();
  }

  openFile(fileId: string): void {
    this.router.navigate(['/documents/preview'], { queryParams: { id: fileId } });
  }

  createFolder(): void {
    // TODO: 实现创建文件夹逻辑
    this.message.info('创建文件夹功能开发中');
  }

  viewDetail(id: string): void {
    // TODO: 实现查看详情逻辑
    this.message.info('查看详情功能开发中');
  }

  deleteItem(id: string): void {
    // TODO: 实现删除逻辑
    this.message.info('删除功能开发中');
  }
}
