import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, BlueprintService, TaskService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QualityCheckRepository } from '@core';
import { firstValueFrom } from 'rxjs';
import { QualityCheckFormComponent } from './quality-check-form.component';
import { QualityCheckDetailComponent } from './quality-check-detail.component';

@Component({
  selector: 'app-quality-checks',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'质量检查'">
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
        <button nz-button nzType="primary" (click)="createCheck()">
          <span nz-icon nzType="plus"></span>
          新建检查
        </button>
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      @if (!selectedBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else if (loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else {
        <st #st [data]="checks()" [columns]="columns" [loading]="loading()" [page]="{ front: false, show: true, showSize: true }"> </st>
      }
    </nz-card>
  `
})
export class QualityChecksComponent implements OnInit {
  readonly blueprintService = inject(BlueprintService);
  readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly qualityCheckRepo = inject(QualityCheckRepository);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly checks = signal<any[]>([]);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '任务标题', index: 'taskTitle', width: 200 },
    { title: '检查类型', index: 'check_type', width: 120 },
    { title: '状态', index: 'status', width: 100 },
    { title: '检查时间', index: 'checked_at', type: 'date', width: 180 },
    { title: '检查员ID', index: 'inspector_id', width: 120 },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '查看',
          click: (record: any) => this.viewDetail(record.id)
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
    if (blueprintId) {
      this.loading.set(true);
      try {
        // 先加载任务列表
        await this.taskService.loadTasksByBlueprint(blueprintId);
        
        // 然后加载所有任务的品质检查
        const tasks = this.taskService.tasks();
        const checkPromises = tasks.map(task => firstValueFrom(this.qualityCheckRepo.findByTaskId(task.id)));
        const checkArrays = await Promise.all(checkPromises);
        const allChecks = checkArrays.flat();
        
        // 关联任务标题
        const checksWithTask = allChecks.map(check => {
          const task = tasks.find(t => t.id === check.task_id);
          return {
            ...check,
            taskTitle: task?.title || '任务不存在'
          };
        });
        
        this.checks.set(checksWithTask);
      } catch (error) {
        this.message.error('加载品质检查数据失败');
      } finally {
        this.loading.set(false);
      }
    }
  }

  createCheck(): void {
    const blueprintId = this.selectedBlueprintId();
    if (!blueprintId) {
      this.message.warning('请先选择蓝图');
      return;
    }

    const tasks = this.taskService.tasks();
    if (tasks.length === 0) {
      this.message.warning('当前蓝图没有任务，请先创建任务');
      return;
    }

    // 简单起见，使用第一个任务。实际应该让用户选择任务
    const task = tasks[0];

    const modalRef = this.modal.create({
      nzTitle: '创建品质检查',
      nzContent: QualityCheckFormComponent,
      nzData: {
        task
      },
      nzWidth: 720,
      nzFooter: null
    });

    modalRef.afterClose.subscribe((result) => {
      if (result) {
        // 刷新列表
        this.onBlueprintChange();
      }
    });
  }

  viewDetail(id: string): void {
    this.modal.create({
      nzTitle: '品质检查详情',
      nzContent: QualityCheckDetailComponent,
      nzData: {
        checkId: id
      },
      nzWidth: 800,
      nzFooter: null
    });
  }
}
