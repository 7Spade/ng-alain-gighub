import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface CrossBranchItem {
  readonly branchId: string;
  readonly branchName: string;
  readonly blueprintName: string;
  readonly progress: number;
  readonly taskCount: number;
  readonly issueCount: number;
  readonly riskLevel: string;
}

@Component({
  selector: 'app-cross-branch',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'跨分支总览'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="refreshData()" [nzLoading]="loading()">
          <span nz-icon nzType="reload"></span>
          刷新
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="跨分支总览" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>风险等级</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterRiskLevel()"
              (ngModelChange)="filterRiskLevel.set($event)"
              nzPlaceHolder="全部等级"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="low" nzLabel="低"></nz-option>
              <nz-option nzValue="medium" nzLabel="中"></nz-option>
              <nz-option nzValue="high" nzLabel="高"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 跨分支对比表格 -->
      <st
        #st
        [data]="filteredBranches()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #progress let-record>
          <nz-progress [nzPercent]="record.progress" [nzShowInfo]="true"></nz-progress>
        </ng-template>

        <ng-template #riskLevel let-record>
          @switch (record.riskLevel) {
            @case ('low') {
              <nz-tag nzColor="green">低</nz-tag>
            }
            @case ('medium') {
              <nz-tag nzColor="orange">中</nz-tag>
            }
            @case ('high') {
              <nz-tag nzColor="red">高</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class CrossBranchComponent implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterRiskLevel = signal<string | null>(null);
  branches = signal<CrossBranchItem[]>([]);

  // Computed filtered branches
  filteredBranches = computed(() => {
    let result = this.branches();

    if (this.filterRiskLevel()) {
      result = result.filter(item => item.riskLevel === this.filterRiskLevel());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: '分支ID', index: 'branchId', width: 150 },
    { title: '分支名称', index: 'branchName', width: 200 },
    { title: '蓝图名称', index: 'blueprintName', width: 200 },
    { title: '进度', index: 'progress', width: 200, render: 'progress' },
    { title: '任务数', index: 'taskCount', width: 100 },
    { title: '问题数', index: 'issueCount', width: 100 },
    { title: '风险等级', index: 'riskLevel', width: 120, render: 'riskLevel' },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '查看详情',
          click: (record: CrossBranchItem) => this.viewDetail(record.branchId)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // TODO: 加载跨分支数据
    // 暂时使用空数组，实际开发时连接真实数据
    this.branches.set([]);
  }

  refreshData(): void {
    this.loadData();
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  viewDetail(branchId: string): void {
    // TODO: 实现查看详情逻辑
    this.message.info('查看详情功能开发中');
  }
}
