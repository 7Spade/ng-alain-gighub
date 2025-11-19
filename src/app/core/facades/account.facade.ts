import { Injectable, computed, inject, signal } from '@angular/core';
import { type Account, AccountStatus, AccountType } from '@shared/models';
import { AccountService } from '@shared/services/account';

import { ErrorStateService } from '../services/error-state.service';

/**
 * Account Facade
 *
 * Enterprise-grade account management facade for user and organization operations.
 * Provides unified interface for account CRUD, organization management, and collaboration.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Facade pattern: Component → Facade → Service → Repository → Supabase
 * - Non-invasive error handling via ErrorStateService
 * - Type-safe account operations
 * - Organization and Bot management
 *
 * Key Features:
 * - User account management
 * - Organization account creation and management
 * - Bot account creation (personal and organization bots)
 * - Account status management
 * - Computed filters (active accounts, by type)
 * - Organization membership queries
 *
 * @example
 * ```typescript
 * const accountFacade = inject(AccountFacade);
 *
 * // Load accounts
 * await accountFacade.loadAccounts();
 *
 * // Create organization
 * const org = await accountFacade.createOrganization('My Org', 'org@example.com');
 *
 * // Access reactive state
 * effect(() => {
 *   console.log('Active accounts:', accountFacade.activeAccounts());
 *   console.log('Organizations:', accountFacade.organizationAccounts());
 * });
 *
 * // Get user's organizations
 * const myOrgs = await accountFacade.getUserCreatedOrganizations(userId);
 * const joinedOrgs = await accountFacade.getUserJoinedOrganizations(accountId);
 * ```
 *
 * @see docs/11-元件模組視圖.mermaid.md
 * @see docs/27-完整架構流程圖.mermaid.md
 */
@Injectable({
  providedIn: 'root'
})
export class AccountFacade {
  // Inject dependencies
  private readonly accountService = inject(AccountService);
  private readonly errorService = inject(ErrorStateService);

  // Signal state
  private readonly selectedAccountIdState = signal<string | null>(null);
  private readonly loadingState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Readonly signals exposed to components
  /** All loaded accounts */
  readonly accounts = this.accountService.accounts;

  /** Currently selected account */
  readonly selectedAccount = this.accountService.selectedAccount;

  /** Loading state for account operations */
  readonly loading = computed(() => this.loadingState() || this.accountService.loading());

  /** Error state from service */
  readonly error = this.accountService.error;

  /** Last operation performed */
  readonly lastOperation = this.lastOperationState.asReadonly();

  /** Currently selected account ID */
  readonly selectedAccountId = this.selectedAccountIdState.asReadonly();

  // Computed signals from service
  /** Active accounts only */
  readonly activeAccounts = this.accountService.activeAccounts;

  /** User accounts only */
  readonly userAccounts = this.accountService.userAccounts;

  /** Organization accounts only */
  readonly organizationAccounts = this.accountService.organizationAccounts;

  /** Bot accounts only */
  readonly botAccounts = this.accountService.botAccounts;

  /** Personal bot accounts (auth_organization_id = NULL) */
  readonly personalBotAccounts = this.accountService.personalBotAccounts;

  /** Organization bot accounts (auth_organization_id != NULL) */
  readonly organizationBotAccounts = this.accountService.organizationBotAccounts;

  /** Account statistics */
  readonly accountStats = computed(() => ({
    total: this.accounts().length,
    active: this.activeAccounts().length,
    users: this.userAccounts().length,
    organizations: this.organizationAccounts().length,
    bots: this.botAccounts().length
  }));

  // ============================================================================
  // Account Loading
  // ============================================================================

