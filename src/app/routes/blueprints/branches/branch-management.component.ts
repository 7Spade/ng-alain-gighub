import { Component, OnInit, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { BranchService, BlueprintBranch } from '@shared';
import { BranchStatus, BranchType } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-branch-management',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'分支管理'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
        <button nz-button nzType="primary" (click)="forkBranch()">
          <span nz-icon nzType="git-branch"></span>
          Fork 分支
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="蓝图分支列表" style="margin-top: 16px;">
      <st
        #st
        [data]="branchService.branches()"
        [columns]="columns"
        [loading]="branchService.loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #type let-record>
          @switch (record.branch_type) {
            @case ('contractor') {
              <nz-tag nzColor="blue">承揽商</nz-tag>
            }
            @case ('subcontractor') {
              <nz-tag nzColor="cyan">次承揽商</nz-tag>
            }
            @case ('consultant') {
              <nz-tag nzColor="purple">顾问</nz-tag>
            }
            @default {
              <nz-tag>未知</nz-tag>
            }
          }
        </ng-template>

        <ng-template #status let-record>
          @switch (record.status) {
            @case ('active') {
              <nz-tag nzColor="success">活跃</nz-tag>
            }
            @case ('merged') {
              <nz-tag nzColor="blue">已合并</nz-tag>
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
export class BranchManagementComponent implements OnInit {
  branchService = inject(BranchService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  blueprintId = computed(() => this.route.snapshot.paramMap.get('id') || '');

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '分支名称', index: 'branch_name', width: 200 },
    { title: '组织ID', index: 'organization_id', width: 150 },
    { title: '分支类型', index: 'branch_type', width: 120, render: 'type' },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: BlueprintBranch) => this.viewBranch(record.id)
        },
        {
          text: '同步',
          click: (record: BlueprintBranch) => this.syncBranch(record.id)
        },
        {
          text: '关闭',
          click: (record: BlueprintBranch) => this.closeBranch(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    const id = this.blueprintId();
    if (id) {
      this.loadBranches(id);
    }
  }

  async loadBranches(blueprintId: string): Promise<void> {
    try {
      await this.branchService.loadBranchesByBlueprintId(blueprintId);
    } catch (error) {
      this.message.error('加载分支列表失败');
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

  forkBranch(): void {
    // TODO: 实现 Fork 分支对话框
    this.message.info('Fork 分支功能待实现');
  }

  viewBranch(branchId: string): void {
    // TODO: 实现查看分支详情
    this.message.info('查看分支详情功能待实现');
  }

  async syncBranch(branchId: string): Promise<void> {
    try {
      await this.branchService.syncFromMainBranch(branchId);
      this.message.success('同步成功');
    } catch (error) {
      this.message.error('同步失败');
    }
  }

  async closeBranch(branchId: string): Promise<void> {
    try {
      await this.branchService.closeBranch(branchId);
      this.message.success('关闭成功');
      const blueprintId = this.blueprintId();
      if (blueprintId) {
        await this.loadBranches(blueprintId);
      }
    } catch (error) {
      this.message.error('关闭失败');
    }
  }
}

