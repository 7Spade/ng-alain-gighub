import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlueprintService, OrganizationContextService, UserService } from '@core';
import { TitleService } from '@delon/theme';
import type { BlueprintMemberWithUser, BlueprintMemberRole, UpdateBlueprintInput, User } from '@shared';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { combineLatest, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-blueprint-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class BlueprintSettingsComponent {
  // ========== 依賴注入 ==========
  private readonly blueprintService = inject(BlueprintService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly msg = inject(NzMessageService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly modal = inject(NzModalService);
  private readonly titleService = inject(TitleService);

  // ========== 路由參數處理 ==========
  private readonly parentRouteParams = toSignal(this.route.parent?.params ?? of({ org: '', slug: '' }), {
    initialValue: { org: '', slug: '' }
  });

  private readonly blueprintSlug = computed(() => this.parentRouteParams()?.['slug'] || null);

  // ========== Blueprint ID 計算 ==========
  private readonly blueprintId = toSignal(
    combineLatest([toObservable(this.orgContext.currentOrganizationId), toObservable(this.blueprintSlug)]).pipe(
      switchMap(([, slug]) => {
        if (!slug) {
          return of(null);
        }
        return from(this.getBlueprintIdBySlug()).pipe(
          catchError(error => {
            console.error('計算 Blueprint ID 失敗:', error);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  // ========== Blueprint 資料載入 ==========
  readonly blueprint = toSignal(
    toObservable(this.blueprintId).pipe(
      switchMap(blueprintId => {
        if (!blueprintId) {
          return of(null);
        }
        return from(this.blueprintService.getBlueprintById(blueprintId)).pipe(
          switchMap(({ data, error }) => {
            if (error || !data) {
              this.msg.error(error?.message || '獲取藍圖資料失敗');
              return of(null);
            }
            return of(data);
          }),
          catchError(error => {
            this.msg.error(error?.message || '載入藍圖資料失敗');
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  // ========== 載入狀態 ==========
  readonly loading = computed(() => {
    const blueprintId = this.blueprintId();
    const blueprint = this.blueprint();
    return blueprintId !== null && blueprint === null;
  });

  // ========== 組件狀態 ==========
  readonly members = signal<BlueprintMemberWithUser[]>([]);
  readonly saving = signal(false);

  // 表單
  basicForm!: FormGroup;
  memberForm!: FormGroup;

  // 標籤管理
  readonly tags = signal<string[]>([]);
  readonly tagInput = signal('');

  // 成員管理
  readonly showAddMemberModal = signal(false);
  readonly searchUserEmail = signal('');
  readonly searchResults = signal<User[]>([]);
  readonly searchingUsers = signal(false);

  // Tab 索引
  readonly selectedTabIndex = signal(0);

  constructor() {
    this.initForms();

    // 當 Blueprint 載入完成時，載入表單數據和成員列表
    effect(() => {
      const blueprint = this.blueprint();
      if (blueprint?.id) {
        this.loadSettingsData(blueprint);
      } else {
        this.members.set([]);
      }
    });
  }

  // ========== 私有方法 ==========
  /**
   * 根據路由參數獲取 Blueprint ID
   */
  private async getBlueprintIdBySlug(): Promise<string | null> {
    const params = this.parentRouteParams() ?? { org: '', slug: '' };
    const orgSlug = params['org'];
    const slug = params['slug'];

    if (!slug) {
      return null;
    }

    const isUserView = !orgSlug;

    try {
      if (isUserView) {
        const { data } = await this.blueprintService.getBlueprintBySlug(null, slug);
        return data?.id || null;
      } else {
        const org = this.orgContext.currentOrganization();
        if (!org) {
          return null;
        }
        const { data } = await this.blueprintService.getBlueprintBySlug(org.id, slug);
        return data?.id || null;
      }
    } catch (error) {
      console.error('獲取 Blueprint ID 失敗:', error);
      return null;
    }
  }

  /**
   * 載入設定資料
   */
  private async loadSettingsData(blueprint: any): Promise<void> {
    this.titleService.setTitle(`${blueprint.name} - 設定 - 藍圖`);

    // 載入表單數據
    this.basicForm.patchValue({
      name: blueprint.name,
      slug: blueprint.slug,
      description: blueprint.description || '',
      site_location: blueprint.site_location || '',
      current_stage: blueprint.current_stage || '',
      is_private: blueprint.is_private ?? false,
      status: blueprint.status || 'planning',
      start_date: blueprint.start_date ? new Date(blueprint.start_date) : null,
      end_date: blueprint.end_date ? new Date(blueprint.end_date) : null
    });
    this.tags.set(blueprint.tags || []);

    // 載入成員列表
    await this.loadMembers();
  }

  private async refreshBlueprintData(blueprintId: string): Promise<void> {
    const { data, error } = await this.blueprintService.getBlueprintById(blueprintId);
    if (error) {
      this.msg.warning(error.message || '重新載入藍圖資料失敗');
      return;
    }

    if (data) {
      await this.loadSettingsData(data);
    }
  }

  /**
   * 載入成員列表
   */
  private async loadMembers(): Promise<void> {
    const blueprintId = this.blueprintId();
    if (!blueprintId) return;

    const { data: members, error } = await this.blueprintService.getBlueprintMembers(blueprintId);
    if (error) {
      this.msg.warning(error.message || '獲取成員列表失敗');
    } else {
      this.members.set(members || []);
    }
  }

  private initForms(): void {
    this.basicForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/), Validators.maxLength(100)]],
      description: [''],
      site_location: [''],
      current_stage: [''],
      is_private: [false],
      status: ['planning', [Validators.required]],
      start_date: [null],
      end_date: [null]
    });

    this.memberForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
      role: ['member', [Validators.required]]
    });
  }

  // ========== 公開方法 ==========
  async onSubmitBasic(): Promise<void> {
    if (this.basicForm.invalid) {
      Object.values(this.basicForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const blueprintId = this.blueprintId();
    if (!blueprintId) {
      this.msg.error('無法獲取藍圖 ID');
      return;
    }

    this.saving.set(true);

    try {
      const formValue = this.basicForm.value;
      const input: UpdateBlueprintInput = {
        name: formValue.name,
        slug: formValue.slug,
        description: formValue.description || undefined,
        site_location: formValue.site_location || undefined,
        current_stage: formValue.current_stage || undefined,
        is_private: formValue.is_private ?? false,
        status: formValue.status,
        start_date: formValue.start_date ? new Date(formValue.start_date).toISOString() : undefined,
        end_date: formValue.end_date ? new Date(formValue.end_date).toISOString() : undefined,
        tags: this.tags().length > 0 ? this.tags() : undefined
      };

      const { error } = await this.blueprintService.updateBlueprint(blueprintId, input);
      if (error) {
        this.msg.error(error.message || '更新藍圖失敗');
        return;
      }

      this.msg.success('藍圖設定已更新');
      await this.refreshBlueprintData(blueprintId);
    } finally {
      this.saving.set(false);
    }
  }

  async onAddMember(): Promise<void> {
    if (this.memberForm.invalid) {
      Object.values(this.memberForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const blueprintId = this.blueprintId();
    if (!blueprintId) {
      this.msg.error('無法獲取藍圖 ID');
      return;
    }

    // 先搜索用戶
    await this.searchUsers();

    if (this.searchResults().length === 0) {
      this.msg.warning('未找到該用戶，請確認電子郵件地址');
      return;
    }

    const user = this.searchResults()[0];
    const formValue = this.memberForm.value;

    // 檢查是否已經是成員
    const existingMember = this.members().find(m => m.user_id === user.id);
    if (existingMember) {
      this.msg.warning('該用戶已經是成員');
      return;
    }

    const { error } = await this.blueprintService.addBlueprintMember(blueprintId, user.id, formValue.role as BlueprintMemberRole);

    if (error) {
      this.msg.error(error.message || '添加成員失敗');
      return;
    }

    this.msg.success('成員已添加');
    this.showAddMemberModal.set(false);
    this.memberForm.reset();
    this.searchResults.set([]);
    await this.loadMembers();
  }

  async searchUsers(): Promise<void> {
    const email = this.memberForm.get('user_email')?.value;
    if (!email) return;

    this.searchingUsers.set(true);

    try {
      // 使用 UserService 根據電子郵件搜索用戶
      const { data: user, error } = await this.userService.getUserByEmail(email);
      if (error || !user) {
        this.searchResults.set([]);
        if (error) {
          console.debug('搜索用戶失敗:', error);
        }
      } else {
        this.searchResults.set([user]);
      }
    } catch (error) {
      console.error('搜索用戶時發生錯誤:', error);
      this.searchResults.set([]);
    } finally {
      this.searchingUsers.set(false);
    }
  }

  async updateMemberRole(memberId: string, role: BlueprintMemberRole): Promise<void> {
    const { error } = await this.blueprintService.updateBlueprintMemberRole(memberId, role);
    if (error) {
      this.msg.error(error.message || '更新成員角色失敗');
      return;
    }
    this.msg.success('成員角色已更新');
    await this.loadMembers();
  }

  async removeMember(memberId: string): Promise<void> {
    const { error } = await this.blueprintService.removeBlueprintMember(memberId);
    if (error) {
      this.msg.error(error.message || '移除成員失敗');
      return;
    }
    this.msg.success('成員已移除');
    await this.loadMembers();
  }

  async deleteBlueprint(): Promise<void> {
    const blueprint = this.blueprint();
    if (!blueprint) return;

    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除藍圖「${blueprint.name}」嗎？此操作無法撤銷。`,
      nzOkText: '確認刪除',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: '取消',
      nzOnOk: async () => {
        const { error } = await this.blueprintService.deleteBlueprint(blueprint.id);
        if (error) {
          this.msg.error(error.message || '刪除藍圖失敗');
          return;
        }
        this.msg.success('藍圖已刪除');
        this.router.navigate(['/blueprint/list']);
      }
    });
  }

  addTag(): void {
    const tag = this.tagInput().trim();
    if (tag && !this.tags().includes(tag)) {
      this.tags.update(tags => [...tags, tag]);
      this.tagInput.set('');
    }
  }

  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  getRoleText(role: string): string {
    const texts: Record<string, string> = {
      owner: '擁有者',
      manager: '管理者',
      member: '成員',
      viewer: '查看者'
    };
    return texts[role] || role;
  }

  getRoleColor(role: string): string {
    const colors: Record<string, string> = {
      owner: 'red',
      manager: 'orange',
      member: 'blue',
      viewer: 'default'
    };
    return colors[role] || 'default';
  }

  openAddMemberModal(): void {
    this.showAddMemberModal.set(true);
    this.memberForm.reset({
      user_email: '',
      role: 'member'
    });
    this.searchResults.set([]);
  }
}
