import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationMember, TeamMemberInsert, TeamMemberRepository, TeamMemberRole } from '@core';
import { AccountService, OrganizationMemberService, SHARED_IMPORTS, TeamMemberService, TeamService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';

export interface OrgTeamMemberAddData {
  teamId: string;
}

/**
 * 组织团队成员添加组件
 *
 * 职责：在组织上下文中添加团队成员
 *
 * 特点：
 * - 仅支持 Modal 模式
 * - 只能从组织成员中选择
 * - 默认角色为 MEMBER
 */
@Component({
  selector: 'app-org-team-member-add',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>選擇成員</nz-form-label>
        <nz-form-control [nzSpan]="18" [nzErrorTip]="'請選擇成員'">
          <nz-select formControlName="accountId" nzPlaceHolder="請選擇組織成員" nzShowSearch [nzLoading]="loading()" style="width: 100%;">
            @if (availableMembers().length === 0) {
              <nz-option [nzDisabled]="true" [nzLabel]="loading() ? '載入中...' : '暫無可用成員'"></nz-option>
            } @else {
              @for (member of availableMembers(); track member.account_id) {
                <nz-option [nzValue]="member.account_id" [nzLabel]="getAccountName(member.account_id)"></nz-option>
              }
            }
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-alert
        nzType="info"
        nzMessage="提示"
        nzDescription="只能從組織成員中選擇。添加成員後，該用戶將能夠訪問團隊相關的資源和資料。新成員預設角色為普通成員，可在成員列表中修改角色。"
        nzShowIcon
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-form-item>
        <nz-form-control [nzSpan]="18" [nzOffset]="6">
          <button nz-button nzType="default" type="button" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;">
            取消
          </button>
          <button nz-button nzType="primary" type="submit" [nzLoading]="submitting()" [disabled]="!form.valid || submitting()">
            添加成員
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class OrgTeamMemberAddComponent implements OnInit {
  private teamMemberRepository = inject(TeamMemberRepository);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private readonly teamService = inject(TeamService);
  private readonly organizationMemberService = inject(OrganizationMemberService);
  private readonly teamMemberService = inject(TeamMemberService);
  readonly accountService = inject(AccountService);

  readonly data: OrgTeamMemberAddData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);
  readonly loading = signal(false);

  // 组织成员列表（Signal）
  private organizationMembersState = signal<OrganizationMember[]>([]);
  // 当前团队成员列表（Signal）
  private currentTeamMembersState = signal<string[]>([]); // 存储 account_id 列表

  form = new FormGroup({
    accountId: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  /**
   * 可选择的成员列表（组织成员 - 当前团队成员）
   */
  readonly availableMembers = computed(() => {
    const orgMembers = this.organizationMembersState();
    const teamMemberIds = new Set(this.currentTeamMembersState());
    return orgMembers.filter(member => !teamMemberIds.has(member.account_id));
  });

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      // 1. 加载团队信息，获取 organization_id
      const team = await this.teamService.loadTeamById(this.data.teamId);
      if (!team) {
        this.message.error('團隊不存在');
        this.modalRef.close(false);
        return;
      }

      // 2. 加载组织成员列表
      // BaseRepository 会自动转换为 camelCase，但为了兼容性，同时检查两种格式
      const teamData = team as { organizationId?: string; organization_id?: string };
      const organizationId = teamData.organizationId || teamData.organization_id;
      if (!organizationId) {
        this.message.error('無法獲取組織ID');
        this.modalRef.close(false);
        return;
      }
      const orgMembers = await this.organizationMemberService.loadMembersByOrganizationId(organizationId);
      this.organizationMembersState.set(orgMembers);

      // 3. 加载当前团队成员列表（用于过滤）
      const teamMembers = await this.teamMemberService.loadMembersByTeamId(this.data.teamId);
      const teamMemberAccountIds = teamMembers.map(m => m.account_id);
      this.currentTeamMembersState.set(teamMemberAccountIds);

      // 4. 加载账户列表以便显示账户名称
      if (this.accountService.accounts().length === 0) {
        await this.accountService.loadAccounts();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入成員列表失敗';
      this.message.error(errorMessage);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * 获取账户名称
   */
  getAccountName(accountId: string): string {
    const accounts = this.accountService.accounts();
    const account = accounts.find(a => a.id === accountId);
    return account?.name || accountId;
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    this.submitting.set(true);
    try {
      const accountId = this.form.value.accountId!;
      const memberData: TeamMemberInsert = {
        team_id: this.data.teamId,
        account_id: accountId,
        role: TeamMemberRole.MEMBER // 默认角色为 MEMBER
      };

      await firstValueFrom(this.teamMemberRepository.create(memberData));
      this.message.success('成員添加成功');
      this.modalRef.close(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '添加失敗，請重試';
      this.message.error(errorMessage);
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
