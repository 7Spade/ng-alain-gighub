import { Injectable, inject, signal } from '@angular/core';
import {
  OrganizationMember,
  OrganizationMemberInsert,
  OrganizationMemberRepository,
  OrganizationMemberRole,
  OrganizationMemberUpdate
} from '@core';
import { firstValueFrom } from 'rxjs';

/**
 * OrganizationMember Service
 *
 * 提供组织成员相关的业务逻辑和状态管理
 * RLS 策略已处理所有权限检查
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationMemberService {
  private organizationMemberRepository = inject(OrganizationMemberRepository);

  // 使用 Signals 管理状态
  private membersState = signal<OrganizationMember[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly members = this.membersState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 根据组织 ID 加载组织成员列表
   */
  async loadMembersByOrganizationId(organizationId: string): Promise<OrganizationMember[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const members = (await firstValueFrom(
        this.organizationMemberRepository.findByOrganizationId(organizationId)
      )) as OrganizationMember[];
      this.membersState.set(members);
      return members;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载组织成员列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 添加组织成员
   */
  async addMember(data: { organizationId: string; accountId: string; role?: OrganizationMemberRole }): Promise<OrganizationMember> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const memberData: OrganizationMemberInsert = {
        organization_id: data.organizationId,
        account_id: data.accountId,
        role: data.role || OrganizationMemberRole.MEMBER
      };

      const member = (await firstValueFrom(this.organizationMemberRepository.create(memberData))) as OrganizationMember;

      // 更新本地状态
      this.membersState.update(members => [...members, member]);
      return member;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '添加组织成员失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新组织成员角色
   */
  async updateMemberRole(memberId: string, role: OrganizationMemberRole): Promise<OrganizationMember> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updateData: OrganizationMemberUpdate = {
        role
      };

      const member = (await firstValueFrom(this.organizationMemberRepository.update(memberId, updateData))) as OrganizationMember;

      // 更新本地状态
      this.membersState.update(members => members.map(m => (m.id === memberId ? member : m)));
      return member;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新组织成员角色失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 移除组织成员
   */
  async removeMember(memberId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.organizationMemberRepository.delete(memberId));

      // 更新本地状态
      this.membersState.update(members => members.filter(m => m.id !== memberId));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '移除组织成员失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清空状态
   */
  clearState(): void {
    this.membersState.set([]);
    this.errorState.set(null);
  }
}
