import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, TaskService, Task, TaskStaging, BlueprintService } from '@shared';
import { TaskStagingRepository } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-task-staging',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'暂存区'">
      <ng-template #extra>
        <nz-select
          [ngModel]="selectedBlueprintId()"
          (ngModelChange)="selectedBlueprintId.set($event); onBlueprintChange()"
          nzPlaceHolder="请选择蓝图"
          style="width: 300px; margin-right: 8px;"
        >
          @for (blueprint of blueprintService.blueprints(); track blueprint.id) {
            <nz-option [nzValue]="blueprint.id" [nzLabel]="blueprint.name"></nz-option>
          }
        </nz-select>
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="暂存区说明"
        nzDescription="此页面显示48小时内可撤回的任务。任务提交后进入暂存区，48小时内可以撤回。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      @if (!selectedBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else if (loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else if (stagingTasks().length === 0) {
        <nz-empty nzNotFoundContent="暂存区暂无任务"></nz-empty>
      } @else {
        <st
          #st
          [data]="stagingTasks()"
          [columns]="columns"
          [loading]="loading()"
          [page]="{ front: false, show: true, showSize: true }"
        >
          <ng-template #canWithdraw let-record>
            @if (record.can_withdraw) {
              <nz-tag nzColor="green">可撤回</nz-tag>
            } @else {
              <nz-tag nzColor="default">不可撤回</nz-tag>
            }
          </ng-template>
        </st>
      }
    </nz-card>
  `
})
export class TaskStagingComponent implements OnInit {
  readonly taskService = inject(TaskService);
  readonly blueprintService = inject(BlueprintService);
  private readonly taskStagingRepository = inject(TaskStagingRepository);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly stagingRecords = signal<TaskStaging[]>([]);

  readonly stagingTasks = computed(() => {
    const records = this.stagingRecords();
    const tasks = this.taskService.tasks();
    
    // 将暂存记录与任务关联
    return records.map(record => {
      const task = tasks.find(t => t.id === record.task_id);
      return {
        ...record,
        task: task || null,
        taskTitle: task?.title || '任务不存在'
      };
    });
  });

  columns: STColumn[] = [
    { title: '任务ID', index: 'task_id', width: 120 },
    { title: '任务标题', index: 'taskTitle', width: 200 },
    { title: '提交者ID', index: 'submitted_by', width: 120 },
    { title: '提交时间', index: 'submitted_at', type: 'date', width: 180 },
    { title: '过期时间', index: 'expires_at', type: 'date', width: 180 },
    { title: '可撤回', index: 'can_withdraw', width: 100, render: 'canWithdraw' },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看任务',
          click: (record: any) => this.viewTask(record.task_id)
        },
        {
          text: '撤回',
          type: 'del',
          pop: true,
          popTitle: '确认撤回',
          click: (record: any) => this.withdraw(record)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadBlueprints();
  }

  async loadBlueprints(): Promise<void> {
    try {
      await this.blueprintService.loadBlueprints();
    } catch (error) {
      this.message.error('加载蓝图列表失败');
    }
  }

  async onBlueprintChange(): Promise<void> {
    const blueprintId = this.selectedBlueprintId();
    if (!blueprintId) return;

    this.loading.set(true);
    try {
      // 先加载任务列表
      await this.taskService.loadTasksByBlueprint(blueprintId);
      
      // 然后加载所有任务的暂存记录
      const tasks = this.taskService.tasks();
      const stagingPromises = tasks.map(task => 
        firstValueFrom(this.taskStagingRepository.findByTaskId(task.id))
      );
      const stagingArrays = await Promise.all(stagingPromises);
      const allStaging = stagingArrays.flat();
      
      // 过滤出可撤回的记录（48小时内）
      const now = new Date();
      const withdrawable = allStaging.filter(record => {
        if (!record.expires_at || !record.can_withdraw) return false;
        const expiresAt = new Date(record.expires_at);
        return expiresAt > now;
      });
      
      this.stagingRecords.set(withdrawable);
    } catch (error) {
      this.message.error('加载暂存区数据失败');
    } finally {
      this.loading.set(false);
    }
  }

  viewTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  async withdraw(record: any): Promise<void> {
    // TODO: 实现撤回逻辑
    this.message.info('撤回功能待实现');
  }
}