  /**
   * Load all accounts
   *
   * @returns Promise<void>
   */
  async loadAccounts(): Promise<void> {
    this.loadingState.set(true);
    this.lastOperationState.set('load_accounts');

    try {
      await this.accountService.loadAccounts();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load accounts';
      console.error('[AccountFacade] Load accounts error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AccountFacade.loadAccounts'
      });
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Load account by ID
   *
   * @param id Account ID
   * @returns Promise<Account | null>
   */
  async loadAccountById(id: string): Promise<Account | null> {
    this.loadingState.set(true);
    this.lastOperationState.set('load_account_by_id');
    this.selectedAccountIdState.set(id);

    try {
      const account = await this.accountService.loadAccountById(id);
      return account;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load account';
      console.error('[AccountFacade] Load account error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AccountFacade.loadAccountById'
      });
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Load accounts by type
   *
   * @param type Account type
   * @returns Promise<Account[]>
   */
  async loadAccountsByType(type: AccountType): Promise<Account[]> {
    this.loadingState.set(true);
    this.lastOperationState.set('load_accounts_by_type');

    try {
      return await this.accountService.loadAccountsByType(type);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load accounts by type';
      console.error('[AccountFacade] Load accounts by type error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AccountFacade.loadAccountsByType'
      });
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Load accounts by status
   *
   * @param status Account status
   * @returns Promise<Account[]>
   */
  async loadAccountsByStatus(status: AccountStatus): Promise<Account[]> {
    this.loadingState.set(true);
    this.lastOperationState.set('load_accounts_by_status');

    try {
      return await this.accountService.loadAccountsByStatus(status);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load accounts by status';
      console.error('[AccountFacade] Load accounts by status error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AccountFacade.loadAccountsByStatus'
      });
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  // ============================================================================
  // Organization Management
  // ============================================================================

  /**
   * Create organization account
   *
   * @param name Organization name
   * @param email Organization email (optional)
   * @param status Account status (default: active)
   * @returns Promise<Account>
   */
  async createOrganization(name: string, email?: string | null, status: AccountStatus = AccountStatus.ACTIVE): Promise<Account> {
    this.loadingState.set(true);
    this.lastOperationState.set('create_organization');

    try {
      const organization = await this.accountService.createOrganizationAccount(name, email, status);
      console.log('[AccountFacade] Organization created:', organization.id);
      return organization;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create organization';
      console.error('[AccountFacade] Create organization error:', error);
      this.errorService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AccountFacade.createOrganization'
      });
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Get organizations created by user
   *
   * @param authUserId User's auth_user_id
   * @returns Promise<Account[]>
   */
  async getUserCreatedOrganizations(authUserId: string): Promise<Account[]> {
    this.loadingState.set(true);
    this.lastOperationState.set('get_user_created_organizations');

    try {
      return await this.accountService.getUserCreatedOrganizations(authUserId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user created organizations';
      console.error('[AccountFacade] Get user created organizations error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'warning',
        message: errorMessage,
        details: error,
        context: 'AccountFacade.getUserCreatedOrganizations'
      });
      return [];
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Get organizations user has joined
   *
   * @param userAccountId User's account ID
   * @returns Promise<Account[]>
   */
  async getUserJoinedOrganizations(userAccountId: string): Promise<Account[]> {
    this.loadingState.set(true);
    this.lastOperationState.set('get_user_joined_organizations');

    try {
      return await this.accountService.getUserJoinedOrganizations(userAccountId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user joined organizations';
      console.error('[AccountFacade] Get user joined organizations error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'warning',
        message: errorMessage,
        details: error,
        context: 'AccountFacade.getUserJoinedOrganizations'
      });
      return [];
    } finally {
      this.loadingState.set(false);
    }
  }

  // ============================================================================
  // Bot Management
  // ============================================================================

  /**
   * Create bot account
   *
   * @param name Bot name
   * @param email Bot email (optional)
   * @param status Account status (default: active)
   * @param organizationId Organization ID for org bot (null for personal bot)
   * @returns Promise<Account>
   */
  async createBot(
    name: string,
    email?: string | null,
    status: AccountStatus = AccountStatus.ACTIVE,
    organizationId?: string | null
  ): Promise<Account> {
    this.loadingState.set(true);
    this.lastOperationState.set('create_bot');

    try {
      const bot = await this.accountService.createBotAccount(name, email, status, organizationId);
      console.log('[AccountFacade] Bot created:', bot.id, organizationId ? '(organization bot)' : '(personal bot)');
      return bot;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create bot';
      console.error('[AccountFacade] Create bot error:', error);
      this.errorService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AccountFacade.createBot'
      });
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  // ============================================================================
  // Account CRUD
  // ============================================================================

  /**
   * Update account
   *
   * @param id Account ID
   * @param data Update data
   * @returns Promise<Account>
   */
  async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    this.loadingState.set(true);
    this.lastOperationState.set('update_account');

    try {
      const account = await this.accountService.updateAccount(id, data);
      console.log('[AccountFacade] Account updated:', id);
      return account;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update account';
      console.error('[AccountFacade] Update account error:', error);
      this.errorService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AccountFacade.updateAccount'
      });
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Delete account
   *
   * @param id Account ID
   * @returns Promise<void>
   */
  async deleteAccount(id: string): Promise<void> {
    this.loadingState.set(true);
    this.lastOperationState.set('delete_account');

    try {
      await this.accountService.deleteAccount(id);
      console.log('[AccountFacade] Account deleted:', id);

      // Clear selected account if it was deleted
      if (this.selectedAccountId() === id) {
        this.selectedAccountIdState.set(null);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete account';
      console.error('[AccountFacade] Delete account error:', error);
      this.errorService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AccountFacade.deleteAccount'
      });
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  // ============================================================================
  // Search & Lookup
  // ============================================================================

  /**
   * Find account by auth user ID
   *
   * @param authUserId Auth user ID
   * @returns Promise<Account | null>
   */
  async findByAuthUserId(authUserId: string): Promise<Account | null> {
    this.loadingState.set(true);
    this.lastOperationState.set('find_by_auth_user_id');

    try {
      return await this.accountService.findByAuthUserId(authUserId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to find account';
      console.error('[AccountFacade] Find by auth user ID error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'warning',
        message: errorMessage,
        details: error,
        context: 'AccountFacade.findByAuthUserId'
      });
      return null;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Find account by email
   *
   * @param email Email address
   * @returns Promise<Account | null>
   */
  async findByEmail(email: string): Promise<Account | null> {
    this.loadingState.set(true);
    this.lastOperationState.set('find_by_email');

    try {
      return await this.accountService.findByEmail(email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to find account';
      console.error('[AccountFacade] Find by email error:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'warning',
        message: errorMessage,
        details: error,
        context: 'AccountFacade.findByEmail'
      });
      return null;
    } finally {
      this.loadingState.set(false);
    }
  }

  // ============================================================================
  // Selection & State Management
  // ============================================================================

  /**
   * Select account for detail view
   *
   * @param account Account or null to deselect
   */
  selectAccount(account: Account | null): void {
    this.accountService.selectAccount(account);
    this.selectedAccountIdState.set(account?.id || null);
  }

  /**
   * Set selected account by ID
   *
   * @param accountId Account ID or null to clear
   */
  setSelectedAccountId(accountId: string | null): void {
    this.selectedAccountIdState.set(accountId);
  }

  /**
   * Reset facade state
   */
  reset(): void {
    this.accountService.reset();
    this.selectedAccountIdState.set(null);
    this.lastOperationState.set(null);
  }

  /**
   * Clear error state
   */
  clearErrors(): void {
    this.errorService.clearActiveErrors();
  }
}
