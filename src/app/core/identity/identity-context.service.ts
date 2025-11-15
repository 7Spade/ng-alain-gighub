import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { firstValueFrom } from 'rxjs';

import { AccountRepository, AccountType, TeamMemberRepository, TeamRepository } from '../infra';
import { IdentityInfo, IdentityType } from './types';

/**
 * 身份上下文服务
 *
 * 管理当前身份状态（个人/组织/团队），提供身份切换功能
 * 使用 Angular 20 Signals 管理状态，确保响应式更新
 *
 * @example
 * ```typescript
 * const identityService = inject(IdentityContextService);
 *
 * // 订阅当前身份
 * effect(() => {
 *   console.log('Current identity:', identityService.currentIdentity());
 * });
 *
 * // 切换身份
 * await identityService.switchIdentity('organization', 'org-id');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class IdentityContextService {
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly accountRepository = inject(AccountRepository);
  private readonly teamRepository = inject(TeamRepository);
  private readonly teamMemberRepository = inject(TeamMemberRepository);

  // 默认个人身份常量
  private readonly DEFAULT_PERSONAL_IDENTITY: IdentityInfo = {
    type: 'personal',
    name: '个人'
  };

  // 私有状态 Signal - 使用工厂函数初始化
  private readonly currentIdentityState = signal<IdentityInfo>(this.restoreIdentityFromStorage());
  private readonly availableIdentitiesState = signal<IdentityInfo[]>([]);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  // 暴露只读 Signal 给组件
  readonly currentIdentity = this.currentIdentityState.asReadonly();
  readonly availableIdentities = this.availableIdentitiesState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals - 派生状态（优化：减少重复调用）
  readonly currentIdentityName = computed(() => this.currentIdentity().name || '个人');
  readonly currentIdentityAvatar = computed(() => this.currentIdentity().avatar);
  readonly currentIdentityType = computed(() => this.currentIdentity().type || 'personal');

  readonly availableOrganizations = computed(() => {
    return this.availableIdentities().filter(i => i.type === 'organization');
  });

  readonly availableTeams = computed(() => {
    return this.availableIdentities().filter(i => i.type === 'team');
  });

  constructor() {
    // 使用 effect() 处理持久化
    effect(() => {
      const identity = this.currentIdentity();
      try {
        localStorage.setItem('currentIdentity', JSON.stringify(identity));
      } catch (error) {
        console.warn('Failed to save identity to localStorage:', error);
      }
    });
  }

  /**
   * 从 localStorage 恢复身份（用于 Signal 初始化）
   */
  private restoreIdentityFromStorage(): IdentityInfo {
    try {
      const stored = localStorage.getItem('currentIdentity');
      if (stored) {
        return JSON.parse(stored) as IdentityInfo;
      }
    } catch (error) {
      console.warn('Failed to restore identity from localStorage:', error);
    }
    return this.DEFAULT_PERSONAL_IDENTITY;
  }

  /**
   * 获取当前用户 ID
   */
  private getCurrentUserId(): string | null {
    const token = this.tokenService.get();
    return token?.['user']?.id || null;
  }

  /**
   * 获取当前用户账户 ID
   */
  private async getCurrentUserAccountId(): Promise<string | null> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return null;
    }

    try {
      const account = await firstValueFrom(this.accountRepository.findByAuthUserId(userId));
      return account?.id || null;
    } catch (error) {
      console.warn('Failed to get current user account:', error);
      return null;
    }
  }

  /**
   * 加载可用身份列表
   * 包括：个人身份、用户拥有的组织、用户所属的团队
   */
  async loadAvailableIdentities(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const userId = this.getCurrentUserId();
      const accountId = userId ? await this.getCurrentUserAccountId() : null;

      if (!userId || !accountId) {
        this.availableIdentitiesState.set([this.DEFAULT_PERSONAL_IDENTITY]);
        return;
      }

      // 并行加载组织和团队
      const [organizations, teams] = await Promise.all([this.loadUserOwnedOrganizations(userId), this.loadUserTeams(accountId)]);

      // 构建身份列表
      const identities: IdentityInfo[] = [this.DEFAULT_PERSONAL_IDENTITY, ...organizations, ...teams];

      this.availableIdentitiesState.set(identities);

      // 如果当前身份不在可用列表中，切换到个人身份
      const current = this.currentIdentity();
      if (current && current.type !== 'personal') {
        const exists = identities.some(i => i.type === current.type && i.id === current.id);
        if (!exists) {
          await this.switchIdentity('personal');
        }
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载身份列表失败');
      console.error('Failed to load available identities:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 统一错误处理辅助方法
   */
  private handleError<T>(defaultValue: T, message: string) {
    return (error: unknown): T => {
      console.warn(message, error);
      return defaultValue;
    };
  }

  /**
   * 加载用户拥有的组织
   */
  private async loadUserOwnedOrganizations(authUserId: string): Promise<IdentityInfo[]> {
    try {
      const organizations = await firstValueFrom(this.accountRepository.findByAuthOrganizationId(authUserId));

      return organizations
        .filter(org => org.type === AccountType.ORGANIZATION)
        .map(org => ({
          type: 'organization' as IdentityType,
          id: org.id,
          name: org.name,
          avatar: (org as any).avatar_url || undefined,
          email: org.email || undefined
        }));
    } catch (error) {
      return this.handleError([], 'Failed to load user organizations:')(error);
    }
  }

  /**
   * 加载用户所属的团队
   */
  private async loadUserTeams(accountId: string): Promise<IdentityInfo[]> {
    try {
      const teamMembers = await firstValueFrom(this.teamMemberRepository.findByAccountId(accountId));

      if (teamMembers.length === 0) {
        return [];
      }

      // 获取团队详情
      // 注意：BaseRepository 会自动将 snake_case 转换为 camelCase
      // 但 teamMembers 可能还没有转换，需要检查实际返回格式
      const teamIds = teamMembers.map(tm => (tm as any).teamId || (tm as any).team_id);
      const teams = await Promise.all(teamIds.map(id => firstValueFrom(this.teamRepository.findById(id))));

      const validTeams = teams.filter((team): team is NonNullable<typeof team> => team !== null);

      return validTeams.map(team => ({
        type: 'team' as IdentityType,
        id: team.id,
        name: team.name,
        avatar: undefined,
        email: undefined
      }));
    } catch (error) {
      return this.handleError([], 'Failed to load user teams:')(error);
    }
  }

  /**
   * 切换身份
   *
   * @param type 身份类型
   * @param id 身份ID（组织ID或团队ID，个人身份时为空）
   */
  async switchIdentity(type: IdentityType, id?: string): Promise<void> {
    const previous = this.currentIdentity();

    const newIdentity =
      type === 'personal'
        ? this.DEFAULT_PERSONAL_IDENTITY
        : (this.availableIdentities().find(i => i.type === type && i.id === id) ??
          (() => {
            throw new Error(`Identity not found: ${type} ${id}`);
          })());

    this.currentIdentityState.set(newIdentity);
    console.log('Identity changed:', { previous, current: newIdentity });
  }

  /**
   * 刷新可用身份列表
   */
  async refreshAvailableIdentities(): Promise<void> {
    await this.loadAvailableIdentities();
  }

  /**
   * 重置身份上下文
   */
  reset(): void {
    this.currentIdentityState.set(this.DEFAULT_PERSONAL_IDENTITY);
    this.availableIdentitiesState.set([]);
    this.errorState.set(null);
    localStorage.removeItem('currentIdentity');
  }
}
