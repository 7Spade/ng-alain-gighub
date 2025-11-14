import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { BlueprintService, Blueprint } from '@shared';
import { BlueprintStatus } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-blueprint-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'蓝图管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createBlueprint()">
          <span nz-icon nzType="plus"></span>
          新建蓝图
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="管理系统中的所有蓝图" style="margin-top: 16px;">
      <st
        #st
        [data]="blueprintService.blueprints()"
        [columns]="columns"
        [loading]="blueprintService.loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #status let-record>
          @switch (record.status) {
            @case ('planning') {
              <nz-tag nzColor="default">规划中</nz-tag>
            }
            @case ('active') {
              <nz-tag nzColor="success">进行中</nz-tag>
            }
            @case ('on_hold') {
              <nz-tag nzColor="warning">暂停</nz-tag>
            }
            @case ('completed') {
              <nz-tag nzColor="blue">已完成</nz-tag>
            }
            @case ('archived') {
              <nz-tag nzColor="default">已归档</nz-tag>
            }
            @default {
              <nz-tag>未知</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class BlueprintListComponent implements OnInit {
  blueprintService = inject(BlueprintService);
  router = inject(Router);
  message = inject(NzMessageService);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '项目名称', index: 'name', width: 200 },
    { title: '项目代码', index: 'project_code', width: 150 },
    { title: '拥有者', index: 'owner_id', width: 150 },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '开始日期', index: 'start_date', type: 'date', width: 120 },
    { title: '结束日期', index: 'end_date', type: 'date', width: 120 },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 250,
      buttons: [
        {
          text: '查看',
          click: (record: Blueprint) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: Blueprint) => this.edit(record.id)
        },
        {
          text: '分支管理',
          click: (record: Blueprint) => this.manageBranches(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: {
            title: '确定要删除这个蓝图吗？',
            okType: 'danger'
          },
          click: (record: Blueprint) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      await this.blueprintService.loadBlueprints();
    } catch (error) {
      this.message.error('加载蓝图列表失败');
    }
  }

  onTableChange(): void {
    // 表格变化处理
  }

  createBlueprint(): void {
    this.router.navigate(['/blueprints/create']);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/blueprints', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/blueprints', id, 'edit']);
  }

  manageBranches(id: string): void {
    this.router.navigate(['/blueprints', id, 'branches']);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.blueprintService.deleteBlueprint(id);
      this.message.success('删除成功');
      await this.loadData();
    } catch (error) {
      this.message.error('删除失败');
    }
  }
}

