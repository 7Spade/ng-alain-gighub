import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, BlueprintService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

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
        <st
          #st
          [data]="checks()"
          [columns]="columns"
          [loading]="loading()"
          [page]="{ front: false, show: true, showSize: true }"
        >
        </st>
      }
    </nz-card>
  `
})
export class QualityChecksComponent implements OnInit {
  readonly blueprintService = inject(BlueprintService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly checks = signal<any[]>([]);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '检查名称', index: 'name', width: 200 },
    { title: '检查类型', index: 'type', width: 120 },
    { title: '状态', index: 'status', width: 100 },
    { title: '检查日期', index: 'check_date', type: 'date', width: 120 },
    { title: '检查人', index: 'checker', width: 120 },
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
      // TODO: 加载质量检查数据
      setTimeout(() => {
        this.checks.set([]);
        this.loading.set(false);
      }, 500);
    }
  }

  createCheck(): void {
    // TODO: 导航到创建检查页面
    this.message.info('创建检查功能待实现');
  }

  viewDetail(id: string): void {
    this.router.navigate(['/quality/checks/detail', id]);
  }
}
