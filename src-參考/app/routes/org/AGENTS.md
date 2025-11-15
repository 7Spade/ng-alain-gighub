# Organization Routes 開發指南

> 🤖 **AI Agent 提醒**: 每次開發都要清除冗餘並更新 memory.json（含去重）

## 📋 職責範圍

`routes/org` 提供組織管理功能：
- `overview/` - 組織概覽
- `members/` - 成員管理
- `teams/` - 團隊管理
- `settings/` - 組織設定

> 📖 **通用規範**參見 [Routes AGENTS.md](../AGENTS.md)

## 🎯 功能模組

- `overview/` - 組織概覽頁面
- `members/` - 成員管理頁面（列表、添加、移除）
- `teams/` - 團隊管理頁面（列表、建立、編輯）
- `settings/` - 組織設定頁面（基本資訊、權限等）

## 📝 組件設計

```typescript
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS], // 優先使用 SHARED_IMPORTS
  providers: [OrganizationService] // 僅在必要時提供服務
})
export class OrganizationMembersComponent {
  private readonly #orgService = inject(OrganizationService);
  private readonly #router = inject(Router);
  
  readonly loading = signal(false);
  readonly members = signal<Member[]>([]);
  
  // 使用現代控制流程
  // @if @for @switch
}
```

## 🔗 依賴關係

### 允許的依賴
- ✅ 可以依賴 `core/organization`、`core/team` 服務
- ✅ 可以依賴 `shared/` 組件
- ✅ 可以使用 `SHARED_IMPORTS`
- ✅ 可以使用 `shared/models` 中的模型

### 禁止的依賴
- ❌ 不應直接依賴 Infrastructure/Supabase
- ❌ 不應直接使用資料庫查詢

## 🛡️ 強制規範

- **SHARED_IMPORTS**: 優先使用 `SHARED_IMPORTS`，避免零碎引入
- **Standalone Components**: 優先使用 Standalone Components
- **Signal-based State**: 使用 Signal 管理組件狀態
- **現代控制流程**: 使用 `@if`、`@for`、`@switch`
- **ChangeDetectionStrategy.OnPush**: 頁面預設使用 OnPush

## ✅ 工作準則

### Do
- 使用 Standalone Components
- 使用 `inject()` 替代 constructor injection
- 使用 Signal-based 狀態管理
- 使用 `SHARED_IMPORTS` 統一導入
- 使用現代控制流程
- 頁面預設使用 `ChangeDetectionStrategy.OnPush`
- 提供 `route.data.title`

### Don't
- 不直接依賴 Infrastructure/Supabase
- 不引入零碎模組，優先使用 `SHARED_IMPORTS`
- 不在變更檢查期間直接改動 signal/狀態
- 不進行「權宜式/懶惰式」修改

## 💡 代碼示例

### Organization 組件設計示例

```typescript
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { OrganizationService } from '@core/account/organization/organization.service';

@Component({
  standalone: true,
  selector: 'app-organization-members',
  imports: [SHARED_IMPORTS], // ✅ 優先使用
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-page-header [nzTitle]="'成員管理'">
      <nz-page-header-extra>
        <button nz-button nzType="primary" (click)="handleAddMember()">
          添加成員
        </button>
      </nz-page-header-extra>
    </nz-page-header>
    
    <nz-card>
      @if (loading()) {
        <nz-spin></nz-spin>
      } @else {
        <nz-table [nzData]="members()">
          <thead>
            <tr>
              <th>姓名</th>
              <th>角色</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            @for (member of members(); track member.id) {
              <tr>
                <td>{{ member.name }}</td>
                <td>{{ member.role }}</td>
                <td>
                  <nz-tag [nzColor]="member.active ? 'green' : 'default'">
                    {{ member.active ? '活躍' : '非活躍' }}
                  </nz-tag>
                </td>
                <td>
                  <button nz-button nzType="link" (click)="handleRemove(member)">
                    移除
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td [nzSpan]="4" class="text-center">
                  <nz-empty></nz-empty>
                </td>
              </tr>
            }
          </tbody>
        </nz-table>
      }
    </nz-card>
  `
})
export class OrganizationMembersComponent {
  private readonly #orgService = inject(OrganizationService);
  
  readonly loading = signal(false);
  readonly members = signal<Member[]>([]);
  
  async loadMembers() {
    this.loading.set(true);
    try {
      const data = await this.#orgService.getMembers();
      this.members.set(data);
    } finally {
      this.loading.set(false);
    }
  }
  
  handleAddMember() {
    // 打開添加成員對話框
  }
  
  handleRemove(member: Member) {
    // 移除成員邏輯
  }
}
```

## 📚 相關文檔

### 核心文檔
- [Routes AGENTS.md](../AGENTS.md) - 路由層規範
- [App 目錄 AGENTS.md](../../AGENTS.md) - 應用層規範
- [專案根目錄 AGENTS.md](../../../AGENTS.md) - 完整開發規範

### 專案文檔
- [文檔索引](../../../docs/README.md) - 完整文檔導航
- [SHARED_IMPORTS 使用指南](../../../docs/45-SHARED_IMPORTS-使用指南.md) - ⭐ 必讀
- [開發作業指引](../../../docs/00-開發作業指引.md) - 開發規範
- [帳戶層流程圖](../../../docs/13-帳戶層流程圖.mermaid.md) - 帳戶層架構

---

**最後更新**：2025-11-13  
**維護者**：開發團隊


