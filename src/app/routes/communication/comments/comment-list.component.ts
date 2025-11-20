import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface CommentListItem {
  readonly id: string;
  readonly content: string;
  readonly author: string;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly parentId: string | null;
}

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'评论管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" routerLink="/communication/comments/create">
          <span nz-icon nzType="plus"></span>
          新建评论
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="评论列表" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>资源类型</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterResourceType()"
              (ngModelChange)="filterResourceType.set($event)"
              nzPlaceHolder="全部类型"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="task" nzLabel="任务"></nz-option>
              <nz-option nzValue="issue" nzLabel="问题"></nz-option>
              <nz-option nzValue="blueprint" nzLabel="蓝图"></nz-option>
              <nz-option nzValue="quality_check" nzLabel="品质检查"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>作者</nz-form-label>
          <nz-form-control>
            <input
              nz-input
              [ngModel]="filterAuthor()"
              (ngModelChange)="filterAuthor.set($event)"
              placeholder="搜索作者"
              style="width: 200px;"
            />
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 评论列表表格 -->
      <st
        #st
        [data]="filteredComments()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #resourceType let-record>
          @switch (record.resourceType) {
            @case ('task') {
              <nz-tag nzColor="blue">任务</nz-tag>
            }
            @case ('issue') {
              <nz-tag nzColor="orange">问题</nz-tag>
            }
            @case ('blueprint') {
              <nz-tag nzColor="purple">蓝图</nz-tag>
            }
            @case ('quality_check') {
              <nz-tag nzColor="green">品质检查</nz-tag>
            }
            @default {
              <nz-tag>{{ record.resourceType }}</nz-tag>
            }
          }
        </ng-template>

        <ng-template #content let-record>
          <div style="max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            {{ record.content }}
          </div>
        </ng-template>
      </st>
    </nz-card>
  `
})
export class CommentListComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterResourceType = signal<string | null>(null);
  filterAuthor = signal<string>('');
  comments = signal<CommentListItem[]>([]);

  // Computed filtered comments
  filteredComments = computed(() => {
    let result = this.comments();

    if (this.filterResourceType()) {
      result = result.filter(item => item.resourceType === this.filterResourceType());
    }

    if (this.filterAuthor()) {
      const keyword = this.filterAuthor().toLowerCase();
      result = result.filter(item => item.author.toLowerCase().includes(keyword));
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '内容', index: 'content', width: 400, render: 'content' },
    { title: '作者', index: 'author', width: 120 },
    { title: '资源类型', index: 'resourceType', width: 120, render: 'resourceType' },
    { title: '资源ID', index: 'resourceId', width: 150 },
    { title: '父评论ID', index: 'parentId', width: 120 },
    { title: '创建时间', index: 'createdAt', type: 'date', width: 180 },
    { title: '更新时间', index: 'updatedAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: CommentListItem) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: CommentListItem) => this.edit(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: CommentListItem) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    // TODO: 加载评论列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.comments.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  viewDetail(id: string): void {
    // TODO: 实现查看详情逻辑
    this.message.info('查看详情功能开发中');
  }

  edit(id: string): void {
    // TODO: 实现编辑逻辑
    this.message.info('编辑功能开发中');
  }

  delete(id: string): void {
    // TODO: 实现删除逻辑
    this.message.info('删除功能开发中');
  }
}
