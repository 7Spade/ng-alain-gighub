import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SHARED_IMPORTS, BranchService, BlueprintBranch } from '@shared';

export interface BranchDetailData {
  branchId: string;
}

@Component({
  selector: 'app-branch-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    @if (loading()) {
      <div style="text-align: center; padding: 40px;">
        <nz-spin nzSize="large"></nz-spin>
      </div>
    } @else if (branch()) {
      <nz-descriptions nzBordered [nzColumn]="2">
        <nz-descriptions-item nzTitle="分支ID" [nzSpan]="2">{{ branch()!.id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="分支名称" [nzSpan]="2">{{ branch()!.branch_name }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="蓝图ID" [nzSpan]="1">{{ branch()!.blueprint_id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="组织ID" [nzSpan]="1">{{ branch()!.organization_id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="分支类型" [nzSpan]="1">
          @switch (branch()!.branch_type) {
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
              <nz-tag>{{ branch()!.branch_type }}</nz-tag>
            }
          }
        </nz-descriptions-item>
        <nz-descriptions-item nzTitle="状态" [nzSpan]="1">
          @switch (branch()!.status) {
            @case ('active') {
              <nz-tag nzColor="green">活跃</nz-tag>
            }
            @case ('closed') {
              <nz-tag nzColor="default">已关闭</nz-tag>
            }
            @case ('archived') {
              <nz-tag nzColor="orange">已归档</nz-tag>
            }
            @default {
              <nz-tag>{{ branch()!.status }}</nz-tag>
            }
          }
        </nz-descriptions-item>
        @if (branch()!.notes) {
          <nz-descriptions-item nzTitle="备注" [nzSpan]="2">
            <pre style="white-space: pre-wrap; margin: 0;">{{ branch()!.notes }}</pre>
          </nz-descriptions-item>
        }
        <nz-descriptions-item nzTitle="创建时间" [nzSpan]="1">
          {{ branch()!.forked_at | date:'yyyy-MM-dd HH:mm:ss' }}
        </nz-descriptions-item>
        @if (branch()!.last_sync_at) {
          <nz-descriptions-item nzTitle="最后同步时间" [nzSpan]="2">
            {{ branch()!.last_sync_at | date:'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
        }
      </nz-descriptions>
      
      <div style="margin-top: 16px; text-align: right;">
        <button nz-button nzType="default" (click)="close()">关闭</button>
      </div>
    } @else {
      <nz-empty nzNotFoundContent="分支不存在"></nz-empty>
    }
  `
})
export class BranchDetailComponent implements OnInit {
  private modalRef = inject(NzModalRef);
  private branchService = inject(BranchService);
  
  readonly data: BranchDetailData = inject(NZ_MODAL_DATA);
  readonly loading = signal(false);
  readonly branch = signal<BlueprintBranch | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadBranch();
  }

  async loadBranch(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.branchService.loadBranchById(this.data.branchId);
      this.branch.set(result);
    } catch (error) {
      console.error('加载分支详情失败:', error);
      this.branch.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  close(): void {
    this.modalRef.close();
  }
}
