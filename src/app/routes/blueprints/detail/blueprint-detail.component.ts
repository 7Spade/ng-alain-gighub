import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlueprintStatus } from '@core';
import {
  AccountService,
  AccountType,
  AnalyticsService,
  BlueprintService,
  Issue,
  IssueService,
  SHARED_IMPORTS,
  Task,
  TaskService,
  TaskStatus
} from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface Metric {
  readonly label: string;
  readonly value: string;
  readonly trend: string;
  readonly color: string;
}

interface DeliveryStage {
  readonly name: string;
  readonly owner: string;
  readonly status: 'wait' | 'process' | 'finish' | 'error';
  readonly updatedAt: string;
}

interface RiskItem {
  readonly title: string;
  readonly detail: string;
  readonly owner: string;
  readonly level: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-blueprint-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="blueprint() ? blueprint()!.name : '蓝图详情'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
        @if (blueprint()) {
          <button nz-button nzType="default" (click)="syncConfig()" style="margin-right: 8px;">
            <span nz-icon nzType="sync"></span>
            同步配置
          </button>
          <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
            <span nz-icon nzType="edit"></span>
            编辑
          </button>
          <button nz-button (click)="manageBranches()" style="margin-right: 8px;">
            <span nz-icon nzType="git-branch"></span>
            分支管理
          </button>
          <button nz-button nzDanger (click)="delete()">
            <span nz-icon nzType="delete"></span>
            删除
          </button>
        }
      </ng-template>
    </page-header>

