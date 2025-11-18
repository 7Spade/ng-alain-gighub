import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface VersionItem {
  readonly id: string;
  readonly version: string;
  readonly note: string;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly fileSize: number;
  readonly isCurrent: boolean;
}

@Component({
  selector: 'app-document-version',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'版本管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="uploadNewVersion()">
          <span nz-icon nzType="upload"></span>
          上传新版本
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="版本管理" style="margin-top: 16px;">
      <!-- 版本列表 -->
      <st
        #st
        [data]="versions()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #version let-record>
          @if (record.isCurrent) {
            <nz-tag nzColor="green">v{{ record.version }} (当前)</nz-tag>
          } @else {
            <span>v{{ record.version }}</span>
          }
        </ng-template>

        <ng-template #fileSize let-record>
          {{ record.fileSize | fileSize }}
        </ng-template>
      </st>
    </nz-card>
  `
})
export class DocumentVersionComponent implements OnInit {
  route = inject(ActivatedRoute);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  documentId = signal<string | null>(null);
  versions = signal<VersionItem[]>([]);

  columns: STColumn[] = [
    { title: '版本', index: 'version', width: 150, render: 'version' },
    { title: '版本说明', index: 'note', width: 300 },
    { title: '创建人', index: 'createdBy', width: 120 },
    { title: '创建时间', index: 'createdAt', type: 'date', width: 180 },
    { title: '文件大小', index: 'fileSize', width: 120, render: 'fileSize' },
    {
      title: '操作',
      width: 300,
      buttons: [
        {
          text: '查看',
          click: (record: VersionItem) => this.viewVersion(record.id)
        },
        {
          text: '下载',
          click: (record: VersionItem) => this.downloadVersion(record.id)
        },
        {
          text: '回滚',
          iif: (record: VersionItem) => !record.isCurrent,
          click: (record: VersionItem) => this.rollbackVersion(record.id)
        },
        {
          text: '对比',
          iif: (record: VersionItem) => !record.isCurrent,
          click: (record: VersionItem) => this.compareVersion(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.documentId.set(id);
      this.loadVersions();
    } else {
      this.message.error('缺少文档ID参数');
    }
  }

  loadVersions(): void {
    // TODO: 加载版本列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.versions.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  uploadNewVersion(): void {
    // TODO: 实现上传新版本逻辑
    this.message.info('上传新版本功能开发中');
  }

  viewVersion(id: string): void {
    // TODO: 实现查看版本逻辑
    this.message.info('查看版本功能开发中');
  }

  downloadVersion(id: string): void {
    // TODO: 实现下载版本逻辑
    this.message.info('下载版本功能开发中');
  }

  rollbackVersion(id: string): void {
    // TODO: 实现回滚版本逻辑
    this.message.info('回滚版本功能开发中');
  }

  compareVersion(id: string): void {
    // TODO: 实现对比版本逻辑
    this.message.info('对比版本功能开发中');
  }

}
