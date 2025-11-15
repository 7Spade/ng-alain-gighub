import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { firstValueFrom } from 'rxjs';

import { AccountRepository, AccountType, TeamMemberRepository, TeamRepository } from '../infra';
import { IdentityChangeEvent, IdentityInfo, IdentityType } from './types';

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

  // 私有状态 Signal
  private readonly currentIdentityState = signal<IdentityInfo | null>(null);
  private readonly availableIdentitiesState = signal<IdentityInfo[]>([]);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  // 暴露只读 Signal 给组件
  readonly currentIdentity = this.currentIdentityState.asReadonly();
  readonly availableIdentities = this.availableIdentitiesState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals - 派生状态
  readonly currentIdentityName = computed(() => {
    const identity = this.currentIdentity();
    return identity?.name || '个人';
  });

  readonly currentIdentityAvatar = computed(() => {
    const identity = this.currentIdentity();
    return identity?.avatar;
  });

  readonly currentIdentityType = computed(() => {
    const identity = this.currentIdentity();
    return identity?.type || 'personal';
  });

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
      if (identity) {
        try {
          localStorage.setItem('currentIdentity', JSON.stringify(identity));
        } catch (error) {
          console.warn('Failed to save identity to localStorage:', error);
        }
      } else {
        localStorage.removeItem('currentIdentity');
      }
    });

    // 从 localStorage 恢复身份
    this.restoreIdentityFromStorage();
  }

  /**
   * 从 localStorage 恢复身份
   */
  private restoreIdentityFromStorage(): void {
    try {
      const stored = localStorage.getItem('currentIdentity');
      if (stored) {
        const identity = JSON.parse(stored) as IdentityInfo;
        this.currentIdentityState.set(identity);
      } else {
        // 默认使用个人身份
        this.currentIdentityState.set({
          type: 'personal',
          name: '个人'
        });
      }
    } catch (error) {
      console.warn('Failed to restore identity from localStorage:', error);
      // 默认使用个人身份
      this.currentIdentityState.set({
        type: 'personal',
        name: '个人'
      });
    }
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
      if (!userId) {
        this.availableIdentitiesState.set([
          {
            type: 'personal',
            name: '个人'
          }
        ]);
        return;
      }

      const accountId = await this.getCurrentUserAccountId();
      if (!accountId) {
        this.availableIdentitiesState.set([
          {
            type: 'personal',
            name: '个人'
          }
        ]);
        return;
      }

      // 并行加载组织和团队
      const [organizations, teams] = await Promise.all([this.loadUserOwnedOrganizations(userId), this.loadUserTeams(accountId)]);

      // 构建身份列表
      const identities: IdentityInfo[] = [
        {
          type: 'personal',
          name: '个人'
        },
        ...organizations,
        ...teams
      ];

      this.availableIdentitiesState.set(identities);

      // 如果当前身份不在可用列表中，切换到个人身份
      const current = this.currentIdentity();
      if (current && current.type !== 'personal') {
        const exists = identities.some(i => i.type === current.type && i.id === current.id);
        if (!exists) {
          this.switchIdentity('personal');
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
   * 加载用户拥有的组织
   */
  private async loadUserOwnedOrganizations(authUserId: string): Promise<IdentityInfo[]> {
    try {
      // 查询用户创建的组织账户
      const organizations = await firstValueFrom(this.accountRepository.findByAuthOrganizationId(authUserId));

      // 过滤出组织类型的账户
      const orgAccounts = organizations.filter(org => org.type === AccountType.ORGANIZATION);

      return orgAccounts.map(org => ({
        type: 'organization' as IdentityType,
        id: org.id,
        name: org.name,
        avatar: (org as any).avatar_url || undefined,
        email: org.email || undefined
      }));
    } catch (error) {
      console.warn('Failed to load user organizations:', error);
      return [];
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
      console.warn('Failed to load user teams:', error);
      return [];
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

    let newIdentity: IdentityInfo;

    if (type === 'personal') {
      newIdentity = {
        type: 'personal',
        name: '个人'
      };
    } else {
      // 从可用身份列表中找到对应的身份
      const available = this.availableIdentities();
      const identity = available.find(i => i.type === type && i.id === id);

      if (!identity) {
        throw new Error(`Identity not found: ${type} ${id}`);
      }

      newIdentity = identity;
    }

    this.currentIdentityState.set(newIdentity);

    // 触发身份切换事件（可以通过 Subject 或 EventEmitter 实现）
    const event: IdentityChangeEvent = {
      previous,
      current: newIdentity
    };

    // 可以在这里添加事件通知逻辑
    console.log('Identity changed:', event);
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
    this.currentIdentityState.set({
      type: 'personal',
      name: '个人'
    });
    this.availableIdentitiesState.set([]);
    this.errorState.set(null);
    localStorage.removeItem('currentIdentity');
  }
}
