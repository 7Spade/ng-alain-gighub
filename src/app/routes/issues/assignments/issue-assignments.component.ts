import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { IssueAssignmentRepository } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-issue-assignments',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'问题分配'"></page-header>

    <nz-card nzTitle="问题分配管理" style="margin-top: 16px;">
      <st 
        #st
        [data]="assignments()" 
        [columns]="columns"
        [loading]="loading()"
        [page]="{
          show: true,
          showSize: true,
          front: false
        }"
        [responsive]="true"
        [scroll]="{ x: '1200px' }"
      ></st>
    </nz-card>
  `
})
export class IssueAssignmentsComponent implements OnInit {
  private assignmentRepo = inject(IssueAssignmentRepository);
  private message = inject(NzMessageService);

  // Signals for reactive state
  assignments = signal<STData[]>([]);
  loading = signal(false);

  // ST Table columns configuration
  columns: STColumn[] = [
    { 
      title: '问题编号', 
      index: 'issue_number',
      width: 120,
      fixed: 'left'
    },
    { 
      title: '问题标题', 
      index: 'issue_title',
      width: 250
    },
    { 
      title: '受理人', 
      index: 'assignee_name',
      width: 120
    },
    { 
      title: '分配人', 
      index: 'assigned_by_name',
      width: 120
    },
    { 
      title: '分配备注', 
      index: 'assignment_note',
      width: 250,
      format: (item: STData) => {
        const note = item['assignment_note'] as string;
        return note || '-';
      }
    },
    { 
      title: '分配时间', 
      index: 'assigned_at',
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm',
      width: 160
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      buttons: [
        {
          text: '查看问题',
          type: 'link',
          click: (item: STData) => this.viewIssue(item['issue_id'] as string)
        },
        {
          text: '重新分配',
          type: 'link',
          click: (item: STData) => this.reassign(item['id'] as string)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadAssignments();
  }

  /**
   * 加载问题分配列表
   */
  loadAssignments(): void {
    this.loading.set(true);
    
    this.assignmentRepo.findAll({
      orderBy: 'assigned_at',
      orderDirection: 'desc',
      pageSize: 100
    }).subscribe({
      next: (data) => {
        this.assignments.set(data as STData[]);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('加载问题分配列表失败:', err);
        this.message.error('加载问题分配列表失败');
        this.loading.set(false);
      }
    });
  }

  /**
   * 查看问题详情
   */
  viewIssue(issueId: string): void {
    this.message.info('查看问题功能待实现');
  }

  /**
   * 重新分配问题
   */
  reassign(assignmentId: string): void {
    this.message.info('重新分配功能待实现');
  }
}
