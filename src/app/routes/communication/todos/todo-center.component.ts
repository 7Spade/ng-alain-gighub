import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { PersonalTodoRepository, PersonalTodo } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-center',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'待办中心'"></page-header>

    <nz-card nzTitle="待办中心" style="margin-top: 16px;">
      <!-- Filter tabs -->
      <nz-tabset [(nzSelectedIndex)]="selectedTabIndex" (nzSelectedIndexChange)="onTabChange()">
        <nz-tab nzTitle="全部"></nz-tab>
        <nz-tab nzTitle="待处理"></nz-tab>
        <nz-tab nzTitle="进行中"></nz-tab>
        <nz-tab nzTitle="暂存"></nz-tab>
        <nz-tab nzTitle="质检中"></nz-tab>
        <nz-tab nzTitle="验收中"></nz-tab>
        <nz-tab nzTitle="已完成"></nz-tab>
      </nz-tabset>

      <st 
        #st
        [data]="todos()" 
        [columns]="columns"
        [loading]="loading()"
        [page]="{
          show: true,
          showSize: true,
          front: false
        }"
        [responsive]="true"
        [scroll]="{ x: '1400px' }"
        style="margin-top: 16px;"
      ></st>
    </nz-card>
  `
})
export class TodoCenterComponent implements OnInit {
  private todoRepo = inject(PersonalTodoRepository);
  private message = inject(NzMessageService);
  private router = inject(Router);

  // Signals for reactive state
  todos = signal<STData[]>([]);
  loading = signal(false);
  selectedTabIndex = 0;

  // ST Table columns configuration
  columns: STColumn[] = [
    { 
      title: '类型', 
      index: 'todo_type',
      width: 120,
      type: 'tag',
      tag: {
        'task': { text: '任务', color: 'blue' },
        'issue': { text: '问题', color: 'red' },
        'review_pr': { text: 'PR审查', color: 'purple' },
        'qa_check': { text: '质检', color: 'orange' },
        'inspection': { text: '验收', color: 'green' },
        'custom': { text: '自定义', color: 'default' }
      }
    },
    { 
      title: '标题', 
      index: 'title',
      width: 250,
      fixed: 'left'
    },
    { 
      title: '描述', 
      index: 'description',
      width: 300,
      format: (item: STData) => {
        const desc = item['description'] as string;
        return desc?.length > 100 ? desc.substring(0, 100) + '...' : desc || '-';
      }
    },
    { 
      title: '优先级', 
      index: 'priority',
      width: 100,
      type: 'badge',
      badge: {
        'low': { text: '低', color: 'default' },
        'medium': { text: '中', color: 'processing' },
        'high': { text: '高', color: 'warning' },
        'urgent': { text: '紧急', color: 'error' }
      }
    },
    { 
      title: '状态', 
      index: 'status',
      width: 120,
      type: 'badge',
      badge: {
        'pending': { text: '待处理', color: 'default' },
        'in_progress': { text: '进行中', color: 'processing' },
        'staging': { text: '暂存', color: 'warning' },
        'in_qa': { text: '质检中', color: 'cyan' },
        'in_inspection': { text: '验收中', color: 'blue' },
        'completed': { text: '已完成', color: 'success' },
        'cancelled': { text: '已取消', color: 'error' }
      }
    },
    { 
      title: '截止日期', 
      index: 'due_date',
      type: 'date',
      dateFormat: 'yyyy-MM-dd',
      width: 120
    },
    { 
      title: '创建时间', 
      index: 'created_at',
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm',
      width: 160
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      buttons: [
        {
          text: '查看',
          type: 'link',
          click: (item: STData) => this.viewTodo(item['id'] as string, item['related_type'] as string, item['related_id'] as string)
        },
        {
          text: '完成',
          type: 'link',
          iif: (item: STData) => item['status'] !== 'completed' && item['status'] !== 'cancelled',
          click: (item: STData) => this.completeTodo(item['id'] as string)
        },
        {
          text: '取消',
          type: 'del',
          pop: {
            title: '确认取消该待办？',
            okType: 'danger'
          },
          iif: (item: STData) => item['status'] !== 'completed' && item['status'] !== 'cancelled',
          click: (item: STData) => this.cancelTodo(item['id'] as string)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadTodos();
  }

  /**
   * 加载待办列表
   */
  loadTodos(statusFilter?: string): void {
    this.loading.set(true);
    
    const filters: Record<string, any> = {};
    if (statusFilter) {
      filters.status = statusFilter;
    }
    
    this.todoRepo.findAll({
      orderBy: 'created_at',
      orderDirection: 'desc',
      pageSize: 100,
      filters
    }).subscribe({
      next: (data) => {
        this.todos.set(data as STData[]);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('加载待办列表失败:', err);
        this.message.error('加载待办列表失败');
        this.loading.set(false);
      }
    });
  }

  /**
   * Tab change handler
   */
  onTabChange(): void {
    const statusMap: Record<number, string | undefined> = {
      0: undefined,  // All
      1: 'pending',
      2: 'in_progress',
      3: 'staging',
      4: 'in_qa',
      5: 'in_inspection',
      6: 'completed'
    };
    
    this.loadTodos(statusMap[this.selectedTabIndex]);
  }

  /**
   * 查看待办详情
   */
  viewTodo(id: string, relatedType: string | null, relatedId: string | null): void {
    if (relatedType && relatedId) {
      // Navigate to related entity
      const routeMap: Record<string, string> = {
        'Task': '/tasks',
        'Issue': '/issues',
        'PullRequest': '/pull-requests'
      };
      
      const baseRoute = routeMap[relatedType];
      if (baseRoute) {
        this.router.navigate([baseRoute, relatedId]);
      } else {
        this.message.info('待办详情待实现');
      }
    } else {
      this.message.info('待办详情待实现');
    }
  }

  /**
   * 完成待办
   */
  completeTodo(id: string): void {
    this.todoRepo.update(id, {
      status: 'completed',
      completed_at: new Date().toISOString()
    } as any).subscribe({
      next: () => {
        this.message.success('已标记为完成');
        this.loadTodos();
      },
      error: (err) => {
        console.error('更新待办失败:', err);
        this.message.error('更新待办失败');
      }
    });
  }

  /**
   * 取消待办
   */
  cancelTodo(id: string): void {
    this.todoRepo.update(id, {
      status: 'cancelled'
    } as any).subscribe({
      next: () => {
        this.message.success('已取消');
        this.loadTodos();
      },
      error: (err) => {
        console.error('取消待办失败:', err);
        this.message.error('取消待办失败');
      }
    });
  }
}
