import { Injectable, inject } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import {
  CollaborationInvitationRepository,
  CollaborationInvitationInsert,
  CollaborationInvitationUpdate,
  InvitationStatus
} from '@core';
import { CollaborationInvitation } from '@shared';

/**
 * Invitation Service
 * 
 * 提供协作邀请相关的业务逻辑和状态管理
 * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 * 
 * @example
 * ```typescript
 * const invitationService = inject(InvitationService);
 * 
 * // 订阅邀请列表
 * effect(() => {
 *   console.log('Invitations:', invitationService.invitations());
 * });
 * 
 * // 加载邀请列表
 * await invitationService.loadInvitations();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private invitationRepository = inject(CollaborationInvitationRepository);

  // 使用 Signals 管理状态
  private invitationsState = signal<CollaborationInvitation[]>([]);
  private selectedInvitationState = signal<CollaborationInvitation | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly invitations = this.invitationsState.asReadonly();
  readonly selectedInvitation = this.selectedInvitationState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly pendingInvitations = computed(() =>
    this.invitations().filter(i => i.status === InvitationStatus.PENDING)
  );

  readonly acceptedInvitations = computed(() =>
    this.invitations().filter(i => i.status === InvitationStatus.ACCEPTED)
  );

  readonly expiredInvitations = computed(() =>
    this.invitations().filter(i => {
      if (!i.expires_at) return false;
      return new Date(i.expires_at) < new Date();
    })
  );

  /**
   * 加载所有邀请
   */
  async loadInvitations(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const invitations = await firstValueFrom(this.invitationRepository.findAll());
      this.invitationsState.set(invitations);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据 ID 加载邀请
   */
  async loadInvitationById(id: string): Promise<CollaborationInvitation | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const invitation = await firstValueFrom(this.invitationRepository.findById(id));
      if (invitation) {
        this.selectedInvitationState.set(invitation);
      }
      return invitation;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载邀请失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据蓝图 ID 加载邀请
   */
  async loadInvitationsByBlueprintId(blueprintId: string): Promise<CollaborationInvitation[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const invitations = await firstValueFrom(
        this.invitationRepository.findByBlueprintId(blueprintId)
      );
      return invitations;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据发送组织 ID 加载邀请
   */
  async loadInvitationsByFromOrgId(fromOrgId: string): Promise<CollaborationInvitation[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const invitations = await firstValueFrom(
        this.invitationRepository.findByFromOrgId(fromOrgId)
      );
      return invitations;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据接收组织 ID 加载邀请
   */
  async loadInvitationsByToOrgId(toOrgId: string): Promise<CollaborationInvitation[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const invitations = await firstValueFrom(
        this.invitationRepository.findByToOrgId(toOrgId)
      );
      return invitations;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据状态加载邀请
   */
  async loadInvitationsByStatus(status: InvitationStatus): Promise<CollaborationInvitation[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const invitations = await firstValueFrom(
        this.invitationRepository.findByStatus(status)
      );
      return invitations;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 加载待处理邀请
   */
  async loadPendingInvitations(): Promise<CollaborationInvitation[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const invitations = await firstValueFrom(this.invitationRepository.findPending());
      return invitations;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载待处理邀请失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 加载过期邀请
   */
  async loadExpiredInvitations(): Promise<CollaborationInvitation[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const invitations = await firstValueFrom(this.invitationRepository.findExpired());
      return invitations;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载过期邀请失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建邀请
   */
  async createInvitation(data: CollaborationInvitationInsert): Promise<CollaborationInvitation> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const invitation = await firstValueFrom(this.invitationRepository.create(data));
      // 更新本地状态
      this.invitationsState.update(invitations => [...invitations, invitation]);
      return invitation;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建邀请失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新邀请
   */
  async updateInvitation(
    id: string,
    data: CollaborationInvitationUpdate
  ): Promise<CollaborationInvitation> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const invitation = await firstValueFrom(this.invitationRepository.update(id, data));
      // 更新本地状态
      this.invitationsState.update(invitations =>
        invitations.map(i => (i.id === id ? invitation : i))
      );
      // 如果更新的是当前选中的邀请，也更新选中状态
      if (this.selectedInvitation()?.id === id) {
        this.selectedInvitationState.set(invitation);
      }
      return invitation;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新邀请失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 接受邀请
   */
  async acceptInvitation(id: string): Promise<CollaborationInvitation> {
    return this.updateInvitation(id, {
      status: InvitationStatus.ACCEPTED,
      responded_at: new Date().toISOString()
    });
  }

  /**
   * 拒绝邀请
   */
  async rejectInvitation(id: string): Promise<CollaborationInvitation> {
    return this.updateInvitation(id, {
      status: InvitationStatus.REJECTED,
      responded_at: new Date().toISOString()
    });
  }

  /**
   * 删除邀请
   */
  async deleteInvitation(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.invitationRepository.delete(id));
      // 更新本地状态
      this.invitationsState.update(invitations => invitations.filter(i => i.id !== id));
      // 如果删除的是当前选中的邀请，清空选中状态
      if (this.selectedInvitation()?.id === id) {
        this.selectedInvitationState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '删除邀请失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 选择邀请
   */
  selectInvitation(invitation: CollaborationInvitation | null): void {
    this.selectedInvitationState.set(invitation);
  }

  /**
   * 重置状态
   */
  reset(): void {
    this.invitationsState.set([]);
    this.selectedInvitationState.set(null);
    this.errorState.set(null);
  }
}

