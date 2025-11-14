import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'任务详情'">
      <ng-template #extra>
        <button nz-button (click)="edit()">编辑</button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="任务详细信息" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="任务详情功能开发中"
        nzDescription="此页面将用于显示任务的详细信息。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class TaskDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  taskId = '';

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.taskId) {
      this.message.error('任务ID不存在');
      this.router.navigate(['/tasks']);
    }
  }

  edit(): void {
    this.router.navigate(['/tasks', this.taskId, 'edit']);
  }
}

