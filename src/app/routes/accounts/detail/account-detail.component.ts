import { Component, OnInit, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS, AccountService, Account, AccountType, AccountStatus, TeamService, OrganizationScheduleService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'账户详情'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
        @if (account()) {
          <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
            <span nz-icon nzType="edit"></span>
            编辑
          </button>
          <button nz-button nzDanger (click)="delete()">
            <span nz-icon nzType="delete"></span>
            删除
          </button>
        }
      </ng-template>
    </page-header>

    @if (accountService.loading()) {
      <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
        <ng-template #indicator>
          <span nz-icon nzType="loading" style="font-size: 24px;"></span>
        </ng-template>
      </nz-spin>
    } @else if (accountService.error()) {
      <nz-alert
        nzType="error"
        [nzMessage]="'加载失败'"
        [nzDescription]="accountService.error()"
        nzShowIcon
        style="margin: 16px;"
      ></nz-alert>
    } @else if (account()) {
      <div style="padding: 16px;">
        <!-- 账户基本信息 -->
        <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
          <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
            <nz-descriptions-item nzTitle="ID">{{ account()!.id }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="名称">{{ account()!.name }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="邮箱">{{ account()!.email || '-' }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="类型">
              @switch (account()!.type) {
                @case ('User') {
                  <nz-tag nzColor="blue">用户</nz-tag>
                }
                @case ('Bot') {
                  <nz-tag nzColor="purple">机器人</nz-tag>
                }
                @case ('Organization') {
                  <nz-tag nzColor="green">组织</nz-tag>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="状态">
              @switch (account()!.status) {
                @case ('active') {
                  <nz-tag nzColor="success">活跃</nz-tag>
                }
                @case ('inactive') {
                  <nz-tag nzColor="default">非活跃</nz-tag>
                }
                @case ('suspended') {
                  <nz-tag nzColor="error">已暂停</nz-tag>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="创建时间">
              {{ account()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="更新时间">
              {{ account()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
          </nz-descriptions>
        </nz-card>

        <!-- 组织账户：显示团队信息 -->
        @if (account()!.type === AccountType.ORGANIZATION) {
          <nz-card nzTitle="团队信息" style="margin-bottom: 16px;">
            @if (teamService.loading()) {
              <nz-spin nzSimple></nz-spin>
            } @else if (teamService.teams().length > 0) {
              <nz-table [nzData]="teamService.teams()" [nzShowPagination]="false" [nzSize]="'small'">
                <thead>
                  <tr>
                    <th>团队名称</th>
                    <th>描述</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  @for (team of teamService.teams(); track team.id) {
                    <tr>
                      <td>{{ team.name }}</td>
                      <td>{{ team.description || '-' }}</td>
                      <td>{{ team.created_at | date: 'yyyy-MM-dd' }}</td>
                      <td>
                        <button nz-button nzType="link" nzSize="small" (click)="viewTeam(team.id)"> 查看 </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </nz-table>
            } @else {
              <nz-empty nzNotFoundContent="暂无团队"></nz-empty>
            }
          </nz-card>

          <!-- 组织账户：显示排班信息 -->
          <nz-card nzTitle="排班信息">
            @if (scheduleService.loading()) {
              <nz-spin nzSimple></nz-spin>
            } @else if (scheduleService.schedules().length > 0) {
              <nz-table [nzData]="scheduleService.schedules()" [nzShowPagination]="false" [nzSize]="'small'">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>账户</th>
                    <th>团队</th>
                    <th>备注</th>
                  </tr>
                </thead>
                <tbody>
                  @for (schedule of scheduleService.schedules(); track schedule.id) {
                    <tr>
                      <td>{{ schedule.schedule_date | date: 'yyyy-MM-dd' }}</td>
                      <td>{{ schedule.account_id || '-' }}</td>
                      <td>{{ schedule.team_id || '-' }}</td>
                      <td>{{ schedule.notes || '-' }}</td>
                    </tr>
                  }
                </tbody>
              </nz-table>
            } @else {
              <nz-empty nzNotFoundContent="暂无排班记录"></nz-empty>
            }
          </nz-card>
        }
      </div>
    } @else {
      <nz-empty nzNotFoundContent="账户不存在"></nz-empty>
    }
  `
})
export class AccountDetailComponent implements OnInit {
  accountService = inject(AccountService);
  teamService = inject(TeamService);
  scheduleService = inject(OrganizationScheduleService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  // 使用 computed 从 Service 获取账户信息
  account = computed(() => this.accountService.selectedAccount());

  // 导出枚举供模板使用
  AccountType = AccountType;
  AccountStatus = AccountStatus;

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('id');
    if (accountId) {
      this.loadAccount(accountId);
    }
  }

  async loadAccount(id: string): Promise<void> {
    try {
      const account = await this.accountService.loadAccountById(id);
      if (account) {
        // 如果是组织账户，加载团队和排班信息
        if (account.type === AccountType.ORGANIZATION) {
          await this.loadTeams(account.id);
          await this.loadSchedules(account.id);
        }
      } else {
        this.message.warning('账户不存在');
        this.goBack();
      }
    } catch (error) {
      this.message.error('加载账户详情失败');
    }
  }

  async loadTeams(organizationId: string): Promise<void> {
    try {
      await this.teamService.loadTeamsByOrganizationId(organizationId);
    } catch (error) {
      // 静默失败，不影响主流程
      console.error('加载团队信息失败', error);
    }
  }

  async loadSchedules(organizationId: string): Promise<void> {
    try {
      await this.scheduleService.loadSchedulesByOrganizationId(organizationId);
    } catch (error) {
      // 静默失败，不影响主流程
      console.error('加载排班信息失败', error);
    }
  }

  goBack(): void {
    this.router.navigate(['/accounts']);
  }

  edit(): void {
    if (this.account()) {
      this.router.navigate(['/accounts', this.account()!.id, 'edit']);
    }
  }

  async delete(): Promise<void> {
    if (!this.account()) {
      return;
    }

    // 使用 nz-modal 确认删除（这里简化处理，实际应该使用 ModalHelper）
    if (confirm('确定要删除此账户吗？此操作不可恢复。')) {
      try {
        await this.accountService.deleteAccount(this.account()!.id);
        this.message.success('删除成功');
        this.goBack();
      } catch (error) {
        this.message.error('删除失败');
      }
    }
  }

  viewTeam(teamId: string): void {
    this.router.navigate(['/accounts/teams', teamId]);
  }
}
