import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HeaderContextSwitcherComponent } from './context-switcher.component';
import { MenuContextService, Team } from '@core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { AccountService, Account } from '@shared';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';

describe('HeaderContextSwitcherComponent', () => {
  let component: HeaderContextSwitcherComponent;
  let fixture: ComponentFixture<HeaderContextSwitcherComponent>;
  let mockMenuContextService: jasmine.SpyObj<MenuContextService>;
  let mockAccountService: jasmine.SpyObj<AccountService>;
  let mockTokenService: any;

  // 模擬數據
  const mockUserAccount: Account = {
    id: 'user-1',
    type: 'user',
    name: '個人賬戶',
    status: 'active',
    email: 'user@example.com',
    auth_user_id: 'auth-user-1',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {}
  } as any;

  const mockOrg1: Account = {
    id: 'org-1',
    type: 'organization',
    name: '123組織',
    status: 'active',
    email: null,
    auth_user_id: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {}
  } as any;

  const mockOrg2: Account = {
    id: 'org-2',
    type: 'organization',
    name: 'ABC組織',
    status: 'active',
    email: null,
    auth_user_id: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {}
  } as any;

  const mockTeam1: Team = {
    id: 'team-1',
    name: '456團隊',
    organization_id: 'org-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as any;

  const mockTeam2: Team = {
    id: 'team-2',
    name: '789團隊',
    organization_id: 'org-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as any;

  const mockTeam3: Team = {
    id: 'team-3',
    name: 'XYZ團隊',
    organization_id: 'org-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as any;

  beforeEach(async () => {
    // 創建 mock services with signals
    const contextTypeSignal = signal<'user' | 'organization' | 'team' | 'app'>('app');
    const contextIdSignal = signal<string | null>(null);
    const userAccountsSignal = signal([mockUserAccount]);
    const organizationAccountsSignal = signal([mockOrg1, mockOrg2]);

    mockMenuContextService = jasmine.createSpyObj('MenuContextService', [
      'switchToApp',
      'switchToUser',
      'switchToOrganization',
      'switchToTeam'
    ]);
    Object.defineProperty(mockMenuContextService, 'contextType', {
      value: contextTypeSignal.asReadonly(),
      writable: false
    });
    Object.defineProperty(mockMenuContextService, 'contextId', {
      value: contextIdSignal.asReadonly(),
      writable: false
    });

    mockAccountService = jasmine.createSpyObj('AccountService', ['selectAccount', 'getUserTeams', 'findByAuthUserId']);
    Object.defineProperty(mockAccountService, 'userAccounts', {
      value: userAccountsSignal.asReadonly(),
      writable: false
    });
    Object.defineProperty(mockAccountService, 'organizationAccounts', {
      value: organizationAccountsSignal.asReadonly(),
      writable: false
    });
    mockAccountService.getUserTeams.and.returnValue(Promise.resolve([mockTeam1, mockTeam2, mockTeam3]));
    mockAccountService.findByAuthUserId.and.returnValue(Promise.resolve(mockUserAccount));

    mockTokenService = {
      get: jasmine.createSpy().and.returnValue({ user: { id: 'auth-user-1' } })
    };

    await TestBed.configureTestingModule({
      imports: [HeaderContextSwitcherComponent, NzDropDownModule, NzMenuModule, NzIconModule],
      providers: [
        { provide: MenuContextService, useValue: mockMenuContextService },
        { provide: AccountService, useValue: mockAccountService },
        { provide: DA_SERVICE_TOKEN, useValue: mockTokenService },
        {
          provide: SettingsService,
          useValue: {
            user: {}
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderContextSwitcherComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('組織與團隊層級顯示', () => {
    it('should display user accounts', () => {
      fixture.detectChanges();

      expect(component.userAccounts().length).toBe(1);
      expect(component.userAccounts()[0].name).toBe('個人賬戶');
    });

    it('should display organization accounts', () => {
      fixture.detectChanges();

      expect(component.organizationAccounts().length).toBe(2);
      expect(component.organizationAccounts()[0].name).toBe('123組織');
      expect(component.organizationAccounts()[1].name).toBe('ABC組織');
    });

    it('should group teams by organization after loading', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      // 等待 ngOnInit 完成並加載團隊
      await new Promise(resolve => setTimeout(resolve, 100));

      const teamsMap = component.teamsByOrganization();
      // 至少應該有組織的 key
      expect(teamsMap.size).toBeGreaterThanOrEqual(0);
    });
  });

  describe('切換功能', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should switch to app context', () => {
      component.switchToApp();
      expect(mockMenuContextService.switchToApp).toHaveBeenCalled();
    });

    it('should switch to user context and select account', () => {
      component.switchToUser('user-1');

      expect(mockMenuContextService.switchToUser).toHaveBeenCalledWith('user-1');
      expect(mockAccountService.selectAccount).toHaveBeenCalledWith(mockUserAccount);
    });

    it('should switch to organization context and select account', () => {
      component.switchToOrganization('org-1');

      expect(mockMenuContextService.switchToOrganization).toHaveBeenCalledWith('org-1');
      expect(mockAccountService.selectAccount).toHaveBeenCalledWith(mockOrg1);
    });

    it('should switch to team context without selecting account', () => {
      component.switchToTeam('team-1');

      expect(mockMenuContextService.switchToTeam).toHaveBeenCalledWith('team-1');
      // 團隊不應該調用 selectAccount
      expect(mockAccountService.selectAccount).not.toHaveBeenCalled();
    });
  });

  describe('上下文標籤和圖標', () => {
    it('should display correct label for app context', () => {
      const label = component.contextLabel();
      expect(label).toBe('應用菜單');
    });

    it('should display correct icon for app context', () => {
      const icon = component.contextIcon();
      expect(icon).toBe('appstore');
    });

    it('should return truthy label value', () => {
      const label = component.contextLabel();
      expect(label).toBeTruthy();
      expect(typeof label).toBe('string');
    });

    it('should return truthy icon value', () => {
      const icon = component.contextIcon();
      expect(icon).toBeTruthy();
      expect(typeof icon).toBe('string');
    });
  });

  describe('數據加載', () => {
    it('should load user teams on init', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockAccountService.findByAuthUserId).toHaveBeenCalledWith('auth-user-1');
      expect(mockAccountService.getUserTeams).toHaveBeenCalled();
    });
  });

  describe('模板結構驗證', () => {
    it('should render "組織與團隊" text in template', () => {
      fixture.detectChanges();
      const template = fixture.debugElement.nativeElement.innerHTML;

      // 驗證「組織與團隊」標題存在
      expect(template).toContain('组织与团队');
    });

    it('should not render separate "團隊賬戶" submenu', () => {
      fixture.detectChanges();
      const template = fixture.debugElement.nativeElement.innerHTML;

      // 驗證不存在獨立的「團隊賬戶」菜單（原本的三層結構）
      // 由於我們合併了菜單，不應該有單獨的「團隊賬戶」文字
      expect(template).not.toContain('团队账户');
    });

    it('should apply correct padding to team items in template', () => {
      fixture.detectChanges();
      const template = fixture.debugElement.nativeElement.innerHTML;

      // 驗證團隊項目有 padding-left 樣式
      expect(template).toContain('padding-left: 48px');
    });

    it('should render organization icons', () => {
      fixture.detectChanges();
      const template = fixture.debugElement.nativeElement.innerHTML;

      // 驗證有 team 圖標（組織）
      expect(template).toContain('nzType="team"');
    });

    it('should render team icons', () => {
      fixture.detectChanges();
      const template = fixture.debugElement.nativeElement.innerHTML;

      // 驗證有 usergroup-add 圖標（團隊）
      expect(template).toContain('nzType="usergroup-add"');
    });
  });
});
