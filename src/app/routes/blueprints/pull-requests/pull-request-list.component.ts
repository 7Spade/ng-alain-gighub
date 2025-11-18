import { Component, OnInit, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PRStatus } from '@core';
import { STColumn } from '@delon/abc/st';
import { AccountService, AccountType, BlueprintService, PullRequest, PullRequestService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { PullRequestDetailComponent } from './pull-request-detail.component';
import { PullRequestFormComponent } from './pull-request-form.component';
import { PullRequestMergeComponent } from './pull-request-merge.component';
import { PullRequestReviewComponent } from './pull-request-review.component';

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
        @if (!isPersonalBlueprint()) {
          <button nz-button nzType="primary" (click)="createPR()">
            <span nz-icon nzType="plus"></span>
            创建 PR
          </button>
        } @else {
          <nz-tooltip nzTitle="个人蓝图不支持PR功能（需要组织分支）">
            <button nz-button nzType="primary" nzDisabled>
              <span nz-icon nzType="plus"></span>
              创建 PR
            </button>
          </nz-tooltip>
        }
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
  accountService = inject(AccountService);
  blueprintService = inject(BlueprintService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);
  modal = inject(NzModalService);

  blueprintId = computed(() => this.route.snapshot.paramMap.get('id') || '');

  // 蓝图信息
  blueprint = computed(() => this.blueprintService.selectedBlueprint());

  // 判断是否为个人蓝图
  isPersonalBlueprint = computed(() => {
    const bp = this.blueprint();
    if (!bp) return false;
    const owner = this.accountService.accounts().find(a => a.id === bp.owner_id);
    return owner?.type === AccountType.USER;
  });

  // 导出枚举供模板使用
  AccountType = AccountType;

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
      this.loadBlueprint(id);
      this.loadPRs(id);
    }
  }

  async loadBlueprint(id: string): Promise<void> {
    try {
      await this.blueprintService.loadBlueprintById(id);
      // 加载拥有者账户信息
      const blueprint = this.blueprint();
      if (blueprint) {
        await this.accountService.loadAccountById(blueprint.owner_id);
      }
    } catch (error) {
      // 静默失败，不影响主流程
      console.error('加载蓝图信息失败:', error);
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
    const blueprintId = this.blueprintId();
    if (!blueprintId) {
      this.message.warning('无法获取蓝图ID');
      return;
    }

    // TODO: 实际应该选择具体的分支，这里简化处理
    const modalRef = this.modal.create({
      nzTitle: '创建 Pull Request',
      nzContent: PullRequestFormComponent,
      nzData: {
        blueprintId,
        branchId: 'temp-branch-id', // 实际应该从当前上下文获取
        submittedBy: 'temp-user-id' // 实际应该从当前登录用户获取
      },
      nzWidth: 720,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.loadPRs(blueprintId);
      }
    });
  }

  viewPR(prId: string): void {
    this.modal.create({
      nzTitle: 'Pull Request 详情',
      nzContent: PullRequestDetailComponent,
      nzData: {
        prId
      },
      nzWidth: 900,
      nzFooter: null
    });
  }

  async reviewPR(prId: string): Promise<void> {
    const pr = this.prService.pullRequests().find(p => p.id === prId);
    if (!pr) {
      this.message.error('找不到该 Pull Request');
      return;
    }

    if (pr.status !== 'open' && pr.status !== 'reviewing') {
      this.message.warning('只能审核打开或审核中的 Pull Request');
      return;
    }

    const modalRef = this.modal.create({
      nzTitle: '审核 Pull Request',
      nzContent: PullRequestReviewComponent,
      nzData: {
        pr,
        reviewerId: 'temp-reviewer-id' // 实际应该从当前登录用户获取
      },
      nzWidth: 720,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        const blueprintId = this.blueprintId();
        if (blueprintId) {
          this.loadPRs(blueprintId);
        }
      }
    });
  }

  async mergePR(prId: string): Promise<void> {
    const pr = this.prService.pullRequests().find(p => p.id === prId);
    if (!pr) {
      this.message.error('找不到该 Pull Request');
      return;
    }

    if (pr.status !== 'approved') {
      this.message.warning('只能合并已批准的 Pull Request');
      return;
    }

    const modalRef = this.modal.create({
      nzTitle: '合并 Pull Request',
      nzContent: PullRequestMergeComponent,
      nzData: {
        pr,
        mergedBy: 'temp-merger-id' // 实际应该从当前登录用户获取
      },
      nzWidth: 600,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        const blueprintId = this.blueprintId();
        if (blueprintId) {
          this.loadPRs(blueprintId);
        }
      }
    });
  }
}
