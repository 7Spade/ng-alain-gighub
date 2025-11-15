import { AfterViewInit, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountService, AccountType, SHARED_IMPORTS } from '@shared';

/**
 * 账户选择器组件
 *
 * 用于选择蓝图拥有者（个人账户或组织账户）
 */
@Component({
  selector: 'app-account-selector',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <nz-form-item>
      <nz-form-label [nzSpan]="labelSpan()" [nzRequired]="required()">拥有者</nz-form-label>
      <nz-form-control [nzSpan]="controlSpan()" [nzErrorTip]="errorTip()">
        <!-- 拥有者类型选择 -->
        <nz-radio-group [(ngModel)]="ownerType" (ngModelChange)="onOwnerTypeChange()" style="margin-bottom: 8px;">
          <label nz-radio [nzValue]="'user'">
            <span nz-icon nzType="user"></span>
            个人账户
          </label>
          <label nz-radio [nzValue]="'organization'">
            <span nz-icon nzType="team"></span>
            组织账户
          </label>
        </nz-radio-group>

        <!-- 账户选择器 -->
        @if (ownerType() === 'user') {
          <nz-select
            [ngModel]="selectedAccountId()"
            (ngModelChange)="onAccountChange($event)"
            nzPlaceHolder="选择个人账户"
            [nzLoading]="accountService.loading()"
            style="width: 100%;"
            [nzDisabled]="disabled()"
          >
            @for (account of userAccounts(); track account.id) {
              <nz-option [nzValue]="account.id" [nzLabel]="account.name">
                <span>
                  <span nz-icon nzType="user" style="margin-right: 4px;"></span>
                  {{ account.name }}
                  @if (account.email) {
                    <span style="color: #999; margin-left: 8px;">({{ account.email }})</span>
                  }
                </span>
              </nz-option>
            }
          </nz-select>
          @if (userAccounts().length === 0 && !accountService.loading()) {
            <nz-alert
              nzType="warning"
              nzMessage="未找到个人账户"
              nzDescription="请先创建个人账户或联系管理员"
              nzShowIcon
              style="margin-top: 8px;"
            ></nz-alert>
          }
        } @else {
          <nz-select
            [ngModel]="selectedAccountId()"
            (ngModelChange)="onAccountChange($event)"
            nzPlaceHolder="选择组织账户"
            [nzLoading]="accountService.loading()"
            style="width: 100%;"
            [nzDisabled]="disabled()"
          >
            @for (org of organizationAccounts(); track org.id) {
              <nz-option [nzValue]="org.id" [nzLabel]="org.name">
                <span>
                  <span nz-icon nzType="team" style="margin-right: 4px;"></span>
                  {{ org.name }}
                </span>
              </nz-option>
            }
          </nz-select>
          @if (organizationAccounts().length === 0 && !accountService.loading()) {
            <nz-alert
              nzType="info"
              nzMessage="未找到组织账户"
              nzDescription="您可以创建组织账户或选择个人账户作为拥有者"
              nzShowIcon
              style="margin-top: 8px;"
            ></nz-alert>
          }
        }

        <!-- 帮助文本 -->
        @if (helpText()) {
          <div style="color: #999; font-size: 12px; margin-top: 4px;">
            {{ helpText() }}
          </div>
        }
      </nz-form-control>
    </nz-form-item>
  `
})
export class AccountSelectorComponent implements OnInit, AfterViewInit {
  accountService = inject(AccountService);

  // Inputs
  labelSpan = input<number>(4);
  controlSpan = input<number>(20);
  required = input<boolean>(true);
  errorTip = input<string>('请选择拥有者');
  helpText = input<string | null>(null);
  disabled = input<boolean>(false);
  initialValue = input<string | null>(null);

  // Outputs
  accountChange = output<string>();

  // Internal state
  ownerType = signal<'user' | 'organization'>('user');
  selectedAccountId = signal<string>('');

  // Computed
  userAccounts = computed(() => this.accountService.userAccounts());
  organizationAccounts = computed(() => this.accountService.organizationAccounts());

  async ngOnInit(): Promise<void> {
    // 加载账户列表
    await this.accountService.loadAccounts();

    // 如果有初始值，使用初始值
    if (this.initialValue()) {
      const account = this.accountService.accounts().find(a => a.id === this.initialValue());
      if (account) {
        if (account.type === AccountType.USER) {
          this.ownerType.set('user');
        } else if (account.type === AccountType.ORGANIZATION) {
          this.ownerType.set('organization');
        }
        this.selectedAccountId.set(account.id);
        return;
      }
    }

    // 设置默认值（延迟到视图初始化后）
  }

  ngAfterViewInit(): void {
    // 在视图初始化后设置默认值，确保父组件已准备好接收事件
    // 使用更长的延迟，确保Angular变更检测完成
    setTimeout(() => {
      this.setDefaultValue();
    }, 100);
  }

  private async setDefaultValue(): Promise<void> {
    const userAccounts = this.userAccounts();
    const orgAccounts = this.organizationAccounts();

    // 优先选择个人账户
    if (userAccounts.length > 0) {
      this.ownerType.set('user');
      this.selectedAccountId.set(userAccounts[0].id);
      // 延迟触发事件，确保父组件已准备好
      setTimeout(() => {
        this.accountChange.emit(userAccounts[0].id);
      }, 0);
    }
    // 如果只有一个组织，自动选择组织
    else if (orgAccounts.length === 1) {
      this.ownerType.set('organization');
      this.selectedAccountId.set(orgAccounts[0].id);
      // 延迟触发事件，确保父组件已准备好
      setTimeout(() => {
        this.accountChange.emit(orgAccounts[0].id);
      }, 0);
    }
    // 如果有多个组织，默认选择组织类型，但不自动选择
    else if (orgAccounts.length > 1) {
      this.ownerType.set('organization');
    }
  }

  onOwnerTypeChange(): void {
    // 切换类型时自动选择第一个账户
    if (this.ownerType() === 'user') {
      const userAccounts = this.userAccounts();
      if (userAccounts.length > 0) {
        this.selectedAccountId.set(userAccounts[0].id);
        this.accountChange.emit(userAccounts[0].id);
      } else {
        this.selectedAccountId.set('');
        this.accountChange.emit('');
      }
    } else {
      const orgAccounts = this.organizationAccounts();
      if (orgAccounts.length > 0) {
        this.selectedAccountId.set(orgAccounts[0].id);
        this.accountChange.emit(orgAccounts[0].id);
      } else {
        this.selectedAccountId.set('');
        this.accountChange.emit('');
      }
    }
  }

  onAccountChange(accountId: string): void {
    this.selectedAccountId.set(accountId);
    this.accountChange.emit(accountId);
  }

  /**
   * 获取当前选中的账户ID（供父组件使用）
   */
  getSelectedAccountId(): string {
    return this.selectedAccountId();
  }

  /**
   * 设置选中的账户ID（供父组件使用）
   */
  setSelectedAccountId(accountId: string): void {
    const account = this.accountService.accounts().find(a => a.id === accountId);
    if (account) {
      if (account.type === AccountType.USER) {
        this.ownerType.set('user');
      } else if (account.type === AccountType.ORGANIZATION) {
        this.ownerType.set('organization');
      }
      this.selectedAccountId.set(accountId);
    }
  }
}
