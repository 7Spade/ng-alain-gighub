import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'任务列表'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createTask()">
          <span nz-icon nzType="plus"></span>
          新建任务
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="任务树形视图" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="任务管理功能开发中"
        nzDescription="此页面将用于显示和管理所有任务。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class TaskListComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  ngOnInit(): void {
    // TODO: 加载任务列表
  }

  createTask(): void {
    this.router.navigate(['/tasks/create']);
  }
}
