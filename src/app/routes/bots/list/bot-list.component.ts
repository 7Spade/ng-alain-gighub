import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface BotItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly type: 'report' | 'notification' | 'backup';
  readonly status: 'active' | 'inactive' | 'suspended';
  readonly lastExecutionAt: string | null;
  readonly nextExecutionAt: string | null;
  readonly createdAt: string;
}

@Component({
  selector: 'app-bot-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'机器人列表'">
      <ng-template #extra>
        <button nz-button nzType="primary" routerLink="/bots/config">
          <span nz-icon nzType="plus"></span>
          创建机器人
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="机器人列表" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>类型</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterType()"
              (ngModelChange)="filterType.set($event)"
              nzPlaceHolder="全部类型"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="report" nzLabel="报表"></nz-option>
              <nz-option nzValue="notification" nzLabel="通知"></nz-option>
              <nz-option nzValue="backup" nzLabel="备份"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>状态</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterStatus()"
              (ngModelChange)="filterStatus.set($event)"
              nzPlaceHolder="全部状态"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="active" nzLabel="活跃"></nz-option>
              <nz-option nzValue="inactive" nzLabel="非活跃"></nz-option>
              <nz-option nzValue="suspended" nzLabel="已暂停"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 机器人列表表格 -->
      <st
        #st
        [data]="filteredBots()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #type let-record>
          @switch (record.type) {
            @case ('report') {
              <nz-tag nzColor="blue">报表</nz-tag>
            }
            @case ('notification') {
              <nz-tag nzColor="green">通知</nz-tag>
            }
            @case ('backup') {
              <nz-tag nzColor="purple">备份</nz-tag>
            }
          }
        </ng-template>

        <ng-template #status let-record>
          @switch (record.status) {
            @case ('active') {
              <nz-tag nzColor="success">活跃</nz-tag>
            }
            @case ('inactive') {
              <nz-tag nzColor="default">非活跃</nz-tag>
            }
            @case ('suspended') {
              <nz-tag nzColor="error">已暂停</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class BotListComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterType = signal<string | null>(null);
  filterStatus = signal<string | null>(null);
  bots = signal<BotItem[]>([]);

  // Computed filtered bots
  filteredBots = computed(() => {
    let result = this.bots();

    if (this.filterType()) {
      result = result.filter(item => item.type === this.filterType());
    }

    if (this.filterStatus()) {
      result = result.filter(item => item.status === this.filterStatus());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '名称', index: 'name', width: 200 },
    { title: '描述', index: 'description', width: 300 },
    { title: '类型', index: 'type', width: 100, render: 'type' },
    { title: '状态', index: 'status', width: 120, render: 'status' },
    { title: '上次执行', index: 'lastExecutionAt', type: 'date', width: 180 },
    { title: '下次执行', index: 'nextExecutionAt', type: 'date', width: 180 },
    { title: '创建时间', index: 'createdAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 250,
      buttons: [
        {
          text: '查看',
          click: (record: BotItem) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: BotItem) => this.edit(record.id)
        },
        {
          text: '执行日志',
          click: (record: BotItem) => this.viewExecutions(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: BotItem) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadBots();
  }

  loadBots(): void {
    // TODO: 加载机器人列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.bots.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  viewDetail(id: string): void {
    // TODO: 查看机器人详情
    this.message.info('查看详情功能开发中');
  }

  edit(id: string): void {
    this.router.navigate(['/bots/config'], { queryParams: { id } });
  }

  viewExecutions(id: string): void {
    this.router.navigate(['/bots/executions'], { queryParams: { botId: id } });
  }

  delete(id: string): void {
    // TODO: 删除机器人
    this.message.info('删除机器人功能开发中');
  }
}
