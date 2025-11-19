import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface WeatherRecordItem {
  readonly id: string;
  readonly date: string;
  readonly location: string;
  readonly temperature: number;
  readonly weather: string;
  readonly humidity: number;
  readonly windSpeed: number;
  readonly createdAt: string;
}

@Component({
  selector: 'app-task-weather',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'天气记录'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createRecord()">
          <span nz-icon nzType="plus"></span>
          新建记录
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="天气记录管理" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>地点</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterLocation()"
              (ngModelChange)="filterLocation.set($event)"
              nzPlaceHolder="全部地点"
              nzAllowClear
              style="width: 200px;"
            >
              @for (location of locations(); track location) {
                <nz-option [nzValue]="location" [nzLabel]="location"></nz-option>
              }
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

      <!-- 天气记录列表表格 -->
      <st
        #st
        [data]="filteredRecords()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #weather let-record>
          <nz-tag>{{ record.weather }}</nz-tag>
        </ng-template>
      </st>
    </nz-card>
  `
})
export class TaskWeatherComponent implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterLocation = signal<string | null>(null);
  dateRange = signal<[Date, Date] | null>(null);
  records = signal<WeatherRecordItem[]>([]);
  locations = signal<string[]>([]);

  // Computed filtered records
  filteredRecords = computed(() => {
    let result = this.records();

    if (this.filterLocation()) {
      result = result.filter(item => item.location === this.filterLocation());
    }

    if (this.dateRange()) {
      const [start, end] = this.dateRange()!;
      result = result.filter(item => {
        const date = new Date(item.date);
        return date >= start && date <= end;
      });
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '日期', index: 'date', type: 'date', width: 120 },
    { title: '地点', index: 'location', width: 150 },
    { title: '温度', index: 'temperature', width: 100, format: (item: WeatherRecordItem) => `${item.temperature}°C` },
    { title: '天气', index: 'weather', width: 100, render: 'weather' },
    { title: '湿度', index: 'humidity', width: 100, format: (item: WeatherRecordItem) => `${item.humidity}%` },
    { title: '风速', index: 'windSpeed', width: 100, format: (item: WeatherRecordItem) => `${item.windSpeed} km/h` },
    { title: '创建时间', index: 'createdAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: WeatherRecordItem) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: WeatherRecordItem) => this.edit(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: WeatherRecordItem) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    // TODO: 加载天气记录数据
    // 暂时使用空数组，实际开发时连接真实数据
    this.records.set([]);
    this.locations.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  createRecord(): void {
    // TODO: 创建新记录
    this.message.info('创建记录功能开发中');
  }

  viewDetail(id: string): void {
    // TODO: 查看详情
    this.message.info('查看详情功能开发中');
  }

  edit(id: string): void {
    // TODO: 编辑记录
    this.message.info('编辑功能开发中');
  }

  delete(id: string): void {
    // TODO: 删除记录
    this.message.info('删除功能开发中');
  }
}
