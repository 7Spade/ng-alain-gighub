import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { InspectionRepository } from '@core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, BlueprintService, TaskService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';

import { InspectionDetailComponent } from './inspection-detail.component';

@Component({
  selector: 'app-quality-results',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'验收结果'">
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
        <nz-select [ngModel]="selectedStatus()" (ngModelChange)="selectedStatus.set($event)" nzPlaceHolder="筛选状态" style="width: 150px;">
          <nz-option [nzValue]="'all'" nzLabel="全部"></nz-option>
          <nz-option [nzValue]="'passed'" nzLabel="通过"></nz-option>
          <nz-option [nzValue]="'failed'" nzLabel="不通过"></nz-option>
          <nz-option [nzValue]="'pending'" nzLabel="待验收"></nz-option>
        </nz-select>
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
        <st #st [data]="filteredResults()" [columns]="columns" [loading]="loading()" [page]="{ front: false, show: true, showSize: true }">
          <ng-template #result let-record>
            @switch (record.result) {
              @case ('passed') {
                <nz-tag nzColor="success">通过</nz-tag>
              }
              @case ('failed') {
                <nz-tag nzColor="error">不通过</nz-tag>
              }
              @case ('pending') {
                <nz-tag nzColor="default">待验收</nz-tag>
              }
            }
          </ng-template>
        </st>
      }
    </nz-card>
  `
})
export class QualityResultsComponent implements OnInit {
  readonly blueprintService = inject(BlueprintService);
  readonly taskService = inject(TaskService);
  private readonly inspectionRepo = inject(InspectionRepository);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly selectedStatus = signal<string>('all');
  readonly loading = signal<boolean>(false);
  readonly results = signal<any[]>([]);

  readonly filteredResults = computed(() => {
    const status = this.selectedStatus();
    const allResults = this.results();
    if (status === 'all') {
      return allResults;
    }
    return allResults.filter(r => r.result === status);
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '验收名称', index: 'name', width: 200 },
    { title: '验收类型', index: 'type', width: 120 },
    { title: '结果', index: 'result', width: 100, render: 'result' },
    { title: '验收日期', index: 'inspection_date', type: 'date', width: 120 },
    { title: '验收人', index: 'inspector', width: 120 },
    { title: '备注', index: 'notes', width: 200 },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
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
    if (!blueprintId) return;

    this.loading.set(true);
    try {
      // 先加载任务列表
      await this.taskService.loadTasksByBlueprint(blueprintId);

      // 然后加载所有任务的验收记录
      const tasks = this.taskService.tasks();
      const inspectionPromises = tasks.map(task => firstValueFrom(this.inspectionRepo.findByTaskId(task.id)));
      const inspectionArrays = await Promise.all(inspectionPromises);
      const allInspections = inspectionArrays.flat();

      // 关联任务标题和映射到结果格式
      const inspectionsWithTask = allInspections.map(inspection => {
        const task = tasks.find(t => t.id === inspection.task_id);
        return {
          id: inspection.id,
          name: `验收-${task?.title || '未知任务'}`,
          type: inspection.inspection_type,
          result: inspection.status === 'accepted' ? 'passed' : inspection.status === 'rejected' ? 'failed' : 'pending',
          inspection_date: inspection.inspected_at,
          inspector: inspection.inspector_id,
          notes: inspection.findings || '',
          created_at: inspection.inspected_at
        };
      });

      this.results.set(inspectionsWithTask);
    } catch (error) {
      this.message.error('加载验收结果数据失败');
    } finally {
      this.loading.set(false);
    }
  }

  viewDetail(id: string): void {
    this.modal.create({
      nzTitle: '验收记录详情',
      nzContent: InspectionDetailComponent,
      nzData: {
        inspectionId: id
      },
      nzWidth: 900,
      nzFooter: null
    });
  }
}
