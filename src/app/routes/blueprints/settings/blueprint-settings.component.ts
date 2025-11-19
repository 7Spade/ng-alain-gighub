import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, BlueprintService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface SettingTab {
  readonly key: string;
  readonly title: string;
  readonly description: string;
}

interface Reviewer {
  readonly name: string;
  readonly role: string;
  readonly availability: string;
}

@Component({
  selector: 'app-blueprint-settings',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="blueprint() ? blueprint()!.name + ' - 藍圖設定' : '藍圖設定'">
      <ng-template #breadcrumb>
        <nz-breadcrumb>
          <nz-breadcrumb-item>
            <a routerLink="/blueprints">藍圖列表</a>
          </nz-breadcrumb-item>
          @if (blueprint()) {
            <nz-breadcrumb-item>
              <a [routerLink]="['/blueprints', blueprint()!.id]">{{ blueprint()!.name }}</a>
            </nz-breadcrumb-item>
          }
          <nz-breadcrumb-item>設定</nz-breadcrumb-item>
        </nz-breadcrumb>
      </ng-template>
      <ng-template #extra>
        <button nz-button nzType="default" (click)="viewVersions()" style="margin-right: 8px;">
          <span nz-icon nzType="history"></span>
          查看版本
        </button>
        <button nz-button nzType="primary" (click)="quickSave()" [nzLoading]="saving()">
          <span nz-icon nzType="save"></span>
          快速儲存
        </button>
      </ng-template>
    </page-header>

    <div class="page-section">
      @if (blueprintService.loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else if (blueprintService.error()) {
        <nz-alert
          nzType="error"
          [nzMessage]="'載入失敗'"
          [nzDescription]="blueprintService.error()"
          nzShowIcon
          style="margin: 16px;"
        ></nz-alert>
      } @else if (blueprint()) {
        <nz-card nzTitle="設定面板" class="section-card">
          <nz-tabset nzTabPosition="top" nzType="line">
            @for (tab of settingTabs; track tab.key) {
              <nz-tab [nzTitle]="tab.title">
                <p class="tab-description">{{ tab.description }}</p>

                <form nz-form nzLayout="vertical" class="settings-form" [formGroup]="getFormGroup(tab.key)">
                  <nz-form-item>
                    <nz-form-label>名稱</nz-form-label>
                    <nz-form-control>
                      <input nz-input [formControlName]="'name'" [placeholder]="'輸入 ' + tab.title + ' 名稱'" />
                    </nz-form-control>
                  </nz-form-item>

                  <nz-form-item>
                    <nz-form-label>描述</nz-form-label>
                    <nz-form-control>
                      <textarea nz-input rows="3" [formControlName]="'description'" placeholder="補充說明／適用範圍"></textarea>
                    </nz-form-control>
                  </nz-form-item>

                  <nz-form-item>
                    <nz-form-label>責任群組</nz-form-label>
                    <nz-form-control>
                      <nz-select nzMode="multiple" nzPlaceHolder="選擇群組" [formControlName]="'groups'">
                        <nz-option nzValue="owner" nzLabel="Owner Guild"></nz-option>
                        <nz-option nzValue="reviewer" nzLabel="Reviewer Squad"></nz-option>
                        <nz-option nzValue="ops" nzLabel="Ops Support"></nz-option>
                      </nz-select>
                    </nz-form-control>
                  </nz-form-item>

                  <div class="actions">
                    <button nz-button nzType="default" (click)="saveDraft(tab.key)">草稿</button>
                    <button nz-button nzType="primary" (click)="saveSettings(tab.key)"> 儲存 {{ tab.title }} </button>
                  </div>
                </form>
              </nz-tab>
            }
          </nz-tabset>
        </nz-card>

        <nz-card nzTitle="預設審核人" class="section-card">
          <nz-list [nzDataSource]="reviewers" nzItemLayout="horizontal">
            <ng-template #renderItem let-item>
              <nz-list-item>
                <nz-list-item-meta
                  nzAvatar="https://gw.alipayobjects.com/zos/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  [nzTitle]="item.name"
                  [nzDescription]="item.role"
                ></nz-list-item-meta>
                <div class="availability">
                  <span nz-typography>{{ item.availability }}</span>
                  <button nz-button nzType="link" (click)="adjustReviewer(item)">調整</button>
                </div>
              </nz-list-item>
            </ng-template>
          </nz-list>
        </nz-card>
      } @else {
        <nz-empty nzNotFoundContent="藍圖不存在"></nz-empty>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page-section {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .section-card {
        margin-bottom: 0;
      }

      .tab-description {
        color: rgba(0, 0, 0, 0.55);
        margin-bottom: 16px;
      }

      .settings-form {
        max-width: 520px;
      }

      .actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .availability {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlueprintSettingsComponent implements OnInit {
  blueprintService = inject(BlueprintService);
  accountService = inject(AccountService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);
  fb = inject(FormBuilder);

  blueprintId = signal<string>('');
  saving = signal<boolean>(false);

  // 表单组
  metadataForm = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  permissionsForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    groups: [[] as string[]]
  });

  automationForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    groups: [[] as string[]]
  });

  protected readonly settingTabs: SettingTab[] = [
    { key: 'metadata', title: '基本資訊', description: '維護藍圖名稱、說明與主要負責人。' },
    { key: 'permissions', title: '權限策略', description: '設定可訪問與提交變更的成員群組。' },
    { key: 'automation', title: '自動化任務', description: '定義分支同步、審核提醒與合併策略。' }
  ];

  protected readonly reviewers: Reviewer[] = [
    { name: 'Evelyn', role: '流程審核', availability: '每日 10:00 - 18:00' },
    { name: 'Howard', role: '主分支維運', availability: '專案期間全時段' },
    { name: 'Lucas', role: 'DevOps', availability: '需提前預約' }
  ];

  // 计算蓝图信息
  readonly blueprint = computed(() => this.blueprintService.selectedBlueprint());

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    if (!id) {
      this.message.error('藍圖ID不存在');
      this.router.navigate(['/blueprints']);
      return;
    }
    this.blueprintId.set(id);
    this.loadBlueprint();
    this.loadConfigs();
  }

  async loadBlueprint(): Promise<void> {
    const id = this.blueprintId();
    if (!id) return;

    try {
      await this.blueprintService.loadBlueprintById(id);
      const blueprint = this.blueprint();
      if (blueprint) {
        // 填充表单
        this.metadataForm.patchValue({
          name: blueprint.name || '',
          description: blueprint.description || ''
        });
      }
    } catch (error) {
      this.message.error('載入藍圖失敗');
    }
  }

  async loadConfigs(): Promise<void> {
    const id = this.blueprintId();
    if (!id) return;

    try {
      await this.blueprintService.loadConfigs(id);
      // TODO: 根据配置填充表单
    } catch (error) {
      // 静默失败，不影响主流程
      console.error('載入配置失敗:', error);
    }
  }

  getFormGroup(tabKey: string): FormGroup {
    switch (tabKey) {
      case 'metadata':
        return this.metadataForm;
      case 'permissions':
        return this.permissionsForm;
      case 'automation':
        return this.automationForm;
      default:
        return this.metadataForm;
    }
  }

  async saveDraft(tabKey: string): Promise<void> {
    this.message.info('草稿功能開發中');
    // TODO: 实现草稿保存
  }

  async saveSettings(tabKey: string): Promise<void> {
    const form = this.getFormGroup(tabKey);
    if (form.invalid) {
      this.message.warning('請填寫必填欄位');
      return;
    }

    this.saving.set(true);
    try {
      const id = this.blueprintId();
      const formValue = form.value;

      // TODO: 根据 tabKey 保存不同的配置
      // await this.blueprintService.setConfig(id, tabKey, formValue);

      this.message.success('設定已儲存');
    } catch (error) {
      this.message.error('儲存失敗');
    } finally {
      this.saving.set(false);
    }
  }

  async quickSave(): Promise<void> {
    // 保存所有表单
    for (const tab of this.settingTabs) {
      const form = this.getFormGroup(tab.key);
      if (form.valid) {
        await this.saveSettings(tab.key);
      }
    }
  }

  viewVersions(): void {
    this.message.info('版本歷史功能開發中');
    // TODO: 实现版本历史查看
  }

  adjustReviewer(reviewer: Reviewer): void {
    this.message.info(`調整 ${reviewer.name} 的功能開發中`);
    // TODO: 实现审核人调整
  }
}
