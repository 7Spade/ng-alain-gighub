import { Injectable, inject } from '@angular/core';
import { ErrorStateService } from '@core/net';
import type {
  Organization,
  OrganizationMember,
  OrganizationMemberWithUser,
  OrganizationWithMembers,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  InviteMemberInput,
  OrganizationMemberRole,
  OrganizationInvitation,
  AcceptInvitationInput
} from '@shared';

import { SupabaseService } from '../../supabase/supabase.service';

/**
 * Organization Service
 *
 * 提供組織相關的 CRUD 操作
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private readonly supabase = inject(SupabaseService);
  private readonly errorService = inject(ErrorStateService);

  /**
   * 獲取當前用戶所屬的所有組織
   */
  async getMyOrganizations(): Promise<{ data: Organization[]; error: Error | null }> {
    try {
      const {
        data: { user }
      } = await this.supabase.client.auth.getUser();

      if (!user) {
        this.errorService.addError({
          type: 'permission',
          severity: 'error',
          message: '獲取組織列表失敗',
          details: '用戶未認證，無法獲取組織列表',
          source: 'OrganizationService.getMyOrganizations',
          retryable: false
        });
        return { data: [], error: new Error('User not authenticated') };
      }

      const { data, error } = await this.supabase.client
        .from('organization_members')
        .select(
          `
          organization_id,
          organizations (*)
        `
        )
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '獲取組織列表失敗',
          details: error.message || '無法載入組織列表',
          source: 'OrganizationService.getMyOrganizations',
          retryable: true
        });
        return { data: [], error };
      }

      const organizations = (data || []).map((item: any) => item.organizations) as Organization[];
      return { data: organizations, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '獲取組織列表失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'OrganizationService.getMyOrganizations',
        retryable: false
      });
      return { data: [], error: error as Error };
    }
  }

  /**
   * 根據 ID 獲取組織資料
   */
  async getOrganizationById(id: string): Promise<{ data: Organization | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client.from('organizations').select('*').eq('id', id).single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '獲取組織資料失敗',
          details: error.message || '無法載入組織資料',
          source: 'OrganizationService.getOrganizationById',
          retryable: true,
          metadata: { id }
        });
        return { data: null, error };
      }

      return { data: data as Organization, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '獲取組織資料失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'OrganizationService.getOrganizationById',
        retryable: false,
        metadata: { id }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 根據 slug 獲取組織資料
   */
  async getOrganizationBySlug(slug: string): Promise<{ data: Organization | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client.from('organizations').select('*').eq('slug', slug).single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '獲取組織資料失敗',
          details: error.message || '無法載入組織資料',
          source: 'OrganizationService.getOrganizationBySlug',
          retryable: true,
          metadata: { slug }
        });
        return { data: null, error };
      }

      return { data: data as Organization, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '獲取組織資料失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'OrganizationService.getOrganizationBySlug',
        retryable: false,
        metadata: { slug }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 獲取組織的完整資料（包含成員列表）
   */
  async getOrganizationWithMembers(id: string): Promise<{ data: OrganizationWithMembers | null; error: Error | null }> {
    try {
      const { data: org, error: orgError } = await this.supabase.client.from('organizations').select('*').eq('id', id).single();

      if (orgError || !org) {
        return { data: null, error: orgError };
      }

      const { data: members, error: membersError } = await this.supabase.client
        .from('organization_members')
        .select(
          `
          *,
          user:users!user_id (*)
        `
        )
        .eq('organization_id', id)
        .eq('status', 'active');

      if (membersError) {
        return { data: null, error: membersError };
      }

      return {
        data: {
          ...(org as Organization),
          members: (members || []).map((item: any) => ({
            ...item,
            user: item.user
          })) as OrganizationMemberWithUser[]
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 創建組織
   */
  async createOrganization(input: CreateOrganizationInput): Promise<{ data: Organization | null; error: Error | null }> {
    try {
      const {
        data: { user }
      } = await this.supabase.client.auth.getUser();

      if (!user) {
        this.errorService.addError({
          type: 'permission',
          severity: 'error',
          message: '創建組織失敗',
          details: '用戶未認證，無法創建組織',
          source: 'OrganizationService.createOrganization',
          retryable: false
        });
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data: org, error: orgError } = await this.supabase.client
        .from('organizations')
        .insert({
          name: input.name,
          slug: input.slug,
          description: input.description,
          avatar_url: input.avatar_url,
          website_url: input.website_url,
          owner_id: user.id,
          is_public: input.is_public ?? false
        })
        .select()
        .single();

      if (orgError) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '創建組織失敗',
          details: orgError.message || '無法創建組織',
          source: 'OrganizationService.createOrganization',
          retryable: true,
          metadata: { input }
        });
        return { data: null, error: orgError };
      }

      // 自動將創建者添加為 owner 成員
      await this.supabase.client.from('organization_members').insert({
        organization_id: org.id,
        user_id: user.id,
        role: 'owner',
        status: 'active',
        joined_at: new Date().toISOString()
      });

      return { data: org as Organization, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '創建組織失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'OrganizationService.createOrganization',
        retryable: false,
        metadata: { input }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 更新組織資料
   */
  async updateOrganization(id: string, input: UpdateOrganizationInput): Promise<{ data: Organization | null; error: Error | null }> {
    try {
      const updateData: any = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.avatar_url !== undefined) updateData.avatar_url = input.avatar_url;
      if (input.website_url !== undefined) updateData.website_url = input.website_url;
      if (input.is_public !== undefined) updateData.is_public = input.is_public;

      const { data, error } = await this.supabase.client.from('organizations').update(updateData).eq('id', id).select().single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '更新組織失敗',
          details: error.message || '無法更新組織',
          source: 'OrganizationService.updateOrganization',
          retryable: true,
          metadata: { id, input }
        });
        return { data: null, error };
      }

      return { data: data as Organization, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '更新組織失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'OrganizationService.updateOrganization',
        retryable: false,
        metadata: { id }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 刪除組織
   */
  async deleteOrganization(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.client.from('organizations').delete().eq('id', id);

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '刪除組織失敗',
          details: error.message || '無法刪除組織',
          source: 'OrganizationService.deleteOrganization',
          retryable: false,
          metadata: { id }
        });
        return { error };
      }

      return { error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '刪除組織失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'OrganizationService.deleteOrganization',
        retryable: false,
        metadata: { id }
      });
      return { error: error as Error };
    }
  }

  /**
   * 獲取組織的成員列表
   */
  async getOrganizationMembers(organizationId: string): Promise<{ data: OrganizationMemberWithUser[]; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('organization_members')
        .select(
          `
          *,
          user:users!user_id (*)
        `
        )
        .eq('organization_id', organizationId)
        .eq('status', 'active');

      if (error) {
        return { data: [], error };
      }

      const members = (data || []).map((item: any) => ({
        ...item,
        user: item.user
      })) as OrganizationMemberWithUser[];

      return { data: members, error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * 添加成員到組織
   */
  async addMember(
    organizationId: string,
    userId: string,
    role: OrganizationMemberRole = 'member'
  ): Promise<{ data: OrganizationMember | null; error: Error | null }> {
    try {
      const {
        data: { user }
      } = await this.supabase.client.auth.getUser();

      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await this.supabase.client
        .from('organization_members')
        .insert({
          organization_id: organizationId,
          user_id: userId,
          role,
          invited_by: user.id,
          status: 'active',
          joined_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as OrganizationMember, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 更新成員角色
   */
  async updateMemberRole(
    memberId: string,
    role: OrganizationMemberRole
  ): Promise<{ data: OrganizationMember | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client.from('organization_members').update({ role }).eq('id', memberId).select().single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as OrganizationMember, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 移除成員
   */
  async removeMember(memberId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.client.from('organization_members').delete().eq('id', memberId);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * 邀請用戶加入組織
   */
  async inviteMember(input: InviteMemberInput): Promise<{ data: OrganizationInvitation | null; error: Error | null }> {
    try {
      const {
        data: { user }
      } = await this.supabase.client.auth.getUser();

      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      // 生成邀請 token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 天後過期

      const { data, error } = await this.supabase.client
        .from('organization_invitations')
        .insert({
          organization_id: input.organization_id,
          email: input.email,
          role: input.role ?? 'member',
          invited_by: user.id,
          token,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as OrganizationInvitation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 接受組織邀請
   */
  async acceptInvitation(input: AcceptInvitationInput): Promise<{ data: OrganizationMember | null; error: Error | null }> {
    try {
      const {
        data: { user }
      } = await this.supabase.client.auth.getUser();

      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      // 驗證邀請 token
      const { data: invitation, error: inviteError } = await this.supabase.client
        .from('organization_invitations')
        .select('*')
        .eq('token', input.token)
        .eq('email', user.email)
        .is('accepted_at', null)
        .single();

      if (inviteError || !invitation) {
        return { data: null, error: new Error('Invalid or expired invitation') };
      }

      // 檢查是否過期
      if (new Date(invitation.expires_at) < new Date()) {
        return { data: null, error: new Error('Invitation has expired') };
      }

      // 創建成員記錄
      const { data: member, error: memberError } = await this.supabase.client
        .from('organization_members')
        .insert({
          organization_id: invitation.organization_id,
          user_id: user.id,
          role: invitation.role,
          invited_by: invitation.invited_by,
          status: 'active',
          joined_at: new Date().toISOString()
        })
        .select()
        .single();

      if (memberError) {
        return { data: null, error: memberError };
      }

      // 標記邀請為已接受
      await this.supabase.client.from('organization_invitations').update({ accepted_at: new Date().toISOString() }).eq('id', invitation.id);

      return { data: member as OrganizationMember, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 獲取組織的邀請列表
   */
  async getOrganizationInvitations(organizationId: string): Promise<{ data: OrganizationInvitation[]; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('organization_invitations')
        .select('*')
        .eq('organization_id', organizationId)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error };
      }

      return { data: (data || []) as OrganizationInvitation[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * TODO: 完整實作組織邀請功能
   *
   * 對應表: organization_invitations (9 個欄位)
   * 當前狀態: 已有 inviteMember() 和 acceptInvitation() 方法
   *
   * 需要實作的方法:
   * 1. getInvitationById(invitationId) - 獲取單個邀請
   *    - 從 organization_invitations 表查詢
   *    - 返回完整的邀請數據
   *
   * 2. getInvitationByToken(token) - 根據 token 獲取邀請
   *    - 從 organization_invitations 表查詢
   *    - 用於接受邀請時的驗證
   *
   * 3. rejectInvitation(invitationId) - 拒絕邀請
   *    - 更新 organization_invitations 表的 status = 'rejected'
   *    - 記錄拒絕時間（可選）
   *
   * 4. cancelInvitation(invitationId) - 取消邀請
   *    - 更新 organization_invitations 表的 status = 'cancelled'
   *    - 記錄取消時間（可選）
   *
   * 5. resendInvitation(invitationId) - 重新發送邀請
   *    - 更新 organization_invitations 表的 token（生成新 token）
   *    - 更新 expires_at（延長 7 天）
   *    - 發送新的邀請郵件（可選）
   *
   * 6. getInvitationsByStatus(organizationId, status) - 根據狀態獲取邀請
   *    - 從 organization_invitations 表查詢
   *    - 狀態: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired'
   *
   * 7. getExpiredInvitations(organizationId) - 獲取過期邀請
   *    - 從 organization_invitations 表查詢
   *    - 條件: expires_at < 當前日期 AND accepted_at IS NULL
   *
   * 8. cleanupExpiredInvitations(organizationId) - 清理過期邀請
   *    - 刪除或標記過期邀請
   *    - 可選: 定期執行清理任務
   *
   * 表結構參考 (organization_invitations):
   * - id (uuid) - 邀請 ID
   * - organization_id (uuid) - 組織 ID (外鍵: organizations.id)
   * - email (text) - 邀請的電子郵件
   * - role (text) - 角色: 'owner' | 'admin' | 'member' | 'viewer'
   * - token (text) - 邀請 token（用於接受邀請）
   * - status (text) - 狀態: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired'
   * - invited_by (uuid) - 邀請人 ID (外鍵: users.id)
   * - expires_at (timestamptz) - 過期時間
   * - accepted_at (timestamptz) - 接受時間
   * - created_at (timestamptz) - 創建時間
   */
}
