import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface DiscussionItem {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly commentCount: number;
  readonly lastActivityAt: string;
  readonly createdAt: string;
}

@Component({
  selector: 'app-discussion-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'讨论区'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createDiscussion()">
          <span nz-icon nzType="plus"></span>
          新建讨论
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="讨论区" style="margin-top: 16px;">
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
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>搜索</nz-form-label>
          <nz-form-control>
            <input nz-input [ngModel]="searchKeyword()" (ngModelChange)="searchKeyword.set($event)" placeholder="搜索讨论标题" style="width: 250px;" />
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 讨论列表表格 -->
      <st
        #st
        [data]="filteredDiscussions()"
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
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class DiscussionListComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterResourceType = signal<string | null>(null);
  searchKeyword = signal<string>('');
  discussions = signal<DiscussionItem[]>([]);

  // Computed filtered discussions
  filteredDiscussions = computed(() => {
    let result = this.discussions();

    if (this.filterResourceType()) {
      result = result.filter(item => item.resourceType === this.filterResourceType());
    }

    if (this.searchKeyword()) {
      const keyword = this.searchKeyword().toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(keyword));
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '标题', index: 'title', width: 300 },
    { title: '作者', index: 'author', width: 120 },
    { title: '资源类型', index: 'resourceType', width: 120, render: 'resourceType' },
    { title: '资源ID', index: 'resourceId', width: 150 },
    { title: '评论数', index: 'commentCount', width: 100 },
    { title: '最后活动', index: 'lastActivityAt', type: 'date', width: 180 },
    { title: '创建时间', index: 'createdAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: DiscussionItem) => this.viewDetail(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: DiscussionItem) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadDiscussions();
  }

  loadDiscussions(): void {
    // TODO: 加载讨论列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.discussions.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  createDiscussion(): void {
    // TODO: 实现创建讨论逻辑
    this.message.info('创建讨论功能开发中');
  }

  viewDetail(id: string): void {
    // TODO: 实现查看详情逻辑
    this.message.info('查看详情功能开发中');
  }

  delete(id: string): void {
    // TODO: 实现删除逻辑
    this.message.info('删除功能开发中');
  }
}
