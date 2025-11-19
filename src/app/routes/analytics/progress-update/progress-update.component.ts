import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ProgressUpdateItem {
  readonly id: string;
  readonly blueprintId: string;
  readonly blueprintName: string;
  readonly progress: number;
  readonly milestone: string;
  readonly updatedAt: string;
  readonly updatedBy: string;
}

@Component({
  selector: 'app-progress-update',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'进度更新'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="showUpdateForm = true">
          <span nz-icon nzType="plus"></span>
          更新进度
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="进度更新记录" style="margin-top: 16px;">
      <!-- 更新表单 -->
      @if (showUpdateForm) {
        <nz-card nzTitle="更新进度" [nzBordered]="true" style="margin-bottom: 16px;">
          <form nz-form [formGroup]="updateForm" nzLayout="vertical">
            <nz-form-item>
              <nz-form-label nzRequired>蓝图</nz-form-label>
              <nz-form-control [nzErrorTip]="'请选择蓝图'">
                <nz-select formControlName="blueprintId" nzPlaceHolder="请选择蓝图">
                  <!-- TODO: 加载蓝图列表 -->
                </nz-select>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>进度百分比</nz-form-label>
              <nz-form-control [nzErrorTip]="'请输入进度百分比'">
                <nz-slider formControlName="progress" [nzMin]="0" [nzMax]="100" [nzStep]="1"></nz-slider>
                <div style="margin-top: 8px;">{{ updateForm.get('progress')?.value || 0 }}%</div>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label>里程碑</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="milestone" placeholder="请输入里程碑描述（可选）" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-control>
                <button nz-button nzType="primary" (click)="submitUpdate()" [nzLoading]="submitting()" style="margin-right: 8px;">
                  提交
                </button>
                <button nz-button (click)="showUpdateForm = false">取消</button>
              </nz-form-control>
            </nz-form-item>
          </form>
        </nz-card>
      }

      <!-- 更新记录列表 -->
      <st
        #st
        [data]="updates()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #progress let-record>
          <nz-progress [nzPercent]="record.progress" [nzShowInfo]="true"></nz-progress>
        </ng-template>
      </st>
    </nz-card>
  `
})
export class ProgressUpdateComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);
  fb = inject(FormBuilder);

  // Component signals
  loading = signal(false);
  submitting = signal(false);
  showUpdateForm = false;
  updates = signal<ProgressUpdateItem[]>([]);

  updateForm: FormGroup = this.fb.group({
    blueprintId: ['', [Validators.required]],
    progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    milestone: ['']
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '蓝图', index: 'blueprintName', width: 200 },
    { title: '进度', index: 'progress', width: 200, render: 'progress' },
    { title: '里程碑', index: 'milestone', width: 300 },
    { title: '更新人', index: 'updatedBy', width: 120 },
    { title: '更新时间', index: 'updatedAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '查看',
          click: (record: ProgressUpdateItem) => this.viewDetail(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadUpdates();
  }

  loadUpdates(): void {
    // TODO: 加载更新记录
    // 暂时使用空数组，实际开发时连接真实数据
    this.updates.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  submitUpdate(): void {
    if (this.updateForm.invalid) {
      Object.values(this.updateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('请填写完整的表单信息');
      return;
    }

    this.submitting.set(true);
    // TODO: 实现提交逻辑
    setTimeout(() => {
      this.submitting.set(false);
      this.message.success('进度更新成功');
      this.showUpdateForm = false;
      this.updateForm.reset();
      this.loadUpdates();
    }, 1000);
  }

  viewDetail(id: string): void {
    // TODO: 实现查看详情逻辑
    this.message.info('查看详情功能开发中');
  }
}
