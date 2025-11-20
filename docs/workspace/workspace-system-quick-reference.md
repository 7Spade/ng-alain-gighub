# 工作區上下文系統 - 快速參考指南

## 📑 目錄

- [🎯 核心概念](#-核心概念)
  - [什麼是工作區上下文？](#什麼是工作區上下文)
  - [為什麼需要自動化？](#為什麼需要自動化)
- [🚀 快速開始](#-快速開始)
  - [1. 在組件中使用](#1-在組件中使用)
  - [2. 在模板中使用](#2-在模板中使用)
- [📚 常見使用模式](#-常見使用模式)
  - [模式 1：藍圖列表頁面](#模式-1藍圖列表頁面)
  - [模式 2：藍圖詳情頁面](#模式-2藍圖詳情頁面)
  - [模式 3：路由守衛](#模式-3路由守衛)
  - [模式 4：視角切換器組件](#模式-4視角切換器組件)
- [🔧 StartupService 設置](#-startupservice-設置)
- [❌ 常見錯誤](#-常見錯誤)
  - [錯誤 1：手動選擇藍圖](#錯誤-1手動選擇藍圖)
  - [錯誤 2：手動載入藍圖](#錯誤-2手動載入藍圖)
  - [錯誤 3：不使用 ReadonlySignal](#錯誤-3不使用-readonlysignal)
  - [錯誤 4：忘記處理 loading 狀態](#錯誤-4忘記處理-loading-狀態)
- [📋 檢查清單](#-檢查清單)
  - [組件層](#組件層)
  - [路由守衛](#路由守衛)
  - [StartupService](#startupservice)
  - [測試](#測試)
- [🎯 最佳實踐總結](#-最佳實踐總結)
- [📚 相關文檔](#-相關文檔)

---


> 📋 **目的**：提供工作區上下文系統的快速參考，包含使用範例和常見模式

**最後更新**：2025-11-20
**相關文檔**：[完整架構審查報告](./工作區上下文系統架構審查.md)

- --

## 🎯 核心概念

### 什麼是工作區上下文？

工作區上下文是系統的**視角切換機制**，允許用戶在不同的工作環境之間切換：

- 🏠 **應用視角（App）**：默認菜單，未選擇任何特定上下文
- 👤 **用戶視角（User）**：個人賬戶，查看個人任務、藍圖、文檔
- 🏢 **組織視角（Organization）**：組織賬戶，管理組織任務、團隊、藍圖
- 👥 **團隊視角（Team）**：團隊工作區，查看團隊任務和協作

### 為什麼需要自動化？

**問題**：用戶每次切換視角都需要手動選擇藍圖、更新菜單
**解決方案**：視角切換時自動載入相關數據，用戶無需手動操作

- --

## 🚀 快速開始

### 1. 在組件中使用

```typescript
import { Component, inject, computed, effect } from '@angular/core';
import { WorkspaceContextFacade } from '@core/facades';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private facade = inject(WorkspaceContextFacade);

  // ✅ 使用 facade 提供的 signals
  readonly contextType = this.facade.contextType;
  readonly contextLabel = this.facade.contextLabel;
  readonly contextBlueprints = this.facade.contextBlueprints;
  readonly loading = this.facade.loadingBlueprints;

  // ✅ 使用 computed 進行數據轉換
  readonly activeBlueprintsCount = computed(() =>
    this.contextBlueprints().filter(b => b.status === 'active').length
  );

  // ✅ 使用 effect 監聽變化
  constructor() {
    effect(() => {
      const type = this.contextType();
      console.log('視角已切換至:', type);
    });
  }

  // ✅ 切換視角
  switchToOrganization(orgId: string): void {
    this.facade.switchToOrganization(orgId);
  }
}
```

### 2. 在模板中使用

```html
<!-- 顯示當前視角 -->
<div class="context-info">
  <span>當前視角: {{ contextLabel() }}</span>
  @if (loading()) {
    <nz-spin nzSimple />
  }
</div>

<!-- 顯示藍圖列表（自動根據視角載入） -->
<div class="blueprints">
  <h3>藍圖列表 ({{ contextBlueprints().length }})</h3>

  @if (contextBlueprints().length === 0) {
    <nz-empty nzNotFoundContent="此視角下沒有藍圖" />
  } @else {
    @for (blueprint of contextBlueprints(); track blueprint.id) {
      <div class="blueprint-card">
        <h4>{{ blueprint.name }}</h4>
        <p>{{ blueprint.description }}</p>
      </div>
    }
  }
</div>

<!-- 視角切換按鈕 -->
<nz-dropdown [nzDropdownMenu]="contextMenu">
  <button nz-button>
    <i nz-icon [nzType]="contextIcon()"></i>
    {{ contextLabel() }}
    <i nz-icon nzType="down"></i>
  </button>
</nz-dropdown>

<nz-dropdown-menu #contextMenu="nzDropdownMenu">
  <ul nz-menu>
    <li nz-menu-item (click)="facade.switchToApp()">
      <i nz-icon nzType="appstore"></i> 應用菜單
    </li>
    <li nz-menu-item (click)="facade.switchToUser()">
      <i nz-icon nzType="user"></i> 個人視角
    </li>
    @for (org of facade.allOrganizations(); track org.id) {
      <li nz-menu-item (click)="facade.switchToOrganization(org.id)">
        <i nz-icon nzType="team"></i> {{ org.name }}
      </li>
    }
  </ul>
</nz-dropdown-menu>
```

- --

## 📚 常見使用模式

### 模式 1：藍圖列表頁面

```typescript
@Component({
  selector: 'app-blueprint-list',
  standalone: true,
  templateUrl: './blueprint-list.component.html'
})
export class BlueprintListComponent {
  private facade = inject(WorkspaceContextFacade);

  // ✅ 直接使用 facade 提供的 blueprints
  readonly blueprints = this.facade.contextBlueprints;
  readonly loading = this.facade.loadingBlueprints;

  // ✅ 使用 computed 進行過濾和排序
  readonly activeBlueprints = computed(() =>
    this.blueprints()
      .filter(b => b.status === 'active')
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  readonly archivedBlueprints = computed(() =>
    this.blueprints().filter(b => b.status === 'archived')
  );

  // ❌ 錯誤：不要手動載入藍圖
  // async loadBlueprints() {
  //   this.blueprints = await this.blueprintService.loadBlueprints();
  // }

  // ❌ 錯誤：不要手動選擇藍圖
  // selectBlueprint(id: string) {
  //   this.selectedBlueprintId = id;
  // }
}
```

### 模式 2：藍圖詳情頁面

```typescript
@Component({
  selector: 'app-blueprint-detail',
  standalone: true,
  templateUrl: './blueprint-detail.component.html'
})
export class BlueprintDetailComponent implements OnInit {
  private facade = inject(WorkspaceContextFacade);
  private route = inject(ActivatedRoute);
  private blueprintService = inject(BlueprintService);

  // 從路由獲取藍圖 ID
  private blueprintId = signal<string | null>(null);

  // 從 contextBlueprints 中找到當前藍圖
  readonly currentBlueprint = computed(() => {
    const id = this.blueprintId();
    return this.facade.contextBlueprints().find(b => b.id === id) || null;
  });

  // 如果 contextBlueprints 中沒有，單獨載入
  readonly blueprintDetail = signal<Blueprint | null>(null);
  readonly loading = signal<boolean>(false);

  ngOnInit(): void {
    // 監聽路由參數
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.blueprintId.set(id);

        // 檢查是否已在 contextBlueprints 中
        const existing = this.currentBlueprint();
        if (!existing) {
          // 沒有找到，單獨載入
          this.loadBlueprintDetail(id);
        }
      }
    });
  }

  private async loadBlueprintDetail(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const blueprint = await this.blueprintService.loadBlueprintById(id);
      this.blueprintDetail.set(blueprint);
    } catch (error) {
      console.error('載入藍圖詳情失敗:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
```

### 模式 3：路由守衛

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { WorkspaceContextFacade } from '@core/facades';

export const blueprintGuard: CanActivateFn = (route, state) => {
  const facade = inject(WorkspaceContextFacade);
  const router = inject(Router);

  // 檢查當前視角是否有藍圖
  const blueprints = facade.contextBlueprints();
  const contextType = facade.contextType();

  // 如果是應用視角，不需要藍圖
  if (contextType === 'app') {
    return true;
  }

  // 如果正在載入，等待
  if (facade.loadingBlueprints()) {
    // 可以顯示 loading indicator
    return true;
  }

  // 如果沒有藍圖，重定向到創建頁面
  if (blueprints.length === 0) {
    return router.createUrlTree(['/blueprints/create']);
  }

  return true;
};

// 使用守衛
export const routes: Routes = [
  {
    path: 'blueprints',
    canActivate: [blueprintGuard],
    children: [
      { path: '', component: BlueprintListComponent },
      { path: 'create', component: BlueprintCreateComponent },
      { path: ':id', component: BlueprintDetailComponent }
    ]
  }
];
```

### 模式 4：視角切換器組件

```typescript
@Component({
  selector: 'app-context-switcher',
  standalone: true,
  template: `
    <nz-dropdown [nzDropdownMenu]="menu" nzPlacement="bottomRight">
      <button nz-button nzType="text" class="context-switcher">
        <nz-avatar
          [nzIcon]="contextIcon()"
          [nzSrc]="contextAvatar()"
          nzSize="small"
        />
        <span class="context-label">{{ contextLabel() }}</span>
        <i nz-icon nzType="down"></i>
      </button>
    </nz-dropdown>

    <nz-dropdown-menu #menu="nzDropdownMenu">
      <ul nz-menu>
        <!-- 應用視角 -->
        <li nz-menu-item (click)="switchToApp()">
          <i nz-icon nzType="appstore"></i>
          應用菜單
        </li>

        <nz-divider nzText="個人"></nz-divider>

        <!-- 用戶視角 -->
        @if (currentUserAccount()) {
          <li nz-menu-item (click)="switchToUser()">
            <i nz-icon nzType="user"></i>
            {{ currentUserAccount()?.name || '個人視角' }}
          </li>
        }

        <nz-divider nzText="組織"></nz-divider>

        <!-- 組織列表 -->
        @for (org of allOrganizations(); track org.id) {
          <li nz-menu-item (click)="switchToOrganization(org.id)">
            <i nz-icon nzType="team"></i>
            {{ org.name }}
            @if (contextType() === 'organization' && contextId() === org.id) {
              <i nz-icon nzType="check" class="selected-icon"></i>
            }
          </li>
        }

        @if (allOrganizations().length === 0) {
          <li nz-menu-item nzDisabled>
            <span class="text-muted">沒有組織</span>
          </li>
        }

        <!-- 團隊列表（按組織分組） -->
        @for (org of allOrganizations(); track org.id) {
          @if (teamsByOrganization().get(org.id)?.length) {
            <nz-divider [nzText]="org.name + ' 的團隊'"></nz-divider>

            @for (team of teamsByOrganization().get(org.id); track team.id) {
              <li nz-menu-item (click)="switchToTeam(team.id)">
                <i nz-icon nzType="usergroup-add"></i>
                {{ team.name }}
                @if (contextType() === 'team' && contextId() === team.id) {
                  <i nz-icon nzType="check" class="selected-icon"></i>
                }
              </li>
            }
          }
        }
      </ul>
    </nz-dropdown-menu>
  `,
  styles: [`
    .context-switcher {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .context-label {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .selected-icon {
      margin-left: auto;
      color: #52c41a;
    }

    .text-muted {
      color: #8c8c8c;
    }
  `]
})
export class ContextSwitcherComponent {
  private facade = inject(WorkspaceContextFacade);

  // 暴露 facade 狀態
  readonly contextType = this.facade.contextType;
  readonly contextId = this.facade.contextId;
  readonly contextLabel = this.facade.contextLabel;
  readonly contextIcon = this.facade.contextIcon;
  readonly contextAvatar = this.facade.contextAvatar;

  readonly currentUserAccount = this.facade.currentUserAccount;
  readonly allOrganizations = this.facade.allOrganizations;
  readonly teamsByOrganization = this.facade.teamsByOrganization;

  // 切換方法
  switchToApp(): void {
    this.facade.switchToApp();
  }

  switchToUser(): void {
    this.facade.switchToUser();
  }

  switchToOrganization(orgId: string): void {
    this.facade.switchToOrganization(orgId);
  }

  switchToTeam(teamId: string): void {
    this.facade.switchToTeam(teamId);
  }
}
```

- --

## 🔧 StartupService 設置

```typescript
import { Injectable, inject } from '@angular/core';
import { WorkspaceContextFacade } from '@core/facades';
import { DA_SERVICE_TOKEN } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  private facade = inject(WorkspaceContextFacade);
  private tokenService = inject(DA_SERVICE_TOKEN);

  async load(): Promise<void> {
    try {
      // 1. Supabase 認證（如果需要）
      // await this.supabaseService.initialize();

      // 2. 載入菜單數據
      const [appMenu, userMenu, orgMenu, teamMenu] = await Promise.all([
        this.loadAppMenu(),
        this.loadUserMenu(),
        this.loadOrganizationMenu(),
        this.loadTeamMenu()
      ]);

      // 3. 初始化菜單數據（重要：在 loadWorkspaceData 之前）
      this.facade.initializeMenuData({
        appMenu,
        userMenu,
        organizationMenu: orgMenu,
        teamMenu
      });

      // 4. 載入工作區數據
      const token = this.tokenService.get();
      if (token?.user?.id) {
        await this.facade.loadWorkspaceData(token.user.id);
      }

      // 5. 上下文恢復（已自動化，通過 Facade 的 Effect 處理）
      // 不需要手動調用 facade.restoreContext()

    } catch (error) {
      console.error('[StartupService] 初始化失敗:', error);
      throw error;
    }
  }

  private async loadAppMenu(): Promise<any[]> {
    // 載入應用菜單（從 assets 或 API）
    const response = await fetch('/assets/tmp/app-data.json');
    const data = await response.json();
    return data.menu;
  }

  private async loadUserMenu(): Promise<any[]> {
    const response = await fetch('/assets/tmp/user-data.json');
    const data = await response.json();
    return data.menu;
  }

  private async loadOrganizationMenu(): Promise<any[]> {
    const response = await fetch('/assets/tmp/organization-data.json');
    const data = await response.json();
    return data.menu;
  }

  private async loadTeamMenu(): Promise<any[]> {
    const response = await fetch('/assets/tmp/team-data.json');
    const data = await response.json();
    return data.menu;
  }
}
```

- --

## ❌ 常見錯誤

### 錯誤 1：手動選擇藍圖

```typescript
// ❌ 錯誤
export class BlueprintListComponent {
  selectedBlueprintId = signal<string | null>(null);

  selectBlueprint(id: string): void {
    this.selectedBlueprintId.set(id);
  }
}
```

**問題**：用戶需要手動選擇藍圖，增加操作步驟
**解決方案**：直接使用 `facade.contextBlueprints()`，根據視角自動載入

```typescript
// ✅ 正確
export class BlueprintListComponent {
  private facade = inject(WorkspaceContextFacade);

  // 直接使用 facade 提供的藍圖列表
  readonly blueprints = this.facade.contextBlueprints;
}
```

### 錯誤 2：手動載入藍圖

```typescript
// ❌ 錯誤
export class DashboardComponent implements OnInit {
  blueprints = signal<Blueprint[]>([]);

  async ngOnInit(): Promise<void> {
    // 手動載入藍圖
    const contextType = this.facade.contextType();
    if (contextType === 'organization') {
      const orgId = this.facade.contextId();
      const blueprints = await this.blueprintService.loadByOrganization(orgId);
      this.blueprints.set(blueprints);
    }
  }
}
```

**問題**：重複實現藍圖載入邏輯，且不會自動更新
**解決方案**：直接使用 `facade.contextBlueprints()`

```typescript
// ✅ 正確
export class DashboardComponent {
  private facade = inject(WorkspaceContextFacade);

  // 直接使用 facade 提供的藍圖列表（自動更新）
  readonly blueprints = this.facade.contextBlueprints;
}
```

### 錯誤 3：不使用 ReadonlySignal

```typescript
// ❌ 錯誤
export class MyComponent {
  private facade = inject(WorkspaceContextFacade);

  // 直接修改 signal（不應該這樣做）
  modifyBlueprints(): void {
    this.facade.contextBlueprints.set([]);  // ❌ 錯誤！
  }
}
```

**問題**：`contextBlueprints` 是 `ReadonlySignal`，不應該被外部修改
**解決方案**：只讀取，不修改

```typescript
// ✅ 正確
export class MyComponent {
  private facade = inject(WorkspaceContextFacade);

  // 只讀取，不修改
  readonly blueprints = this.facade.contextBlueprints;

  // 使用 computed 進行數據轉換
  readonly filteredBlueprints = computed(() =>
    this.blueprints().filter(b => b.status === 'active')
  );
}
```

### 錯誤 4：忘記處理 loading 狀態

```typescript
// ❌ 錯誤
<div class="blueprints">
  @for (blueprint of blueprints(); track blueprint.id) {
    <div>{{ blueprint.name }}</div>
  }
</div>
```

**問題**：不顯示 loading 狀態，用戶體驗差
**解決方案**：檢查 loading 狀態

```typescript
// ✅ 正確
<div class="blueprints">
  @if (loading()) {
    <nz-spin nzSimple />
  } @else if (blueprints().length === 0) {
    <nz-empty nzNotFoundContent="沒有藍圖" />
  } @else {
    @for (blueprint of blueprints(); track blueprint.id) {
      <div>{{ blueprint.name }}</div>
    }
  }
</div>
```

- --

## 📋 檢查清單

使用此清單確保正確使用工作區上下文系統：

### 組件層
- [ ] 使用 `inject(WorkspaceContextFacade)` 注入 Facade
- [ ] 使用 `facade.contextBlueprints()` 而不是手動載入
- [ ] 使用 `computed()` 進行數據轉換和過濾
- [ ] 使用 `effect()` 監聽上下文變化（如果需要）
- [ ] 檢查 `facade.loadingBlueprints()` 顯示 loading 狀態
- [ ] 處理空狀態（`blueprints().length === 0`）
- [ ] 移除任何"選擇藍圖"的 UI 元素

### 路由守衛
- [ ] 檢查 `facade.loadingBlueprints()` 等待載入完成
- [ ] 根據 `facade.contextType()` 判斷是否需要藍圖
- [ ] 根據 `facade.contextBlueprints().length` 決定是否允許訪問

### StartupService
- [ ] 載入菜單數據（app、user、org、team）
- [ ] 調用 `facade.initializeMenuData()` 初始化菜單
- [ ] 調用 `facade.loadWorkspaceData()` 載入工作區數據
- [ ] **不要**手動調用 `facade.restoreContext()`（已自動化）

### 測試
- [ ] 測試視角切換後藍圖自動載入
- [ ] 測試菜單自動切換
- [ ] 測試動態 ID 替換（:id、:userId）
- [ ] 測試頁面重載後上下文恢復
- [ ] 測試 loading 狀態顯示

- --

## 🎯 最佳實踐總結

1. ✅ **使用 Facade**：所有上下文操作通過 `WorkspaceContextFacade`
2. ✅ **使用 Signals**：利用 Angular Signals 的響應式特性
3. ✅ **使用 Computed**：數據轉換使用 `computed()`
4. ✅ **使用 Effects**：副作用處理使用 `effect()`
5. ✅ **檢查 Loading**：始終檢查 `loadingBlueprints()` 狀態
6. ✅ **處理空狀態**：藍圖列表為空時顯示提示
7. ✅ **不要手動載入**：不要手動調用 `blueprintService.load*()`
8. ✅ **不要手動選擇**：不要實現藍圖選擇功能
9. ✅ **信任自動化**：視角切換後自動載入藍圖，無需手動操作

- --

## 📚 相關文檔

- [完整架構審查報告](./工作區上下文系統架構審查.md) - 詳細的五層架構審查
- [系統架構思維導圖](./architecture/01-system-architecture-mindmap.mermaid.md) - 系統整體架構
- [開發作業指引](./guides/pre-development-checklist.md) - 開發規範
- [Angular 20 最佳實踐](../.cursor/rules/angular.mdc) - Angular 規範
- [Signals 狀態管理](../.cursor/rules/modern-angular.mdc) - 現代化 Angular

- --

**更新日期：** 2025-11-20
**維護者：** 開發團隊
**版本：** v2.0
