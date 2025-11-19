import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ActivityLogItem {
  readonly id: string;
  readonly action: string;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly userId: string;
  readonly userName: string;
  readonly timestamp: string;
  readonly details: string;
}

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'活动日志'"></page-header>

    <nz-card nzTitle="活动日志" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>操作类型</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterAction()"
              (ngModelChange)="filterAction.set($event)"
              nzPlaceHolder="全部操作"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="create" nzLabel="创建"></nz-option>
              <nz-option nzValue="update" nzLabel="更新"></nz-option>
              <nz-option nzValue="delete" nzLabel="删除"></nz-option>
              <nz-option nzValue="view" nzLabel="查看"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>资源类型</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterResourceType()"
              (ngModelChange)="filterResourceType.set($event)"
              nzPlaceHolder="全部资源"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="task" nzLabel="任务"></nz-option>
              <nz-option nzValue="issue" nzLabel="问题"></nz-option>
              <nz-option nzValue="blueprint" nzLabel="蓝图"></nz-option>
              <nz-option nzValue="document" nzLabel="文档"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>时间范围</nz-form-label>
          <nz-form-control>
            <nz-range-picker [ngModel]="dateRange()" (ngModelChange)="dateRange.set($event)" style="width: 300px;"></nz-range-picker>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 活动日志列表 -->
      <st
        #st
        [data]="filteredLogs()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #action let-record>
          @switch (record.action) {
            @case ('create') {
              <nz-tag nzColor="green">创建</nz-tag>
            }
            @case ('update') {
              <nz-tag nzColor="blue">更新</nz-tag>
            }
            @case ('delete') {
              <nz-tag nzColor="red">删除</nz-tag>
            }
            @case ('view') {
              <nz-tag nzColor="default">查看</nz-tag>
            }
            @default {
              <nz-tag>{{ record.action }}</nz-tag>
            }
          }
        </ng-template>

        <ng-template #resourceType let-record>
          @switch (record.resourceType) {
            @case ('task') {
              <nz-tag nzColor="blue">任务</nz-tag>
            }
            @case ('issue') {
              <nz-tag nzColor="orange">问题</nz-tag>
            }
            @case ('blueprint') {
              <nz-tag nzColor="purple">蓝图</nz-tag>
            }
            @case ('document') {
              <nz-tag nzColor="green">文档</nz-tag>
            }
            @default {
              <nz-tag>{{ record.resourceType }}</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class ActivityLogComponent implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterAction = signal<string | null>(null);
  filterResourceType = signal<string | null>(null);
  dateRange = signal<[Date, Date] | null>(null);
  logs = signal<ActivityLogItem[]>([]);

  // Computed filtered logs
  filteredLogs = computed(() => {
    let result = this.logs();

    if (this.filterAction()) {
      result = result.filter(item => item.action === this.filterAction());
    }

    if (this.filterResourceType()) {
      result = result.filter(item => item.resourceType === this.filterResourceType());
    }

    if (this.dateRange()) {
      const [start, end] = this.dateRange()!;
      result = result.filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= start && itemDate <= end;
      });
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '操作', index: 'action', width: 100, render: 'action' },
    { title: '资源类型', index: 'resourceType', width: 120, render: 'resourceType' },
    { title: '资源ID', index: 'resourceId', width: 150 },
    { title: '操作人', index: 'userName', width: 120 },
    { title: '时间', index: 'timestamp', type: 'date', width: 180 },
    { title: '详情', index: 'details', width: 300 },
    {
      title: '操作',
      width: 100,
      buttons: [
        {
          text: '查看',
          click: (record: ActivityLogItem) => this.viewDetail(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    // TODO: 加载活动日志
    // 暂时使用空数组，实际开发时连接真实数据
    this.logs.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  viewDetail(id: string): void {
    // TODO: 实现查看详情逻辑
    this.message.info('查看详情功能开发中');
  }
}
