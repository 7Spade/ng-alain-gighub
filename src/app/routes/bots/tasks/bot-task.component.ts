import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { STComponent, STColumn, STData } from '@delon/abc/st';
import { SFComponent, SFSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BotTaskRepository } from '@core/infra/repositories/bot-task.repository';
import { BotRepository } from '@core/infra/repositories/bot.repository';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bot-task',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent, SFComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'機器人任務管理'" [autoBreadcrumb]="false">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createTask()">
          <i nz-icon nzType="plus"></i>
          新建任務
        </button>
        <button nz-button (click)="refresh()">
          <i nz-icon nzType="reload"></i>
          刷新
        </button>
      </ng-template>
    </page-header>

    <nz-card>
      <st #st [data]="data()" [columns]="columns" [loading]="loading()" 
          [scroll]="{ x: '1400px' }" />
    </nz-card>
  `
})
export class BotTaskComponent implements OnInit {
  private botTaskRepo = inject(BotTaskRepository);
  private botRepo = inject(BotRepository);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  data = signal<STData[]>([]);
  loading = signal(false);

  columns: STColumn[] = [
    { title: '任務ID', index: 'id', width: 180 },
    { title: '機器人', index: 'bot_name', width: 150 },
    { 
      title: '任務類型', 
      index: 'task_type', 
      width: 120,
      render: 'task_type',
      renderTitle: 'task_type_title'
    },
    { 
      title: '狀態', 
      index: 'status', 
      width: 100,
      type: 'badge',
      badge: {
        pending: { text: '待執行', color: 'default' },
        running: { text: '執行中', color: 'processing' },
        completed: { text: '已完成', color: 'success' },
        failed: { text: '失敗', color: 'error' },
        cancelled: { text: '已取消', color: 'warning' }
      }
    },
    { 
      title: '優先級', 
      index: 'priority', 
      width: 100,
      type: 'badge',
      badge: {
        low: { text: '低', color: 'default' },
        medium: { text: '中', color: 'processing' },
        high: { text: '高', color: 'warning' },
        urgent: { text: '緊急', color: 'error' }
      }
    },
    { title: '排程時間', index: 'scheduled_at', type: 'date', width: 160 },
    { title: '開始時間', index: 'started_at', type: 'date', width: 160 },
    { title: '完成時間', index: 'completed_at', type: 'date', width: 160 },
    { title: '重試次數', index: 'retry_count', width: 100 },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      buttons: [
        {
          text: '查看',
          icon: 'eye',
          click: (record: any) => this.viewTask(record)
        },
        {
          text: '執行',
          icon: 'play-circle',
          iif: (record: any) => record.status === 'pending',
          click: (record: any) => this.executeTask(record)
        },
        {
          text: '取消',
          icon: 'stop',
          type: 'del',
          iif: (record: any) => ['pending', 'running'].includes(record.status),
          pop: {
            title: '確認取消任務？',
            okType: 'danger',
            icon: 'question-circle'
          },
          click: (record: any) => this.cancelTask(record)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    
    forkJoin({
      tasks: this.botTaskRepo.findAll({ pageSize: 1000 }),
      bots: this.botRepo.findAll({ pageSize: 100 })
    }).subscribe({
      next: ({ tasks, bots }) => {
        // Create a map of bot IDs to bot names
        const botMap = new Map(bots.map(bot => [bot.id, bot.name]));
        
        // Enhance tasks with bot names
        const enhancedTasks = tasks.map(task => ({
          ...task,
          bot_name: botMap.get(task.bot_id) || 'Unknown Bot'
        }));
        
        this.data.set(enhancedTasks);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load bot tasks:', err);
        this.message.error('加載機器人任務失敗');
        this.loading.set(false);
      }
    });
  }

  createTask(): void {
    // TODO: Implement task creation modal with SF form
    this.message.info('任務創建功能開發中');
  }

  viewTask(record: any): void {
    this.modal.create({
      nzTitle: '任務詳情',
      nzContent: `
        <nz-descriptions nzBordered>
          <nz-descriptions-item nzTitle="任務ID">${record.id}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="機器人">${record.bot_name}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="類型">${record.task_type}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="狀態">${record.status}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="優先級">${record.priority}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="排程時間">${record.scheduled_at}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="重試次數">${record.retry_count}</nz-descriptions-item>
        </nz-descriptions>
      `,
      nzFooter: null,
      nzWidth: 800
    });
  }

  executeTask(record: any): void {
    this.modal.confirm({
      nzTitle: '確認執行任務？',
      nzContent: `將立即執行任務: ${record.id}`,
      nzOnOk: () => {
        // TODO: Implement task execution API call
        this.message.success('任務已開始執行');
        this.loadData();
      }
    });
  }

  cancelTask(record: any): void {
    // TODO: Implement task cancellation API call
    this.message.success('任務已取消');
    this.loadData();
  }

  refresh(): void {
    this.loadData();
  }
}
