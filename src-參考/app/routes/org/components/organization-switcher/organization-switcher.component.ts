import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, OnInit, signal, input, output } from '@angular/core';
import { OrganizationContextService, OrganizationService, UserService } from '@core';
import type { Organization, User } from '@shared';
import { SHARED_IMPORTS } from '@shared';
import { NzModalService } from 'ng-zorro-antd/modal';

import { CreateOrganizationModalComponent } from '../create-organization-modal/create-organization-modal.component';

@Component({
  selector: 'app-organization-switcher',
  standalone: true,
  template: `
    @if (variant() === 'header') {
      <!-- Header 模式 -->
      <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomLeft" [nzDropdownMenu]="orgMenu">
        <nz-avatar
          [nzSrc]="currentAvatar()"
          [nzText]="currentAvatar() ? '' : currentName().charAt(0).toUpperCase()"
          nzSize="small"
          class="mr-sm"
        />
        <span class="organization-name">{{ currentName() }}</span>
        <i nz-icon nzType="down" class="ml-xs"></i>
      </div>
      <nz-dropdown-menu #orgMenu="nzDropdownMenu">
        <div nz-menu class="organization-menu">
          <!-- 用戶視角 -->
          <div nz-menu-item [class.active]="isUserView()" (click)="switchToUserView()">
            <div class="d-flex align-items-center">
              <nz-avatar
                [nzSrc]="user()?.avatar_url ?? undefined"
                [nzText]="(user()?.display_name || user()?.email || 'U').charAt(0).toUpperCase()"
                nzSize="small"
                class="mr-sm"
              />
              <div class="flex-1">
                <div class="font-weight-bold">{{ user()?.display_name || user()?.email || 'User' }}</div>
                <div class="text-muted text-sm">個人視角</div>
              </div>
              @if (isUserView()) {
                <i nz-icon nzType="check" class="text-primary"></i>
              }
            </div>
          </div>

          <li nz-menu-divider></li>

          <!-- 組織列表 -->
          <div class="px-md py-sm text-muted text-sm">組織</div>
          @if (loading()) {
            <div class="text-center py-md">
              <nz-spin nzSimple [nzSize]="'small'"></nz-spin>
            </div>
          } @else {
            @for (org of organizations(); track org.id) {
              <div nz-menu-item [class.active]="currentOrganizationId() === org.id" (click)="switchToOrganization(org.id)">
                <div class="d-flex align-items-center">
                  <nz-avatar
                    [nzSrc]="org.avatar_url ?? undefined"
                    [nzText]="org.name.charAt(0).toUpperCase()"
                    nzSize="small"
                    class="mr-sm"
                  />
                  <div class="flex-1">
                    <div class="font-weight-bold">{{ org.name }}</div>
                    <div class="text-muted text-sm">{{ org.slug }}</div>
                  </div>
                  @if (currentOrganizationId() === org.id) {
                    <i nz-icon nzType="check" class="text-primary"></i>
                  }
                </div>
              </div>
            } @empty {
              <div class="px-md py-sm text-muted text-sm text-center">尚無組織</div>
            }
          }

          <li nz-menu-divider></li>

          <!-- 創建組織 -->
          <div nz-menu-item routerLink="/pro/organizations/new">
            <i nz-icon nzType="plus" class="mr-sm"></i>
            <span>建立組織</span>
          </div>
        </div>
      </nz-dropdown-menu>
    } @else {
      <!-- Sidebar 模式 -->
      <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="orgMenu" class="alain-default__aside-user">
        <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="currentAvatar()" [nzText]="currentName().charAt(0).toUpperCase()" />
        <div class="alain-default__aside-user-info">
          <strong>{{ currentName() }}</strong>
          <p class="mb0">{{ currentEmail() }}</p>
        </div>
      </div>
      <nz-dropdown-menu #orgMenu="nzDropdownMenu">
        <div nz-menu class="user-menu" style="min-width: 200px;">
          <!-- 用戶視角 -->
          <div nz-menu-item [class.active]="isUserView()" (click)="switchToUserView()">
            <i nz-icon nzType="user" class="mr-sm"></i>
            <span>個人視角</span>
            @if (isUserView()) {
              <i nz-icon nzType="check" class="ml-auto text-primary"></i>
            }
          </div>

          <li nz-menu-divider></li>

          <!-- 組織列表 -->
          <div class="px-md py-sm text-muted text-sm">組織</div>
          @if (loading()) {
            <div class="text-center py-md">
              <nz-spin nzSimple [nzSize]="'small'"></nz-spin>
            </div>
          } @else {
            @for (org of organizations(); track org.id) {
              <div nz-menu-item [class.active]="currentOrganizationId() === org.id" (click)="switchToOrganization(org.id)">
                <i nz-icon nzType="team" class="mr-sm"></i>
                <span>{{ org.name }}</span>
                @if (currentOrganizationId() === org.id) {
                  <i nz-icon nzType="check" class="ml-auto text-primary"></i>
                }
              </div>
            } @empty {
              <div class="px-md py-sm text-muted text-sm text-center">尚無組織</div>
            }
          }

          <li nz-menu-divider></li>

          <!-- 建立/管理組織 -->
          @if (isUserView()) {
            <div nz-menu-item (click)="openCreateOrganizationModal()">
              <i nz-icon nzType="plus" class="mr-sm"></i>
              <span>建立組織</span>
            </div>
          } @else {
            <div nz-menu-item [routerLink]="['/org', currentOrganization()?.slug || currentOrganizationId(), 'settings']">
              <i nz-icon nzType="setting" class="mr-sm"></i>
              <span>管理組織</span>
            </div>
            <div nz-menu-item (click)="openCreateOrganizationModal()">
              <i nz-icon nzType="plus" class="mr-sm"></i>
              <span>建立組織</span>
            </div>
          }
        </div>
      </nz-dropdown-menu>
    }
  `,
  styles: [
    `
      .organization-name {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .organization-menu {
        min-width: 280px;
        max-height: 400px;
        overflow-y: auto;
      }

      .organization-menu [nz-menu-item].active {
        background-color: rgba(22, 119, 255, 0.08);
      }

      .organization-menu [nz-menu-item] {
        padding: 12px 16px;
      }

      /* Sidebar 模式樣式 */
      .user-menu {
        min-width: 200px;
      }

      .user-menu [nz-menu-item].active {
        background-color: rgba(22, 119, 255, 0.08);
      }

      .ml-auto {
        margin-left: auto;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class OrganizationSwitcherComponent implements OnInit {
  private readonly orgContext = inject(OrganizationContextService);
  private readonly orgService = inject(OrganizationService);
  private readonly userService = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly modal = inject(NzModalService);

  readonly variant = input<'header' | 'sidebar'>('header');
  readonly organizationChanged = output<void>();
  readonly organizationCreated = output<void>();

  readonly currentOrganizationId = this.orgContext.currentOrganizationId;
  readonly currentOrganization = this.orgContext.currentOrganization;
  readonly isUserView = this.orgContext.isUserView;

  readonly organizations = signal<Organization[]>([]);
  readonly user = signal<User | null>(null);
  readonly loading = signal(false);

  readonly currentName = computed(() => {
    if (this.isUserView()) {
      return this.user()?.display_name || this.user()?.email || 'User';
    }
    return this.currentOrganization()?.name || '';
  });

  readonly currentAvatar = computed(() => {
    if (this.isUserView()) {
      return this.user()?.avatar_url ?? undefined;
    }
    return this.currentOrganization()?.avatar_url ?? undefined;
  });

  readonly currentEmail = computed(() => {
    if (this.isUserView()) {
      return this.user()?.email || '';
    }
    const org = this.currentOrganization();
    return org?.name || '';
  });

  ngOnInit(): void {
    this.loadUser();
    this.loadOrganizations();
  }

  private async loadUser(): Promise<void> {
    const { data } = await this.userService.getCurrentUser();
    if (data) {
      this.user.set(data);
      this.cdr.detectChanges();
    }
  }

  private async loadOrganizations(): Promise<void> {
    this.loading.set(true);
    this.cdr.detectChanges();
    const { data } = await this.orgService.getMyOrganizations();
    this.organizations.set(data || []);
    this.loading.set(false);
    this.cdr.detectChanges();
  }

  switchToUserView(): void {
    this.orgContext.switchToUserView();
    // TODO: The 'emit' function requires a mandatory void argument
    this.organizationChanged.emit();
    this.cdr.detectChanges();
  }

  async switchToOrganization(organizationId: string): Promise<void> {
    await this.orgContext.switchToOrganization(organizationId);
    // TODO: The 'emit' function requires a mandatory void argument
    this.organizationChanged.emit();
    this.cdr.detectChanges();
  }

  openCreateOrganizationModal(): void {
    const modalRef = this.modal.create({
      nzTitle: '',
      nzContent: CreateOrganizationModalComponent,
      nzWidth: 600,
      nzFooter: null,
      nzClosable: true
    });
    modalRef.afterClose.subscribe(() => {
      this.loadOrganizations();
      // TODO: The 'emit' function requires a mandatory void argument
      this.organizationCreated.emit();
    });
  }
}
