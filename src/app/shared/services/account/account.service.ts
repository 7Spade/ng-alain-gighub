import { Injectable, inject, signal, computed } from '@angular/core';
import { AccountRepository, AccountInsert, AccountUpdate } from '@core';
import { Account, AccountType, AccountStatus } from '@shared';
import { Observable, firstValueFrom } from 'rxjs';

/**
 * Account Service
 *
 * 提供账户相关的业务逻辑和状态管理
 * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 *
 * @example
 * ```typescript
 * const accountService = inject(AccountService);
 *
 * // 订阅账户列表
 * effect(() => {
 *   console.log('Accounts:', accountService.accounts());
 * });
 *
 * // 加载账户列表
 * await accountService.loadAccounts();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountRepository = inject(AccountRepository);

  // 使用 Signals 管理状态
  private accountsState = signal<Account[]>([]);
  private selectedAccountState = signal<Account | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly accounts = this.accountsState.asReadonly();
  readonly selectedAccount = this.selectedAccountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly activeAccounts = computed(() => this.accounts().filter(a => a.status === AccountStatus.ACTIVE));

  readonly userAccounts = computed(() => this.accounts().filter(a => a.type === AccountType.USER));

  readonly organizationAccounts = computed(() => this.accounts().filter(a => a.type === AccountType.ORGANIZATION));

  readonly botAccounts = computed(() => this.accounts().filter(a => a.type === AccountType.BOT));

  /** 个人 Bot 账户（auth_organization_id 为 NULL） */
  readonly personalBotAccounts = computed(() =>
    this.accounts().filter(a => a.type === AccountType.BOT && !(a as any).authOrganizationId)
  );

  /** 组织 Bot 账户（auth_organization_id 不为 NULL） */
  readonly organizationBotAccounts = computed(() =>
    this.accounts().filter(a => a.type === AccountType.BOT && !!(a as any).authOrganizationId)
  );

  /**
   * 加载所有账户
   */
  async loadAccounts(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const accounts = await firstValueFrom(this.accountRepository.findAll());
      this.accountsState.set(accounts);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载账户列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据 ID 加载账户
   */
  async loadAccountById(id: string): Promise<Account | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const account = await firstValueFrom(this.accountRepository.findById(id));
      if (account) {
        this.selectedAccountState.set(account);
      }
      return account;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载账户失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据类型加载账户
   */
  async loadAccountsByType(type: AccountType): Promise<Account[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const accounts = await firstValueFrom(this.accountRepository.findByType(type));
      return accounts;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载账户列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据状态加载账户
   */
  async loadAccountsByStatus(status: AccountStatus): Promise<Account[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const accounts = await firstValueFrom(this.accountRepository.findByStatus(status));
      return accounts;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载账户列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建账户
   */
  async createAccount(data: AccountInsert): Promise<Account> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const account = await firstValueFrom(this.accountRepository.create(data));
      // 更新本地状态
      this.accountsState.update(accounts => [...accounts, account]);
      return account;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建账户失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建 Organization 账户（使用 SECURITY DEFINER 函数绕过 RLS）
   *
   * @param name 组织名称
   * @param email 邮箱（可选）
   * @param status 账户状态（默认 'active'）
   * @returns Promise<Account>
   */
  async createOrganizationAccount(name: string, email?: string | null, status: AccountStatus = AccountStatus.ACTIVE): Promise<Account> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const account = await firstValueFrom(this.accountRepository.createOrganizationAccount(name, email, status));
      // 更新本地状态
      this.accountsState.update(accounts => [...accounts, account]);
      return account;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建组织账户失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建 Bot 账户（使用 SECURITY DEFINER 函数绕过 RLS）
   *
   * @param name 机器人名称
   * @param email 邮箱（可选）
   * @param status 账户状态（默认 'active'）
   * @param organizationId 组织账户 ID（可选，NULL = 个人 Bot，有值 = 组织 Bot）
   * @returns Promise<Account>
   */
  async createBotAccount(
    name: string,
    email?: string | null,
    status: AccountStatus = AccountStatus.ACTIVE,
    organizationId?: string | null
  ): Promise<Account> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const account = await firstValueFrom(
        this.accountRepository.createBotAccount(name, email, status, organizationId)
      );
      // 更新本地状态
      this.accountsState.update(accounts => [...accounts, account]);
      return account;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建机器人账户失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新账户
   */
  async updateAccount(id: string, data: AccountUpdate): Promise<Account> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const account = await firstValueFrom(this.accountRepository.update(id, data));
      // 更新本地状态
      this.accountsState.update(accounts => accounts.map(a => (a.id === id ? account : a)));
      // 如果更新的是当前选中的账户，也更新选中状态
      if (this.selectedAccount()?.id === id) {
        this.selectedAccountState.set(account);
      }
      return account;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新账户失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 删除账户
   */
  async deleteAccount(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.accountRepository.delete(id));
      // 更新本地状态
      this.accountsState.update(accounts => accounts.filter(a => a.id !== id));
      // 如果删除的是当前选中的账户，清空选中状态
      if (this.selectedAccount()?.id === id) {
        this.selectedAccountState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '删除账户失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 选择账户
   */
  selectAccount(account: Account | null): void {
    this.selectedAccountState.set(account);
  }

  /**
   * 根据 auth_user_id 查找账户
   */
  async findByAuthUserId(authUserId: string): Promise<Account | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const account = await firstValueFrom(this.accountRepository.findByAuthUserId(authUserId));
      return account;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '查找账户失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据邮箱查找账户
   */
  async findByEmail(email: string): Promise<Account | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const account = await firstValueFrom(this.accountRepository.findByEmail(email));
      return account;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '查找账户失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 重置状态
   */
  reset(): void {
    this.accountsState.set([]);
    this.selectedAccountState.set(null);
    this.errorState.set(null);
  }
}
