import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-drawing-viewer',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'图纸查看器'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="zoomOut()" style="margin-right: 8px;">
          <span nz-icon nzType="zoom-out"></span>
          缩小
        </button>
        <button nz-button nzType="default" (click)="zoomIn()" style="margin-right: 8px;">
          <span nz-icon nzType="zoom-in"></span>
          放大
        </button>
        <button nz-button nzType="default" (click)="resetZoom()" style="margin-right: 8px;">
          <span nz-icon nzType="reload"></span>
          重置
        </button>
        <button nz-button nzType="primary" (click)="addAnnotation()">
          <span nz-icon nzType="edit"></span>
          添加批注
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="图纸查看器" style="margin-top: 16px;">
      <div style="display: flex; gap: 16px;">
        <!-- 缩略图侧边栏 -->
        <div style="width: 200px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 16px;">
          <div style="margin-bottom: 16px; font-weight: bold;">缩略图</div>
          <div style="text-align: center; padding: 40px;">
            <nz-empty nzNotFoundContent="缩略图开发中" [nzNotFoundImage]="'simple'"></nz-empty>
          </div>
        </div>

        <!-- 主视图区域 -->
        <div style="flex: 1; border: 1px solid #d9d9d9; border-radius: 4px; padding: 16px; position: relative; overflow: auto; min-height: 600px;">
          @if (loading()) {
            <div style="text-align: center; padding: 100px;">
              <nz-spin nzSize="large"></nz-spin>
            </div>
          } @else {
            <div style="text-align: center; padding: 100px;">
              <nz-empty nzNotFoundContent="图纸查看器开发中"></nz-empty>
            </div>
          }
        </div>
      </div>

      <!-- 批注列表 -->
      <nz-card nzTitle="批注列表" style="margin-top: 16px;">
        <nz-list [nzDataSource]="annotations()" [nzRenderItem]="item">
          <ng-template #item let-item>
            <nz-list-item>
              <nz-list-item-meta
                [nzTitle]="item.author"
                [nzDescription]="item.content"
              >
                <ng-template #nzAvatar>
                  <nz-avatar nzIcon="user"></nz-avatar>
                </ng-template>
              </nz-list-item-meta>
              <div>{{ item.createdAt | date: 'yyyy-MM-dd HH:mm' }}</div>
            </nz-list-item>
          </ng-template>
        </nz-list>
      </nz-card>
    </nz-card>
  `
})
export class DrawingViewerComponent implements OnInit {
  route = inject(ActivatedRoute);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  zoomLevel = signal(100);
  annotations = signal<Array<{ id: string; author: string; content: string; createdAt: string }>>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.loadDrawing(id);
    } else {
      this.message.error('缺少图纸ID参数');
    }
  }

  loadDrawing(id: string): void {
    // TODO: 加载图纸数据
    // 暂时使用空数据，实际开发时连接真实数据
    this.annotations.set([]);
  }

  zoomIn(): void {
    this.zoomLevel.set(Math.min(this.zoomLevel() + 10, 200));
  }

  zoomOut(): void {
    this.zoomLevel.set(Math.max(this.zoomLevel() - 10, 50));
  }

  resetZoom(): void {
    this.zoomLevel.set(100);
  }

  addAnnotation(): void {
    // TODO: 实现添加批注逻辑
    this.message.info('添加批注功能开发中');
  }
}
