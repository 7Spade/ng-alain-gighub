import { Component, OnInit, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { PullRequestService, PullRequest } from '@shared';
import { PRStatus } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-pull-request-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'Pull Request 管理'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
        <button nz-button nzType="primary" (click)="createPR()">
          <span nz-icon nzType="plus"></span>
          创建 PR
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="Pull Request 列表" style="margin-top: 16px;">
      <st
        #st
        [data]="prService.pullRequests()"
        [columns]="columns"
        [loading]="prService.loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #status let-record>
          @switch (record.status) {
            @case ('open') {
              <nz-tag nzColor="blue">打开</nz-tag>
            }
            @case ('reviewing') {
              <nz-tag nzColor="orange">审核中</nz-tag>
            }
            @case ('approved') {
              <nz-tag nzColor="green">已批准</nz-tag>
            }
            @case ('rejected') {
              <nz-tag nzColor="red">已拒绝</nz-tag>
            }
            @case ('merged') {
              <nz-tag nzColor="purple">已合并</nz-tag>
            }
            @case ('closed') {
              <nz-tag nzColor="default">已关闭</nz-tag>
            }
            @default {
              <nz-tag>未知</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class PullRequestListComponent implements OnInit {
  prService = inject(PullRequestService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  blueprintId = computed(() => this.route.snapshot.paramMap.get('id') || '');

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '标题', index: 'title', width: 200 },
    { title: '分支ID', index: 'branch_id', width: 150 },
    { title: '提交者', index: 'submitted_by', width: 150 },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 250,
      buttons: [
        {
          text: '查看',
          click: (record: PullRequest) => this.viewPR(record.id)
        },
        {
          text: '审核',
          click: (record: PullRequest) => this.reviewPR(record.id)
        },
        {
          text: '合并',
          click: (record: PullRequest) => this.mergePR(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    const id = this.blueprintId();
    if (id) {
      this.loadPRs(id);
    }
  }

  async loadPRs(blueprintId: string): Promise<void> {
    try {
      await this.prService.loadPullRequestsByBlueprintId(blueprintId);
    } catch (error) {
      this.message.error('加载 Pull Request 列表失败');
    }
  }

  onTableChange(): void {
    // 表格变化处理
  }

  goBack(): void {
    const blueprintId = this.blueprintId();
    if (blueprintId) {
      this.router.navigate(['/blueprints', blueprintId]);
    } else {
      this.router.navigate(['/blueprints/list']);
    }
  }

  createPR(): void {
    // TODO: 实现创建 PR 对话框
    this.message.info('创建 PR 功能待实现');
  }

  viewPR(prId: string): void {
    // TODO: 实现查看 PR 详情
    this.message.info('查看 PR 详情功能待实现');
  }

  async reviewPR(prId: string): Promise<void> {
    // TODO: 实现审核 PR 对话框
    this.message.info('审核 PR 功能待实现');
  }

  async mergePR(prId: string): Promise<void> {
    // TODO: 实现合并 PR 对话框
    this.message.info('合并 PR 功能待实现');
  }
}

