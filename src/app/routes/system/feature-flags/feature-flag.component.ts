import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface FeatureFlagItem {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly rolloutPercentage: number;
  readonly targetUsers: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

@Component({
  selector: 'app-feature-flag',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'功能开关'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createFlag()">
          <span nz-icon nzType="plus"></span>
          创建功能开关
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="功能开关" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>状态</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterEnabled()"
              (ngModelChange)="filterEnabled.set($event)"
              nzPlaceHolder="全部状态"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option [nzValue]="true" nzLabel="已启用"></nz-option>
              <nz-option [nzValue]="false" nzLabel="已禁用"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 功能开关列表表格 -->
      <st
        #st
        [data]="filteredFlags()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #enabled let-record>
          <nz-switch
            [ngModel]="record.enabled"
            (ngModelChange)="toggleFlag(record.id, $event)"
            [nzCheckedChildren]="'启用'"
            [nzUnCheckedChildren]="'禁用'"
          ></nz-switch>
        </ng-template>

        <ng-template #rolloutPercentage let-record>
          <nz-progress [nzPercent]="record.rolloutPercentage" [nzShowInfo]="true"></nz-progress>
        </ng-template>
      </st>
    </nz-card>
  `
})
export class FeatureFlagComponent implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterEnabled = signal<boolean | null>(null);
  flags = signal<FeatureFlagItem[]>([]);

  // Computed filtered flags
  filteredFlags = computed(() => {
    let result = this.flags();

    if (this.filterEnabled() !== null) {
      result = result.filter(item => item.enabled === this.filterEnabled());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: 'Key', index: 'key', width: 200 },
    { title: '名称', index: 'name', width: 200 },
    { title: '描述', index: 'description', width: 300 },
    { title: '状态', index: 'enabled', width: 120, render: 'enabled' },
    { title: '灰度比例', index: 'rolloutPercentage', width: 150, render: 'rolloutPercentage' },
    { title: '目标用户', index: 'targetUsers', width: 200, format: (item: FeatureFlagItem) => item.targetUsers.length > 0 ? item.targetUsers.join(', ') : '全部用户' },
    { title: '创建时间', index: 'createdAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '编辑',
          click: (record: FeatureFlagItem) => this.edit(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: FeatureFlagItem) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadFlags();
  }

  loadFlags(): void {
    // TODO: 加载功能开关列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.flags.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  createFlag(): void {
    // TODO: 创建功能开关
    this.message.info('创建功能开关功能开发中');
  }

  toggleFlag(id: string, enabled: boolean): void {
    // TODO: 切换功能开关状态
    this.message.info(`切换功能开关状态功能开发中: ${enabled ? '启用' : '禁用'}`);
  }

  edit(id: string): void {
    // TODO: 编辑功能开关
    this.message.info('编辑功能开关功能开发中');
  }

  delete(id: string): void {
    // TODO: 删除功能开关
    this.message.info('删除功能开关功能开发中');
  }
}
