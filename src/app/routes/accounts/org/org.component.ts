import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceContextFacade } from '@core';
import { STColumn } from '@delon/abc/st';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SHARED_IMPORTS, TeamService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 组织管理组件
 *
 * 职责：根据上下文显示不同的组织视图
 * - User 视角：显示我的组织、我加入的组织
 * - Organization 视角：显示当前组织的详细信息
 * - Team 视角：显示当前团队所属的组织信息
 *
 * 遵循 SRP 原则：
 * - Component 只处理 UI 展示和用户交互
 * - 业务逻辑由 Facade/Service 处理
 * - 数据访问由 Repository 层处理
 */
@Component({
  selector: 'app-org',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="pageTitle()" />

    @switch (contextType()) {
      @case ('user') {
        <!-- 用户视角：我的组织、我加入的组织 -->
        <div style="display: flex; gap: 16px; flex-direction: column;">
          <!-- 我的组织 -->
          <nz-card [nzBordered]="false">
            <div class="flex justify-between mb-md">
              <div>
                <h2>我的組織</h2>
                <p class="text-muted">我創建或擁有的組織</p>
              </div>
              <button nz-button nzType="primary" (click)="createOrganization()">
                <span nz-icon nzType="plus"></span>
                建立組織
              </button>
            </div>

            @if (loadingOrganizations()) {
              <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
            } @else if (error()) {
              <nz-alert nzType="error" [nzMessage]="'載入失敗'" [nzDescription]="error()" nzShowIcon style="margin: 16px;"></nz-alert>
            } @else if (createdOrganizations().length === 0) {
              <nz-empty nzNotFoundContent="尚無組織">
                <button nz-button nzType="primary" (click)="createOrganization()">建立第一個組織</button>
              </nz-empty>
            } @else {
              <st
                #stCreated
                [columns]="columns"
                [data]="createdOrganizations()"
                [loading]="loadingOrganizations()"
                [page]="{ front: false, show: true, showSize: true }"
                (change)="stChange($event)"
              >
                <ng-template st-row="status" let-record>
                  @switch (record.status) {
                    @case ('active') {
                      <nz-tag nzColor="success">活躍</nz-tag>
                    }
                    @case ('inactive') {
                      <nz-tag nzColor="default">非活躍</nz-tag>
                    }
                    @case ('suspended') {
                      <nz-tag nzColor="error">已暫停</nz-tag>
                    }
                  }
                </ng-template>
                <ng-template st-row="action" let-record>
                  <button nz-button nzType="link" nzSize="small" (click)="viewOrganization(record.id)">查看</button>
                  <button nz-button nzType="link" nzSize="small" (click)="manageMembers(record.id)">成員管理</button>
                  <button nz-button nzType="link" nzSize="small" (click)="manageRoles(record.id)">角色管理</button>
                  <button nz-button nzType="link" nzSize="small" (click)="manageTeams(record.id)">團隊管理</button>
                </ng-template>
              </st>
            }
          </nz-card>

          <!-- 我加入的组织 -->
          <nz-card [nzBordered]="false">
            <div class="flex justify-between mb-md">
              <div>
                <h2>我加入的組織</h2>
                <p class="text-muted">我作為成員加入的組織</p>
              </div>
            </div>

            @if (loadingOrganizations()) {
              <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
            } @else if (error()) {
              <nz-alert nzType="error" [nzMessage]="'載入失敗'" [nzDescription]="error()" nzShowIcon style="margin: 16px;"></nz-alert>
            } @else if (joinedOrganizations().length === 0) {
              <nz-empty nzNotFoundContent="尚無加入的組織"></nz-empty>
            } @else {
              <st
                #stJoined
                [columns]="columns"
                [data]="joinedOrganizations()"
                [loading]="loadingOrganizations()"
                [page]="{ front: false, show: true, showSize: true }"
                (change)="stChange($event)"
              >
                <ng-template st-row="status" let-record>
                  @switch (record.status) {
                    @case ('active') {
                      <nz-tag nzColor="success">活躍</nz-tag>
                    }
                    @case ('inactive') {
                      <nz-tag nzColor="default">非活躍</nz-tag>
                    }
                    @case ('suspended') {
                      <nz-tag nzColor="error">已暫停</nz-tag>
                    }
                  }
                </ng-template>
                <ng-template st-row="action" let-record>
                  <button nz-button nzType="link" nzSize="small" (click)="viewOrganization(record.id)">查看</button>
                  <button nz-button nzType="link" nzSize="small" (click)="manageMembers(record.id)">成員管理</button>
                  <button nz-button nzType="link" nzSize="small" (click)="manageRoles(record.id)">角色管理</button>
                  <button nz-button nzType="link" nzSize="small" (click)="manageTeams(record.id)">團隊管理</button>
                </ng-template>
              </st>
            }
          </nz-card>
        </div>
      }
      @case ('organization') {
        <!-- 组织视角：当前组织详情 -->
        <div style="display: flex; gap: 16px; flex-direction: column;">
          <nz-card [nzBordered]="false">
            <div class="flex justify-between mb-md">
              <div>
                <h2>{{ organizationName() }}</h2>
                <p class="text-muted">組織詳情</p>
              </div>
            </div>
            <nz-alert
              nzType="info"
              nzMessage="組織視角"
              nzDescription="您正在查看組織詳情。完整功能請使用快速操作按鈕。"
              nzShowIcon
              style="margin-bottom: 16px;"
            ></nz-alert>
            <div class="flex gap-md">
              <button nz-button nzType="default" (click)="manageMembers(contextId()!)">
                <span nz-icon nzType="team"></span>
                成員管理
              </button>
              <button nz-button nzType="default" (click)="manageTeams(contextId()!)">
                <span nz-icon nzType="usergroup-add"></span>
                團隊管理
              </button>
              <button nz-button nzType="default" (click)="manageRoles(contextId()!)">
                <span nz-icon nzType="safety-certificate"></span>
                角色管理
              </button>
              <button nz-button nzType="default" (click)="manageSchedules(contextId()!)">
                <span nz-icon nzType="calendar"></span>
                排班管理
              </button>
            </div>
          </nz-card>
        </div>
      }
      @case ('team') {
        <!-- 团队视角：团队所属组织信息 -->
        <div style="display: flex; gap: 16px; flex-direction: column;">
          <nz-card [nzBordered]="false">
            <div class="flex justify-between mb-md">
              <div>
                <h2>{{ organizationName() }}</h2>
                <p class="text-muted">團隊所屬組織</p>
              </div>
              <button nz-button nzType="primary" (click)="switchToOrganization()">
                <span nz-icon nzType="swap"></span>
                切換到組織視角
              </button>
            </div>
            <nz-alert
              nzType="info"
              nzMessage="團隊視角"
              nzDescription="您正在查看團隊所屬的組織信息。點擊「切換到組織視角」以查看完整的組織管理功能。"
              nzShowIcon
            ></nz-alert>
          </nz-card>
        </div>
      }
      @default {
        <!-- 默认：用户视角 -->
        <div style="display: flex; gap: 16px; flex-direction: column;">
          <!-- 我的组织 -->
          <nz-card [nzBordered]="false">
            <div class="flex justify-between mb-md">
              <div>
                <h2>我的組織</h2>
                <p class="text-muted">我創建或擁有的組織</p>
              </div>
              <button nz-button nzType="primary" (click)="createOrganization()">
                <span nz-icon nzType="plus"></span>
                建立組織
              </button>
            </div>
            @if (loadingOrganizations()) {
              <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
            } @else if (createdOrganizations().length === 0) {
              <nz-empty nzNotFoundContent="尚無組織">
                <button nz-button nzType="primary" (click)="createOrganization()">建立第一個組織</button>
              </nz-empty>
            } @else {
              <st
                #stCreated
                [columns]="columns"
                [data]="createdOrganizations()"
                [loading]="loadingOrganizations()"
                [page]="{ front: false, show: true, showSize: true }"
                (change)="stChange($event)"
              >
                <ng-template st-row="status" let-record>
                  @switch (record.status) {
                    @case ('active') {
                      <nz-tag nzColor="success">活躍</nz-tag>
                    }
                    @case ('inactive') {
                      <nz-tag nzColor="default">非活躍</nz-tag>
                    }
                    @case ('suspended') {
                      <nz-tag nzColor="error">已暫停</nz-tag>
                    }
                  }
                </ng-template>
                <ng-template st-row="action" let-record>
                  <button nz-button nzType="link" nzSize="small" (click)="viewOrganization(record.id)">查看</button>
                  <button nz-button nzType="link" nzSize="small" (click)="manageMembers(record.id)">成員管理</button>
                  <button nz-button nzType="link" nzSize="small" (click)="manageRoles(record.id)">角色管理</button>
                  <button nz-button nzType="link" nzSize="small" (click)="manageTeams(record.id)">團隊管理</button>
                </ng-template>
              </st>
            }
          </nz-card>
        </div>
      }
    }
  `,
  styles: [
    `
      .flex {
        display: flex;
      }
      .justify-between {
        justify-content: space-between;
      }
      .mb-md {
        margin-bottom: 16px;
      }
      .text-muted {
        color: rgba(0, 0, 0, 0.45);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgComponent implements OnInit {
  private readonly contextFacade = inject(WorkspaceContextFacade);
  private readonly teamService = inject(TeamService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  // 从 WorkspaceContextFacade 获取状态
  readonly contextType = this.contextFacade.contextType;
  readonly contextId = this.contextFacade.contextId;
  readonly createdOrganizations = this.contextFacade.createdOrganizations;
  readonly joinedOrganizations = this.contextFacade.joinedOrganizations;
  readonly loadingOrganizations = this.contextFacade.loadingOrganizations;
  readonly error = this.contextFacade.error;

  // 计算页面标题
  readonly pageTitle = computed(() => {
    const type = this.contextType();
    switch (type) {
      case 'user':
        return '組織管理';
      case 'organization':
        return '組織詳情';
      case 'team':
        return '組織信息';
      default:
        return '組織管理';
    }
  });

  // 团队信息（用于团队视角）
  readonly team = computed(() => this.teamService.selectedTeam());
  readonly loadingTeam = this.teamService.loading;

  // 计算组织名称（用于组织视角和团队视角）
  readonly organizationName = computed(() => {
    const type = this.contextType();
    const id = this.contextId();

    if (type === 'organization' && id) {
      const org = this.allOrganizations().find(o => o.id === id);
      return org?.name || '組織';
    }

    if (type === 'team' && id) {
      // 从团队信息中获取组织 ID
      const team = this.team();
      if (team) {
        // BaseRepository 会将 snake_case 转换为 camelCase，所以应该是 organizationId
        const orgId = (team as any).organizationId || (team as any).organization_id;
        if (orgId) {
          const org = this.allOrganizations().find(o => o.id === orgId);
          return org?.name || '組織';
        }
      }
      return '組織';
    }

    return '';
  });

  // 获取所有组织（用于查找）
  readonly allOrganizations = this.contextFacade.allOrganizations;

  columns: STColumn[] = [
    { title: '組織名稱', index: 'name', width: 200 },
    { title: '郵箱', index: 'email', width: 200 },
    { title: '狀態', index: 'status', width: 120, render: 'status' },
    { title: '創建時間', index: 'created_at', type: 'date', width: 180 },
    { title: '操作', render: 'action', width: 300 }
  ];

  constructor() {
    // 监听上下文变化，如果是 user 视角且数据未加载，则触发加载
    effect(() => {
      const type = this.contextType();
      const authUserId = this.tokenService.get()?.['user']?.id;

      if (type === 'user' && authUserId) {
        // 如果数据未加载，触发加载
        if (this.createdOrganizations().length === 0 && this.joinedOrganizations().length === 0 && !this.loadingOrganizations()) {
          this.contextFacade.loadWorkspaceData(authUserId).catch(error => {
            console.error('載入組織列表失敗:', error);
          });
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const type = this.contextType();
    const authUserId = this.tokenService.get()?.['user']?.id;
    const id = this.contextId();

    if (type === 'user' && authUserId) {
      // 如果数据未加载，触发加载
      if (this.createdOrganizations().length === 0 && this.joinedOrganizations().length === 0 && !this.loadingOrganizations()) {
        await this.contextFacade.loadWorkspaceData(authUserId).catch(error => {
          console.error('載入組織列表失敗:', error);
        });
      }
    } else if (type === 'team' && id) {
      // 加载团队信息
      try {
        await this.teamService.loadTeamById(id);
      } catch (error) {
        console.error('載入團隊信息失敗:', error);
        this.message.error('載入團隊信息失敗');
      }
    }
  }

  /**
   * 创建组织
   */
  createOrganization(): void {
    this.router.navigate(['/accounts/create/organization']);
  }

  /**
   * 查看组织详情
   */
  viewOrganization(organizationId: string): void {
    this.router.navigate(['/accounts', organizationId]);
  }

  /**
   * 管理组织成员
   */
  manageMembers(organizationId: string): void {
    this.router.navigate(['/accounts/org', organizationId, 'members']);
  }

  /**
   * 管理组织角色
   */
  manageRoles(organizationId: string): void {
    this.router.navigate(['/accounts/org', organizationId, 'roles']);
  }

  /**
   * 管理组织团队
   */
  manageTeams(organizationId: string): void {
    this.router.navigate(['/accounts/org', organizationId, 'teams']);
  }

  /**
   * 管理组织排班
   */
  manageSchedules(organizationId: string): void {
    this.router.navigate(['/accounts/org', organizationId, 'schedules']);
  }

  /**
   * 切换到组织视角（从团队视角）
   */
  switchToOrganization(): void {
    const team = this.team();
    if (team) {
      // 从团队信息中获取组织 ID
      const orgId = (team as any).organizationId || (team as any).organization_id;
      if (orgId) {
        this.contextFacade.switchToOrganization(orgId);
      } else {
        this.message.warning('無法獲取組織 ID');
      }
    } else {
      this.message.warning('團隊信息未加載');
    }
  }

  /**
   * 处理表格变化事件
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stChange(_e: unknown): void {
    // 处理表格变化事件（分页、排序等）
  }
}
