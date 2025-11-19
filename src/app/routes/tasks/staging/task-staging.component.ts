import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, TaskService, TaskStagingService, Task, TaskStaging, BlueprintService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

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
        <st #st [data]="stagingTasks()" [columns]="columns" [loading]="loading()" [page]="{ front: false, show: true, showSize: true }">
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
  private readonly taskStagingService = inject(TaskStagingService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly selectedBlueprintId = signal<string | null>(null);

  // 使用 TaskStagingService 的 loading 和 stagingItems
  readonly loading = this.taskStagingService.loading;
  readonly stagingRecords = this.taskStagingService.stagingItems;

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

    try {
      // 先加載任務列表
      await this.taskService.loadTasksByBlueprint(blueprintId);

      // 然後使用 TaskStagingService 加載暫存記錄
      await this.taskStagingService.loadStagingByBlueprint(blueprintId);
    } catch (error) {
      this.message.error('加載暫存區數據失敗');
    }
  }

  viewTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  async withdraw(record: any): Promise<void> {
    // 檢查是否可撤回（透過 Service）
    const canWithdrawResult = await this.taskStagingService.canWithdraw(record.id);
    if (!canWithdrawResult) {
      this.message.warning('該任務已不可撤回或超過48小時');
      return;
    }

    try {
      // TODO: 獲取當前用戶 ID（應該從 AuthService 獲取）
      const currentUserId = record.submitted_by; // 臨時使用提交者 ID

      // 使用 TaskStagingService 撤回暫存
      await this.taskStagingService.withdrawStaging(record.id, currentUserId);

      // 更新任務狀態，將任務從 staging 恢復到之前的狀態
      const task = this.taskService.tasks().find(t => t.id === record.task_id);
      if (task) {
        // 假設撤回後任務回到 assigned 狀態
        await this.taskService.updateTask(record.task_id, {
          status: 'assigned'
        });
      }

      this.message.success('任務已成功撤回');

      // 刷新列表
      await this.onBlueprintChange();
    } catch (error: any) {
      console.error('撤回任務失敗:', error);
      this.message.error(error.message || '撤回失敗，請重試');
    }
  }
}
