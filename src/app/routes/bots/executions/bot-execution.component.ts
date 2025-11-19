import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface BotExecutionItem {
  readonly id: string;
  readonly botId: string;
  readonly botName: string;
  readonly status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly duration: number | null;
  readonly errorMessage: string | null;
}

@Component({
  selector: 'app-bot-execution',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'执行日志'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="refresh()">
          <span nz-icon nzType="reload"></span>
          刷新
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="机器人执行日志" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>机器人</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterBotId()"
              (ngModelChange)="filterBotId.set($event)"
              nzPlaceHolder="全部机器人"
              nzAllowClear
              style="width: 200px;"
            >
              @for (bot of bots(); track bot.id) {
                <nz-option [nzValue]="bot.id" [nzLabel]="bot.name"></nz-option>
              }
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
              <nz-option nzValue="pending" nzLabel="待执行"></nz-option>
              <nz-option nzValue="running" nzLabel="执行中"></nz-option>
              <nz-option nzValue="completed" nzLabel="已完成"></nz-option>
              <nz-option nzValue="failed" nzLabel="失败"></nz-option>
              <nz-option nzValue="cancelled" nzLabel="已取消"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>日期范围</nz-form-label>
          <nz-form-control>
            <nz-range-picker
              [ngModel]="dateRange()"
              (ngModelChange)="dateRange.set($event)"
              nzFormat="yyyy-MM-dd"
              style="width: 300px;"
            ></nz-range-picker>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 执行日志列表表格 -->
      <st
        #st
        [data]="filteredExecutions()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #status let-record>
          @switch (record.status) {
            @case ('pending') {
              <nz-tag nzColor="default">待执行</nz-tag>
            }
            @case ('running') {
              <nz-tag nzColor="processing">执行中</nz-tag>
            }
            @case ('completed') {
              <nz-tag nzColor="success">已完成</nz-tag>
            }
            @case ('failed') {
              <nz-tag nzColor="error">失败</nz-tag>
            }
            @case ('cancelled') {
              <nz-tag nzColor="default">已取消</nz-tag>
            }
          }
        </ng-template>

        <ng-template #duration let-record>
          {{ record.duration ? (record.duration / 1000).toFixed(2) + 's' : '-' }}
        </ng-template>
      </st>
    </nz-card>
  `
})
export class BotExecutionComponent implements OnInit {
  route = inject(ActivatedRoute);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterBotId = signal<string | null>(null);
  filterStatus = signal<string | null>(null);
  dateRange = signal<[Date, Date] | null>(null);
  executions = signal<BotExecutionItem[]>([]);
  bots = signal<{ id: string; name: string }[]>([]);

  // Computed filtered executions
  filteredExecutions = computed(() => {
    let result = this.executions();

    if (this.filterBotId()) {
      result = result.filter(item => item.botId === this.filterBotId());
    }

    if (this.filterStatus()) {
      result = result.filter(item => item.status === this.filterStatus());
    }

    if (this.dateRange()) {
      const [start, end] = this.dateRange()!;
      result = result.filter(item => {
        const date = new Date(item.startedAt);
        return date >= start && date <= end;
      });
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '机器人', index: 'botName', width: 200 },
    { title: '状态', index: 'status', width: 120, render: 'status' },
    { title: '开始时间', index: 'startedAt', type: 'date', width: 180 },
    { title: '完成时间', index: 'completedAt', type: 'date', width: 180 },
    { title: '耗时', index: 'duration', width: 100, render: 'duration' },
    { title: '错误信息', index: 'errorMessage', width: 300 },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '查看',
          click: (record: BotExecutionItem) => this.viewDetail(record.id)
        },
        {
          text: '取消',
          iif: (record: BotExecutionItem) => record.status === 'running' || record.status === 'pending',
          click: (record: BotExecutionItem) => this.cancel(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    const botId = this.route.snapshot.queryParamMap.get('botId');
    if (botId) {
      this.filterBotId.set(botId);
    }
    this.loadExecutions();
    this.loadBots();
  }

  loadExecutions(): void {
    // TODO: 加载执行日志列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.executions.set([]);
  }

  loadBots(): void {
    // TODO: 加载机器人列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.bots.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  refresh(): void {
    this.loadExecutions();
  }

  viewDetail(id: string): void {
    // TODO: 查看执行详情
    this.message.info('查看详情功能开发中');
  }

  cancel(id: string): void {
    // TODO: 取消执行
    this.message.info('取消执行功能开发中');
  }
}
