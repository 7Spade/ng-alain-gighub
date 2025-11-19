import { Injectable, inject, signal, computed } from '@angular/core';
import {
  OrganizationCollaborationRepository,
  OrganizationCollaborationInsert,
  OrganizationCollaborationUpdate,
  CollaborationType,
  CollaborationStatus
} from '@core';
import { OrganizationCollaboration } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Collaboration Service
 *
 * 提供组织协作关系相关的业务逻辑和状态管理
 * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 *
 * @example
 * ```typescript
 * const collaborationService = inject(CollaborationService);
 *
 * // 订阅协作关系列表
 * effect(() => {
 *   console.log('Collaborations:', collaborationService.collaborations());
 * });
 *
 * // 加载协作关系列表
 * await collaborationService.loadCollaborations();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  private collaborationRepository = inject(OrganizationCollaborationRepository);

  // 使用 Signals 管理状态
  private collaborationsState = signal<OrganizationCollaboration[]>([]);
  private selectedCollaborationState = signal<OrganizationCollaboration | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly collaborations = this.collaborationsState.asReadonly();
  readonly selectedCollaboration = this.selectedCollaborationState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly activeCollaborations = computed(() => this.collaborations().filter(c => c.status === CollaborationStatus.ACTIVE));

  readonly pendingCollaborations = computed(() => this.collaborations().filter(c => c.status === CollaborationStatus.PENDING));

  readonly contractorCollaborations = computed(() =>
    this.collaborations().filter(c => c.collaboration_type === CollaborationType.CONTRACTOR)
  );

  /**
   * 加载所有协作关系
   */
  async loadCollaborations(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const collaborations = await firstValueFrom(this.collaborationRepository.findAll());
      this.collaborationsState.set(collaborations);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据 ID 加载协作关系
   */
  async loadCollaborationById(id: string): Promise<OrganizationCollaboration | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const collaboration = await firstValueFrom(this.collaborationRepository.findById(id));
      if (collaboration) {
        this.selectedCollaborationState.set(collaboration);
      }
      return collaboration;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载协作关系失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据蓝图 ID 加载协作关系
   */
  async loadCollaborationsByBlueprintId(blueprintId: string): Promise<OrganizationCollaboration[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const collaborations = await firstValueFrom(this.collaborationRepository.findByBlueprintId(blueprintId));
      return collaborations;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据拥有者组织 ID 加载协作关系
   */
  async loadCollaborationsByOwnerOrgId(ownerOrgId: string): Promise<OrganizationCollaboration[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const collaborations = await firstValueFrom(this.collaborationRepository.findByOwnerOrgId(ownerOrgId));
      return collaborations;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据协作组织 ID 加载协作关系
   */
  async loadCollaborationsByCollaboratorOrgId(collaboratorOrgId: string): Promise<OrganizationCollaboration[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const collaborations = await firstValueFrom(this.collaborationRepository.findByCollaboratorOrgId(collaboratorOrgId));
      return collaborations;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据协作类型加载协作关系
   */
  async loadCollaborationsByType(collaborationType: CollaborationType): Promise<OrganizationCollaboration[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const collaborations = await firstValueFrom(this.collaborationRepository.findByCollaborationType(collaborationType));
      return collaborations;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据状态加载协作关系
   */
  async loadCollaborationsByStatus(status: CollaborationStatus): Promise<OrganizationCollaboration[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const collaborations = await firstValueFrom(this.collaborationRepository.findByStatus(status));
      return collaborations;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建协作关系
   */
  async createCollaboration(data: OrganizationCollaborationInsert): Promise<OrganizationCollaboration> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const collaboration = await firstValueFrom(this.collaborationRepository.create(data));
      // 更新本地状态
      this.collaborationsState.update(collaborations => [...collaborations, collaboration]);
      return collaboration;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建协作关系失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新协作关系
   */
  async updateCollaboration(id: string, data: OrganizationCollaborationUpdate): Promise<OrganizationCollaboration> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const collaboration = await firstValueFrom(this.collaborationRepository.update(id, data));
      // 更新本地状态
      this.collaborationsState.update(collaborations => collaborations.map(c => (c.id === id ? collaboration : c)));
      // 如果更新的是当前选中的协作关系，也更新选中状态
      if (this.selectedCollaboration()?.id === id) {
        this.selectedCollaborationState.set(collaboration);
      }
      return collaboration;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新协作关系失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 删除协作关系
   */
  async deleteCollaboration(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.collaborationRepository.delete(id));
      // 更新本地状态
      this.collaborationsState.update(collaborations => collaborations.filter(c => c.id !== id));
      // 如果删除的是当前选中的协作关系，清空选中状态
      if (this.selectedCollaboration()?.id === id) {
        this.selectedCollaborationState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '删除协作关系失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 选择协作关系
   */
  selectCollaboration(collaboration: OrganizationCollaboration | null): void {
    this.selectedCollaborationState.set(collaboration);
  }

  /**
   * 重置状态
   */
  reset(): void {
    this.collaborationsState.set([]);
    this.selectedCollaborationState.set(null);
    this.errorState.set(null);
  }
}
