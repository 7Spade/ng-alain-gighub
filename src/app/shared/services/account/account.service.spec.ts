import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AccountRepository } from '@core';
import { AccountService } from './account.service';
import { Account, AccountType, AccountStatus } from '@shared';

describe('AccountService', () => {
  let service: AccountService;
  let repository: jasmine.SpyObj<AccountRepository>;

  const mockAccount: Account = {
    id: 'account-1',
    auth_user_id: 'auth-user-1',
    type: AccountType.USER,
    name: 'Test User',
    email: 'test@example.com',
    avatar_url: null,
    status: AccountStatus.ACTIVE,
    metadata: {},
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  } as Account;

  const mockAccounts: Account[] = [
    mockAccount,
    {
      ...mockAccount,
      id: 'account-2',
      type: AccountType.ORGANIZATION,
      name: 'Test Organization',
      status: AccountStatus.INACTIVE
    }
  ];

  beforeEach(() => {
    const repositorySpy = jasmine.createSpyObj('AccountRepository', [
      'findAll',
      'findById',
      'findByType',
      'findByStatus',
      'findByAuthUserId',
      'findByEmail',
      'create',
      'update',
      'delete'
    ]);

    TestBed.configureTestingModule({
      providers: [AccountService, { provide: AccountRepository, useValue: repositorySpy }]
    });

    service = TestBed.inject(AccountService);
    repository = TestBed.inject(AccountRepository) as jasmine.SpyObj<AccountRepository>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have empty accounts', () => {
      expect(service.accounts().length).toBe(0);
    });

    it('should have null selected account', () => {
      expect(service.selectedAccount()).toBeNull();
    });

    it('should have false loading state', () => {
      expect(service.loading()).toBe(false);
    });

    it('should have null error state', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('loadAccounts', () => {
    it('should load accounts successfully', async () => {
      repository.findAll.and.returnValue(of(mockAccounts));

      await service.loadAccounts();

      expect(service.accounts().length).toBe(2);
      expect(service.accounts()[0].id).toBe('account-1');
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should set loading state during load', async () => {
      repository.findAll.and.returnValue(of(mockAccounts));

      const loadPromise = service.loadAccounts();
      expect(service.loading()).toBe(true);

      await loadPromise;
      expect(service.loading()).toBe(false);
    });

    it('should handle error when loading fails', async () => {
      const error = new Error('Load failed');
      repository.findAll.and.returnValue(throwError(() => error));

      try {
        await service.loadAccounts();
        fail('should have thrown error');
      } catch (e) {
        expect(service.error()).toBe('Load failed');
        expect(service.loading()).toBe(false);
      }
    });
  });

  describe('loadAccountById', () => {
    it('should load account by id successfully', async () => {
      repository.findById.and.returnValue(of(mockAccount));

      const result = await service.loadAccountById('account-1');

      expect(result).toEqual(mockAccount);
      expect(service.selectedAccount()).toEqual(mockAccount);
      expect(service.loading()).toBe(false);
    });

    it('should return null when account not found', async () => {
      repository.findById.and.returnValue(of(null));

      const result = await service.loadAccountById('non-existent');

      expect(result).toBeNull();
      expect(service.selectedAccount()).toBeNull();
    });

    it('should handle error when loading by id fails', async () => {
      const error = new Error('Not found');
      repository.findById.and.returnValue(throwError(() => error));

      try {
        await service.loadAccountById('account-1');
        fail('should have thrown error');
      } catch (e) {
        expect(service.error()).toBe('Not found');
      }
    });
  });

  describe('loadAccountsByType', () => {
    it('should load accounts by type', async () => {
      repository.findByType.and.returnValue(of([mockAccount]));

      const result = await service.loadAccountsByType(AccountType.USER);

      expect(result.length).toBe(1);
      expect(repository.findByType).toHaveBeenCalledWith(AccountType.USER);
    });
  });

  describe('loadAccountsByStatus', () => {
    it('should load accounts by status', async () => {
      repository.findByStatus.and.returnValue(of([mockAccount]));

      const result = await service.loadAccountsByStatus(AccountStatus.ACTIVE);

      expect(result.length).toBe(1);
      expect(repository.findByStatus).toHaveBeenCalledWith(AccountStatus.ACTIVE);
    });
  });

  describe('createAccount', () => {
    it('should create account successfully', async () => {
      const newAccount = { ...mockAccount, id: 'account-new' };
      repository.create.and.returnValue(of(newAccount));

      const result = await service.createAccount({
        type: AccountType.USER,
        name: 'New User',
        email: 'new@example.com'
      });

      expect(result).toEqual(newAccount);
      expect(service.accounts().length).toBe(1);
      expect(service.accounts()[0].id).toBe('account-new');
    });

    it('should handle error when creating fails', async () => {
      const error = new Error('Create failed');
      repository.create.and.returnValue(throwError(() => error));

      try {
        await service.createAccount({
          type: AccountType.USER,
          name: 'New User',
          email: 'new@example.com'
        });
        fail('should have thrown error');
      } catch (e) {
        expect(service.error()).toBe('Create failed');
      }
    });
  });

  describe('updateAccount', () => {
    beforeEach(() => {
      service['accountsState'].set(mockAccounts);
    });

    it('should update account successfully', async () => {
      const updated = { ...mockAccount, name: 'Updated Name' };
      repository.update.and.returnValue(of(updated));

      const result = await service.updateAccount('account-1', { name: 'Updated Name' });

      expect(result).toEqual(updated);
      expect(service.accounts()[0].name).toBe('Updated Name');
    });

    it('should update selected account if it matches', async () => {
      service.selectAccount(mockAccount);
      const updated = { ...mockAccount, name: 'Updated Name' };
      repository.update.and.returnValue(of(updated));

      await service.updateAccount('account-1', { name: 'Updated Name' });

      expect(service.selectedAccount()?.name).toBe('Updated Name');
    });

    it('should handle error when updating fails', async () => {
      const error = new Error('Update failed');
      repository.update.and.returnValue(throwError(() => error));

      try {
        await service.updateAccount('account-1', { name: 'Updated' });
        fail('should have thrown error');
      } catch (e) {
        expect(service.error()).toBe('Update failed');
      }
    });
  });

  describe('deleteAccount', () => {
    beforeEach(() => {
      service['accountsState'].set(mockAccounts);
    });

    it('should delete account successfully', async () => {
      repository.delete.and.returnValue(of(undefined));

      await service.deleteAccount('account-1');

      expect(service.accounts().length).toBe(1);
      expect(service.accounts()[0].id).toBe('account-2');
    });

    it('should clear selected account if deleted', async () => {
      service.selectAccount(mockAccount);
      repository.delete.and.returnValue(of(undefined));

      await service.deleteAccount('account-1');

      expect(service.selectedAccount()).toBeNull();
    });

    it('should handle error when deleting fails', async () => {
      const error = new Error('Delete failed');
      repository.delete.and.returnValue(throwError(() => error));

      try {
        await service.deleteAccount('account-1');
        fail('should have thrown error');
      } catch (e) {
        expect(service.error()).toBe('Delete failed');
      }
    });
  });

  describe('selectAccount', () => {
    it('should select account', () => {
      service.selectAccount(mockAccount);

      expect(service.selectedAccount()).toEqual(mockAccount);
    });

    it('should clear selection when null', () => {
      service.selectAccount(mockAccount);
      service.selectAccount(null);

      expect(service.selectedAccount()).toBeNull();
    });
  });

  describe('findByAuthUserId', () => {
    it('should find account by auth user id', async () => {
      repository.findByAuthUserId.and.returnValue(of(mockAccount));

      const result = await service.findByAuthUserId('auth-user-1');

      expect(result).toEqual(mockAccount);
      expect(repository.findByAuthUserId).toHaveBeenCalledWith('auth-user-1');
    });
  });

  describe('findByEmail', () => {
    it('should find account by email', async () => {
      repository.findByEmail.and.returnValue(of(mockAccount));

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockAccount);
      expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('reset', () => {
    it('should reset all state', () => {
      service['accountsState'].set(mockAccounts);
      service.selectAccount(mockAccount);
      service['errorState'].set('Some error');

      service.reset();

      expect(service.accounts().length).toBe(0);
      expect(service.selectedAccount()).toBeNull();
      expect(service.error()).toBeNull();
    });
  });

  describe('Computed signals', () => {
    beforeEach(() => {
      service['accountsState'].set(mockAccounts);
    });

    it('should compute activeAccounts', () => {
      expect(service.activeAccounts().length).toBe(1);
      expect(service.activeAccounts()[0].status).toBe(AccountStatus.ACTIVE);
    });

    it('should compute userAccounts', () => {
      expect(service.userAccounts().length).toBe(1);
      expect(service.userAccounts()[0].type).toBe(AccountType.USER);
    });

    it('should compute organizationAccounts', () => {
      expect(service.organizationAccounts().length).toBe(1);
      expect(service.organizationAccounts()[0].type).toBe(AccountType.ORGANIZATION);
    });
  });
});

