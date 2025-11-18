import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, BlueprintService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-quality-inspections',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'验收管理'">
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
      @if (!selectedBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else if (loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else {
        <st #st [data]="inspections()" [columns]="columns" [loading]="loading()" [page]="{ front: false, show: true, showSize: true }">
        </st>
      }
    </nz-card>
  `
})
export class QualityInspectionsComponent implements OnInit {
  readonly blueprintService = inject(BlueprintService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly inspections = signal<any[]>([]);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '验收名称', index: 'name', width: 200 },
    { title: '验收类型', index: 'type', width: 120 },
    { title: '状态', index: 'status', width: 100 },
    { title: '验收日期', index: 'inspection_date', type: 'date', width: 120 },
    { title: '验收人', index: 'inspector', width: 120 },
    { title: '结果', index: 'result', width: 100 },
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
    if (blueprintId) {
      this.loading.set(true);
      // TODO: 加载验收管理数据
      setTimeout(() => {
        this.inspections.set([]);
        this.loading.set(false);
      }, 500);
    }
  }

  viewDetail(id: string): void {
    this.router.navigate(['/quality/inspections/detail', id]);
  }
}