    @if (blueprintService.loading() || loadingMetrics()) {
      <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
        <ng-template #indicator>
          <span nz-icon nzType="loading" style="font-size: 24px;"></span>
        </ng-template>
      </nz-spin>
    } @else if (blueprintService.error()) {
      <nz-alert
        nzType="error"
        [nzMessage]="'加载失败'"
        [nzDescription]="blueprintService.error()"
        nzShowIcon
        style="margin: 16px;"
      ></nz-alert>
    } @else if (blueprint()) {
      <div class="page-section">
        <!-- 指标卡片 -->
        <nz-row [nzGutter]="16">
          @for (metric of overviewMetrics(); track metric.label) {
            <nz-col nzXs="24" nzSm="12" nzXl="6">
              <nz-card nzSize="small" class="metric-card" [nzBodyStyle]="{ padding: '12px 16px' }">
                <div class="metric-label">{{ metric.label }}</div>
                <div class="metric-value" [style.color]="metric.color">{{ metric.value }}</div>
                <div class="metric-trend">{{ metric.trend }}</div>
              </nz-card>
            </nz-col>
          }
        </nz-row>

        <!-- 蓝图基本信息 -->
        <nz-card nzTitle="基本信息" class="section-card">
          <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
            <nz-descriptions-item nzTitle="ID">{{ blueprint()!.id }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="项目名称">{{ blueprint()!.name }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="项目代码">{{ blueprint()!.project_code || '-' }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="拥有者">
              @if (ownerAccount()) {
                <span>
                  @switch (ownerAccount()!.type) {
                    @case (AccountType.USER) {
                      <span nz-icon nzType="user" style="margin-right: 4px;"></span>
                      {{ ownerAccount()!.name }}
                      <nz-tag nzColor="blue" style="margin-left: 8px;">个人</nz-tag>
                    }
                    @case (AccountType.ORGANIZATION) {
                      <span nz-icon nzType="team" style="margin-right: 4px;"></span>
                      {{ ownerAccount()!.name }}
                      <nz-tag nzColor="green" style="margin-left: 8px;">组织</nz-tag>
                    }
                    @default {
                      {{ ownerAccount()!.name }}
                    }
                  }
                  <button nz-button nzType="link" nzSize="small" style="margin-left: 8px;" (click)="viewOwnerAccount()"> 查看详情 </button>
                </span>
              } @else {
                <span style="color: #999;">{{ blueprint()!.owner_id }}</span>
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="状态">
              @switch (blueprint()!.status) {
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
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="开始日期">
              {{ blueprint()!.start_date ? (blueprint()!.start_date | date: 'yyyy-MM-dd') : '-' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="结束日期">
              {{ blueprint()!.end_date ? (blueprint()!.end_date | date: 'yyyy-MM-dd') : '-' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="创建时间">
              {{ blueprint()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="更新时间">
              {{ blueprint()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
          </nz-descriptions>
        </nz-card>

        <!-- 交付階段視圖 -->
        @if (deliveryStages().length > 0) {
          <nz-card nzTitle="交付階段視圖" class="section-card">
            <nz-steps nzDirection="vertical">
              @for (stage of deliveryStages(); track stage.name) {
                <nz-step [nzTitle]="stage.name" [nzStatus]="stage.status">
                  <ng-template #nzDescription>
                    <div class="stage-owner">
                      Owner：{{ stage.owner }}
                      <nz-tag nzColor="purple">{{ stage.updatedAt }}</nz-tag>
                    </div>
                  </ng-template>
                </nz-step>
              }
            </nz-steps>
          </nz-card>
        }

        <!-- 風險與依賴 -->
        @if (riskList().length > 0) {
          <nz-card nzTitle="風險與依賴" class="section-card">
            <nz-list [nzDataSource]="riskList()" nzItemLayout="horizontal">
              <ng-template #renderItem let-item>
                <nz-list-item>
                  <nz-list-item-meta [nzTitle]="item.title" [nzDescription]="item.detail + ' · 負責人：' + item.owner"></nz-list-item-meta>
                  <nz-tag [nzColor]="item.level === 'high' ? 'red' : item.level === 'medium' ? 'orange' : 'green'">
                    {{ item.level | uppercase }}
                  </nz-tag>
                </nz-list-item>
              </ng-template>
            </nz-list>
          </nz-card>
        }

        <!-- 蓝图配置 -->
        @if (blueprintService.configs().length > 0) {
          <nz-card nzTitle="配置信息" class="section-card">
            <nz-descriptions nzBordered [nzColumn]="{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }">
              @for (config of blueprintService.configs(); track config.id) {
                <nz-descriptions-item [nzTitle]="config.config_key">
                  {{ config.config_value | json }}
                </nz-descriptions-item>
              }
            </nz-descriptions>
          </nz-card>
        }
      </div>
    } @else {
      <nz-empty nzNotFoundContent="蓝图不存在"></nz-empty>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page-section {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .metric-card {
        min-height: 110px;
      }

      .metric-label {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.65);
      }

      .metric-value {
        font-size: 26px;
        font-weight: 600;
        margin: 6px 0;
      }

      .metric-trend {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }

      .section-card {
        margin-bottom: 0;
      }

      .stage-owner {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlueprintDetailComponent implements OnInit {
  blueprintService = inject(BlueprintService);
  accountService = inject(AccountService);
  taskService = inject(TaskService);
  issueService = inject(IssueService);
  analyticsService = inject(AnalyticsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  // 使用 computed 从 Service 获取蓝图信息
  blueprint = computed(() => this.blueprintService.selectedBlueprint());

  // 拥有者账户信息
  ownerAccount = computed(() => {
    const blueprint = this.blueprint();
    if (!blueprint) return null;
    return this.accountService.accounts().find(a => a.id === blueprint.owner_id);
  });

  // 状态管理
  private loadingMetricsState = signal<boolean>(false);
  private tasksState = signal<Task[]>([]);
  private issuesState = signal<Issue[]>([]);
  private activityLogsState = signal<any[]>([]);

  readonly loadingMetrics = this.loadingMetricsState.asReadonly();
  readonly tasks = this.tasksState.asReadonly();
  readonly issues = this.issuesState.asReadonly();
  readonly activityLogs = this.activityLogsState.asReadonly();

  // 导出枚举供模板使用
  BlueprintStatus = BlueprintStatus;
  AccountType = AccountType;

  // 计算指标
  readonly overviewMetrics = computed<Metric[]>(() => {
    const blueprint = this.blueprint();
    if (!blueprint) return [];

    const tasks = this.tasks();
    const issues = this.issues();
    const activityLogs = this.activityLogs();

    // 模組數：统计任务类型为 phase 或 milestone 的数量
    const moduleCount = tasks.filter(t => t.task_type === 'phase' || t.task_type === 'milestone').length;
    const newModules = tasks.filter(t => (t.task_type === 'phase' || t.task_type === 'milestone') && this.isRecent(t.created_at, 7)).length;

    // 活躍任務：进行中、暂存中、品管中的任务
    const activeTasks = tasks.filter(
      t => t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.STAGING || t.status === TaskStatus.IN_QA
    ).length;
    const inProgressCount = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
    const inQaCount = tasks.filter(t => t.status === TaskStatus.IN_QA).length;

    // 阻塞項：高优先级或紧急的问题
    const blockedItems = issues.filter(
      i => (i.severity === 'high' || i.severity === 'critical') && i.status !== 'resolved' && i.status !== 'closed'
    ).length;

    // 熱度指數：最近24小时的活动日志数量
    const recent24hLogs = activityLogs.filter(log => this.isRecent(log.createdAt, 1)).length;
    const heatIndex = Math.min(100, Math.round((recent24hLogs / 10) * 100));

    return [
      {
        label: '模組數',
        value: moduleCount.toString(),
        trend: newModules > 0 ? `新增 ${newModules} 個子模組` : '無新增',
        color: '#1890ff'
      },
      {
        label: '活躍任務',
        value: activeTasks.toString(),
        trend: `進行中 ${inProgressCount} · 待審核 ${inQaCount}`,
        color: '#52c41a'
      },
      {
        label: '阻塞項',
        value: blockedItems.toString(),
        trend: blockedItems > 0 ? '需跨組協作處理' : '無阻塞項',
        color: '#fa8c16'
      },
      {
        label: '熱度指數',
        value: `${heatIndex}%`,
        trend: '最近 24h 互動',
        color: '#722ed1'
      }
    ];
  });

  // 计算交付阶段
  readonly deliveryStages = computed<DeliveryStage[]>(() => {
    const blueprint = this.blueprint();
    if (!blueprint) return [];

    const tasks = this.tasks();
    const ownerAccount = this.ownerAccount();
    const ownerName = ownerAccount?.name || '系統';

    // 根据蓝图状态和任务状态计算交付阶段
    const stages: DeliveryStage[] = [];

    // 藍圖草稿
    if (blueprint.status === 'planning') {
      stages.push({
        name: '藍圖草稿',
        owner: ownerName,
        status: 'finish',
        updatedAt: this.formatTime(blueprint.created_at)
      });
    } else {
      stages.push({
        name: '藍圖草稿',
        owner: ownerName,
        status: 'finish',
        updatedAt: this.formatTime(blueprint.created_at)
      });
    }

    // 主分支同步
    const hasActiveTasks = tasks.some(t => t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.STAGING);
    stages.push({
      name: '主分支同步',
      owner: 'Branch Bot',
      status: hasActiveTasks ? 'process' : 'wait',
      updatedAt: hasActiveTasks ? this.formatTime(blueprint.updated_at) : '待排程'
    });

    // 審核與驗證
    const hasQaTasks = tasks.some(t => t.status === TaskStatus.IN_QA || t.status === TaskStatus.IN_INSPECTION);
    stages.push({
      name: '審核與驗證',
      owner: 'Reviewer Team',
      status: hasQaTasks ? 'process' : 'wait',
      updatedAt: hasQaTasks ? '進行中' : '待排程'
    });

    // 部署與驗證
    const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const totalCount = tasks.length;
    const isCompleted = blueprint.status === 'completed' || (totalCount > 0 && completedCount === totalCount);
    stages.push({
      name: '部署與驗證',
      owner: 'Infra',
      status: isCompleted ? 'finish' : 'wait',
      updatedAt: isCompleted ? this.formatTime(blueprint.updated_at) : '等待觸發'
    });

    return stages;
  });

  // 计算风险列表
  readonly riskList = computed<RiskItem[]>(() => {
    const issues = this.issues();
    const tasks = this.tasks();

    const risks: RiskItem[] = [];

    // 从问题中提取高风险项
    const highRiskIssues = issues.filter(
      i => (i.severity === 'high' || i.severity === 'critical') && i.status !== 'resolved' && i.status !== 'closed'
    );

    for (const issue of highRiskIssues) {
      // Issue 模型中没有 assigned_to 字段，使用 reported_by 或默认值
      const owner = issue.reported_by ? this.getAccountName(issue.reported_by) : '未指派';
      risks.push({
        title: issue.title || '未命名問題',
        detail: issue.description || '無詳細描述',
        owner: owner,
        level: issue.severity === 'critical' ? 'high' : issue.severity === 'high' ? 'medium' : 'low'
      });
    }

    // 检查阻塞任务
    const blockedTasks = tasks.filter(t => {
      // 检查是否有依赖未完成
      return t.status === TaskStatus.PENDING && this.isTaskBlocked(t, tasks);
    });

    if (blockedTasks.length > 0) {
      risks.push({
        title: '任務阻塞',
        detail: `有 ${blockedTasks.length} 個任務因依賴未完成而阻塞`,
        owner: 'Task System',
        level: blockedTasks.length > 5 ? 'high' : 'medium'
      });
    }

    return risks;
  });

  ngOnInit(): void {
    const blueprintId = this.route.snapshot.paramMap.get('id');
    if (blueprintId) {
      this.loadBlueprint(blueprintId);
    }
  }

  async loadBlueprint(id: string): Promise<void> {
    try {
      const blueprint = await this.blueprintService.loadBlueprintById(id);
      if (!blueprint) {
        this.message.warning('蓝图不存在');
        this.goBack();
        return;
      }
      // 加载拥有者账户信息
      await this.loadOwnerAccount(blueprint.owner_id);
      // 加载相关数据
      await this.loadMetricsData(id);
    } catch (error) {
      this.message.error('加载蓝图详情失败');
    }
  }

  async loadOwnerAccount(ownerId: string): Promise<void> {
    try {
      await this.accountService.loadAccountById(ownerId);
    } catch (error) {
      // 静默失败，不影响主流程
      console.error('加载拥有者账户信息失败:', error);
    }
  }

  async loadMetricsData(blueprintId: string): Promise<void> {
    this.loadingMetricsState.set(true);
    try {
      // 并行加载任务、问题和活动日志
      await Promise.all([
        this.loadTasks(blueprintId).catch(err => console.error('加载任务失败:', err)),
        this.loadIssues(blueprintId).catch(err => console.error('加载问题失败:', err)),
        this.loadActivityLogs(blueprintId).catch(err => console.error('加载活动日志失败:', err))
      ]);
    } finally {
      this.loadingMetricsState.set(false);
    }
  }

  async loadTasks(blueprintId: string): Promise<void> {
    try {
      await this.taskService.loadTasksByBlueprint(blueprintId);
      this.tasksState.set(this.taskService.tasks());
    } catch (error) {
      console.error('加载任务失败:', error);
    }
  }

  async loadIssues(blueprintId: string): Promise<void> {
    try {
      await this.issueService.loadIssuesByBlueprint(blueprintId);
      this.issuesState.set(this.issueService.issues());
    } catch (error) {
      console.error('加载问题失败:', error);
    }
  }

  async loadActivityLogs(blueprintId: string): Promise<void> {
    try {
      const logs = await this.analyticsService.getActivityLogs({ blueprintId }, 100);
      this.activityLogsState.set(logs);
    } catch (error) {
      console.error('加载活动日志失败:', error);
    }
  }

  viewOwnerAccount(): void {
    const account = this.ownerAccount();
    if (account) {
      this.router.navigate(['/accounts', account.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/blueprints/list']);
  }

  edit(): void {
    if (this.blueprint()) {
      this.router.navigate(['/blueprints', this.blueprint()!.id, 'edit']);
    }
  }

  manageBranches(): void {
    if (this.blueprint()) {
      this.router.navigate(['/blueprints', this.blueprint()!.id, 'branches']);
    }
  }

  syncConfig(): void {
    const blueprint = this.blueprint();
    if (blueprint) {
      this.message.info('同步配置功能开发中');
      // TODO: 实现同步配置功能
    }
  }

  async delete(): Promise<void> {
    if (!this.blueprint()) {
      return;
    }

    if (confirm('确定要删除此蓝图吗？此操作不可恢复。')) {
      try {
        await this.blueprintService.deleteBlueprint(this.blueprint()!.id);
        this.message.success('删除成功');
        this.goBack();
      } catch (error) {
        this.message.error('删除失败');
      }
    }
  }

  // 工具方法
  private isRecent(dateString: string | null | undefined, days: number): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }

  private formatTime(dateString: string | null | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private getAccountName(accountId: string): string {
    const account = this.accountService.accounts().find(a => a.id === accountId);
    return account?.name || accountId;
  }

  private isTaskBlocked(task: Task, allTasks: Task[]): boolean {
    // 简化版本：检查任务是否有未完成的依赖
    // TODO: 实现完整的依赖检查逻辑
    return false;
  }
}
